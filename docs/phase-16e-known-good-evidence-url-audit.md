# Phase 16E Known-Good Evidence URL Audit

## Summary conclusion

No known-good evidence-URL live-write version exists in the reviewed repo history.

The reviewed PRs, commits, docs notes, and tests show local/emulator support for evidence URL payloads, plus debug-mode proof that the live page can build a clean evidence URL payload. They do not show a verified normal, non-debug evidence-URL nomination successfully submitting to live Firestore.

Debug-mode success is not counted as evidence-URL write success because `debugNomination=1` intentionally returns before `addDoc`.

Local tests are not counted as live Firestore success because they run against local helpers or the Firestore emulator.

## Reviewed PRs and commits

- PR #10, `Fix nomination write permission rule`, merge commit `6b351a7401cbc855db4e05a93d523ea9e87fa433`
  - Prepared the Phase 16B rule fix for a live nomination write failure.
  - The PR body says final verification still required one controlled live nomination test after rules were published.
  - It does not record a successful live evidence-URL write.

- PR #11, `Harden nomination evidence payload sanitation`, merge commit `3b874d8c484d399982be93dfa46052f0906dd1b9`
  - Diagnosed missing caption/source-credit as missing keys, not serialized `undefined` fields.
  - Added payload sanitation and regression tests.
  - The PR body says no Firebase deploy and no live records were created.
  - It does not record a successful live evidence-URL write.

- PR #12, `Align evidence URL rule validation`, merge commit `184b11e863bd47a781e2e639143ce719202e9094`
  - Records the key live split: blank-evidence nominations submit, evidence-URL nominations fail with Firestore permission error.
  - Changed the rules-side evidence URL predicate and required a later live rules publish plus controlled live evidence-URL test.
  - It does not record a successful live evidence-URL write.

- PR #13, `Add nomination live payload debug mode`, merge commit `9b82775b0d6aacde4f2f5226ca0415cbfa8c406d`
  - Added query-param-only debug mode.
  - The PR body and docs say debug mode logs a safe payload summary and skips `addDoc`, so no live Firestore record is created.
  - It is useful diagnostic evidence, but not evidence of live write success.

- PR #14, `Simplify nomination create rule gates`, merge commit `2e1074d42cf35d8fb6a689563b7129bff6a3bc26`
  - Removed the fragile token-email comparison and evidence URL regex gate.
  - The PR body says live debug mode proved the payload was clean, then required manual rules publish and one controlled normal evidence-URL nomination test.
  - It does not record a successful live evidence-URL write.

- PR #15, `Add evidence URL nomination diagnosis logging`, merge commit `d66db623dd293d72d4e52ec63facbd8c7c481b39`
  - Added safe normal-mode payload summary/error logging.
  - The PR body and docs explicitly say normal evidence-URL nomination still fails while blank/no-evidence nomination can submit.
  - It does not record a successful live evidence-URL write.

## Reviewed docs and verification notes

- `docs/phase-15e-live-smoke-check-record.md`
  - Records successful public account creation, test nomination creation, owner read in My Nominations, admin review visibility, and export privacy.
  - The test nomination details do not say a Photo / evidence URL was supplied.
  - This is evidence of a working public nomination create/read flow, not evidence of working evidence-URL live writes.

- `docs/phase-16d-evidence-url-rule-alignment-record.md`
  - Explicitly records that live nominations submit successfully when Photo / evidence URL is blank, but fail with `FirebaseError: Missing or insufficient permissions` when an evidence URL is supplied.
  - This is the clearest reviewed known-good statement for the blank/no-evidence path.

- `docs/phase-16d-live-payload-debug-mode-record.md`
  - Records that debug mode builds the real nomination payload, logs a safe summary, stores it on `window.__lastNominationDebug`, and returns before `addDoc`.
  - This is diagnostic-only and not a live write.

- `docs/phase-16e-nomination-rule-simplification-record.md`
  - Records that live debug mode showed a clean evidence-URL payload, but normal evidence-URL submission still failed.
  - It also says one controlled live evidence-URL nomination test was still required after publishing rules.

- `docs/phase-16e-evidence-url-diagnosis.md`
  - Records that normal public nomination submission still fails when a Photo / evidence URL is supplied.
  - Records that blank/no-evidence public nominations can submit successfully.
  - States that no durable known-good normal evidence-URL live-write commit was identified.

## Reviewed tests

The reviewed payload and Firestore rules tests include evidence URL coverage, including:

- valid evidence URL payload construction;
- blank optional evidence fields;
- clean debug summaries;
- Firestore emulator acceptance of evidence URL nominations;
- rejection of invalid evidence rights or visibility values.

These tests prove local helper/emulator behavior only. They do not prove a live Firestore write unless paired with an explicit live verification record, and no such record was found.

## Known-good blank/no-evidence state

The last known-good nomination state in the reviewed history is the basic public nomination path without evidence URL:

- Phase 15E records successful live public nomination creation and owner read at commit `b7c62edd701dd17ccacfa7d5afffa72d05ddee31` or newer, but does not record an evidence URL in the submitted nomination.
- Phase 16D explicitly records that blank/no-evidence nominations submit successfully while evidence-URL nominations fail.
- Current live status after PR #15 continues to report blank/no-evidence public nominations can submit successfully.

This should be treated as the known-good functional baseline: signed-in public nomination creation works when the evidence URL branch is not used.

## Evidence-URL live-write state

No verified normal, non-debug evidence-URL live-write success was found.

No reviewed commit SHA or PR number can be identified as a known-good evidence-URL live-write version.

The reviewed history contains repeated planned follow-up tests for evidence-URL nominations, but the records found either:

- describe the evidence-URL path as failing;
- prove local/emulator behavior only;
- prove debug-mode payload shape while skipping `addDoc`; or
- prepare diagnosis logging for the still-failing normal write path.

## Recommended next action

Do not roll back to a supposed evidence-URL known-good commit, because no such verified commit was found.

Use PR #15's normal-mode diagnosis logging on the live site to capture only:

- `Nomination normal-mode payload summary`;
- Firebase error code;
- Firebase error message.

Then compare the normal-mode logged summary against the currently published live rules and Firestore request behavior. If the summary remains clean and the error remains permission denied, the next investigation should focus on a live-only Firestore rule evaluation mismatch or a collection/project/path mismatch, not a rollback to an evidence-URL known-good version.
