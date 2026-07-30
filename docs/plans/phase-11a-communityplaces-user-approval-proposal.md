# Phase 11A Community Places User Approval Proposal

## 1. Purpose

This document is the user-approval gate before any live `communityPlaces` data edit. It converts the Phase 11A public-safe audit findings into proposed action categories without supplying final replacement values, changing Firebase, or authorizing cleanup.

Approval here means that an exact field-level patch may be prepared in a later phase. It does not itself authorize a live update.

## 2. Approval Principles

- No cleanup is automatic.
- No record may be deleted without explicit confirmation in a later, separately approved phase.
- Sample and regression records remain protected until the user explicitly retires them.
- Stable document IDs must not be changed casually because they support public record URLs and relationships.
- Nomination-private and admin-only data must never be exposed or copied into public records.
- Content polish must be kept separate from structural changes such as IDs, collection names, relationships, or workflow behavior.
- Missing fields must be filled only from confirmed public sources or user-approved knowledge.
- `possible cleanup later` means review only; it is not a deletion recommendation.

## 3. Record Approval Table

| Record ID | Public title/name | Current issue summary | Proposed action category | Proposed edit type | Risk level | Why useful | Affects public URLs? | Affects map/search/export? | User approval required? | Suggested approval decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `jiangxi-test-community-square` | Jiangxi Test Community Square | Strong, tested record with valid coordinates and heritage fields; category wording and related-article target still need verification | keep as sample/regression; assetType/category alignment; relationship verification | Preserve stable ID and current role; perform vocabulary and relationship checks before proposing any field edit | Low for verification; medium for later edits | Protects a known place/article regression path while checking consistency | No, provided the stable ID remains unchanged | Verification has no effect; later category text may affect search/export, and relationship edits may affect place display/export | Yes, before any field change | Approve preservation and verification; keep unchanged until checks are complete |
| `old-anyuan-company-community-park` | Old Anyuan Company Community Park | Strong tested record; missing `assetType`, local significance summary, criteria, and criteria explanation; relationship target needs verification | keep as sample/regression; assetType/category alignment; significance/criteria enrichment; relationship verification | Preserve stable ID; later add only confirmed public metadata and verify the existing relationship | Medium | Improves consistency and heritage-record completeness without losing a regression anchor | No, provided the stable ID remains unchanged | `assetType` and criteria changes affect search/place/export; relationship changes affect place display/export; valid map coordinates should remain unchanged | Yes | Approve preservation and relationship/vocabulary checks; defer enrichment until sources are confirmed |
| `test-nomination-place` | Test Nomination Place | Generic test-style title, missing coordinates and `assetType`, no visible related articles, and public role not confirmed | title polish; assetType/category alignment; coordinate verification; relationship verification; possible cleanup later | First classify its intended role; prepare exact public field edits only if it is approved to remain public | High | Prevents polishing or retaining a test-style public record without confirming its purpose | No for content-only edits; yes if anyone later proposes changing its stable ID, which is not recommended here | Title/category changes affect search/place/export; coordinates affect map; relationship changes affect place display/export | Yes | Needs manual review |
| `xinyu` | xinyu | Public title needs capitalization/place-specific review; coordinates are missing; category and relationships need confirmation | title polish; description polish review; assetType/category alignment; coordinate verification; relationship verification | Confirm the intended public name and role, then prepare exact wording and metadata changes from approved sources | Medium to high | Could make the record clearer in Places, map discovery, and open data while avoiding unsupported additions | No, provided the stable ID remains unchanged | Title and vocabulary changes affect search/place/export; coordinates would add or change map visibility; relationships affect place display/export | Yes | Needs manual review |
| `yicun` | yicun | Public title needs capitalization/place-specific review; coordinates and heritage fields are present; category and relationship intent need confirmation | title polish; description polish review; assetType/category alignment; relationship verification | Confirm the intended public name and long-term role, then prepare exact wording or vocabulary changes | Medium | Improves public clarity while preserving existing valid coordinates and heritage metadata | No, provided the stable ID remains unchanged | Title and vocabulary changes affect search/place/export; relationship changes affect place display/export; map coordinates should remain unchanged unless separately verified | Yes | Needs manual review |

## 4. Recommended Approval Batch

### Safe To Approve First

These are low-risk approvals to preserve records or perform checks. They do not authorize live field changes:

- Keep `jiangxi-test-community-square` as a protected sample/regression record.
- Keep `old-anyuan-company-community-park` as a protected sample/regression record.
- Verify the existing related-article targets for both protected records.
- Compare existing category and `assetType` usage across all five records against the agreed public field vocabulary.
- Keep all stable document IDs unchanged.

### Defer

These proposals need source confirmation and exact user-approved wording:

- Significance and criteria enrichment for `old-anyuan-company-community-park`.
- Any description polish for records whose live description quality has not been fully reviewed in public-safe documentation.
- Any new coordinates for `test-nomination-place` or `xinyu`.
- Any new relationship link where no current related article is visible.

### Manual Review

These decisions require the user to confirm each record's intended public role:

- Whether `test-nomination-place` is a workflow sample that should remain public, be polished, or be marked for possible cleanup later.
- The intended public names and capitalization for `xinyu` and `yicun`.
- Whether `xinyu` and `yicun` are long-term public records, samples, or records needing later content development.
- Whether absent relationships on `test-nomination-place`, `xinyu`, and `yicun` are intentional.

No manual-review item above authorizes deletion.

## Approval Record

The user can record decisions for the next phase without changing live data:

| Record ID | Decision | Approved action categories | Deferred categories | Notes |
| --- | --- | --- | --- | --- |
| `jiangxi-test-community-square` | Pending | | | |
| `old-anyuan-company-community-park` | Pending | | | |
| `test-nomination-place` | Pending | | | |
| `xinyu` | Pending | | | |
| `yicun` | Pending | | | |

Valid decision labels are: `approve`, `defer`, `keep unchanged`, and `needs manual review`.

## 5. Next Step

`Phase 11A-13 — Approved communityPlaces polish patch plan`

That phase should prepare exact field-level changes only for records and action categories the user explicitly approves. It must remain a patch plan until a separate instruction authorizes any Firebase update.
