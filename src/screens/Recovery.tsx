import { Link, useParams } from 'react-router-dom'
import { venues } from '../data/venues'
import { destinations } from '../data/destinations'
import { evidenceRank } from '../lib/scoring'
import { useApp } from '../state/AppState'
import { Disclaimer, EvidenceBadge, PageTitle, SampleTag, Section } from '../components/ui'

export default function Recovery() {
  const { id } = useParams()
  const { evidenceFor, profile } = useApp()
  const venue = venues.find((v) => v.id === id)
  if (!venue) return <p>Venue not found. <Link className="underline" to="/">Back</Link></p>
  const dest = destinations.find((d) => d.id === venue.destinationId)!

  const dist = (a: typeof venue, b: typeof venue) => Math.hypot(a.x - b.x, a.y - b.y)
  const alts = venues
    .filter((v) => v.destinationId === venue.destinationId && v.id !== venue.id)
    .map((v) => ({ v, level: evidenceFor(v).level, d: dist(v, venue) }))
    .sort((a, b) => evidenceRank(b.level) - evidenceRank(a.level) || a.d - b.d)
    .slice(0, 5)

  return (
    <div className="max-w-3xl">
      <Link to={`/venue/${venue.id}`} className="mb-3 inline-flex min-h-[44px] items-center font-semibold text-terra-dark underline">← {venue.name}</Link>
      <PageTitle eyebrow="Recovery">This place isn't working</PageTitle>
      <p className="mb-3 text-lg">That's okay. Leaving is a good decision. Here are your options in {dest.city}.</p>
      <div className="mb-4"><SampleTag /></div>
      <Disclaimer />

      <section aria-labelledby="emerg" className="mt-6 rounded-2xl border-2 border-alert bg-alert-tint p-4 text-alert">
        <h2 id="emerg" className="text-xl font-bold">If your child has symptoms</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 font-medium">
          <li>{profile?.epinephrine === 'no' ? 'You said you do not carry epinephrine for your child. Call emergency services immediately.' : "Use your child's epinephrine without waiting."}</li>
          <li>Call emergency services: <strong>{dest.emergencyNumber}</strong> (verify before you travel).</li>
          <li>Tell someone nearby. Stay with your child.</li>
        </ul>
        <Link to="/kit" className="btn-ghost mt-3 border-alert text-alert">Open emergency phrases</Link>
      </section>

      <Section title="Nearby alternatives" id="alts">
        <p className="mb-3 text-muted">Ordered by evidence level, then by schematic distance. Conflicting reports come last. Confirm with staff everywhere.</p>
        <ul className="space-y-3">
          {alts.map(({ v, level, d }) => (
            <li key={v.id}>
              <Link to={`/venue/${v.id}`} className="card block hover:bg-sand">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">{v.name}</h3>
                  <EvidenceBadge level={level} />
                </div>
                <p className="text-[15px] capitalize text-muted">{v.type} · {v.neighborhood} · {d < 25 ? 'close by' : 'a bit further'} (schematic)</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Grocery and packaged-food fallback" id="grocery">
        <div className="card">
          <p>{dest.grocery}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px]">
            <li>Read the full ingredient list and any "may contain" warning every time.</li>
            <li>Choose simple items: fruit, plain rice, bread you have checked, sealed products.</li>
            <li>Skip loose or bulk foods and anything without a label.</li>
          </ul>
        </div>
      </Section>
    </div>
  )
}
