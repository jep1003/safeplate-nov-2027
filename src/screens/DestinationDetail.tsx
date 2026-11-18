import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { destinations } from '../data/destinations'
import { venues } from '../data/venues'
import type { VenueType } from '../lib/types'
import { evidenceRank, meetsSome } from '../lib/scoring'
import { useApp } from '../state/AppState'
import { Disclaimer, FeasibilityBadge, PageTitle, SampleTag, Section } from '../components/ui'
import { VenueCard } from '../components/VenueCard'
import { MapView } from '../components/MapView'

const TYPES: { v: VenueType | 'all'; label: string }[] = [
  { v: 'all', label: 'All' }, { v: 'restaurant', label: 'Restaurants' }, { v: 'bakery', label: 'Bakeries' }, { v: 'cafe', label: 'Cafes' },
]
const GROUPS: { v: VenueType; label: string }[] = [
  { v: 'restaurant', label: 'Restaurants' }, { v: 'bakery', label: 'Bakeries' }, { v: 'cafe', label: 'Cafes' },
]

export default function DestinationDetail() {
  const { id } = useParams()
  const { evidenceFor } = useApp()
  const [type, setType] = useState<VenueType | 'all'>('all')
  const [onlySome, setOnlySome] = useState(false)
  const [view, setView] = useState<'list' | 'map'>('list')
  const d = destinations.find((x) => x.id === id)
  if (!d) return <p>Destination not found. <Link className="underline" to="/">Back to destinations</Link></p>

  const all = venues.filter((v) => v.destinationId === d.id)
  const shown = all
    .filter((v) => type === 'all' || v.type === type)
    .filter((v) => !onlySome || meetsSome(evidenceFor(v).level))
    .sort((a, b) => evidenceRank(evidenceFor(b).level) - evidenceRank(evidenceFor(a).level))

  return (
    <div className="max-w-3xl">
      <Link to="/" className="mb-3 inline-flex min-h-[44px] items-center font-semibold text-terra-dark underline">← All destinations</Link>
      <PageTitle eyebrow={`${d.city}, ${d.country}`} right={<FeasibilityBadge value={d.feasibility} />}>Eating safely in {d.city}</PageTitle>
      <div className="mb-4 flex flex-wrap items-center gap-2"><SampleTag /></div>
      <Disclaimer />

      <Section title="Feasibility" id="feas">
        <p className="text-lg">{d.why}</p>
        <h3 className="mt-5 text-lg font-bold">Hidden nut sources to watch for</h3>
        <ul className="mt-2 space-y-2">
          {d.riskPatterns.map((r) => (
            <li key={r.title} className="card"><p className="font-bold">{r.title}</p><p className="text-muted">{r.detail}</p></li>
          ))}
        </ul>
        <p className="mt-4"><span className="font-bold">Local labeling:</span> {d.labeling}</p>
      </Section>

      <Section title="Know before you go" id="primers">
        <div className="space-y-2">
          {d.primers.map((p) => (
            <details key={p.cuisine} className="card">
              <summary className="min-h-[44px] cursor-pointer py-2 text-lg font-bold">{p.cuisine} primer</summary>
              <ul className="ml-5 list-disc space-y-1 pb-2">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
            </details>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">Local emergency number: <strong>{d.emergencyNumber}</strong> (verify before you travel).</p>
      </Section>

      <Section title="Places" id="places">
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {TYPES.map((t) => <button key={t.v} aria-pressed={type === t.v} className="chip" onClick={() => setType(t.v)}>{t.label}</button>)}
          <button aria-pressed={onlySome} className="chip" onClick={() => setOnlySome(!onlySome)}>Some evidence or better</button>
        </div>
        <div className="mb-4 flex gap-2" role="group" aria-label="View">
          <button aria-pressed={view === 'list'} className="chip" onClick={() => setView('list')}>List</button>
          <button aria-pressed={view === 'map'} className="chip" onClick={() => setView('map')}>Map</button>
        </div>
        {shown.length === 0 && <p className="card">No venues match these filters.</p>}
        {view === 'map' ? <MapView venues={shown} /> : (
          GROUPS.map((g) => {
            const vs = shown.filter((v) => v.type === g.v)
            if (!vs.length) return null
            return (
              <div key={g.v} className="mb-6">
                <h3 className="mb-2 text-xl font-bold">{g.label}</h3>
                <ul className="space-y-3">{vs.map((v) => <li key={v.id}><VenueCard venue={v} /></li>)}</ul>
              </div>
            )
          })
        )}
      </Section>
      <p className="mt-6"><Link className="btn-ghost" to={`/trips?dest=${d.id}`}>Plan a trip to {d.city}</Link></p>
    </div>
  )
}
