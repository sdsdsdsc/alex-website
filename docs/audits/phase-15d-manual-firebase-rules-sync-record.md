# Phase 15D: Manual Firebase Rules Sync Record

## Status

Phase 15D was completed by a manual Firebase Console update.

Live Firebase Firestore rules were updated to match the GitHub `main` version of `firestore.rules`.

## Source Of Truth

The target rules source was the tested `firestore.rules` file from GitHub `main`.

The previous live rules appeared slightly older than GitHub `main`.

Known older differences were:

- live rules used `changedKeys()`
- GitHub `main` uses `affectedKeys()`
- live rules had looser `evidenceImageUrl` validation
- GitHub `main` has stricter evidence URL validation

## Deployment Method

The Firebase update was performed manually through Firebase Console.

No Firebase CLI deploy was performed as part of this documentation record.

No Hosting, Functions, Storage, Realtime Database, or app deploy was performed.

## Repository Safety Confirmation

No app code was changed.

GitHub `firestore.rules` was not changed.

GitHub Actions `verify.yml` was not changed.

This record is documentation-only.

## Recommended Follow-Up

Run a small live smoke check for:

- nomination create behavior
- nomination owner read behavior
- admin review behavior
- public export behavior
