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

## Roadmap

The broader roadmap is documented in [../docs/alex-heritage-engine-roadmap.md](../docs/alex-heritage-engine-roadmap.md).
