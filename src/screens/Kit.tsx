import { useState } from 'react'
import { languages } from '../data/phrases'
import { destinations } from '../data/destinations'
import { useApp } from '../state/AppState'
import { PageTitle } from '../components/ui'

export default function Kit() {
  const { profile } = useApp()
  const [lang, setLang] = useState('en')
  const l = languages.find((x) => x.id === lang)!
  const en = languages[0].phrases

  const allergens = [profile?.peanut && 'Peanut', profile?.treeNuts && (profile.specificNuts.length ? `Tree nuts (${profile.specificNuts.join(', ')})` : 'All tree nuts')].filter(Boolean).join(' + ')
  const partial = profile && !(profile.peanut && profile.treeNuts)

  return (
    <div className="max-w-2xl">
      <PageTitle eyebrow="At the table">Allergy card</PageTitle>

      <label htmlFor="lang" className="font-semibold">Language</label>
      <select id="lang" className="field mb-3" value={lang} onChange={(e) => setLang(e.target.value)}>
        {languages.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.native})</option>)}
      </select>

      {lang !== 'en' && (
        <p role="note" className="mb-4 rounded-xl border-2 border-ochre bg-ochre-tint p-3 font-medium text-ochre">
          Placeholder translation. Have a native speaker verify it before you rely on it.
        </p>
      )}
      {partial && <p role="note" className="mb-4 rounded-xl border-2 border-ochre bg-ochre-tint p-3 text-ochre">The translated text mentions both peanuts and tree nuts. Ask a native speaker to adapt it to your child's allergy.</p>}

      <section aria-label="Allergy card" lang={l.id} className="rounded-3xl border-4 border-black bg-white p-5 text-black">
        {profile?.name && <p lang="en" className="mb-2 text-lg font-bold">Child: {profile.name}</p>}
        <p className="text-3xl font-bold leading-snug">{l.phrases.intro}</p>
        <p className="mt-4 text-2xl font-semibold leading-snug">{l.phrases.noNuts}</p>
        <p className="mt-4 text-2xl font-semibold leading-snug">{l.phrases.check}</p>
        {lang !== 'en' && (
          <div lang="en" className="mt-5 border-t-2 border-black pt-3 text-lg">
            <p>{en.intro}</p>
            <p className="mt-1">{en.noNuts}</p>
          </div>
        )}
        <p lang="en" className="mt-4 text-base font-bold">Allergens: {allergens || 'not set'}{profile?.traces === 'yes' ? ' · Traces matter' : ''}</p>
      </section>

      <section aria-labelledby="em" className="mt-8 rounded-3xl border-4 border-alert bg-alert-tint p-5 text-alert">
        <h2 id="em" className="text-2xl font-bold">Emergency</h2>
        <p className="mt-2 font-semibold">{profile?.epinephrine === 'no' ? "You said you do not carry epinephrine for your child. Talk to your child's doctor about it before you travel." : "Check that your child's epinephrine is with you and in date."}</p>
        <div lang={l.id} className="mt-3 rounded-2xl bg-white p-4 text-black">
          <p className="text-2xl font-bold">{l.phrases.hospital}</p>
          <p className="mt-3 text-2xl font-bold">{l.phrases.reaction}</p>
          {lang !== 'en' && <p lang="en" className="mt-3 border-t border-black pt-2">{en.hospital} {en.reaction}</p>}
        </div>
        <h3 className="mt-4 font-bold">Emergency numbers (verify before you travel)</h3>
        <ul className="mt-1 grid gap-1 sm:grid-cols-2">
          {destinations.map((d) => <li key={d.id}>{d.city}: <strong>{d.emergencyNumber}</strong></li>)}
        </ul>
      </section>
      <p className="mt-4 text-sm text-muted">This card is a guide, not a guarantee. Always confirm with staff. Works offline once the app has loaded.</p>
    </div>
  )
}
