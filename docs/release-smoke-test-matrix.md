# Release Smoke Test Matrix

This matrix is a repeatable pre-release checklist for Alex's Photo Board.

Use it before any:

- GitHub Pages file upload/update
- Firebase rules deployment
- Firebase Auth-related live release
- Firestore data/rules change that could affect public or admin workflows

This document is release/testing guidance only. It does not change application behavior or Firebase configuration.

## How To Use This Matrix

- Run the tests against the exact files intended for release.
- Record the branch, commit, browser, Firebase project, and tester in the evidence section.
- Treat pass/fail as a manual verification record, not an automated test substitute.
- When a test depends on live Firebase state, note the record IDs or test accounts used.
- If a test fails, stop the release process until the failure is understood.

## 1. Public Basic Pages

| Test | Page URL / file | User state | Expected result | Data collection involved | Pass | Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home page loads | `index.html` | Signed out | Page loads, shared public navigation appears, no broken hero/layout state. | `news`, `history`; external Drupal JSON:API news | [ ] | [ ] | |
| News listing loads | `news.html` | Signed out | News page loads and article links render without exposing admin/private data. | `news`; optional external Drupal JSON:API news | [ ] | [ ] | |
| History listing loads | `history.html` | Signed out | History page loads and article links render. | `history` | [ ] | [ ] | |
| Places search loads | `search.html` | Signed out | Search UI loads, filters render, results can load from published public place records. | `communityPlaces` | [ ] | [ ] | |
| Place detail loads | `place.html?id=<known-place-id>` | Signed out | Public place record loads with title, overview, and safe public data only. | `communityPlaces` | [ ] | [ ] | |
| Article detail loads | `article.html?id=<known-article-id>&type=news` and `article.html?id=<known-article-id>&type=history` | Signed out | Article content loads, related place links work when present, no admin/private fields appear. | `news` or `history` | [ ] | [ ] | |
| Map loads | `map.html` | Signed out | Map page loads, marker/search/filter UI appears, no retired collections are used. | `communityPlaces` | [ ] | [ ] | |
| Open Data export page loads | `export.html` | Signed out | Export page loads and download UI is visible. | `communityPlaces`, `news`, `history` | [ ] | [ ] | |
| Get involved page loads | `get-involved.html` | Signed out | Guidance page loads and public destination links work. | None | [ ] | [ ] | |
| Criteria page loads | `criteria.html` | Signed out | Criteria page loads and remains public guidance only. | None | [ ] | [ ] | |
| Guidance page loads | `guidance.html` | Signed out | Guidance page loads and nomination guidance is readable. | None | [ ] | [ ] | |
| About Local Heritage page loads | `about-local-heritage.html` | Signed out | Orientation page loads and still avoids official statutory claims. | None | [ ] | [ ] | |

## 2. Public Auth Tests

| Test | Page URL / file | User state | Expected result | Data collection involved | Pass | Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Register with email/password | `public-auth.html` | Signed out | Registration succeeds and signed-in state appears. | Firebase Auth | [ ] | [ ] | |
| Login with existing account | `public-auth.html` | Signed out | Login succeeds and signed-in state appears. | Firebase Auth | [ ] | [ ] | |
| Logout | `public-auth.html` | Signed in public user | Sign out succeeds and public signed-out state returns. | Firebase Auth | [ ] | [ ] | |
| Refresh after login | `public-auth.html` | Signed in public user | Refresh preserves signed-in state after auth persistence resolves. | Firebase Auth | [ ] | [ ] | |
| `next=` redirect works | `public-auth.html?next=my-nominations.html` | Signed out | After successful sign-in, redirect occurs only after auth state is ready. | Firebase Auth | [ ] | [ ] | |
| Password mismatch blocked | `public-auth.html` | Signed out | Registration is blocked with a user-facing mismatch message. | None before Auth write | [ ] | [ ] | |
| Consent unchecked blocked | `public-auth.html` | Signed out | Registration is blocked until consent is checked. | None before Auth write | [ ] | [ ] | |
| Public auth does not enter admin pages | `public-auth.html` | Signed in public user | Public sign-in stays on public pages and does not redirect to admin login/dashboard. | Firebase Auth | [ ] | [ ] | |

## 3. Nomination Tests

| Test | Page URL / file | User state | Expected result | Data collection involved | Pass | Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Signed-out submission blocked | `nominate-place.html` | Signed out | Page shows sign-in-required state; submit flow is blocked. | `placeNominations` should not be written | [ ] | [ ] | |
| Signed-in submission works | `nominate-place.html` | Signed in public user | Nomination submits successfully for review. | `placeNominations` create | [ ] | [ ] | |
| Map `lat` / `lng` handoff preserved | `map.html` -> `nominate-place.html?lat=<lat>&lng=<lng>` | Signed in public user | Coordinates survive handoff and still appear after auth resolution. | None on handoff; `placeNominations` on submit | [ ] | [ ] | |
| Ownership metadata attached privately | `nominate-place.html` after successful submission | Signed in public user | Stored nomination includes `submittedByUid`, `submitterEmail`, optional `submitterDisplayName`, and `submissionAuthType: "signedIn"`. | `placeNominations` | [ ] | [ ] | |
| Initial nomination status | `nominate-place.html` after successful submission | Signed in public user | Stored nomination starts with `nominationStatus: "submitted"`. | `placeNominations` | [ ] | [ ] | |
| Guest submission not allowed | `nominate-place.html` | Signed out | No guest write path exists; nomination cannot be created anonymously. | `placeNominations` should not be written | [ ] | [ ] | |

## 4. My Nominations Tests

| Test | Page URL / file | User state | Expected result | Data collection involved | Pass | Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Signed-out user sees sign-in required | `my-nominations.html` | Signed out | Page resolves to sign-in-required state after auth check. | `placeNominations` should not be readable | [ ] | [ ] | |
| Signed-in user sees own nominations | `my-nominations.html` | Signed in public user | Page shows only nominations linked to current `submittedByUid`. | `placeNominations` owner-scoped read | [ ] | [ ] | |
| Other user's nominations are not visible | `my-nominations.html` | Signed in public user | Records owned by another UID do not appear. | `placeNominations` owner-scoped read | [ ] | [ ] | |
| Page remains read-only | `my-nominations.html` | Signed in public user | No edit/delete/resubmit/admin-response controls exist. | `placeNominations` owner-scoped read | [ ] | [ ] | |
| Admin/private fields hidden | `my-nominations.html` | Signed in public user | Page does not show `adminNotes`, `reviewHistory`, admin assessment fields, other users' emails, or promotion payloads. | `placeNominations` owner-scoped read | [ ] | [ ] | |

## 5. Admin Tests

| Test | Page URL / file | User state | Expected result | Data collection involved | Pass | Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Admin login works | `admin-login.html` | Signed out admin | Admin sign-in succeeds and can reach admin workflow pages. | Firebase Auth | [ ] | [ ] | |
| Manage nominations loads | `manage-nominations.html` | Signed in admin | Page loads nomination list and review UI. | `placeNominations` read | [ ] | [ ] | |
| Admin can review nomination | `manage-nominations.html` | Signed in admin | Review status/notes/assessment save correctly. | `placeNominations` update | [ ] | [ ] | |
| Admin can promote approved nomination | `manage-nominations.html` | Signed in admin | Approved nomination promotes to public `communityPlaces` record successfully. | `placeNominations` update, `communityPlaces` create | [ ] | [ ] | |
| Manage community places loads | `manage-community-places.html` | Signed in admin | Community place admin page loads current records and forms. | `communityPlaces` read/write | [ ] | [ ] | |
| Manage articles loads | `manage-articles.html` | Signed in admin | Article management page loads records/actions. | `news`, `history` read/delete | [ ] | [ ] | |
| Private admin export works | `admin-export.html` | Signed in configured admin UID | Private export workflow still works and is clearly private/admin-only. | `communityPlaces`, `placeNominations`, `news`, `history` | [ ] | [ ] | |

## 6. Rules / Security Tests

These are expected checks for emulator testing or controlled deployed verification. They may not all be executable from the browser alone.

| Test | Verification target | Expected result | Pass | Fail | Notes |
| --- | --- | --- | --- | --- | --- |
| Public read of public collections | `communityPlaces`, `news`, `history` | Public read works. | [ ] | [ ] | |
| Signed-out nomination create | `placeNominations` create | Fails. | [ ] | [ ] | |
| Signed-in create with own UID | `placeNominations` create | Passes when `submittedByUid == request.auth.uid`. | [ ] | [ ] | |
| Signed-in create with another UID | `placeNominations` create | Fails. | [ ] | [ ] | |
| Owner-scoped nomination read | `placeNominations/{id}` read | Passes for the owning signed-in user. | [ ] | [ ] | |
| Other-user nomination read | `placeNominations/{id}` read | Fails for a different signed-in public user. | [ ] | [ ] | |
| Public write to community places | `communityPlaces` write | Fails. | [ ] | [ ] | |
| Public update/delete nominations | `placeNominations` update/delete | Fails. | [ ] | [ ] | |
| Admin review/promote | `placeNominations` update and `communityPlaces` create | Passes for configured admin flow. | [ ] | [ ] | |

## 7. Export / Privacy Tests

| Test | Page URL / file | User state | Expected result | Data collection involved | Pass | Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public export reads only public collections | `export.html` / `export.js` | Signed out | Export is built only from `communityPlaces`, `news`, and `history`. | `communityPlaces`, `news`, `history` | [ ] | [ ] | |
| `placeNominations` excluded | `heritage.json` output | Signed out | No nomination records appear. | Public export only | [ ] | [ ] | |
| `publicUsers` excluded if ever added | `heritage.json` output | Signed out | No user-account collection data appears. | Public export only | [ ] | [ ] | |
| Ownership fields excluded | `heritage.json` output | Signed out | `submittedByUid`, `submitterEmail`, `submitterDisplayName`, `submissionAuthType` are absent. | Public export only | [ ] | [ ] | |
| Admin/private fields excluded | `heritage.json` output | Signed out | `adminNotes`, `reviewHistory`, admin assessment fields are absent. | Public export only | [ ] | [ ] | |
| `nominatorEmail` excluded | `heritage.json` output | Signed out | Private nominator email is absent. | Public export only | [ ] | [ ] | |

## Phase 11D-R Public Discovery Release Matrix

Use this concise matrix after merge and against the deployed production files. It complements the automated browser suite; it does not authorize production writes or deployment.

| View / scenario | Manual check | Expected result | Pass | Fail | Evidence / notes |
| --- | --- | --- | --- | --- | --- |
| Desktop | Open Map and Places at a desktop width with several filters active. | Both remain usable; Map and Places show consistent public discovery state. | [ ] | [ ] | |
| Tablet | Verify Map at approximately 768px wide. | Tools, panels, map controls, popups, and list alternative remain usable without meaningful horizontal overflow. | [ ] | [ ] | |
| Mobile | Verify Map and Places at 375px wide. | Controls remain reachable, labels wrap safely, and the state-preserving list link remains visible. | [ ] | [ ] | |
| Narrow mobile | Verify Map and Places at 320px wide. | No meaningful page-level horizontal overflow; tool triggers and map controls do not overlap important content. | [ ] | [ ] | |
| 200% zoom | Use real browser zoom at 200% on Map and Places. | Important content, tool panels, focus indicators, list alternative, and popups remain operable. | [ ] | [ ] | |
| Valid-coordinate record | Open a known public Places record, then activate its Map link. | `place=<id>` focuses and opens the exact record marker; its accessible name includes the record title. | [ ] | [ ] | Record ID: |
| Coordinate-less record | Open a known public record without valid coordinates. | Record remains available in Places and Map presents a useful unavailable-location fallback with record/list links. | [ ] | [ ] | Record ID: |
| Duplicate coordinates | If two public records share coordinates, open each record's Map link separately. | Each `place=<id>` focuses the intended record rather than whichever marker shares its coordinates. | [ ] | [ ] | Record IDs: |
| Copied filtered URLs | Copy and reopen Map and Places URLs containing q, assetType, heritageCriteria, and place where applicable. Also open an old URL containing category, city, and district. | Supported parameters round-trip through Map ↔ Places; obsolete parameters are ignored and normalized away without errors. | [ ] | [ ] | URLs: |
| Keyboard and screen reader | Use the skip link, map region, Search/Filters/Info triggers, marker names, Escape, and nomination fallback. | Announcements are understandable; panel state and focus restoration are clear; no map pointer action is required to reach records or nomination. | [ ] | [ ] | Browser/AT: |
| Production freshness | After an approved merge/deploy, load production with cache disabled and compare the deployed commit/assets. | Production serves the approved Slice 1–4 files; no stale HTML, JS, or CSS is observed. | [ ] | [ ] | Commit/time: |

Phase 11D-R does not require authenticated production mutation tests, Firebase rules/index deployment, or official GIS datasets.

## 8. Rollback Notes

Before any release or Firebase rules deployment, have the following ready:

- [ ] Backup current Firestore data.
- [ ] Keep the previous GitHub commit and release-ready file set available.
- [ ] Know how to revert GitHub Pages files to the previous working version.
- [ ] Know how to restore the previous `firestore.rules` if deployed rules fail.
- [ ] Record the Firebase rules deployment time and version if a rules deployment occurs.

## 9. Test Evidence

Record each smoke-test run here.

| Field | Value |
| --- | --- |
| Tester | |
| Date | |
| Branch | |
| Commit | |
| Browser | |
| Firebase project | |
| Firebase rules version / deployment note | |
| Environment | |
| Notes | |
| Screenshot / evidence links | |

## 10. Release Assurance 2 Candidates

This smoke matrix intentionally does not replace:

- emulator-backed rules test scripts;
- a rollback runbook with step-by-step recovery actions;
- automated browser checks;
- a staged release signoff record;
- post-release monitoring notes.

Those are reasonable follow-on items for Release Assurance 2 after this matrix is in use.
