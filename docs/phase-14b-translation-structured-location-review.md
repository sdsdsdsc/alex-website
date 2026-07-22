# Phase 14B — Translation and structured-location review

## 1. Status and scope

This document is a human-review record for the ten-record provincial protected heritage pilot. The authoritative Chinese source facts remain in Phase 14A. All pinyin and English wording here is Alex’s Photo Board project work, and all structured Chinese location fields are project-derived interpretations. None of the English wording is an official Jiangxi government translation.

This review makes no coordinate or GIS claim. It contains no runtime dataset, latitude, longitude, geometry, GeoJSON, mapping confidence, Map integration, Firebase data, public display, or export behavior. Every interpretation remains under bilingual review.

## 2. Source relationship

The authoritative source transcription is [`docs/phase-14a-ten-record-official-chinese-source-table.md`](./phase-14a-ten-record-official-chinese-source-table.md). Record IDs are the only join key between that source table and this review.

This document does not duplicate or modify the authoritative Chinese source table. Chinese names appear below only as read-only review references. The Phase 14A values for `officialNumber`, `officialNameZh`, `officialCategoryZh`, `periodZh`, `officialLocationTextZh`, and `remarksZh` remain authoritative and unchanged.

## 3. Romanization policy

- Use Hanyu Pinyin without tone marks.
- Capitalize separated proper-name and generic-name components consistently.
- Join syllables within one lexical component.
- Use apostrophes where normal pinyin orthography requires disambiguation.
- Romanize the heritage-site name only; do not create a full-location pinyin field.
- Use an established English name only when a reliable source documents it.
- Do not guess an ambiguous pronunciation. Mark unresolved readings for review rather than silently fixing them.
- Treat every proposed pinyin value as project romanization with `translationStatus` set to `draft`.

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
| 遗址群 | Site Group |
| 窑址 | Kiln Site |
| 古城墙 | Ancient City Wall |

These are controlled project renderings. They do not claim statutory equivalence with another country’s heritage system.

The following wording remains explicitly under bilingual review:

- `Site Group` versus `Archaeological Site Complex`;
- `Ancient City Wall`;
- `Natural Village` or `natural village settlement`;
- `Hongguang Porcelain Factory`;
- `Imperial Kiln Factory`.

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

- `draft`: project wording awaiting manual bilingual review.
- `reviewed`: wording separately approved after manual bilingual review.
- `unresolved`: a reading or translation cannot safely be proposed.

All ten records remain `draft` in this review. None is marked `reviewed`.

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

## 8. Ten-record translation review table

Chinese names in this table are read-only references copied solely to support human comparison with Phase 14A.

| recordId | officialNameZh — read-only reference | namePinyin | projectNameEn | projectProtectionLevelEn | projectCategoryEn | projectPeriodEn | projectLocationTextEn | projectRemarksEn | translationStatus | translationNote |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JX-PCH-7-001 | 打鼓岭遗址 | Dagu Ling Yizhi | Dagu Ling Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Paleolithic | Xinyu City, Yushui District, Luofang Town, Zhushan Village, Kengkou Villagers’ Group | null | draft | Proper name retained in pinyin; heritage type translated. |
| JX-PCH-7-002 | 大印山遗址群 | Dayin Shan Yizhiqun | Dayin Shan Site Group | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Neolithic to Shang dynasty | Yichun City, Fengcheng City, Taosha Town, Qianfang Village (Jinqiao Reservoir) | null | draft | Site Group is a conservative project rendering of 遗址群 and remains under review against Archaeological Site Complex. |
| JX-PCH-7-003 | 荞麦岭遗址 | Qiaomai Ling Yizhi | Qiaomai Ling Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Xia and Shang dynasties | Jiujiang City, Chaisang District, Mahuiling Town, Fumin Village, Qiaomailing Natural Village | null | draft | Natural Village is a project rendering of the unusual source wording 自然村庄 and remains under bilingual review. |
| JX-PCH-7-004 | 袁州古城墙 | Yuanzhou Guchengqiang | Yuanzhou Ancient City Wall | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Late Tang dynasty and Five Dynasties period to Republican period | Yichun City, Yuanzhou District, Lingquanchi Park, Gaoshi South Road, Wangzi Lane, and Majiayuan | Includes the Lingquanchi, Gaoshi South Road, Wangzi Lane, and Majiayuan sections. | draft | Ancient City Wall is judgment-based. All wall sections remain one designated record. |
| JX-PCH-7-005 | 南市街窑址 | Nanshijie Yaozhi | Nanshijie Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Five Dynasties period to Yuan dynasty | Jingdezhen City, Fuliang County, Shou’an Town, Nanshijie Village | null | draft | Nanshijie is treated as one proper-name component and is not interpreted as a generic street reference. |
| JX-PCH-7-006 | 南坑窑址 | Nankeng Yaozhi | Nankeng Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song and Yuan dynasties | Pingxiang City, Luxi County, Nankeng Town, Yaoxia Village | Includes Fenghuangpo, Anzipo, and Wazi’ao. | draft | Included components remain subordinate to one designated record. |
| JX-PCH-7-007 | 兴源马家窑址 | Xingyuan Majia Yaozhi | Xingyuan Majia Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song and Yuan dynasties | Yichun City, Tonggu County, Yongning Town, Xingyuan Village | null | draft | Xingyuan and Majia remain in pinyin. |
| JX-PCH-7-008 | 落马桥窑址 | Luoma Qiao Yaozhi | Luoma Qiao Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song dynasty to Republican period | Jingdezhen City, Zhushan District, within the Hongguang Porcelain Factory compound on Zhonghua South Road | null | draft | Factory-compound wording is a natural-English project rendering and remains under bilingual review. |
| JX-PCH-7-009 | 观音阁窑址 | Guanyin Ge Yaozhi | Guanyin Ge Kiln Site | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Song to Qing dynasties | Jingdezhen City, Zhushan District, Jingcheng Town, Changjiang Village | null | draft | Guanyin Ge remains in pinyin rather than being translated semantically. |
| JX-PCH-7-010 | 御窑厂西窑址 | Yuyaochang Xi Yaozhi | West Kiln Site of the Imperial Kiln Factory | Jiangxi Provincial Cultural Heritage Site | Archaeological Site | Ming and Qing dynasties | Jingdezhen City, Zhushan District | null | draft | This is the highest-judgment name translation. Imperial Kiln Factory versus retaining Yuyaochang remains under bilingual review. |

## 9. Unresolved bilingual-review items

The following decisions remain unresolved and must not be silently finalized:

- pinyin segmentation for `Dagu Ling`, `Dayin Shan`, `Qiaomai Ling`, `Luoma Qiao`, and `Guanyin Ge`;
- `Site Group` versus `Archaeological Site Complex`;
- `Ancient City Wall`;
- `Natural Village` as the rendering of 自然村庄;
- `Hongguang Porcelain Factory`;
- `Imperial Kiln Factory` versus `Yuyaochang`;
- availability of authoritative locally established English names;
- whether `componentLocationsZh` should later become a machine-data field.

## 10. Integrity summary

- Exactly ten structured-location rows and ten translation-review rows are present.
- Every record ID corresponds to one Phase 14A record ID, with no duplicates.
- Every translation status remains `draft`.
- Unsupported hierarchy uses the literal value `null`.
- Records 004 and 006 remain single designated records.
- Phase 14A remains unchanged and authoritative.
- No coordinate, geometry, GeoJSON, confidence, mapping, Firebase, runtime, or export field is introduced.
