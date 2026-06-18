# Phase 10 Engine Closeout

## Purpose

Phase 10 separated reusable, testable engine helpers from page scripts while preserving the existing ownership boundaries. Firebase reads and writes, DOM behavior, authentication, and workflow coordination remain in the page scripts. The engine modules provide pure data validation, shaping, filtering, formatting, and workflow helper logic without taking control of browser or database operations.

## Final Phase 10 Engine Folder

`heritage-engine/` contains:

- `README.md`: documents the engine's purpose, modules, boundaries, safety rules, and phase history.
- `validation.js`: shared constants and pure validation helpers for public and workflow data.
- `search.js`: public Places search, filtering, sorting, option, location, and map URL helpers.
- `maps.js`: coordinate validation, map status, marker matching, and public map/place/nomination URL helpers.
- `places.js`: public place record formatting, relationship, summary, coordinate, and page-level JSON-LD helpers.
- `export.js`: public-safe JSON-LD node and graph shaping for places, news, history, and their relationships.
- `nominations.js`: public nomination validation and safe `placeNominations` payload shaping.
- `audit.js`: admin review history entry, append, trim, formatting, and summary helpers.
- `review.js`: admin review status, notes, assessment, validation, and update payload helpers.
- `promotion.js`: admin promotion eligibility, public place payload, private-field exclusion, and promotion update helpers.

## Page Scripts Now Using Engine Helpers

- `search.js` uses `heritage-engine/search.js`.
- `map.js` uses `heritage-engine/maps.js`.
- `place.js` uses `heritage-engine/places.js`.
- `export.js` uses `heritage-engine/export.js`.
- `nominate-place.js` uses `heritage-engine/nominations.js`.
- `manage-nominations.html` uses the audit, review, and promotion helpers.
- `engine-test.html` tests the engine modules without Firebase.

## What Still Stays Outside the Engine

- Firebase initialization
- Firestore reads
- Firestore writes
- `runTransaction`
- `addDoc`, `setDoc`, and `updateDoc`
- `serverTimestamp`
- admin authentication
- DOM query selectors
- event listeners
- success and error rendering
- confirmation dialogs
- public navigation rendering
- Firestore rules

## Critical Safety Boundaries Preserved

- Public nomination writes only to `placeNominations`.
- Public users never write directly to `communityPlaces`.
- Promotion into `communityPlaces` remains admin-side only.
- Promotion excludes `nominatorEmail`, `adminNotes`, admin assessment fields, and `reviewHistory`.
- Public search, map, and place pages read `communityPlaces` only.
- Public export reads `communityPlaces`, `news`, and `history` only.
- Public export does not include `placeNominations` or private/admin fields.
- `mapPoints` and `mapPolygons` remain retired.

## Final Regression Checklist

### Public Navigation

- [ ] Home
- [ ] News
- [ ] History
- [ ] Get involved
- [ ] Criteria
- [ ] Guidance
- [ ] Map
- [ ] Places
- [ ] Open Data

### Engine Test

- [ ] `engine-test.html` opens through localhost
- [ ] all tests pass
- [ ] no Firebase network calls from `engine-test.html`

### Places/Search

- [ ] records appear
- [ ] keyword search works
- [ ] filters work
- [ ] sort works
- [ ] clear filters works
- [ ] View record works
- [ ] View on map works

### Map

- [ ] markers appear
- [ ] marker links work
- [ ] nomination mode works
- [ ] lat/lng handoff works

### Place Page

- [ ] public record loads
- [ ] Local Heritage Record section appears
- [ ] map link works
- [ ] JSON-LD still works if present

### Open Data

- [ ] export works
- [ ] JSON is valid
- [ ] public graph includes `communityPlaces`, `news`, and `history`
- [ ] public graph excludes private/admin fields

### Nomination

- [ ] form loads
- [ ] lat/lng handoff works
- [ ] evidence URL validation works
- [ ] valid public nomination writes to `placeNominations` only
- [ ] no public write to `communityPlaces`

### Admin Review

- [ ] admin nominations page loads
- [ ] filters, search, and sort work
- [ ] admin notes save
- [ ] admin assessment fields save
- [ ] `reviewHistory` records `review_saved`
- [ ] `reviewHistory` records `status_changed`

### Promotion

- [ ] approved nomination promotes
- [ ] source nomination becomes promoted
- [ ] `promotedPlaceId` and `promotedAt` save
- [ ] `reviewHistory` records `promoted`
- [ ] `communityPlaces` record is created or updated
- [ ] promoted public record excludes private/admin fields
- [ ] public place page, search, and export can show the promoted public record safely

## Known Test Data Notes

Test nominations and promoted records may exist from Phase 10 testing. They can remain as sample data or be cleaned carefully later through Firebase Console. Do not delete production-like records without first creating a backup and confirming that they are safe to remove.

## Next Recommended Phase

**Phase 11A - Data cleanup and content-quality pass**

Before adding user accounts, GIS features, or a forum, clean test data, standardize place records, check titles, criteria, and coordinates, and improve the overall quality of the public data.

## Commit Guidance

Suggested commit message:

```text
Phase 10U: Add engine closeout checklist
```
