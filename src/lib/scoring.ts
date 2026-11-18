import type { EvidenceLevel, ReportKind } from './types'
import { daysBetween, isStale, STALE_AFTER_DAYS } from './recency'

/**
 * EVIDENCE SCORING RULES (pure, deterministic, evidence levels, never verdicts)
 * ----------------------------------------------------------------
 * Inputs: dedicated nut-free kitchen flag, date of last staff-confirmed
 * protocol, and dated community reports (ok / reaction / misunderstood).
 *
 * "Fresh" = dated within the last 12 months (365 days). Anything older is
 * "stale": it is counted at 25% weight in the breakdown, flagged in the UI,
 * and can never lift a venue above "Limited" on its own.
 *
 * 1. Any unreviewed reaction report  -> "Conflicting" (hard cap, any age),
 *    until the report is marked reviewed.
 * 2. More "staff didn't understand" reports than positive reports
 *    -> "Conflicting".
 * 3. Otherwise:
 *    Strong  = dedicated nut-free kitchen AND (fresh staff confirmation
 *              OR >= 3 fresh positive reports), with no misunderstood report
 *    Some    = dedicated kitchen, OR fresh staff confirmation,
 *              OR >= 2 fresh positive reports
 *    Limited = anything else (including only stale evidence)
 * 4. Any misunderstood report caps the level at "Some".
 *
 * The function also returns a human-readable breakdown so the UI can show
 * exactly why a level was given. A level is a summary of evidence, never a
 * promise about a kitchen.
 */

export interface SignalReport {
  kind: ReportKind
  date: string
  reviewed?: boolean
}

export interface VenueSignals {
  dedicatedNutFree: boolean
  staffConfirmedOn: string | null
  reports: SignalReport[]
}

export type FactorTone = 'positive' | 'neutral' | 'caution' | 'alert'

export interface Factor {
  label: string
  detail: string
  tone: FactorTone
}

export interface EvidenceResult {
  level: EvidenceLevel
  factors: Factor[]
  counts: { freshOk: number; staleOk: number; reactions: number; misunderstood: number }
  /** Weighted positive score: fresh = 1, stale = 0.25 */
  weightedPositives: number
}

export const STALE_WEIGHT = 0.25
const FRESH_POSITIVES_FOR_STRONG = 3
const FRESH_POSITIVES_FOR_SOME = 2

export function computeEvidence(signals: VenueSignals, now: Date = new Date()): EvidenceResult {
  const { dedicatedNutFree, staffConfirmedOn, reports } = signals

  const ok = reports.filter((r) => r.kind === 'ok')
  const freshOk = ok.filter((r) => !isStale(r.date, now)).length
  const staleOk = ok.length - freshOk
  const openReactions = reports.filter((r) => r.kind === 'reaction' && !r.reviewed).length
  const reviewedReactions = reports.filter((r) => r.kind === 'reaction' && r.reviewed).length
  const misunderstood = reports.filter((r) => r.kind === 'misunderstood').length

  const staffFresh = staffConfirmedOn !== null && !isStale(staffConfirmedOn, now)
  const staffStale = staffConfirmedOn !== null && !staffFresh

  const factors: Factor[] = []

  factors.push(
    dedicatedNutFree
      ? { label: 'Dedicated nut-free kitchen', detail: 'Reported as a nut-free kitchen. Confirm this is still current.', tone: 'positive' }
      : { label: 'Shared kitchen', detail: 'No dedicated nut-free kitchen reported; cross-contact is possible.', tone: 'neutral' },
  )

  if (staffConfirmedOn === null) {
    factors.push({ label: 'No staff confirmation on file', detail: 'Nobody has recorded a staff-confirmed allergy protocol.', tone: 'neutral' })
  } else if (staffFresh) {
    factors.push({ label: 'Staff-confirmed protocol', detail: `Confirmed ${staffConfirmedOn}, within the last 12 months.`, tone: 'positive' })
  } else {
    factors.push({
      label: 'Staff confirmation is out of date',
      detail: `Confirmed ${staffConfirmedOn}, over ${STALE_AFTER_DAYS / 365 * 12} months ago (${daysBetween(staffConfirmedOn, now)} days). Not counted. Re-confirm.`,
      tone: 'caution',
    })
  }

  if (ok.length === 0) {
    factors.push({ label: 'No positive reports', detail: 'No one has reported eating here without a reaction.', tone: 'neutral' })
  } else {
    factors.push({
      label: `${freshOk} recent positive report${freshOk === 1 ? '' : 's'}`,
      detail: staleOk > 0
        ? `Plus ${staleOk} older than 12 months, shown at ${STALE_WEIGHT * 100}% weight.`
        : 'All within the last 12 months.',
      tone: freshOk > 0 ? 'positive' : 'caution',
    })
  }

  if (misunderstood > 0) {
    factors.push({ label: `${misunderstood} "staff didn't understand" report${misunderstood === 1 ? '' : 's'}`, detail: 'Caps the level at "Some".', tone: 'caution' })
  }
  if (openReactions > 0) {
    factors.push({
      label: `${openReactions} reaction report${openReactions === 1 ? '' : 's'} (not yet reviewed)`,
      detail: 'Any reaction report holds the level at "Conflicting" until it has been reviewed.',
      tone: 'alert',
    })
  }
  if (reviewedReactions > 0) {
    factors.push({ label: `${reviewedReactions} reviewed reaction report${reviewedReactions === 1 ? '' : 's'}`, detail: 'Reviewed, so no longer holds the level down, but still shown in the timeline.', tone: 'caution' })
  }

  let level: EvidenceLevel
  if (openReactions > 0) {
    level = 'Conflicting'
  } else if (misunderstood > ok.length) {
    level = 'Conflicting'
    factors.push({ label: 'Mixed reports', detail: 'More "staff didn\'t understand" reports than positive ones.', tone: 'alert' })
  } else if (dedicatedNutFree && (staffFresh || freshOk >= FRESH_POSITIVES_FOR_STRONG) && misunderstood === 0) {
    level = 'Strong'
  } else if (dedicatedNutFree || staffFresh || freshOk >= FRESH_POSITIVES_FOR_SOME) {
    level = 'Some'
  } else {
    level = 'Limited'
  }

  if (staffStale && level === 'Limited') {
    factors.push({ label: 'Only older evidence', detail: 'Everything on file is more than 12 months old.', tone: 'caution' })
  }

  return {
    level,
    factors,
    counts: { freshOk, staleOk, reactions: openReactions + reviewedReactions, misunderstood },
    weightedPositives: freshOk + staleOk * STALE_WEIGHT,
  }
}

const ORDER: Record<EvidenceLevel, number> = { Strong: 3, Some: 2, Limited: 1, Conflicting: 0 }

export function evidenceRank(level: EvidenceLevel): number {
  return ORDER[level]
}

/** "Some evidence" or better, and not Conflicting. */
export function meetsSome(level: EvidenceLevel): boolean {
  return ORDER[level] >= ORDER.Some
}
