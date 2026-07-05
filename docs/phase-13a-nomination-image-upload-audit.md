# Phase 13A Nomination Evidence Image Upload Baseline Audit

Date: 2026-07-03
Branch: `codex/phase-13a-nomination-image-upload`
Draft PR: #36

## Scope

This audit records the Phase 13A baseline before implementing local nomination evidence upload.

No upload code, Firestore rules, Storage rules, Hosting deploy, or rules deploy is included in this slice.

## Current Nomination Form

Files inspected:

- `nominate-place.html`
- `nominate-place.js`

Findings:

- `nominate-place.html` currently has a URL-only `Photo / evidence URL` field.
- The form text explicitly says photo upload will be added later.
- The form already collects `evidenceImageCaption`, `evidenceSourceCredit`, `evidenceRightsStatus`, and `evidencePermissionConfirmed`.
- `nominate-place.js` imports Firestore Auth and Firestore write helpers only.
- It does not import Firebase Storage.
- It builds the nomination payload from `FormData` and writes directly to `placeNominations` with `addDoc`.
- Debug mode logs a safe payload summary and skips the Firestore write.
- The current CSP already allows `firebasestorage.googleapis.com` in `connect-src`, and allows `blob:` and `https:` images.

## Current Evidence Helper Logic

Files inspected:

- `heritage-engine/nominations.js`
- `tests/payload-export.test.mjs`

Findings:

- `buildSubmittedNominationPayload` supports URL evidence through `evidenceImageUrl`.
- Evidence metadata is currently tied to a non-empty evidence URL.
- `evidenceVisibility` is set to `nomination-private` for URL evidence.
- Public disallowed nomination fields are recursively stripped before payload creation.
- The create allowlist does not include uploaded-file metadata such as `evidenceStoragePath`, `evidenceFileName`, `evidenceFileContentType`, `evidenceFileSize`, `evidenceUploadedAt`, or `evidenceUploadedByUid`.
- Existing tests cover URL evidence validation, blank evidence omission, private evidence stripping, public export safety, and rights status alignment.

## Current Admin Review Behavior

File inspected:

- `manage-nominations.html`

Findings:

- `renderEvidenceSection` displays review-only evidence metadata when present.
- Admins currently see evidence URL, caption, source/credit, rights status, permission confirmation, and visibility.
- HTTPS evidence URLs get an image preview.
- The admin note already warns that evidence is review-only and must not be copied automatically into public records.
- There is no current Storage import or private Storage path resolution in the admin page.

## Current Promotion Behavior

File inspected:

- `heritage-engine/promotion.js`

Findings:

- Promotion strips nomination-private fields before creating public place payloads.
- Promotion can copy `evidenceImageUrl` into public `imageUrl` only when:
  - URL is HTTPS;
  - `evidencePermissionConfirmed === true`;
  - `evidenceRightsStatus` is one of the public-safe statuses.
- `public-web-reference` and `unknown-needs-review` are intentionally not public promotion statuses.
- Uploaded evidence metadata should be added to the private promotion strip list before implementation.
- Upload metadata should not be mapped into public image fields by default.

## Firebase Config And Storage Baseline

Files inspected:

- `firebase.json`
- repository-wide Firebase Storage usage

Findings:

- `firebase.json` currently configures Hosting, Firestore rules, and the Firestore emulator.
- There is no Storage rules target in `firebase.json`.
- No `storage.rules` file exists in the repo.
- No Storage emulator config exists.
- Firebase Storage is currently used by `upload-article.html` for:
  - article HTML uploads under `articles/...`;
  - article image uploads under `article-images/...`.
- Many pages include the Storage bucket in Firebase config and CSP allows Firebase Storage, but nomination upload itself is not implemented.

## Current Tests

Files inspected:

- `package.json`
- `tests/payload-export.test.mjs`
- `tests/promotion.test.mjs`
- `tests/firestore.rules.test.mjs`
- `tests/place-contributions.test.mjs`
- `tests/admin-auth.test.mjs`

Findings:

- `npm test` currently runs admin auth, payload/export, promotion, place contribution, and Firestore rules tests.
- Firestore rules tests already cover nomination create/read/update boundaries and URL evidence metadata.
- Promotion tests cover public-safe URL evidence promotion and private evidence stripping.
- There is no Storage rules test script.
- There is no Storage emulator test harness.

## Smallest Safe Implementation Path

The first implementation commit should stay narrow:

1. Add one optional file input to `nominate-place.html` near the existing evidence URL section.
2. Import Firebase Storage in `nominate-place.js`.
3. Upload at most one selected local image before writing the nomination document.
4. Store uploaded-file metadata as nomination-private fields.
5. Keep the existing URL evidence path working.
6. Update `heritage-engine/nominations.js` to validate and allow the new uploaded-file metadata.
7. Update `manage-nominations.html` to render uploaded evidence for admin review.
8. Update `heritage-engine/promotion.js` so uploaded-file private fields are stripped and not promoted by default.
9. Add Firestore rules allowlist/validation for the new metadata fields.
10. Add Storage rules and Storage rules tests before any rules deploy.

Recommended initial uploaded-file metadata:

- `evidenceStoragePath`
- `evidenceDownloadUrl` only if needed for admin preview
- `evidenceFileName`
- `evidenceFileContentType`
- `evidenceFileSize`
- `evidenceUploadedAt`
- `evidenceUploadedByUid`

Recommended Storage path:

```text
nomination-evidence/{uid}/{draftId}/{fileId}
```

The path should be generated by the signed-in client and tied to `auth.currentUser.uid`.

## Exact Files For First Implementation Commit

Expected first implementation files:

- `nominate-place.html`
- `nominate-place.js`
- `heritage-engine/nominations.js`
- `manage-nominations.html`
- `heritage-engine/promotion.js`
- `firestore.rules`
- `storage.rules`
- `firebase.json`
- `package.json`
- `tests/payload-export.test.mjs`
- `tests/promotion.test.mjs`
- `tests/firestore.rules.test.mjs`
- new Storage rules test file, likely `tests/storage.rules.test.mjs`

Style-only updates may also be needed in:

- `style.css`

## Missing Storage Rules Harness

Storage rules work needs a new harness before deploy:

- add `storage.rules`;
- add `firebase.json` Storage rules and emulator config;
- add `tests/storage.rules.test.mjs`;
- add a package script such as `test:storage-rules`;
- include that script in `npm test`;
- use `@firebase/rules-unit-testing` Storage APIs to test signed-out, owner, wrong-owner, admin, file size, content type, read, and write cases.

No Firestore or Storage rules should be deployed until those tests pass locally and explicit deploy approval is given.

## Open Implementation Decisions

- Whether to store a long-lived `evidenceDownloadUrl`, only a private `evidenceStoragePath`, or both.
- Whether admins should preview uploaded images via Storage SDK access or via a stored download URL.
- Whether owner reads should be allowed after upload, or whether reads should be admin-only after submission.
- Exact file size and MIME allowlist.
- Whether non-image evidence files are in Phase 13A or whether the first slice should be image-only.

The safest first cut is one image-only upload, private Storage path metadata, admin preview through authenticated Storage access, and no public promotion from uploaded evidence until a later explicit public-safe promotion decision.
