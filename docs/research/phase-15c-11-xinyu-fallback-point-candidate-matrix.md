# Phase 15C-11 — Xinyu fallback Point candidate matrix

## Purpose and source

This is the reproducible evidence and decision matrix for the
[fallback Point audit](../audits/phase-15c-11-xinyu-fallback-point-evidence-audit.md).
It does not create coordinates or implementation data.

Provider summaries are inherited from the complete
[Phase 15C-10 provider matrix](./phase-15c-10-xinyu-provider-evidence-matrix.md).
`C`, `P`, `N`, and `X` retain that matrix's meanings. The official identity and
locality are inherited from the
[canonical 62-row audit](../audits/phase-15c-10-xinyu-complete-official-list-audit.md).

## Set construction

| Set | Count | Members |
| --- | ---: | --- |
| Unpublished with at least one provider `C` | 19 | N01–N08; P01, P05, P12, P22; M01, M04, M13, M21, M23, M30, M31 |
| Unpublished future non-Point candidates | 28 | all 29 Phase 15C-10 non-Point candidates except published control P09 |
| Intersection | 8 | N01, N02, P01, P12, M01, M04, M21, M31 |
| Union | **39** | `19 + 28 - 8` |

The union contains 28 natural line/area candidates, nine point-like strong
provider candidates, and two multipart modern-site components (N05/N06).

## Evidence codes

Independent corroboration:

- `SC6` — State Council sixth-batch parent/designation evidence;
- `SC7` — State Council seventh-batch identity/batch evidence;
- `SC8` — State Council eighth-batch identity/batch evidence;
- `XM` — Xinyu Museum institutional description;
- `JX6` — Jiangxi sixth-batch provincial announcement/component evidence;
- `O` — the controlling 2025 Xinyu official list only;
- `none` — no additional feature-specific corroboration recorded.

These sources can corroborate identity or component structure without
supplying a usable coordinate. `Raw/CRS` is `none / unresolved` for every
candidate. Therefore conversion, WGS84 selection, and distance comparison are
also unresolved for every candidate; no viewport/display-centre value is used.

## Candidate evidence and outcome

| ID; official identity; locality | Natural form | Gaode / Baidu result details | Independent corroboration | Candidate Point meaning if evidence later passes | Uncertainty, sensitivity, and misleading risk | Outcome |
| --- | --- | --- | --- | --- | --- | --- |
| N01 凤凰山铁矿遗址; 分宜县湖泽镇闹洲村 | areal | C: exact `B0JRSCISB6`, Fenyi/Huze / C: exact UID `86025f5d9df5a9936e476023`, heritage result on 215乡道 | SC7 | generalized-reference-point; site reference, not mine extent | Archaeological/mining extent, multipart and sensitivity unresolved | Withhold pending evidence |
| N02 拾年山遗址; 渝水区水北镇南陂村 | areal | C: exact in Shubei/Nanbei / C: exact UID `b526ec6bba9faf824007c130` | SC7, XM | generalized-reference-point; archaeological site reference | Archaeological sensitivity and extent unresolved | Withhold pending evidence |
| N03 罗坊会议旧址; 渝水区罗坊镇陈家闹村 | point-like component | C: exact component/locality / C: exact UID `52eb749fe214f22543afe6fe`; related visitor-complex results | SC6 | reviewed-location-point for component only | Parent/component substitution and complex-centre risk unresolved | Withhold pending evidence |
| N04 兴国调查会旧址; 渝水区罗坊镇彭家村 | point-like component | C: exact/locality / P: visitor-complex result does not isolate component | SC6 | reviewed-location-point for component only | Must remain separate from M30 museum; feature meaning unresolved | Withhold pending evidence |
| N05 红一方面军总部旧址与朱德旧居; 渝水区罗坊镇院前村 | multipart component | C: headquarters/residence sublabels / P: related old-site labels | SC6 | visitor-reference-point only if one honest shared reference is evidenced | Two subfeatures; a single centre may misrepresent both | Withhold pending evidence |
| N06 江西省苏维埃政府旧址与曾山旧居; 渝水区罗坊镇院前村 | multipart component | C: government/residence sublabels / P: related old-site labels | SC6 | visitor-reference-point only if one honest shared reference is evidenced | Two subfeatures; component topology and sensitivity unresolved | Withhold pending evidence |
| N07 水西红三军团指挥部旧址; 高新区水西镇沙陂村 | point-like | C: exact/locality / C: exact revolutionary-site result in 水西镇 | SC8 | reviewed-location-point | Raw feature coordinate, uncertainty, access and fabric meaning unresolved | Withhold pending evidence |
| N08 上高会战第58师师部遗址; 渝水区下村镇大桥村 | point-like | C: exact/locality / C: exact longer-form 74军第58师 result in 大桥村 | SC7 | reviewed-location-point | Must remain separate from P22; raw coordinate and uncertainty unresolved | Withhold pending evidence |
| P01 棋盘山遗址; 渝水区罗坊镇章塘村 | areal | C: exact/locality / C: exact archaeological-site result | O | generalized-reference-point; archaeological site reference | Site extent, sensitivity and nearby-identity risk unresolved | Withhold pending evidence |
| P02 袁州明代城墙砖窑址群（芦塘窑址）; 分宜县分宜镇芦塘村 | areal component | P: related 芦塘/kiln results / P: kiln/locality only | JX6 | generalized-reference-point for Xinyu 芦塘 component only | Cross-city parent, kiln components and extent unresolved | Withhold pending evidence |
| P03 彭家山遗址; 高新区水西村周家新村 | areal | N: no feature / X: result on 集贸路 conflicts with official locality | O | generalized-reference-point only after identity conflict is resolved | Explicit locality conflict; misleading risk fails | Withhold pending evidence |
| P04 斜里遗址; 渝水区珠珊镇洋津村 | areal | P: 斜里 locality / P: 斜里 locality | O; Phase 15C-7 risk review | generalized-reference-point only if datum and presentation gates pass | Prior synthetic areas rejected; 500 m uncertainty and sensitivity unresolved | Withhold pending evidence |
| P05 习凿齿墓; 分宜县洞村乡早木山村 | point-like | P: locality/memorial variants / C: exact tomb result in county context | O | generalized-reference-point or reviewed-location-point after tomb/venue distinction | Tomb sensitivity and memorial substitution unresolved | Withhold pending evidence |
| P12 分宜钤岗上高会战中国军队阵亡将士陵园; 分宜县钤山镇金鸡埔村 | areal | P: cemetery/locality variant / C: 金鸡埔抗日阵亡将士陵园遗址 on 223乡道 | O | visitor-reference-point; never asserted as cemetery extent | Cemetery landscape, access, extent and centre-surrogate risk unresolved | Withhold pending evidence |
| P16 北伐军仰天岗战场遗址; 仙女湖区城北办事处 | areal | P: battlefield/park vicinity / P: memorial/park context | O | generalized-reference-point for battlefield context only | Landscape-scale uncertainty; forest-park substitution would mislead | Withhold pending evidence |
| P21 打鼓岭遗址; 渝水区罗坊镇周家村 | areal | X: Fenyi same-name result conflicts / X: same conflict | O | generalized-reference-point only after identity conflict is resolved | Explicit locality conflict; misleading risk fails | Withhold pending evidence |
| P22 渝水周家上高会战中国军队第十九集团军总司令部旧址; 渝水区珠珊镇潭口村 | point-like | C: exact/locality / C: exact longer-form result near 新余黄冈学校 | O | reviewed-location-point | Must remain separate from N08; address is not a feature coordinate | Withhold pending evidence |
| M01 碾糠山遗址; 渝水区南安乡南门村 | areal | C: exact/locality / C: exact UID `d9245af98e110664725e80ef` | O | generalized-reference-point; archaeological site reference | Extent and archaeological sensitivity unresolved | Withhold pending evidence |
| M02 蛇脑山遗址; 渝水区人和乡棣村 | areal | P: locality only / N: no feature | none | generalized-reference-point only after site identity is established | Locality-centre substitution and sensitivity unresolved | Withhold pending evidence |
| M03 洪阳洞遗址; 仙女湖区钤阳办事处 | areal/cave | P: exact name, administrative mismatch / P: exact UID `bc8a4bbaf0cc2094b15c6a63`, same mismatch | O | generalized-reference-point only after jurisdiction reconciliation | Cave/surface meaning, jurisdiction, access and sensitivity unresolved | Withhold pending evidence |
| M04 龚家山遗址; 高新区水西镇宠江村 | areal | C: exact/locality / C: exact archaeological-site result | O | generalized-reference-point; archaeological site reference | Extent and archaeological sensitivity unresolved | Withhold pending evidence |
| M05 何家垴遗址; 渝水区鹄山乡鹄山村 | areal | P: locality only / P: locality only | none | generalized-reference-point only after site identity is established | Locality-centre substitution and sensitivity unresolved | Withhold pending evidence |
| M06 麻岭山遗址; 渝水区新溪乡明星村 | areal | N: no feature / P: weak locality variant | none | generalized-reference-point only after site identity is established | No feature evidence; sensitivity unresolved | Withhold pending evidence |
| M07 凤形山遗址; 渝水区南安乡新生村 | areal | N: no feature / P: weak locality variant | none | generalized-reference-point only after site identity is established | Generic hill/locality substitution and sensitivity unresolved | Withhold pending evidence |
| M08 刘家山遗址; 渝水区罗坊镇陈家村 | areal | P: locality only / P: locality only | none | generalized-reference-point only after site identity is established | Generic hill/locality substitution and sensitivity unresolved | Withhold pending evidence |
| M09 社山坪遗址; 分宜县杨桥镇湖丘村 | areal | N: no feature / P: locality only | none | generalized-reference-point only after site identity is established | No archaeological feature evidence; sensitivity unresolved | Withhold pending evidence |
| M11 胡家山古墓群; 渝水区水北镇潭江村 | multipart area | P: tomb-group/locality / P: tomb-group/locality | O | generalized-reference-point only if group-level disclosure is safe | Individual-grave disclosure, multipart extent and sensitivity unresolved | Withhold pending evidence |
| M13 魁星阁; 渝水区城南办事处魁星路 | point-like | C: exact pavilion/locality / P: plausible pavilion result | O | reviewed-location-point | Must remain distinct from P10; compound relationship unresolved | Withhold pending evidence |
| M18 官溪桥; 渝水区水北镇慕江村 | linear | N: no bridge feature / P: bridge/locality variant | none | reviewed-location-point or visitor-reference-point, then line later | Feature, survival, endpoints and access unresolved | Withhold pending evidence |
| M19 檀步桥; 渝水区水北镇水北村 | linear | P: 步桥/locality variant / N: no bridge feature | none | reviewed-location-point, then line later | Name truncation, feature identity and alignment unresolved | Withhold pending evidence |
| M20 八百桥; 渝水区良山镇八百桥村 | linear | P: village only / P: village/locality only | none | reviewed-location-point, then line later, only after bridge isolation | Village-centre substitution would mislead | Withhold pending evidence |
| M21 八斗桥; 渝水区下村镇江东村 | linear | C: exact-name Gaode hit / N: focused Baidu recheck returned locality facilities only | O | reviewed-location-point, then line later | One-provider feature lead; alignment and independent evidence unresolved | Withhold pending evidence |
| M23 枫溪彭氏民居; 分宜县钤山镇枫溪村 | point-like | C: exact/locality / C: exact tourism result, 233乡道西50米 | O | reviewed-location-point or visitor-reference-point after centre meaning is known | Residence/entrance/visitor-facility meaning unresolved | Withhold pending evidence |
| M24 星拱桥; 分宜县钤山镇防里村 | linear | N: no bridge feature / P: bridge/locality variant | none | reviewed-location-point, then line later | Same-village bridge confusion with M25; alignment unresolved | Withhold pending evidence |
| M25 登瀛桥; 分宜县钤山镇防里村 | linear | N: no bridge feature / P: bridge/locality variant | none | reviewed-location-point, then line later | Same-village bridge confusion with M24; alignment unresolved | Withhold pending evidence |
| M26 状元桥; 分宜县杨桥镇湖丘村 | linear | P: cultural-base/locality / P: cultural-base/locality | none | reviewed-location-point, then line later, only after historic bridge isolation | Cultural venue is not historic bridge fabric or alignment | Withhold pending evidence |
| M28 观音岩遗址; 分宜县钤山镇双源村 | areal | P: 观音岩 locality / P: 观音岩 locality | none | generalized-reference-point only after carving/site identity is established | Public type, rock/site extent, access and sensitivity unresolved | Withhold pending evidence |
| M30 罗坊会议纪念馆; 渝水区罗坊镇彭家村 | point-like visitor venue | C: exact museum/locality / C: exact museum with visitor-complex subresults | O | visitor-reference-point | Must not be substituted for N04 historic component | Withhold pending evidence |
| M31 九龙山革命烈士纪念塔与墓; 仙女湖区九龙山乡黄田村 | areal/multipart | P: memorial/cemetery variant / C: exact memorial-landscape result | O | visitor-reference-point for memorial landscape only | Tower, graves, grounds, public-park boundary and sensitivity unresolved | Withhold pending evidence |

## Gate decision matrix

Statuses are `Pass`, `Conditional`, `Fail`, `Unresolved`, or `Not applicable`.
The gates are defined in the audit. `G4` and `G5` are mandatory and unresolved
for every row, which is independently sufficient to require withholding.

| ID | G1 identity | G2 provider feature | G3 independent | G4 raw/CRS | G5 WGS84 reconciliation | G6 meaning/uncertainty | G7 sensitivity | G8 misleading risk | Final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N01 | Pass | Conditional | Conditional | Unresolved | Unresolved | Conditional | Unresolved | Unresolved | Withhold |
| N02 | Pass | Conditional | Conditional | Unresolved | Unresolved | Conditional | Unresolved | Unresolved | Withhold |
| N03 | Pass | Conditional | Conditional | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| N04 | Pass | Conditional | Conditional | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| N05 | Pass | Conditional | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Withhold |
| N06 | Pass | Conditional | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Withhold |
| N07 | Pass | Conditional | Conditional | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| N08 | Pass | Conditional | Conditional | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| P01 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Unresolved | Withhold |
| P02 | Pass | Fail | Conditional | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Withhold |
| P03 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| P04 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Fail | Withhold |
| P05 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Unresolved | Withhold |
| P12 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Fail | Withhold |
| P16 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Fail | Withhold |
| P21 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| P22 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| M01 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Unresolved | Withhold |
| M02 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| M03 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Withhold |
| M04 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Unresolved | Withhold |
| M05 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| M06 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| M07 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| M08 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| M09 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| M11 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Withhold |
| M13 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| M18 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Fail | Withhold |
| M19 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Fail | Withhold |
| M20 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Fail | Withhold |
| M21 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| M23 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| M24 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Fail | Withhold |
| M25 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Fail | Withhold |
| M26 | Pass | Fail | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Fail | Withhold |
| M28 | Pass | Fail | Unresolved | Unresolved | Unresolved | Unresolved | Unresolved | Fail | Withhold |
| M30 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Conditional | Unresolved | Withhold |
| M31 | Pass | Conditional | Unresolved | Unresolved | Unresolved | Conditional | Unresolved | Fail | Withhold |

Gate totals reconcile to 39 rows:

- G1: 39 Pass;
- G2: 19 Conditional, 20 Fail;
- G3: 9 Conditional, 30 Unresolved;
- G4: 39 Unresolved;
- G5: 39 Unresolved;
- final: 39 Withhold.

## Control matrix

| Control | Why it is not a candidate | Comparison result |
| --- | --- | --- |
| P08, P09, P10, P15, P17 | Already active production Points | Each has a preserved raw-coordinate/reconciliation chain, meaning, uncertainty, sources, and review absent from the 39 candidates. |
| P19 Xiabu component 1 | Already approved research proposal in paused PR #69 | Two raw provider chains plus component plaque and 150 m uncertainty remain the threshold comparison. |
| P04 Xieli | Included as candidate and also a misleading-risk control | Still withheld; prior conditional generalized-Point research is not publication approval. |
| P03 and P21 | Included as conflict candidates | Provider/locality conflicts still block Point and shape. |
| M22 四眼井 | Ambiguous point-like control; does not meet the universe criteria | A community/same-name result is not the protected well and is not a safe fallback coordinate. |

## Future PR #69 additions

Ordered candidate additions: `[]`.

No row in this matrix authorizes publication. The paused PR #69 remains P19
only and unchanged.
