import type { SupabaseClient } from "@supabase/supabase-js";

import { type PlanId, dailyLimitForPlan } from "../plans";

/**
 * Pro/Pro+ access in `getEffectivePlanId` only for these Stripe subscription statuses.
 * All others (e.g. canceled, incomplete, past_due, unpaid) fall back to free.
 * Keep in sync with `ACTIVE_PLAN_STATUSES` in `app/api/stripe/webhook/route.ts`.
 */
const ACTIVE_SUBSCRIPTION = new Set(["active", "trialing"]);

export type PlanAccess = {
  plan: PlanId;
  dailyLimit: number;
  hasFullHistory: boolean;
};

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
 * Effective product plan from `public.subscriptions` (active or trialing only).
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
  if (planRow === "pro_plus" || planRow === "proplus") return "pro_plus";
  return "free";
}

/**
 * Plan entitlements: daily interaction cap and history scope (Pro / Pro+ get full list access on API + UI).
 */
export async function getPlanAccess(
  supabase: SupabaseClient,
  userId: string | null
): Promise<PlanAccess> {
  const plan = await getEffectivePlanId(supabase, userId);
  return {
    plan,
    dailyLimit: dailyLimitForPlan(plan),
    hasFullHistory: plan === "pro" || plan === "pro_plus",
  };
}

export async function getPlanAccessForRequest(
  supabase: SupabaseClient,
  authorizationHeader: string | null
): Promise<PlanAccess> {
  const userId = await getUserIdFromAuthorization(
    supabase,
    authorizationHeader
  );
  return getPlanAccess(supabase, userId);
}

export async function getDailyLimitForClarifyRequest(
  supabase: SupabaseClient,
  authorizationHeader: string | null
): Promise<number> {
  const { dailyLimit } = await getPlanAccessForRequest(
    supabase,
    authorizationHeader
  );
  return dailyLimit;
}
