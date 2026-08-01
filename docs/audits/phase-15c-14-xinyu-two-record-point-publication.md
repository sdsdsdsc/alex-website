# Phase 15C-14 — Xinyu two-record Point publication proposal

## Decision

Draft PR #69 now proposes exactly two separately approved Official Heritage
Points, in this order:

1. P19 — 下保农民暴动旧址——暴动举行地旧址;
2. N07 — 水西红三军团指挥部旧址.

This is a branch proposal, not a production publication. Live production
remains five Official Heritage Points and zero real line or area geometries
until PR #69 receives separate merge approval and the normal Pages deployment
completes.

## Proposed records

| Audit ID | Record ID | Official identity | Official designation level | WGS84 Point | Uncertainty | Meaning and status |
| --- | --- | --- | --- | --- | ---: | --- |
| P19 | `JX-XY-PCH-018` | 下保农民暴动旧址——暴动举行地旧址 | Provincial | `[114.995570, 27.667620]` | 150 m | Component-specific reference Point; project-reviewed public-location decision |
| N07 | `JX-XY-NCH-007` | 水西红三军团指挥部旧址 | National | `[115.011333, 27.805882]` | 100 m | `provider-located-project-reviewed-reference-point`; `project-reviewed-interpretation` |

P19 continues to identify only the separately listed 暴动举行地旧址
component. It does not represent the Xiabu parent designation, the
暴动会议地旧址 sibling, a compound or building footprint, a visitor entrance,
or a legal protection boundary.

N07 is a project-reviewed reference location based on the official record,
mapped-provider evidence and documented project digitization. It is not an
authority-supplied coordinate, surveyed heritage extent, building footprint,
legal protection boundary, guaranteed visitor entrance, or claim of precision
beyond its 100 m uncertainty.

## N07 source and numerical record

- official identity: eighth-batch national designation `8-0617-5-101`,
  水西红三军团指挥部旧址;
- official locality: 高新区水西镇沙陂村;
- physical-feature reconciliation: 廖氏祠堂 / 沙陂祠堂, supported by the
  national record, current Xinyu register, Xinyu Museum, Jiangxi University of
  Engineering, and independent reporting;
- provider identity: Gaode `B0IDTHR05Y` and Baidu
  `3de126b7771f4438d1f49ef3`;
- provider input: `[115.016436, 27.802641]` GCJ-02;
- deterministic ten-iteration inverse output:
  `[115.01133320220836, 27.805881566984727]` WGS84;
- retained Point: `[115.011333, 27.805882]` WGS84;
- review date: 2026-07-31; and
- retained horizontal uncertainty: 100 m.

No provider screenshot, map tile, commercial outline, or imagery is committed.

## Authority-neutral model and compatibility treatment

The canonical mixed-level source is
`data/xinyu-official-heritage-records.json`. The canonical generated public
aggregate is `data/jiangxi-official-protected-heritage-map.geojson`, and the
Map and primary Open Data link consume that file. It contains all seven Points:
one national record and six provincial records.

The historical `data/xinyu-provincial-heritage-marker-pilot.json` and
`data/jiangxi-provincial-protected-heritage-map.geojson` paths remain as
provincial-only compatibility contracts. They contain the six provincial
Points and exclude N07. Validation rejects a national or municipal record in
that compatibility source. The application imports the authority-neutral
`heritage-engine/official-heritage-map.js`; the historical provincial module
remains a compatibility implementation/re-export boundary without leaking
provincial wording into the combined public interface.

N07 retains the level-specific stable ID `JX-XY-NCH-007`; the six provincial
features retain their `PCH` IDs. The canonical `official.protectionLevelZh`
field preserves the official source level and is validated against the ID
prefix. This architecture changes no feature identity, coordinate, or spatial
meaning.

N07 alone uses explicit Point geometry metadata so the required evidence method
and representation status are visible and validated. Legacy Point metadata
derivation remains unchanged for the other six proposed branch features.

## Count and scope reconciliation

- source records: 17;
- active proposed features: 7 Points;
- exclusions: 10 protected Phase 14 records without approved public locations;
- LineString / MultiLineString: 0;
- Polygon / MultiPolygon: 0;
- existing five production Points: unchanged;
- P19: exactly one feature;
- N07: exactly one feature; and
- Community Heritage, Firebase, mixed-geometry lifecycle,
  Xieli, the Xiabu parent and meeting-site component, and the five withheld
  Phase 15C-13 candidates: unchanged or unpublished.

The draft interface now uses one default-off **Show Official Heritage** switch,
followed by the existing official-category controls. Official designation
level appears in each popup rather than as a sidebar filter. The four-item
informational guide covers project-reviewed reference Points, generalized
reference Points, reviewed lines and areas, and approximate or generalized
geometry; only the seven project-reviewed Points are currently populated.

## Stop point

Keep PR #69 draft and unmerged. Do not deploy manually or begin any additional
record, non-Point geometry, lifecycle, filter, or sidebar work from this
proposal.
