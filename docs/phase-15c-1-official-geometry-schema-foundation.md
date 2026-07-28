# Phase 15C-1 — Official Heritage Geometry Schema Foundation

## Scope and outcome

Phase 15C-1 is a schema, validation, generator, test, and documentation foundation for future official heritage geometry. It does not publish or render any new real geometry. The current aggregate remains fifteen official records, five published Point features, ten exclusions, zero errors, and `valid` status. The five production markers, their coordinates, public-location decisions, precision, uncertainty, and popup semantics are unchanged.

The publication validator now recognizes these GeoJSON geometry types:

- `Point`
- `LineString`
- `MultiLineString`
- `Polygon`
- `MultiPolygon`

`GeometryCollection` and every unlisted geometry type fail closed. Production Map rendering remains Point-only until separately approved PR 5B work. A valid non-Point publication therefore passes the publication-schema validator but is rejected by the production renderer capability gate with a controlled message; it cannot fall through to Leaflet's default rendering.

## Geometry meaning

`geometryMeaning` is project-owned controlled metadata. It is not inferred from geometry type alone.

| Geometry family | Allowed meanings | Presentation meaning |
| --- | --- | --- |
| `Point` | `reviewed-location-point` | Reviewed project location |
| `Point` | `visitor-reference-point` | Visitor reference point |
| `Point` | `compound-reference-point` | Compound reference point |
| `Point` | `approximate-site-point` | Approximate site location |
| `Point` | `generalized-reference-point` | Generalized project reference point |
| `LineString`, `MultiLineString` | `reviewed-line` | Reviewed line |
| `LineString`, `MultiLineString` | `approximate-line` | Approximate line |
| `Polygon`, `MultiPolygon` | `reviewed-boundary` | Reviewed boundary supported by an explicit publication decision |
| `Polygon`, `MultiPolygon` | `approximate-boundary` | Approximate boundary |
| `Polygon`, `MultiPolygon` | `generalized-reference-area` | Generalized project reference area |
| `Polygon`, `MultiPolygon` | `uncertainty-area` | Area communicating spatial uncertainty |

The compatibility matrix is enforced explicitly. A Point cannot use a line or area meaning; a line cannot use a Point or area meaning; and a polygon or multipolygon cannot use a Point or line meaning. `MultiLineString` is line-compatible, and `MultiPolygon` is area-compatible.

`reviewed-boundary` does not mean a legal, cadastral, ownership, or official designation boundary. It is allowed only where a separately reviewed publication decision supports that meaning. Project-created areas must be described as project reference geometry. `uncertainty-area` communicates uncertainty rather than ownership or designation extent.

## Geometry provenance

Future explicit geometry metadata uses:

- `geometrySourceType`
- `geometrySourceLabel`
- `geometrySourceUrl`
- `geometryReviewedAt`
- `geometryReviewNotes`

Controlled `geometrySourceType` values are:

- `official-published-geometry`
- `official-map-reference`
- `institutional-map-reference`
- `provider-map-reference`
- `project-reviewed-digitization`
- `project-generalized-reference`

For explicit geometry metadata, source type and a non-empty source label are required. A source URL, when present, must be a valid HTTPS URL under the existing safe-URL rule. A review date, when present, must be a real ISO `YYYY-MM-DD` date. Project-created geometry requires non-empty review notes so its project provenance and limitations cannot be silently omitted.

An official source reference and a project-created geometry are distinct. `project-reviewed-digitization` and `project-generalized-reference` never become official boundaries merely because an official record is associated with them.

## Precision and uncertainty

`geometryPrecision` has four controlled values:

- `reviewed`
- `approximate`
- `generalized`
- `uncertain`

`horizontalUncertaintyMetres`, when present, must be a finite non-negative number. It is required for explicit `approximate`, `generalized`, and `uncertain` geometry. Explicit reviewed geometry may omit it. Meaning-specific compatibility also applies:

- reviewed location, line, and boundary meanings require `reviewed`;
- approximate site, line, and boundary meanings require `approximate`;
- generalized reference Point or area meanings require `generalized`;
- uncertainty areas require `uncertain`.

Visitor and compound reference Points may be reviewed or approximate according to their separately approved publication decision.

The existing five Points keep their established `locationPrecision` and `estimatedUncertaintyMeters` values. No new fields or invented uncertainty values are serialized into current features.

## Coordinate and structure validation

All positions must contain exactly two finite numbers in GeoJSON longitude-latitude order. Longitude must be between -180 and 180; latitude must be between -90 and 90.

- A `LineString` requires at least two positions.
- A `MultiLineString` requires at least one valid, non-empty LineString.
- A `Polygon` requires at least one linear ring.
- Every ring requires at least four positions and identical first and last positions.
- A `MultiPolygon` requires at least one valid, non-empty Polygon.

Strings, `null`, `NaN`, infinity, malformed nesting, empty child arrays, unsupported types, and `GeometryCollection` are rejected. Collection validation is atomic: any invalid feature rejects the complete collection, and no valid subset is returned.

This phase validates coordinate structure and ranges only. It does not claim topological validity, self-intersection detection, winding-order correctness, containment of interior rings, or network connectivity. No robust computational-geometry dependency is currently present, and none was added.

## Backward compatibility and schema version

The aggregate remains schema version `2.0.0`. No version bump is needed because this is a backward-compatible validator and optional-metadata extension:

- existing Point features remain valid without fabricated geometry provenance fields;
- legacy Point meaning is derived only for validation and presentation-helper compatibility;
- current serialized GeoJSON remains byte-for-byte unchanged;
- future non-Point features must supply the new explicit meaning, provenance, precision, and uncertainty contract.

The generator now runs the shared geometry foundation against every emitted feature. It still builds only the currently approved Points from the existing public-location decisions.

## Browser capability boundary

Two browser-side capabilities are deliberately separate:

1. `validateProvincialHeritagePublicationGeoJson` recognizes and validates all five supported geometry types and their metadata.
2. `validateProvincialHeritageGeoJson`, used by the production Map, adds a Point-only renderer gate.

This boundary provides future schema readiness without enabling accidental non-Point display. PR 5B must define intentional line and area rendering, styling, interaction, accessible activation, category behavior, and browser regression coverage before the production gate can change.

Pure presentation helpers provide controlled labels for future geometry meanings, including “Reviewed line,” “Approximate line,” “Reviewed boundary,” “Approximate boundary,” “Generalized project reference area,” and “Uncertainty area.” These labels are not wired into production rendering in this phase and do not claim a legal boundary, cadastral extent, or exact designation extent.

## Rollback and maintenance

Rollback is limited to removing the shared geometry module, its generator/browser validation calls, focused tests, and this documentation. Current data and generated GeoJSON do not require migration or regeneration because their bytes are unchanged.

If a future feature needs non-Point publication:

1. record an explicit publication decision and geometry meaning;
2. record controlled provenance, precision, and uncertainty;
3. pass atomic publication validation;
4. complete separately approved PR 5B renderer work; and
5. verify that public wording does not overstate legal or official extent.

Phase 15C-1 does not approve any candidate geometry or begin PR 5B.
