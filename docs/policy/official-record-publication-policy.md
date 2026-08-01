# Official Heritage spatial representation and publication policy

## Status and authority

This document is the sole controlling current policy for deciding whether and
how an Official Heritage record or separately resolved official component may
be represented on the public map. It replaces the reusable policy portion of
the historical
[Phase 15C-6 batch-planning record](../plans/phase-15c-6-official-record-publication-policy-and-batch-plan.md)
and supersedes earlier proposals for simultaneous Point-and-shape publication.

This policy does not approve a record, coordinate, geometry, implementation
batch, migration, or publication. Each publication still requires
record-specific evidence review and explicit implementation approval.
Historical audits remain evidence and decision records; they do not override
this policy.

The controlling principle is:

> Heritage type suggests the natural spatial form, but evidence determines what
> can actually be published.

## Scope boundary

### Community Heritage remains unchanged

Community Heritage remains Point-based. This Official Heritage policy does not
alter:

- `communityPlaces`;
- public nominations;
- admin nomination review or promotion;
- existing community Point markers;
- community categories;
- Community Search and Filters;
- community place-detail pages; or
- public community export behaviour.

Community-drawn lines and polygons are outside this policy and the approved
public-map direction. Community Heritage retains its existing master control,
categories, and blue Point markers.

### Official Heritage only

The evidence-aware Point, generalized Point, line, and area policy applies only
to Official Heritage records derived from official government or institutional
heritage sources. Official records must remain separate from Community
Heritage in data, filtering, presentation, and public counts.

## Public Official Heritage types

The future public interface uses five simplified types:

1. Buildings & structures
2. Archaeological sites
3. Parks, gardens & landscapes
4. Routes & infrastructure
5. Other heritage

These values support public presentation and filtering. They must not overwrite
or replace the original official classification, category, terminology, or
source metadata. Empty public types should not appear in the future sidebar.
An unknown future type must safely fall back to **Other heritage** while its
original source classification is retained.

## Natural spatial form

The default direction by public type is:

| Public type | Default spatial direction |
| --- | --- |
| Buildings & structures | Normally Point. Building footprints are ordinarily unnecessary. |
| Archaeological sites | Reviewed or generalized Point unless defensible area evidence exists. |
| Parks, gardens & landscapes | Point while extent is unresolved; Polygon or MultiPolygon when a defensible extent exists. |
| Routes & infrastructure | Point while alignment is unresolved; LineString or MultiLineString when a defensible alignment exists. |
| Other heritage | Point by default; assess non-Point geometry individually. |

A record must not receive a Polygon merely because its category contains words
such as “site,” “park,” “landscape,” or “area.” Natural form guides research;
it is not publication evidence.

## One active public representation

Every official record or separately resolved official component has only one
active public representation at a time:

- Point;
- generalized Point;
- LineString;
- MultiLineString;
- Polygon; or
- MultiPolygon.

The operating rule is:

> One official record or separately resolved component identity equals one
> active public map feature.

A MultiPolygon or MultiLineString may be one feature representing one identity.
Separately named and independently resolved components may each have their own
record and feature, but a component must not masquerade as its parent, sibling,
or the whole designation.

The same identity must never have a simultaneous active public Point and shape.
If an approved line or area later communicates the record more appropriately:

1. the line or area becomes the active public representation;
2. the former Point becomes superseded;
3. the Point disappears from public map output; and
4. the Point remains only in provenance or representation history.

Superseded Points are not active features and must not appear in public map
totals.

## Publication outcomes

Every official record or separately resolved component receives one current
outcome at each review date.

### Point now

Publish a Point as the active representation when the feature is naturally
point-like or a defensible public reference location is the most honest current
representation.

Minimum threshold:

- official identity, category, and locality match;
- an explicit and defensible Point meaning;
- a reproducible numerical Point and recorded source/output CRS, obtained from
  a legitimate source coordinate or an approved documented project-digitization
  method;
- documented and tested deterministic conversion where required;
- WGS84 reconciliation with no serious unresolved mismatch;
- accepted uncertainty, sensitivity, and misleading risk; and
- public wording that explains what the Point does and does not mean.

### Point now, shape later

> Publish the Point as the active representation. If an approved line or area
> later communicates the record more appropriately, the new geometry
> supersedes the Point.

The Point must remain semantically honest. A component, visitor, entrance, or
generalized reference must not be described as a footprint, centroid, extent,
or legal boundary.

### Shape now

Publish one reproducible LineString, MultiLineString, Polygon, or MultiPolygon
as the active representation when its meaning and evidence are defensible and
a Point would communicate the identity less appropriately.

### Withhold

Withhold when identity, component assignment, location, extent, sensitivity,
access implications, rights, construction method, or misleading risk is
unacceptable. A null coordinate and a recorded evidence gap are a complete,
valid review result.

“Point + shape now” is not an approved operational outcome.

## Representation meanings

### Point meanings

| Meaning | Definition |
| --- | --- |
| `heritage-feature-point` | A reviewed Point on or immediately associated with the heritage feature; not automatically an exact centroid. |
| `component-reference-point` | A public reference associated with one separately resolved component. |
| `visitor-reference-point` | A visitor venue or arrival reference that may not coincide with protected fabric. |
| `entrance-reference-point` | A reviewed public entrance supported by entrance-specific evidence. |
| `generalized-reference-point` | A deliberately generalized public reference whose method, uncertainty, sensitivity, and styling have been approved. |

`protected-building-centroid` is not approved unless the protected building
footprint is positively identified and the centroid is reproducibly calculated
from that footprint.

### Line and area meanings

Possible narrow project-reviewed meanings include:

- `heritage-reference-line`;
- `interpreted-historic-route`;
- `project-reviewed-landscape-extent`;
- `interpreted-historic-extent`;
- `historical-reference-area`;
- `approximate-archaeological-area`;
- `visible-enclosure`; and
- `approximate-compound`.

The meaning must describe what the geometry actually communicates. A project
interpretation must not be described as an official legal boundary,
authority-supplied boundary, complete protected extent, or surveyed footprint
unless evidence genuinely supports that claim.

## Record authority and representation authority

Record identity authority and displayed-geometry authority are separate:

- `recordAuthority` records where the heritage identity and designation record
  originate;
- representation status or authority records where the displayed geometry
  originates.

Likely controlled representation statuses are:

- `official-record-reference`;
- `authority-supplied-geometry`; and
- `project-reviewed-interpretation`.

For example:

```json
{
  "recordAuthority": "official",
  "representationStatus": "project-reviewed-interpretation"
}
```

This means the heritage record is official but the geometry was constructed and
reviewed by the project. It must not imply that the registering authority
supplied, approved, or legally confirmed the geometry.

> Official heritage identity does not automatically make every associated
> geometry official.

These field names are policy-level schema direction only. They are not approved
runtime fields in this phase.

## Project-reviewed interpretations

Authority-supplied GIS is preferred, but it is not the only possible basis for
a future line or area. A project-reviewed interpretation may be considered
from:

- reliable official or institutional plans;
- legally reusable spatial datasets;
- georeferenced historical maps;
- archaeological, conservation, or landscape plans;
- documented field surveys;
- documented and reproducible tracing;
- reproducible textual spatial descriptions; or
- several independent sources whose evidence converges.

A project-reviewed interpretation must:

- have a narrow and explicit geometry meaning;
- identify every important source;
- record reuse rights or licence;
- record source and output coordinate reference systems;
- document conversion, georeferencing, or tracing methods;
- record uncertainty;
- record review status and date;
- pass sensitivity and misleading-boundary review;
- remain reproducible or auditable; and
- be visually and textually distinguished from authority-supplied geometry.

A provider Point of Interest may support a Point after corroboration. It does
not by itself support a footprint, compound, alignment, or legal boundary.

## Provider-located project-reviewed reference Points

A **provider-located project-reviewed reference Point** is a policy evidence
method for constructing a numerical Point when a mapped provider identifies a
specific heritage feature but does not expose a legitimate raw feature
coordinate. It is not a new GeoJSON type, `geometryMeaning`, runtime enum, or
lower publication threshold. The active representation remains a Point with an
existing controlled Point meaning and the policy-level representation status
`project-reviewed-interpretation`.

Legitimate provider-owned feature coordinates remain preferable when they are
available and their CRS and feature meaning can be established. Project
digitization is a controlled fallback, not permission to treat any visible pin,
viewport, highlighted area, or map centre as provider-supplied geometry.

### Three distinct decisions

The evidence record must keep these decisions separate:

1. **Feature identification:** determine whether the provider result identifies
   the exact official record or separately resolved component and a specific
   point-like physical feature.
2. **Numerical construction:** construct a reproducible WGS84 Point using one
   of the accepted methods below and record its complete coordinate chain.
3. **Publication approval:** separately review meaning, uncertainty,
   sensitivity, access implications, misleading risk, provenance, wording, and
   one-active-representation effects before publication.

Passing feature identification does not approve a coordinate. Constructing a
coordinate does not approve publication.

### Feature-identification and corroboration gate

The exact official identity, designation level, category, locality,
parent/component relationship, and intended public identity must first be
resolved. Useful provider evidence may include an exact or reconciled name,
feature-specific category and address, a stable provider identifier, provider
photographs showing the relevant plaque or distinctive physical fabric, and a
recorded access date.

A provider result is not feature-specific merely because it is near or named
after the same village, community, township, park, business, museum, visitor
complex, road, administrative area, or search viewport. Same-name and
parent/component confusion must be rejected or resolved explicitly.

Feature identification requires either:

- two genuinely useful independent mapped providers; or
- one strong mapped provider plus independent feature-specific official,
  institutional, archival, plaque, reliable photographic, documented field, or
  other maintained evidence.

Circular provider copies and sources that only repeat the same unverified claim
do not provide independent corroboration.

### Accepted numerical construction methods

After the feature-identification gate passes, a project-reviewed Point may be
constructed by:

- locating the same physical feature in a coordinate-aware provider
  environment with a known CRS and digitizing the Point there;
- reproducibly matching the provider feature to a suitable WGS84 reference
  basemap and digitizing the same feature;
- a documented field observation or survey; or
- another documented method that preserves the input reference, source and
  output CRS, construction steps, reviewer, and uncertainty.

The reproducibility record must identify the provider and stable feature
identifier or URL, access date, evidence used to establish the feature,
digitization environment and reference basemap, input and output CRS, original
and output coordinates at retained precision, every conversion or transfer
step, rounding, reviewer and review date, uncertainty rationale, and enough
detail for another reviewer to repeat the result.

The CRS chain must never be inferred silently. GCJ-02, BD-09, provider-owned
projected coordinates, Web Mercator display coordinates, and WGS84 must remain
distinct. Each transformation must identify its algorithm or tool and be
tested. A feature transferred between basemaps must record how corresponding
physical evidence was matched and what displacement or ambiguity remained.

### Prohibited coordinate substitutes

The following do not satisfy the numerical-construction gate:

- screenshot pixels or coordinates read from an image without a documented
  georeferencing method;
- guessed longitude/latitude values or undocumented map clicks;
- search-result, map, administrative-area, or URL viewport centres;
- Web Mercator or other display centres not asserted to be feature coordinates;
- centres of provider-highlighted areas, villages, communities, townships,
  parks, visitor complexes, parcels, or roads; and
- provider shapes whose feature identity, meaning, or reuse rights are
  unresolved.

### Meaning, provenance, uncertainty, and public wording

This evidence method must use an existing controlled Point meaning:
`heritage-feature-point`, `component-reference-point`,
`visitor-reference-point`, `entrance-reference-point`, or
`generalized-reference-point`. The method label does not create a new meaning
and must not turn a visitor or compound reference into a feature centroid,
footprint, protected extent, or legal boundary.

The representation is project-created even when the official record and
provider feature are genuine. Its policy-level representation status is
`project-reviewed-interpretation`; it must never be described as an
authority-supplied coordinate. Uncertainty must be specific to the evidence and
method, including provider placement, basemap transfer, identity ambiguity,
conversion, digitization, and rounding. There is no default or universally
"low" uncertainty for this method.

Sensitivity review must address archaeological or burial vulnerability,
private or restricted access, resident privacy, harm or theft risk, visitor
safety, and whether a generalized or withheld result is more appropriate.
Misleading-risk review must test the Point at public map scales and confirm that
its meaning and limitations remain clear.

Any future public presentation of this method must include wording equivalent
to:

> Project-reviewed reference location based on the official record,
> mapped-provider evidence, and documented project digitization. It is not an
> authority-supplied coordinate, surveyed heritage extent, or legal protection
> boundary.

That limitation must be available through the future popup or record detail,
accessible name or adjacent accessible description, provenance presentation,
and legend/help where the method is explained. This policy does not implement
those interface changes.

### Non-approving N07 example and shape boundary

The Phase 15C-11 N07 evidence is the motivating example. It establishes a
provider-located point-like physical candidate through cross-provider identity,
locality, and photographic agreement. It does not contain or approve a
numerical Point, CRS chain, uncertainty, sensitivity decision, misleading-risk
decision, or publication decision. Any later digitization and re-evaluation
must be separately approved work.

This clarification changes no shape-evidence rule. Provider-located Point
evidence does not support a building footprint, compound, route, alignment,
archaeological extent, surveyed extent, or legal boundary. If exceptional
replacement geometry is later independently justified and approved, it
supersedes the Point under the one-active-representation rule rather than
appearing simultaneously.

## Evidence, uncertainty, and rejection rules

A proposed line or area must be rejected, generalized, replaced by a Point, or
withheld when:

- official identity or component identity is unresolved;
- location is insufficiently resolved;
- geometry meaning is unclear;
- sources seriously conflict;
- source reuse is not permitted;
- the construction method cannot be documented;
- a source map cannot be georeferenced reliably;
- uncertainty exceeds the precision implied by the display;
- the feature is sensitive;
- the visual result is likely to be misunderstood as a precise official or
  legal boundary; or
- a caveat cannot overcome the visual impression created by the geometry.

Deterministic construction is necessary but not sufficient. The Xieli review
demonstrates that a reproducible shape must still be rejected when its visual
claim is misleading.

Additional requirements:

- record original coordinates, capture method, source CRS, conversion
  algorithm, output precision, and conversion tests;
- never relabel GCJ-02 or BD-09 values as WGS84;
- do not silently average coordinates;
- state whether uncertainty arises from datum, conversion, provider placement,
  identity, generalization, or extent;
- evaluate uncertainty against feature scale and visible map scale;
- perform explicit sensitivity review for archaeological, burial, vulnerable,
  access-limited, or harm-sensitive records; and
- do not infer geometry from an area total, offset rule, building outline,
  parcel, road, ditch, reservoir edge, basemap feature, or imagery feature that
  requires an unsupported identity assumption.

If styling, accessible wording, legends, and record details cannot prevent a
misleading visual claim, the geometry must not be published.

## Identity, revision, and history

- One official designation counts once at designation level.
- One separately named official component counts once at component level.
- A component must never substitute for its parent or sibling.
- `parentRecordId` and component identity should be explicit where applicable.
- A parent-level Point must not be inferred from one component.
- Search, filters, and visible-record counts operate on active
  record/component identity, not historical representation count.

Every representation change must preserve the stable identity, prior sources,
coordinates, conversions, review decision, and uncertainty. It must identify
the new active representation and mark the former one as superseded without
silently replacing history.

`activeRepresentation` and `representationHistory` are future schema concepts.
This policy does not add them to runtime records or authorize a migration.

## Future sidebar and filter direction

This direction is approved for later implementation, not this policy phase.

### Sidebar

**Community Heritage**

- existing master control;
- existing categories; and
- existing blue Point markers.

**Official Heritage**

- master Official Heritage control, initially off by default;
- Buildings & structures;
- Archaeological sites;
- Parks, gardens & landscapes;
- Routes & infrastructure; and
- Other heritage.

An optional future **Context layers** section may include administrative
boundaries, historical maps, project or study areas, and geographic context.
Contextual geometry must remain separate from record-specific geometry.

Do not provide public geometry-type checkboxes for Point, line, or Polygon.
Geometry is a representation method, not a public heritage category. Do not
make representation-status values primary public filter checkboxes initially.
Communicate provenance through styling, legends, popups, accessible
descriptions, and record details.

### Visibility and filter logic

An Official Heritage feature is visible only when:

```text
Official Heritage enabled
AND record published
AND active representation approved and valid
AND official heritage type selected
```

Multiple selected official types use OR logic. Different filter dimensions and
publication conditions use AND logic. Official filters affect only Official
Heritage; Community filters affect only Community Heritage. Official records
must not silently enter Community Search and Filters.

## Future audit fields

The next Xinyu re-audit should assess:

```text
naturalSpatialForm:
- point-like
- areal
- linear
- multipart
- uncertain
```

```text
futureNonPointRepresentation:
- unnecessary
- potentially useful
- evidence required
- unsuitable at present
```

These are audit concepts only in this phase. They must not be added to
production records or runtime schema yet.

## Cambridgeshire architectural lesson

The [Cambridgeshire Local Heritage List map](https://local-heritage-list.org.uk/cambridgeshire/map)
combines multiple spatial sources that may include local-list records, National
Heritage List for England data, council or Historic Environment Record GIS,
project or administrative boundaries, and basemap geometry. Its visible volume
of shapes does not prove that its public website manually drew every boundary
or establish the provenance of each individual feature.

The project should adopt the layered information architecture, not mechanically
copy shapes, datasets, or legal claims. In particular:

- seek existing authority GIS before project tracing;
- do not scrape public interactive maps as a substitute for source data;
- do not treat a visible basemap shape as heritage geometry;
- keep contextual geometry separate from record-specific geometry; and
- verify reuse rights and provenance before reuse.

Related references:

- [Exegesis Local Heritage List Platform](https://www.esdm.co.uk/local-heritage-list-platform)
- [Historic England open GIS downloads](https://historicengland.org.uk/listing/the-list/data-downloads/)
- [Historic England Map Search](https://historicengland.org.uk/listing/the-list/map-search)

The project does not claim to possess data equivalent to Cambridgeshire's.

## Approved roadmap and current stop point

The policy-to-production sequence is maintained in the
[Official Heritage mixed-geometry roadmap](../plans/official-heritage-mixed-geometry-roadmap.md).
Every implementation or publication step requires its own approval and
evidence. Later shape expansion is open-ended rather than guaranteed.

Current production remains exactly five Official Heritage Point features and
no real line or polygon features. PR #69's draft generated dataset adds only
Xiabu's `暴动举行地旧址` component as a sixth Point pending review, merge, and
deployment. The Xiabu parent and meeting-site component, Xieli, and all real
line or polygon features remain unpublished.

## Explicit non-implementation boundary

This policy phase does not change runtime schema, source data, generated
GeoJSON, map rendering, sidebar controls, Search or Filters, exports,
Firestore, rules, nominations, Community Heritage, or production. It does not
add empty coordinates, placeholder geometries, migrations, or real records.

## Related decision records

- [Phase 15C-3 initial geometry audit](../audits/phase-15c-3-first-real-official-geometry.md)
- [Phase 15C-4 historical mixed-geometry re-audit](../audits/phase-15c-4-xinyu-mixed-geometry-reaudit.md)
- [Phase 15C-5 Xiabu evidence pilot](../audits/phase-15c-5-xiabu-geometry-pilot.md)
- [Phase 15C-6 historical policy and batch-planning record](../plans/phase-15c-6-official-record-publication-policy-and-batch-plan.md)
- [Phase 15C-7 Xieli misleading-risk review](../audits/phase-15c-7-xieli-misleading-risk-review.md)
- [Phase 15C-12 provider-located Point policy clarification](../audits/phase-15c-12-provider-located-point-policy-clarification.md)
