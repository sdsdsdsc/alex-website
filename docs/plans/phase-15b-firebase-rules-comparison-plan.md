# Phase 15B: Firebase Rules Comparison Plan

## Status

Planning record only. This phase does not publish live Firebase rules.

## Baseline

Phase 15A is complete and merged into `main`.

The repository now has:

- protected `main`
- pull-request workflow restored
- required GitHub Actions check restored as `verify` from GitHub Actions
- CI workflow running unit tests, Firestore rules tests, and Playwright browser smoke tests
- Phase 15A Firebase rules sync readiness record in `main`

## Purpose

Phase 15B prepares a controlled comparison between the repository version of `firestore.rules` and the currently published live Firebase Console rules.

The goal is to answer one question before any production change:

> Do the live Firebase Firestore rules exactly match the tested repository rules?

This phase is not a deployment phase. It is a comparison and decision-preparation phase.

## Absolute safety limits

Do not:

- publish Firebase rules
- change live Firebase configuration
- change `firestore.rules`
- change app code
- change GitHub Actions workflow files
- bypass `main` protection
- manually upload site files to GitHub
- merge without passing required checks

## Intended workflow

1. Start from synced `main`.
2. Create a phase branch.
3. Confirm local repository tests pass.
4. Export or copy the currently live Firebase Console rules into a temporary local comparison file.
5. Do not commit live rules if they contain project-specific secrets or sensitive details.
6. Compare live rules against repository `firestore.rules`.
7. Record whether they match exactly.
8. Record any differences clearly.
9. Decide whether Phase 15C is needed for a controlled publish.

## Codex task prompt

Use this prompt for Codex during Phase 15B:

```text
Repo: sdsdsdsc/alex-website
Branch to use: phase-15b-firebase-rules-comparison-plan
Base branch: main

Task:
Perform a read-only Firebase Firestore rules comparison readiness pass.

Important safety rules:
- Do not publish Firebase rules.
- Do not run firebase deploy.
- Do not change live Firebase.
- Do not change firestore.rules unless explicitly asked later.
- Do not change app code.
- Do not change verify.yml.
- Do not commit copied live Firebase Console rules if they contain sensitive project-specific details.
- Prefer documentation-only output.

Known baseline:
- Phase 15A is merged into main.
- main protection is restored.
- Required GitHub Actions status check is verify from GitHub Actions.
- Repository firestore.rules is already emulator-tested.
- Live Firebase Console rules may still need separate comparison.

Please do:
1. Confirm the working branch is based on latest main.
2. Inspect firestore.rules from the repository.
3. Run the safe local test suite:
   npm test
   npm run test:browser
4. Prepare instructions for manually copying/exporting the current live Firebase Firestore rules from Firebase Console.
5. Compare the live rules text against repository firestore.rules if the live rules are provided locally.
6. Record one of these outcomes:
   - exact match
   - differences found
   - unable to compare because live rules were not provided
7. If differences are found, describe them without publishing anything.
8. Recommend whether Phase 15C should be a controlled live rules publish phase.

Expected output:
- A short verification record under docs/.
- No production changes.
- No Firebase deploy.
- No app-code changes.
```

## Manual live rules capture path

Preferred manual path:

1. Open Firebase Console.
2. Open the Alex Photo Board Firebase project.
3. Go to Firestore Database.
4. Open the Rules tab.
5. Copy the currently published rules text.
6. Paste it into a temporary local file for comparison only.
7. Do not commit the temporary live-rules copy unless it has been reviewed and is safe to retain.

Suggested temporary local filename:

```text
/tmp/alex-photo-board-live-firestore.rules
```

or inside the repo but untracked:

```text
scratch/live-firestore.rules
```

If using `scratch/`, make sure it is ignored or deleted before committing.

## Comparison commands

Possible local commands:

```bash
npm test
npm run test:browser
```

For comparison:

```bash
diff -u firestore.rules /tmp/alex-photo-board-live-firestore.rules
```

or:

```bash
cmp -s firestore.rules /tmp/alex-photo-board-live-firestore.rules && echo "MATCH" || echo "DIFFERENT"
```

## Decision logic

### If exact match

Record:

- repository rules and live rules match
- no publish needed
- Phase 15C can be skipped or marked as not required

### If differences found

Record:

- repository rules and live rules differ
- do not publish yet
- prepare Phase 15C as a controlled publish phase with rollback notes

### If live rules are unavailable

Record:

- comparison incomplete
- live Firebase Console access is required before publish decision
- do not publish

## Rollback thinking for future Phase 15C

Before any future live publish, capture:

- exact previous live rules text
- Git commit of repository rules being published
- test results immediately before publish
- who approved the publish
- time of publish
- post-publish smoke check result

## Current phase conclusion

Phase 15B should end with a comparison record, not a live Firebase change.
