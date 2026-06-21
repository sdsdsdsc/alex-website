# Retired Page and Navigation Cleanup Plan

This document defines the reset-phase classification plan for current public pages, admin pages, retired routes, duplicate navigation, and external content dependencies before any cleanup implementation.

It is planning only. This phase does not delete files, move files, change navigation, modify code, remove Drupal/Pantheon code, touch live Firebase data, or run scripts.

## 1. Purpose

This document classifies:

- current public pages;
- current admin pages;
- retired pages and legacy routes;
- duplicate or confusing navigation patterns;
- external content dependencies, especially Drupal/Pantheon;
- future or beta UI elements that may need clarification later.

The goal is to decide what is active, what is legacy, what is confusing, and what should be cleaned up later without making implementation changes in this phase.

## 2. Current Active Public Navigation

Based on `public-nav.js`, the current shared public navigation is:

| Label | Linked page | Purpose | Classification | Notes |
| --- | --- | --- | --- | --- |
| Home | `index.html` | Main public entry page. | Current | Shared public nav item. |
| News | `news.html` | Public news listing. | Current | Still partly depends on Drupal/Pantheon through `script.js`. |
| History | `history.html` | Public history listing. | Current | Public Firebase-backed listing. |
| Get involved | `get-involved.html` | Public participation and nomination guidance entry. | Current | Routes users to nomination and guidance pages. |
| Criteria | `criteria.html` | Public explanation of community heritage criteria. | Current | Static guidance page. |
| Guidance | `guidance.html` | Public nomination preparation guidance. | Current | Static guidance page. |
| Map | `map.html` | Spatial discovery of `communityPlaces`. | Current | Includes extra internal sidebar labels not aligned exactly with main nav wording. |
| Places | `search.html` | Public search/filter page for `communityPlaces`. | Current | File name is `search.html`, public label is `Places`. |
| My nominations | `my-nominations.html` | Signed-in owner-scoped nomination history. | Current | Public page, but auth-gated in practice. |
| Open Data | `export.html` | Public `heritage.json` download page. | Current | Public-safe export path. |
| Sign in | `public-auth.html` | Public email/password auth page. | Current | Public account page only, not admin auth. |

Summary:

- the shared public nav is coherent and aligns with the current active public model;
- no admin page appears in `public-nav.js`;
- the biggest nav ambiguity is wording around `Places` versus the underlying `search.html` route, plus local page-level wording such as `Place Search` and `Open Data Hub`.

## 3. Current Active Public Pages

| File path | Purpose | Navigation source | Key JS file | Collection(s) read/written | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `index.html` | Homepage and public entry point. | Shared `public-nav.js` | `script.js` | Reads `news`, `history`; also external Drupal JSON:API news | Current | Public home page is active, but public news on home still has Drupal dependency. |
| `news.html` | Public news listing. | Shared `public-nav.js` | `script.js` | Reads `news`; also external Drupal JSON:API news | Current | Hybrid Firebase + Drupal/Pantheon public content path. |
| `history.html` | Public history listing. | Shared `public-nav.js` | `script.js` | Reads `history` | Current | Firebase-backed public listing. |
| `article.html` | Public article detail page. | Direct links from home/news/history/place relationships | `article.js` | Reads one `news` or `history` document; may fetch external Drupal article with `type=drupal` | Current with legacy dependency | Public destination page, not a primary nav tab. |
| `search.html` | Public search/filter/sort page for place records. | Shared `public-nav.js` as `Places` | `search.js` | Reads `communityPlaces` | Current | File name and route still say `search`, but user-facing label is `Places`. |
| `map.html` | Public spatial discovery and map-to-nomination handoff. | Shared `public-nav.js` | `map.js` | Reads `communityPlaces` | Current | Contains extra page-level navigation and future/beta UI such as draw search. |
| `place.html` | Public place record detail page. | Direct links from search/map/articles | `place.js` | Reads one `communityPlaces` document | Current | Destination page, not a primary nav tab. |
| `get-involved.html` | Public participation and nomination gateway page. | Shared `public-nav.js` | None | None | Current | Static page with real links to nomination/guidance/search. |
| `criteria.html` | Public explanation of criteria. | Shared `public-nav.js` | None | None | Current | Static guidance page. |
| `guidance.html` | Public nomination preparation guidance. | Shared `public-nav.js` | None | None | Current | Static guidance page. |
| `about-local-heritage.html` | Public project explanation and scope page. | Direct/internal links | None | None | Current | Public information page, but not a primary shared-nav item. |
| `nominate-place.html` | Signed-in public nomination form. | Direct/internal links from Get involved, Map, auth flow | `nominate-place.js` | Writes `placeNominations` only | Current | Public-facing but auth-gated for submission. |
| `my-nominations.html` | Signed-in owner-scoped nomination history. | Shared `public-nav.js` and direct/internal auth links | `my-nominations.js` | Reads owner-scoped `placeNominations` | Current | Public-facing but auth-gated. |
| `public-auth.html` | Public registration, sign-in, and sign-out page. | Shared `public-nav.js` | `public-auth.js` | Firebase Auth only | Current | Explicitly separate from admin auth. |
| `export.html` | Public open-data download page. | Shared `public-nav.js` as `Open Data` | `export.js` | Reads `communityPlaces`, `news`, `history` | Current | Public-safe export only. |

Notes:

- all active public pages above are part of the current model;
- `article.html`, `place.html`, `about-local-heritage.html`, and `nominate-place.html` are active even though they are not all primary top-nav labels;
- no active public page reads `mapPoints`, `mapPolygons`, or old `posts`.

## 4. Current Active Admin Pages

| File path | Purpose | Admin/auth assumption | Collection(s) read/written | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `admin-login.html` | Admin sign-in and redirect page. | Firebase Auth sign-in for admin workflows | Firebase Auth only | Current | Uses a manual nav block rather than shared public nav. |
| `admin.html` | Admin dashboard. | Signed-in admin account expected | Auth check only; links to admin workflows | Current | Current admin entry point. |
| `manage-community-places.html` | Create, edit, list, and delete published place records. | Signed-in admin account expected | Reads/writes/deletes `communityPlaces` | Current | High-risk admin workflow; manual nav block. |
| `manage-nominations.html` | Review, assess, filter, and promote nominations. | Signed-in admin account expected | Reads/updates `placeNominations`; creates `communityPlaces` during promotion | Current | Core admin review and promotion workflow. |
| `manage-articles.html` | List and delete articles/stories. | Signed-in admin account expected | Reads/deletes `news`, `history` | Current | Delete remains a higher-risk operation. |
| `upload-article.html` | Create or edit `news`/`history` articles and upload Storage assets. | Signed-in admin account expected | Creates/updates `news`, `history`; writes Firebase Storage | Current | Still part of the active article workflow. |
| `admin-export.html` | Private internal JSON backup/export. | Signed-in admin account expected | Reads `communityPlaces`, `placeNominations`, `news`, `history` | Current | Separate from public `export.html`. |

Notes:

- current admin pages are active, not legacy;
- they use repeated hand-built admin nav blocks rather than a shared admin-nav helper;
- they intentionally expose public links such as Home, News, History, Map, Places, and Open Data, but not through `public-nav.js`.

## 5. Retired or Legacy Pages

### Legacy or retired items found

| File path / route | What it appears to do | Why it is retired or legacy | Still linked anywhere? | Risk | Recommended future action |
| --- | --- | --- | --- | --- | --- |
| `map.html?admin=true` | Old map admin-editing mode | `docs/site-structure.md` explicitly says the legacy map admin workflow has been retired; current `map.js` runs in public `communityPlaces` mode instead | Not intentionally linked | Medium | Keep route behavior retired; add a clearer retired warning later only if needed. |
| `article.html?id={id}&type=drupal` | Loads a Drupal/Pantheon article detail | Still functional, but it is a legacy external content path outside the clean Firebase-only model | Yes, through `script.js` home/news Drupal cards | High | Needs more review; decide later whether to keep, isolate, or retire. |
| Drupal news cards in `index.html` / `news.html` via `script.js` | Loads external Drupal/Pantheon article listing | Still active dependency, but structurally legacy compared with the core Firebase model | Yes | High | Needs more review; later decide whether to keep or retire. |
| `maintenance/README-gallery-cleanup.md` references `posts`, `mapPoints`, `mapPolygons` | Historical maintenance guidance | Not an active public route; legacy maintenance context only | Not in public nav | Low | Keep as maintenance/reference only. |
| Historical `posts`, `mapPoints`, `mapPolygons` references in docs | Historical system references | Explicitly retired in current model | Docs only | Low | Keep as historical evidence; do not treat as active routes. |

### Files not present in the repo

| File path | Finding | Risk | Recommended future action |
| --- | --- | --- | --- |
| `gallery.html` | Not present in current repo root | Low | No page cleanup action needed now; only watch for historical references later. |
| `upload.html` | Not present in current repo root | Low | No page cleanup action needed now; only watch for historical references later. |

### Summary

- no active `gallery.html` or old `upload.html` page was found in the current repo;
- no active public page was found for old `posts`, `mapPoints`, or `mapPolygons`;
- the main legacy surface is no longer a file, but the still-live Drupal/Pantheon route and old conceptual references.

## 6. Drupal/Pantheon Dependency Review

Search findings show that Drupal/Pantheon is still present in two main ways:

### Files using Drupal/Pantheon directly

- `script.js`
- `article.js`
- `index.html`
- `news.html`

### Files affected indirectly through CSP / connection allowlists

Many public and admin HTML files still include `https://dev-alex-photo-cms.pantheonsite.io` in their CSP `connect-src`, even when the page itself does not appear to fetch Drupal content.

### Current behavior

- `script.js` fetches Drupal JSON:API article data from:
  `https://dev-alex-photo-cms.pantheonsite.io/jsonapi/node/article?include=field_image`
- `article.js` supports:
  `article.html?id={id}&type=drupal`
  and fetches Drupal article detail from the same host.

### Classification

- dependency type: active public dependency;
- scope: home/news listing and Drupal-backed article detail route;
- model fit: partly legacy relative to the current Firebase-centered public model.

### What public pages are affected

- `index.html`
- `news.html`
- `article.html`

### What could break if Drupal/Pantheon is down

- Drupal-backed news cards may fail to load on the homepage;
- Drupal-backed news cards may fail to load on `news.html`;
- `article.html?type=drupal` routes may fail entirely;
- public content may look incomplete or inconsistent compared with Firebase-backed `history` and `news` entries.

### Later decision options

- keep:
  if Drupal/Pantheon is still intentionally part of the content model;
- isolate:
  if the dependency should remain temporarily but be clearly classified as separate from the core Firebase model;
- retire:
  if the project should become Firebase-only for public article/news content.

Recommendation:

- do not remove the dependency yet;
- classify it as active-but-legacy and decide in a later implementation phase whether to keep, isolate, or retire it.

## 7. Duplicate or Confusing Navigation

| File path | Issue | Severity | Recommended future fix |
| --- | --- | --- | --- |
| `search.html` / `public-nav.js` | File route is `search.html`, but shared public label is `Places` | Low | Keep current route for now; later decide whether to standardize labels or route names in docs and UI copy. |
| `map.html` | Local sidebar uses `Place Search` and `Open Data Hub`, while shared public nav uses `Places` and `Open Data` | Medium | Normalize local page labels later so they match the main public nav more closely. |
| `admin-login.html`, `admin.html`, `manage-community-places.html`, `manage-nominations.html`, `manage-articles.html`, `upload-article.html`, `admin-export.html` | Repeated hand-built nav blocks instead of a shared admin-nav helper | Medium | Later decide whether to introduce a shared admin navigation helper after route classification is stable. |
| `admin` pages generally | Admin pages include public-looking nav labels without a stronger visual distinction from public navigation | Low | Later consider clearer admin-context labeling, not necessarily fewer links. |
| `about-local-heritage.html` | Active public information page is not part of shared public nav | Low | Later decide whether it should stay a contextual page or be surfaced more clearly. |
| `article.html` and `place.html` | Active public destination pages are not primary nav items | Low | Keep as destination pages; document this clearly rather than forcing them into top nav. |

Findings not seen:

- no public link to `admin.html` was found in `public-nav.js`;
- no retired gallery/upload nav item was found in current public nav.

## 8. Future/Beta UI Elements

| File path | Current wording or behavior | Recommended later action |
| --- | --- | --- |
| `map.html` | `Draw a search` UI is visible and reads as an advanced feature | Clarify or keep later depending on whether the feature is considered stable enough for public use. |
| `nominate-place.html` | `Photo upload will be added in a later phase.` | Keep for now; revisit only when Phase 13C or a later media implementation is approved. |
| `public-auth.html` | Multiple references to `future account features` | Clarify later if those future features stay paused for a long time. |
| `my-nominations.html` | `This page is read-only in this phase.` | Keep for now; revise later when account features expand or if the wording becomes stale. |
| `about-local-heritage.html` | Mentions future RDF or triplestore support | Keep as background context, but avoid turning it into a user expectation. |
| `place.html` | `comments-photos` tab/section remains present as a destination section pattern | Review later to ensure the section is clearly current, paused, or intentionally placeholder. |
| `engine-test.html` | Developer-only test harness page remains in repo | Keep unlinked from public navigation; no public cleanup needed. |

## 9. Repeated Page/Function Patterns Relevant to Navigation

The following repeated patterns matter for later cleanup planning:

### Repeated Firebase config in page scripts

Seen across:

- `script.js`
- `article.js`
- `search.js`
- `map.js`
- `place.js`
- `public-auth.js`
- `nominate-place.js`
- `my-nominations.js`
- `export.js`
- `admin-export.js`
- inline admin page scripts

This is a repeated implementation pattern, not a route decision by itself.

### Shared public navigation injection

- `public-nav.js` is the current shared public-nav helper;
- most active public pages use it;
- admin pages do not use it.

### Repeated admin auth guards

Admin pages commonly:

- redirect to `admin-login.html`;
- rely on Firebase Auth plus an expected admin UID;
- duplicate auth/nav setup in page-local scripts.

### Article/news/history routing split

- `script.js` loads Firebase-backed `news` and `history`;
- `script.js` also loads Drupal/Pantheon news;
- `article.js` branches on `type=news`, `type=history`, and `type=drupal`.

This is both a routing pattern and a source-of-truth split.

### Public auth redirects

- `public-auth.js` uses `next=`;
- `nominate-place.js` and `my-nominations.js` build public-auth redirect links with `next=`.

### Drupal/Firebase content split

- the public article/news layer is not fully single-source;
- some content is Firebase-first, while some is still Drupal/Pantheon-backed.

## 10. Recommended Cleanup Order

Recommended later implementation order:

1. Add retired-route warnings or contextual labels only after owner approval.
2. Update `docs/site-structure.md` and related current docs so they reflect the now-current public account, destination pages, and legacy-route classification.
3. Decide whether Drupal/Pantheon remains active, should be isolated, or should be retired.
4. Normalize confusing labels such as `Places` / `search.html`, `Place Search`, and `Open Data Hub` only after the route classification is accepted.
5. Review old hand-built admin nav blocks and legacy route wording only if those pages remain active.
6. Only later consider structural refactors such as shared Firebase config or shared admin navigation helpers.

## 11. Risk List

Prioritized risks:

1. Drupal/Pantheon outage can break part of the public news/article experience.
2. Future cleanup could delete or weaken a still-used legacy route such as `type=drupal` before its dependency is intentionally retired.
3. Users and future maintainers may be confused by route/file names that do not match public labels exactly, especially `search.html` versus `Places`.
4. Local page-level labels such as `Open Data Hub` and `Place Search` can make navigation feel less consistent than the shared public nav.
5. Admin pages repeat navigation and auth patterns, which increases drift risk across pages.
6. Public placeholder/beta wording may look unfinished if left unreviewed for too long.
7. Historical references to `posts`, `mapPoints`, and `mapPolygons` could confuse future work if current docs do not keep emphasizing that they are retired.

## 12. Recommended Next Phase

Recommended next phase:

`Phase Reset 1E — Retired Page Cleanup Implementation, docs/page warnings only`

Reason:

- the repo already has enough evidence to classify active versus legacy routes;
- the next safest implementation step is light, reversible cleanup such as clearer route warnings, nav-label normalization planning, and docs updates;
- Drupal/Pantheon should still be treated as a separate follow-up decision rather than removed blindly;
- Phase 13C should remain paused until these route and dependency risks are intentionally accepted or reduced.

## 13. What Was Not Changed

This phase did not change the following:

- no pages were deleted;
- no pages were moved;
- no navigation was changed;
- no code changed;
- no Firestore rules changed;
- no Firebase data was touched;
- no Storage files were touched;
- no scripts were run;
- no commit, push, or deploy was done.
