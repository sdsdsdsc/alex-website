# Phase 11A Live Read-Only Backup Session Note

## Purpose

This note records the completion of the Phase 11A live read-only admin backup session. The purpose of that session was to create private baseline Firestore backups and record safe collection counts before any cleanup or audit decision.

## Backup Scope

The backup session covered these collections:

- `communityPlaces`
- `news`
- `history`
- `placeNominations`

The backup set included four separate collection JSON files and one combined all-data JSON backup.

## Safety Confirmation

- Original backup files were stored outside the repository.
- All five JSON backup files parsed successfully.
- Separate collection counts matched the corresponding sections in the combined backup.
- `git status --short` remained clean before and after the local verification step.
- No backup JSON files entered the repository.
- No Firebase data changed.
- No Firestore rules changed.
- No deployment occurred.

## Safe Counts

- `communityPlaces`: 5
- `news`: 2
- `history`: 3
- `placeNominations`: 4

## Privacy Boundary

`placeNominations` remains private and admin-only. The combined all-data backup also remains private because it includes `placeNominations`.

This repository note does not include backup payloads, document bodies, nomination text, emails, admin notes, review history, evidence URLs, or any other private record content.

## Storage Limitation

These Firestore backups preserve document data only. They do not back up Firebase Storage file bytes. Any future Storage cleanup or recovery planning must use a separate approved Storage backup process.

## Recommended Next Step

Create a redacted live-versus-local audit worksheet that compares the safe record counts and public-safe findings without copying private nomination or admin-side content into the repository.
