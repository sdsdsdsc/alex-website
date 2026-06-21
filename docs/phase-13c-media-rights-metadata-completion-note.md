# Phase 13C Media Rights Metadata Completion Note

## Purpose

This note records the small Phase 13C implementation that adds basic media-rights metadata around the existing nomination evidence URL fields.

This phase is intentionally narrow:

- URL-only evidence metadata;
- no file upload;
- no Firebase Storage workflow change;
- no Drupal/Pantheon change;
- no public export of nomination-private media metadata.

## Fields Added

The following nomination metadata fields were added:

- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

Allowed `evidenceRightsStatus` values:

- `own-work`
- `permission-granted`
- `public-domain-or-open-license`
- `public-web-reference`
- `unknown-needs-review`

`evidenceVisibility` is not a new user-facing duplicate field. In this phase it is an internal helper/rules field that defaults to `nomination-private` when an evidence URL is provided.

## Existing Fields Intentionally Reused

This phase intentionally reuses the existing nomination evidence fields:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`

No duplicate `Photo / evidence URL` field was added.
No duplicate `Evidence caption` field was added.
No duplicate `Evidence source / credit` field was added.

## Nomination Form Changes

Changes in `nominate-place.html`:

- the existing evidence section keeps the current URL, caption, and source/credit inputs;
- a new `Evidence rights / permission status` select was added in the same section;
- a new permission acknowledgement checkbox was added in the same section;
- a short note now clarifies that the evidence URL is stored for review only, is not uploaded by the site, and is not part of the public open-data export unless a later approved workflow says so.

Changes in `nominate-place.js`:

- the form now reads `evidenceRightsStatus`;
- the form now reads `evidencePermissionConfirmed`;
- the existing evidence URL, caption, and source/credit fields are still read without renaming;
- helper validation now produces a clear form error if an evidence URL is provided without complete rights metadata.

## Helper Changes

Changes in `heritage-engine/nominations.js`:

- added `evidenceRightsStatus`, `evidencePermissionConfirmed`, and `evidenceVisibility` to the allowed nomination payload;
- if `evidenceImageUrl` is present, helper validation now requires:
  - a valid `evidenceRightsStatus`;
  - `evidencePermissionConfirmed == true`;
- `evidenceVisibility` now defaults to `nomination-private` when an evidence URL is present;
- if no evidence URL is provided, the new rights metadata is not required.

Changes in `heritage-engine/promotion.js`:

- promotion privacy stripping now excludes:
  - `evidenceImageUrl`
  - `evidenceImageCaption`
  - `evidenceSourceCredit`
  - `evidenceRightsStatus`
  - `evidencePermissionConfirmed`
  - `evidenceVisibility`

Changes in `heritage-engine/export.js` and `heritage-engine/validation.js`:

- public export/privacy stripping now treats the nomination-private evidence fields and the new evidence-rights fields as unsafe public fields.

## Local Firestore Rules Changes

`firestore.rules` was updated locally only.
No rules were deployed in this phase.

Local create allowlist updates for `placeNominations` now include:

- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

Local rules behavior now requires:

- no rights metadata when no evidence URL is provided;
- if an evidence URL is provided:
  - the URL must still be HTTPS;
  - `evidenceRightsStatus` must be one of the allowed values;
  - `evidencePermissionConfirmed` must be `true`;
  - `evidenceVisibility` must be `nomination-private`.

Existing signed-in ownership and privacy requirements were kept:

- `submittedByUid == request.auth.uid`
- `submitterEmail == request.auth.token.email`
- `submissionAuthType == "signedIn"`
- `nominationStatus == "submitted"`
- `termsAccepted == true`
- `privacyAccepted == true`

## Admin Review Display Changes

`manage-nominations.html` now shows the new metadata in the read-only evidence review area:

- `Evidence rights / permission status`
- `Permission acknowledgement`
- `Evidence visibility`

The admin review note now also makes it clearer that this evidence metadata is nomination-review information and must not be copied automatically into public place records in this phase.

## Export And Privacy Protection

This phase keeps nomination-private evidence metadata out of public-facing outputs.

Public export remains limited to:

- `communityPlaces`
- `news`
- `history`

This phase does not add `placeNominations` to public export.

Promotion and public export privacy stripping now exclude:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`
- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

## Tests Run Or Inspected

`engine-test.html` was updated with source-level assertions for:

- evidence URL rights metadata validation;
- `evidenceVisibility` defaulting to `nomination-private`;
- promotion privacy stripping for the new fields;
- export privacy stripping for the new fields.

In this phase, the harness was updated by source inspection and source-level assertions were added, but no live Firebase behavior was exercised.

## Remaining Manual Checks

Remaining manual checks after this implementation:

- confirm the updated nomination form shows the new rights fields next to the existing evidence URL fields without visual clutter;
- confirm the form shows the expected validation message when an evidence URL is provided without rights metadata;
- confirm admin review displays the new metadata clearly;
- rerun `engine-test.html` manually in browser if the owner wants a fresh visible harness result;
- compare deployed Firebase Console rules against the updated local `firestore.rules` before any rules-aware release decision.

## What Was Not Changed

This phase did not change the following:

- no image upload was added;
- no Firebase Storage path or upload behavior was added;
- no live Firebase data was touched;
- no Storage files were touched;
- no Firebase Console settings were changed;
- no Firestore rules were deployed;
- no Firebase CLI deploy was run;
- no Drupal/Pantheon support was changed;
- no `type=drupal` support was removed;
- no commit, push, or deploy was done.
