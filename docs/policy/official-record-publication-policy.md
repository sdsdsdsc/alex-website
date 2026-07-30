# Official-record publication policy

## Status and authority

This document is the controlling current policy for deciding whether and how an
official heritage record or named component may be represented on the public
map. It replaces the reusable policy portion of the historical
[Phase 15C-6 batch-planning record](../plans/phase-15c-6-official-record-publication-policy-and-batch-plan.md).

The policy does not approve any record, coordinate, geometry, implementation
batch, or publication. Each decision still requires record-specific evidence
review and explicit implementation approval. Historical audits remain evidence
and decision records; they do not override this policy.

## Publication outcomes

Every designation or separately named official component receives exactly one
primary outcome at each review date.

### Point now

Publish one Point when the heritage feature is naturally point-like, or when a
credible public reference location is the only useful representation and a
future shape would not add a distinct heritage meaning.

Minimum threshold:

- official identity, category, and locality match;
- an explicit and defensible Point meaning;
- a reproducible source coordinate and recorded source CRS;
- documented and tested deterministic conversion where required;
- WGS84 reconciliation with no serious unresolved mismatch;
- accepted uncertainty, sensitivity, and misleading risk;
- public wording that explains what the Point does and does not mean.

### Point now, shape later

Publish one Point when a credible location is available but the heritage record
is naturally linear, areal, multipart, or compound and stronger evidence may
later support a line, area, or Point plus shape.

The Point must remain semantically honest. A component, visitor, or entrance
reference must not be described as a footprint, centroid, or legal boundary.

### Shape now

Publish one reproducible LineString, MultiLineString, Polygon, or MultiPolygon
when the shape is defensible and a separate Point would add no distinct meaning.

The shape may be authority supplied or project created. Project-created
geometry must:

- follow a reproducible source rule or georeferenced evidence;
- state its precision, source, construction method, review date, and uncertainty;
- avoid legal-boundary claims unless authority-supplied evidence supports them;
- carry an explicit project-geometry caution;
- be withheld when uncertainty makes the rendered shape more misleading than useful.

### Point + shape now

Publish both only when each representation is independently defensible and
communicates a different meaning, such as an entrance plus site extent, a
memorial plus battlefield area, or a surviving structure plus a wider compound.

Two representations do not create two official records. Both must resolve to
the same record or component identity.

### Withhold

Withhold when identity, component assignment, coordinate, extent, sensitivity,
access implications, or misleading risk remains unacceptable. A null
coordinate and a recorded evidence gap are a complete, valid review result.

## Representation meanings and evidence thresholds

### Point meanings

| Meaning | Definition | Minimum evidence |
| --- | --- | --- |
| `heritage-feature-point` | A reviewed Point on or immediately associated with the heritage feature. It is not automatically an exact centroid. | Strong record identity, feature-specific location evidence, reconciled WGS84 coordinate, and uncertainty appropriate to the feature scale. |
| `component-reference-point` | A public reference associated with one named component of a multipart designation. | Official component identity, evidence directly linking the location to that component, and no substitution for the parent or another component. |
| `visitor-reference-point` | A public-facing venue or arrival reference associated with the record; it may not coincide with protected fabric. | Official identity and locality plus a visitor venue, POI, entrance, museum, or interpretation relationship; public wording separates venue and fabric. |
| `entrance-reference-point` | A reviewed public entrance or access point. | Entrance-specific evidence such as an authoritative visitor map, identified gate, or independently corroborated entrance POI. |
| `generalized-reference-point` | A deliberately generalized public reference used when a more precise point should not be published or cannot be supported. | Defensible source location, justified generalization method and uncertainty, public explanation, sensitivity approval, and styling that does not imply surveyed precision. |

`protected-building-centroid` is not approved unless the protected building
footprint is positively identified and a reproducible centroid is calculated
from that footprint.

### Line meanings

| Meaning | Definition | Minimum evidence |
| --- | --- | --- |
| `approximate-line` | A project approximation of a short physical alignment. | Identified endpoints or centreline evidence, source scale and CRS, reproducible construction, and uncertainty small enough for the line to remain useful. |
| `heritage-reference-line` | A reviewed alignment communicating a heritage route or feature without claiming a legal line. | Institutional or official alignment evidence, georeferenced control, provenance, uncertainty, and explicit non-boundary wording. |

### Area meanings

| Meaning | Definition | Minimum evidence |
| --- | --- | --- |
| `approximate-site-footprint` | A project approximation of a feature or site footprint. | Positive identification of feature edges in georeferenced evidence and reproducible tracing; area totals alone are insufficient. |
| `approximate-compound` | A project approximation of a known heritage compound. | Compound identity and perimeter evidence distinct from a single building or surrounding parcel, with source scale and uncertainty. |
| `generalized-reference-area` | A deliberately simplified area indicating where an extensive or uncertain record is situated. | Source-derived centre or extent, or a reproducible generalization rule; sensitivity approval and prominent non-boundary wording. |
| `uncertainty-area` | An area expressing positional uncertainty rather than heritage extent. | A documented uncertainty model and presentation that cannot reasonably be mistaken for feature extent or a legal boundary. |
| `reviewed-boundary` | An authority-supplied or authority-confirmed boundary reproduced without substantive reinterpretation. | Authority-supplied vertices or GIS, explicit CRS, provenance, public-use basis, and deterministic transformation where required. |

A provider POI may support a Point after corroboration. It does not by itself
support a footprint, compound, alignment, or legal boundary. Imagery may be
traced only when independent evidence identifies the visible feature as the
official record and the method is reproducible.

## Point-versus-shape decision rules

1. If official record or component identity is unresolved, **Withhold**.
2. If exact public display is sensitive, unsafe, or likely to enable harm, test
   a justified generalized reference; otherwise **Withhold**.
3. If no reproducible source-supported shape exists, test a Point.
4. If a defensible shape exists, decide whether it communicates the complete
   useful meaning or whether a separately meaningful Point also exists.
5. Use **Point now** when only the Point has a complete durable meaning.
6. Use **Point now, shape later** when the Point is defensible and a distinct or
   replacement shape may become useful after stronger evidence.
7. Use **Shape now** when the shape is defensible and a Point adds no distinct meaning.
8. Use **Point + shape now** only when both meanings are independently defensible.
9. If the representation would look more exact than its evidence, generalize,
   increase or disclose uncertainty, downgrade the claim, or withhold.
10. Do not construct geometry from an area total, offset rule, building outline,
    parcel, road, ditch, reservoir edge, or imagery feature that requires an
    unsupported identity assumption.

## Provenance and coordinate requirements

Every publication decision must preserve:

- official name, category, locality, designation/component relationship, and source;
- institutional description or another independent identity check;
- provider evidence where useful, including stable identifiers and URLs;
- photographs or imagery and the exact proposition they do or do not establish;
- original coordinate, capture method, source CRS, conversion algorithm,
  output precision, and conversion test;
- provider-to-provider WGS84 comparison, pairwise distances, cluster spread,
  possible semantic displacement, and coordinate-selection rationale;
- shape construction steps, source scale and CRS, and reproducibility;
- review date, reviewer decision, uncertainty, sensitivity, access implications,
  and misleading-risk assessment.

GCJ-02 and BD-09 values must never be relabelled as WGS84. Baidu Web Mercator
display values are not longitude and latitude and require proper decoding plus
evidence that they describe the POI rather than the map display centre.

Coordinates must not be silently averaged. Averaging is allowed only when all
inputs represent the same semantic point, have comparable quality, and a
documented estimator and uncertainty model justify the result.

## Uncertainty, sensitivity, and misleading risk

- `horizontalUncertaintyMetres` must describe the selected public
  representation, not an unsupported claim of statistical confidence.
- The source of uncertainty—datum, conversion, provider placement, feature
  identity, generalization, or extent—must be stated.
- Uncertainty must be evaluated relative to feature size and visible map scale.
- Archaeological, burial, vulnerable, access-limited, or harm-sensitive records
  require explicit public-location approval.
- Existing public coordinates do not automatically resolve republication risk.
- Styling, accessible names, legends, and popup text must preserve the geometry
  meaning and uncertainty without relying on a secondary click.
- A project shape must not resemble a surveyed footprint or legal protection
  boundary more strongly than its evidence allows.
- If caveats cannot counter the map's visual implication, the representation
  must be generalized, changed to a Point, or withheld.

## Upgrade and revision rules

Allowed transitions include:

- Point now → Point + shape now;
- Point now → Shape now when the shape supersedes the Point's meaning;
- Point now, shape later → Point + shape now;
- Point now, shape later → Shape now when the shape supersedes the Point;
- Withhold → Point now or Point now, shape later;
- Withhold → Shape now;
- Shape now → revised Shape now after stronger evidence.

Every revision must:

1. retain the stable official record and component identity;
2. preserve prior provenance and review history;
3. add the new representation as a reviewed revision;
4. explain whether the former representation is retained, deprecated, or superseded;
5. avoid silent coordinate or geometry replacement;
6. preserve earlier source coordinates and conversions when provider data changes.

## Record identity, counting, and parent/component rules

- One official designation counts once at designation level.
- One separately named official component counts once at component level.
- Multiple representations do not increase either count.
- Search, filters, and visible-record counts operate on record/component
  identity, not raw feature count.
- Every representation of one identity opens the same record information.
- A component must never masquerade as its parent designation or another component.
- `parentRecordId` and component identity must be explicit where applicable.
- A parent-level Point must not be inferred from one component.
- Point plus shape for one component still counts as one component.
- Interfaces may report both official records visible and map representations
  visible when those totals differ.

## Current schema limitations

The current geometry vocabulary and renderer support Point, line, and area
geometry with provenance, precision, uncertainty, and project-geometry
cautions. The current publication pipeline does not cleanly support multiple
representations of one record:

- public-location decisions are uniquely keyed by `recordId`;
- the generator emits one Point feature per decision;
- GeoJSON feature identity equals `recordId`;
- duplicate feature IDs are rejected;
- aggregate counts assume one feature equals one record.

The existing five official Point records require no migration until a second
representation is proposed.

### Smallest future representation-model extension

If a separately approved record needs more than one representation:

1. retain `recordId` as the stable record/component identity;
2. add stable `representationId` and `representationRole`;
3. allow a decision to contain a `representations` array, or allow multiple
   reviewed geometry decisions sharing `recordId`;
4. use `representationId` as GeoJSON `feature.id`, retaining shared
   `properties.recordId`;
5. add `parentRecordId` and `componentId` only for real parent/component relationships;
6. record `recordCount`, `representationCount`, and `excludedRecordCount` separately;
7. deduplicate search, filters, visible-record counts, and popup identity by `recordId`;
8. require independently different meanings for Point + shape publication.

This extension is a policy requirement, not implementation approval.

## Related decision records

- [Phase 15C-3 initial geometry audit](../audits/phase-15c-3-first-real-official-geometry.md)
- [Phase 15C-4 mixed-geometry re-audit](../audits/phase-15c-4-xinyu-mixed-geometry-reaudit.md)
- [Phase 15C-5 Xiabu evidence pilot](../audits/phase-15c-5-xiabu-geometry-pilot.md)
- [Phase 15C-6 historical policy and batch-planning record](../plans/phase-15c-6-official-record-publication-policy-and-batch-plan.md)
- [Phase 15C-7 Xieli misleading-risk review](../audits/phase-15c-7-xieli-misleading-risk-review.md)
