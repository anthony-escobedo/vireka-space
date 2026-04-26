import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): string {
  return stripeStatus;
}

type SubscriptionRow = {
  user_id: string;
  tier: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_end: string | null;
  updated_at: string;
};

async function upsertSubscriptionByUserId(
  row: SubscriptionRow
): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { data: existing, error: selectError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", row.user_id)
    .limit(1)
    .maybeSingle();

  if (selectError) {
    throw new Error(`subscriptions select: ${selectError.message}`);
  }

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        tier: row.tier,
        status: row.status,
        stripe_customer_id: row.stripe_customer_id,
        stripe_subscription_id: row.stripe_subscription_id,
        current_period_end: row.current_period_end,
        updated_at: row.updated_at,
      })
      .eq("id", existing.id);
    if (updateError) {
      throw new Error(`subscriptions update: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: row.user_id,
        tier: row.tier,
        status: row.status,
        stripe_customer_id: row.stripe_customer_id,
        stripe_subscription_id: row.stripe_subscription_id,
        current_period_end: row.current_period_end,
        updated_at: row.updated_at,
      });
    if (insertError) {
      throw new Error(`subscriptions insert: ${insertError.message}`);
    }
  }
}

async function updateSubscriptionByStripeId(
  stripeSubscriptionId: string,
  fields: { status: string; current_period_end: string | null; updated_at: string }
): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("subscriptions")
    .update(fields)
    .eq("stripe_subscription_id", stripeSubscriptionId);
  if (error) {
    throw new Error(`subscriptions update by sub id: ${error.message}`);
  }
}

/**
 * `STRIPE_WEBHOOK_SECRET` from the Stripe CLI or Dashboard “Signing secret”.
 */
export async function POST(request: NextRequest) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe is not configured";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  try {
    event = stripe.webhooks.constructEvent(body, signature, whSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const now = new Date().toISOString();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId) {
        console.warn(
          "[stripe/webhook] checkout.session.completed: missing user_id in metadata"
        );
        return NextResponse.json({ received: true });
      }

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      const subRef = session.subscription;
      const subId =
        typeof subRef === "string"
          ? subRef
          : subRef && "id" in subRef
            ? (subRef as Stripe.Subscription).id
            : null;

      if (!customerId || !subId) {
        console.warn(
          "[stripe/webhook] checkout.session.completed: missing customer or subscription"
        );
        return NextResponse.json({ received: true });
      }

      const sub = await stripe.subscriptions.retrieve(subId);
      const tier = "pro";

      const status = sub.status
        ? mapSubscriptionStatus(sub.status)
        : "active";
      const periodEnd =
        sub.current_period_end != null
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;

      await upsertSubscriptionByUserId({
        user_id: userId,
        tier,
        status,
        stripe_customer_id: customerId,
        stripe_subscription_id: subId,
        current_period_end: periodEnd,
        updated_at: now,
      });
    } else if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const supabase = getSupabaseServerClient();
      const { data: row, error: findError } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", sub.id)
        .maybeSingle();

      if (findError) {
        throw new Error(`subscriptions find: ${findError.message}`);
      }

      if (!row) {
        const uid = sub.metadata?.user_id;
        const customer =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (uid && customer) {
          const plan = (sub.metadata?.plan as string) || "pro";
          const tier = plan === "pro_plus" ? "pro_plus" : "pro";
          const periodEnd =
            sub.current_period_end != null
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null;
          await upsertSubscriptionByUserId({
            user_id: uid,
            tier,
            status: mapSubscriptionStatus(sub.status),
            stripe_customer_id: customer,
            stripe_subscription_id: sub.id,
            current_period_end: periodEnd,
            updated_at: now,
          });
        } else {
          console.warn(
            "[stripe/webhook] subscription.updated: no row and no user_id/customer",
            sub.id
          );
        }
      } else {
        const periodEnd =
          sub.current_period_end != null
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null;
        const plan = (sub.metadata?.plan as string) || "pro";
        const tier = plan === "pro_plus" ? "pro_plus" : "pro";
        const { error: upErr } = await supabase
          .from("subscriptions")
          .update({
            status: mapSubscriptionStatus(sub.status),
            current_period_end: periodEnd,
            tier,
            updated_at: now,
          })
          .eq("id", row.id);
        if (upErr) {
          throw new Error(`subscriptions update: ${upErr.message}`);
        }
      }
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      await updateSubscriptionByStripeId(sub.id, {
        status: "canceled",
        current_period_end:
          sub.current_period_end != null
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        updated_at: now,
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[stripe/webhook]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
