import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { destinations } from '../data/destinations'
import { venues } from '../data/venues'
import type { MealSlot, Trip } from '../lib/types'
import { meetsSome } from '../lib/scoring'
import { useApp, venueById } from '../state/AppState'
import { Disclaimer, EvidenceBadge, levelLabel, PageTitle } from '../components/ui'

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']
const uid = () => Math.random().toString(36).slice(2, 9)

function makeDays(n: number): Trip['days'] {
  return Array.from({ length: n }, (_, i) => ({ id: uid(), label: `Day ${i + 1}`, meals: SLOTS.map((slot) => ({ slot, venueId: null })) }))
}

export default function TripPlanner() {
  const { trips, saveTrips, evidenceFor } = useApp()
  const [params] = useSearchParams()
  const [selected, setSelected] = useState<string | null>(trips[0]?.id ?? null)
  const [name, setName] = useState('')
  const [destId, setDestId] = useState(params.get('dest') ?? destinations[0].id)
  const [days, setDays] = useState(3)

  const trip = trips.find((t) => t.id === selected) ?? null
  const update = (t: Trip) => saveTrips(trips.map((x) => (x.id === t.id ? t : x)))

  function create(e: React.FormEvent) {
    e.preventDefault()
    const d = destinations.find((x) => x.id === destId)!
    const t: Trip = { id: uid(), name: name.trim() || `${d.city} trip`, destinationId: destId, days: makeDays(days) }
    saveTrips([...trips, t])
    setSelected(t.id)
    setName('')
  }

  return (
    <div className="max-w-3xl">
      <PageTitle eyebrow="Trip planner">Plan your meals</PageTitle>
      <Disclaimer />

      <form onSubmit={create} className="card mt-5 grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor="tn" className="font-semibold">Trip name</label>
          <input id="tn" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spring in Kyoto" maxLength={50} />
        </div>
        <div>
          <label htmlFor="td" className="font-semibold">Destination</label>
          <select id="td" className="field" value={destId} onChange={(e) => setDestId(e.target.value)}>
            {destinations.map((d) => <option key={d.id} value={d.id}>{d.city}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tdays" className="font-semibold">Days</label>
          <input id="tdays" type="number" min={1} max={14} className="field" value={days} onChange={(e) => setDays(Math.min(14, Math.max(1, Number(e.target.value) || 1)))} />
        </div>
        <button className="btn-primary sm:col-span-4" type="submit">Create trip</button>
      </form>

      {trips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Your trips">
          {trips.map((t) => <button key={t.id} className="chip" aria-pressed={t.id === selected} onClick={() => setSelected(t.id)}>{t.name}</button>)}
        </div>
      )}

      {trip && (() => {
        const dest = destinations.find((d) => d.id === trip.destinationId)!
        const options = venues.filter((v) => v.destinationId === trip.destinationId)
        return (
          <section className="mt-6" aria-label={trip.name}>
            <h2 className="text-2xl font-bold">{trip.name}</h2>
            <p className="mb-4 text-muted">{dest.city}. Pin a place to each meal you want to plan.</p>
            <div className="space-y-4">
              {trip.days.map((day) => {
                const pinned = day.meals.filter((m) => m.venueId)
                const ok = pinned.some((m) => { const v = venueById(m.venueId!); return v && meetsSome(evidenceFor(v).level) })
                return (
                  <article key={day.id} className="card">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{day.label}</h3>
                      <button className="btn-ghost min-h-[44px] px-3 text-sm" onClick={() => update({ ...trip, days: trip.days.filter((d) => d.id !== day.id) })}>Remove day</button>
                    </div>
                    {!ok && (
                      <p role="alert" className="mt-2 rounded-xl border-2 border-ochre bg-ochre-tint p-3 font-medium text-ochre">
                        No meal on this day has at least "Some evidence". Pin a stronger place, or plan a grocery meal. <Link className="underline" to={`/destination/${dest.id}`}>See places</Link>
                      </p>
                    )}
                    <div className="mt-3 space-y-3">
                      {day.meals.map((m) => {
                        const v = m.venueId ? venueById(m.venueId) : null
                        return (
                          <div key={m.slot}>
                            <label className="font-semibold capitalize" htmlFor={`${day.id}-${m.slot}`}>{m.slot}</label>
                            <select id={`${day.id}-${m.slot}`} className="field" value={m.venueId ?? ''}
                              onChange={(e) => update({ ...trip, days: trip.days.map((d) => d.id !== day.id ? d : { ...d, meals: d.meals.map((x) => x.slot === m.slot ? { ...x, venueId: e.target.value || null } : x) }) })}>
                              <option value="">Not planned</option>
                              {options.map((o) => <option key={o.id} value={o.id}>{o.name} ({levelLabel(evidenceFor(o).level)})</option>)}
                            </select>
                            {v && <div className="mt-1 flex items-center gap-2"><EvidenceBadge level={evidenceFor(v).level} /><Link className="text-sm font-semibold underline" to={`/venue/${v.id}`}>Open</Link></div>}
                          </div>
                        )
                      })}
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-ghost" onClick={() => update({ ...trip, days: [...trip.days, ...makeDays(1).map((d) => ({ ...d, label: `Day ${trip.days.length + 1}` }))] })}>Add a day</button>
              <button className="btn-ghost" onClick={() => { saveTrips(trips.filter((t) => t.id !== trip.id)); setSelected(null) }}>Delete trip</button>
            </div>
          </section>
        )
      })()}
    </div>
  )
}
