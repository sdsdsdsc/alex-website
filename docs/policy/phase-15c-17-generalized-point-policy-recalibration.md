# Phase 15C-17 — Generalized reference Point policy recalibration

## Decision, authority, and scope

This candidate-neutral decision record recalibrates the controlling
[Official Heritage spatial representation and publication policy](./official-record-publication-policy.md).
It answers when a documented, reasonably limited general vicinity may support
a `generalized-reference-point` even though an exact feature-level,
known-datum Point is unavailable.

The decision is:

> A Generalized reference Point may be considered when reliable evidence links
> a confirmed official identity to a bounded and useful spatial support area,
> and an approved reproducible method constructs an honest representative
> Point without implying the exact feature, centre, entrance, extent, or legal
> boundary.

This is a proportional recalibration, not permission to guess. Identity,
identity-to-locality linkage, bounded support, reproducibility, sensitivity,
privacy, misleading-risk control, transparent wording, accountable review,
one active representation, and separate publication approval remain mandatory.

This record evaluates no candidate. It does not change any Phase 15C-16
outcome, create a shortlist, approve a coordinate, or authorize publication.

Policy decision date: `2026-08-02`. PR #75 approved and merged this
candidate-neutral policy record. Candidate reviews must name their own evidence
reviewer and accountable project owner or role.

## Why the previous gate was disproportionate

The Phase 15C-16 gate required the original numerical spatial basis and its
source CRS or datum before a deliberate WGS84 generalization could pass. That
was appropriate for an ordinary feature-reference Point and correctly rejected
undocumented coordinate repair. In practice, however, it made the hollow
diamond depend on nearly the same feature-level numerical evidence as an
ordinary Point, even where its intended meaning was only a reliably supported,
limited general vicinity.

The recalibrated gate permits the documented support area itself to be a
spatial basis. It also permits a narrowly controlled multi-interpretation
envelope for an official or institutional coordinate whose datum is unstated.
Neither route lowers the identity, boundedness, construction, usefulness,
sensitivity, comprehension, review, or approval gates.

## Representation classes

| Class | Intended meaning | Required route |
| --- | --- | --- |
| Ordinary project-reviewed reference Point | A Point referencing the heritage feature, separately resolved component, or another approved feature-level spatial anchor. Horizontal uncertainty estimates error around that intended Point. | Use the ordinary Point gate and a legitimate feature-level coordinate or approved digitization method. |
| Generalized reference Point | A deliberate representative marker for a documented, reasonably limited support area or a deliberately coarsened or displaced location. | Apply R1–R13 below and use the existing `generalized-reference-point` meaning. |
| Unsupported approximate marker | A guessed, convenient, arbitrary, or insufficiently evidenced location, regardless of symbol or attached uncertainty. | Prohibited; withhold. |
| Future line or area | The route where one representative Point would materially misdescribe the identity's natural spatial form. | Retain the evidence-led LineString, MultiLineString, Polygon, or MultiPolygon route. |
| Withheld identity | The outcome when identity, locality, boundedness, construction, usefulness, sensitivity, or misleading risk is insufficient. | Publish no coordinate or placeholder. |

A Generalized reference Point means:

> Representative location for the documented general vicinity of the official
> heritage identity.

It does not represent the exact feature, feature centre, entrance, surveyed
position, surviving component, site extent, building footprint, or legal
protection boundary.

## Revised eligibility gate

All thirteen gates apply. A conditional or failed gate prevents outcome A.

### R1 — confirmed official identity

- Establish the exact official identity, designation level, and locality.
- Resolve parent, component, sibling, and duplicate treatment.
- Do not substitute similar names, villages, visitor facilities, nearby
  attractions, or one component for another identity.
- Provider names or photographs alone do not establish official identity.

### R2 — trustworthy identity-to-locality linkage

Reliable evidence must connect the confirmed identity to the proposed support
area. It may include government or heritage-authority material, an official
register or protection table, official museum or institutional material, a
reusable georeferenced plan, or reliable independent corroboration. A stable
provider feature may corroborate stronger identity and locality evidence; a
similarly named search result cannot qualify by itself.

### R3 — bounded spatial support and proportional usefulness

The evidence must define a closed boundary, an enumerated coordinate envelope,
or another reproducibly limited support area. Apply this tiered test without a
universal distance threshold:

| Support scale | Starting position | Required finding |
| --- | --- | --- |
| Site, compound, hamlet, or similarly limited vicinity | Potentially suitable | The support is evidenced, bounded, useful at normal map scales, and does not imply an unsupported feature or centre. |
| Settlement or neighbourhood | Conditional | The identity-to-locality link is strong, the boundary is reusable and current enough for the stated meaning, the marker materially aids discovery, and wording/style prevent feature-level interpretation. |
| District, county, city, or larger administrative area | Ordinarily unsuitable | It may proceed only where the identity genuinely operates at that scale and a representative Point remains useful and non-misleading. A convenient administrative centroid is not enough. |
| Long corridor, large area, or multipart designation | Conditional to unsuitable | One Point must have an honest designation-level meaning and must not privilege a component or invent a centre; otherwise retain a line/area route or withhold. |
| Uncertain or contested locality boundary | Unsuitable until resolved | The accepted support cannot be bounded reproducibly. |

The reviewer must answer all of these questions:

1. Is the supported area small enough to help a map user?
2. Is the marker useful at the map's normal overview and detail scales?
3. Could a reasonable visitor mistake it for the actual feature or entrance?
4. Does the construction imply a centre that the evidence does not support?
5. Would withholding or waiting for a line or area be more honest?

Failure on usefulness, boundedness, or misleading effect requires outcome C or
D. Distance alone does not decide the result.

### R4 — legitimate generalization purpose

Record the purpose before construction. Legitimate purposes include an
authority-published approximate location; a limited supported vicinity without
a feature-level Point; deliberate sensitivity or privacy displacement;
bounded unresolved datum ambiguity under R6; or a useful temporary vicinity
reference pending better evidence or representation. Do not invent a purpose
merely to place an identity on the map.

### R5 — approved reproducible construction

Use a method classified in the construction-method table below. Retain every
source, boundary, coordinate, CRS statement, calculation, algorithm/tool and
version, transformation, rounding rule, output precision, review date, and
result needed for an independent reviewer to reproduce the Point. The selected
coordinate must follow a deterministic rule fixed before inspecting which
result is most convenient.

### R6 — bounded unknown-datum treatment

An official or institutional coordinate with an unstated datum may
conditionally support a Generalized reference Point only when all of the
following hold:

1. evidence links the coordinate to the exact official identity;
2. the original coordinate, notation, source wording, date, and context are
   preserved exactly;
3. the reviewer justifies a finite list of plausible source datums from the
   source context rather than automatically assuming WGS84, GCJ-02, or BD-09;
4. every plausible interpretation is reproducibly converted to WGS84 using
   documented algorithms and tests;
5. the accepted envelope covers every interpretation plus source precision
   and quantified transformation effects;
6. the displayed Point is selected deterministically, normally as the centre
   of a documented minimum-enclosing geodesic circle or another pre-approved
   reproducible envelope rule;
7. the final support distance covers the complete accepted envelope;
8. R3 confirms that the result remains useful and non-misleading at public map
   scales; and
9. public wording states that the source datum is unspecified and the marker
   represents the resulting general vicinity.

The method fails if plausible interpretations cannot be bounded responsibly,
the envelope is too large to be useful, or evidence cannot justify the datum
set. A stress-test datum is not an asserted source datum. The project must not
silently assume WGS84, select the most convenient interpretation, or conceal
the envelope behind one unexplained uncertainty number.

### R7 — separate numerical concepts

The controlling distinction is:

```text
source-coordinate and transformation uncertainty
≠ intentional spatial generalization
≠ supported general-vicinity extent
```

The evidence record must separately preserve:

- source-coordinate uncertainty or stated precision;
- transformation uncertainty for each accepted coordinate path;
- intentional rounding, displacement, gridding, or other generalization;
- the supported-area boundary, radius, or extent;
- final displayed-coordinate precision; and
- the complete public limitation.

The overall public limitation may summarize these concepts, but one large
uncertainty value must not replace the underlying records.

### R8 — honest Point meaning

Use the existing canonical `generalized-reference-point` meaning and hollow
diamond. The controlled public meaning is a representative location for the
documented general vicinity. It must not claim a feature location, exact
component, centre, entrance, surveyed position, extent, footprint, or legal
boundary. Record authority and representation authority remain separate: a
project-computed marker is a `project-reviewed-interpretation` even when its
input evidence is official. This documentation phase adds no runtime value.

### R9 — sensitivity, privacy, and access

Assess archaeological vulnerability, concealed or fragile fabric, private
residences, public access, prior exact-location disclosure, incremental risk
from machine-readable publication, and whether the chosen generalization
actually reduces the identified risk. Archaeological classification does not
automatically require generalization. Prior public disclosure does not remove
the need for review.

### R10 — misleading risk and user comprehension

Test the proposal at normal overview and detail scales. It passes only if the
hollow diamond is visually distinct from an ordinary Point, popup and
accessible text communicate the same limitation, coordinate precision does not
imply unsupported exactness, and a reasonable visitor is unlikely to treat the
marker as an entrance, exact feature, centre, or legal boundary.

The future public presentation must include wording equivalent to:

> Generalized reference location. This marker represents the documented
> general vicinity of the heritage record. It does not show the exact feature,
> centre, entrance, extent, or legal protection boundary.

Add candidate-specific wording for an unstated datum, sensitivity displacement,
authority approximation, or support-area construction. This phase does not
modify the popup, accessible name, styling, or symbol guide.

### R11 — natural spatial form and temporary use

An areal, linear, or multipart identity is not automatically eligible or
ineligible. A temporary Generalized reference Point may be considered only
when one designation-level Point has an honest and useful meaning, does not
privilege a component or invent a centre, and does not obscure that a line or
area remains the more appropriate future route. Difficulty drawing a shape is
not a permanent justification. If a single marker materially misdescribes the
identity, use outcome C or D.

### R12 — one active representation and supersession

One official identity or separately resolved component has one active public
representation. A later approved ordinary Point, line, or area supersedes the
Generalized reference Point. The hollow diamond and replacement must not be
displayed simultaneously for the same identity. Prior representations may
remain in provenance or history only.

### R13 — review and approval

Record the evidence reviewer, accountable project owner or role, review date,
policy version (`Phase 15C-17`), construction method, unresolved limitations,
and required next approval. Passing this policy or receiving a research
recommendation is not publication approval. Every publication requires a
separate candidate-specific implementation decision.

## Construction-method decision table

For every permitted or conditional method, the retained method record must
include its sources, calculation and CRS chain, output precision, separated R7
quantities, support information, reviewer/date, and the R10 limitation. The
table states additional requirements and principal failure conditions.

| Method | Status | Required evidence | Construction rule | Required metadata | Main misleading risk | Decision rationale / failure conditions |
| --- | --- | --- | --- | --- | --- | --- |
| Official approximate coordinate | Permitted | Identity-linked authority coordinate with stated approximate meaning and usable CRS/datum | Convert reproducibly to WGS84; retain authority precision and do not sharpen it | Source wording, original value/CRS, conversions, source uncertainty, output precision, support/limitation | Appearing exact or authority-surveyed | Direct approximate evidence is a legitimate basis; fail if identity or CRS meaning is unresolved. |
| Rounded known-datum coordinate | Permitted | Legitimate identity-linked coordinate and documented purpose | Apply a predeclared grid/decimal rounding rule in a documented CRS, then transform if necessary | Original coordinate/CRS, rounding grid and displacement, transformation, support, precision, limitation | Rounded value read as exact | Reproducible deliberate coarsening; fail if rounding does not achieve the purpose or hides source error. |
| Sensitivity-displaced known coordinate | Conditionally permitted | Restricted retained source coordinate, risk assessment, and accountable approval | Apply an approved deterministic or access-controlled displacement method that keeps the marker inside the supported safe area | Restricted origin reference, method/version, displacement bounds, risk decision, support, limitation | Revealing the origin or implying the displaced point is real | Useful only when displacement demonstrably reduces risk; fail if safe support or governance is absent. |
| Representative point of a documented support area | Permitted | Reusable, identity-linked bounded area or reproducibly bounded vicinity | Use a predeclared point-on-surface, enclosing-circle centre, or equivalent rule appropriate to the area's shape | Boundary/source/licence/CRS, algorithm/version, support extent, output precision, limitation | Invented centre or hidden boundary distortion | The area itself is a valid generalized spatial basis; fail when it is too broad, contested, or misleading. |
| Point-on-surface of a reusable official/locality boundary | Conditionally permitted | Identity-locality link and reusable, current-enough boundary | Calculate point-on-surface deterministically in an appropriate projected CRS and convert to WGS84 | Boundary version/licence/CRS, algorithm, support extent, limitation | Locality point mistaken for heritage feature | Avoids an outside centroid but passes only when the locality scale passes R3. |
| Centroid of a documented bounded area | Conditionally permitted | Reusable identity-linked area with known geometry and CRS | Calculate a declared geodesic or projected centroid; verify it lies in and represents the support, otherwise use point-on-surface | Boundary/version/licence/CRS, centroid method, shape checks, support, limitation | Centre implication; result outside concave/multipart area | Accept only for compact, representative areas; fail for distorted, holed, multipart, or overly broad areas. |
| Representative point of a protection or search area | Conditionally permitted | Authoritative/reliable area whose meaning and relation to the identity are explicit | Apply an approved area method without relabelling the area as the heritage extent | Area meaning/source/licence/CRS, algorithm, support, uncertainty, limitation | Protection/search area mistaken for feature or legal boundary | May support vicinity meaning, never a feature or extent claim; fail if the area's semantics or reuse rights are unclear. |
| Multi-datum envelope from an official unstated-datum coordinate | Conditionally permitted | Exact identity link, preserved official coordinate/context, justified finite datum set | Apply every R6 step and deterministic representative rule | Original notation, plausible datums/rationale, conversions, envelope, source/transformation effects, radius, precision, limitation | Convenient datum selection or false precision | Proportionate only where ambiguity is bounded and useful; otherwise withhold. |
| Institutionally confirmed locality plus reusable locality boundary | Conditionally permitted | Strong identity-locality statement and a compatible reusable boundary | Derive a representative point using an approved support-area rule | Statement/date, boundary/version/licence/CRS, method, support, limitation | Institution named a locality, not the feature | Can support general vicinity only if boundary and scale pass R2–R3. |
| Corroborated stable provider feature | Conditionally permitted | Stable exact-feature record plus stronger official/institutional identity-locality evidence | Use it only as corroboration for linkage or support; construct the Point through another approved coordinate/support method | Provider ID/URL/date, corroboration, permitted construction source, CRS/method, limitation | Provider pin treated as coordinate authority | Provider evidence strengthens linkage but does not by itself authorize copying geometry or a pin. |
| Another equivalent documented method | Conditionally permitted | Evidence equivalent to R1–R4 | Pre-approve a deterministic, auditable rule satisfying R5–R10 | Complete source, rights, CRS, calculations, separated quantities, reviewer, limitation | Novel method conceals weaker evidence | Requires explicit method-level review before candidate use. |
| Provider result without identity linkage | Prohibited | — | No construction permitted | Record rejection reason | Name or proximity substitution | Fails R1–R2. |
| Visitor centre or entrance substituted for heritage feature | Prohibited | — | No construction under feature/general-vicinity meaning | Record rejection reason; use a truthful visitor/entrance route only if separately supported | Directs users to the wrong thing | A different spatial anchor requires its own controlled meaning and evidence. |
| Search-result viewport centre | Prohibited | — | No construction permitted | Record rejection reason | View state appears evidential | A viewport is not a feature or support-area coordinate. |
| Screenshot centre | Prohibited | — | No construction permitted; a separately approved georeferenced-map method is a different method | Record rejection reason | Pixels appear spatially authoritative | A screenshot centre has no inherent coordinate meaning. |
| Arbitrary map click | Prohibited | — | No construction permitted | Record rejection reason | Convenience presented as evidence | Not reproducible or evidence-based. |
| Whole-city or whole-county centroid | Prohibited | — | No fallback construction; an identity genuinely operating at that scale requires separate equivalent-method review | Record rejection or exceptional scale rationale | Administrative centre mistaken for heritage | Ordinarily fails usefulness and centre-implication tests. |
| Unbounded textual locality | Prohibited | — | No construction permitted | Record unresolved locality and evidence need | Marker creates false boundedness | Fails R3. |
| Large uncertainty attached to an undocumented coordinate | Prohibited | — | No construction permitted | Preserve rejection and missing method | Number conceals arbitrary origin or mixed concepts | Fails R5–R7. |

Commercial provider geometry and screenshots must not be copied into the
repository. Their evidence role remains subject to rights and provenance rules.

## Controlled outcomes for the later reassessment

Each identity must receive exactly one outcome:

| Outcome | Meaning |
| --- | --- |
| A — Generalized Point eligible for publication proposal | Every gate passes sufficiently. This is a research recommendation, not publication approval. |
| B — Potentially suitable; specific evidence or implementation requirement remains | The concept is defensible, but named evidence, presentation, schema, or approval requirements remain unresolved. |
| C — Generalized Point unsuitable; retain ordinary Point or future line/area route | A hollow diamond would misrepresent the identity or its natural spatial form. |
| D — Withhold pending evidence | Identity, locality, construction, sensitivity, usefulness, or misleading risk remains insufficient. |
| E — Already adequately represented | An active ordinary Point or other adequate representation exists; no hollow diamond is needed. |

## Current schema and implementation gap

The merged Phase 15C-1 validator and Phase 15C-2 renderer already recognize
`generalized-reference-point`, `geometryPrecision: generalized`,
`project-generalized-reference`, generalized marker styling, and a required
`horizontalUncertaintyMetres`. The legacy Point contract also carries
`estimatedUncertaintyMeters` and `generalizationRadiusMeters`.

Those fields cannot, as a controlled contract, independently express all of:

- source-coordinate uncertainty;
- transformation uncertainty and a multi-datum envelope;
- intentional rounding or displacement;
- the geometry/version of a supported locality or support area;
- the support-area radius or extent; and
- final coordinate precision and public limitation provenance.

The current `horizontalUncertaintyMetres` and `generalizationRadiusMeters`
must not be overloaded to hide those distinctions. Before any candidate is
published under this recalibration, a separately approved implementation must
define, validate, generate, render, and test the necessary metadata contract
and persistent popup/accessibility wording. The future contract may use new or
adapted fields only after schema review; this policy intentionally does not
name or add runtime fields.

## Effect on Phase 15C-16

The historical result remains:

> Under the policy applied during Phase 15C-16, 0 Generalized reference Points
> were eligible.

Phase 15C-16 correctly applied its then-controlling G1–G10 gate. This
recalibration does not retrospectively edit its evidence, two-candidate
shortlist, outcomes, or empty batch. No candidate automatically changes
outcome. Current eligibility can be determined only by the separate
whole-universe reassessment below.

## Required whole-universe reassessment and later result

The separate PR #76-equivalent audit is required to:

1. rescreen all 55 currently unpublished Xinyu identities, not only prior
   priority candidates;
2. give every identity exactly one A–E outcome;
3. deeply evaluate every identity passing the revised initial screen;
4. reconcile totals, duplicates, parent designations, and components;
5. treat Xieli and Qipanshan only as known historical priorities, not a
   predetermined shortlist;
6. propose a publication-review batch only from outcome A; and
7. publish nothing.

The reassessment does not assume how many candidates will qualify. Any later
implementation remains separately approved and must first close the schema and
presentation gap described above.

The draft
[Phase 15C-18 complete-universe reassessment](../audits/phase-15c-18-xinyu-generalized-point-reassessment.md)
documents that required work without changing this candidate-neutral policy.
It individually reassesses all 55 identities and records A/B/C/D/E
totals of `1/8/36/10/0`. P04 Xieli is evidence eligible for a separate
publication proposal; it is not publication approved, and no Generalized Point
was added to production. The Phase 15C-18 implementation-contract findings
provide candidate-specific input for the separately approved technical work
required below.

## Preserved safeguards and non-implementation boundary

This recalibration does not weaken official identity confirmation,
identity-to-locality linkage, sensitivity review, public transparency,
one-active-representation, accountable review, or separate publication
approval. It prohibits arbitrary coordinates, unverified pins, identity
substitution, unsupported city-scale approximation, undocumented CRS
assumptions, unexplained large uncertainty, photographs as coordinate proof,
and exact-location implications.

It changes no source data, GeoJSON, coordinate, existing uncertainty or
meaning, runtime schema, generator, validator, renderer, marker, symbol guide,
popup, control, filter, Open Data implementation, Community Heritage,
Firebase resource, workflow, deployment, or production record. It publishes
no Generalized Point, line, or area and begins no shape pilot.

## Limitations and unresolved questions

- Phase 15C-18 has now tested the gate across the complete 55-identity
  unpublished universe; its one Outcome A remains unimplemented and
  unpublished.
- The later schema design must decide how to serialize the distinct R7
  quantities without breaking the existing Point and mixed-geometry contracts.
- The later interface design must confirm that the existing hollow diamond,
  popup, and accessible presentation communicate the new general-vicinity
  meaning at relevant scales.
- Boundary versioning, reuse rights, geometry algorithms, and datum lists are
  candidate- and source-specific; the policy deliberately sets no universal
  distance or datum list.
- Evidence can change, so every decision needs a dated review and a named next
  approval.

## Rollback

Rollback is documentation-only: revert the Phase 15C-17 documentation commit
and restore the preceding Generalized reference Point gate as controlling.
No data regeneration, runtime rollback, Firebase action, or deployment is
required.
