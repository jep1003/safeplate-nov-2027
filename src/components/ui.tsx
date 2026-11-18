import type { ReactNode } from 'react'
import type { EvidenceLevel, Feasibility, ReportKind } from '../lib/types'
import type { Factor } from '../lib/scoring'

export function SampleTag() {
  return <span className="stamp" title="All places and reports in this prototype are invented">Sample data</span>
}

export function Disclaimer() {
  return (
    <aside role="note" aria-label="Important" className="rounded-2xl border-2 border-ochre bg-ochre-tint px-4 py-3 text-ochre">
      <p className="font-semibold">This is a guide, not a guarantee.</p>
      <p className="text-[15px]">Always confirm with staff, every visit. Carry your child's epinephrine.</p>
    </aside>
  )
}

const LEVEL: Record<EvidenceLevel, { label: string; glyph: string; cls: string }> = {
  Strong: { label: 'Strong evidence', glyph: '●●●', cls: 'bg-olive-tint text-olive border-olive' },
  Some: { label: 'Some evidence', glyph: '●●○', cls: 'bg-ochre-tint text-ochre border-ochre' },
  Limited: { label: 'Limited evidence', glyph: '●○○', cls: 'bg-stone-tint text-stone border-stone' },
  Conflicting: { label: 'Conflicting reports', glyph: '⇄', cls: 'bg-terra-tint text-terra-dark border-terra' },
}

export const levelLabel = (l: EvidenceLevel) => LEVEL[l].label

export function EvidenceBadge({ level, large }: { level: EvidenceLevel; large?: boolean }) {
  const d = LEVEL[level]
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border-2 font-semibold ${d.cls} ${large ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm'}`}>
      <span aria-hidden="true" className="tracking-widest">{d.glyph}</span>
      {d.label}
    </span>
  )
}

const FEAS: Record<Feasibility, string> = {
  Easier: 'bg-olive-tint text-olive border-olive',
  Moderate: 'bg-ochre-tint text-ochre border-ochre',
  Challenging: 'bg-terra-tint text-terra-dark border-terra',
}

export function FeasibilityBadge({ value }: { value: Feasibility }) {
  return <span className={`inline-flex rounded-full border-2 px-3 py-1 text-sm font-semibold ${FEAS[value]}`}>{value}</span>
}

const TONE: Record<Factor['tone'], { icon: string; cls: string }> = {
  positive: { icon: '✓', cls: 'bg-olive-tint text-olive' },
  neutral: { icon: '•', cls: 'bg-stone-tint text-stone' },
  caution: { icon: '!', cls: 'bg-ochre-tint text-ochre' },
  alert: { icon: '✕', cls: 'bg-alert-tint text-alert' },
}

export function EvidenceBreakdown({ factors }: { factors: Factor[] }) {
  return (
    <ul className="space-y-3">
      {factors.map((f, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${TONE[f.tone].cls}`}>{TONE[f.tone].icon}</span>
          <div>
            <p className="font-semibold leading-snug">{f.label}</p>
            <p className="text-[15px] text-muted">{f.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export const REPORT_LABEL: Record<ReportKind, string> = {
  ok: 'We ate here, no reaction',
  reaction: 'My child had a reaction',
  misunderstood: "Staff didn't understand",
}

export function ReportKindPill({ kind }: { kind: ReportKind }) {
  const cls = kind === 'reaction' ? 'bg-alert-tint text-alert border-alert' : kind === 'ok' ? 'bg-olive-tint text-olive border-olive' : 'bg-ochre-tint text-ochre border-ochre'
  const icon = kind === 'reaction' ? '✕' : kind === 'ok' ? '✓' : '!'
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-semibold ${cls}`}><span aria-hidden="true">{icon}</span>{REPORT_LABEL[kind]}</span>
}

export function PageTitle({ eyebrow, children, right }: { eyebrow?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-terra">{eyebrow}</p>}
        <h1 className="text-3xl font-bold leading-tight">{children}</h1>
      </div>
      {right}
    </div>
  )
}

export function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <h2 id={id} className="mb-3 text-2xl font-bold">{title}</h2>
      {children}
    </section>
  )
}
