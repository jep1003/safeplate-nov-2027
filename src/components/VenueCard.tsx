import { Link } from 'react-router-dom'
import type { Venue } from '../lib/types'
import { useApp } from '../state/AppState'
import { EvidenceBadge } from './ui'

export function VenueCard({ venue }: { venue: Venue }) {
  const { evidenceFor } = useApp()
  const ev = evidenceFor(venue)
  return (
    <Link to={`/venue/${venue.id}`} className="card block min-h-[44px] hover:bg-sand">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold leading-snug">{venue.name}</h3>
          <p className="text-[15px] text-muted capitalize">{venue.type} · {venue.cuisine} · {venue.neighborhood}</p>
        </div>
      </div>
      <p className="mt-2 text-[15px]">{venue.blurb}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <EvidenceBadge level={ev.level} />
        {venue.dedicatedNutFree && <span className="rounded-full border border-line px-2.5 py-0.5 text-sm text-muted">Reported nut-free kitchen</span>}
      </div>
    </Link>
  )
}
