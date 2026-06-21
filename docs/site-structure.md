# Alex's Photo Board Site Structure

Alex's Photo Board is becoming a lightweight community heritage website with linked-data potential. The practical site should remain simple: public pages help people find community places and stories, Firebase stores the working content, admin pages provide careful editing workflows, and JSON-LD adds semantic meaning that can later support open-data and RDF experiments.

This document describes the current structure and the preferred direction for relationship-building work. It is not a rebuild plan.

Phase 12 public-account nomination work is functionally verified for the current project stage. Phase 13A and Phase 13B planning are complete. Phase 13C remains paused while rules, navigation, and legacy-route cleanup are clarified.

## Hybrid Heritage Model

Alex's Photo Board is a small hybrid community heritage website. It combines a light Hebridean Connections-style approach to linked community heritage records with a Historic England-style approach to clear public news, history, and story presentation. The site should remain practical, focused, and easy to maintain rather than growing into either a national heritage database or a large multi-record archive.

`communityPlaces` is the main structured heritage record layer and carries the deeper heritage metadata. News and history articles remain lighter narrative records that connect stories to places without requiring every article to become an equally complex heritage record. Map and Search support discovery, while the `heritage.json` JSON-LD export provides the lightweight open-data layer.

New record types should be introduced only when there is a clear practical need. Future RDF or triplestore strength should grow from stable identifiers, good `communityPlaces` records, and clean place/article relationships, not from adding many record types or making every page equally complex too early.

## Local Heritage Listing Direction

Alex's Photo Board is a community heritage record project inspired by Local Heritage Listing practice. It is not an official statutory Local Heritage List and must not claim planning authority or statutory status.

The project should adapt useful Local Heritage Listing principles to its small community setting:

- `communityPlaces` is the central community heritage record layer.
- `place.html` is the public community heritage record page.
- `search.html`, labelled Places in public navigation, is the main discovery page for community place records.
- `map.html` provides spatial discovery of those records.
- `news` and `history` are narrative layers connected to places through stories and articles.
- `heritage.json` is the JSON-LD open-data export layer.
- Stable IDs, reliable location data, source references, clear criteria, and clean relationships are more important than adding many new record types too early.
- `relatedArticles` and `relatedPlaces` should remain core relationship links between records and narratives.

Public nominations are now an active signed-in workflow, but they must not write directly to `communityPlaces`. The public nomination form writes to `placeNominations`, and admin review then approves, rejects, requests more information, or promotes an approved nomination into a published `communityPlaces` record.

Future public and admin wording should use terms such as "community heritage record" and "community-valued place". It should avoid describing the project as an official Local Heritage List, statutory list, or planning authority record.

## Layered Architecture

| Layer | Role | Current implementation | Direction |
| --- | --- | --- | --- |
| Public website layer | Presents places, maps, search, articles, exports, and signed-in nomination/account pages to visitors. | `index.html`, `search.html`, `map.html`, `place.html`, `news.html`, `history.html`, `article.html`, `export.html`, `public-auth.html`, `nominate-place.html`, `my-nominations.html` | Keep public behavior centered on `communityPlaces`, `news`, and `history`, with private nominations kept separate. |
| Firebase content layer | Stores editable content records. | Firestore collections: `communityPlaces`, `placeNominations`, `news`, `history` | Keep Firebase as the practical content database while preserving public/private separation. |
| Admin editing layer | Lets signed-in admins create, review, update, and manage content. | `admin-login.html`, `admin.html`, `manage-community-places.html`, `manage-nominations.html`, `upload-article.html`, `manage-articles.html`, `admin-export.html` | Add relationship editing gradually and safely. |
| Semantic metadata layer | Adds machine-readable meaning to public records. | JSON-LD on place and article pages; stored `jsonld` fields; export generation | Normalize place/article relationships using stable IDs and URLs. |
| Future open-data / RDF export layer | Makes the dataset reusable outside the website. | `export.html` and `export.js` currently download `heritage.json` as JSON-LD with `@context` and `@graph`. | Continue refining clean JSON-LD, then optionally convert to RDF for Fuseki or GraphDB. |

## Current Page Roles

| Page | Purpose | Collection read/write | Main outgoing links |
| --- | --- | --- | --- |
| `index.html` | Homepage and entry point for places, news, and history. | Reads `news` and `history` through `script.js`; also reads external Drupal JSON:API news. | `search.html`, `map.html`, `news.html`, `history.html`, `article.html` |
| `search.html` | Public search and filtering for community place records. | Reads `communityPlaces`. | `place.html?id={id}`, `map.html?lat={lat}&lng={lng}`, `map.html?search={title}` |
| `map.html` | Public map for community places. Legacy map admin editing behind `map.html?admin=true` has been retired. | Reads `communityPlaces`; old `mapPoints` and `mapPolygons` records are no longer part of the active public/admin workflow. | `place.html?id={id}`, `search.html`, `export.html`, page anchors |
| `place.html` | Official public detail page for one community place record. | Reads one `communityPlaces` document. | `map.html`, `search.html`, optional related article URL |
| `news.html` | Public news listing. | Reads `news` through `script.js`; also reads external Drupal JSON:API news. | `article.html?id={id}&type=news`, `article.html?id={id}&type=drupal` |
| `history.html` | Public history listing. | Reads `history` through `script.js`. | `article.html?id={id}&type=history` |
| `article.html` | Public article detail destination page, not a top-level nav tab. | Reads one `news` or `history` document, or an external Drupal article when `type=drupal`. | Main site navigation |
| `export.html` | Public open-data download page, labelled Open Data in navigation. | Reads through `export.js`. | Main site navigation |
| `public-auth.html` | Public account registration/sign-in/sign-out page. | Uses Firebase Auth only. | `nominate-place.html`, `my-nominations.html` |
| `nominate-place.html` | Signed-in public nomination form. | Creates `placeNominations`; does not create `communityPlaces`. | `public-auth.html?next=...`, `my-nominations.html` |
| `my-nominations.html` | Owner-scoped public nomination history page. | Reads owner-scoped `placeNominations`. | `public-auth.html`, `nominate-place.html` |
| `admin-login.html` | Firebase Auth sign-in page for admin workflows. | Uses Firebase Auth only. | Redirects to the requested admin page after sign-in |
| `admin.html` | Protected admin dashboard. | Uses Firebase Auth only. | `manage-community-places.html`, `upload-article.html`, `manage-articles.html` |
| `manage-community-places.html` | Protected admin manager for community place records. | Reads/writes/deletes `communityPlaces`. | `place.html?id={id}`, `map.html?lat={lat}&lng={lng}`, `admin.html` |
| `manage-nominations.html` | Protected admin review and promotion page for nominations. | Reads/updates `placeNominations`; creates `communityPlaces` during approved promotion. | `admin.html` |
| `upload-article.html` | Protected article create/edit page. | Creates and updates `news` or `history`; uploads article assets to Firebase Storage. | `admin.html`, `manage-articles.html` |
| `manage-articles.html` | Protected article management page. | Reads and deletes `news` and `history`. | `upload-article.html`, `admin.html` |
| `admin-export.html` | Protected private admin backup/export page. | Reads `communityPlaces`, `placeNominations`, `news`, and `history`. | `admin.html` |

There is no current `gallery.html` or `upload.html` route in the active site model.

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
- `heritageValue`
- `condition`
- `communityUse`
- `sourceReference`
- `relatedArticle`
- `jsonld`
- `createdAt`
- `updatedAt`

### `placeNominations`

Known current purpose:

- private nomination submission and admin-review records
- public signed-in create only
- owner-scoped public reads through `my-nominations.html`
- admin review and promotion workflow source records

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
- `heritageValue`: optional statement explaining why the place has heritage or community value.
- `condition`: optional current physical condition or preservation status.
- `communityUse`: optional description of current community use or social function.
- `sourceReference`: optional citation, source note, or reference supporting the record.
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

`heritageValue`, `condition`, `communityUse`, and `sourceReference` are optional heritage/open-data fields. Existing records do not require migration and can adopt them gradually. Firebase remains the practical database, while public JSON-LD and `heritage.json` provide the semantic/open-data layer.

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
- Legacy `mapPoints` and `mapPolygons` are no longer included in `heritage.json`.

This is not yet a triplestore or SPARQL system. Later, JSON-LD may be converted into RDF and stored in Apache Jena Fuseki or GraphDB after the website relationship model is stable.

## Legacy Warning

- `mapPoints`, `mapPolygons`, and old `posts` are retired and must not return to the active public or admin workflow.
- `search.html` is the active route for the public page labelled Places.
- `export.html` is the active route for the public page labelled Open Data.
- `article.html` and `place.html` are active destination pages, not primary top-level navigation tabs.
- Drupal/Pantheon remains active for some public `news` and `article` behavior, but it is no longer the core Firebase content model. Treat it as an active-but-legacy dependency that needs a separate keep/isolate/retire decision later.

The old `mapPoints` / `mapPolygons` map admin workflow has been retired. Opening `map.html?admin=true` should no longer enable legacy map editing.

Public Search, Map, and Place pages should continue to use `communityPlaces`. Future admin and public relationship work should build on `communityPlaces`, `news`, and `history`, not on old map point records.

Old `mapPoints` and `mapPolygons` records were manually cleaned before this phase. If any `mapPoints` record still exists, treat it only as legacy/test data, not active website data. The official Anyuan place record now lives at `communityPlaces / old-anyuan-company-community-park`, and the public map should show that Anyuan place from `communityPlaces`, not from `mapPoints`. Do not manually remove any remaining Anyuan `mapPoints` duplicate until the public map has been checked and confirmed to show the equivalent `communityPlaces` record correctly.

Any later Firebase cleanup must be a separate manual data-retention step, not part of code or documentation cleanup phases.

## Future Roadmap

### Phase 7D: Homepage Cleanup for Community Heritage Direction

Clarify the homepage's role as an entry point to community places, local stories, maps, and open heritage data.

### Phase 8A: Local Heritage Criteria Fields

Add a small, well-defined set of criteria and significance fields to the `communityPlaces` model without requiring immediate migration of existing records.

### Phase 8B: `place.html` Local Heritage List-Style Display

Present significance, criteria, evidence, condition, community use, and review information clearly on the public community heritage record page.

### Phase 8C: `manage-community-places.html` Admin Form Upgrade

Add careful admin editing support for the agreed Local Heritage Listing-inspired fields and validation rules.

### Phase 8D: `heritage.json` JSON-LD Field Upgrade

Map the agreed fields into useful, stable JSON-LD while preserving place/article relationships and existing identifiers.

### Phase 8E: About Local Heritage Records Page

Explain what community heritage records are, how the project uses them, and why the site is not an official statutory Local Heritage List.

### Phase 9: Nomination Workflow

Create a separate `placeNominations` submission and admin-review workflow. Public submissions must not directly create or overwrite published `communityPlaces` records.
