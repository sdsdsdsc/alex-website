# Phase 13C UI, Live Test, and Rules Readiness Note

## 1. Purpose

This note records Phase 13C UI review, live-test readiness, and rules-deployment readiness based on local source inspection.

It does not record:

- a live nomination submission;
- a live admin review action;
- a Firestore rules deployment;
- a Firebase Console change.

## 2. UI Review Result

### Nomination form evidence section

Source review of `nominate-place.html` confirms:

- there is exactly one `Photo / evidence URL` field;
- exactly one `Evidence caption` field;
- exactly one `Evidence source / credit` field;
- `Evidence rights / permission status` appears in the same evidence section;
- `evidencePermissionConfirmed` appears in the same evidence section as a checkbox acknowledgement;
- the section still reads as URL-based evidence review rather than as a second upload feature;
- the form explicitly says the site stores the URL only and does not fetch or upload the image;
- the note does not promise public export or public publication of nomination-private evidence.

From source structure and labels, the section remains reasonably clear:

- the existing evidence URL/caption/source inputs stay grouped together;
- the rights-status select follows immediately after them;
- the permission acknowledgement is phrased as a review-safety acknowledgement rather than a publishing promise;
- the concluding note reinforces private review use.

### Admin review display

Source review of `manage-nominations.html` confirms the admin evidence section shows the following read-only values:

- `Evidence rights / permission status`
- `Permission acknowledgement`
- `Evidence visibility`

The labels are understandable, and the note clearly warns that rights metadata must not be copied automatically into public place records in this phase.

No admin-editable media-rights workflow was added.
No public promotion field copy was introduced.

### Local visual preview limitation

A local in-app browser preview was attempted, but the browser policy blocked opening the local `file://` pages.

Because of that, this UI review is source-based rather than a visible browser rendering review.

## 3. Validation Review Result

Source review of `nominate-place.js` and `heritage-engine/nominations.js` confirms the current validation behavior:

- if `evidenceImageUrl` is present and not HTTPS, the helper returns: `Evidence image URL must begin with https://.`
- if `evidenceImageUrl` is present but `evidenceRightsStatus` is blank or invalid, the helper returns: `Select an evidence rights or permission status.`
- if `evidenceImageUrl` is present but `evidencePermissionConfirmed` is false, the helper returns: `Confirm that the evidence link can be shared for review.`
- if `evidenceImageUrl` is blank, rights status and permission confirmation are not required.

`nominate-place.js` catches the helper error and displays the first validation message in the form status area.

The current wording is clear enough for this phase, so no text change was needed.

## 4. Test Harness Result

`engine-test.html` was inspected but not executed in a browser during this pass.

The source includes checks for:

- valid evidence URL plus rights metadata;
- missing rights status when URL is present;
- missing permission confirmation when URL is present;
- no evidence URL does not require rights metadata;
- `evidenceVisibility` defaulting to `nomination-private` when URL is present;
- promotion stripping `evidenceRightsStatus`, `evidencePermissionConfirmed`, and `evidenceVisibility`;
- export stripping `evidenceRightsStatus`, `evidencePermissionConfirmed`, and `evidenceVisibility`;
- promotion/export also stripping `evidenceImageUrl`, `evidenceImageCaption`, and `evidenceSourceCredit`.

No pass count is recorded because the harness was not run.

## 5. Live Functional Test Readiness

The code is ready for a future live functional test only after deployed Firebase rules are confirmed or updated to match the local Phase 13C rules intent.

Local/source preconditions currently pass:

- the form fields exist;
- the helper emits the three new rights fields only when an evidence URL is present;
- local rules allow and require those fields appropriately when an evidence URL is present;
- public export and promotion strip the private evidence metadata;
- admin display remains read-only for the new metadata;
- `My nominations` owner-scoped behavior remains unchanged.

This means the project is locally ready for an owner-approved rules deployment decision, but not yet ready for a safe live submission test unless deployed rules are aligned first.

## 6. Rules Deployment Decision Package

Local `firestore.rules` adds the following `placeNominations` create allowlist fields:

- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

Local rules behavior is:

- if no evidence URL is provided, the rights fields are omitted and not required;
- if an evidence URL is provided:
  - the URL must be HTTPS;
  - `evidenceRightsStatus` must be one of:
    - `own-work`
    - `permission-granted`
    - `public-domain-or-open-license`
    - `public-web-reference`
    - `unknown-needs-review`
  - `evidencePermissionConfirmed` must be `true`;
  - `evidenceVisibility` must be `nomination-private`.

What must be copied into Firebase Console or deployed later:

- the three new allowlist fields;
- the evidence-URL-dependent requirement block that enforces valid rights metadata when `evidenceImageUrl` is present.

Deployment warning:

- if the 13C form code reaches the live site before deployed rules are updated or confirmed, live nomination submission with an evidence URL may fail.

Rollback/no-go note:

- if rules are not ready, do not deploy the 13C form changes to the live site yet.

## 7. Export and Promotion Privacy

Public export remains limited to:

- `communityPlaces`
- `news`
- `history`

`placeNominations` is not read by `export.js`.

Public export and promotion both strip:

- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

They also strip the existing private evidence fields:

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`

This keeps nomination-private evidence metadata out of promoted public place payloads and out of `heritage.json`.

## 8. Remaining Manual / Owner Approval Steps

- owner approval is required before any rules deployment decision;
- deployed Firebase Console rules must be deliberately compared against the local `firestore.rules`;
- after rules are deployed or confirmed, one live signed-in nomination test with an evidence URL can be submitted;
- admin should confirm the new metadata appears read-only on the review page;
- public export should be downloaded and checked for the new private fields after the live test.

## 9. Go / No-Go Recommendation

Recommendation: `ready for owner-approved rules deployment decision`.

Reason:

- local UI/source review passed;
- validation behavior is coherent;
- local rules intent matches helper behavior;
- export and promotion privacy protections are in place;
- no owner-safe evidence suggests a source-level blocker.

Do not proceed to a live nomination test until deployed rules are aligned or deliberately confirmed.

## 10. What Was Not Changed

This pass did not:

- touch live Firebase data;
- touch Firebase Storage;
- change Firebase Console settings;
- deploy Firestore rules;
- submit a live nomination;
- commit, push, or deploy;
- change Drupal/Pantheon code.
