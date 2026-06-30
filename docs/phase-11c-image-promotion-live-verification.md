# Phase 11C Image Promotion Live Verification

Date: 2026-06-29 local / 2026-06-30 UTC

## Scope

Verified that an approved nomination evidence image flows into the promoted public `communityPlaces` record and appears on both the Places preview page and the public place detail page.

No Firestore rules, Firebase config, app code, tests, HTML, CSS, or JavaScript behavior were changed during this verification.

## Repo Check

- Local branch: `main`
- Synced to `origin/main` after PR #26 merge.
- PR #26: `Phase 11C promote nomination images to public records`
- Merge commit: `cecfb05293333c73d15976bf9ea18f2b77b6880b`
- Files changed by PR #26:
  - `heritage-engine/promotion.js`
  - `package.json`
  - `tests/promotion.test.mjs`

The PR scope was limited to the image promotion path and promotion tests.

## Live Test Nomination

- Live site: `https://sdsdsdsc.github.io/alex-website/`
- Nomination title: `Phase 11C Image Promotion Live Test 20260630024821`
- Nomination id: `hiWpA99eMHXNmc5B4O9A`
- Promoted public record id: `phase-11c-image-promotion-live-test-20260630024821`
- Evidence image URL: `https://sdsdsdsc.github.io/alex-website/Manurewa%20High.png`
- Evidence rights status: `own-work`
- Evidence permission acknowledgement: confirmed
- Evidence source / credit: `Phase 11C live verification source credit`

Submission result:

- The nomination submitted successfully.
- The page showed: `Thank you. Your nomination has been submitted for review. It has not been published and does not create an official designation.`
- No console warnings or errors were observed during submission.

Admin review result:

- The nomination appeared in `manage-nominations.html`.
- The evidence URL, source credit, rights status, permission acknowledgement, and visibility metadata were visible in admin review.
- The nomination was approved successfully.
- The approved nomination was promoted successfully.
- Admin history showed promotion to `communityPlaces/phase-11c-image-promotion-live-test-20260630024821`.
- No console warnings or errors were observed during approval or promotion.

## Firestore Public Record Check

Read `communityPlaces/phase-11c-image-promotion-live-test-20260630024821` through the Firestore REST API.

Confirmed public fields:

- `imageUrl`: `https://sdsdsdsc.github.io/alex-website/Manurewa%20High.png`
- `imageCredit`: `Phase 11C live verification source credit`
- `source`: `Phase 11C live verification source credit`
- `imageRightsStatus`: `own-work`
- `recordStatus`: `published`

Confirmed private nomination evidence fields were not present as public fields:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`
- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`
- `submittedByUid`
- `submitterEmail`
- `submissionAuthType`
- `nominatorEmail`

## Places Preview Page Check

Checked `search.html` on the live site.

Result:

- The Places page listed the promoted record.
- The preview card rendered an `<img>` element.
- Image `src`: `https://sdsdsdsc.github.io/alex-website/Manurewa%20High.png`
- Image `alt`: `Phase 11C Image Promotion Live Test 20260630024821`
- The preview card did not use the placeholder for this record.

## Public Place Detail Page Check

Checked:

`https://sdsdsdsc.github.io/alex-website/place.html?id=phase-11c-image-promotion-live-test-20260630024821`

Result:

- The public record page loaded successfully.
- The same image rendered on the record page.
- Image `src`: `https://sdsdsdsc.github.io/alex-website/Manurewa%20High.png`
- Image `alt`: `Phase 11C Image Promotion Live Test 20260630024821`
- The image loaded successfully with natural dimensions `3400 x 1612`.
- The page showed `Image source: Phase 11C live verification source credit`.
- The page also showed `Contributor: Phase 11C live verification source credit`.
- No placeholder was shown for this record.
- No console warnings or errors were observed on the detail page.

## Conclusion

Phase 11C live verification passed.

The approved nomination evidence image was promoted into the public `communityPlaces` record as `imageUrl`, the source credit was promoted into public credit/source fields, private nomination evidence field names were not exposed as public fields, and both the Places preview page and public place detail page rendered the promoted image.
