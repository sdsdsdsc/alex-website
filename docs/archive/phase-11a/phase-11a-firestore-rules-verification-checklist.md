# Phase 11A Firestore Rules Verification Checklist

## Purpose

This checklist prepares a future verification step before any live read-only admin backup.

Its purpose is to confirm that the currently deployed Firestore rules protect Alex's Photo Board the way the project expects. This phase is documentation only. It does not authorize a Firebase connection, rules deployment, data read, data change, or backup download.

## Why Rules Verification Is Needed

- Client-side admin checks are useful for interface flow, but they are not the real security boundary.
- Actual protection depends on the rules currently deployed in Firebase.
- The local `firestore.rules` file may be a good review draft, but it is not proof that production is using the same rules.
- A live admin backup should not proceed until deployed rules have been verified separately.

## Rules That Must Be True

Before a live read-only backup session, verify that all of the following are true in the deployed rules:

- Public users can read the public-safe collections needed by the site, only where intended.
- Public users can create nominations only in `placeNominations`, and only with the intended public nomination field set.
- Public users cannot create, update, or delete `communityPlaces`.
- Public users cannot read all `placeNominations`.
- Admin can read `placeNominations` for review and backup.
- Admin can read `communityPlaces`, `news`, and `history`.
- Public export remains limited to `communityPlaces`, `news`, and `history`.
- Admin export remains authenticated and private.
- Delete operations are denied unless there is a separately approved admin-only need.

## Collections To Verify

Active collections:

- `communityPlaces`
- `news`
- `history`
- `placeNominations`

Retired collections:

- `mapPoints`
- `mapPolygons`
- old `posts`

Retired collections should not be reintroduced into the active workflow during this verification. If they still appear in old screenshots, notes, or past rules history, that is not a reason to restore them.

## Safe Verification Methods

Use one or more of these safe methods:

### 1. Firebase Console Rules Tab Visual Review

- Open the Firebase Console Rules tab.
- Read the currently deployed Firestore rules directly.
- Confirm the collection blocks and allow statements match the intended model.
- Confirm any admin UID check matches the approved admin account.

### 2. Firebase Console Rules Playground Or Simulator

- Use the Rules Playground to test read, create, update, and delete scenarios.
- Prefer simulation over real document writes.
- Use example request shapes only.
- Do not test by creating live records in production.

### 3. Firebase CLI Read-Only Rules Inspection

Use this only if the CLI is already configured safely and the operator knows it will not deploy or modify anything.

Safe uses may include:

- reading current project configuration
- inspecting local rules files
- comparing known deployed content exported by an approved read-only method

Do not use any command that could deploy, switch active projects unexpectedly, or modify rules during this phase.

### 4. Manual Comparison Against Local `firestore.rules`

- Compare the deployed rules text with the local `firestore.rules` draft.
- Check collection names, access patterns, helper functions, and nomination validation boundaries.
- Record any difference as a verification finding.

If the texts differ, treat that as a stop sign for live backup until the difference is understood.

## Specific Rules Playground Test Cases

Use test-style checks like these:

### Public Or Unauthenticated Access

- [ ] Unauthenticated read of `communityPlaces` is allowed only if that is the intended public behavior.
- [ ] Unauthenticated read of `news` is allowed only if that is the intended public behavior.
- [ ] Unauthenticated read of `history` is allowed only if that is the intended public behavior.
- [ ] Unauthenticated create in `placeNominations` is allowed only when all required public nomination fields are valid.
- [ ] Unauthenticated create in `placeNominations` is denied when prohibited or missing fields are supplied.
- [ ] Unauthenticated read of `placeNominations` is denied.
- [ ] Unauthenticated write to `communityPlaces` is denied.
- [ ] Unauthenticated delete of `placeNominations` is denied.

### Non-Admin Authenticated Access

- [ ] Non-admin authenticated user read of `placeNominations` is denied.
- [ ] Non-admin authenticated user write to `communityPlaces` is denied.
- [ ] Non-admin authenticated user update of nomination review fields is denied.

### Approved Admin Access

- [ ] Approved admin read of `placeNominations` is allowed.
- [ ] Approved admin read of `communityPlaces`, `news`, and `history` is allowed.
- [ ] Approved admin review update of `placeNominations` is allowed only for the intended admin-side fields.
- [ ] Approved admin promotion-related update of `placeNominations` is allowed only where intended.
- [ ] Delete operations are denied unless there is an explicitly intended admin-only rule.

## Public Export Boundary Checks

Confirm that deployed rules do not pressure the app into broadening public export scope:

- [ ] Public export can remain limited to `communityPlaces`, `news`, and `history`.
- [ ] `placeNominations` does not need public read access for any public page.
- [ ] Admin export is still a separate authenticated workflow.
- [ ] Backup convenience is not being used as a reason to loosen collection permissions.

## Local Draft Alignment Review

The local `firestore.rules` draft appears aligned with the expected project model in these ways:

- `communityPlaces`, `news`, and `history` are public-read and admin-write.
- `placeNominations` allows public create with validation.
- `placeNominations` denies public read.
- `placeNominations` allows admin read.
- `placeNominations` allows limited admin review and promotion updates.
- `placeNominations` delete is denied.
- a final default-deny block exists.

That is a good sign, but it is not proof of deployed behavior. The live backup remains blocked until the deployed rules are checked directly.

## What Not To Do

- Do not deploy rules during this phase.
- Do not loosen rules for backup convenience.
- Do not expose `placeNominations` publicly.
- Do not test by creating real live records.
- Do not change data to test rules.
- Do not paste private data into committed docs or ChatGPT.
- Do not assume the local rules file and deployed rules are identical without verification.

## Output Of This Phase

Expected output:

- checklist only
- no Firebase data changes
- no rules changes
- no deploy
- a clear recommendation on whether Phase 11A-8 live read-only backup can proceed

## Recommendation Gate

Phase 11A-8 live read-only backup may proceed only if:

- the deployed Firestore rules have been reviewed directly
- the required access outcomes above are confirmed
- there are no unexplained differences between deployed rules and the intended model

If any of those checks fail, postpone the live backup until the rules situation is understood and explicitly approved.
