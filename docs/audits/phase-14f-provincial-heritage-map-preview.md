# Phase 14F — Provincial heritage Map preview

## 1. Status and scope

Status: active preview implementation draft.

Phase 14F adds an optional provincial protected heritage pilot overlay to the existing public Map. It is a small preview integration, not a new discovery product or a claim that approved locations currently exist.

The implementation:

- keeps community heritage records enabled by default;
- adds the provincial pilot to the existing Leaflet layers control, disabled by default;
- lazy-loads the committed provincial GeoJSON only after first activation;
- validates the full file before rendering;
- accepts the approved zero-feature result as valid empty data;
- isolates all provincial loading and rendering from the community Map.

It does not add a sidebar tab, page, public-navigation item, search mode, filter, Firebase collection, backend, admin interface, export, or production record.

## 2. Independent overlay model

The existing Leaflet layers control contains two independent project overlays:

- **Community heritage records** — enabled by default and populated from the existing Firestore `communityPlaces` flow.
- **Provincial protected heritage pilot** — disabled by default and populated only from the static same-origin GeoJSON.

Community marker appearance, popups, Firestore loading, Search, Filters, Info, exact-place focus, Map-to-Places state, nomination coordinate handoff, initial centre, initial zoom, and community `fitBounds` behavior remain unchanged.

The provincial path never appends records to the community array and never calls `fitBounds`, `setView`, `panTo`, or `flyTo`.

## 3. Lazy loading and page-session cache

The browser makes no provincial request during the default page load. The first provincial `overlayadd`:

1. shows a polite loading status;
2. fetches the versioned same-origin GeoJSON;
3. parses and validates the complete response;
4. stores the shared promise and final result;
5. renders only after all validation succeeds.

Repeated disable and enable actions reuse the cached success or failure. They do not refetch. A page reload starts a new page session and may retry a previous failure.

Community Firestore loading does not wait for or depend on the provincial promise.

## 4. Valid-empty behavior

The current committed GeoJSON contains:

- ten source records;
- zero features;
- ten excluded records;
- `generationStatus: valid-empty`;
- an empty `features` array.

This is a successful result. When the user enables the overlay, no marker is drawn, no `geometry: null` layer is created, and the Map does not move. The dedicated status region says:

> No approved provincial heritage locations are available to display yet.

The wording confirms that the preview is working without implying that the official records are missing or that the file is broken. The message is hidden until the overlay is enabled and hidden again when it is disabled.

## 5. Failure behavior

The provincial preview fails closed for:

- HTTP or JSON parsing errors;
- wrong top-level type;
- missing or contradictory metadata;
- unsupported schema or dataset ID;
- invalid source, feature, or exclusion counts;
- inconsistent generation status;
- non-array features;
- duplicate IDs;
- missing or invalid feature properties;
- unsupported geometry;
- invalid or non-finite coordinates;
- Low, None, withheld, or restricted features;
- contradictory approximation state.

One invalid feature rejects the entire layer. The implementation never renders a partial provincial dataset. It clears only provincial artifacts, logs technical details to the console, and shows:

> The provincial heritage preview could not be loaded.

Raw errors and stack traces do not appear in the page. Community markers and controls continue to operate.

## 6. Official and project provenance

The preview keeps the approved provenance boundary:

- official Chinese designation facts come from the cited official source;
- English wording is an Alex's Photo Board project interpretation;
- any future displayed coordinates come from Alex's Photo Board project coordinate review;
- the project-created GeoJSON is not official government GIS data.

A future popup uses the project English name as its heading and keeps the official Chinese name visible with `lang="zh"`. It shows coordinate confidence, approximation wording where applicable, official source information, source access date, and this explicit notice:

> Displayed location: Alex's Photo Board project coordinate review, not an official designation coordinate.

## 7. Future Point contract

The same loader can display a later approved Point without structural changes. A feature must pass every gate:

- feature type `Feature`;
- unique non-empty feature ID matching `properties.recordId`;
- Point geometry only;
- coordinates in GeoJSON `[longitude, latitude]` order;
- finite longitude from -180 to 180;
- finite latitude from -90 to 90;
- confidence High or Medium;
- coordinate reference system WGS84;
- public policy `exact`, `approximate`, or `generalized`;
- sensitivity permitting public display;
- approximation state consistent with confidence and publication policy.

Future provincial markers use a dark-orange diamond with a white centre, distinct in shape and colour from the community blue pin. They remain keyboard accessible and have names that identify them as provincial records. Synthetic in-memory fixtures test this path; no fake feature is added to the real GeoJSON.

## 8. Accessibility

The existing layer control retains native Leaflet base-layer radios and overlay checkboxes. Its container and toggle have the accessible name `Map layers`.

The implementation provides:

- keyboard access to the layers control;
- native checkbox state;
- Escape-to-collapse with focus returned to the layers toggle;
- visible focus styling;
- a dedicated `role="status"` / `aria-live="polite"` region for loading and valid-empty states;
- a separate `role="alert"` region for failure;
- suppression of repeated text mutations for identical cached states;
- marker names that distinguish provincial records;
- explicit `Approximate location` wording;
- responsive coverage for mobile portrait, mobile landscape, tablet, and 200% zoom.

The overlay label remains English because the current page language is English. Official Chinese names remain visible in future popups.

## 9. Testing

Pure helper tests cover the valid-empty contract, metadata and count failures, schema and dataset mismatches, duplicate IDs, coordinate and geometry validation, publication and sensitivity gates, approximation consistency, accessible names, popup data, and synthetic High and Medium Points.

Browser tests cover:

- unchanged community Map initialization;
- community default-on and provincial default-off state;
- no request before activation;
- one request per page session;
- valid-empty messaging and zero markers;
- unchanged map view and community markers;
- disabling and cached re-enabling;
- HTTP, JSON, metadata, and feature failures;
- atomic rejection;
- future exact and approximate Points;
- provenance wording;
- layer-control keyboard behavior;
- existing Search, Filters, navigation, responsive, and console regressions;
- release cache-version references.

The normal `npm test`, `npm run test:browser`, syntax, JSON, UTF-8, Markdown, changed-file, protected-file, and `git diff --check` gates remain required.

## 10. Protected data and integration boundaries

Phase 14F does not edit:

- the canonical provincial JSON;
- the generated provincial GeoJSON;
- validation or generation tooling;
- Phase 14A–14E or Phase 15A source documents;
- Firebase configuration, rules, indexes, Storage, or records;
- community discovery or place pages;
- nominations;
- public export;
- CSP;
- workflows or deployment configuration.

All ten current records remain non-renderable and withheld. The production result remains zero provincial markers.

## 11. Deferred non-map alternative

Phase 15A requires a future non-map alternative for all ten official-reference records, including records without approved Point geometry. Phase 14F deliberately creates no new page. The non-map alternative remains deferred and must be approved separately before the pilot becomes a broader public records experience.

## 12. Rollback

The preview is independently revertible. Reverting the Map integration, helper, tests, styles, package test entry, and this guide removes the provincial control and loader without:

- migrating data;
- changing or restoring Firebase records;
- rolling back Firestore or Storage rules;
- changing indexes;
- changing the canonical dataset or generated GeoJSON;
- changing community marker behavior.

Failure already degrades to the stable community-only Map.
