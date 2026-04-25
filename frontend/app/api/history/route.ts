export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
normalizeMessageContentToPreviewSource,
truncateHistoryPreview,
} from "../../../lib/historyReadHelpers";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export const runtime = "nodejs";

const NO_STORE_HEADERS = {
"Cache-Control": "no-store, max-age=0, must-revalidate",
};

type HistoryConversation = {
id: string;
mode: string;
created_at: string;
preview: string;
};

export async function GET(req: NextRequest): Promise<NextResponse> {
console.log("HISTORY ROUTE HIT v2");
console.log("NEW HISTORY CODE ACTIVE 06714ac");
const headerAnonymousId = req.headers.get("x-anonymous-id")?.trim();
const queryAnonymousId = req.nextUrl.searchParams.get("anonymousId")?.trim();
const anonymousId = headerAnonymousId || queryAnonymousId;
console.log("[history API identity]", { anonymousId });
console.log("[history anonymous id]", {
  anonymousId,
  headerAnonymousId,
  queryAnonymousId,
});

if (!anonymousId) {
return NextResponse.json(
{ conversations: [] as HistoryConversation[] },
{ headers: NO_STORE_HEADERS }
);
}

try {
const supabase = getSupabaseServerClient();

const { data: latestRawConversations } = await supabase
  .from("conversations")
  .select("id, anonymous_id, mode, source, created_at")
  .order("created_at", { ascending: false })
  .limit(5);
console.log("[api/history] latest raw conversations", latestRawConversations);
console.log(
  "[api/history] comparing anonymous ids",
  latestRawConversations?.map((row) => ({
    requestedAnonymousId: anonymousId,
    rowAnonymousId: row.anonymous_id,
    matches: row.anonymous_id === anonymousId,
  }))
);

const { data: conversationRows, error: conversationsError } = await supabase
  .from("conversations")
  .select("id, anonymous_id, mode, source, created_at")
  .eq("anonymous_id", anonymousId)
  .order("created_at", { ascending: false })
  .limit(20);
console.log("[api/history] newest conversation from DB:", conversationRows?.[0] ?? null);

if (conversationsError || !conversationRows) {
  return NextResponse.json(
    { conversations: [] as HistoryConversation[] },
    { headers: NO_STORE_HEADERS }
  );
}

console.log("[api/history] conversation rows count:", conversationRows.length);

const conversationIds = conversationRows.map((row) => String(row.id));
console.log("[api/history] conversation ids count:", conversationIds.length);

const latestUserMessageByConversationId = new Map<string, { content: unknown; created_at: string }>();

if (conversationIds.length > 0) {
  const { data: userMessages, error: messagesError } = await supabase
    .from("messages")
    .select("conversation_id, content, created_at")
    .in("conversation_id", conversationIds)
    .eq("role", "user")
    .order("created_at", { ascending: false });

  if (messagesError || !userMessages) {
    return NextResponse.json(
      { conversations: [] as HistoryConversation[] },
      { headers: NO_STORE_HEADERS }
    );
  }

  console.log("[api/history] user messages count:", userMessages.length);

  for (const row of userMessages) {
    const conversationId = String((row as { conversation_id: string }).conversation_id);
    if (latestUserMessageByConversationId.has(conversationId)) continue;
    latestUserMessageByConversationId.set(conversationId, {
      content: (row as { content: unknown }).content,
      created_at: String((row as { created_at: string }).created_at),
    });
  }
}

console.log("[api/history] anonymousId:", anonymousId);
console.log("[api/history] final conversations count:", conversationRows.length);
console.log(
  "[api/history] conversation ids:",
  conversationRows.map((row) => row.id)
);

const conversations: HistoryConversation[] = conversationRows.map((row) => {
  const id = String(row.id);
  const latestUserMessage = latestUserMessageByConversationId.get(id);

  return {
    id,
    mode: String(row.source ?? row.mode ?? "unknown"),
    created_at: String(row.created_at),
    preview: latestUserMessage
      ? truncateHistoryPreview(
        normalizeMessageContentToPreviewSource(latestUserMessage.content),
        60
      )
      : "",
  };
});

console.log("[api/history] final conversations:", conversations.length);
console.log("[api/history] first conversation timestamp:", conversations[0]?.created_at ?? null);
console.log("[api/history] first preview:", conversations[0]?.preview ?? null);
console.log(
  "[api/history] previews:",
  conversations.map((c) => ({
    id: c.id,
    preview: c.preview,
  }))
);

return NextResponse.json({ conversations }, { headers: NO_STORE_HEADERS });


} catch {
return NextResponse.json(
{ conversations: [] as HistoryConversation[] },
{ headers: NO_STORE_HEADERS }
);
}
}
