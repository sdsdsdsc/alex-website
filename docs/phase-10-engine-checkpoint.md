# Phase 10 Engine Extraction Checkpoint

## Current Phase 10 Status

Completed Phase 10 work:

- 10A Public platform menu + information pages
- 10B Alex Heritage Engine roadmap document
- 10C Shared public navigation helper
- 10D Shared nav expanded to public pages
- 10E Public search helpers extracted
- 10F Map coordinate helpers extracted
- 10G Heritage engine README
- 10H Public place display helpers extracted
- 10I Public export JSON-LD helpers extracted
- 10K Lightweight engine test page / manual test harness
- 10L Shared validation constants and helpers extracted
- 10M Nomination helper extraction plan
- 10N Public nomination form helpers extracted
- 10O Admin review and promotion extraction plan
- 10P Audit / reviewHistory pure helpers extracted
- 10Q Admin review pure helpers extracted
- 10R Promotion payload pure helpers extracted
- 10S Combined admin workflow helper tests added
- 10T-A Audit/review helper wiring started in `manage-nominations.html`; promotion wiring remains deferred
- 10T-B Promotion helper wiring started in `manage-nominations.html`; Firestore writes remain in the page script
- 10U Final engine regression checklist and Phase 10 closeout documented in `docs/phase-10-engine-closeout.md`

Phase 10 is now documented as complete. Use the [Phase 10 Engine Closeout](phase-10-engine-closeout.md) for the final regression checklist, safety boundaries, test-data notes, and next-phase guidance.

## Current Engine Folder

`heritage-engine/` currently contains:

- `README.md`: explains the purpose, boundaries, and safety rules for the engine folder.
- `search.js`: public Places/search helper functions for filtering, sorting, display values, and map URLs.
- `maps.js`: public map and coordinate helpers for map links, coordinate validation, marker search matching, and nomination coordinate URLs.
- `places.js`: public place record display and formatting helpers for location, criteria, dates, related articles, summaries, and page-level JSON-LD.
- `export.js`: public-safe JSON-LD shaping helpers for community places, news, history, relationships, and export graph assembly.
- `validation.js`: shared public-safe constants and pure validation helpers for criteria, statuses, text, email, URLs, coordinates, and unsafe public fields.
- `nominations.js`: pure public nomination form helpers for validation, safe payload shaping, and initial submitted status.
- `audit.js`: pure admin review history helpers for audit entries, status-change notes, promotion notes, trimming, formatting, and summaries.
- `review.js`: pure admin review helpers for status labels, admin notes, assessment fields, review validation, and review update payload shaping.
- `promotion.js`: pure promotion helpers for safe public place payloads, promoted place IDs, promotion validation, private field stripping, and promotion update payload shaping.

Developer-only test page:

- `engine-test.html`: manual browser test harness for pure engine helpers. It is not linked from public navigation and does not use Firebase.

Sensitive workflow planning:

- `docs/phase-10m-nomination-extraction-plan.md`: documentation-first plan for future pure nomination helper extraction.
- `docs/phase-10o-admin-review-promotion-plan.md`: documentation-first plan for future admin review, audit, and promotion helper extraction.

## What Has Been Extracted Safely

- Search, filter, and sort helpers are now in `heritage-engine/search.js`.
- Map, coordinate, and link helpers are now in `heritage-engine/maps.js`.
- Public place display and formatting helpers are now in `heritage-engine/places.js`.
- Public JSON-LD shaping helpers are now in `heritage-engine/export.js`.

## What Still Stays Outside The Engine

These responsibilities still belong outside the engine:

- Firebase initialization
- Firestore reads
- Firestore writes
- DOM rendering
- DOM event listeners
- Leaflet map initialization
- nomination submission
- admin review
- promotion writes
- admin authentication
- admin export / backup downloads
- Firestore rules

## Public / Private Boundary

Critical boundary rules:

- Public discovery reads `communityPlaces` only.
- Public export reads `communityPlaces`, `news`, and `history` only.
- Public nomination writes to `placeNominations` only.
- Public users must never write directly to `communityPlaces`.
- `placeNominations` is private/admin-side.
- Private fields must not appear publicly:
  - `nominatorEmail`
  - `adminNotes`
  - `adminHistoricInterest`
  - `adminArchitecturalInterest`
  - `adminCommunityValue`
  - `adminConditionRisk`
  - `adminAssessmentSummary`
  - `reviewHistory`
  - admin backup metadata

## Current Public-Safe Engine Rule

- Current engine modules should not import Firebase.
- Current engine modules should not write to Firestore.
- Current public modules should not read `placeNominations`.
- Current public modules should not expose private/admin fields.
- Page scripts still own Firebase and DOM behavior.

## Testing Checklist

### Public Navigation

- Home opens
- News opens
- History opens
- Get involved opens
- Criteria opens
- Guidance opens
- Map opens
- Places opens
- Open Data opens

### Places/Search

- `search.html` loads
- `communityPlaces` records appear
- keyword search works
- filters work
- sort works
- clear filters works
- View record opens `place.html?id=...`
- View on map opens `map.html` or map coordinates

### Map

- `map.html` loads through localhost
- markers appear
- marker links open place records
- map nomination mode starts
- cancel nomination mode works
- map click redirects to `nominate-place.html?lat=...&lng=...`
- lat/lng auto-fill on nomination form

### Place Page

- `place.html?id=...` loads
- title/location/description display
- Local Heritage Record section displays
- heritage criteria display
- map link works
- related article links work
- JSON-LD display/script still works if present

### Open Data

- `export.html` loads
- public export/download works
- generated JSON is valid
- graph includes `communityPlaces`, `news`, `history`
- graph excludes `placeNominations` and private/admin fields

### Nomination

- `nominate-place.html` loads
- public form submits to `placeNominations` only
- public submission does not create `communityPlaces`
- evidence URL fields still work
- map lat/lng handoff still works

### Admin

- admin login still works
- manage nominations still loads
- filters/search/sort still work
- status update still works
- admin notes save
- admin assessment fields save
- `reviewHistory` records actions
- approved nomination promotion still works
- promoted `communityPlaces` record excludes private fields
- admin export/backup still downloads private backup

### Safety

- no `mapPoints` / `mapPolygons` restored
- no `placeNominations` in public export
- no private fields on public pages
- no Firebase writes added to engine modules
- no browser module import errors

### Engine Test Harness

- `engine-test.html` opens through localhost
- developer-only warning displays
- search helper tests pass
- map helper tests pass
- place helper tests pass
- export helper tests pass
- validation helper tests pass
- nomination helper tests pass
- audit helper tests pass
- review helper tests pass
- promotion helper tests pass
- combined admin workflow helper-chain tests pass
- no Firebase network calls are made by the test page
- no public navigation link points to the test page

## Next Recommended Phase

- Phase 11A - Data cleanup and content-quality pass

Before adding user accounts, GIS features, or a forum, clean test data carefully, standardize public place records, verify titles, criteria, and coordinates, and improve public data quality.

## Commit Guidance

Suggested commit message:

```text
Phase 10U: Add engine closeout checklist
```
