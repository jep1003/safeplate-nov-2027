-- Safe Plate step 1: reports need a signed-in parent, and notes are held for approval.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Safe to re-run.
--
-- After this:
--   * Only signed-in users can add a report (their own).
--   * Anonymous visitors read reports through the view `reports_public`,
--     which shows a note only after you approve it and never exposes user ids.
--   * You (dashboard / service role) approve notes and review reactions.

alter table public.reports
  add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  add column if not exists note_approved boolean not null default false;

create index if not exists reports_user_idx on public.reports (user_id);

-- Visitors no longer touch the table directly; only signed-in users insert/read their own rows.
revoke all on public.reports from anon;
grant select, insert on public.reports to authenticated;

drop policy if exists "reports are readable by anyone" on public.reports;
drop policy if exists "anyone can add an unreviewed report" on public.reports;
drop policy if exists "signed-in parents add their own report" on public.reports;
drop policy if exists "parents read their own reports" on public.reports;

create policy "signed-in parents add their own report"
  on public.reports for insert to authenticated
  with check (
    user_id = auth.uid()
    and reviewed = false
    and note_approved = false
    and reported_on <= current_date
  );

create policy "parents read their own reports"
  on public.reports for select to authenticated
  using (user_id = auth.uid());

-- Public, read-only: everyone sees every report, but a note only once approved.
create or replace view public.reports_public as
  select
    id,
    venue_id,
    kind,
    reported_on,
    case when note_approved then note end as note,
    reviewed
  from public.reports;

grant select on public.reports_public to anon, authenticated;

-- Moderation (run these in the SQL editor as needed):
--   Reaction reports waiting for review:
--     select id, venue_id, reported_on, note from public.reports where kind = 'reaction' and not reviewed;
--   Approve a reviewed reaction so it stops holding the venue at Conflicting:
--     update public.reports set reviewed = true where id = '<report id>';
--   Notes waiting for approval:
--     select id, venue_id, note from public.reports where note is not null and not note_approved;
--   Approve a note:
--     update public.reports set note_approved = true where id = '<report id>';
