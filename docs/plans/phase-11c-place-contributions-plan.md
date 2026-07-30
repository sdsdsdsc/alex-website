# Phase 11C / Phase 13 Place Contributions Plan

## Scope

This document plans a future activation of the existing `Comments and Photos` area on `place.html` so registered users can submit supplementary place-related text and image evidence.

This is a documentation-only planning step.

Decision for this step:

- Use Option 2: separate GitHub branch plus draft PR.
- Do not use Option 1.
- Do not create a separate GitHub repo.
- Do not use Option 3 yet for this planning step.

Before any real implementation or live testing of registered-user contributions begins, Option 3 should be prepared:

- Firebase Hosting preview or staging should be set up first because this feature touches sign-in, Firestore writes, user-generated content, admin review, and likely later photo upload work.

Non-goals for this planning step:

- Do not change Firestore rules.
- Do not change Firebase config.
- Do not change HTML, CSS, or JavaScript behavior.
- Do not change the nomination workflow.
- Do not change promotion logic.
- Do not change search or map behavior.
- Do not change authentication behavior.
- Do not implement the feature yet.

## Why This Feature Matters

The current public place pages already reserve space for community participation through the `Comments and Photos` tab. Turning that area into a moderated supplementary contribution workflow would let registered users add:

- local knowledge
- memories
- corrections or updates
- image URL evidence
- image caption
- image source or credit
- image rights status
- permission confirmation

The key safety rule must stay in place:

- user submissions must not auto-publish
- new contributions must be stored as pending or submitted first
- only approved contributions should appear publicly on `place.html`

## 1. Current Page State

### `place.html`

`place.html` already has a two-tab structure:

- `Overview`
- `Comments and Photos`

The `Comments and Photos` tab is already wired into the tab UI with:

- `id="commentsPhotosTab"`
- `href="?section=comments-photos#comments-photos-panel"`
- `aria-controls="comments-photos-panel"`

The panel itself already exists:

- `id="comments-photos-panel"`
- `class="place-tab-panel place-comments-panel"`

The current panel content is placeholder-only:

- heading: `Add Comments and Photos`
- intro copy inviting photographs, memories, and local knowledge
- empty-state message: `No comments or photos have been added to this record yet.`
- notice copy explaining that a record-specific contribution system will be added later

### `place.js`

`place.js` already supports section switching between:

- `overview`
- `comments-photos`

Current behavior:

- `validSections` includes `comments-photos`
- `buildSectionUrl()` and `setActiveSection()` already support the tab
- the `Comments and Photos` panel is not data-driven yet
- `loadPlace()` reads a single record from `communityPlaces`
- no contribution query, render path, or sign-in state logic exists in `place.js` today

This means the page shell is ready, but the data model and render pipeline for moderated contributions do not exist yet.

### `style.css`

`style.css` already includes relevant presentation classes for the placeholder panel:

- `.place-comments-panel`
- `.place-comments-panel__main`
- `.place-comments-empty`
- `.place-comments-panel__notice`

Current layout:

- a two-column panel with main content plus a notice sidebar
- a strong empty-state box
- a styled contribution notice

This is enough to support a first read-only contribution display later without redesigning the tab from scratch.

## 2. Current Auth State

Public sign-in already exists.

Relevant files:

- `public-auth.js`
- `public-auth.html`
- `my-nominations.js`
- `nominate-place.js`
- `public-nav.js`

Current public auth characteristics:

- Firebase Auth uses browser local persistence in `public-auth.js`
- users can register, sign in, and sign out through the public auth page
- `public-auth.js` supports a `next` redirect back to the requesting page
- `my-nominations.js` already uses `onAuthStateChanged()` and owner-linked Firestore reads
- `nominate-place.js` already requires signed-in public submission for nominations

What this means for `place.html` later:

- `place.html` can detect signed-in users by adding the same Firebase Auth client pattern already used on public pages
- signed-out users can be shown a sign-in prompt with a `next` link back to the specific place page and section
- signed-in users can later see a contribution form state without changing the current auth model

One important current limitation:

- `public-nav.js` is static navigation only
- it does not expose signed-in user state directly

So contribution UI state should not depend on the nav bar. It should be handled inside `place.js` or a dedicated contribution module.

## 3. Current Firestore and Rules State

Current Firestore collections in active use include:

- `communityPlaces`
- `placeNominations`
- `news`
- `history`

Current rule posture:

- `communityPlaces`: public read, admin write
- `placeNominations`: signed-in create, owner read, admin review and promotion update
- `news`: public read, admin write
- `history`: public read, admin write

### What `placeNominations` already gives us

`placeNominations` is the closest existing model for public registered-user submission plus admin review.

It already demonstrates:

- signed-in public user creates a record
- record is linked to `submittedByUid`
- private submitter fields stay private
- admins review and update status
- only admins promote data into public `communityPlaces`

`manage-nominations.html` already provides:

- admin-only review page
- status workflow
- admin notes
- review history
- promotion confirmation

### What can be reused safely

Reusable ideas and patterns:

- owner-linked submitted records using `submittedByUid`
- submitter metadata pattern: uid, email, optional display name
- moderation status pattern
- admin notes pattern
- review history pattern
- helper-first data shaping in `heritage-engine`

What should not be reused directly:

- writing contributions into `communityPlaces` before moderation
- piggybacking contributions into nomination data
- auto-copying user-submitted evidence into public fields without approval

## 4. Proposed Data Model

Recommended new collection:

- `placeContributions`

Recommended first field set:

- `placeId`
- `placeTitleSnapshot`
- `contributionText`
- `imageUrl`
- `imageCaption`
- `imageCredit`
- `imageRightsStatus`
- `imagePermissionConfirmed`
- `submittedByUid`
- `submitterEmail`
- `submitterDisplayName`
- `contributionStatus`
- `createdAt`
- `updatedAt`
- `reviewedAt`
- `adminNotes`

Recommended status values:

- `submitted`
- `approved`
- `rejected`

Recommended additional optional fields worth planning for now:

- `reviewHistory`
- `submissionAuthType`
- `sourcePlaceRecordStatusSnapshot`

Why a separate collection is better than embedding inside `communityPlaces`:

- it keeps unreviewed user-generated content out of the public record document
- it fits the current moderation model already used for nominations
- it reduces risk of private metadata leaking into public place reads
- it leaves room for later Storage-backed uploads without reshaping the main public place schema

## 5. Public Display Rule

Public `place.html` should show only approved contributions.

Public rendering rules should be:

- read approved contributions filtered by `placeId`
- never expose `submittedByUid`
- never expose `submitterEmail`
- never expose private admin notes
- render only approved public-safe text and image metadata

Public fields that may be shown for approved image contributions:

- contribution text
- image URL
- image caption
- public credit or source line
- possibly public display name if later intentionally allowed

Default conservative recommendation:

- do not display raw email addresses
- do not display private moderation notes
- do not display rights workflow internals unless they are intentionally mapped to a public-safe label

## 6. User Submission Rule

Recommended contribution submission behavior:

- signed-in users can create their own `submitted` contribution records
- signed-out users should see a sign-in prompt that routes back to the same place page
- users should not be able to approve, reject, or publish their own contributions
- users should not write directly to `communityPlaces`

For the first implementation direction:

- use image URL only
- do not build Firebase Storage upload yet

Reason:

- URL-based evidence is much smaller in scope
- Storage upload would add rules work, file-size limits, upload UI, moderation of binaries, and storage-cost planning

## 7. Admin Review Workflow

Recommendation:

- create a new admin review page for place contributions rather than extending `manage-nominations.html` in the first pass

Reasoning:

- nominations and place contributions are different moderation objects
- nominations feed promotion into `communityPlaces`
- contributions are supplementary content attached to an existing public place record
- combining both workflows in one page would make the first implementation harder to reason about and easier to regress

Suggested future page:

- `manage-place-contributions.html`

Recommended admin actions:

- review submitted contribution
- approve contribution
- reject contribution
- add private admin notes
- hide unsafe, irrelevant, or inappropriate material

Recommended admin review data:

- place link and place title snapshot
- contribution text
- image URL and public credit fields
- rights and permission fields
- submitter identity for private moderation only

## 8. Firebase Hosting Preview and Staging

Before implementation begins, Option 3 should be used:

- prepare Firebase Hosting preview or staging before testing this feature

This feature touches:

- public sign-in state
- Firestore writes
- user-generated content
- admin review
- public display filtering
- likely later Storage upload

Important warning:

- a plain GitHub Pages branch preview is not enough for real contribution testing
- once real contribution writes are added, preview testing should happen in a controlled Firebase-aware environment first

Recommended staging sequence before feature coding moves beyond helper design:

1. Prepare Firebase Hosting preview or staging.
2. Confirm sign-in and Firestore wiring there.
3. Test contribution submission and moderation there.
4. Merge to `main` only after staging verification.

## 9. Smallest Safe Implementation Step After This Plan

Recommended next implementation PR:

- create `placeContributions` data model helpers and tests first

Why this is the safest next step:

- it lets us define field allowlists, normalization, privacy boundaries, and status transitions before touching UI
- it mirrors the repo’s existing helper-first approach in `heritage-engine`
- it keeps the first code PR small and reviewable

Recommended helper responsibilities:

- normalize contribution payloads
- validate contribution text and optional image URL fields
- strip private fields from public render payloads
- define approved-only display shaping
- define admin review update payloads

Possible alternative second step after helper tests:

- add a read-only approved-contributions renderer on `place.html` using seeded safe test data

That would be a safer next UI step than jumping straight to live submission writes.

## 10. Verification Plan

Later implementation and live verification should include at least these checks:

- signed-out user cannot submit
- signed-in user can submit a pending contribution
- pending contribution does not appear publicly
- admin can approve a contribution
- approved text appears on the correct place page
- approved image URL appears on the correct place page
- private submitter fields do not appear publicly
- rejected contribution does not appear publicly
- existing `Overview` tab still works
- existing image promotion still works

Additional recommended checks:

- invalid or blank image URL is rejected by client helpers
- contribution is attached to the correct `placeId`
- sign-in redirect returns to the same record page and `comments-photos` section
- approved image credit displays cleanly on mobile and desktop

## Recommended Delivery Shape

The safest incremental path is:

1. Planning document
2. Data model helpers plus tests
3. Approved-only read renderer on `place.html`
4. Signed-in submission form and pending save flow
5. Admin review page
6. Only later, consider Storage-backed upload

## Conclusion

The existing `Comments and Photos` tab should stay in place and be evolved into a moderated supplementary contribution system.

The safest architecture is:

- new `placeContributions` collection
- signed-in user submission to `submitted`
- admin-only moderation
- approved-only public rendering
- image URL first
- Firebase Hosting preview or staging prepared before real implementation and testing
