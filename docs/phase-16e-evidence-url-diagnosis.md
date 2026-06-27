# Phase 16E Evidence URL Diagnosis Logging

## Live symptom

Normal public nomination submission still fails with `FirebaseError: Missing or insufficient permissions` when a Photo / evidence URL is supplied.

Blank/no-evidence public nominations can submit successfully, which means the basic signed-in nomination path is working on the live project.

## History and rollback audit

Recent nomination evidence URL work has not identified a durable known-good commit where a normal-mode evidence-URL nomination successfully wrote to live Firestore.

The repo and PR history show these verified states:

- Phase 16D recorded that blank/no-evidence nominations submit, while evidence-URL nominations fail with a Firestore permission error.
- Phase 16C hardened the payload builder and proved the reconstructed evidence payload was clean locally, but did not prove a live normal-mode evidence-URL write.
- Phase 16D debug mode proved the live page builds a clean evidence-URL payload, but debug mode intentionally returns before `addDoc`.
- Phase 16E simplified fragile create-rule predicates after the debug proof, but this diagnosis note does not treat that as a proven live normal-mode success.

No known-good evidence-URL live-write commit is recorded in the repository history reviewed for this phase. The known live-working path is blank/no-evidence nomination submission.

## Diagnosis added in this PR

This PR adds safe normal-mode logging immediately before the real Firestore write:

- `Nomination normal-mode payload summary:` logs the same safe summary used by debug mode.
- `Nomination submission failed:` logs only the Firebase error code, Firebase error message, and safe payload summary.
- The existing `debugNomination=1` mode is unchanged and still skips `addDoc`.

This PR does not include any Firestore rules change.

## Safety boundaries

The logging does not print ID tokens, refresh tokens, Firebase credential objects, the full auth user object, or the raw private payload.

The safe payload summary is limited to keys, field types, selected evidence metadata values, redacted submitted UID status, required/extra/undefined field checks, and other non-secret diagnosis fields already used by debug mode.

This code change does not create live records by itself.

## Manual verification after merge

After merge and GitHub Pages update:

1. Open `https://sdsdsdsc.github.io/alex-website/nominate-place.html?lat=27.711571219976587&lng=114.18437020718126`.
2. Hard refresh with Command + Shift + R.
3. Open Console and clear old logs with Command + K.
4. Submit one evidence-URL nomination using:
   - Photo / evidence URL: `https://example.org/photo.jpg`
   - Evidence caption: `Phase 16E diagnosis test`
   - Evidence source / credit: `Phase 16E test source`
   - Rights: `It is a public web reference for review only`
   - Evidence permission checkbox: checked
   - Nominator email: `alex.home@gmail.com`
5. If it fails, copy only:
   - `Nomination normal-mode payload summary`
   - error code
   - error message

Do not copy tokens, credentials, raw auth objects, or full private payloads.
