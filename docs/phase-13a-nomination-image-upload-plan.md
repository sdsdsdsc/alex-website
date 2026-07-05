# Phase 13A Nomination Evidence Image Upload Plan

Date: 2026-07-03
Branch: `codex/phase-13a-nomination-image-upload`
Base branch: `main`
Expected PR type: one longer-lived draft PR

## Goal

Allow signed-in users on `nominate-place.html` to upload a local evidence image or supporting file for a new place nomination.

The upload is needed because Local Heritage List-style nomination workflows commonly ask nominators to add photos or files from their device, describe what they show, accept terms, and upload that evidence before final submission. Alex's Photo Board currently supports URL-only evidence metadata, which is useful for web references but does not serve users who have their own local photo or document evidence.

Phase 13A should add upload capability while preserving the existing safety boundary: nomination evidence is review-only by default and must not become public unless admin promotion logic explicitly selects a public-safe image.

## Intended User Workflow

The first version should stay intentionally small:

1. A signed-in user opens `nominate-place.html`.
2. The user fills out the existing nomination form.
3. The user chooses one local image file or supporting evidence file.
4. The user adds caption, source, credit, and rights/permission status.
5. The user confirms the evidence can be shared for nomination review.
6. The client uploads the file to Firebase Storage.
7. The nomination payload stores review-only evidence metadata.
8. The nomination is submitted to `placeNominations` with `nominationStatus = "submitted"`.
9. Admins can view the evidence in `manage-nominations.html`.

Out of scope for this PR:

- place contribution workflow changes from PR #35
- public display of uploaded nomination evidence before approval
- multi-image gallery unless it is very small and clearly safe
- drag-and-drop upload
- image editing
- notification workflow
- broad promotion workflow redesign

## Involved Files

Likely application files:

- `nominate-place.html`
- `nominate-place.js`
- `heritage-engine/nominations.js`
- `manage-nominations.html`
- `heritage-engine/promotion.js`
- `style.css`

Likely rules and test files:

- `firestore.rules`
- `storage.rules` or the project's Firebase Storage rules target if it already exists elsewhere
- `firebase.json`
- `tests/payload-export.test.mjs`
- `tests/firestore.rules.test.mjs`
- Storage rules tests, added if the repo does not already have them

Likely documentation and verification files:

- this plan document
- a later live preview verification record for Phase 13A

## Firebase Storage Strategy

Uploaded nomination evidence should use a private, review-only Storage path. A likely path shape is:

```text
nomination-evidence/{uid}/{nominationDraftId}/{fileId}
```

The path should make ownership and cleanup practical without exposing the file publicly.

Initial Storage behavior:

- require a signed-in user for upload
- require the path UID to match `request.auth.uid`
- allow only bounded image/content types and file sizes
- prefer one uploaded file in the first slice
- store original filename only as metadata if needed, not as a trusted path component
- generate a stable Storage path before writing the nomination record
- treat the Storage download URL or Storage path as nomination-private metadata

Implementation should decide whether Firestore stores a `downloadURL`, a `storagePath`, or both. Storing `storagePath` is safer for admin-only access and cleanup; a download URL may be convenient for admin preview but must still be treated as private review data.

## Firestore Record Strategy

The nomination document should continue living in `placeNominations`.

Existing evidence fields should remain compatible:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`
- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

Phase 13A may add structured uploaded-file metadata if needed, such as:

- `evidenceStoragePath`
- `evidenceFileName`
- `evidenceFileContentType`
- `evidenceFileSize`
- `evidenceUploadedAt`
- `evidenceUploadedByUid`

Any new field should be review-only. The nomination record should keep `evidenceVisibility = "nomination-private"` for uploaded evidence unless a later approved promotion step intentionally creates public-safe place image fields.

The public `communityPlaces` record and public `heritage.json` export must not automatically inherit uploaded nomination evidence.

## Rules Strategy

Firestore rules should continue to own the nomination document boundary:

- signed-out users cannot create nominations
- signed-in users can create only their own submitted nomination
- users cannot submit admin or moderation fields
- uploaded evidence metadata must be optional, bounded, and tied to `request.auth.uid`
- submitted nomination evidence remains private to the owner and admins
- public reads of `placeNominations` remain denied

Storage rules should own the uploaded file boundary:

- signed-out users cannot upload nomination evidence files
- signed-in users can upload only under their own UID path
- file size and content type are bounded
- public reads are denied
- admins can read evidence files for review
- owner reads may be allowed while the nomination belongs to them, if rules can enforce that safely

No Firestore or Storage rules should be deployed without explicit approval.

## Admin Review Behavior

`manage-nominations.html` should let admins inspect submitted uploaded evidence during review.

Expected admin behavior:

- show the evidence caption/source/credit/rights metadata
- show an image preview when the uploaded evidence is a safe image type and admin access permits it
- provide a link or fallback label for non-previewable file types if supporting files are included
- keep the existing approval/rejection workflow intact
- preserve the warning that nomination evidence is review-only and should not be copied automatically into public records

Promotion behavior should remain conservative:

- approved nomination promotion continues to build public `communityPlaces` records safely
- uploaded evidence is not public by default
- promotion may copy an image only when existing promotion logic explicitly judges it public-safe
- nomination-private fields must stay out of public pages and public export

## Tests

Planned test coverage:

- helper payload accepts valid uploaded evidence metadata
- helper payload rejects invalid or oversized metadata values
- blank upload metadata is omitted from payloads
- existing URL-only evidence tests continue to pass
- public export still strips nomination-private evidence fields
- promotion does not publish uploaded evidence unless public-safe criteria are met
- Firestore rules allow valid submitted nomination records with upload metadata
- Firestore rules reject forged `submittedByUid` or `evidenceUploadedByUid`
- Firestore rules reject admin/moderation fields from public submitters
- Storage rules allow signed-in users to upload only under their own UID path
- Storage rules reject signed-out writes, wrong-UID writes, oversized files, and disallowed content types
- admin review can read the evidence needed for moderation

Validation command:

```bash
npm test
```

If Storage rules tests do not exist yet, add the smallest focused test harness needed for this PR.

## Firebase Preview Steps

Preview verification should happen on a Firebase Hosting preview channel after implementation.

Manual preview checklist:

1. Signed-out users cannot upload evidence.
2. Signed-in users can choose one local image file.
3. Signed-in users can enter caption, source, credit, and rights status.
4. Upload completes to the intended Firebase Storage path.
5. Nomination submission stores review-only evidence metadata.
6. Public pages do not display submitted nomination evidence.
7. Admin review page can view the uploaded evidence.
8. Approving or rejecting the nomination does not leak private evidence fields.
9. Promotion continues to work for approved nominations.
10. Temporary Firestore and Storage test records are cleaned up after verification.

Rules deploy sequence:

- deploy Firestore rules only after explicit approval
- deploy Storage rules only after explicit approval
- deploy Hosting preview when implementation is ready for browser verification
- do not deploy production Hosting for this PR before merge

## Rollback Plan

Rollback should stay narrow:

- disable or hide the upload control on `nominate-place.html`
- keep the existing URL-only evidence workflow working
- revert client upload code if uploads fail
- revert new nomination metadata fields if rules or review behavior regress
- revert Storage rules separately if they block unrelated Storage workflows
- delete temporary preview test files from Storage after verification

Rollback must not disturb:

- PR #35 place contribution workflow
- existing nomination submission
- existing admin nomination review
- existing approved nomination promotion
- existing public place pages and public export behavior

## Working Rule

One feature slice stays in this branch and draft PR until implementation, tests, preview verification, cleanup, and review readiness are complete.
