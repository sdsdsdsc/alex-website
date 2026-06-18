# Phase 11A Community Places Audit Worksheet

## Purpose

This worksheet records a read-only review of the public `communityPlaces` data available locally in `data/communityPlaces.json`. It applies the checks in `docs/phase-11a-data-cleanup-audit-plan.md` without connecting to Firebase or changing application data or behavior.

The local JSON file is a snapshot, not proof of the current contents of Firebase. Records known from project documentation but absent from this file are listed as scope limitations rather than audited records.

## Safety Boundaries

- No Firebase connection, read, write, migration, or deletion was performed.
- No JSON data was changed.
- No private `placeNominations` data was inspected or copied into this worksheet.
- No record is recommended for deletion. Records needing further review use `possible cleanup later` only.
- Public records must not contain nomination contact details, admin notes, admin assessment fields, or review history.

## Local Source Summary

- Source reviewed: `data/communityPlaces.json`
- Source format: JSON array
- Records available locally: 1
- Records reviewed: 1
- Snapshot limitation: `communityPlaces / jiangxi-test-community-square` is named in the Phase 11A plan as a known regression record, but it is not present in the local JSON file and therefore is not classified below.

## Record Audit

| Collection | Record ID | Public title/name | Likely public status | Coordinate status | Title quality | Description quality | Category / assetType consistency | Criteria / significance status | Relationship status | Privacy risk check | Recommended next action | Needs user confirmation? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `communityPlaces` | `old-anyuan-company-community-park` | Old Anyuan Company Community Park | Implicitly public: `recordStatus` is absent, and current public search logic treats an absent status as public | Valid latitude and longitude are present | Strong public record; clear and place-specific title | Strong public record; concise public description identifies location, use, and community role | `category` is `Park`; `assetType` is missing; `associatedType` contains `Community Public Space`, so later vocabulary alignment needs confirmation | Missing criteria/significance: no `localSignificanceSummary`, `heritageCriteria`, or `criteriaExplanation` is present | One structured `relatedArticles` reference to a `history` record is visible; target availability was not verified against Firebase | No issue found: none of the known private nomination/admin field names are present | Keep as sample/regression. Later consider adding a confirmed `assetType`, significance summary, criteria, and criteria explanation; verify the related history target before any relationship cleanup | Yes, for factual enrichment and vocabulary alignment; no cleanup or deletion action is proposed |

## Classification Summary

### Strong Public Records

- `old-anyuan-company-community-park`: strong title, usable description, valid coordinates, clear category, and no known private/admin fields.

### Sample / Regression Records

- `old-anyuan-company-community-park`: explicitly identified in the Phase 11A plan and site structure documentation as a record to protect during regression testing.
- `jiangxi-test-community-square`: known from the Phase 11A plan, but not reviewed because it is absent from the local JSON snapshot.

### Records Needing Later Polish

- `old-anyuan-company-community-park`: missing `assetType` under the current field model, although the legacy-style `associatedType` field provides a possible value that requires user confirmation.
- `old-anyuan-company-community-park`: missing Local Heritage Record fields for significance and criteria.
- `old-anyuan-company-community-park`: its related history target should be verified against the active `history` collection before any relationship edit is considered.

## Privacy Review

No known private nomination or admin-only fields were found in the locally available record. Specifically, the record does not contain:

- `nominatorEmail`
- `adminNotes`
- `adminHistoricInterest`
- `adminArchitecturalInterest`
- `adminCommunityValue`
- `adminConditionRisk`
- `adminAssessmentSummary`
- `reviewHistory`

This check covers field presence in the local snapshot only. It does not verify live Firebase records or the content behind external references.

## Later Review Notes

Before any later data edit:

1. Compare this worksheet with a fresh private admin backup of `communityPlaces`.
2. Confirm which records are intentional samples or regression fixtures.
3. Confirm vocabulary choices for `category`, `assetType`, and any legacy `associatedType` value.
4. Verify relationship targets in `news` and `history` by collection and stable ID.
5. Add significance or criteria content only from confirmed source material.
6. Obtain explicit confirmation before any cleanup action.
