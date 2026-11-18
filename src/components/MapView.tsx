import { useNavigate } from 'react-router-dom'
import type { Venue } from '../lib/types'
import { useApp } from '../state/AppState'
import { levelLabel } from './ui'

const FILL = { Strong: '#3F5A25', Some: '#6B4A00', Limited: '#4A4036', Conflicting: '#7A2F1A' } as const

/** Dependency-light schematic map: invented positions, not to scale. */
export function MapView({ venues }: { venues: Venue[] }) {
  const { evidenceFor } = useApp()
  const nav = useNavigate()
  return (
    <figure>
      <svg viewBox="0 0 100 100" role="group" aria-label="Schematic map of sample venues" className="w-full rounded-2xl border border-line bg-sand">
        <path d="M0 62 C25 52 40 78 70 60 S95 55 100 58 L100 70 C80 74 60 90 35 80 S10 76 0 78Z" fill="#D5E0E4" />
        <g stroke="#D9CCB2" strokeWidth="0.6"><path d="M10 0V100M30 0V100M50 0V100M70 0V100M90 0V100M0 20H100M0 40H100M0 60H100M0 80H100" /></g>
        {venues.map((v) => {
          const lvl = evidenceFor(v).level
          return (
            <g key={v.id} role="link" tabIndex={0} aria-label={`${v.name}, ${levelLabel(lvl)}`}
               onClick={() => nav(`/venue/${v.id}`)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') nav(`/venue/${v.id}`) }}
               className="cursor-pointer">
              <circle cx={v.x} cy={v.y} r="6.5" fill={FILL[lvl]} stroke="#FFFDF8" strokeWidth="1.2" />
              <text x={v.x} y={v.y + 2} textAnchor="middle" fontSize="6" fill="#FFFDF8" fontWeight="700">{v.type[0].toUpperCase()}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-2 text-sm text-muted">Schematic only: positions are invented and not to scale. R = restaurant, B = bakery, C = cafe. Pin color follows evidence level; open a venue for the reasons.</figcaption>
    </figure>
  )
}
