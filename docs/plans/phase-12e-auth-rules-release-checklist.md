# Phase 12E — Auth, Rules, and Release Verification Checklist

This checklist is for source review, emulator testing, and controlled release verification before any intentional Firebase rules deployment or public rollout.

## A. Public auth

- [ ] Public registration works with email/password.
- [ ] Public login works with email/password.
- [ ] Public logout works.
- [ ] Password mismatch blocks registration.
- [ ] Consent checkbox is required before registration.
- [ ] Display name is stored in the Firebase Auth profile when provided.
- [ ] Public auth stays on the public auth flow and does not redirect to admin pages.
- [ ] Public auth pages do not expose admin controls or admin-only links.

## B. Nomination submission

- [ ] Signed-out users cannot submit nominations.
- [ ] Signed-in users can submit nominations.
- [ ] Map `lat` / `lng` handoff still works after sign-in and redirect return.
- [ ] Submitted nomination payload includes `submittedByUid` matching the current signed-in `user.uid`.
- [ ] Submitted nomination payload includes `submitterEmail` matching the signed-in auth email.
- [ ] Submitted nomination payload includes `submissionAuthType: "signedIn"`.
- [ ] Submitted nomination payload starts with `nominationStatus: "submitted"`.
- [ ] Public users still cannot write `communityPlaces`.

## C. My nominations

- [ ] Signed-out users see a sign-in-required message.
- [ ] Signed-out users do not see nomination records.
- [ ] Signed-in users see only their own nominations.
- [ ] Other users' nominations are not visible.
- [ ] The page is read-only in this phase.
- [ ] Admin/private fields are not displayed.
- [ ] Public-friendly nomination status labels are used.

## D. Firestore rules

- [ ] Public read works for `communityPlaces`, `news`, and `history`.
- [ ] Signed-out `placeNominations` create fails.
- [ ] Signed-in `placeNominations` create with the current user's UID passes.
- [ ] Signed-in `placeNominations` create with another UID fails.
- [ ] Signed-in users can read only their own `placeNominations`.
- [ ] Signed-in users cannot read another user's `placeNominations`.
- [ ] Signed-in users cannot run a broad list query across all `placeNominations`.
- [ ] Signed-in users cannot update `placeNominations`.
- [ ] Signed-in users cannot delete `placeNominations`.
- [ ] Signed-in users cannot write `communityPlaces`.
- [ ] Admin can still read, review, and promote nominations.

## E. Export safety

- [ ] Public export reads only `communityPlaces`, `news`, and `history`.
- [ ] Public export excludes `placeNominations`.
- [ ] Public export excludes ownership fields:
- [ ] `submittedByUid`
- [ ] `submitterEmail`
- [ ] `submitterDisplayName`
- [ ] `submissionAuthType`
- [ ] Public export excludes admin/private fields:
- [ ] `adminNotes`
- [ ] `reviewHistory`
- [ ] Admin assessment fields
- [ ] `nominatorEmail`

## F. Admin workflow

- [ ] Admin login still works.
- [ ] `manage-nominations.html` still loads for the configured admin account.
- [ ] Admin can review a nomination.
- [ ] Admin can promote an approved nomination.
- [ ] Promotion strips private auth/admin fields before creating `communityPlaces`.

## G. Deployment caution

- [ ] Local rules are not proof of deployed rules.
- [ ] Firebase rules deployment is intentional and separately reviewed.
- [ ] Final verification is run with the Firebase emulator or a controlled deployed review target before release.
- [ ] Backup/export steps are prepared before production Firebase changes.

## Suggested release verification notes

- Record the exact branch and commit under review before any release decision.
- Capture screenshots or short notes for signed-out and signed-in nomination flows.
- Log any rule-test results with the user identity used for each case.
- Treat manual Firebase Console deployment as a separate approval step.
