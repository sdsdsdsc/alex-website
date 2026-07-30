# Repository-wide documentation organization audit

## Outcome and scope

This documentation-only audit classifies every Markdown file that was directly
under `docs/` at the start of the organization phase and applies the established
placement conventions to every clear, low-risk case.

Baseline: 68 root-level Markdown files. Result: seven durable operational files
remain at the root; 61 files move as complete documents without substantive
deletion: one to policy, 36 to audits, 21 to plans, two to archive, and one to
research. Three minimal Phase 14 compatibility redirects also remain at the root
because production provenance metadata references those historical paths.
Production data, generated application output, application code, tests,
workflows, Firebase files, packages, Xiabu, Xieli, and official-record
publication are outside scope.

The standalone
[official-record publication policy](../policy/official-record-publication-policy.md)
remains the sole controlling official-record publication policy.

## Inventory method

Each root document was read and classified by title, phase/subject, purpose,
authority and historical status, unique evidence or decisions, inbound and
outbound Markdown links, and references from scripts, tests, or workflows.
Link counts below reflect the reorganized link graph. No inventoried root
document was referenced by repository scripts, tests, or workflows.

A phase document is preserved even when historical because its evidence,
decision evolution, release result, or implementation sequence is not an exact
duplicate. “Later consolidation candidate” means overlap warrants a separate
content comparison; it is not deletion approval.

## Complete original root-level Markdown inventory

| Original path | Title / subject | Purpose, status, and unique value | Link and automation references | Destination and action |
| --- | --- | --- | --- | --- |
| `docs/alex-heritage-engine-roadmap.md` | Alex Heritage Engine Roadmap | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/alex-heritage-engine-roadmap.md`; Move to `docs/plans/` |
| `docs/cambridgeshire-local-heritage-list-skill.md` | Cambridgeshire Local Heritage List Project Skill | Reusable external-reference and research guidance; not controlling policy; unique reference content retained. | 2 inbound; 0 internal / 1 external outbound; repo automation: none | `docs/research/cambridgeshire-local-heritage-list-skill.md`; Move to `docs/research/` |
| `docs/current-project-state-and-doc-cleanup-audit.md` | Current Project State and Documentation Cleanup Audit | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/current-project-state-and-doc-cleanup-audit.md`; Move to `docs/audits/` |
| `docs/documentation-index-and-archive-plan.md` | Documentation Index and Archive Plan | Completed documentation-control plan; superseded by current conventions; unique historical chronology retained. | 1 inbound; 2 internal / 0 external outbound; repo automation: none | `docs/archive/documentation-index-and-archive-plan.md`; Move to `docs/archive/` and mark historical |
| `docs/firestore-rules-sync-and-verification-plan.md` | Firestore Rules Sync and Verification Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/firestore-rules-sync-and-verification-plan.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/firestore-rules-verification-plan.md` | Firestore Rules Verification Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 2 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/firestore-rules-verification-plan.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/local-heritage-listing-guidance.md` | Local Heritage Listing Guidance | Reusable policy, model, or stable guidance; active reference; unique decision content retained. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/policy/local-heritage-listing-guidance.md`; Move to `docs/policy/` |
| `docs/phase-11a-cleanup-closeout.md` | Phase 11A Cleanup Closeout | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-11a-cleanup-closeout.md`; Move to `docs/audits/` |
| `docs/phase-11a-communityplaces-user-approval-proposal.md` | Phase 11A Community Places User Approval Proposal | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-11a-communityplaces-user-approval-proposal.md`; Move to `docs/plans/` |
| `docs/phase-11a-live-readonly-backup-session-note.md` | Phase 11A Live Read-Only Backup Session Note | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-11a-live-readonly-backup-session-note.md`; Move to `docs/audits/` |
| `docs/phase-11a-live-vs-local-audit-worksheet.md` | Phase 11A Live-vs-Local Audit Worksheet | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-11a-live-vs-local-audit-worksheet.md`; Move to `docs/audits/` |
| `docs/phase-11c-image-promotion-live-verification.md` | Phase 11C Image Promotion Live Verification | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-11c-image-promotion-live-verification.md`; Move to `docs/audits/` |
| `docs/phase-11c-place-contribution-live-verification.md` | Phase 11C Place Contribution Live Verification | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-11c-place-contribution-live-verification.md`; Move to `docs/audits/` |
| `docs/phase-11c-place-contribution-workflow-plan.md` | Phase 11C / Phase 13 Place Contribution Workflow Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-11c-place-contribution-workflow-plan.md`; Move to `docs/plans/` |
| `docs/phase-11c-place-contributions-plan.md` | Phase 11C / Phase 13 Place Contributions Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-11c-place-contributions-plan.md`; Move to `docs/plans/` |
| `docs/phase-12-final-verification-record.md` | Phase 12 Final Verification Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-12-final-verification-record.md`; Move to `docs/audits/` |
| `docs/phase-12a-public-account-model.md` | Phase 12A — Public Account Model and Safety Design | Historical architecture and safety-design record; superseded as current status by later implementation and verification; unique design rationale retained. | 1 inbound; 2 internal / 0 external outbound; repo automation: none | `docs/archive/phase-12a-public-account-model.md`; Move to `docs/archive/` and mark historical |
| `docs/phase-12e-auth-rules-release-checklist.md` | Phase 12E — Auth, Rules, and Release Verification Checklist | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-12e-auth-rules-release-checklist.md`; Move to `docs/plans/` |
| `docs/phase-13a-media-evidence-rights-model.md` | Phase 13A Media, Evidence, and Rights Model | Historical media-evidence-rights planning and design record; not controlling policy; unique design principles retained. | 1 inbound; 1 internal / 0 external outbound; repo automation: none | `docs/plans/phase-13a-media-evidence-rights-model.md`; Move to `docs/plans/` and mark historical |
| `docs/phase-13a-nomination-image-upload-audit.md` | Phase 13A Nomination Evidence Image Upload Baseline Audit | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13a-nomination-image-upload-audit.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-13a-nomination-image-upload-live-verification.md` | Phase 13A Nomination Image Upload Live Verification | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13a-nomination-image-upload-live-verification.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-13a-nomination-image-upload-plan.md` | Phase 13A Nomination Evidence Image Upload Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-13a-nomination-image-upload-plan.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/phase-13b-place-contribution-image-upload-audit.md` | Phase 13B Place Contribution Image Upload Baseline Audit | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13b-place-contribution-image-upload-audit.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-13b-place-contribution-image-upload-live-verification.md` | Phase 13B Place Contribution Image Upload Live Verification | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13b-place-contribution-image-upload-live-verification.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-13b-place-contribution-image-upload-plan.md` | Phase 13B Place Contribution Image Upload Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-13b-place-contribution-image-upload-plan.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/phase-13b-place-contribution-image-upload-pre-deploy-safety-review.md` | Phase 13B Place Contribution Image Upload Pre-Deploy Safety Review | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13b-place-contribution-image-upload-pre-deploy-safety-review.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-13b-storage-backup-media-audit-plan.md` | Phase 13B Storage Backup and Media Audit Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-13b-storage-backup-media-audit-plan.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/phase-13c-13d-image-promotion-replies-plan.md` | Phase 13C/13D Image Promotion and Replies Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-13c-13d-image-promotion-replies-plan.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/phase-13c-13d-production-verification-record.md` | Phase 13C/13D Production Verification Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13c-13d-production-verification-record.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-13c-media-rights-metadata-completion-note.md` | Phase 13C Media Rights Metadata Completion Note | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13c-media-rights-metadata-completion-note.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-13c-source-verification-note.md` | Phase 13C Source Verification Note | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13c-source-verification-note.md`; Move to `docs/audits/` |
| `docs/phase-13c-ui-live-rules-readiness-note.md` | Phase 13C UI, Live Test, and Rules Readiness Note | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-13c-ui-live-rules-readiness-note.md`; Move to `docs/audits/` |
| `docs/phase-14-final-closeout.md` | Phase 14 — Provincial Protected Heritage Pilot Final Closeout | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-14-final-closeout.md`; Move to `docs/audits/` |
| `docs/phase-14a-ten-record-official-chinese-source-table.md` | Phase 14A — Ten-record official Chinese source table | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 2 inbound; 0 internal / 2 external outbound; repo automation: none | `docs/audits/phase-14a-ten-record-official-chinese-source-table.md`; Move to `docs/audits/` |
| `docs/phase-14b-translation-structured-location-review.md` | Phase 14B — Translation and structured-location review | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 1 inbound; 1 internal / 0 external outbound; repo automation: none | `docs/audits/phase-14b-translation-structured-location-review.md`; Move to `docs/audits/` |
| `docs/phase-14c-coordinate-evidence-and-review.md` | Phase 14C — Coordinate evidence and review | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 2 inbound; 1 internal / 16 external outbound; repo automation: none | `docs/audits/phase-14c-coordinate-evidence-and-review.md`; Move to `docs/audits/` |
| `docs/phase-14c-coordinate-research-readiness.md` | Phase 14C — Coordinate-research readiness | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-14c-coordinate-research-readiness.md`; Move to `docs/plans/` |
| `docs/phase-14d-14e-machine-data-geojson.md` | Phase 14D and 14E — Provincial heritage machine data and GeoJSON | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-14d-14e-machine-data-geojson.md`; Move to `docs/audits/` |
| `docs/phase-14f-provincial-heritage-map-preview.md` | Phase 14F — Provincial heritage Map preview | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-14f-provincial-heritage-map-preview.md`; Move to `docs/audits/` |
| `docs/phase-15a-firebase-rules-sync-readiness.md` | Phase 15A — Firebase Rules Sync Readiness | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-15a-firebase-rules-sync-readiness.md`; Move to `docs/plans/` |
| `docs/phase-15a-provincial-protected-heritage-pilot-readiness.md` | Phase 15A — Provincial Protected Heritage Pilot Readiness | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 1 internal / 0 external outbound; repo automation: none | `docs/plans/phase-15a-provincial-protected-heritage-pilot-readiness.md`; Move to `docs/plans/` |
| `docs/phase-15b-1-generalized-official-heritage-map-marker-model.md` | Phase 15B-1 — generalized official heritage Map marker model and Xinyu pilot | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-15b-1-generalized-official-heritage-map-marker-model.md`; Move to `docs/audits/` |
| `docs/phase-15b-4-xinyu-official-marker-expansion.md` | Phase 15B-4 Xinyu Official Marker Expansion | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 1 inbound; 0 internal / 1 external outbound; repo automation: none | `docs/audits/phase-15b-4-xinyu-official-marker-expansion.md`; Move to `docs/audits/` |
| `docs/phase-15b-firebase-rules-comparison-plan.md` | Phase 15B: Firebase Rules Comparison Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-15b-firebase-rules-comparison-plan.md`; Move to `docs/plans/` |
| `docs/phase-15c-1-official-geometry-schema-foundation.md` | Phase 15C-1 — Official Heritage Geometry Schema Foundation | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-15c-1-official-geometry-schema-foundation.md`; Move to `docs/audits/` |
| `docs/phase-15c-2-official-geometry-rendering.md` | Phase 15C-2 — Official Heritage Line and Area Rendering | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-15c-2-official-geometry-rendering.md`; Move to `docs/audits/` |
| `docs/phase-15d-manual-firebase-rules-sync-record.md` | Phase 15D: Manual Firebase Rules Sync Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-15d-manual-firebase-rules-sync-record.md`; Move to `docs/audits/` |
| `docs/phase-15e-live-smoke-check-record.md` | Phase 15E: Live Smoke Check Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-15e-live-smoke-check-record.md`; Move to `docs/audits/` |
| `docs/phase-16a-heritage-map-explorer-polish-record.md` | Phase 16A Heritage Map Explorer Polish Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-16a-heritage-map-explorer-polish-record.md`; Move to `docs/audits/` |
| `docs/phase-16b-nomination-write-permission-record.md` | Phase 16B Nomination Write Permission Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-16b-nomination-write-permission-record.md`; Move to `docs/audits/` |
| `docs/phase-16d-evidence-url-rule-alignment-record.md` | Phase 16D Evidence URL Rule Alignment Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-16d-evidence-url-rule-alignment-record.md`; Move to `docs/audits/` |
| `docs/phase-16d-live-payload-debug-mode-record.md` | Phase 16D Live Payload Debug Mode Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-16d-live-payload-debug-mode-record.md`; Move to `docs/audits/` |
| `docs/phase-16e-evidence-url-diagnosis.md` | Phase 16E Evidence URL Diagnosis Logging | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-16e-evidence-url-diagnosis.md`; Move to `docs/audits/` |
| `docs/phase-16e-nomination-rule-simplification-record.md` | Phase 16E Nomination Rule Simplification Record | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-16e-nomination-rule-simplification-record.md`; Move to `docs/audits/` |
| `docs/phase-17a-staging-site-plan.md` | Phase 17A Staging Site Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-17a-staging-site-plan.md`; Move to `docs/plans/` |
| `docs/phase-17b-firebase-hosting-preview-manual-verification.md` | Phase 17B Firebase Hosting Preview Manual Verification | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-17b-firebase-hosting-preview-manual-verification.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-17b-firebase-hosting-preview-readiness.md` | Phase 17B Firebase Hosting Preview Readiness | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-17b-firebase-hosting-preview-readiness.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/phase-17b-firebase-hosting-preview-setup.md` | Phase 17B Firebase Hosting Preview Setup | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-17b-firebase-hosting-preview-setup.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/phase-reset-1f-a-codex-source-assurance-report.md` | Phase Reset 1F-A Codex Source-Level Assurance Report | Completed or historical audit, verification, evidence, closeout, or diagnostic record; unique chronology/evidence retained. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/audits/phase-reset-1f-a-codex-source-assurance-report.md`; Move to `docs/audits/`; later consolidation candidate |
| `docs/phase-reset-1f-release-rules-assurance-checklist.md` | Phase Reset 1F Release and Rules Assurance Checklist | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/phase-reset-1f-release-rules-assurance-checklist.md`; Move to `docs/plans/`; later consolidation candidate |
| `docs/post-merge-production-gate.md` | Post-Merge Production Gate | Durable repository-wide navigation or operational guidance; active; unique content retained. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/post-merge-production-gate.md`; Keep at `docs/` root |
| `docs/project-status-checkpoint.md` | Project Status Checkpoint | Durable repository-wide navigation or operational guidance; active; unique content retained. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/project-status-checkpoint.md`; Keep at `docs/` root |
| `docs/project-workflow.md` | Development Workflow Guide | Durable repository-wide navigation or operational guidance; active; unique content retained. | 2 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/project-workflow.md`; Keep at `docs/` root |
| `docs/README.md` | Alex's Photo Board Documentation | Durable repository-wide navigation or operational guidance; active; unique content retained. | 4 inbound; 26 internal / 0 external outbound; repo automation: none | `docs/README.md`; Keep at `docs/` root |
| `docs/release-rollback-runbook.md` | Release Rollback Runbook | Durable repository-wide navigation or operational guidance; active; unique content retained. | 1 inbound; 5 internal / 0 external outbound; repo automation: none | `docs/release-rollback-runbook.md`; Keep at `docs/` root |
| `docs/release-smoke-test-matrix.md` | Release Smoke Test Matrix | Durable repository-wide navigation or operational guidance; active; unique content retained. | 3 inbound; 0 internal / 3 external outbound; repo automation: none | `docs/release-smoke-test-matrix.md`; Keep at `docs/` root |
| `docs/retired-page-navigation-cleanup-plan.md` | Retired Page and Navigation Cleanup Plan | Phase-scoped plan, proposal, checklist, readiness record, or roadmap; unique sequence retained; current applicability is governed by the checkpoint. | 0 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/plans/retired-page-navigation-cleanup-plan.md`; Move to `docs/plans/` |
| `docs/site-structure.md` | Alex's Photo Board Site Structure | Durable repository-wide navigation or operational guidance; active; unique content retained. | 1 inbound; 0 internal / 0 external outbound; repo automation: none | `docs/site-structure.md`; Keep at `docs/` root |

## Files retained at the docs root

- `docs/post-merge-production-gate.md`
- `docs/project-status-checkpoint.md`
- `docs/project-workflow.md`
- `docs/README.md`
- `docs/release-rollback-runbook.md`
- `docs/release-smoke-test-matrix.md`
- `docs/site-structure.md`

These seven files are durable repository-wide navigation, status, workflow,
site-structure, release-gate, rollback, and smoke-test references.

Compatibility redirects retained at the root:

- `docs/phase-14a-ten-record-official-chinese-source-table.md`
- `docs/phase-14b-translation-structured-location-review.md`
- `docs/phase-14c-coordinate-evidence-and-review.md`

Their only role is to preserve paths stored in
`data/jiangxi-provincial-heritage-pilot.json`; the authoritative content is in
`docs/audits/`. Updating the JSON would violate this phase's protected
production-data boundary.

## Files moved to policy

- `docs/local-heritage-listing-guidance.md` → `docs/policy/local-heritage-listing-guidance.md`

The existing
[official-record publication policy](../policy/official-record-publication-policy.md)
also remains in this folder and is the sole controlling publication authority.

## Files moved to audits

- `docs/current-project-state-and-doc-cleanup-audit.md` → `docs/audits/current-project-state-and-doc-cleanup-audit.md`
- `docs/phase-11a-cleanup-closeout.md` → `docs/audits/phase-11a-cleanup-closeout.md`
- `docs/phase-11a-live-readonly-backup-session-note.md` → `docs/audits/phase-11a-live-readonly-backup-session-note.md`
- `docs/phase-11a-live-vs-local-audit-worksheet.md` → `docs/audits/phase-11a-live-vs-local-audit-worksheet.md`
- `docs/phase-11c-image-promotion-live-verification.md` → `docs/audits/phase-11c-image-promotion-live-verification.md`
- `docs/phase-11c-place-contribution-live-verification.md` → `docs/audits/phase-11c-place-contribution-live-verification.md`
- `docs/phase-12-final-verification-record.md` → `docs/audits/phase-12-final-verification-record.md`
- `docs/phase-13a-nomination-image-upload-audit.md` → `docs/audits/phase-13a-nomination-image-upload-audit.md`
- `docs/phase-13a-nomination-image-upload-live-verification.md` → `docs/audits/phase-13a-nomination-image-upload-live-verification.md`
- `docs/phase-13b-place-contribution-image-upload-audit.md` → `docs/audits/phase-13b-place-contribution-image-upload-audit.md`
- `docs/phase-13b-place-contribution-image-upload-live-verification.md` → `docs/audits/phase-13b-place-contribution-image-upload-live-verification.md`
- `docs/phase-13b-place-contribution-image-upload-pre-deploy-safety-review.md` → `docs/audits/phase-13b-place-contribution-image-upload-pre-deploy-safety-review.md`
- `docs/phase-13c-13d-production-verification-record.md` → `docs/audits/phase-13c-13d-production-verification-record.md`
- `docs/phase-13c-media-rights-metadata-completion-note.md` → `docs/audits/phase-13c-media-rights-metadata-completion-note.md`
- `docs/phase-13c-source-verification-note.md` → `docs/audits/phase-13c-source-verification-note.md`
- `docs/phase-13c-ui-live-rules-readiness-note.md` → `docs/audits/phase-13c-ui-live-rules-readiness-note.md`
- `docs/phase-14-final-closeout.md` → `docs/audits/phase-14-final-closeout.md`
- `docs/phase-14a-ten-record-official-chinese-source-table.md` → `docs/audits/phase-14a-ten-record-official-chinese-source-table.md`
- `docs/phase-14b-translation-structured-location-review.md` → `docs/audits/phase-14b-translation-structured-location-review.md`
- `docs/phase-14c-coordinate-evidence-and-review.md` → `docs/audits/phase-14c-coordinate-evidence-and-review.md`
- `docs/phase-14d-14e-machine-data-geojson.md` → `docs/audits/phase-14d-14e-machine-data-geojson.md`
- `docs/phase-14f-provincial-heritage-map-preview.md` → `docs/audits/phase-14f-provincial-heritage-map-preview.md`
- `docs/phase-15b-1-generalized-official-heritage-map-marker-model.md` → `docs/audits/phase-15b-1-generalized-official-heritage-map-marker-model.md`
- `docs/phase-15b-4-xinyu-official-marker-expansion.md` → `docs/audits/phase-15b-4-xinyu-official-marker-expansion.md`
- `docs/phase-15c-1-official-geometry-schema-foundation.md` → `docs/audits/phase-15c-1-official-geometry-schema-foundation.md`
- `docs/phase-15c-2-official-geometry-rendering.md` → `docs/audits/phase-15c-2-official-geometry-rendering.md`
- `docs/phase-15d-manual-firebase-rules-sync-record.md` → `docs/audits/phase-15d-manual-firebase-rules-sync-record.md`
- `docs/phase-15e-live-smoke-check-record.md` → `docs/audits/phase-15e-live-smoke-check-record.md`
- `docs/phase-16a-heritage-map-explorer-polish-record.md` → `docs/audits/phase-16a-heritage-map-explorer-polish-record.md`
- `docs/phase-16b-nomination-write-permission-record.md` → `docs/audits/phase-16b-nomination-write-permission-record.md`
- `docs/phase-16d-evidence-url-rule-alignment-record.md` → `docs/audits/phase-16d-evidence-url-rule-alignment-record.md`
- `docs/phase-16d-live-payload-debug-mode-record.md` → `docs/audits/phase-16d-live-payload-debug-mode-record.md`
- `docs/phase-16e-evidence-url-diagnosis.md` → `docs/audits/phase-16e-evidence-url-diagnosis.md`
- `docs/phase-16e-nomination-rule-simplification-record.md` → `docs/audits/phase-16e-nomination-rule-simplification-record.md`
- `docs/phase-17b-firebase-hosting-preview-manual-verification.md` → `docs/audits/phase-17b-firebase-hosting-preview-manual-verification.md`
- `docs/phase-reset-1f-a-codex-source-assurance-report.md` → `docs/audits/phase-reset-1f-a-codex-source-assurance-report.md`

The previously organized Phase 15C audits remain in the same folder.

## Files moved to plans

- `docs/alex-heritage-engine-roadmap.md` → `docs/plans/alex-heritage-engine-roadmap.md`
- `docs/firestore-rules-sync-and-verification-plan.md` → `docs/plans/firestore-rules-sync-and-verification-plan.md`
- `docs/firestore-rules-verification-plan.md` → `docs/plans/firestore-rules-verification-plan.md`
- `docs/phase-11a-communityplaces-user-approval-proposal.md` → `docs/plans/phase-11a-communityplaces-user-approval-proposal.md`
- `docs/phase-11c-place-contribution-workflow-plan.md` → `docs/plans/phase-11c-place-contribution-workflow-plan.md`
- `docs/phase-11c-place-contributions-plan.md` → `docs/plans/phase-11c-place-contributions-plan.md`
- `docs/phase-12e-auth-rules-release-checklist.md` → `docs/plans/phase-12e-auth-rules-release-checklist.md`
- `docs/phase-13a-media-evidence-rights-model.md` → `docs/plans/phase-13a-media-evidence-rights-model.md`
- `docs/phase-13a-nomination-image-upload-plan.md` → `docs/plans/phase-13a-nomination-image-upload-plan.md`
- `docs/phase-13b-place-contribution-image-upload-plan.md` → `docs/plans/phase-13b-place-contribution-image-upload-plan.md`
- `docs/phase-13b-storage-backup-media-audit-plan.md` → `docs/plans/phase-13b-storage-backup-media-audit-plan.md`
- `docs/phase-13c-13d-image-promotion-replies-plan.md` → `docs/plans/phase-13c-13d-image-promotion-replies-plan.md`
- `docs/phase-14c-coordinate-research-readiness.md` → `docs/plans/phase-14c-coordinate-research-readiness.md`
- `docs/phase-15a-firebase-rules-sync-readiness.md` → `docs/plans/phase-15a-firebase-rules-sync-readiness.md`
- `docs/phase-15a-provincial-protected-heritage-pilot-readiness.md` → `docs/plans/phase-15a-provincial-protected-heritage-pilot-readiness.md`
- `docs/phase-15b-firebase-rules-comparison-plan.md` → `docs/plans/phase-15b-firebase-rules-comparison-plan.md`
- `docs/phase-17a-staging-site-plan.md` → `docs/plans/phase-17a-staging-site-plan.md`
- `docs/phase-17b-firebase-hosting-preview-readiness.md` → `docs/plans/phase-17b-firebase-hosting-preview-readiness.md`
- `docs/phase-17b-firebase-hosting-preview-setup.md` → `docs/plans/phase-17b-firebase-hosting-preview-setup.md`
- `docs/phase-reset-1f-release-rules-assurance-checklist.md` → `docs/plans/phase-reset-1f-release-rules-assurance-checklist.md`
- `docs/retired-page-navigation-cleanup-plan.md` → `docs/plans/retired-page-navigation-cleanup-plan.md`

The historical Phase 15C-6 batch plan remains in the same folder.

## Archive decision

- `docs/documentation-index-and-archive-plan.md` → `docs/archive/documentation-index-and-archive-plan.md`
- `docs/phase-12a-public-account-model.md` → `docs/archive/phase-12a-public-account-model.md`

The archived documentation plan retains its original title and now links to the
current documentation conventions and this audit. The Phase 12A model is
preserved as historical architecture/design and links to the final verification
record and current checkpoint.

## Research decision

- `docs/cambridgeshire-local-heritage-list-skill.md` → `docs/research/cambridgeshire-local-heritage-list-skill.md`

This file is reusable external-reference and research guidance. It is not
controlling project policy.

## Merge and consolidation candidates

No files were merged in this phase. The following bounded groups merit later
line-by-line consolidation analysis:

1. **Firestore rules verification:** `firestore-rules-verification-plan.md` and
   `firestore-rules-sync-and-verification-plan.md`. They overlap on rule checks
   but retain different sync and release sequencing. Recommended canonical
   direction: one current rules verification and sync plan; archive source plans
   only after unique procedures and chronology are preserved. Risk: high,
   because rules-release safeguards can be lost.
2. **Phase 17 hosting preview:** setup, readiness, and manual-verification
   documents. They overlap on Firebase Hosting preview prerequisites and checks,
   but the manual record is evidence rather than a plan. Recommended canonical
   direction: one plan plus one final verification record. Risk: medium.
3. **Phase 13 media and upload:** nomination upload, place-contribution upload,
   storage backup, rights metadata, promotion/replies, audits, safety review, and
   live-verification records. The workflow and rights concepts overlap, while
   each live record contains unique deployment evidence. Recommended canonical
   direction: a reusable media policy, one active operational plan per workflow,
   and archived historical verification records. Risk: high.
4. **Reset and release assurance:** the source-assurance report and release/rules
   checklist overlap on repository safety boundaries but serve evidence and plan
   roles. Recommended canonical direction: keep both until a stable assurance
   policy is explicitly approved. Risk: high.
5. **Documentation cleanup:** the current-state cleanup audit, retired-navigation
   cleanup plan, and archived documentation-index plan overlap in inventory and
   cleanup sequencing. Recommended canonical direction: this audit as the
   organization record, with feature/navigation cleanup retained separately.
   Risk: medium.

## Deletion candidates

No Markdown file qualifies for deletion. No exact duplicate Markdown document,
empty Markdown file, or document without unique chronology was found.

Safe non-Markdown cleanup candidates are reported below but were not deleted.

## Human-decision items

- Decide canonical documents for the five consolidation groups only after
  line-by-line unique-content comparison.
- Decide whether ignored operating-system and Firebase debug files should be
  removed from local working copies; they are already excluded from commits.
- Decide whether completed plan families should later be archived after their
  final verification records are made canonical.

## Non-Markdown clutter findings

| Item | Classification | Decision |
| --- | --- | --- |
| `.DS_Store`, `heritage-engine/.DS_Store`, `docs/.DS_Store`, `docs/archive/.DS_Store`, `.github/.DS_Store`, `maintenance/.DS_Store` | A — safe local cleanup; B — already ignored | Do not commit; optional later local deletion. |
| `firestore-debug.log` | A — safe generated-log cleanup; B — already ignored | Do not commit; optional later local deletion. |
| `Manurewa High.png` | D — production required | Keep in its existing root path; `style.css` consumes it. |
| `docs/assets/phase-15c-7-xieli-prototype-comparison.svg` | C — preserve research evidence | Keep in `docs/assets/`; referenced by the Xieli audit. |
| Draft GeoJSON, KML/KMZ, copied map exports, obsolete screenshots | No files found | No action. |
| Coverage/build output, editor backups, swap files, empty files | No files found outside dependencies | No action. |
| Exact duplicate documentation assets | None found | No action. |

## Navigation and link updates

[docs/README.md](../README.md) is now a concise grouped navigation page for
durable operations, policy, plans, audits, archive, research, assets, and Codex
guides. Relative links were recalculated from each moved document's new
directory. Plain-text path references were also updated. Three minimal Phase 14
redirects are retained because production provenance metadata depends on those
old paths; no other redirect is needed.

## Final affected documentation tree

```text
docs/
├── README.md
├── project-status-checkpoint.md
├── project-workflow.md
├── site-structure.md
├── post-merge-production-gate.md
├── release-rollback-runbook.md
├── release-smoke-test-matrix.md
├── phase-14a-…md  # compatibility redirect
├── phase-14b-…md  # compatibility redirect
├── phase-14c-…md  # compatibility redirect
├── policy/      # 2 current policy/guidance files
├── audits/      # 40 existing/moved audit files plus this audit
├── plans/       # 22 plan files, including historical design plans
├── research/    # README plus the Cambridgeshire external-reference guide
├── assets/      # documentation visuals
└── archive/     # existing historical tree plus two newly archived records
```

## Exact files changed

The complete current-path set contains 71 documentation or documentation-guide
files:

- the 61 destinations listed in **Files moved to policy**, **Files moved to
  audits**, **Files moved to plans**, **Archive decision**, and **Research
  decision** above;
- the three Phase 14 compatibility redirects retained at the docs root;
- five in-place navigation/reference updates:
  `CODEX_PROJECT_GUIDE.md`, `docs/README.md`,
  `docs/archive/phase-records/retired-page-navigation-cleanup-completion-note.md`,
  `docs/audits/phase-15c-4-xinyu-mixed-geometry-reaudit.md`, and
  `docs/release-rollback-runbook.md`;
- this audit; and
- `docs/research/README.md`.

Git's default unstaged porcelain view reports 128 entries: 58 deleted old
paths, 62 displayed untracked entries, and eight modified tracked files. The
untracked display collapses the two files in `docs/research/` into one directory
entry; `--untracked-files=all` reports 63 actual untracked files and therefore
129 path entries. The 58 deleted paths pair with identical or minimally
reference-adjusted destinations and are intended as relocations. The three
Phase 14 sources are modified into redirects rather than deleted because
production provenance still names them.

## Verification results

- GFM rendering/parse passed for all 101 Markdown files under `docs/` and all
  113 Markdown files repository-wide.
- All 81 internal links originating under `docs/` resolved (100
  repository-wide), and all 57 external links passed syntax validation.
- UTF-8, final-newline, trailing-whitespace, and case-sensitive path validation
  passed; the documentation SVG also passed XML parsing.
- No obsolete root-level documentation references remain outside this audit's
  historical inventory. The only old Phase 14 paths retained in production
  metadata resolve through the three documented compatibility redirects.
- All five data JSON/GeoJSON files parsed.
- JavaScript syntax validation passed for all 47 repository JavaScript files.
- Provincial and official publication validation passed. Generated provincial
  and official GeoJSON outputs are byte-for-byte current.
- Production remains 15 official records yielding exactly five Point features
  and ten exclusions; no line or area geometry is published.
- Workflow, script, test, protected-scope, stale-authority, absolute-workspace-
  path, generated-output, and ignored-clutter audits passed.
- `git diff --check` passed.
- Application and browser tests were not run because no application-consumed
  file changed.
- The index is empty; nothing is staged.

## Recommended follow-up cleanup batch

Perform a read-only, line-by-line consolidation analysis of the two Firestore
rules plans and the three Phase 17 hosting-preview documents. Propose canonical
files and archive routing, but do not merge or delete source documents until the
unique safety steps and verification evidence are explicitly accounted for.

## Stop point

No file is staged, committed, pushed, or submitted in a pull request. No
substantive documentation was deleted. Production remains five official Point
features with no published line or area geometry. Xiabu and Xieli remain
unpublished, and no official-record implementation has begun.
