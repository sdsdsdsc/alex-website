# Phase 11C — Signed-in place contribution workflow plan

Date: 2026-07-01
Branch: `codex/phase-11c-place-contribution-workflow`
Base branch: `main`
Expected PR type: one longer-lived draft PR

## Purpose

Build the first real signed-in contribution workflow for existing published place records.

PR #34 added the approved-only public display layer for `placeContributions`. Phase 11C should add the missing submission and moderation workflow while keeping the public site safe: submitted and rejected contributions must stay hidden, approved contributions may appear publicly, and moderation/private fields must not leak into the public place page.

## Current logic to preserve

- `nominate-place.html` proposes a new place record.
- `place.html` Comments and Photos tab collects supplementary comments/photos for an existing published place.
- PR #34 built the approved read-only display for place contributions.
- Nomination workflow, promotion logic, and existing place display should not be changed unless a small compatibility fix is required.

## Workflow target

### 1. Public place page entry point

On `place.html`, in the Comments and Photos tab:

- Keep rendering only approved `placeContributions` records.
- Show signed-out users clear sign-in guidance.
- Show the Add comments/photos action as an active submission action only when a user is signed in.
- Open a simple inline panel or modal for signed-in contribution submission.
- Keep the UI close to the PR #34 Historic England-inspired structure: contribution callout, approved count, feed-style entries, and right-side User contributions box.

### 2. Signed-in contribution submission

The first version should be intentionally simple:

- Allow signed-in users to submit contribution text.
- Allow an optional image URL field.
- Do not build local file upload yet.
- Save new records to `placeContributions`.
- New records must start with `contributionStatus: "submitted"`.
- Submitted records must not appear in public approved-only rendering until an admin approves them.

Recommended public-safe submitted fields:

- `placeId`
- `contributionText`
- `imageUrl` or equivalent optional image URL field
- `contributionStatus: "submitted"`
- `createdAt`
- `createdByUid`
- `createdByDisplayName` if already available safely

Moderation fields should be admin-only and should not be user-writable.

### 3. Firestore rules

Rules should keep PR #34 approved-only public reading behavior and add controlled create behavior:

- Signed-out users cannot create place contributions.
- Signed-in users can create submitted place contributions only.
- Signed-in users cannot create approved or rejected contributions directly.
- Signed-in users cannot write admin/moderation fields.
- Public writes remain denied.
- Public approved-only read behavior remains available for public-safe contribution documents.
- Submitted/rejected/private contribution documents must not be publicly readable.

Important rule-design note: because Firestore rules cannot redact fields from a readable document, documents readable to the public should contain only public-safe fields, or private/admin data should be kept in a separate admin-only document/path.

### 4. Admin review

Add or extend an admin page/section for `placeContributions` review:

- Admin can list submitted contributions.
- Admin can view enough context to moderate the contribution.
- Admin can approve or reject.
- Approved contributions appear on `place.html`.
- Rejected contributions stay hidden publicly.
- `adminNotes` and moderation metadata stay private.

Recommended moderation fields:

- `contributionStatus`
- `reviewedAt`
- `reviewedByUid`
- `adminNotes` if needed

### 5. Tests

Add or update helper/emulator tests for this workflow:

- Signed-out user cannot create a contribution.
- Signed-in user can create a submitted contribution.
- Signed-in user cannot create an approved contribution.
- Signed-in user cannot create or update admin/moderation fields.
- Public can read approved public-safe contributions.
- Public cannot read submitted contributions.
- Public cannot read rejected/private contribution documents.
- Admin can approve or reject.
- Existing nomination and promotion tests still pass.

### 6. Preview verification checklist

Before final merge:

- Deploy Firebase Hosting preview for this branch.
- Deploy Firestore rules only after explicit approval.
- Test signed-in contribution submission.
- Confirm the submitted item does not appear publicly.
- Approve the item as admin.
- Confirm the approved item appears on `place.html`.
- Reject another test item.
- Confirm the rejected item stays hidden publicly.
- Confirm GitHub Pages production remains stable until merge.
- Delete temporary Firestore test documents after verification.

## Explicit limits for this PR

Do not include these in Phase 11C unless they are only harmless placeholders:

- No reply system.
- No contributor profile page.
- No local image upload.
- No nomination workflow changes.
- No promotion logic changes.
- No Firebase app config changes unless absolutely required.
- No multiple small PRs for small fixes inside this feature slice.

## Working rule

Use one feature slice, one branch, one draft PR, and multiple commits/fixes inside the same PR until preview verification is complete.