# Phase 14C — Coordinate-research readiness

## 1. Status and boundaries

Phase 14A remains the authoritative Chinese source transcription. Phase 14B remains the approved project interpretation. Coordinate evidence will be a separate project research layer.

No coordinate in this phase comes from the official designation notice, and no actual coordinate is recorded in this document. A locality name does not automatically identify the protected site. Unresolved records must remain unmapped rather than receive a guessed point.

This document defines a human-review methodology and a blank worksheet only. It does not:

- research or add candidate coordinates;
- add latitude or longitude values;
- create JSON, CSV, a machine-readable dataset, geometry, or GeoJSON;
- add markers, layers, Map controls, or public-page behavior;
- change Firebase, rules, indexes, Storage, Hosting, CSP, workflows, configuration, tests, exports, or deployment behavior;
- begin Phase 14C-2.

## 2. Research-source hierarchy

### Tier 1

Sources:

- government heritage records;
- cultural-relics bureaus;
- official archaeological institutes or museums;
- official survey and planning documents;
- official GIS or open-data portals;
- coordinates published by the responsible authority.

Permitted use: primary coordinate evidence when the exact designated site, source coordinate reference system or datum, and relationship to the wider locality are clear.

Confidence ceiling: **High**.

### Tier 2

Sources:

- peer-reviewed academic papers;
- university repositories;
- excavation and survey reports;
- scholarly heritage inventories;
- institutional site plans.

Permitted use: primary or corroborating evidence.

Confidence ceiling: **High** with a direct surveyed or grid-based source and an independent identity cross-check; otherwise **Medium**.

### Tier 3

Sources:

- major map providers;
- satellite imagery;
- local gazetteers;
- reputable news;
- institutional tourism pages.

Permitted use: discovery and visual corroboration.

Confidence ceiling: **Medium** only when anchored to Tier 1 or Tier 2 evidence.

### Tier 4

Sources:

- blogs;
- social media;
- crowd-sourced pins;
- copied listings;
- unsourced directories.

Permitted use: search-term discovery only.

Confidence ceiling: **None**.

### Cross-tier rules

- Source tier alone never determines confidence.
- Evidence must match the official name, administrative area, site type, period, and component description.
- Independent sources must not merely repeat the same notice or pin.
- Satellite imagery cannot independently identify a buried archaeological site.
- Tier 4 evidence never supports a renderable point.

### Locality rule

Town centres, village centres, district centroids, city centres, factory compounds, reservoirs, roads, and other broad localities are not acceptable as final heritage-site coordinates by themselves.

They may be used as:

- search anchors;
- supporting context;
- corroborating evidence;
- final coordinates only when authoritative evidence specifically identifies the protected site at that exact place.

## 3. Evidence model

The research worksheet should use three conceptual groups. This is a human-review model, not a machine-data contract.

### Record decision fields

- `recordId`
- `officialNameZh`
- `projectNameEn`
- `researchStatus`
- `coordinateConfidence`
- `coordinateMethod`
- `approvedLatitude`
- `approvedLongitude`
- `coordinateReferenceSystem`
- `uncertaintyReason`
- `estimatedUncertaintyMeters`
- `renderable`
- `sensitivityAssessment`
- `publicationLocationPolicy`
- `reviewer`
- `reviewedDate`
- `researchNotes`

### Candidate fields

- `candidateId`
- `candidateLatitude`
- `candidateLongitude`
- `candidateSourceCRS`
- `candidatePrecision`
- `candidateMethod`
- `candidateStatus`
- `candidateUncertaintyReason`
- `candidateRejectionReason`

### Evidence-source fields

- `evidenceId`
- `candidateId`
- `coordinateSourceTitle`
- `coordinateSourcePublisher`
- `coordinateSourceUrl`
- `coordinateSourceType`
- `sourceTier`
- `coordinateSourceDate`
- `coordinateAccessedDate`
- `evidenceQuoteOrSummary`
- `placeMatchEvidence`
- `coordinateDerivationNote`
- `coordinateTransformationMethod`
- `independentCrossCheck`
- `evidenceLimitations`

The later research document should contain:

- one ten-record summary table;
- one subsection per record;
- multiple candidate blocks per record;
- evidence-source lists attached to candidates;
- rejected and superseded candidates retained with reasons;
- no repeated `source1` / `source2` / `source3` columns.

## 4. Research-status vocabulary

### Record status

`not-started`
: No record-specific searching has begun.

`researching`
: Sources are being collected; no candidate is ready.

`candidate-found`
: At least one plausible candidate exists but has not been sufficiently cross-checked.

`needs-cross-check`
: A candidate has been assessed, but evidence is incomplete or conflicting, or the coordinate-system provenance is unclear.

`reviewed`
: A final High, Medium, Low, or None outcome has been approved and documented.

`unresolved`
: A reasonable search has been completed without a defensible location.

Do not use `verified` or `approximate` as research statuses.

### Candidate status

- `active`
- `selected`
- `superseded`
- `rejected`

## 5. Coordinate-method vocabulary

| Method | Evidence requirement and limitations | Maximum confidence |
| --- | --- | --- |
| `authoritative-coordinate` | A coordinate published by the responsible authority, with site identity and source CRS or datum clear. | High |
| `official-gis-feature` | An official GIS feature demonstrably representing the designated site rather than a wider locality. | High |
| `official-map-identification` | An official map that identifies the site. High requires exact, reproducible georeferencing; otherwise the result remains approximate. | High when exact and reproducibly georeferenced; otherwise Medium |
| `archaeological-report-map` | An archaeological report map tied to the correct site. High requires surveyed or directly referenced spatial evidence. | High when surveyed or directly referenced; otherwise Medium |
| `published-grid-reference-conversion` | A published grid reference whose CRS is known and whose conversion is documented and reproducible. | High |
| `site-plan-georeference` | A site plan aligned to reliable control points, with transformation and residual uncertainty recorded. | Medium by default |
| `address-or-compound-match` | An address or compound demonstrably containing the site, without evidence sufficient for an exact archaeological point. | Medium |
| `satellite-visual-match` | Visual corroboration of independently anchored evidence. It cannot identify a buried site by itself. | Low alone; Medium only as corroboration |
| `multi-source-place-match` | Multiple independent sources identify the same protected-place area without an authoritative exact coordinate. | Medium |
| `broad-locality-only` | Evidence identifies only a broad locality, settlement, road, factory, or administrative area. | Low and non-renderable |
| `unresolved` | No defensible spatial identification is available. | None |

For every method, record:

- evidence requirement;
- source CRS;
- derivation method;
- limitations;
- maximum confidence.

## 6. Candidate-versus-approved model

### Candidate coordinate

- provisional;
- replaceable;
- non-renderable;
- may have several alternatives;
- may later be rejected.

### Approved coordinate

- explicitly reviewed;
- confidence assigned;
- sensitivity reviewed;
- publication policy assigned;
- eligible for a later machine-data phase only when High or Medium and separately approved.

No candidate coordinate may automatically enter GeoJSON or Map data.

## 7. Confidence policy

This policy is unchanged from Phase 15A.

### High

An exact site, entrance, footprint, surveyed archaeological location, or authoritative coordinate is defensibly supported.

High may later be renderable after sensitivity review.

### Medium

A defensible approximate site, compound, reservoir edge, wall area, village-area site, or protected-place area is supported.

Medium may later be renderable only with explicit **Approximate location** wording and owner approval.

### Low

Only a broad village, town, road, district, factory, or locality is known.

Low is non-renderable.

### None

No defensible spatial identification exists.

None is non-renderable.

Low and None records remain in the research worksheet and a future non-map list.

## 8. Blank ten-record worksheet

The worksheet is intentionally blank. It contains no latitude, longitude, or candidate-coordinate columns or values.

| recordId | officialNameZh | projectNameEn | researchStatus | coordinateConfidence | coordinateMethod | renderable | sensitivityAssessment | researchNotes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JX-PCH-7-001 | 打鼓岭遗址 | Dagu Ling Site | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-002 | 大印山遗址群 | Dayin Shan Archaeological Site Group | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-003 | 荞麦岭遗址 | Qiaomai Ling Site | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-004 | 袁州古城墙 | Yuanzhou Ancient City Wall | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-005 | 南市街窑址 | Nanshijie Kiln Site | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-006 | 南坑窑址 | Nankeng Kiln Site | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-007 | 兴源马家窑址 | Xingyuan Majia Kiln Site | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-008 | 落马桥窑址 | Luoma Qiao Kiln Site | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-009 | 观音阁窑址 | Guanyin Ge Kiln Site | not-started | None | unresolved | false | not-assessed | null |
| JX-PCH-7-010 | 御窑厂西窑址 | Yuyaochang West Kiln Site | not-started | None | unresolved | false | not-assessed | null |

## 9. Record-by-record difficulty assessment

These are planning estimates, not assigned coordinate confidence.

| Record | Difficulty | Likely evidence and granularity | Planning ceiling | Special risk |
| --- | --- | --- | --- | --- |
| 001 | High | Sub-village archaeological evidence tied to 坑口村民小组. | Medium; High only with direct surveyed evidence. | A villagers’ group or village centre is mistaken for the site. |
| 002 | High | Grouped-area evidence near 金桥水库. | Medium. | A reservoir centre, reservoir edge, or one component is mistaken for the whole group. |
| 003 | High | Evidence for a site within the 荞麦岭 natural-village area. | Medium. | A natural-village centroid or spelling variant is treated as the site. |
| 004 | High | Documentary evidence for four separate wall sections. | None under the current Point-only model. | One representative point misdescribes the designation. |
| 005 | Medium | Specific kiln-site evidence near 南市街村. | High possible. | A village centre, unrelated kiln, or street-name match is substituted. |
| 006 | High | Documentary evidence for all three kiln-site components. | None under the current Point-only model. | One component is substituted for the parent designation. |
| 007 | High | Locality-level kiln-site evidence distinguishing 兴源村 and 马家. | Medium. | Ambiguity between Xingyuan Village and the smaller Majia locality. |
| 008 | Medium | Excavation-area or former-factory-compound evidence. | High possible; otherwise Medium. | A modern factory or POI is assumed to equal the archaeological site. |
| 009 | Medium–High | Specific kiln-site evidence within the village area. | Medium; High with a direct report coordinate. | A named building or locality is confused with the kiln site. |
| 010 | Medium | Specific evidence for the west kiln within the broader Imperial Kiln context. | High possible. | The broader Imperial Kiln Site is substituted for the west kiln. |

## 10. Multi-component policy

Use Option C for records 004 and 006:

- retain one parent designation;
- research documentary evidence for each source-listed component;
- do not choose one representative parent coordinate;
- do not calculate a centroid or average;
- do not create child heritage records;
- do not create component GeoJSON;
- set `renderable` to `false` under the current Point-only contract.

A future, separately approved data-contract phase may consider multiple component locations attached to one parent, but only after approving:

- data model;
- accessibility behavior;
- list presentation;
- public wording;
- geometry type;
- provenance rules.

## 11. CRS and precision

The canonical research and output coordinate reference system is WGS84 decimal degrees. Tabular research fields use latitude and longitude explicitly. Future GeoJSON follows RFC 7946 and uses `[longitude, latitude]` order.

Every source CRS must be recorded. Never silently assume WGS84. GCJ-02, BD-09, and WGS84 are distinct. A Gaode/AMap or Baidu coordinate cannot be copied directly into WGS84 without a documented, validated transformation.

Precision rules:

- store no more than six decimal places;
- never invent digits absent from evidence;
- six decimals is approximately 0.1 m;
- five decimals is approximately 1 m;
- four decimals is approximately 11 m;
- three decimals is approximately 111 m in latitude;
- nominal decimal precision does not prove positional accuracy;
- High normally retains only source-supported precision;
- Medium public points normally use three or four decimals plus an uncertainty description or radius;
- display precision may be lower than stored research precision.

If a location is deliberately generalized, record:

`publicationLocationPolicy`
: `generalized`

Also record:

- generalization method;
- approximate radius;
- reason;
- reviewer.

## 12. Sensitivity policy

- Exact archaeological coordinates require sensitivity review.
- Exact publication is not automatic.
- Unpublished excavation locations and vulnerable sites must not be exposed.
- Public repositories must not contain restricted exact coordinates.
- Generalized public values must be explicitly documented.
- Restricted evidence should remain outside the public repository.
- A public data file containing an exact coordinate is public even when the UI displays fewer decimals.

### Sensitivity-assessment vocabulary

- `not-assessed`
- `public-exact-acceptable`
- `public-generalized-only`
- `restricted`
- `unresolved`

### Publication-policy vocabulary

- `exact`
- `approximate`
- `generalized`
- `withheld`

## 13. Research workflow

1. Copy record identity and official Chinese location and remarks from Phase 14A.
2. Copy approved project interpretation from Phase 14B.
3. Search Tier 1 Chinese sources using the official name, complete location, component names, and archaeological terms.
4. Search Tier 2 academic and archaeological sources.
5. Log every credible source before proposing a coordinate.
6. Confirm identity using name, area, site type, period, landmarks, and component wording.
7. Create provisional, non-renderable candidates.
8. Record source CRS and derivation method.
9. Cross-check using an independent source and, where appropriate, satellite or major-map imagery.
10. Reject generic centroids, unsupported POIs, and CRS-uncertain values.
11. Perform sensitivity review.
12. Assign confidence, uncertainty, and renderability.
13. Obtain owner approval before machine-data inclusion.
14. Keep Low, None, and unresolved records in the worksheet.

### Minimum evidence

**High:** direct Tier 1 coordinate or GIS evidence, or direct Tier 2 surveyed or grid evidence, plus independent identity confirmation and second review.

**Medium:** at least one Tier 1 or Tier 2 location anchor plus an independent map, report, or visual cross-check, documented uncertainty, and explicit owner approval.

**Low:** only broad locality or weakly anchored evidence. No coordinate and no marker.

**None:** no defensible spatial evidence after reasonable search.

## 14. Tailored search-query plan

This plan defines later searches; it does not report search results. Each promising search should also be repeated with the terms `保护范围`, `建设控制地带`, `考古报告`, `调查报告`, `发掘简报`, `遗址图`, `测绘`, and `坐标`. Domain filters narrow results but do not establish reliability.

### JX-PCH-7-001 — 打鼓岭遗址

- `"打鼓岭遗址" 文物`
- `"打鼓岭遗址" 考古`
- `"打鼓岭遗址" 坐标`
- `"新余市渝水区罗坊镇竹山村坑口村民小组" 遗址`
- `"打鼓岭遗址" "坑口村民小组"`
- `site:gov.cn "打鼓岭遗址"`
- `site:edu.cn "打鼓岭遗址"`
- `site:org.cn "打鼓岭遗址"`

### JX-PCH-7-002 — 大印山遗址群

- `"大印山遗址群" 文物`
- `"大印山遗址群" 考古`
- `"大印山遗址群" 坐标`
- `"宜春市丰城市淘沙镇前坊村" "金桥水库" 遗址`
- `"大印山" "金桥水库" 考古`
- `site:gov.cn "大印山遗址群"`
- `site:edu.cn "大印山遗址群"`
- `site:org.cn "大印山遗址群"`

### JX-PCH-7-003 — 荞麦岭遗址

- `"荞麦岭遗址" 文物`
- `"荞麦岭遗址" 考古`
- `"荞麦岭遗址" 坐标`
- `"九江市柴桑区马回岭镇富民村荞麦岭自然村庄" 遗址`
- `"荞麦岭" "富民村" 考古`
- `site:gov.cn "荞麦岭遗址"`
- `site:edu.cn "荞麦岭遗址"`
- `site:org.cn "荞麦岭遗址"`

### JX-PCH-7-004 — 袁州古城墙

- `"袁州古城墙" 文物`
- `"袁州古城墙" 考古`
- `"袁州古城墙" 测绘`
- `"袁州古城墙" "灵泉池段"`
- `"袁州古城墙" "高士南路段"`
- `"袁州古城墙" "王子巷段"`
- `"袁州古城墙" "马家园段"`
- `"宜春市袁州区灵泉池公园、高士南路、王子巷、马家园" 古城墙`
- `"宜春市袁州区" "灵泉池公园" "高士南路" "王子巷" "马家园"`
- `site:gov.cn "袁州古城墙"`
- `site:edu.cn "袁州古城墙"`
- `site:org.cn "袁州古城墙"`

### JX-PCH-7-005 — 南市街窑址

- `"南市街窑址" 文物`
- `"南市街窑址" 考古`
- `"南市街窑址" 坐标`
- `"景德镇市浮梁县寿安镇南市街村" 窑址`
- `"南市街村" 窑址 发掘`
- `site:gov.cn "南市街窑址"`
- `site:edu.cn "南市街窑址"`
- `site:org.cn "南市街窑址"`

### JX-PCH-7-006 — 南坑窑址

- `"南坑窑址" 文物`
- `"南坑窑址" 考古`
- `"南坑窑址" 坐标`
- `"萍乡市芦溪县南坑镇窑下村" 窑址`
- `"南坑窑址" "凤凰坡"`
- `"南坑窑址" "庵子坡"`
- `"南坑窑址" "瓦子坳"`
- `"窑下村" "凤凰坡" "庵子坡" "瓦子坳"`
- `site:gov.cn "南坑窑址"`
- `site:edu.cn "南坑窑址"`
- `site:org.cn "南坑窑址"`

### JX-PCH-7-007 — 兴源马家窑址

- `"兴源马家窑址" 文物`
- `"兴源马家窑址" 考古`
- `"兴源马家窑址" 坐标`
- `"宜春市铜鼓县永宁镇兴源村" 窑址`
- `"兴源村" "马家" 窑址`
- `site:gov.cn "兴源马家窑址"`
- `site:edu.cn "兴源马家窑址"`
- `site:org.cn "兴源马家窑址"`

### JX-PCH-7-008 — 落马桥窑址

- `"落马桥窑址" 文物`
- `"落马桥窑址" 考古`
- `"落马桥窑址" 坐标`
- `"景德镇市珠山区中华南路红光瓷厂院内" 窑址`
- `"落马桥窑址" "红光瓷厂"`
- `"中华南路" "红光瓷厂" 考古`
- `site:gov.cn "落马桥窑址"`
- `site:edu.cn "落马桥窑址"`
- `site:org.cn "落马桥窑址"`

### JX-PCH-7-009 — 观音阁窑址

- `"观音阁窑址" 文物`
- `"观音阁窑址" 考古`
- `"观音阁窑址" 坐标`
- `"景德镇市珠山区竟成镇昌江村" 窑址`
- `"观音阁" "昌江村" 窑址`
- `site:gov.cn "观音阁窑址"`
- `site:edu.cn "观音阁窑址"`
- `site:org.cn "观音阁窑址"`

### JX-PCH-7-010 — 御窑厂西窑址

- `"御窑厂西窑址" 文物`
- `"御窑厂西窑址" 考古`
- `"御窑厂西窑址" 坐标`
- `"御窑厂西窑址" "景德镇市珠山区"`
- `"御窑厂" "西窑址" 发掘`
- `"御窑厂遗址" "西窑"`
- `site:gov.cn "御窑厂西窑址"`
- `site:edu.cn "御窑厂西窑址"`
- `site:org.cn "御窑厂西窑址"`

## 15. Candidate rejection rules

Reject a candidate when any of the following applies:

- the source name does not match;
- the administrative area conflicts;
- the source describes a different same-named site;
- the site type or period conflicts;
- only a generic locality or centroid is identified;
- the value comes only from automated geocoding of free-form text;
- the pin is crowd-sourced and unsupported;
- the evidence cannot distinguish the site from the surrounding locality;
- a component is substituted for parent record 004 or 006;
- a modern museum, factory, or tourist POI is assumed to equal the archaeological site;
- the value is copied across unsourced websites;
- the CRS is unstated or mismatched;
- a coordinate transformation is undocumented;
- satellite imagery is the sole identification of a buried site;
- the value implies false precision;
- a material conflict between sources is unresolved;
- the source cannot be revisited or cited;
- publication would expose a vulnerable site unsafely.

## 16. Review model

- One researcher may gather and reject candidates.
- High and Medium outcomes require a second review role.
- High normally requires two independent sources.
- One complete authoritative coordinate may be accepted with an independent identity confirmation.
- Medium requires explicit owner approval.
- Low and None require project acceptance.
- Evidence summaries are preferred.
- Quotations must remain short and attributable.
- Screenshots should be stored only when irreplaceable and rights and provenance are documented.
- Complete copyrighted maps or reports must not be mirrored.

## 17. Phase sequence

### Phase 14C-1

Coordinate-research readiness and blank worksheet only.

### Phase 14C-2

Candidate evidence for all ten records.

### Phase 14C-3

Review and approve High, Medium, Low, or None outcomes, sensitivity, generalization, and renderability.

### Phase 14D

Machine-data contract and approved dataset.

### Phase 14E

GeoJSON generation from approved renderable records.

### Phase 14F

Optional default-off preview layer and non-map list.

### Production gate

Separate preview approval, merge, automatic deployment, freshness verification, and non-destructive smoke testing.

This sequence keeps provisional research evidence out of runtime data and is safer than combining coordinate research and GeoJSON in one change.

## 18. Acceptance criteria

- Exactly ten unique Phase 14A IDs appear in the blank worksheet.
- No coordinate values appear.
- Every initial research status is `not-started`.
- Every initial confidence is `None`.
- Every record is initially non-renderable.
- Records 004 and 006 are explicitly non-renderable under the Point-only policy.
- WGS84 and future GeoJSON longitude-latitude order are documented.
- GCJ-02 and BD-09 transformation risks are documented.
- The High / Medium / Low / None policy matches Phase 15A.
- No settlement-centre coordinate is substituted.
- Phase 14A and Phase 14B remain unchanged.
- No application, dataset, test, Firebase, CSP, workflow, configuration, deployment, export, public-page, or Map change is included.
