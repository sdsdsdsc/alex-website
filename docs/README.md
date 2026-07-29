# Alex's Photo Board Documentation

This page is the current Markdown map for Alex's Photo Board. It separates active guides from reference material and archived history without deleting older records.

## Active Guides

- [docs/current-project-state-and-doc-cleanup-audit.md](./current-project-state-and-doc-cleanup-audit.md): Broad current-state audit and documentation cleanup reference. Status: active.
- [docs/project-status-checkpoint.md](./project-status-checkpoint.md): Source-based project status map and current practical phase summary. Status: active.
- [docs/site-structure.md](./site-structure.md): Page, collection, and workflow structure map. Status: active.
- [docs/phase-15a-provincial-protected-heritage-pilot-readiness.md](./phase-15a-provincial-protected-heritage-pilot-readiness.md): Phase 15A architecture, provenance, confidence, accessibility, testing, and rollback decisions for a future provincial protected heritage pilot. This is separate from the older Firebase-rules Phase 15A record. Status: active.
- [docs/phase-15b-1-generalized-official-heritage-map-marker-model.md](./phase-15b-1-generalized-official-heritage-map-marker-model.md): Separate reviewed public-location decisions, deterministic aggregate GeoJSON, generalized-reference gates, and the bounded one-marker Xinyu pilot for official protected heritage. Status: merged in PR #52 and production verified.
- [docs/phase-15b-4-xinyu-official-marker-expansion.md](./phase-15b-4-xinyu-official-marker-expansion.md): Evidence, GCJ-02-to-WGS84 reconciliation, public-location meanings, uncertainty, exclusions, and generated counts for the bounded four-marker Xinyu provincial expansion. Status: merged in PR #56 using a merge commit; the resulting `main` HEAD is `ecdf29198cdd430272cbfce2b9ababb43f99f802`. Post-merge verification and the Pages build and deployment passed, and production is live with five approved official markers. The official layer remains off by default; community behavior, Search, Filters, and category controls remain unchanged by that merged expansion.
- Map Layers tab: the Phase 15B-2 UI implementation adds an authoritative, accessible fourth tab to the existing Heritage Explorer for the community and provincial overlays while retaining the separate Leaflet basemap chooser and full-width Map column. Status: merged in PR #53 and production verified.
- Community Map categories: the Phase 15B-3 implementation uses `assetType` as the preferred presentation source and the legacy `category` field only as a fallback. Five controlled, project-owned blue marker symbols and Layers-tab visibility controls affect Map display only; unknown values use a fallback symbol. No stored-data migration occurred, and Search and Filters remain unchanged. Status: merged in PR #55 and production verified.
- Official Map categories: the bounded Phase 15B-5 implementation adds presentation-only orange marker glyphs and Layers-tab visibility controls derived only from validated published features. Exact non-empty `officialCategoryZh` values map to controlled English project-presentation labels; official source values remain unchanged, and unrecognized future values use a static fallback. Source records without approved public locations do not appear in Map category controls or counts. PR #58 was merged using a merge commit, resulting in `main` HEAD `fbf029abb7ab5d69f72f5d4619b8cdcf8a1eb817`. Post-merge verification and the Pages build and deployment passed, and production is live. The official layer remains off by default; enabling it displays exactly five official markers: three Ancient buildings, two Important modern historic sites, and no Archaeological sites category. Official category filtering affects only official Map visibility, and category state persists during the current page session. Community markers and category controls, Search, and Filters remain unchanged. Keyboard activation works for official markers, and no application-owned console errors were recorded. The Phase 15C-1 schema foundation is documented separately; the bounded Phase 15C-2 / PR 5B renderer implementation is merged and production verified as documented below.
- [docs/phase-15c-1-official-geometry-schema-foundation.md](./phase-15c-1-official-geometry-schema-foundation.md): Backward-compatible geometry structure, meaning, provenance, precision, uncertainty, compatibility, atomic validation, accessible labels, and the original Point-only production-renderer boundary for future official heritage geometry. Status: PR #60 merged using a merge commit, resulting in `main` HEAD `ab3128b958a1f3fb155f101a89a24ce2226aa739`; post-merge verification run `30355339498` and Pages build and deployment run `30355337278` passed, and production is live. Production still displays exactly five official Point markers when the default-off layer is enabled; no real line or area geometry is published.
- [docs/phase-15c-2-official-geometry-rendering.md](./phase-15c-2-official-geometry-rendering.md): Meaning-driven static line and area styles, feature-level Leaflet rendering, accessible non-Point activation, safe provenance-aware popups, official-category integration, atomic failure, and synthetic coverage for all validated geometry families. Status: PR #62 merged using a merge commit, resulting in `main` HEAD `7354de5cb349a68a3676643b059b59382edb4f31`. Post-merge verification run 323 and Pages build and deployment run 368 passed, and production is live. The official layer remains off by default; enabling it displays exactly five official Point markers. No real line, polygon, area, or other non-Point geometry is visible yet. Official category controls remain functional: disabling Ancient buildings leaves the two modern historic-site markers and puts the parent control into the expected mixed state, while restoring Ancient buildings returns all five official markers. Five community markers remain visible; Search, Filters, and community category controls remain unchanged; and no application-owned browser warnings or errors were recorded. PR 5C has not started.
- [docs/phase-14a-ten-record-official-chinese-source-table.md](./phase-14a-ten-record-official-chinese-source-table.md): Phase 14A source transcription and provenance record for the first ten official Chinese provincial protected heritage entries; no translation, coordinates, GeoJSON, or Map integration. Status: active.
- [docs/phase-14b-translation-structured-location-review.md](./phase-14b-translation-structured-location-review.md): Phase 14B approved project romanization, English translation, and structured-location review for the ten-record pilot; no coordinates, GeoJSON, Map integration, or runtime data. Status: approved project review.
- [docs/phase-14c-coordinate-research-readiness.md](./phase-14c-coordinate-research-readiness.md): Phase 14C coordinate-research methodology and blank ten-record evidence worksheet; no actual coordinates, machine-readable data, GeoJSON, or Map integration. Status: readiness.
- [docs/phase-14c-coordinate-evidence-and-review.md](./phase-14c-coordinate-evidence-and-review.md): Phase 14C candidate coordinate evidence and approved review for all ten provincial heritage pilot records; all ten current outcomes are non-renderable, with no machine dataset, GeoJSON, or Map integration. Status: approved coordinate research review.
- [docs/phase-14d-14e-machine-data-geojson.md](./phase-14d-14e-machine-data-geojson.md): Phase 14D canonical machine-data contract and Phase 14E deterministic GeoJSON generation for the ten-record provincial heritage pilot; all ten records remain non-renderable and the valid generated layer has zero features. Status: merged and production verified.
- [docs/phase-14f-provincial-heritage-map-preview.md](./phase-14f-provincial-heritage-map-preview.md): Phase 14F default-off Map preview for the valid-empty provincial heritage GeoJSON, including lazy loading, isolated failure handling, future Point validation, accessibility, testing, and rollback. Status: merged and production verified.
- [docs/phase-14-final-closeout.md](./phase-14-final-closeout.md): Authoritative Phase 14A–14F completion record covering the valid-empty outcome, production Map verification, provenance and rendering restrictions, unresolved source-document-number verification, rollback, and agreed next-order plan. Status: complete.
- [docs/phase-13c-source-verification-note.md](./phase-13c-source-verification-note.md): Phase 13C source verification note. Status: active.
- [docs/phase-13c-ui-live-rules-readiness-note.md](./phase-13c-ui-live-rules-readiness-note.md): Phase 13C UI, live-test, and rules readiness note. Status: active.

## Codex Skills

- [CODEX_PROJECT_GUIDE.md](../CODEX_PROJECT_GUIDE.md): Master operating guide for Codex work in this repo. Status: active.
- [codex-skills/README.md](../codex-skills/README.md): Skills index. Status: active.
- [codex-skills/firestore-permission-debugging.md](../codex-skills/firestore-permission-debugging.md): Permission-denied debugging workflow. Status: active.
- [codex-skills/github-pages-live-site-check.md](../codex-skills/github-pages-live-site-check.md): Live-site mismatch workflow. Status: active.
- [codex-skills/firebase-rules-repo-sync.md](../codex-skills/firebase-rules-repo-sync.md): Firebase rules sync workflow. Status: active.
- [codex-skills/form-field-compatibility.md](../codex-skills/form-field-compatibility.md): Form-field tracing workflow. Status: active.
- [codex-skills/public-export-privacy-check.md](../codex-skills/public-export-privacy-check.md): Public export and privacy workflow. Status: active.
- [codex-skills/admin-review-promotion-workflow.md](../codex-skills/admin-review-promotion-workflow.md): Admin review and promotion workflow. Status: active.
- [codex-skills/evidence-rights-workflow.md](../codex-skills/evidence-rights-workflow.md): Evidence URL and rights workflow. Status: active.
- [codex-skills/minimal-fix-regression-check.md](../codex-skills/minimal-fix-regression-check.md): Minimal-fix regression checklist. Status: active.

## Current Reference Docs

- [docs/documentation-index-and-archive-plan.md](./documentation-index-and-archive-plan.md): Planning note for documentation cleanup and archive structure. Status: reference.
- [docs/local-heritage-listing-guidance.md](./local-heritage-listing-guidance.md): Content and heritage framing guidance. Status: reference.
- [docs/phase-reset-1f-a-codex-source-assurance-report.md](./phase-reset-1f-a-codex-source-assurance-report.md): Source-level assurance report used for repo-state verification. Status: reference.

- [docs/firestore-rules-verification-plan.md](./firestore-rules-verification-plan.md): Firestore rules verification plan. Status: active.
- [docs/firestore-rules-sync-and-verification-plan.md](./firestore-rules-sync-and-verification-plan.md): Rules sync and verification planning doc. Status: active.
- [docs/release-rollback-runbook.md](./release-rollback-runbook.md): Rollback guidance for release problems. Status: active.
- [docs/release-smoke-test-matrix.md](./release-smoke-test-matrix.md): Manual smoke test matrix. Status: active.
- [docs/phase-12e-auth-rules-release-checklist.md](./phase-12e-auth-rules-release-checklist.md): Auth and rules release checklist. Status: active.
- [docs/phase-reset-1f-release-rules-assurance-checklist.md](./phase-reset-1f-release-rules-assurance-checklist.md): Owner-facing release and rules assurance checklist. Status: active.

- [docs/phase-13a-media-evidence-rights-model.md](./phase-13a-media-evidence-rights-model.md): Phase 13A rights model planning. Status: reference.
- [docs/phase-13b-storage-backup-media-audit-plan.md](./phase-13b-storage-backup-media-audit-plan.md): Phase 13B storage and backup plan. Status: reference.
- [docs/phase-13c-media-rights-metadata-completion-note.md](./phase-13c-media-rights-metadata-completion-note.md): Phase 13C implementation note. Status: active.
- [docs/retired-page-navigation-cleanup-plan.md](./retired-page-navigation-cleanup-plan.md): Navigation cleanup planning record. Status: reference.
- [docs/phase-15a-firebase-rules-sync-readiness.md](./phase-15a-firebase-rules-sync-readiness.md): Older Phase 15A readiness record for Firebase rules synchronization only; it is not the provincial protected heritage pilot plan. Status: historical reference.

## Archived Phase Records

- [docs/archive/README.md](./archive/README.md): Archive index. Status: archive candidate.
- [docs/archive/phase-records/retired-page-navigation-cleanup-completion-note.md](./archive/phase-records/retired-page-navigation-cleanup-completion-note.md): Historical completion note for the retired-page navigation cleanup. Status: historical.
- [docs/archive/old-roadmaps/alex-heritage-engine-roadmap.md](./archive/old-roadmaps/alex-heritage-engine-roadmap.md): Older roadmap for the heritage engine direction. Status: historical.
- [docs/archive/phase-10/phase-10-engine-checkpoint.md](./archive/phase-10/phase-10-engine-checkpoint.md): Phase 10 engine checkpoint. Status: historical.
- [docs/archive/phase-10/phase-10-engine-closeout.md](./archive/phase-10/phase-10-engine-closeout.md): Phase 10 engine closeout. Status: historical.
- [docs/archive/phase-10/phase-10m-nomination-extraction-plan.md](./archive/phase-10/phase-10m-nomination-extraction-plan.md): Earlier nomination extraction plan. Status: historical.
- [docs/archive/phase-10/phase-10o-admin-review-promotion-plan.md](./archive/phase-10/phase-10o-admin-review-promotion-plan.md): Earlier admin review and promotion plan. Status: historical.
- [docs/archive/phase-11a/phase-11a-cleanup-closeout.md](./archive/phase-11a/phase-11a-cleanup-closeout.md): Phase 11A cleanup closeout. Status: historical.
- [docs/archive/phase-11a/phase-11a-communityplaces-audit-worksheet.md](./archive/phase-11a/phase-11a-communityplaces-audit-worksheet.md): Community places audit worksheet. Status: historical.
- [docs/archive/phase-11a/phase-11a-communityplaces-live-polish-plan.md](./archive/phase-11a/phase-11a-communityplaces-live-polish-plan.md): Live polish plan for community places. Status: historical.
- [docs/archive/phase-11a/phase-11a-communityplaces-user-approval-proposal.md](./archive/phase-11a/phase-11a-communityplaces-user-approval-proposal.md): Approval proposal record. Status: historical.
- [docs/archive/phase-11a/phase-11a-data-cleanup-audit-plan.md](./archive/phase-11a/phase-11a-data-cleanup-audit-plan.md): Data cleanup audit plan. Status: historical.
- [docs/archive/phase-11a/phase-11a-live-readonly-backup-checklist.md](./archive/phase-11a/phase-11a-live-readonly-backup-checklist.md): Backup checklist. Status: historical.
- [docs/archive/phase-11a/phase-11a-pre-live-audit-hardening.md](./archive/phase-11a/phase-11a-pre-live-audit-hardening.md): Pre-live hardening note. Status: historical.
- [docs/archive/phase-12-design/phase-12a-public-account-model.md](./archive/phase-12-design/phase-12a-public-account-model.md): Public account model design. Status: historical.
- [docs/archive/phase-9/phase-9-nomination-workflow-spec.md](./archive/phase-9/phase-9-nomination-workflow-spec.md): Early nomination workflow spec. Status: historical.
- [docs/archive/reference-experiments/cambridgeshire-local-heritage-list-skill.md](./archive/reference-experiments/cambridgeshire-local-heritage-list-skill.md): Reference experiment doc. Status: historical.

## Archived Debugging Records

- [docs/archive/phase-11a/phase-11a-live-vs-local-audit-worksheet.md](./archive/phase-11a/phase-11a-live-vs-local-audit-worksheet.md): Historical live-vs-local audit worksheet. Status: historical.
- [docs/archive/phase-11a/phase-11a-news-history-audit-worksheet.md](./archive/phase-11a/phase-11a-news-history-audit-worksheet.md): Historical news/history audit worksheet. Status: historical.
- [docs/archive/phase-11a/phase-11a-firestore-rules-verification-checklist.md](./archive/phase-11a/phase-11a-firestore-rules-verification-checklist.md): Historical rules verification checklist. Status: historical.
- [docs/archive/phase-11a/phase-11a-live-firebase-readonly-audit-plan.md](./archive/phase-11a/phase-11a-live-firebase-readonly-audit-plan.md): Historical live Firebase audit plan. Status: historical.
- [docs/archive/phase-11a/phase-11a-admin-export-safety-review.md](./archive/phase-11a/phase-11a-admin-export-safety-review.md): Historical admin export safety review. Status: historical.

## Related Markdown Outside docs

- [heritage-engine/README.md](../heritage-engine/README.md): Engine module overview and reference. Status: reference.

## Intentionally Not Moved Yet

- [docs/phase-12-final-verification-record.md](./phase-12-final-verification-record.md): Mixed status. Historical milestone record, but still referenced as the best Phase 12 verification source. Status: unclear for archive move.
- [docs/phase-11a-live-readonly-backup-session-note.md](./phase-11a-live-readonly-backup-session-note.md): Historical evidence for backup boundaries that still has reference value. Status: unclear for archive move.
- [docs/phase-reset-1f-a-codex-source-assurance-report.md](./phase-reset-1f-a-codex-source-assurance-report.md): Recent source-check report with both historical and current reference value. Status: unclear for archive move.

## Notes

- Important active references remain:
  - `docs/current-project-state-and-doc-cleanup-audit.md`
  - `docs/project-status-checkpoint.md`
  - `docs/site-structure.md`
  - `docs/firestore-rules-verification-plan.md`
  - `docs/firestore-rules-sync-and-verification-plan.md`
  - `docs/release-smoke-test-matrix.md`
  - `docs/phase-13c-source-verification-note.md`
  - `docs/phase-13c-ui-live-rules-readiness-note.md`
- Historical evidence is preserved rather than deleted.
- Archive moves in this pass were limited to files with clearly historical status and no conflicting “keep visible” guidance.

## Warning

- Do not upload private backup JSON files to GitHub.
- Private backups live outside the repo.
- `placeNominations` remains private and admin-only.
