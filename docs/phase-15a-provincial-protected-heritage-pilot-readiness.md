# Phase 15A — Provincial Protected Heritage Pilot Readiness

## 1. Status and scope

Phase 15A records an approved documentation and architecture decision for a future provincial protected heritage pilot. It does not implement or publish the visible feature.

This phase does not:

- create the proposed ten-record dataset;
- create or publish GeoJSON;
- translate source records;
- research or verify coordinates;
- change the Map user interface;
- change the existing Search, Filters, or Info tools;
- change Firebase data, rules, indexes, Storage, Hosting, or configuration;
- change deployment behavior or deploy anything.

The older [`docs/phase-15a-firebase-rules-sync-readiness.md`](./phase-15a-firebase-rules-sync-readiness.md) concerns Firebase rules. It remains a separate, unchanged historical readiness record and must not be confused with this provincial-pilot decision.

## 2. Current Map baseline

The current public Map baseline must remain stable during any later pilot implementation:

- Search, Filters, and Info are the three existing sidebar tabs.
- The structured community filters are Asset type and Heritage criteria.
- Area, address, legacy city, and legacy district remain keyword-searchable.
- No current filter control or pull-down item may be renamed, removed, reordered, expanded, or given different semantics as part of the pilot.
- The existing Leaflet layers control switches among OpenStreetMap, Gaode, and Esri base maps.
- Future project overlays must use the existing Leaflet layers control instead of adding a fourth sidebar tab.

The pilot is an optional map layer. It is not another community discovery filter and must not alter the community filter URL contract.

## 3. Approved future overlay model

The existing Leaflet layers control should eventually offer two separately controlled project overlays.

### Community heritage records

- Enabled by default.
- Sourced from the Firestore `communityPlaces` collection.
- Continues to use the current community keyword search and structured filters.
- Continues to support exact place focus, Map-to-Places navigation, and nomination coordinate handoff.

### Provincial protected heritage pilot

- Disabled by default.
- Separate from `communityPlaces`.
- Separate from `placeNominations`.
- Separate from nomination review and promotion.
- Separate from community Places results.
- Excluded from `heritage.json` unless a later phase explicitly approves export inclusion.
- Initially sourced from a static same-origin GeoJSON file.

The recommended future path is:

```text
data/jiangxi-provincial-heritage-pilot.geojson
```

Phase 15A does not create that directory or file. A later implementation must keep the Firestore community marker layer and the static pilot layer as independent Leaflet layer groups. Pilot records must never be appended to the community record array or routed through the community search, filtering, nomination, promotion, or export helpers.

## 4. Source and provenance model

The future pilot must distinguish source facts from Alex's Photo Board research:

- Official Chinese designation facts come from the cited Jiangxi government source.
- English wording is an Alex's Photo Board project translation.
- Structured administrative fields are project-derived from the preserved official location text.
- Coordinates are separately researched or project-verified.
- GeoJSON is created by Alex's Photo Board.
- Government designation does not mean that the government supplied the coordinate or GIS file.

The exact official Chinese location text must be retained even when the project later introduces structured city, county/district, township, or village/community fields. Unknown facts must remain unknown rather than being inferred from an unsupported locality label.

Approved public wording:

> **Provincial protected heritage pilot**
>
> A small research pilot based on cited Jiangxi provincial protected cultural heritage sources. Official Chinese names and designation details are transcribed from those sources. English wording and mapped locations are project research and may be approximate. This layer is separate from the community heritage records on Alex's Photo Board.

Future public records and popups must identify the official source, source access date, project-translation status, coordinate confidence, and whether a location is approximate. They must not describe Alex's Photo Board as the designating authority or describe the project-created GeoJSON as an official government GIS dataset.

## 5. Future data contract

The proposed static file should follow RFC 7946 as a GeoJSON `FeatureCollection`. It should include dataset metadata and features with stable, unique identifiers. The later validator must reject malformed top-level objects, unsupported geometry, duplicate identifiers, invalid coordinates, and unsupported confidence values.

### Dataset-level metadata

The dataset should include:

- `schemaVersion`
- `datasetId`
- pilot scope and limitations
- official publisher
- source title
- source URL
- source access date
- project maintainer
- project last-reviewed date
- translation-method note
- coordinate-method note

### Feature-level official transcription

Officially transcribed fields should include:

- `officialNameZh`
- `officialNumber`
- `protectionLevelZh`
- `batch`
- `officialCategoryZh`
- `periodZh`
- `officialLocationTextZh`
- `designationDate`
- official source URL

### Feature-level project interpretation

Project-produced fields should include:

- `namePinyin`
- `officialNameEn`
- `protectionLevelEn`
- `officialCategoryEn`
- `periodEn`
- `officialLocationTextEn`
- `cityZh`
- `countyDistrictZh`
- `townshipZh`
- `villageCommunityZh`
- `remarksZh`
- `remarksEn`
- `translationStatus` or `translationNote`

### Feature-level project mapping evidence

Mapping evidence should include:

- `latitude`
- `longitude`
- `coordinateConfidence`
- `coordinateMethod`
- `coordinateSource`
- `coordinateCheckedDate`
- `coordinateCheckedBy`
- `coordinateUncertaintyNote`
- `mappingStatus`

Unknown values must use `null`, not invented placeholders, settlement-centre coordinates, or text that implies verification. Where both property-level latitude/longitude and GeoJSON geometry are present, a validator must require exact agreement and enforce GeoJSON longitude-latitude coordinate order.

## 6. Coordinate-confidence policy

### High

- A defensible exact site location is supported.
- A point marker is allowed.
- The supporting method and source must be recorded.

### Medium

- A defensible approximate site or compound location is supported, with modest uncertainty.
- A point marker is allowed.
- The marker and popup must be visually and textually labelled `Approximate location`.
- The uncertainty basis must be recorded.

### Low

- Only a broad settlement or locality is known.
- No point marker is allowed.
- The record remains in the source table and non-map list.

### None

- No defensible location is known.
- No geometry or marker is allowed.
- The record remains in the source table and non-map list.

A village, town, county, or city centre must never be substituted merely to force a record onto the map. Confidence describes the available evidence, not a desired display outcome.

## 7. Failure isolation and loading

A future implementation must meet these requirements:

- Fetch GeoJSON only after the provincial pilot overlay is enabled.
- Perform no pilot request while the default-off layer has not been activated.
- Fetch at most once per page session, sharing one in-flight or completed request across repeated toggles.
- Never make community Firestore loading wait for the pilot request.
- Catch pilot HTTP, parsing, contract-validation, and rendering failures inside the pilot path.
- Prevent pilot failure from breaking community markers, Search, Filters, Info, place focus, or nomination coordinate handoff.
- Announce pilot loading and failure through a dedicated accessible status region.
- Clear or disable only the pilot layer after failure.
- Introduce no Firebase dependency for the pilot.
- Use the project's release-version cache parameter when the static file and loader are implemented.
- Confirm actual HTTP 200 and `Content-Type` responses during preview and production freshness gates.

The current same-origin Content Security Policy appears sufficient for the planned static fetch because `connect-src` includes `'self'`. No CSP change is approved in this documentation phase. Any future CSP change would require separate evidence and approval.

## 8. Accessibility requirements

The future implementation must provide:

- labelled native overlay checkboxes;
- an accessible name for the layers control;
- explicit checked state;
- complete keyboard operation;
- Escape-to-close and focus restoration if a custom panel is introduced;
- clearly visible keyboard focus;
- an `aria-live` loading and failure status;
- a different marker shape as well as colour for the provincial layer;
- marker accessible names that distinguish community records from provincial records;
- `Approximate location` wording in medium-confidence marker names and popups;
- readable source attribution and provenance;
- usable layout and controls on mobile, landscape mobile, tablet, and at 200% zoom.

All ten pilot records must have a future non-map list alternative, including low- and none-confidence records that do not appear as map points. A dedicated future page such as `provincial-heritage-pilot.html` is recommended so the pilot remains separate from the community Places results. Phase 15A does not create that page.

## 9. Cambridgeshire reference boundary

The supplied Cambridgeshire Local Heritage List screenshots may inspire:

- compact overlay controls;
- checkbox interaction;
- concise legends;
- clear visual separation between layer families.

They must not be copied for:

- branding;
- exact visual design;
- statutory categories;
- the complete layer catalogue;
- official-list claims;
- marker density;
- search behavior.

Alex's Photo Board remains a small community heritage project. Structural inspiration does not make the community record layer or project-created pilot an official statutory list or authoritative government map.

## 10. Tests required for future implementation

The future implementation PR must include automated and manual evidence for all of the following:

- Exactly three existing sidebar tabs remain: Search, Filters, and Info.
- Current community filter controls and behavior remain unchanged.
- Existing community filter URL state remains unchanged.
- The community overlay is enabled by default.
- The provincial pilot is disabled by default.
- No pilot request occurs before activation.
- Only one lazy fetch occurs per page session.
- Valid high- and medium-confidence records render.
- Low- and none-confidence records do not render as points.
- Missing, rejected, malformed, or invalid pilot data cannot break community markers.
- Deactivating the pilot removes only pilot markers.
- Overlay controls, marker names, attribution, and approximate-location wording are accessible.
- Community and provincial marker names are distinguishable.
- Pilot state does not enter community filter URLs.
- Map-to-Places and Places-to-Map behavior remains `communityPlaces`-only.
- Nomination latitude/longitude handoff remains unchanged.
- No private data or `placeNominations` data is read, displayed, or exported.
- Mobile, landscape, tablet, keyboard, Escape, visible-focus, and 200% zoom behavior passes.
- Cache-buster references, HTTP status, `Content-Type`, and production freshness pass.

Contract-level tests must also cover unique IDs, required provenance, null handling, confidence enumeration, coordinate range and order, geometry/property agreement, and rejection of point geometry for low/none confidence.

The normal release checks remain required:

- `npm test`
- `npm run test:browser`
- JavaScript syntax checks
- `git diff --check`
- changed-file and cache-version inspection
- preview console and non-destructive smoke checks
- post-merge workflow and production freshness gates

## 11. Rollback

The future visible pilot must be delivered as one independently revertible implementation PR.

Rollback must require:

- no data migration;
- no Firebase rollback;
- no Firestore or Storage rules rollback;
- no index rollback;
- no restoration, editing, or deletion of production records;
- community markers to continue operating independently.

A pilot file or loader failure must already degrade to the stable community-only Map. Reverting the implementation PR should remove only the pilot controls, loader, static data, and pilot-list behavior introduced by that PR.

## 12. Phase completion and next phase

Phase 15A is complete when:

- this readiness document and its documentation-index entry are merged;
- data separation is approved;
- provenance and public wording are approved;
- the coordinate-confidence policy is approved;
- failure isolation and lazy loading are approved;
- accessibility and the non-map list requirement are approved;
- future tests and rollback are documented;
- no application, dataset, Firebase, CSP, configuration, workflow, or deployment behavior has changed;
- the PR checks are green.

After Phase 15A merges, Phase 14A may begin as a separate pilot-table PR. Phase 14A must begin with:

- ten official Chinese source records;
- source and source-access-date evidence;
- no coordinates;
- no GeoJSON;
- no Map changes;
- no silent expansion into translation or spatial research without separate approval.

Phase 14A must preserve the official Chinese source text and establish record-level provenance before any later translation, coordinate research, GeoJSON generation, or visible layer work begins.
