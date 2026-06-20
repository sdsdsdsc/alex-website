# Alex Heritage Engine

## Purpose

`heritage-engine` is the reusable logic layer for Alex's Photo Board.

It is not the visual website layer. It is not the Firebase database layer. It should contain reusable, testable helper functions for heritage platform workflows, especially logic that can be shared safely across public pages and future admin tools.

The goal is to make the system easier to maintain now and more reusable later, while keeping page behavior, data access, and public/private boundaries clear.

## Current Modules

### search.js

`search.js` contains public Places/search helpers, including:

- text normalization
- search text building
- public record filtering
- public filter matching
- sorting
- display location helpers
- map URL helpers
- unique option helpers

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no DOM rendering
- no `placeNominations` access
- no private or admin fields

### maps.js

`maps.js` contains public map and coordinate helpers, including:

- coordinate normalization
- latitude and longitude validation
- valid coordinate checks
- safe title and location helpers
- marker/search matching helpers
- place record URL building
- full map URL building
- nomination URL building from coordinates
- map status text helpers

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no direct Leaflet setup
- no `placeNominations` reads
- no `mapPoints` or `mapPolygons`
- no private or admin fields

### places.js

`places.js` contains public place record display helpers, including:

- public-safe formatting
- location, criteria, and status formatting
- coordinate display helpers
- related article URL helpers
- public place summary helpers
- public JSON-LD shaping helpers

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no DOM rendering
- no `placeNominations` access
- no private or admin fields

### export.js

`export.js` contains public-safe JSON-LD export helpers, including:

- public graph nodes for `communityPlaces`, `news`, and `history`
- public-safe relationship mapping between places and articles
- stable public record IDs
- public JSON-LD graph assembly
- stored JSON-LD merging that keeps unsafe fields out of the public export

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no DOM rendering
- no download behavior
- no `placeNominations` access
- no private or admin fields

### validation.js

`validation.js` contains shared constants and public-safe validation helpers, including:

- Local Heritage Listing-inspired criteria constants
- nomination and public record status constants
- unsafe public field name constants
- text, email, URL, criteria, and coordinate validation helpers
- public-safe unsafe field stripping and detection helpers

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no DOM rendering
- no download behavior
- no `placeNominations` reads
- no private or admin exposure

### nominations.js

`nominations.js` contains public nomination form helper logic, including:

- public-safe payload shaping
- required field validation
- evidence URL validation
- terms/privacy agreement validation
- public disallowed field stripping
- initial public nomination status helpers

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no DOM rendering
- no download behavior
- no admin review or promotion logic
- no `communityPlaces` writes

### audit.js

`audit.js` contains pure admin review history helper logic, including:

- review saved history entry building
- status changed history entry building
- promotion history entry building
- review history trimming and appending
- readable audit action labels
- review history display text helpers
- review history summary helpers

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no Firestore timestamp creation
- no DOM rendering
- no admin authentication checks
- no public exposure of private nomination or admin fields

### review.js

`review.js` contains pure admin review helper logic, including:

- review status labels and normalization
- allowed review status checks
- admin notes normalization
- admin criteria assessment field preparation
- review validation helpers
- review update payload shaping
- status-change helper flags

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no Firestore timestamp creation
- no DOM rendering
- no admin authentication checks
- no promotion or `communityPlaces` payloads

### promotion.js

`promotion.js` contains pure promotion helper logic, including:

- safe mapping from approved nominations to public `communityPlaces` payloads
- promoted place ID helpers
- promotion validation helpers
- private and admin field stripping
- promotion update payload shaping
- promotion history entry payload composition

Safety boundary:

- no Firebase imports
- no Firebase reads or writes
- no Firestore timestamp creation
- no DOM rendering
- no admin authentication checks
- no public user write path
- no private nomination or admin fields in promoted public place payloads

## What Should Stay Outside The Engine For Now

These responsibilities should currently stay in page scripts:

- Firebase initialization
- Firestore collection reads
- Firestore writes
- DOM event listeners
- DOM rendering
- Leaflet map initialization
- admin authentication checks
- admin review actions
- promotion writes
- backup downloads

## Manual Test Harness

`engine-test.html` can be opened through localhost to run lightweight checks against the pure engine helpers.

It tests engine modules without Firebase, is not linked from public navigation, and should be used before sensitive refactors.

It also includes combined admin workflow helper tests for the `audit.js`, `review.js`, `promotion.js`, and `validation.js` modules. These checks use sample nomination objects only; they do not touch Firebase and do not replace live admin workflow testing.

## Future Modules

Possible future modules, not yet implemented:

- `nominations.js`: shared validation and formatting helpers for nomination forms and nomination display.
- `review.js`: admin-side review helper logic, such as status labels and review field preparation.
- `promotion.js`: safe mapping helpers for promoting approved nominations into public community place records.
- `export.js`: reusable public-safe export shaping helpers, separate from Firebase reads and downloads.
- `places.js`: shared community place formatting, relationship, and display helpers.
- `validation.js`: common validation helpers for strings, dates, criteria, coordinates, and record status values.
- `audit.js`: helper logic for building admin review history entries and summarizing audit trails.

## Safety Rules

- Keep helpers pure where possible.
- Do not import Firebase in engine modules unless a later phase explicitly allows it.
- Do not write to Firestore from engine modules yet.
- Do not access private nomination or admin fields in public modules.
- Keep the public/private boundary explicit.
- Public users must never write directly to `communityPlaces`.
- Public search and map pages must read `communityPlaces` only.
- Do not restore `mapPoints` or `mapPolygons` workflows.
- Test each extraction before commit.

## Phase History

- Phase 10E created `heritage-engine/search.js`.
- Phase 10F created `heritage-engine/maps.js`.
- Phase 10G documents the engine folder.
- Phase 10H created `heritage-engine/places.js`.
- Phase 10I created `heritage-engine/export.js`.
- Phase 10J added `docs/phase-10-engine-checkpoint.md` as the safety checkpoint before sensitive workflow extraction.
- Phase 10L created `heritage-engine/validation.js` for shared public-safe constants and validation helpers.
- Phase 10M added `docs/phase-10m-nomination-extraction-plan.md` before nomination helper extraction.
- Phase 10N created `heritage-engine/nominations.js` for pure public nomination form helpers.
- Phase 10O added `docs/phase-10o-admin-review-promotion-plan.md` before admin review and promotion helper extraction.
- Phase 10P created `heritage-engine/audit.js` for pure review history and audit helper logic.
- Phase 10Q created `heritage-engine/review.js` for pure admin review helper logic.
- Phase 10R created `heritage-engine/promotion.js` for pure promotion payload helper logic.
- Phase 10S added combined admin workflow helper-chain tests to `engine-test.html`.
- Phase 10T-A began careful wiring of audit/review helpers into `manage-nominations.html` while keeping Firestore writes in the page script.
- Phase 10T-B carefully wired promotion helpers into `manage-nominations.html` while keeping Firestore writes in the page script.
- Phase 10U added `docs/phase-10-engine-closeout.md` as the final Phase 10 engine closeout checklist.
- Phase 10T-B carefully wired promotion payload helpers into `manage-nominations.html` while keeping Firestore writes in the page script.

## Roadmap

The broader roadmap history is documented in [../docs/archive/old-roadmaps/alex-heritage-engine-roadmap.md](../docs/archive/old-roadmaps/alex-heritage-engine-roadmap.md).
