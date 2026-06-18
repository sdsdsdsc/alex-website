# Phase 11A Data Cleanup Audit Plan

## Purpose

This document is a read-only planning guide for Phase 11A. It describes how to audit the current Firebase content safely before any later cleanup, standardization, or deletion decisions.

This phase does not:

- edit Firebase data
- delete Firebase data
- change Firestore rules
- change public or admin behavior
- change the heritage-engine architecture

## Safety Boundaries

- Public pages must continue to read `communityPlaces`, `news`, and `history` only.
- Public nominations must continue to write only to `placeNominations`.
- Public users must never write directly to `communityPlaces`.
- `placeNominations` must remain private/admin-side and must not appear in `heritage.json`.
- Promotion from `placeNominations` into `communityPlaces` must continue to exclude private/admin fields.
- Any later deletion or cleanup must happen only after backup, manual review, and explicit confirmation.

## Current Collection Touchpoints

### `communityPlaces`

Reads in current code:

- `search.html` via `search.js`
- `map.html` via `map.js`
- `place.html` via `place.js`
- `export.html` via `export.js`
- `admin-export.html` via `admin-export.js`
- `manage-community-places.html` via inline admin Firestore logic
- `manage-nominations.html` during promotion checks and admin promotion workflow

### `news`

Reads in current code:

- `index.html` via `script.js`
- `news.html` via `script.js`
- `article.html` via `article.js`
- `export.html` via `export.js`
- `admin-export.html` via `admin-export.js`
- `manage-articles.html` via inline admin Firestore logic
- `upload-article.html` when editing an existing news article

### `history`

Reads in current code:

- `index.html` via `script.js`
- `history.html` via `script.js`
- `article.html` via `article.js`
- `export.html` via `export.js`
- `admin-export.html` via `admin-export.js`
- `manage-articles.html` via inline admin Firestore logic
- `upload-article.html` when editing an existing history article

### `placeNominations`

Admin read path in current code:

- `manage-nominations.html` via inline admin Firestore logic
- `admin-export.html` via `admin-export.js`

Public write path:

- `nominate-place.html` via `nominate-place.js`

## Helper Files That Affect Audit Outcomes

These files define public-safe shaping, validation, filtering, display, or workflow boundaries that the audit should respect:

- `heritage-engine/search.js`: public Places search, filtering, sorting, and option helpers
- `heritage-engine/maps.js`: public map coordinate, link, and matching helpers
- `heritage-engine/places.js`: public place display, criteria, location, relationship, and JSON-LD helpers
- `heritage-engine/export.js`: public-safe `heritage.json` shaping for `communityPlaces`, `news`, and `history`
- `heritage-engine/validation.js`: shared criteria, status, coordinate, text, and unsafe public field helpers
- `heritage-engine/nominations.js`: public nomination validation and safe payload shaping
- `heritage-engine/review.js`: admin review update normalization and validation
- `heritage-engine/promotion.js`: safe nomination-to-place promotion shaping and private field exclusion
- `heritage-engine/audit.js`: admin review history helpers

## Known Sample / Regression Records To Protect During Audit

These records are useful anchors for testing and should not be treated as disposable without explicit confirmation:

- `communityPlaces / old-anyuan-company-community-park`
- `communityPlaces / jiangxi-test-community-square`
- `history / FQrThxwuD7ZRtqxiAduC`

Also treat Phase 10 test nominations or promoted records as review candidates, not automatic deletions. Do not copy private nomination data such as emails or admin notes into this document.

## Audit Method

For each collection:

1. Export or review records through safe admin tooling or Firebase Console read-only inspection.
2. Record issues in a worksheet without copying private personal data into docs.
3. Separate:
   - keep as strong public record
   - keep as sample/regression record
   - revise later
   - possible delete later, pending confirmation
4. Do not delete or edit anything during the audit pass.

## Collection Audit Checklist

### `communityPlaces`

Check:

- stable document ID is present and URL-safe
- title is clear, public-facing, and not placeholder text
- description is readable and not too thin for a public record
- `lat` and `lng` exist and are valid where a mappable place is expected
- `location`, `city`, `district`, and `address` are not contradictory
- `category` values are consistent across similar records
- `assetType` values are consistent across similar records
- `localSignificanceSummary` is present where the place is meant to function as a stronger heritage record
- `heritageCriteria` values are valid and consistent with current criteria vocabulary
- `criteriaExplanation` is present where criteria are present
- `sourceReference` is present where factual claims need support
- `recordStatus` is suitable for public display
- `relatedArticles` links still point to real `news` or `history` records
- no private nomination or admin-only fields were copied into public place records

Possible review labels:

- missing required public field
- weak title
- weak description
- missing coordinates
- inconsistent category
- inconsistent asset type
- missing significance/criteria
- broken relationship
- safe sample record
- possible cleanup later

### `news`

Check:

- title is clear and public-facing
- article body exists in `htmlContent`, `content`, or valid `htmlUrl` workflow
- image is present where expected and not broken if used publicly
- `createdAt` exists where ordering depends on it
- article type is genuinely news, not history content better moved later
- `relatedPlaces` references point to real `communityPlaces` records when present
- descriptions, messages, or fallback text are not weak placeholders
- no admin-only or nomination-private fields appear in public articles

Possible review labels:

- weak headline
- weak body content
- missing date
- broken image
- broken related place
- duplicates another article
- sample/regression article
- possible cleanup later

### `history`

Check:

- title is clear and public-facing
- article body exists and is suitable for public reading
- `createdAt` exists where sort order depends on it
- history article is not actually news content
- `relatedPlaces` references point to real `communityPlaces` records when present
- summary/body is strong enough to justify public publication
- no admin-only or nomination-private fields appear

Possible review labels:

- weak title
- weak story text
- missing date
- broken related place
- duplicate or near-duplicate topic
- sample/regression article
- possible cleanup later

### `placeNominations`

Check privately in admin-only context:

- nomination title is specific enough for review
- description and `localSignificanceSummary` are usable
- `heritageCriteria` values match the current approved vocabulary
- `criteriaExplanation` is meaningful
- optional coordinates are valid when present
- `assetType`, `area`, and `address` are usable for later promotion
- nomination status reflects real workflow state
- admin review fields are stored only here, not copied publicly
- `reviewHistory` is coherent where review actions were tested
- promoted nominations have `promotedPlaceId` where appropriate
- sample/test nominations are clearly distinguishable from real long-term records

Privacy checks:

- do not copy `nominatorEmail` into public records
- do not copy `adminNotes` into public records or exports
- do not copy admin assessment fields into public records or exports
- do not copy `reviewHistory` into public records or exports

Possible review labels:

- incomplete nomination
- weak significance case
- invalid or missing coordinates
- needs admin review
- safe sample nomination
- possible cleanup later

## Suggested Audit Worksheet Template

Use one row per record in a spreadsheet or markdown table:

| Collection | Record ID | Public title | Status | Key issues | Keep as sample? | Possible delete later? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `communityPlaces` | | | | | | | |
| `news` | | | | | | | |
| `history` | | | | | | | |
| `placeNominations` | | | | | | | |

Notes for the worksheet:

- Do not paste nominator emails, admin notes, or other private personal data into shared docs.
- For private nomination review, describe the issue generically.
- Use `possible delete later` only after backup and explicit confirmation.

## Cleanup Decision Gates For Later Phases

Before any later edit or deletion phase:

1. Confirm backups exist.
2. Confirm regression/sample records to keep.
3. Confirm public pages still rely only on active collections.
4. Confirm no private nomination/admin fields will be exposed.
5. Confirm each proposed deletion candidate has been manually reviewed.
6. Get explicit confirmation before deleting any Firebase record.

## Expected Outputs Of Phase 11A

At the end of the audit, we should have:

- a reviewed list of strong records to keep
- a list of weak or incomplete records to improve
- a list of sample/regression records to preserve
- a list of possible deletion candidates for later confirmation
- a list of vocabulary cleanup targets such as inconsistent `category`, `assetType`, or criteria values
- a list of privacy checks to verify before any future export or promotion changes
