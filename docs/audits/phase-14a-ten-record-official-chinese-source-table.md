# Phase 14A — Ten-record official Chinese source table

## 1. Status and scope

This document is a ten-record pilot transcription from the official notice `江西省人民政府关于公布第七批江西省文物保护单位的通知`. The government notice and its attachment remain the authoritative source. The table preserves official Chinese source wording for review and provenance. It is not a GIS layer and contains no coordinates, geometry, English translations, or pinyin. The records are not connected to the Map, Places, Firebase, `communityPlaces`, `placeNominations`, or `heritage.json`. Translation, structured-location work, coordinate research, GeoJSON generation, public display, and export require separate approval.

This phase does not:

- translate names, periods, locations, categories, or remarks;
- add pinyin;
- parse the official location text into administrative fields;
- research or add coordinates;
- create geometry or GeoJSON;
- connect these records to the Map, Places, Firebase, `communityPlaces`, `placeNominations`, or `heritage.json`;
- change public display or export behavior.

Any future translation, structured-location work, coordinate research, GeoJSON creation, public display, or export inclusion requires separate approval.

## 2. Source and provenance

| Field | Value |
| --- | --- |
| scope | ten-record pilot transcription |
| protectionLevelZh | 江西省文物保护单位 |
| batch | 第七批 |
| designationDate | 2025-07-18 |
| sourcePublisherZh | 江西省人民政府 |
| sourceTitleZh | 江西省人民政府关于公布第七批江西省文物保护单位的通知 |
| sourceAttachmentTitleZh | 第七批江西省文物保护单位名单 |
| sourceDocumentNumber | 赣府发〔2025〕8号 |
| sourceDocumentNumberVerificationStatus | pending |
| sourceUrl | <https://ncx.nc.gov.cn/ncxrmzf/gxszwgz/202507/9fed39827ae74418af52268254e8f2b0.shtml> |
| sourceAttachmentImageUrl | <https://gxls.jiangxi.gov.cn/jxsgxhzslhs/zcwj684/1948655115963285504/eXLlAIYH.png> |
| sourceAccessedDate | 2026-07-22 |

The cited page is an official county-government republication. Its page metadata identifies 南昌县供销社 as the publishing agency and shows a later page-generation date, while the notice title and text identify 江西省人民政府 as the issuing authority. These roles and dates are not interchangeable.

The document number was supplied in the project brief. It is retained with `pending` verification because it was not directly visible in the inspected government republication or attachment image. No broader source research or inference was used to upgrade that status, and it is not presented here as independently confirmed.

The attachment is a raster image. Its visible row separators and column alignment were inspected manually; they are not machine-readable table structure. The official numbers visibly use a long dash. This transcription preserves that visible form as `—` and does not normalize it to an ASCII hyphen, although the raster does not expose a mechanically verifiable Unicode code point.

## 3. Transcription rules

- Preserve official Chinese characters, full-width punctuation, parentheses, enumeration commas, periods, locations, and unusual wording.
- Preserve the complete official location text as one value; do not parse or infer administrative units.
- Use the literal value `null` when the source remarks cell is blank.
- Keep `含` components within their parent designated record rather than splitting them into separate records.
- Use stable project record IDs `JX-PCH-7-001` through `JX-PCH-7-010`; these IDs are not official source identifiers.
- Repeat `古遗址` in each row only to make the table reviewable and transformable. The source supplies it once as the shared heading `一、古遗址（15处）`, not in every individual row.
- Do not add hidden translations, normalized fields, address parsing, coordinates, geometry, confidence, or mapping fields. Any later normalization requires an explicitly approved project field that remains separate from the official transcription.

## 4. Official Chinese source table

| recordId | officialNumber | officialNameZh | officialCategoryZh | periodZh | officialLocationTextZh | remarksZh | sourceVerificationStatus | sourceVerificationNote |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JX-PCH-7-001 | 7—1—001 | 打鼓岭遗址 | 古遗址 | 旧石器时代 | 新余市渝水区罗坊镇竹山村坑口村民小组 | null | verified against official attachment image | Shared category inherited from 一、古遗址（15处）. |
| JX-PCH-7-002 | 7—1—002 | 大印山遗址群 | 古遗址 | 新石器时代至商 | 宜春市丰城市淘沙镇前坊村（金桥水库） | null | verified against official attachment image | Preserve 遗址群 as one official record. Preserve full-width parentheses. |
| JX-PCH-7-003 | 7—1—003 | 荞麦岭遗址 | 古遗址 | 夏商 | 九江市柴桑区马回岭镇富民村荞麦岭自然村庄 | null | verified against official attachment image | Preserve official wording 荞麦岭自然村庄 without normalization. |
| JX-PCH-7-004 | 7—1—004 | 袁州古城墙 | 古遗址 | 晚唐五代至民国 | 宜春市袁州区灵泉池公园、高士南路、王子巷、马家园 | 含灵泉池段、高士南路段、王子巷段、马家园段 | verified against official attachment image | One designated record. Do not split component wall sections. |
| JX-PCH-7-005 | 7—1—005 | 南市街窑址 | 古遗址 | 五代至元 | 景德镇市浮梁县寿安镇南市街村 | null | verified against official attachment image | Shared category inherited from 一、古遗址（15处）. |
| JX-PCH-7-006 | 7—1—006 | 南坑窑址 | 古遗址 | 宋元 | 萍乡市芦溪县南坑镇窑下村 | 含凤凰坡、庵子坡、瓦子坳 | verified against official attachment image | One designated record. Do not split three included kiln-site components. |
| JX-PCH-7-007 | 7—1—007 | 兴源马家窑址 | 古遗址 | 宋元 | 宜春市铜鼓县永宁镇兴源村 | null | verified against official attachment image | Shared category inherited from 一、古遗址（15处）. |
| JX-PCH-7-008 | 7—1—008 | 落马桥窑址 | 古遗址 | 宋至民国 | 景德镇市珠山区中华南路红光瓷厂院内 | null | verified against official attachment image | Shared category inherited from 一、古遗址（15处）. |
| JX-PCH-7-009 | 7—1—009 | 观音阁窑址 | 古遗址 | 宋至清 | 景德镇市珠山区竟成镇昌江村 | null | verified against official attachment image | Shared category inherited from 一、古遗址（15处）. |
| JX-PCH-7-010 | 7—1—010 | 御窑厂西窑址 | 古遗址 | 明清 | 景德镇市珠山区 | null | verified against official attachment image | Shared category inherited from 一、古遗址（15处）. |

## 5. Integrity summary

- Exactly 10 source rows are recorded.
- Project IDs run sequentially from `JX-PCH-7-001` through `JX-PCH-7-010` with no duplicates.
- Official numbers run from `7—1—001` through `7—1—010` with no duplicates.
- Eight rows use the literal `null` remarks value; only records 004 and 006 contain remarks.
- All ten records inherit the official category `古遗址`.
- None of the ten records belongs to the separate seven-unit merger section.
- The table contains no translated, pinyin, parsed-address, coordinate, geometry, confidence, or mapping fields.
