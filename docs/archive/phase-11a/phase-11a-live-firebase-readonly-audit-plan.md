# Phase 11A Live Firebase Read-Only Audit Plan

## Purpose

This document plans a future read-only inspection and backup of live Firebase content before any cleanup decision. It does not authorize a live connection, data edit, deletion, migration, rules change, or deployment.

The future audit should answer three questions safely:

1. What records currently exist in the four active collections?
2. How do those records differ from the local Phase 11A snapshots?
3. Which records are strong, intentional regression samples, in need of polish, or candidates for later confirmation?

## Current Phase Boundary

Phase 11A-3 is documentation only. During this phase:

- do not connect to Firebase
- do not download live data
- do not add credentials or private keys
- do not change Firebase configuration
- do not create an audit, migration, or cleanup script
- do not change application code or Firestore rules

Any future live audit requires a separate explicit instruction.

## Approved Read Scope

A future authorized audit may read only these collections:

| Collection | Purpose | Data handling |
| --- | --- | --- |
| `communityPlaces` | Public community heritage records | May be reviewed for a public-safe worksheet after privacy checks |
| `news` | Public news articles | May be reviewed for a public-safe worksheet after privacy checks |
| `history` | Public history stories | May be reviewed for a public-safe worksheet after privacy checks |
| `placeNominations` | Private nomination and admin review workflow | Private backup and admin-only inspection only |

Do not add retired or unrelated collections to the audit scope without a separate review. In particular, do not restore or inspect `mapPoints`, `mapPolygons`, or old `posts` as part of this active-data audit.

## Public Export Boundary

The public Open Data / `heritage.json` export must continue to read only:

- `communityPlaces`
- `news`
- `history`

`placeNominations` must never be included in the public export, public worksheets, public downloads, or public JSON-LD graph.

The existing admin backup workflow is separate from the public export. It is designed to make private, authenticated, read-only backups of the four approved collections. A future audit should use that existing protected pathway only after confirming admin authentication and current Firestore read permissions. It should not add another public endpoint or new script.

## Private Field Boundary

The following fields must never be copied from `placeNominations` into public documentation, `communityPlaces`, articles, or `heritage.json`:

- `nominatorEmail`
- `adminNotes`
- `adminHistoricInterest`
- `adminArchitecturalInterest`
- `adminCommunityValue`
- `adminConditionRisk`
- `adminAssessmentSummary`
- `reviewHistory`

Also treat nomination free text, evidence URLs, contributor details, organisation details, and any unexpected personal information as private until manually reviewed.

## Preconditions For A Future Live Audit

Before connecting:

1. Obtain explicit approval for the live read-only audit.
2. Confirm the operator is using the existing authorized admin account.
3. Confirm the audit page is the private Admin Export / Backup page, not the public Open Data page.
4. Confirm the current code path uses read operations only.
5. Confirm no deploy, rules edit, import, migration, cleanup, or data-edit task is running at the same time.
6. Prepare a private, access-controlled destination outside the public repository for full backups.
7. Record the audit date and the expected four-collection scope without recording credentials.

Do not place service-account files, authentication tokens, private keys, or full private backups in this repository, issue trackers, chat transcripts, or public cloud folders.

## Backup Before Cleanup

The future audit should create a complete private baseline before any later cleanup phase:

1. Download separate private backups for `communityPlaces`, `news`, `history`, and `placeNominations` through the authenticated admin backup page.
2. Download the combined all-data backup as a second recovery reference.
3. Preserve each document ID, field value, nested object, array, and timestamp representation.
4. Record the export time and record count for each collection.
5. Verify that the separate collection counts match the corresponding sections in the combined backup.
6. Store the original downloads unchanged in a private, access-controlled location.
7. Create working copies for analysis; never edit the original baseline files.
8. Confirm that no backup file has been added to Git or a public website directory.

The existing admin backup covers Firestore documents. It does not by itself prove that linked Firebase Storage files have been backed up. If a later cleanup includes article HTML, images, or evidence files, create a separate approved storage-backup plan before touching those assets.

## Read-Only Inspection Sequence

After the private backup is verified:

1. Count records in each approved collection.
2. List document IDs in a private working area.
3. Check required and expected fields without changing values.
4. Validate coordinates, statuses, criteria vocabulary, dates, and relationship shapes.
5. Cross-check `relatedArticles` and `relatedPlaces` by collection and stable ID.
6. Check public collections for nomination-private or admin-only fields.
7. Review `placeNominations` only in the private admin context.
8. Record findings in a redacted worksheet using the classifications below.

Read order should be `communityPlaces`, `news`, `history`, then `placeNominations`. This makes the public relationship targets known before private nomination records are reviewed.

## Redacted Audit Worksheet

The committed or shareable worksheet must contain findings, not full record exports.

For public collections, it may include:

- collection name
- document ID
- public title
- field-presence and format findings
- relationship status
- classification
- recommended later action
- whether user confirmation is needed

For `placeNominations`, use a generic audit reference such as `nomination-001` in public-safe documentation. Keep any mapping to the real document ID in the private working area only. Do not copy:

- names or email addresses
- admin notes or assessment text
- review-history notes
- organisation or contact details
- evidence URLs or captions that may identify a person
- free-text excerpts that may contain personal information

Safe nomination findings should be generic, for example:

- required fields present
- invalid coordinate format
- criteria vocabulary needs review
- status inconsistent with promotion metadata
- private fields remain private
- sample/regression role needs confirmation

Before saving a redacted worksheet in the repository:

1. Review every nomination row manually.
2. Search the draft for email addresses and copied private values.
3. Confirm no full backup payload or evidence URL is embedded.
4. Confirm public records do not expose any prohibited private field value.

## Comparing Live Data With Local Worksheets

Use these local baselines:

- `docs/phase-11a-communityplaces-audit-worksheet.md`
- `docs/phase-11a-news-history-audit-worksheet.md`
- `data/communityPlaces.json`
- the dated local article-storage audit report

Compare by stable collection name and document ID:

1. Mark records present both locally and live.
2. Mark records present live but absent locally as `live-only`; do not treat them as unwanted.
3. Mark records present locally but absent live as `snapshot-only`; do not recreate them automatically.
4. Compare field presence, status, coordinates, dates, categories, asset types, criteria, and relationships.
5. Treat local storage timestamps separately from Firestore article ordering dates.
6. Verify the known regression records before any cleanup classification:
   - `communityPlaces / old-anyuan-company-community-park`
   - `communityPlaces / jiangxi-test-community-square`
   - `history / FQrThxwuD7ZRtqxiAduC`
7. Verify whether locally reported article records still exist before carrying forward old findings.

A difference between live data and a local snapshot is an audit finding, not permission to edit, delete, restore, or migrate a record.

## Classification Rules

Use one primary classification per record, with concise supporting notes:

### Strong Public Record

Use when a public record has a clear title, usable content, suitable public fields, valid relationships or coordinates where relevant, and no visible private/admin data.

### Sample / Regression Record

Use when a record intentionally protects a tested page, relationship, map, export, nomination, review, or promotion workflow. Preserve it until its regression purpose is explicitly retired.

### Needs Polish

Use when a record is legitimate but has weak wording, missing optional heritage detail, inconsistent vocabulary, incomplete relationships, or another correctable content-quality issue.

### Privacy Check Needed

Use when a public record contains a prohibited field, unexpected personal data, uncertain evidence material, or content requiring private review. Do not reproduce the sensitive value in the worksheet.

### Possible Cleanup Later

Use only when a record may be obsolete, duplicated, incomplete, or test-only and its purpose is not yet confirmed. This label is not a deletion instruction. It requires backup, manual review, and explicit user confirmation.

## Collection Review Focus

### `communityPlaces`

Review stable IDs, titles, descriptions, coordinates, location fields, `category`, `assetType`, significance, criteria, sources, `recordStatus`, `relatedArticles`, and private-field absence.

### `news`

Review headlines, public relevance, body source (`htmlContent`, `content`, or `htmlUrl`), image references, ordering date, `relatedPlaces`, and private-field absence.

### `history`

Review titles, story quality, body source, image references, ordering date, historical/public relevance, `relatedPlaces`, and private-field absence.

### `placeNominations`

Review privately for completeness, criteria vocabulary, coordinates, status, review metadata, promotion metadata, sample role, and protection of personal/admin information. Do not assess it through the public export.

## Decision Gates After The Audit

The audit may produce recommendations only. Before any later edit or cleanup:

1. Confirm the private baseline backup is readable and complete.
2. Confirm sample and regression records to preserve.
3. Review all privacy-check findings privately.
4. Verify relationship targets before changing either side of a link.
5. Separate content polish from deletion decisions.
6. Prepare a record-by-record proposed action list.
7. Obtain explicit user confirmation for each cleanup scope.
8. Perform any future change in a separate, narrowly scoped phase.

## What Not To Do

- Do not delete documents or storage files.
- Do not edit document fields.
- Do not migrate or import data.
- Do not change Firestore rules.
- Do not deploy Firebase changes.
- Do not expose `placeNominations` publicly.
- Do not include `placeNominations` in `heritage.json`.
- Do not copy private/admin fields into public records or documentation.
- Do not infer that a live-only, snapshot-only, incomplete, or test-looking record is safe to remove.
- Do not commit full admin backups to the repository.

## Expected Outputs Of A Future Authorized Audit

- private immutable backups of all four approved collections
- verified collection record counts
- a private detailed working review
- a redacted public-safe worksheet
- a live-versus-local comparison
- a protected list of sample/regression records
- a list of records needing content polish
- a list of privacy checks requiring private resolution
- a list labelled `possible cleanup later`, awaiting explicit confirmation

None of these outputs authorizes a Firebase data change.
