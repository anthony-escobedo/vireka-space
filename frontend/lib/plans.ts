/**
 * Central plan config. Tiers and daily interaction limits for API enforcement.
 * Pro+ is defined for product continuity but is not purchasable in UI yet; see `PRO_PLUS_ENFORCED`.
 */
export type PlanId = "free" | "pro" | "pro_plus";

export const PLAN_DAILY_LIMITS: Record<PlanId, number> = {
  free: 10,
  pro: 50,
  pro_plus: 100,
};

/**
 * Pro+ is not purchasable yet. When set true, `getEffectivePlanId` may return `pro_plus` from DB
 * and daily limits can use `PLAN_DAILY_LIMITS.pro_plus`.
 */
export const PRO_PLUS_ENFORCED = false;

export function dailyLimitForPlan(plan: PlanId): number {
  return PLAN_DAILY_LIMITS[plan];
}
