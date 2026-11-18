export type EvidenceLevel = 'Strong' | 'Some' | 'Limited' | 'Conflicting'
export type ReportKind = 'ok' | 'reaction' | 'misunderstood'
export type Feasibility = 'Easier' | 'Moderate' | 'Challenging'
export type VenueType = 'restaurant' | 'bakery' | 'cafe'
export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type Traces = 'yes' | 'no' | 'unsure'

export interface Report {
  id: string
  venueId: string
  kind: ReportKind
  /** ISO date YYYY-MM-DD */
  date: string
  note?: string
  source: 'sample' | 'you' | 'community'
  /** Your own reports only: true once stored on the server. */
  synced?: boolean
  /** A reaction report stops capping the rating once reviewed. */
  reviewed?: boolean
}

export interface Profile {
  peanut: boolean
  treeNuts: boolean
  specificNuts: string[]
  traces: Traces
  epinephrine: 'yes' | 'no'
  name: string
}

export interface Venue {
  id: string
  destinationId: string
  name: string
  type: VenueType
  cuisine: string
  neighborhood: string
  blurb: string
  dedicatedNutFree: boolean
  staffConfirmedOn: string | null
  staffConfirmationNote?: string
  menuRiskFlags: string[]
  /** Schematic map position, 0..100 */
  x: number
  y: number
  /** Cuisine key used to tailor staff questions */
  questionSet: string
}

export interface Destination {
  id: string
  city: string
  country: string
  feasibility: Feasibility
  reason: string
  why: string
  riskPatterns: { title: string; detail: string }[]
  labeling: string
  primers: { cuisine: string; points: string[] }[]
  language: string
  emergencyNumber: string
  grocery: string
}

export interface TripMeal { slot: MealSlot; venueId: string | null }
export interface TripDay { id: string; label: string; meals: TripMeal[] }
export interface Trip { id: string; name: string; destinationId: string; days: TripDay[] }
