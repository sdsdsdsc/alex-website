# Phase 12 Final Verification Record

This document records the final functional verification outcome for the current Phase 12 public-user auth/account stage.

It is a verification record, not a deploy instruction. It does not change application behavior, Firestore rules, Firebase configuration, or live data.

## 1. Verification Scope

This record covers the following Phase 12 areas:

- public email/password sign-in for public users;
- signed-in nomination ownership behavior;
- `My nominations` owner-scoped privacy behavior;
- admin nomination review and promotion workflow;
- public export privacy checks;
- final release-polish checks for public map popup location fallback and public place-page optional key-fact display;
- source-level engine test coverage relevant to the Phase 12 privacy and safety model.

## 2. Verified Live Behavior

The following live browser behavior was manually verified:

- Account A `alex.home@gmail.com` signed in successfully.
- Account A saw its own nomination in `my-nominations.html`.
- Account B `laua16911@gmail.com` signed in successfully.
- Account B was tested in a clean or separate browser session.
- Account B saw no nominations.
- Account B did not see Account A's nomination.

This verifies owner-scoped `My nominations` behavior at live browser level for the current project stage.

## 3. Nomination And Admin Workflow

The following workflow behavior was verified:

- signed-in nomination submission worked;
- admin review save worked;
- admin promotion worked;
- promotion created `communityPlaces/old-street`;
- `place.html?id=old-street` loads as a public record.

This confirms that the signed-in nomination path and the admin review/promotion path both functioned for the current project stage.

## 4. Export Privacy Check

The public `heritage.json` export was checked and did not include:

- `placeNominations`
- `submittedByUid`
- `submitterEmail`
- `submitterDisplayName`
- `submissionAuthType`
- `adminNotes`
- `reviewHistory`
- `nominatorEmail`

This confirms that the public export remained limited to public-safe data at the time of verification.

## 5. Release Polish Fixes Verified

The following final release-polish results were verified:

- the map popup for `old street` now displays `Lindong community, Fenyi`;
- empty optional `Associated type`, `Period`, and `Grade` rows are hidden on `place.html` when missing;
- no nomination form expansion was made as part of this fix.

These checks confirm that public-place display polish did not require any expansion of the public nomination payload.

## 6. Source-Level Test Result

Source-level browser harness result:

- `engine-test.html` passed `259/259`.

The harness now covers:

- nomination ownership metadata handling;
- unsafe/admin field stripping from client nomination shaping;
- promotion privacy stripping;
- public export privacy stripping;
- map location fallback formatting;
- optional key-fact display behavior at the helper level where applicable.

As documented in the harness itself, `engine-test.html` verifies pure helper behavior only. It does not replace Firebase Auth, Firestore rules, or live browser verification.

## 7. Remaining Cautions

The following cautions still apply:

- local GitHub Pages files still need to be uploaded and accepted according to the owner's manual workflow;
- test records must not be deleted without backup and explicit approval;
- if Firebase rules are deployed again later, record the rules version and deployment time;
- future automated emulator-backed rules tests would still be useful, but they are not blocking current Phase 12 closeout.

## 8. Current Conclusion

Phase 12 is functionally verified for the current project stage. Public-account nomination ownership, `My nominations` privacy, admin review/promotion, and export privacy have been verified. Remaining work moves to future release hardening and Phase 13 media/evidence/rights planning.
