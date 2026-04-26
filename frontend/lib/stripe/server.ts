/**
 * Stripe (server only).
 * Required for checkout: STRIPE_SECRET_KEY, STRIPE_PRO_PRICE_ID, NEXT_PUBLIC_APP_URL
 * Webhook: STRIPE_WEBHOOK_SECRET
 */
import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripe) {
    stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return stripe;
}

/**
 * Public site URL (no trailing slash), used for Checkout redirect targets.
 * Set `NEXT_PUBLIC_APP_URL` in production (e.g. https://vireka.space).
 */
export function getAppBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw?.trim()) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }
  return raw.replace(/\/$/, "");
}
