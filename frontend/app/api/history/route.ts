import { NextRequest, NextResponse } from "next/server";
import {
  normalizeMessageContentToPreviewSource,
  truncateHistoryPreview,
} from "../../../lib/historyReadHelpers";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistoryConversation = {
  id: string;
  mode: string;
  created_at: string;
  preview: string;
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const anonymousId = req.headers.get("x-anonymous-id")?.trim();
  if (!anonymousId) {
    return NextResponse.json({ conversations: [] as HistoryConversation[] });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("anonymous_id", anonymousId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data) {
      return NextResponse.json({ conversations: [] as HistoryConversation[] });
    }

    const ids = data.map((row) => String(row.id));
    const previewById = new Map<string, string>();

    if (ids.length > 0) {
      const { data: userRows, error: userErr } = await supabase
        .from("messages")
        .select("conversation_id, content, created_at")
        .in("conversation_id", ids)
        .eq("role", "user")
        .order("created_at", { ascending: true });

      if (!userErr && userRows) {
        for (const row of userRows) {
          const cid = String((row as { conversation_id: string }).conversation_id);
          if (previewById.has(cid)) continue;
          const raw = (row as { content: unknown }).content;
          const source = normalizeMessageContentToPreviewSource(raw);
          previewById.set(cid, truncateHistoryPreview(source, 60));
        }
      }
    }

    const conversations: HistoryConversation[] = data.map((row) => {
      const id = String(row.id);
      return {
        id,
        mode: String(row.source ?? row.mode ?? "unknown"),
        created_at: String(row.created_at),
        preview: previewById.get(id) ?? "",
      };
    });

    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ conversations: [] as HistoryConversation[] });
  }
}
