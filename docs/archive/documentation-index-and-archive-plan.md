# Documentation Index and Archive Plan

## Historical status

This plan preserves the documentation-control approach used before the
repository-wide organization pass. It is no longer controlling guidance. The
current placement conventions are maintained in [docs/README.md](../README.md),
and the resulting classification and moves are recorded in the
[repository-wide documentation organization audit](../audits/repository-wide-documentation-organization-audit.md).

## 1. Purpose

This document creates a documentation control plan before further feature work.

Its purpose is to define:

- which documentation should be treated as current;
- which documentation should remain visible for release and safety work;
- which documentation is planning/reference material rather than current instruction;
- which documentation should later move into archive areas;
- how `docs/README.md` should eventually be reshaped;
- how future cleanup should happen safely without losing historical evidence.

This phase is planning only. No docs are moved, deleted, or rewritten here.

## 2. Documentation Categories

The project documentation should be classified into these categories:

### Current core docs

These are the main “what the project is now” documents that should be easiest to find first.

Use for:

- current status;
- active system model;
- active page/collection boundaries;
- milestone-level verification state.

### Current release/safety docs

These documents support release assurance, rules verification, rollback, and safety boundaries.

Use for:

- release checks;
- Firestore rules verification;
- rollback planning;
- privacy/export safety.

### Current planning docs

These are accepted current planning baselines for upcoming work, even if they do not represent implemented behavior yet.

Use for:

- Phase 13 planning;
- reset planning;
- approved next-step thinking.

### Current reference docs

These are useful background/reference documents that support understanding, but should not override newer current-state or final-verification docs.

Use for:

- design rationale;
- domain guidance;
- structural understanding.

### Maintenance-only docs

These docs are operational or maintenance-oriented and should not be treated as normal product-state instructions.

Use for:

- maintenance;
- backup/audit utilities;
- import utilities;
- cleanup safety.

### Historical milestone records

These record what was verified, approved, or completed at a given phase. They remain valuable evidence even after the project moves on.

Use for:

- evidence;
- change history;
- milestone closeout context.

### Archive candidates

These are docs that still have value, but should later move out of the main current-doc surface because they are no longer active instructions.

Use for:

- historical reference only;
- old planning/proposals/worksheets.

### Duplicate or overlapping docs

These are docs whose content partially overlaps other stronger current docs.

Use for:

- supporting history until a later archive/rewrite step;
- not as the primary current instruction source.

### Outdated docs needing revision

These are still worth keeping in a current-visible location, but they contain stale wording, old “next phase” language, or old future assumptions.

Use for:

- near-term documentation cleanup tasks.

## 3. Proposed Current Docs Index

The following is the recommended current docs index for this project.

### Start here

- `docs/audits/current-project-state-and-doc-cleanup-audit.md`
  Use this as the reset overview before more feature work. It gives the best current-state cleanup summary.

- `docs/project-status-checkpoint.md`
  Use this as the broader product/status map for pages, collections, engine modules, and phase reality. It remains a core orientation doc even though some sections need later revision.

- `docs/site-structure.md`
  Use this for page roles, content model, collections, and architecture understanding. Treat it as a structure/reference doc, not as the newest phase-status authority.

### Current release and safety docs

- `docs/audits/phase-12-final-verification-record.md`
  Use this as the strongest current proof that Phase 12 is functionally verified for the current project stage.

- `docs/release-smoke-test-matrix.md`
  Use this for repeatable pre-release public/admin manual verification.

- `docs/plans/firestore-rules-verification-plan.md`
  Use this for controlled rules verification because local `firestore.rules` is still a review draft.

- `docs/release-rollback-runbook.md`
  Use this for controlled rollback planning if release, rules, auth, nominations, or export behavior break.

- `docs/plans/phase-12e-auth-rules-release-checklist.md`
  Use this as a Phase 12-specific release checklist, but treat it as a supporting checklist rather than the top-level current-state authority.

### Current planning docs

- `docs/plans/phase-13a-media-evidence-rights-model.md`
  Use this as the current planning baseline for media, evidence, rights, and visibility.

- `docs/plans/phase-13b-storage-backup-media-audit-plan.md`
  Use this as the current planning baseline for Storage backup, inventory, orphan-file auditing, and retention planning.

### Engine/reference docs

- `heritage-engine/README.md`
  Use this for the engine layer boundary and module purpose, while noting it needs a later cleanup pass.

- `docs/archive/phase-12a-public-account-model.md`
  Use this as Phase 12 design rationale, not as the primary current status document.

- `docs/policy/local-heritage-listing-guidance.md`
  Use this as a domain/reference guide.

### Historical milestone records still worth keeping visible for now

- `docs/audits/phase-11a-live-readonly-backup-session-note.md`
  Use this as a historical evidence record for Firestore backup boundaries and Storage limitation notes.

## 4. Docs That Need Updating Later

| File path | What is outdated | Recommended update | Priority |
| --- | --- | --- | --- |
| `docs/README.md` | Does not surface the newer current-state, Phase 12 final verification, and Phase 13A/13B planning docs. Still gives too much weight to older Phase 11A summaries. | Rewrite as a cleaner index with “Start here,” “Current state,” “Release/rules safety,” “Planning,” “Reference,” “Maintenance,” and “Archive.” | `high` |
| `docs/project-status-checkpoint.md` | “Actual current phase” and “next immediate phase” framing lags behind the newer final verification and reset planning state. | Revise so it acknowledges Phase 12 functional verification and the reset-phase sequence now underway. | `high` |
| `docs/site-structure.md` | Still describes public nominations partly as future workflow and contains older future-roadmap language. | Update to reflect the now-implemented signed-in nomination flow and separate current-state sections from future ideas more clearly. | `high` |
| `heritage-engine/README.md` | “Future Modules” section still lists modules that already exist. Some phase-history wording is now stale. | Remove stale future-module language and recast the file as the current engine boundary/reference doc. | `high` |
| `docs/plans/phase-12e-auth-rules-release-checklist.md` | Still contains items that are now partly covered by later verification records. | Annotate which items are already functionally verified and which still depend on rules/deployment assurance. | `medium` |
| `docs/archive/phase-12a-public-account-model.md` | Still reads as a pre-implementation design/spec only. | Keep the design intent, but later label it more explicitly as a historical design baseline. | `medium` |
| `docs/archive/phase-11a/phase-11a-cleanup-closeout.md` | Its “recommended next phase” is no longer current. | Later relabel it clearly as historical closeout evidence if needed. | `medium` |
| `docs/archive/old-roadmaps/alex-heritage-engine-roadmap.md` | Roadmap overlaps with implemented engine reality and newer engine README. | Later trim, relabel as historical roadmap, or keep in archived roadmap history. | `medium` |
| `docs/audits/phase-11a-live-readonly-backup-session-note.md` | Still useful, but its “recommended next step” is historical. | Keep visible for now as evidence, but later relabel as historical milestone record. | `low` |

## 5. Archive Candidates

These files should probably move to archive locations later, but must not be moved in this phase.

| Current file path | Archive location | Reason | Keep for historical evidence? |
| --- | --- | --- | --- |
| `docs/archive/phase-11a/phase-11a-live-vs-local-audit-worksheet.md` | `docs/archive/phase-11a/phase-11a-live-vs-local-audit-worksheet.md` | Historical worksheet, not a current product-state instruction. | `yes` |
| `docs/archive/phase-11a/phase-11a-communityplaces-user-approval-proposal.md` | `docs/archive/phase-11a/phase-11a-communityplaces-user-approval-proposal.md` | Historical approval/proposal artifact from an older phase. | `yes` |
| `docs/archive/phase-11a/phase-11a-cleanup-closeout.md` | `docs/archive/phase-11a/phase-11a-cleanup-closeout.md` | Closeout is still valid historically, but it no longer belongs in the active current-doc layer. | `yes` |
| `docs/archive/old-roadmaps/alex-heritage-engine-roadmap.md` | `docs/archive/old-roadmaps/alex-heritage-engine-roadmap.md` | Overlaps with the now-implemented engine state and newer engine README. | `yes` |
| `docs/research/cambridgeshire-local-heritage-list-skill.md` | `docs/research/cambridgeshire-local-heritage-list-skill.md` | Supporting external-reference research rather than controlling project policy. | `yes` |
| `docs/archive/phase-12a-public-account-model.md` | `docs/archive/phase-12a-public-account-model.md` | Still useful as design rationale, but not the main current status source once docs are cleaned up. | `yes` |

Notes:

- `docs/audits/phase-12-final-verification-record.md` should stay visible for now and should not be archived as ordinary old planning.
- `docs/plans/phase-13a-media-evidence-rights-model.md` and `docs/plans/phase-13b-storage-backup-media-audit-plan.md` should stay visible as historical planning records.
- Existing `docs/archive/phase-9/`, `docs/archive/phase-10/`, and `docs/archive/phase-11a/` remain appropriate.

## 6. Maintenance-Only Docs

These docs should remain available, but should not be treated as current product-state instructions:

- `maintenance/README-gallery-cleanup.md`
  Maintenance-only guidance for gallery cleanup and article Storage audit/deletion boundaries.

- `scripts/README-community-places-import.md`
  Maintenance/import utility documentation, not normal feature-work guidance.

- `maintenance/reports/article-storage-audit.html`
  Generated maintenance report; useful evidence, but not a product-state doc.

- `maintenance/reports/article-storage-audit.csv`
  Generated maintenance data report; useful for audit history, not a current instruction doc.

- `maintenance/reports/unreferenced-article-files-for-review.txt`
  Maintenance review artifact, not a product-state doc.

These should remain clearly separate from:

- current project-state docs;
- release/rules safety docs;
- current planning docs.

## 7. Archive Folder Proposal

Proposed future archive structure:

```text
docs/archive/
  phase-9/
  phase-10/
  phase-11a/
  phase-12-design/
  old-roadmaps/
  retired-workflows/
  reference-experiments/
```

Suggested meaning:

- `phase-9/`
  Historical nomination/planning work already archived.

- `phase-10/`
  Historical engine-planning and closeout work already archived.

- `phase-11a/`
  Historical backup/audit/cleanup planning and worksheets.

- `phase-12-design/`
  Older design/spec docs that remain useful as rationale but are not the latest status source.

- `old-roadmaps/`
  Roadmaps superseded by implemented architecture or stronger current docs.

- `retired-workflows/`
  Docs about retired map/admin/gallery/post workflows when those are no longer current instructions.

- `reference-experiments/`
  Background/reference or inspiration docs that should remain available without looking like active instructions.

This structure is proposed only. No folders are created and no files are moved in this phase.

## 8. Proposed Future docs/README.md Shape

Future `docs/README.md` outline:

### Start Here

- `current-project-state-and-doc-cleanup-audit.md`
- `project-status-checkpoint.md`

### Current Project State

- `site-structure.md`
- `phase-12-final-verification-record.md`

### Release and Rules Safety

- `release-smoke-test-matrix.md`
- `firestore-rules-verification-plan.md`
- `release-rollback-runbook.md`
- `phase-12e-auth-rules-release-checklist.md`

### Media and Storage Planning

- `phase-13a-media-evidence-rights-model.md`
- `phase-13b-storage-backup-media-audit-plan.md`

### Engine and Reference Docs

- `../heritage-engine/README.md`
- `archive/phase-12a-public-account-model.md`
- `local-heritage-listing-guidance.md`

### Maintenance-Only Docs

- `../maintenance/README-gallery-cleanup.md`
- `../scripts/README-community-places-import.md`

### Archive

- `archive/phase-9/`
- `archive/phase-10/`
- `archive/phase-11a/`
- later archive categories such as `phase-12-design/` and `old-roadmaps/`

This is only an outline for a later README rewrite. `docs/README.md` is not edited in this phase.

## 9. Cleanup Safety Rules

Future documentation cleanup should follow these rules:

- never delete historical docs without owner approval;
- archive before deleting;
- do not treat archived docs as current instructions;
- do not let old phase docs override newer final verification records;
- keep release/rules safety docs easy to find;
- keep maintenance docs separate from product-state docs;
- treat milestone verification records as evidence, not clutter;
- prefer relabeling and re-indexing before deleting or collapsing history;
- if two docs overlap, choose one as the current authority and reclassify the other as history/reference.

## 10. Recommended Next Phase

Recommended next phase:

**Phase Reset 1C — Firestore Rules Sync and Verification Plan**

Why this should come next:

- the local `firestore.rules` file is still explicitly a review draft;
- current public nomination and `My nominations` behavior depends on rules alignment;
- the reset audit already identified local-vs-deployed rules drift as one of the highest-risk areas;
- Phase 13C should not resume until the owner has a clearer source/deployed rules picture.

In practical terms: documentation order should be stabilized first, then rules truth should be stabilized, then future feature planning can resume more safely.

## 11. What Was Not Changed

Confirmed in this phase:

- no docs were moved;
- no docs were deleted;
- `docs/README.md` was not rewritten;
- no application code changed;
- no Firestore rules changed;
- no Firebase data was touched;
- no Firebase Storage files were touched;
- no migration/import/cleanup scripts were run;
- no PR, push, or deploy workflow was used.
