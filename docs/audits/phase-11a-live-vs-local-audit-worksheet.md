# Phase 11A Live-vs-Local Audit Worksheet

## Purpose

This worksheet compares redacted metadata from the Phase 11A live read-only backup with the existing local Phase 11A worksheets and snapshots.

It is a planning document only. It does not authorize cleanup, deletion, migration, rule changes, or any Firebase data edit.

## Source Boundaries

- The live backup files remain private and are stored outside the repository.
- This committed worksheet contains only redacted metadata and safe counts.
- `placeNominations` remains private and admin-only.
- No backup payloads, record bodies, nomination text, emails, admin notes, review history details, or evidence URLs are copied into this file.

## Count Comparison

| Collection | Local snapshot count | Live backup count | Difference | Interpretation |
| --- | --- | --- | --- | --- |
| `communityPlaces` | 1 | 5 | +4 | Live contains more public place records than the locally reviewed snapshot. These are live-only records needing review, not automatic cleanup candidates. |
| `news` | 2 | 2 | 0 | Live and local reviewed counts match. Record quality still needs review, but the count is stable. |
| `history` | 2 | 3 | +1 | Live contains one more history record than the locally reviewed snapshot. The extra live record needs redacted review, not immediate action. |
| `placeNominations` | 0 public-safe rows | 4 | +4 | Private nominations were intentionally excluded from the earlier public-safe local worksheets. Their live presence is expected and remains admin-only. |

## Public Collection Record Worksheet

| Collection | Record ID | Public title/headline | Live/local comparison | Coordinates | Body/content | Image field | Relationships | Prohibited private/admin field names present | Classification | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `communityPlaces` | `old-anyuan-company-community-park` | Old Anyuan Company Community Park | Present in local snapshot and live backup | Present and valid | Present | Not present | `relatedArticles` present | No | sample/regression record | Keep as protected regression/sample record. Later verify whether `assetType`, criteria, and significance fields should be enriched. |
| `communityPlaces` | `jiangxi-test-community-square` | Jiangxi Test Community Square | Live-only relative to local `data/communityPlaces.json`, but already known in project notes as a tested record | Present and valid | Present | Not present | `relatedArticles` present | No | sample/regression record | Keep as a tested place/article relationship record and verify it remains part of the intended regression set. |
| `communityPlaces` | `test-nomination-place` | Test Nomination Place | Live-only relative to the local public worksheet | Missing or not exported in live metadata | Present | Not present | No related links visible | No | live-only needs review | Confirm whether this is an intentional nomination-promotion sample or a record needing later public metadata polish. |
| `communityPlaces` | `xinyu` | xinyu | Live-only relative to the local public worksheet | Missing or not exported in live metadata | Present | Not present | No related links visible | No | live-only needs review | Review public title quality, coordinate completeness, and whether this record is a long-term public place record or a sample needing later polish. |
| `communityPlaces` | `yicun` | yicun | Live-only relative to the local public worksheet | Present and valid | Present | Not present | No related links visible | No | live-only needs review | Review public title quality and confirm whether this should remain a published public place record. |
| `news` | `XloYqPaGaKapX0ub8qic` | community introduce | Present in both local review and live backup | Not applicable | Present | Present | No related places visible | No | needs polish | Keep for review and compare with the earlier local worksheet finding that headline and public-purpose clarity may need improvement. |
| `news` | `hcAoUBmPZEJJn2tkremf` | Why the image got duplicated | Present in both local review and live backup | Not applicable | Present | Present | No related places visible | No | needs polish | Keep for review and confirm whether it remains intentional public news or a technical sample needing later classification. |
| `history` | `nvNabJ6fvHMzOz8eHzPv` | a few key contributors and milestones | Present in both local review and live backup | Not applicable | Present | Not present in live backup metadata | `relatedPlaces` present | No | strong public record | Keep as a strong history candidate and verify its related place links and editorial polish later. |
| `history` | `vIbjpOJjcUGRHXDS6kQb` | an old house | Present in both local review and live backup | Not applicable | Present | Present | No related places visible | No | needs polish | Keep for later review of headline quality, relationship completeness, and overall public purpose. |
| `history` | `FQrThxwuD7ZRtqxiAduC` | Jiangxi Test Community Square | Live-only relative to the earlier local article-storage worksheet, but already named in project notes as a regression record | Not applicable | Present | Not present in live backup metadata | `relatedPlaces` present | No | sample/regression record | Keep as a protected regression record and verify its tested place relationship remains intentional. |

## Private Nomination Redacted Worksheet

| Redacted label | Safe status value | Has coordinates | Has review history | Has promotedPlaceId | Classification | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| `nomination-001` | `promoted` | No | No | Yes | promoted/sample review | Keep private. Later confirm whether this promoted nomination is an intentional workflow sample. |
| `nomination-002` | `promoted` | No | Yes | Yes | promoted/sample review | Keep private. Later review whether this is an intentional workflow sample and whether its review history structure remains coherent. |
| `nomination-003` | `promoted` | Yes | No | Yes | promoted/sample review | Keep private. Later confirm whether this promoted nomination should remain part of the protected workflow sample set. |
| `nomination-004` | `submitted` | Yes | No | No | needs admin review | Keep private and continue through the admin nomination workflow. No public action is authorized. |

All nomination rows above are intentionally redacted. No real document IDs, titles, names, emails, free-text content, review notes, evidence links, or other personal/private details are included here.

## Live-vs-Local Interpretation

- Live has more `communityPlaces` records than the local public snapshot. This means the local JSON-based worksheet was incomplete as a live inventory, not that the extra live records are unwanted.
- Live `news` count matches the local reviewed count, which suggests the local article worksheet captured the current news record total at the time of the live backup.
- Live `history` count is one higher than the local reviewed count. That extra live history record aligns with a regression record already referenced in project notes.
- Live `placeNominations` records exist in the private/admin workflow and were never meant to appear in the public local worksheets.
- `live-only` does not mean unwanted.
- `snapshot-only` would not mean recreate automatically.
- No cleanup decision is authorized from this worksheet.

## Recommended Next Step

Recommended next phase:

`Phase 11A-11 — Public communityPlaces live metadata polish plan`

That follow-up should stay redacted and planning-focused, using the public-safe findings above to propose title, coordinate, relationship, and field-completeness improvements without deleting data or exposing private nomination content.
