# Alex Heritage Engine Roadmap

## What the Engine Means

The Alex Heritage Engine is the future reusable logic layer underneath Alex's Photo Board.

The website is the public and admin interface. Firebase is the database. The engine should eventually sit between them as organized modules that handle common rules, formatting, validation, search, promotion, and export behavior.

This roadmap describes the intended architecture before any refactor begins. It does not require moving code yet.

## Current Layers

### Public Website Layer

- Home
- News
- History
- Get involved
- Criteria
- Guidance
- Map
- Places
- Open Data

### Admin Website Layer

- Admin dashboard
- Manage community places
- Manage nominations
- Manage articles
- Admin export / backup

### Data Layer

- `communityPlaces`
- `placeNominations`
- `news`
- `history`

### Open Data / Export Layer

- `heritage.json`
- Admin backup exports

## Current Workflows

### A. Public Nomination Workflow

Public user submits nomination -> writes to `placeNominations` only.

Public nomination submission must not create or update `communityPlaces`.

### B. Map Nomination Workflow

User starts from the map -> coordinates are passed to `nominate-place.html` -> public submission writes to `placeNominations` only.

The map nomination handoff should remain a coordinate helper, not a direct place-record creation path.

### C. Admin Review Workflow

Admin filters and searches nominations -> changes status -> saves private notes -> saves admin criteria assessment -> `reviewHistory` records review actions.

Review actions remain admin-side and should not appear on public place pages.

### D. Promotion Workflow

Approved nomination -> admin promotes -> creates a public `communityPlaces` record.

Private fields are not copied during promotion. Excluded fields include nominator contact details, admin notes, admin assessment fields, `reviewHistory`, and private review data.

### E. Public Discovery Workflow

Places, search, map, and `place.html` read `communityPlaces` only.

Public discovery should not read `placeNominations` or expose nomination review fields.

### F. Export Workflow

Public `heritage.json` exports public-safe data.

Admin export / backup downloads private internal backups for the site owner. These backups may contain private nomination review information and must not be published publicly.

## Public / Private Data Boundary

### Public Collections and Records

- `communityPlaces`
- `news`
- `history`
- Public `heritage.json`

### Private / Admin-Only Data

- `placeNominations`
- `nominatorEmail`
- `adminNotes`
- Admin assessment fields
- `reviewHistory`
- Admin backup files

This boundary should remain explicit in code, documentation, exports, and Firestore rules.

## Future Engine Modules

These modules are proposed future extraction targets. Do not implement them until a specific refactor phase begins.

### `heritage-engine/places.js`

Handles `communityPlaces` normalization and public-safe place formatting.

Possible responsibilities:

- Normalize titles, locations, coordinates, criteria, and record status.
- Build public place summaries for search, map, and record pages.
- Keep private nomination fields out of public place data.

### `heritage-engine/nominations.js`

Handles nomination payload shape, validation helpers, and the public/private boundary.

Possible responsibilities:

- Build public nomination payloads.
- Validate optional evidence URL fields.
- Keep public submissions limited to `placeNominations`.
- Prevent public users from writing admin-only fields.

### `heritage-engine/review.js`

Handles status changes, admin assessment, and `reviewHistory` entries.

Possible responsibilities:

- Normalize review statuses.
- Build review history entries.
- Apply admin assessment field defaults.
- Keep review actions private/admin-side.

### `heritage-engine/promotion.js`

Handles safe promotion from `placeNominations` to `communityPlaces`.

Possible responsibilities:

- Build public `communityPlaces` payloads from approved nominations.
- Exclude private fields from promoted records.
- Keep promotion writes narrow and predictable.

### `heritage-engine/search.js`

Handles public search and filter logic for `communityPlaces`.

Possible responsibilities:

- Normalize searchable text.
- Match category, asset type, location, and heritage criteria filters.
- Sort public search results.
- Keep public discovery limited to `communityPlaces`.

### `heritage-engine/export.js`

Handles public-safe export and private backup export helpers.

Possible responsibilities:

- Build public JSON-LD output for `heritage.json`.
- Keep private nomination/admin fields out of public exports.
- Build private internal admin backup payloads.
- Keep public export and admin backup behavior clearly separated.

### `heritage-engine/maps.js`

Handles coordinate parsing, map handoff, and map display helpers.

Possible responsibilities:

- Parse and validate latitude/longitude.
- Build `nominate-place.html?lat=...&lng=...` links.
- Build map links from place records.
- Keep map display connected to `communityPlaces`, not retired map collections.

## Refactor Principles

- Do not change working behavior while extracting modules.
- Move one workflow at a time.
- Keep the public/private boundary explicit.
- Keep Firestore writes narrow.
- Keep public exports safe.
- Test after every module extraction.
- Never reintroduce `mapPoints` or `mapPolygons`.
- Never let public users write directly to `communityPlaces`.

## Suggested Future Phases

- Phase 10C - Extract shared navigation/header safely, if useful.
- Phase 10D - Extract public search helpers.
- Phase 10E - Extract nomination form helpers.
- Phase 10F - Extract admin review helpers.
- Phase 10G - Extract promotion payload builder.
- Phase 10H - Extract export/backup helpers.
- Phase 10I - Engine documentation update and testing checklist.

## Testing Checklist for Future Engine Extraction

- [ ] Public nomination still writes only to `placeNominations`.
- [ ] Map nomination coordinate handoff still works.
- [ ] Admin review still saves status, notes, and assessment.
- [ ] `reviewHistory` still records actions.
- [ ] Promotion still excludes private fields.
- [ ] Places, search, and map still read `communityPlaces` only.
- [ ] `place.html` still reads `communityPlaces` only.
- [ ] `heritage.json` remains public-safe.
- [ ] Admin backup remains private/internal.
- [ ] No `mapPoints` or `mapPolygons` workflow is restored.

## Notes for Future Work

The engine should be extracted only when it reduces duplication or makes workflow boundaries safer. Until then, the existing site pages can continue to use their current scripts.

The first successful engine phases should feel boring: same behavior, clearer code ownership, and stronger confidence that public and private data do not cross accidentally.
