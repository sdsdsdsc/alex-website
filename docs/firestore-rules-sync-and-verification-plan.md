# Firestore Rules Sync and Verification Plan

This document defines the safe reset-phase plan for verifying that the local `firestore.rules` file, the currently deployed Firebase rules, and current app behavior are aligned.

It is planning only. This phase does not edit rules, deploy rules, change application behavior, touch live Firebase data, or run Firebase commands.

## 1. Purpose

This plan defines how to verify alignment between:

- the local `firestore.rules` file in the repo;
- the deployed Firestore rules in Firebase Console;
- current browser and app behavior;
- the Phase 12 behavior already functionally verified in source review and live browser testing.

This phase exists because the repo now depends on rules-sensitive auth and nomination behavior, but the local `firestore.rules` file is still explicitly marked as a review draft rather than proof of what is deployed.

## 2. Why Rules Sync Matters Now

Rules sync is a high-priority reset step because several current workflows depend on the public/private/admin boundary being enforced correctly:

- public nomination submission now depends on signed-in create rules for `placeNominations`;
- `my-nominations.html` depends on owner-scoped nomination read rules;
- admin review depends on admin-only update rules for nomination review fields;
- promotion depends on controlled admin write behavior for both nomination updates and `communityPlaces` writes;
- public export depends on only public collections remaining readable to the public flow;
- future Phase 13C media metadata work would likely add fields that require coordinated rules changes.

If the deployed rules drift from the repo, the app may appear correct in source but still fail in live browser use or expose the wrong data boundary.

## 3. Current Rules-Dependent Workflows

### Public signed-out

- public reads of `communityPlaces`, `news`, and `history`;
- public export reads of `communityPlaces`, `news`, and `history`;
- blocked nomination submission without sign-in;
- blocked public reads of `placeNominations`;
- blocked public writes to `communityPlaces`.

### Public signed-in

- public email/password sign-in through `public-auth.html` and `public-auth.js`;
- signed-in nomination create into `placeNominations`;
- owner-scoped `My nominations` reads via `where("submittedByUid", "==", user.uid)`;
- blocked access to other users' nominations;
- blocked direct writes to `communityPlaces`;
- blocked edits to admin review and promotion fields.

### Admin

- read `placeNominations`;
- update review status, notes, and admin assessment fields;
- promote approved nominations into `communityPlaces`;
- manage `communityPlaces`;
- manage `news` and `history` articles;
- run private admin export / backup if the admin read rules remain aligned.

## 4. Local `firestore.rules` Summary

The local `firestore.rules` file currently appears to allow and deny the following:

### Public reads

- `communityPlaces`: public read allowed;
- `news`: public read allowed;
- `history`: public read allowed.

### Public writes

- public write access is not allowed broadly;
- `communityPlaces`, `news`, and `history` writes are admin-only;
- the default catch-all rule denies anything not explicitly allowed.

### Signed-in nomination create requirements

`placeNominations` create appears to require:

- `request.auth != null`;
- `submittedByUid == request.auth.uid`;
- `submitterEmail == request.auth.token.email`;
- `submissionAuthType == "signedIn"`;
- `nominationStatus == "submitted"`;
- required nomination content and acknowledgements;
- only the allowed public nomination field set;
- no client-created admin review or promotion fields.

### Nomination reads

`placeNominations` read appears to allow:

- configured admin reads;
- owner-scoped reads where `resource.data.submittedByUid == request.auth.uid`.

This means public broad reads should fail, while owner-scoped single-document reads and matching-owner queries are intended to work.

### Nomination updates and deletes

`placeNominations` update appears to allow admin-only:

- review/status/admin assessment updates;
- promotion updates from `approved` to `promoted`.

`placeNominations` delete is denied.

### Community place and article writes

- `communityPlaces` writes are admin-only;
- `news` writes are admin-only;
- `history` writes are admin-only.

### Admin export implications

Because `admin-export.js` reads `communityPlaces`, `placeNominations`, `news`, and `history`, the admin account must still be able to read private nomination data in practice if private backup/export is expected to work.

## 5. App Behavior Expectations

The current source expects the rules model above.

### `public-auth.js`

- creates and signs in public email/password users;
- uses `browserLocalPersistence`;
- waits for auth state resolution with `onAuthStateChanged`;
- supports `next=` redirects;
- clearly separates public auth from admin access.

Rules impact:

- auth alone does not grant Firestore access;
- the signed-in public user must still satisfy Firestore rules for nomination and `My nominations` behavior.

### `nominate-place.js`

- blocks submission until auth state resolves and a user is signed in;
- writes with `addDoc(collection(db, "placeNominations"), payload)`;
- builds payloads through `buildSubmittedNominationPayload(...)`;
- attaches `createdAt`, `updatedAt`, `submittedAt`, and ownership metadata;
- links back to `public-auth.html` with `next=`.

Rules impact:

- the rules must permit signed-in create for `placeNominations`;
- the ownership metadata in the payload must match the signed-in auth identity.

### `heritage-engine/nominations.js`

- strips public disallowed admin/promotion fields;
- requires and preserves ownership metadata:
  - `submittedByUid`
  - `submitterEmail`
  - optional `submitterDisplayName`
  - `submissionAuthType`
- sets the initial nomination status to `submitted`;
- keeps only the public nomination field allowlist.

Rules impact:

- this helper is intentionally aligned to the create-time rule checks;
- if the rules field set changes without matching helper updates, nomination submission can break.

### `my-nominations.js`

- queries `placeNominations` with:
  `where("submittedByUid", "==", user.uid)`;
- does not use a broad `getDocs(collection(db, "placeNominations"))` query;
- renders only a public-safe subset of nomination data;
- shows a specific permission-denied message if Firestore blocks the owner-scoped load.

Rules impact:

- owner-scoped reads must work for the signed-in owner;
- broad public nomination reads must still fail.

### `manage-nominations.html`

- requires the configured admin UID;
- reads nominations for review;
- saves review/status/admin assessment fields;
- promotes approved nominations into `communityPlaces`;
- uses pure helper logic from `heritage-engine/review.js`, `audit.js`, and `promotion.js`.

Rules impact:

- admin nomination reads and updates must remain allowed;
- admin writes to `communityPlaces` must remain allowed.

### `manage-community-places.html`

- requires admin auth;
- creates, updates, and deletes `communityPlaces` records.

Rules impact:

- `communityPlaces` writes must stay admin-only.

### `upload-article.html`

- requires admin auth;
- writes `news` or `history` records;
- uses Firebase Storage for article assets.

Rules impact:

- `news` and `history` writes must stay admin-only.

### `export.js`

- reads only:
  - `news`
  - `history`
  - `communityPlaces`;
- does not read `placeNominations`.

Rules impact:

- public read access must remain valid for those three public collections only.

### `heritage-engine/export.js`

- strips unsafe public fields from exported data;
- excludes nomination/admin/private fields from public JSON-LD shaping.

Rules impact:

- rules and export shaping should both reinforce public/private separation;
- export safety should not depend on public `placeNominations` access.

### `admin-export.js`

- requires the configured admin UID;
- reads:
  - `communityPlaces`
  - `placeNominations`
  - `news`
  - `history`;
- downloads private internal backup JSON.

Rules impact:

- admin reads of `placeNominations` and public collections must remain possible if private admin export is expected.

### `engine-test.html`

- verifies pure helper behavior only;
- does not prove deployed Firebase rules;
- supports source-level confidence around payload shaping, field stripping, promotion privacy, and export privacy.

## 6. Phase 12 Verified Behavior

Based on `docs/phase-12-final-verification-record.md`, the following behavior was verified at the time of verification:

- public email/password sign-in worked;
- Account A saw only Account A's nomination;
- Account B did not see Account A's nomination;
- signed-in nomination submission worked;
- admin review save worked;
- admin promotion worked;
- the promoted record loaded publicly;
- public export excluded `placeNominations` and private fields;
- `engine-test.html` passed.

This is strong evidence that the workflow worked at the time of verification.

It does not automatically prove that:

- the currently deployed Firebase rules still match the repo file;
- the deployed rules were unchanged after that verification;
- the repo `firestore.rules` draft exactly matches the currently deployed Console rules.

## 7. Local-vs-Deployed Rules Risk

There are three different things to keep separate:

- repo `firestore.rules`:
  the intended rules source under version control;
- deployed Firebase Console rules:
  the rules currently active in the live Firebase project;
- browser-observed live behavior:
  what users and admins can actually do right now.

The repo file can show the intended model, but it is not proof of deployment.

Live browser behavior can prove that some flows work or fail, but it still does not by itself show the exact deployed rules text.

Only a controlled comparison against Firebase Console or an approved CLI-based rules comparison in a later phase can confirm what is actually deployed.

This phase does not run Firebase CLI or deploy anything.

## 8. Manual Verification Checklist

Use this owner-friendly checklist in a later verification session.

### Public signed-out browser

- can open Home, Places, Map, place detail, News, History, and Open Data;
- cannot submit a nomination;
- cannot open `My nominations` without sign-in;
- cannot read `placeNominations` directly;
- cannot write `communityPlaces`.

### Public signed-in Account A

- can submit a nomination;
- can see own nomination in `My nominations`;
- cannot see Account B's nomination;
- cannot write `communityPlaces`;
- cannot update review/admin fields.

### Public signed-in Account B

- can submit own nomination;
- sees only own nomination;
- cannot see Account A's nomination.

### Admin

- can read `placeNominations`;
- can save review status and admin notes;
- can promote an accepted nomination;
- can manage `communityPlaces`;
- can manage `news` and `history`;
- can run private admin export if that remains an expected admin feature.

### Public export

- exports `communityPlaces`, `news`, and `history` only;
- excludes `placeNominations`;
- excludes submitter, admin, and other private fields.

## 9. Field Alignment Checklist

The following fields must stay aligned across form inputs, page scripts, engine helpers, Firestore rules, admin UI, and tests.

### Nomination ownership fields

- `submittedByUid`
- `submitterEmail`
- `submitterDisplayName`
- `submissionAuthType`

### Evidence fields

- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`

### Nomination status and review fields

- `nominationStatus`
- `adminNotes`
- `reviewHistory`
- `reviewedAt`
- `promotedPlaceId`
- `promotedAt`
- `adminHistoricInterest`
- `adminArchitecturalInterest`
- `adminCommunityValue`
- `adminConditionRisk`
- `adminAssessmentSummary`

### Public nomination content fields that rules and helpers both care about

- `title`
- `assetType`
- `area`
- `address`
- `lat`
- `lng`
- `description`
- `localSignificanceSummary`
- `heritageCriteria`
- `criteriaExplanation`
- `condition`
- `communityUse`
- `sourceReference`
- `nominatorDisplayName`
- `nominatorEmail`
- `organisationName`
- `submittedOnBehalfOf`
- `termsAccepted`
- `privacyAccepted`
- `createdAt`
- `updatedAt`
- `submittedAt`

Adding or removing fields in only one layer can break submission, read access, admin review, promotion, or public export safety.

## 10. Phase 13C Rules Impact

Phase 13C remains paused because future media-rights fields would likely require coordinated cross-layer changes.

Examples include:

- `mediaLicense`
- `mediaRightsStatus`
- `mediaConsentConfirmed`
- `mediaVisibility`
- `mediaReviewStatus`

Those future fields would require coordinated review across:

- `nominate-place.html`;
- `nominate-place.js`;
- `heritage-engine/nominations.js`;
- `manage-nominations.html`;
- `firestore.rules`;
- `engine-test.html`;
- export safety logic if public media behavior changes.

Do not implement Phase 13C until the owner explicitly approves a rules-aware implementation step.

## 11. Safe Verification Methods Later

Safer verification methods for a later phase include:

- manual Firebase Console rules comparison;
- copying deployed rules into a private local comparison note only if the owner approves;
- Firebase Emulator Suite later, if configured;
- Account A / Account B / admin browser smoke tests;
- source-level review of rules, queries, and payload shaping;
- no cleanup scripts;
- no migration scripts;
- no unplanned live data changes.

The preferred order is:

1. source review;
2. manual browser checks;
3. controlled deployed-rules comparison or emulator verification;
4. only then consider future rules-aware feature work.

## 12. Recommended Next Phase

Recommended next phase:

`Phase Reset 1D — Retired Page and Navigation Cleanup Plan`

Why this should come next:

- rules-sync planning is the highest-priority boundary check before more feature work;
- after that, the project should classify retired or legacy public pages, Drupal/Pantheon dependency, and old navigation paths;
- that cleanup reduces confusion before returning to future media and evidence work;
- Phase 13C should not resume until both rules alignment planning and retired-surface planning are clearer.

## 13. What Was Not Changed

This phase did not change the following:

- `firestore.rules` was not edited;
- no rules were deployed;
- no app code changed;
- no HTML, JS, or CSS changed;
- no forms changed;
- no export behavior changed;
- no tests changed;
- no Firebase Console settings changed;
- no live Firebase data was touched;
- no Storage files were touched;
- no scripts were run;
- no commit, push, or deploy was done.
