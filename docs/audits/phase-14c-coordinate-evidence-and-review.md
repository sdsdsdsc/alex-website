# Phase 14C — Coordinate evidence and review

## 1. Status and scope

This is the documentation-only candidate-evidence and coordinate-review record for the ten-record provincial protected heritage pilot.

- Phase 14A remains the authoritative Chinese source transcription.
- Phase 14B remains the approved project interpretation.
- Phase 14C-1 remains the controlling coordinate-research methodology.
- Coordinates and spatial decisions recorded here are Alex's Photo Board project research, not official designation coordinates.
- Provisional candidates are not runtime data and are non-renderable.
- Unresolved, Low, None, and non-renderable outcomes are valid.
- This document creates no JSON, CSV, machine-readable dataset, geometry, GeoJSON, Map behavior, Firebase data, public page, or export change.

The coordinate research review is approved for this pilot stage. PR #48 remains a draft pending explicit merge authorization. No candidate may enter machine data, GeoJSON, or Map data automatically.

## 2. Review administration

| Field | Value |
| --- | --- |
| researchStartDate | 2026-07-23 |
| researchCompletionDate | 2026-07-23 |
| researcher | Codex-assisted project research |
| secondReviewer | not required — no High or Medium coordinate outcome was approved |
| projectOwnerApprovalDate | 2026-07-23 |
| reviewStatus | approved |

## 3. Decision controls

The source hierarchy, confidence requirements, controlled coordinate methods, CRS rules, precision rules, sensitivity policy, candidate model, rejection rules, and multi-component policy in [`docs/plans/phase-14c-coordinate-research-readiness.md`](../plans/phase-14c-coordinate-research-readiness.md) control this research.

The canonical future research and output CRS is WGS84 decimal degrees. Future GeoJSON order is `[longitude, latitude]`. WGS84, GCJ-02, and BD-09 are distinct. No value from Gaode/AMap or Baidu may be copied into a WGS84 field without a documented, reproducible transformation.

Candidates remain non-renderable. Numeric approved coordinates are permitted only after a High or Medium decision has satisfied its review, sensitivity, and approval requirements. Low, None, and unresolved outcomes use literal `null` approved coordinates and `false` renderability.

## 4. Final ten-record summary

This table records the completed research pass and the project owner’s acceptance of the conservative Low, None, and unresolved outcomes.

| recordId | officialNameZh | projectNameEn | researchStatus | coordinateConfidence | coordinateMethod | approvedLatitude | approvedLongitude | coordinateReferenceSystem | estimatedUncertaintyMeters | renderable | sensitivityAssessment | publicationLocationPolicy | selectedCandidateId | finalDecisionSummary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JX-PCH-7-001 | 打鼓岭遗址 | Dagu Ling Site | reviewed | Low | broad-locality-only | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted the Low, non-renderable, no-point outcome: reporting places the hill-slope site about 500 metres east of Kengkou village, but no defensible point or source CRS is published. |
| JX-PCH-7-002 | 大印山遗址群 | Dayin Shan Archaeological Site Group | unresolved | None | unresolved | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted None/unresolved as the completed current outcome: reasonable searching found only the official group-level location at Qianfang Village (Jinqiao Reservoir), with no defensible point or CRS. |
| JX-PCH-7-003 | 荞麦岭遗址 | Qiaomai Ling Site | reviewed | Low | broad-locality-only | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted the Low, non-renderable, no-point outcome: the approximately 50,000-square-metre site is identified within Qiaomailing natural village, but no defensible point or source CRS is published. |
| JX-PCH-7-004 | 袁州古城墙 | Yuanzhou Ancient City Wall | unresolved | None | unresolved | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted None/unresolved as the completed current outcome: all four wall sections were searched, and the Point-only policy prohibits a representative parent point, component substitution, or centroid. |
| JX-PCH-7-005 | 南市街窑址 | Nanshijie Kiln Site | reviewed | Low | broad-locality-only | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted the Low, non-renderable, no-point outcome: direct scholarly evidence identifies the site at the south end of Nanshijie natural village but publishes no defensible point or source CRS. |
| JX-PCH-7-006 | 南坑窑址 | Nankeng Kiln Site | unresolved | None | unresolved | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted None/unresolved as the completed current outcome: the three components belong to a wider kiln complex, and the Point-only policy prohibits choosing one component or a centroid for the parent. |
| JX-PCH-7-007 | 兴源马家窑址 | Xingyuan Majia Kiln Site | unresolved | None | unresolved | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted None/unresolved as the completed current outcome: reasonable searching found no direct site description, defensible coordinate, or source CRS beyond the official village location. |
| JX-PCH-7-008 | 落马桥窑址 | Luoma Qiao Kiln Site | reviewed | Low | broad-locality-only | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted the Low, non-renderable, no-point outcome: direct excavation evidence identifies the Hongguang Ceramics Works compound but publishes no defensible site point or source CRS. |
| JX-PCH-7-009 | 观音阁窑址 | Guanyin Ge Kiln Site | reviewed | Low | broad-locality-only | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted the Low, non-renderable, no-point outcome: direct excavation evidence describes a broad site extent in Changjiang Village but publishes no defensible site point or source CRS. |
| JX-PCH-7-010 | 御窑厂西窑址 | Yuyaochang West Kiln Site | unresolved | None | unresolved | null | null | null | null | false | not-assessed | withheld | null | The project owner accepted None/unresolved as the completed current outcome: the only numeric official candidate belongs to the broader Imperial Kiln serial property and remains rejected for this record. |

## 5. Record research

### JX-PCH-7-001 — 打鼓岭遗址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-001 |
| officialNameZh | 打鼓岭遗址 |
| officialLocationTextZh | 新余市渝水区罗坊镇竹山村坑口村民小组 |
| remarksZh | null |
| projectNameEn | Dagu Ling Site |
| projectLocationTextEn | Xinyu City, Yushui District, Luofang Town, Zhushan Village, Kengkou Villagers’ Group |

#### B. Search record

Research performed 2026-07-23 using `打鼓岭遗址`, `坑口村民小组`, `竹山村`, `罗坊镇`, `旧石器`, `坐标`, `经纬度`, and archaeology combinations. Results were checked carefully against same-name sites in Guangdong and Hong Kong. The best record-specific result places this Jiangxi site about 500 metres east of Kengkou village on a small hilly slope and describes its 1989 archaeological discovery. It does not publish a numeric coordinate or CRS.

#### C. Candidate list

No numeric coordinate candidate was created. The “500 metres east” statement improves locality discrimination but does not provide a unique bearing origin, surveyed point, site extent, or coordinate reference system.

#### D. Evidence list

##### JX-PCH-7-001-NC-E01

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-001-NC-E01 |
| sourceTier | Tier 3 — reputable provincial news report |
| coordinateSourceTitle | 新余市一处遗址获评省级文物保护单位 |
| coordinateSourceUrl | https://tt.jxnews.com.cn/news/2769144 |
| coordinateSourceDate | 2025 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Jiangxi News |
| coordinateSourceType | Reputable provincial news report |
| evidenceQuoteOrSummary | Places the site about 500 metres east of Kengkou village, describes it as a Palaeolithic settlement on a small hilly slope, and reports its 1989 discovery by national, provincial, and municipal archaeological institutions. |
| placeMatchEvidence | Supports a broad relative locality only; it does not define a point candidate. |
| coordinateDerivationNote | No numeric coordinate; relative text is “坑口村东面500米”. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. No village-centre offset, geocoding, or map measurement was performed. |
| precision | Relative distance from a village, without a defined origin point or azimuth. |
| estimatedUncertaintyMeters | null — a unique point cannot be reconstructed from the text. |
| accessibility | Public news webpage at access date. |
| independentCrossCheck | Independent reporting with archaeological discovery context, not a direct copy of the Phase 14A row. |
| evidenceLimitations | No site boundary, source point, bearing definition, coordinate, CRS, or surveyed uncertainty. Same-name sites elsewhere create a material false-match risk. |
| rightsAndReuse | Citation and factual summary only; no media or map content is republished. |

#### E. Candidate assessment

The report meaningfully narrows the record beyond the village-level official location, but deriving a point 500 metres east of an arbitrarily chosen village centre would be prohibited freehand geocoding. The project owner accepted the Low-confidence, `broad-locality-only`, null-coordinate, non-renderable outcome for this pilot stage.

#### F. Rejected candidates

Search results for same-name sites in Dongguan, Guangxi, and Hong Kong were rejected as false matches. General village and hill POIs were rejected at discovery stage because they lack record-specific archaeological provenance, CRS, and uncertainty.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | reviewed |
| coordinateConfidence | Low |
| coordinateMethod | broad-locality-only |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted the Low, non-renderable, no-point outcome for this pilot stage. The site is reported about 500 metres east of Kengkou village, but that relative description cannot produce a defensible Point. |
| remainingLimitations | A direct archaeological coordinate, surveyed plan, or authoritative georeferenced site boundary is needed; the village centre must not be used as an implicit origin. |

### JX-PCH-7-002 — 大印山遗址群

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-002 |
| officialNameZh | 大印山遗址群 |
| officialLocationTextZh | 宜春市丰城市淘沙镇前坊村（金桥水库） |
| remarksZh | null |
| projectNameEn | Dayin Shan Archaeological Site Group |
| projectLocationTextEn | Yichun City, Fengcheng City, Taosha Town, Qianfang Village (Jinqiao Reservoir) |

#### B. Search record

Research performed 2026-07-23 using `大印山遗址群`, `金桥水库`, `前坊村`, `淘沙镇`, `遗址群调查`, `保护范围`, `坐标`, and `经纬度`. Exact-name searches located the official designation and copied list entries but no accessible archaeological survey, component inventory, protection-boundary document, authoritative map, numeric coordinate, or source CRS. Reservoir and village searches were used only as discovery anchors.

#### C. Candidate list

No numeric coordinate candidate was created. The Jinqiao Reservoir centre, Qianfang Village centre, shoreline centre, dam, or one unidentified component cannot represent an archaeological site group.

#### D. Evidence list

##### JX-PCH-7-002-NC-E01

| Field | Value |
| --- | --- |
| evidenceId | JX-PCH-7-002-NC-E01 |
| candidateId or explicit record-level no-candidate reference | record-level no-candidate outcome |
| coordinateSourceTitle | 江西省人民政府关于公布第七批江西省文物保护单位的通知 — 第七批江西省文物保护单位名单 |
| coordinateSourcePublisher | 江西省人民政府; official county-government republication inspected through 南昌县人民政府 |
| coordinateSourceUrl | https://ncx.nc.gov.cn/ncxrmzf/gxszwgz/202507/9fed39827ae74418af52268254e8f2b0.shtml |
| coordinateSourceType | Official designation notice and raster attachment |
| sourceTier | Tier 1 |
| coordinateSourceDate | 2025-07-18 |
| coordinateAccessedDate | 2026-07-23 |
| evidenceQuoteOrSummary | Identifies one parent record, 大印山遗址群, at 宜春市丰城市淘沙镇前坊村（金桥水库） and supplies no component list, coordinate, geometry, or CRS. |
| placeMatchEvidence | Exact official Chinese name, archaeological site-group type, period, and administrative location match Phase 14A. |
| coordinateDerivationNote | None. No reservoir, village, dam, or map centre was derived. |
| coordinateTransformationMethod | None. |
| independentCrossCheck | No independent direct archaeological or official GIS source was found. Copied list entries are not independent. |
| evidenceLimitations | Group-level administrative location only; raster attachment; no point, component inventory, boundary, CRS, positional accuracy, or publication decision. |

#### E. Candidate assessment

Identity, administration, site type, and period are established by the authoritative Chinese source. Spatially, however, the evidence stops at a village/reservoir description for a site group. Source independence, CRS clarity, transformation clarity, point uncertainty, sensitivity, publishability, and renderability cannot be established. Confidence is None and the outcome is unresolved.

#### F. Rejected candidates

The reservoir centre, dam, shoreline centre, Qianfang Village centre, and generic map pins were rejected without promotion to candidate IDs because none is tied by source evidence to the parent archaeological group. A component, if later identified, must not be substituted for the parent.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | unresolved |
| coordinateConfidence | None |
| coordinateMethod | unresolved |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted None/unresolved as the completed outcome of this reasonable research pass. No defensible coordinate was approved; the authoritative source identifies the site group only at Qianfang Village (Jinqiao Reservoir). |
| remainingLimitations | Direct site-group survey documentation, component inventory, or authoritative georeferenced boundary evidence could reopen this decision in future. The current accepted result remains None and non-renderable, and the Point-only model may remain unsuitable even if component evidence emerges. |

### JX-PCH-7-003 — 荞麦岭遗址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-003 |
| officialNameZh | 荞麦岭遗址 |
| officialLocationTextZh | 九江市柴桑区马回岭镇富民村荞麦岭自然村庄 |
| remarksZh | null |
| projectNameEn | Qiaomai Ling Site |
| projectLocationTextEn | Jiujiang City, Chaisang District, Mahuiling Town, Fumin Village, Qiaomailing natural village settlement |

#### B. Search record

Research performed 2026-07-23 using `荞麦岭遗址`, `富民村`, `荞麦岭自然村`, `马回岭镇`, `发掘`, `坐标`, and `经纬度`. Exact-name checking excluded an unrelated same-name site in Hebei for which coordinates are published. A government-hosted Jiangxi Daily report identifies the Jiangxi site as an approximately 50,000-square-metre archaeological area within Qiaomailing natural village and documents excavation from 2013 to 2014. No numeric site coordinate or CRS is supplied.

#### C. Candidate list

No numeric coordinate candidate was created. A natural-village centre, excavation-photo location, highway alignment, or unrelated Hebei same-name coordinate is not a valid substitute.

#### D. Evidence list

##### JX-PCH-7-003-NC-E01

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-003-NC-E01 |
| sourceTier | Tier 1 host / Tier 3 report — district-government republication of provincial reporting with archaeologist attribution |
| coordinateSourceTitle | 江西日报民生版头条｜撩开荞麦岭遗址的神秘面纱 |
| coordinateSourceUrl | https://www.chaisang.gov.cn/zwgk/zfxxgk/bmxxgk/wgxlj/zdgk_148401/ggwhly_1/202311/t20231128_6305366.html |
| coordinateSourceDate | 2023-11-16 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Chaisang District People’s Government; originating report by Jiangxi Daily |
| coordinateSourceType | District-government republication of provincial reporting with archaeologist attribution |
| evidenceQuoteOrSummary | Identifies the site in Qiaomailing natural village, gives an approximate area of 50,000 square metres, and documents rescue excavation by the Jiangxi archaeological institute and local heritage authorities from 2013 to 2014. |
| placeMatchEvidence | Strong site-identity and extent evidence, but no representative point is selected or published. |
| coordinateDerivationNote | No numeric coordinate published. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. No centroid, village geocode, or image-based extraction was performed. |
| precision | Named natural village plus approximate 50,000-square-metre site extent. |
| estimatedUncertaintyMeters | null — no source point exists and the extent cannot be reduced to a point without a policy decision. |
| accessibility | Public district-government webpage at access date. |
| independentCrossCheck | Government-hosted feature drawing on excavation history and named archaeological staff; distinct from the Phase 14A source. |
| evidenceLimitations | Reporting rather than a survey record; no coordinate, CRS, plan control point, site boundary, or approved public-location policy. |
| rightsAndReuse | Citation and factual summary only; article images and text are not republished as data. |

#### E. Candidate assessment

The evidence clearly distinguishes the Jiangxi site and establishes that it is spatially extensive. It does not establish which excavated locus, entrance, or centre should represent the parent record. The project owner accepted the Low-confidence, `broad-locality-only`, null-coordinate, non-renderable outcome for this pilot stage.

#### F. Rejected candidates

The published coordinate for another 荞麦岭遗址 in Ping’anbao Town, Xinglong County, Hebei was rejected as an exact-name false match. General natural-village and web-map results were rejected because their coordinates do not document a relationship to this archaeological extent.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | reviewed |
| coordinateConfidence | Low |
| coordinateMethod | broad-locality-only |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted the Low, non-renderable, no-point outcome for this pilot stage. The 50,000-square-metre site is securely associated with Qiaomailing natural village, but no defensible representative Point or CRS was found. |
| remainingLimitations | A direct excavation coordinate, georeferenced plan, or explicit representative-point policy is required before rendering. |

### JX-PCH-7-004 — 袁州古城墙

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-004 |
| officialNameZh | 袁州古城墙 |
| officialLocationTextZh | 宜春市袁州区灵泉池公园、高士南路、王子巷、马家园 |
| remarksZh | 含灵泉池段、高士南路段、王子巷段、马家园段 |
| projectNameEn | Yuanzhou Ancient City Wall |
| projectLocationTextEn | Yichun City, Yuanzhou District, Lingquanchi Park, Gaoshi South Road, Wangzi Lane, and Majiayuan |

#### B. Search record

Research performed 2026-07-23 for every source-listed section: `袁州古城墙 灵泉池段`, `袁州古城墙 高士南路段`, `袁州古城墙 王子巷段`, and `袁州古城墙 马家园段`, plus `考古`, `保护范围`, `坐标`, and `经纬度`. The official designation confirms the four-section parent. Reporting attributed to the Jiangxi Provincial Institute of Cultural Relics and Archaeology describes the Gaoshi South Road discovery and dating. Planning coverage confirms protection/display work around Lingquanchi Park. No comparable direct coordinate evidence was accessible for Wangzi Lane or Majiayuan, and no source provides one defensible parent point or CRS.

#### C. Candidate list

No parent candidate was created. The four wall sections are spatially separate parts of one designation. One section, a park/road/lane POI, a city-wall tourism pin, an average, or a centroid cannot represent the parent under the current Point-only policy.

#### D. Evidence list

##### JX-PCH-7-004-NC-E01

| Field | Value |
| --- | --- |
| evidenceId | JX-PCH-7-004-NC-E01 |
| candidateId or explicit record-level no-candidate reference | record-level no-candidate outcome |
| coordinateSourceTitle | 江西省人民政府关于公布第七批江西省文物保护单位的通知 — 第七批江西省文物保护单位名单 |
| coordinateSourcePublisher | 江西省人民政府; official county-government republication inspected through 南昌县人民政府 |
| coordinateSourceUrl | https://ncx.nc.gov.cn/ncxrmzf/gxszwgz/202507/9fed39827ae74418af52268254e8f2b0.shtml |
| coordinateSourceType | Official designation notice and raster attachment |
| sourceTier | Tier 1 |
| coordinateSourceDate | 2025-07-18 |
| coordinateAccessedDate | 2026-07-23 |
| evidenceQuoteOrSummary | Defines one 袁州古城墙 designation containing 灵泉池段、高士南路段、王子巷段、马家园段 at the corresponding four named localities. |
| placeMatchEvidence | Exact parent name, four component names, ancient-site category, period, and Yuanzhou District location match Phase 14A. |
| coordinateDerivationNote | None. The component names were not geocoded and no parent centroid or representative point was calculated. |
| coordinateTransformationMethod | None. |
| independentCrossCheck | Highshi South Road and Lingquanchi have separate contextual corroboration; no independent direct spatial evidence was found for all four sections. |
| evidenceLimitations | Raster list supplies names only; no coordinates, CRS, lengths, boundaries, surveyed plans, or public-location policy. |

##### JX-PCH-7-004-NC-E02

| Field | Value |
| --- | --- |
| evidenceId | JX-PCH-7-004-NC-E02 |
| candidateId or explicit record-level no-candidate reference | record-level no-candidate outcome; Gaoshi South Road section context |
| coordinateSourceTitle | 江西宜春中心城区发现疑似千年唐代遗址 |
| coordinateSourcePublisher | Guizhou Radio and Television news report citing Jiangxi Provincial Institute of Cultural Relics and Archaeology |
| coordinateSourceUrl | https://movement.gzstv.com/news/detail/vL8Gj/ |
| coordinateSourceType | Reputable news report with named archaeological attribution |
| sourceTier | Tier 3 |
| coordinateSourceDate | 2021 |
| coordinateAccessedDate | 2026-07-23 |
| evidenceQuoteOrSummary | Reports discovery of substantial wall bricks during earthworks on the Gaoshi South Road section and the archaeological basis for dating the wall to the late Tang–Five Dynasties period. |
| placeMatchEvidence | Exact Gaoshi South Road component, wall site type, Yuanzhou urban context, and period match the parent designation. |
| coordinateDerivationNote | None. A road centre or construction-site point was not inferred. |
| coordinateTransformationMethod | None. |
| independentCrossCheck | Independent contextual support for one component only; it does not cross-check the other three sections or a parent point. |
| evidenceLimitations | No numeric coordinate, CRS, excavation boundary, public point, or evidence for the complete four-section parent. |

##### JX-PCH-7-004-NC-E03

| Field | Value |
| --- | --- |
| evidenceId | JX-PCH-7-004-NC-E03 |
| candidateId or explicit record-level no-candidate reference | record-level no-candidate outcome; Lingquanchi section context |
| coordinateSourceTitle | 两街区、三公园……袁州古城建成后长这样 |
| coordinateSourcePublisher | Phoenix New Media Jiangxi |
| coordinateSourceUrl | https://i.ifeng.com/c/8F7qypsiQ0z |
| coordinateSourceType | Reputable planning/development news |
| sourceTier | Tier 3 |
| coordinateSourceDate | 2022 |
| coordinateAccessedDate | 2026-07-23 |
| evidenceQuoteOrSummary | Describes Lingquanchi Park’s bounded urban planning area and states that the project protects Lingquanchi and ancient-city-wall remains. |
| placeMatchEvidence | Supports a wall-remains relationship at the Lingquanchi locality but does not identify the protected section as a point. |
| coordinateDerivationNote | None. Park bounds or centre were not converted into a heritage coordinate. |
| coordinateTransformationMethod | None. |
| independentCrossCheck | Independent contextual support for the Lingquanchi locality; not an archaeological coordinate source. |
| evidenceLimitations | Planning journalism, not a surveyed heritage plan; no coordinate, CRS, exact wall-section boundary, or evidence for Wangzi Lane and Majiayuan. |

#### E. Candidate assessment

The authoritative identity and all four component names are secure. Evidence quality is uneven: Gaoshi South Road has archaeological context, Lingquanchi has planning context, and the exact Wangzi Lane and Majiayuan extents remain unsupported by accessible direct sources. More importantly, the record is a multi-component linear parent for which a Point would misstate the data model. No source independence, CRS, uncertainty, or sensitivity decision can make a single parent Point valid under current policy.

#### F. Rejected candidates

Gaoshi South Road and Lingquanchi were rejected as parent-coordinate substitutes because each is only one component. Wangzi Lane, Majiayuan, park centres, road centres, tourism POIs, and any average or centroid were rejected at discovery stage. None was promoted to a numeric candidate.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | unresolved |
| coordinateConfidence | None |
| coordinateMethod | unresolved |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted None/unresolved as the completed outcome of this reasonable research pass. No defensible parent coordinate was approved: evidence is uneven and the Point-only model cannot represent this multi-component linear designation. |
| remainingLimitations | Direct documentation for the Wangzi Lane and Majiayuan sections or a later approved geometry/component model could reopen this decision. The current accepted result remains None and non-renderable; this PR creates no geometry or component records. |

### JX-PCH-7-005 — 南市街窑址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-005 |
| officialNameZh | 南市街窑址 |
| officialLocationTextZh | 景德镇市浮梁县寿安镇南市街村 |
| remarksZh | null |
| projectNameEn | Nanshijie Kiln Site |
| projectLocationTextEn | Jingdezhen City, Fuliang County, Shou’an Town, Nanshijie Village |

#### B. Search record

Research performed 2026-07-23 using the Chinese official name, the Phase 14A location string, `南市街村`, `寿安镇`, `窑址`, `坐标`, `经纬度`, `考古`, and `保护范围`. Searches prioritized government and archaeological sources, then scholarly and reputable discovery sources. The strongest direct source describes the site at the south end of Nanshijie natural village, with an approximate area of 60,000 square metres, and states that it had not received formal archaeological excavation at the time of publication. No source-specific numeric coordinate or CRS was found.

#### C. Candidate list

No numeric coordinate candidate was created. A village centre, Shou’an Town centre, administrative centroid, search-engine pin, or tourism POI would substitute a locality for the protected site and is not acceptable.

#### D. Evidence list

##### JX-PCH-7-005-NC-E01

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-005-NC-E01 |
| sourceTier | Tier 2 — direct scholarly/institutional research |
| coordinateSourceTitle | 文化遗存保护传承的当代价值与现实路径——基于景德镇青白瓷遗址群的调查 |
| coordinateSourceUrl | https://yangtze.silkroadinfo.org.cn/2023/5/20230505164845754%E6%96%87%E5%8C%96%E9%81%97%E5%AD%98%E4%BF%9D%E6%8A%A4%E4%BC%A0%E6%89%BF%E7%9A%84%E5%BD%93%E4%BB%A3%E4%BB%B7%E5%80%BC%E4%B8%8E%E7%8E%B0%E5%AE%9E%E8%B7%AF%E5%BE%84%E2%80%94%E2%80%94%E5%9F%BA%E4%BA%8E%E6%99%AF%E5%BE%B7%E9%95%87%E9%9D%92%E7%99%BD%E7%93%B7%E9%81%97%E5%9D%80%E7%BE%A4%E7%9A%84%E8%B0%83%E6%9F%A5.pdf |
| coordinateSourceDate | 2023 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Yangtze River Civilization and Maritime Silk Road Research Center-hosted scholarly article |
| coordinateSourceType | Scholarly heritage survey article |
| evidenceQuoteOrSummary | Identifies the site in Nanshijie natural village of Zhuxi administrative village, Shou’an Town; places it at the south end of the village; estimates about 60,000 square metres; and reports no formal excavation at publication. |
| placeMatchEvidence | Supports broad-locality identification only; it does not support a selected point. |
| coordinateDerivationNote | No numeric coordinate published. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. No coordinate was inferred or transformed. |
| precision | Site extent and relative village position only. |
| estimatedUncertaintyMeters | null — the source does not define a point from which uncertainty can be measured. |
| accessibility | Public direct PDF at access date. |
| independentCrossCheck | Independent scholarly investigation; not merely a copy of the Phase 14A source-table row. |
| evidenceLimitations | The site is extensive, the relative phrase “south end” is not a point, and no source CRS or surveyed coordinate is supplied. |
| rightsAndReuse | Used as documentary evidence with citation only; no text, map, or imagery is republished as project data. |

#### E. Candidate assessment

The source evidence is sufficient to distinguish the protected site from the wider town and village, but insufficient to select a representative Point. The 60,000-square-metre extent also makes a single unqualified pin potentially misleading. The project owner accepted the Low-confidence, `broad-locality-only`, null-coordinate, non-renderable outcome for this pilot stage.

#### F. Rejected candidates

Tourism and search-result pins for the kiln-name vicinity were reviewed only as discovery aids. They were not promoted to candidate status because their underlying coordinate provenance, place relationship, CRS, and reuse basis were unavailable. The approximate statement that the attraction is southeast of Shou’an Middle School was likewise rejected as a coordinate basis: it is a relative tourism description, not an archaeological survey point.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | reviewed |
| coordinateConfidence | Low |
| coordinateMethod | broad-locality-only |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted the Low, non-renderable, no-point outcome for this pilot stage. The site is identified at the south end of Nanshijie natural village, but no defensible numeric coordinate or source CRS was found. |
| remainingLimitations | A site-specific surveyed coordinate or an authoritative georeferenced plan is still needed before rendering. The extensive site boundary cannot be reduced to a village or POI centre. |

### JX-PCH-7-006 — 南坑窑址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-006 |
| officialNameZh | 南坑窑址 |
| officialLocationTextZh | 萍乡市芦溪县南坑镇窑下村 |
| remarksZh | 含凤凰坡、庵子坡、瓦子坳 |
| projectNameEn | Nankeng Kiln Site |
| projectLocationTextEn | Pingxiang City, Luxi County, Nankeng Town, Yaoxia Village |

#### B. Search record

Research performed 2026-07-23 for all three source-listed components using `南坑窑址 凤凰坡`, `南坑窑址 庵子坡`, `南坑窑址 瓦子坳`, `窑下村`, `考古调查`, `坐标`, and `经纬度`. A 2022 direct archaeological-survey record reports eighteen kiln sites in the wider Pingxiang Nankeng kiln complex. Public museum material corroborates the complex’s archaeological importance. Exact-name searching found descriptive secondary material for 凤凰坡 and 瓦子坳, but no direct coordinate, CRS, component plan, or equally specific accessible evidence for 庵子坡. Same-name results for the nationally protected Nankeng kiln in Nan’an, Fujian were excluded.

#### C. Candidate list

No parent candidate was created. 凤凰坡, 庵子坡, and 瓦子坳 are included components of one designation. No one component, wider kiln-complex centre, village centre, town centre, POI, average, or centroid may represent the parent.

#### D. Evidence list

##### JX-PCH-7-006-NC-E01

| Field | Value |
| --- | --- |
| evidenceId | JX-PCH-7-006-NC-E01 |
| candidateId or explicit record-level no-candidate reference | record-level no-candidate outcome |
| coordinateSourceTitle | 江西萍乡南坑窑调查 |
| coordinateSourcePublisher | 南方文物; institutional record hosted by Peking University |
| coordinateSourceUrl | https://ir.pku.edu.cn/handle/20.500.11897/25/simple-search?etal=0&filter_field_1=author&filter_type_1=equals&filter_value_1=%E7%A7%A6%E5%A4%A7%E6%A0%91&filtername=subject&filterquery=0601+%E8%80%83%E5%8F%A4%E5%AD%A6%3B&filtertype=equals&order=desc&query=&rpp=20&sort_by=score |
| coordinateSourceType | Direct archaeological survey article record |
| sourceTier | Tier 2 |
| coordinateSourceDate | 2022-06-28 |
| coordinateAccessedDate | 2026-07-23 |
| evidenceQuoteOrSummary | Summarizes a 2020 archaeological survey of eighteen kiln sites in the Pingxiang Nankeng kiln complex and groups them chronologically and technologically. |
| placeMatchEvidence | Exact Pingxiang Nankeng kiln name, kiln-site type, Southern Song–Yuan focus, and institutional archaeological context match the protected record; the accessible abstract does not enumerate the three protected components. |
| coordinateDerivationNote | None. No component, group centre, or surveyed map point was extracted. |
| coordinateTransformationMethod | None. |
| independentCrossCheck | Independent direct archaeological work distinct from the designation notice; the accessible record cannot independently place all three protected components. |
| evidenceLimitations | Search-results record rather than full accessible survey text; no numeric coordinate, CRS, component-to-parent mapping, uncertainty, or public-location decision. |

##### JX-PCH-7-006-NC-E02

| Field | Value |
| --- | --- |
| evidenceId | JX-PCH-7-006-NC-E02 |
| candidateId or explicit record-level no-candidate reference | record-level no-candidate outcome |
| coordinateSourceTitle | 【展览预告】灼灼窑火 千年不息——萍乡南坑窑瓷器展 |
| coordinateSourcePublisher | Pingxiang Museum |
| coordinateSourceUrl | https://www.pxmuseum.com/h-nd-4631.html |
| coordinateSourceType | Official museum interpretation |
| sourceTier | Tier 1 |
| coordinateSourceDate | 2024 |
| coordinateAccessedDate | 2026-07-23 |
| evidenceQuoteOrSummary | Describes Pingxiang Nankeng kiln as a major long-lived western Jiangxi kiln complex and documents a museum exhibition of excavated material. |
| placeMatchEvidence | Correct Pingxiang kiln complex, site type, and broad period; no component-specific spatial match. |
| coordinateDerivationNote | None. Museum or exhibition coordinates were not used. |
| coordinateTransformationMethod | None. |
| independentCrossCheck | Independent official institutional corroboration of identity and significance, but not a spatial cross-check. |
| evidenceLimitations | Interpretation page only; no coordinates, CRS, component plan, uncertainty, or point-selection basis. |

#### E. Candidate assessment

The direct survey evidence confirms a multi-site kiln complex, while the designation specifically retains three components in one parent record. The accessible sources do not establish site-specific coordinates or a source CRS for all three components. Even complete component points would not justify a representative parent Point under the current policy. Confidence is None, the method remains unresolved, and the record is non-renderable.

#### F. Rejected candidates

Any 凤凰坡 or 瓦子坳 locality pin was rejected as a single-component substitute; no 庵子坡 coordinate was found. Yaoxia Village, Nankeng Town, museum, and wider kiln-complex centres were rejected as parent substitutes. All Fujian Nankeng kiln results were rejected as same-name sites in the wrong province and administrative area.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | unresolved |
| coordinateConfidence | None |
| coordinateMethod | unresolved |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted None/unresolved as the completed outcome of this reasonable research pass. No defensible parent coordinate was approved: the three components belong to a wider kiln complex that the Point-only model cannot represent without prohibited substitution. |
| remainingLimitations | Full survey access, component-specific plans, or a later approved geometry/component model could reopen this decision. The current accepted result remains None and non-renderable; this PR creates neither geometry nor component records. |

### JX-PCH-7-007 — 兴源马家窑址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-007 |
| officialNameZh | 兴源马家窑址 |
| officialLocationTextZh | 宜春市铜鼓县永宁镇兴源村 |
| remarksZh | null |
| projectNameEn | Xingyuan Majia Kiln Site |
| projectLocationTextEn | Yichun City, Tonggu County, Yongning Town, Xingyuan Village |

#### B. Search record

Research performed 2026-07-23 using `兴源马家窑址`, `兴源村`, `永宁镇`, `铜鼓县`, `宋元`, `考古`, `坐标`, and `经纬度`. Results corroborate the name in the earlier Yichun municipal protection list and the current provincial list, but do not provide a direct site description, numeric coordinate, map with transparent control, or source CRS. Searches were also contaminated by unrelated results for the prehistoric Majiayao culture and those were excluded.

#### C. Candidate list

No numeric coordinate candidate was created. Xingyuan Village, Yongning Town, similarly named kilns, and “Majiayao culture” search results are not substitutes for the protected kiln site.

#### D. Evidence list

##### JX-PCH-7-007-NC-E01

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-007-NC-E01 |
| sourceTier | Tier 3 — contemporaneous report reproducing the municipal protection list |
| coordinateSourceTitle | 宜春市新增156处市级文物保护单位～快来看看有你家乡的吗 |
| coordinateSourceUrl | https://www.sohu.com/a/280394306_476983 |
| coordinateSourceDate | 2018 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Sohu-hosted local report reproducing the Yichun municipal list |
| coordinateSourceType | Local report reproducing a municipal protection list |
| evidenceQuoteOrSummary | Lists 兴源马家窑址 as a Song-to-Yuan kiln site in Yongning Town and corroborates its municipal designation before the provincial listing. |
| placeMatchEvidence | Identity and broad administrative-location corroboration only; no coordinate candidate is supplied. |
| coordinateDerivationNote | No numeric coordinate published. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. |
| precision | Town-level in this source; the later official source table provides village level. |
| estimatedUncertaintyMeters | null |
| accessibility | Public article at access date. |
| independentCrossCheck | Earlier designation report, but not a direct archaeological field source. |
| evidenceLimitations | Reproduced list rather than primary survey evidence; no exact locality, coordinate, CRS, extent, or point-selection rationale. |
| rightsAndReuse | Citation and factual summary only. |

#### E. Candidate assessment

The search establishes continuity between municipal and provincial designation but does not improve the coordinate evidence beyond administrative locality. Without a direct archaeological source, a village-centre point would be invented. The record therefore remains unresolved with confidence None and is non-renderable.

#### F. Rejected candidates

Results about the prehistoric Majiayao culture were rejected as semantic false matches. Village, town, and general web-map POIs were rejected at discovery stage because they do not identify the kiln site or disclose coordinate provenance and CRS.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | unresolved |
| coordinateConfidence | None |
| coordinateMethod | unresolved |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted None/unresolved as the completed outcome of this reasonable research pass. No defensible coordinate was approved: the official village location is corroborated, but no direct site-specific coordinate evidence was found. |
| remainingLimitations | A direct archaeological record, surveyed coordinate, protection plan, or authoritative georeferenced site description could reopen this decision. The current accepted result remains None and non-renderable. |

### JX-PCH-7-008 — 落马桥窑址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-008 |
| officialNameZh | 落马桥窑址 |
| officialLocationTextZh | 景德镇市珠山区中华南路红光瓷厂院内 |
| remarksZh | null |
| projectNameEn | Luoma Qiao Kiln Site |
| projectLocationTextEn | Jingdezhen City, Zhushan District, within the Hongguang Ceramics Works compound on Zhonghua South Road |

#### B. Search record

Research performed 2026-07-23 using `落马桥窑址`, `红光瓷厂`, `中华南路404号`, `坐标`, `经纬度`, `发掘简报`, and excavation-institution combinations. The search located a direct excavation-report record, institutional summaries, and official excavation corroboration. These consistently place the remains within the Hongguang Ceramics Works compound on Zhonghua South Road and describe excavations from 2012 to 2017, but none publishes a site-specific numeric coordinate with a stated CRS.

#### C. Candidate list

No numeric coordinate candidate was created. A street-address geocode, factory-compound centroid, search-engine POI, or nearby road point would be a derived convenience location rather than a published archaeological coordinate.

#### D. Evidence list

##### JX-PCH-7-008-NC-E01

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-008-NC-E01 |
| sourceTier | Tier 2 — direct institutional excavation-report record |
| coordinateSourceTitle | 江西景德镇落马桥红光瓷厂窑址明清遗存发掘简报 |
| coordinateSourceUrl | https://ir.pku.edu.cn/handle/20.500.11897/599054 |
| coordinateSourceDate | 2020-11-25 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Peking University institutional repository; report by Jingdezhen Ceramic Archaeological Institute, Peking University, and Jiangxi Provincial Institute of Cultural Relics and Archaeology |
| coordinateSourceType | Direct excavation-report institutional record |
| evidenceQuoteOrSummary | Records rescue excavations at the Luomaqiao Hongguang Ceramics Works kiln site from 2012 to 2017 and describes continuous deposits from the Northern Song to late Qing. |
| placeMatchEvidence | Strong identity and compound-level location evidence; no numeric point candidate is supplied. |
| coordinateDerivationNote | No numeric coordinate published in the accessible record. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. No address geocoding or map extraction was performed. |
| precision | Named industrial compound/site only. |
| estimatedUncertaintyMeters | null — there is no published point and the archaeological remains extend within a compound. |
| accessibility | Public institutional metadata and abstract at access date. |
| independentCrossCheck | Direct excavation publication record, independent of the Phase 14A county republication. |
| evidenceLimitations | The accessible record does not provide a coordinate, CRS, surveyed plan control point, or reusable geometry. |
| rightsAndReuse | Bibliographic facts and a short evidence summary are cited; the report and figures are not copied into project data. |

##### JX-PCH-7-008-NC-E02

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-008-NC-E02 |
| sourceTier | Tier 1 — official municipal excavation summary |
| coordinateSourceTitle | 2024年景德镇市文物考古研究所业务工作综述 |
| coordinateSourceUrl | https://jdz.gov.cn/zwzx/jrcd/t1012741.shtml |
| coordinateSourceDate | 2025-02-20 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Jingdezhen Municipal People’s Government |
| coordinateSourceType | Official municipal archaeological-work summary |
| evidenceQuoteOrSummary | Lists Luomaqiao among the nationally approved archaeological excavation projects undertaken in 2024, corroborating the official identity and continuing archaeological treatment of the site. |
| placeMatchEvidence | Corroborates the protected-place identity but does not supply or validate a numeric coordinate. |
| coordinateDerivationNote | No numeric coordinate published. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. |
| precision | Named site only. |
| estimatedUncertaintyMeters | null |
| accessibility | Public government webpage at access date. |
| independentCrossCheck | Official current-work summary distinct from the excavation report and Phase 14A source. |
| evidenceLimitations | No coordinate, plan, CRS, precision statement, or site boundary is supplied. |
| rightsAndReuse | Citation and factual summary only. |

#### E. Candidate assessment

Multiple independent sources make the identity and industrial-compound relationship strong, but none supports choosing a point within that compound. An address match would not identify which archaeological locus should represent the site. The project owner accepted the Low-confidence, `broad-locality-only`, null-coordinate, non-renderable outcome for this pilot stage.

#### F. Rejected candidates

No numeric candidate reached the evidence threshold. Address-derived and commercial-map results were rejected at discovery stage because they locate a modern property or POI without published coordinate provenance, archaeological point relationship, or source CRS.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | reviewed |
| coordinateConfidence | Low |
| coordinateMethod | broad-locality-only |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted the Low, non-renderable, no-point outcome for this pilot stage. Direct excavation and government sources identify the site within the Hongguang Ceramics Works compound, but no defensible site point or source CRS was found. |
| remainingLimitations | A published surveyed coordinate or georeferenced archaeological plan is needed; the street address or compound centre must not be substituted automatically. |

### JX-PCH-7-009 — 观音阁窑址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-009 |
| officialNameZh | 观音阁窑址 |
| officialLocationTextZh | 景德镇市珠山区竟成镇昌江村 |
| remarksZh | null |
| projectNameEn | Guanyin Ge Kiln Site |
| projectLocationTextEn | Jingdezhen City, Zhushan District, Jingcheng Town, Changjiang Village |

#### B. Search record

Research performed 2026-07-23 using `观音阁窑址`, `昌江村`, `竟成镇`, `坐标`, `经纬度`, `考古发掘`, and the excavation institutions named in the report. A direct 2024 excavation report describes the protected remains across a broad area north of Qingtang Road, including Guanyinge and Dongwangmiao localities between the Changjiang riverbank and named slopes. An official municipal summary independently confirms Guanyinge excavation work. Neither source publishes a site-specific numeric coordinate with a stated CRS.

#### C. Candidate list

No numeric coordinate candidate was created. The Guanyinge locality, Changjiang Village centre, riverbank, road centre, or a search-engine pin cannot stand in for the archaeological site extent.

#### D. Evidence list

##### JX-PCH-7-009-NC-E01

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-009-NC-E01 |
| sourceTier | Tier 2 — direct archaeological excavation report |
| coordinateSourceTitle | 江西景德镇观音阁窑址2022年发掘简报 |
| coordinateSourceUrl | https://www.dpm.org.cn/Uploads/File/2024/11/26/u6745900f41cb4.pdf |
| coordinateSourceDate | 2024 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Palace Museum-hosted report by the National Centre for Archaeology, Jiangxi Provincial Institute of Cultural Relics and Archaeology, and Jingdezhen Ceramic Archaeological Institute |
| coordinateSourceType | Direct archaeological excavation report |
| evidenceQuoteOrSummary | Describes the site extent in Changjiang Village: north of Qingtang Road toward Fuliang, centred on Guanyinge and Dongwangmiao, with the Changjiang east bank to the west and named localities and slopes to the south and east. |
| placeMatchEvidence | Directly supports site identity and broad extent, but not a selected representative point. |
| coordinateDerivationNote | No numeric coordinate identified in the report text used for this audit. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. No map pixel extraction, geocoding, or centroid calculation was performed. |
| precision | Broad archaeological distribution area described by local boundaries. |
| estimatedUncertaintyMeters | null — no source point exists and the described area is spatially extensive. |
| accessibility | Public direct PDF at access date. |
| independentCrossCheck | Direct multi-institution excavation report, independent of the Phase 14A source-table republication. |
| evidenceLimitations | The narrative extent cannot be converted to a point without inference; no CRS, surveyed point, or reusable geometry is supplied. |
| rightsAndReuse | Citation and factual summary only; report text and figures are not republished as data. |

##### JX-PCH-7-009-NC-E02

| Field | Value |
| --- | --- |
| candidateId | null — no numeric candidate |
| evidenceId | JX-PCH-7-009-NC-E02 |
| sourceTier | Tier 1 — official municipal excavation summary |
| coordinateSourceTitle | 2024年景德镇市文物考古研究所业务工作综述 |
| coordinateSourceUrl | https://jdz.gov.cn/zwzx/jrcd/t1012741.shtml |
| coordinateSourceDate | 2025-02-20 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Jingdezhen Municipal People’s Government |
| coordinateSourceType | Official municipal archaeological-work summary |
| evidenceQuoteOrSummary | Lists Guanyinge among nationally approved archaeological excavation projects conducted in 2024. |
| placeMatchEvidence | Independently corroborates official site identity and active research; supplies no coordinate candidate. |
| coordinateDerivationNote | No numeric coordinate published. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. |
| precision | Named site only. |
| estimatedUncertaintyMeters | null |
| accessibility | Public government webpage at access date. |
| independentCrossCheck | Official current-work summary distinct from the direct report and Phase 14A source. |
| evidenceLimitations | No numeric location, CRS, point-selection rationale, or boundary data. |
| rightsAndReuse | Citation and factual summary only. |

#### E. Candidate assessment

The direct report gives substantially better context than an administrative centre, yet it describes an archaeological distribution area rather than a published representative point. Selecting Guanyinge, Dongwangmiao, or any inferred centre would add unsupported judgement. The project owner accepted the Low-confidence, `broad-locality-only`, null-coordinate, non-renderable outcome for this pilot stage.

#### F. Rejected candidates

No numeric candidate met the threshold. General web-map and locality results were rejected at discovery stage because they do not document archaeological-point relationship, coordinate provenance, source CRS, or uncertainty.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | reviewed |
| coordinateConfidence | Low |
| coordinateMethod | broad-locality-only |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted the Low, non-renderable, no-point outcome for this pilot stage. The direct report identifies a broad archaeological distribution area in Changjiang Village but does not support a representative Point. |
| remainingLimitations | A surveyed coordinate or authoritative georeferenced site plan is required. Named localities within the broad extent must not be treated as the parent site point without evidence. |

### JX-PCH-7-010 — 御窑厂西窑址

#### A. Source identity

| Field | Value |
| --- | --- |
| recordId | JX-PCH-7-010 |
| officialNameZh | 御窑厂西窑址 |
| officialLocationTextZh | 景德镇市珠山区 |
| remarksZh | null |
| projectNameEn | Yuyaochang West Kiln Site |
| projectLocationTextEn | Jingdezhen City, Zhushan District |

#### B. Search record

Research performed 2026-07-23 using the exact official name, `御窑厂西窑址 坐标`, `御窑厂西窑址 经纬度`, Imperial Kiln archaeological reports, government protection boundaries, and the UNESCO tentative-list record. Official material distinguishes 御窑厂西窑址 from 御窑厂窑址, 落马桥窑址, and 观音阁窑址. The only official numeric coordinate found is the central coordinate for the much broader “Imperial Kiln Sites of Jingdezhen” tentative serial property; it does not identify the west kiln site and is therefore rejected.

#### C. Candidate list

##### JX-PCH-7-010-C01 — rejected

| Field | Value |
| --- | --- |
| candidateId | JX-PCH-7-010-C01 |
| candidateLatitude | 29.297778 |
| candidateLongitude | 117.200000 |
| candidateSourceCRS | Unknown geographic datum; source publishes latitude/longitude in degrees, minutes, and seconds but does not state WGS84 |
| candidatePrecision | Published to one arc-second; this precision applies to the broader serial-property coordinate, not this record |
| candidateMethod | official-map-identification |
| candidateStatus | rejected |
| candidateUncertaintyReason | Not estimated because the coordinate is not attributable to the record |
| candidateRejectionReason | The UNESCO tentative-list coordinate represents the broader Imperial Kiln Sites of Jingdezhen serial property and does not identify 御窑厂西窑址. The source datum is also unstated. |

#### D. Evidence list

##### JX-PCH-7-010-C01-E01

| Field | Value |
| --- | --- |
| candidateId | JX-PCH-7-010-C01 |
| evidenceId | JX-PCH-7-010-C01-E01 |
| sourceTier | Tier 1 — official intergovernmental tentative-list record submitted by China |
| coordinateSourceTitle | Imperial Kiln Sites of Jingdezhen |
| coordinateSourceUrl | https://whc.unesco.org/en/tentativelists/6265/ |
| coordinateSourceDate | 2017-09-05 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | UNESCO World Heritage Centre; tentative-list submission by China |
| coordinateSourceType | Official intergovernmental tentative-list record |
| evidenceQuoteOrSummary | Publishes a central coordinate of N29 17 52 E117 12 0 for the broader Imperial Kiln Sites of Jingdezhen tentative serial property. |
| placeMatchEvidence | Direct source for the numeric value, but the value is not record-specific and therefore cannot support approval for JX-PCH-7-010. |
| coordinateDerivationNote | N29 17 52 E117 12 0 |
| sourceCRS | Not stated on the page. |
| derivedWGS84 | 29.297778, 117.200000 for comparison only; not asserted to be WGS84 and not approved. |
| coordinateTransformationMethod | Arithmetic DMS-to-decimal conversion only: 29 + 17/60 + 52/3600; 117 + 12/60. No datum transformation. |
| precision | One arc-second as published, but relationship precision is only the broader serial property. |
| estimatedUncertaintyMeters | null — the candidate is rejected before site-specific uncertainty estimation. |
| accessibility | Public UNESCO webpage at access date. |
| independentCrossCheck | Independent official international registry record. |
| evidenceLimitations | Broader serial property, unstated datum, no identification of the west kiln component, and no record-specific point-selection explanation. |
| rightsAndReuse | Citation and derived arithmetic comparison only; no UNESCO map or geometry is copied. |

##### JX-PCH-7-010-NC-E01

| Field | Value |
| --- | --- |
| candidateId | null — identity corroboration only |
| evidenceId | JX-PCH-7-010-NC-E01 |
| sourceTier | Tier 1 — official local-authority account publication |
| coordinateSourceTitle | 景德镇手工瓷业遗存申遗进入国家预备名单 |
| coordinateSourceUrl | https://m.thepaper.cn/newsDetail_forward_30857718 |
| coordinateSourceDate | 2026 |
| coordinateAccessedDate | 2026-07-23 |
| coordinateSourcePublisher | Jingdezhen Women’s Federation official account, published through The Paper |
| coordinateSourceType | Official local-authority account publication |
| evidenceQuoteOrSummary | Enumerates 御窑厂窑址、落马桥窑址、观音阁窑址、御窑厂西窑址 as distinct town-area components of the proposed property. |
| placeMatchEvidence | Confirms that the west kiln site is a distinct record and supports rejecting the broader Imperial Kiln coordinate as a substitute. |
| coordinateDerivationNote | No record-specific numeric coordinate published. |
| sourceCRS | Not stated; no coordinate supplied. |
| derivedWGS84 | null |
| coordinateTransformationMethod | None. |
| precision | Distinct named component only. |
| estimatedUncertaintyMeters | null |
| accessibility | Public mobile article at access date. |
| independentCrossCheck | Official local-authority communication distinct from the UNESCO registry and Phase 14A source. |
| evidenceLimitations | No coordinate, plan, boundary, CRS, or precise placement for the west kiln site. |
| rightsAndReuse | Citation and factual summary only. |

#### E. Candidate assessment

The official UNESCO coordinate has excellent source authority but the wrong place relationship: authority alone cannot turn a serial-property centre into a coordinate for a distinct component. Separate official material reinforces that the west kiln site must not be collapsed into the main Imperial Kiln site. No site-specific numeric alternative with transparent CRS and provenance was found, so confidence remains None and the record is unresolved.

#### F. Rejected candidates

`JX-PCH-7-010-C01` is rejected because it belongs to the broader Imperial Kiln Sites of Jingdezhen tentative serial property, not specifically to 御窑厂西窑址. Crowd-sourced coordinates for the main Imperial Kiln site and general search-engine POIs were also rejected at discovery stage and not promoted to candidates because they repeat the same place-relationship error while adding weaker provenance.

#### G. Final decision

| Field | Value |
| --- | --- |
| researchStatus | unresolved |
| coordinateConfidence | None |
| coordinateMethod | unresolved |
| approvedLatitude | null |
| approvedLongitude | null |
| coordinateReferenceSystem | null |
| estimatedUncertaintyMeters | null |
| renderable | false |
| sensitivityAssessment | not-assessed |
| publicationLocationPolicy | withheld |
| selectedCandidateId | null |
| reviewer | project owner |
| reviewedDate | 2026-07-23 |
| finalDecisionSummary | The project owner accepted None/unresolved as the completed outcome of this reasonable research pass. No defensible coordinate was approved; the broader Imperial Kiln coordinate remains rejected because it does not identify the west kiln site. |
| remainingLimitations | Record-specific official or direct archaeological evidence with a clear relationship to the west kiln site could reopen this decision. The current accepted result remains None and non-renderable. |

## 6. Cross-record review

The project research pass is complete. On 2026-07-23, the project owner reviewed and accepted the conservative Low, None, and unresolved outcomes. No second review was required because no High or Medium coordinate outcome was approved.

| Review dimension | Cross-record result |
| --- | --- |
| source independence | Direct or independently contextual evidence was found for 001, 003, 004 (in part), 005, 006, 008, 009, and 010. Record 002 remains dependent on the official designation location, and 007 has only an earlier reproduced municipal list in addition to the designation. Repeated or copied protected-unit lists were not counted as independent coordinate evidence. |
| exact identity and false matches | Same-name sites in other provinces, Majiayao-culture results, general Imperial Kiln results, and the Fujian Nankeng kiln were excluded. Record 010’s broader Imperial Kiln coordinate is preserved as rejected rather than silently reused. |
| CRS consistency | No candidate was approved. The only numeric candidate has an unstated geographic datum and is rejected. No GCJ-02 or BD-09 value appears, and no source coordinate is silently labelled WGS84. |
| transformations | No datum transformation was performed. The rejected UNESCO DMS value was converted to decimal by transparent arithmetic only; it remains explicitly not asserted as WGS84. |
| precision and uncertainty | No false precision was introduced into an approved field. All Low/None outcomes use `null` uncertainty because no representative point exists. The rejected candidate preserves source precision but has no site-specific uncertainty estimate. |
| sensitivity | No High or Medium candidate was selected, so no exact sensitive coordinate was committed and no sensitivity determination was invented. Every record remains `not-assessed`. |
| publication policy | Every record remains `withheld`, with `null` approved coordinates and `false` renderability. No publication permission is inferred. |
| rejected candidates | One numeric candidate is retained and rejected. Additional locality centres, administrative centres, road/park/factory/tourism POIs, unsupported web-map pins, wrong-place matches, components, averages, and centroids are documented as rejected discovery results without fabricated candidate coordinates. |
| locality-centre substitution | No town, village, district, reservoir, road, factory, park, museum, tourism, or government-office centre was accepted. |
| multi-component parents | Records 004 and 006 remain one parent designation each, with no selected component, centroid, average, child record, or geometry. |
| human gates | The project owner accepted five Low outcomes and five None/unresolved outcomes on 2026-07-23. No High or Medium outcome exists, so the High/Medium second-review requirement was not triggered. |

### Project-owner sign-off

- Ten records received a completed initial research pass.
- Five Low, non-renderable, no-point outcomes were accepted.
- Five None/unresolved, non-renderable, no-point outcomes were accepted.
- There are zero High outcomes and zero Medium outcomes.
- There are zero selected candidates, zero approved numeric coordinates, and zero renderable records.
- One numeric candidate remains documented and rejected.
- No second-review requirement was triggered because no High or Medium coordinate was approved.
- The project owner accepts `withheld` as the publication-location policy for all ten records.
- Later evidence may reopen an individual coordinate decision without changing the authoritative Phase 14A source or the approved Phase 14B project interpretation.

## 7. Integrity status

- Exactly ten sequential summary rows and ten record sections are present in ID order.
- Source identity values are copied from Phase 14A and Phase 14B.
- One numeric candidate is documented and rejected; there are no active or selected numeric candidates.
- Sixteen evidence items reference either that rejected candidate or an explicit record-level no-candidate outcome.
- Approved pilot-stage outcomes are five reviewed Low and five None/unresolved; no High or Medium outcome is claimed.
- All approved coordinates and coordinate reference systems are literal `null`.
- Every record remains non-renderable and uses publication policy `withheld`.
- Records 004 and 006 remain non-renderable with no parent Point.
- Project-owner approval is recorded as 2026-07-23. A second reviewer was not required because no High or Medium coordinate outcome was approved.
- No JSON, CSV, GeoJSON, geometry, runtime data, Firebase change, public-page change, export change, or Map behavior is introduced.
