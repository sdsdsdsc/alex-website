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
was paused. It covers all national, provincial, and municipal rows/components
and supplies a full provider matrix and a 29-candidate future non-Point
register (8 lines and 21 areas). The subsequent
[fallback Point evidence audit](../audits/phase-15c-11-xinyu-fallback-point-evidence-audit.md)
tests the union of provider-confirmed and plausible line/area identities
against the minimum Point threshold. Under the current gates it finds 39
unpublished candidates and no new passing Point: the exact ordered addition
list for PR #69 is `[]`. Owner-supplied N07 evidence nevertheless establishes
a concrete provider-located project-digitization case. The separate
[Phase 15C-12 policy clarification](../audits/phase-15c-12-provider-located-point-policy-clarification.md)
is merged and documents the non-substantive interpretation. The merged
[Phase 15C-13 six-candidate audit](../audits/phase-15c-13-xinyu-priority-point-digitization-audit.md)
applies it to N03, N07, N08, P22, M23, and M30. It recommends N07 as one
Point-ready research result and keeps the other five withheld. None of these
audits publishes a record or authorizes implementation.

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
3. **PR #69 — approved Xinyu Point batch.** The merged implementation publishes
   only the separately approved P19 `暴动举行地旧址` component Point and N07
   水西红三军团指挥部旧址 Point. It is production verified with
   seven ordinary Points and no Generalized Point, line, or area.
4. **PR #70 — complete-list evidence expansion.** The merged documentation-only
   audit supplies the full official-identity, provider-search, Point-readiness,
   and future non-Point candidate baseline. It draws and publishes no shape.
5. **PR #71 — fallback Point evidence audit and N07 clarification.** Apply the
   current minimum Point gates to all 39 fallback candidates, record the
   owner-supplied N07 provider-located physical-feature evidence, keep all 39
   operationally withheld, and recommend the next policy step. Documentation
   only; no policy, coordinate, runtime, data, schema, or publication change.
6. **PR #72 — provider-located Point policy clarification.** Define the
   provider-located project-reviewed reference Point method for the case where
   a provider identifies a specific physical feature but exposes no legitimate
   raw feature coordinate. This documentation-only clarification preserves all
   current identity, CRS, reconciliation, uncertainty, sensitivity,
   misleading-risk, provenance, review, and approval gates and does not
   digitize or approve a candidate.
7. **PR #73 — bounded candidate re-evaluation.** Re-evaluate only N03, N07,
   N08, P22, M23, and M30. The merged documentation-only audit records
   one reproducible N07 Point-ready recommendation and five withheld outcomes.
   It did not itself publish N07 or modify PR #69; a later candidate-specific
   instruction approved the exact `P19, N07` draft implementation batch.
8. **Phase 15C-16 — focused Generalized Point eligibility audit.** Screen the
   55 identities left unpublished after PR #69, distinguish uncertainty from
   deliberate generalization, reconstruct Xieli's classification history, and
   apply the existing gate without publishing a candidate. The research result
   was zero eligible Generalized Points under that gate; Xieli and Qipanshan
   received historical outcome B pending specific evidence and approval.
9. **Phase 15C-17 — candidate-neutral Generalized Point policy
   recalibration.** Recalibrate the numerical gate so a bounded, useful,
   documented general vicinity or controlled multi-datum envelope may support
   an honest representative Point without weakening identity, locality,
   sensitivity, misleading-risk, transparency, review, or approval gates.
   Documentation only; it changes no Phase 15C-16 candidate outcome.
10. **Phase 15C-18 / PR #76-equivalent whole-universe reassessment.** The
   documentation-only reassessment individually rescreens all 55 unpublished
   Xinyu identities under R1–R13, reconciles duplicates and
   parent/components, and deeply evaluates the nine identities passing Stage
   1. Its A/B/C/D/E totals are `1/8/36/10/0`; P04 Xieli is the only Outcome A
   and the future publication-review batch is `[P04]`. This is evidence
   eligibility, not publication approval. The audit publishes nothing.
11. **Later representation-lifecycle schema and validation extension.** Extend
   the existing Phase 15C-1 schema and validation foundation for the
   one-active-representation model, stable identity, supersession, and
   representation history. Preserve and adapt the existing geometry validators
   rather than create a new geometry system from scratch.
12. **Later mixed-geometry interface adaptation.** Adapt and extend the existing
   Phase 15C-2 mixed-geometry renderer and existing Official Heritage controls
   for the new five-type sidebar and filter model, active-representation
   selection, provenance presentation, and accessibility. Preserve the already
   verified line and area rendering foundation rather than rebuild it.
13. **First production shape.** Publish and verify the first separately approved
    evidence-supported production line or area.
14. **Optional context layers.** Add separately controlled administrative,
    historical-map, study-area, or other context layers.
15. **Later evidence-supported batches.** Research, approve, publish, and verify
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

Merged PR #69 establishes `data/xinyu-official-heritage-records.json` and
`data/jiangxi-official-protected-heritage-map.geojson` as the authority-neutral
canonical source and aggregate. The Map consumes the latter. The historical
provincial source and generated URL remain as a validated provincial-only
compatibility contract with six Points and no N07. This container correction
does not change the approved sequence, publication gates, coordinates, or
representation meanings.

## Dependency gates

- PR #68 must finish before selecting PR #69's Point batch.
- The complete-list audit is an interposed research dependency only. Its
  readiness findings may narrow PR #69 or PR #70, but cannot expand either
  implementation scope without separate approval.
- The fallback Point audit historically applied that dependency to 39 then-
  unpublished candidates. At that audit boundary all remained Withhold pending
  evidence; N07 passed only the physical provider-feature gate. The audit
  itself added nothing to PR #69.
- The Phase 15C-8 audit recommends retaining the five production Points and
  proposes only the Xiabu `暴动举行地旧址` component as an ordinary PR #69
  candidate. It historically classified Xieli as a conditional
  generalized-Point-only research result and excluded it from that batch.
  Phase 15C-16 preserves Xieli's last candidate-specific outcome under the
  prior gate. Phase 15C-17 itself changes no candidate status; Phase 15C-18
  later applied the recalibrated gate to all 55 unpublished identities.
- Merged PR #69 adds P19 and N07 to the five retained production Points. Its
  seven-Point authority-neutral canonical aggregate is production verified.
- PR #72 merged the separately approved policy clarification before the bounded
  queue was re-evaluated.
- The merged Phase 15C-13 evidence audit was bounded to N03, N07, N08, P22,
  M23, and M30. It recorded a passing numerical recommendation only for N07
  and proposed the later-approved `P19, N07` PR #69 batch, but did not itself
  publish it.
- Separate candidate-specific approval authorized N07 for PR #69; its merged
  publication does not authorize any further record or representation.
- Under the gate applied during Phase 15C-16, zero Generalized reference Points
  were eligible. Its
  two outcome-B candidates require named evidence upgrades and a later,
  separately approved publication review; it does not create a batch.
- Phase 15C-17 preserves that historical result while recalibrating the future
  gate. It evaluates no candidate and creates no batch.
- Phase 15C-18 completes the required all-55 reassessment without preselecting
  the Phase 15C-16 shortlist. It proposes only P04, the sole Outcome A, for a
  later publication review and publishes nothing.
- Phase 15C-19 / PR #77 resolves the technical schema and presentation gap for
  source and transformation uncertainty, intentional generalization,
  support-area extent, final precision, persistent limitations, and active and
  supersession references as distinct concepts. It publishes no candidate.
- Phase 15C-20 / PR #78 is merged and production verified. It publishes P04
  Xieli as the first hollow-diamond Generalized Point with the complete
  structured contract and persistent limitations.
- Phase 15C-21 / PR #79 is merged and production verified. It audits exactly
  the 25 ordinary-Point-route identities without publishing them and records
  A/B/C/D totals of `0/11/0/14`.
- Phase 15C-22 / PR #80 is merged and production verified. It investigates
  only those 11 Outcome B identities.
  Its A/B/C/D totals are `1/10/0/0`: M13 魁星阁 is research-ready for a
  separate owner-approved proposal, while the other ten remain withheld.
  PR #80 creates no publication batch and changes no production data.
- Phase 15C-23 / PR #81 is the separately owner-approved M13-only publication,
  now merged, closed, automatically deployed through GitHub Pages, and
  production verified at merge commit
  `e215ae15f7851ba4d0a4b8ae416423c42543b164`. It adds stable identity
  `JX-XY-MCH-013` as one ordinary municipal
  `heritage-building-reference-point` at WGS84
  `[114.937158, 27.797890]` with 30 m uncertainty. It keeps Xieli as the sole
  Generalized Point and excludes M13 from the seven-Point provincial
  compatibility output because M13 is municipal. It does not authorize
  another candidate, a line, or an area.
- Phase 15C-24 / draft PR #83 is the documentation-only first-real-shape
  investigation. It reconciles all 29 authoritative non-Point identities—8
  line and 21 area candidates—and records A/B/C/D totals of `0/10/1/18`.
  No first production shape candidate is research-ready. P09 蓉泉桥 remains
  the highest-priority evidence target, but its 7.7 m alignment lacks reusable
  bridge-accurate endpoints. Production remains at zero lines and zero areas.
- The merged representation contract and one-active safeguards already cover
  the lifecycle foundation; a candidate-specific publication must exercise
  supersession when an active Point exists.
- The renderer, category filters, provenance presentation and accessibility
  already cover synthetic line/area fixtures and require candidate-specific
  verification for the first real shape.
- A production shape requires record-specific evidence and approval in
  addition to technical readiness.
- Phase 15C-24 confirms that the current blocker is candidate evidence, not a
  missing generic schema, validator, renderer, popup, accessibility, category,
  master-layer or one-active-representation capability.
- Authority GIS should be sought before project tracing.
- A superseding shape must remove the former Point from active public output
  while preserving it in representation history.

## Current production baseline

- 19 official source records, nine active Official Heritage Point Features,
  and ten exclusions in live production;
- eight ordinary Points and one Generalized reference Point;
- one national, seven provincial, and one municipal published record;
- zero real line features;
- zero real area features (Polygon or MultiPolygon);
- Official Heritage remains off by default;
- Community Heritage remains unchanged and Point-based;
- P19 and N07 are production verified; the Xiabu parent and meeting-site
  component remain unpublished;
- M13 魁星阁 is live as the sole municipal publication;
- Xieli is the sole published Generalized reference Point; Qipanshan and the
  ten remaining Phase 15C-22 Outcome B candidates remain unpublished; and
- provincial compatibility remains seven Points—six ordinary plus Xieli—and
  excludes municipal M13.

The complete-list, fallback-Point, policy-clarification, and six-candidate
audits remain historical evidence records. PR #69 subsequently published the
approved ordered `P19, N07` batch. Phase 15C-16 remains the historically valid
audit of its prior gate. Phase 15C-17 recalibrates future eligibility without
reassessing a candidate or changing production. Phase 15C-18 separately
applies that gate to all 55 identities, finds P04 evidence eligible, and leaves
production unchanged pending technical and candidate-specific approval.

## PR #67 exclusions

PR #67 must not implement runtime fields, data records, coordinates, lines,
polygons, migrations, rendering, sidebar controls, filters, exports, Firestore
changes, Community Heritage changes, deployment, or production publication.
It must stop after opening the draft pull request.
