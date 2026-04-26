export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  normalizeMessageContentToPreviewSource,
  truncateHistoryPreview,
} from "../../../lib/historyReadHelpers";
import {
  getPlanAccess,
  getUserIdFromAuthorization,
} from "../../../lib/plan/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
};

const FREE_HISTORY_PAGE_SIZE = 20;
const PAID_HISTORY_PAGE_SIZE = 500;

type HistoryConversation = {
  id: string;
  mode: string;
  created_at: string;
  preview: string;
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const headerAnonymousId = req.headers.get("x-anonymous-id")?.trim();
  const queryAnonymousId = req.nextUrl.searchParams.get("anonymousId")?.trim();
  const anonymousId = headerAnonymousId || queryAnonymousId;

  if (!anonymousId) {
    return NextResponse.json(
      {
        conversations: [] as HistoryConversation[],
        hasFullHistory: false,
      },
      { headers: NO_STORE_HEADERS }
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const authHeader = req.headers.get("authorization");
    const userId = await getUserIdFromAuthorization(supabase, authHeader);
    const { hasFullHistory } = await getPlanAccess(supabase, userId);
    const listLimit = hasFullHistory
      ? PAID_HISTORY_PAGE_SIZE
      : FREE_HISTORY_PAGE_SIZE;

    const { data: conversationRows, error: conversationsError } = await supabase
      .from("conversations")
      .select("id, anonymous_id, mode, source, created_at")
      .eq("anonymous_id", anonymousId)
      .order("created_at", { ascending: false })
      .limit(listLimit);

    if (conversationsError || !conversationRows) {
      return NextResponse.json(
        {
          conversations: [] as HistoryConversation[],
          hasFullHistory: false,
        },
        { headers: NO_STORE_HEADERS }
      );
    }

    const conversationIds = conversationRows.map((row) => String(row.id));

    const latestMessageByConversationId = new Map<
      string,
      { content: unknown; created_at: string }
    >();

    if (conversationIds.length > 0) {
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("conversation_id, content, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false });

      if (messagesError || !messages) {
        return NextResponse.json(
          {
            conversations: [] as HistoryConversation[],
            hasFullHistory: false,
          },
          { headers: NO_STORE_HEADERS }
        );
      }

      for (const row of messages) {
        const conversationId = String(
          (row as { conversation_id: string }).conversation_id
        );
        if (latestMessageByConversationId.has(conversationId)) continue;
        latestMessageByConversationId.set(conversationId, {
          content: (row as { content: unknown }).content,
          created_at: String((row as { created_at: string }).created_at),
        });
      }
    }

    const conversations: HistoryConversation[] = conversationRows.map(
      (row) => {
        const id = String(row.id);
        const latestMessage = latestMessageByConversationId.get(id);

        return {
          id,
          mode: String(row.source ?? row.mode ?? "unknown"),
          created_at: String(row.created_at),
          preview: latestMessage
            ? truncateHistoryPreview(
                normalizeMessageContentToPreviewSource(latestMessage.content),
                60
              )
            : "",
        };
      }
    );

    return NextResponse.json(
      { conversations, hasFullHistory },
      { headers: NO_STORE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      {
        conversations: [] as HistoryConversation[],
        hasFullHistory: false,
      },
      { headers: NO_STORE_HEADERS }
    );
  }
}
