-- Optional user-marked "current clarity" for AI-ready / restore from History
alter table public.conversations
  add column if not exists marked_clarity text;

alter table public.conversations
  add column if not exists marked_clarity_at timestamptz;
