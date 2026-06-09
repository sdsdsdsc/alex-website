# Alex's Photo Board Site Structure

Alex's Photo Board is becoming a lightweight community heritage website with linked-data potential. The practical site should remain simple: public pages help people find community places and stories, Firebase stores the working content, admin pages provide careful editing workflows, and JSON-LD adds semantic meaning that can later support open-data and RDF experiments.

This document describes the current structure and the preferred direction for relationship-building work. It is not a rebuild plan.

## Layered Architecture

| Layer | Role | Current implementation | Direction |
| --- | --- | --- | --- |
| Public website layer | Presents places, maps, search, articles, and exports to visitors. | `index.html`, `search.html`, `map.html`, `place.html`, `news.html`, `history.html`, `article.html`, `export.html` | Keep public behavior centered on `communityPlaces`, `news`, and `history`. |
| Firebase content layer | Stores editable content records. | Firestore collections: `communityPlaces`, `news`, `history` | Keep Firebase as the practical content database. |
| Admin editing layer | Lets signed-in admins create, review, update, and manage content. | `admin-login.html`, `admin.html`, `manage-community-places.html`, `upload-article.html`, `manage-articles.html` | Add relationship editing gradually and safely. |
| Semantic metadata layer | Adds machine-readable meaning to public records. | JSON-LD on place and article pages; stored `jsonld` fields; export generation | Normalize place/article relationships using stable IDs and URLs. |
| Future open-data / RDF export layer | Makes the dataset reusable outside the website. | `export.html` and `export.js` currently download `heritage.json` as JSON-LD with `@context` and `@graph`. | Continue refining clean JSON-LD, then optionally convert to RDF for Fuseki or GraphDB. |

## Current Page Roles

| Page | Purpose | Collection read/write | Main outgoing links |
| --- | --- | --- | --- |
| `index.html` | Homepage and entry point for places, news, and history. | Reads `news` and `history` through `script.js`; also reads external Drupal JSON:API news. | `search.html`, `map.html`, `news.html`, `history.html`, `article.html` |
| `search.html` | Public search and filtering for community place records. | Reads `communityPlaces`. | `place.html?id={id}`, `map.html?lat={lat}&lng={lng}`, `map.html?search={title}` |
| `map.html` | Public map for community places. Legacy admin map mode still exists behind `map.html?admin=true`. | Public mode reads `communityPlaces`; legacy admin mode reads/writes `mapPoints` and `mapPolygons`. | `place.html?id={id}`, `search.html`, `export.html`, page anchors |
| `place.html` | Official public detail page for one community place record. | Reads one `communityPlaces` document. | `map.html`, `search.html`, optional related article URL |
| `news.html` | Public news listing. | Reads `news` through `script.js`; also reads external Drupal JSON:API news. | `article.html?id={id}&type=news`, `article.html?id={id}&type=drupal` |
| `history.html` | Public history listing. | Reads `history` through `script.js`. | `article.html?id={id}&type=history` |
| `article.html` | Public article detail page. | Reads one `news` or `history` document, or an external Drupal article when `type=drupal`. | Main site navigation |
| `export.html` | Public open-data download page. | Reads through `export.js`. | Main site navigation |
| `admin-login.html` | Firebase Auth sign-in page for admin workflows. | Uses Firebase Auth only. | Redirects to the requested admin page after sign-in |
| `admin.html` | Protected admin dashboard. | Uses Firebase Auth only. | `manage-community-places.html`, `upload-article.html`, `manage-articles.html` |
| `manage-community-places.html` | Protected admin manager for community place records. | Reads/writes/deletes `communityPlaces`. | `place.html?id={id}`, `map.html?lat={lat}&lng={lng}`, `admin.html` |
| `upload-article.html` | Protected article create/edit page. | Creates and updates `news` or `history`; uploads article assets to Firebase Storage. | `admin.html`, `manage-articles.html` |
| `manage-articles.html` | Protected article management page. | Reads and deletes `news` and `history`. | `upload-article.html`, `admin.html` |

## Current Firestore Collections

### `communityPlaces`

Known fields:

- `id`
- `title`
- `category`
- `location`
- `province`
- `city`
- `district`
- `address`
- `associatedType`
- `contributor`
- `period`
- `description`
- `imageUrl`
- `lat`
- `lng`
- `tags`
- `grade`
- `source`
- `relatedArticle`
- `jsonld`
- `createdAt`
- `updatedAt`

### `news`

Known fields:

- `title`
- `htmlUrl`
- `imageUrl`
- `content`
- `htmlContent`
- `jsonld`
- `createdAt`
- `updatedAt`
- `author`
- `message`

### `history`

Known fields:

- `title`
- `htmlUrl`
- `imageUrl`
- `content`
- `htmlContent`
- `jsonld`
- `createdAt`
- `updatedAt`
- `author`
- `message`

## Canonical `communityPlaces` Field Model

Preferred fields:

- `id` / document ID: stable slug used in URLs and references.
- `title`: public record title.
- `category`: broad place category.
- `location`: human-readable locality label.
- `province`: province or equivalent region.
- `city`: city or municipality.
- `district`: district or neighborhood.
- `address`: street address or descriptive address when available.
- `associatedType`: heritage/community association type.
- `contributor`: person or group that contributed the record.
- `period`: time period label.
- `description`: public summary or record description.
- `imageUrl`: primary image URL.
- `lat`: latitude as a number.
- `lng`: longitude as a number.
- `tags`: descriptive tags as an array of strings.
- `grade`: classification, grade, or local significance label when useful.
- `source`: source label or organization.
- `relatedArticle`: legacy single related article URL.
- `relatedArticles`: future array of structured article references.
- `relatedPlaces`: future array of structured place references.
- `relatedEvents`: future array of structured event references.
- `relatedPeople`: future array of structured person references.
- `relatedOrganizations`: future array of structured organization references.
- `relatedPeriods`: future array of structured period references.
- `jsonld`: optional advanced JSON-LD object.
- `createdAt`: server timestamp for creation.
- `updatedAt`: server timestamp for latest update.

The current public system should continue to support `relatedArticle` while future work adds richer relationship arrays.

## Canonical Article Field Model

Preferred fields for `news` and `history`:

- `id` / document ID: stable article identifier.
- `title`: public article title.
- `content` / `htmlUrl`: article body content or stored HTML URL.
- `imageUrl`: primary article image URL.
- `collection type`: `news` or `history`.
- `relatedPlaces`: future array of structured community place references.
- `relatedArticles`: future array of structured article references if needed.
- `contributor` / `author`: future contributor or author label/reference.
- `period`: future period label/reference.
- `tags`: future descriptive tags as an array of strings.
- `jsonld`: optional advanced JSON-LD object.
- `createdAt`: server timestamp for creation.
- `updatedAt`: server timestamp for latest update.

## Relationship Reference Pattern

Use a stable reference object shape:

```json
{
  "collection": "communityPlaces",
  "id": "old-anyuan-company-community-park",
  "title": "Old Anyuan Company Community Park"
}
```

Guidelines:

- Use structured references instead of only raw URLs.
- Keep `title` as a convenience label for admin screens and display.
- Treat `collection` + `id` as the stable link.
- Do not rely only on free-text tags for relationships.
- Store arrays of these reference objects when a record can relate to more than one target.

## Relationship Fields

Future place relationship fields:

- `place.relatedArticles`: articles connected to the place.
- `place.relatedPlaces`: other community places connected to the place.
- `place.relatedEvents`: events connected to the place.
- `place.relatedPeople`: people connected to the place.
- `place.relatedOrganizations`: groups or organizations connected to the place.
- `place.relatedPeriods`: periods connected to the place.

Future article relationship fields:

- `article.relatedPlaces`: community places discussed by the article.

These fields should be added gradually. The first practical step should be relationships between places and articles, because those already exist as public pages.

## JSON-LD Direction

Firebase is the practical database. JSON-LD is the semantic metadata layer.

Public pages should generate useful JSON-LD from the Firebase record, then merge in an optional stored `jsonld` object when present. JSON-LD should use stable URLs and `@id` values where possible.

Preferred direction:

- Place pages should use `Place` JSON-LD.
- Article pages should use `Article` JSON-LD.
- Place-to-article relationships can use `subjectOf`.
- Article-to-place relationships can use `about` or `mentions`.
- Images should be represented through `image`.
- Coordinates should use `GeoCoordinates`.
- Future export can normalize page-level metadata into a connected JSON-LD graph.

The current implementation already generates JSON-LD for places and articles, but relationship semantics are still shallow and not fully consistent.

## Open Data / Export Direction

`export.html` and `export.js` focus the intended open-data model on the active content collections:

- `communityPlaces`
- `news`
- `history`

`heritage.json` now exports a top-level JSON-LD object with `@context` and `@graph`. Firebase remains the practical database, while this export is the semantic/open-data layer for reuse outside the website.

Current export behavior:

- `communityPlaces` records export as `schema:Place` nodes.
- `news` and `history` records export as `schema:Article` nodes.
- `communityPlaces.relatedArticles` exports as `schema:subjectOf` links to article nodes.
- `news.relatedPlaces` and `history.relatedPlaces` export as `schema:about` links to place nodes.
- Legacy `mapPoints` and `mapPolygons` are still preserved as legacy export nodes during the transition only.

Legacy `mapPoints` and `mapPolygons` export should be removed or archived later, after the legacy map admin code is retired.

This is not yet a triplestore or SPARQL system. Later, JSON-LD may be converted into RDF and stored in Apache Jena Fuseki or GraphDB after the website relationship model is stable.

## Legacy Warning

`map.html?admin=true` and the old `mapPoints` / `mapPolygons` code are legacy. They should not be promoted as the main workflow.

Public Search, Map, and Place pages should continue to use `communityPlaces`. Future admin and public relationship work should build on `communityPlaces`, `news`, and `history`, not on old map point records.

## Phased Roadmap

### Phase 2: Add Relationship Fields to Admin Data Model

Add future relationship fields to the community place and article data model carefully, starting with place-to-article and article-to-place references.

### Phase 3: Add Admin Relationship UI

Add relationship editing controls to admin pages. Prefer structured selectors or repeatable reference rows over raw text-only fields.

### Phase 4: Show Related Records Publicly

Display related articles and related places on public record pages. Keep empty relationship sections hidden.

### Phase 5: Normalize JSON-LD Relationships

Improve generated JSON-LD so public place and article pages describe their relationships consistently with stable URLs and `@id` values.

### Phase 6: Improve Open Data / Export Page

Continue refining the `heritage.json` export around `communityPlaces`, `news`, and `history`, and retire legacy map export records when the old map admin code is no longer needed.

### Phase 7: Later RDF / Triplestore Experiment

Optionally convert exported JSON-LD into RDF and test it with Fuseki or GraphDB after the website relationship model is stable.
