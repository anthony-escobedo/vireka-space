-- Daily interaction counts: support signed-in users via user_id (separate from anonymous_id rows).

create table if not exists public.usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  anonymous_id text,
  usage_date text not null,
  interaction_count integer not null default 0,
  created_at timestamptz not null default now()
);

do $migration$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'usage_tracking'
      and column_name = 'anonymous_id'
      and is_nullable = 'NO'
  ) then
    alter table public.usage_tracking alter column anonymous_id drop not null;
  end if;
end
$migration$;

alter table public.usage_tracking
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

create unique index if not exists usage_tracking_user_id_usage_date
  on public.usage_tracking (user_id, usage_date)
  where user_id is not null;

create unique index if not exists usage_tracking_anonymous_id_usage_date
  on public.usage_tracking (anonymous_id, usage_date)
  where anonymous_id is not null;
