-- VIREKA Space foundation schema: auth, usage, and history

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  plan text not null default 'free',
  status text not null default 'free',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_subscriptions_stripe_subscription_id_unique
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists idx_subscriptions_stripe_customer_id
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists idx_subscriptions_user_id
  on public.subscriptions (user_id);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  tier text not null default 'free',
  created_at timestamptz not null default now()
);

-- Daily interaction caps (anonymous and/or signed-in; service-role only from API)
create table if not exists public.usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  anonymous_id text,
  usage_date text not null,
  interaction_count integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists usage_tracking_user_id_usage_date
  on public.usage_tracking (user_id, usage_date)
  where user_id is not null;

create unique index if not exists usage_tracking_anonymous_id_usage_date
  on public.usage_tracking (anonymous_id, usage_date)
  where anonymous_id is not null;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  anonymous_id text,
  title text,
  source text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  marked_clarity text,
  marked_clarity_at timestamptz
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- profiles: users can read/update only their own profile
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- subscriptions: users can read only their own subscriptions
create policy "subscriptions_select_own"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- conversations: users can read/write only their own conversations
create policy "conversations_select_own"
  on public.conversations
  for select
  using (auth.uid() = user_id);

create policy "conversations_insert_own"
  on public.conversations
  for insert
  with check (auth.uid() = user_id);

create policy "conversations_update_own"
  on public.conversations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "conversations_delete_own"
  on public.conversations
  for delete
  using (auth.uid() = user_id);

-- messages: users can read/write only messages attached to their own conversations
create policy "messages_select_own"
  on public.messages
  for select
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

create policy "messages_insert_own"
  on public.messages
  for insert
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

create policy "messages_update_own"
  on public.messages
  for update
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

create policy "messages_delete_own"
  on public.messages
  for delete
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

-- usage_events: keep non-readable from client by default
-- (No SELECT policy intentionally)

-- Optional service-role only insert path through RLS bypass; no client insert policy added.
