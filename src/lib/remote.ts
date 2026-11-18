import type { Report, ReportKind } from './types'
import { supabase } from './supabase'

/**
 * Remote reports (Supabase). Only the report itself is sent: venue, kind, date,
 * optional note. The child's profile and trips never leave the device.
 *
 * Reads go through the `reports_public` view (notes appear only once approved);
 * writes go to `reports` and require a signed-in user.
 */
interface Row {
  id: string
  venue_id: string
  kind: ReportKind
  reported_on: string
  note: string | null
  reviewed: boolean
}

export async function fetchCommunityReports(): Promise<Report[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('reports_public')
    .select('id, venue_id, kind, reported_on, note, reviewed')
    .order('reported_on', { ascending: false })
    .limit(1000)
  if (error || !data) return []
  return (data as Row[]).map((r) => ({
    id: r.id,
    venueId: r.venue_id,
    kind: r.kind,
    date: r.reported_on,
    note: r.note ?? undefined,
    reviewed: r.reviewed,
    source: 'community' as const,
  }))
}

/** Ids of the signed-in parent's own reports whose notes have been approved. */
export async function fetchApprovedNoteIds(): Promise<Set<string>> {
  if (!supabase) return new Set()
  const { data, error } = await supabase.from('reports').select('id').eq('note_approved', true)
  if (error || !data) return new Set()
  return new Set((data as { id: string }[]).map((r) => r.id))
}

/** Returns true when the report was stored remotely. Fails (false) when not signed in. */
export async function pushReport(r: Report): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('reports').insert({
    id: r.id,
    venue_id: r.venueId,
    kind: r.kind,
    reported_on: r.date,
    note: r.note ?? null,
  })
  // 23505 = already stored (retry after a lost response): treat as synced.
  return !error || error.code === '23505'
}
