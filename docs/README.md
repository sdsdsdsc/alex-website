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
defaults, one-active-representation rule, project-interpretation standard,
provider-located project-reviewed reference Point evidence method, and future
sidebar and filter direction. The clarification preserves the existing
publication gates and does not create a runtime type or approve a candidate. It
applies only to Official Heritage; Community Heritage remains unchanged and
Point-based.

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
- [Phase 15C-9 Xiabu uprising-site Point publication](./audits/phase-15c-9-xiabu-uprising-site-point-publication.md),
  the bounded draft implementation record for the single approved component Point;
- [Phase 15C-10 complete 2025 Xinyu list audit](./audits/phase-15c-10-xinyu-complete-official-list-audit.md),
  the canonical 62-row national/provincial/municipal identity, provider,
  readiness, and future-form research expansion.
- [Phase 15C-11 Xinyu fallback Point evidence audit](./audits/phase-15c-11-xinyu-fallback-point-evidence-audit.md),
  the 39-candidate minimum-Point-gate review. It finds no new passing candidate
  and leaves the paused PR #69 batch at Xiabu P19 only. Owner-supplied N07
  evidence confirms a provider-located point-like physical candidate, but no
  numerical project-reviewed Point is digitized or approved. The audit
  recommends a separate non-substantive policy clarification followed by a
  bounded provider-located candidate re-evaluation.
- [Phase 15C-12 provider-located Point policy clarification](./audits/phase-15c-12-provider-located-point-policy-clarification.md),
  the non-substantive decision record defining the feature-identification,
  numerical-construction, reproducibility, CRS, uncertainty, sensitivity,
  misleading-risk, provenance, and public-wording gates. It approves no
  coordinate or candidate and leaves paused PR #69 unchanged.
- [Phase 15C-13 Xinyu priority Point digitization audit](./audits/phase-15c-13-xinyu-priority-point-digitization-audit.md),
  the bounded six-candidate re-evaluation after the policy clarification. It
  records one Point-ready research recommendation—N07 at a documented
  project-reviewed WGS84 reference Point—and keeps N03, N08, P22, M23, and M30
  withheld. It publishes nothing and leaves paused PR #69 unchanged.

The approved Xiabu `暴动举行地旧址` component is now represented in the
generated publication dataset; the parent, meeting-site component, and Xieli
remain unpublished. The dataset contains six official Point features and no
published line or area geometry.

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
  [future non-Point candidate inventory](./research/phase-15c-10-xinyu-non-point-candidate-inventory.md),
  containing 8 line and 21 area candidates, plus the
  [fallback Point candidate matrix](./research/phase-15c-11-xinyu-fallback-point-candidate-matrix.md),
  which reconciles all 39 unpublished candidates and records their publication
  gates, and the bounded
  [priority Point candidate matrix](./research/phase-15c-13-xinyu-priority-point-candidate-matrix.md),
  which records the refreshed provider, CRS, numerical-construction, risk, and
  outcome evidence for exactly N03, N07, N08, P22, M23, and M30.
- [docs/assets/](./assets/) contains documentation visuals, including the
  [Phase 15C-7 Xieli prototype comparison](./assets/phase-15c-7-xieli-prototype-comparison.svg).

Production assets and generated data do not belong in either folder.

## Codex project guides

- [CODEX_PROJECT_GUIDE.md](../CODEX_PROJECT_GUIDE.md)
- [Codex skills index](../codex-skills/README.md)
