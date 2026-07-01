# Phase 11C / Phase 13 Place Contribution Workflow Plan

Date: 2026-07-01
Branch: `codex/phase-11c-place-contribution-workflow`
Base branch: `main`
Expected PR type: one longer-lived draft PR

## Goal

Build the first real signed-in `Comments and Photos` contribution workflow for existing published place records.

The nomination flow stays dedicated to proposing new place records.

This workflow is for supplementary public contributions attached to an existing `communityPlaces` record.

PR #34 already added the approved-only public display layer for `placeContributions`. This workflow PR should add submission and moderation while keeping the public site safe: submitted and rejected contributions must stay hidden, approved contributions may appear publicly, and private moderation fields must not leak into the public place page.

## Current logic to preserve

- `nominate-place.html` proposes a new place record.
- `place.html` Comments and Photos tab collects supplementary comments and photos for an existing published place.
- PR #34 built the approved read-only display for place contributions.
- Nomination workflow, promotion logic, and existing place display should not change unless a small compatibility fix is required.

## Scope For This PR

Target behavior for this PR:

- signed-out users see guidance to sign in before contributing
- signed-in users can open a contribution form on `place.html`
- signed-in users can submit:
  - `contributionText`
  - optional `imageUrl`
  - optional `imageCaption`
  - optional `imageCredit`
  - optional `imageRightsStatus`
- new records are written to `placeContributions`
- new public submissions are saved with `contributionStatus = "submitted"`
- approved-only public display on `place.html` remains intact
- admins can review submitted contributions and approve or reject them
- approved contributions appear publicly
- rejected contributions stay hidden publicly

Out of scope for this PR:

- reply system
- contributor profile page
- local file upload
- complex media gallery
- broad user edit/delete flows
- notification system

## Planned Workflow

### 1. Public place page entry point

Likely files:

- `place.html`
- `place.js`
- `style.css`
- `heritage-engine/place-contributions.js`
- existing public auth helper modules if needed

Planned public behavior:

- keep rendering only approved `placeContributions` records
- show signed-out visitors a clear sign-in prompt in the `Comments and Photos` tab
- show signed-in visitors a contribution entry point and form
- keep the UI aligned with the PR #34 Historic England-inspired structure
- keep private submitter and moderation fields out of public rendering
- keep the current approved-only public contribution feed as the only public output

### 2. Signed-in contribution submission

The first version should stay intentionally simple:

- allow signed-in users to submit contribution text
- allow an optional image URL field
- do not build local file upload yet
- save new records to `placeContributions`
- new records must start with `contributionStatus = "submitted"`
- submitted records must not appear in public approved-only rendering until an admin approves them

New client submissions should include only the fields needed for a submitted record, including:

- `placeId`
- `placeTitleSnapshot`
- `contributionText` when provided
- `imageUrl` when provided
- `imageCaption` when provided
- `imageCredit` when provided
- `imageRightsStatus` when provided
- `submittedByUid`
- `submitterEmail`
- optional public-safe `submitterDisplayName`
- `contributionStatus = "submitted"`
- `createdAt`
- `updatedAt`

Users must not be able to submit:

- `contributionStatus = "approved"`
- `contributionStatus = "rejected"`
- `adminNotes`
- `reviewHistory`
- other private moderation fields

### 3. Firestore rules

Likely files:

- `firestore.rules`
- `tests/firestore.rules.test.mjs`

Rules should keep PR #34 approved-only public reading behavior and add controlled create behavior:

- signed-out users cannot create place contributions
- signed-in users can create submitted place contributions only
- signed-in users cannot create approved or rejected contributions directly
- signed-in users cannot write admin or moderation fields
- public writes remain denied
- public approved-only read behavior remains available for approved public-safe contribution documents
- submitted, rejected, and private contribution documents must not be publicly readable
- admin review updates stay behind the existing admin access pattern

Important rule-design note:

- Firestore rules cannot redact fields from a readable document
- documents readable to the public should contain only public-safe fields, or private and admin data should be kept in a separate admin-only document or path

Important process rule:

- do not deploy Firestore rules without explicit approval

### 4. Admin review path

Likely files:

- an existing admin review page extended for contributions, or
- a new focused admin contributions review page if that is cleaner

Planned admin behavior:

- list submitted `placeContributions`
- inspect contribution text and image metadata
- approve or reject
- optionally save private `adminNotes`
- record `reviewedAt`, `updatedAt`, and moderation history
- keep approved contributions visible publicly
- keep submitted and rejected contributions hidden publicly

Recommended moderation fields:

- `contributionStatus`
- `reviewedAt`
- `reviewedByUid`
- `adminNotes`
- `reviewHistory` if needed

## Tests

Likely files:

- `tests/place-contributions.test.mjs`
- `tests/firestore.rules.test.mjs`

Planned test coverage:

- helper normalization for signed-in submitted contributions
- invalid empty contribution rejection
- optional HTTPS image URL validation
- client payload does not emit forbidden or undefined fields
- submitted contributions do not create public payloads
- approved contributions do create public-safe payloads
- private submitter and moderation fields stay out of public rendering
- signed-out user cannot create contributions
- signed-in non-admin user can create only submitted contributions
- signed-in non-admin user cannot create approved or rejected contributions
- signed-in non-admin user cannot create or update admin or moderation fields
- public approved-only read rule still works
- submitted and rejected contributions remain hidden publicly
- admin can approve or reject
- existing nomination and promotion tests still pass

## Firebase Preview Verification

Preview verification for this PR should happen on Firebase Hosting preview, not on the GitHub Pages live site.

Manual preview checklist:

1. signed-out user sees sign-in guidance on `place.html`
2. signed-in user can open the contribution form
3. signed-in user can submit a new contribution
4. submitted contribution does not appear publicly right away
5. admin can review the submitted contribution
6. approved contribution appears publicly on `place.html`
7. rejected contribution remains hidden publicly
8. private submitter and moderation fields do not appear in the public DOM
9. Overview tab and existing promoted place image behavior still work
10. GitHub Pages production remains unchanged until merge
11. temporary Firestore test documents are cleaned up after verification

## Rollback Plan

If this workflow introduces regressions, rollback should stay narrow:

- revert or disable the new public submission entry point
- revert contribution-create client behavior if needed
- revert contribution admin-review UI changes if needed
- revert rules changes separately if they are the source of the failure

Rollback should not disturb:

- nomination submission
- existing approved-only public contribution rendering
- promoted place image behavior
- GitHub Pages production deployment source

## Working Rule

Use one feature slice, one branch, one draft PR, and multiple commits or fixes inside the same PR until preview verification is complete.

This document is the first planning commit for the workflow. Implementation, tests, preview verification, and any small fixes should continue inside this same draft PR.
