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
| `map.html` | Map | Displays published community places and an optional provincial protected heritage reference layer, and starts coordinate-based nominations. | `communityPlaces`; bundled validated official GeoJSON | Mostly working | `map.js` uses Leaflet and engine map helpers. Community Search and Filters remain separate from the default-off, lazy-loaded official layer. It does not read `mapPoints`, `mapPolygons`, or `placeNominations`. Requires browser and live-data regression testing before a release. |
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
| Phase 15B-4 | Bounded Xinyu official marker expansion | Committed and pushed; draft PR #56 open; verification passed | Extends the Xinyu companion source to five records and adds four separately reviewed public-location decisions. The deterministic aggregate joins fifteen records, publishes five WGS84 Points, excludes ten records, and preserves the ten protected Phase 14 source outcomes. The implementation is pushed to `codex/xinyu-official-marker-expansion`, and both push and pull-request verification passed. | PR #56 remains unapproved, unmerged, and undeployed; production on `main` is unchanged. Official category filters, non-Point geometry, wider record levels, and Group B candidates remain out of scope. | Keep PR #56 as a draft until explicit approval; do not merge or deploy without separate approval. |
| Phase 15 | Testing/staging/deployment/rollback | Partly done | Pure-helper browser harness, manual phase checks, Git workflow, and GitHub Pages deployment history exist. | No staging environment, automated CI, release checklist, smoke suite, rollback procedure, or deployed-rules verification record tied to releases. | Make this one of the next structural priorities. |
| Phase 16 | Configuration system for other towns/cities | Not started | Some location helpers and generic place fields are reusable. | Tenant/config model, branding/content configuration, collection isolation, security model, onboarding, and migration strategy. | Do not begin before current single-site workflows are tested and documented. |
| Phase 17 | Installation/admin/support documentation | Partly done | Docs index, site structure, engine README, import notes, maintenance notes, and phase closeouts exist. | No concise installation guide, environment inventory, admin operating manual, troubleshooting guide, support policy, or recovery playbook. | Build after deployment/testing conventions are settled. |

### Actual Current Phase

The project is past architecture setup and safe-audit work. Its public place, search, map, article, nomination, review, promotion, export, and public-user auth/account pathways are implemented, though release assurance remains an ongoing responsibility. Phase 14A–14F are complete for the approved ten-record provincial protected heritage pilot. The Phase 15B-1 official marker foundation, Phase 15B-2 Heritage Explorer Layers tab, and Phase 15B-3 community category icons are merged and production verified. The bounded Phase 15B-4 Xinyu expansion is committed and pushed to `codex/xinyu-official-marker-expansion`: draft PR #56 is open, and its push and pull-request verification passed. It adds four reviewed official Points while leaving community behavior and all protected Phase 14 source records unchanged. The practical position is: **PR #56 remains unapproved, unmerged, and undeployed; production on `main` retains the verified official-layer foundation and community controls and is unchanged.**

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

## 10. Recommended Next Three Structural Phases

1. **Provincial Pilot Public Non-Map List**
   Scope and approve an accessible official-reference list for all ten pilot records without implying that approved point locations exist. This is future work and is not started by the Phase 14 closeout.

2. **Provincial Pilot Expansion Readiness**
   After the non-map alternative is complete, define the source, provenance, translation, coordinate-evidence, sensitivity, accessibility, testing, and maintenance gates for any proposed expansion. Do not add records or locations during readiness work.

3. **Ongoing Release And Provenance Assurance**
   Preserve repeatable production verification, rollback evidence, and the strict separation among official Chinese source facts, project translations, project coordinate review, and generated geometry. Treat source-document-number verification as a bounded maintenance item when stronger evidence becomes available.

## 11. Suggested Next Immediate Phase

### Provincial Pilot Public Non-Map List — Separate Approval Required

After the Phase 14 closeout is approved and merged, the next eligible product step is a separately scoped public non-map list for the ten pilot records. That work should:

- present official-reference information without implying approved point locations;
- preserve the official-source, project-translation, and project-coordinate provenance boundaries;
- include all ten records, including the records that have no usable point location;
- remain independent from `communityPlaces`, nominations, and promotion; and
- define accessibility, testing, and rollback before implementation.

This checkpoint does not start that work. Provincial expansion readiness follows only after the non-map alternative is complete and separately approved. New coordinate research, machine-data expansion, GeoJSON features, and Map markers remain paused.
