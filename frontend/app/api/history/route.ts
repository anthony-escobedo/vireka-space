import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistoryConversation = {
  id: string;
  mode: string;
  created_at: string;
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

    const conversations: HistoryConversation[] = data.map((row) => ({
      id: String(row.id),
      mode: String(row.source ?? row.mode ?? "unknown"),
      created_at: String(row.created_at),
    }));

    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ conversations: [] as HistoryConversation[] });
  }
}
