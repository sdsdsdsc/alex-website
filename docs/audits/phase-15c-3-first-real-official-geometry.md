# Phase 15C-3 — First Real Official Geometry Candidate Audit

## Historical status

This document is preserved as the Phase 15C-3 audit record. Its candidate rankings and publication conclusion reflect the stricter evidence gate used at that time and are superseded by the later re-audit and controlling policy. [Phase 15C-4](./phase-15c-4-xinyu-mixed-geometry-reaudit.md) later re-audited the candidates, [Phase 15C-5](./phase-15c-5-xiabu-geometry-pilot.md) is the authoritative detailed Xiabu evidence record, and [Phase 15C-6](../plans/phase-15c-6-official-record-publication-policy-and-batch-plan.md) preserves the historical batch plan. The standalone [official-record publication policy](../policy/official-record-publication-policy.md) is the controlling current authority. This historical record is not implementation or publication approval.

## Outcome

The first Phase 15C-3 candidate audit found no Xinyu record that was ready for defensible non-Point publication under its then-current evidence gate. No production data, source facts, public-location decisions, generated GeoJSON, geometry helper, renderer, test, category mapping, Firebase file, workflow, or package file changed.

The strongest candidate is 斜里遗址 (Xieli Site). The Jiangxi Provincial People's Government protection-range table supplies a public GPS centre and a rule extending 30 metres east, south, west, and north. That is materially stronger than a locality label, but the table does not identify the GPS datum or publish WGS84 boundary vertices. Because the record is archaeological and the production GeoJSON requires WGS84, treating the coordinate as WGS84 would be an undocumented datum assumption. The audit therefore stops before publication.

The generated result remains:

- 15 joined official records;
- 5 published Point features;
- 10 exclusions;
- 0 hard errors;
- `valid` generation status.

No real `LineString`, `MultiLineString`, `Polygon`, or `MultiPolygon` is published.

## Scope and method

The audit reviewed the excluded Xinyu candidates already identified by the project, with priority given to evidence that could support an alignment, compound extent, multi-part extent, generalized reference area, or published protection range. It did not trace aerial imagery, infer a polygon from a place name, or replace an existing Point with decorative geometry.

The review considered:

- official identity and category;
- whether the feature is naturally linear, areal, dispersed, or multi-part;
- official or institutional spatial evidence;
- whether the evidence describes a real boundary or only a locality, centre, area, or physical feature;
- source CRS and deterministic WGS84 conversion;
- public-use suitability;
- archaeological, battlefield, and other sensitivity;
- provenance, precision, and defensible uncertainty;
- the risk that users could mistake project geometry for a legal designation boundary.

## Candidate audit

| Rank | Candidate | Natural geometry | Evidence reviewed | Decision |
| --- | --- | --- | --- | --- |
| B | 斜里遗址 (Xieli Site), sixth-batch number `6-1-040` | Areal archaeological site | The provincial protection-range table states a GPS centre at `27°45′45.3″ N, 114°55′11.2″ E` and extends 30 m in each cardinal direction. Xinyu Museum identifies the site in Xieli Village, describes about 5,000 m² of archaeological remains, and records excavation context. | Best candidate, but not publishable yet. The source says only `GPS`; it does not identify WGS84, CGCS2000, or another datum, and it does not provide WGS84 vertices. Archaeological sensitivity makes the unresolved datum material. |
| B | 下保农民暴动旧址 (Xiabu Peasant Uprising Sites), sixth-batch number `6-5-321` | Two-part built-site extent | The provincial table defines separate offsets from the event-site structure and meeting-site building and gives their areas as 283.2 m² and 110.6 m². | A future `MultiPolygon` may be possible, but no public georeferenced building footprints or boundary vertices were found. Converting village-level identity into two polygons would require unsupported tracing. |
| B | 袁州明代城墙砖窑址群（芦塘窑址）, sixth-batch number `6-1-022` | Multi-part archaeological kiln group; the Xinyu component is areal | The provincial table identifies thirteen components. For 芦塘窑址 it defines the north edge by a village road, east by a ditch, south by a terrace, and west by a reservoir embankment. | The rule describes a real extent, but no georeferenced component map or vertices were found for the Xinyu component. The broader designation is multi-part and archaeological. Do not derive a polygon from unnamed map features. |
| C | 彭家山遗址 (Pengjiashan Site), sixth-batch number `6-1-039` | Areal archaeological site | The provincial table defines offsets from an existing protection fence: 10 m east and south, 2 m west, and 3 m north. Xinyu Museum independently identifies the site. | The fence itself is not published as georeferenced geometry. Without its surveyed footprint, the offset rule cannot produce a defensible polygon. |
| C | 棋盘山遗址 (Qipanshan Site) | Areal archaeological site | Xinyu Museum describes a roughly rectangular stepped platform, more than 10,000 m² overall with a 3,000 m² central area, and a surrounding ditch. | This is descriptive morphology, not a public boundary or georeferenced footprint. The site is archaeological and spatially extensive. |
| C | 北伐军仰天岗战场遗址 (Northern Expedition Yangtiangang Battlefield Site), sixth-batch number `6-5-318` | Broad linear/dispersed battlefield landscape | The provincial table describes a roughly 3,000 m by 100 m area from Liangshannao to Gouxiongpo, focused on trenches, individual shelters, and exposed shell craters, with a stated area of 300,000 m². | The description lacks an alignment, centreline, vertices, or surveyed GIS extent. It is dispersed battlefield terrain and should not be reduced to a guessed line or rectangle. |
| C | 打鼓岭遗址 (Daguling Site), current record `JX-PCH-7-001` | Areal archaeological site | The current official source transcription identifies the record and locality at Kengkou Village Group, Zhushan Village, Luofang Town. Project research notes place it among a dense archaeological landscape. | No approved public coordinate, published boundary, mapped extent, or defensible uncertainty passed the existing gate. It remains excluded. |

The deferred 斜里遗址, 彭家山遗址, 下保农民暴动旧址, 北伐军仰天岗战场遗址, and 袁州明代城墙砖窑址群 records are not yet present as publication-ready records in the current fifteen-record machine aggregate. This audit does not invent stable record IDs or alter official source facts to make them renderable.

Rongquan Bridge was not selected as a replacement candidate. It is already one of the five published records, and the available evidence supports its reviewed approximate Point. No public centreline or surveyed bridge geometry was found that would justify replacing that Point with a line.

## Exact source evidence

### Provincial designation and protection range

- Notice: 江西省人民政府关于公布第六批江西省文物保护单位保护范围的通知, `赣府字〔2019〕18号`, dated 2019-03-07.
- Historical original government page, now unavailable: `https://www.jiangxi.gov.cn/art/2019/3/15/art_5296_668434.html`
- Historical original government PDF URL recorded by the public mirror, now unavailable: `https://www.jiangxi.gov.cn/module/download/downfile.jsp?classid=0&filename=832d2558778c4c74b60d601a5e3eb2bc.pdf`
- [Public archival mirror used for the page-level review](https://commons.wikimedia.org/wiki/File%3A%E7%AC%AC%E5%85%AD%E6%89%B9%E6%B1%9F%E8%A5%BF%E7%9C%81%E6%96%87%E7%89%A9%E4%BF%9D%E6%8A%A4%E5%8D%95%E4%BD%8D%E4%BF%9D%E6%8A%A4%E8%8C%83%E5%9B%B4%E4%B8%80%E8%A7%88%E8%A1%A8.pdf)

The source is an administrative document published for public use. The archival mirror identifies the author as the Jiangxi Provincial People's Government and records the work as public-domain government material under the applicable Chinese copyright exception. The project uses only the factual protection-range statements and does not copy decorative or photographic material.

The decisive Xieli row is on printed page 10 of the annex. It states:

> 以GPS（北纬27°45′45.3″，东经114°55′11.2″）为中心，向东、南、西、北四面方向各延伸30米。

For research comparison only, the DMS centre transcribes arithmetically to approximately `[114.919777778, 27.762583333]`. This transcription is not published as WGS84 because the source does not specify the GPS datum.

### Institutional identity and site descriptions

- Xieli Site, Xinyu Museum: <https://www.xysmuseum.com/596.html>
- Qipanshan Site, Xinyu Museum: <https://www.xysmuseum.com/591.html>
- Xinyu provincial heritage promotion notice listing the sixth-batch records: <https://www.xysmuseum.com/183.html>
- Current Xinyu official register: <https://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml>

The institutional pages support identity, type, locality, scale, and archaeological context. They do not supply reusable boundary vertices or resolve the Xieli datum.

## CRS and conversion decision

No CRS conversion was performed and no coordinate entered production data.

The Xieli source labels its centre only as `GPS`. It does not state WGS84, CGCS2000, GCJ-02, BD-09, Beijing 1954, or Xi'an 1980. The existing publication pipeline requires WGS84 coordinates and preserves non-WGS84 provider evidence before deterministic conversion. That requirement cannot be satisfied by assuming a datum from the word `GPS`.

Even though WGS84 and CGCS2000 may be close enough for many display purposes, the source does not authorize that reconciliation, and a public archaeological protection-range polygon needs a stronger record than a general compatibility assumption.

## Sensitivity and legal-boundary assessment

All audited archaeological and battlefield candidates receive a conservative sensitivity treatment.

- The Xieli centre and 30 m rule are already public, so the audit does not reveal a new hidden location.
- Publication would nevertheless turn a textual rule into easily reusable machine geometry. That increases the importance of datum confirmation and explicit authority review.
- The Xinyu Museum page records excavation and burial evidence. No separate authority statement was found confirming that machine-readable public boundary reuse is appropriate.
- Battlefield and dispersed archaeological landscapes were not simplified into rectangles, centrelines, or general areas.

Any future project-created geometry must say it is a project digitization or reference and not a substitute for the authoritative legal protection-range record. The current audit does not publish a legal-boundary representation.

## Evidence gaps and next research action

Before reconsidering Xieli, obtain at least one of:

1. the original GIS polygon or surveyed boundary vertices from the Jiangxi or Xinyu cultural-heritage authority, with an explicit CRS;
2. written confirmation that the published GPS centre uses WGS84 or CGCS2000, plus the authority's intended geometric construction for the four 30 m extensions; or
3. an official or institutional georeferenced map that shows the protection range and states its CRS.

Also request a sensitivity/public-reuse confirmation for machine-readable archaeological geometry. If the response identifies CGCS2000, record the original coordinate and CRS, document the deterministic CGCS2000-to-WGS84 treatment, and quantify any transformation uncertainty before generating vertices.

For Xiabu, obtain a georeferenced plan or official coordinates for both component buildings. For the Lütang kiln component and Pengjiashan, obtain the surveyed component/fence geometry rather than tracing visible landscape features. For Yangtiangang, obtain the official alignment or GIS extent rather than approximating the stated dimensions.

## Before-and-after counts and generated output

| Measure | Before audit | After audit |
| --- | ---: | ---: |
| Joined official records | 15 | 15 |
| Published Point features | 5 | 5 |
| Published non-Point features | 0 | 0 |
| Total published features | 5 | 5 |
| Exclusions | 10 | 10 |
| Hard errors | 0 | 0 |
| Generation status | `valid` | `valid` |

The committed `data/jiangxi-provincial-protected-heritage-map.geojson` remains byte-for-byte current.

## Production behavior

Production behavior is intentionally unchanged:

- the official layer remains off by default;
- enabling it displays the existing five Point markers;
- no real line, polygon, area, or other non-Point geometry appears;
- official and community category controls remain unchanged;
- Search, Filters, URLs, Map position, zoom, and community records remain unchanged;
- the existing synthetic geometry coverage remains the only non-Point browser coverage.

There is no new popup, accessible name, keyboard target, category count, or multipart count to verify because no real geometry was published.

## Rollback and limitations

Rollback is documentation-only: remove this audit and restore the two status references that link to it. No data regeneration or application rollback is required.

This was a public web and document audit, not a cadastral survey, authority consultation, or field inspection. Search indexing can omit official plans, and the original Jiangxi government URLs were intermittently unavailable during review. The archived PDF was compared visually at the relevant pages, but the missing datum remains unresolved.

At this historical audit's stop point, no follow-on implementation PR had started. Current decision authority comes from the standalone [official-record publication policy](../policy/official-record-publication-policy.md), not this document.
