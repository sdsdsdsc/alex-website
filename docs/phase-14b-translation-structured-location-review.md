# Phase 14B — Translation and structured-location review

## 1. Status and scope

This document records the approved project review for the ten-record provincial protected heritage pilot. The authoritative Chinese source facts remain in Phase 14A. All pinyin is Alex’s Photo Board project romanization, all English wording is project translation, and all structured Chinese location fields are project-derived interpretations. None of the English wording is an official Jiangxi government translation.

This review makes no coordinate or GIS claim. It contains no runtime dataset, latitude, longitude, geometry, GeoJSON, mapping confidence, Map integration, Firebase data, public display, or export behavior. The approved values were finalized through the documented project review. A `reviewed` value is approved project wording or romanization; it does not imply official-name status. Any future claim that an English name is authoritative or locally established requires a separately cited source.

## 2. Source relationship

The authoritative source transcription is [`docs/phase-14a-ten-record-official-chinese-source-table.md`](./phase-14a-ten-record-official-chinese-source-table.md). Record IDs are the only join key between that source table and this review.

This document does not duplicate or modify the authoritative Chinese source table. Chinese names appear below only as read-only review references. The Phase 14A values for `officialNumber`, `officialNameZh`, `officialCategoryZh`, `periodZh`, `officialLocationTextZh`, and `remarksZh` remain authoritative and unchanged.

## 3. Romanization policy

- Use Hanyu Pinyin without tone marks.
- Capitalize separated proper-name and generic-name components consistently.
- Join syllables within one lexical component.
- Use apostrophes where normal pinyin orthography requires disambiguation.
- Romanize the heritage-site name only; do not create a full-location pinyin field.
- Use an established English name only when a reliable source documents it; otherwise identify the value as project wording.
- Do not guess an ambiguous pronunciation. Mark unresolved readings for review rather than silently fixing them.
- Treat every approved pinyin value as project romanization, not as a claim of an official locally published spelling.

The approved pinyin values intentionally separate distinguishable geographic proper-name and generic-name components in `Dagu Ling`, `Dayin Shan`, `Qiaomai Ling`, `Luoma Qiao`, and `Guanyin Ge`. The heritage-site name uses `Qiaomai Ling`, while the natural-village location uses the joined form `Qiaomailing`.

## 4. Controlled project English vocabulary

| Chinese | Project English |
| --- | --- |
| 江西省文物保护单位 | Jiangxi Provincial Cultural Heritage Site |
| 古遗址 | Archaeological Site |
| 旧石器时代 | Paleolithic |
| 新石器时代至商 | Neolithic to Shang dynasty |
| 夏商 | Xia and Shang dynasties |
| 晚唐五代至民国 | Late Tang dynasty and Five Dynasties period to Republican period |
| 五代至元 | Five Dynasties period to Yuan dynasty |
| 宋元 | Song and Yuan dynasties |
| 宋至民国 | Song dynasty to Republican period |
| 宋至清 | Song to Qing dynasties |
| 明清 | Ming and Qing dynasties |
| 遗址 | Site |
| 遗址群 | Archaeological Site Group |
| 窑址 | Kiln Site |
| 古城墙 | Ancient City Wall |

These are controlled project renderings. They do not claim statutory equivalence with another country’s heritage system.

The final project decisions for the reviewed high-judgment wording are:

- `遗址群`: `Archaeological Site Group`;
- `袁州古城墙`: `Yuanzhou Ancient City Wall`;
- `荞麦岭自然村庄`: `Qiaomailing natural village settlement`;
- `红光瓷厂`: `Hongguang Ceramics Works`;
- `御窑厂西窑址`: `Yuyaochang West Kiln Site`.

`Hongguang Ceramics Works` is an evidence-informed project rendering, not an official Jiangxi-government English name. `Imperial Kiln` is established contextual English terminology for Jingdezhen, but no exact official English designation is claimed for record 010. `Yuyaochang West Kiln Site` is therefore the approved concise project name.

## 5. Structured-location model

The project-derived fields are:

- `prefectureLevelCityZh`
- `countyLevelDivisionZh`
- `subdistrictTownshipZh`
- `villageCommunityZh`
- `subVillageLocalityZh`
- `siteDetailZh`
- `componentLocationsZh`
- `structuredLocationStatus`
- `structuredLocationNote`

The authoritative full Chinese location remains only in Phase 14A as `officialLocationTextZh`. These derived fields must not be used to reconstruct or replace it. An unsupported hierarchy level uses the literal value `null`.

`structuredLocationStatus` uses this vocabulary:

- `derived`: the field assignment follows explicit source wording.
- `partial`: only part of the hierarchy is available, or the remaining wording is a free-form site or multi-component description.
- `unresolved`: the source cannot safely support the proposed assignment.

## 6. Translation status

`translationStatus` uses this vocabulary:

- `reviewed`: approved project wording or romanization after documented project-owner or named bilingual review.
- `unresolved`: a reading or translation remains unsafe to finalize.

All ten records are `reviewed` through the documented project review. This status does not mean that an English value is an official government name or that a pinyin value is an official locally published spelling.

## 7. Ten-record structured-location table

| recordId | prefectureLevelCityZh | countyLevelDivisionZh | subdistrictTownshipZh | villageCommunityZh | subVillageLocalityZh | siteDetailZh | componentLocationsZh | structuredLocationStatus | structuredLocationNote |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JX-PCH-7-001 | 新余市 | 渝水区 | 罗坊镇 | 竹山村 | 坑口村民小组 | null | null | derived | The source states each assigned hierarchy level explicitly. |
| JX-PCH-7-002 | 宜春市 | 丰城市 | 淘沙镇 | 前坊村 | null | 金桥水库 | null | derived | The parenthetical reservoir reference is retained as site detail, not an administrative level. |
| JX-PCH-7-003 | 九江市 | 柴桑区 | 马回岭镇 | 富民村 | 荞麦岭自然村庄 | null | null | derived | The unusual source wording 荞麦岭自然村庄 is preserved in the sub-village field without normalization. |
| JX-PCH-7-004 | 宜春市 | 袁州区 | null | null | null | 灵泉池公园、高士南路、王子巷、马家园 | 灵泉池段、高士南路段、王子巷段、马家园段 | partial | The location is a free-form multi-component description. Components come from the source remarks and remain one designated record. |
| JX-PCH-7-005 | 景德镇市 | 浮梁县 | 寿安镇 | 南市街村 | null | null | null | derived | The source states each assigned hierarchy level explicitly. |
| JX-PCH-7-006 | 萍乡市 | 芦溪县 | 南坑镇 | 窑下村 | null | null | 凤凰坡、庵子坡、瓦子坳 | derived | Components come from the source remarks and remain subordinate to one designated record. |
| JX-PCH-7-007 | 宜春市 | 铜鼓县 | 永宁镇 | 兴源村 | null | null | null | derived | The source states each assigned hierarchy level explicitly. |
| JX-PCH-7-008 | 景德镇市 | 珠山区 | null | null | null | 中华南路红光瓷厂院内 | null | partial | Only the city and district hierarchy are stated; the remaining wording is retained as an industrial-compound site detail. |
| JX-PCH-7-009 | 景德镇市 | 珠山区 | 竟成镇 | 昌江村 | null | null | null | derived | The source states each assigned hierarchy level explicitly. |
| JX-PCH-7-010 | 景德镇市 | 珠山区 | null | null | null | null | null | partial | The source provides only city and district, so unsupported lower levels remain null. |

Records 004 and 006 remain one record each. `componentLocationsZh` must never be interpreted as separate designated records.

The `componentLocationsZh` values are retained here as documentary human-review interpretations, but the field is not approved as part of a future machine-readable contract. Its machine-data status is deferred to the later data-contract phase. The authoritative components remain in Phase 14A `remarksZh`, and their English wording remains in `projectRemarksEn`. No child records, component geometry, or component GeoJSON features are approved.

If a later data-contract phase approves a machine representation, it should use a list on the parent record with source provenance and must expressly prohibit treating list entries as independently designated heritage records.

## 8. Ten-record translation review table

Chinese names in this table are read-only references copied solely to support human comparison with Phase 14A.

| recordId | officialNameZh — read-only reference | namePinyin | projectNameEn | projectProtectionLevelEn | projectCategoryEn | projectPeriodEn | projectLocationTextEn | projectRemarksEn | translationStatus | translationNote |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JX-PCH-7-001 | 打鼓岭遗址 | Dagu Ling Yizhi | Dagu Ling Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Paleolithic | Xinyu City, Yushui District, Luofang Town, Zhushan Village, Kengkou Villagers’ Group | null | reviewed | Project romanization separates the geographic generic Ling; heritage type translated. |
| JX-PCH-7-002 | 大印山遗址群 | Dayin Shan Yizhiqun | Dayin Shan Archaeological Site Group | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Neolithic to Shang dynasty | Yichun City, Fengcheng City, Taosha Town, Qianfang Village (Jinqiao Reservoir) | null | reviewed | Archaeological Site Group identifies multiple related remains without asserting a formally bounded complex. |
| JX-PCH-7-003 | 荞麦岭遗址 | Qiaomai Ling Yizhi | Qiaomai Ling Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Xia and Shang dynasties | Jiujiang City, Chaisang District, Mahuiling Town, Fumin Village, Qiaomailing natural village settlement | null | reviewed | The location wording avoids assigning an unsupported formal administrative status. |
| JX-PCH-7-004 | 袁州古城墙 | Yuanzhou Guchengqiang | Yuanzhou Ancient City Wall | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Late Tang dynasty and Five Dynasties period to Republican period | Yichun City, Yuanzhou District, Lingquanchi Park, Gaoshi South Road, Wangzi Lane, and Majiayuan | Includes the Lingquanchi, Gaoshi South Road, Wangzi Lane, and Majiayuan sections. | reviewed | One designated wall record comprising the four source-listed sections; no completeness claim is added. |
| JX-PCH-7-005 | 南市街窑址 | Nanshijie Yaozhi | Nanshijie Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Five Dynasties period to Yuan dynasty | Jingdezhen City, Fuliang County, Shou’an Town, Nanshijie Village | null | reviewed | Nanshijie remains the village-derived proper name, not a translated street reference. |
| JX-PCH-7-006 | 南坑窑址 | Nankeng Yaozhi | Nankeng Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song and Yuan dynasties | Pingxiang City, Luxi County, Nankeng Town, Yaoxia Village | Includes Fenghuangpo, Anzipo, and Wazi’ao. | reviewed | The three components remain subordinate to one designated record. |
| JX-PCH-7-007 | 兴源马家窑址 | Xingyuan Majia Yaozhi | Xingyuan Majia Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song and Yuan dynasties | Yichun City, Tonggu County, Yongning Town, Xingyuan Village | null | reviewed | Both proper-name components remain in project pinyin. |
| JX-PCH-7-008 | 落马桥窑址 | Luoma Qiao Yaozhi | Luoma Qiao Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song dynasty to Republican period | Jingdezhen City, Zhushan District, within the Hongguang Ceramics Works compound on Zhonghua South Road | null | reviewed | Hongguang Ceramics Works is an evidence-informed project rendering, not an official government translation. |
| JX-PCH-7-009 | 观音阁窑址 | Guanyin Ge Yaozhi | Guanyin Ge Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song to Qing dynasties | Jingdezhen City, Zhushan District, Jingcheng Town, Changjiang Village | null | reviewed | Guanyin Ge remains in pinyin rather than receiving a semantic translation. |
| JX-PCH-7-010 | 御窑厂西窑址 | Yuyaochang Xi Yaozhi | Yuyaochang West Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Ming and Qing dynasties | Jingdezhen City, Zhushan District | null | reviewed | Concise hybrid project name; Imperial Kiln is documented contextually, but no exact official English name is claimed. |

## 9. Decision history

The documented project review superseded these alternatives:

- `Site Group` was less explicit than `Archaeological Site Group`, while `Archaeological Site Complex` risked implying a formally bounded complex.
- `Remains of the Yuanzhou City Wall` added an unsupported condition or completeness implication.
- `Natural Village` risked suggesting a formal administrative rank, while describing `natural village settlement` as a rank would create the same problem.
- `Hongguang Porcelain Factory` was superseded by the evidence-informed project rendering `Hongguang Ceramics Works`.
- `Imperial Kiln Factory` and `West Kiln Site of the Imperial Kiln Factory` risked suggesting an exact official English designation, so the concise project name `Yuyaochang West Kiln Site` was selected.

## 10. Remaining limitations

- No authoritative exact English names were established for records 001–007 or 009; their English values remain approved project translations.
- Record 008 uses an evidence-informed project rendering, not an official Jiangxi-government English name.
- UNESCO contextual terminology for Jingdezhen does not establish record 010’s exact English designation.
- Phase 14A document-number verification remains pending and is outside this phase.
- Any future claim that an English name is authoritative or locally established requires a cited source.
- The machine-data status of `componentLocationsZh` remains deferred to the later data-contract phase.

## 11. Integrity summary

- Exactly ten structured-location rows and ten translation-review rows are present.
- Every record ID corresponds to one Phase 14A record ID, with no duplicates.
- Every translation status is `reviewed` through the documented project review and does not imply official-name status.
- Unsupported hierarchy uses the literal value `null`.
- Records 004 and 006 remain single designated records.
- Phase 14A remains byte-for-byte unchanged and authoritative.
- `componentLocationsZh` remains deferred from machine-data approval.
- No coordinate, geometry, GeoJSON, confidence, mapping, Firebase, runtime, or export field is introduced.
- No application or public-display field or behavior is introduced.
