# Phase 11A Live Read-Only Backup Checklist

## Purpose

This checklist is for a future authorized live Firebase session whose only goal is to create private baseline backups and record safe counts before any cleanup decision.

This is not a cleanup checklist. It does not authorize record edits, deletions, rule changes, deployments, imports, migrations, or public export changes.

## Preconditions

Before starting the future live session, confirm all of the following:

- [ ] Explicit approval for the live read-only backup session has been received.
- [ ] The local worktree is clean.
- [ ] The latest Phase 11A safety hardening has been reviewed and uploaded.
- [ ] Deployed Firestore rules have been verified separately.
- [ ] A private backup folder has been prepared outside the repository.
- [ ] No backup JSON files are currently inside the repository.
- [ ] No migration, import, cleanup, deploy, or rules task is running.
- [ ] The session operator will use the approved admin account only.

## Private Backup Folder Setup

Prepare a private folder structure outside the Git repository, for example:

```text
AlexPhotoBoard-private-backups/
  2026-06-XX-phase-11a-readonly-backup/
    00-original-downloads/
    01-working-copies/
    02-redacted-notes/
    03-counts-and-checks/
```

Rules for this folder:

- [ ] Do not place this folder inside the Git repo.
- [ ] Do not place this folder inside a public website folder.
- [ ] Do not upload this folder to GitHub.
- [ ] Do not paste private backup contents into ChatGPT or public docs.
- [ ] Keep `00-original-downloads/` unchanged after files are saved there.

## Admin Export Page Steps

When the future session is authorized:

1. Open the private admin export page.
2. Sign in with the approved admin account.
3. Confirm the page heading says `Admin Export / Backup`.
4. Read the on-page private-data warnings before downloading anything.
5. Download the separate backups for:
   - `communityPlaces`
   - `news`
   - `history`
   - `placeNominations`
6. Download the combined all-data backup.
7. Move every downloaded file immediately into `00-original-downloads/`.
8. Do not edit, rename, or overwrite the original downloads.

## Verification Steps

After downloading:

- [ ] Confirm each JSON file opens successfully.
- [ ] Confirm each JSON file parses successfully.
- [ ] Record the export timestamp for each file.
- [ ] Record the count for each collection.
- [ ] Compare the separate collection counts with the corresponding sections in the combined backup.
- [ ] Confirm filenames match the expected backup patterns.
- [ ] Confirm no backup file is inside the repository.
- [ ] Run `git status --short` after the session.

Expected filename patterns:

- `communityPlaces-backup-YYYY-MM-DD.json`
- `placeNominations-backup-YYYY-MM-DD.json`
- `news-backup-YYYY-MM-DD.json`
- `history-backup-YYYY-MM-DD.json`
- `alex-photo-board-backup-YYYY-MM-DD.json`

## Privacy Handling

Treat the following as private/admin-only:

- `placeNominations`
- the combined all-data backup, because it includes `placeNominations`
- `nominatorEmail`
- `adminNotes`
- `adminHistoricInterest`
- `adminArchitecturalInterest`
- `adminCommunityValue`
- `adminConditionRisk`
- `adminAssessmentSummary`
- `reviewHistory`
- evidence URLs, evidence captions, evidence source credit, and other personal details

Rules for privacy handling:

- [ ] Do not copy private nomination or admin fields into public docs.
- [ ] Do not paste raw nomination content into committed markdown files.
- [ ] Public or redacted worksheets may include only generic findings.
- [ ] If a nomination issue must be noted publicly, describe it without personal data.

## Storage Warning

Firestore backup preserves document fields and URLs. It does not back up Firebase Storage file bytes.

This means:

- article HTML files may need a separate backup plan
- images may need a separate backup plan
- evidence files may need a separate backup plan

Before any future Storage cleanup, prepare a separate approved Storage backup workflow.

## What Not To Do

- [ ] Do not edit Firebase records.
- [ ] Do not delete records.
- [ ] Do not change Firestore rules.
- [ ] Do not deploy.
- [ ] Do not rename an admin backup to `heritage.json`.
- [ ] Do not upload admin backups to GitHub.
- [ ] Do not include `placeNominations` in public export.
- [ ] Do not treat this backup session as cleanup approval.

## Expected Output After The Future Live Session

If the session is completed correctly, the output should be:

- private original backups
- private working copies
- recorded collection counts
- live-versus-local comparison notes
- a later redacted public-safe worksheet
- no Firebase data changes

## Final Confirmation

Before closing the future session, confirm:

- [ ] Backup files are stored outside the repo.
- [ ] Original downloads remain unchanged.
- [ ] Counts have been recorded.
- [ ] `git status --short` has been checked.
- [ ] No public/private boundary was broken.
- [ ] No cleanup was performed.
