# Phase 15C-10 — Xinyu Future Non-Point Candidate Inventory

## Purpose and hard boundary

This is a research inventory, not a geometry proposal or publication queue. It
records where a future line or area could communicate the physical subject
more honestly than a Point. It draws no geometry, copies no provider shape,
changes no active representation, and approves no implementation.

There are **31 candidates**: **8 LineString** and **23 Polygon/MultiPolygon**.
None is production-ready. The current production baseline remains five
official Points and zero real lines or polygons.

Candidate meanings are controlled:

- `historic alignment` — the surviving protected bridge or route axis, not a
  modern road centreline;
- `protected-site footprint` — only the authoritative protected feature or
  legally described protection area;
- `archaeological extent` — evidence-based site extent, not a provider label
  halo or uncertainty buffer;
- `landscape extent` — the verified cemetery, battlefield, or memorial
  landscape, not a convenient park boundary; and
- `component footprints` — distinct verified protected components, never a
  bounding shape around unrelated points.

## Common evidence controls

The codes used in the per-candidate tables expand as follows.

| Code | Requirement |
| --- | --- |
| `G-A` | Official plan, survey, gazetteer map, protection-range instrument, or qualified archaeological publication showing the feature extent/alignment. |
| `G-B` | Independent feature-level corroboration tying the geometry to the exact official identity and locality. |
| `G-C` | Source authority, creation date, geometry status, provenance chain, and explicit reuse/licence assessment. |
| `G-D` | Original datum/CRS recorded; deterministic conversion to WGS84; topology and validator checks; uncertainty represented as metadata, never fabricated area. |
| `G-E` | Sensitivity review for archaeology, tombs, vulnerable fabric, and access; misleading-risk review at overview and detail zooms. |

For every candidate below, the current geometry status is
`project-interpreted / not created`; authority is insufficient; provenance and
reuse rights are unresolved; source CRS is unknown; uncertainty is
unquantified; sensitivity is not cleared; and misleading-risk is open. These
facts are recorded per row as `controls G-A–G-E`, with any additional
identity-specific issue stated explicitly.

## LineString candidates

| ID and canonical identity | Level; natural form | Proposed geometry and intended meaning | Why a line could add value | Current evidence | Required evidence / controls | Risk and next action |
| --- | --- | --- | --- | --- | --- | --- |
| P09 蓉泉桥 | provincial; linear | LineString; historic bridge alignment | Shows span/orientation more honestly than the current visitor-reference Point | Existing reviewed Point; Gaode `B0JU95B3WN`; official locality; no alignment | G-A–G-E; measured bridge endpoints or authoritative survey | Do not derive from aerial imagery or modern road; retain active Point until a separately reviewed line exists. |
| M18 官溪桥 | municipal; linear | LineString; historic bridge alignment | Distinguishes the bridge from 慕江村 | Official row; weak Baidu locality/bridge lead; no Gaode feature | G-A–G-E; feature photographs, survey, endpoints, survival status | High misidentification risk; conduct local archival/field verification. |
| M19 檀步桥 | municipal; linear | LineString; historic bridge alignment | Avoids publishing the 水北村 or truncated 步桥 locality as the bridge | Official row; Gaode locality/name variant only | G-A–G-E; exact-character identity and alignment survey | Resolve name truncation first; no Point or line recommendation. |
| M20 八百桥 | municipal; linear | LineString; historic bridge alignment | Separates named bridge fabric from same-name village | Official row; both providers return locality/village support only | G-A–G-E; protected bridge identification and surveyed endpoints | Very high centroid-substitution risk; do not use village centre. |
| M21 八斗桥 | municipal; linear | LineString; historic bridge alignment | A line can show the protected span once verified | Official row; Gaode exact-name hit; no Baidu corroboration | G-A–G-E; independent alignment and fabric confirmation | One-provider result is insufficient; preserve as research lead. |
| M24 星拱桥 | municipal; linear | LineString; historic bridge alignment | Differentiates bridge from 防里村 | Official row; Baidu locality/bridge variant only | G-A–G-E; feature-specific survey/plan and survival status | Do not infer from road/water crossing. |
| M25 登瀛桥 | municipal; linear | LineString; historic bridge alignment | Differentiates second named bridge in 防里村 | Official row; Baidu locality/bridge variant only | G-A–G-E; evidence that separates it from M24 plus surveyed endpoints | Same-village bridge confusion risk; verify both together. |
| M26 状元桥 | municipal; linear | LineString; historic bridge alignment | Avoids presenting a cultural-base venue as the bridge | Official row; both providers show cultural-base/locality variants | G-A–G-E; protected bridge plan, feature images, exact alignment | Venue/heritage-feature conflation risk; withhold geometry. |

## Polygon and MultiPolygon candidates

| ID and canonical identity | Level; natural form | Proposed geometry and intended meaning | Why area could add value | Current evidence | Required evidence / controls | Risk and next action |
| --- | --- | --- | --- | --- | --- | --- |
| N01 凤凰山铁矿遗址 | national; areal | Polygon/MultiPolygon; archaeological extent | Communicates mining-site footprint/components | Official row, national-list identity, exact results on both providers | G-A–G-E; authoritative mine-site extent and component topology | Archaeological sensitivity and multipart risk; seek protection plan. |
| N02 拾年山遗址 | national; areal | Polygon/MultiPolygon; archaeological extent | Communicates prehistoric site rather than POI centre | Official row, national list, museum record, exact provider results | G-A–G-E; archaeological survey/protection range | Sensitive-site disclosure review required. |
| P01 棋盘山遗址 | provincial; areal | Polygon/MultiPolygon; archaeological extent | Distinguishes site from 章塘村 and nearby P15 | Official row; exact provider results | G-A–G-E; provincial protection-range evidence | Avoid provider highlight; obtain authoritative plan. |
| P02 袁州明代城墙砖窑址群（芦塘窑址） | provincial component; areal/multipart | Polygon/MultiPolygon; Xinyu 芦塘 kiln-component extent only | Shows kiln group without implying the cross-city parent is wholly in Xinyu | Official component row; provider locality/kiln leads | G-A–G-E; component inventory and individual kiln extents | Cross-city scope and component aggregation risk; map only verified Xinyu components. |
| P03 彭家山遗址 | provincial; areal | Polygon/MultiPolygon; archaeological extent | Could show site once locality conflict is resolved | Official row; Gaode absent; Baidu label conflicts with official 周家新村 | G-A–G-E plus independent locality resolution | Conflict blocks even a Point; resolve identity before geometry research. |
| P04 斜里遗址 | provincial; areal | Polygon/MultiPolygon; archaeological extent | Natural form is areal | Official row; locality-only results; prior square/uncertainty-area prototypes rejected | G-A–G-E; authoritative boundary or survey | Highest misleading-shape risk; area is unsuitable at present. |
| P21 打鼓岭遗址 | provincial; areal | Polygon/MultiPolygon; archaeological extent | Could represent actual site rather than same-name provider result | Official row; both providers conflict with official Yushui/Zhoujia locality | G-A–G-E plus identity/locality resolution | Provider conflict blocks geometry; seek provincial/site survey evidence. |
| M01 碾糠山遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Avoids using a search-result centre as the site | Official row; exact provider results | G-A–G-E; municipal survey/protection range | Sensitivity unresolved; seek official inventory file. |
| M02 蛇脑山遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Separates site from 棣村 locality | Official row; weak Gaode locality only | G-A–G-E; site-level identity and extent | No site-level evidence; archive research lead only. |
| M03 洪阳洞遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Could show cave/site area once jurisdiction is reconciled | Official row; exact-name provider lead; administrative-label mismatch | G-A–G-E plus jurisdiction reconciliation and cave/surface definition | Cave geometry and public sensitivity need specialist review. |
| M04 龚家山遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Better represents site than provider centre | Official row; exact results on both providers | G-A–G-E; municipal archaeological plan | Exact POI is not extent; seek authoritative survey. |
| M05 何家垴遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Separates heritage site from 鹄山村 | Official row; locality support only | G-A–G-E; feature identity and survey | No coordinate or extent basis. |
| M06 麻岭山遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Natural form is likely site area | Official row; no useful Gaode result; weak Baidu locality | G-A–G-E; feature identity and survey | Withhold all representation pending evidence. |
| M07 凤形山遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Natural form is likely site area | Official row; no useful Gaode result; weak Baidu locality | G-A–G-E; feature identity and survey | Withhold all representation pending evidence. |
| M08 刘家山遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Separates site from 陈家村 | Official row; locality-only results | G-A–G-E; feature identity and survey | Generic hill-name risk; no centroid substitution. |
| M09 社山坪遗址 | municipal; areal | Polygon/MultiPolygon; archaeological extent | Separates site from 湖丘村 | Official row; Baidu locality support only | G-A–G-E; feature identity and survey | No site-level evidence. |
| M11 胡家山古墓群 | municipal; multipart | MultiPolygon; verified tomb-group extents | Represents multiple protected tomb areas without false connecting hull | Official row; provider tomb-group/locality leads | G-A–G-E; authoritative tomb inventory and separate boundaries | High sensitivity; never publish individual graves without clearance. |
| P12 分宜钤岗上高会战中国军队阵亡将士陵园 | provincial; areal | Polygon/MultiPolygon; verified cemetery landscape extent | More meaningful than a centre Point for a cemetery complex | Official row; named Baidu result; Gaode locality variant | G-A–G-E; cemetery plan, protected boundary, access/sensitivity review | Do not substitute provider or village/park boundary. |
| P16 北伐军仰天岗战场遗址 | provincial; areal | Polygon/MultiPolygon; evidenced battlefield/protection extent | Expresses landscape-scale history | Official row; provider park/memorial vicinity only | G-A–G-E; military-history study or protection-range instrument | Severe false-precision risk; do not use forest-park boundary. |
| M31 九龙山革命烈士纪念塔与墓 | municipal; areal/multipart | Polygon/MultiPolygon; memorial landscape and verified components | Captures tower, graves, and landscape relationship | Official row; exact/variant provider evidence | G-A–G-E; site plan distinguishing protected fabric and visitor grounds | Component and public-park boundary confusion risk. |
| M28 观音岩遗址 | municipal; areal | Polygon/MultiPolygon; verified carving/site extent | Could show protected rock/site rather than locality | Official row; locality-only provider results | G-A–G-E; carving inventory, rock/site plan, sensitivity review | Provisional public type and extent both unresolved. |
| P19 下保农民暴动旧址——暴动举行地旧址 | provincial component; point-like building | Polygon; protected component footprint | Future footprint could supplement the approved component-reference Point | Official row; prior plaque; two-provider parent evidence; paused Point candidate | G-A–G-E; building/parcel footprint from reusable authoritative source | Do not delay or replace the reviewed Point automatically; one-active-representation review required. |
| P20 下保农民暴动旧址——暴动会议地旧址 | provincial component; point-like building | Polygon; protected component footprint | Could distinguish the second component from P19 | Official row; parent/locality provider results only | G-A–G-E plus component-specific identity proof | No Point or footprint until component is independently located. |

## Priorities and future gates

Research priority is evidence quality, not provider visibility:

1. obtain protection-range or survey material for national and provincial
   archaeological sites;
2. resolve P03/P21 conflicts and the P02 cross-city component model;
3. commission or locate measured bridge alignments, beginning with the already
   published P09 Point;
4. obtain authoritative plans for P12, P16, and M31; and
5. keep P19/P20 component evidence separate.

Any future implementation must extend the already production-verified Phase
15C-1 geometry validation foundation and Phase 15C-2 mixed-geometry renderer.
It must also use the approved one-active-representation lifecycle once that
later schema work exists. This inventory does not authorize a new geometry
system, a synthetic shape, or a second simultaneous public representation.
