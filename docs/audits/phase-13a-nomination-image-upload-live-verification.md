# Phase 13A Nomination Image Upload Live Verification

Date: 2026-07-05
PR: #36
Branch: `codex/phase-13a-nomination-image-upload`
Project: `alexs-community-efcd8`

## Preview Deployment

- Hosting preview URL: `https://alexs-community-efcd8--phase13a-upload-k93acjzx.web.app`
- Hosting preview expiry: `2026-07-11 04:22:30`
- Firestore rules deploy: passed for Phase 13A preview testing.
- Storage rules deploy: passed for Phase 13A preview testing.

## Signed-Out Behavior

Signed-out behavior passed.

- The preview UI blocked nomination submission when no user was signed in.
- An unauthenticated `placeNominations` Firestore create was denied.
- An unauthenticated Storage upload under `nomination-evidence/{uid}/{draftId}/{fileId}` was denied.

## Signed-In Upload

Signed-in upload passed with the real Firebase Hosting preview UI.

- A signed-in public test account submitted a nomination with one local image selected.
- The image uploaded successfully to the private Storage path shape:
  `nomination-evidence/{uid}/{draftId}/{fileId}`.
- The Firestore `placeNominations` create succeeded after the upload.
- The nomination stored `evidenceStoragePath` plus the private uploaded-evidence metadata.
- `evidenceUploadedAt` was confirmed as a real Firestore `timestampValue`, not a sentinel-shaped map.
- `evidenceVisibility` stayed `nomination-private`.

Final timestamp retest document:

- Firestore document: `placeNominations/jo2PQShxZMvjv9x0uWwp`
- Storage object:
  `nomination-evidence/VT3I9KMktMXsdJeyYBye54Sgnqu2/737bcb96-1cc7-4cea-a066-b7ac7655f64f/8605ca9d-b66d-4a36-93c4-666682519a26-Screenshot-2026-03-17-at-16.29.09.png`
- `evidenceUploadedAt`: `timestampValue: 2026-07-04T07:34:36.105Z`

## Public Leak Checks

Public leak checks passed.

- The temporary marker text was not visible publicly.
- The private Storage path was not visible publicly.
- Uploaded-evidence metadata was not visible publicly.
- `communityPlaces` did not receive uploaded private evidence.
- `heritage.json` did not leak uploaded private evidence.

## Admin Review

Admin review passed with one minor caveat.

- The admin review page opened successfully during live preview testing.
- The admin image preview worked through Firebase Storage access.
- Minor caveat: raw filename, path, and visibility values were confirmed through Firestore inspection rather than visibly printed in every admin surface.

## Cleanup

Cleanup passed.

- Temporary Firestore nomination documents were deleted.
- Temporary Storage objects were deleted.
- No matching temporary nomination documents or Storage objects remained after cleanup.

Final timestamp retest cleanup:

- Deleted Firestore document status: `200`
- Deleted Storage object status: `204`
- Remaining matching Firestore documents: `0`
- Storage object after delete: `404`

## Remaining Cautions

- No production Hosting deploy has been performed for Phase 13A.
- PR #36 remains a draft.
- Local image upload is intentionally one-image-only.
- Uploaded evidence is not promoted or displayed publicly by default.
