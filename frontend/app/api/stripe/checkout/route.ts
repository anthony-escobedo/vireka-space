import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromAuthorization } from "../../../../lib/plan/server";
import { getAppBaseUrl, getStripe } from "../../../../lib/stripe/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Pro subscription checkout. Requires `Authorization: Bearer` with a valid session.
 * Env: `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `NEXT_PUBLIC_APP_URL`.
 */
export async function POST(req: NextRequest) {
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!process.env.STRIPE_SECRET_KEY || !priceId) {
    return NextResponse.json(
      { error: "Stripe checkout is not configured" },
      { status: 500 }
    );
  }

  let appBase: string;
  try {
    appBase = getAppBaseUrl();
  } catch {
    return NextResponse.json(
      { error: "Application URL is not configured" },
      { status: 500 }
    );
  }

  const supabase = getSupabaseServerClient();
  const userId = await getUserIdFromAuthorization(
    supabase,
    req.headers.get("authorization")
  );
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let customerEmail: string | undefined;
  try {
    const body = (await req.json()) as { email?: unknown };
    if (
      typeof body?.email === "string" &&
      body.email.trim() !== "" &&
      body.email.includes("@")
    ) {
      customerEmail = body.email.trim();
    }
  } catch {
    // No JSON body
  }

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appBase}/clarify?upgraded=pro`,
    cancel_url: `${appBase}/plan`,
    metadata: { user_id: userId, plan: "pro" },
    client_reference_id: userId,
    subscription_data: {
      metadata: { user_id: userId, plan: "pro" },
    },
    ...(customerEmail ? { customer_email: customerEmail } : {}),
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Checkout session has no URL" },
      { status: 500 }
    );
  }
  return NextResponse.json({ url: session.url });
}
