# Phase 15C-8 — complete Xinyu Official Heritage Point re-audit

## Decision and stop point

This is the current canonical Point-readiness audit for the complete Xinyu
Official Heritage provincial-register review universe. It applies the
[controlling publication policy](../policy/official-record-publication-policy.md)
to all 22 listed record/component rows and recommends a bounded later PR #69
batch.

This phase is research and documentation only. It publishes no record, Point,
line, polygon, public-location decision, canonical source record, or generated
GeoJSON feature. Xiabu and Xieli remain unpublished. Production remains exactly
five Official Heritage Points and zero real lines or polygons. Community
Heritage remains unchanged and Point-based.

The implementation stop point is explicit: **PR #69 may retain the five
existing Points and may propose the Xiabu `暴动举行地旧址` component as one
ordinary Point only after separate approval.** Xieli is not in that batch.
Nothing in this audit approves implementation, deployment, or publication.

## Authority, method, and evidence hierarchy

This audit is controlled by:

- the [Official Heritage spatial representation and publication policy](../policy/official-record-publication-policy.md);
- the [approved mixed-geometry roadmap](../plans/official-heritage-mixed-geometry-roadmap.md);
- the current official register, [新余市市级以上文物保护单位名录（2025年）](https://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml), issued by 新余市文化广电旅游局 on 2025-12-26;
- the institutional [Xinyu Museum provincial-unit index](https://www.xysmuseum.com/list_22/);
- the historical [Phase 15C-6 complete-register review](../plans/phase-15c-6-official-record-publication-policy-and-batch-plan.md);
- the detailed [Xiabu evidence record](./phase-15c-5-xiabu-geometry-pilot.md);
- the [Xieli misleading-risk review](./phase-15c-7-xieli-misleading-risk-review.md);
- the current canonical source data, public-location decisions, and generated
  official GeoJSON.

Repository evidence was used first. Evidence preference was official
government or institutional heritage material, authority documents,
institutional descriptions, research publications, and then reviewed provider
evidence with corroboration. Provider precision was not treated as authority.
No basemap shape, footprint, line, polygon, centroid, or visible marker was
copied or traced.

The official-register URL and museum index were checked again on 2026-07-30.
The museum index was available and showed the expected institutional entries.
The government page was not retrievable through the review environment, so
this audit relies on the preserved current transcription and prior access
record for its table content. That access limitation does not introduce a
conflicting register version.

Each row received one value for `naturalSpatialForm`, one for
`futureNonPointRepresentation`, one `pointAuditClassification`, one
`policyOutcome`, and one `pr69BatchRecommendation`. A `needs-more-evidence`
row remains operationally withheld. A future shape is planning only and never
appears alongside an active Point.

## Reconciled audit universe

The official source labels the provincial section `省级文物保护单位（20处22点）`.
The displayed table contains 22 record/component rows and 21 distinct displayed
designation names. This audit preserves the source's wording and does not
manufacture a single alternative “designation total”:

- 袁州明代城墙砖窑址群 is a cross-city parent; the Xinyu row is its separately
  named 芦塘窑址 component and must not stand for the whole parent;
- 下保农民暴动旧址 occupies two rows for the separately named
  暴动举行地旧址 and 暴动会议地旧址 components;
- the current machine aggregate contains 15 joined records overall, not the
  complete Xinyu register;
- only six machine records overlap this Xinyu audit: the five published
  `JX-XY-*` records and excluded `JX-PCH-7-001` 打鼓岭遗址;
- the other nine machine exclusions are outside Xinyu and outside this audit;
- 16 Xinyu audit rows have no canonical machine record;
- five rows have public-location decisions and are the five production Points.

`XY-OH-AUD-*` identifiers below are stable documentation audit-row identifiers,
not production record IDs. Each official row/component appears exactly once.

## Complete row-level audit

### Identity, source classification, and repository status

| Audit row | Official identity and locality | Existing approved English name | Source classification → public type; subtype | Parent/component and confidence | Machine / decision / publication status |
| --- | --- | --- | --- | --- | --- |
| `XY-OH-AUD-001` | 棋盘山遗址; 渝水区罗坊镇章塘村 | — | 古遗址 → Archaeological sites; settlement/platform site | Standalone identity confirmed; exact extent unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-002` | 袁州明代城墙砖窑址群（芦塘窑址）; 分宜县分宜镇卢塘村 | — | 古遗址 → Archaeological sites; kiln site | Cross-city parent 袁州明代城墙砖窑址群; Xinyu component 芦塘窑址 confirmed; other parent components out of scope | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-003` | 彭家山遗址; 高新区水西村周家新村 | — | 古遗址 → Archaeological sites; archaeological settlement | Standalone identity confirmed; fence/extent unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-004` | 斜里遗址 (`6-1-040`); 渝水区珠珊镇洋津村 | Xieli Site | 古遗址 → Archaeological sites; archaeological site | Standalone identity confirmed; centre datum unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-005` | 习凿齿墓; 分宜县洞村乡早木山村 | — | 古墓葬 → Archaeological sites; tomb | Identity confirmed; tomb/visitor-facility assignment unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-006` | 飨褒堂; 分宜县分宜镇介桥村 | — | 古建筑 → Buildings & structures; ancestral hall | Identity confirmed; building-level location unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-007` | 尚睦邓家围垅屋; 分宜县湖泽镇尚睦村 | — | 古建筑 → Buildings & structures; enclosed residence | Identity and alias relationship confirmed; exact enclosure unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-008` | 昼锦堂; 仙女湖区观巢镇汉泉村 | Zhoujin Hall | 古建筑 → Buildings & structures; hall | Identity confirmed | Machine `JX-XY-PCH-008`; decision present; published Point; existing production Point |
| `XY-OH-AUD-009` | 蓉泉桥; 渝水区水北镇排江村 | Rongquan Bridge | 古建筑 → Routes & infrastructure; bridge | Identity confirmed | Machine `JX-XY-PCH-009`; decision present; published Point; existing production Point |
| `XY-OH-AUD-010` | 新余孔庙; 渝水区城南办事处魁星路 | Xinyu Confucian Temple | 古建筑 → Buildings & structures; temple compound | Identity and compound confirmed | Machine `JX-XY-PCH-001`; decision present; published Point; existing production Point |
| `XY-OH-AUD-011` | 馀庆堂; 渝水区水北镇黄坑村 | — | 古建筑 → Buildings & structures; hall | Designation identity confirmed; same-name/building identity unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-012` | 分宜钤岗上高会战中国军队阵亡将士陵园; 分宜县钤山镇金鸡埔村 | — | 近现代重要史迹 → Parks, gardens & landscapes; memorial cemetery | Identity confirmed; entrance, memorial, and cemetery-centre meanings unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-013` | 中共分宜临时县委旧址; 分宜县钤山镇田心村 | — | 近现代重要史迹 → Buildings & structures; former site | Identity confirmed; component-specific building unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-014` | 儒延坊肃反委员会旧址; 分宜县钤山镇田心村 | — | 近现代重要史迹 → Buildings & structures; former site | Identity confirmed; same-locality building unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-015` | 傅抱石故居; 渝水区罗坊镇章塘村 | Fu Baoshi Former Residence | 近现代重要史迹 → Buildings & structures; former residence | Identity confirmed | Machine `JX-XY-PCH-014`; decision present; published Point; existing production Point |
| `XY-OH-AUD-016` | 北伐军仰天岗战场遗址 (`6-5-318`); 仙女湖区城北办事处 | — | 近现代重要史迹 → Parks, gardens & landscapes; battlefield landscape | Identity confirmed; dispersed extent/endpoints unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-017` | 上海劳动妇女战地服务团旧址; 渝水区珠珊镇沙头村 | Former Site of the Shanghai Labour Women's Battlefield Service Corps | 近现代重要史迹 → Buildings & structures; former site/visitor venue | Identity confirmed | Machine `JX-XY-PCH-016`; decision present; published Point; existing production Point |
| `XY-OH-AUD-018` | 中共花桥党支部旧址; 仙女湖区九龙山乡塔前分场 | — | 近现代重要史迹 → Buildings & structures; former site | Identity confirmed; current building unresolved | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-019` | 下保农民暴动旧址——暴动举行地旧址 (`6-5-321` component 1); 渝水区良山镇下保村 | — | 近现代重要史迹 → Buildings & structures; protected former-site structure | Parent 下保农民暴动旧址; component identity confirmed by official plaque and provider evidence | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-020` | 下保农民暴动旧址——暴动会议地旧址 (`6-5-321` component 2); 渝水区良山镇下保村 | — | 近现代重要史迹 → Buildings & structures; protected former-site structure | Same parent; component identity official, but no component-specific spatial evidence | Machine absent; decision absent; unpublished |
| `XY-OH-AUD-021` | 打鼓岭遗址; current register 渝水区罗坊镇周家村; earlier source 竹山村坑口组 | Dagu Ling Site | 古遗址 → Archaeological sites; Palaeolithic site | Designation confirmed; current/earlier locality conflict unresolved | Machine `JX-PCH-7-001`; decision absent; excluded from publication for no defensible Point |
| `XY-OH-AUD-022` | 渝水周家上高会战中国军队第十九集团军总司令部旧址; 渝水区珠珊镇潭口村 | — | 近现代重要史迹 → Buildings & structures; former headquarters | Identity confirmed; building-level evidence unresolved | Machine absent; decision absent; unpublished |

The simplified public type is project presentation only. It does not overwrite
`古遗址`, `古墓葬`, `古建筑`, or `近现代重要史迹`.

### Spatial assessment, operational outcome, and PR #69 routing

| Audit row | `naturalSpatialForm` | `futureNonPointRepresentation` | Point meaning if defensible | `pointAuditClassification` | `policyOutcome` | `pr69BatchRecommendation` |
| --- | --- | --- | --- | --- | --- | --- |
| `001` 棋盘山 | `areal` | `evidence required` | null | `withhold` | `withhold` | `defer-to-non-point-research` |
| `002` 芦塘窑址 | `areal` | `evidence required` | null | `withhold` | `withhold` | `defer-to-non-point-research` |
| `003` 彭家山 | `areal` | `evidence required` | null | `withhold` | `withhold` | `defer-to-non-point-research` |
| `004` 斜里 | `areal` | `unsuitable at present` | `generalized-reference-point` only | `ready-only-as-generalized-point` (conditional) | `point-now-shape-later` (research classification only) | `exclude-from-pr69` |
| `005` 习凿齿墓 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `006` 飨褒堂 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `007` 尚睦邓家围垅屋 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `008` 昼锦堂 | `point-like` | `unnecessary` | `visitor-reference-point` | `ready-to-publish-as-point` | `point-now` | `retain-existing-production-point` |
| `009` 蓉泉桥 | `linear` | `potentially useful` | `heritage-feature-point` | `ready-to-publish-as-point` | `point-now-shape-later` | `retain-existing-production-point` |
| `010` 新余孔庙 | `point-like` | `unnecessary` | `heritage-feature-point` | `ready-to-publish-as-point` | `point-now` | `retain-existing-production-point` |
| `011` 馀庆堂 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `012` 分宜钤岗陵园 | `areal` | `evidence required` | possible `entrance-reference-point`, not yet supported | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `013` 中共分宜临时县委旧址 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `014` 儒延坊肃反委员会旧址 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `015` 傅抱石故居 | `point-like` | `unnecessary` | `visitor-reference-point` | `ready-to-publish-as-point` | `point-now` | `retain-existing-production-point` |
| `016` 仰天岗战场 | `areal` | `evidence required` | null | `needs-more-evidence` | `withhold` | `defer-to-non-point-research` |
| `017` 上海劳动妇女战地服务团旧址 | `point-like` | `unnecessary` | `visitor-reference-point` | `ready-to-publish-as-point` | `point-now` | `retain-existing-production-point` |
| `018` 中共花桥党支部旧址 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `019` 下保暴动举行地 | `point-like` | `unnecessary` | `component-reference-point` | `ready-to-publish-as-point` | `point-now` | `propose-for-pr69-ordinary-point` |
| `020` 下保暴动会议地 | `point-like` | `unnecessary` | null pending component evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |
| `021` 打鼓岭 | `areal` | `unsuitable at present` | null | `withhold` | `withhold` | `exclude-from-pr69` |
| `022` 周家十九集团军总司令部旧址 | `point-like` | `unnecessary` | null pending evidence | `needs-more-evidence` | `withhold` | `exclude-from-pr69` |

`heritage-feature-point` is the controlling-policy audit term corresponding to
Rongquan Bridge's already approved current `heritage-feature` decision and to
the reviewed Point within Xinyu Confucian Temple's confirmed compound. The
temple keeps its approved compound-centre public-location decision; this audit
does not rename runtime metadata.

### Risk, limitations, and exact evidence gaps

| Audit row | Identity/component and position risk | Sensitivity and access | Misleading-map risk, styling, and required next evidence |
| --- | --- | --- | --- |
| `001` | Identity strong; no verified centre, CRS, or georeferenced platform/ditch | High archaeological sensitivity; access implications unknown | A generic centre or rectangle would imply unsupported extent. Need authority GIS or a georeferenced platform/ditch survey and publication sensitivity decision. |
| `002` | High parent/component-assignment risk; no coordinate | High archaeological sensitivity; access unknown | A Point could falsely represent the cross-city parent. Need a component map tying all four named edges to 芦塘; do not reuse coordinates for other kiln components. |
| `003` | Identity strong; protected fence not georeferenced | High archaeological sensitivity; access unknown | Village or fence-centre substitution would look exact. Need authority/survey geometry for the identified fence, CRS, and sensitivity approval. |
| `004` | Identity strong; published centre datum unspecified; 500 m conservative uncertainty | High archaeological sensitivity; public source already discloses centre; no access route is asserted | Ordinary marker, 60 m square, and uncertainty area are misleading. Generalized Point requires distinct styling and persistent datum/500 m/extent limitations; authority datum or GIS is the preferred upgrade. |
| `005` | Tomb versus memorial/entrance assignment unresolved; no extracted defensible coordinate | Burial sensitivity; public visitation does not remove exact-location risk | An exact-looking tomb Point could expose or misidentify the burial. Need component-specific institutional evidence, provider coordinate with BD-09 conversion if used, imagery reconciliation, and sensitivity approval. |
| `006` | Same-name/location risk; no stable building coordinate | Low sensitivity; public-access point not established | Village-centre placement would be misleading. Need institutional or stable provider coordinate, source CRS, photo/imagery identity match, and entrance-versus-building meaning. |
| `007` | Compound identity strong; no verified POI/building match | Low sensitivity; residential access implications require review | A village Point could implicate the wrong residence. Need stable POI/coordinate, CRS conversion, positive match to the 99-room enclosure, and access wording. |
| `008` | Confirmed visitor POI; 125 m uncertainty | Low sensitivity; public visitor reference | Current wording and ordinary marker communicate a visitor reference adequately. Preserve the approved coordinate and limitations; no footprint search is required. |
| `009` | Confirmed bridge POI; 75 m uncertainty is much larger than the 7.7 m bridge length | Low sensitivity; normal public infrastructure context | Current Point is acceptable, but a centreline would overstate accuracy. Need materially better endpoints/centre and provenance before any superseding line. |
| `010` | Confirmed named compound; 75 m uncertainty | Low sensitivity; public urban compound | Current approximate compound-centre wording is adequate. Preserve decision; any later perimeter needs stronger provenance and must not imply a legal boundary. |
| `011` | Material same-name and building-identity risk; no coordinate | Low sensitivity; access unknown | A locality Point could select the wrong hall. Need an institutional description, stable POI, CRS conversion, and plaque/photo/imagery match. |
| `012` | Entrance, memorial, cemetery centre, and extent are not distinguished | Burial/memorial sensitivity; public access likely but unconfirmed | A generic centre may imply graves or an official boundary. Need an institutional visitor/entrance reference, WGS84 reconciliation, access review, and separately sourced extent if later researched. |
| `013` | Tianxin building not independently distinguished | Low sensitivity; access unknown | High same-locality confusion with row `014`. Need plaque/photo match, building-specific coordinate and CRS, and current-building confirmation. |
| `014` | Tianxin building not independently distinguished | Low sensitivity; access unknown | High same-locality confusion with row `013`. Need plaque/photo match, building-specific coordinate and CRS, and current-building confirmation. |
| `015` | Confirmed visitor POI; 100 m uncertainty | Low sensitivity; public visitor venue | Current visitor-reference wording is adequate and does not claim protected fabric. Preserve decision; no footprint is needed for publication. |
| `016` | Battlefield endpoints and internal features unresolved | Moderate sensitivity and access implications across a dispersed landscape | A single Point would materially collapse a roughly 3,000 m × 100 m battlefield. Need authority/institutional map and georeferenced endpoints/extent; later non-Point research only. |
| `017` | Confirmed visitor venue; 100 m uncertainty | Low sensitivity; public education venue | Current visitor-reference wording is adequate. Preserve the current provider-pin reconciliation and do not claim the protected building itself. |
| `018` | No building-specific identity or coordinate | Low sensitivity; access unknown | A farm/locality Point risks the wrong building. Need institutional identity, plaque/photo match, provider coordinate/CRS, and current-building confirmation. |
| `019` | Exact official component corroborated by plaque; two provider-derived WGS84 results form a 124 m cluster; selected result has 150 m uncertainty | Low sensitivity; established public visitor context; no private route asserted | Ordinary component-reference Point is honest with persistent component wording and uncertainty. Do not call it the parent location, building footprint, entrance, or legal boundary. |
| `020` | Official component exists, but reviewed provider/photo evidence does not identify this component | Low sensitivity; access unknown | Reusing row `019` would conflate components. Need a component-specific plaque/photo, coordinate, CRS conversion, building match, and access review. |
| `021` | Current/earlier locality conflict; “500 m east” has no defined origin/bearing; no coordinate or CRS | Very high archaeological and false-match risk; access unknown | A village-offset Point or uncertainty area would be invented and discoverability could be harmful. Need reconciled official locality, surveyed plan/coordinate, and explicit sensitivity approval. |
| `022` | No building-level evidence; confusion with other Shanggao Campaign sites | Low sensitivity; access unknown | A village Point could identify the wrong headquarters site. Need independent plaque/photo identity, provider coordinate/CRS conversion, and building confirmation. |

All unpublished rows require persistent public limitations if later approved.
Rows `001`–`003`, `004`, `012`, `016`, and `021` also need spatial-form or
sensitivity wording that current ordinary Point styling cannot supply honestly.

## Coordinate and CRS record for every Point recommendation

Coordinate order is `[longitude, latitude]`. More decimals below preserve
reproducibility; they do not reduce the stated uncertainty.

| Audit row | Original coordinate, source, and capture | CRS and conversion/reconciliation | Candidate/current public coordinate and uncertainty | Precision, independent evidence, and unresolved concerns |
| --- | --- | --- | --- | --- |
| `008` 昼锦堂 | Gaode POI `B0IRN5X33Z`, `[114.845605, 27.851425]`, named POI/address/photo review | GCJ-02; ten-iteration deterministic inverse GCJ-02 using the documented Krasovsky constants, then independent WGS84 locality/imagery review | WGS84 `[114.840705, 27.854836]`; 125 m | Six decimals preserve the reviewed decision, not metre accuracy. Museum identity and Hanquan locality corroborate it; visitor reference may not be the protected feature. |
| `009` 蓉泉桥 | Gaode POI `B0JU95B3WN`, `[115.052627, 28.070835]`, named bridge POI/photo | GCJ-02; same deterministic inverse and WGS84 road/watercourse review | WGS84 `[115.047377, 28.074011]`; 75 m | Museum description and feature photo reconcile identity. Uncertainty is too large to derive a bridge line. |
| `010` 新余孔庙 | Google mainland named POI `[114.941361, 27.794748]`, assessed GCJ-02-like; named OSM way `1255899577` | Provider value retained as GCJ-02 evidence, not copied as WGS84; selected point reconciled to the named OSM WGS84 compound | WGS84 `[114.937042, 27.798123]`; 75 m | Museum and named compound corroborate it. It is an approximate compound reference, not an official centroid or boundary. |
| `015` 傅抱石故居 | Gaode POI `B0FFJ6C27Y`, `[115.098417, 27.908861]`, named visitor POI/address | GCJ-02; deterministic inverse and independent WGS84 locality/imagery review | WGS84 `[115.093120, 27.911966]`; 100 m | Museum description corroborates identity. Visitor venue may not coincide with protected fabric. |
| `017` 上海劳动妇女战地服务团旧址 | Gaode POI `B0IATLWGUH`, current `[114.977746, 27.770564]`, same ID/name/photo/address rechecked after provider-pin movement | GCJ-02; deterministic inverse and independent WGS84 locality/imagery review | WGS84 `[114.972780, 27.773914]`; 100 m | Institutional visitor context corroborates it. Earlier provider coordinate remains reviewer evidence only. |
| `019` 下保暴动举行地 | Gaode `B0L1RCC3EM` `[114.999665, 27.665090]`; Baidu UID `ba0c8d3a43ce938b13293507`, BD-09 `[115.007145335, 27.670165011]`; provider POIs and plaque photograph | Gaode GCJ-02 → iterative inverse WGS84 `[114.994632317, 27.668364844]`; Baidu BD-09 → GCJ-02 → iterative inverse WGS84 `[114.995569672, 27.667620470]` | Proposed WGS84 `[114.995570, 27.667620]`; 150 m | Exact plaque text ties the evidence to 暴动举行地, not the parent or meeting component. The provider cluster is about 124 m; uncertainty covers reconciliation and feature-versus-visitor placement. Six decimals are reproducibility only. |
| `004` 斜里 | Official annex centre `27°45′45.3″ N, 114°55′11.2″ E`, captured from the published protection-range row | Source datum unspecified; arithmetic DMS transcription only gives `[114.919777778, 27.762583333]`; no datum conversion has occurred | No datum-certified WGS84 coordinate is approved. A future generalized GeoJSON candidate could use the arithmetic transcription only with 500 m horizontal uncertainty and explicit qualification | Museum identity and the public annex corroborate the record, not the datum. The 500 m value is conservative, not a confidence interval. PR #69 exclusion remains until distinct generalized styling, persistent limitations, sensitivity approval, and the datum decision pass. |

No coordinate is recommended for any other row. `null` is intentional rather
than a missing table value.

## Existing five-Point baseline

All five production Points remain compatible with the controlling policy:

- identities, public meanings, coordinate sources, source CRSs, conversions or
  reconciliation, uncertainty, and sensitivity reviews remain documented;
- the four point-like buildings/compounds may permanently remain Points;
- Rongquan Bridge's Point is independently useful while a future, materially
  better line could supersede it;
- no contradictory evidence justifies a coordinate or metadata change;
- this audit does not create a footprint simply because a building could be
  drawn as an area.

## Xiabu conclusion

The evidence passes the ordinary-Point gate for the
`暴动举行地旧址` component only. The official parent relationship and plaque
text are explicit; Gaode and Baidu evidence reconcile within the adopted
150 m uncertainty; neither Chinese provider CRS is relabelled WGS84; public
visitor use and low sensitivity support publication; and
`component-reference-point` avoids claiming a footprint, entrance, legal
boundary, parent-designation location, or the separate meeting component.

The later PR #69 recommendation is one ordinary Point at
`[114.995570, 27.667620]`, subject to separate implementation approval and
persistent component/uncertainty wording. No Xiabu polygon, multipolygon,
building outline, offset construction, or simultaneous Point and shape is
recommended. Both Xiabu components remain unpublished in this PR.

## Xieli conclusion

The Phase 15C-7 misleading-risk result remains controlling:

- reject the former 60 × 60 m square;
- reject a broad uncertainty-area display;
- publish no Polygon;
- consider only a `generalized-reference-point` based on the published DMS
  centre, with 500 m uncertainty and explicit datum, footprint,
  archaeological-extent, and legal-boundary limitations;
- withhold if the presentation cannot keep those limitations visible.

Xieli is classified `ready-only-as-generalized-point` as a conditional research
finding, not an implementation-ready datum-certified coordinate. It is
**excluded from PR #69** because the current production presentation does not
yet provide the separately reviewed generalized symbol and persistent
limitation treatment required by Phase 15C-7. Datum confirmation, authority
GIS, or later interface work could reopen that routing. Xieli remains
unpublished.

## Summary counts and proposed later routing

Every count below is row-based and reconciles to 22:

- official register rows/components reviewed: **22**;
- distinct displayed designation names: **21**, with the source's `20处22点`
  wording preserved and parent/component caveats above;
- Xinyu rows with canonical machine records: **6**; without: **16**;
- rows with public-location decisions: **5**;
- existing production Points retained: **5**;
- proposed PR #69 ordinary Point candidates: **1** — 下保农民暴动旧址
  `暴动举行地旧址`;
- proposed PR #69 generalized Point candidates: **0**;
- `ready-to-publish-as-point`: **6** — five retained rows plus Xiabu component 1;
- `ready-only-as-generalized-point`: **1** — Xieli, conditional and excluded
  from PR #69;
- `needs-more-evidence`: **11** — 习凿齿墓, 飨褒堂, 尚睦邓家围垅屋,
  馀庆堂, 分宜钤岗上高会战中国军队阵亡将士陵园,
  中共分宜临时县委旧址, 儒延坊肃反委员会旧址,
  北伐军仰天岗战场遗址, 中共花桥党支部旧址,
  下保农民暴动旧址（暴动会议地旧址）, and
  渝水周家上高会战中国军队第十九集团军总司令部旧址;
- `withhold`: **4** — 棋盘山遗址, 袁州明代城墙砖窑址群（芦塘窑址）,
  彭家山遗址, and 打鼓岭遗址;
- deferred to non-Point research: **4** — 棋盘山遗址,
  袁州明代城墙砖窑址群（芦塘窑址）, 彭家山遗址, and
  北伐军仰天岗战场遗址;
- `futureNonPointRepresentation: unnecessary`: **14**;
- `potentially useful`: **1** — 蓉泉桥;
- `evidence required`: **5** — 棋盘山, 芦塘窑址, 彭家山,
  分宜钤岗陵园, and 仰天岗战场;
- `unsuitable at present`: **2** — 斜里 and 打鼓岭;
- PR #69 routing: **5 retain + 1 ordinary proposal + 0 generalized proposals
  + 4 non-Point deferrals + 12 exclusions = 22**.

The 11 `needs-more-evidence` rows remain withheld until their row-specific
gaps pass review. The four `withhold` rows have current sensitivity,
component-assignment, locality, or misleading-risk failures that make a
spatial publication unacceptable, not merely incomplete paperwork.

## Limitations, recovery, and rollback

- The official register is a display table, not a machine identity model; its
  `20处22点`, 22-row, and 21-name descriptions must remain distinct.
- Sixteen audit rows are not yet canonical machine records. This audit does not
  create IDs or source data for them.
- Provider evidence can move and does not become official merely because it is
  precise.
- Xieli's source datum remains unspecified.
- No authority GIS boundary was found or reused for the non-Point candidates.
- Future evidence can change a row classification only through a separately
  reviewed decision.

Before merge, rollback is closing this draft PR. If later merged, rollback is a
separate revert PR for its documentation-only merge commit. The starting
baseline is `main` commit
`b0091fc26ae1a8b076aac051c52cc8571478d7e1`. The four recovery stashes are
outside this work and must not be applied, dropped, or modified.

## Verification boundary

Verification for this audit must confirm row and summary reconciliation,
documentation links, clean Markdown/UTF-8/JSON parsing, the full existing test
suite, official publication validation, current generator checks, and a
byte-for-byte unchanged generated official GeoJSON. It must also confirm that
only documentation changed and that production still contains five Points and
zero lines or polygons.

Stop after opening the draft documentation PR. Do not publish the proposed
batch, merge this PR, deploy, or begin PR #69.
