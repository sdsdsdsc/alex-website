# Phase 15B-1 — generalized official heritage Map marker model and Xinyu pilot

## Status

The implementation is committed on the feature branch and draft PR #52 is open for review. It has not been merged or deployed, and production remains unchanged.

## Purpose and boundary

Phase 15B-1 adds a separate reviewed public-location decision layer for official protected heritage records. It does not reinterpret the Phase 14 coordinate outcomes and does not add coordinates to the protected ten-record canonical dataset. The Map still loads the official overlay only after a visitor enables it, and a malformed or unapproved aggregate fails closed without affecting community markers.

The model distinguishes:

- a reviewed site, compound, entrance or visitor reference with High or Medium site-location confidence; and
- a generalized locality or area reference with High or Medium confidence that the point represents the stated public reference.

Low or None site-location confidence never becomes a site Point. Renderability is derived by validation and is not stored as an author-controlled flag.

## Initial bounded marker set

| Record | Official source | Displayed marker | Meaning | Public coordinate |
| --- | --- | --- | --- | --- |
| JX-XY-PCH-001 / 新余孔庙 | 新余市文化广电旅游局, *新余市市级以上文物保护单位名录（2025年）* | Reviewed approximate compound reference; filled diamond | Approximate centre of the confirmed heritage compound, not an exact building, designation coordinate or legal boundary | WGS84 `[114.937042, 27.798123]`, estimated uncertainty 75 metres |

The Xinyu source-table sequence `9` is preserved only as `sourceSequence`; it is not presented as a formal provincial designation number.

飨褒堂 is not included. The current evidence does not independently establish a defensible WGS84 locality reference and generalization radius that can be published without implying a site location. It may be reconsidered only through a new reviewed decision that passes every generalized-reference gate.

## Coordinate provenance and reconciliation

The selected 新余孔庙 public point is the WGS84 reference for the named OpenStreetMap compound geometry. The official Xinyu list establishes identity and locality; Xinyu Museum describes the compound; Google Maps and satellite imagery provide provider comparison; and the named OpenStreetMap geometry supplies the WGS84 compound reference.

The raw mainland Google POI coordinate is retained only as provider evidence with its project-assessed GCJ-02 CRS. It is not copied into GeoJSON or relabelled as WGS84. The comparison used a documented GCJ-02-to-WGS84 reconciliation and the selected public point remains the independently identified OpenStreetMap WGS84 reference.

## Data architecture

- `data/jiangxi-provincial-heritage-pilot.json` and its generated valid-empty GeoJSON remain unchanged.
- `data/xinyu-provincial-heritage-marker-pilot.json` holds the separately sourced official Xinyu facts.
- `data/official-protected-heritage-public-locations.json` holds reviewed location decisions and evidence.
- `data/jiangxi-provincial-protected-heritage-map.geojson` is the deterministic public-safe aggregate.

The aggregate joins eleven official records: ten protected Phase 14 records and one Xinyu companion record. It publishes one feature, excludes ten records without approved public-location decisions, and has generation status `valid`.

The public GeoJSON excludes provider coordinates, rejected candidates, research notes, reviewer-only evidence, restricted coordinates and administration fields.

## Validation gates

All published decisions require confirmed identity, WGS84 output, High or Medium display-location evidence, a positive uncertainty, public-permitted sensitivity, project approval and evidence beyond a provider pin. Reviewed non-generalized references additionally require High or Medium site-location confidence. Generalized references require compatible meaning and policy, a positive generalization radius and a public explanation.

The validator rejects unknown or duplicate IDs, incompatible vocabulary, GCJ-02 or BD-09 output, misleading precision, withheld or unresolved decisions, provider-only evidence and parent Points for the protected dispersed multi-component designations. A single invalid decision or feature rejects the complete overlay.

The evidence model supports future strong Gaode POIs while preserving the original POI name, URL, meaning, GCJ-02 coordinate, CRS status and reconciliation method. A Gaode POI remains project evidence rather than an official designation coordinate.

## Map and accessibility behavior

The existing **Provincial protected heritage pilot** overlay remains disabled by default, lazy-loaded, cached for the page session, isolated from community records and unable to change the map view. The existing Info panel explains:

- blue pin — community heritage record;
- filled diamond — reviewed official location;
- hollow diamond with a bar — generalized official reference, not a precise heritage site.

It also states that official locations are project-produced references rather than official designation coordinates or legal boundaries. A compact live status above the Map reports visible community and provincial counts without a permanent legend block. Markers have semantic accessible names that state their location meaning, work with keyboard activation and retain visible focus. Chinese text uses `lang="zh-Hans"`. Popups separate official Chinese facts, project English interpretation, displayed-location meaning, uncertainty, official source and project location provenance. Loading and success announcements are polite; complete-layer failures use an alert.

## Verification and rollback

Verification covers deterministic generation, stale output, controlled vocabulary, exact keys, provenance joins, confidence and sensitivity gates, coordinate order, uncertainty, generalized radius, mixed marker classes, atomic rejection, marker names, popup disclaimers, Chinese language markup, compact status and Info-panel explanations, default-off lazy loading, unchanged community bounds, keyboard use, responsive layouts and application-owned console errors.

Rollback is bounded to the Phase 15B-1 additions and the Map overlay integration. Removing the aggregate URL and its display changes restores the Phase 14 valid-empty overlay behavior without changing Phase 14 data, community records, Firebase or deployment configuration.

## Deferred work

City-, county- and national-level expansion; a public non-map list; broad automatic geocoding; marker-density expansion; and any additional official marker remain separately approved future work.
