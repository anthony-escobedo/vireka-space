import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ConversationRow = {
  id: string;
  source?: string | null;
  mode?: string | null;
  created_at: string;
  marked_clarity?: string | null;
  marked_clarity_at?: string | null;
};

type MarkedClarityPatchBody = {
  markedClarity?: string | null;
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
      .select("id, source, mode, created_at, marked_clarity, marked_clarity_at")
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

    const marked = typeof c.marked_clarity === "string" && c.marked_clarity.trim()
      ? c.marked_clarity.trim()
      : null;

    return NextResponse.json({
      conversation: {
        id: String(c.id),
        mode: String(c.source ?? c.mode ?? "unknown"),
        created_at: String(c.created_at),
        markedClarity: marked,
        markedClarityAt:
          c.marked_clarity_at != null && String(c.marked_clarity_at)
            ? String(c.marked_clarity_at)
            : null,
      },
      messages,
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PATCH(
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

  let body: MarkedClarityPatchBody;
  try {
    body = (await req.json()) as MarkedClarityPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!("markedClarity" in body)) {
    return NextResponse.json(
      { error: "expected markedClarity in body" },
      { status: 400 }
    );
  }

  const value =
    body.markedClarity == null
      ? null
      : typeof body.markedClarity === "string"
        ? body.markedClarity.trim() || null
        : null;

  try {
    const supabase = getSupabaseServerClient();

    const { data: row, error: readError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("anonymous_id", anonymousId)
      .maybeSingle();

    if (readError || !row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        marked_clarity: value,
        marked_clarity_at: value ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId)
      .eq("anonymous_id", anonymousId);

    if (updateError) {
      console.error("[history] marked clarity update failed", updateError);
      return NextResponse.json(
        { error: "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, markedClarity: value });
  } catch (e) {
    console.error("[history] marked clarity patch", e);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { conversationId: string } }
): Promise<NextResponse> {
  const anonymousId = _req.headers.get("x-anonymous-id")?.trim();
  if (!anonymousId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = params.conversationId?.trim();
  if (!conversationId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data: row, error: readError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("anonymous_id", anonymousId)
      .maybeSingle();

    if (readError || !row) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    const { error: delError } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId)
      .eq("anonymous_id", anonymousId);

    if (delError) {
      console.error("[history] delete conversation failed", delError);
      return NextResponse.json(
        { error: "Delete failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[history] delete conversation", e);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
