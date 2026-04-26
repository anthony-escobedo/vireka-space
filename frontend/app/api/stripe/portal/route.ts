import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromAuthorization } from "../../../../lib/plan/server";
import { getAppBaseUrl, getStripe } from "../../../../lib/stripe/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe Customer Portal. Requires `Authorization: Bearer` with a valid session.
 * Uses `public.subscriptions.stripe_customer_id` for the user (latest row by updated_at).
 */
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
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

  const { data: subRow, error: subError } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subError) {
    console.error("[api/stripe/portal] subscriptions read:", subError.message);
    return NextResponse.json(
      { error: "Could not load subscription" },
      { status: 500 }
    );
  }

  const customerId = subRow
    ? String(
        (subRow as { stripe_customer_id: string | null }).stripe_customer_id ||
          ""
      ).trim()
    : "";
  if (!customerId) {
    return NextResponse.json(
      { error: "No billing account on file. Subscribe or complete checkout first." },
      { status: 400 }
    );
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

  const returnUrl = `${appBase}/plan`;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    if (!session.url) {
      return NextResponse.json(
        { error: "Portal session has no URL" },
        { status: 500 }
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Portal error";
    console.error("[api/stripe/portal]", msg);
    return NextResponse.json(
      { error: "Could not open billing portal" },
      { status: 500 }
    );
  }
}
