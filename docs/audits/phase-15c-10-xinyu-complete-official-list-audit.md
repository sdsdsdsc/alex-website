# Phase 15C-10 — Complete 2025 Xinyu Official Heritage List Audit

## Scope and outcome

This is a research-only expansion of the completed
[Phase 15C-8 provincial Point re-audit](./phase-15c-8-xinyu-official-point-reaudit.md).
It covers every national-, provincial-, and municipal-level row or separately
named component on the complete 2025 Xinyu register. It does not rewrite Phase
15C-8 as a complete-list audit.

No source data, public-location decision, production GeoJSON, runtime, schema,
validator, renderer, filter, Community Heritage record, Firebase resource, or
production resource changes in this work. Draft PR #69 remains paused and
unmodified. Xiabu and Xieli remain unpublished.

The controlling
[Official Heritage spatial representation and publication policy](../policy/official-record-publication-policy.md)
is unchanged. Official-list inclusion establishes designation authority, not
a publication-ready coordinate or reusable extent. Provider searchability is
evidence, not approval.

## Canonical source

- title: `新余市市级以上文物保护单位名录（2025年）`;
- authority: 新余市文化广电旅游局;
- index number: `3605000013-2025-01167`;
- publication date: `2025-12-26`;
- canonical URL:
  <http://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml>;
- audit access date: `2026-07-31`.

The source table supplies designation level, row/order, designation name,
official heritage category, and administrative location. It does not supply a
period, designation batch, announcement number, protection-range note, or
coordinate for each row. Those fields therefore remain absent from this
canonical transcription unless a separately identified corroborating source
is cited.

## Method and controlled fields

The audit proceeded in this order:

1. transcribe all source rows before evaluating map results;
2. distinguish source row, designation identity, parent, component, and
   proposed public identity;
3. reuse the verified Phase 15C-8 provincial evidence without treating it as
   complete-list work;
4. search every row/component on both Gaode and Baidu using the exact name and,
   where the first result was absent or ambiguous, a locality or component
   variant;
5. compare names, official locality, provider result, earlier evidence, and
   independent institutional or announcement evidence;
6. apply the existing Point, uncertainty, CRS, sensitivity, and misleading-risk
   gates unchanged; and
7. record non-Point research potential without drawing or publishing geometry.

`naturalSpatialForm` uses `point-like`, `areal`, `linear`, `multipart`, or
`uncertain`. `futureNonPointRepresentation` uses `unnecessary`,
`potentially useful`, `evidence required`, or `unsuitable at present`.

Current research classifications are:

- `ready-ordinary-point`;
- `ready-generalized-point`;
- `needs-more-evidence`;
- `withhold`; and
- `deferred-non-point`.

“Needs more evidence” and “deferred non-Point” both remain unpublished.

## Source-count reconciliation

| Measure | National | Provincial | Municipal | Complete list |
| --- | ---: | ---: | ---: | ---: |
| Source rows / separately mapped row identities | 8 | 22 | 32 | 62 |
| Explicitly separately named components under a parent | 4 | 3 | 0 | 7 |
| Reconciled designation identities | 5 | 21 | 32 | 58 |
| Proposed public map identities | 8 | 22 | 32 | 62 |

The page heading says `国家重点文物保护单位（4处8点）`, but the table contains
five independently designated national identities: 凤凰山铁矿遗址, 拾年山遗址,
the four-component 罗坊会议和兴国调查会议旧址, 水西红三军团指挥部旧址, and
上高会战第58师师部遗址. The last row has no displayed sequence number.
National announcement evidence identifies 水西 as an eighth-batch national
designation and the 58th Division headquarters as a separate seventh-batch
designation. The audit therefore preserves the source heading, records eight
rows, resolves five designation identities, and flags the heading/table
inconsistency rather than silently folding unrelated sites together.

The provincial heading says `20处22点`. Its table has numbered entries 1–20,
an unnumbered Xinyu component of the cross-city 袁州明代城墙砖窑址群, and a
second component row for 下保农民暴动旧址. This yields 22 rows and 21
designation identities in the displayed Xinyu universe, consistent with the
relationship already documented by Phase 15C-8.

## Complete canonical inventory and current classification

The five simplified public types sit alongside, and never replace, the
official Chinese category. Type assignments are provisional project
presentation decisions. `观音岩遗址` is provisionally Archaeological sites;
`龙施泉` is provisionally Other heritage.

| ID | Source order; exact official identity; official location | Official category → provisional public type | Parent/component treatment | Natural form | Future non-Point | Current research classification |
| --- | --- | --- | --- | --- | --- | --- |
| N01 | 国家 1; 凤凰山铁矿遗址; 分宜县湖泽镇闹洲村 | 古遗址 → Archaeological sites | independent designation | areal | evidence required | needs-more-evidence |
| N02 | 国家 2; 拾年山遗址; 渝水区水北镇南陂村 | 古遗址 → Archaeological sites | independent designation | areal | evidence required | needs-more-evidence |
| N03 | 国家 3a; 罗坊会议和兴国调查会议旧址——罗坊会议旧址; 渝水区罗坊镇陈家闹村 | 近现代重要史迹 → Buildings & structures | component 1 of national parent | point-like | unnecessary | needs-more-evidence |
| N04 | 国家 3b; 罗坊会议和兴国调查会议旧址——兴国调查会旧址; 渝水区罗坊镇彭家村 | 近现代重要史迹 → Buildings & structures | component 2 of national parent | point-like | unnecessary | needs-more-evidence |
| N05 | 国家 3c; 罗坊会议和兴国调查会议旧址——红一方面军总部旧址与朱德旧居; 渝水区罗坊镇院前村 | 近现代重要史迹 → Buildings & structures | component 3 of national parent; provider exposes sublabels | multipart | evidence required | needs-more-evidence |
| N06 | 国家 3d; 罗坊会议和兴国调查会议旧址——江西省苏维埃政府旧址与曾山旧居; 渝水区罗坊镇院前村 | 近现代重要史迹 → Buildings & structures | component 4 of national parent; provider exposes sublabels | multipart | evidence required | needs-more-evidence |
| N07 | 国家 4; 水西红三军团指挥部旧址; 高新区水西镇沙陂村 | 近现代重要史迹 → Buildings & structures | separate eighth-batch national designation | point-like | unnecessary | needs-more-evidence |
| N08 | 国家 unnumbered after 4; 上高会战第58师师部遗址; 渝水区下村镇大桥村 | 近现代重要史迹 → Buildings & structures | separate seventh-batch national designation; source numbering anomaly | point-like | unnecessary | needs-more-evidence |
| P01 | 省 1; 棋盘山遗址; 渝水区罗坊镇章塘村 | 古遗址 → Archaeological sites | independent designation | areal | evidence required | needs-more-evidence |
| P02 | 省 unnumbered after 1; 袁州明代城墙砖窑址群（芦塘窑址）; 分宜县分宜镇芦塘村 | 古遗址 → Archaeological sites | 芦塘 component of cross-city parent | areal | evidence required | needs-more-evidence |
| P03 | 省 2; 彭家山遗址; 高新区水西村周家新村 | 古遗址 → Archaeological sites | independent designation | areal | evidence required | needs-more-evidence |
| P04 | 省 3; 斜里遗址; 渝水区珠珊镇洋津村 | 古遗址 → Archaeological sites | Xieli; independent designation | areal | unsuitable at present | needs-more-evidence |
| P05 | 省 4; 习凿齿墓; 分宜县洞村乡早木山村 | 古墓葬 → Archaeological sites | tomb distinct from memorial/provider venue | point-like | unnecessary | needs-more-evidence |
| P06 | 省 5; 飨褒堂; 分宜县分宜镇介桥村 | 古建筑 → Buildings & structures | independent designation | point-like | unnecessary | needs-more-evidence |
| P07 | 省 6; 尚睦邓家围垅屋; 分宜县湖泽镇尚睦村 | 古建筑 → Buildings & structures | provider variant 邓家围屋 requires identity proof | point-like | unnecessary | needs-more-evidence |
| P08 | 省 7; 昼锦堂; 仙女湖区观巢镇汉泉村 | 古建筑 → Buildings & structures | existing production identity | point-like | unnecessary | ready-ordinary-point |
| P09 | 省 8; 蓉泉桥; 渝水区水北镇排江村 | 古建筑 → Routes & infrastructure | existing production identity | linear | potentially useful | ready-ordinary-point; Point now, line later |
| P10 | 省 9; 新余孔庙; 渝水区城南办事处魁星路 | 古建筑 → Buildings & structures | existing production identity | point-like | unnecessary | ready-ordinary-point |
| P11 | 省 10; 馀庆堂; 渝水区水北镇黄坑村 | 古建筑 → Buildings & structures | provider simplified-character variant unresolved | point-like | unnecessary | needs-more-evidence |
| P12 | 省 11; 分宜钤岗上高会战中国军队阵亡将士陵园; 分宜县钤山镇金鸡埔村 | 近现代重要史迹 → Parks, gardens & landscapes | 金鸡埔 provider variant requires extent/identity reconciliation | areal | evidence required | deferred-non-point |
| P13 | 省 12; 中共分宜临时县委旧址; 分宜县钤山镇田心村 | 近现代重要史迹 → Buildings & structures | distinct Tianxin site | point-like | unnecessary | needs-more-evidence |
| P14 | 省 13; 儒延坊肃反委员会旧址; 分宜县钤山镇田心村 | 近现代重要史迹 → Buildings & structures | distinct Tianxin site | point-like | unnecessary | needs-more-evidence |
| P15 | 省 14; 傅抱石故居; 渝水区罗坊镇章塘村 | 近现代重要史迹 → Buildings & structures | existing production identity; provider adds 先生 | point-like | unnecessary | ready-ordinary-point |
| P16 | 省 15; 北伐军仰天岗战场遗址; 仙女湖区城北办事处 | 近现代重要史迹 → Parks, gardens & landscapes | battlefield, not interchangeable with memorial square/forest park | areal | evidence required | deferred-non-point |
| P17 | 省 16; 上海劳动妇女战地服务团旧址; 渝水区珠珊镇沙头村 | 近现代重要史迹 → Buildings & structures | existing production identity | point-like | unnecessary | ready-ordinary-point |
| P18 | 省 17; 中共花桥党支部旧址; 仙女湖区九龙山乡塔前分场 | 近现代重要史迹 → Buildings & structures | locality result is not building identity | point-like | unnecessary | needs-more-evidence |
| P19 | 省 18a; 下保农民暴动旧址——暴动举行地旧址; 渝水区良山镇下保村 | 近现代重要史迹 → Buildings & structures | Xiabu component 1 only | point-like | evidence required only for footprint; ordinary Point sufficient now | ready-ordinary-point; PR #69 remains paused |
| P20 | 省 18b; 下保农民暴动旧址——暴动会议地旧址; 渝水区良山镇下保村 | 近现代重要史迹 → Buildings & structures | Xiabu component 2; parent POI does not resolve component | point-like | evidence required | needs-more-evidence |
| P21 | 省 19; 打鼓岭遗址; 渝水区罗坊镇周家村 | 古遗址 → Archaeological sites | same-name provider locality conflicts with official district/location | areal | evidence required | needs-more-evidence |
| P22 | 省 20; 渝水周家上高会战中国军队第十九集团军总司令部旧址; 渝水区珠珊镇潭口村 | 近现代重要史迹 → Buildings & structures | distinct from N08 58th Division headquarters | point-like | unnecessary | needs-more-evidence |
| M01 | 市 1; 碾糠山遗址; 渝水区南安乡南门村 | 古遗址 → Archaeological sites | independent designation | areal | evidence required | needs-more-evidence |
| M02 | 市 2; 蛇脑山遗址; 渝水区人和乡棣村 | 古遗址 → Archaeological sites | locality only | areal | evidence required | needs-more-evidence |
| M03 | 市 3; 洪阳洞遗址; 仙女湖区钤阳办事处 | 古遗址 → Archaeological sites | exact provider name but administrative-label mismatch needs resolution | areal | evidence required | needs-more-evidence |
| M04 | 市 4; 龚家山遗址; 高新区水西镇宠江村 | 古遗址 → Archaeological sites | exact provider result | areal | evidence required | needs-more-evidence |
| M05 | 市 5; 何家垴遗址; 渝水区鹄山乡鹄山村 | 古遗址 → Archaeological sites | locality only | areal | evidence required | needs-more-evidence |
| M06 | 市 6; 麻岭山遗址; 渝水区新溪乡明星村 | 古遗址 → Archaeological sites | no useful heritage result | areal | evidence required | needs-more-evidence |
| M07 | 市 7; 凤形山遗址; 渝水区南安乡新生村 | 古遗址 → Archaeological sites | no useful heritage result | areal | evidence required | needs-more-evidence |
| M08 | 市 8; 刘家山遗址; 渝水区罗坊镇陈家村 | 古遗址 → Archaeological sites | locality only | areal | evidence required | needs-more-evidence |
| M09 | 市 9; 社山坪遗址; 分宜县杨桥镇湖丘村 | 古遗址 → Archaeological sites | locality only | areal | evidence required | needs-more-evidence |
| M10 | 市 10; 大理寺左少卿张固墓; 仙女湖区观巢镇洋潭村 | 古墓葬 → Archaeological sites | locality only | point-like | unnecessary | needs-more-evidence |
| M11 | 市 11; 胡家山古墓群; 渝水区水北镇潭江村 | 古墓葬 → Archaeological sites | tomb group | multipart | evidence required | needs-more-evidence |
| M12 | 市 12; 彭嗣元墓; 分宜县钤山镇枫溪村 | 古墓葬 → Archaeological sites | locality only | point-like | unnecessary | needs-more-evidence |
| M13 | 市 13; 魁星阁; 渝水区城南办事处魁星路 | 古建筑 → Buildings & structures | distinct from nearby P10 新余孔庙 | point-like | unnecessary | needs-more-evidence |
| M14 | 市 14; 北山牌坊; 渝水区界水乡高家村 | 古建筑 → Buildings & structures | locality only | point-like | unnecessary | needs-more-evidence |
| M15 | 市 15; 夫子堂; 渝水区下村镇千秋岭村 | 古建筑 → Buildings & structures | locality only | point-like | unnecessary | needs-more-evidence |
| M16 | 市 16; 将军府; 渝水区罗坊镇陂下村 | 古建筑 → Buildings & structures | generic name/locality unresolved | point-like | unnecessary | needs-more-evidence |
| M17 | 市 17; 骢马门; 渝水区水北镇水北村 | 古建筑 → Buildings & structures | locality only | point-like | unnecessary | needs-more-evidence |
| M18 | 市 18; 官溪桥; 渝水区水北镇慕江村 | 古建筑 → Routes & infrastructure | bridge feature not resolved | linear | evidence required | deferred-non-point |
| M19 | 市 19; 檀步桥; 渝水区水北镇水北村 | 古建筑 → Routes & infrastructure | provider returns locality/步桥, not feature | linear | evidence required | deferred-non-point |
| M20 | 市 20; 八百桥; 渝水区良山镇八百桥村 | 古建筑 → Routes & infrastructure | village identity does not establish bridge feature | linear | evidence required | deferred-non-point |
| M21 | 市 21; 八斗桥; 渝水区下村镇江东村 | 古建筑 → Routes & infrastructure | Gaode exact-name hit lacks independent alignment evidence | linear | evidence required | deferred-non-point |
| M22 | 市 22; 四眼井; 渝水区城南办事处四眼井社区 | 古建筑 → Buildings & structures | community name does not resolve the protected well | point-like | unnecessary | needs-more-evidence |
| M23 | 市 23; 枫溪彭氏民居; 分宜县钤山镇枫溪村 | 古建筑 → Buildings & structures | exact provider result | point-like | unnecessary | needs-more-evidence |
| M24 | 市 24; 星拱桥; 分宜县钤山镇防里村 | 古建筑 → Routes & infrastructure | locality only | linear | evidence required | deferred-non-point |
| M25 | 市 25; 登瀛桥; 分宜县钤山镇防里村 | 古建筑 → Routes & infrastructure | locality only | linear | evidence required | deferred-non-point |
| M26 | 市 26; 状元桥; 分宜县杨桥镇湖丘村 | 古建筑 → Routes & infrastructure | provider cultural-base label supports locality, not alignment | linear | evidence required | deferred-non-point |
| M27 | 市 27; 毓庆堂公祠; 分宜县分宜镇介桥村 | 古建筑 → Buildings & structures | distinct from P06 飨褒堂 in the same village | point-like | unnecessary | needs-more-evidence |
| M28 | 市 28; 观音岩遗址; 分宜县钤山镇双源村 | 古石刻 → Archaeological sites (provisional) | provider gives 观音岩 locality only | areal | evidence required | needs-more-evidence |
| M29 | 市 29; 龙施泉; 渝水区人和乡味塘村 | 古石刻 → Other heritage (provisional) | plaza/brand results do not resolve protected carving/spring | point-like | unnecessary | needs-more-evidence |
| M30 | 市 30; 罗坊会议纪念馆; 渝水区罗坊镇彭家村 | 近现代重要史迹 → Buildings & structures | visitor museum; related to but not duplicate of N04 | point-like | unnecessary | needs-more-evidence |
| M31 | 市 31; 九龙山革命烈士纪念塔与墓; 仙女湖区九龙山乡黄田村 | 近现代重要史迹 → Parks, gardens & landscapes | provider variant identifies memorial landscape | areal | evidence required | deferred-non-point |
| M32 | 市 32; 分宜中心县委旧址; 分宜县钤山镇田心村 | 近现代重要史迹 → Buildings & structures | distinct Tianxin site | point-like | unnecessary | needs-more-evidence |

## Reproducible totals

### By designation level

- national source rows: **8**;
- provincial source rows: **22**;
- municipal source rows: **32**;
- total source rows / proposed public identities: **62**;
- reconciled designation identities: **58**.

### By official category

- 古遗址: **16**;
- 古墓葬: **4**;
- 古建筑: **21**;
- 古石刻: **2**;
- 近现代重要史迹: **19**;
- total: **62**.

### By provisional five-type presentation

- Buildings & structures: **29**;
- Archaeological sites: **21**;
- Parks, gardens & landscapes: **3**;
- Routes & infrastructure: **8**;
- Other heritage: **1**;
- total: **62**.

### By current research classification

- ready to publish as ordinary Point: **6** — five already published Points
  plus Xiabu component P19;
- ready only as generalized Point: **0**;
- needs more evidence: **46**;
- withhold: **0**;
- deferred to non-Point research: **10**;
- total: **62**.

The six ordinary-Point rows are not six new publications. Five are the existing
production Points. P19 remains only the approved-but-paused PR #69 proposal.
This audit creates no implementation approval for another row.

## Ready-Point coordinate baseline

The five production decisions remain authoritative and unchanged:

| Identity | Preserved provider evidence | Active WGS84 Point | Uncertainty | Meaning |
| --- | --- | --- | ---: | --- |
| P08 昼锦堂 | Gaode `B0IRN5X33Z`, GCJ-02 `[114.845605, 27.851425]` | `[114.840705, 27.854836]` | 125 m | visitor reference |
| P09 蓉泉桥 | Gaode `B0JU95B3WN`, GCJ-02 `[115.052627, 28.070835]` | `[115.047377, 28.074011]` | 75 m | heritage feature |
| P10 新余孔庙 | mainland Google GCJ-02 `[114.941361, 27.794748]`, reconciled to named OSM WGS84 compound | `[114.937042, 27.798123]` | 75 m | compound centre |
| P15 傅抱石故居 | Gaode `B0FFJ6C27Y`, GCJ-02 `[115.098417, 27.908861]` | `[115.093120, 27.911966]` | 100 m | visitor reference |
| P17 上海劳动妇女战地服务团旧址 | Gaode `B0IATLWGUH`, GCJ-02 `[114.977746, 27.770564]` | `[114.972780, 27.773914]` | 100 m | visitor reference |

For the four Gaode-selected production Points, the preserved project method is
the deterministic ten-iteration inverse GCJ-02 transform using Krasovsky 1940
constants `a=6378245.0` and `ee=0.00669342162296594323`, followed by the
documented record-specific reconciliation. P10 retains its separately reviewed
Google/OSM reconciliation. No coordinate is recalculated in this audit.

### Xiabu

P19 remains supported exactly as Phase 15C-5 and Phase 15C-8 recorded:

- Gaode `B0L1RCC3EM`, GCJ-02 `[114.999665, 27.665090]` →
  WGS84 `[114.994632317, 27.668364844]`;
- Baidu UID `ba0c8d3a43ce938b13293507`, BD-09
  `[115.007145335, 27.670165011]` → GCJ-02 → WGS84
  `[114.995569672, 27.667620470]`;
- selected component-reference Point `[114.995570, 27.667620]`;
- horizontal uncertainty: 150 m.

The 2026-07-31 searches still find the Baidu parent POI in the correct locality
but do not expose a separate component label. The previously reviewed plaque
photograph remains the component-specific evidence. The conclusion is
unchanged: P19 is the only unpublished ordinary-Point candidate, P20 needs
component-specific evidence, and PR #69 remains paused.

### Xieli

The systematic searches returned Xieli/斜里 locality results but no
component-specific heritage POI, raw coordinate with verified datum, or new
independent evidence that resolves the earlier limitations. The rejected
60 × 60 m square and uncertainty-area constructions remain rejected. P04 is
classified `needs-more-evidence`, with a generalized Point as the only
potential future public form if its datum, styling, persistent limitations,
uncertainty, sensitivity, and misleading-risk gates are all separately met.

## Identity reconciliation and duplicate-risk register

| Identities compared | Finding | Canonical treatment |
| --- | --- | --- |
| N03–N06 and national parent 罗坊会议和兴国调查会议旧址 | Four separately named components of one national designation | Preserve one designation identity and four proposed component map identities; never publish a component as the whole parent. |
| N04 兴国调查会旧址 and M30 罗坊会议纪念馆 | Related visitor complex and same town/village context, but a historic component and a museum are not interchangeable | Keep separate; require feature-specific evidence and wording. |
| N07 水西红三军团指挥部旧址 and N08 58师师部遗址 | Source layout could imply one numbered group, but national batch evidence and distinct history/locality show separate designations | Keep separate; flag source heading/number anomaly. |
| N08, P12, and P22 | All relate to the 上高会战, but are respectively a division headquarters, a military cemetery, and a nineteenth-group-army headquarters in different localities | Keep three separate identities. |
| P02 袁州明代城墙砖窑址群（芦塘窑址） | One Xinyu kiln component of a cross-city parent | Public identity, if ever approved, is the 芦塘 component; do not imply the complete multi-city kiln group. |
| P13, P14, and M32 in 田心村 | Independent place descriptions list the temporary county committee, purge committee, and central county committee as separate sites | Keep three identities; no locality-centre Point may stand for all three. |
| P19 and P20 under 下保农民暴动旧址 | Two separately protected components | Preserve two map identities; the P19 plaque must not be reused for P20. |
| P10 新余孔庙 and M13 魁星阁 | Same road context but different named protected features | Keep separate; verify whether their compounds touch before any spatial inference. |
| P06 飨褒堂 and M27 毓庆堂公祠 | Same village but different official names and designation levels | Keep separate pending feature-level corroboration. |
| Provider variants 下保/下布 and Xiabu/Xiabao | The official Chinese source is consistently `下保`; “Xiabu” is the project’s existing English task label | Preserve `下保` as the official identity; do not create a separate 下布 record. |

No confirmed same-physical-identity duplicate remains in the current 62-row
public-identity model. Historical upgrades for national sites are provenance,
not additional active rows in the 2025 table.

## Independent corroboration used

- the State Council sixth-batch announcement confirms the national parent
  罗坊会议和兴国调查会旧址 and its 1930 period;
- the State Council seventh-batch list confirms 凤凰山铁矿遗址 (唐至明) and
  拾年山遗址 (新石器时代) as separate national designations;
- the Xinyu Museum record for 拾年山 confirms the official locality and
  archaeological identity;
- national-list and institutional records distinguish the seventh-batch 58th
  Division headquarters from the eighth-batch 水西红三军团指挥部旧址;
- the sixth-batch Jiangxi announcement confirms the provincial parent and
  component structures, including the multi-city kiln group and two 下保
  components;
- independent Tianxin descriptions enumerate the three committee sites
  separately; and
- the prior Phase 15C-5 plaque review remains the strongest P19
  component-specific evidence.

These sources strengthen identity and history. They do not supply reusable
geometry or automatically approve a Point.

## Limitations and next evidence

Commercial provider result coordinates normally use GCJ-02 (Gaode) or BD-09
(Baidu), but this audit does not infer a CRS for a captured map-centre value
without record-specific evidence. Baidu detail URLs sometimes exposed Web
Mercator centres and stable UIDs; Gaode sometimes exposed stable place IDs.
Those raw values are retained only as research leads unless the POI identity,
coordinate meaning, CRS, deterministic conversion, uncertainty, and
independent corroboration all pass the publication policy.

The provider matrix deliberately distinguishes exact heritage results,
variant/locality results, conflicting results, ambiguous community names, and
no useful result. A locality match is not a site coordinate. A provider map
highlight or boundary is not reusable geometry.

Next evidence priorities are:

1. component- or feature-specific institutional photographs, plaques, plans,
   or coordinates for the strongest exact-name provider results;
2. official or scholarly extent evidence for the
   [non-Point candidate inventory](../research/phase-15c-10-xinyu-non-point-candidate-inventory.md);
3. explicit provider CRS and raw-coordinate preservation before any new Point
   recommendation;
4. resolution of P03 and P21 provider/locality conflicts; and
5. building-specific evidence for the Tianxin, Luofang, and Xiabu component
   clusters.

The full controlled search record is in the
[provider evidence matrix](../research/phase-15c-10-xinyu-provider-evidence-matrix.md).
