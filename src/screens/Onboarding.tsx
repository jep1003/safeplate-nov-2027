import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Profile, Traces } from '../lib/types'
import { useApp } from '../state/AppState'
import { PageTitle } from '../components/ui'

const NUTS = ['Almond', 'Walnut', 'Cashew', 'Pistachio', 'Hazelnut', 'Pecan', 'Brazil nut', 'Macadamia', 'Pine nut']
const EMPTY: Profile = { peanut: true, treeNuts: true, specificNuts: [], traces: 'unsure', epinephrine: 'yes', name: '' }

function Choice<T extends string>({ legend, value, options, onChange }: { legend: string; value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-2 text-lg font-bold">{legend}</legend>
      <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className="chip" onClick={() => onChange(o.v)}>{o.label}</button>
        ))}
      </div>
    </fieldset>
  )
}

export default function Onboarding() {
  const { profile, saveProfile } = useApp()
  const nav = useNavigate()
  const [p, setP] = useState<Profile>(profile ?? EMPTY)
  const [saved, setSaved] = useState(false)
  const invalid = !p.peanut && !p.treeNuts
  const editing = profile !== null

  function toggleNut(n: string) {
    setP((s) => ({ ...s, specificNuts: s.specificNuts.includes(n) ? s.specificNuts.filter((x) => x !== n) : [...s.specificNuts, n] }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (invalid) return
    saveProfile({ ...p, specificNuts: p.treeNuts ? p.specificNuts : [] })
    if (editing) setSaved(true)
    else nav('/')
  }

  return (
    <form onSubmit={submit} className="max-w-xl">
      <PageTitle eyebrow={editing ? 'Your profile' : 'Welcome'}>{editing ? "Your child's allergy profile" : "Tell us about your child's allergy"}</PageTitle>
      <p className="text-muted">Saved only on this device. No tracking. We ask for the minimum needed to build your child's table card and tailor tips.</p>

      <fieldset className="mt-6">
        <legend className="mb-2 text-lg font-bold">What is your child allergic to?</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={p.peanut} className="chip" onClick={() => setP({ ...p, peanut: !p.peanut })}>Peanut</button>
          <button type="button" aria-pressed={p.treeNuts} className="chip" onClick={() => setP({ ...p, treeNuts: !p.treeNuts })}>Tree nuts</button>
        </div>
        {invalid && <p role="alert" className="mt-2 font-semibold text-terra-dark">Select at least one.</p>}
      </fieldset>

      {p.treeNuts && (
        <fieldset className="mt-6">
          <legend className="text-lg font-bold">Specific tree nuts (optional)</legend>
          <p className="mb-2 text-sm text-muted">Leave empty if you avoid all tree nuts.</p>
          <div className="flex flex-wrap gap-2">
            {NUTS.map((n) => <button key={n} type="button" aria-pressed={p.specificNuts.includes(n)} className="chip" onClick={() => toggleNut(n)}>{n}</button>)}
          </div>
        </fieldset>
      )}

      <Choice<Traces> legend="Is your child sensitive to traces or cross-contact?" value={p.traces} onChange={(traces) => setP({ ...p, traces })}
        options={[{ v: 'yes', label: 'Yes' }, { v: 'no', label: 'No' }, { v: 'unsure', label: 'Unsure' }]} />
      <Choice<'yes' | 'no'> legend="Do you carry epinephrine for your child?" value={p.epinephrine} onChange={(epinephrine) => setP({ ...p, epinephrine })}
        options={[{ v: 'yes', label: 'Yes' }, { v: 'no', label: 'No' }]} />

      <div className="mt-6">
        <label htmlFor="nm" className="text-lg font-bold">Your child's first name on the card (optional)</label>
        <input id="nm" className="field mt-2" value={p.name} maxLength={40} autoComplete="off" onChange={(e) => setP({ ...p, name: e.target.value })} />
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button type="submit" className="btn-primary disabled:opacity-50" disabled={invalid}>{editing ? 'Save changes' : 'Save and start exploring'}</button>
        {saved && <p role="status" className="font-semibold text-olive">Saved on this device.</p>}
      </div>
    </form>
  )
}
