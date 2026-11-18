import { useEffect, useRef, useState } from 'react'
import type { ReportKind, Venue } from '../lib/types'
import { toISODate } from '../lib/recency'
import { destinations } from '../data/destinations'
import { useApp } from '../state/AppState'
import { AuthForm } from './AuthForm'
import { REPORT_LABEL } from './ui'

const KINDS: ReportKind[] = ['ok', 'reaction', 'misunderstood']

export function ReportSheet({ venue, onClose, onSaved }: { venue: Venue; onClose: () => void; onSaved: (msg: string) => void }) {
  const { addReport, sharedReports, needsSignIn } = useApp()
  const emergencyNumber = destinations.find((d) => d.id === venue.destinationId)?.emergencyNumber ?? 'your local emergency number'
  const [kind, setKind] = useState<ReportKind | null>(null)
  const [note, setNote] = useState('')
  const today = toISODate(Date.now())
  const [date, setDate] = useState(today)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { ref.current?.querySelector<HTMLElement>('button')?.focus() }, [])

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])

  function save() {
    if (!kind) return
    const trimmed = note.trim()
    addReport({ venueId: venue.id, kind, date: date > today ? today : date, note: trimmed || undefined })
    onSaved(sharedReports
      ? `Thank you. Your report counts now and the evidence summary has been updated.${trimmed ? ' Your note is waiting for review and will appear once approved.' : ''}`
      : 'Report saved on this device. The evidence summary has been updated.')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="rs-title" onClick={(e) => e.stopPropagation()}
           className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper p-5 sm:rounded-3xl">
        {needsSignIn ? (
          <>
            <h2 id="rs-title" className="text-2xl font-bold">Sign in to share a report</h2>
            <p className="mb-4 text-muted">Reports are shared with other parents. Signing in keeps them trustworthy.</p>
            <AuthForm idPrefix="rs" />
            <p className="mt-3 text-center text-sm text-muted">Only your email is stored. Your child's profile stays on this device.</p>
            <button className="btn-ghost mt-3 w-full" onClick={onClose}>Cancel</button>
          </>
        ) : (
          <>
            <h2 id="rs-title" className="text-2xl font-bold">Report your experience</h2>
            <p className="mb-4 text-muted">
              {venue.name}. {sharedReports
                ? 'Your report is shared with other parents. Your note is reviewed before it is shown. Do not include personal details.'
                : 'Stored on this device only.'}
            </p>
            <div role="radiogroup" aria-label="What happened" className="space-y-2">
              {KINDS.map((k) => (
                <button key={k} role="radio" aria-checked={kind === k} onClick={() => setKind(k)}
                  className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border-2 px-4 text-left text-lg font-semibold ${kind === k ? (k === 'reaction' ? 'border-alert bg-alert-tint text-alert' : 'border-ink bg-ink text-paper') : 'border-line bg-card'}`}>
                  <span aria-hidden="true">{kind === k ? '◉' : '○'}</span>{REPORT_LABEL[k]}
                </button>
              ))}
            </div>
            {kind === 'reaction' && (
              <p role="alert" className="mt-3 rounded-xl border-2 border-alert bg-alert-tint p-3 text-alert">
                If your child has symptoms now, use their epinephrine and call {emergencyNumber} first. Report after.
              </p>
            )}
            <label className="mt-4 block font-semibold" htmlFor="rs-note">Note (optional)</label>
            <textarea id="rs-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={300} className="field py-2" />
            <label className="mt-3 block font-semibold" htmlFor="rs-date">Date (optional)</label>
            <input id="rs-date" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value || today)} className="field" />
            <div className="mt-5 flex gap-3">
              <button className="btn-ghost flex-1" onClick={onClose}>Cancel</button>
              <button className="btn-primary flex-1 disabled:opacity-50" disabled={!kind} onClick={save}>Save report</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
