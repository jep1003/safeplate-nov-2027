import { describe, expect, it } from 'vitest'
import { computeEvidence, meetsSome, type VenueSignals } from './scoring'
import { isStale } from './recency'

const NOW = new Date('2026-11-11T12:00:00Z')
const base: VenueSignals = { dedicatedNutFree: false, staffConfirmedOn: null, reports: [] }
const ok = (date: string) => ({ kind: 'ok' as const, date })

describe('computeEvidence', () => {
  it('Limited with no signals', () => {
    expect(computeEvidence(base, NOW).level).toBe('Limited')
  })

  it('Strong: dedicated kitchen + fresh staff confirmation', () => {
    const r = computeEvidence({ ...base, dedicatedNutFree: true, staffConfirmedOn: '2026-06-01' }, NOW)
    expect(r.level).toBe('Strong')
  })

  it('Strong: dedicated kitchen + 3 fresh positives', () => {
    const r = computeEvidence({ ...base, dedicatedNutFree: true, reports: [ok('2026-10-01'), ok('2026-09-01'), ok('2026-08-01')] }, NOW)
    expect(r.level).toBe('Strong')
  })

  it('Some: dedicated kitchen alone', () => {
    expect(computeEvidence({ ...base, dedicatedNutFree: true }, NOW).level).toBe('Some')
  })

  it('Some: fresh staff confirmation in a shared kitchen', () => {
    expect(computeEvidence({ ...base, staffConfirmedOn: '2026-09-01' }, NOW).level).toBe('Some')
  })

  it('Some: two fresh positives; one is not enough', () => {
    expect(computeEvidence({ ...base, reports: [ok('2026-10-01'), ok('2026-10-05')] }, NOW).level).toBe('Some')
    expect(computeEvidence({ ...base, reports: [ok('2026-10-01')] }, NOW).level).toBe('Limited')
  })

  it('stale positives never lift a venue above Limited', () => {
    const r = computeEvidence({ ...base, reports: [ok('2024-01-01'), ok('2024-02-01'), ok('2024-03-01')] }, NOW)
    expect(r.level).toBe('Limited')
    expect(r.counts.staleOk).toBe(3)
    expect(r.weightedPositives).toBeCloseTo(0.75)
  })

  it('expired staff confirmation is not counted', () => {
    const r = computeEvidence({ ...base, staffConfirmedOn: '2025-01-01' }, NOW)
    expect(r.level).toBe('Limited')
    expect(r.factors.some((f) => /out of date/.test(f.label))).toBe(true)
  })

  it('12-month boundary: 365 days is fresh, 366 is stale', () => {
    expect(isStale('2025-11-11', NOW)).toBe(false)
    expect(isStale('2025-11-10', NOW)).toBe(true)
  })

  it('any reaction report caps at Conflicting, even for the best venue', () => {
    const r = computeEvidence({
      dedicatedNutFree: true,
      staffConfirmedOn: '2026-10-01',
      reports: [ok('2026-10-01'), ok('2026-10-02'), ok('2026-10-03'), { kind: 'reaction', date: '2023-01-01' }],
    }, NOW)
    expect(r.level).toBe('Conflicting')
  })

  it('a reviewed reaction no longer caps the level', () => {
    const r = computeEvidence({ ...base, dedicatedNutFree: true, reports: [{ kind: 'reaction', date: '2025-01-01', reviewed: true }] }, NOW)
    expect(r.level).toBe('Some')
  })

  it('more misunderstood than positive reports is Conflicting', () => {
    const r = computeEvidence({ ...base, reports: [ok('2026-10-01'), { kind: 'misunderstood', date: '2026-10-02' }, { kind: 'misunderstood', date: '2026-10-03' }] }, NOW)
    expect(r.level).toBe('Conflicting')
  })

  it('a misunderstood report caps Strong at Some', () => {
    const r = computeEvidence({
      dedicatedNutFree: true, staffConfirmedOn: '2026-10-01',
      reports: [ok('2026-10-01'), ok('2026-10-02'), { kind: 'misunderstood', date: '2026-10-03' }],
    }, NOW)
    expect(r.level).toBe('Some')
  })

  it('is deterministic and does not mutate inputs', () => {
    const s: VenueSignals = { dedicatedNutFree: true, staffConfirmedOn: '2026-06-01', reports: [ok('2026-10-01')] }
    const copy = JSON.stringify(s)
    expect(computeEvidence(s, NOW)).toEqual(computeEvidence(s, NOW))
    expect(JSON.stringify(s)).toBe(copy)
  })

  it('always returns a breakdown', () => {
    expect(computeEvidence(base, NOW).factors.length).toBeGreaterThanOrEqual(3)
  })
})

describe('meetsSome', () => {
  it('treats Some and Strong as meeting the bar', () => {
    expect(meetsSome('Strong')).toBe(true)
    expect(meetsSome('Some')).toBe(true)
    expect(meetsSome('Limited')).toBe(false)
    expect(meetsSome('Conflicting')).toBe(false)
  })
})
