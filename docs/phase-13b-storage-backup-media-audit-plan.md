# Phase 13B Storage Backup and Media Audit Plan

This document defines the planning model for Firebase Storage backup, media inventory, orphan-file auditing, retention, and safe manual operations.

It is documentation only. It does not change code, Firestore rules, Firebase Storage settings, forms, export behavior, live Firebase data, or live Storage files.

## 1. Purpose of Phase 13B

Phase 13B focuses on Firebase Storage file-byte safety, not just Firestore document backup.

This matters now because the current project already appears to use Firebase Storage for article publishing:

- article HTML files are uploaded to Storage;
- article editor image uploads are sent to Storage;
- Firestore records store URLs that point to those files;
- Firestore admin backup does not preserve the actual file bytes.

If a Storage file is lost, deleted, replaced, or orphaned, a Firestore backup alone is not enough to restore it.

## 2. Current Storage Usage Found in the Inspected Files

The following Storage-related behavior was found in the inspected source:

### Confirmed current Storage usage

- `upload-article.html` imports `getStorage`, `ref`, `uploadBytes`, and `getDownloadURL`.
- Article HTML content is uploaded to Storage under:
  - `articles/${Date.now()}_${safeTitle}.html`
- Quill editor image uploads are sent to Storage under:
  - `article-images/${Date.now()}_${file.name}`
- `upload-article.html` stores the returned Storage download URL in Firestore as:
  - `htmlUrl`
  - `imageUrl`
- `upload-article.html` also writes JSON-LD fields including:
  - `jsonld.schema:contentUrl`
  - `jsonld.schema:image`

### Public and admin code that uses stored URLs

- `article.js` reads article `imageUrl`.
- `script.js` reads article `imageUrl` and article body candidates including `htmlUrl`.
- `heritage-engine/export.js` includes public-safe article `htmlUrl` as `schema:contentUrl` and article `imageUrl` as `schema:image` when present.
- `export.js` exports only `news`, `history`, and `communityPlaces`.
- `place.js` and `heritage-engine/places.js` read public place `imageUrl` when present.
- `manage-community-places.html` includes a public place `imageUrl` field, but no Storage upload helper was confirmed there in the inspected snippets. It appears to accept a URL field rather than upload bytes directly.

### Nomination media state

- `nominate-place.html` says photo upload will be added later.
- `nominate-place.html` currently accepts only an optional public HTTPS evidence URL.
- `nominate-place.js` writes nomination text and URL fields to Firestore only.
- `heritage-engine/nominations.js` shapes nomination payloads with:
  - `evidenceImageUrl`
  - `evidenceImageCaption`
  - `evidenceSourceCredit`
- No nomination file upload to Firebase Storage was found in the inspected nomination files.

### Public place image state

- Public place records can contain `imageUrl`.
- In the inspected files, public place image usage appears URL-based.
- A public place `imageUrl` may point to Firebase Storage or to an external URL, but the inspected files do not enforce one source.

### Storage folder and path evidence found

- Confirmed current Storage path patterns:
  - `articles/`
  - `article-images/`
  - `home page/` appears in hard-coded public image URLs on `index.html`
- Existing maintenance docs also mention:
  - `uploads/` as retired gallery cleanup scope

### Existing maintenance evidence found in the repo

- `maintenance/audit-article-storage.mjs` exists and is read-only.
- `maintenance/reports/article-storage-audit.html` exists.
- `maintenance/reports/article-storage-audit.csv` exists.
- `maintenance/reports/unreferenced-article-files-for-review.txt` is referenced by the maintenance README.
- `maintenance/delete-selected-article-files.mjs` exists but is intentionally destructive and out of scope for this phase.

### Not found in the inspected files

- No shared `firebase-config.js` file was found by filename search.
- No nomination Storage upload workflow was found.
- No separate shared article-upload helper file was found beyond the inline logic in `upload-article.html`.
- No Storage backup script was found for preserving file bytes.

## 3. Firestore Backup vs Storage Backup

The project needs to keep these two backup responsibilities separate:

- Firestore backup/export saves document fields and metadata.
- Firebase Storage backup must separately preserve the actual uploaded file bytes.

Practical consequences:

- A Firestore backup may preserve `htmlUrl`, `imageUrl`, `contentUrl`, or other file references.
- That does not mean the referenced Storage object was backed up.
- If a Storage file is deleted later, the Firestore document may still contain a URL, but that URL may become broken or unusable.
- `admin-export.html` and `admin-export.js` currently back up Firestore documents only.
- Existing Phase 11A notes already confirm this limitation.

The project should continue to treat:

- Firestore backup as document backup;
- Storage backup as file-byte backup;
- public export as a third, separate concern.

## 4. Proposed Storage Inventory Model

A future manual or scripted Storage inventory should record enough information to relate Storage files to Firestore records and admin review decisions.

Recommended inventory fields:

- `storagePath`
- `downloadUrl`
- `fileName`
- `contentType`
- `sizeBytes`
- `createdAt`
- `updatedAt`
- `linkedCollection`
- `linkedDocumentId`
- `linkedField`
- `linkedPublicUrl`
- `mediaCategory`
- `mediaVisibility`
- `rightsStatus`
- `reviewStatus`
- `backupStatus`
- `orphanStatus`
- `notes`

Suggested meaning and source:

- `storagePath`
  Usually from Storage object listing or decoded from a Firebase Storage download URL.

- `downloadUrl`
  From Firestore records when stored there, or reconstructed from Storage metadata if needed.

- `fileName`
  Usually derived from the final path segment of `storagePath`.

- `contentType`
  From Storage object metadata.

- `sizeBytes`
  From Storage object metadata.

- `createdAt` / `updatedAt`
  Prefer Storage metadata timestamps when available. Do not substitute Firestore article dates unless clearly marked as document dates rather than file dates.

- `linkedCollection`
  From Firestore comparison, such as `news`, `history`, or potentially another collection later.

- `linkedDocumentId`
  From Firestore comparison.

- `linkedField`
  Which field references the file, such as `htmlUrl`, `imageUrl`, or a later media field.

- `linkedPublicUrl`
  Public page URL that would surface the linked document, such as `article.html?...` or `place.html?...`, when applicable.

- `mediaCategory`
  Admin-assigned category such as article HTML, article image, public place image, external reference, or unknown.

- `mediaVisibility`
  Admin-reviewed visibility such as public, private, admin-only, external-reference-only, or hidden.

- `rightsStatus`
  Admin-reviewed rights state. This cannot be reliably inferred from Storage metadata alone.

- `reviewStatus`
  Admin-reviewed state such as current, needs review, restricted, or rejected.

- `backupStatus`
  Whether the file bytes were backed up, when, and under what backup manifest.

- `orphanStatus`
  Inventory conclusion such as linked, possible orphan, confirmed orphan, broken reference, or intentionally retained.

- `notes`
  Free-form review notes, including uncertainty, risk, or approval history.

Some fields come from Storage metadata, some from Firestore document inspection, and some require explicit admin review rather than automation.

## 5. Proposed Media-Link Audit Model

The future audit should compare Firestore records with Firebase Storage files in both directions.

The audit should identify:

- files referenced by Firestore records;
- files present in Storage but not referenced by Firestore;
- Firestore records that reference missing or inaccessible Storage files;
- public records that reference media with uncertain visibility or rights status;
- repeated duplicate URLs across records;
- external URLs that are not Firebase Storage files;
- article HTML files versus article image files as separate categories.

Suggested comparison steps:

1. Build a Firestore-side reference list from fields such as:
   - `htmlUrl`
   - `imageUrl`
   - later approved media metadata fields if added

2. Decode Firebase Storage paths from any Firebase Storage download URLs.

3. Build a Storage-side inventory from actual Storage objects under known prefixes such as:
   - `articles/`
   - `article-images/`
   - `home page/`
   - any future approved folders

4. Compare both sets to classify:
   - linked files
   - missing-file references
   - unreferenced files
   - external-only references

5. Separate findings by media type:
   - article HTML
   - article image
   - homepage/static asset
   - public place image
   - unknown/unclassified

The existing `maintenance/audit-article-storage.mjs` already shows one narrow version of this model for `articles/` against `news` and `history`. Phase 13B extends the planning model without changing or running that script.

## 6. Orphan-File Definition

The project should use more than one orphan category:

- `confirmed orphan`
  A Storage file with no Firestore reference and no known admin purpose after review.

- `possible orphan`
  A Storage file with unclear, outdated, partial, or uncertain linkage.

- `broken reference`
  A Firestore record points to a Storage file that is missing, inaccessible, or no longer valid.

- `external-only reference`
  A Firestore field points to a non-Storage URL, so the file is not in this Firebase Storage bucket.

- `intentionally retained file`
  A file that is not public or not currently linked, but is deliberately kept for audit, backup, legal, or recovery reasons.

Important safety rule:

No Storage file should be deleted only because it looks orphaned.

Deletion must require:

- backup first;
- manual review;
- explicit owner approval;
- clear written record of what is being deleted and why.

## 7. Backup Model

The project should plan for a safe Storage backup model without implementing it yet.

Recommended backup principles:

- keep Firestore document backup separate from Storage file backup;
- allow a manual backup option first;
- allow a scripted backup option later if explicitly approved;
- use timestamped backup folders;
- include a manifest file for every backup run;
- add checksums or hashes if practical;
- keep backup manifests with private admin archive material;
- never place private media backups in the public GitHub repo.

### Manual backup option

A manual backup workflow could later include:

- inventory first;
- identify target Storage prefixes;
- copy files to a private local or approved private cloud location;
- record a manifest with timestamps, paths, and counts;
- confirm which Firestore collections and fields were used for comparison.

### Scripted backup option for later

A future scripted workflow could later:

- enumerate Storage files;
- copy file bytes to a private backup target;
- generate a machine-readable inventory manifest;
- compare Firestore references with Storage objects;
- emit an audit report without deleting anything.

This phase does not create that script and does not approve running any CLI or cloud commands yet.

### Backup destination options

Possible future private destinations:

- an owner-controlled local external drive;
- an owner-controlled private cloud storage location;
- a secure private admin archive folder outside the public website repo.

### Manifest recommendation

Each backup set should have a manifest recording at least:

- backup date/time;
- operator/tester;
- source Firebase project and bucket;
- included prefixes;
- excluded prefixes;
- file count;
- total bytes if available;
- checksum summary if used;
- related Firestore inventory source;
- notes on unresolved orphans or broken references.

## 8. Suggested Future Backup Folder Structure

Proposed private/local backup structure for future use:

```text
private-backups/
  YYYY-MM-DD/
    firestore/
    storage/
      articles/
      article-images/
      home-page/
      unknown/
    manifests/
      storage-inventory.json
      firestore-export-summary.json
      audit-report.md
```

This is only a proposed private/local backup structure.

It should not be added to the public website repo unless separately approved. Private backup outputs should remain outside public GitHub Pages content and outside ordinary source control.

## 9. Retention and Deletion Policy Questions

The owner should make these decisions later before any deletion workflow:

- How long should rejected media be retained?
- Should admin-only evidence ever be deleted?
- Should public article images be retained indefinitely?
- What should happen when an article is deleted?
- What should happen when an article image is replaced?
- Should broken external URLs be archived as text-only references?
- Who can approve deletion?
- Should deletion always require two steps: backup first, delete later?
- Should there be a quarantine or review state before permanent deletion?
- Should Storage objects with uncertain rights status be retained but hidden until resolved?

Until those decisions exist, deletion should remain exceptional and manual.

## 10. Export Safety Rules

Storage planning must stay aligned with the public export boundary:

- `heritage.json` should not export nomination-private media.
- `heritage.json` should not export admin-only review media.
- `heritage.json` should not export hidden or rejected media.
- public media URLs should be exported only when visibility and rights status are safe for public release.
- Storage backup files and backup manifests must never become public by accident.
- Firestore backup and Storage backup are not the same as public export.

Current source evidence still supports the public export boundary:

- `export.js` reads only `news`, `history`, and `communityPlaces`;
- `placeNominations` is not part of public export;
- `heritage-engine/export.js` includes article `htmlUrl` and `imageUrl` only from public article records and includes public place `imageUrl` only from public place records;
- nomination evidence remains private and URL-only in the current model.

## 11. Recommended Phase 13C

Recommended next phase:

**Phase 13C — URL-only Media Rights Metadata Fields**

Recommended Phase 13C scope:

- add structured rights, review, and visibility metadata fields first;
- keep nomination evidence URL-only for now;
- do not add new public upload buttons yet;
- do not expand Storage uploads until the backup and audit model is accepted;
- preserve public/private export boundaries.

This keeps the project cautious: governance first, then safer media capability later.
