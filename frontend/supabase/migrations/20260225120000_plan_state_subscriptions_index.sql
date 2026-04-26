-- Plan-based daily limits read from public.subscriptions (see supabase/schema.sql).
-- Run against your Supabase project after schema sync. Optional index for user lookups.
-- Not a new table: `user_plans` was deferred in favor of existing `subscriptions`.

create index if not exists idx_subscriptions_user_id
  on public.subscriptions (user_id);
