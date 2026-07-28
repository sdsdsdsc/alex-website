# Phase 15C-2 — Official Heritage Line and Area Rendering

## Scope and current status

Phase 15C-2 adds a bounded production-renderer capability for already validated official heritage geometry. It supports `Point`, `LineString`, `MultiLineString`, `Polygon`, and `MultiPolygon` after the shared publication validator succeeds. `GeometryCollection`, malformed geometry, incompatible meaning metadata, and unsupported presentation combinations continue to fail closed.

The implementation was committed at `0de2ccd3a9096c04329ca004c0788eeb227b5c28` before the current corrective commit and pushed to `codex/official-geometry-rendering`. Draft PR #62 is open. Push verification passed on rerun, and pull-request verification run 320 passed. The PR remains unapproved, unmerged, and undeployed. Production remains unchanged on `main`: the official layer is off by default, the generated production GeoJSON remains byte-for-byte unchanged, and the current generated dataset contains only five Point features. No real line or area feature is published by this work.

## Controlled visual grammar

Orange remains the official-heritage family colour. Presentation is selected from a static project-owned matrix by validated `geometryMeaning`; record text never creates CSS, SVG, or style values.

| Controlled meaning | Geometry | Outline | Fill | Relative emphasis |
| --- | --- | --- | --- | --- |
| `reviewed-line` | LineString or MultiLineString | Solid `#a94700`, weight 5, opacity 0.92 | None | Strongest line |
| `approximate-line` | LineString or MultiLineString | Dashed `8 7`, weight 3, opacity 0.76 | None | Lighter and thinner |
| `reviewed-boundary` | Polygon or MultiPolygon | Solid `#a94700`, weight 3, opacity 0.92 | Orange, opacity 0.14 | Strongest area |
| `approximate-boundary` | Polygon or MultiPolygon | Dashed `8 6`, weight 2.5, opacity 0.8 | Orange, opacity 0.08 | Qualified area |
| `generalized-reference-area` | Polygon or MultiPolygon | Clearly dashed `3 7`, weight 2, opacity 0.7 | Orange, opacity 0.045 | Weakest reference area |
| `uncertainty-area` | Polygon or MultiPolygon | Soft dotted-dash `2 8`, weight 1.5, opacity 0.58 | Orange, opacity 0.1 | Communicates uncertainty |

Point features retain the existing filled or hollow diamond, controlled category glyph, and accessible-name behavior. Community blue markers and community categories are unchanged.

The pure `official-geometry-rendering.js` helper returns only frozen, static presentation configuration. It requires an explicit controlled meaning compatible with the geometry family. It does not infer line or area meaning from geometry type alone. Collection preparation completes before any feature is rendered, so an unsupported presentation rejects the whole official layer.

## Rendering and feature identity

Each validated feature produces one Leaflet layer:

- Point uses the existing marker renderer.
- LineString and MultiLineString use one polyline layer per feature.
- Polygon and MultiPolygon use one polygon layer per feature.

Nested MultiLineString and MultiPolygon coordinates are converted from GeoJSON longitude-latitude order to Leaflet latitude-longitude order without changing source data. Counts are feature counts, not component-path counts. Rendering and category filtering do not call `fitBounds`, recenter the Map, change the URL, or mutate source features.

## Accessibility and interaction

Every non-Point layer receives one SVG interactive target with:

- `role="button"`;
- `tabindex="0"`;
- a controlled accessible name;
- visible high-contrast focus styling;
- Enter and Space activation.

The name includes the project record title, Chinese official name when present, controlled Map category, and precise geometry meaning. Example:

> Open official protected heritage record: Reviewed Canal Route (审定水道); Map category: Ancient buildings; Reviewed line

Pointer activation and keyboard activation open the same safe-DOM popup. Escape continues to use the Map's existing popup-closing behavior. Multi-part geometry does not create multiple keyboard targets for one feature.

## Popup semantics and provenance

Non-Point popups show:

- record title and Chinese official name;
- protection level and official category;
- official location text;
- geometry type and controlled meaning;
- geometry precision;
- horizontal uncertainty when supplied;
- controlled provenance type and source label;
- review date when supplied;
- official source context;
- a safe HTTPS geometry-source link when available.

Project-created, approximate, generalized, and uncertainty geometry receives the caution:

> This geometry is a project reference or approximation, not an official legal boundary.

Popup values are inserted with DOM text properties. URLs pass the existing HTTPS normalization before becoming links. Raw data cannot inject HTML, CSS, SVG, or executable URLs.

## Category and layer behavior

The visible official set is the intersection of:

1. the fully validated and render-prepared feature collection; and
2. the official categories selected for the current page session.

Category counts remain one per feature, including multi-part features. Filtering does not refetch or revalidate the cached official dataset, does not alter Map bounds or URLs, and does not affect community records. Disabling and re-enabling the official layer preserves page-session category selections. The official layer remains off and unloaded by default; category controls appear only after successful validation and render preparation.

If collection validation or rendering preparation fails, no official feature or category control is displayed. The existing controlled official-layer failure message is used, and community markers and controls remain available.

## Synthetic coverage only

Browser coverage uses synthetic fixtures for:

- reviewed LineString;
- approximate MultiLineString;
- reviewed Polygon;
- approximate Polygon;
- generalized MultiPolygon;
- uncertainty Polygon;
- official-published geometry provenance;
- project-reviewed digitization;
- project-generalized reference.

The fixtures verify static styles, feature-level counts, pointer and keyboard popups, accessible names, provenance and caution wording, category intersection, cached session behavior, default-off loading, atomic failure, unchanged URL and Map position, community isolation, responsive layouts, 200% zoom, visible focus, and absence of application-owned console errors.

No synthetic geometry enters a production data file.

## Preserved production result

The generated official result remains:

- 15 source records;
- 5 published Point features;
- 10 exclusions;
- 0 generation errors;
- `valid` status.

The generated official GeoJSON remains byte-for-byte current. Source datasets, coordinates, public-location decisions, precision, uncertainty, category mappings, schema version `2.0.0`, generator scripts, Firebase, workflows, package files, nominations, promotion, exports, Search, Filters, and community category logic are unchanged.

## Limitations and rollback

This renderer does not establish topology validity, legal boundaries, cadastral accuracy, ownership extent, automatic geometry simplification, editing, clustering, or fit-to-geometry behavior. It does not approve any candidate geometry.

Rollback is bounded to the presentation helper, renderer integration, line/area CSS and legend text, synthetic tests, and this documentation. No data migration or GeoJSON regeneration is required.

PR 5C geometry publication work has not started and requires separate approval.
