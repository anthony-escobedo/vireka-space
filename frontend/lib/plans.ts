/**
 * Central plan config. Tiers and daily interaction limits for API enforcement.
 */
export type PlanId = "free" | "pro" | "pro_plus";

export const PLAN_DAILY_LIMITS: Record<PlanId, number> = {
  free: 10,
  pro: 50,
  pro_plus: 100,
};

export function dailyLimitForPlan(plan: PlanId): number {
  return PLAN_DAILY_LIMITS[plan];
}
