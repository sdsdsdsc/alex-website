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

### Owner-requested discoverability re-check

The initial audit used “Official Heritage discoverability” too broadly and
overstated the problem. A second read-only desktop/mobile review separated four
questions that must not be treated as one:

1. **Finding the Layers tab:** good. Search, Filters, Layers and Info are
   presented together as four visible tabs. At the tested mobile viewport the
   tabs remained in one row and were 46 pixels high.
2. **Finding Official Heritage after opening Layers:** good on desktop and
   adequate on mobile. At `1440 × 900`, the **Official Heritage** legend and
   orange-diamond **Show Official Heritage** control reached the first viewport.
   At `390 × 844`, the legend began at about 839 pixels and the control at about
   875 pixels, so only a small downward scroll was needed. Once selected,
   **Official categories** appeared directly below, followed by the three
   available categories and the `9 of 9` status.
3. **Understanding Community versus Official Heritage:** partial. The visible
   Community help says those records are contributed and locally maintained,
   and the two layers use separate headings, controls and symbols. The clearest
   statement that Official records come from national, provincial or municipal
   registers remains inside a collapsed, technical explanation.
4. **Mobile discoverability/usability:** the Layers tab is discoverable, but the
   long Layers panel weakens feedback. Before Official Heritage was enabled the
   panel measured about 1,167 pixels and the map began about 1,829 pixels down
   the page. The issue is distance between the choice and its result, not an
   absent or unclear Official Heritage control.

The supplied wide-desktop screenshot is consistent with the re-test: once
Layers is open, the Official Heritage heading, orange symbol, toggle and
categories form a visually prominent section. The corrected conclusion is
therefore that **site-wide framing and the plain-language distinction are
incomplete, but Official Heritage itself is not difficult to discover once a
visitor opens Layers**.

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

**Low — the home journey explains only Community Heritage.** The hero,
introductory text, Places action and Heritage Map card all frame the site
around community records. The public navigation has no separate Official
Heritage destination. This is an incomplete introduction, but the re-test does
not establish that a visitor who chooses Map will then struggle to find the
visible Layers tab or its Official Heritage section.

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

**Low — the default map introduction describes and searches Community Heritage
only.** The opening copy says “Search, filter, and open published community
heritage records.” Search and Filters apply to Community Heritage, and the
live status initially reports only community records. That framing could be
more complete, but the adjacent **Layers** tab is plainly labelled and visible;
the default state alone is not evidence that the Official layer is difficult
to discover.

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

**Low — site-wide entry to the layer is indirect, but Map-level discovery is
clear.** Official Heritage is absent from Home, Places, the About page’s
description of the map and the default map introduction. The functional route
is:

`Map → Layers → Show Official Heritage`

That path is short and uses familiar, visible labels. On desktop, the Layers
tab and Official Heritage section are visually prominent. On mobile, the
Official heading sits at the end of the first viewport after Layers opens and
the toggle follows after a small scroll. The default-off decision remains
sound. Once enabled, the official categories, `9 of 9` count and filled/hollow
symbol legend are clear.

The remaining gap is an incomplete site-wide introduction, not a demonstrated
Map control failure. A dedicated guided entry could be useful later, but the
corrected evidence does not justify ranking it above confirmed layout defects
or public-catalogue trust problems.

### Community vs Official Heritage comprehension

**Medium — the visible distinction is strong, but its meaning is only partly
explained in plain language.** Layers identifies Community records as
contributed and locally maintained, and separates the layers with different
headings, controls, colours and marker shapes. However, the sentence explaining
that Official records come from national, provincial or municipal registers is
collapsed under Additional information and is followed by policy language
about authority, geometry provenance and active representations. A first-time
visitor can see that the layers differ without necessarily understanding the
difference in status and source.

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
| High | Public-auth and My nominations overflow horizontally on mobile | Places account content off-screen in a core sign-in/history journey and has a concrete CSS cascade cause. The re-test measured the sign-in document at 659 pixels in a 390-pixel viewport. |
| High | Public Places exposes test/placeholder records | Damages trust in the catalogue; remediation requires an explicit production-content decision. |
| Medium | Community and Official Heritage are visually distinct but their status/source difference is not explained concisely | Visitors can find and operate both layers, but the clearest source distinction is collapsed inside technical copy. |
| Medium | The long mobile Layers panel separates controls from the map | The layer choice is findable, but the map starts about 1,829 pixels down the page after Layers opens. |
| Medium | Generalized Point popup and accessible name are overly technical | The mandatory limitation is correct but appears within a large specialist payload. |
| Medium | Sparse place records show long stacks of missing-field fallbacks | Honest but reduces readability and perceived record quality. |
| Medium | Public copy contains stale counts, completed work described as future, and internal collection names | Creates avoidable confusion and maintenance drift. |
| Medium | Mobile navigation is crowded and below recommended touch height | Still usable, but high-frequency navigation is less comfortable than it should be. |
| Low | Home/default-map framing does not introduce Official Heritage | The introduction is incomplete, but the Layers tab and Official section are clear once a visitor uses the Map. |
| Low | Long guidance pages repeat some explanations | Content remains accurate and navigable, so this is polish rather than a blocker. |

## Recommended next implementation

### One recommendation: repair the mobile account layout

#### 1. Problem

At a `390 × 844` viewport, the public sign-in page expands to 659 pixels wide,
269 pixels beyond the viewport. The later two-column `.public-auth-layout`
declaration overrides the earlier responsive one-column rule, leaving core
account content collapsed or positioned off-screen. The signed-in My
nominations presentation is affected by the same shared layout.

#### 2. Why it matters

Sign-in and nomination history are real, current public features. Horizontal
overflow can prevent a mobile visitor from seeing or comfortably using the
account panel at all. This is a confirmed functional layout failure rather
than an inference about whether a visible control will be noticed.

#### 3. Evidence

- At `390 × 844`, the re-tested public-auth document was 659 pixels wide,
  producing 269 pixels of horizontal overflow.
- The first `.public-auth-layout` child remained visible, while the account
  content column was positioned at the right edge with zero visible width in
  the captured layout state.
- My nominations uses the same shared layout and retained horizontal overflow
  in the signed-out re-test; the earlier signed-in review showed the more severe
  two-column overflow state.
- Source inspection identifies the cascade cause: the mobile one-column rule
  precedes a later base two-column declaration, so the later declaration wins.
- The nomination form itself stacks correctly, isolating the recommendation to
  the shared account layout rather than the nomination workflow or Firebase.

#### 4. Why it ranks first

It is the clearest reproducible usability defect, affects a current end-to-end
public task and has a bounded presentation-layer cause. Public test data is
also High priority, but remediation needs a separately governed production
content decision. The corrected Official Heritage evidence shows clear
Map-level controls, so a new guided entry no longer ranks first.

#### 5. Approximate scope for PR #88

Implement one coherent **mobile account-layout repair**:

- correct the `.public-auth-layout` cascade so public-auth and My nominations
  use one column at the existing mobile breakpoint;
- ensure both the explanatory panel and account content remain within the
  viewport in signed-out and signed-in states;
- preserve readable spacing, focus order, labels, status messages and desktop
  two-column presentation;
- add focused browser coverage at `390 × 844` for public-auth and My
  nominations, asserting no page-level horizontal overflow and visible account
  content; and
- include a desktop regression check proving that the intended two-column
  layout still applies above the breakpoint.

This is one bounded implementation outcome: make the existing account journey
usable on mobile without changing authentication or nomination behavior.

#### 6. PR #88 must not

- change authentication, session, ownership, nomination or recovery behavior;
- change Firebase data, Auth configuration, Firestore/Storage rules, nomination
  privacy, exports or deployment configuration;
- change the Official or Community Heritage experiences, data models or map;
- change any official source record, publication decision, coordinate,
  category, GeoJSON or Generalized Point limitation;
- delete, hide or edit production test/placeholder records;
- bundle navigation, guidance-copy, popup or place-detail improvements; or
- reopen M31 or any GIS/geometry investigation.

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
