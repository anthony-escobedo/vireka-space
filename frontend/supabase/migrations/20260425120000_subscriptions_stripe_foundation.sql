-- Stripe subscription storage: align with plan/status columns, price & period fields, indexes.
-- Safe on existing projects that already have public.subscriptions (tier + basic columns).

-- New columns
alter table public.subscriptions
  add column if not exists stripe_price_id text,
  add column if not exists current_period_start timestamptz,
  add column if not exists cancel_at_period_end boolean default false not null;

-- Legacy column name: tier → plan
do $migration$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'tier'
  )
     and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'plan'
  ) then
    alter table public.subscriptions rename column tier to plan;
  end if;
end
$migration$;

-- Defaults for new rows (existing rows keep current values)
alter table public.subscriptions
  alter column plan set default 'free',
  alter column status set default 'free';

-- Uniqueness: one row per Stripe subscription id when present
create unique index if not exists idx_subscriptions_stripe_subscription_id_unique
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- Lookups for webhook sync
create index if not exists idx_subscriptions_stripe_customer_id
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

-- user_id index (idempotent; may already exist from prior migration)
create index if not exists idx_subscriptions_user_id
  on public.subscriptions (user_id);
