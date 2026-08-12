# Phase 15C-25 — Nine-shape-candidate deep investigation

## Decision

**No first production shape candidate is research-ready after Phase 15C-25.**

Exactly nine identities were investigated and assigned exactly one final
outcome. The result is **0 A / 9 B / 0 C / 0 D**. All nine retain a plausible
Polygon or MultiPolygon route in principle, but each still lacks at least one
material evidence, reuse, CRS, topology, misleading-risk or sensitivity gate.
No preferred first production shape candidate is selected.

M31 九龙山革命烈士纪念塔与墓 produced the strongest new spatial-evidence
lead: a 2024 authority announcement and 1:500 survey-plan image with separate
monument and grave protection areas, a survey date, and a named coordinate
system. It remains Outcome B because the available mirrored image is too
compressed for reproducible coordinate recovery, the original/raw geometry
and WGS84 path were not found, reuse rights for a derived shape are unclear,
and grave/access review remains open.

This is a research/documentation-only result. It publishes no Polygon or
MultiPolygon, constructs no committed research geometry, changes no active
representation and authorizes no later publication.

## Scope, baseline and protected boundary

- Baseline and `origin/main`: `a178a682699708e08fb5944bb4effc46be468962`.
- Branch: `codex/investigate-nine-official-shape-candidates`.
- Research and source-access date: `2026-08-11`.
- Detailed reconciliation: [nine-candidate evidence matrix](../research/phase-15c-25-nine-shape-evidence-matrix.md).
- Controlling policy: [Official Heritage publication policy](../policy/official-record-publication-policy.md).
- Starting audit: [Phase 15C-24 first real shape investigation](./phase-15c-24-first-real-shape-candidate-investigation.md).

The exact investigation universe is `N01, N02, P01, P02, P12, P16, M01,
M04, M31`. P09 蓉泉桥 and P04 斜里遗址 were not reopened. No other
candidate was added.

Production remains 19 official source records, nine Point Features, eight
ordinary Points, one Generalized Point (P04 Xieli), ten exclusions, one
national/seven provincial/one municipal active records, zero lines and zero
areas. No production data, runtime, renderer, sidebar, style, lifecycle,
provider, Firebase, Community Heritage or deployment file is changed.

| Protected production artifact | Before | Required after |
| --- | --- | --- |
| Public-location decisions | `95c6531d51e49caabf566b68f62087a6512bf9e4fd046d35819f44d8b3782f5b` | identical |
| Canonical Official Heritage GeoJSON | `eb99e7a222d2a8af40e294f650e043cb73bdc82f6eabf728f5c1ef29c03a64b3` | identical |
| Provincial compatibility GeoJSON | `c5fbfbef3cbdc30f0b3d02443b250a8089be668f701c3c9eca7391a1e488cbd9` | identical |

## Method and evidence standard

Searches combined exact Chinese names, known localities and component names
with terms for protection plans, archaeology, survey/excavation drawings,
coordinates, GIS, shapefile, KML, WMS/WFS, planning maps and PDFs. Government,
heritage-authority and institutional sources were prioritized. PDF annex pages
and the M31 plan image were visually inspected for coordinates, grid, scale,
north arrow, CRS and component meaning.

Exact-name OpenStreetMap/Nominatim searches on 2026-08-11 produced no
reconciled heritage object for any of the nine. Fuzzy results for N02, P02,
M01 and M04 referred to unrelated features and were rejected. OSM would be a
reusable ODbL source if an exact object existed, but the negative check creates
no geometry and is not proof that OSM can never contain one.

Gaode/Baidu results preserved by earlier audits were used only for identity or
locality corroboration. No provider shape, display centre or imagery was
copied or traced. Descriptive area totals, offsets and dimensions were not
turned into area-equivalent rings, buffers, rectangles or convex hulls.

Outcome A required resolved meaning, reproducible geometry, a known or
policy-acceptable source-to-WGS84 path, clear geometry reuse, reviewed
topology and uncertainty, an acceptable legal-boundary-confusion decision,
sensitivity/access clearance and a supersession plan where relevant. A public
map image alone was not treated as reusable or georeferenceable.

## Source and reuse ledger

| Source, issuer and URL | Evidence used | Reuse conclusion |
| --- | --- | --- |
| `新余市市级以上文物保护单位名录（2025年）`, 新余市文化广电旅游局 ([official register](http://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml)) | Current identity, level, classification and locality, including M01 南门村, M04 宠江村 and M31 黄田村 | Official administrative facts; no raw geometry, CRS or topology is supplied |
| `第六批江西省文物保护单位保护范围一览表`, 江西省人民政府 ([preserved PDF](https://upload.wikimedia.org/wikipedia/commons/6/63/%E7%AC%AC%E5%85%AD%E6%89%B9%E6%B1%9F%E8%A5%BF%E7%9C%81%E6%96%87%E7%89%A9%E4%BF%9D%E6%8A%A4%E5%8D%95%E4%BD%8D%E4%BF%9D%E6%8A%A4%E8%8C%83%E5%9B%B4%E4%B8%80%E8%A7%88%E8%A1%A8.pdf)) | P02 natural edges, P12 cemetery-plus-15 m rule and P16 named span/dimensions | Commons records the administrative document as `PD-PRC-exempt`; its text can be used, but it provides no reproducible raw ring for these three records |
| `凤凰山铁矿遗址`, `拾年山遗址`, `棋盘山遗址`, 江西省新余市博物馆 ([N01](https://www.xysmuseum.com/587.html), [N02](https://www.xysmuseum.com/588.html), [P01](https://www.xysmuseum.com/591.html)) | Institutional identity, morphology, approximate area and component facts | Site states `All Rights Reserved`; prose corroborates facts but grants no map/image/geometry reuse |
| `新余市博物馆2022年度部门决算`, 新余市博物馆 ([PDF](https://www.xysmuseum.com/static/upload/file/20240221/1708511618338726.pdf)) | Records N01 archaeology-park and national/provincial protection-range information work | No raw GIS, public download or geometry reuse statement |
| `凤凰山铁矿遗址考古工作启动` report, sourced to 分宜文旅 ([report](https://www.sohu.com/a/984539922_121106832)) | On 4 February 2026, Fenyi, Peking University archaeology and Jiangxi archaeology authorities agreed to systematic survey/exploration to clarify composition and spatial distribution | Current-work evidence only; no completed map, raw geometry or reuse licence |
| `凤凰山铁矿遗址保护利用工作取得新进展`, 江西日报 ([article](https://epaper.jxxw.com.cn/html/2023-05/19/content_5411_7712601.htm)) | Identifies a 2020 detailed investigation report, 2022 protection-plan review work and archaeology-park development | Descriptive lead; the named report/plan was not found as reusable spatial data |
| `关于拾年山遗址保护规划编制立项的意见`, 国家文物局, `办保函〔2015〕309号` ([preserved text](https://www.lvga.com/fagui/jjl/gcjz/913112.shtml)) | The 2015 opinion did not approve initiation because systematic survey/research had not established distribution/layout | Administrative lead on a non-authority mirror; no later approved plan, geometry or reuse record was found |
| `关于划定新余市仰天岗烈士陵园、九龙山乡革命烈士纪念碑及烈士墓地保护范围和建设控制地带的公告`, 新余市人民政府, 2024-12-31 ([mirrored announcement](https://www.sohu.com/a/844378542_121106994), [attached plan](https://q5.itc.cn/q_70/images03/20250102/4d8f2eeb43af48d48f4aaef6c92bb7fb.jpeg)) | M31 component offsets/areas and a 1:500 December 2024 survey plan labelled `2000国家大地坐标系` / `1985国家高程基准` | Official facts are strong, but only a compressed mirrored image was available; no original raw/full-resolution geometry or express permission for a derived shape was found |
| OpenStreetMap Nominatim exact-name searches ([service](https://nominatim.openstreetmap.org/)) | Reusable-object search across all nine; no exact reconciled heritage feature found on 2026-08-11 | OSM data is ODbL 1.0, but no candidate geometry exists to reuse |

The national protection-unit list was also checked for identity corroboration
([State Council PDF](https://www.gov.cn/guoqing/2014-07/21/dqpqgzdwwbhdwmd.pdf));
it does not supply site geometry. Tourism/news descriptions for P12 and P16
were treated only as discovery leads because they supplied neither reusable
plans nor an acceptable CRS path.

## Candidate-by-candidate findings

### N01 凤凰山铁矿遗址 — Outcome B

The investigation found evidence that the missing spatial work is active, not
complete: the 2026 cooperation project expressly aims to clarify site
composition and spatial distribution. Earlier institutional reporting points
to a 2020 investigation, 2022 protection-plan work and digitized range
information, but none was found as a publicly reusable plan or dataset.

The truthful future meaning remains a reviewed mine/smelting component extent,
probably MultiPolygon if mine, furnace, mould and slag components are
disconnected. No convex hull, approximate-area ring or generic archaeology-
park outline is acceptable. Original CRS, coordinates, WGS84 transformation,
topology, uncertainty and reuse are all absent. Restricted-mine access and
archaeological disclosure require review. There is no active representation,
so no supersession is required.

**Exact blocker:** completed reusable component survey/protection geometry,
source CRS and WGS84 path, topology, reuse permission and access/sensitivity
decision.

### N02 拾年山遗址 — Outcome B

The 2015 national opinion is material new context: protection-plan initiation
was not approved because the site lacked systematic survey/research sufficient
to clarify distribution and layout. No later approved plan was located.
Published figures for the full site, a 35 × 67 m platform and excavated area
refer to different scopes and cannot be reconciled into one ring.

A future Polygon must name whether it depicts the full reviewed site, platform
or another surveyed extent. No reusable ring, CRS, transformation, uncertainty
or topology exists, and archaeological/grave disclosure remains sensitive.
There is no active representation or supersession.

**Exact blocker:** a later approved or institutional georeferenced plan that
resolves excavation/platform/full-site scope, plus clear geometry reuse, CRS,
topology and disclosure approval.

### P01 棋盘山遗址 — Outcome B

Exact searches confirmed institutional survey/drilling prose but found no
survey drawing, excavation plan, protection-range map, coordinate table or GIS.
The central platform, surrounding ditch and wider settlement are different
potential meanings. Neither the >10,000 m² total nor the roughly 3,000 m² centre
defines orientation, vertices, holes or components.

No source CRS or WGS84 route exists and museum maps/images have no reuse grant.
A crisp ring would risk appearing to be an exact legal boundary. Archaeological
disclosure remains high. There is no active representation or supersession.

**Exact blocker:** reusable georeferenced platform/ditch/site geometry with one
explicit meaning, CRS/transform, topology, uncertainty, licence and sensitivity
decision.

### P02 袁州明代城墙砖窑址群（芦塘窑址） — Outcome B

The provincial annex page was inspected directly. It supplies a meaningful
semantic boundary—north village road, east ditch, south terrace and west
reservoir embankment—but no map or coordinates for the Xinyu component. The 16
coordinate pairs elsewhere on the page belong to 12 Yichun components and were
not reassigned. Searches for the 芦塘/岭背 component and named edges found no
georeferenced component plan.

The intended meaning could be the authority protection extent if the actual
authority geometry is obtained. Until then any ring would be an invented legal
boundary; commercial imagery tracing is prohibited. CRS, WGS84 path, topology
and uncertainty remain unknown. There is no active representation.

**Exact blocker:** reusable Xinyu-component plan/GIS resolving all four named
edges, its CRS/WGS84 path and topology, with appropriate authority reuse.

### P12 分宜钤岗上高会战中国军队阵亡将士陵园 — Outcome B

The provincial annex gives stronger semantics than previously recorded: the
cemetery is at 亚林中心山下林场, 500 m west of 万年桥, and the
protection range is the cemetery plus 15 m in every direction, totalling 3,190
m². It still omits the base cemetery ring. A buffer cannot be reproduced from
a locality, total area or grave count.

A later geometry could be an authority protection Polygon or reviewed
cemetery MultiPolygon, but the two meanings must not be conflated. No CRS,
coordinates, WGS84 transform, component inventory or uncertainty is available.
Individual grave disclosure and visitor access make sensitivity high. There is
no active representation.

**Exact blocker:** reusable base cemetery/site geometry and components, source
CRS/WGS84 path, topology, reuse rights and grave/access disclosure decision.

### P16 北伐军仰天岗战场遗址 — Outcome B

The inspected provincial annex describes the battlefield from 梁山脑 to
狗熊坡, about 3,000 m east–west and about 100 m from the ridge to both
slopes, with trenches, bunkers and shell pits. Searches for both endpoint
variants and protection/management plans found no georeferenced plan or
endpoint table.

The future meaning remains a reviewed battlefield landscape Polygon, not a
centreline, dimension-derived rectangle, forest-park boundary or memorial
outline. CRS, WGS84 path, topology and uncertainty are absent. Terrain/access
and feature-disclosure risks remain material. There is no active representation.

**Exact blocker:** georeferenced endpoints/ridge and feature inventory or
authority extent, plus reuse, CRS/WGS84 transform, topology, uncertainty and
access/sensitivity review.

### M01 碾糠山遗址 — Outcome B

The official row remains 渝水区南安乡南门村. A derived secondary page
placed a same-name site at 汪家村; because it conflicts with the controlling
official locality and supplies no spatial plan, it was rejected rather than
used to move or shape the record. No municipal archaeological plan, protection
plan, map figure, coordinate table or GIS was located.

The intended meaning remains a reviewed archaeological-site extent. There is
no reusable source geometry, CRS, transform, topology or uncertainty. Provider
display geometry remains prohibited, and archaeological sensitivity is high.
There is no active representation.

**Exact blocker:** official reconciliation of the conflicting secondary
locality and a reusable municipal survey/protection extent with CRS/WGS84 path,
topology, uncertainty, licence and sensitivity approval.

### M04 龚家山遗址 — Outcome B

The controlling locality remains 高新区水西镇宠江村. Searches found no
record-specific municipal survey, protection drawing, coordinates or GIS. A
search result for an excavation report titled `江西新余龚门山遗址发掘简报`
has a different designation and was not substituted without identity proof.

No geometry, CRS, WGS84 path, reuse, topology or uncertainty is available.
Identity conflation and archaeological disclosure are material risks. There is
no active representation.

**Exact blocker:** record-specific authoritative archaeological/protection
plan or GIS, clear geometry reuse, CRS/WGS84 transform, topology, uncertainty
and sensitivity decision.

### M31 九龙山革命烈士纪念塔与墓 — Outcome B

The 2024 announcement materially advances the evidence. It places the record
opposite 九龙山乡人民政府 and separates a 400 m² monument protection
area, a 97.1 m² grave protection area and a 27,016.2 m² construction-control
zone. The attached plan includes a north arrow, 1:500 scale, December 2024
digital-survey date, 2000 National Geodetic Coordinate System and 1985 height
datum. This supports a likely MultiPolygon with distinct monument and collective
grave protection components; no false connecting hull is appropriate.

The only located copy is a compressed 554 × 371 mirrored JPEG. Border/grid
labels are not legible enough to reproduce control coordinates, and no original
full-resolution plan, CAD/GIS download or coordinate table was found. The
horizontal CRS family is named, but zone/central-meridian and source coordinates
needed for a defensible WGS84 transform are not recoverable. The public notice
supports legal facts; it does not clearly license derivation from the embedded
survey image. No provisional coordinates were constructed.

Because this would truly depict authority protection areas, the legal meaning
could be accurately labelled if the source geometry is obtained. The crisp
shape would nonetheless be understood as a legal boundary and must not be
approximated. Grave/access disclosure remains open. There is no active
representation or supersession.

**Exact blocker:** original full-resolution/raw authority plan or GIS with
legible coordinates and complete CRS parameters, explicit geometry-reuse
position, reproducible WGS84 derivation, reviewed MultiPolygon topology and
grave/access disclosure decision.

## CRS, geometry, topology and uncertainty result

No candidate supports a provisional WGS84 geometry under the Phase gate, so no
temporary or committed geometry fixture was created. M31 is the only source
found with a named horizontal CRS, but the compressed copy omits recoverable
coordinate control and full projection parameters. P02, P12 and P16 provide
authoritative semantic rules without coordinate-bearing geometry. The other
five provide descriptive scale or identity only.

Consequently there is no defensible source coordinate order, transformation
method, WGS84 vertex set or quantitative transformation uncertainty to report.
Expected topology remains evidence-led: likely MultiPolygon for N01 and M31;
Polygon or proven MultiPolygon for N02/P01/P02/P12/M01/M04; and Polygon for P16.
No false hulls, buffers, component bridges or dimension-derived rectangles were
constructed.

## Misleading-boundary, sensitivity and supersession result

P02, P12 and M31 concern protection extents and would reasonably be read as
legal boundaries. Only exact authority geometry with an appropriate reuse
decision can support that meaning; a project approximation would be misleading.
The other six require persistent wording that distinguishes a reviewed
archaeological, mine, battlefield or memorial representation from legal limits.

All nine are currently unpublished, so none requires supersession. If any is
later approved, it would become the identity's sole active representation; no
Point and shape may coexist. Archaeological disclosure applies to N01, N02,
P01, P02, M01 and M04; cemetery/grave disclosure to P12 and M31; and unstable
terrain/access or military-feature sensitivity to N01 and P16. Those decisions
remain evidence gates, not styling afterthoughts.

## Read-only technical compatibility

The merged runtime already validates and renders Polygon/MultiPolygon Features,
supports type-specific meaning/provenance/uncertainty/review metadata, exposes
persistent popup limitations and equivalent accessible text, and enforces one
active representation per identity. Existing synthetic tests cover both area
types. Because no candidate reached Outcome A, no candidate fixture or browser
run was needed and no technical system change is justified. The blocker remains
candidate evidence, not schema, renderer, sidebar, filter or lifecycle support.

## Verification result and stop point

| Check | Result |
| --- | --- |
| Candidate reconciliation | Pass: nine rows, nine unique required IDs, each exactly once |
| Final outcomes | Pass: `0 A + 9 B + 0 C + 0 D = 9`; no preferred candidate |
| Source/provenance review | Pass: successful and unsuccessful spatial searches recorded; geometry-bearing leads have issuer, title, URL, access date and reuse conclusion |
| Source URL availability | Pass: all 13 cited external source/service URLs returned HTTP 200 on 2026-08-11 |
| Documentation links | Pass: all local links in changed documentation resolve |
| JSON/GeoJSON parse | Pass: all repository JSON/GeoJSON parses |
| Canonical geometry | Pass: nine Points and zero LineString, MultiLineString, Polygon or MultiPolygon Features |
| Official validation | Pass: 19 records, nine approved decisions/Features, ten expected exclusions, zero hard errors and seven provincial compatibility Features |
| Deterministic generation | Pass: production outputs are byte-for-byte current |
| Full `npm test` | Pass |
| Browser smoke | Not required: no runtime or candidate geometry changed, and no Outcome A fixture exists |
| `git diff --check` | Pass |
| Protected hashes | Pass: all three match their before values above |

This phase stops at documentation and draft PR #84. It does not publish or
select a shape, reopen P09 or Xieli, supersede a representation, redesign
infrastructure, deploy, merge, or begin a publication implementation PR.
