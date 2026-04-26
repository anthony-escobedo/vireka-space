import { NextRequest, NextResponse } from "next/server";
import {
  getPlanAccess,
  getUserIdFromAuthorization,
} from "../../../../lib/plan/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET plan entitlements for the signed-in user.
 * Requires `Authorization: Bearer <access_token>`.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const userId = await getUserIdFromAuthorization(
      supabase,
      req.headers.get("authorization")
    );
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getPlanAccess(supabase, userId);

    const { data: subRow } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const rawStatus = subRow
      ? String((subRow as { status: string }).status)
      : undefined;

    return NextResponse.json({
      plan: access.plan,
      dailyLimit: access.dailyLimit,
      hasFullHistory: access.hasFullHistory,
      ...(rawStatus !== undefined ? { status: rawStatus } : {}),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[api/plan/status]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
