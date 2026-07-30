# Phase 14 — Provincial Protected Heritage Pilot Final Closeout

## 1. Status And Authority

Status: complete and production verified.

This document is the authoritative Phase 14 closeout record for the ten-record Jiangxi provincial protected heritage pilot. It records the final outcomes of Phases 14A–14F, the boundaries that remain in force, the production verification completed after the Phase 14F merge, and the agreed order for any later work.

The underlying phase records remain authoritative for their detailed transcriptions, decisions, evidence, schemas, tests, and implementation instructions. This closeout summarizes those records and governs the overall Phase 14 completion status; it does not replace or reinterpret their field-level evidence.

Production-verified merge:

- Commit: `220a8e7905c9813b8e543bbe2c5538ec11fe4a53`
- GitHub Pages Map: `https://sdsdsdsc.github.io/alex-website/map.html`
- Verification date: July 24, 2026

## 2. Phase Completion Record

| Phase | Completed outcome | Final boundary |
| --- | --- | --- |
| Phase 14A | Transcribed a ten-record official Chinese source table in stable project-ID order, with source and republication provenance recorded. | No translation, coordinate, geometry, GeoJSON, or Map data was introduced. The source document number remains pending direct verification. |
| Phase 14B | Approved project English translations, pinyin, and structured-location assignments for all ten records. | These are project interpretations, not official Jiangxi government English translations. Records `JX-PCH-7-004` and `JX-PCH-7-006` remain single records with descriptive component locations. |
| Phase 14C-1 | Established the coordinate-research method, evidence requirements, WGS84 output rule, review gates, and a blank ten-record worksheet. | Locality centres and administrative centroids are not acceptable final site coordinates by themselves. Candidate coordinates cannot enter Map or machine data automatically. |
| Phases 14C-2 and 14C-3 | Completed the reasonable research pass and project-owner review for all ten records. Five outcomes are reviewed Low and five are accepted None/unresolved. | Zero High or Medium outcomes, zero selected candidates, zero approved numeric coordinates, and zero renderable records. All ten publication-location policies remain `withheld`. |
| Phase 14D | Added the canonical ten-record provincial heritage JSON dataset with source, translation, structured-location, and coordinate-review boundaries preserved. | All approved coordinate fields remain `null`; every record remains non-renderable and withheld. |
| Phase 14E | Added deterministic validation and GeoJSON generation. The generated result is valid but empty. | The GeoJSON contains no `geometry: null` placeholders and no features for unapproved locations. |
| Phase 14F | Added a default-off, lazy-loaded provincial heritage Map overlay with isolated failure handling, an accessible valid-empty status, future Point validation, tests, and rollback guidance. | The production overlay displays no provincial marker because no record passes the rendering gates. Community place behavior remains independent. |

## 3. Final Valid-Empty Result

The final machine-data and GeoJSON result is intentional:

- canonical source records: `10`
- generated GeoJSON features: `0`
- excluded records: `10`
- generation status: `valid-empty`
- approved numeric coordinates: `0`
- selected coordinate candidates: `0`
- renderable records: `0`
- publication-location policy: `withheld` for all ten records
- coordinate confidence: five reviewed `Low` outcomes and five accepted `None`/unresolved outcomes
- reviewed `High` or `Medium` outcomes: `0`
- rejected numeric candidates retained in the research record: `1`

The generated GeoJSON therefore remains a valid `FeatureCollection` with `features: []`. This is the correct public output for the approved evidence. An empty layer is not a data-generation failure and must not be filled with inferred, approximate, locality-centre, or administrative-centroid coordinates.

## 4. Production Map Verification

The Phase 14F merge was deployed automatically through GitHub Pages and verified against production.

Workflow evidence:

- Alex Photo Board Verification run `29996583160`: success
- `verify` job `89171575950`: success
- GitHub Pages run `29996582397`: success
- `build` job `89171581647`: success
- `report-build-status` job `89171702733`: success
- `deploy` job `89171702683`: success

Read-only production smoke evidence:

- the Map loaded successfully from the production GitHub Pages URL;
- the existing community overlay remained enabled and showed five community markers;
- the provincial overlay was off by default and initially showed no provincial marker or status message;
- enabling the provincial overlay preserved all five community markers;
- the provincial overlay showed the expected message: “No approved provincial heritage locations are available to display yet.”;
- zero provincial markers were created;
- the isolated error message remained hidden;
- no application-owned console error or warning was observed;
- no production write, Firebase deployment, manual GitHub Pages deployment, or production-record change occurred.

This verifies the implemented valid-empty behavior. It does not constitute approval for any future provincial location or marker.

## 5. Provenance Boundaries

The following provenance classes must remain distinct:

1. **Official Chinese source facts** — the Chinese names, classification, official-list ordering, official numbers, and recorded source context transcribed in Phase 14A.
2. **Issuing authority and republication host** — the Jiangxi Provincial People's Government is the recorded issuing authority; the county-hosted republication is evidence access and must not be described as the issuing authority.
3. **Project translation and structure** — English names, pinyin, and structured-location assignments are Alex's Photo Board project interpretations approved through Phase 14B. They are not official government translations.
4. **Project coordinate research** — candidate evidence, confidence, rejection decisions, and publication restrictions are project research decisions. They are not official designation coordinates.
5. **Project-generated geometry** — any future GeoJSON geometry would be derived from separately approved project coordinates and must retain project-coordinate provenance. The current GeoJSON has no geometry.

The provincial pilot is separate from `communityPlaces`, `placeNominations`, public export, and nomination promotion. Phase 14 introduced no Firebase record, rule, index, Storage, or backend-data change.

## 6. Coordinate And Rendering Restrictions

A future provincial Map feature may be generated only when its parent record has:

- one approved numeric latitude and longitude pair;
- WGS84 as the approved coordinate reference system;
- a reviewed `High` or `Medium` coordinate-confidence outcome;
- a non-null selected candidate;
- a compatible approved uncertainty value;
- `renderable: true`;
- a publication-location policy that permits the resulting precision;
- a completed sensitivity assessment that permits publication; and
- valid Point geometry in GeoJSON order `[longitude, latitude]`.

`Low`, `None`, unresolved, candidate-only, `withheld`, or restricted outcomes remain non-renderable. Free-form addresses, locality names, administrative centroids, or map-search results must not be parsed or substituted to bypass these gates. Records `JX-PCH-7-004` and `JX-PCH-7-006` remain single parent records; their descriptive components do not have component IDs, coordinates, or geometry.

All ten current records fail the approved rendering gates and must remain absent from the Map as markers. Coordinate research may be reopened only when material new evidence exists and a separate review explicitly approves a changed outcome.

## 7. Known Unresolved Source Verification

The source document number `赣府发〔2025〕8号` remains recorded with verification status `pending`. It was supplied in the project brief but was not directly visible in the inspected official county republication or its attachment.

This limitation does not invalidate the ten transcribed list entries or prevent Phase 14 closeout, but the number must not be described as independently verified. A later source-maintenance task may update the verification status only from suitable direct evidence and must preserve the distinction between the issuing authority and the county republication host.

## 8. Rollback Boundary

Phase 14 has two separable implementation rollback groups:

- **Phases 14D/14E:** canonical provincial JSON, generated GeoJSON, generator, validation library and command, focused tests, package scripts, and their implementation guide must be reverted together so generated and canonical data cannot drift.
- **Phase 14F:** Map integration, the provincial Map helper, focused Map tests, related styles and package/test wiring, and the Phase 14F guide may be reverted independently while retaining the approved canonical dataset and valid-empty GeoJSON.

Neither rollback requires a Firebase migration, rules or index deployment, Storage change, production-record edit, or `communityPlaces` rollback. The provincial overlay must remain isolated so a load or validation failure cannot remove or alter community markers.

## 9. Agreed Next-Order Plan

Phase 14 closeout does not start the next product change. The agreed order after this closeout is:

1. scope and approve a public non-map official-reference list that can expose the ten records without implying approved point locations;
2. complete that non-map alternative in a separate phase and pull request;
3. only then consider provincial-pilot expansion readiness, with separate approval for source selection, provenance, translation, location research, accessibility, testing, and maintenance ownership.

Source-document-number verification may continue as a bounded documentation-maintenance item when stronger evidence is available. It must not be used to infer coordinates or accelerate Map rendering. Additional records, new coordinate research, machine-data expansion, GeoJSON features, and Map markers all remain outside this closeout and require explicit approval.

## 10. Final Closeout Decision

Phases 14A–14F are complete for the approved ten-record pilot. The production result is a provenance-preserving canonical dataset, a deterministic valid-empty GeoJSON layer, and a verified default-off Map overlay that truthfully reports that no approved provincial heritage locations are available to display.

The pilot is complete without making any of the ten records renderable. Its restrictions, unresolved verification item, rollback boundary, and next-order plan remain active until superseded by an explicitly approved later phase.
