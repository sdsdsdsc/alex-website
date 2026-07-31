# Alex's Photo Board Documentation

This page is the navigation entry point for durable project documentation.
For the complete classification of the former root-level document set, see the
[repository-wide documentation organization audit](./audits/repository-wide-documentation-organization-audit.md).

## Documentation placement conventions

- Reusable current policies and standards belong in `docs/policy/`.
- Historical audits, evidence reviews, verification records, completed
  investigations, and diagnostic reports belong in `docs/audits/`.
- Implementation, migration, rollout, cleanup, staging, release, and roadmap
  plans belong in `docs/plans/`.
- Non-production research drafts and evidence belong in `docs/research/`.
- Supporting screenshots, diagrams, prototype SVGs, comparison images, and
  documentation illustrations belong in `docs/assets/`.
- Completed historical documents that retain unique chronology but are no
  longer active guidance belong in `docs/archive/`.
- Only durable repository-wide overviews and operational documents belong
  directly under `docs/`.

Production source data and generated application outputs remain in their
established application paths. Future Codex tasks must create documentation in
the correct existing folder, update every internal reference after a move,
distinguish research from production data, avoid temporary workspace status in
durable documents, and never duplicate a controlling policy inside a historical
plan.

Three minimal Phase 14 compatibility files remain at the root because immutable
production provenance metadata references their historical paths. They redirect
to the authoritative audit records and contain no duplicate evidence or policy.

## Durable operational documents

- [Project status checkpoint](./project-status-checkpoint.md): current practical
  project state, verified milestones, and stop boundaries.
- [Development workflow](./project-workflow.md): repository working conventions.
- [Site structure](./site-structure.md): current pages, collections, and workflow
  relationships.
- [Post-merge production gate](./post-merge-production-gate.md): required
  post-merge release checks.
- [Release rollback runbook](./release-rollback-runbook.md): rollback procedure.
- [Release smoke-test matrix](./release-smoke-test-matrix.md): stable release
  verification coverage.

## Current policy and standards

The [Official Heritage spatial representation and publication policy](./policy/official-record-publication-policy.md)
is the sole controlling authority for official heritage geometry publication.
It records the five public Official Heritage types, evidence-led natural-form
defaults, one-active-representation rule, project-interpretation standard, and
future sidebar and filter direction. It applies only to Official Heritage;
Community Heritage remains unchanged and Point-based.

Other reusable policy and guidance:

- [Local heritage listing guidance](./policy/local-heritage-listing-guidance.md)

## Plans

Plans are grouped in [docs/plans/](./plans/). They preserve proposed work,
readiness gates, rollout sequences, and implementation boundaries without
claiming that the work is complete.

Key groups include:

- account, contribution, upload, storage, and media plans from Phases 11–13;
- the historical [Phase 13A media, evidence, and rights model](./plans/phase-13a-media-evidence-rights-model.md);
- coordinate-research and provincial-pilot plans from Phases 14–15;
- Firebase rules comparison and verification plans;
- staging and Firebase Hosting preview plans from Phase 17;
- release-assurance, navigation-cleanup, and engine-roadmap plans;
- the current [Official Heritage mixed-geometry roadmap](./plans/official-heritage-mixed-geometry-roadmap.md),
  which sequences the Xinyu Point re-audit, approved Point batch, research
  pilot, representation-lifecycle extensions to the existing schema,
  adaptations to the existing mixed-geometry interface, and first production
  shape;
- the historical [Phase 15C-6 complete-register audit and batch plan](./plans/phase-15c-6-official-record-publication-policy-and-batch-plan.md).

## Audits and verification records

Audits and completed evidence records are grouped in
[docs/audits/](./audits/). They preserve what was reviewed, verified, diagnosed,
or concluded at each phase.

Key groups include:

- live-vs-local, cleanup, backup, contribution, and account verification;
- nomination and place-contribution upload audits and live verification;
- media-rights, source, rules, and production verification;
- the complete Phase 14 provincial heritage evidence and closeout chain;
- official marker, geometry-schema, renderer, and production smoke records;
- nomination-rule, evidence-URL, staging-preview, and source-assurance records;
- [Phase 15C-3 historical strict audit](./audits/phase-15c-3-first-real-official-geometry.md);
- [Phase 15C-4 historical mixed-geometry re-audit](./audits/phase-15c-4-xinyu-mixed-geometry-reaudit.md);
- [Phase 15C-5 authoritative Xiabu evidence record](./audits/phase-15c-5-xiabu-geometry-pilot.md);
- [Phase 15C-7 authoritative Xieli misleading-risk review](./audits/phase-15c-7-xieli-misleading-risk-review.md).
- [Phase 15C-8 complete Xinyu Official Heritage Point re-audit](./audits/phase-15c-8-xinyu-official-point-reaudit.md),
  the canonical 22-row provincial policy assessment and research-only PR #69
  batch recommendation;
- [Phase 15C-10 complete 2025 Xinyu list audit](./audits/phase-15c-10-xinyu-complete-official-list-audit.md),
  the canonical 62-row national/provincial/municipal identity, provider,
  readiness, and future-form research expansion.

Xiabu and Xieli remain unpublished. Production remains five official Point
features with no published line or area geometry.

## Archived history

[docs/archive/](./archive/) contains completed historical records that retain
unique chronology or provenance but are no longer controlling or operational.
The archived [documentation index and archive plan](./archive/documentation-index-and-archive-plan.md)
records the earlier documentation-control approach that preceded the current
placement conventions. The
[Phase 12A public account model](./archive/phase-12a-public-account-model.md)
is preserved as a historical architecture and safety-design record.

## Research and assets

- [docs/research/](./research/) is reserved for preserved non-production drafts,
  coordinate investigations, research GeoJSON, KML/KMZ, provider captures, and
  tracing notes. It includes the reusable external-reference
  [Cambridgeshire Local Heritage List research guide](./research/cambridgeshire-local-heritage-list-skill.md).
- Current Xinyu evidence records include the complete
  [provider matrix](./research/phase-15c-10-xinyu-provider-evidence-matrix.md)
  and the research-only
  [future non-Point candidate inventory](./research/phase-15c-10-xinyu-non-point-candidate-inventory.md).
- [docs/assets/](./assets/) contains documentation visuals, including the
  [Phase 15C-7 Xieli prototype comparison](./assets/phase-15c-7-xieli-prototype-comparison.svg).

Production assets and generated data do not belong in either folder.

## Codex project guides

- [CODEX_PROJECT_GUIDE.md](../CODEX_PROJECT_GUIDE.md)
- [Codex skills index](../codex-skills/README.md)
