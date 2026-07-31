# Phase 15C-10 — Xinyu Provider Evidence Matrix

## Search protocol

This matrix records the complete provider pass supporting the
[complete-list audit](../audits/phase-15c-10-xinyu-complete-official-list-audit.md).
On 2026-07-31, every one of the 62 proposed public identities was searched on
both Gaode and Baidu: **62/62 Gaode** and **62/62 Baidu**, or **124 base
searches**. Each base query used the exact official identity plus `新余`.
When that did not return an unambiguous feature, the search was repeated with
the official county/district, township, village, parent, or component wording:
**42 Gaode** and **47 Baidu** targeted variants. This is 213 recorded searches
in total.

The public provider interfaces remained searchable. No CAPTCHA, request-rate
block, or authentication failure prevented completion. Gaode displayed a
login overlay after repeated searches, but result search remained available;
that UI event did not change any evidence classification.

Status codes:

- `C` — exact or strongly reconciled feature result in the official locality;
- `P` — plausible variant or locality support, insufficient for publication;
- `A` — ambiguous same-name/community result;
- `X` — result conflicts with the official identity or locality;
- `N` — no useful feature result.

The query column uses `exact` for `"<official identity> 新余"` and `loc` for
the official locality/component variant. Provider coordinates are not copied
as publication coordinates. A provider result, even `C`, is only one evidence
layer and does not establish coordinate meaning, datum, reusable geometry,
uncertainty, sensitivity, or publication approval.

## Complete result matrix

| ID | Gaode query/result | Status | Baidu query/result | Status | Audit consequence |
| --- | --- | :---: | --- | :---: | --- |
| N01 | exact; 凤凰山铁矿遗址, place `B0JRSCISB6`, correct Fenyi/Huze context | C | exact; exact feature, UID `86025f5d9df5a9936e476023`, correct locality | C | Strong identity lead; official extent/coordinate still required. |
| N02 | exact; 拾年山遗址 in Shubei/Nanbei context | C | exact; exact feature, UID `b526ec6bba9faf824007c130` | C | Strong identity lead; archaeological extent still required. |
| N03 | exact + loc; 罗坊会议旧址 in 陈家闹 | C | exact; exact component, UID `52eb749fe214f22543afe6fe` | C | Component identity supported; feature coordinate/meaning unresolved. |
| N04 | exact + 彭家村; 兴国调查会旧址 | C | exact + loc; Luofang visitor-complex result, component not fully isolated | P | Keep separate from M30; feature evidence required. |
| N05 | exact + 院前村; headquarters/朱德旧居 sublabels | C | exact + loc; related old-site labels in 院前村 | P | Multipart subfeatures need authoritative reconciliation. |
| N06 | exact + 院前村; 苏维埃政府/曾山旧居 sublabels | C | exact + loc; related old-site labels in 院前村 | P | Multipart subfeatures need authoritative reconciliation. |
| N07 | exact + 沙陂村; 水西红三军团指挥部旧址 | C | exact + loc; exact historic-site result | C | Identity supported; no reusable footprint/coordinate decision. |
| N08 | exact + 大桥村; 第58师师部遗址 | C | exact + loc; exact 58师 result | C | Separate identity supported; no publication coordinate. |
| P01 | exact + 章塘村; 棋盘山遗址 | C | exact + loc; exact archaeological-site result | C | Extent and sensitivity review required. |
| P02 | exact + 芦塘村; related 芦塘/砖窑 results, not exact parent-component label | P | exact + loc; kiln/locality evidence only | P | Cross-city parent/component geometry unresolved. |
| P03 | exact + 周家新村; no useful feature result | N | exact + loc; result displays 集贸路 rather than official 周家新村 | X | Do not publish; resolve locality conflict independently. |
| P04 | exact + 洋津村; 斜里 locality only | P | exact + loc; 斜里 locality only | P | No site-level Point or area evidence; prior rejection stands. |
| P05 | exact + 早木山村; locality/memorial variants only | P | exact; 习凿齿墓 result in correct county context | C | Distinguish tomb from memorial/venue before any Point. |
| P06 | exact + 介桥村; no useful feature result | N | exact + loc; no useful feature result | N | Building-specific evidence required. |
| P07 | exact + 尚睦村; 邓家围屋 variant | P | exact + loc; same variant/locality | P | Prove variant is the designated 围垅屋. |
| P08 | exact; 昼锦堂, `B0IRN5X33Z` | C | exact + 汉泉村; plausible exact feature | P | Existing reviewed production Point remains unchanged. |
| P09 | exact; 蓉泉桥, `B0JU95B3WN` | C | exact + 排江村; plausible bridge result | P | Existing Point unchanged; line alignment needs new evidence. |
| P10 | exact; 新余孔庙 in 魁星路 context | C | exact; exact feature, UID `07db15c210d06fc43913fdd3` | C | Existing reviewed production Point remains unchanged. |
| P11 | exact + 黄坑村; simplified 余庆堂/locality variant | P | exact + loc; no useful protected-building result | N | Character/identity proof required. |
| P12 | exact + 金鸡埔; cemetery/locality variant | P | exact + loc; named military cemetery result | C | Landscape extent and rights required; no centre surrogate. |
| P13 | exact + 田心村; no component-specific result | N | exact + loc; no component-specific result | N | Independent institutional evidence required. |
| P14 | exact + 田心村; no component-specific result | N | exact + loc; no component-specific result | N | Independent institutional evidence required. |
| P15 | exact; 傅抱石先生故居, `B0FFJ6C27Y` | C | exact; exact residence result | C | Existing reviewed production Point remains unchanged. |
| P16 | exact + 仰天岗; battlefield/park vicinity only | P | exact + loc; memorial/park context only | P | Battlefield extent cannot be inferred from park results. |
| P17 | exact; 上海劳动妇女战地服务团旧址, `B0IATLWGUH` | C | exact; exact feature, UID `ad2e56899fa6d998c2f1cf6a` | C | Existing reviewed production Point remains unchanged. |
| P18 | exact + 塔前分场; locality result only | P | exact + loc; locality result only | P | Building identity unresolved. |
| P19 | exact + 暴动举行地; parent POI and prior `B0L1RCC3EM` evidence | C | exact + loc; parent UID `ba0c8d3a43ce938b13293507`; prior plaque evidence isolates component | C | Approved ordinary-Point candidate; draft PR #69 remains paused. |
| P20 | exact + 暴动会议地; parent/locality only | P | exact + loc; parent POI, no component label | P | Do not reuse P19 plaque or Point. |
| P21 | exact + 罗坊镇周家村; 打鼓岭 result in Fenyi rather than official Yushui locality | X | exact + loc; same-name result conflicts with official locality | X | High duplicate/locality risk; independent resolution required. |
| P22 | exact + 潭口村; 第十九集团军总司令部旧址 | C | exact + loc; exact headquarters result | C | Keep separate from N08; feature coordinate required. |
| M01 | exact + 南门村; 碾糠山遗址 | C | exact; exact feature, UID `d9245af98e110664725e80ef` | C | Archaeological extent/sensitivity evidence required. |
| M02 | exact + 棣村; locality result only | P | exact + loc; no useful feature result | N | No site-level evidence. |
| M03 | exact; 洪阳洞遗址, but provider administrative label differs | P | exact; exact name, UID `bc8a4bbaf0cc2094b15c6a63`, label mismatch | P | Resolve jurisdiction and feature extent. |
| M04 | exact + 宠江村; 龚家山遗址 | C | exact + loc; exact archaeological-site result | C | Extent/sensitivity evidence required. |
| M05 | exact + 鹄山村; locality support only | P | exact + loc; locality support only | P | No feature coordinate. |
| M06 | exact + 明星村; no useful feature result | N | exact + loc; weak locality variant only | P | No feature evidence. |
| M07 | exact + 新生村; no useful feature result | N | exact + loc; weak locality variant only | P | No feature evidence. |
| M08 | exact + 陈家村; locality support only | P | exact + loc; locality support only | P | No archaeological feature evidence. |
| M09 | exact + 湖丘村; no useful feature result | N | exact + loc; locality support only | P | No archaeological feature evidence. |
| M10 | exact + 洋潭村; locality/memorial context only | P | exact + loc; locality context only | P | Tomb identity and sensitivity unresolved. |
| M11 | exact + 潭江村; tomb-group/locality result | P | exact + loc; tomb-group/locality result | P | Multipart extent and sensitivity required. |
| M12 | exact + 枫溪村; locality support only | P | exact + loc; no useful feature result | N | Tomb identity and sensitivity unresolved. |
| M13 | exact + 魁星路; 魁星阁 result | C | exact + loc; plausible exact pavilion result | P | Keep distinct from P10; feature evidence required. |
| M14 | exact + 高家村; no useful feature result | N | exact + loc; locality/牌坊 variant | P | Protected arch identity unresolved. |
| M15 | exact + 千秋岭村; no useful feature result | N | exact + loc; locality/building variant | P | Protected building identity unresolved. |
| M16 | exact + 陂下村; no useful feature result | N | exact + loc; generic-name/locality variant | P | Generic-name collision risk. |
| M17 | exact + 水北村; locality/building variant | P | exact + loc; locality/building variant | P | Protected gate identity unresolved. |
| M18 | exact + 慕江村; no useful bridge feature | N | exact + loc; bridge/locality variant | P | Line alignment unavailable. |
| M19 | exact + 水北村; 步桥/locality variant | P | exact + loc; no useful bridge feature | N | Name truncation and alignment unresolved. |
| M20 | exact + 八百桥村; village result only | P | exact + loc; village/locality result only | P | Village is not the designated bridge. |
| M21 | exact + 江东村; exact-name bridge hit | C | exact + loc; no useful feature result | N | One-provider hit is insufficient for alignment. |
| M22 | exact + 四眼井社区; community/same-name results | A | exact + loc; community/same-name results | A | Resolve the protected well separately from the community. |
| M23 | exact + 枫溪村; 枫溪彭氏民居 | C | exact + loc; exact residence result | C | Feature coordinate/meaning still needs corroboration. |
| M24 | exact + 防里村; no useful bridge feature | N | exact + loc; bridge/locality variant | P | Line alignment unavailable. |
| M25 | exact + 防里村; no useful bridge feature | N | exact + loc; bridge/locality variant | P | Line alignment unavailable. |
| M26 | exact + 湖丘村; 状元桥文化基地/locality | P | exact + loc; cultural-base/locality variant | P | Cultural venue does not establish historic bridge alignment. |
| M27 | exact + 介桥村; 毓庆堂/locality variant | P | exact + loc; no useful feature result | N | Keep distinct from P06; building evidence required. |
| M28 | exact + 双源村; 观音岩 locality only | P | exact + loc; 观音岩 locality only | P | Carving/site extent and sensitivity unresolved. |
| M29 | exact + 味塘村; no protected-feature result | N | exact + loc; plaza/brand/locality variants | P | Do not substitute a business or plaza for the carving/spring. |
| M30 | exact + 彭家村; 罗坊会议纪念馆 | C | exact + loc; exact museum result | C | Visitor museum is not a duplicate of N04. |
| M31 | exact + 黄田村; memorial-tower/cemetery variant | P | exact + loc; exact memorial landscape result | C | Authoritative landscape extent required. |
| M32 | exact + 田心村; committee/locality variant | P | exact + loc; no component-specific result | N | Keep separate from P13/P14; feature evidence required. |

## Provider totals and interpretation

| Provider | C | P | A | X | N | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Gaode | 22 | 24 | 1 | 1 | 14 | 62 |
| Baidu | 18 | 31 | 1 | 2 | 10 | 62 |

These totals are search outcomes, not publication-readiness totals. In
particular, all archaeological areas, battlefield/cemetery landscapes, bridge
alignments, and component clusters remain unpublished unless the separate
policy gates are satisfied.

## Stable references and raw-value handling

Stable provider IDs are retained above only where the visible result exposed
them and the identity was sufficiently strong to be a useful future lead.
Baidu detail links also exposed Web Mercator map-centre values for several
results (including N01, N02, N03, P08, P10, P17, M01, and M03). Those display
centres were **not** treated as BD-09 source coordinates and were **not**
converted or selected. Search-map viewport centres and Gaode highlighted areas
were likewise rejected as feature coordinates.

The five existing production Points and paused P19 candidate retain their
previously reviewed raw provider coordinates, conversions, selected WGS84
Points, uncertainty, and meaning. They are reproduced in the canonical audit
for traceability; this search pass did not alter them.

## Known limitations

- Provider index labels can be outdated, simplified, promotional, or assigned
  to a visitor venue rather than the protected fabric.
- Exact-name matches do not prove that a displayed centre represents an
  entrance, building centre, protected-site centre, or administrative centroid.
- Locality-only results are deliberately not promoted to heritage coordinates.
- Provider-drawn boundaries and alignments have unresolved provenance and
  reuse rights.
- P03 and P21 have explicit provider/locality conflicts; M22 has an unresolved
  same-name/community ambiguity.
- Xieli still lacks site-level evidence. Xiabu P19 retains prior
  component-specific plaque evidence; the provider parent result alone would
  not have been sufficient.
