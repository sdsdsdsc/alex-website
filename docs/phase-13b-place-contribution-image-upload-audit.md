# Phase 13B Place Contribution Image Upload Baseline Audit

Date: 2026-07-05
Branch: `codex/phase-13b-place-contribution-image-upload`
Draft PR: #37

This is an audit-only slice. It does not implement upload code, change Firestore rules, change Storage rules, deploy rules, deploy Hosting, or change the Phase 13A nomination upload workflow.

## Summary

The current place contribution workflow is a good base for one local image upload because it already has:

- a signed-in-only contribution form on `place.html`
- a normalized create payload helper in `heritage-engine/place-contributions.js`
- submitted-only creation and approved-only public read rules in `firestore.rules`
- an admin review page at `manage-place-contributions.html`
- focused tests for helper behavior, Firestore rules, Storage rules, and browser smoke coverage

The smallest safe path is to add uploaded image metadata beside the existing URL fields, keep uploaded image records private while submitted or rejected, and publish only an approved public-safe image URL or approved public-safe display field after admin review.

## Current Public Place Form

Inspected files:

- `place.html`
- `place.js`

Current behavior:

- The Comments and Photos tab explains that only approved contributions are public.
- The modal form is signed-in gated by `place.js` auth state.
- The form currently accepts:
  - `contributionText`
  - `imageUrl`
  - `imageCaption`
  - `imageCredit`
  - `imageRightsStatus`
  - `imagePermissionConfirmed`
- There is no file input for local contribution images.
- `place.js` imports Firestore and Auth only; it does not currently import Firebase Storage.
- `getContributionFormValues()` reads text and URL fields only.
- `handleContributionSubmit()` builds a payload with `buildPlaceContributionCreatePayload()` and writes it with `addDoc(collection(db, "placeContributions"), payload)`.
- Public rendering queries `placeContributions` where `placeId` matches and `contributionStatus == "approved"`.
- `renderContributionImage()` displays only `contribution.imageUrl` after `buildPublicPlaceContributionPayload()` has shaped the record.

Implication:

- The upload code can be added to `place.js` without touching the place overview rendering.
- The public feed should continue to render only the helper-approved public payload.

## Current Helper Behavior

Inspected file:

- `heritage-engine/place-contributions.js`

Current behavior:

- `buildPlaceContributionCreatePayload()` always sets `contributionStatus = "submitted"`.
- A submitted contribution must include contribution text or `imageUrl`.
- `imageUrl` must be HTTPS when present.
- Image caption, credit, rights status, and permission confirmation are emitted only when `imageUrl` exists.
- `PUBLIC_PLACE_CONTRIBUTION_FIELDS` currently includes URL-based public image fields only.
- `PRIVATE_PLACE_CONTRIBUTION_FIELDS` currently strips submitter, permission, admin note, and review history fields.
- `buildPublicPlaceContributionPayload()` returns `null` unless the contribution is approved.

Implication:

- Uploaded-image metadata needs helper-level validation and field allowlists.
- The helper should treat an uploaded image as satisfying the media side of "text and/or image" validation.
- Private uploaded-file fields such as Storage path and submitter UID must remain excluded from public payloads.

## Current Admin Review Behavior

Inspected file:

- `manage-place-contributions.html`

Current behavior:

- The page loads submitted records from `placeContributions`.
- Admin cards show submitter UID, email, display name, text, image URL, caption, credit, rights status, and permission confirmation.
- Admin preview supports safe HTTPS `imageUrl` only.
- On approve, the page updates the document to `approved` and deletes:
  - `imagePermissionConfirmed`
  - `submittedByUid`
  - `submitterEmail`
  - `submitterDisplayName`
- On reject, the page keeps the document hidden and may save private moderation fields.

Implication:

- Admin preview for private uploaded contribution images should mirror the Phase 13A nomination preview pattern: import Firebase Storage helpers, call `getDownloadURL(ref(storage, imageStoragePath))`, and render the image only for admins.
- Approval must either remove private upload fields or transform them into explicitly public-safe fields allowed by Firestore rules.
- Rejection should keep private upload metadata available to admins but hidden publicly.

## Current Firestore Rules

Inspected file:

- `firestore.rules`

Current `placeContributions` behavior:

- Public reads are allowed only when `contributionStatus == "approved"` and the document has only public contribution fields.
- Admins can read submitted and rejected records.
- Signed-in users can create submitted contributions only.
- Signed-in users cannot create approved or rejected contributions directly.
- Signed-in users cannot write moderation fields.
- Create fields currently allow URL-based image fields only.
- `hasContributionTextOrImageUrl()` currently requires text or HTTPS `imageUrl`.
- Admin approve update requires the resulting document to satisfy `requestHasPublicPlaceContributionFields()`.
- Admin reject update can write private moderation fields.

Implication:

- Firestore create rules need a new uploaded-image metadata validation path.
- Public approved rules must not allow private fields such as `imageStoragePath`, `imageUploadedByUid`, or raw private Storage metadata to remain on an approved readable document.
- The cleanest rule model is:
  - submitted records may contain private uploaded-image metadata
  - approved records must contain only public-safe fields
  - admin approve must delete private upload fields and, if needed, write a public-safe image URL/display field

## Current Storage Rules

Inspected file:

- `storage.rules`

Current behavior:

- Shared helpers exist for `isSignedIn()` and `isAdmin()`.
- `nomination-evidence/{uid}/{draftId}/{fileId}` allows signed-in users to create/update only under their own UID path.
- Nomination evidence accepts only JPEG, PNG, WebP, and GIF images up to 5 MB.
- Public reads are denied.
- Admin reads are allowed.
- Deletes are denied.
- A final catch-all denies all other reads and writes.

Can `place-contribution-images/{uid}/{contributionDraftId}/{fileId}` be added cleanly?

Yes. The current file structure is small and path-specific, so a sibling matcher can be added without changing the nomination matcher:

```text
place-contribution-images/{uid}/{contributionDraftId}/{fileId}
```

Recommended rule shape:

- reuse or generalize the existing image type/size helper
- require `request.auth.uid == uid`
- allow create only for signed-in owners
- keep public reads denied
- allow admin reads for moderation previews
- keep deletes denied in the first slice unless a later cleanup operation is explicitly designed

Important boundary:

- Do not change the existing `nomination-evidence/{uid}/{draftId}/{fileId}` behavior while adding the contribution path.

## Existing Tests

Inspected files:

- `tests/place-contributions.test.mjs`
- `tests/firestore.rules.test.mjs`
- `tests/storage.rules.test.mjs`
- `tests/browser-smoke.spec.mjs`

Current helper tests cover:

- text-only submitted contribution payloads
- URL image submitted contribution payloads
- omission of blank optional image fields
- submitted status normalization
- invalid non-HTTPS image URLs
- blank contribution rejection
- approved-only public payload behavior
- private submitter and admin fields excluded from public payloads
- approve and reject update payloads

Current Firestore rules tests cover:

- public read of approved place contributions
- public denial for submitted and rejected records
- admin read for submitted and rejected records
- non-admin denial for private submitted records
- public denial if approved records contain private fields
- signed-in create of submitted contributions
- rejection of direct approved/rejected creates
- rejection of moderation fields on create
- UID impersonation denial
- text or HTTPS image URL requirement
- admin approve into public-safe shape
- admin reject with private notes
- nomination upload metadata rules from Phase 13A

Current Storage rules tests cover:

- signed-in nomination evidence upload under own UID
- signed-out upload denial
- wrong-UID upload denial
- image-only content type checks
- 5 MB cap
- public read denial
- admin read allowance
- delete denial

Current browser smoke tests cover:

- basic page loads for selected pages
- nomination upload module cache-busting
- no place contribution upload browser behavior yet

Implication:

- First implementation should extend existing tests rather than add a parallel test framework.
- Browser smoke should add `place.html` coverage only if the implementation changes script cache-busting or contribution upload UI in a way that can be checked without live auth.

## Smallest Safe Implementation Path

Recommended implementation sequence for the first code commit:

1. Add one file input to the `place.html` contribution modal.
2. Import Firebase Storage helpers in `place.js`.
3. Add constants for allowed contribution image types and max size, matching the Phase 13A image limit unless a smaller limit is chosen.
4. Add contribution upload helpers in `place.js` using names that do not overlap with nomination helpers.
5. Validate the selected image before upload.
6. Upload to `place-contribution-images/{uid}/{draftId}/{fileId}` before the Firestore create.
7. Pass uploaded metadata into `buildPlaceContributionCreatePayload()`.
8. Extend `heritage-engine/place-contributions.js` to validate uploaded-image metadata and treat it as satisfying the media requirement.
9. Extend `manage-place-contributions.html` to show upload metadata and admin-only preview.
10. Keep public `place.js` rendering approved-only and helper-shaped.
11. Extend tests for helper behavior, Firestore rules, Storage rules, and minimal browser smoke checks.

Important implementation choice:

- Do not store private `imageStoragePath` on an approved public-readable document.
- If an approved uploaded image must be displayed publicly, approval should create or retain only public-safe fields that Firestore allows public readers to see.
- If using a Firebase Storage download URL as `imageUrl` for approved display, make that transformation happen only during admin approval and only after private fields are removed.

## Exact Files For First Implementation Commit

The smallest safe first implementation commit should likely change:

- `place.html`
- `place.js`
- `manage-place-contributions.html`
- `heritage-engine/place-contributions.js`
- `firestore.rules`
- `storage.rules`
- `tests/place-contributions.test.mjs`
- `tests/firestore.rules.test.mjs`
- `tests/storage.rules.test.mjs`
- `tests/browser-smoke.spec.mjs`, only if the place page smoke coverage or script cache-busting needs an assertion
- `style.css`, only for the new file input/status UI

Likely not needed in the first implementation commit:

- `firebase.json`, unless Storage rules are not already wired locally
- `package.json`, because `npm test`, `npm run test:browser`, and `npm run test:storage-rules` already exist
- nomination files

## Phase 13A Nomination Workflow Boundary

Confirmed Phase 13A nomination upload workflow should remain untouched.

Existing nomination upload files and fields are separate:

- `nominate-place.html` has `nominationEvidenceFile`
- `nominate-place.js` uploads to `nomination-evidence/{uid}/{draftId}/{fileId}`
- `manage-nominations.html` previews `evidenceStoragePath`
- `firestore.rules` validates `evidenceStoragePath` and nomination evidence metadata
- `storage.rules` has a dedicated `nomination-evidence` matcher
- `tests/firestore.rules.test.mjs` and `tests/storage.rules.test.mjs` already cover nomination evidence
- `tests/browser-smoke.spec.mjs` asserts the current nomination upload cache-busting version

Phase 13B should add contribution-specific names and paths instead of reusing nomination DOM ids, helper names, metadata field names, or Storage paths.

## Risks To Watch

- A public-readable approved contribution document cannot retain private Storage metadata.
- A submitted uploaded image could become effectively public if a long-lived download URL is stored in a public field before approval.
- Current admin approval deletes private submitter fields but does not yet know about private uploaded-image fields.
- Current create validation requires text or `imageUrl`; uploaded image metadata must be added to that requirement.
- Storage upload can succeed while Firestore create fails. The implementation should either delete the uploaded object on Firestore failure or clearly document cleanup behavior.
- The current Storage rules allow `update` for nomination evidence. Contribution images should start with the narrowest operation needed, likely create-only, unless overwrite behavior is explicitly required.

## Validation For This Audit Slice

Because this audit creates a documentation file, run:

```bash
npm test
```

No Firebase deploy commands should be run for this slice.
