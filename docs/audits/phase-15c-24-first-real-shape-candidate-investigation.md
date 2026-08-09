# Phase 15C-24 — First real Official Heritage shape candidate investigation

## Decision

**No first production shape candidate is currently research-ready.**

This is a research/documentation-only result. It publishes no LineString,
MultiLineString, Polygon, or MultiPolygon and does not change an active Point.
The exact A/B/C/D totals are **0 / 10 / 1 / 18** across the authoritative
29-identity non-Point universe.

P09 蓉泉桥 is the highest-priority evidence target, not a preferred production
candidate. Its exact identity, bridge meaning, official description and low
sensitivity make it the strongest comparative lead, but its current reviewed
Point has 75 m uncertainty while the bridge is only 7.7 m long. No reusable
mapped bridge object was found in the bounded OpenStreetMap check. Inventing
endpoints from the commercial basemap, modern road or an east–west dimension
would fail the reproducibility and provenance gates.

## Scope, baseline and production boundary

- Baseline: `6e8de73610ff175e4b36fc0ea184d4526200b8cd`.
- Research date and source-access date: `2026-08-09`.
- Controlling policy: [Official Heritage spatial representation and publication policy](../policy/official-record-publication-policy.md).
- Controlling inventory: [Phase 15C-10 non-Point candidate inventory](../research/phase-15c-10-xinyu-non-point-candidate-inventory.md).
- Exact reconciliation and all-candidate results: [Phase 15C-24 candidate matrix](../research/phase-15c-24-first-real-shape-candidate-matrix.md).

Production remains 19 official source records, nine Point Features, eight
ordinary Points, one Generalized Point (P04 Xieli), ten exclusions, one
national/seven provincial/one municipal active records, zero lines and zero
areas. No source data, public-location decision, generated GeoJSON, runtime,
renderer, sidebar, style, test, Firebase, Community Heritage or deployment
file is changed.

The before/after protected-file hashes are required to remain:

| Production artifact | Before | Required after |
| --- | --- | --- |
| Public-location decisions | `95c6531d51e49caabf566b68f62087a6512bf9e4fd046d35819f44d8b3782f5b` | identical |
| Canonical Official Heritage GeoJSON | `eb99e7a222d2a8af40e294f650e043cb73bdc82f6eabf728f5c1ef29c03a64b3` | identical |
| Provincial compatibility GeoJSON | `c5fbfbef3cbdc30f0b3d02443b250a8089be668f701c3c9eca7391a1e488cbd9` | identical |

## Authoritative universe and outcome totals

Later merged Point and Generalized-Point work did not add or remove an
identity from the Phase 15C-10 non-Point register. It changed P04's active
representation and M13's publication state, but M13 is naturally point-like
and was never in this shape universe. P04 remains in the universe only in its
non-Point capacity and is now explicitly reconciled to its active Generalized
Point.

| Outcome | Lines | Areas | Total |
| --- | ---: | ---: | ---: |
| A — shape research-ready | 0 | 0 | 0 |
| B — promising, more evidence required | 1 | 9 | 10 |
| C — shape route not appropriate | 0 | 1 | 1 |
| D — withhold | 7 | 11 | 18 |
| **Authoritative total** | **8** | **21** | **29** |

Every identity reconciles exactly once in the supporting matrix. No unresolved
ordinary-Point or Generalized-Point universe was reopened beyond an identity's
legitimate shape capacity.

## Ranking method

Candidates were compared in this order: exact official identity; natural
line/area form; reusable georeferenced geometry; known CRS/datum; clear reuse
rights; official or institutional corroboration; resolved component meaning;
manageable uncertainty; low misleading-boundary risk; acceptable sensitivity;
reproducible topology; and no reliance on proprietary provider shapes.

The ordered serious set is:

1. P09 蓉泉桥 — B, strongest line lead; exact missing endpoint geometry.
2. N02 拾年山遗址 — B, compact documented area; no reusable extent.
3. N01 凤凰山铁矿遗址 — B, strong national/museum evidence; complex multipart extent.
4. P16 北伐军仰天岗战场遗址 — B, strong semantic dimensions; endpoints not georeferenced.
5. P02 芦塘窑址 component — B, authoritative natural-edge description; edges not georeferenced.
6. P01 棋盘山遗址 — B, strong morphology; no reusable platform/ditch geometry.
7. P12 分宜钤岗陵园 — B, appropriate landscape form; component/boundary plan absent.
8. M31 九龙山革命烈士纪念塔与墓 — B, appropriate multipart form; visitor grounds unresolved.
9. M01 碾糠山遗址 — B, exact identity lead; no institutional survey geometry.
10. M04 龚家山遗址 — B, exact identity lead; no institutional survey geometry.
11. P04 斜里遗址 — C, technically constructible square but a shape is less truthful than the active Generalized Point.

These 11 are “serious candidates” for the detailed 25-field review below.
The other 18 fail earlier identity, locality, feature, geometry, sensitivity or
meaning gates and are individually recorded as Outcome D in the matrix.

## Strongest source review

| Source | Issuer / reuse position | What it establishes | Why it does not create Outcome A |
| --- | --- | --- | --- |
| `新余市市级以上文物保护单位名录（2025年）`, index `3605000013-2025-01167` ([source](http://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml)) | 新余市文化广电旅游局; official administrative record; no raw GIS supplied | Current identity, authority, classification and locality universe | The table publishes no geometry, CRS or topology |
| `江西省人民政府关于公布第六批江西省文物保护单位保护范围的通知`, `赣府字〔2019〕18号`, and its annex ([preserved copy](https://commons.wikimedia.org/wiki/File%3A%E7%AC%AC%E5%85%AD%E6%89%B9%E6%B1%9F%E8%A5%BF%E7%9C%81%E6%96%87%E7%89%A9%E4%BF%9D%E6%8A%A4%E5%8D%95%E4%BD%8D%E4%BF%9D%E6%8A%A4%E8%8C%83%E5%9B%B4%E4%B8%80%E8%A7%88%E8%A1%A8.pdf)) | 江西省人民政府; Commons records `PD-PRC-exempt` for the administrative document | P02 natural edges, P04 DMS centre/cardinal offsets, P16 textual dimensions/endplaces | P02/P16 lack georeferenced edges; P04's derived square has unresolved visual meaning despite a bounded datum interpretation |
| `蓉泉桥` ([source](https://www.xysmuseum.com/593.html)) | 江西省新余市博物馆; site says “All Rights Reserved”; descriptive facts may corroborate, but no geometry reuse licence is granted | Exact bridge identity, locality, east–west direction, 7.7 × 2.1 m form | No endpoints or raw line geometry; description alone cannot place a 7.7 m line |
| `拾年山遗址` ([source](https://www.xysmuseum.com/588.html)), `凤凰山铁矿遗址` ([source](https://www.xysmuseum.com/587.html)), and `棋盘山遗址` ([source](https://www.xysmuseum.com/591.html)) | 江西省新余市博物馆; All Rights Reserved; institutional corroboration only | Exact identities, morphology and approximate areas (5,060 m², 150,000 m² and >10,000 m² respectively) | Area totals and prose do not define reusable rings, orientation, holes or components |
| OpenStreetMap API bounded map request around P09, bbox `115.0445,28.0710,115.0505,28.0770` ([request](https://api.openstreetmap.org/api/0.6/map?bbox=115.0445,28.0710,115.0505,28.0770)) | OpenStreetMap contributors; ODbL 1.0 | A reusable-source check returned an empty OSM payload in the reviewed vicinity on 2026-08-09 | There is no bridge object to reconcile, review or reuse; this is a dated absence check, not proof that OSM can never contain it |
| Gaode/Baidu evidence already preserved in merged audits | Commercial providers; corroboration only under policy | Named feature/locality/photo leads | Their shapes may not be copied or traced, their CRSs are not WGS84, and no provider API is added |

## Detailed 25-field serious-candidate review

### P09 蓉泉桥 — Outcome B

- **1 identity / 2 name / 3 level / 4 classification / 5 category:** P09; 蓉泉桥; provincial; 古建筑; Routes & infrastructure.
- **6 natural form / 7 type / 8 meaning:** short linear bridge; future LineString; reviewed historic bridge alignment, not the modern road or river.
- **9 strongest source / 10 authority:** Xinyu Museum `蓉泉桥`; 江西省新余市博物馆, corroborated by the current official register.
- **11 provenance / 12 reuse:** museum prose plus existing reviewed Gaode feature Point and a negative bounded OSM check; no reusable endpoints exist. Museum imagery/geometry has no reuse grant; OSM would be ODbL if a reconciled object existed.
- **13 CRS/datum / 14 WGS84 path / 15 construction:** current provider Point was GCJ-02 and deterministically inverted to WGS84, but its 75 m uncertainty cannot construct a 7.7 m line. A later line needs source endpoints in a stated datum and a documented transform; no construction is presently permitted.
- **16 topology / 17 uncertainty:** one continuous two-or-more-vertex LineString is expected; MultiLineString is unnecessary unless evidence shows disconnected surviving fabric. Future uncertainty is unknown and must be materially smaller than 7.7 m.
- **18 status / 19 boundary risk / 20 sensitivity:** future line would be authority-supplied or explicitly project-reviewed depending on its source; no legal-boundary risk; low sensitivity, but high false-alignment risk.
- **21 ambiguity / 22 active representation / 23 supersession:** identity is exact, but endpoints versus road alignment remain ambiguous; active ordinary Point `JX-XY-PCH-009`; an approved line must supersede the Point while preserving its provenance/history.
- **24 exact gap / 25 outcome:** reusable bridge-specific endpoints or centreline, known CRS, precision, licence and independent review; **B**.

### N02 拾年山遗址 — Outcome B

- **1–5:** N02; 拾年山遗址; national; 古遗址; Archaeological sites.
- **6–8:** compact areal archaeological site; Polygon, or MultiPolygon only if a plan proves disconnected components; reviewed visible/archaeological site representation, never an inferred legal boundary.
- **9–10:** Xinyu Museum `拾年山遗址`; 江西省新余市博物馆, corroborated by the national/current register.
- **11–12:** institutional prose reports about 5,060 m² and excavated remains; no raw geometry and the museum page is All Rights Reserved, so prose supports identity/scale only.
- **13–15:** no source CRS/datum or coordinate order; no WGS84 path; construction must wait for a reusable georeferenced archaeological or protection plan.
- **16–17:** expected closed non-self-intersecting outer ring with holes/components preserved if documented; uncertainty cannot be set from an area total and is unresolved.
- **18–20:** source status undecided; a project-reviewed ring could not be called official. A normal visitor could mistake a crisp ring for the legal boundary, so persistent wording/styling and evidence-specific meaning are mandatory. High archaeological/grave disclosure sensitivity.
- **21–23:** exact identity/locality, but excavation versus full-site extent unresolved; no active representation; no supersession.
- **24–25:** reusable georeferenced plan, topology, CRS, licence and disclosure approval; **B**.

### N01 凤凰山铁矿遗址 — Outcome B

- **1–5:** N01; 凤凰山铁矿遗址; national; 古遗址; Archaeological sites.
- **6–8:** areal and probably multipart mine/smelting landscape; Polygon/MultiPolygon; reviewed mine-site/component extent, not a generic 150,000 m² envelope.
- **9–10:** Xinyu Museum `凤凰山铁矿遗址`; 江西省新余市博物馆, corroborated by the national/current register.
- **11–12:** institutional description reports about 150,000 m² and multiple mine, furnace, mould and slag remains; no reusable rings and the page grants no reuse licence.
- **13–15:** no CRS/datum/order or WGS84 path; no hull, buffer or area-equivalent shape may be invented. Construction requires an authority/institutional GIS or georeferenced plan.
- **16–17:** likely MultiPolygon if verified components are disconnected; false connecting hulls and simplification must be rejected. Uncertainty unresolved.
- **18–20:** authority/project status depends on future source; any project interpretation must be labelled. High legal-boundary confusion and archaeological/mining access sensitivity.
- **21–23:** exact designation, but mine components versus designation extent unresolved; no active representation; no supersession.
- **24–25:** reusable component extent/topology, CRS, licence and sensitivity/access decision; **B**.

### P16 北伐军仰天岗战场遗址 — Outcome B

- **1–5:** P16; 北伐军仰天岗战场遗址; provincial; 近现代重要史迹; Parks, gardens & landscapes.
- **6–8:** broad linear-areal battlefield landscape; Polygon rather than a centreline; reviewed battlefield/site representation from Liangshannao to Gouxiongpo, not a forest-park or memorial boundary.
- **9–10:** sixth-batch provincial protection-range annex; 江西省人民政府.
- **11–12:** administrative annex reports about 3,000 × 100 m and named endplaces; the preserved document is recorded PD-PRC-exempt, but it contains no georeferenced endpoints or reusable GIS geometry.
- **13–15:** no CRS/datum/order for the textual description; no WGS84 transform is possible. Later construction needs both endpoints or an authority extent and must reproduce its source scale and transform.
- **16–17:** a closed elongated Polygon is expected; it must not be simplified into a line or connected to separate memorial grounds. Uncertainty is unresolved and earlier research proposed at least 250 m only after endpoints are known.
- **18–20:** likely project-reviewed unless authority GIS is obtained; severe legal-boundary/false-precision risk; moderate military-site sensitivity and access risk.
- **21–23:** battlefield identity is distinct from park/memorial evidence; no active battlefield representation; no supersession.
- **24–25:** georeferenced endpoints or authoritative extent, CRS, reuse record and battlefield/memorial reconciliation; **B**.

### P02 袁州明代城墙砖窑址群（芦塘窑址） — Outcome B

- **1–5:** P02; 袁州明代城墙砖窑址群（芦塘窑址）; provincial Xinyu component; 古遗址; Archaeological sites.
- **6–8:** areal/multipart kiln component; Polygon for the verified Xinyu component, MultiPolygon only for separately verified pieces; reviewed Xinyu-component extent.
- **9–10:** sixth-batch provincial protection-range annex; 江西省人民政府.
- **11–12:** reusable administrative text names a village road, ditch, terrace and reservoir embankment; its separate coordinate block belongs to non-Xinyu components and cannot be reassigned. Document reuse is clear; geometry provenance is absent.
- **13–15:** no CRS/datum/order for the four Xinyu edges; no WGS84 path. Construction requires a georeferenced plan that identifies each named edge.
- **16–17:** each component must be closed and valid; no false cross-component segment or convex hull; uncertainty unresolved.
- **18–20:** future project-reviewed interpretation unless authority GIS is supplied; very high legal-boundary confusion because the source is a protection-range annex; high archaeological/kiln sensitivity.
- **21–23:** Xinyu 芦塘 component must not stand for the cross-city parent or other 13 components; no active representation; no supersession.
- **24–25:** georeferenced Xinyu edges/component inventory, CRS and independent topology review; **B**.

### P01 棋盘山遗址 — Outcome B

- **1–5:** P01; 棋盘山遗址; provincial; 古遗址; Archaeological sites.
- **6–8:** rectangular hilltop/platform plus wider settlement; Polygon/MultiPolygon; reviewed platform/ditch or site representation, not an area-equivalent rectangle.
- **9–10:** Xinyu Museum `棋盘山遗址`; 江西省新余市博物馆.
- **11–12:** institutional prose provides >10,000 m² overall, 3,000 m² centre, ditch and relation north of 章塘; no reusable raw geometry and All Rights Reserved presentation.
- **13–15:** no coordinate/CRS/datum/order; no WGS84 path. A generic rectangle, village offset or provider highlight is prohibited.
- **16–17:** Polygon unless a surveyed plan proves disconnected surrounding remains; ring/ditch relationships and any holes must be preserved. Uncertainty unresolved.
- **18–20:** source status undecided; high legal-boundary confusion and archaeological sensitivity.
- **21–23:** exact site identity but nearby P15 and surrounding remains require separation; no active representation; no supersession.
- **24–25:** reusable georeferenced platform/ditch plan, CRS, licence and sensitivity approval; **B**.

### P12 分宜钤岗上高会战中国军队阵亡将士陵园 — Outcome B

- **1–5:** P12; 分宜钤岗上高会战中国军队阵亡将士陵园; provincial; 近现代重要史迹; Parks, gardens & landscapes.
- **6–8:** areal/multipart cemetery landscape; Polygon/MultiPolygon; reviewed memorial/cemetery landscape extent distinguishing graves, protected fabric and visitor grounds.
- **9–10:** current official register; 新余市文化广电旅游局, with named provider/locality corroboration preserved in merged research.
- **11–12:** official identity plus commercial corroboration only; no reusable site plan. Provider boundaries may not be copied and supply no acceptable geometry provenance.
- **13–15:** no source CRS/datum/order or WGS84 path; construction awaits a reusable institutional plan or survey.
- **16–17:** MultiPolygon may be needed for separate graves/parcels; never connect them with a false hull or substitute park/village bounds. Uncertainty unresolved.
- **18–20:** status depends on future source; high legal-boundary confusion and high cemetery/grave disclosure and visitor-access sensitivity.
- **21–23:** 金鸡埔 locality, graves and wider landscape are not yet component-resolved; no active representation; no supersession.
- **24–25:** reusable site plan, component inventory, CRS, licence and access/disclosure review; **B**.

### M31 九龙山革命烈士纪念塔与墓 — Outcome B

- **1–5:** M31; 九龙山革命烈士纪念塔与墓; municipal; 近现代重要史迹; Parks, gardens & landscapes.
- **6–8:** areal/multipart memorial landscape; Polygon/MultiPolygon; reviewed tower/grave/landscape components, not a public-park outline.
- **9–10:** current official register; 新余市文化广电旅游局, with exact/variant provider corroboration in merged research.
- **11–12:** official identity and commercial locality evidence; no reusable geometry and no permitted provider tracing.
- **13–15:** no source CRS/datum/order or WGS84 path; construction awaits a reusable authority/institutional site plan.
- **16–17:** separate components require MultiPolygon without false connectors; holes and visitor grounds must follow evidence. Uncertainty unresolved.
- **18–20:** status depends on future source; high legal-boundary/park-confusion risk; high grave sensitivity but public memorial access may be manageable after review.
- **21–23:** tower, graves, memorial landscape and park are not yet separated; no active representation; no supersession.
- **24–25:** reusable component plan, CRS, licence, access and disclosure decision; **B**.

### M01 碾糠山遗址 — Outcome B

- **1–5:** M01; 碾糠山遗址; municipal; 古遗址; Archaeological sites.
- **6–8:** areal archaeological site; Polygon/MultiPolygon; reviewed archaeological-site representation.
- **9–10:** current official register; 新余市文化广电旅游局, with exact provider identity leads in merged research.
- **11–12:** identity/locality corroboration only; no reusable survey geometry and no provider tracing right.
- **13–15:** no CRS/datum/order, WGS84 path or lawful construction method yet.
- **16–17:** ring/component topology depends entirely on a future survey; uncertainty unresolved.
- **18–20:** status undecided; high legal-boundary confusion and archaeological sensitivity.
- **21–23:** identity is promising but the protected feature/extent is not component-resolved; no active representation; no supersession.
- **24–25:** reusable institutional survey/protection extent, CRS, licence and sensitivity approval; **B**.

### M04 龚家山遗址 — Outcome B

- **1–5:** M04; 龚家山遗址; municipal; 古遗址; Archaeological sites.
- **6–8:** areal archaeological site; Polygon/MultiPolygon; reviewed archaeological-site representation.
- **9–10:** current official register; 新余市文化广电旅游局, with an exact provider result preserved in merged research.
- **11–12:** identity/locality corroboration only; no reusable survey geometry and no provider tracing right.
- **13–15:** no CRS/datum/order, WGS84 path or lawful construction method yet.
- **16–17:** ring/component topology depends entirely on a future survey; uncertainty unresolved.
- **18–20:** status undecided; high legal-boundary confusion and archaeological sensitivity.
- **21–23:** exact-name lead does not resolve the protected extent; no active representation; no supersession.
- **24–25:** reusable institutional archaeological plan, CRS, licence and sensitivity approval; **B**.

### P04 斜里遗址 — Outcome C

- **1–5:** P04; 斜里遗址; provincial; 古遗址; Archaeological sites.
- **6–8:** naturally areal archaeological site; a Polygon was considered; the only constructible shape would mean a project-created source-described support square, not visible site extent or legal boundary.
- **9–10:** sixth-batch provincial protection-range annex; 江西省人民政府, corroborated by Xinyu Museum.
- **11–12:** annex publishes `27°45′45.3″ N, 114°55′11.2″ E` and four 30 m offsets; document reuse is recorded PD-PRC-exempt, but the resulting square is a project interpretation, not authority-supplied vertices.
- **13–15:** source says only GPS; accepted WGS84/CGCS2000 geographic interpretations preserve the numerals at map precision with a 1 m outward frame allowance. A local metre projection could create a 60 × 60 m closed square and return vertices to WGS84.
- **16–17:** topology is a simple closed Polygon without holes; numerical construction is reproducible, but the datum/source-position and semantic uncertainty dominate. The live Point records 50 m outward support coverage rather than presenting the square as extent.
- **18–20:** project-reviewed interpretation only; a normal visitor is highly likely to mistake the crisp square for archaeological/legal extent. High archaeological/grave sensitivity. Wording cannot make the unnecessary crisp ring more truthful than the current symbol at normal map use.
- **21–23:** exact identity; no component conflict; active Generalized Point `JX-XY-PCH-004`. Any approved later area would have to supersede it, but the present shape route is rejected.
- **24–25:** no evidence-specific visible/surveyed extent and no visitor-value case that outweighs misleading precision; **C**.

## Boundary-risk conclusions

Every serious area candidate could be mistaken by a normal visitor for a legal
protection boundary if displayed as a crisp ring. For the nine Outcome B area
leads this is a material gate: a later proposal must tie the ring to a specific
visible/site/landscape meaning, state whether it is authority supplied or
project reviewed, use persistent limitation wording and styling, and withhold
the shape if those controls remain insufficient. P04 is Outcome C because its
constructible square has already failed that meaning test; the Generalized
Point is more honest.

## Read-only technical-readiness check

The current runtime already supports the candidate types in principle:

- `official-geometry-schema.js` accepts and validates LineString,
  MultiLineString, Polygon and MultiPolygon plus type-specific meanings,
  provenance, uncertainty, review and representation metadata;
- `provincial-heritage-map.js` validates public Features and rejects duplicate
  active representation IDs;
- `official-geometry-rendering.js`, `map.js` and the browser fixtures cover
  line/area rendering, popup limitations, accessible text, feature-level
  activation and one-active-feature behavior;
- Official categories and the Official Heritage master layer are independent
  of geometry type; and
- synthetic unit/browser tests already exercise all four non-Point types.

No candidate-specific technical blocker was found. The blocker is evidence:
there is no currently approved, reusable, georeferenced candidate geometry
with a defensible meaning, CRS path, uncertainty and risk decision. No
schema/sidebar/lifecycle/renderer change is justified by this audit.

## What a later Outcome A proposal would need

No later publication PR is authorized here. If P09 obtains qualifying
endpoints first, a separate proposal would need to touch only the
candidate-specific canonical identity/decision and deterministic output,
candidate tests, publication audit and minimal status documentation. It would
need to make the LineString the sole active P09 representation, preserve the
old Point in provenance/history, disclose that the line is a reviewed bridge
alignment rather than a legal boundary, and prove the source CRS, transform,
precision, uncertainty, licence and topology. Exact file scope must be
re-derived from the then-current baseline rather than copied from this audit.

## Verification result and stop point

| Check | Result |
| --- | --- |
| Candidate universe | Pass: 29 rows, 29 unique IDs, 8 lines, 21 areas, no duplicates |
| Documentation links | Pass: every local link in the five changed documents resolves |
| JSON/GeoJSON parse | Pass: every repository data JSON/GeoJSON file parses |
| Canonical geometry | Pass: nine Points; zero LineString, MultiLineString, Polygon or MultiPolygon Features |
| Official validation | Pass: 19 records, nine approved decisions/Features, ten expected exclusions, zero hard errors, seven provincial compatibility Features |
| Deterministic generation | Pass: canonical and provincial compatibility outputs are byte-for-byte current; legacy provincial output is current |
| Full `npm test` | Pass |
| Browser smoke | Pass: 44/44 on the final complete run; synthetic line/area accessibility included |
| `git diff --check` | Pass |
| Protected hashes | Pass: all three match the baseline values recorded above |

The first browser run had one transient Layers-tab visibility timeout in an
unrelated synthetic approximate-Point case; that case passed immediately in
isolation and the subsequent complete 44-test browser run passed. No code or
test change was made.

This phase stops after one documentation commit and a draft pull request. It
does not select a preferred production candidate, publish a shape, supersede a
Point, begin an implementation PR, change providers, deploy, merge, or start a
new candidate universe.
