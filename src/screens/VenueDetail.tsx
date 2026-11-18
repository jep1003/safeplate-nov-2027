import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { venues } from '../data/venues'
import { destinations } from '../data/destinations'
import { baseQuestions, questionSets } from '../data/questions'
import { ageLabel, formatDate, isStale } from '../lib/recency'
import { STALE_WEIGHT } from '../lib/scoring'
import { useApp } from '../state/AppState'
import { Disclaimer, EvidenceBadge, EvidenceBreakdown, PageTitle, ReportKindPill, SampleTag, Section } from '../components/ui'
import { ReportSheet } from '../components/ReportSheet'

export default function VenueDetail() {
  const { id } = useParams()
  const { reportsFor, evidenceFor, now, noteStatus } = useApp()
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const venue = venues.find((v) => v.id === id)
  if (!venue) return <p>Venue not found. <Link className="underline" to="/">Back</Link></p>

  const dest = destinations.find((d) => d.id === venue.destinationId)!
  const ev = evidenceFor(venue)
  const reports = reportsFor(venue.id)
  const questions = [...(questionSets[venue.questionSet] ?? []), ...baseQuestions]
  const staffStale = venue.staffConfirmedOn !== null && isStale(venue.staffConfirmedOn, now)

  return (
    <div className="max-w-3xl">
      <Link to={`/destination/${dest.id}`} className="mb-3 inline-flex min-h-[44px] items-center font-semibold text-terra-dark underline">← {dest.city}</Link>
      <PageTitle eyebrow={`${venue.type} · ${venue.cuisine}`}>{venue.name}</PageTitle>
      <p className="mb-3 text-muted">{venue.neighborhood}. {venue.blurb}</p>
      <div className="mb-4 flex flex-wrap items-center gap-2"><EvidenceBadge level={ev.level} large /><SampleTag /></div>
      <Disclaimer />

      {msg && <p role="status" className="mt-4 rounded-xl border-2 border-olive bg-olive-tint p-3 font-semibold text-olive">{msg}</p>}

      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => setOpen(true)}>Report your experience</button>
        <Link className="btn-ghost" to={`/venue/${venue.id}/recovery`}>This place isn't working</Link>
      </div>

      <Section title="Why this rating" id="why">
        <div className="card"><EvidenceBreakdown factors={ev.factors} /></div>
        <p className="mt-2 text-sm text-muted">Reports older than 12 months count at {STALE_WEIGHT * 100}% and are flagged. A rating summarizes evidence; it is not a promise about the kitchen.</p>
      </Section>

      <Section title="Evidence at a glance" id="glance">
        <dl className="card grid gap-3 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold text-muted">Kitchen</dt><dd>{venue.dedicatedNutFree ? 'Reported dedicated nut-free kitchen' : 'Shared kitchen'}</dd></div>
          <div><dt className="text-sm font-semibold text-muted">Staff confirmation</dt>
            <dd>{venue.staffConfirmedOn ? <>{formatDate(venue.staffConfirmedOn)} ({ageLabel(venue.staffConfirmedOn, now)}){staffStale && <span className="ml-1 font-semibold text-ochre"> · older than 12 months</span>}{venue.staffConfirmationNote && <span className="block text-muted">{venue.staffConfirmationNote}</span>}</> : 'None on file'}</dd></div>
          <div><dt className="text-sm font-semibold text-muted">Community reports</dt><dd>{reports.length} total</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm font-semibold text-muted">Menu risk flags</dt>
            <dd><ul className="ml-5 list-disc">{venue.menuRiskFlags.map((f) => <li key={f}>{f}</li>)}</ul></dd></div>
        </dl>
      </Section>

      <Section title="Report timeline" id="timeline">
        {reports.length === 0 ? <p className="card">No reports yet. Be the first.</p> : (
          <ol className="space-y-3">
            {reports.map((r) => {
              const stale = isStale(r.date, now)
              return (
                <li key={r.id} className={`card ${r.kind === 'reaction' ? 'border-alert' : ''} ${stale ? 'opacity-80' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <ReportKindPill kind={r.kind} />
                    <span className="text-sm text-muted">{formatDate(r.date)} · {ageLabel(r.date, now)}</span>
                    {r.source === 'you' && <span className="stamp">Your report</span>}
                    {r.source === 'community' && <span className="stamp">Community</span>}
                  </div>
                  {stale && <p className="mt-1 text-sm font-semibold text-ochre">Older than 12 months: down-weighted.</p>}
                  {noteStatus(r) === 'review' && <p className="mt-2 rounded-lg bg-ochre-tint px-3 py-1.5 text-sm font-semibold text-ochre">Note in review. Only you can see it until it is approved.</p>}
                  {noteStatus(r) === 'unsent' && <p className="mt-2 rounded-lg bg-ochre-tint px-3 py-1.5 text-sm font-semibold text-ochre">Not sent yet. It will send once you are signed in and online.</p>}
                  {r.note && <p className="mt-2">{r.note}</p>}
                </li>
              )
            })}
          </ol>
        )}
      </Section>

      <Section title="Questions to ask staff" id="questions">
        <ul className="space-y-2">{questions.map((q) => <li key={q} className="card">{q}</li>)}</ul>
      </Section>

      {open && <ReportSheet venue={venue} onClose={() => setOpen(false)} onSaved={setMsg} />}
    </div>
  )
}
