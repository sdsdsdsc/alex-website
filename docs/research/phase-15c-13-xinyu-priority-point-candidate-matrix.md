# Phase 15C-13 — Xinyu priority Point candidate matrix

## Purpose

This non-production matrix is the detailed research record for the canonical
[Phase 15C-13 priority Point digitization audit](../audits/phase-15c-13-xinyu-priority-point-digitization-audit.md).
It contains exactly the approved six-candidate queue and is not an application
input or publication batch.

All provider pages were refreshed on 2026-07-31. `—` means that no legitimate
numerical value was accepted; it never means zero or permission to infer a map
centre.

## Candidate matrix

| ID | Identity and locality | Gaode evidence | Baidu evidence | Independent/feature evidence | Numerical construction | Existing Point meaning | Uncertainty/risk | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N03 | 罗坊会议旧址; 罗坊镇院前村委陈家闹村 | Exact-name/complex lead; POI `B0316001WP` exposes `115.124270, 27.835833` GCJ-02 at the managed visitor-complex address, not safely the historic component | Existing component-related UID `52eb749fe214f22543afe6fe`; related exact/complex results | Xinyu Museum and independent photography identify the one-hall/two-wing historic building in 陈家闹 | **Rejected.** Gaode numerical result risks visitor-complex/parent substitution; no exact cross-provider component transfer | `heritage-feature-point` if later resolved | Component identity strong; coordinate meaning unacceptable; no uncertainty assigned | **Withhold** |
| N07 | 水西红三军团指挥部旧址; 水西镇沙陂村 | Exact POI `B0IDTHR05Y`; raw `115.016436, 27.802641` GCJ-02; address 沙陂村委上首村小组 | Exact UID `3de126b7771f4438d1f49ef3`; 水西镇; provider-hosted building/site imagery agrees with reviewed screenshots | NCHA exact national identity; Xinyu Museum listing; institutional and independent accounts identify 廖氏/沙陂祠堂 | GCJ-02 input → ten-iteration inverse → `115.01133320220836, 27.805881566984727` WGS84 → retained `[115.011333, 27.805882]`; forward residual reproduces input; WGS84 basemap/locality reconciliation passed | `heritage-feature-point`; `project-reviewed-interpretation` | `100 m`; public limitation required; no footprint/boundary claim; future non-Point unnecessary | **Point now** |
| N08 | 上高会战第58师师部遗址; 下村镇大桥村 | Exact longer-name POI `B0I3SRWR8E`; 大桥村 | Exact longer-name UID `08fc2495a047ace8bea240e8`; 大桥村; provider imagery/comments show the historic building | Ganxi Anti-Japanese War Museum account describes and photographs the two-storey 彭氏小洋楼 | **Not completed.** No legitimate raw coordinate or reproducible WGS84 transfer; Baidu display centre rejected | `heritage-feature-point` if later resolved | Identity/physical feature pass; numerical/CRS/uncertainty fail; keep separate from P22 | **Withhold** |
| P22 | 渝水周家上高会战中国军队第十九集团军总司令部旧址; 珠珊镇潭口村 | Exact/shorter-name POI `B0JUJHQY3O`; 石镇线/298县道 lead | Exact long-name UID `3b33ad8fabc023b7b45f1e8c`; near 新余黄冈学校; no accepted feature photo | Official provincial identity and Xinyu Museum listing | **Not completed.** Address proximity is not a coordinate; physical component and WGS84 transfer unresolved | `heritage-feature-point` if later resolved | Component, coordinate, uncertainty unresolved; keep separate from N08 | **Withhold** |
| M23 | 枫溪彭氏民居; 分宜县钤山镇枫溪村 | Exact POI `B0FFI9ZK9Q`; `233乡道西50米`; type 古建筑 | Exact UID `d536d4283c6a52eca104644c`; same address; type 旅游景点 | Official municipal identity and preserved cultural-record source; no sufficient feature-specific physical corroboration | **Not completed.** No legitimate raw coordinate; residence/entrance/visitor-facility meaning unresolved | `heritage-feature-point` or `visitor-reference-point` only after meaning is resolved | Nearby tourism toilet rejected; coordinate, meaning, uncertainty unresolved | **Withhold** |
| M30 | 罗坊会议纪念馆; 罗坊镇彭家村/罗坊希望小学对面 | Exact museum POI `B0316001WQ`; phone/address agree | Exact museum UID `dffd631c26c2dbbc38221c0f`; visitor venue and complex subresults | CNR profile distinguishes the purpose-built museum from the historic sites it manages | **Not completed.** No legitimate raw feature coordinate; provider display centres/complex subfeatures rejected | `visitor-reference-point` | Separate museum identity passes; numerical/CRS/uncertainty fail; must not substitute for N03/N04 | **Withhold** |

## Count reconciliation

| Check | Expected | Actual |
| --- | ---: | ---: |
| Unique candidate IDs | 6 | 6 |
| Point now | 1 | 1 |
| Point now, shape later | 0 | 0 |
| Withhold | 5 | 5 |
| Outcomes total | 6 | 6 |
| Accepted numerical WGS84 Points | 1 | 1 |
| Guessed/display-centre/village-centroid Points | 0 | 0 |

The accepted coordinate belongs only to N07. No coordinate from this matrix is
production data, and the matrix does not alter the ordered contents of paused
PR #69.

## Required decision fields

| ID | Official level/category | Natural form | Feature-identity conclusion | Original coordinate / CRS | Conversion and WGS84 | Provider/reference separation | Horizontal uncertainty | Geometry meaning / representation status | Sensitivity and access | Misleading risk | Remaining limitation and exact evidence required | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N03 | National 3a component; 近现代重要史迹 → Buildings & structures | point-like; future non-Point unnecessary | Official component passes; cross-provider physical-component match does not | Gaode `115.124270, 27.835833` GCJ-02 belongs to a result at the visitor-complex address and is rejected | Not applicable; WGS84 not established | Not established; provider component/complex results conflict in meaning | Not established | `heritage-feature-point` if resolved / `project-reviewed-interpretation` | Not established because feature coordinate is unresolved | Fail: visitor-complex or parent substitution would mislead | Exact component-level numerical source or reproducible coordinate-aware match to the 陈家闹 historic building, plus reconciliation and risk review | **Withhold pending evidence** |
| N07 | National 4; 近现代重要史迹 → Buildings & structures | point-like; future non-Point unnecessary | Exact official, Gaode, Baidu, locality, building-imagery, and ancestral-hall match passes | `115.016436, 27.802641` / GCJ-02 | Ten-iteration inverse; `[115.011333, 27.805882]` WGS84 | No calculable second raw-provider separation; qualitative exact-feature reconciliation passed against Baidu, independent descriptions, and WGS84 basemap context | `100 m` | `heritage-feature-point` / `project-reviewed-interpretation`; evidence-method meaning is provider-located project-reviewed reference Point | Pass: public protected educational/visitor site; no new concealed vulnerable feature or private residence | Pass with persistent limitation; Point must not imply footprint, surveyed precision, compound, entrance, or legal boundary | No evidence gate remains for the audit recommendation; separate publication approval and data review still required | **Point now** |
| N08 | National, separate seventh-batch designation; 近现代重要史迹 → Buildings & structures | point-like; future non-Point unnecessary | Exact cross-provider building and independent physical description pass | Not established | Not established | Not established; no legitimate numerical transfer | Not established | `heritage-feature-point` if resolved / `project-reviewed-interpretation` | Provisional public-site context only; final access review awaits a coordinate | Fail because numerical accuracy and uncertainty are absent | Legitimate raw coordinate or reproducible coordinate-aware WGS84 transfer for the 彭氏小洋楼, followed by separation, uncertainty, sensitivity, and misleading-risk acceptance | **Withhold pending evidence** |
| P22 | Provincial 20; 近现代重要史迹 → Buildings & structures | point-like; future non-Point unnecessary | Official identity and provider names pass; specific physical component does not | Not established | Not established | Not established | Not established | `heritage-feature-point` if resolved / `project-reviewed-interpretation` | Not established | Fail: address/school proximity could imply false precision or wrong building | Feature-specific official/institutional physical corroboration plus a legitimate numerical coordinate or reproducible WGS84 transfer and full risk review | **Withhold pending evidence** |
| M23 | Municipal 23; 古建筑 → Buildings & structures | point-like; future non-Point unnecessary | Name/locality pass; residence versus entrance/visitor-facility meaning does not | Not established | Not established | Not established | Not established | `heritage-feature-point` or `visitor-reference-point` after meaning resolves / `project-reviewed-interpretation` | Not established; residential/privacy implications require review | Fail: a tourism venue or nearby toilet may be substituted for the historic residence | Feature-specific physical corroboration, exact Point meaning, legitimate numerical coordinate/WGS84 transfer, privacy/access review, and accepted uncertainty | **Withhold pending evidence** |
| M30 | Municipal 30; 近现代重要史迹 → Buildings & structures | point-like visitor venue; future non-Point unnecessary | Exact museum identity passes and is distinct from historic components | Not established | Not established | Not established | Not established | `visitor-reference-point` / `project-reviewed-interpretation` if resolved | Public museum context passes provisionally; final review awaits a coordinate | Fail because a complex centre, entrance, parking area, or historic component could be substituted | Legitimate museum-reference coordinate or reproducible WGS84 transfer, then separation, uncertainty, and final misleading-risk review | **Withhold pending evidence** |

The public-facing limitation for any future N07 publication must be equivalent
to: “Project-reviewed reference location based on the official record,
mapped-provider evidence and documented project digitization. It is not an
authority-supplied coordinate, surveyed heritage extent or legal protection
boundary.”

## Proposed future PR #69 batch

If separately approved, the ordered proposal becomes:

1. P19 暴动举行地旧址 — retain the existing approved-but-unpublished proposal;
2. N07 水西红三军团指挥部旧址 — add the Phase 15C-13 Point-ready recommendation.

This is a recommendation only. The existing draft PR #69 remains unchanged at
P19 and must not be amended, rebased, merged, or expanded without a new
instruction.

## N07 reproducibility record

| Field | Value |
| --- | --- |
| Provider and stable feature | Gaode `B0IDTHR05Y`, exact 水西红三军团指挥部旧址 |
| Access/review date | 2026-07-31 |
| Input | `115.016436, 27.802641` longitude/latitude |
| Input CRS | GCJ-02 |
| Transform | Repository-established iterative inverse; Krasovsky 1940 `a=6378245.0`, `ee=0.00669342162296594323`; ten forward-residual iterations |
| Unrounded output | `115.01133320220836, 27.805881566984727` WGS84 |
| Retained output | `[115.011333, 27.805882]` WGS84 |
| Forward check | Reproduces `115.016436, 27.802641` at provider precision |
| Reconciliation | Exact Baidu UID/name/locality/building imagery; institutional and independent ancestral-hall identification; independent OpenStreetMap WGS84 locality review |
| Reviewer | Project evidence review |
| Recommended uncertainty | `100 m` |
| Limitation | Project-reviewed reference location; not authority-supplied, surveyed extent, compound, footprint, or legal boundary |

## Source register

- Gaode: [`B0316001WP`](https://www.amap.com/place/B0316001WP),
  [`B0IDTHR05Y`](https://www.amap.com/place/B0IDTHR05Y),
  [`B0I3SRWR8E`](https://www.amap.com/place/B0I3SRWR8E),
  [`B0JUJHQY3O`](https://www.amap.com/place/B0JUJHQY3O),
  [`B0FFI9ZK9Q`](https://www.amap.com/place/B0FFI9ZK9Q), and
  [`B0316001WQ`](https://www.amap.com/place/B0316001WQ).
- Baidu stable UIDs: `52eb749fe214f22543afe6fe`,
  `3de126b7771f4438d1f49ef3`, `08fc2495a047ace8bea240e8`,
  `3b33ad8fabc023b7b45f1e8c`, `d536d4283c6a52eca104644c`, and
  `dffd631c26c2dbbc38221c0f`.
- Official/institutional/independent sources are linked candidate-by-candidate
  in the canonical audit. Historical Phase 15C-10 and Phase 15C-11 evidence is
  preserved unchanged; this matrix records the bounded refresh and resulting
  decision.
