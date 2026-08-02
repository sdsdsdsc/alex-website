# Phase 15C-15 — Official Heritage authority-neutrality audit

## Purpose and scope

This audit records the correction applied inside draft PR #69 after N07 made
the proposed seven-Point collection mixed-level. It changes terminology,
containers, validation, and public presentation without changing any approved
identity, coordinate, uncertainty, geometry meaning, evidence gate, or
publication outcome. It does not merge or deploy the draft.

## Terminology classification

The repository-wide review classified occurrences rather than globally
replacing “provincial”:

- record-level values such as `省级文物保护单位`, `PCH` identifiers, and the six
  provincial proposed features remain correct;
- Phase 14 and later provincial-pilot audit text remains correct historical
  documentation;
- combined layer labels, counts, accessible names, loading/error messages,
  current Open Data wording, and current status text were incorrect when they
  called the mixed collection provincial and now use **Official Heritage**;
- the old Xinyu source and Jiangxi generated filename made an incorrect
  mixed-container assumption once N07 was added;
- the old module name is retained only as a compatibility implementation
  boundary, while the application imports the authority-neutral module; and
- “markers” and “reviewed lines and boundaries” were outdated guide wording
  and are now “representations” and “reviewed lines and areas.”

## Canonical and compatibility architecture

| Contract | Path | Draft feature set | Consumer |
| --- | --- | ---: | --- |
| Canonical mixed-level source | `data/xinyu-official-heritage-records.json` | 7 records: 1 national, 6 provincial | deterministic generator |
| Canonical combined GeoJSON | `data/jiangxi-official-protected-heritage-map.geojson` | 7 Points | public Map and primary Open Data link |
| Legacy provincial source | `data/xinyu-provincial-heritage-marker-pilot.json` | 6 provincial records | compatibility generation |
| Legacy provincial GeoJSON | `data/jiangxi-provincial-protected-heritage-map.geojson` | 6 provincial Points; no N07 | retained public URL |

The legacy output is not an alias for the mixed collection. Its metadata calls
it a provincial-only legacy public URL, links to the canonical combined file,
and validation rejects national or municipal inputs. No public URL is silently
broken or allowed to misclassify N07.

The application imports `heritage-engine/official-heritage-map.js`. The
historical `heritage-engine/provincial-heritage-map.js` retains the business
logic and compatibility exports so existing internal imports need not break;
all public wording and canonical aliases are authority-neutral.

## Interface result

The Layers panel contains one default-off, lazy **Show Official Heritage**
master switch. The existing category controls sit beneath it. There are no
national, provincial, or municipal filter checkboxes. Each popup instead shows
**Official designation level: National** or **Official designation level:
Provincial**, independently from geometry meaning, provenance, uncertainty,
limitations, and representation status.

The informational symbol guide remains four items:

1. **Project-reviewed reference Points** — filled diamond; currently 7;
2. **Generalized reference Points** — hollow diamond; supported, none published;
3. **Reviewed lines and areas** — solid line or restrained fill; supported,
   none published; and
4. **Approximate or generalized geometry** — dashed line or lighter fill;
   supported, none published.

The accompanying **About Official Heritage representations** text explains
that designation authority and representation authority are separate, public
categories do not replace official classification, every identity has one
active representation, and a later approved shape supersedes rather than
duplicates its Point.

## Preserved result

The canonical draft remains 17 source records, 7 Points, 10 exclusions, and
zero lines or areas. N07 remains National with `[115.011333, 27.805882]`, 100 m
uncertainty, and project-reviewed interpretation status. P19 remains Provincial
with `[114.995570, 27.667620]`, 150 m uncertainty, and component-only meaning.
The original five Points retain their coordinates and meanings. No generalized
Point, line, area, candidate re-evaluation, Community Heritage, or Firebase
change is included.
