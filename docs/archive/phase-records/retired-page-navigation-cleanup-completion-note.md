# Retired Page Navigation Cleanup Completion Note

This note records the small, reversible cleanup completed after the retired-page and navigation review.

## What was updated

- `docs/site-structure.md`
  Updated to reflect the current route model more clearly, including:
  - active public pages;
  - active admin pages;
  - retired collections `mapPoints`, `mapPolygons`, and old `posts`;
  - no current `gallery.html` or `upload.html` route;
  - `search.html` as the route publicly labelled Places;
  - `export.html` as the route publicly labelled Open Data;
  - `article.html` and `place.html` as destination pages rather than top-level nav tabs;
  - Drupal/Pantheon as an active-but-legacy dependency;
  - Phase 13C remaining paused.

- `docs/project-status-checkpoint.md`
  Lightly updated so the reset state is clearer:
  - Phase 12 functionally verified;
  - Phase 13A complete;
  - Phase 13B complete;
  - Phase Reset 1A through 1D completed as reset work;
  - Phase 13C paused;
  - next immediate work positioned as Phase Reset 1E.

- `docs/README.md`
  Added links to:
  - `docs/firestore-rules-sync-and-verification-plan.md`
  - `docs/retired-page-navigation-cleanup-plan.md`

## Visible page wording updated

Small visible wording alignment was applied in `map.html` only:

- `Map Search` sidebar title changed to `Map`;
- sidebar link `Map Search` changed to `Map`;
- sidebar link `Open Data Hub` changed to `Open Data`;
- sidebar link `Place Search` changed to `Places`.

These were wording-only changes. No routes, links, or logic were changed.

## Legacy routes intentionally left untouched

The following legacy or compatibility surfaces remain intentionally untouched:

- `article.html?...&type=drupal`
- Drupal-backed news cards loaded through `script.js`
- CSP allowlist references to `dev-alex-photo-cms.pantheonsite.io`
- the retired `map.html?admin=true` concept, which remains classified as retired but was not removed

## Drupal/Pantheon decision still pending

Drupal/Pantheon remains:

- active for some public `news` and `article` behavior;
- outside the core Firebase-first content model;
- classified as active-but-legacy.

A separate later decision is still required to choose whether that dependency should be:

- kept;
- isolated more clearly; or
- retired.

## What was not changed

- no files were deleted;
- no files were moved;
- no Drupal/Pantheon functionality was removed;
- no `type=drupal` route support was removed;
- no Firestore rules were changed;
- no Firebase logic was changed;
- no Firebase data or Storage files were touched;
- no scripts were run;
- no commit, push, or deploy was done.
