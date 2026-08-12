# Phase 15C-26 — M31 authority-shape evidence acquisition

## Decision

**M31 remains Outcome B after Phase 15C-26; no production shape is authorized.**

This M31-only investigation recovered the original New Yu City government
announcement and its two government-hosted M31 attachments. That resolves the
original-host and publication-provenance questions, but it does not resolve the
geometry chain. The official survey drawing is itself only `554 × 371` pixels;
no higher-resolution plan, PDF, TIFF, CAD, GIS, coordinate table, survey report
or download package was found. Its border/grid values remain unreadable, and
`2000国家大地坐标系` does not identify the projection, zone, central meridian,
false origins, scale factor, axis order or any local engineering offset.

The government portal's copyright statement also reserves site content and
requires authorization before republishing material supplied by another unit.
The plan does not identify a reusable-data licence or establish who owns the
survey drawing and derived coordinate rights. Exact grave-area republication
on an interactive map remains unapproved. No coordinate, ring, provisional
fixture or production geometry was constructed.

## Scope and protected boundary

- Baseline: `f0213946a9e93f0783f1b493b455d08850476c01`.
- Branch: `codex/investigate-m31-authority-shape-evidence`.
- Access and research date: `2026-08-11`.
- Candidate: M31 九龙山革命烈士纪念塔与墓 only.
- Starting and final result: Outcome B.
- Starting record: [Phase 15C-25 deep investigation](./phase-15c-25-nine-shape-candidate-deep-investigation.md).
- Controlling policy: [Official Heritage publication policy](../policy/official-record-publication-policy.md).

N01, N02, P01, P02, P12, P16, M01, M04, P09, P04 Xieli and every other
identity were not reopened. Production remains 19 source records, nine Point
Features (eight ordinary and Xieli as the sole Generalized Point), ten
exclusions, one national/seven provincial/one municipal active records, zero
lines and zero areas.

| Protected production artifact | Before | Required after |
| --- | --- | --- |
| Public-location decisions | `95c6531d51e49caabf566b68f62087a6512bf9e4fd046d35819f44d8b3782f5b` | identical |
| Canonical Official Heritage GeoJSON | `eb99e7a222d2a8af40e294f650e043cb73bdc82f6eabf728f5c1ef29c03a64b3` | identical |
| Provincial compatibility GeoJSON | `c5fbfbef3cbdc30f0b3d02443b250a8089be668f701c3c9eca7391a1e488cbd9` | identical |

## Authority-source recovery

The exact original announcement is:

- **Title:** `关于划定新余市仰天岗烈士陵园、九龙山乡革命烈士纪念碑及烈士墓地保护范围和建设控制地带的公告`.
- **Issuer shown in the notice:** 新余市人民政府.
- **Portal source field:** 新余市人民政府办公室.
- **Date/time:** 2024-12-31 17:50.
- **Source type / authority level:** municipal-government public notice.
- **Official URL:** [Xinyu City government portal](https://www.xinyu.gov.cn/xinyu/zwgg/2024-12/31/content_70e66cfad5164b9785055d93f3ccd1ed.shtml).

The article has no displayed document number and exposes its M31 material as
two inline image files, not separately downloadable annex documents:

| Official attachment | Format, bytes and dimensions observed | Spatial information | Blocker resolved? |
| --- | --- | --- | --- |
| [M31 orthophoto annotation](https://www.xinyu.gov.cn/xinyu/zwgg/2024-12/31/70e66cfad5164b9785055d93f3ccd1ed/images/c8e0cb4152c44e5e8a2c1bcbfa6dee64.png) | PNG; 695,118 bytes; `554 × 313`; SHA-256 `d2c589974454c5974e01a07587ef55527af3f0ec46cf91b9f252fb3fd8dfbb2b` | Public visual separation of monument, grave and control-zone concepts | Resolves original hosting and visual context, not coordinates, CRS or reuse |
| [M31 survey drawing](https://www.xinyu.gov.cn/xinyu/zwgg/2024-12/31/70e66cfad5164b9785055d93f3ccd1ed/images/f90164696020406bbc3b76ba14c0d84d.jpg) | JPEG; 101,543 bytes; `554 × 371`; SHA-256 `7d7f949d8a40a828f9191ed7ddb65af51f7e4517ae012c7a5f84686ab0b38842` | 1:500 plan, December 2024 digital-survey notation, named horizontal/vertical references and separated protection/control areas | Resolves original hosting, but resolution still prevents coordinate recovery |

The earlier [Sohu copy](https://www.sohu.com/a/844378542_121106994)
is a 2025-01-02 syndication attributed to 新余政务. The
[Huizang copy](https://www.huizang.com/policy/4758.html), dated 2025-01-07,
was useful only because its HTML retained the original government image URLs.
Neither mirror is used as the geometry authority.

Exact-title, article-ID, image-filename, drawing-title, CAD/DWG, GIS, KML,
shapefile, PDF, coordinate-table, survey-report and annex searches produced no
additional authority file or alternative official copy. The government
announcements index confirms the original article URL. The original HTML
declares the displayed image dimensions, confirming that the 554-pixel survey
drawing is not merely a Sohu thumbnail. No raw spatial file was recovered.

## Material-source ledger

| Title / source, issuer and date | Source type / authority | Spatial contribution | Reuse position and blocker effect |
| --- | --- | --- | --- |
| [Protection-range announcement](https://www.xinyu.gov.cn/xinyu/zwgg/2024-12/31/content_70e66cfad5164b9785055d93f3ccd1ed.shtml), 新余市人民政府; portal source 新余市人民政府办公室; 2024-12-31 | Original municipal-government notice | Identity, address, separate monument/grave offsets and areas, control-zone area, and original attachment paths | Administrative facts are authoritative; resolves original-host provenance but supplies no raw geometry or complete CRS |
| [M31 orthophoto annotation](https://www.xinyu.gov.cn/xinyu/zwgg/2024-12/31/70e66cfad5164b9785055d93f3ccd1ed/images/c8e0cb4152c44e5e8a2c1bcbfa6dee64.png), published by 新余市人民政府办公室; 2024-12-31 | Original municipal-portal attachment; underlying imagery/author not identified | Visual component and control-zone context | No licence; too small and not a coordinate source; resolves no derivation gate |
| [M31 survey drawing](https://www.xinyu.gov.cn/xinyu/zwgg/2024-12/31/70e66cfad5164b9785055d93f3ccd1ed/images/f90164696020406bbc3b76ba14c0d84d.jpg), published by 新余市人民政府办公室; survey label December 2024 | Original municipal-portal survey-plan attachment; drawing creator/rightsholder not established | Scale, named horizontal/vertical references and protection/control-area separation | No licence; `554 × 371` prevents coordinate recovery; original hosting resolved, all spatial derivation gates remain |
| [Xinyu portal copyright statement](https://www.xinyu.gov.cn/xinyu/bqsm/2021-03/29/content_f7db9911d66f4f5696b8cd7da024d1b6.shtml), 新余市人民政府; 2021-03-29 | Municipal portal terms | No spatial information | Reserves site copyright and requires authorization for material supplied by another unit; does not clear plan/coordinate reuse |
| [Copyright Law of the PRC](https://flk.npc.gov.cn/detail2.html?MmM5MDlmZGQ2NzhiZjE3OTAxNjc4YmY3MTE0ZDA2ZTE%3D), 全国人民代表大会常务委员会; 2020 amendment | National primary law | Distinguishes official administrative documents from maps/engineering drawings as potential works | Supports a cautious distinction; does not establish ownership or an open licence for this plan |
| [Sohu syndication](https://www.sohu.com/a/844378542_121106994), attributed to 新余政务; 2025-01-02 | Commercial-media mirror of municipal notice | Discovery copy of notice and drawing | Grants no geometry rights and is not geometry authority |
| [Huizang copy](https://www.huizang.com/policy/4758.html), Huizang; 2025-01-07 | Commercial policy mirror | Retains original government image URLs in HTML | Discovery lead only; grants no geometry rights |

All sources were accessed on 2026-08-11. Exact-title, article-ID,
image-filename and spatial-file searches are the material failed searches: they
found no PDF/TIFF/CAD/GIS/KML/shapefile/coordinate-table/survey-report annex,
no alternative official copy, and no reuse licence.

## Facts preserved from Phase 15C-25

The authority notice places M31 opposite 九龙山乡人民政府 and distinguishes:

1. monument protection area: the monument centre plus 10 m in every cardinal
   direction, approximately 400 m²;
2. grave protection area: grave centre plus 8.5 m east, 4.2 m south, 5.1 m
   west and 4.3 m north, approximately 97.1 m²; and
3. construction-control zone: approximately 27,016.2 m².

The plan labels scale `1:500`, a December 2024 digital survey,
`2000国家大地坐标系`, and `1985国家高程基准`. These facts remain reliable as
notice text and drawing labels. Area totals and directional offsets do not
identify the two centres, bearing/orientation, source coordinates or complete
ring vertices, so they cannot legitimately be converted into provisional
rectangles or inferred from pixels.

## CRS and transformation reconciliation

The full horizontal CRS is **unresolved**.

- The plan names CGCS2000 but does not establish whether coordinates are
  geographic, Gauss–Krüger/projected, or a local engineering grid.
- No legible source coordinate or grid value is recoverable.
- Projection family, zone, central meridian, false easting, false northing,
  scale factor, units, axis/coordinate order and local offsets are absent.
- No EPSG identifier can be selected unambiguously.
- Xinyu longitude is not used to guess a zone or central meridian.

Therefore there is no reproducible CGCS2000-to-WGS84 transformation, command,
vertex precision or transformation-uncertainty result. Gaode/Baidu conversion,
image alignment, provider tracing, area-derived reconstruction and blurry-digit
interpretation were not used.

The `1985国家高程基准` label is vertical-datum provenance. A future 2D GeoJSON
protection boundary would use XY only, so height values are not required for
that representation; no Z values are invented. The vertical label does not
complete the horizontal CRS.

## Reuse and provenance gate

The announcement's administrative facts and legal directions are distinct from
the embedded survey drawing. The [current Copyright Law](https://flk.npc.gov.cn/detail2.html?MmM5MDlmZGQ2NzhiZjE3OTAxNjc4YmY3MTE0ZDA2ZTE%3D) excludes certain
official administrative documents from copyright protection, but it separately
recognizes maps, diagrams and engineering drawings as works. That distinction
does not prove that an embedded contractor/survey drawing or derived coordinate
dataset is unrestricted.

The [Xinyu portal copyright statement](https://www.xinyu.gov.cn/xinyu/bqsm/2021-03/29/content_f7db9911d66f4f5696b8cd7da024d1b6.shtml)
says site copyright is reserved, prohibits commercial original-form
republication, and requires direct authorization before republishing material
provided by another unit. The plan image does not name a licence. Its small
title block appears to contain personnel fields, but the pixels are not used to
guess creator names, employer, ownership or permission.

Consequently:

- notice text may establish the legal protection-area facts;
- public visibility does not establish permission to reproduce/digitize the
  plan as a new coordinate dataset;
- the Sohu and Huizang mirrors grant no geometry rights;
- authority-supplied GIS/CAD was not found; and
- a future digitization, if authorized and georeferenceable, would be a
  **project-reviewed derivation from authority evidence**, not official GIS.

The geometry-reuse gate remains failed pending explicit permission or a clear
applicable open-data/reuse statement from the government and, if distinct, the
survey-plan rightsholder.

## Geometry meaning and topology

If exact reusable source geometry is later obtained, the truthful active
Official Heritage meaning would be **authority-defined protection-area
geometry**, likely a MultiPolygon containing only:

- the monument protection-area Polygon; and
- the disconnected collective-grave protection-area Polygon.

The 27,016.2 m² construction-control zone has a different legal/planning
meaning and must not be placed into that MultiPolygon. It would require a
separate context-layer decision outside this phase. A false connector, convex
hull, generic park/village boundary, control-zone substitute or imagery trace
would be misleading.

Because no ring coordinates were recovered, component separation, closure,
self-intersection, duplicate vertices, orientation, holes and ordering cannot
be tested. The likely MultiPolygon is a semantic hypothesis, not verified
topology. No spatial or transformation uncertainty can be quantified.

## Grave/access disclosure decision

The authority intentionally publishes the facility's locality, grave-area
dimensions and annotated plans, and frames the facilities as memorial and
patriotic-education resources. That supports legitimate public-interest
context, but it does not itself approve extracting and republishing exact grave
vertices in a searchable interactive map.

Visitor access rules, site management expectations, vandalism/protection risk,
and the authority's view on exact downstream grave-boundary reuse were not
found. The Phase 15C-26 decision is therefore **withhold the entire exact shape
pending an authority/owner disclosure decision**. A generalized substitute is
not proposed because it would blur an asserted legal protection boundary. This
unresolved gate independently prevents Outcome A.

## Technical compatibility and outcome

The existing schema and renderer already accept synthetic Polygon and
MultiPolygon fixtures, so no generic technical blocker or infrastructure
redesign was found. Candidate compatibility cannot be exercised without
inventing geometry. M31 has no active representation; no supersession is
expected. No provisional fixture, browser run or topology result exists.

M31 remains a plausible two-component protection-area MultiPolygon in
principle. It does not reach Outcome A because the following material blockers
remain:

1. original high-resolution/raw plan, CAD/GIS or coordinate table;
2. recoverable control coordinates and complete horizontal CRS parameters;
3. reproducible WGS84 transformation and defensible uncertainty;
4. verified source topology;
5. clear plan/derived-coordinate reuse permission and attribution terms; and
6. explicit exact-grave-geometry disclosure approval.

**M31 remains Outcome B after Phase 15C-26; no production shape is authorized.**

## Verification and stop point

The branch changes documentation only. It does not change production records,
decisions, GeoJSON, generator, schema, runtime, renderer, popup, sidebar,
filters, lifecycle, Firebase, Community Heritage, providers or deployment.
Production remains 19 records, nine Points, ten exclusions, zero lines and zero
areas. No publication PR is authorized by this result.

| Check | Result |
| --- | --- |
| Baseline and M31-only scope | Pass: branch starts at exact baseline `f0213946a9e93f0783f1b493b455d08850476c01`; only M31 is investigated |
| Source URL availability | Pass: original notice, both official attachments, portal copyright terms, national legal database and both discovery mirrors returned HTTP 200 on 2026-08-11 |
| Authority/source reconciliation | Pass: original municipal portal, article metadata, government announcements index and attachment paths agree |
| CRS reconciliation | Pass as a negative result: CGCS2000 is named, but required projection/control parameters are not recoverable and no EPSG/WGS84 path is asserted |
| Reuse-rights conclusion | Pass as a negative gate: no open licence or derivation permission; portal terms require authorization for third-party material |
| Disclosure conclusion | Pass: withhold the exact shape pending an authority/owner exact-grave disclosure decision |
| Provisional topology | Not applicable: no reproducible geometry exists; no ring or fixture was constructed |
| Local documentation links | Pass: all links in changed documentation resolve |
| JSON/GeoJSON parse | Pass: all repository data JSON and GeoJSON parse |
| Zero-production-shape assertion | Pass: canonical output has nine Points and zero LineString, MultiLineString, Polygon or MultiPolygon Features |
| Official Heritage validation | Pass: 19 records, nine approved decisions/Features, ten expected exclusions, zero hard errors and seven provincial compatibility Features |
| Deterministic generation | Pass: canonical and compatibility GeoJSON files are byte-for-byte current |
| Full `npm test` | Pass, including 62 Firestore-rule and 18 Storage-rule tests |
| Browser smoke | Not required: no runtime or provisional candidate fixture changed |
| `git diff --check` | Pass |
| Protected hashes | Pass: all three match the required before values |
