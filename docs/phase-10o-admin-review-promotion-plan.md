# Phase 10O Admin Review and Promotion Extraction Plan

## Purpose

This document plans safe extraction of admin review and promotion helper logic before touching live admin workflows.

Phase 10O is documentation-only. It should make later extraction phases safer by clarifying what may become pure engine logic and what must stay in the admin page script.

## Why Admin Review And Promotion Are Sensitive

Admin review and promotion are sensitive because:

- Admin review updates existing `placeNominations` documents.
- Admin review can change `nominationStatus`.
- Admin review stores private `adminNotes`.
- Admin assessment fields are private/admin-only.
- `reviewHistory` records admin actions.
- Promotion creates a new `communityPlaces` record.
- Promotion must exclude private fields.
- Promotion updates the source nomination to `promoted`.
- Firestore rules must remain aligned with the exact admin update and promotion payloads.

## Current Admin Review Workflow

Current expected workflow:

1. Admin opens `manage-nominations.html`.
2. Admin filters/searches nominations.
3. Admin opens or expands a nomination.
4. Admin changes `nominationStatus`.
5. Admin saves private `adminNotes`.
6. Admin saves admin assessment fields:
   - `adminHistoricInterest`
   - `adminArchitecturalInterest`
   - `adminCommunityValue`
   - `adminConditionRisk`
   - `adminAssessmentSummary`
7. Admin review save updates `placeNominations` only.
8. `reviewHistory` records `review_saved` or `status_changed` entries.
9. Public pages do not show admin notes, admin assessment fields, or `reviewHistory`.

## Current Promotion Workflow

Current expected workflow:

1. Nomination must be approved before promotion.
2. Admin clicks promote.
3. System builds a public-safe `communityPlaces` payload.
4. System creates or updates a `communityPlaces` record.
5. System excludes private fields:
   - `nominatorEmail`
   - `adminNotes`
   - `adminHistoricInterest`
   - `adminArchitecturalInterest`
   - `adminCommunityValue`
   - `adminConditionRisk`
   - `adminAssessmentSummary`
   - `reviewHistory`
   - evidence/private review fields if not intended for public record
6. System updates source `placeNominations` document:
   - `nominationStatus = promoted`
   - `promotedPlaceId`
   - `promotedAt`
   - `updatedAt`
   - `reviewHistory` append promoted action
7. Public Places/search/map/place.html then read the promoted `communityPlaces` record.

## Fields Admin Review May Update

Admin-side review/update fields:

- `nominationStatus`
- `adminNotes`
- `adminHistoricInterest`
- `adminArchitecturalInterest`
- `adminCommunityValue`
- `adminConditionRisk`
- `adminAssessmentSummary`
- `reviewedAt`
- `updatedAt`
- `reviewHistory`

## Fields Promotion May Write To communityPlaces

Public-safe fields that may be copied or mapped:

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
- `recordStatus`
- `sourceNominationId` if currently used and safe
- `createdAt` / `updatedAt`
- public metadata needed for `place.html`, search, map, and export

`nominatorEmail` and admin review fields must not be copied.

## Proposed Future Engine Modules

Proposed future files:

```text
heritage-engine/review.js
heritage-engine/promotion.js
heritage-engine/audit.js
```

`review.js` should contain pure helpers such as:

- `normalizeReviewStatus`
- `getReviewStatusLabel`
- `getAllowedReviewStatuses`
- `buildReviewUpdatePayload`
- `buildAdminAssessmentSummary`
- `validateReviewUpdate`
- `stripDisallowedReviewFields`

`promotion.js` should contain pure helpers such as:

- `buildPublicPlacePayloadFromNomination`
- `getPromotedPlaceId`
- `validatePromotionSource`
- `stripPrivateFieldsForPromotion`
- `buildPromotionUpdatePayload`
- `getPromotionValidationErrors`

`audit.js` should contain pure helpers such as:

- `buildReviewHistoryEntry`
- `buildStatusChangedHistoryEntry`
- `buildPromotionHistoryEntry`
- `appendReviewHistory`
- `trimReviewHistory`
- `formatReviewHistoryEntry`

## What Should Remain Outside The Engine During Extraction

These responsibilities must remain outside engine modules:

- Firebase initialization
- `getDocs` / `getDoc`
- `setDoc` / `updateDoc` / `addDoc`
- `collection` / `doc` references
- `serverTimestamp`
- admin authentication checks
- DOM query selectors
- event listeners
- success/error rendering
- confirmation dialogs
- actual Firestore writes
- admin dashboard routing

## Relationship With validation.js And nominations.js

- `review.js` can reuse `NOMINATION_STATUSES` and unsafe field constants from `validation.js`.
- `promotion.js` can reuse `stripUnsafePublicFields` and coordinate/text helpers from `validation.js`.
- `promotion.js` may consume a nomination-shaped object but must not expose private fields.
- `nominations.js` remains for public submission helpers only, not admin review.

## Future Extraction Strategy

Recommended phase sequence:

1. Phase 10P - Extract audit/reviewHistory pure helpers first.
2. Phase 10Q - Extract admin review status/assessment pure helpers.
3. Phase 10R - Extract promotion payload builder, pure helpers only.
4. Phase 10S - Add admin workflow tests to `engine-test.html`.
5. Phase 10T - Carefully wire helpers into `manage-nominations.html` while keeping Firestore writes in the page script.

Do not move Firestore writes into engine modules.

## Testing Checklist For Future Admin Extraction

### Admin Review

- `manage-nominations.html` loads
- nomination list loads
- filters/search/sort work
- status changes save
- `adminNotes` save
- admin assessment fields save
- `reviewHistory` records `review_saved`
- `reviewHistory` records `status_changed`
- public pages do not show `reviewHistory`
- public export does not include `reviewHistory`

### Promotion

- approved nomination can be promoted
- non-approved nomination cannot be promoted if current behavior requires approval
- `communityPlaces` record is created
- source nomination becomes `promoted`
- `promotedPlaceId` is saved
- `promotedAt` is saved
- `reviewHistory` records promoted action
- promoted public place excludes private/admin fields
- public Places/search/map/place.html show promoted record
- public `heritage.json` includes promoted record only from `communityPlaces`
- public `heritage.json` excludes private/admin fields

### Safety

- no public user can write `communityPlaces`
- no `placeNominations` data appears in public export
- no admin fields appear in public place pages
- Firestore rules are not broadened unnecessarily
- browser console has no module import errors

## Safety Stop Rules

Stop and do not commit future implementation if:

- promotion copies `nominatorEmail`
- promotion copies `adminNotes`
- promotion copies admin assessment fields
- promotion copies `reviewHistory`
- public export includes `placeNominations`
- public pages show private fields
- admin review write fails unexpectedly
- promotion write fails unexpectedly
- Firestore rules need emergency broadening
- `communityPlaces` direct public write path appears

## Commit Guidance

Suggested commit message:

```text
Phase 10O: Add admin review and promotion extraction plan
```
