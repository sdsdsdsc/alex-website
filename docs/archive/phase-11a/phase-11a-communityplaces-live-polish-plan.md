# Phase 11A Community Places Live Polish Plan

## Purpose

This document turns the public-safe metadata findings from the Phase 11A live read-only backup into a content-polish plan for `communityPlaces`. It is a planning document only and does not authorize Firebase edits, cleanup, migration, rules changes, or deployment.

## Safety Boundaries

- Only public `communityPlaces` metadata was reviewed.
- The private backup remains outside the repository.
- No backup payload or private backup path is reproduced here.
- No `placeNominations` content was inspected or copied for this phase.
- No record is recommended for deletion. Uncertain records use `possible cleanup later` and require user confirmation.
- Field-presence checks do not establish factual accuracy or editorial quality. Those decisions require source review and user approval.

## Live Record Review

| Record ID | Public title/name | Title quality | Description quality | Coordinate status | Category status | AssetType status | Significance/criteria status | Relationship status | Privacy field check | Sample/regression role | Recommended next action | Needs user confirmation? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `jiangxi-test-community-square` | Jiangxi Test Community Square | Strong public record; clear and place-specific | Description present; editorial and factual review still required | Valid coordinates present | Category present; vocabulary alignment should be confirmed | Present | Significance summary, criteria, and criteria explanation present | Related articles present; relationship target should be verified | Privacy check passed | Keep as sample/regression; known tested place/article relationship record | Protect as a regression record and verify its category vocabulary, public wording, and relationship target before any edit | Yes, before content or vocabulary changes |
| `old-anyuan-company-community-park` | Old Anyuan Company Community Park | Strong public record; clear and place-specific | Strong public description in the local worksheet | Valid coordinates present | Category present; alignment with current vocabulary should be confirmed | Missing assetType | Missing significance/criteria | Related articles present; relationship target should be verified | Privacy check passed | Keep as sample/regression | Preserve the tested record; propose an `assetType`, significance summary, criteria, and criteria explanation only from confirmed sources | Yes, for enrichment and vocabulary alignment |
| `test-nomination-place` | Test Nomination Place | Generic test-style title; live-only needs review | Description present; quality confirmation needed | Missing coordinates | Category present; alignment check needed | Missing assetType | Significance summary, criteria, and criteria explanation present | No related articles visible; relationship verification needed if links are expected | Privacy check passed | Possible promotion/sample record; role not confirmed | Confirm whether it is an intentional workflow sample. If retained publicly, review title, coordinates, asset type, category, and relationship needs | Yes, before any edit or possible cleanup later |
| `xinyu` | xinyu | Needs title polish; capitalization and place specificity need review | Description present; quality confirmation needed | Missing coordinates | Category present; alignment check needed | Present | Significance summary, criteria, and criteria explanation present | No related articles visible; relationship verification needed if links are expected | Privacy check passed | Live-only needs review | Confirm the intended public name, add coordinates if appropriate and sourced, and review category, asset type, criteria, and relationship consistency | Yes, before any edit or possible cleanup later |
| `yicun` | yicun | Needs title polish; capitalization and place specificity need review | Description present; quality confirmation needed | Valid coordinates present | Category present; alignment check needed | Present | Significance summary, criteria, and criteria explanation present | No related articles visible; relationship verification needed if links are expected | Privacy check passed | Live-only needs review | Confirm the intended public name and long-term role, then review vocabulary and whether related public stories should be linked | Yes, before any edit or possible cleanup later |

## Summary

### 1. Strong Records To Keep

- `jiangxi-test-community-square` has a clear title, valid coordinates, the current heritage metadata fields, and a related-article relationship.
- `old-anyuan-company-community-park` has a strong title and description, valid coordinates, and an existing related-article relationship. It remains valuable even though heritage metadata enrichment is incomplete.

### 2. Records Needing Content Polish

- `xinyu` and `yicun` need title polish and confirmation of their intended public names.
- `test-nomination-place` has a generic test-style title and needs confirmation of its public purpose.
- Description fields are present for all five records, but this metadata review did not reproduce or fully assess live description text. Editorial and factual approval remains necessary.

### 3. Records Needing Vocabulary Alignment

- All five records have a category, but category values should be compared against the agreed public vocabulary before edits are proposed.
- `old-anyuan-company-community-park` and `test-nomination-place` are missing `assetType`.
- Existing `assetType` values on the other records should be checked for consistency rather than changed automatically.

### 4. Records Needing Significance/Criteria Enrichment

- `old-anyuan-company-community-park` is missing a local significance summary, heritage criteria, and criteria explanation.
- The other four records contain those fields, but their factual quality and criteria fit still require source-based review.

### 5. Records Needing Relationship Verification

- Verify the existing related-article targets for `jiangxi-test-community-square` and `old-anyuan-company-community-park`.
- `test-nomination-place`, `xinyu`, and `yicun` have no related articles visible in the reviewed metadata. Confirm whether that is intentional before proposing links.

### 6. Records That May Be Sample/Regression Records

- Keep `jiangxi-test-community-square` and `old-anyuan-company-community-park` as protected sample/regression records.
- Confirm whether `test-nomination-place` is an intentional promotion workflow sample.
- Treat `xinyu` and `yicun` as live-only records needing review, not automatic cleanup candidates.

### 7. Records Requiring User Confirmation

All five records require user confirmation before any Firebase edit. Confirmation is especially important for:

- public title changes
- coordinate additions
- category or `assetType` vocabulary changes
- significance and criteria content
- relationship additions or removals
- sample/regression classification
- any `possible cleanup later` decision

## Privacy Check

The public-safe structural check found none of the known prohibited nomination/admin field names in the five live `communityPlaces` records. This is a field-presence defense check, not permission to copy private source material into public records.

## Recommended Next Step

`Phase 11A-12 — User-approved communityPlaces polish proposal`

That phase should propose exact changes record by record, cite confirmed source material where needed, and wait for explicit approval before any Firebase update.
