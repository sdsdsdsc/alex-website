# Phase 15A — Firebase Rules Sync Readiness

Date: 2026-06-23
Branch: `phase-15a-firebase-rules-sync-readiness`
Target branch: `main`
Scope: readiness documentation only

## Status

Phase 15A is a controlled pre-publish check for Firebase Firestore rules.

This phase does **not** publish live Firebase rules and does **not** change production Firebase configuration.

## Current baseline

The repository-side workflow is now stable enough to support a careful Firebase rules comparison step.

Current repo baseline from the latest handoff:

- `main` is the protected stable branch.
- GitHub Actions verification is green on `main`.
- Pull requests are required before merging into `main`.
- Required status checks use `Alex Photo Board Verification / verify`.
- Force pushes to `main` are blocked.
- Deletion of `main` is restricted.
- Normal workflow is now: new branch -> local tests -> push -> PR -> GitHub Actions -> merge into `main`.
- Manual file upload should be avoided unless there is an emergency.

## Current verified test commands

The repository currently defines these verification commands:

```bash
npm test
npm run test:browser
```

`npm test` expands to:

```bash
npm run test:payload && npm run test:rules
```

`npm run test:rules` runs the Firestore emulator test suite:

```bash
firebase emulators:exec --only firestore --project alex-photo-board-test "node --test tests/firestore.rules.test.mjs"
```

The GitHub Actions workflow runs:

```bash
npm ci
npm test
npx playwright install --with-deps chromium
npm run test:browser
```

## Repository Firestore rules file

Current repository rules file:

```text
firestore.rules
```

Current repo-side rules file SHA observed during this phase:

```text
79838a02000f3d1b1195ca4e1f9a20b44a5e0a8f
```

Important existing caution inside `firestore.rules`:

```text
This repo did not previously contain local Firestore rules, so this file must
be reviewed before any Firebase Console update or deploy step. It does not
represent a deployed change on its own.
```

That caution remains valid for Phase 15A.

## Current repository rules behavior summary

At a high level, the repo rules currently express this intended model:

- `news` is publicly readable and admin-writable.
- `history` is publicly readable and admin-writable.
- `communityPlaces` is publicly readable and admin-writable.
- `placeNominations` can be created only by signed-in users with validated fields.
- `placeNominations` can be read only by the admin or the nomination owner.
- `placeNominations` can be reviewed/promoted only by the admin.
- `placeNominations` cannot be deleted from the client.
- All other unmatched documents are denied by default.

This summary is only a human-readable guide. The actual source of truth is `firestore.rules` plus the emulator tests.

## Live Firebase Console comparison checklist

Before publishing anything, compare the live Firebase Console rules with the tested repository file.

Manual steps:

1. Open Firebase Console.
2. Select the Alex Photo Board Firebase project.
3. Go to Firestore Database -> Rules.
4. Copy the full currently published live rules into a temporary local text file.
5. Compare the live rules against repository `firestore.rules`.
6. Record whether they are identical, older, or different.
7. Do not press Publish during Phase 15A.

Suggested local comparison workflow:

```bash
git checkout main
git pull
cp firestore.rules /tmp/alex-photo-board-repo-firestore.rules
# Paste live Firebase Console rules into:
# /tmp/alex-photo-board-live-firestore.rules

diff -u /tmp/alex-photo-board-live-firestore.rules /tmp/alex-photo-board-repo-firestore.rules
```

## Decision states

After comparison, mark one of these states:

- **Identical**: live Firebase rules already match repository rules. No publish needed.
- **Live older/weaker**: live Firebase rules appear older or less restrictive than repository rules. Prepare Phase 15B publish plan.
- **Live newer/different**: live Firebase rules contain changes not present in GitHub. Stop and investigate before publishing.
- **Unclear**: do not publish. Save screenshots/text evidence and review carefully.

## Phase 15A acceptance criteria

Phase 15A is complete when:

- [ ] This readiness document is merged through PR.
- [ ] Full test suite is green in GitHub Actions.
- [ ] The live Firebase Console rules have been copied and compared against repository `firestore.rules`.
- [ ] The comparison result is recorded in a follow-up note or Phase 15B planning record.
- [ ] No live Firebase rules were published during Phase 15A.

## Phase 15B gate

Only start Phase 15B if all of the following are true:

- GitHub Actions is green on the Phase 15A PR or latest `main`.
- The live Firebase rules are confirmed to be older/weaker than the tested repository rules, or a deliberate publish need is documented.
- A rollback copy of the currently live Firebase rules has been saved.
- The publish step is done deliberately from Firebase Console or Firebase CLI, not casually.

## Rollback requirement before any future publish

Before any future live rules publish:

1. Save the currently live Firebase rules as a timestamped backup.
2. Save screenshots or copied text evidence of the live rules before publishing.
3. Keep the previous live rules available for immediate rollback.
4. Publish only after tests pass and the reviewed rules are confirmed.
5. Re-test key browser flows after publishing.

## Phase 15A result

This phase intentionally changes documentation only.

No app files, tests, GitHub Actions files, or Firebase rules files are changed in this phase.

No live Firebase configuration is changed in this phase.
