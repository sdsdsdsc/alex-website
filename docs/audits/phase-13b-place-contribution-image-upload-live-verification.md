# Phase 13B Place Contribution Image Upload Live Verification

Date: 2026-07-05
PR: #37
Branch: `codex/phase-13b-place-contribution-image-upload`
Project: `alexs-community-efcd8`

## Preview Deployment

- Hosting preview URL: `https://alexs-community-efcd8--phase13b-contribution-upload-9w6n9jjr.web.app`
- Hosting preview expiry: `2026-07-12 07:52:04`
- Firestore rules deploy: success
- Storage rules deploy: success
- Production Hosting: not deployed

## Signed-Out Check

Signed-out behavior passed.

- Signed-out users were redirected or blocked before contribution submission.
- No upload input was available to a signed-out user on the place contribution flow.

## Signed-In Upload Check

Signed-in upload passed through the real preview UI.

- One-image upload worked through the preview place contribution form.
- The Storage path shape used `place-contribution-images/{uid}/{draftId}/{fileId}`.
- Firestore `placeContributions` create succeeded.
- The created contribution used `contributionStatus = submitted`.
- The submitted contribution stayed hidden publicly before review.

## REST-Simulated Checks

REST-simulated boundary checks passed before the real admin UI verification was completed.

- Approval confirmed the public-safe payload removed private upload fields.
- The approved image appeared only in the Comments and Photos contribution feed.
- A rejected uploaded contribution stayed hidden publicly.

## Real Admin UI Check

The real admin UI verification passed on the preview site after manual sign-in as the configured admin account.

- The submitted contribution was visible in `manage-place-contributions.html`.
- The admin card showed:
  `imageStoragePath`, `imageFileName`, `imageFileContentType`, `imageFileSize`, `imageUploadedAt`, `imageUploadedByUid`, and `imageUploadVisibility`.
- The uploaded image preview rendered from Firebase Storage on the admin review page.
- The real `Approve contribution` button worked.
- The page reported:
  `Contribution approved. It is now eligible for the public place page.`

## Public Result After Real Approval

Public post-approval behavior passed.

- The approved uploaded image appeared in Comments and Photos.
- It did not become the main place image.
- Private upload fields did not appear publicly.

## Cleanup

Cleanup passed.

- Temporary Firestore contribution documents were deleted after verification.
- Temporary Storage objects were deleted after verification.
- Final checks showed no remaining Phase 13B temporary Firestore documents or Storage objects.

## Repo State

- No tracked repo changes were left from live verification except this verification document.
- `.firebase/` remains untracked and should not be committed.

## Remaining Caution

- Production smoke testing still must happen after PR merge and the production GitHub Pages update.
