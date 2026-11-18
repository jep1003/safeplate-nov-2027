# Safe Plate — allergy-aware travel dining planner (MVP)

## Context
**Primary persona (updated):** Alice, 38, physician in Seattle, loves art, culture and food, travels internationally. She is now a **mother of a child with severe peanut and tree nut allergies** (previously the allergy was her own). Her pain: she struggles to plan trips because she doesn't know which restaurants, bakeries and cafes will work for her child. Occupation, age, interests and motivation are unchanged. The app speaks from a parent's point of view ("your child", "my child has...") and the profile and table card describe the child's allergy.

Alice-type families (child with severe peanut/tree-nut allergy) need pre-trip feasibility, evidence-based venue confidence (never "safe" verdicts), and a recovery path when a venue fails. Project dir is empty; Node isn't installed, so step 0 is fetching Node.

## Step 0 — Toolchain
- Download official Node LTS macOS arm64 tarball from nodejs.org into `~/.local/node` (user-approved; not system-wide), verify checksum against nodejs.org SHASUMS256, prepend to PATH for each command.

## Stack / layout (in project root)
Vite + React 18 + TypeScript + Tailwind CSS + react-router (HashRouter, so it works offline/static) + Vitest. No backend, no analytics.
```
src/
  lib/scoring.ts (+ scoring.test.ts)   pure evidence-level function, rules documented in comment
  lib/storage.ts                        typed localStorage wrapper (profile, trip, reports), try/catch safe
  lib/recency.ts                        12-month staleness helpers
  data/{destinations,venues,phrases}.ts clearly fictional seed data, "Sample data" flag on everything
  state/AppState.tsx                    React context: profile, trips, local reports
  components/                           EvidenceBadge, EvidenceBreakdown, DisclaimerNote, SampleDataTag, VenueCard, Filters, MapToggle (SVG schematic), ReportSheet
  screens/                              Onboarding, Explorer, DestinationDetail, VenueDetail, TripPlanner, Kit, Recovery
public/sw.js                            cache-first service worker (app shell + assets), registered in prod
```

## Scoring (src/lib/scoring.ts)
`computeEvidence(signals, now) -> { level, factors[] }` with levels Strong / Some / Limited / Conflicting.
- Reaction reports ≥1 (recent or not, unreviewed) → cap at Conflicting.
- Strong: dedicated nut-free kitchen AND (staff-confirmed within 12 months OR ≥3 fresh positives).
- Some: dedicated kitchen, OR fresh staff confirmation, OR ≥2 fresh positives.
- Limited: otherwise (incl. only stale reports; stale weighted 0.25 and flagged).
- Conflicting also when "staff didn't understand" reports outnumber positive.
- Returns human-readable breakdown lines the UI renders. Vitest cases: each level, reaction cap, staleness boundary at 12 months, staff-confirmation expiry, determinism.

## Screens (mobile-first 390px, then desktop)
Onboarding/profile (editable, localStorage) → Explorer (5 fictional cities: feasibility, reason, evidence-backed venue count) → Destination detail (why, risk patterns, primers, venues grouped restaurant/bakery/cafe with filters, list/map toggle w/ SVG placeholder) → Venue detail (breakdown, dated report timeline, tailored staff questions, report entry, recovery link) → Trip planner (days, pin venues to meals, warning when a day lacks a "Some evidence"+ meal) → At-the-table kit (large high-contrast card, 5 languages, placeholder translations flagged "verify with a native speaker", emergency section) → Fast report flow (3 taps + optional note/date; updates scoring live) → Recovery view (nearest alternatives sorted by evidence, grocery fallback, emergency info).

## Design / safety rules
- Warm travel-journal look: paper-cream background, ink text, terracotta/olive/ochre accents, serif display (system serif stack, no external fonts so offline works), subtle stamp/ticket motifs. Red only for reaction reports + emergency.
- Banned words "safe"/"guaranteed" as venue verdicts: add a test that scans seed data/labels; app title and city heading are the only uses ("Eating safely in [city]" as specified).
- Persistent disclaimer (guide not guarantee; confirm with staff; carry epinephrine) on every venue and destination page; "Sample data" tag everywhere.
- Reports >12 months visibly flagged and down-weighted.
- AA contrast (verified via computed ratios on palette tokens), ≥44px tap targets, focus rings, semantic landmarks, reduced-motion.

## Verification
`npm test` (Vitest), `npx tsc --noEmit`, `npm run build`, then run dev server and exercise in browser pane at 390px and desktop: onboarding → explorer → venue → report (evidence changes) → trip warning → kit language switch → recovery; confirm SW registers on preview build and app loads offline; grep build for "safe"/"guaranteed" misuse.
