/** Reports and confirmations older than this are down-weighted and flagged. */
export const STALE_AFTER_DAYS = 365

const DAY_MS = 86_400_000

export function parseDate(iso: string): number {
  return Date.parse(`${iso.slice(0, 10)}T00:00:00Z`)
}

export function toISODate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

export function daysBetween(fromISO: string, now: Date): number {
  const nowUTC = Date.parse(`${toISODate(now.getTime())}T00:00:00Z`)
  return Math.floor((nowUTC - parseDate(fromISO)) / DAY_MS)
}

/** Stale means strictly older than 12 months (365 days). */
export function isStale(iso: string, now: Date): boolean {
  return daysBetween(iso, now) > STALE_AFTER_DAYS
}

export function ageLabel(iso: string, now: Date): string {
  const d = daysBetween(iso, now)
  if (d <= 0) return 'today'
  if (d < 31) return `${d} day${d === 1 ? '' : 's'} ago`
  const m = Math.round(d / 30.4)
  if (m < 12) return `${m} month${m === 1 ? '' : 's'} ago`
  const y = Math.floor(d / 365)
  return `${y} year${y === 1 ? '' : 's'} ago`
}

export function formatDate(iso: string): string {
  return new Date(parseDate(iso)).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  })
}
