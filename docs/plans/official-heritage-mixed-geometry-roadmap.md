# Official Heritage mixed-geometry roadmap

## Role and authority

This is the sequencing plan for applying the controlling
[Official Heritage spatial representation and publication policy](../policy/official-record-publication-policy.md).
It records dependencies and stop points; it does not approve implementation,
data publication, migration, or deployment.

PR numbers are indicative if another pull request is created first. Every phase
requires its own bounded approval. Later shape expansion is open-ended and
depends on evidence.

The
[complete 2025 Xinyu list audit](../audits/phase-15c-10-xinyu-complete-official-list-audit.md)
is the merged documentation-only evidence expansion created while draft PR #69
is paused. It covers all national, provincial, and municipal rows/components
and supplies a full provider matrix and a 29-candidate future non-Point
register (8 lines and 21 areas). The subsequent
[fallback Point evidence audit](../audits/phase-15c-11-xinyu-fallback-point-evidence-audit.md)
tests the union of provider-confirmed and plausible line/area identities
against the minimum Point threshold. Under the current gates it finds 39
unpublished candidates and no new passing Point: the exact ordered addition
list for PR #69 is `[]`. Owner-supplied N07 evidence nevertheless establishes
a concrete provider-located project-digitization case, so a separate
non-substantive policy clarification is recommended before candidate
re-evaluation. Neither audit publishes a record or authorizes implementation.

## Approved sequence

1. **PR #67 — spatial representation policy.** Finalize the policy, scope
   boundary, one-active-representation rule, public types, evidence standard,
   and this roadmap. Documentation only.
2. **PR #68 — complete Xinyu Point re-audit.** Apply `naturalSpatialForm` and
   `futureNonPointRepresentation` across the full Xinyu audit universe and
   document the result in the
   [canonical Phase 15C-8 audit](../audits/phase-15c-8-xinyu-official-point-reaudit.md).
   Research and audit only; its PR #69 batch is a recommendation, not
   publication approval.
3. **PR #69 — approved Xinyu Point batch.** Publish only the separately
   approved Point candidates from the completed re-audit. This draft is
   currently paused with its topic branch and head preserved.
4. **PR #70 — complete-list evidence expansion.** The merged documentation-only
   audit supplies the full official-identity, provider-search, Point-readiness,
   and future non-Point candidate baseline. It draws and publishes no shape.
5. **PR #71 — fallback Point evidence audit and N07 clarification.** Apply the
   current minimum Point gates to all 39 fallback candidates, record the
   owner-supplied N07 provider-located physical-feature evidence, keep all 39
   operationally withheld, and recommend the next policy step. Documentation
   only; no policy, coordinate, runtime, data, schema, or publication change.
6. **Next, separately approved policy clarification.** Clarify whether and how
   documented, reproducible project digitization may satisfy the existing
   coordinate requirement when raw provider coordinates are unavailable. The
   recommended interpretation is non-substantive and must preserve all current
   CRS, reconciliation, uncertainty, sensitivity, misleading-risk, provenance,
   review, and approval gates.
7. **Candidate re-evaluation.** Re-evaluate the bounded provider-located queue
   only after the clarification is approved. Do not resume or expand PR #69
   without a new candidate-specific publication instruction.
8. **Later representation-lifecycle schema and validation extension.** Extend
   the existing Phase 15C-1 schema and validation foundation for the
   one-active-representation model, stable identity, supersession, and
   representation history. Preserve and adapt the existing geometry validators
   rather than create a new geometry system from scratch.
9. **Later mixed-geometry interface adaptation.** Adapt and extend the existing
   Phase 15C-2 mixed-geometry renderer and existing Official Heritage controls
   for the new five-type sidebar and filter model, active-representation
   selection, provenance presentation, and accessibility. Preserve the already
   verified line and area rendering foundation rather than rebuild it.
10. **First production shape.** Publish and verify the first separately approved
    evidence-supported production line or area.
11. **Optional context layers.** Add separately controlled administrative,
    historical-map, study-area, or other context layers.
12. **Later evidence-supported batches.** Research, approve, publish, and verify
    additional shapes in bounded batches.

Future implementation PR numbers are intentionally unassigned. Assigning a
number in advance would conflict with the actual interposed PR #70 and PR #71
documentation work; it would not change the approved policy decisions or the
relative order of the remaining work.

## Existing technical baseline

Phase 15C-1 / PR #60 already implemented and production-verified the Point,
LineString, MultiLineString, Polygon, and MultiPolygon schema and validation
foundation. Phase 15C-2 / PR #62 already implemented and production-verified
line and area rendering with synthetic fixtures. Those foundations have not
yet published real non-Point production geometry or implemented the newly
approved one-active-representation lifecycle.

The later lifecycle-schema and interface work therefore extends and adapts
merged capabilities. It does not replace or rebuild the existing geometry
validation and rendering systems.

## Dependency gates

- PR #68 must finish before selecting PR #69's Point batch.
- The complete-list audit is an interposed research dependency only. Its
  readiness findings may narrow PR #69 or PR #70, but cannot expand either
  implementation scope without separate approval.
- The fallback Point audit applies that dependency to 39 unpublished
  candidates. All remain Withhold pending evidence because no candidate has an
  approved reproducible numerical Point/CRS and WGS84 reconciliation chain.
  N07 now passes the physical provider-feature gate, but its Point is not yet
  digitized or approved. The audit adds nothing to PR #69.
- The Phase 15C-8 audit recommends retaining the five production Points and
  proposes only the Xiabu `暴动举行地旧址` component as an ordinary PR #69
  candidate. Xieli remains a generalized-Point-only research result and is
  excluded from that batch pending its datum, styling, persistent-limitation,
  and sensitivity gates.
- A separately approved policy clarification must precede re-evaluation of the
  provider-located project-reviewed Point queue.
- Candidate re-evaluation must precede any instruction to resume or expand PR
  #69. PR #69 remains paused in the meantime.
- Later representation-lifecycle extensions must land before the interface
  adapts public presentation to active-representation selection.
- The adapted renderer, filters, provenance, and accessibility must be ready
  before the first real production shape.
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

Draft PR #69 remains paused. The complete-list audit does not modify its
branch, commit, files, or publication proposal. The fallback Point audit also
leaves it unchanged and recommends no additional Point candidate.

## PR #67 exclusions

PR #67 must not implement runtime fields, data records, coordinates, lines,
polygons, migrations, rendering, sidebar controls, filters, exports, Firestore
changes, Community Heritage changes, deployment, or production publication.
It must stop after opening the draft pull request.
