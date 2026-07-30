# Current Project State and Documentation Cleanup Audit

## 1. Purpose

This document is a reset and cleanup audit before more feature work.

Its purpose is to give the owner one clear current-state view of:

- which documentation files are current;
- which files are outdated or partially outdated;
- which files should later be archived;
- which files overlap or duplicate each other;
- what the active system model is now;
- what code, page, rules, navigation, and legacy risks remain;
- how close the project is to the intended end state;
- what the next safe phases should be before resuming new implementation work.

This is a documentation-only audit. It does not change code, Firestore rules, live Firebase data, or Firebase Storage.

## 2. Current Project Stage

Based on the inspected docs and source:

- Phase 12 is functionally verified for the current project stage.
- Phase 13A Media, Evidence, and Rights Model is completed.
- Phase 13B Storage Backup and Media Audit Plan is completed.
- Phase 13C should remain paused until documentation, rules alignment, and legacy cleanup planning are clarified.

### Evidence that supports this

- `docs/audits/phase-12-final-verification-record.md` records live functional verification for Phase 12.
- `docs/plans/phase-13a-media-evidence-rights-model.md` preserves the historical media/rights planning model.
- `docs/plans/phase-13b-storage-backup-media-audit-plan.md` exists and captures the current Storage backup/audit plan.
- `my-nominations.js`, `public-auth.js`, `nominate-place.js`, `heritage-engine/nominations.js`, `manage-nominations.html`, and `firestore.rules` all reflect the signed-in nomination ownership model.

### Conflicts or lagging documentation

- `docs/project-status-checkpoint.md` is still a strong orientation document, but its “actual current phase” text still emphasizes Phase 12 release assurance rather than the now-completed Phase 12 functional verification plus completed Phase 13A/13B planning.
- `docs/site-structure.md` remains broadly useful, but parts of its roadmap and “future” language predate the now-implemented Phase 12 public account flow.
- `docs/README.md` has now been refreshed as the current docs index, but some supporting docs still contain older cleanup-era wording.
- `docs/archive/phase-11a/phase-11a-cleanup-closeout.md` is historically valid but outdated as a “recommended next phase” document.

## 3. Current Active System Model

### Active collections

- `communityPlaces`: published public community heritage records
- `placeNominations`: private nomination submission and admin-review records
- `news`: public news articles
- `history`: public local history stories

### Retired collections

- `mapPoints`
- `mapPolygons`
- old `posts`

### Active public pages

- `index.html`
- `news.html`
- `history.html`
- `article.html`
- `search.html`
- `map.html`
- `place.html`
- `get-involved.html`
- `criteria.html`
- `guidance.html`
- `about-local-heritage.html`
- `nominate-place.html`
- `my-nominations.html`
- `public-auth.html`
- `export.html`

### Active admin pages

- `admin-login.html`
- `admin.html`
- `manage-community-places.html`
- `manage-nominations.html`
- `manage-articles.html`
- `upload-article.html`
- `admin-export.html`

### Active export model

- Public export uses `export.html` and `export.js`.
- Public export reads only:
  - `communityPlaces`
  - `news`
  - `history`
- Public export excludes `placeNominations`.
- `heritage-engine/export.js` strips unsafe public fields and shapes public JSON-LD.

### Active nomination workflow

- Public users must sign in before submitting a nomination.
- Public nomination submission writes only to `placeNominations`.
- Submission ownership metadata includes:
  - `submittedByUid`
  - `submitterEmail`
  - optional `submitterDisplayName`
  - `submissionAuthType`
- `my-nominations.html` uses an owner-scoped query via `where("submittedByUid", "==", user.uid)`.
- Public users do not write `communityPlaces`.
- Admin review and promotion remain separate workflows in `manage-nominations.html`.

### Active media model

- Article publishing uploads HTML files and editor images to Firebase Storage.
- Public nominations are still URL-only for evidence media.
- Public place images are URL-based in the current model.
- Firestore backup and Storage backup remain separate concerns.

### Retired or legacy system model still visible in the repo

- Legacy `mapPoints` / `mapPolygons` are still mentioned in documentation and maintenance notes as retired.
- Old `posts` remain part of legacy maintenance context, not active app behavior.
- A Drupal/Pantheon dependency still exists in the live public article/news code path.

## 4. Markdown File Inventory

| File path | Topic | Status | Reason | Recommended action |
| --- | --- | --- | --- | --- |
| `docs/README.md` | Docs index | Current | Now functions as the current documentation index and correctly foregrounds current verification, planning, reference, maintenance, and archive sections. | Keep as the primary docs index. |
| `docs/project-status-checkpoint.md` | Main current-state checkpoint | Current with caveats | Strong overall orientation doc, but some “next phase” framing lags behind later completed verification/planning work. | Keep current, then revise in a later reset phase. |
| `docs/site-structure.md` | System/page/data structure | Current with caveats | Mostly accurate for active pages and collections, but includes older roadmap/future wording and pre-Phase-12 assumptions. | Keep, then tighten to current-state-only language later. |
| `docs/audits/phase-12-final-verification-record.md` | Phase 12 verification record | Current | Best source for Phase 12 functional verification status. | Keep as a current milestone record. |
| `docs/plans/phase-13a-media-evidence-rights-model.md` | Media/rights planning | Historical planning record | Preserves the Phase 13A planning baseline for media, consent, visibility, and rights. | Keep as historical planning. |
| `docs/plans/phase-13b-storage-backup-media-audit-plan.md` | Storage backup and audit planning | Current | New planning baseline for Storage backup and orphan-file audit. | Keep current. |
| `docs/release-smoke-test-matrix.md` | Release manual test matrix | Current | Still relevant for release assurance. | Keep current. |
| `docs/plans/firestore-rules-verification-plan.md` | Rules verification plan | Current | Still relevant because `firestore.rules` is a local review draft. | Keep current. |
| `docs/release-rollback-runbook.md` | Rollback/recovery plan | Current | Still relevant for controlled release recovery. | Keep current. |
| `docs/archive/phase-12a-public-account-model.md` | Phase 12 design/spec | Historical architecture/design | Good design rationale, but no longer the latest status source. | Keep as design-history/reference. |
| `docs/plans/phase-12e-auth-rules-release-checklist.md` | Phase 12 release checklist | Current with caveats | Still useful, but some items are now partly verified by later records. | Keep, later annotate completed vs still-pending items. |
| `docs/audits/phase-11a-live-readonly-backup-session-note.md` | Phase 11A session record | Current historical record | Still valid evidence for backup boundaries. | Keep as historical evidence. |
| `docs/archive/phase-11a/phase-11a-live-vs-local-audit-worksheet.md` | Phase 11A audit worksheet | Archive candidate | Historical audit artifact, no longer a primary current-state doc. | Keep archived. |
| `docs/archive/phase-11a/phase-11a-communityplaces-user-approval-proposal.md` | Phase 11A approval proposal | Archive candidate | Historical process document from an earlier stage. | Keep archived. |
| `docs/archive/phase-11a/phase-11a-cleanup-closeout.md` | Phase 11A closeout | Outdated historical record | Still valid historically, but its “recommended next phase” is no longer current. | Keep as archived history. |
| `docs/archive/old-roadmaps/alex-heritage-engine-roadmap.md` | Engine roadmap | Outdated / duplicate | Useful background, but much of the “future engine modules” work is already implemented and duplicated by `heritage-engine/README.md`. | Keep as archived history. |
| `docs/policy/local-heritage-listing-guidance.md` | Reference guidance | Current reference | Background/reference doc, not a status doc. | Keep as reference. |
| `docs/research/cambridgeshire-local-heritage-list-skill.md` | External reference/inspiration | Research guidance | Supporting inspiration rather than controlling project instruction. | Keep as research guidance. |
| `heritage-engine/README.md` | Engine structure and safety boundary | Current with caveats | Mostly accurate, but its “Future Modules” section is partly stale because those modules now exist. | Keep, then update to remove stale future-module wording. |
| `maintenance/README-gallery-cleanup.md` | Maintenance cleanup guidance | Current maintenance reference | Still relevant for maintenance safety, but not a current product-state doc. | Keep in maintenance; do not mix with current-state docs. |
| `scripts/README-community-places-import.md` | Import utility doc | Current maintenance reference | Still relevant for maintenance/import, not normal feature work. | Keep as maintenance-only reference. |
| `docs/archive/phase-9/*` | Historical planning | Archive | Already archived. | Leave archived. |
| `docs/archive/phase-10/*` | Historical planning/closeout | Archive | Already archived. | Leave archived. |
| `docs/archive/phase-11a/*` | Historical working docs | Archive | Already archived. | Leave archived. |

## 5. Documentation Conflicts

The following documentation conflicts or lags were found:

- `docs/README.md` still emphasizes older orientation and Phase 11A summaries, but does not surface:
  - `docs/audits/phase-12-final-verification-record.md`
  - `docs/plans/phase-13a-media-evidence-rights-model.md`
  - `docs/plans/phase-13b-storage-backup-media-audit-plan.md`

- `docs/project-status-checkpoint.md` says the practical position is that Phase 12 source work is complete and release assurance is the highest-value next step. That was reasonable earlier, but the repo now also contains:
  - a Phase 12 final verification record;
  - a Phase 13A planning document;
  - a Phase 13B planning document.

- `docs/site-structure.md` still describes public nominations as a future workflow, but the repo now has an implemented signed-in public nomination flow and `my-nominations.html`.

- `heritage-engine/README.md` has a “Future Modules” section that still lists modules such as `nominations.js`, `review.js`, `promotion.js`, `export.js`, `places.js`, `validation.js`, and `audit.js` as future modules even though they now exist.

- `docs/archive/phase-11a/phase-11a-cleanup-closeout.md` recommends “Phase 11B — return to feature development,” which is historically accurate but no longer current.

- Some docs correctly treat retired collections as retired, but older archived notes still discuss them in active-sounding ways. That is acceptable in archive, but not if those docs are treated as current instructions.

## 6. Code/Page Issues Found

### 1. Firestore rules vs deployed reality risk

- Files:
  - `firestore.rules`
  - `my-nominations.js`
  - `nominate-place.js`
  - `manage-nominations.html`
- Severity: `high`
- Why it matters:
  - The local rules file appears aligned with the signed-in nomination model, but its own header says it is only a review draft and not proof of deployment.
  - The product now depends on owner-scoped reads and signed-in nomination creates.
- Recommended future fix:
  - Run a focused rules-sync and deployment-state verification phase before more auth/media work.

### 2. Drupal/Pantheon dependency still exists in public content flow

- Files:
  - `script.js`
  - `article.js`
  - `index.html`
  - `news.html`
  - CSP/meta references across multiple pages
- Severity: `medium`
- Why it matters:
  - The public site still depends partly on `https://dev-alex-photo-cms.pantheonsite.io` for some article/news behavior.
  - This adds a second content dependency outside the core Firebase model.
- Recommended future fix:
  - Decide whether Drupal/Pantheon remains intentional; if not, plan a retirement and content-source cleanup phase.

### 3. Repeated Firebase config and app initialization

- Files:
  - `public-auth.js`
  - `nominate-place.js`
  - `my-nominations.js`
  - `place.js`
  - `article.js`
  - `export.js`
  - `map.js`
  - `script.js`
  - `search.js`
  - `admin-export.js`
  - inline scripts in several admin HTML files
- Severity: `medium`
- Why it matters:
  - The same Firebase config block is repeated across many pages.
  - This increases maintenance cost and config drift risk.
- Recommended future fix:
  - Plan a shared Firebase bootstrap/config module after reset planning is complete.

### 4. Article deletion may leave Firebase Storage orphans

- Files:
  - `manage-articles.html`
  - `upload-article.html`
  - `maintenance/audit-article-storage.mjs`
  - `maintenance/delete-selected-article-files.mjs`
  - `docs/plans/phase-13b-storage-backup-media-audit-plan.md`
- Severity: `high`
- Why it matters:
  - Article HTML and images are uploaded to Storage, but deletion of Firestore records does not by itself guarantee Storage cleanup.
- Recommended future fix:
  - Keep deletion manual for now; use the planned Storage inventory/audit model before any cleanup automation.

### 5. Hard-coded public image URLs need rights review

- Files:
  - `index.html`
  - public record `imageUrl` pathways in `place.js`, `article.js`, `script.js`, and export helpers
- Severity: `medium`
- Why it matters:
  - Some public-facing image URLs are hard-coded or externally sourced.
  - Rights, provenance, and long-term control may be unclear.
- Recommended future fix:
  - Address under the Phase 13 media/rights governance work after reset planning.

### 6. Navigation can expose too many “current” docs/pages conceptually

- Files:
  - `public-nav.js`
  - `docs/README.md`
  - multiple phase docs
- Severity: `low`
- Why it matters:
  - The public nav itself is reasonably clear, but the documentation layer has too many “current-seeming” files without one dominant index.
- Recommended future fix:
  - Add a better docs index and archive plan before new feature phases.

### 7. Relationship editing needs regression confidence

- Files:
  - `upload-article.html`
  - `heritage-engine/relationships.js`
  - `heritage-engine/export.js`
  - `place.js`
  - `article.js`
- Severity: `medium`
- Why it matters:
  - Relationship integrity is now a meaningful part of the public/article model.
  - It appears implemented enough to matter, but should be re-verified as docs and legacy cleanup proceed.
- Recommended future fix:
  - Add a focused relationship integrity and navigation cleanup review after the reset phases.

### 8. Legacy or retired page references may still confuse future work

- Files:
  - `maintenance/README-gallery-cleanup.md`
  - archived docs
  - any future assumptions about `gallery`, `upload`, `posts`, `mapPoints`, `mapPolygons`
- Severity: `low`
- Why it matters:
  - Even when correctly marked retired, legacy terms still appear widely across repo docs.
  - This can mislead future work if a doc is read out of context.
- Recommended future fix:
  - Strengthen “current vs archive vs maintenance-only” labeling.

## 7. Navigation and Tabs Review

### Current public tabs from `public-nav.js`

- Home
- News
- History
- Get involved
- Criteria
- Guidance
- Map
- Places
- My nominations
- Open Data
- Sign in

### Current admin-only pages

- `admin-login.html`
- `admin.html`
- `manage-community-places.html`
- `manage-nominations.html`
- `manage-articles.html`
- `upload-article.html`
- `admin-export.html`

### Old or legacy navigation concerns

- `docs/site-structure.md` still references an old retired `map.html?admin=true` pattern as retired history.
- `article.html` and `script.js` still support a `type=drupal` route.
- No active public-nav links to retired gallery/post workflows were found in `public-nav.js`.

### Duplicate or confusing labels

- Public nav currently includes both `My nominations` and `Sign in`.
  - This is acceptable, but the UX may later benefit from signed-in conditional nav behavior.
- `search.html` is labeled `Places`, while `place.html` is the detail page. This is understandable but worth keeping consistent in docs.
- `export.html` is labeled `Open Data`, which is clear and preferable to a raw file name label.

### Recommended cleanup

- Keep the current public tab set.
- Do not add maintenance or developer pages to public nav.
- Later consider auth-aware nav behavior:
  - show `My nominations` and sign-in/sign-out state more intentionally.
- Later confirm no retired links remain on legacy pages if any are still accessible.

## 8. Repeated or Duplicated Functions

The repo currently has repeated logic in these areas:

### Repeated Firebase config blocks

- Repeated across many public/admin scripts and inline page modules.
- This is the clearest duplication pattern in the codebase.

### Repeated auth bootstrap and redirect logic

- `buildLoginUrl()`
- `onAuthStateChanged(...)`
- admin page auth guards
- public auth signed-in checks

### Repeated navigation/header construction

- Public navigation is centralized in `public-nav.js`, which is good.
- Admin navigation is still largely page-local and repeated in structure.

### Repeated export/privacy boundary concepts

- Public export safety is represented in:
  - `export.js`
  - `heritage-engine/export.js`
  - docs/checklists/plans
- This is intentional conceptually, but it means the docs layer can become duplicative if not curated.

### Repeated article/media/image logic

- Article listing/detail/image behavior is split across:
  - `script.js`
  - `article.js`
  - `upload-article.html`
  - `heritage-engine/export.js`
- Storage/media concerns are also spread across maintenance scripts and newer Phase 13 docs.

### Repeated nomination validation and ownership boundary logic

- Nomination rules are represented in:
  - `nominate-place.js`
  - `heritage-engine/nominations.js`
  - `my-nominations.js`
  - `firestore.rules`
  - Phase 12 release/rules docs
- This is partly necessary, but it raises alignment risk when rules or payload fields change.

## 9. Firestore Rules Alignment Risk

Based on source inspection, the repo rules appear broadly aligned with the verified Phase 12 model, but with one important caution: local source is not proof of deployed rules.

### What appears aligned

- `nominate-place.js` builds signed-in nomination payloads.
- `heritage-engine/nominations.js` requires ownership metadata and strips public disallowed admin fields.
- `my-nominations.js` uses an owner-scoped query:
  - `where("submittedByUid", "==", user.uid)`
- `firestore.rules` allows:
  - public reads for `communityPlaces`, `news`, `history`
  - signed-in `placeNominations` create with ownership and email matching rules
  - owner-scoped reads via `isNominationOwner()`
  - admin-only update/review/promotion
  - no public writes to `communityPlaces`

### What remains risky or unclear

- `firestore.rules` is explicitly marked as a local review draft.
- The repo does not itself prove the deployed Firebase rules match this file.
- Phase 12 verification shows the workflow functioned in practice, but ongoing source/rules drift is still possible.

### Practical conclusion

Repo rules appear aligned with the intended and previously verified Phase 12 behavior.

The real risk is not obvious source mismatch inside the repo now; it is future drift between:

- local `firestore.rules`,
- deployed rules,
- page queries,
- and documentation assumptions.

## 10. Distance From End Goal

### MVP feature completeness

The project is fairly far along for an MVP community heritage site:

- public place discovery exists;
- public place detail exists;
- news/history pages exist;
- open data export exists;
- signed-in nomination submission exists;
- owner-scoped `My nominations` exists;
- admin review and promotion exist;
- private admin export exists;
- engine helper architecture exists.

Practical estimate:

- MVP feature completeness: **around 75–85%**

### Release readiness

Release readiness is lower than feature completeness because:

- rules deployment state is not fully anchored in repo evidence;
- Drupal/Pantheon dependency still exists;
- docs are not yet clearly tiered into current vs historical;
- Storage cleanup/backup remains planning-only;
- there is no single final “release-grade current state” index yet.

Practical estimate:

- release-readiness: **around 55–70%**

### Long-term vision readiness

Long-term vision readiness is still earlier because the project lacks:

- finalized documentation architecture;
- a settled release process;
- Storage governance in practice;
- fully normalized relationship maintenance;
- optional future GIS/dataset direction;
- stronger support/admin/install documentation.

Practical estimate:

- long-term vision readiness: **around 40–55%**

### Still missing

- one cleaned-up current docs index;
- explicit doc archive plan;
- rules sync/verification discipline;
- retirement/cleanup plan for legacy pages and references;
- decision on Drupal/Pantheon dependency;
- stronger release hardening around rules, rollback, and Storage governance.

## 11. Recommended Next 3 Phases

### 1. Phase Reset 1B — Documentation Index and Archive Plan

Goal:

- define one authoritative current docs index;
- mark archive candidates and maintenance-only docs clearly;
- reduce confusion between current instructions and historical records.

### 2. Phase Reset 1C — Firestore Rules Sync and Verification Plan

Goal:

- reconcile local `firestore.rules`, deployed expectations, and Phase 12 verified behavior;
- document what is source truth, what is deployed truth, and what still needs controlled verification;
- avoid starting Phase 13C on top of uncertain rules alignment.

### 3. Phase Reset 1D — Retired Page and Navigation Cleanup Plan

Goal:

- classify remaining legacy routes, old gallery/post assumptions, and Drupal/Pantheon dependencies;
- identify what should be kept, retired, or hidden more clearly;
- plan cleanup without changing behavior yet.

Do not resume Phase 13C implementation until these reset phases are complete or the owner explicitly accepts the remaining documentation/rules ambiguity.
