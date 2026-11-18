import { Link } from 'react-router-dom'
import { destinations } from '../data/destinations'
import { venues } from '../data/venues'
import { useApp } from '../state/AppState'
import { meetsSome } from '../lib/scoring'
import { FeasibilityBadge, PageTitle, SampleTag } from '../components/ui'

export default function Explorer() {
  const { evidenceFor, profile } = useApp()
  return (
    <div>
      <PageTitle eyebrow={profile?.name ? `Planning for ${profile.name}` : 'Where to next?'}>How hard is it to eat well there?</PageTitle>
      <p className="mb-2 max-w-xl text-muted">A feasibility view for families traveling with a child who has peanut and tree nut allergies. It helps you decide whether and how to go. It never promises a meal is free of nuts.</p>
      <p className="mb-5"><SampleTag /> <span className="text-sm text-muted">Cities are real; every venue and report is invented.</span></p>
      <ul className="grid gap-4 md:grid-cols-2">
        {destinations.map((d) => {
          const vs = venues.filter((v) => v.destinationId === d.id)
          const backed = vs.filter((v) => meetsSome(evidenceFor(v).level)).length
          return (
            <li key={d.id}>
              <Link to={`/destination/${d.id}`} className="card block h-full hover:bg-sand">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{d.city}</h2>
                    <p className="text-muted">{d.country}</p>
                  </div>
                  <FeasibilityBadge value={d.feasibility} />
                </div>
                <p className="mt-3">{d.reason}</p>
                <p className="mt-3 text-sm font-semibold text-terra-dark">{backed} of {vs.length} venues with at least some evidence</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
