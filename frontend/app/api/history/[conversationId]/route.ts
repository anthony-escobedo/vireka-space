import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ConversationRow = {
  id: string;
  source?: string | null;
  mode?: string | null;
  created_at: string;
};

type MessageRow = {
  id: string;
  role: string;
  content: unknown;
  created_at: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
): Promise<NextResponse> {
  const anonymousId = req.headers.get("x-anonymous-id")?.trim();
  if (!anonymousId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = params.conversationId?.trim();
  if (!conversationId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .select("id, source, mode, created_at")
      .eq("id", conversationId)
      .eq("anonymous_id", anonymousId)
      .maybeSingle();

    if (convError || !conv) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const c = conv as ConversationRow;

    const { data: msgData, error: msgError } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (msgError || !msgData) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const messages = (msgData as MessageRow[]).map((row) => ({
      id: String(row.id),
      role: row.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: row.content,
      created_at: String(row.created_at),
    }));

    return NextResponse.json({
      conversation: {
        id: String(c.id),
        mode: String(c.source ?? c.mode ?? "unknown"),
        created_at: String(c.created_at),
      },
      messages,
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
