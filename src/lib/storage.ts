import type { Profile, Report, Trip } from './types'

/**
 * Persistence boundary. The MVP keeps everything on-device in localStorage
 * (no accounts, no backend, no analytics). When Supabase is added later,
 * implement this interface (it will become async) and swap `repository`
 * below; screens and state only talk to this interface.
 */
export interface Repository {
  getProfile(): Profile | null
  saveProfile(p: Profile): void
  getReports(): Report[]
  saveReports(r: Report[]): void
  getTrips(): Trip[]
  saveTrips(t: Trip[]): void
}

const KEYS = { profile: 'safeplate.profile.v1', reports: 'safeplate.reports.v1', trips: 'safeplate.trips.v1' }

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode / quota): keep working in memory */
  }
}

export const localRepository: Repository = {
  getProfile: () => read<Profile | null>(KEYS.profile, null),
  saveProfile: (p) => write(KEYS.profile, p),
  getReports: () => read<Report[]>(KEYS.reports, []),
  saveReports: (r) => write(KEYS.reports, r),
  getTrips: () => read<Trip[]>(KEYS.trips, []),
  saveTrips: (t) => write(KEYS.trips, t),
}

export const repository: Repository = localRepository
