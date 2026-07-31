# Phase 15C-6 - Official-record publication policy and Xinyu batch plan

## Outcome and stop point

This document is preserved as the historical Phase 15C-6 policy-development
and Xinyu batch-planning record. It applied the outcome model developed during
that phase to the complete Xinyu provincial register and proposed one future
implementation batch. The standalone
[official-record publication policy](../policy/official-record-publication-policy.md)
is now the controlling current authority. Nothing in this historical plan
overrides that policy or constitutes implementation approval.

Its former “Point plus shape now” outcome and multiple-active-representation
schema discussion are explicitly superseded. Current policy permits one active
public feature for each official record or separately resolved component
identity; a later approved line or area supersedes the active Point.

It does not add or publish the Xiabu Point. It does not change official source data, reviewed public-location decisions, generated GeoJSON, application code, tests, category mappings, Firebase, workflows, packages, or production behavior. Nothing in this document is implementation approval.

The complete review universe is the current official register's provincial section: **20处22点**, represented by 22 listed record/component rows. The identity count needs care. The rows contain 21 distinct designation names because 袁州明代城墙砖窑址群 is a cross-city parent represented in Xinyu only by its 芦塘 component; the second extra listed point is the second component of 下保农民暴动旧址. This audit therefore preserves the register's published `20处22点` wording, audits all 22 rows, and does not manufacture one unsupported “designation total” from the display table. The current machine aggregate remains narrower: 15 joined records, five published Points, and ten exclusions. Only one of the ten Phase 14 exclusions, 打鼓岭遗址, is a Xinyu record; the other nine Phase 14 records are outside Xinyu and are not batch candidates here.

The Phase 15C-6 review produced this historical future-batch recommendation:

1. **下保农民暴动旧址（暴动举行地旧址） - outcome B, proposed future Point candidate.** Preserve the provisional WGS84 Point `[114.995570, 27.667620]`, `horizontalUncertaintyMetres: 150`, and `geometryMeaning: component-reference-point`; do not implement or publish it without explicit approval.
2. **斜里遗址 - outcome C, proposed future shape candidate at the Phase 15C-6 stop point.** Preserve the published GPS centre and four 30-metre cardinal extensions as one explicitly project-created `generalized-reference-area`. This recommendation was subsequently rejected by the [Phase 15C-7 misleading-risk review](../audits/phase-15c-7-xieli-misleading-risk-review.md), which recommends only a separately approved generalized reference Point and retains withholding as the fallback.

This is a two-record batch, containing one new Point and one shape. It is smaller than the preferred three-to-eight new Points because no third unpublished Xinyu record currently has both a defensible public Point and a reproducibly reconciled WGS84 coordinate. The batch must not be padded with village centres, provider display centres, guessed centroids, or decorative geometry.

## Authoritative review scope and evidence baseline

Primary register:

- [新余市市级以上文物保护单位名录（2025年）](https://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml)
- issuing institution: 新余市文化广电旅游局;
- index number: `3605000013-2025-01167`;
- generated: 2025-12-26;
- provincial section: `省级文物保护单位（20处22点）`.

Principal supporting sources:

- [Xinyu Museum provincial-unit index](https://www.xysmuseum.com/list_22/);
- [public archival copy of the Jiangxi sixth-batch protection-range annex](https://commons.wikimedia.org/wiki/File%3A%E7%AC%AC%E5%85%AD%E6%89%B9%E6%B1%9F%E8%A5%BF%E7%9C%81%E6%96%87%E7%89%A9%E4%BF%9D%E6%8A%A4%E5%8D%95%E4%BD%8D%E4%BF%9D%E6%8A%A4%E8%8C%83%E5%9B%B4%E4%B8%80%E8%A7%88%E8%A1%A8.pdf), whose file record identifies the Jiangxi Provincial People's Government as author and preserves the original government-source references;
- existing reviewed production decisions in `data/official-protected-heritage-public-locations.json`;
- [the preserved Phase 15C-3 initial candidate audit](../audits/phase-15c-3-first-real-official-geometry.md);
- [the preserved Phase 15C-4 mixed-geometry re-audit](../audits/phase-15c-4-xinyu-mixed-geometry-reaudit.md);
- [the authoritative detailed Phase 15C-5 Xiabu evidence record](../audits/phase-15c-5-xiabu-geometry-pilot.md).

Provider evidence is supporting evidence, not official geometry. A failed or verification-blocked provider search is recorded as unverified, not as proof that a place is absent.

## Historical policy summary used by this audit

Phase 15C-6 assigned one of five outcomes to each designation or named
component: **A - Point now**, **B - Point now, shape later**, **C - Shape
now**, **D - Point plus shape now**, or **E - Withhold**. Its evidence gate
required resolved official identity and locality, an explicit representation
meaning, reproducible coordinates or shape construction, recorded CRS and
conversion, uncertainty and sensitivity review, and a finding that the map
would not imply more precision or legal authority than the evidence supported.

The review treated Points, lines, and areas as representations of a stable
record or component identity, not as additional official records. A component
could not stand in for its parent, and multiple representations would not
inflate record counts. The Phase 15C-6 schema assessment also recorded that
the existing one-feature-per-record publication pipeline would require stable
`representationId` and `representationRole` fields plus separate record and
representation counts before one identity could safely publish Point plus shape.

Those rules explain the historical table and batch below. Their reusable and
current form now lives only in the standalone
[official-record publication policy](../policy/official-record-publication-policy.md).
The standalone policy controls all future decisions, upgrades, provenance,
uncertainty, sensitivity, misleading-risk, and parent/component handling.

## Complete Xinyu provincial re-audit

Coordinate notation is GeoJSON order `[longitude, latitude]`. `null` means that no coordinate passed the publication gate. “Future shape” identifies the natural or plausible form, not approval to publish it.

| Register record or component | Category; locality | Natural form | Evidence, Point coordinate/source/conversion, and uncertainty | Future shape | Outcome | Sensitivity and exact remaining gap |
| --- | --- | --- | --- | --- | --- | --- |
| 1 棋盘山遗址 | 古遗址; 渝水区罗坊镇章塘村 | Large rectangular archaeological platform and settlement | Register plus [museum description](https://www.xysmuseum.com/591.html): platform 100 m north of the village, over 10,000 m², central 3,000 m², surrounding ditch. Point `null`; no provider coordinate passed; uncertainty `null`. | Polygon or MultiPolygon; generalized-reference-area unless the platform/ditch is georeferenced. | **E** | High archaeological sensitivity. Need a verified centre, source CRS, and georeferenced platform/ditch extent; a generic rectangle is prohibited. |
| 1 袁州明代城墙砖窑址群（芦塘窑址） | 古遗址; 分宜县分宜镇卢塘村 | Areal component within multipart kiln group | Register plus protection-range annex: Xinyu component is described by road, ditch, terrace, and reservoir embankment. Point `null`; uncertainty `null`. | Component Polygon; parent may later be MultiPolygon. | **E** | High sensitivity and component-assignment risk. Need a georeferenced component map identifying all four named edges; the separate 16-coordinate block belongs to other components. |
| 2 彭家山遗址 | 古遗址; 高新区水西村周家新村 | Archaeological area tied to an existing fence | Register, [museum description](https://www.xysmuseum.com/595.html), and annex offsets from the fence. Point `null`; uncertainty `null`. | Polygon after the fence is georeferenced. | **E** | High sensitivity. Need the protected fence footprint and CRS; offsets cannot be applied to an unidentified fence. |
| 3 斜里遗址, `6-1-040` | 古遗址; 渝水区珠珊镇洋津村 | Areal archaeological site | Annex GPS centre `27°45′45.3″ N, 114°55′11.2″ E`, arithmetically `[114.919777778, 27.762583333]`; source datum unstated, so no datum transform is claimed. [Museum description](https://www.xysmuseum.com/596.html) confirms identity and about 5,000 m². Proposed uncertainty 500 m. | One 60 m × 60 m project generalized reference square from ±30 m cardinal offsets. | **C** | High sensitivity, but the centre/rule are already public. Need final approval that the 500 m datum uncertainty does not make the 60 m square misleading; obtain datum confirmation if possible. |
| 4 习凿齿墓 | 古墓葬; 分宜县洞村乡早木山村 | Tomb, approach, and visitor/memorial context | Register plus public heritage description. Baidu UID `71d94b58947cd1dc4e776ea4` and address `分宜县洞村乡枣木山` corroborate identity; its detail URL display centre was **not** treated as the POI coordinate. Point `null`; uncertainty `null`. | Possible tomb footprint or memorial compound later. | **E** | Exact tomb location is sensitive despite public visitation. Need provider-supported POI coordinate extraction, BD-09→GCJ-02→WGS84 reconciliation, independent imagery check, and confirmation whether the pin is tomb, memorial hall, or entrance. |
| 5 飨褒堂 | 古建筑; 分宜县分宜镇介桥村 | Three-entry ancestral hall compound | [Museum description](https://www.xysmuseum.com/600.html) confirms a 22 m × 31 m, 682 m² hall. No stable exact provider POI was verified. Point `null`; uncertainty `null`. | Approximate building/compound Polygon after identification. | **E** | Low sensitivity. Need a stable provider or institutional map coordinate, source CRS, photograph/imagery identity match, and public entrance-versus-building meaning. |
| 6 尚睦邓家围垅屋 | 古建筑; 分宜县湖泽镇尚睦村 | Large enclosed residential compound | [Museum description](https://www.xysmuseum.com/594.html) confirms aliases, village centre, about 91.26 m × 45.38 m and 3,895 m². Point `null`; uncertainty `null`. | Approximate-compound Polygon after positive imagery match. | **E** | Low sensitivity and strong morphology. Need a stable provider coordinate/POI, WGS84 reconciliation, and positive match to the 99-room enclosure rather than the village. |
| 7 昼锦堂, `JX-XY-PCH-008` | 古建筑; 仙女湖区观巢镇汉泉村 | Hall/compound | Gaode `B0IRN5X33Z`, GCJ-02 `[114.845605, 27.851425]`; iterative inverse and locality review produced WGS84 `[114.840705, 27.854836]`; uncertainty 125 m; current meaning `visitor-reference-point`. | Approximate compound after perimeter identification. | **B** | Public exact/approximate display accepted. Existing Point stays unchanged; future gap is a georeferenced compound perimeter. |
| 8 蓉泉桥, `JX-XY-PCH-009` | 古建筑; 渝水区水北镇排江村 | Short east-west bridge | Gaode `B0JU95B3WN`, GCJ-02 `[115.052627, 28.070835]`; iterative inverse and context review produced WGS84 `[115.047377, 28.074011]`; uncertainty 75 m; current meaning `heritage-feature-point`. | Approximate-line only after endpoints/centre are materially more accurate than the 7.7 m bridge length. | **B** | Low sensitivity. Existing Point stays unchanged; current uncertainty is too large for a credible centreline and Point plus line would duplicate meaning. |
| 9 新余孔庙, `JX-XY-PCH-001` | 古建筑; 渝水区城南办事处魁星路 | Temple compound | Google mainland GCJ-02-like `[114.941361, 27.794748]` retained as provider evidence; selected named OpenStreetMap compound WGS84 reference `[114.937042, 27.798123]`; uncertainty 75 m; current project meaning maps to a compound reference. | Approximate-compound or reviewed boundary only with stronger perimeter provenance. | **B** | Low sensitivity. Existing Point stays unchanged; future shape needs a reviewed compound perimeter and must not imply an official boundary. |
| 10 馀庆堂 | 古建筑; 渝水区水北镇黄坑村 | Hall/compound | Register establishes identity/locality; no independently reconciled provider coordinate passed. Point `null`; uncertainty `null`. | Approximate building or compound Polygon after identification. | **E** | Low sensitivity. Need institutional description, stable provider POI/coordinate, source CRS conversion, and imagery/photo match; same-name risk is material. |
| 11 分宜钤岗上高会战中国军队阵亡将士陵园 | 近现代重要史迹; 分宜县钤山镇金鸡埔村 | Memorial cemetery/compound | Register establishes identity/locality; no reviewed entrance, memorial, cemetery centre, or reconciled provider coordinate passed. Point `null`; uncertainty `null`. | Approximate-compound or entrance Point plus cemetery area if independently supported. | **E** | Public memorial use likely, but exact representation meaning unresolved. Need stable visitor/entrance POI, institutional description, WGS84 reconciliation, and cemetery extent evidence. |
| 12 中共分宜临时县委旧址 | 近现代重要史迹; 分宜县钤山镇田心村 | Building/site | Register establishes identity/locality; no stable component-specific public Point was verified. Point `null`; uncertainty `null`. | Building footprint later. | **E** | Low sensitivity. Need independent building identity, provider coordinate and CRS, photograph/plaque match, and distinction from other Tianxin revolutionary sites. |
| 13 儒延坊肃反委员会旧址 | 近现代重要史迹; 分宜县钤山镇田心村 | Building/site | Register establishes identity/locality; no stable component-specific public Point was verified. Point `null`; uncertainty `null`. | Building footprint later. | **E** | Low sensitivity but high same-locality confusion risk. Need plaque/building identity, provider coordinate and conversion, and separation from the temporary county committee site. |
| 14 傅抱石故居, `JX-XY-PCH-014` | 近现代重要史迹; 渝水区罗坊镇章塘村 | Former residence/visitor venue | Gaode `B0FFJ6C27Y`, GCJ-02 `[115.098417, 27.908861]`; iterative inverse and context review produced WGS84 `[115.093120, 27.911966]`; uncertainty 100 m; current meaning `visitor-reference-point`. | Approximate building or compound footprint after positive identification. | **B** | Low sensitivity. Existing Point stays unchanged; future gap is a protected-residence footprint distinct from the visitor venue. |
| 15 北伐军仰天岗战场遗址, `6-5-318` | 近现代重要史迹; 仙女湖区城北办事处 | Dispersed battlefield, about 3,000 m × 100 m | Annex describes Liangshannao to Gouxiongpo, trenches, shelters, craters, and 300,000 m². General Yangtiangang POIs do not establish battlefield endpoints. Point `null`; uncertainty `null`. | Elongated generalized-reference-area, not a guessed line. | **E** | Moderate sensitivity and high interpretive value. Need georeferenced endpoints or an institutional battlefield map and distinction from memorial/education facilities. |
| 16 上海劳动妇女战地服务团旧址, `JX-XY-PCH-016` | 近现代重要史迹; 渝水区珠珊镇沙头村 | Former-site building/visitor venue | Gaode `B0IATLWGUH`, current GCJ-02 `[114.977746, 27.770564]`; iterative inverse and context review produced WGS84 `[114.972780, 27.773914]`; uncertainty 100 m; current meaning `visitor-reference-point`. | Building/compound footprint after positive protected-fabric identification. | **B** | Low sensitivity. Existing Point stays unchanged; future gap is visitor venue versus protected building/compound identity. |
| 17 中共花桥党支部旧址 | 近现代重要史迹; 仙女湖区九龙山乡塔前分场 | Building/site | Register establishes identity/locality; no stable provider coordinate or independent building evidence passed. Point `null`; uncertainty `null`. | Building footprint later. | **E** | Low sensitivity. Need institutional identity, plaque/photo match, provider coordinate/CRS conversion, and current-building confirmation. |
| 18 下保农民暴动旧址——暴动举行地旧址, `6-5-321` component 1 | 近现代重要史迹; 渝水区良山镇下保村 | Protected structure within visitor compound | Gaode `B0L1RCC3EM` GCJ-02 `[114.999665, 27.665090]` → WGS84 `[114.994632317, 27.668364844]`; Baidu UID `ba0c8d3a43ce938b13293507` BD-09 `[115.007145335, 27.670165011]` → GCJ-02 → WGS84 `[114.995569672, 27.667620470]`; selected rounded Point `[114.995570, 27.667620]`; uncertainty 150 m; plaque reads `下保农民暴动旧址（暴动举行地）`. | Protected-building footprint or Point plus shape only after the building is georeferenced. | **B** | Low sensitivity/public visitor use. Point meaning is `component-reference-point`. Need final coordinate approval and correct walls/eaves; 283.2 m² rule cannot be constructed from area/offsets alone. |
| 18 下保农民暴动旧址——暴动会议地旧址, `6-5-321` component 2 | 近现代重要史迹; 渝水区良山镇下保村 | Separate protected building/component | Official register and annex identify the component and a 110.6 m² protection rule. No provider evidence reviewed to date links a Point or photographed building specifically to 暴动会议地. Point `null`; uncertainty `null`. | Building Polygon after component-specific georeferencing. | **E** | Low sensitivity but serious component-confusion risk. Need component-specific plaque/photo, coordinate, building identity, and walls before applying offsets. |
| 19 打鼓岭遗址, `JX-PCH-7-001` | 古遗址; register says 渝水区罗坊镇周家村; earlier source says 竹山村坑口组 | Palaeolithic hill-slope site | Existing research reports the site about 500 m east of Kengkou village but supplies no origin, bearing, coordinate, or CRS. The locality wording conflict must be reconciled. Point `null`; uncertainty `null`. | Uncertainty area only after a verified centre and sensitivity decision. | **E** | Very high archaeological and false-match risk. Need reconciliation of current/earlier official locality, record-specific coordinate or surveyed plan, and public-location sensitivity approval. |
| 20 渝水周家上高会战中国军队第十九集团军总司令部旧址 | 近现代重要史迹; 渝水区珠珊镇潭口村 | Building/compound | Register establishes identity/locality; no stable provider coordinate or building-level independent evidence passed. Point `null`; uncertainty `null`. | Building/compound footprint later. | **E** | Low sensitivity. Need independent identity, plaque/photo match, provider coordinate and conversion, and distinction from other Shanggao Campaign sites. |

### Audit totals

- official register scope: `省级文物保护单位（20处22点）`;
- 22 audited record/component rows;
- 21 distinct designation names in those rows because the Xinyu 芦塘 component belongs to a cross-city parent;
- five already published Points: all retain outcome B because a later distinct or replacement shape remains plausible;
- one new outcome-B Point candidate: Xiabu component 1;
- one outcome-C shape candidate: Xieli;
- 15 withheld designation/component rows;
- no outcome-D Point-plus-shape candidate;
- no Polygon, MultiPolygon, or Point-plus-shape recommendation for Xiabu.

## Xiabu worked example

### Identity result

Gaode and Baidu independently corroborate the heritage name and locality. The Baidu photograph contains an official plaque transcribed as:

> 江西省文物保护单位
>
> 下保农民暴动旧址
>
> （暴动举行地）

That parenthetical text directly connects the photographed POI with the specific component 暴动举行地旧址. It substantially resolves component identity, locality identity, public heritage-site identity, and the POI-to-component connection.

It does not resolve whether either provider pin is at the plaque, entrance, visitor compound, protected building, or broader scenic site.

### Coordinate reconciliation

| Source | Original coordinate and capture | Deterministic WGS84 result | Role |
| --- | --- | --- | --- |
| Gaode `B0L1RCC3EM` | GCJ-02 `[114.999665, 27.665090]`, captured from the provider page's POI-labelled analytics request | `[114.994632317, 27.668364844]` | Strong provider reference |
| Baidu `ba0c8d3a43ce938b13293507` | provider-owned Baidu Mercator `poi_x=12802676.16`, `poi_y=3187429.36`; decoded BD-09 `[115.007145335, 27.670165011]` | BD-09 → GCJ-02 `[115.000605641, 27.664348519]` → WGS84 `[114.995569672, 27.667620470]` | Selected component-associated reference because the POI album supplies the plaque |
| Google `/g/11rv5w51q9` | stable URL literal WGS84-like `[115.000540, 27.663880]` | unchanged | Lower-weight whole-designation/scenic-site comparison |

Pairwise WGS84 distances:

- Gaode-derived to Baidu-derived: 124.0 m;
- Gaode-derived to Google: 766.3 m;
- Baidu-derived to Google: 642.3 m;
- three-source cluster spread: 766.3 m.

The displacement can reflect entrance-versus-feature placement, visitor-compound versus broader scenic-site meaning, provider offsets, or pin-placement differences. The Point is not an arithmetic average. The Baidu-derived coordinate is selected because Baidu supplies the strongest component-specific semantic evidence.

### Publication meaning and decision

- WGS84: `[114.995570, 27.667620]`;
- `horizontalUncertaintyMetres: 150`;
- meaning: `component-reference-point`;
- outcome: **B - Point now, shape later**;
- status: provisional, not implemented.

Required popup meaning:

> This Point identifies the publicly mapped location associated with the 暴动举行地 component of 下保农民暴动旧址. It does not represent the protected building footprint, a building centroid, the courtyard or compound extent, or the legal protection boundary.

The annex defines east/west walls, north/south eave drip lines, offsets, and a 283.2 m² protection area. It does not identify the correct building in georeferenced evidence. The rule therefore cannot be spatially constructed. Do not publish a Polygon, MultiPolygon, Point plus shape, or trace from visible parcel/building outlines.

## Historical recommended first publication batch

### Proposed future batch candidates at the Phase 15C-6 stop point

| Record | Exact future representation | Coordinate or draft geometry | Meaning, precision, uncertainty | Provenance and category | Popup caution | Strength and implementation risk |
| --- | --- | --- | --- | --- | --- | --- |
| 下保农民暴动旧址——暴动举行地旧址 | One Point only | WGS84 `[114.995570, 27.667620]`; no averaging | `component-reference-point`; approximate; 150 m | Official register and annex; Gaode `B0L1RCC3EM`; Baidu `ba0c8d3a43ce938b13293507` and plaque; Google comparison; 近现代重要史迹 | Publicly mapped component-associated location, not building footprint, centroid, compound, or legal boundary | Strong component identity, medium spatial precision. Moderate risk: new stable component identity and vocabulary must be added without publishing the parent or component 2. |
| 斜里遗址 | One Polygon only | Draft ring: `[[114.919473225,27.762313838],[114.920082331,27.762313838],[114.920082331,27.762852828],[114.919473225,27.762852828],[114.919473225,27.762313838]]` | `generalized-reference-area`; generalized; 500 m | Official protection-range centre/rule; museum identity; 古遗址 | Project-created reference geometry, not an official legal boundary; source datum is unstated | Strong reproducibility, deliberately low positional claim. Moderate-to-high risk: implementation review must reject it if the uncertainty/shape relationship is misleading. |

Batch rules:

- do not add a Xiabu Polygon or component-2 Point;
- do not add a Xieli centre Point;
- do not count the two representations as more than two official component/record identities;
- if Xieli fails final misleading-risk review, reduce the batch to Xiabu only rather than replacing it with a weaker candidate.

The later Phase 15C-7 review did reject the Xieli shape on misleading-risk
grounds. This table remains unchanged as the Phase 15C-6 proposal; it is not a
current implementation recommendation.

### Reserve candidates needing one more evidence cycle

| Candidate | Preferred future outcome | One required evidence cycle |
| --- | --- | --- |
| 习凿齿墓 | B - visitor- or entrance-reference Point now, footprint later | Extract the exact provider-owned BD-09 POI coordinate for UID `71d94b58947cd1dc4e776ea4`, convert and compare it, then establish whether the pin is the tomb, entrance, or memorial hall and approve sensitivity. |
| 飨褒堂 | B - visitor-reference Point now, compound later | Capture a stable provider/institutional coordinate with CRS and positively match it to the 22 m × 31 m hall. |
| 尚睦邓家围垅屋 | B - visitor-reference Point now, approximate compound later | Capture and reconcile a stable POI, then match the pin and imagery to the distinctive 91.26 m × 45.38 m enclosure. |
| 馀庆堂 | B - Point now, shape later | Obtain an independent institutional description and stable exact-name provider coordinate; resolve same-name risk before conversion. |
| 分宜钤岗上高会战中国军队阵亡将士陵园 | B or D | Establish an official visitor entrance or memorial Point and independently mapped cemetery extent; keep entrance and area meanings separate. |

These reserve records do not meet the proposed-batch gate. “One more evidence cycle” can still end in outcome E.

### Withheld candidates

All remaining E-class rows stay withheld: 棋盘山, 芦塘, 彭家山, both Tianxin revolutionary sites, Yangtiangang battlefield, 花桥党支部旧址, Xiabu component 2, 打鼓岭, 周家第十九集团军总司令部旧址, and any reserve candidate that fails its next check.

## Future implementation sequence

No step below is authorized by this document.

1. Obtain explicit approval of this policy and the two-record batch.
2. Add official source records for the approved records without changing source facts.
3. Introduce the minimal identity/representation schema extension only if a record receives multiple representations; otherwise retain one feature per record.
4. Add Xiabu component 1 as a separately identified component Point, preserving all provider coordinates and conversions.
5. Reconstruct Xieli from the source DMS centre and ±30 m rule in a local metric method; preserve the unstated datum and test the ring.
6. Validate record/component counts separately from representation counts.
7. Generate output deterministically and review popup/accessibility wording.
8. Run unit, generator, browser, scope, stale-output, coordinate, geometry, and production smoke checks.
9. Open a separate draft implementation PR only after explicit approval.

## Exact remaining evidence gaps

- **Xiabu component 1:** final coordinate approval; georeferenced protected walls and eaves before any shape.
- **Xiabu component 2:** component-specific identity, coordinate, plaque/photo, and building footprint.
- **Xieli:** source datum and final misleading-risk acceptance.
- **Qipanshan:** verified centre, CRS, and platform/ditch extent.
- **Lütang:** component map and all named boundary edges.
- **Pengjiashan:** fence footprint and CRS.
- **Yangtiangang:** georeferenced battlefield endpoints/extent and memorial-versus-battlefield distinction.
- **Dagu Ling:** locality reconciliation, record-specific coordinate or plan, and sensitivity approval.
- **Rongquan Bridge:** sub-bridge accuracy before any 7.7 m line.
- **all unpublished buildings/tombs/memorials:** stable provider or institutional coordinate, source CRS, deterministic conversion, independent identity/locality confirmation, exact Point meaning, uncertainty, and sensitivity approval.

## Production and rollback statement

Production remains unchanged:

- five official Point records;
- no real line, polygon, area, or other non-Point official geometry;
- official layer off by default;
- no official-record count inflation;
- no application, community, Search, Filters, category-control, Firebase, workflow, or package change.

Rollback for this phase is documentation-only: remove this file. No data regeneration, application rollback, deployment rollback, or production record change is required.

Do not implement or publish Xiabu or Xieli, stage, commit, push, open a pull
request, or begin a production batch without explicit approval.
