-- Safe Plate: shared experience reports.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- No accounts: anonymous visitors can read reports and add new ones.
-- Nothing about a person's allergy profile is stored here.

create table if not exists public.reports (
  id          uuid primary key,
  venue_id    text not null check (char_length(venue_id) between 1 and 64),
  kind        text not null check (kind in ('ok', 'reaction', 'misunderstood')),
  reported_on date not null,
  note        text check (note is null or char_length(note) <= 300),
  reviewed    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists reports_venue_idx on public.reports (venue_id, reported_on desc);

alter table public.reports enable row level security;

grant select, insert on public.reports to anon;

drop policy if exists "reports are readable by anyone" on public.reports;
create policy "reports are readable by anyone"
  on public.reports for select to anon using (true);

-- Visitors can add reports but cannot mark them reviewed or date them in the future.
-- Only a moderator (dashboard / service role) can set reviewed = true.
drop policy if exists "anyone can add an unreviewed report" on public.reports;
create policy "anyone can add an unreviewed report"
  on public.reports for insert to anon
  with check (reviewed = false and reported_on <= current_date);

-- No update or delete policies for anon: reports can't be edited or removed
-- from the app.
