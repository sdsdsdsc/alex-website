# Official Heritage mixed-geometry roadmap

## Role and authority

This is the sequencing plan for applying the controlling
[Official Heritage spatial representation and publication policy](../policy/official-record-publication-policy.md).
It records dependencies and stop points; it does not approve implementation,
data publication, migration, or deployment.

PR numbers are indicative if another pull request is created first. Every phase
requires its own bounded approval. Later shape expansion is open-ended and
depends on evidence.

## Approved sequence

1. **PR #67 — spatial representation policy.** Finalize the policy, scope
   boundary, one-active-representation rule, public types, evidence standard,
   and this roadmap. Documentation only.
2. **PR #68 — complete Xinyu Point re-audit.** Apply `naturalSpatialForm` and
   `futureNonPointRepresentation` across the full Xinyu audit universe and
   document the result. Research and audit only.
3. **PR #69 — approved Xinyu Point batch.** Publish only the separately
   approved Point candidates from the completed re-audit.
4. **PR #70 — non-Point inventory and first pilot.** Create the candidate
   inventory, search for reusable authority and institutional sources, and
   conduct the first research-only shape pilot. No production shape.
5. **PR #71 — geometry schema and validation.** Approve and implement the
   geometry schema, active/superseded representation model, validation, and
   history requirements informed by the pilot.
6. **PR #72 — mixed-geometry interface.** Implement mixed-geometry rendering,
   the Official Heritage sidebar, official filters, legend, provenance
   presentation, and accessibility.
7. **PR #73 — first production shape.** Publish and verify the first separately
   approved evidence-supported production line or area.
8. **Optional PR #74 — context layers.** Add separately controlled
   administrative, historical-map, study-area, or other context layers.
9. **Later PRs — evidence-supported batches.** Research, approve, publish, and
   verify additional shapes in bounded batches.

## Dependency gates

- PR #68 must finish before selecting PR #69's Point batch.
- The PR #70 research pilot must finish before PR #71 fixes a runtime schema.
- Schema and validation must land before mixed-geometry public presentation.
- Rendering, filters, provenance, and accessibility must be ready before the
  first real production shape.
- A production shape requires record-specific evidence and approval in
  addition to technical readiness.
- Authority GIS should be sought before project tracing.
- A superseding shape must remove the former Point from active public output
  while preserving it in representation history.

## Current production baseline

- five active Official Heritage Point features;
- zero real line features;
- zero real polygon features;
- Official Heritage remains off by default;
- Community Heritage remains unchanged and Point-based;
- Xiabu is not published;
- Xieli is not published.

## PR #67 exclusions

PR #67 must not implement runtime fields, data records, coordinates, lines,
polygons, migrations, rendering, sidebar controls, filters, exports, Firestore
changes, Community Heritage changes, deployment, or production publication.
It must stop after opening the draft pull request.
