# Phase 15C-24 — First real shape candidate matrix

## Scope and controlling inventory

This research-only matrix reconciles every identity in the merged
[Phase 15C-10 non-Point candidate inventory](./phase-15c-10-xinyu-non-point-candidate-inventory.md)
against the later merged audits and the production state at baseline
`6e8de73610ff175e4b36fc0ea184d4526200b8cd`. It creates no geometry and makes
no publication decision.

The controlling universe remains exactly **29 unique identities**:

- **8** LineString/MultiLineString candidates;
- **21** Polygon/MultiPolygon candidates; and
- **29** total non-Point candidate identities.

Every controlling identity appears exactly once below. `B`, `C`, and `D` use
the Phase 15C-24 outcome meanings; there are no Outcome A identities.

## Exact reconciliation

| ID | Official identity; level | Official classification → public category | Natural form; expected type | Line/area | Official/locality evidence and merged research status | Existing Point route or representation | Exact remaining shape gap | 15C-24 outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P09 | 蓉泉桥; provincial | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Exact official identity/locality, museum description, and reviewed named-provider Point; historical status “Point now, line later” | Active ordinary Point `JX-XY-PCH-009` | Reusable bridge endpoints or centreline in a known CRS, with accuracy materially better than the 7.7 m length | B |
| M18 | 官溪桥; municipal | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Official row; weak locality/bridge lead; bridge fabric unresolved | No active representation; ordinary Point considered but not supported | Exact feature identity, survival evidence, reusable surveyed endpoints, CRS, licence | D |
| M19 | 檀步桥; municipal | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Official row; provider returns locality/truncated 步桥 rather than the protected feature | No active representation; Point rejected pending identity | Exact-character identity, bridge fabric, alignment, CRS, licence | D |
| M20 | 八百桥; municipal | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Official row; evidence resolves the same-name village, not the bridge | No active representation; village-centre Point prohibited | Protected bridge identity and reusable surveyed endpoints | D |
| M21 | 八斗桥; municipal | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Official row; one exact provider hit without independent alignment/fabric evidence | No active representation; ordinary Point not ready | Independent feature confirmation plus reusable alignment, CRS, licence | D |
| M24 | 星拱桥; municipal | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Official row; locality/bridge-name variant only | No active representation; locality Point prohibited | Exact bridge identity, fabric and reusable endpoints | D |
| M25 | 登瀛桥; municipal | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Official row; locality/name variant in the same village as M24 | No active representation; locality Point prohibited | Distinguish M24/M25, then obtain reusable endpoint geometry | D |
| M26 | 状元桥; municipal | 古建筑 → Routes & infrastructure | linear bridge; LineString | line | Official row; cultural-base/locality results risk feature conflation | No active representation; ordinary Point not ready | Protected bridge identity, alignment, CRS, licence | D |
| N01 | 凤凰山铁矿遗址; national | 古遗址 → Archaeological sites | areal/multipart mine and smelting site; Polygon/MultiPolygon | area | National identity and museum description; approximate 150,000 m² and multiple remains; exact provider corroboration only | No active representation; Generalized Point received B in Phase 15C-18 | Reusable georeferenced site/component extent, topology, CRS, licence, sensitivity approval | B |
| N02 | 拾年山遗址; national | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | National identity and museum description; approximate 5,060 m²; exact provider corroboration only | No active representation; Generalized Point received B in Phase 15C-18 | Reusable archaeological/protection plan, CRS, licence, disclosure decision | B |
| P01 | 棋盘山遗址; provincial | 古遗址 → Archaeological sites | areal platform/settlement; Polygon/MultiPolygon | area | Museum records >10,000 m² hilltop, 3,000 m² centre and ditch; no georeferenced extent | No active representation; Generalized Point received B in Phase 15C-18 | Reusable georeferenced platform/ditch geometry, CRS, licence, sensitivity approval | B |
| P02 | 袁州明代城墙砖窑址群（芦塘窑址）; provincial component | 古遗址 → Archaeological sites | areal/multipart kiln component; Polygon/MultiPolygon | area | Official annex describes road/ditch/terrace/embankment edges; separate coordinates belong to non-Xinyu components | No active representation; Generalized Point received B in Phase 15C-18 | Georeferenced Xinyu component edges, component topology, CRS and reuse rights | B |
| P03 | 彭家山遗址; provincial | 古遗址 → Archaeological sites | areal archaeological site; Polygon | area | Official offsets reference an unmapped fence; provider locality conflicts with official 周家新村 | No active representation; Point blocked by identity conflict | Resolve locality and obtain reusable georeferenced fence footprint/CRS | D |
| P04 | 斜里遗址; provincial | 古遗址 → Archaeological sites | areal archaeological site; possible Polygon | area | Official annex publishes a DMS centre and four 30 m offsets; datum is bounded but not certified; crisp square was rejected as misleading | Active Generalized Point `JX-XY-PCH-004`; rejected area would supersede it | No evidence-specific visible or legal extent; existing Point is the more truthful active representation | C |
| P21 | 打鼓岭遗址; provincial | 古遗址 → Archaeological sites | areal archaeological hill-slope; Polygon/MultiPolygon | area | Official locality conflicts with same-name provider result; only an unanchored “about 500 m east” report | No active representation; ordinary/Generalized Point withheld | Record-specific identity/location, reusable extent, CRS, licence, sensitivity approval | D |
| M01 | 碾糠山遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row and exact provider identity leads; no survey geometry | No active representation; Generalized Point received B in Phase 15C-18 | Reusable institutional survey/protection extent, CRS, licence, sensitivity approval | B |
| M02 | 蛇脑山遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row; weak locality evidence only | No active representation; Point withheld | Feature identity, location and reusable extent | D |
| M03 | 洪阳洞遗址; municipal | 古遗址 → Archaeological sites | cave/surface archaeological site; Polygon/MultiPolygon | area | Exact-name provider lead has jurisdiction mismatch; public feature type/extent unresolved | No active representation; Point withheld | Resolve jurisdiction and cave/surface meaning; specialist reusable plan and CRS | D |
| M04 | 龚家山遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row and exact provider result; no survey geometry | No active representation; Generalized Point received B in Phase 15C-18 | Reusable archaeological plan, CRS, licence, sensitivity approval | B |
| M05 | 何家垴遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row; locality only | No active representation; Point withheld | Feature identity, location and reusable extent | D |
| M06 | 麻岭山遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row; no useful feature result | No active representation; Point withheld | Feature identity, location and reusable extent | D |
| M07 | 凤形山遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row; no useful Gaode result and weak locality lead | No active representation; Point withheld | Feature identity, location and reusable extent | D |
| M08 | 刘家山遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row; locality only and generic hill-name risk | No active representation; Point withheld | Feature identity, location and reusable extent | D |
| M09 | 社山坪遗址; municipal | 古遗址 → Archaeological sites | areal archaeological site; Polygon/MultiPolygon | area | Official row; locality support only | No active representation; Point withheld | Site-level identity/location and reusable extent | D |
| M11 | 胡家山古墓群; municipal | 古墓葬 → Archaeological sites | multipart tomb group; MultiPolygon | area | Official row and tomb-group/locality leads; no authoritative component inventory | No active representation; Point withheld | Cleared tomb inventory, separate reusable boundaries, CRS, licence, disclosure approval | D |
| P12 | 分宜钤岗上高会战中国军队阵亡将士陵园; provincial | 近现代重要史迹 → Parks, gardens & landscapes | areal/multipart cemetery landscape; Polygon/MultiPolygon | area | Official row; named provider and locality corroboration indicate multiple graves, not an extent | No active representation; Generalized Point received B in Phase 15C-18 | Reusable cemetery/site plan distinguishing protected fabric, visitor grounds and graves; CRS/licence/access review | B |
| P16 | 北伐军仰天岗战场遗址; provincial | 近现代重要史迹 → Parks, gardens & landscapes | broad battlefield landscape; Polygon | area | Official annex describes about 3,000 × 100 m between two named places; park/memorial evidence does not locate endpoints | No active battlefield representation; ordinary/Generalized Point withheld | Georeferenced Liangshannao/Gouxiongpo or authoritative extent, CRS, licence | B |
| M31 | 九龙山革命烈士纪念塔与墓; municipal | 近现代重要史迹 → Parks, gardens & landscapes | areal/multipart memorial landscape; Polygon/MultiPolygon | area | Official row and exact/variant landscape corroboration; visitor grounds and protected components unresolved | No active representation; Generalized Point received B in Phase 15C-18 | Reusable site plan separating tower, graves, landscape and park; CRS/licence/access review | B |
| M28 | 观音岩遗址; municipal | 古石刻 → Archaeological sites (provisional) | rock/carving site; Polygon/MultiPolygon | area | Official row; provider resolves locality only; public type and extent both provisional | No active representation; Point withheld | Exact protected feature, carving inventory, reusable site plan, CRS and sensitivity review | D |

## Reconciliation and outcome totals

| Check | Lines | Areas | Total |
| --- | ---: | ---: | ---: |
| Controlling Phase 15C-10 inventory | 8 | 21 | 29 |
| Reconciled above | 8 | 21 | 29 |
| Outcome A | 0 | 0 | 0 |
| Outcome B | 1 | 9 | 10 |
| Outcome C | 0 | 1 | 1 |
| Outcome D | 7 | 11 | 18 |

The line and area subtotals reconcile independently, and the outcomes sum to
`0 + 10 + 1 + 18 = 29`. No candidate is omitted, duplicated, promoted to a
Point, or given production geometry.
