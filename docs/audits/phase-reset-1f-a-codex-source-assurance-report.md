# Phase Reset 1F-A Codex Source-Level Assurance Report

## 1. Purpose

This report records source-level and local inspection checks only.

It does not prove:

- deployed Firebase Console rules;
- live browser behavior for Account A or Account B;
- live admin review or promotion behavior;
- live public export output from current Firebase data;
- current live Firebase data state.

This phase supports the Phase Reset 1F checklist by checking what the repo source appears to guarantee locally without touching live Firebase data or deployed rules.

## 2. Tests Run or Inspected

`engine-test.html` was inspected but not executed in this phase.

Reason:

- it is a browser test harness for pure helper modules;
- no safe local browser execution path was documented in the repo for this phase;
- this phase did not approve live Firebase access, browser-account testing, or any behavior that could drift into live workflow execution.

Related existing evidence:

- `docs/audits/phase-12-final-verification-record.md` records a prior source-level harness result of `259/259`;
- this report does not independently rerun or re-prove that count.

## 3. Engine Test Coverage Summary

By inspection, `engine-test.html` appears to cover the following source-level areas:

- nomination payload shaping through `buildSubmittedNominationPayload(...)`;
- public disallowed nomination field stripping via `PUBLIC_DISALLOWED_NOMINATION_FIELDS`;
- ownership metadata handling for `submittedByUid`, `submitterEmail`, `submitterDisplayName`, and `submissionAuthType`;
- review helper behavior through `buildReviewUpdatePayload(...)`, status normalization, and review validation;
- promotion helper privacy through `buildPublicPlacePayloadFromNomination(...)` and `stripPrivateFieldsForPromotion(...)`;
- export privacy stripping through `buildPublicHeritageJsonLd(...)` and `stripUnsafePublicFields(...)`;
- relationship helper safety through `normalizeRelationshipReferences(...)`, `auditRelationshipReferences(...)`, and safe public relationship URL building;
- private field exclusion from public-safe outputs;
- rejection of private `placeNominations` relationship targets and private/publicly unsafe fields.

By inspection, the harness also appears to assert that:

- public promoted place payloads exclude submitter, nominator, admin, and review-history fields;
- public JSON-LD shaping strips private/admin markers;
- relationship helpers do not build public URLs for `placeNominations`.

The harness does not appear to be a direct proof of deployed Firestore rules or live Firebase behavior.

The harness does not show a dedicated direct assertion for exporting retired `mapPoints`, `mapPolygons`, or old `posts` collections by name, but the active export source itself only iterates `news`, `history`, and `communityPlaces`, which prevents those retired collections from entering export through the main export path.

## 4. Nomination Field Alignment

Static alignment looks broadly good between:

- `nominate-place.js`
- `heritage-engine/nominations.js`
- `firestore.rules`

The specifically requested fields appear aligned:

- `submittedByUid`
- `submitterEmail`
- `submitterDisplayName`
- `submissionAuthType`
- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`
- `nominationStatus`
- `termsAccepted`
- `privacyAccepted`

Observed alignment:

- `nominate-place.js` reads the current form values, gathers `heritageCriteria`, acknowledgements, and ownership metadata, then delegates payload shaping to `buildSubmittedNominationPayload(...)`;
- `heritage-engine/nominations.js` builds a submitted payload that includes the current ownership fields, evidence URL fields, status, and required acknowledgements;
- `firestore.rules` expects those same ownership fields and create-time constraints, including `submittedByUid == request.auth.uid`, `submitterEmail == request.auth.token.email`, `submissionAuthType == "signedIn"`, `nominationStatus == "submitted"`, and required `termsAccepted` / `privacyAccepted`.

One static caveat remains:

- `firestore.rules` still allows optional legacy-style `photoUrl` and `photoDescription` nomination fields;
- the current `nominate-place.js` form reader and current helper allowlist do not emit those fields;
- this is not a mismatch for the active requested field set, but it is an older optional-field allowance worth noting as a source-level legacy/compatibility detail.

No source-level mismatch was found in the current core signed-in nomination ownership fields.

## 5. My Nominations Owner-Scoped Behavior

`my-nominations.js` and the local `firestore.rules` file appear aligned at source level.

Observed source behavior:

- `my-nominations.js` uses `query(collection(db, "placeNominations"), where("submittedByUid", "==", user.uid))`;
- it does not use a broad public `getDocs(collection(db, "placeNominations"))` read;
- it handles permission-denied errors explicitly and reports a rules/query mismatch if owner-scoped loading is blocked.

Observed local rules intent:

- `placeNominations` reads are allowed only for `isAdmin()` or `isNominationOwner()`;
- `isNominationOwner()` compares `resource.data.submittedByUid` to `request.auth.uid`;
- the default catch-all rule denies anything else.

Source-level conclusion:

- the page code is built for owner-scoped reads, not broad public reads;
- the local rules draft appears intended to allow owner reads and block broad public reads;
- this report does not prove the deployed Firebase Console rules still match that local draft.

## 6. Export Privacy Source Check

`export.js` and `heritage-engine/export.js` appear to enforce the intended public export boundary at source level.

Observed source behavior:

- `export.js` reads only `news`, `history`, and `communityPlaces`;
- `export.js` does not read `placeNominations`;
- `admin-export.js` separately reads `communityPlaces`, `placeNominations`, `news`, and `history`, which keeps private admin backup behavior distinct from public export behavior.

Observed privacy protections in `heritage-engine/export.js`:

- unsafe public export fields include `placeNominations`, `nominatorEmail`, `adminNotes`, admin assessment fields, `reviewHistory`, and other private/admin markers;
- stored JSON-LD is merged only after unsafe JSON-LD fields and relationship fields are stripped or normalized;
- relationship normalization is limited to public relationship collections:
  - `communityPlaces`
  - `news`
  - `history`

Static conclusions:

- public export reads only `communityPlaces`, `news`, and `history`;
- `placeNominations` is not part of the public export source path;
- private submitter/admin fields are handled as unsafe and excluded from public-safe export shaping;
- retired `mapPoints`, `mapPolygons`, and old `posts` are not part of the active export collection list.

Important nuance:

- terms such as `placeNominations`, `adminNotes`, and `reviewHistory` do appear in the export helper source, but they appear in stripping and denylist logic, which is acceptable and expected;
- no source-level evidence was found that those fields are intentionally exported as public data.

## 7. Navigation Source Check

`public-nav.js` appears to expose only public pages.

Observed public nav entries:

- `index.html`
- `news.html`
- `history.html`
- `get-involved.html`
- `criteria.html`
- `guidance.html`
- `map.html`
- `search.html` labelled `Places`
- `my-nominations.html`
- `export.html` labelled `Open Data`
- `public-auth.html` labelled `Sign in`

Static conclusions:

- no admin page appears in the public nav;
- `Places` points to `search.html`;
- `Open Data` points to `export.html`.

## 8. Drupal/Pantheon Legacy Check

Drupal/Pantheon remains active-but-legacy in source and was not removed.

Observed source references:

- `script.js` still fetches Drupal JSON:API news from `dev-alex-photo-cms.pantheonsite.io`;
- `article.js` still supports `article.html?id=...&type=drupal`;
- many HTML files still include `dev-alex-photo-cms.pantheonsite.io` in CSP `connect-src`;
- project docs still describe Drupal/Pantheon as active-but-legacy.

Source-level conclusion:

- Drupal/Pantheon support remains present;
- it is still part of the public news/article pathway;
- it remains outside the preferred Firebase-first core model;
- nothing in this phase removed or changed that dependency.

## 9. What Codex Cannot Prove

This source-level assurance phase cannot prove:

- deployed Firebase Console rules;
- live Account A vs Account B isolation;
- live admin review/promotion;
- live public export output;
- live Firebase data state.

It also cannot prove that the prior `engine-test.html` result still passes today, because the harness was inspected but not rerun in this phase.

## 10. Recommended Remaining Manual Checks

After this source-level assurance pass, the smaller remaining manual checks are:

- Account A / Account B privacy behavior in real browser sessions;
- live admin review and promotion behavior;
- public export downloaded JSON privacy using a real `heritage.json` download;
- Firebase Console rules comparison against the local `firestore.rules` intent.

## 11. What Was Not Changed

This phase did not change the following:

- no app code changed;
- no rules changed;
- no rules were deployed;
- no Firebase data was touched;
- no Storage files were touched;
- no live-data scripts were run;
- no commit, push, or deploy was done.
