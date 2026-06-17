# Phase 10M Nomination Helper Extraction Plan

## Purpose

This document plans the safe extraction of pure nomination helper logic before touching the live public submission workflow.

Phase 10M is planning-only. It should make Phase 10N easier to implement without blurring the boundary between public form helpers, Firestore writes, admin review, and promotion.

## Why Nomination Extraction Is Sensitive

Nomination extraction is sensitive because `nominate-place.js` writes to Firestore.

Critical constraints:

- Public submissions must write only to `placeNominations`.
- Public submissions must never create `communityPlaces` directly.
- `nominatorEmail` is private.
- Admin fields must not be accepted from public users.
- Evidence URL fields must remain optional and safe.
- Map lat/lng handoff must keep working.
- Firestore rules must remain aligned with the public submission payload.

## Current Nomination Workflow

Current expected workflow:

1. Public user opens `nominate-place.html`.
2. Optional `lat` / `lng` may arrive from `map.html` through URL parameters.
3. User fills the nomination form.
4. User accepts terms/privacy.
5. Submission validates required public fields.
6. Submission writes a new document to `placeNominations`.
7. New nomination starts with `nominationStatus = submitted`.
8. Public form does not write `communityPlaces`.
9. Admin later reviews/promotes separately.

## Public Nomination Fields

Public-safe form fields currently expected:

- `title`
- `address`
- `area`
- `city`
- `district`
- `province`
- `lat`
- `lng`
- `category`
- `assetType`
- `description`
- `localSignificanceSummary`
- `heritageCriteria`
- `criteriaExplanation`
- `nominatorDisplayName`
- `nominatorEmail`
- `evidenceImageUrl`
- `evidenceImageCaption`
- `evidenceSourceCredit`
- `termsAccepted`
- `privacyAccepted`
- `createdAt` / `updatedAt` / `submittedAt`
- `nominationStatus`

Note: `nominatorEmail` is allowed in `placeNominations`, but it must remain private/admin-side and must not be promoted or exported publicly.

## Fields Public Nomination Must Never Submit

Public nominations must never submit:

- `adminNotes`
- `adminHistoricInterest`
- `adminArchitecturalInterest`
- `adminCommunityValue`
- `adminConditionRisk`
- `adminAssessmentSummary`
- `reviewHistory`
- `promotedPlaceId`
- `promotedAt`
- any `communityPlaces` direct-publication field that bypasses review

## Proposed Future Engine Module

Proposed future file:

```text
heritage-engine/nominations.js
```

It should contain pure helpers only, such as:

- `buildNominationDraftFromFormValues`
- `normalizeNominationTextFields`
- `normalizeNominationCoordinates`
- `normalizeNominationCriteria`
- `validateNominationRequiredFields`
- `validateNominationEvidenceFields`
- `validateNominationAgreements`
- `buildSubmittedNominationPayload`
- `getNominationValidationErrors`
- `stripPublicDisallowedNominationFields`
- `getInitialNominationStatus`

## What Should Remain Outside The Engine During Extraction

These responsibilities should remain in page/admin scripts during extraction:

- Firebase initialization
- `addDoc` / `setDoc` / `updateDoc`
- `collection(db, "placeNominations")`
- `serverTimestamp`
- DOM query selectors
- event listeners
- success/error message rendering
- page redirects
- admin review
- promotion logic

## Relationship With validation.js

`nominations.js` can reuse public-safe helpers and constants from `heritage-engine/validation.js`, including:

- `HERITAGE_CRITERIA`
- `NOMINATION_STATUSES`
- `isValidEmail`
- `isHttpsUrl`
- `normalizeCoordinate`
- `hasValidCoordinates`
- `normalizeCriteriaList`
- `stripUnsafePublicFields`

`nominations.js` should still not import Firebase.

## Phase 10N Extraction Strategy

Careful strategy for the next phase:

1. Create `heritage-engine/nominations.js`.
2. Move only pure helper logic from `nominate-place.js`.
3. Keep Firestore write in `nominate-place.js`.
4. Keep DOM event listeners in `nominate-place.js`.
5. Keep URL lat/lng autofill in `nominate-place.js` unless a tiny pure helper is safe.
6. Add nomination tests to `engine-test.html`.
7. Test public submission through localhost.
8. Confirm `placeNominations` receives the document.
9. Confirm `communityPlaces` is not created.
10. Confirm private/admin fields are not accepted or exposed.
11. Confirm Firestore rules still allow the payload.

## Phase 10N Testing Checklist

- `nominate-place.html` loads
- map lat/lng autofill still works
- required fields validate
- invalid email fails
- invalid evidence URL fails or is rejected safely
- HTTPS evidence URL passes
- terms/privacy required
- submission writes to `placeNominations` only
- new nomination status is `submitted`
- no `communityPlaces` document is created by public submission
- no admin fields are included in the public payload
- `nominatorEmail` is stored only in `placeNominations`
- public search/map/export do not show the new nomination until admin promotion
- browser console has no module import errors
- Firestore rules allow valid payload and reject invalid/private fields

## Safety Stop Rules

Stop and do not commit if:

- public submission writes to `communityPlaces`
- `placeNominations` write fails unexpectedly
- private/admin fields appear in public pages or export
- evidence URL validation changes unexpectedly
- map lat/lng handoff breaks
- Firestore rules need emergency broadening
- browser module import errors appear

## Commit Guidance

Suggested commit message:

```text
Phase 10M: Add nomination extraction plan
```
