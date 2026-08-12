# Project Status Checkpoint

## 1. Purpose

This document is the current project status map for Alex's Photo Board after the Phase 10 engine work, the Phase 11A backup and audit checkpoint, the Phase 11B/11C public information and place-page work, the Phase 12 public-user auth/account source work, the Phase 14 provincial protected heritage pilot, the Phase 15B-1 official marker foundation, and the documentation reorganization.

It is a source-based checkpoint, not proof that every deployed workflow has been tested recently. A page or helper is marked complete only where the repository and recorded project evidence support that conclusion. Firebase was not contacted while preparing this checkpoint.

## 2. Current Active Collections

Active Firebase collections:

- `communityPlaces`: published, public community heritage records.
- `placeNominations`: private nomination submission and admin-review records.
- `news`: public news articles.
- `history`: public local history stories.

Retired collections:

- `mapPoints`
- `mapPolygons`
- old `posts`

The retired collections are not part of the current public, admin, map, or export workflow. References in historical documentation or maintenance notes do not make them active.

## 3. Current Public Pages

| File | Navigation label | Purpose | Collection read | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `index.html` | Home | Main entry point to places, map, stories, news, and open data. | `news`, `history`; also external Drupal JSON:API news | Mostly working | Uses shared public navigation and `script.js`. External Drupal content is an additional network dependency and was not tested in this checkpoint. |
| `news.html` | News | Lists community news articles. | `news`; also external Drupal JSON:API news | Mostly working | Uses `script.js`; article links target `article.html`. Live loading was not tested here. |
| `history.html` | History | Lists local history stories. | `history` | Mostly working | Uses `script.js`; article links target `article.html`. Live loading was not tested here. |
| `get-involved.html` | Get involved | Routes visitors to nominations, map discovery, Places, and guidance. | None | Working | Static public guidance page with real destinations. |
| `criteria.html` | Criteria | Explains community heritage criteria. | None | Working | Static guidance; does not claim statutory designation. |
| `guidance.html` | Guidance | Explains how to prepare and submit a nomination. | None | Working | Static guidance linked to the nomination form and criteria. |
| `map.html` | Map | Displays published community places and an optional authority-neutral Official Heritage layer, and starts coordinate-based nominations. | `communityPlaces`; bundled validated official GeoJSON | Mostly working | `map.js` uses Leaflet and engine map helpers. Community Search and Filters remain separate from the default-off, lazy-loaded Official Heritage layer. Official designation level is record metadata, not a sidebar filter. It does not read `mapPoints`, `mapPolygons`, or `placeNominations`. Requires browser and live-data regression testing before a release. |
| `search.html` | Places | Searches, filters, sorts, and links public place records. | `communityPlaces` | Mostly working | Uses `heritage-engine/search.js`; links to place records and map locations. Requires browser and live-data regression testing before a release. |
| `place.html` | Places | Shows one Local Heritage Record with facts, significance, criteria, sources, relationships, and location. | One `communityPlaces` document | Mostly working | Recently upgraded and uses `heritage-engine/places.js`. Missing fields have public-friendly fallbacks. Full deployed regression testing is still needed. |
| `export.html` | Open Data | Downloads public `heritage.json` JSON-LD. | `communityPlaces`, `news`, `history` | Mostly working | Uses public-safe engine shaping and excludes `placeNominations`. Phase 11A hardened nested private-field filtering; live release testing remains appropriate. |
| `article.html` | News / History destination | Shows one news or history article and related places. | One `news` or `history` document; optional external Drupal article | Mostly working | Uses DOMPurify for rich HTML. Related-place links target public place records. External content and stored HTML remain dependencies. |
| `nominate-place.html` | Reached through Get involved / Map | Submits a public nomination for admin review. | No reads; creates in `placeNominations` | Mostly working | Uses `heritage-engine/nominations.js`. It does not create `communityPlaces`. Live usability depends on deployed rules matching the local model. |
| `about-local-heritage.html` | Linked information page | Explains the community heritage record project and its public/private boundaries. | None | Working | Static orientation page; correctly avoids official statutory status claims. |

All listed public pages use `public-nav.js` except pages that are destinations rather than primary navigation labels. The shared menu contains Home, News, History, Get involved, Criteria, Guidance, Map, Places, and Open Data.

## 4. Current Admin Pages

| File | Purpose | Collection read/write | Status | Safety notes |
| --- | --- | --- | --- | --- |
| `admin-login.html` | Firebase Auth sign-in and safe redirect to an admin page. | Firebase Auth only | Mostly working | Client sign-in exists; effective authorization still depends on deployed rules. |
| `admin.html` | Authenticated dashboard linking the admin workflows. | Firebase Auth only | Mostly working | Provides links for place, article, nomination, and backup work. It is not a substitute for Firestore authorization. |
| `admin-export.html` / `admin-export.js` | Private full-fidelity JSON backups. | Reads `communityPlaces`, `placeNominations`, `news`, `history` | Working | Phase 11A successfully used this workflow. It checks the configured admin UID and clearly labels downloads private. Backups may contain private data and must remain outside the repo. |
| `manage-community-places.html` | Create, edit, list, and carefully delete published place records. | Reads/writes/deletes `communityPlaces` | Mostly working | Protected by auth UI and admin-only Firestore writes in the local rules draft. Delete is intentionally high risk and was not tested here. |
| `manage-nominations.html` | Filter, review, assess, audit, and promote nominations. | Reads/updates `placeNominations`; creates `communityPlaces` during approved promotion | Mostly working | Uses audit, review, and promotion engine helpers. Private fields are excluded from promotion payloads. End-to-end review/promotion should be regression-tested against deployed rules. |
| `manage-articles.html` | List and delete news/history articles. | Reads/deletes `news`, `history` | Mostly working | Delete behavior is destructive and does not by itself guarantee related Storage cleanup. |
| `upload-article.html` | Create or edit news/history articles and upload article HTML/images. | Creates/updates `news`, `history`; writes Firebase Storage | Mostly working | Existing upload workflow is substantial but media rights, source metadata, Storage backup, and orphan cleanup are not a mature unified system. |

## 5. Developer And Test Pages

| File | Role | Status / caution |
| --- | --- | --- |
| `engine-test.html` | Browser test harness for pure engine modules and combined admin helper chains. | Useful and substantial, but not a full Firebase or end-to-end test suite. It should not be linked from public navigation. |
| `maintenance/reports/article-storage-audit.html` | Generated developer report for article Storage review. | Maintenance-only and may expose operational URLs. It should not be linked publicly. |
| `maintenance/audit-article-storage.mjs` | Read-only Firebase Admin audit of article Storage references. | Requires explicit credentials and should run only during an approved maintenance phase. |
| `maintenance/delete-selected-article-files.mjs` | Guarded selective Storage deletion tool. | Destructive only with explicit flags; paused unless separately approved. |
| `scripts/import-community-places.js` | Firebase Admin bulk importer for local place data. | Existing migration/import utility; do not run during ordinary feature work. |

No developer or maintenance page should be added to `public-nav.js` or presented as a public feature.

## 6. Engine Modules

| File | Role | Status | Pages/scripts using it |
| --- | --- | --- | --- |
| `heritage-engine/validation.js` | Shared criteria, status, coordinate, and public/private-field validation helpers. | Implemented and tested by the harness | Imported by nomination, export, audit, review, and promotion modules; directly tested by `engine-test.html`. |
| `heritage-engine/search.js` | Pure public place search, filtering, sorting, option, location, and URL helpers. | Implemented and wired | `search.js`, `engine-test.html` |
| `heritage-engine/maps.js` | Pure coordinate, marker matching, place URL, nomination URL, and map status helpers. | Implemented and wired | `map.js`, `engine-test.html` |
| `heritage-engine/places.js` | Pure public place formatting, relationships, coordinates, status, and JSON-LD helpers. | Implemented and wired; recently extended | `place.js`, `engine-test.html` |
| `heritage-engine/export.js` | Public-safe JSON-LD node and graph shaping for places and articles. | Implemented and wired | `export.js`, `engine-test.html` |
| `heritage-engine/nominations.js` | Public nomination validation and safe `placeNominations` payload shaping. | Implemented and wired | `nominate-place.js`, `engine-test.html` |
| `heritage-engine/audit.js` | Pure review-history entry, trimming, labeling, and summary helpers. | Implemented and wired | `manage-nominations.html`, `engine-test.html` |
| `heritage-engine/review.js` | Pure admin review validation, normalization, and update payload shaping. | Implemented and wired | `manage-nominations.html`, `engine-test.html` |
| `heritage-engine/promotion.js` | Pure approved-nomination validation and public-safe promotion payload shaping. | Implemented and wired | `manage-nominations.html`, `engine-test.html` |

The engine boundary is coherent: Firebase initialization, reads/writes, DOM rendering, Leaflet setup, authentication, and downloads remain in page scripts. Engine modules are pure helper modules and do not write to Firebase.

## 7. Data And Export Model

- Public community search, community map markers, and place detail use `communityPlaces` only.
- The optional Map-only official heritage overlay uses the bundled, validated provincial GeoJSON aggregate; it does not change community search, place detail, nomination, promotion, or export contracts.
- Public article listings and details use `news` and `history`, with an additional external Drupal pathway for some news content.
- Public export reads only `communityPlaces`, `news`, and `history`.
- `placeNominations` remains private/admin-only and is excluded from public JSON-LD.
- Public nominations create documents only in `placeNominations`.
- An admin may promote an approved nomination into `communityPlaces`; engine promotion helpers strip known private/admin fields from the public payload.
- Admin backup files are full-fidelity private exports. The filename patterns are ignored by Git, and the Phase 11A baseline backups are recorded as stored outside the repository.
- Public export uses recursive unsafe-field stripping as defense in depth, including for nested stored JSON-LD data.
- `mapPoints`, `mapPolygons`, and old `posts` must not return to the active map, place, nomination, or export workflow.
- Firestore document backups do not back up Firebase Storage file bytes. Storage needs a separate backup and rights-management plan.
- The local `firestore.rules` matches the intended collection boundary in broad terms, but its own header identifies it as a review draft. Local rules are not proof of what is deployed.

## 8. Current Phase Reality Check

| Practical Phase | Meaning | Actual current status | Evidence from files | What is still missing | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Phase 10 | Engine separation, reusable helper modules | Mostly done | Nine pure modules exist, are imported by page scripts, and are covered by `engine-test.html`. | No automated CI, unit-test runner, coverage report, or recent full browser/Firebase regression record. | Keep the architecture; add tests only when changing behavior. Do not continue extracting for its own sake. |
| Phase 11A | Safe data backup/audit/cleanup checkpoint | Done | Closeout, live backup note, redacted comparison, approval proposal, private backup workflow, and safe counts exist. | No cleanup was approved, which is intentional. Storage bytes were not backed up by Firestore export. | Close this phase and revisit only after an explicit data or Storage decision. |
| Phase 11B | Public guidance / Local Heritage Listing-style pages | Mostly done | `get-involved.html`, `criteria.html`, `guidance.html`, and `about-local-heritage.html` exist and are linked through shared navigation or page routes. | Formal accessibility/content review and deployed-browser regression are not recorded. | Preserve; improve only when content or accessibility evidence calls for it. |
| Phase 11C | Better public place detail page | Mostly done | `place.html`, `place.js`, and `heritage-engine/places.js` provide a Local Heritage Record layout, facts, significance, criteria, sources, links, location, and empty states. | Needs a final deployed/browser regression across records with varied missing fields. | Treat as usable and test before release; avoid more cosmetic iteration now. |
| Phase 11D | Places/search/map discovery | Mostly done | Search/filter/sort/result count, map markers, record links, and map-to-nomination coordinate handoff are implemented against `communityPlaces`. | No automated end-to-end tests; live data and responsive behavior should be regression-tested. | Stabilize with a short release test matrix, then move to relationship integrity. |
| Phase 12 | Public user registration/login | Source-complete; live public-auth workflow partially verified; final release/rules verification still required. | Public account safety model documented; public email/password registration/login/logout implemented; registration form includes display name, relevant local interest, confirm password, and consent checkbox; sign-in is required before nomination submission; signed-in nomination ownership metadata is stored privately on `placeNominations`; `my-nominations.html` provides a read-only owner-scoped view; admin nomination review shows submission account/type; promotion strips ownership/private/admin fields; local Firestore rules support signed-in create plus owner-scoped reads; auth stability hardening added `browserLocalPersistence` and `onAuthStateChanged` waiting; Phase 12E release checklist exists. Verified project evidence includes successful public sign-in, signed-in nomination detection for `alex.home@gmail.com`, at least one signed-in nomination submission, “My nominations” showing that user's own nomination, and admin `manage-nominations` displaying the submitted nomination. | Owner-vs-other-user rules verification; Firebase emulator or controlled deployed rules verification; admin review and promotion regression test after Phase 12 changes; intentional Firebase rules deployment review; final backup before production release. | Treat as source-complete with release verification pending. Do not mark fully released until auth/rules/admin regression checks are completed intentionally. |
| Phase 13 | Media upload, evidence, copyright/source management | In progress | Article uploads use Storage; nominations accept evidence/photo URLs and source fields; Phase 13C now adds URL-only evidence rights metadata around the existing nomination evidence fields. | Broader consent/licensing workflow, file upload policy, retention, Storage backup, moderation, and public display rules still remain incomplete. | Keep Phase 13C narrow and rights-aware before adding any upload behavior. |
| Phase 14 | Ten-record provincial protected heritage pilot and optional Map preview | Complete; production verified | Phases 14A–14F record the official Chinese source transcription, approved project translation and structured location, coordinate research and review, canonical JSON, deterministic valid-empty GeoJSON, and default-off Map overlay. Production at merge `220a8e7905c9813b8e543bbe2c5538ec11fe4a53` was verified with five existing community markers, zero provincial markers, the expected valid-empty message, and no application-owned console errors or warnings. | The source document number remains pending direct verification. All ten records remain non-renderable and withheld; the public non-map list and expansion readiness are deliberately deferred. | Preserve the valid-empty result and provenance boundaries. Address source-number verification as bounded maintenance; undertake the non-map list and then expansion readiness only through separately approved work. |
| Phase 15B-1 | Generalized official heritage marker model and bounded Xinyu pilot | Complete; merged and production verified | Adds a separate reviewed public-location decision layer and deterministic aggregate without altering the protected Phase 14 outcomes. The aggregate joins eleven official records and publishes one reviewed approximate compound-reference marker for 新余孔庙; all ten Phase 14 records remain excluded. | 飨褒堂 remains excluded because no independently defensible WGS84 locality reference and radius passed the publication gates. The public non-map list and wider expansion remain deferred. | Preserve the verified data, validation, marker meanings, popup semantics, and publication gates. |
| Phase 15B-2 | Heritage Explorer Layers-tab UI architecture | Complete; merged and production verified | Replaces the temporary overlay toggles with an accessible fourth tab in the existing Heritage Explorer for the community and provincial layers. The Map retains the original two-column page width, and the separate Leaflet control retains basemap choices only; community remains on by default and official heritage remains off and lazy-loaded. | No new data, filters, geometry, or official-list product was included. | Preserve the merged tab, basemap-only Leaflet control, default layer states, and lazy official loading. |
| Phase 15B-3 | Community category icons and Map visibility controls | Complete; merged in PR #55 and production verified | Uses `assetType` first and the legacy `category` field only as a presentation fallback. Five controlled blue marker symbols and tri-state Layers controls affect Map visibility without changing Search, Filters, URLs, Firebase records, exports, nominations, promotion, or official markers. Unknown and ambiguous values use the fallback symbol; no stored-data migration occurred. | No official category controls or stored-data migration were included. | Preserve the verified community presentation and Map-only control behavior. |
| Phase 15B-4 | Bounded Xinyu official marker expansion | Complete; merged in PR #56 and production verified | Extends the Xinyu companion source to five records and adds four separately reviewed public-location decisions. The deterministic aggregate joins fifteen records, publishes five WGS84 Points, excludes ten records, and preserves the ten protected Phase 14 source outcomes. PR #56 was merged using a merge commit, resulting in `main` HEAD `ecdf29198cdd430272cbfce2b9ababb43f99f802`. Post-merge verification and the Pages build and deployment passed; production is live with the five approved official markers, and the official layer remains off by default. Community behavior, Search, Filters, and category controls remain unchanged by that merged expansion. | Non-Point geometry, wider record levels, and Group B candidates remain out of scope. | Preserve the verified five-marker result, default-off official layer, publication semantics, and unchanged community discovery behavior. |
| Phase 15B-5 | Official category glyphs and Map visibility controls | Complete; merged in PR #58 and production verified | Uses exact non-empty `officialCategoryZh` values to assign controlled English project-presentation labels and static orange glyphs. Controls are created only from validated published features, so source records without approved public locations do not appear in category controls or counts. Filtering is page-session Map visibility only; it preserves lazy loading, cached validated features, URLs, map bounds, community categories, Search, Filters, source values, public-location decisions, and the GeoJSON schema. PR #58 was merged using a merge commit, resulting in `main` HEAD `fbf029abb7ab5d69f72f5d4619b8cdcf8a1eb817`; post-merge verification and the Pages build and deployment passed, and production is live. | The official layer remains off by default. Enabling it displays exactly five official markers: three Ancient buildings, two Important modern historic sites, and no Archaeological sites category. Category state persists during the current page session; community markers and category controls, Search, and Filters remain unchanged. Keyboard activation works for official markers, and no application-owned console errors were recorded. Geometry-schema work was deferred at this phase boundary and is now tracked separately as Phase 15C-1. | Preserve the verified presentation-only behavior; keep Phase 15C schema work and any PR 5B rendering separately bounded. |
| Phase 15C-1 / PR 5A | Official heritage geometry schema and validation foundation | Complete; merged in PR #60 and production verified | Adds pure validation for Point, LineString, MultiLineString, Polygon, and MultiPolygon structures; controlled geometry meaning, provenance, precision, uncertainty, compatibility, and accessible presentation labels; generator validation; atomic publication validation; and a separate Point-only production-renderer gate. Schema version `2.0.0`, all existing public-location decisions, and the generated five-Point output remain unchanged. PR #60 merged using a merge commit, resulting in `main` HEAD `ab3128b958a1f3fb155f101a89a24ce2226aa739`; post-merge verification run `30355339498` and Pages build and deployment run `30355337278` passed, and production is live. | At that phase's production verification, the official layer remained off by default and enabling it displayed exactly five official Point markers. Official category controls remained functional; five community markers, Search, Filters, and community category controls were unchanged; and no line, polygon, or area geometry or application-owned console warning/error appeared. Phase 15C-2 subsequently implemented and production-verified the separately bounded renderer without publishing real non-Point geometry. | Preserve the verified schema foundation and Point-only production boundary. Keep future geometry publication separately approved. |
| Phase 15C-2 / PR 5B | Official heritage line and area rendering | Complete; merged in PR #62 and production verified | Adds a frozen meaning-to-style matrix and one Leaflet layer per validated feature for Point, LineString, MultiLineString, Polygon, and MultiPolygon. Points retain their existing markers. Non-Points receive controlled orange solid/dashed outlines and restrained fills, one accessible button target per feature, Enter/Space and pointer popup activation, safe provenance and limitation wording, feature-level category counts, cached page-session filtering, and atomic failure. Synthetic fixtures cover reviewed and approximate lines and boundaries, generalized and uncertainty areas, multi-part geometry, and official/project provenance. PR #62 merged using a merge commit, resulting in `main` HEAD `7354de5cb349a68a3676643b059b59382edb4f31`; post-merge verification run 323 and Pages build and deployment run 368 passed. | Production is live. The generated production GeoJSON remains byte-for-byte unchanged, and the generated result remains 15 records, 5 Point features, 10 exclusions, 0 errors, and `valid`. The official layer remains off by default; enabling it displays exactly five official Point markers, and no real line, polygon, area, or other non-Point geometry is visible yet. Official category controls remain functional: disabling Ancient buildings leaves the two modern historic-site markers and puts the parent control into the expected mixed state, while restoring Ancient buildings returns all five official markers. Five community markers remain visible; Search, Filters, and community category controls remain unchanged; and no application-owned browser warnings or errors were recorded. No real-geometry implementation PR has started. | Preserve the verified Point-only production dataset and bounded renderer behavior; do not publish real non-Point geometry without separate approval. |
| Phase 15C-3 | First real official geometry candidate audit | Historical; superseded | Applied the original strict evidence gate and withheld every audited Xinyu candidate. It identified Xieli as the strongest candidate but did not treat the source datum or boundary construction as sufficiently resolved. | No production data, generated output, application behavior, or tests changed. | Preserve as the initial audit trail; use the standalone official-record publication policy for current decisions. |
| Phase 15C-4 | Xinyu mixed-geometry re-audit | Historical; superseded | Re-audited the candidates using an explicit project-reference standard and recommended one Xieli generalized reference area under its then-current letter classification. | Documentation only; production remained at five Point features and no real non-Point geometry. | Preserve as the policy-transition record; its classification scheme and single-record batch are superseded by Phases 15C-6 and 15C-7 and the standalone policy. |
| Phase 15C-5 | Xiabu one-record geometry pilot | Evidence review complete; implementation not approved | Reconciles the Gaode, Baidu, and Google evidence; records the plaque transcription linking the public POI to 暴动举行地旧址; and recommends a provisional component-reference Point with documented uncertainty while rejecting Polygon, MultiPolygon, Point plus shape, and outline tracing. | Xiabu remains only a proposed future batch candidate. No production record, Point, shape, generated output, or application behavior changed. | Treat this as the detailed Xiabu evidence record. Do not implement or publish Xiabu without explicit approval. |
| Phase 15C-6 | Official-record publication policy and batch plan | Historical policy-development and batch-planning record | Consolidated the historical audits and Xiabu pilot, developed the five-outcome model, and recorded the bounded proposed future batch and per-record limitations. The reusable policy now lives in the standalone official-record publication policy. | Planning and documentation only. Production remains unchanged and Point-only. | Preserve the complete historical plan; use the standalone policy for current decisions. Any implementation or publication requires new explicit approval. |
| Phase 15C-7 | Xieli misleading-risk decision | Historical research recommendation; implementation not approved | Compares the theoretical 60 × 60 m generalized area, a 500 m uncertainty area, a generalized Point, and withholding at realistic zoom levels. Rejects both area representations and preserves its conditional generalized-reference-Point recommendation as historical reasoning. | Phase 15C-16 later found Xieli potentially suitable in principle but not eligible under its prior gate: the source datum and a reproducible generalized-location method remained unresolved, and the earlier 500 m value could not stand in for unknown-CRS stress testing. | Preserve both historical results. Phase 15C-18 now applies Phase 15C-17 to Xieli; keep it unpublished pending the separately approved technical and owner gates. |
| Phase 15C-8 / PR #68 | Complete Xinyu Official Heritage Point re-audit | Historical research baseline; merged and production verified | Reconciles all 22 official provincial-register record/component rows, 21 distinct displayed designation names, the two parent/component complications, six then-current Xinyu machine records, five then-current public-location decisions, and five then-current production Points. Applies the controlling natural-form, future non-Point, Point-readiness, operational-outcome, and PR #69 routing fields to every row. | Its P19 recommendation was later implemented with N07 in merged PR #69. Its conditional Xieli route remains historical evidence and was superseded by the Phase 15C-16 candidate-specific outcome under the prior gate. | Preserve the audit trail. Phase 15C-17 itself changes no candidate status; Phase 15C-18 records the new all-55 eligibility decision. |
| Phase 15C-9 / PR #69 | Xiabu uprising-site component Point | Historical first draft implementation; not deployed | Adds canonical component record `JX-XY-PCH-018`, its reviewed public-location decision, deterministic provider reconciliation, generated Point `[114.995570, 27.667620]`, 150 m uncertainty, component-reference presentation, tests, and publication documentation. | The original P19 commit remains preserved in PR #69 history. The parent, meeting-site component, Xieli, all non-Point geometry, and Community Heritage remain unchanged or unpublished. | Preserve as the first implementation step; current PR #69 scope is recorded in Phase 15C-14. |
| Phase 15C-10 / PR #70 | Complete 2025 Xinyu national/provincial/municipal list audit | Historical research baseline; merged and production verified | Transcribes and reconciles all 62 official rows/separately named components across all three levels, records 58 designation identities and 62 proposed public identities, searches every identity on Gaode and Baidu, classifies Point readiness, and inventories 29 future non-Point candidates—8 lines and 21 areas—without drawing geometry. | The audit itself left five production Points unchanged. P19 was later published with N07 in PR #69; P20 and Xieli still need evidence. P19 and P20 remain point-like building components for which future non-Point representation is unnecessary. | Preserve the merged evidence baseline. Do not treat provider search results or the candidate register as implementation approval. |
| Phase 15C-11 / PR #71 | Xinyu fallback Point evidence audit | Research documentation complete; merged and production verified | Constructs a reproducible 39-identity union and applies the current publication gates. Owner-supplied N07 Gaode/Baidu screenshots confirm exact cross-provider identity, locality, a specific point-like physical building/site, and provider-hosted photographic agreement. N07 passes the provider-feature gate, but has no approved numerical project-reviewed Point, CRS chain, reconciliation, risk review, or publication approval. | All 39 remain Withhold pending evidence and the ordered addition list for paused PR #69 remains empty. The screenshots are not committed. No runtime, data, schema implementation, generated GeoJSON, rendering, Community Heritage, Firebase, deployment, or production change. | Preserve this historical evidence baseline. PR #72 fulfilled its policy dependency; Phase 15C-13 is the separately approved bounded re-evaluation. |
| Phase 15C-12 / PR #72 | Provider-located project-reviewed Point policy clarification | Documentation complete; merged and production verified | Clarifies that a reproducible project digitization may satisfy the existing numerical Point requirement after a mapped provider identifies and corroborates a specific heritage feature. It separates feature identification, numerical construction, and publication approval; documents accepted methods and prohibited substitutes; and preserves existing Point meanings plus `project-reviewed-interpretation` status. | The clarification itself digitized or approved no coordinate. It authorized only the later bounded re-evaluation and left runtime, data, schema implementation, generated GeoJSON, rendering, Community Heritage, Firebase, deployment, production, and PR #69 unchanged. | Preserve the merged policy baseline and apply it only in separately approved evidence work. |
| Phase 15C-13 / PR #73 | Six-candidate provider-located Point digitization audit | Research documentation complete; merged and production verified | Re-evaluates exactly N03, N07, N08, P22, M23, and M30. It records one reproducible N07 project-reviewed WGS84 reference Point recommendation at `[115.011333, 27.805882]` with `100 m` uncertainty, and withholds the other five because their legitimate numerical or feature-meaning gates remain unresolved. | The audit itself published nothing. Its ordered future proposal was `P19, N07`; separate approval later implemented and published that exact PR #69 scope. | Preserve the evidence record and keep the five withheld candidates unpublished. |
| Phase 15C-14 / PR #69 update | Approved two-record Xinyu Point batch | Complete; merged and production verified | Retains provincial P19 and adds national record `JX-XY-NCH-007`, its provider-located project-reviewed public-location decision, deterministic GCJ-02/WGS84 chain, explicit representation status, popup limitation wording, tests, and current documentation. The canonical source/output and public interface are authority-neutral; the legacy provincial URL is a truthful six-Point compatibility output. | Production is 17 records, 7 Point features (1 national, 6 provincial), 10 exclusions, zero errors; category totals are 3 Ancient buildings and 4 Important modern historic sites. No line/area geometry, Community Heritage, Firebase, Xieli, Xiabu parent/sibling, or withheld candidate was added. | Preserve the verified seven-Point baseline and its authority-neutral aggregate plus provincial compatibility output. |
| Phase 15C-16 | Generalized reference Point eligibility audit | Historical-policy research record; implementation not approved | Distinguishes coordinate uncertainty from deliberate spatial generalization, applies the then-current ten-gate test to all 55 unpublished public identities, and shortlists only Xieli Site and Qipanshan Site. | Under that gate, neither candidate was eligible; both received outcome B and the future implementation batch was empty. Phase 15C-17 does not change those historical outcomes. | Preserve the zero-eligible historical result. Phase 15C-18 separately records candidate eligibility under the revised gate. |
| Phase 15C-17 | Generalized reference Point policy recalibration | Current candidate-neutral policy; documentation only | Permits a bounded, useful support area or a controlled multi-datum envelope to serve as the reproducible basis for a Generalized reference Point while preserving strict identity, locality, sensitivity, comprehension, review, one-active-representation, and publication gates. Defines R1–R13, method decisions, A–E outcomes, and the separate numerical concepts. | Evaluates no candidate and leaves the Phase 15C-16 zero-eligible result historically unchanged. At that phase boundary the schema could not record every required concept separately. | Phase 15C-18 completed the all-55 rescreen and Phase 15C-19 implements the technical gap without publishing a candidate. |
| Phase 15C-18 / PR #76 | Complete-universe Generalized reference Point reassessment | Documentation research complete; merged and production verified | Individually reassesses all 55 then-unpublished identities under R1–R13, reopens every prior exclusion category, advances nine identities to Stage 2, and records A/B/C/D/E totals of `1/8/36/10/0`. P04 Xieli is the sole Outcome A, using a bounded support-area and controlled WGS84/CGCS2000 interpretation with a rounded research representative and 50 m support coverage. | The audit published and implemented nothing; eight B identities retain named evidence gaps. P04 was later separately approved and published by PR #78. | Preserve the research outcome and the separate later publication history. Phase 15C-19 supplies the technical prerequisite; every other candidate still requires candidate-specific evidence and owner approval. |
| Phase 15C-19 / PR #77 | Generalized reference Point publication contract | Complete; merged and production verified | Extends the existing geometry schema, generator, renderer, popup, and accessible presentation with a reusable structured contract, separated spatial quantities, public-safe provenance, mandatory plus additive limitations, accountable review, active representation, and supersession history. Synthetic non-Xinyu tests cover the complete path. | Publishes no candidate and leaves the seven ordinary Points, ten exclusions, zero Generalized Points, and zero real lines/areas unchanged. | Preserve the merged technical foundation. Candidate publication still requires separate approval and review. |
| Phase 15C-20 / PR #78 | First Generalized Point publication | Complete; merged and production verified | Adds stable Xieli identity `JX-XY-PCH-004`, one approved Generalized-Point decision at `[114.9198, 27.7626]`, the complete Phase 15C-19 contract, 50 m outward support coverage, hollow-diamond count presentation, deterministic outputs, and candidate-specific tests and documentation. | Production contains 18 source records, eight Point features—seven ordinary and one Generalized—ten exclusions, one national and seven provincial, and zero lines/areas. P04 is the sole addition. | Preserve the verified Xieli publication and require separate evidence and approval for every later candidate. |
| Phase 15C-21 / PR #79 | Complete ordinary-Point-route candidate audit | Documentation research complete; merged and production verified | Reviews exactly the 25 Phase 15C-18 ordinary-Point-route identities and records A/B/C/D totals of `0/11/0/14`. Eleven retain a plausible Point route with named evidence gaps; fourteen remain withheld. | Publishes nothing, creates no batch, and leaves the eight-Point production baseline and all three production files unchanged. | Preserve the zero-ready baseline. Phase 15C-22 is the separately authorized investigation of its 11 Outcome B identities. |
| Phase 15C-22 / PR #80 | Eleven-candidate ordinary Point evidence investigation | Documentation research complete; merged and production verified | Investigates exactly the 11 Phase 15C-21 Outcome B identities and records A/B/C/D totals of `1/10/0/0`. M13 魁星阁 is research-ready at project-derived WGS84 `[114.937158, 27.797890]` with 30 m uncertainty; the other ten retain named gaps. | Research eligibility only. It publishes nothing, creates no batch, and leaves all production files and counts unchanged. | Preserve its evidence result. M13 publication belongs only to the separately approved Phase 15C-23 proposal. |
| Phase 15C-23 / PR #81 | Kuixing Pavilion ordinary Point publication | Complete; merged, closed, automatically deployed, and production verified | Revalidates M13's named OSM building footprint and distinct P10 compound, reproduces its centroid, and adds stable municipal identity `JX-XY-MCH-013` with one ordinary WGS84 `heritage-building-reference-point` at `[114.937158, 27.797890]` and 30 m uncertainty. | Production contains 19 records, nine Points—eight ordinary plus Xieli—ten exclusions, one national/seven provincial/one municipal, and zero lines/areas. Provincial compatibility remains seven Points and excludes municipal M13. The verified merge commit is `e215ae15f7851ba4d0a4b8ae416423c42543b164`. | Preserve the M13-only scope and verified production state. Require separate owner approval for every later candidate or geometry. |
| Phase 15C-24 / PR #83 | First real Official Heritage shape candidate investigation | Complete; merged as `a178a682699708e08fb5944bb4effc46be468962` | Reconciles exactly 8 line and 21 area candidates, preserves A/B/C/D totals of `0/10/1/18`, and finds no research-ready first production shape. P09 蓉泉桥 remains Outcome B and the strongest historical line lead, but the owner will retain its existing Point and not prioritize LineString publication. | Publishes nothing; production remains 19 records, nine Points, ten exclusions and zero lines/areas. No runtime, sidebar, provider, Firebase, Community Heritage or deployment change. | Preserve the owner decision and the exact nine-candidate follow-up boundary. |
| Phase 15C-25 / PR #84 | Nine remaining shape-candidate deep investigation | Complete; merged, closed, automatically deployed, and production verified | Investigates exactly `N01, N02, P01, P02, P12, P16, M01, M04, M31`; final A/B/C/D totals are `0/9/0/0`. M31 is the strongest new lead, but its compressed authority-plan copy does not support a reproducible WGS84 shape and reuse/disclosure remain unresolved. | Publishes nothing; production remains 19 records, nine Points, ten exclusions and zero lines/areas. P09 and P04 are not reopened; no infrastructure or deployment change. The verified merge commit is `48602d8968a977d90142cd97b8d5d7a20603dc0f`; post-merge workflow `31548778269` and Pages deployment `31548777800` succeeded, and production returned HTTP 200. | No first production shape candidate is research-ready or preferred. Require a separate owner-approved phase if new original/raw spatial evidence emerges. |
| Official Heritage spatial policy and roadmap | Current controlling documentation | Defines five simplified public types, evidence-led natural forms, one active public representation per identity, authority-versus-project representation status, rejection gates, provider-located ordinary Point evidence, the recalibrated Generalized reference Point gate, and future sidebar/filter logic. Records completed work and the ordered whole-universe reassessment, lifecycle, interface, first-shape, context, and later-batch work. | Phase 15C-1 / PR #60 validation and Phase 15C-2 / PR #62 mixed-geometry rendering are production verified. Phase 15C-19 supplies the Generalized Point technical contract, and Phase 15C-20 / PR #78 publishes the first verified Generalized Point. No real line or area is published. | Preserve the Phase 15C-18 and Phase 15C-21 evidence outcomes; require separate evidence and owner approval for every later publication. |
| Phase 15 | Testing/staging/deployment/rollback | Partly done | Pure-helper browser harness, manual phase checks, Git workflow, and GitHub Pages deployment history exist. | No staging environment, automated CI, release checklist, smoke suite, rollback procedure, or deployed-rules verification record tied to releases. | Make this one of the next structural priorities. |
| Phase 16 | Configuration system for other towns/cities | Not started | Some location helpers and generic place fields are reusable. | Tenant/config model, branding/content configuration, collection isolation, security model, onboarding, and migration strategy. | Do not begin before current single-site workflows are tested and documented. |
| Phase 17 | Installation/admin/support documentation | Partly done | Docs index, site structure, engine README, import notes, maintenance notes, and phase closeouts exist. | No concise installation guide, environment inventory, admin operating manual, troubleshooting guide, support policy, or recovery playbook. | Build after deployment/testing conventions are settled. |

### Actual Current Phase

The project is past architecture setup and safe-audit work. Its public place,
search, map, article, nomination, review, promotion, export, and public-user
auth/account pathways are implemented, though release assurance remains an
ongoing responsibility. The official layer remains off by default. Enabling it
displays exactly nine official Point markers in live production: eight
ordinary Points and one Generalized reference Point, comprising one national,
seven provincial, and one municipal record. The canonical production dataset
contains 19 source records and ten exclusions. No real line, polygon, area, or
other non-Point geometry is visible. Community Heritage remains Point-based
and unchanged.

Phase 15C-1 / PR #60 and Phase 15C-2 / PR #62 are already merged and
production verified. They provide the multi-geometry validation foundation and
synthetic-fixture-tested line and area renderer. They have not published real
non-Point geometry or implemented the newly approved
one-active-representation lifecycle.

Phase 15C-19 / PR #77 is also merged and production verified. It supplies the
candidate-neutral Generalized-Point contract while leaving live data unchanged.
Phase 15C-20 / PR #78 is merged and production verified. It established the
historical 18-record, eight-Point baseline: seven ordinary Points and the first
hollow-diamond Generalized Point, P04 Xieli. Phase 15C-21 / PR #79 is
merged and production verified; it audits the complete 25-identity
ordinary-Point route without publishing it and finds no Outcome A. Phase
15C-22 / PR #80 is merged and production verified; it investigates only its 11
Outcome B identities, advances M13 to research-ready status, retains ten B
identities, and publishes nothing. Phase 15C-23 / PR #81 is the later separate
M13-only implementation. It is merged and closed at
`e215ae15f7851ba4d0a4b8ae416423c42543b164`, automatically deployed through
GitHub Pages, and production verified. M13 is now live as the first municipal
publication; Xieli remains the sole Generalized Point, and lines and areas
remain at zero.

Phase 15C-3 is preserved as the historical strict audit, Phase 15C-4 as the
historical mixed-geometry re-audit, Phase 15C-5 as the authoritative detailed
Xiabu evidence record, Phase 15C-6 as the historical policy-development and
batch-planning record, and Phase 15C-7 as the separate research-only Xieli
misleading-risk decision. Phase 15C-8 is the historical canonical complete
provincial Point re-audit: it reviews all 22 provincial register
rows/components and records the five-Point production baseline that existed at
the time. It proposed Xiabu's 暴动举行地旧址 component for PR #69 and excluded
Xieli while preserving its then-conditional generalized-Point-only research
result. The
Phase 15C-10 documentation audit expands research coverage to all 62 national,
provincial, and municipal rows/separately named components. It does not alter
the Phase 15C-8 decision, and its broad non-Point register does not authorize
implementation. Phase 15C-11 then tests the 39-identity union of
provider-confirmed and plausible future line/area candidates against the
minimum Point gate. Owner-supplied N07 evidence first confirmed a
provider-located point-like physical candidate. Merged Phase 15C-12 / PR #72
then defined the reproducible provider-located project-digitization route under
the existing gates. The merged Phase 15C-13 audit re-evaluates exactly N03,
N07, N08, P22, M23, and M30. It records one Point-ready N07 research
recommendation and five withheld outcomes; it publishes nothing and does not
alter PR #69 itself. Its proposed `P19, N07` batch was subsequently approved,
merged, and production verified; the five other candidates remain withheld.
Phase 15C-16 then applied its strict generalized-reference-Point eligibility
test to all 55 unpublished public identities. It shortlisted Xieli and
Qipanshan but found neither presently eligible, leaving the future batch empty.
That result remains historically valid under the gate it applied. Phase
15C-17 subsequently recalibrates the future gate so a bounded and useful
support area or controlled multi-datum envelope can be a reproducible basis;
it evaluates no candidate and changes no earlier outcome. Phase 15C-18 then
separately completes the whole-universe reassessment of all 55 unpublished
identities without a predetermined shortlist. It records one A, eight B, 36 C
and ten D outcomes, proposes only P04 Xieli for a future publication review,
and publishes nothing. The
standalone Official Heritage spatial
representation and publication policy is the sole controlling current
authority and removes simultaneous active Point-and-shape publication from the
approved direction. P19 and N07 are published; the Xiabu parent and
meeting-site component and Qipanshan remain unpublished. Xieli is now the sole
published Generalized Point. The practical
position is: **Phase 15C-2 / PR #62 remains the renderer baseline; PR #69
establishes the seven-ordinary-Point baseline; PR #78 adds the separately
approved and verified Xieli Generalized Point; the merged audits preserve the
evidence gates; and Phase 15C-21 finds zero publication-ready ordinary Point
candidates at its complete-universe audit boundary. Phase 15C-22 later advances
only M13 to research-ready status, without publishing it or creating a batch;
Phase 15C-23 / PR #81 later publishes only M13 and is production verified.**

## 9. Stop / Pause List

| Stop / pause item | Why to stop | When to revisit |
| --- | --- | --- |
| More Phase 11A cleanup docs | Phase 11A already produced backup, audit, approval, and closeout records. More cleanup documents would slow feature development. | When a specific live record or Storage cleanup action is explicitly approved. |
| UI polish unless blocking | Current pages are usable enough and recent place-page work already improved hierarchy and empty states. | When user testing finds a comprehension, accessibility, or responsive-layout blocker. |
| Data deletion or live data cleanup | Backup/audit is complete, but no deletion or live polish action was approved. | Only after record-specific user approval and a rollback plan. |
| Branch/phase over-fragmentation | Too many small phase labels obscure the practical product state. | Use broader, outcome-based phases with a clear acceptance checklist. |
| Repeated structure maps | `docs/site-structure.md`, `docs/README.md`, and this checkpoint already cover orientation. | Update an existing current document only when architecture actually changes. |
| Rebuilding existing pages from scratch | Most public pages already have working structure and real data routes. Replacement would create regression risk without solving the main gaps. | Only if testing proves an existing workflow cannot be repaired incrementally. |
| Reading `docs/archive` by default | Archived documents are historical working records, not current instructions. | When a named past decision must be traced. |
| More engine extraction without a concrete reuse case | The current engine boundary is already broad and coherent. Extraction alone does not improve user workflows. | When duplicated rules or a new consumer justify a focused module change. |
| Public accounts | Accounts add privacy, moderation, recovery, and support obligations without a proven immediate need. | After a documented user need and security/privacy design exist. |
| Additional provincial coordinates, Map features, or records beyond the bounded Xinyu set | Further candidates may require non-Point geometry, component modelling, locality resolution, or a separately reviewed evidence threshold. | Only after material new evidence and a separately approved bounded scope. |

## 10. Approved Official Heritage sequence

The current sequence is maintained in the
[Official Heritage mixed-geometry roadmap](./plans/official-heritage-mixed-geometry-roadmap.md):

1. preserve completed policy, Point re-audit, and complete-list evidence work;
2. preserve the merged and production-verified `P19, N07` PR #69 batch;
3. preserve the completed documentation-only fallback Point audit;
4. preserve the merged documentation-only clarification of the existing
   project-reviewed digitization policy;
5. preserve the completed re-evaluation of N03, N07, N08, P22, M23, and M30,
   including the N07 Point-ready recommendation and five withheld outcomes;
6. preserve the completed Generalized reference Point eligibility audit and
   its zero-eligible, empty-batch result;
7. preserve the candidate-neutral Phase 15C-17 recalibration without changing
   any historical candidate outcome;
8. preserve the Phase 15C-18 all-55 reassessment, its `1/8/36/10/0` outcome
   totals, sole P04 evidence-eligibility result, and no-publication boundary;
9. preserve the merged Phase 15C-19 structured Generalized-Point contract;
10. preserve the merged and production-verified P04-only PR #78 publication;
11. preserve the Phase 15C-21 audit of all 25 ordinary-Point-route identities
    and its `0/11/0/14` result;
12. preserve the Phase 15C-22 investigation of exactly its 11 Outcome B
    identities, the `1/10/0/0` result and the no-publication boundary;
13. preserve the completed, merged, and production-verified M13-only Phase
    15C-23 / PR #81 publication; and
14. preserve the merged Phase 15C-24 29-identity shape investigation, its
    `0/10/1/18` result and zero-candidate publication batch;
15. preserve the Phase 15C-25 deep investigation of exactly nine remaining
    Outcome B area candidates, its `0/9/0/0` result and no-preferred-candidate
    conclusion; and
16. consider every other candidate, line, area, and context layer separately.

No later production PR is assigned by this research; relative order and
approved policy scope are unchanged.

## 11. Current bounded activity

### Phase 15C-23 Kuixing Pavilion Point publication — complete PR #81

Preserve the verified 19-record, nine-Point, ten-exclusion production baseline.
PR #81 published only M13 as one ordinary municipal Point and is merged,
closed, automatically deployed, and production verified. Xieli remains the
sole Generalized Point; provincial compatibility remains seven Points and
excludes M13; lines and areas remain at zero. The ten Phase 15C-22 Outcome B
records remain unpublished. Do not investigate or publish another identity,
add a line or area, change provider APIs, or modify Community Heritage or
Firebase without separate owner approval.

### Phase 15C-24 first real shape candidate investigation — complete PR #83

Preserve the research-only 8-line/21-area reconciliation and its `0/10/1/18`
outcome. No first production shape candidate is currently research-ready.
Rongquan Bridge remains Outcome B and the strongest historical line lead, but
the owner directs that it retain its existing Point and not be prioritized for
LineString publication. The future active deep-investigation queue is exactly
`N01, N02, P01, P02, M01, M04, P12, P16, M31`; none is approved or preferred,
and its separate deep investigation is recorded by Phase 15C-25. Production
stays at 19 records, nine Points, ten exclusions, zero lines and zero areas.

### Phase 15C-25 nine-shape-candidate deep investigation — complete PR #84

Preserve the exact nine-candidate reconciliation and `0/9/0/0` result. No first
production shape candidate is research-ready after Phase 15C-25. M31 is the
strongest newly discovered spatial-evidence lead but is not preferred or
Outcome A: obtain the original/raw authority plan, reproducible WGS84 path,
clear reuse and grave/access decision before reconsideration. PR #84 merged,
closed, deployed automatically, and was production verified at
`48602d8968a977d90142cd97b8d5d7a20603dc0f`; workflow `31548778269` and Pages
deployment `31548777800` succeeded, and production returned HTTP 200. Do not
publish or supersede a representation, reopen P09/Xieli, redesign
infrastructure, deploy manually, or begin a publication implementation PR.
