# Phase 13B Place Contribution Image Upload Pre-Deploy Safety Review

Date: 2026-07-05
Branch: `codex/phase-13b-place-contribution-image-upload`
Draft PR: #37

This note is a pre-deploy safety review only. No Firestore rules, Storage rules, or Hosting deploys were run for this review.

## PR Scope Reviewed

PR #37 currently changes:

- `docs/plans/phase-13b-place-contribution-image-upload-plan.md`
- `docs/audits/phase-13b-place-contribution-image-upload-audit.md`
- `firestore.rules`
- `storage.rules`
- `heritage-engine/place-contributions.js`
- `place.html`
- `place.js`
- `manage-place-contributions.html`
- `style.css`
- `tests/place-contributions.test.mjs`
- `tests/firestore.rules.test.mjs`
- `tests/storage.rules.test.mjs`
- `tests/browser-smoke.spec.mjs`

The pre-existing `.firebase/` directory remains untracked and is not committed.

## Phase 13A Boundary

The Phase 13A nomination upload workflow was not changed in this PR.

No diffs were found for:

- `nominate-place.html`
- `nominate-place.js`
- `heritage-engine/nominations.js`
- `manage-nominations.html`

The existing `nomination-evidence/{uid}/{draftId}/{fileId}` Storage rules remain intact. Nomination upload browser-smoke coverage still checks the existing nomination cache-busting version.

## User Upload Behavior

The place contribution UI adds one optional local image file input to the Comments and Photos contribution modal.

Safety confirmations:

- upload is one-image-only because the input does not use `multiple` and `place.js` reads only `files[0]`
- accepted file types are JPEG, PNG, WebP, and GIF
- max file size is 5 MB
- upload path is `place-contribution-images/{uid}/{contributionDraftId}/{fileId}`
- submitted contribution records keep `contributionStatus = "submitted"`
- selected uploaded image metadata is private and review-only while submitted
- existing HTTPS image URL workflow remains supported
- there is no drag-and-drop, reply system, gallery, image editing, or main-place-image promotion in this slice

If Storage upload succeeds but the Firestore create fails, the client attempts to delete the uploaded Storage object and reports that cleanup status.

## Firestore Rules: Newly Allowed

Firestore rules newly allow signed-in users to create submitted `placeContributions` containing valid uploaded-image metadata:

- `imageStoragePath`
- `imageFileName`
- `imageFileContentType`
- `imageFileSize`
- `imageUploadedAt`
- `imageUploadedByUid`
- `imageUploadVisibility = "contribution-private"`

The create is allowed only when:

- `submittedByUid == request.auth.uid`
- `imageUploadedByUid == request.auth.uid`
- `imageStoragePath` matches `place-contribution-images/{request.auth.uid}/{draftId}/{fileId}`
- content type is one of JPEG, PNG, WebP, or GIF
- file size is greater than 0 and no more than 5 MB
- upload visibility is `contribution-private`
- the contribution remains `contributionStatus = "submitted"`

## Firestore Rules: Still Denied

Firestore rules still deny:

- signed-out place contribution creates
- creates with forged `submittedByUid`
- creates with forged `imageUploadedByUid`
- creates with another user's `imageStoragePath`
- public reads of submitted records
- public reads of rejected records
- public reads of approved records containing private fields
- non-admin approval or rejection
- user writes of moderation fields
- user-created approved or rejected records

Approved public-readable contribution documents cannot retain:

- `imageStoragePath`
- `imageFileName`
- `imageFileContentType`
- `imageFileSize`
- `imageUploadedAt`
- `imageUploadedByUid`
- `imageUploadVisibility`

## Storage Rules: Newly Allowed

Storage rules newly allow:

- signed-in users to create an image object under `place-contribution-images/{uid}/{contributionDraftId}/{fileId}` only when `uid == request.auth.uid`
- admins to read contribution image objects for review preview
- owners to delete their own contribution image objects for failed-submission cleanup

The contribution image upload uses the same image-only MIME allowlist and 5 MB max size as Phase 13A.

## Storage Rules: Still Denied

Storage rules still deny:

- signed-out contribution image uploads
- wrong-UID contribution image uploads
- non-image uploads
- oversized uploads
- public reads of contribution image objects
- Storage object updates
- deletes by signed-out users
- deletes by non-owner users
- all reads and writes outside explicitly matched paths

The existing nomination evidence delete rule remains denied.

## Admin Review And Approval

`manage-place-contributions.html` now shows uploaded contribution image metadata and an admin-only private preview using Firebase Storage access.

Approval behavior:

- submitted uploaded-image records remain private until admin approval
- rejection leaves the contribution hidden from public reads
- approval removes private submitter and upload fields
- when an approved uploaded-image contribution has no public `imageUrl`, admin approval resolves a Storage download URL and writes it into public-safe `imageUrl`
- approved public rendering uses the existing Comments and Photos feed via `buildPublicPlaceContributionPayload()`

The approved uploaded image is not promoted to `communityPlaces.imageUrl` and does not become the main place image.

## Public Display Boundary

Approved uploaded images appear only through the Comments and Photos contribution feed on `place.html`.

The main place image rendering still reads the place record image fields, not contribution upload metadata.

`buildPublicPlaceContributionPayload()` strips private contribution upload fields and includes only public-safe contribution fields.

## Test Coverage

Helper tests cover:

- URL-only contribution behavior
- valid private uploaded-image metadata
- forged and unsafe uploaded-image metadata
- public approved payload after uploaded image conversion to `imageUrl`
- private fields excluded from public payloads

Firestore rules tests cover:

- valid owner uploaded-image contribution create
- forged `imageUploadedByUid` denial
- wrong UID Storage path denial
- public read denial when approved docs retain private fields
- admin approval requiring public-safe output

Storage rules tests cover:

- owner upload allowed
- signed-out upload denied
- wrong-UID upload denied
- non-image upload denied
- oversized upload denied
- public read denied
- admin read allowed
- owner delete allowed for failed-submission cleanup
- wrong-user and signed-out delete denied

Browser smoke tests cover:

- existing nomination upload cache-busting
- new place contribution upload cache-busting

## Rollback Plan

If rules are deployed and a regression appears, use Firebase Console Rules history to roll back:

1. In Firebase Console, open Firestore Rules history and restore the previous known-good Firestore rules version.
2. In Firebase Console, open Storage Rules history and restore the previous known-good Storage rules version.
3. If Hosting has not yet been deployed, no Hosting rollback is needed.
4. If a later Hosting deployment has occurred, roll back Hosting to the previous release in Firebase Hosting release history.
5. Remove or ignore any temporary `placeContributions` test documents and `place-contribution-images/` Storage objects created during preview/smoke testing.

Narrow code rollback path:

- hide or remove the local contribution file input in `place.html`
- remove the contribution Storage upload path in `place.js`
- keep the existing URL-only contribution workflow
- keep Phase 13A nomination upload files unchanged

## Deployment Hold

Do not deploy Firestore rules, Storage rules, or Hosting until explicit approval is given.
