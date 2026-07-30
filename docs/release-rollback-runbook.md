# Release Rollback Runbook

This runbook explains what the owner should do if a release or Firebase rules change breaks public auth, nomination submission, `My nominations`, admin review or promotion, or the public export workflow.

It is a recovery guide only. It does not instruct the reader to deploy, delete, or change anything immediately, and it does not change application behavior by itself.

## 1. Purpose

Phase 12 introduced public account registration/login, signed-in nomination submission, owner-scoped nomination reads, and related Firestore rules expectations.

If a release introduces a failure in any of these areas, the safest response is a controlled rollback to the last known-good state rather than ad hoc live edits.

Use this document when:

- public registration or sign-in stops working;
- signed-in nomination submission fails;
- `My nominations` cannot load owner-scoped records;
- public users can see records they should not see;
- admin nomination review or promotion fails;
- public export exposes private data;
- deployed Firestore rules are too strict or too loose;
- GitHub Pages files appear wrong, stale, or incompletely refreshed.

## 2. What Can Go Wrong

Likely rollback triggers include:

- public registration fails;
- public login or logout fails;
- signed-in nomination submission fails;
- `My nominations` cannot read owner-scoped records;
- public users can see nominations or fields they should not see;
- admin cannot review nominations;
- admin cannot promote approved nominations;
- public export leaks private fields;
- deployed Firestore rules are too strict and block intended workflows;
- deployed Firestore rules are too loose and allow unintended access;
- GitHub Pages files are wrong, incomplete, or stale;
- browser caching keeps older JavaScript after a file update.

If the issue affects privacy, authorization, or unintended public visibility, stop release activity first and treat rollback as urgent.

## 3. Pre-Release Rollback Preparation

Before any release, rules deployment, or public-auth rollout, make sure the following are ready:

- a current Firestore backup has been completed;
- the previous known-good GitHub Pages file set or commit has been identified;
- the previous known-good `firestore.rules` text has been saved outside the current working draft;
- the current Firebase rules deployment time and version note have been recorded;
- a public test account is available;
- a test admin account is available;
- [docs/release-smoke-test-matrix.md](./release-smoke-test-matrix.md) is ready;
- [docs/plans/firestore-rules-verification-plan.md](./plans/firestore-rules-verification-plan.md) is ready.

Do not rely on memory during rollback. Record the intended previous file set and previous rules text before release work begins.

## 4. GitHub Pages File Rollback

If the problem appears to come from the published site files rather than from Firebase rules, use a manual GitHub Pages rollback.

Preferred options:

1. Re-upload the previous known-good file set to GitHub main.
2. Use GitHub commit history to restore the affected files from the last known-good version.
3. If the break is clearly limited, restore only the affected Phase 12 files instead of the whole site.

Likely Phase 12 rollback candidates:

- `public-auth.html`
- `public-auth.js`
- `nominate-place.html`
- `nominate-place.js`
- `my-nominations.html`
- `my-nominations.js`
- `public-nav.js`
- `style.css`

Guidance:

- prefer the smallest rollback that restores stable behavior safely;
- if multiple auth or nomination pages are failing together, restore the full known-good Phase 12 file set rather than mixing versions casually;
- confirm GitHub Pages has refreshed after the file restore;
- perform a hard refresh and, if needed, clear browser cache before deciding the rollback failed;
- retest with both a signed-out browser and a signed-in test account.

## 5. Firestore Rules Rollback

If the problem appears to be caused by deployed Firestore rules, use a cautious rules rollback.

Steps:

1. Do not edit rules blindly in a hurry.
2. Compare the currently deployed behavior with the previous known-good rules text.
3. Copy the previous known-good `firestore.rules` content exactly.
4. Confirm that the rollback target is the intended previous version and not another draft.
5. Deploy the previous rules only after that confirmation.
6. Record the rollback time and the rules version restored.

After a rules rollback, retest at minimum:

- public read of `communityPlaces`, `news`, and `history`;
- signed-in nomination create;
- `My nominations` owner-scoped read;
- admin nomination review and promotion;
- public users cannot write `communityPlaces`.

If the issue was an overexposed permission problem, verify the deny cases too before considering the rollback complete.

## 6. Data Rollback And Cleanup Caution

Be conservative with live data.

- do not delete live nominations casually;
- do not delete `communityPlaces` records without explicit confirmation;
- if release testing created nominations, mark them clearly for later review or clean them only after backup and approval;
- admin backup files may contain private data and must stay outside the repo;
- Firestore document backup does not back up Firebase Storage file bytes.

If a rollback restores app files or rules successfully, that does not automatically mean data cleanup should happen immediately. Stabilize access first, then decide whether test data needs separate handling.

## 7. Auth / Account Rollback Caution

Be conservative with Firebase Auth users too.

- do not delete public Auth users casually;
- if test public accounts were created, document them;
- do not remove the admin account;
- if login appears broken, check Auth settings and authorized domain configuration before changing code;
- if the issue is limited to client-side behavior, prefer a file rollback before making account-level changes.

An auth problem may be caused by stale JavaScript, persistence timing, redirects, or configuration mismatch. Avoid treating every auth issue as a reason to delete users or reset accounts.

## 8. Emergency Safe Mode

If nomination-related problems cannot be fixed immediately, a conservative temporary fallback is to pause nomination entry while keeping the rest of the site readable.

Safe-mode principles:

- temporarily hide or disable nomination entry links in public navigation, `get-involved.html`, and map-driven nomination entry if necessary;
- do not delete nomination data;
- keep public read-only pages working;
- keep admin access working;
- add a temporary public message only if needed to explain that submissions are temporarily paused.

Important:

- this runbook does not instruct you to implement safe mode now;
- use safe mode only if nomination workflows are actively broken or risky and a quick clean rollback is not enough.

## 9. Post-Rollback Verification

After any rollback, rerun a short verification checklist before calling the system stable.

- [ ] Public pages load.
- [ ] Public auth state behaves correctly.
- [ ] Signed-out nomination submission is blocked.
- [ ] Signed-in nomination submission works, or nomination entry is intentionally paused.
- [ ] `My nominations` works, or it is intentionally paused with a clear reason.
- [ ] Admin review and promotion work.
- [ ] Public export excludes private fields.
- [ ] Firebase rules version is recorded.
- [ ] Issue notes and failure notes are recorded.

Use the smoke test matrix and rules verification plan where relevant:

- [docs/release-smoke-test-matrix.md](./release-smoke-test-matrix.md)
- [docs/plans/firestore-rules-verification-plan.md](./plans/firestore-rules-verification-plan.md)
- [docs/plans/phase-12e-auth-rules-release-checklist.md](./plans/phase-12e-auth-rules-release-checklist.md)

## 10. Evidence

Record each rollback or rollback rehearsal here.

| Field | Value |
| --- | --- |
| Date | |
| Tester | |
| Rollback reason | |
| Files and/or rules restored | |
| Firebase rules version before | |
| Firebase rules version after | |
| Smoke tests rerun | |
| Final status | |
| Notes / screenshots | |

## 11. Scope Notes

This runbook is intentionally focused on practical manual recovery for the current workflow:

- GitHub Pages files are uploaded manually by the owner after review;
- Firebase rules deployment is a separate explicit action;
- public export is code-level only and should remain limited to `communityPlaces`, `news`, and `history`;
- nomination ownership metadata and admin/private fields must not become public during rollback or recovery.

This runbook does not replace judgment. If a rollback trigger involves privacy exposure or broken admin authorization, favor the safer earlier state first and complete wider diagnosis second.
