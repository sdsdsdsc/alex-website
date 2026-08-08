# Phase 15C-20 — Xieli Generalized Point publication proposal

## Decision and scope

This phase implements the separately approved P04 publication proposal from
[Phase 15C-18](./phase-15c-18-xinyu-generalized-point-reassessment.md) through
the structured contract delivered by
[Phase 15C-19](./phase-15c-19-generalized-point-contract-implementation.md).
The proposal adds only 斜里遗址 (Xieli Site), machine identity
`JX-XY-PCH-004`, as the first Generalized reference Point. It does not approve
another identity, a line, an area, a second active representation, a map
provider change, or the later ordinary-Point evidence audit.

This document describes the PR #78 branch result. Until the draft PR is
separately merged and the automatic deployment is verified, live production
remains the seven-ordinary-Point baseline and Xieli remains unpublished there.

## Official identity

The authority-neutral and provincial compatibility source files add the same
stable official record without changing the register facts:

- official name: `斜里遗址`;
- project English interpretation: `Xieli Site`;
- official category: `古遗址`;
- official locality: `渝水区珠珊镇洋津村`;
- protection level: `省级文物保护单位`;
- designation number: `6-1-040`; and
- designation batch: `第六批江西省文物保护单位`.

The 2025 Xinyu register remains the official identity source. Adding the
previously absent machine record changes the canonical source count from 17
to 18. It does not remove an exclusion: the ten older Phase 14 records still
lack approved public-location decisions. The truthful branch reconciliation
is therefore `18 source records = 8 features + 10 exclusions`, not `17 = 8 +
9`.

## Published representation

| Item | Approved value |
| --- | --- |
| Original notation | `27°45′45.3″ N, 114°55′11.2″ E` |
| Literal decimal transcription | `[114.91977777777778, 27.762583333333332]` |
| Public representative | `[114.9198, 27.7626]` WGS84 GeoJSON order |
| Accepted interpretations | WGS84 and CGCS2000 |
| Source-notation radial half-unit precision | `2.07 m` |
| Maximum interpretation/frame allowance | `1 m` |
| Source-described support | 60 × 60 m cardinal square |
| Maximum unadjusted support-corner distance | `42.43 m` |
| Intentional four-decimal rounding displacement | `2.87 m` |
| Outward support coverage | `50 m` |
| Active representation | `JX-XY-PCH-004:generalized-point:v1` |

The representative is a deterministic Point for the source-described support
area. It is not a provider pin, exact site coordinate, excavation, grave,
entrance, archaeological extent, or legal protection boundary. No Gaode,
Baidu, commercial-provider coordinate, square, Polygon, or duplicate ordinary
Point is added.

The legacy `estimatedUncertaintyMeters`, `horizontalUncertaintyMetres`, and
`generalizationRadiusMeters` values are all `50`, agreeing with the structured
contract's outward-coverage summary. They do not replace its separate source
precision, datum, support, rounding, provenance, review, and representation
fields.

## Persistent public wording

The existing controlled limitation remains visible in the popup and included
in the marker accessible name:

> Generalized reference location. This marker represents the documented
> general vicinity of the heritage record. It does not show the exact feature,
> centre, entrance, extent, or legal protection boundary.

The additive Xieli limitation is:

> Generalized reference location for the source-described Xieli vicinity.
> Constructed from the published GPS centre and four 30 m offsets. The
> reference is neither an excavation, grave, entrance, site centre,
> archaeological extent nor legal protection boundary.

The hollow diamond provides the visual distinction; the complete text supplies
the non-colour and assistive-technology distinction. The sidebar now reports
loaded filled- and hollow-diamond counts instead of claiming that no
Generalized Point is published in the branch data.

## Branch data result

The deterministic canonical output contains:

- 18 source records;
- eight Point features;
- seven ordinary Points and one Generalized Point;
- one national and seven provincial records;
- ten exclusions;
- zero lines or areas; and
- P04 as the sole newly published identity.

The provincial compatibility output contains 17 source records, seven Point
features, six ordinary Points, one Generalized Point, and ten exclusions.

Branch SHA-256 values are:

- public-location decisions:
  `1720f86b3b84994fd80d8dcedb10c2e18a9a32939d70bd7e6c965f0dc2345ef3`;
- canonical Official Heritage GeoJSON:
  `a4912e63d1fd7f0e0d9195cff13ed598d949673ba3ea41462d39810d0a8e88f9`;
  and
- provincial compatibility GeoJSON:
  `c5fbfbef3cbdc30f0b3d02443b250a8089be668f701c3c9eca7391a1e488cbd9`.

## Preservation and rollback

The seven existing ordinary Points retain their coordinates, identity,
representation meaning, evidence, level, and popup text. Community Heritage,
Firebase, filters, workflows, and deployment configuration are unchanged.
Outcome B, C, and D identities remain unpublished. PR #79 is not begun.

Before merge, rollback is branch/PR abandonment. After a separately approved
merge, one merge revert removes the source record, decision, derived outputs,
count refresh, focused tests, and documentation together; no database migration
or manual deployment rollback is required.
