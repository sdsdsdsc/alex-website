# Phase 14D and 14E — Provincial heritage machine data and GeoJSON

## 1. Status and scope

This document records the approved implementation draft for Phase 14D machine data and Phase 14E deterministic GeoJSON generation for the ten-record Jiangxi provincial protected heritage pilot.

The implementation creates:

- one canonical runtime-safe JSON dataset containing all ten official-reference records;
- dependency-free validation and generation tooling;
- one committed GeoJSON `FeatureCollection`;
- automated parity, safety, geometry-gate, and stale-output tests.

The current GeoJSON deliberately contains zero features. All ten coordinate-review outcomes are non-renderable and use publication policy `withheld`. A valid empty layer is the correct implementation result.

This phase does not create Map loading, Leaflet controls, public-page display, Firebase records, `communityPlaces` records, nomination behavior, public export inclusion, deployment logic, or production behavior.

## 2. Canonical files

The authored canonical dataset is:

```text
data/jiangxi-provincial-heritage-pilot.json
```

The generated output is:

```text
data/jiangxi-provincial-heritage-pilot.geojson
```

The JSON dataset is the only file in which an approved machine-data record may be changed. The GeoJSON is generated from it and must never be hand-edited.

Both files are committed because the site is a static GitHub Pages project. Committing the output makes a future same-origin loader possible, while deterministic regeneration and byte comparison prevent the committed file from becoming an independent source of truth.

## 3. Provenance boundary

The dataset keeps three source layers visibly separate.

### Official Chinese facts

The `official` object contains the Phase 14A transcription:

- official list number;
- official Chinese name;
- protection level and batch;
- designation date;
- official category and period;
- complete official Chinese location text;
- official remarks, including literal `null` where the source cell is blank.

The common `provenance.officialSource` object identifies 江西省人民政府 as the issuing authority and 南昌县供销社 as the republication host. These roles are not interchangeable. The source document number remains recorded with verification status `pending`.

The official notice did not supply coordinates, geometry, project English, or structured administrative fields.

### Project interpretation

The `projectInterpretation` object contains the Phase 14B project-produced values:

- project pinyin;
- project English name, protection level, category, period, location, and remarks;
- translation status and note;
- project-derived structured Chinese administrative location;
- descriptive component arrays;
- structured-location status and note.

The field is `projectNameEn`, not `officialNameEn`. A reviewed project translation is not an official Jiangxi-government English name.

### Project coordinate review

The `coordinateReview` object contains only the approved Phase 14C decision fields. It does not include candidates, evidence quotations, rejected coordinates, research notes, screenshots, restricted evidence, or private material.

Coordinates and future generated geometry are Alex's Photo Board project research. They must never be labelled as coordinates or GIS data supplied by the official notice.

## 4. Record and component contract

The dataset contains exactly ten records in fixed `recordId` order from `JX-PCH-7-001` through `JX-PCH-7-010`.

Every record contains exactly:

- `recordId`;
- `official`;
- `projectInterpretation`;
- `coordinateReview`.

Unknown approved coordinate values remain explicit `null`; they are not omitted or replaced with administrative centres.

Records 004 and 006 remain one parent designation each:

- `JX-PCH-7-004` contains four descriptive components;
- `JX-PCH-7-006` contains three descriptive components.

Each component contains only `nameZh` and `nameEn`. Components have no ID, record type, designation status, coordinate, geometry, child record, centroid, or representative parent point. All other records use an empty component array.

## 5. Current coordinate outcome

The canonical dataset preserves:

- five `reviewed` / `Low` / `broad-locality-only` outcomes;
- five `unresolved` / `None` / `unresolved` outcomes;
- zero High outcomes;
- zero Medium outcomes;
- zero approved numeric coordinates;
- zero selected candidates;
- zero renderable records;
- ten `withheld` publication policies.

For all ten records:

- `approvedLatitude` is `null`;
- `approvedLongitude` is `null`;
- `coordinateReferenceSystem` is `null`;
- `estimatedUncertaintyMeters` is `null`;
- `renderable` is `false`;
- `sensitivityAssessment` is `not-assessed`;
- `selectedCandidateId` is `null`;
- `coordinateReviewedBy` is `project owner`;
- `coordinateReviewDate` is `2026-07-23`;
- `coordinateReviewStatus` is `approved`.

## 6. Validation architecture

The dependency-free Node 20 module `scripts/lib/provincial-heritage-data.mjs` owns:

- top-level and record-shape validation;
- required field and explicit-null validation;
- controlled vocabularies;
- HTTPS URL and ISO date validation;
- exact record count, IDs, uniqueness, and ordering;
- protected Phase 14A, 14B, and 14C parity;
- descriptive-component restrictions;
- prohibited runtime-field detection;
- coordinate pairing, finiteness, range, and WGS84 checks;
- sensitivity and publication-policy gates;
- Point compatibility;
- geometry eligibility;
- deterministic GeoJSON generation and serialization.

`scripts/validate-provincial-heritage-data.mjs` validates without writing. Generation cannot bypass validation.

Approved non-spatial states are expected exclusions and do not fail generation. Malformed or contradictory records are hard errors and stop generation.

## 7. Expected exclusions and hard errors

Expected exclusion reasons include:

- unresolved research;
- Low or None confidence;
- non-renderable status;
- withheld publication;
- missing approved coordinates;
- missing WGS84 coordinate reference;
- missing selected candidate;
- sensitivity not approved for publication;
- incompatibility with the current Point contract.

Hard errors include:

- wrong structure, count, ID, uniqueness, order, or protected-source parity;
- omitted required fields or required nulls;
- unknown controlled vocabulary values;
- incomplete, non-finite, out-of-range, or non-WGS84 coordinates;
- Low, None, or unresolved geometry;
- renderability without High or Medium confidence;
- renderability while withheld or restricted;
- renderability without a selected candidate;
- Point geometry for records 004 or 006;
- child or component pseudo-records;
- component coordinates or geometry;
- inclusion of the rejected Phase 14C candidate;
- restricted exact coordinates;
- evidence, research-note, nomination, admin, or private fields;
- stale committed GeoJSON.

## 8. Geometry gates and generated properties

A record can become a GeoJSON Point only when every approved gate passes:

- research is `reviewed`;
- confidence is High or Medium;
- `renderable` is `true`;
- publication policy is `exact`, `approximate`, or `generalized`;
- approved latitude and longitude are finite and in range;
- the coordinate reference system is WGS84;
- sensitivity permits public publication;
- a selected candidate ID is present;
- the parent record is compatible with the Point contract.

Geometry uses RFC 7946 order:

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

Latitude and longitude are not duplicated in feature properties. `recordId` is used as both the feature ID and `properties.recordId`.

`approximateLocation` is `false` only for an exact approved public point. It is `true` for Medium, approximate, and generalized output.

## 9. Generation and stale-output protection

Generate the committed GeoJSON with:

```text
npm run generate:provincial-heritage
```

Validate without writing:

```text
npm run validate:provincial-heritage
```

Check that the committed output is current:

```text
npm run check:provincial-heritage
```

Generation uses fixed record ordering, two-space indentation, one final newline, and no timestamps, random values, or environment-specific metadata. `--check` regenerates in memory and compares the exact bytes with the committed file.

The focused Node tests also compare the generated bytes with the committed file and exercise synthetic High, Medium, malformed, contradictory, and stale-output cases without modifying the canonical records.

## 10. Expected zero-feature result

The approved output is:

```json
{
  "type": "FeatureCollection",
  "metadata": {
    "schemaVersion": "1.0.0",
    "datasetId": "jiangxi-provincial-protected-heritage-pilot",
    "sourceDataset": "data/jiangxi-provincial-heritage-pilot.json",
    "sourceRecordCount": 10,
    "featureCount": 0,
    "excludedRecordCount": 10,
    "generationStatus": "valid-empty",
    "geometryProvenance": "Alex's Photo Board project coordinate review"
  },
  "features": []
}
```

The generator omits non-renderable records. It does not produce features whose geometry is `null`.

The metadata allows a future loader to distinguish a successfully loaded and validated empty layer from an HTTP, parsing, validation, or loading failure. That future loader is outside this phase.

## 11. Future coordinate promotion

A future coordinate decision must be separately researched and approved under the Phase 14C policy. Promotion then requires:

1. updating only the canonical JSON with the approved public-safe decision;
2. passing the complete validator;
3. regenerating GeoJSON;
4. reviewing the resulting Point and public properties;
5. passing focused and full regression tests;
6. obtaining separate approval for any Map or public-page integration.

No candidate enters machine data automatically, and GeoJSON is never hand-edited.

## 12. Rollback and integration boundary

Rollback requires reverting the canonical data, generator, validator, generated GeoJSON, focused tests, package scripts, and this documentation together. There is:

- no Firebase migration or rollback;
- no Firestore or Storage rules rollback;
- no index rollback;
- no production-record change;
- no Map or Leaflet rollback;
- no `heritage.json` export rollback;
- no deployment-configuration rollback.

Phase 14D and 14E prepare data only. A later separately approved phase may implement a default-off Map preview and non-map alternative.
