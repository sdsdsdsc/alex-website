# Phase 15C-13 — Xinyu priority Point digitization audit

## Decision

This documentation-only audit re-evaluates exactly six bounded Xinyu Official
Heritage candidates—N03, N07, N08, P22, M23, and M30—under the merged
[provider-located project-reviewed reference Point policy](../policy/official-record-publication-policy.md).

One candidate passes the evidence and numerical-construction gates:

- **N07 水西红三军团指挥部旧址 — Point now.** Retain the project-reviewed
  WGS84 reference Point `[115.011333, 27.805882]`, with a conservative `100 m`
  uncertainty recommendation and `heritage-feature-point` meaning, for a
  separately approved publication change.

The other five candidates remain **withhold**. None is assigned a guessed
coordinate, viewport centre, provider display coordinate, village centroid, or
undocumented map click. There are no `Point now, shape later` outcomes.

This audit recommends evidence disposition only. It does not publish N07,
change the paused PR #69 batch, or approve implementation.

## Scope and controlling baseline

The queue is intentionally limited to the six identities authorized after
Phase 15C-12. The review used the existing identity reconciliation from Phases
15C-10 and 15C-11, refreshed Gaode and Baidu provider searches on 2026-07-31,
checked institutional and independent feature evidence, and attempted a
legitimate numerical construction only where the policy gates allowed it.

The evidence-method label **provider-located project-reviewed reference Point**
describes how a candidate location was established. It is not a new runtime
enum or geometry meaning. A successful result still uses an existing Point
meaning and policy-level `project-reviewed-interpretation` status.

## Outcome summary

| Outcome | Count | Candidates |
| --- | ---: | --- |
| Point now | 1 | N07 |
| Point now, shape later | 0 | none |
| Withhold | 5 | N03, N08, P22, M23, M30 |
| **Total reviewed** | **6** | **N03, N07, N08, P22, M23, M30** |

“Point now” means the evidence audit has produced a defensible Point
recommendation. It does not mean the feature is already public or that a data
PR is authorized. Every candidate remains operationally unpublished until a
separate candidate-specific publication instruction and review are completed.

## Audit conclusions

- evaluated: `6`;
- `Point now`: `1` — N07 水西红三军团指挥部旧址;
- `Point now, shape later`: `0`;
- `Withhold pending evidence`: `5` — N03 罗坊会议旧址, N08 上高会战第58师师部遗址,
  P22 第十九集团军总司令部旧址, M23 枫溪彭氏民居, and M30 罗坊会议纪念馆;
- proposed future PR #69 batch, if separately approved: retain P19 暴动举行地旧址
  and add N07, in that order;
- current PR #69 batch and branch: unchanged at P19 only;
- policy result: the merged policy worked as intended by allowing one
  reproducible provider-backed Point while rejecting five attractive but
  numerically incomplete or misleading substitutes; and
- further policy amendment: not necessary. The remaining failures are
  candidate-evidence gaps, not a contradiction or structural policy defect.

## N07 accepted numerical construction

### Feature identification

- The [National Cultural Heritage Administration eighth-batch list](https://www.ncha.gov.cn/art/2019/10/18/art_2289_157100.html)
  records N07 as `8-0617-5-101`, 水西红三军团指挥部旧址, in Xinyu Yushui.
- The [Xinyu Museum provincial-unit page](https://www.xysmuseum.com/183.html)
  includes the same identity.
- The [Jiangxi University of Engineering account](https://www.jxue.edu.cn/2025/0506/c21a39124/page.htm)
  identifies the physical feature as the 廖氏祠堂 in 沙陂村; a
  [People's Daily Jiangxi report](https://jx.people.com.cn/n2/2020/1126/c186330-34439677.html)
  independently identifies 沙陂祠堂 as the former command site.
- Gaode POI [`B0IDTHR05Y`](https://www.amap.com/place/B0IDTHR05Y) gives the
  exact name and 沙陂村委上首村小组 locality. Baidu POI
  [`3de126b7771f4438d1f49ef3`](https://map.baidu.com/poi/%E6%B0%B4%E8%A5%BF%E7%BA%A2%E4%B8%89%E5%86%9B%E5%9B%A2%E6%8C%87%E6%8C%A5%E9%83%A8%E6%97%A7%E5%9D%80?uid=3de126b7771f4438d1f49ef3)
  gives the exact identity in 水西镇. The refreshed Baidu detail and
  provider-hosted building imagery agree with the previously reviewed
  owner-supplied Gaode/Baidu screenshots and with the specific ancestral-hall
  feature, rather than a village, park, road, or visitor-complex substitute.

The feature-identification gate therefore passes for a point-like historic
building/site.

### Coordinate and CRS chain

Gaode's provider-owned detail exposes `115.016436, 27.802641` in mainland
Gaode coordinates. The input is retained as **GCJ-02**, in longitude/latitude
order. It was not copied directly into public WGS84.

The project applied the repository-established deterministic inverse GCJ-02
transform using Krasovsky 1940 constants `a=6378245.0` and
`ee=0.00669342162296594323`, with ten forward-transform residual-correction
iterations:

| Stage | CRS | Longitude | Latitude |
| --- | --- | ---: | ---: |
| Provider input | GCJ-02 | 115.016436 | 27.802641 |
| Ten-iteration inverse output | WGS84 | 115.01133320220836 | 27.805881566984727 |
| Retained recommendation | WGS84 | **115.011333** | **27.805882** |

Forward-transforming the unrounded inverse output reproduces the Gaode input
at the retained provider precision. The WGS84 output was then reviewed on an
independent OpenStreetMap WGS84 basemap at the stated 沙陂村 locality. The
cross-provider name, locality, building imagery, and independent
ancestral-hall descriptions reveal no serious unresolved spatial or identity
mismatch.

### Meaning, uncertainty, and risk

- geometry meaning: `heritage-feature-point`;
- representation status: `project-reviewed-interpretation`;
- evidence method: provider-located project-reviewed reference Point;
- recommended uncertainty: `100 m`, conservatively covering provider
  placement, basemap reconciliation, transform, and rounding rather than
  implying surveyed building precision;
- sensitivity/access: a publicly identified protected site with documented
  educational/visitor use; no archaeological deposit, burial, private
  residence, or concealed vulnerable-object coordinate is introduced by this
  reference;
- misleading risk: acceptable only with the standard limitation that the Point
  is a project-reviewed reference location, not a surveyed footprint, compound,
  legal protection boundary, or authority-supplied coordinate;
- future non-Point representation: unnecessary on the present evidence. Any
  exceptional future replacement geometry would require separate evidence and
  approval and would supersede, not accompany, the Point.

## Candidate findings

### N03 罗坊会议旧址 — withhold

The official and institutional evidence strongly identifies the historic
component as the early-Republic building in 陈家闹村. The
[Xinyu Museum component account](https://xysmuseum.com/589.html) describes the
specific one-hall/two-wing building and its setting; an
[independent visual report](https://sj.jxnews.com.cn/index/Index/news.html?id=75640)
also places the old site in 院前村委陈家闹村.

The refreshed providers do not yet support a legitimate numerical Point for
that component. Baidu exposes a component-related result (existing stable UID
`52eb749fe214f22543afe6fe`), but refreshed Gaode search does not return the
same exact physical component. Gaode POI
[`B0316001WP`](https://www.amap.com/place/B0316001WP) exposes a numerical
coordinate for a result named 罗坊会议旧址 at the managed visitor-complex
address, while the reviewed evidence distinguishes that visitor complex from
the 陈家闹 historic component. Adopting that coordinate would risk
parent/component and venue substitution. N03 remains withheld pending an exact
component-level numerical source or a reproducible component match.

### N08 上高会战第58师师部遗址 — withhold

Gaode POI [`B0I3SRWR8E`](https://www.amap.com/place/B0I3SRWR8E) and Baidu POI
[`08fc2495a047ace8bea240e8`](https://map.baidu.com/poi/%E4%B8%8A%E9%AB%98%E4%BC%9A%E6%88%98%E9%81%97%E5%9D%80%E4%B9%8B%E4%B8%AD%E5%9B%BD%E5%86%9B%E9%98%9F%E7%AC%AC74%E5%86%9B%E7%AC%AC58%E5%B8%88%E5%B8%88%E9%83%A8%E9%81%97%E5%9D%80?uid=08fc2495a047ace8bea240e8)
agree on the exact longer identity and 大桥村 locality. The
[Xinyu Ganxi Anti-Japanese War Museum account](https://www.xygxkzbwg.com/nd.jsp?id=315)
describes and photographs the specific two-storey 彭氏小洋楼, and refreshed
Baidu imagery/comments show the same point-like building class.

Identity and physical-feature gates pass, but neither reviewed provider exposes
a legitimate raw feature coordinate, and this audit did not obtain a
reproducible coordinate-aware transfer to WGS84. The Baidu URL display centre
was explicitly rejected. N08 stays separate from P22 and remains withheld.

### P22 第十九集团军总司令部旧址 — withhold

Gaode POI [`B0JUJHQY3O`](https://www.amap.com/place/B0JUJHQY3O) and Baidu POI
[`3b33ad8fabc023b7b45f1e8c`](https://map.baidu.com/poi/%E6%B8%9D%E6%B0%B4%E5%8C%BA%E5%91%A8%E5%AE%B6%E4%B8%8A%E9%AB%98%E4%BC%9A%E6%88%98%E4%B8%AD%E5%9B%BD%E5%86%9B%E9%98%9F%E7%AC%AC%E5%8D%81%E4%B9%9D%E9%9B%86%E5%9B%A2%E5%86%9B%E6%80%BB%E5%8F%B8%E4%BB%A4%E9%83%A8%E6%97%A7%E5%9D%80?uid=3b33ad8fabc023b7b45f1e8c)
provide exact/long-form provider leads near the 石镇线/298县道 and 新余黄冈学校
area. The official provincial list and Xinyu Museum establish the protected
identity.

The refreshed Baidu record contains no feature photograph, and neither
provider exposes a legitimate numerical coordinate suitable for the specific
historic building. Address proximity is not a Point. The physical component,
coordinate transfer, and uncertainty remain unresolved, so P22 is withheld and
must not be conflated with N08.

### M23 枫溪彭氏民居 — withhold

Gaode POI [`B0FFI9ZK9Q`](https://www.amap.com/place/B0FFI9ZK9Q) and Baidu POI
[`d536d4283c6a52eca104644c`](https://map.baidu.com/poi/%E6%9E%AB%E6%BA%AA%E5%BD%AD%E6%B0%8F%E6%B0%91%E5%B1%85?uid=d536d4283c6a52eca104644c)
agree on the name and `233乡道西50米` locality. The municipal identity is also
present in the reviewed official list and the preserved Xinyu cultural-record
source.

The provider pages do not expose a legitimate raw feature coordinate or
feature-specific photography sufficient to resolve residence centre versus
entrance or visitor-facility meaning. The nearby tourism-toilet result is not
the heritage feature. M23 remains withheld.

### M30 罗坊会议纪念馆 — withhold

Gaode POI [`B0316001WQ`](https://www.amap.com/place/B0316001WQ) and Baidu POI
[`dffd631c26c2dbbc38221c0f`](https://map.baidu.com/poi/%E7%BD%97%E5%9D%8A%E4%BC%9A%E8%AE%AE%E7%BA%AA%E5%BF%B5%E9%A6%86?uid=dffd631c26c2dbbc38221c0f)
agree on the visitor museum opposite 罗坊希望小学. The
[China National Radio profile](https://www.cnr.cn/2007tf/mljx/tsly/200712/t20071204_504645170.html)
independently distinguishes the purpose-built museum from the historic sites
it manages.

The museum is a valid separate visitor-venue identity and is not N03/N04, but
neither reviewed provider exposes a legitimate numerical feature coordinate.
The provider display centres and complex subfeatures were rejected. M30 remains
withheld pending a reproducible museum reference Point.

## Prohibited substitutes applied

No candidate was advanced from a screenshot pixel, viewport or display centre,
highlighted-area centre, village centroid, road address, nearby school,
parking area, toilet, visitor-complex centre, provider URL projection, or
undocumented click. A stable provider ID and exact name support identity; they
do not alone create publishable geometry.

## Publication and implementation boundary

This audit changes documentation only. It does not modify production source
data, generated GeoJSON, runtime, schema implementation, rendering, filters,
Community Heritage, Firebase, deployment, Xiabu, Xieli, or PR #69. Production
therefore remains exactly five Official Heritage Points and zero real lines or
polygons.

The next permitted action is a separately approved candidate-specific
publication decision for the proposed future PR #69 batch `P19, N07`. Until
then, N07 is a documented Point-ready recommendation, PR #69 remains P19-only,
and both records remain unpublished. The five withheld candidates require new
evidence; this audit does not authorize more digitization or a broader batch.

## Supporting record

The exact six-row provider, coordinate, CRS, risk, and disposition record is
the [Phase 15C-13 priority Point candidate matrix](../research/phase-15c-13-xinyu-priority-point-candidate-matrix.md).
