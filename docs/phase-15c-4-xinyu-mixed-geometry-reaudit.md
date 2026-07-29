# Phase 15C-4 - Xinyu Mixed-Geometry Re-audit

## Historical status

This document is preserved as the Phase 15C-4 mixed-geometry re-audit record. Its classification letters and single-Xieli batch recommendation reflect the policy used at that time and are superseded by [Phase 15C-6](./phase-15c-6-official-record-publication-policy-and-batch-plan.md). [Phase 15C-5](./phase-15c-5-xiabu-geometry-pilot.md) is the authoritative detailed Xiabu evidence record. Xiabu remains only a proposed future Point candidate and must not be implemented or published without explicit approval.

## Outcome

This documentation-only re-audit applies an honest heritage-reference standard rather than requiring authority-supplied legal-boundary vertices for every non-Point feature. It does not change source datasets, public-location decisions, generated GeoJSON, application code, tests, or production behavior.

The revised standard identifies one line/area candidate that is suitable for a separately approved implementation:

- **斜里遗址 (Xieli Site): classification B, project reference area only.** A reproducible square can be constructed from the published GPS centre and 30-metre cardinal offsets, but it must be presented as a project-created `generalized-reference-area`, not an official or legal boundary. The source datum remains unknown, so the proposed implementation must preserve the source coordinate, document the no-transform transcription, use generalized precision, carry a conservative 500-metre horizontal uncertainty, and display the required project-geometry disclaimer.

No other new Point, line, area, or Point-plus-shape candidate is ready for implementation from the evidence reviewed. 蓉泉桥 remains a valid existing Point; its published approximate centre is not precise enough to construct a defensible 7.7-metre centreline.

The generated production result remains:

- 15 joined official records;
- 5 published Point features;
- 0 published non-Point features;
- 10 exclusions;
- 0 hard errors;
- `valid` generation status.

## Revised representation and claim policy

The audit uses these defaults:

- single buildings, monuments, small landmarks, and clear visitor references: `Point`;
- bridges, walls, routes, remains, and alignments: `LineString` or `MultiLineString`;
- compounds, building groups, archaeological sites, battlefields, and defined site areas: `Polygon` or `MultiPolygon`;
- broad, dispersed, uncertain, or incompletely mapped places: `generalized-reference-area` or `uncertainty-area`;
- Point plus geometry only when the two features communicate different meanings.

Project-created geometry may be considered when identity is strong, construction is reproducible, CRS treatment and uncertainty are explicit, sensitivity is acceptable, and the popup states:

> This is a project-created heritage reference geometry and not an official legal boundary.

No project-created feature in this audit is classified as `reviewed-boundary`.

## Classification key

- **A - Publishable now as Point**
- **B - Publishable now as project reference line/area**
- **C - Publishable now as Point plus line/area**
- **D - Needs more evidence**
- **E - Withhold**

## Complete audit table

| Record | Natural form | Public evidence and Gaode assessment | Classification | Recommended representation | Meaning, precision, provenance, and uncertainty | Point retained? | Sensitivity and misleading-risk decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 下保农民暴动旧址, `6-5-321` | Multipart built site: event structure and meeting building | The provincial protection-range annex gives separate building-relative offsets and areas of 283.2 m² and 110.6 m². Public tourism material confirms a visitor-facing old site and exhibition venue in Xiabu Village. A current exact-name Gaode result could not be independently captured as a stable POI ID, coordinate, address, and photograph during this audit; the interactive search required sign-in. | **D** | Point is the preferred first representation if the Gaode venue is reverified. A later `MultiPolygon` could represent the two components only after both footprints are georeferenced. A future Point plus shape would be justified only if the Point means visitor entrance and the shapes mean component extents. | Provisional Point: approximate visitor reference, project-reviewed location decision, at least 150 m uncertainty until GCJ-02 inversion and WGS84 context review are complete. Future shapes: `approximate-boundary`, approximate, `project-reviewed-digitization`, uncertainty set from the source-map resolution. | Not yet. Do not construct two rectangles from area totals or offsets alone. | Low archaeological sensitivity and strong public-visitor value, but a village or exhibition-building pin must not be represented as both protected components. |
| 斜里遗址, `6-1-040` | Areal archaeological site | The annex publishes a GPS centre at `27°45′45.3″ N, 114°55′11.2″ E` and extends 30 m east, south, west, and north. Xinyu Museum confirms the named archaeological site, about 5,000 m², excavation, graves, and finds. The annex says only `GPS`; no datum is named. No useful exact-name Gaode POI was verified. | **B** | One `Polygon`, shape only. Construct a 60 m by 60 m project reference square by projecting the transcribed centre to a local metre-based plane, applying ±30 m east/west and north/south, and returning the four corners to WGS84 display coordinates. | `generalized-reference-area`; generalized; `project-generalized-reference`; source label identifies the Jiangxi protection-range annex; source DMS preserved; no datum transformation claimed; proposed `horizontalUncertaintyMetres: 500`. Popup must carry the project-created/not-legal-boundary statement and explain the unknown datum. | No. A coincident centre Point would repeat the same site-location meaning. | High archaeological sensitivity, but the centre and rule are already public. The 500 m uncertainty is deliberately larger than the shape and signals that the display location is not a surveyed boundary. Implementation should stop if review concludes that this uncertainty makes the small square visually misleading. |
| 袁州明代城墙砖窑址群（芦塘窑址）, `6-1-022` | Multipart archaeological kiln group; the Xinyu component is areal | The annex defines the Xinyu 芦塘 component by a village road, ditch, terrace, and reservoir embankment. Its separate 16-coordinate block applies to the other Yichun components, not to 芦塘, and must not be reassigned. No georeferenced map or exact component POI was verified. | **D** | Future Xinyu-component `Polygon`; the wider designation may later require a `MultiPolygon`. | Preferred future meaning `approximate-boundary`; approximate; `project-reviewed-digitization`; proposed minimum 50 m uncertainty, recalculated from the eventual source scale. | No. | High archaeological and multipart identity risk. Named landscape edges support a real extent, but tracing unidentified map features would create a false legal-looking boundary. |
| 彭家山遗址, `6-1-039` | Areal archaeological site | The annex defines protection offsets from an existing fence: 10 m east and south, 2 m west, and 3 m north. Xinyu Museum independently identifies the site. No public georeferenced fence footprint or stable exact-name Gaode POI was verified. | **D** | Future `Polygon` after the fence is mapped. | Preferred future meaning `approximate-boundary`; approximate; `project-reviewed-digitization`; proposed minimum 25 m uncertainty, recalculated against the fence source. | No. | High archaeological sensitivity. The rule is reproducible only after the referenced fence geometry is available. |
| 棋盘山遗址 | Areal archaeological platform and wider settlement | Xinyu Museum places it 100 m north of Zhangtang Village on a stepped rectangular platform, more than 10,000 m² overall with a 3,000 m² centre and surrounding ditch. This is strong morphology but not a georeferenced centre or boundary. No stable exact-name Gaode POI was verified. | **D** | Future `Polygon` or `MultiPolygon`; use `generalized-reference-area` unless a mapped ditch/platform extent supports an approximate boundary. | Generalized option: generalized, `project-generalized-reference`, proposed 150-250 m uncertainty after a centre and source scale are established. | No. | High archaeological sensitivity and large-settlement context. A generic 10,000 m² rectangle would falsely imply surveyed orientation and extent. |
| 北伐军仰天岗战场遗址, `6-5-318` | Broad dispersed battlefield landscape | The annex describes an approximately 3,000 m by 100 m area from Liangshannao to Gouxiongpo, focused on surface trenches, individual shelters, and shell craters, total area 300,000 m². Municipal material confirms the two battlefield areas and a separate memorial/education landscape. Gaode indexes the wider Yangtiangang area, but no verified battlefield endpoint or alignment POI was found. | **D** | Future elongated `Polygon` as `generalized-reference-area`, not a simple line. A separate memorial Point would be a different record/meaning and must not be substituted for the battlefield. | Generalized; `project-generalized-reference`; proposed minimum 250 m uncertainty after both named endpoints or an institutional map are georeferenced. | No battlefield Point. | Moderate sensitivity and high interpretive value, but a 3 km rectangle anchored only to a forest-park or memorial pin would be misleading. |
| 打鼓岭遗址, `JX-PCH-7-001` | Areal Palaeolithic hill-slope site | The official record identifies Kengkou Villagers' Group. Existing project research found only a report placing the site about 500 m east of Kengkou village on a small hill slope; it supplies no numeric origin, bearing, boundary, or CRS. Same-name false matches are common, and no record-specific Gaode POI was verified. | **E** | Withhold. A future `uncertainty-area` may be reconsidered only with a verified centre or authority-approved public reference. | No geometry metadata proposed for publication. | No. | Very high archaeological sensitivity and false-match risk. Offsetting an arbitrary village centre would manufacture location evidence. |
| 蓉泉桥, `JX-XY-PCH-009` | Short east-west single-span stone bridge | Existing evidence remains strong: exact-name Gaode POI `B0JU95B3WN`, feature photograph, locality match, GCJ-02 coordinate, deterministic inverse conversion, and independent museum description. The museum records an east-west bridge 7.7 m long and 2.1 m wide. The published WGS84 Point has 75 m uncertainty. | **A** - already published | Retain the existing approximate `Point`. Do not add or replace it with a line yet. | Existing approximate heritage-feature Point; project-reviewed public-location decision; 75 m uncertainty. A future centreline would be `approximate-line`, approximate, `project-reviewed-digitization`, but requires a bridge-specific centre or mapped endpoints with uncertainty materially smaller than its 7.7 m length. | Yes, unchanged. | Low sensitivity. Point plus line would duplicate the same heritage-feature meaning, and the current Point uncertainty is too large for a credible short centreline. |

## Shortlist

### New Point candidates

1. **下保农民暴动旧址 visitor reference - D.** Highest-value new Point candidate, but implementation must wait for a stable Gaode POI ID, GCJ-02 coordinate, detailed address or photograph, independent identity/locality match, deterministic inverse conversion, and WGS84 context review.

No other excluded record currently meets the Point shortlist threshold. 蓉泉桥 is the retained existing control, not a new candidate.

### New line or area candidates

1. **斜里遗址 - B.** One project-created `generalized-reference-area`; the only candidate ready for a separately approved implementation under the revised policy.
2. **北伐军仰天岗战场遗址 - D.** High interpretive value once Liangshannao and Gouxiongpo or an institutional extent are georeferenced.
3. **袁州明代城墙砖窑址群（芦塘窑址） - D.** Strong natural-edge description, but the Xinyu component lacks a georeferenced map.

### Point plus geometry candidate

1. **下保农民暴动旧址 - D.** A visitor Point plus two component shapes could communicate distinct meanings, but neither the Point evidence nor the two georeferenced footprints are complete.

## Proposed first implementation batch

If separately approved, implement **斜里遗址 only**:

1. add a stable official source record without altering the source facts;
2. preserve the DMS centre and its unknown source datum in reviewer evidence;
3. construct the project reference square reproducibly in a local metre-based projection;
4. publish WGS84 display vertices as an explicitly approximate project representation, not as a datum-certified conversion;
5. use `geometryMeaning: generalized-reference-area`;
6. use `geometryPrecision: generalized`;
7. use `geometrySourceType: project-generalized-reference`;
8. set `horizontalUncertaintyMetres` to 500, subject to implementation review;
9. include the exact required disclaimer and an unknown-datum limitation;
10. retain all five existing Points unchanged and do not add a duplicate centre Point.

This recommendation is intentionally one feature. It should be rejected during implementation if the large location uncertainty makes the 60 m square more misleading than useful.

## Exact evidence and CRS notes

### Provincial protection ranges

- Notice: 江西省人民政府关于公布第六批江西省文物保护单位保护范围的通知, `赣府字〔2019〕18号`, dated 2019-03-07.
- Historical government page, now unavailable: `https://www.jiangxi.gov.cn/art/2019/3/15/art_5296_668434.html`
- [Public archival PDF](https://commons.wikimedia.org/wiki/File%3A%E7%AC%AC%E5%85%AD%E6%89%B9%E6%B1%9F%E8%A5%BF%E7%9C%81%E6%96%87%E7%89%A9%E4%BF%9D%E6%8A%A4%E5%8D%95%E4%BD%8D%E4%BF%9D%E6%8A%A4%E8%8C%83%E5%9B%B4%E4%B8%80%E8%A7%88%E8%A1%A8.pdf)

The relevant printed annex pages were checked by text extraction and visual rendering:

- printed page 7: 芦塘窑址 and the separate coordinate block for the other kiln components;
- printed page 10: 彭家山 and 斜里;
- printed page 121: 北伐军仰天岗;
- printed page 122: 下保.

The Xieli DMS centre transcribes arithmetically to approximately `[114.919777778, 27.762583333]`. Arithmetic transcription is not a datum conversion. The proposed WGS84 display construction therefore remains explicitly approximate and carries the unresolved datum as uncertainty.

### Institutional and existing project evidence

- Xinyu Museum provincial-unit index: <https://www.xysmuseum.com/list_22/>
- Xieli Site: <https://www.xysmuseum.com/596.html>
- Qipanshan Site: <https://www.xysmuseum.com/591.html>
- Rongquan Bridge: <https://www.xysmuseum.com/593.html>
- Sixth-batch Xinyu promotion notice: <https://www.xysmuseum.com/183.html>
- Municipal Yangtiangang description: <https://m.thepaper.cn/newsDetail_forward_17977164>
- Current official Xinyu register: <https://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml>
- Existing Dagu Ling evidence review: [phase-14c-coordinate-evidence-and-review.md](./phase-14c-coordinate-evidence-and-review.md)
- Existing published Xinyu Point evidence: [phase-15b-4-xinyu-official-marker-expansion.md](./phase-15b-4-xinyu-official-marker-expansion.md)

Gaode is treated as provider evidence, not official geometry. Any new Gaode Point must preserve the original GCJ-02 coordinate and POI identity, use the existing deterministic inverse method, and undergo independent WGS84 locality review. This audit does not infer absence from a failed interactive search; it records unverified Gaode evidence as an evidence gap.

## Evidence gaps

- **下保:** stable Gaode POI ID and coordinate; address/photo recheck; independent WGS84 context; georeferenced footprints for both components.
- **斜里:** explicit source datum; authority or institutional sensitivity/reuse confirmation; review of whether 500 m uncertainty makes the small reference square misleading.
- **芦塘:** a georeferenced map of the Xinyu component and identification of the road, ditch, terrace, and reservoir embankment.
- **彭家山:** the protection-fence footprint and its CRS.
- **棋盘山:** a verified centre and georeferenced platform/ditch extent.
- **仰天岗:** coordinates or an institutional map for Liangshannao and Gouxiongpo, plus confirmation of the relationship between battlefield and memorial sites.
- **打鼓岭:** a record-specific public centre or authority-approved generalized location and a sensitivity decision.
- **蓉泉桥:** bridge-specific mapped endpoints or a centre accurate enough to support a 7.7 m line.

## Production, accessibility, and rollback

Production remains Point-only. No popup, accessible name, keyboard target, category count, multipart count, URL, bounds, layer default, or community behavior changes in this audit.

Any future project-created geometry must expose its meaning, approximate precision, provenance, uncertainty, and limitation in both its accessible name and popup. Keyboard and pointer activation must remain feature-level, and one multipart designation must count as one feature.

Rollback for this audit is documentation-only. No data regeneration or application rollback is required.

## Stop point

No implementation, staging, commit, push, pull request, deployment, or data publication was performed at this historical stop point. The former single-Xieli next-step recommendation is superseded by the controlling Phase 15C-6 policy and batch plan.
