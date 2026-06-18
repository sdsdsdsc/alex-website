# Phase 11A Admin Export Safety Review

## Review Scope

This is a static, documentation-only review of the current admin and public export code. No page was opened against Firebase, no live data was read or downloaded, and no Firebase operation was performed.

Files reviewed include:

- `admin-export.html`
- `admin-export.js`
- `export.html`
- `export.js`
- `heritage-engine/export.js`
- `heritage-engine/validation.js`
- `.gitignore`
- the local `firestore.rules` review draft
- the Phase 11A planning documents and worksheets

There is no shared `firebase-init.js`. The admin and public export scripts each initialize Firebase locally with the existing client configuration. This review does not reproduce or change those configuration values.

## Overall Assessment

The current admin export is suitable in principle for a future small, authorized, read-only audit:

- it uses Firestore `getDocs` reads only
- it does not import or call Firestore write, update, or delete operations
- it waits for authentication and checks the configured admin identity before revealing backup actions
- it labels downloads as private/internal
- it keeps `placeNominations` in the admin backup context
- it remains separate from the public `heritage.json` export

The page should not be used live until the deployed Firestore rules are verified. The local rules file is labelled as a review draft and is not proof of production permissions. The client-side admin check improves the interface but is not a substitute for server-enforced Firestore rules.

No HTML or code change is required in this documentation phase. The visible warning text is already clear enough to support a carefully managed audit.

## Review Questions

### 1. Purpose Of `admin-export.html`

`admin-export.html` provides an authenticated, internal backup interface for the site owner. Its buttons download full-fidelity JSON copies of active Firestore collections for private backup and review.

It is not a cleanup, import, migration, editing, or public publishing tool. The JavaScript creates browser downloads from data returned by read-only collection queries.

### 2. Difference From Public Open Data

The two exports have different purposes and payloads:

| Area | Admin Export / Backup | Public Open Data / `heritage.json` |
| --- | --- | --- |
| Audience | Authorized administrator | Public visitors |
| Purpose | Private recovery and internal review | Public heritage reuse |
| Output | Full Firestore document data with backup metadata | Selected JSON-LD graph fields |
| Authentication | Admin session required by the page | Public |
| Nominations | Included only in private backup | Excluded |
| Filename pattern | Collection or all-data backup with a date | `heritage.json` |

The admin output must not be substituted for `heritage.json`, uploaded to the public site, or shared as open data.

### 3. Collections Available To Admin Export

The admin backup code explicitly lists four collections:

- `communityPlaces`
- `placeNominations`
- `news`
- `history`

The interface offers a separate download for each collection and one combined all-data download containing all four.

### 4. Private Nomination Context

Yes. `placeNominations` appears only in the authenticated admin backup interface. The page warns that nomination backups may contain nominator email, admin notes, admin assessment fields, review history, and submitted evidence fields.

The backup serializer intentionally preserves those fields because this is a recovery backup. It does not redact them. Therefore every nomination backup and every combined backup must be treated as private.

### 5. Public Export Collection Boundary

Yes. `export.js` explicitly reads only:

- `news`
- `history`
- `communityPlaces`

It does not query `placeNominations`. The public helper also accepts graph records only for `communityPlaces`, `news`, and `history`.

This is a sound collection-level boundary. It must remain unchanged.

### 6. Visible Private-Data Warnings

Yes. The admin page visibly states that:

- downloads may contain private review information
- admin backups must not be published publicly
- the page uses read-only Firestore requests
- the page is separate from public Open Data / `heritage.json`
- nomination backups may include private contact, review, assessment, history, and evidence fields

Backup payloads also include an internal/private warning string. This is useful metadata but does not enforce secure handling after download.

### 7. Accidental Git Commit Risk

There is a meaningful operational risk.

The generated backup filenames are distinct and clearly labelled, but `.gitignore` currently ignores credential-file patterns rather than generated backup files. It does not ignore patterns such as:

- `communityPlaces-backup-*.json`
- `placeNominations-backup-*.json`
- `news-backup-*.json`
- `history-backup-*.json`
- `alex-photo-board-backup-*.json`

Downloads normally go to the browser's download directory, but an operator could move or save them into the repository and accidentally stage them. The embedded warning does not prevent Git from tracking the file.

Recommended future hardening: add narrowly scoped backup filename patterns to `.gitignore` in a separate approved safety phase. Until then, store all admin downloads outside the repository and inspect `git status --short` after the audit.

### 8. Public/Private Export Confusion Risk

The risk is low but real because both workflows produce JSON downloads.

Current mitigations are good:

- distinct page titles
- distinct button labels
- private warning text
- dated `*-backup-*.json` filenames for admin data
- fixed `heritage.json` filename for public data
- `backupType: "admin-internal"` metadata in private payloads

The largest confusion risk is the combined admin backup, which contains public collections and `placeNominations` in one file. Its inclusion of public records does not make any part of that combined file public-safe.

Operator rule: only the file generated by the public Open Data page may be treated as `heritage.json`. Never rename an admin backup to `heritage.json`.

### 9. Firebase Storage Backup Risk

The admin export backs up Firestore document data only. It preserves fields such as URLs, but it does not download the linked file bytes from Firebase Storage.

Potentially unprotected linked assets include:

- article HTML files
- article and place images
- nomination evidence images or external evidence links
- other content referenced by URL fields

A valid Firestore backup may therefore point to a Storage object that is later moved or deleted. Any future Storage cleanup needs a separate read-only inventory and backup plan. The Firestore JSON backup is not sufficient evidence that the linked asset itself is recoverable.

### 10. Manual Operator Steps

Before a future authorized live audit:

1. Obtain explicit approval for the Firebase read-only session.
2. Verify the deployed Firestore rules, especially admin-only reads for `placeNominations`; do not rely only on the local draft or browser UID check.
3. Confirm the working tree is clean and contains no prior backup JSON files.
4. Prepare a private, access-controlled folder outside the repository and public website directories.
5. Sign in through the existing admin login and verify the page heading says `Admin Export / Backup`.
6. Read the private-data and read-only warnings before downloading anything.
7. Download the four separate collection backups and the combined backup.
8. Move downloads immediately to the prepared private folder if the browser used a general download directory.
9. Verify collection names, export timestamps, record counts, and internal warning metadata.
10. Confirm separate collection counts match the corresponding combined-backup sections.
11. Keep an unchanged baseline copy and use a separate private working copy for review.
12. Build only a redacted worksheet for repository documentation; never copy nomination-private values.
13. Sign out of the admin page when finished.
14. Run `git status --short` and confirm no backup file entered the repository.
15. Make no cleanup or editing decision during the export session.

## Additional Safety Findings

### Firestore Security Boundary

The UI checks the configured admin identity before showing backup controls. Actual protection of `placeNominations` depends on deployed Firestore rules. The local rules draft expresses admin-only nomination reads, but its comments explicitly say it may not represent a deployed change. Production rules must be verified separately before live use.

### Public JSON-LD Defense In Depth

The public export builds nodes from selected public fields and removes known prohibited top-level keys from stored JSON-LD. This substantially limits exposure, and the collection query excludes nominations entirely.

However, the stored JSON-LD filter is shallow. A prohibited field nested inside an otherwise allowed custom JSON-LD object would not be detected by that function. The validation module contains recursive unsafe-field helpers, but `export.js` and `heritage-engine/export.js` do not currently use them for a final recursive output check.

This is not evidence of a current data leak. It is a defense-in-depth gap to address in a separate code-hardening phase. Before a live audit result is considered public-safe, inspect public collection records for unexpected nested private fields.

### Backup Consistency

The combined backup reads four collections independently. If live records change while the download is being built, the result is not guaranteed to represent one atomic point in time. For this small site, use a quiet review window, retain export timestamps, and compare separate versus combined record counts.

### Backup Integrity

The page records timestamps and counts but does not create checksums or verify downloaded files after writing them. The operator should open the JSON files locally, confirm they parse, and retain the original files unchanged before any later cleanup phase.

## Do Not Do

- Do not upload admin backups to GitHub.
- Do not put admin backups in public folders or website deployment directories.
- Do not include `placeNominations` in `heritage.json`.
- Do not copy private nomination fields into public documentation.
- Do not rename an admin backup to `heritage.json`.
- Do not use admin export as a cleanup, migration, import, or editing tool.
- Do not delete or edit Firebase records during this phase.
- Do not assume Firestore document export also backs up Firebase Storage files.
- Do not treat the client-side admin check as a replacement for deployed Firestore rules.
- Do not commit credentials, tokens, private keys, or full backup payloads.

## Recommended Next Action

Before any live read-only audit, use a separate small safety-hardening phase to:

1. Add narrowly scoped admin-backup filename patterns to `.gitignore`.
2. Add a recursive public-export privacy assertion or test for nested unsafe fields.
3. Verify deployed Firestore rules through an approved read-only rules review.
4. Prepare the private backup destination and redacted worksheet template.

The existing warning text is adequate. No `admin-export.html` wording change is recommended at this stage.
