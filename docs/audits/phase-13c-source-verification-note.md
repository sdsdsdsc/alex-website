# Phase 13C Source Verification Note

## Purpose

This note records a source-only verification pass for Phase 13C-2, focused on the media-rights metadata added around the existing nomination evidence URL fields.

This verification did not use live Firebase data, did not deploy rules, and did not change application code.

## Files Inspected

- `nominate-place.html`
- `nominate-place.js`
- `heritage-engine/nominations.js`
- `heritage-engine/promotion.js`
- `heritage-engine/export.js`
- `heritage-engine/validation.js`
- `manage-nominations.html`
- `my-nominations.js`
- `export.js`
- `firestore.rules`
- `engine-test.html`
- `docs/project-status-checkpoint.md`
- `docs/audits/phase-13c-media-rights-metadata-completion-note.md`

Additional search verification was also run across the repository for:

- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`
- `Photo / evidence URL`
- `Evidence caption`
- `Evidence source / credit`
- `placeNominations`
- `type=drupal`
- `dev-alex-photo-cms.pantheonsite.io`
- `jsonapi`

## Summary Of Diff Verification

`git branch --show-current` confirmed the branch is `codex/structure-replanning`.

`git status --short` was clean before verification.

`git diff -- ...` for the requested Phase 13C file set returned no output because the working tree was already clean. This means the verification was performed against the current checked-out source rather than against uncommitted local edits.

The current checked-out source matches the intended narrow Phase 13C scope:

- rights metadata was added around existing nomination evidence fields;
- the existing evidence URL, caption, and source/credit fields were reused;
- promotion/export privacy stripping was extended for the three new metadata fields;
- public export remains limited to `communityPlaces`, `news`, and `history`;
- no source change was found that expands public export to `placeNominations`;
- no source change was found that removes Drupal/Pantheon support.

## Duplicate-Field Check Result

In `nominate-place.html`, there is exactly one:

- `Photo / evidence URL` field;
- `Evidence caption` field;
- `Evidence source / credit` field.

No duplicate user-facing evidence URL/caption/source fields were found.

## Nomination Form And Source Behavior Result

The nomination form keeps the existing evidence section together:

- the existing URL, caption, and source/credit inputs remain in place;
- `evidenceRightsStatus` appears in the same evidence section;
- `evidencePermissionConfirmed` appears in the same evidence section;
- the help text states the site stores the URL only and does not fetch or upload the image;
- the note says the URL is stored for review and is not included in the public open-data export unless a later approved workflow says so.

`nominate-place.js` still reads:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`

It also now reads:

- `evidenceRightsStatus`
- `evidencePermissionConfirmed`

`heritage-engine/nominations.js` confirms:

- `evidenceRightsStatus` is normalized with `cleanText(...)`;
- `evidencePermissionConfirmed` is read as a boolean;
- `evidenceVisibility` is checked during validation and set to `nomination-private` in the submitted payload when an evidence URL is present;
- if an evidence URL is present, rights status and permission confirmation are required;
- if no evidence URL is present, rights metadata is not required.

Important no-URL result:

- when no evidence URL is provided, `buildSubmittedNominationPayload(...)` omits `evidenceRightsStatus`, `evidencePermissionConfirmed`, and `evidenceVisibility` entirely.

This is safer than emitting blank/false/null values.

## Firestore Rules Alignment Result

The local `firestore.rules` file is aligned with the current helper behavior:

- `evidenceRightsStatus`, `evidencePermissionConfirmed`, and `evidenceVisibility` are present in the create allowlist;
- allowed `evidenceRightsStatus` values match the JavaScript helper exactly:
  - `own-work`
  - `permission-granted`
  - `public-domain-or-open-license`
  - `public-web-reference`
  - `unknown-needs-review`
- if `evidenceImageUrl` is present, rules require:
  - an HTTPS URL;
  - a valid `evidenceRightsStatus`;
  - `evidencePermissionConfirmed == true`;
  - `evidenceVisibility == "nomination-private"`;
- signed-in ownership requirements remain unchanged:
  - `submittedByUid == request.auth.uid`
  - `submitterEmail == request.auth.token.email`
  - `submissionAuthType == "signedIn"`
  - `nominationStatus == "submitted"`
- `placeNominations` public read is still blocked:
  - read is admin-or-owner only;
- admin-only update boundaries remain intact;
- default deny remains intact.

Because the helper omits the three rights fields when no evidence URL is provided, there is no current helper-path mismatch with the local rules for the no-URL case.

The remaining caveat is deployment state: local rules were verified, but deployed Firebase Console rules were not checked here and may still differ.

## Admin Display Result

`manage-nominations.html` shows the new evidence-rights metadata in a read-only review section:

- `Evidence rights / permission status`
- `Permission acknowledgement`
- `Evidence visibility`

The page also includes a warning that this evidence is for nomination review only and that rights metadata must not be copied automatically into public place records in this phase.

No admin-editable media-rights workflow was added in this phase. The page remains a review/promotion interface, not a new media management system.

## Promotion Privacy Result

`heritage-engine/promotion.js` strips all six evidence-related fields from public promotion payloads:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`
- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

Ownership and other private/admin nomination fields also remain stripped.

## Export Privacy Result

`export.js` still exports only:

- `communityPlaces`
- `news`
- `history`

It does not read `placeNominations`.

`heritage-engine/export.js` and `heritage-engine/validation.js` both treat the six evidence-related fields as unsafe public fields:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`
- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

`placeNominations` appears only in private/unsafe stripping logic and not as a public exported collection.

## My Nominations Result

`my-nominations.js` still performs an owner-scoped query:

- `where("submittedByUid", "==", user.uid)`

No broad `placeNominations` read was introduced.
No edit workflow was added.
No evidence-rights metadata is newly rendered on this page.

## Test Result Or Inspection Result

`engine-test.html` was inspected but not run in a browser during this verification pass.

The harness source includes assertions for:

- valid evidence URL plus rights metadata;
- missing rights status when URL is present;
- missing permission confirmation when URL is present;
- no evidence URL does not require rights metadata;
- `evidenceVisibility` defaulting to `nomination-private` when URL is present;
- promotion stripping the three new rights fields;
- export stripping the three new rights fields.

The harness also includes export-strip checks for the existing evidence URL/caption/source fields.

No live Firebase behavior was exercised.

## Caveats

- the verification was source-only;
- `git diff` for the requested file set was empty because the working tree was already clean;
- local `firestore.rules` alignment was verified, but deployed rules were not compared here;
- `engine-test.html` was inspected rather than executed in-browser;
- no browser UI review was performed in this pass.

## Required Next Manual Checks

- visually review `nominate-place.html` to confirm the evidence section remains clear and uncluttered;
- verify the expected validation message appears when an evidence URL is supplied without complete rights metadata;
- visually review `manage-nominations.html` to confirm the read-only rights metadata presentation is understandable;
- compare deployed Firebase Console rules against the verified local `firestore.rules` before any live form testing or rules deployment decision;
- if desired, run `engine-test.html` manually in a browser for a visible pass count before Phase 13C-3.

## What Was Not Changed

This verification pass did not change:

- application code;
- Firebase data;
- Firebase Storage;
- Firebase Console settings;
- Firestore rules deployment state;
- Drupal/Pantheon support;
- `type=drupal` support;
- commits, pushes, or deploys.
