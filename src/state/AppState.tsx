import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Profile, Report, Trip, Venue } from '../lib/types'
import { repository } from '../lib/storage'
import { computeEvidence, type EvidenceResult } from '../lib/scoring'
import { fetchApprovedNoteIds, fetchCommunityReports, pushReport } from '../lib/remote'
import { remoteEnabled } from '../lib/supabase'
import { useAuth } from './Auth'
import { sampleReports, venues } from '../data/venues'

export type NoteStatus = 'review' | 'unsent' | null

interface AppState {
  profile: Profile | null
  saveProfile: (p: Profile) => void
  reportsFor: (venueId: string) => Report[]
  addReport: (r: Omit<Report, 'id' | 'source'>) => void
  evidenceFor: (v: Venue) => EvidenceResult
  trips: Trip[]
  saveTrips: (t: Trip[]) => void
  now: Date
  /** True when reports are shared through Supabase (otherwise they stay on this device). */
  sharedReports: boolean
  /** Sharing is on but nobody is signed in, so a report can't be sent yet. */
  needsSignIn: boolean
  /** For your own reports: is the note waiting for approval, or not yet sent? */
  noteStatus: (r: Report) => NoteStatus
}

const Ctx = createContext<AppState | null>(null)
/** crypto.randomUUID only exists on https or localhost; fall back so plain-http testing on a phone works. */
function newId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth()
  const userId = session?.user.id ?? null
  const [profile, setProfile] = useState<Profile | null>(() => repository.getProfile())
  const [userReports, setUserReports] = useState<Report[]>(() => repository.getReports())
  const [community, setCommunity] = useState<Report[]>([])
  const [approved, setApproved] = useState<Set<string>>(new Set())
  const [trips, setTrips] = useState<Trip[]>(() => repository.getTrips())
  const now = useMemo(() => new Date(), [])

  const saveProfile = useCallback((p: Profile) => { setProfile(p); repository.saveProfile(p) }, [])
  const saveTrips = useCallback((t: Trip[]) => { setTrips(t); repository.saveTrips(t) }, [])

  const markSynced = useCallback((id: string) => {
    setUserReports((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, synced: true } : r))
      repository.saveReports(next)
      return next
    })
  }, [])

  // On load and whenever you sign in or out: pull community reports, load which of your
  // notes are approved, and retry any of your reports that never reached the server.
  useEffect(() => {
    if (!remoteEnabled) return
    let cancelled = false
    fetchCommunityReports().then((rows) => { if (!cancelled) setCommunity(rows) })
    if (userId) {
      fetchApprovedNoteIds().then((ids) => { if (!cancelled) setApproved(ids) })
      for (const r of repository.getReports()) {
        if (!r.synced && UUID.test(r.id)) pushReport(r).then((ok) => { if (ok && !cancelled) markSynced(r.id) })
      }
    } else {
      setApproved(new Set())
    }
    return () => { cancelled = true }
  }, [userId, markSynced])

  const addReport = useCallback((r: Omit<Report, 'id' | 'source'>) => {
    const report: Report = { ...r, id: newId(), source: 'you', synced: false }
    setUserReports((prev) => {
      const next = [...prev, report]
      repository.saveReports(next)
      return next
    })
    // Saved on this device first, so it works offline; shared when signed in and online.
    pushReport(report).then((ok) => { if (ok) markSynced(report.id) })
  }, [markSynced])

  const reportsFor = useCallback(
    (venueId: string) => {
      const mine = new Set(userReports.map((r) => r.id))
      return [...sampleReports, ...userReports, ...community.filter((r) => !mine.has(r.id))]
        .filter((r) => r.venueId === venueId)
        .sort((a, b) => b.date.localeCompare(a.date))
    },
    [userReports, community],
  )

  const evidenceFor = useCallback(
    (v: Venue) => computeEvidence({ dedicatedNutFree: v.dedicatedNutFree, staffConfirmedOn: v.staffConfirmedOn, reports: reportsFor(v.id) }, now),
    [reportsFor, now],
  )

  const noteStatus = useCallback((r: Report): NoteStatus => {
    if (!remoteEnabled || r.source !== 'you' || !r.note) return null
    if (!r.synced) return 'unsent'
    return approved.has(r.id) ? null : 'review'
  }, [approved])

  const needsSignIn = remoteEnabled && !authLoading && !session

  const value = useMemo(
    () => ({ profile, saveProfile, reportsFor, addReport, evidenceFor, trips, saveTrips, now, sharedReports: remoteEnabled, needsSignIn, noteStatus }),
    [profile, saveProfile, reportsFor, addReport, evidenceFor, trips, saveTrips, now, needsSignIn, noteStatus],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp outside provider')
  return c
}

export const venueById = (id: string) => venues.find((v) => v.id === id)
