# Phase 11A Pre-Live Audit Hardening

## Purpose

This phase adds small local safeguards before any future authorized live Firebase read-only audit. It does not connect to Firebase, change data, alter Firestore rules, deploy code, or change the private admin backup payload.

## Admin Backup Git Protection

`.gitignore` now excludes only the generated admin backup filename patterns:

- `communityPlaces-backup-*.json`
- `placeNominations-backup-*.json`
- `news-backup-*.json`
- `history-backup-*.json`
- `alex-photo-board-backup-*.json`

The project does not ignore all JSON files. These narrow patterns reduce accidental staging of private admin downloads while leaving normal project JSON visible to Git.

Admin backups must still be stored outside the repository and public website folders. Ignore rules are a secondary safeguard, not a private-storage strategy.

## Recursive Public Export Privacy

The public export helper now reuses the recursive `stripUnsafePublicFields` validation helper:

- stored custom JSON-LD values are recursively stripped before merging
- the complete public JSON-LD payload is recursively stripped before download

This prevents prohibited nomination and admin field keys from surviving inside nested objects or arrays. Existing public export behavior remains otherwise unchanged:

- `export.js` still reads only `communityPlaces`, `news`, and `history`
- `placeNominations` is not queried or exported publicly
- collection names are unchanged
- the private admin backup remains full-fidelity and is not redacted

The developer-only `engine-test.html` harness now covers nested prohibited fields in stored JSON-LD and in final export-shaped data. The test page remains unlinked from public navigation.

## Remaining Manual Rules Verification

Before a live read-only audit, the operator must verify the deployed Firestore rules through an approved read-only review. The local rules file is a review draft and does not prove which rules are deployed.

The client-side admin identity check is not the security boundary. Production Firestore rules must enforce admin-only reads for `placeNominations`.

## Storage Backup Limitation

The admin backup downloads Firestore documents and URL fields. It does not download linked Firebase Storage file contents such as article HTML, images, or nomination evidence.

Any future Storage cleanup requires a separate approved inventory and backup plan before files are changed or removed.

## Operator Reminders

- Do not commit or publish admin backups.
- Keep admin downloads outside the repository and public deployment folders.
- Do not include `placeNominations` in `heritage.json`.
- Do not copy nomination-private or admin-only values into public documentation.
- Verify deployed rules before live use.
- Treat Firestore and Storage backups as separate requirements.
- Use admin export only for private read-only backup and review, never cleanup.
