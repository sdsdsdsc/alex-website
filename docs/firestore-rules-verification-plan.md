# Firestore Rules Verification Plan

This document defines the practical verification plan for the local `firestore.rules` draft before any intentional Firebase rules deployment or public release.

It is documentation only. It does not deploy rules, change application behavior, or modify live Firebase data.

## 1. Purpose

Phase 12 added signed-in public-user nomination submission, owner-scoped nomination reads, and private ownership metadata on `placeNominations`.

Because the local `firestore.rules` file is a review draft and not proof of what is deployed, the rules model must be verified before:

- any Firebase rules deployment;
- any release that depends on signed-in nomination submission;
- any release that depends on `My nominations`;
- any release that depends on admin nomination review and promotion after the Phase 12 changes.

The goal is to confirm that the intended public/admin boundary is enforced in practice, not only described in source.

## 2. Current Intended Rules Model

The current intended Firestore rules model is:

- public users can read `communityPlaces`, `news`, and `history`;
- signed-out users cannot create `placeNominations`;
- signed-in users can create `placeNominations` only for themselves;
- `submittedByUid` must match `request.auth.uid`;
- `submitterEmail` must match `request.auth.token.email`;
- `submissionAuthType` must equal `signedIn`;
- client-created nominations must start with `nominationStatus: "submitted"`;
- public users can read only their own nominations;
- public users cannot update or delete nominations;
- public users cannot write `communityPlaces`;
- admin can read nominations, review nominations, and promote approved nominations.

This intended model matches the current source structure in:

- `firestore.rules`
- `nominate-place.js`
- `my-nominations.js`
- `heritage-engine/nominations.js`
- `heritage-engine/promotion.js`

## 3. Required Test Identities

Use dedicated test identities only. Do not use production personal accounts unless explicitly intended for controlled verification.

Required identities:

- `Signed-out user`
- `Public user A`:
  `public-user-a@example.com`
- `Public user B`:
  `public-user-b@example.com`
- `Configured admin UID`:
  confirm the admin account matches the UID hard-coded in `firestore.rules`
- `Optional wrong/unknown public user`:
  a temporary non-owner identity for negative checks if needed

Guidance:

- do not record real passwords in this document;
- store passwords only in a secure private password manager or temporary tester notes outside the repo;
- use at least one test nomination created by Public user A;
- if testing owner-vs-other-user reads, use a distinct nomination owned by Public user A and verify access from Public user B.

## 4. Rules Test Cases

Use this table for emulator verification or controlled deployed verification.

| Test ID | Identity | Operation | Collection / document | Expected result | Reason | Evidence / status notes |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Signed-out user | Read | `communityPlaces` | Allow | Public place records must remain public. | |
| R-02 | Signed-out user | Read | `news` | Allow | Public news must remain public. | |
| R-03 | Signed-out user | Read | `history` | Allow | Public history must remain public. | |
| R-04 | Signed-out user | Create | `placeNominations` | Deny | Nominations now require sign-in. | |
| R-05 | Public user A | Create with `submittedByUid == auth.uid` and matching `submitterEmail` | `placeNominations` | Allow | Signed-in owners should be able to submit their own nomination. | |
| R-06 | Public user A | Create with `submittedByUid` set to Public user B UID | `placeNominations` | Deny | A user must not create a nomination for another UID. | |
| R-07 | Public user A | Create with missing `submittedByUid` | `placeNominations` | Deny | Ownership metadata is required. | |
| R-08 | Public user A | Create with `submitterEmail` not matching auth email | `placeNominations` | Deny | Auth-linked email metadata must be trustworthy. | |
| R-09 | Public user A | Create with `submissionAuthType` not equal to `signedIn` | `placeNominations` | Deny | Guest or alternate auth types are not allowed in this phase. | |
| R-10 | Public user A | Create with `adminNotes` included | `placeNominations` | Deny | Client must not create admin-only fields. | |
| R-11 | Public user A | Create with `nominationStatus` set to `approved`, `rejected`, or another non-initial value | `placeNominations` | Deny | Client-created nominations must start as `submitted`. | |
| R-12 | Public user A | Read own known nomination document | `placeNominations/{userANominationId}` | Allow | Owners should be able to read their own nomination. | |
| R-13 | Public user B | Read Public user A nomination document | `placeNominations/{userANominationId}` | Deny | Public users must not read another user's nomination. | |
| R-14 | Public user A | Broad list query without owner scoping | `placeNominations` | Deny | Public users must not read all nominations. | |
| R-15 | Public user A | Owner-scoped query with `where("submittedByUid", "==", auth.uid)` | `placeNominations` | Allow | `My nominations` depends on owner-scoped reads only. | |
| R-16 | Public user A | Update own nomination | `placeNominations/{userANominationId}` | Deny | Public users must not edit nomination or review fields. | |
| R-17 | Public user A | Delete own nomination | `placeNominations/{userANominationId}` | Deny | Public users must not delete nominations. | |
| R-18 | Public user A | Create | `communityPlaces` | Deny | Public users must not publish community place records. | |
| R-19 | Public user A | Update or delete | `communityPlaces/{knownPlaceId}` | Deny | Public users must not modify public place records. | |
| R-20 | Configured admin | Read nominations list or known nomination | `placeNominations` | Allow | Admin review workflow must remain possible. | |
| R-21 | Configured admin | Review update with status/notes/assessment fields | `placeNominations/{userANominationId}` | Allow | Admin review workflow must remain possible. | |
| R-22 | Configured admin | Promotion update from `approved` to `promoted` | `placeNominations/{approvedNominationId}` | Allow | Admin promotion workflow must remain possible. | |
| R-23 | Non-admin public user | Promotion-style update attempt | `placeNominations/{approvedNominationId}` | Deny | Public users must not promote nominations. | |

Notes:

- Use a dedicated test nomination rather than an existing important record.
- For negative tests, record the exact attempted payload difference.
- For promotion verification, confirm the nomination is in an approved state before testing the promotion update.

## 5. Emulator Option

The preferred verification method is the Firebase Emulator Suite because it allows repeatable, lower-risk testing against the local rules source before any deployment.

Recommended approach:

- use the local `firestore.rules` file as the rules source under test;
- run the verification with the exact test identities listed above;
- create a temporary test nomination owned by Public user A;
- run both allow and deny cases from the rules test table;
- capture logs or screenshots for each important pass/fail result;
- record whether any query behavior differs from single-document reads.

Important constraints:

- do not assume the emulator is already installed;
- do not add scripts or test harness code in this phase unless separately requested;
- do not treat local source review alone as equivalent to emulator verification.

## 6. Controlled Deployed Verification Option

If the emulator is not available, use a controlled deployed verification approach with extra caution.

Recommended process:

- use test accounts only;
- use one dedicated test nomination owned by Public user A;
- verify expected allow/deny behavior manually through the app and, where appropriate, Firebase Console evidence review;
- do not use destructive delete tests against meaningful live records;
- if delete behavior must be checked, prefer confirming deny behavior from the client side rather than deleting anything important;
- record the Firebase project name, rules version, and deployment time under test;
- keep the previous rules text ready for rollback before any verification session that depends on deployed rules.

Minimum controlled deployed checks:

- signed-out nomination create fails;
- signed-in owner create succeeds;
- other-user nomination read fails;
- owner-scoped `My nominations` read succeeds;
- public `communityPlaces` write fails;
- admin review and promotion still work.

## 7. Evidence Template

Use the following template for each verification run.

| Field | Value |
| --- | --- |
| Tester | |
| Date | |
| Firebase project | |
| Rules source | `firestore.rules` local draft / deployed version note |
| Target | Emulator / deployed verification |
| Test account A | `public-user-a@example.com` |
| Test account B | `public-user-b@example.com` |
| Admin UID confirmation | |
| Result summary | |
| Screenshots / logs | |
| Additional notes | |

## 8. Rollback Caution

Before any rules deployment or public release tied to these checks:

- do not deploy rules without a backup of the previously working rules;
- keep the previous rules text readily available for immediate restore;
- if owner-scoped reads fail, revert rules before public release;
- if admin review or promotion fails, stop the release;
- record the deployment time and the exact rules version that was tested.

## 9. What This Plan Does Not Replace

This plan is a verification guide, not a substitute for:

- a release signoff checklist;
- a smoke test matrix for the full public/admin UI;
- a rollback runbook with step-by-step execution notes;
- post-release monitoring notes;
- future automated emulator-based rule tests.

Those items remain appropriate follow-on work for the next release-assurance phase.
