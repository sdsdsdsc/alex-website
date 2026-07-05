# Phase 13B Place Contribution Image Upload Plan

Date: 2026-07-05
Branch: `codex/phase-13b-place-contribution-image-upload`
Base branch: `main`
Expected PR type: one longer-lived draft PR

## Goal

Upgrade the `place.html` Comments and Photos contribution form from image URL-only metadata to one real local image upload for signed-in users.

This is needed because contributors often have their own current or historic place photos on their device. The existing URL field is useful for already-published images, but it does not support the common workflow where a resident uploads a photo, provides caption and rights metadata, and waits for admin review before anything becomes public.

Phase 13B should keep the public/private boundary conservative:

- submitted uploaded images stay hidden publicly
- rejected uploaded images stay hidden publicly
- approved uploaded images appear only inside the approved Comments and Photos contribution feed
- uploaded contribution images do not become the main public place image in this slice

## Intended Signed-In User Workflow

The first version should stay intentionally small:

1. A signed-in user opens `place.html` for an existing published place.
2. The user opens the Comments and Photos tab.
3. The user enters contribution text and optional image metadata.
4. The user chooses at most one local image file.
5. The client uploads the file to a private Firebase Storage path.
6. The client writes a `placeContributions` record with uploaded image metadata.
7. The new record starts with `contributionStatus = "submitted"`.
8. The submitted contribution remains hidden from the public feed until admin review.
9. An admin can preview the uploaded image in the contribution review page.
10. If approved, the image appears publicly only in the Comments and Photos feed.

Out of scope for this PR:

- changing the Phase 13A nomination upload workflow
- promoting contribution uploads as the main place image
- reply system
- contributor profile page
- multi-image gallery
- drag-and-drop upload
- image editing
- Firebase app config changes unless required
- Firestore or Storage rules deployment without explicit approval

## Involved Files

Likely application files:

- `place.html`
- `place.js`
- `manage-place-contributions.html`
- `heritage-engine/place-contributions.js`
- `style.css`

Likely Firebase and test files:

- `firestore.rules`
- `storage.rules`
- `firebase.json`, only if Storage rules wiring needs an update
- `package.json`, only if a focused test script is needed
- `tests/place-contributions.test.mjs`
- `tests/firestore.rules.test.mjs`
- `tests/storage.rules.test.mjs`
- `tests/browser-smoke.spec.mjs`

Documentation and verification files:

- this plan document
- a later preview and production smoke verification record for Phase 13B

## Firebase Storage Strategy

Uploaded contribution images should use a private, review-gated Storage path. A likely path shape is:

```text
place-contribution-images/{uid}/{contributionDraftId}/{fileId}
```

Initial Storage behavior:

- require a signed-in user for upload
- require the path UID to match `request.auth.uid`
- allow at most one uploaded image per contribution in this slice
- allow only bounded image content types and file sizes
- store original filename only as metadata, not as a trusted path component
- generate the Storage path before writing the contribution record
- keep public reads denied for submitted and rejected uploads
- allow admin reads for review previews

The Firestore record should prefer storing a `storagePath` for cleanup and authorization. A download URL may be stored only if the implementation can keep it inside private review-only fields until approval. Public rendering should use approved contribution fields only.

## Firestore Record Strategy

Uploaded image metadata should live on `placeContributions` with the submitted contribution record.

Existing URL-based contribution fields should remain compatible:

- `imageUrl`
- `imageCaption`
- `imageCredit`
- `imageRightsStatus`

Phase 13B may add focused uploaded-image metadata such as:

- `imageStoragePath`
- `imageDownloadUrl`
- `imageFileName`
- `imageFileContentType`
- `imageFileSize`
- `imageUploadedAt`
- `imageUploadedByUid`
- `imageUploadVisibility`

Submitted records should continue to include:

- `placeId`
- `placeTitleSnapshot`
- `contributionText`
- `submittedByUid`
- `submitterEmail`
- optional public-safe `submitterDisplayName`
- `contributionStatus = "submitted"`
- `createdAt`
- `updatedAt`

Users must not be able to submit or mutate admin-only fields such as:

- `contributionStatus = "approved"`
- `contributionStatus = "rejected"`
- `adminNotes`
- `reviewedAt`
- `reviewedByUid`
- `reviewHistory`

## Storage Rules and Firestore Rules Strategy

Firestore rules should preserve the existing contribution boundary:

- signed-out users cannot create place contributions
- signed-in users can create only their own submitted contributions
- signed-in users cannot create approved or rejected contributions directly
- upload metadata must be optional, bounded, and tied to `request.auth.uid`
- non-admin users cannot write moderation fields
- submitted and rejected records remain hidden from public reads
- approved records remain publicly readable only when their fields are public-safe
- admins can approve or reject through the existing admin access pattern

Storage rules should own file-byte access:

- signed-out users cannot upload contribution images
- signed-in users can upload only under their own UID path
- file size and image content type are bounded
- public reads are denied for private uploaded objects
- admins can read uploaded objects for moderation
- owner reads may be allowed only if the rules can enforce ownership safely

Important rule-design note:

- Firestore rules cannot redact fields from a readable document. Any document readable by the public must contain only public-safe fields, or public display must be backed by a carefully shaped approved-only payload.

No Firestore or Storage rules should be deployed without explicit approval.

## Admin Review Behavior

`manage-place-contributions.html` should let admins inspect submitted uploaded image metadata and preview the image during review.

Expected admin behavior:

- show contribution text and existing image URL metadata
- show uploaded image filename, type, size, Storage path, and rights metadata
- preview uploaded images when admin Storage access permits it
- approve or reject the contribution
- optionally save private admin notes if the current admin workflow supports them
- keep submitted and rejected uploads hidden publicly

Approval should not promote the image to `communityPlaces.imageUrl` or any main-place image field in this PR.

## Approved Public Display Behavior

Approved contribution images should appear only inside the public Comments and Photos contribution feed on `place.html`.

Public rendering should:

- include only approved `placeContributions`
- include uploaded image display only after approval
- show caption, credit, and rights status when public-safe
- omit submitter email, UID, admin notes, review history, private Storage path, and other private moderation fields
- preserve existing Overview tab and main place image behavior
- keep public export behavior unchanged unless existing tests require a narrow compatibility adjustment

Submitted and rejected contributions must not appear in the public feed.

## Tests

Planned test coverage:

- contribution helper accepts valid uploaded image metadata
- contribution helper rejects invalid or oversized metadata values
- URL-only contribution behavior continues to work
- blank upload metadata is omitted from payloads
- submitted contribution still starts with `contributionStatus = "submitted"`
- submitted uploaded images do not produce public feed output
- rejected uploaded images do not produce public feed output
- approved uploaded images produce public-safe feed output
- private upload fields stay out of public rendering
- signed-out users cannot create uploaded-image contributions
- signed-in users can create uploaded-image contributions only for themselves
- signed-in users cannot forge `submittedByUid` or `imageUploadedByUid`
- signed-in users cannot write moderation fields
- Storage rules allow upload only under the user's own UID path
- Storage rules reject signed-out writes, wrong-UID writes, oversized files, and disallowed content types
- admin review can read the submitted upload metadata and preview source

Validation commands:

```bash
npm test
npm run test:browser
```

## Firebase Preview Steps

Preview verification should happen on a Firebase Hosting preview channel after implementation.

Manual preview checklist:

1. Signed-out users cannot upload a contribution image.
2. Signed-in users can choose one local image file on `place.html`.
3. Upload completes to the intended private Firebase Storage path.
4. `placeContributions` stores submitted upload metadata.
5. The submitted contribution does not appear publicly.
6. Admin review can see metadata and preview the image.
7. Approving the contribution makes the image visible in the Comments and Photos feed.
8. Rejecting the contribution keeps the image hidden.
9. Private fields do not appear in the public DOM.
10. The nomination upload workflow from Phase 13A still works.
11. Temporary Firestore docs and Storage objects are cleaned up after preview checks.

Rules deploy sequence:

- deploy Firestore rules only after explicit approval
- deploy Storage rules only after explicit approval
- deploy Hosting preview when implementation is ready for browser verification
- perform production smoke testing only after the PR is ready for that phase

## Rollback Plan

Rollback should stay narrow:

- hide or disable the local upload control on `place.html`
- keep the existing image URL contribution workflow working
- revert contribution upload client code if uploads fail
- revert new contribution upload metadata handling if rules or rendering regress
- revert Storage rules changes separately if they block unrelated Storage workflows
- delete temporary preview and smoke-test Storage objects after verification

Rollback must not disturb:

- Phase 13A nomination upload workflow
- existing URL-only place contributions
- approved-only public contribution display
- admin approve/reject behavior
- public place main image behavior
- public export behavior

## Working Rule

Use one feature slice, one branch, one draft PR, and multiple commits or fixes inside the same PR until implementation, tests, Firebase preview verification, production smoke testing, cleanup, and review readiness are complete.

This document is the first planning commit for the workflow. Implementation should continue inside this same draft PR.
