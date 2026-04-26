import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe/server";
import { getSupabaseServiceClientOrNull } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): string {
  return stripeStatus;
}

type SubscriptionRow = {
  user_id: string;
  plan: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
};

const ACTIVE_PLAN_STATUSES: ReadonlySet<Stripe.Subscription.Status> =
  new Set<Stripe.Subscription.Status>(["active", "trialing", "past_due"]);

function firstPriceId(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0];
  if (!item?.price) return null;
  return typeof item.price === "string" ? item.price : item.price.id;
}

/**
 * `plan` column: pro | pro_plus | free. `status` column: Stripe status string.
 */
function derivePlanForStripeSubscription(
  sub: Stripe.Subscription
): "pro" | "pro_plus" | "free" {
  if (!ACTIVE_PLAN_STATUSES.has(sub.status)) {
    return "free";
  }
  const m = (sub.metadata?.plan as string) || "pro";
  if (m === "pro_plus") return "pro_plus";
  return "pro";
}

function subscriptionRow(
  sub: Stripe.Subscription,
  userId: string,
  now: string
): SubscriptionRow {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!customerId) {
    throw new Error("Subscription missing customer id");
  }
  return {
    user_id: userId,
    plan: derivePlanForStripeSubscription(sub),
    status: mapSubscriptionStatus(sub.status),
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    stripe_price_id: firstPriceId(sub),
    current_period_start:
      sub.current_period_start != null
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
    current_period_end:
      sub.current_period_end != null
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
    cancel_at_period_end: Boolean(sub.cancel_at_period_end),
    updated_at: now,
  };
}

async function findRowByStripeIds(
  supabase: SupabaseClient,
  stripeSubscriptionId: string | null,
  stripeCustomerId: string | null
): Promise<{ id: string; user_id: string } | null> {
  if (stripeSubscriptionId) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("id, user_id")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .limit(1)
      .maybeSingle();
    if (error) {
      throw new Error(`subscriptions find by sub id: ${error.message}`);
    }
    if (data) return data;
  }
  if (stripeCustomerId) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("id, user_id")
      .eq("stripe_customer_id", stripeCustomerId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      throw new Error(`subscriptions find by customer: ${error.message}`);
    }
    if (data) return data;
  }
  return null;
}

async function upsertSubscriptionByUserId(
  supabase: SupabaseClient,
  row: SubscriptionRow
): Promise<void> {
  const { data: existing, error: selectError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", row.user_id)
    .limit(1)
    .maybeSingle();

  if (selectError) {
    throw new Error(`subscriptions select: ${selectError.message}`);
  }

  const payload = {
    plan: row.plan,
    status: row.status,
    stripe_customer_id: row.stripe_customer_id,
    stripe_subscription_id: row.stripe_subscription_id,
    stripe_price_id: row.stripe_price_id,
    current_period_start: row.current_period_start,
    current_period_end: row.current_period_end,
    cancel_at_period_end: row.cancel_at_period_end,
    updated_at: row.updated_at,
  };

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update(payload)
      .eq("id", existing.id);
    if (updateError) {
      throw new Error(`subscriptions update: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await supabase.from("subscriptions").insert({
      user_id: row.user_id,
      ...payload,
    });
    if (insertError) {
      throw new Error(`subscriptions insert: ${insertError.message}`);
    }
  }
}

async function updateSubscriptionById(
  supabase: SupabaseClient,
  id: string,
  fields: Partial<SubscriptionRow> & { updated_at: string }
): Promise<void> {
  const { error } = await supabase
    .from("subscriptions")
    .update(fields)
    .eq("id", id);
  if (error) {
    throw new Error(`subscriptions update by id: ${error.message}`);
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

  const supabase = getSupabaseServiceClientOrNull();
  if (!supabase) {
    console.error(
      "[stripe/webhook] Supabase service client unavailable (check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)"
    );
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
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
      const row = subscriptionRow(sub, userId, now);
      await upsertSubscriptionByUserId(supabase, row);
    } else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
      if (!customerId) {
        console.warn(
          `[stripe/webhook] ${event.type}: missing customer on subscription`,
          sub.id
        );
        return NextResponse.json({ received: true });
      }

      const metaUser = (sub.metadata?.user_id as string) || null;
      const found = await findRowByStripeIds(
        supabase,
        sub.id,
        customerId
      );
      const userId: string | null = found?.user_id ?? metaUser;

      if (!userId) {
        console.warn(
          `[stripe/webhook] ${event.type}: no user_id in metadata and no existing row for`,
          sub.id
        );
        return NextResponse.json({ received: true });
      }

      const row = subscriptionRow(sub, userId, now);
      if (found?.id) {
        const { user_id: _u, ...rest } = row;
        await updateSubscriptionById(supabase, found.id, {
          ...rest,
          updated_at: now,
        });
      } else {
        await upsertSubscriptionByUserId(supabase, row);
      }
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
      const found = await findRowByStripeIds(
        supabase,
        sub.id,
        customerId ?? null
      );
      if (!found) {
        console.warn(
          "[stripe/webhook] customer.subscription.deleted: no subscriptions row for",
          sub.id
        );
        return NextResponse.json({ received: true });
      }

      // Ended: plan becomes free; status reflects Stripe; keep period fields for reference
      await updateSubscriptionById(supabase, found.id, {
        plan: "free",
        status: mapSubscriptionStatus(sub.status) || "canceled",
        current_period_start:
          sub.current_period_start != null
            ? new Date(sub.current_period_start * 1000).toISOString()
            : null,
        current_period_end:
          sub.current_period_end != null
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        cancel_at_period_end: Boolean(sub.cancel_at_period_end),
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
