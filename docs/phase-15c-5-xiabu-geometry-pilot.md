# Phase 15C-5 - Xiabu Uprising-Location Geometry Pilot

## Outcome

This one-record audit concerns only:

- official record: 下保农民暴动旧址;
- component: 暴动举行地旧址;
- record number: `6-5-321`;
- category: 近现代重要史迹;
- locality: 江西省新余市渝水区良山镇下保村.

**Final recommendation: provisional Point only, pending coordinate reconciliation review and final approval.**

The new Gaode and Baidu evidence substantially resolves the component identity, locality identity, public heritage-site identity, and the connection between the mapped POI and 暴动举行地. In particular, the photograph attached to the Baidu POI shows an official plaque naming 下保农民暴动旧址（暴动举行地）. That parenthetical component name directly connects the photographed place with the official component 暴动举行地旧址.

The recommended Point is a `component-reference-point`: it identifies the publicly mapped location associated with 暴动举行地. It does not represent the protected building footprint, a surveyed building centroid, courtyard or compound extent, or the legal protection boundary.

No KML, KMZ, draft GeoJSON, Polygon, or MultiPolygon was created. The available evidence still does not establish the protected building walls, north/south eave drip lines, courtyard extent, compound boundary, or whether a provider pin is at the plaque, an entrance, the visitor compound, the protected building, or the broader scenic site. The official 283.2 m² protection rule therefore cannot yet be spatially constructed.

This audit changes no production source data, public-location decision, generated GeoJSON, application code, test, or live-map behavior.

This document is the authoritative detailed Xiabu evidence record. [Phase 15C-6](./phase-15c-6-official-record-publication-policy-and-batch-plan.md) controls the current publication policy and proposed future batch; neither document approves implementation or publication.

## Official-source verification

### Current Xinyu register

- Page title: 新余市市级以上文物保护单位名录（2025年）
- Publication/generation date: 2025-12-26
- Issuing institution: 新余市文化广电旅游局
- Index number: `3605000013-2025-01167`
- Page validity: 有效
- File number: none displayed
- Official level and sequence: 省级文物保护单位（20处22点）, item 18
- Exact component row: `18 下保农民暴动旧址——暴动举行地旧址 近现代重要史迹 渝水区良山镇下保村`
- Immediately following component row: `下保农民暴动旧址——暴动会议地旧址 近现代重要史迹 渝水区良山镇下保村`

Source: <https://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml>

The page is a register table. It supplies no component description, protection-range text, photograph, map, diagram, plan, coordinate, building dimension, courtyard description, road/path association, or attachment. The row alone cannot support a boundary.

### Sixth-batch designation and protection range

The sixth-batch designation identifies:

- number: `6-5-321`;
- name: 下保农民暴动旧址;
- date: 1929;
- locality: 新余市渝水区;
- components: 暴动举行地旧址 and 暴动会议地旧址.

The separate protection-range annex records item 619 at 新余市渝水区良山镇下保村. For the component audited here, it states:

> 暴动举行地旧址：构筑物体东、西两面以墙体为界，南、北面以瓦檐滴水点为界，东向外延伸4米，南向外延伸5米，西向外延伸4米，北向外延伸5米。面积：283.2平方米。

The second component has a different rule and area:

> 暴动会议地旧址：以文物本体为界，东向外延伸3米，南向外延伸0.7米，西向外延伸2米，北向外延伸1米。面积：110.6平方米。

Protection-range notice: 江西省人民政府关于公布第六批江西省文物保护单位保护范围的通知, `赣府字〔2019〕18号`, dated 2019-03-07.

Sources:

- Historical original government page, now unavailable: `https://www.jiangxi.gov.cn/art/2019/3/15/art_5296_668434.html`
- [Public archival copy](https://commons.wikimedia.org/wiki/File%3A%E7%AC%AC%E5%85%AD%E6%89%B9%E6%B1%9F%E8%A5%BF%E7%9C%81%E6%96%87%E7%89%A9%E4%BF%9D%E6%8A%A4%E5%8D%95%E4%BD%8D%E4%BF%9D%E6%8A%A4%E8%8C%83%E5%9B%B4%E4%B8%80%E8%A7%88%E8%A1%A8.pdf)

The annex proves that the audited component has a physical building body and a defined legal protection-range construction rule. It does not provide a coordinate, cadastral reference, footprint vertices, plan, photograph, or georeferenced map. The area total cannot be inverted into a unique building shape, dimensions, orientation, or position.

## Gaode review

The user-supplied Gaode evidence preserves:

- stable POI ID: `B0L1RCC3EM`;
- supplied POI name: 下保农民暴动旧址;
- category: 文物古迹;
- supplied address: 新余市渝水区171乡道;
- locality context including 下保村民委员会 and 171乡道;
- original provider URL: <https://gaode.com/place/B0L1RCC3EM>.

The original Gaode coordinate was captured from the POI page's own observed analytics request after activating the unique “去这里” destination control. The request records `poi_id=B0L1RCC3EM` and `poi_lnglat=114.999665,27.665090`. That value is preserved as GCJ-02:

`[114.999665, 27.665090]` GCJ-02.

The same page made a reverse-geocode request at `[114.999665, 27.665124]`; the 3.8-metre latitude-only difference is consistent with display or map-centre rounding. The explicitly POI-labelled analytics value is used for conversion.

The provider page's direct detail endpoints were also tested, but automated requests were intercepted by Gaode's verification system. No CAPTCHA was solved or bypassed. The successful page rendering, stable ID, visible POI card, and observed provider request are the capture basis.

During the later live recheck, the rendered legacy card omitted 农 from the displayed name and showed 74乡道, unlike the user-supplied screenshot. This provider-display inconsistency is retained as a non-blocking caution because the stable POI ID and coordinate request remained consistent and Baidu independently supplies the exact name, 171乡道 address, and component plaque.

## Baidu review

The user-supplied Baidu evidence preserves:

- stable UID: `ba0c8d3a43ce938b13293507`;
- exact name: 下保农民暴动旧址;
- category: 革命遗址;
- address: 江西省新余市渝水区171乡道;
- original provider URL: <https://map.baidu.com/poi/%E4%B8%8B%E4%BF%9D%E5%86%9C%E6%B0%91%E6%9A%B4%E5%8A%A8%E6%97%A7%E5%9D%80/@12802662.75612793,3187436.2750168843,21z?uid=ba0c8d3a43ce938b13293507&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&en_uid=ba0c8d3a43ce938b13293507&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl>;
- provider short link captured from the rendered detail card: <https://j.map.baidu.com/t/NGXr3t>.

The POI album contains a close photograph of an official plaque. Its relevant transcription is:

> 江西省文物保护单位
>
> 下保农民暴动旧址
>
> （暴动举行地）
>
> 江西省人民政府
>
> 二〇一八年三月公布
>
> 新余市人民政府 立

The plaque directly links the photographed public heritage place with 暴动举行地 and therefore with the official component 暴动举行地旧址. The album attachment does not prove that the POI pin is exactly at the plaque or the protected building.

The Baidu URL's `@12802662.75612793,3187436.2750168843` values are map-display centre values. They were not treated as longitude and latitude. The provider page's observed asset request separately records `poi_x=12802676.16` and `poi_y=3187429.36` together with the same UID and POI name. Those provider-owned Baidu Mercator values were decoded to:

`[115.007145335, 27.670165011]` BD-09.

The close-scale map shows multiple building footprints and nearby labels, but those cartographic outlines are not an official component plan and are not accepted as trace sources.

## Google Maps review

### Exact-name results

- `下保农民暴动旧址`: no direct Chinese exact-name result.
- `暴动举行地旧址`: no direct component result.
- Locality search `下保村 良山镇 新余`: two village/locality results near `[115.00153, 27.66619]` and `[115.00124, 27.6655599]`.
- Visible mapped heritage label: `Xiabao Riot Former Site` / `下保暴动旧址`.

The mapped heritage result records:

- Google Maps category: Scenic spot;
- displayed address: `M272+H63, Yushui District, Xinyu, Jiangxi, China, 331406`;
- WGS84-like coordinate from the stable place URL: `[115.00054, 27.66388]`;
- reviews: none displayed;
- place photographs: none displayed;
- stable Google place token: `/g/11rv5w51q9`.

Direct place URL:

<https://www.google.com/maps/place/Xiabao+Riot+Former+Site/@27.66388,115.00054,761m/data=!3m1!1e3!4m10!1m2!2m1!1sXiabao+Riot+Former+Site!3m6!1s0x34237be03f47efb5:0x756f16d56079641!8m2!3d27.66388!4d115.00054!15sChdYaWFiYW8gUmlvdCBGb3JtZXIgU2l0ZZIBC3NjZW5pY19zcG904AEA!16s%2Fg%2F11rv5w51q9>

### Standard and satellite interpretation

The whole-designation Point is approximately 275 metres south of the Google village-centre result. It lies inside a wooded tourism landscape near looping local roads and paths. At the close satellite scale, tree canopy obscures the Point and no roof, wall, courtyard, gate, memorial, or compound edge can be confidently associated with the pin.

Visible surrounding context includes:

- forest canopy;
- a loop of local access roads/paths;
- agricultural or nursery structures northwest of the Point;
- cleared or terraced ground southeast of the Point;
- the Xiabao village committee farther north;
- no mapped component label for 暴动举行地旧址;
- no mapped second-component label for 暴动会议地旧址.

The map's imagery credit displayed Airbus, CNES/Airbus, Landsat/Copernicus, and Maxar Technologies depending on scale. Google Maps did not expose an acquisition date. No Street View, photo path, or photo sphere covering the component was identified. The generic whole-designation pin cannot be treated as a building centroid or boundary.

## Google Earth review

Google Earth Web was inspected in a near-vertical top-down view around `[115.00054, 27.66388]`.

- Useful displayed imagery date: 2025-11-23.
- Camera context recorded during inspection: approximately 1,000 metres camera distance with a 100-metre scale bar.
- The imagery label and terrain context agreed with the Google Maps whole-designation Point.
- The Point remained under dense canopy.
- No component-specific building footprint, wall line, courtyard, compound enclosure, memorial platform, or entrance could be isolated.
- The surrounding loop roads, forest edge, nursery/agricultural grids, and cleared slopes were visible but were not identified by an official source as part of the heritage component.
- No within-scene imagery-date change was displayed.

The available web session did not expose a usable historical-imagery sequence for this location. No additional historical dates, demolition, reconstruction, expansion, or footprint-change conclusion is claimed.

## Photographs and identity matching

The Baidu plaque photograph is the strongest component-specific identity evidence reviewed in this pilot. Its `(暴动举行地)` text directly distinguishes the audited component from the separately designated 暴动会议地旧址. It supports a component-associated reference Point but supplies no geotag, camera direction, surveyed placement, footprint, or legal-boundary vertices.

Public tourism material includes a photograph captioned in the 下保农民暴动旧址 section. It shows a formal walled entrance with a tiled gate, a paved approach or courtyard, and buildings behind it:

<https://q1.itc.cn/q_70/images03/20241116/c7d50b6658d347db83ef2fb60ec68bdb.jpeg>

Article context:

<https://www.sohu.com/a/827342378_121117465>

The same article separately describes 下保革命斗争陈列馆, so it does not prove that the photographed entrance or every building behind it is the 暴动举行地旧址 component. The photograph supplies no coordinate, direction, plan, component sign readable at the reviewed resolution, or overhead matching feature.

A recent university report describes visitors entering the old site and village-history/exhibition spaces and shows interior historic displays. Those photographs confirm active public interpretation and surviving historic material, but do not distinguish the two official components or geolocate the audited building:

<https://www.jxue.edu.cn/2026/0708/c21a47452/page.htm>

Together, the photographs now support component identity and public visitor use. They still do not support a reproducible component footprint.

## Candidate footprint and edge analysis

| Candidate edge or feature | Evidence | Decision | Reason |
| --- | --- | --- | --- |
| East and west walls of the component building | Protection-range annex | Accept as the authoritative boundary rule in principle; not traceable now | No reviewed source identifies which visible wall belongs to the audited component. |
| North and south eave drip lines | Protection-range annex | Accept as the authoritative boundary rule in principle; not traceable now | Tree canopy and missing component-specific plan/photograph prevent location. |
| 4 m east/west and 5 m north/south offsets | Protection-range annex | Do not construct yet | Offsets require a known, georeferenced building body; the 283.2 m² total does not determine it. |
| Formal gate and walled compound in tourism photograph | Tourism article photograph | Reject as a polygon source | The photograph is designation-level and may show an entrance, reconstructed visitor compound, exhibition venue, one component, or several features. |
| Gaode POI `B0L1RCC3EM` | Gaode | Accept as a component-associated provider reference | Stable ID, heritage classification, locality context, and a captured original GCJ-02 coordinate; exact pin meaning remains undocumented. |
| Baidu POI `ba0c8d3a43ce938b13293507` | Baidu | Select as the provisional component reference | Exact name, address, revolutionary-site classification, provider-owned coordinate state, and a plaque photograph explicitly naming 暴动举行地. |
| Google whole-designation Point | Google Maps | Retain as a lower-weight whole-designation/scenic-site comparison | The literal URL coordinate is materially displaced and the pin does not distinguish component, entrance, memorial, building, or designation centroid. |
| Baidu-rendered building footprints | Baidu | Reject as a polygon source | Provider cartography is not an official component plan and multiple visible buildings cannot be assigned to the audited component. |
| Looping roads and paths around the Google Point | Google Maps and Google Earth | Reject | No official or institutional source associates the road loop with the component boundary. |
| Forest/vegetation edge | Google Maps and Google Earth | Reject | Vegetation colour and canopy are not heritage identity evidence. |
| Cleared or terraced ground southeast of the Point | Google Maps and Google Earth | Reject | Modern land disturbance has no documented relationship to the component. |
| Village-centre pins | Google Maps | Reject | They represent the locality, not the heritage component. |

## Reproducibility test

Two independent reviewers using the same sources could reproduce:

- the official record and component identity;
- the locality;
- the legal construction rule once the correct building body is supplied;
- the Gaode and Baidu POI identifiers and original coordinate captures;
- the deterministic coordinate conversions;
- the selected provisional component-reference Point.

They could not independently select the same component building or draw approximately the same roof, wall, courtyard, compound, or protection-range geometry. The reproducibility test passes for a provisional Point with explicit uncertainty and fails for Polygon, MultiPolygon, Point plus Shape, and uncertainty-area construction.

## Representation assessment

### Point only

Selected provisionally. `component-reference-point` is the most accurate available meaning. It is narrower than `visitor-reference-point` because the plaque connects the evidence to 暴动举行地, but it does not claim the precision implied by `protected-building-centroid`, `approximate-heritage-feature`, or `entrance-reference-point`.

### Polygon

Not supported. The annex supplies a rule but no georeferenced body. Imagery does not reveal an independently identifiable component footprint.

### MultiPolygon

Not supported for this task. The official designation has two components, but this pilot covers only 暴动举行地旧址. Combining both would exceed scope, and neither footprint is independently georeferenced.

### Point plus Polygon or MultiPolygon

Not supported. No verified visitor entrance or memorial Point has been distinguished from a component shape.

### Uncertainty area

Not recommended. A broad circle or polygon around the whole-designation Point would not communicate the annex's building-relative meaning and could include unrelated forest, roads, tourism facilities, or the second component.

### Withhold

Not selected after the new evidence. Identity is now strong enough for a conservative component-reference Point, subject to final approval.

## CRS and uncertainty assessment

### Deterministic transformations

The conversion sequence is fully deterministic:

1. Decode the Baidu Mercator pair with the standard piecewise Baidu Mercator-to-BD-09 inverse polynomial. The coefficient band for `|y|=3187429.36` is the `1678043.12` band.
2. Convert BD-09 to GCJ-02 with the standard polar correction using `x_pi = π × 3000 / 180`.
3. Convert each GCJ-02 coordinate to WGS84 with the repository-established iterative inverse: Krasovsky 1940 constants `a=6378245.0` and `ee=0.00669342162296594323`, with ten forward-transform residual-correction iterations.
4. Calculate distances with the haversine formula and mean Earth radius `6371008.8` metres.

The ten-iteration forward residuals were below `0.000000002` metres for both converted provider points.

### Coordinate results

| Provider and capture method | Original coordinate | Deterministic WGS84 result |
| --- | --- | --- |
| Gaode `B0L1RCC3EM`; POI-labelled analytics request after the unique destination action | GCJ-02 `[114.999665, 27.665090]` | `[114.994632317, 27.668364844]` |
| Baidu UID `ba0c8d3a43ce938b13293507`; provider asset request `poi_x=12802676.16`, `poi_y=3187429.36` | Baidu Mercator `[12802676.16, 3187429.36]`; decoded BD-09 `[115.007145335, 27.670165011]`; intermediate GCJ-02 `[115.000605641, 27.664348519]` | `[114.995569672, 27.667620470]` |
| Google `/g/11rv5w51q9`; literal stable-place URL coordinate | WGS84-like `[115.000540, 27.663880]` | `[115.000540, 27.663880]` retained literally; no datum relabelling or extra conversion |

The Google value is described as WGS84-like because it is exposed in a stable URL but is not a surveyed coordinate and the reviewed source does not state a datum for the literal value.

### Distance comparison and interpretation

| Pair | Distance |
| --- | ---: |
| Gaode-derived WGS84 to Baidu-derived WGS84 | 124.0 m |
| Gaode-derived WGS84 to literal Google WGS84-like coordinate | 766.3 m |
| Baidu-derived WGS84 to literal Google WGS84-like coordinate | 642.3 m |

The strict three-provider maximum pairwise spread is 766.3 metres. The two independently extracted mainland-provider component-associated points form a 124.0-metre cluster. The Google pin is a lower-weight whole-designation/scenic-place reference and may represent a different entrance, visitor feature, map-label placement, or broader scenic site. A datum or provider-display difference is also possible, but no undocumented correction is applied to force agreement.

No three-point average is used. A simple average would combine sources with different semantics and would place the result at no evidenced feature. The provisional selected Point is the Baidu-derived WGS84 coordinate:

`[114.995570, 27.667620]`.

Baidu is selected because its stable UID, exact name and address, close-scale POI placement, and attached official plaque provide the strongest direct connection to 暴动举行地. The selected Point remains a provider-derived component reference, not a protected-building centroid.

Recommended `horizontalUncertaintyMetres`: **150**. This conservatively covers the 124.0-metre Gaode/Baidu separation with rounding allowance. It intentionally does not expand to include the semantically different Google scenic-site pin; doing so would misrepresent the selected Point's component-reference meaning.

The remaining uncertainty is chiefly semantic:

- plaque, entrance, visitor compound, protected building, or scenic-site pin placement;
- protected building versus modern visitor or exhibition facility;
- canopy-obscured building body;
- no component plan, surveyed coordinate, or georeferenced official photograph;
- provider record inconsistencies and possible provider offset or pin-placement differences.

An apparent 10-20-metre building polygon would therefore be misleading.

## Sensitivity and public-use assessment

- Archaeological sensitivity: low relative to buried archaeological sites.
- Residential/privacy risk: unresolved; the historic component may adjoin or include occupied village fabric.
- Public visitor value: high; the designation is promoted as a red-tourism and education destination.
- Access status: public interpretation is documented, but exact access rights and opening arrangements for this component are not.
- Trespass risk: moderate if a precise shape directs users to a building that is private, occupied, closed, or misidentified.
- Safety risk: ordinary rural access and forest/tourism-road conditions; no special assurance was found.
- Vulnerable-remains exposure: low, but inaccurate exact geometry could burden residents or misdirect visitors.

Withholding any component shape avoids implying public access or a legal boundary. A 150-metre component-reference Point remains intentionally approximate.

## Misleading-risk review

- **Does a shape look more precise than the evidence?** Yes.
- **Could users mistake it for a legal protection boundary?** Yes, especially because the annex supplies exact offsets but the starting building is unidentified.
- **Would it trace a modern parcel rather than the historic place?** Likely if derived from visible roads, vegetation, or a photographed compound.
- **Does the mapped Point represent the whole designation or only this component?** The plaque substantially links the POI evidence to this component, but exact pin placement remains unresolved.
- **Would a Point be more honest?** Yes, as a conservative component-reference Point with 150-metre uncertainty.
- **Would an uncertainty area be more honest?** No. It would blur the two official components and unrelated tourism land.
- **Would no publication be more honest?** No longer necessary for identity reasons, although final approval remains required.

## Draft geometry metadata

No geometry file was created. The following values are a provisional publication recommendation only.

Research candidate record:

| Field | Value |
| --- | --- |
| `recordId` | `6-5-321` |
| Official record name | 下保农民暴动旧址 |
| Component | 暴动举行地旧址 |
| Geometry type | Point only |
| Recommended WGS84 coordinate | `[114.995570, 27.667620]` |
| Candidate map reference | Baidu UID `ba0c8d3a43ce938b13293507`, reconciled against Gaode POI `B0L1RCC3EM` and the Google whole-designation comparison |
| Candidate meaning | `component-reference-point` |
| Candidate precision | approximate public map-provider reference |
| Candidate source type | third-party map-provider POI |
| Original CRS | Baidu Mercator decoded to BD-09; independent Gaode comparison preserved in GCJ-02 |
| Conversion | Baidu Mercator → BD-09 → GCJ-02 → iterative inverse WGS84; independent Gaode GCJ-02 → iterative inverse WGS84 |
| `horizontalUncertaintyMetres` | `150` |
| Review status | provisional Point only, pending final approval |
| Required public statement | “This Point identifies the publicly mapped location associated with 暴动举行地. It does not represent the protected building footprint or legal protection boundary.” |

## Exact evidence gaps

1. Evidence fixing whether the selected provider pin represents the plaque, entrance, visitor compound, protected building, or broader scenic site.
2. A component-specific geotagged ground photograph or surveyed protection-sign coordinate.
3. A georeferenced official/institutional plan, survey, repair drawing, or protection-sign location.
4. Identification of the correct building body's east/west walls and north/south eave drip lines.
5. Protected courtyard or compound extent, if either is relevant to interpretation.
6. Confirmation of whether the photographed gate/compound is historic fabric, reconstructed visitor infrastructure, or the exhibition venue.
7. Additional dated satellite imagery with a visible footprint, or a documented explanation that canopy permanently obscures it.
8. Access, occupation, and privacy confirmation for the component.

## Production boundary

No research KML/KMZ or GeoJSON exists because no production geometry is approved and tracing is not defensible. No production data, generator input, generated GeoJSON, application code, test, Firebase file, workflow, or package file is changed.

## Pilot verification record

- Local GFM rendering passed.
- External-link syntax and source resolution were checked; access-controlled responses were distinguished from missing sources, and the archival protection-range source was independently resolved.
- Repository JSON and GeoJSON parsing passed.
- UTF-8 validation passed.
- Coordinate-conversion assertions passed for the Baidu Mercator-to-BD-09 decode, BD-09-to-GCJ-02 conversion, both ten-iteration GCJ-02-to-WGS84 inverses, forward residuals, and all three pairwise distances.
- The deterministic provincial and official GeoJSON generation checks passed.
- The production official/provincial JSON and GeoJSON outputs remained byte-for-byte unchanged.
- `git diff --check` passed.
- The protected/out-of-scope audit passed.

## Stop point

No production data was published. No application code was modified. No live map geometry was added. No file was staged, committed, pushed, or included in a pull request.

Wait for explicit final approval before implementing the provisional Point. Do not begin a footprint or protection-boundary implementation without the remaining building-specific evidence.
