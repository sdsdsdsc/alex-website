# Phase 15C-19 — Generalized reference Point contract implementation

## Decision and boundary

This phase implements the technical prerequisite defined by
[Phase 15C-17](../policy/phase-15c-17-generalized-point-policy-recalibration.md)
and identified by the
[Phase 15C-18 reassessment](./phase-15c-18-xinyu-generalized-point-reassessment.md).
It extends the existing Phase 15C-1 geometry validator, Phase 15C-2 renderer,
authority-neutral publication generator, popup, and accessibility helpers. It
does not create another geometry system.

The implementation publishes no candidate. P04 Xieli remains unpublished and
has no production decision or geometry. Production remains 17 source records,
seven ordinary Points, ten exclusions, zero Generalized reference Points, and
zero real lines or areas. A P04 publication proposal is the separately
approved PR #78 step; this phase neither begins nor authorizes it.

## Structured contract

A future Generalized reference Point must carry `generalizedPointContract` at
both the approved public-location decision and generated public Feature. The
contract version is `phase-15c-19-v1`.

| Field | Exact meaning |
| --- | --- |
| `contractVersion` | Controlled contract version. |
| `originalSpatialBasis` | Basis class, exact public-safe notation, source CRS/datum statement, construction basis, public evidence, and an optional restricted-evidence governance reference that never contains the restricted coordinate. |
| `sourceCoordinatePrecision` | Source precision/uncertainty kind, metres, and explanation; not transformation error, deliberate displacement, or support extent. |
| `datumInterpretations[]` | Finite accepted datum/CRS paths, each with rationale, transformation method, and independent frame allowance in metres. |
| `multiInterpretationEnvelope` | Applicability, deterministic envelope method, and maximum path separation in metres; the non-applicable form is explicit. |
| `supportArea` | Source-described meaning, shape, extent, maximum distance from the representative Point, and evidence; never relabelled as heritage or legal extent. |
| `representativePoint` | Predeclared deterministic selection method, version, and rule. |
| `intentionalGeneralization` | Rounding, gridding, displacement, or other deliberate method, displacement in metres, and explanation. |
| `displayedCoordinatePrecision` | Decimal places and approximate displayed resolution in metres. Output cannot be sharper than the declaration or the four-decimal ceiling. |
| `outwardCoverageMetres` | Public outward-coverage summary, covering the separately recorded support distance, source precision, maximum frame allowance, and intentional displacement. |
| `provenance` | Separate HTTPS/date references for the spatial basis and limitation policy. |
| `mandatoryPublicLimitation` | Exact controlled general limitation displayed for every Generalized reference Point. |
| `candidateSpecificLimitation` | Required additive candidate statement; it cannot replace or contradict the general limitation. |
| `review` | Evidence reviewer, valid date, `Phase 15C-17`, accountable publication role, and controlled publication decision. |
| `representation` | Identity ID, unique representation ID, active status, prior IDs superseded, and a supersession-history reference. |

Canonical values remain `geometryMeaning: generalized-reference-point`,
`geometrySourceType: project-generalized-reference`, `geometryPrecision:
generalized`, `markerClass: generalized`, and `representationStatus:
project-reviewed-interpretation`.

## Validation invariants

The same validator runs against generator input and generated GeoJSON. It
fails closed for missing structures, ordinary geometry semantics or source
type, unexplained datum paths, missing construction/support basis, non-HTTPS
provenance, invalid dates, non-finite or contradictory distances, overly sharp
display precision, missing or contradictory limitations, non-accountable
review, non-active representation, or self-supersession.

The publication validator also requires contract identity to match the record,
enforces one decision per identity and unique active representation IDs,
checks output precision, and rejects simultaneous active representations.
Candidate text cannot claim an exact feature, centre, entrance, extent, or
legal boundary. Existing ordinary Points and mixed geometry keep their current
paths and tested behavior.

## Legacy distance fields

For a structured Generalized reference Point,
`estimatedUncertaintyMeters`, `horizontalUncertaintyMetres`, and
`generalizationRadiusMeters` are compatibility outward-coverage summaries.
All three must equal `generalizedPointContract.outwardCoverageMetres`. They do
not replace source precision, frame allowance, the multi-interpretation
envelope, deliberate generalization, support extent, or display precision.
Contradictions fail. Their existing ordinary-Point behavior is unchanged.

## Generation, lifecycle, and evidence safety

The existing deterministic generator copies the validated public-safe
contract into the Feature, emits the controlled project values, and validates
the result before serialization. Stable sorted source order is unchanged. A
later approved replacement must record the former representation in history
and replace, not accompany, the active Point decision.

Restricted coordinates are never required in the repository. The optional
restricted reference contains only a reference ID, custodian, and access
status for controlled retention elsewhere.

## Popup and accessibility

The normal popup body persistently displays:

> Generalized reference location. This marker represents the documented
> general vicinity of the heritage record. It does not show the exact feature,
> centre, entrance, extent, or legal protection boundary.

The candidate limitation is a separate visible paragraph. The popup labels
source precision, maximum frame allowance, applicable multi-interpretation
envelope, intentional displacement, support distance, displayed precision,
and outward coverage separately. It identifies a project-reviewed
interpretation and uses safe DOM text.

The marker accessible name carries the controlled meaning, complete general
limitation, and candidate addition. The hollow diamond remains visually
distinct while text supplies the non-color distinction. Enter and Space open
the same persistent popup.

## Tests, preservation, and rollback

Synthetic tests use a non-Xinyu identity and no candidate coordinate. They
cover required fields independently, deterministic generation, decision and
Feature validation, lifecycle safeguards, popup/helper output, accessible
wording, hollow-diamond rendering, and keyboard activation.

This phase leaves filters, legend entries, category counts, Community
Heritage, Firebase, public-location source data, and both generated production
GeoJSON files unchanged. Rollback is one merge revert; no data migration is
needed because the contract is optional unless a Feature explicitly claims
`generalized-reference-point`. The ordered next step is separately approved
PR #78, not part of this phase.

Verification at the PR head records 92 passing focused schema, publication,
and map-helper tests; 44 passing browser tests; a passing complete `npm test`;
valid documentation links; and byte-for-byte current deterministic outputs.
The unchanged production hashes are:

- public-location decisions:
  `4f2cf6fa7bec2cc18249d6facaf343225f0b467e907250ba51cc64f750e8a6a4`;
- canonical Official Heritage GeoJSON:
  `fd5ea0c50b858eab90aad226027bf9f4914469783b741823285c9ddfbd8e665b`;
  and
- provincial compatibility GeoJSON:
  `f0140d2d841fc0b4694100e6841d6adf086d70e8e870014f3e3b8c7a17787625`.
