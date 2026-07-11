# Phase 13C/13D Image Promotion and Replies Plan

## Why This Phase Exists

Phase 13B made approved contribution images safe to display in the Comments and Photos feed. Phase 13C/13D builds on that by giving admins an explicit way to promote a vetted contribution image into the main public place image, and by adding moderated replies under approved contributions.

This phase keeps the public/private boundary from Phase 13B intact: uploaded Storage metadata remains review-only, public pages receive only public-safe fields, and no approved contribution image is promoted automatically.

## Part A: Phase 13C Image Promotion

### Intended Workflow

1. A signed-in user submits a place contribution with either an image URL or one uploaded image.
2. Admin reviews the contribution and approves it.
3. The approved contribution image becomes eligible for promotion only after approval.
4. Admin explicitly chooses an eligible approved contribution image as the main public place image.
5. The place page renders the promoted image as the main place image.
6. The original approved contribution remains visible in the Comments and Photos feed.

Promotion is an explicit admin action. Approving a contribution must not automatically update the main place image.

### Expected Data Model

The safest first implementation path is to keep public place image data on the public place document and only store public-safe promotion references there.

Likely place fields:

- `imageUrl`: public URL used as the main place image.
- `imageAlt`: optional public alt text derived from contribution caption or place title.
- `imageCredit`: optional public credit text.
- `imageRightsStatus`: optional public rights status when available.
- `promotedContributionId`: approved contribution id used as the source.
- `promotedContributionImageUrl`: public-safe image URL copied from the approved contribution.
- `promotedContributionImageAt`: server timestamp for the promotion action.

Contribution documents should continue to use private upload metadata only while submitted/review-only, and approved contribution documents should expose only public-safe image display fields.

### Rules Strategy

Firestore rules should allow only admins to update the main public place image fields. Public reads of place documents and approved contribution documents must not expose Phase 13B private upload fields:

- `imageStoragePath`
- `imageFileName`
- `imageFileContentType`
- `imageFileSize`
- `imageUploadedAt`
- `imageUploadedByUid`
- `imageUploadVisibility`

Rules should require promotion source data to be public-safe. If rules cannot reliably validate the source contribution document, the admin UI and helper functions should enforce eligibility, and rules should restrict the writable fields and types tightly.

### Storage and Public Image Safety

Uploaded contribution files stay in the private Storage path from Phase 13B. Promotion should not expose private Storage paths. The public main image should use the same public-safe URL created during admin approval, or a previously public image URL from an approved contribution.

No new public Storage read path is planned unless implementation discovers a gap in the Phase 13B approval conversion. Any Storage rules changes should be separately justified and tested.

### Admin UI Strategy

`manage-place-contributions.html` should show whether an approved contribution image is eligible for promotion and whether it is already the current promoted main image. Admin controls should be explicit, probably a button such as "Use as main image" on eligible approved contribution cards.

The admin UI should display current promoted image status without hiding the normal approve/reject workflow.

### Public UI Strategy

`place.html` and `place.js` should continue to render approved contribution images in Comments and Photos. The main place image should update only when the public place image field is changed by an admin promotion action.

The approved contribution image must remain visible only in the contribution feed unless it has been explicitly promoted.

### Export Strategy

The `heritage.json` export should stay public-safe. It may include the public main image fields and public-safe promoted contribution references, but it must not include private upload metadata, UIDs, email addresses, moderation notes, or review-only fields.

## Part B: Phase 13D Replies and Comments

### Intended Workflow

1. A visitor views approved place contributions on a public place page.
2. A signed-in user submits a plain-text reply under an approved contribution.
3. New replies start as `submitted` unless the existing moderation model clearly supports immediate public display.
4. Admin reviews submitted replies.
5. Approved replies appear under the related approved contribution.
6. Submitted and rejected replies stay hidden publicly.

Anonymous replies, rich text, notifications, and contributor profile pages are out of scope.

### Expected Data Model

Use a dedicated reply collection or subcollection with a narrow parent reference. The likely preferred shape is a top-level collection because existing rules and admin pages already use top-level moderation collections.

Possible `placeContributionReplies/{replyId}` fields:

- `placeId`
- `contributionId`
- `replyText`
- `replyStatus`: `submitted`, `approved`, or `rejected`
- `submittedAt`
- `submittedByUid`
- `submittedByDisplayName`
- `approvedAt`
- `approvedByUid`
- `rejectedAt`
- `rejectedByUid`
- `adminNotes`

Public-safe approved reply output must not include email, UID, admin notes, private moderation fields, or rejected/submitted content.

### Rules Strategy

Firestore rules should allow signed-in users to create replies only for themselves and only in `submitted` status. User-created replies should not include approval, rejection, admin note, or public moderation fields.

Public reads should allow only approved replies and only public-safe fields. Admin reads should allow review access. Admin writes should approve or reject replies while preserving the public/private boundary.

If querying approved replies under contributions needs composite indexes, document the index requirement before preview verification.

### Admin UI Strategy

`manage-place-contributions.html` is the likely first admin surface for reply review, either in a new replies section or nested under each contribution card. The admin should be able to see submitted reply text and metadata, approve or reject the reply, and understand which place contribution the reply belongs to.

Admin notes are optional and should remain private if added.

### Public UI Strategy

`place.html` and `place.js` should render approved replies beneath their related approved contribution in the Comments and Photos feed. Signed-in users should get a simple reply form under approved contributions.

The form should be plain text only. Submitted replies should show a clear local status after submission but should not appear publicly until approved.

## Likely Files

- `place.html`
- `place.js`
- `manage-place-contributions.html`
- `heritage-engine/place-contributions.js`
- `heritage-engine/heritage-json.js` or related export helper, if present
- `firestore.rules`
- `storage.rules`, only if a real Storage gap appears
- `style.css`
- `tests/place-contributions.test.mjs`
- `tests/firestore.rules.test.mjs`
- `tests/storage.rules.test.mjs`, only if Storage rules change
- `tests/browser-smoke.spec.mjs`
- `docs/phase-13c-13d-image-promotion-replies-plan.md`

## Tests

Planned test coverage:

- approved contribution image can be marked eligible for admin promotion
- submitted or rejected contribution image cannot be promoted
- promotion writes only public-safe main image fields
- public place reads do not expose private upload metadata
- `heritage.json` export stays public-safe after promotion
- signed-in user can create a submitted reply
- signed-out user cannot create a reply
- user cannot forge another user's reply author UID
- user cannot create an approved reply directly
- submitted and rejected replies are hidden publicly
- admin can approve or reject replies
- approved replies render under the correct contribution
- browser smoke covers the Comments and Photos feed with promoted image and approved replies

## Preview Verification

Preview verification should happen only after explicit approval to deploy preview Hosting and any required rules. The preview checklist should include:

- deploy Firebase Hosting preview for the feature branch
- deploy Firestore rules only with explicit approval
- deploy Storage rules only with explicit approval, and only if changed
- create a temporary approved contribution image
- promote it through the real admin UI
- confirm the public place main image changes
- confirm the contribution feed still shows the approved contribution image
- confirm no private upload metadata appears publicly
- submit a temporary reply as a signed-in user
- approve the reply through the real admin UI
- confirm approved reply appears under the correct contribution
- confirm submitted/rejected replies stay hidden
- clean up temporary Firestore documents and Storage objects

## Production Smoke Test

After merge, production smoke testing must wait for the post-merge production gate:

- confirm GitHub Pages deployment status
- confirm production files are fresh
- do not smoke test against stale production
- run a narrow promotion smoke test with temporary contribution data
- run a narrow reply moderation smoke test
- clean up temporary Firestore documents and Storage objects

No production Hosting, Firestore rules, or Storage rules deployment should be run manually without explicit approval.

## Rollback Plan

If promotion causes public display issues, rollback by reverting the promotion UI/code commit and restoring the previous public `imageUrl` value on affected place documents. If reply moderation causes public/private boundary issues, disable the reply form and public reply renderer, then revert the Firestore rules and reply implementation commits.

For deployed Firebase rules, use Firebase Console Rules history or a known-good committed rules file to restore the previous rule set. For GitHub Pages production issues, follow `docs/post-merge-production-gate.md` before deciding whether the site is stale, failed to deploy, or serving a bad build.
