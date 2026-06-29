# Phase 11B-11C Public Page Rebaseline Audit

Date: 2026-06-29
Branch: `codex/phase-11b-11c-public-page-audit`
Base branch: `main`
Scope: documentation-only audit before any Phase 11B/11C public page fixes.

## Guardrails for this audit

This audit intentionally does **not** change website behavior.

No changes were made to:

- Firestore rules
- Firebase config
- HTML files
- CSS files
- JavaScript files
- Heritage engine logic
- Public navigation behavior
- Search, map, nomination, authentication, or export behavior

This audit only records what currently exists and recommends the next small visible improvement.

## Files checked

Primary files checked:

- `about-local-heritage.html`
- `guidance.html`
- `place.html`
- `map.html`
- `style.css`

Related support files checked where useful:

- `public-nav.js`
- `place.js`
- `map.js`
- `heritage-engine/places.js`
- `heritage-engine/maps.js`
- `heritage-engine/search.js`

## Public pages that already exist

The public navigation currently exposes these main public pages:

- `index.html` — Home
- `news.html` — News
- `history.html` — History
- `get-involved.html` — Get involved
- `criteria.html` — Criteria
- `guidance.html` — Guidance
- `map.html` — Map
- `search.html` — Places
- `my-nominations.html` — My nominations
- `export.html` — Open Data
- `public-auth.html` — Sign in

Additional public heritage page checked in this audit:

- `about-local-heritage.html` — About Local Heritage Records

Important note: `about-local-heritage.html` exists and is a strong public explanation page, but it is not currently listed in `public-nav.js` as a top-level navigation item. It is discoverable through page links, but not directly from the global public nav.

## Current state by page

### `about-local-heritage.html`

What already exists:

- Full standalone public page with project title, public nav, breadcrumb, hero section, and footer.
- Clear explanation of what Alex's Photo Board records.
- Explains that `communityPlaces` is the central record layer.
- Explains the meaning of a community heritage record.
- Lists the current community heritage criteria.
- Provides pathways to Places, Map, Get involved, Criteria, Guidance, History, News, and Open Data.
- Explains how places and stories connect.
- Explains that `heritage.json` exports public records as JSON-LD.
- Includes a public nominations note.
- Includes a clear disclaimer that the project is inspired by Local Heritage Listing practice but is not an official statutory Local Heritage List.

What is working:

- The page is strong as a public-facing explanation of the project.
- It already supports Phase 11B's public guidance goal.
- It uses consistent layout classes shared with `guidance.html`.
- It links users toward the most important public heritage actions.

What is missing or should be polished:

- It is not currently a top-level item in `public-nav.js`.
- The page title says "About Local Heritage Records," while the global nav has separate "Get involved," "Criteria," and "Guidance" items. The relationship between those pages is useful but could be clearer to a first-time visitor.
- The page explains JSON-LD well enough for public reading, but the wording could be made more visitor-friendly and less technical in the main paragraph, with the technical details kept secondary.

### `guidance.html`

What already exists:

- Full standalone public guidance page with project title, public nav, breadcrumb, hero section, and footer.
- Explains what kind of places can be nominated.
- Explains what information to provide.
- Explains what evidence helps.
- Explains how coordinates help.
- Explains what happens after submission.
- Explains what information is private.
- Includes action links to `nominate-place.html`, `criteria.html`, and `map.html`.

What is working:

- The page is clear and suitable for public nomination guidance.
- The privacy explanation is helpful and should stay.
- The evidence guidance matches the evidence URL and source-credit direction from recent work.
- The map-coordinate explanation supports the map-to-nomination workflow.

What is missing or should be polished:

- The page is useful but text-heavy.
- It could benefit from a short checklist-style summary at the top before the detailed sections.
- It does not currently show example evidence wording or example source-credit wording.
- It does not directly explain the difference between a submitted nomination, an approved nomination, and a published `communityPlaces` record in a very visual way.

### `place.html`

What already exists:

- Public place detail page with project title, public nav, breadcrumb, status message, hero section, and footer.
- Loads `place.js` and reads one `communityPlaces` document by `id` from the URL.
- Includes a JSON-LD script placeholder and injects generated place JSON-LD after the record loads.
- Has two visible record tabs:
  - Overview
  - Comments and Photos
- Overview contains:
  - Record overview
  - Key facts
  - Image area and image credit
  - Why this place matters
  - Location
  - Sources and relationships
  - Open data note
- The Local Heritage record section renders fields including:
  - Local significance
  - Community heritage criteria
  - Criteria explanation
  - Heritage value
  - Condition
  - Community use
  - Date added
  - Last reviewed
  - Record status
- The page can render related article/story links from the relationship data.
- The page can show a small location map when valid coordinates exist.
- The page has empty-state messages for missing record, missing coordinates, missing source reference, and missing contribution content.

What is working:

- This page is already much more than a placeholder.
- It supports the Phase 11C goal of a public place detail page.
- It has a clear Local Heritage Record identity.
- It separates factual metadata, significance, sources, relationships, location, and open data.
- It avoids exposing admin-only review notes directly in the HTML structure.
- It uses shared heritage-engine helpers for title, description, location, criteria, coordinates, JSON-LD, and URL generation.

What is missing or should be polished:

- The "Comments and Photos" tab is currently a future placeholder, not a working contribution system.
- The tab title may make visitors expect a working feature. The copy does say the contribution system will be added later, but the label itself could still create confusion.
- The page does not yet show a concise "record completeness" or "evidence status" summary for public visitors.
- The "Open data note" is useful but generic. It could eventually link directly to the Open Data page or explain what data is reused.
- The image credit currently uses source/contributor fields, but the public wording could eventually align more directly with the newer evidence/source/copyright language.
- The layout is strong, but the first visible improvement should be small because this page is public and central.

### `map.html`

What already exists:

- Public map page with project title, public nav, map explorer sidebar, and footer.
- Loads Leaflet, Leaflet Draw CSS/JS, `script.js`, and `map.js`.
- Sidebar includes three tool panels:
  - Search
  - Filters
  - Info
- Search supports keyword search.
- Filters support:
  - Asset type
  - Town / area
  - Heritage criteria
- Info panel includes nomination entry point.
- Map renders public `communityPlaces` records with valid coordinates.
- Map popups show title, type, area, location, description, and a link to `place.html?id=...`.
- Map can pass selected coordinates to `nominate-place.html`.
- Map can focus from URL coordinates or search terms.

What is working:

- The map already supports Phase 11D-style filtering foundations even though Phase 11D is later.
- It only shows public records according to `isPublicRecord` logic.
- It avoids showing records without valid coordinates on the map.
- It gives users a route from map exploration to place detail pages.
- It gives users a route from map selection to nomination.

What is missing or should be polished:

- The map is map-first. It does not yet provide a visible list panel of matching records next to the map.
- Records without valid coordinates are not visible on the map page, so visitors need `search.html` for non-coordinate records.
- The filter panel is functional, but the public wording could better explain why some filters may appear only when matching data exists.
- `Leaflet Draw` is loaded, but the current public nomination flow appears to use map click selection rather than drawing. This is not necessarily wrong, but it is worth reviewing later to avoid unnecessary public dependencies.

### `style.css`

What already exists:

- Shared global header, footer, navigation, hero, article, map, search, nomination, auth, and place record styles.
- Dedicated styles for:
  - `heritage-about-page`
  - `heritage-about-breadcrumb`
  - `heritage-about-hero`
  - `heritage-about-content`
  - `heritage-about-criteria`
  - `heritage-about-pathways`
  - `heritage-about-actions`
  - `map-search-page`
  - `map-search-layout`
  - `map-explorer-panel`
  - `map-tool-index`
  - `map-filter-panel`
  - `map-canvas.map-search-canvas`
  - `community-custom-filter`
  - `place-record-page`
  - `place-record-hero`
  - `place-record-tabs`
  - `place-overview`
  - `place-record-card`
  - `place-local-heritage__details`
  - `place-location__map`
  - `place-related-articles`
  - `place-comments-panel`

What is working:

- The CSS already contains strong public-page styling for the Phase 11B/11C pages.
- The Local Heritage and place detail sections have separate class names, which reduces the risk of accidental styling conflicts.
- Responsive rules exist for guidance/about pages, map layout, and place details.

What is missing or should be polished:

- `style.css` is now a large mixed file containing many project phases.
- Some class groups are repeated or overridden later in the file, especially around map/search/article styling. This may be intentional from earlier fixes, but it increases future maintenance risk.
- For the next visible improvement, avoid large CSS refactors. Refactoring CSS should be a separate, planned phase because it could accidentally affect multiple public pages.

## Relevant heritage-engine notes

### `place.js` and `heritage-engine/places.js`

Current role:

- `place.js` handles the public place detail page.
- It imports helpers from `heritage-engine/places.js` and `heritage-engine/relationships.js`.
- It normalizes title, description, tags, image URLs, coordinates, criteria, location/address, dates, related article links, and JSON-LD.
- It injects generated `Place` JSON-LD into the page.

What is working:

- Public place detail rendering is centralized enough to be maintainable.
- Local Heritage fields are already rendered in a structured definition-list format.
- Source reference and related story sections already exist.

Caution:

- Do not change these files during the first audit-only step.
- Any later change to `heritage-engine/places.js` may affect `place.html`, search, export, or tests, so it should be treated as higher-risk than copy-only page polish.

### `map.js`, `heritage-engine/maps.js`, and `heritage-engine/search.js`

Current role:

- `map.js` handles the public map page.
- `heritage-engine/maps.js` provides map URL, nomination URL, coordinate, search, and display-location helpers.
- `heritage-engine/search.js` provides public-record filtering and heritage criteria helpers used by the map.

What is working:

- Map popups link to public place detail pages.
- Public record filtering already exists.
- Search and filters are already structured enough for the later Phase 11D map/list/search improvement.

Caution:

- Do not change map filtering yet as part of Phase 11B/11C page polish.
- A future map/list/search improvement should be a separate branch and PR.

## Main findings

1. Phase 11B is already partially present.
   - `about-local-heritage.html` and `guidance.html` are real public guidance pages, not placeholders.
   - They explain community heritage records, criteria, evidence, nominations, privacy, and the project's non-official status.

2. Phase 11C is already partially present.
   - `place.html` already has a structured Local Heritage Record layout.
   - It includes overview, key facts, image/source credit, significance, location, sources, relationships, and open data sections.

3. The map already has some Phase 11D foundations.
   - `map.html` includes public search, asset type filter, area filter, criteria filter, popups, and nomination coordinate handoff.
   - However, list-style results and broader search UX should remain Phase 11D, not part of this first 11B/11C polish.

4. The safest first visible improvement should be copy/layout polish, not data logic.
   - The current codebase already has useful behavior.
   - The next step should improve visitor clarity without touching Firestore rules, Firebase config, or heritage-engine behavior.

## Recommended next small visible improvement

Recommended next task:

**Phase 11B-11C small polish: clarify the public place-detail visitor experience without changing data behavior.**

Suggested scope:

- Keep the same branch/PR workflow rule.
- Create a new Codex branch only after this audit PR is reviewed/merged or closed.
- Do not touch Firestore rules.
- Do not touch Firebase config.
- Avoid heritage-engine logic unless absolutely necessary.
- Start with the smallest visible copy/layout change.

Best first candidate:

**Polish the `place.html` public detail page copy around the "Comments and Photos" tab and public contribution placeholder.**

Reason:

- The tab currently sounds like a live contribution feature.
- The content itself says the contribution system will be added later.
- A small copy polish can reduce visitor confusion without changing any data behavior.
- This is safer than changing map filters, search logic, or JSON-LD behavior.

Possible wording direction for later implementation:

- Rename or clarify the tab to make it clear this area is not active yet.
- Keep the future contribution note.
- Keep the page structure and styling stable.
- Do not connect a real comment/photo system yet.

Alternative small candidate:

**Add or improve public pathway text linking `about-local-heritage.html`, `guidance.html`, `criteria.html`, `search.html`, and `place.html` conceptually.**

Reason:

- The public guidance pages already exist.
- Their relationship could be clearer for first-time visitors.
- This could be copy-only and low risk.

## Recommended order after this audit

1. Review this audit document.
2. Choose one small visible Phase 11B/11C polish.
3. Create one new branch for that one polish.
4. Open one draft PR.
5. Make copy/layout-only changes first.
6. Verify public pages manually.
7. Merge only when the change is clear and safe.
8. Delete the feature branch after merge.

## Stop point

Stop here for this PR.

This branch should remain documentation-only. No public behavior should be changed until the next specific Phase 11B/11C improvement is selected.
