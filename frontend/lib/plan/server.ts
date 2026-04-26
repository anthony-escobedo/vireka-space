import type { SupabaseClient } from "@supabase/supabase-js";

import { type PlanId, dailyLimitForPlan, PRO_PLUS_ENFORCED } from "../plans";

const ACTIVE_SUBSCRIPTION = new Set(["active", "trialing"]);

/**
 * Resolves the signed-in user id from an optional `Authorization: Bearer <access_token>` header.
 * Uses the same Supabase project as the service-role client.
 */
export async function getUserIdFromAuthorization(
  supabase: SupabaseClient,
  authorizationHeader: string | null
): Promise<string | null> {
  if (!authorizationHeader) return null;
  const m = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  if (!m?.[1]) return null;
  const token = m[1].trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

/**
 * Effective plan for entitlements, using `public.subscriptions` (see `supabase/schema.sql`).
 * pro_plus in DB: Pro-level limits (50/day) when PRO_PLUS_ENFORCED is off; 100/day when on.
 */
export async function getEffectivePlanId(
  supabase: SupabaseClient,
  userId: string | null
): Promise<PlanId> {
  if (!userId) return "free";

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error?.message) {
      console.warn("[plan] subscriptions read:", error.message);
    }
    return "free";
  }

  const status = String((data as { status: string }).status).toLowerCase();
  if (!ACTIVE_SUBSCRIPTION.has(status)) return "free";

  const planRow = String((data as { plan: string }).plan)
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (planRow === "pro") return "pro";
  if (planRow === "pro_plus" || planRow === "proplus") {
    return PRO_PLUS_ENFORCED ? "pro_plus" : "pro";
  }
  return "free";
}

export async function getDailyLimitForClarifyRequest(
  supabase: SupabaseClient,
  authorizationHeader: string | null
): Promise<number> {
  const userId = await getUserIdFromAuthorization(supabase, authorizationHeader);
  const plan = await getEffectivePlanId(supabase, userId);
  return dailyLimitForPlan(plan);
}
