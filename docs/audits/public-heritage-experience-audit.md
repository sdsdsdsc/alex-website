# Public Heritage Experience Audit

## Scope

This audit reviews the public website from the perspective of a first-time
visitor who does not know the repository architecture, phase history, GIS
policy or Firebase collection names. It covers:

- Home and shared navigation;
- Places search, filters, results and empty state;
- representative place-detail records;
- the desktop and mobile Map, including its Search, Filters, Layers and Info
  tools;
- Official Heritage discovery, ordinary and Generalized reference Points, and
  official popups;
- Get involved, Criteria, Guidance and About Local Heritage Records;
- public sign-in, nomination and My nominations; and
- practical responsive and accessibility checks.

This is an audit-only change. It does not implement a UX change, alter public
or private data, change Firebase or Storage rules, change either heritage
model, or reopen GIS research.

## Current baseline

- Base commit: `e8149a871f8d049b79b1584d4aa9095e110cac85`, the merge
  commit for PR #86.
- Production Official Heritage: 19 source records, nine published Point
  Features, eight ordinary Points, one Generalized reference Point, ten
  exclusions, zero real lines and zero real areas.
- Official Heritage remains a separate, optional, default-off map layer.
- Community Heritage remains community-contributed, independently maintained
  and Point-based.

The three protected Official Heritage artifacts retain the exact expected
baseline hashes and are checked again during final verification. No protected
artifact is in the PR diff.

## Method

The review combined:

1. source inspection of the current public HTML, JavaScript, shared CSS,
   heritage-engine modules and public browser tests;
2. read-only review of the deployed GitHub Pages site in Chromium at desktop
   (`1440 × 900`) and mobile (`390 × 844`) viewports;
3. interaction with search, result views, map tool tabs, the default-off
   Official Heritage switch, ordinary and Generalized Point popups, and
   signed-in account pages without submitting, editing or deleting data;
4. representative place records with complete, partial and missing fields;
5. page-level overflow, control-size, form-label, heading, alternative-text,
   status and accessible-name inspection; and
6. review of `.github/workflows/verify.yml`,
   `tests/browser-smoke.spec.mjs`, the release smoke matrix, preview records
   and rollback guidance.

The existing browser session permitted read-only review of the signed-in
account and My nominations presentation. No credentials or private account
content are recorded here. Signed-out behavior was checked from the current
source and existing browser tests; no account was created and the live session
was not changed.

## What already works well

- The home page states that the project concerns community-valued places,
  local stories, maps and open data, and gives Places a prominent first
  action.
- Shared navigation exposes Places, Map, Get involved, Guidance, My
  nominations and Sign in consistently.
- Places has an obvious labelled search field, understandable Type and
  Community heritage criteria filters, sorting, result counts, list/grid
  controls, explicit **View record** and **View on map** actions, and a useful
  no-results message.
- Place pages use a clear title, overview, key facts, significance, location,
  sources and contribution structure. Map and search return paths exist where
  the record supports them.
- The Map provides a list alternative, announces mapped and coordinate-less
  results separately, keeps Community and Official layers independent, and
  exposes keyboard-operable Search, Filters, Layers and Info tabs.
- The Map fits the tested mobile viewport without page-level horizontal
  overflow. Its four tool tabs are 46 pixels high, and the map remains usable
  after the Layers panel is opened.
- After Official Heritage is enabled, the live interface reports nine official
  locations, eight filled-diamond reviewed Points and one hollow-diamond
  Generalized Point. Official designation level is kept separate from
  representation provenance.
- The required Xieli warning is present in the popup verbatim:

  > Generalized reference location. This marker represents the documented
  > general vicinity of the heritage record. It does not show the exact
  > feature, centre, entrance, extent, or legal protection boundary.

- Guidance distinguishes community nominations from statutory designation,
  explains evidence and privacy, and links to the nomination form, criteria
  and map.
- Account, nomination and My nominations pages explain sign-in, private
  ownership, review and publication boundaries. Forms have programmatic
  labels and status regions, and the existing auth code supplies friendly
  validation messages.
- Skip links, semantic headings, labelled regions, visible focus styles,
  accessible map-marker names, non-colour-only symbols and useful image
  alternative text are present across the principal journeys.

## Findings

### Navigation / first visit

**High — the home journey explains only Community Heritage and gives no clear
entry to Official Heritage.** The hero, introductory text, Places action and
Heritage Map card all frame the site around community records. The public
navigation has no Official Heritage destination. A visitor can reasonably
leave Home believing that the map contains only the same Community Places
shown in Places.

**Medium — mobile navigation is understandable but crowded.** Eleven links
wrap into three rows before page content. At `390 × 844`, nav links were about
32 pixels high, below the commonly recommended 44-pixel touch target. There
was no page-level horizontal overflow, but the header occupied about 188
pixels before the visitor reached the page content.

### Places/search

**High — visible test and placeholder records undermine trust.** The deployed
seven-result list includes an explicitly named Phase 11C live-verification
record, a test nomination record, and very thin records such as `xinyu` and
`yicun`. This makes a public heritage catalogue look like a test environment.
Fixing it requires a separately approved content/data decision; this audit
does not delete, hide or edit production records.

The search controls, filters, result counts, sorting, open-record links,
map links and no-results state are otherwise clear. At `390 × 844`, the page
had no meaningful horizontal overflow and the main controls stacked cleanly.

### Place detail

**Medium — sparse records expose too many negative fallback rows.** A partial
record can show consecutive messages for missing significance, criteria,
criteria explanation, heritage value, condition, community use, dates,
status and source. These fallbacks are honest, but the stack dominates the
record and makes incompleteness more prominent than the information that is
available.

**Medium — some records lack a strong continuation path.** Breadcrumbs and
View on map help, but the end of a long record does not consistently offer a
compact next step back to Places, to the map, or to related records. The
mobile record inspected was readable and did not create page-level overflow,
but it exceeded 4,500 pixels in height before contributions were expanded.

### Map

**High — the default map experience describes and searches Community Heritage
only.** The opening copy says “Search, filter, and open published community
heritage records.” Search and Filters apply to Community Heritage, and the
live status initially reports only community records. The optional Official
layer is not mentioned until the visitor deliberately chooses **Layers**, the
third of four tool tabs.

**Medium — opening Layers on mobile puts the map far below a long control
panel.** At `390 × 844`, the Layers panel was about 1,167 pixels tall and moved
the map start to roughly 1,829 pixels down the document. Controls remained
reachable and the page did not overflow horizontally, but a visitor can lose
the visual connection between a layer choice and its map result.

**Medium — one public explanation is factually stale.** The collapsed “About
Official Heritage representations” text says the current map displays seven
project-reviewed reference Points. The loaded interface and protected data
correctly show nine Points: eight ordinary and one Generalized. Static counts
in explanatory prose can drift from validated data.

### Official Heritage discoverability

**High — a normal visitor is unlikely to discover the layer.** Official
Heritage is absent from Home, Places, the About page’s description of the map,
and the default map introduction. The only functional discovery route is:

`Map → Layers → Show Official Heritage`

The default-off decision is sound, but there is no guided public entry into
that choice and no URL state that introduces the layer while preserving user
consent. The Open Data page contains an Official Heritage download, but that
is not a normal visual discovery route.

Once enabled, category controls, counts and the filled/hollow symbol legend
work well. The failure is primarily before activation, not in data loading or
marker rendering.

### Community vs Official Heritage comprehension

**High — the distinction is accurate where explained but not introduced at
the point most visitors need it.** Layers describes Community records as
contributed and locally maintained, while Official Heritage comes from
national, provincial or municipal registers. However, the fuller explanation
is collapsed under Additional information and uses policy language about
authority, geometry provenance and active representations. A first-time
visitor receives no short, plain-language comparison on Home or in the
default map state.

The two layers remain visually distinct and independently switchable. No
evidence was found that the implementation merges their data models.

### Generalized Point comprehension

**Medium — the essential warning is correct, but it competes with specialist
detail.** The hollow diamond, “Generalized project reference point” badge and
mandatory limitation correctly prevent an exact-location claim. On mobile,
the popup becomes an internally scrollable card, and the mandatory warning
appears below a long facts list that includes transformation allowances,
envelopes, precision, method names and policy provenance.

A visitor who reaches the warning should understand it. A visitor who reads
only the first mobile popup screen may see the title, badge, official name and
designation level before the limitation. The marker’s accessible name also
concatenates the mandatory warning and a second candidate-specific warning,
creating a very long announcement before the popup opens.

The existing Generalized Point limitation contract must not be shortened,
weakened or removed by later UX work.

### Official Heritage popups

**Medium — ordinary popups are informative; the Generalized popup is overly
technical for the primary reading layer.** Ordinary Points clearly present
name, designation level, official category, official location, displayed
location, geometry meaning, evidence, uncertainty, limitation and source.
They link to the official source rather than pretending there is a local full
record page.

The Xieli popup additionally exposes specialist fields such as
`coincident-interpretation-envelope-centre`, transformation/frame allowance,
multi-interpretation envelope, support-area distance and policy version.
Those facts are important provenance, but progressive disclosure would serve
ordinary visitors better. This is a later improvement and is not the selected
next implementation.

### Get involved / guidance

**Medium — the guidance is useful but repeats project-position and workflow
copy across four long pages.** Get involved gives the clearest action hub;
Criteria is the clearest explanation of significance. Guidance and About
repeat some of the same nomination, privacy and non-statutory messages. On
mobile, About exceeded 5,100 pixels and Guidance exceeded 3,300 pixels.

**Medium — developer terminology leaks into public copy.** Visitors are told
about the `communityPlaces` collection and promotion into a
`communityPlaces` record. That is an implementation detail rather than a
public concept.

### Nomination/account journey

**High — public account pages have confirmed mobile horizontal overflow.** At
`390 × 844`, the public-auth document measured about 642 pixels wide and My
nominations about 637 pixels wide. The two-column `.public-auth-layout`
remained active, placing the account panel largely off-screen. Source review
shows the responsive one-column rule appears earlier in `style.css` than the
later base two-column declaration, so the later declaration wins in the
cascade. This directly harms sign-in and nomination-history use on mobile.

The nomination form itself fit the mobile viewport and its six-step structure,
labels and privacy explanations were understandable. It is very long—about
7,600 pixels in the inspected signed-in state—but the steps provide usable
hierarchy.

**Medium — current capabilities are described as future work.** Public-auth
repeatedly says ownership supports “future account features” even though My
nominations exists. The nomination form says a later phase may allow
map-started nominations, while Get involved, Guidance, the map and release
tests confirm the coordinate handoff is already implemented.

No auth state, nomination, Firestore record or private field was changed
during this audit.

### Mobile/responsive

- Home, Places, representative place details, Map, guidance and nomination
  had no meaningful page-level horizontal overflow at `390 × 844`.
- Public-auth and My nominations did overflow as described above.
- Map tool tabs met a 44-pixel-height target; shared mobile navigation links
  did not.
- Map popups stayed within the viewport and used an internal vertical scroll
  area. The scroll is necessary for the Generalized popup but is not visually
  obvious from its first screen.
- Long guidance, place and nomination pages are readable but would benefit
  from stronger in-page hierarchy in later work.

### Accessibility

**Working:** skip links, landmark roles, heading hierarchy on the audited
pages, form labels, live status regions, keyboard-operable map tabs, keyboard
marker activation, focus styles, textual result counts, symbol shape in
addition to colour, image alt text, and a non-map Places alternative.

**Issues:** undersized shared-nav touch targets on mobile; account content
positioned off-screen by horizontal overflow; very long Generalized Point
accessible names; a long internally scrolling popup before the mandatory
limitation; and developer/policy terminology that raises comprehension load.

This was a practical review, not a WCAG conformance audit. No human
screen-reader session was performed.

## Prioritized issues

| Priority | Issue | Reason |
| --- | --- | --- |
| High | Official Heritage has no guided public discovery route | Affects first-time comprehension of a core nine-record layer and the distinction between Community and Official Heritage. |
| High | Public-auth and My nominations overflow horizontally on mobile | Blocks an important signed-in journey and has a concrete CSS cascade cause. |
| High | Public Places exposes test/placeholder records | Damages trust in the catalogue; remediation requires an explicit production-content decision. |
| Medium | Generalized Point popup and accessible name are overly technical | The mandatory limitation is correct but appears within a large specialist payload. |
| Medium | Sparse place records show long stacks of missing-field fallbacks | Honest but reduces readability and perceived record quality. |
| Medium | Public copy contains stale counts, completed work described as future, and internal collection names | Creates avoidable confusion and maintenance drift. |
| Medium | Mobile navigation is crowded and below recommended touch height | Still usable, but high-frequency navigation is less comfortable than it should be. |
| Low | Long guidance pages repeat some explanations | Content remains accurate and navigable, so this is polish rather than a blocker. |

## Recommended next implementation

### One recommendation: provide a guided entry into Official Heritage

#### 1. Problem

Official Heritage is a functioning, policy-controlled public layer with nine
published representations, but ordinary visitors are not told that it exists
before they find the third map tab and opt into it. The site therefore presents
an incomplete picture of its own public heritage content.

#### 2. Why it matters

This affects every visitor trying to understand what the website contains,
not only authenticated contributors. It also creates a conceptual risk:
visitors may assume Community Places are the whole catalogue, or may encounter
official diamonds later without having learned why Official and Community
Heritage are different.

#### 3. Evidence

- Home has a prominent Places action and Community Heritage language but no
  Official Heritage entry.
- About says the Map explores the same Community Places records.
- Places contains only Community Places.
- The default map introduction, search and filters all describe Community
  Heritage.
- Official Heritage requires the undisclosed path
  `Map → Layers → Show Official Heritage`.
- After activation, the existing implementation works: nine locations, eight
  ordinary Points, one Generalized Point, independent categories, distinct
  symbols and the required limitations.

#### 4. Why it ranks first

The mobile account overflow is a serious, concrete defect and should follow
promptly. Public test data also needs a separately governed cleanup decision.
The Official Heritage entry ranks first because it affects the broadest public
audience, determines whether a core public layer is understood at all, reduces
Community-versus-Official confusion, and can be delivered without changing
heritage data, Firebase, geometry policy or account behavior.

#### 5. Approximate scope for PR #88

Implement one coherent **Explore Official Heritage** journey:

- add one plain-language public entry point from the existing Home/About
  discovery path;
- open the Map with the Layers tool selected and keyboard focus placed at a
  short Community-versus-Official explanation or the **Show Official
  Heritage** control;
- keep the Official layer off until the visitor explicitly enables it;
- preserve the existing lazy loading, separate category controls and layer
  independence;
- replace the stale static seven-Point sentence with durable copy or a value
  derived from the validated loaded data;
- add focused browser coverage for desktop, mobile and keyboard use proving
  that the guided entry is visible, the Layers panel is selected, the layer
  remains off before consent, and the validated nine-marker state appears
  after activation.

This is one implementation outcome: make the existing Official Heritage layer
findable and understandable without automatically turning it on.

#### 6. PR #88 must not

- change the 19 official source records, nine published Points, eight ordinary
  Points, Xieli Generalized Point, ten exclusions, coordinates, evidence,
  protection levels, classifications, categories or GeoJSON;
- weaken, remove or paraphrase away the mandatory Generalized Point limitation;
- merge Community and Official Heritage or apply community filters to official
  data;
- enable Official Heritage by default on ordinary map visits;
- change Firebase data, Auth, Firestore/Storage rules, nomination privacy,
  exports or deployment configuration;
- reopen M31 or any GIS/geometry investigation; or
- include the separate mobile account-layout or production-content cleanup.

Those remain separately scoped follow-ups rather than additional PR #88
deliverables.

## Verification

- `npm test` — passed. This included provincial and combined Official Heritage
  validation/generation checks, unit tests, Firestore rules tests and Storage
  rules tests.
- `npm run test:browser` — passed, 44/44 Chromium tests. Existing responsive,
  200% zoom, keyboard, default-off Official Heritage, nine-marker and
  Generalized Point contract checks all passed.
- `git diff --check` — passed.
- Combined Official Heritage validation reported 19 source records, nine
  approved decisions/features, ten expected exclusions, zero hard errors and
  seven provincial compatibility Features.
- All nine active geometries remain Points: eight ordinary and one
  Generalized. No LineString, MultiLineString, Polygon or MultiPolygon is
  present.

| Protected production artifact | Required and observed SHA-256 |
| --- | --- |
| Public-location decisions | `95c6531d51e49caabf566b68f62087a6512bf9e4fd046d35819f44d8b3782f5b` |
| Canonical Official Heritage GeoJSON | `eb99e7a222d2a8af40e294f650e043cb73bdc82f6eabf728f5c1ef29c03a64b3` |
| Provincial compatibility GeoJSON | `c5fbfbef3cbdc30f0b3d02443b250a8089be668f701c3c9eca7391a1e488cbd9` |

All requested local verification and browser checks were executed. A
production deployment check was not applicable because this audit-only branch
was not deployed. No production mutation, manual deployment or human
screen-reader session was performed.

## Audit boundary and preservation summary

### Changed files

- `docs/audits/public-heritage-experience-audit.md`
- `docs/project-status-checkpoint.md` (small current-activity pointer only)

### Confirmed unchanged / protected areas

- Official Heritage production data and publication decisions;
- canonical and provincial compatibility GeoJSON;
- geometry schema, validation, generation and rendering behavior;
- Firebase production data, authentication architecture, Firestore rules and
  Storage rules;
- Community Heritage data model;
- nomination ownership and privacy model;
- public and private export behavior;
- deployment configuration; and
- production deployment state.

PR #87 does not start PR #88 and does not authorize implementation.
