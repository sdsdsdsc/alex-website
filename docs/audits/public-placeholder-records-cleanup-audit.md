# Public Placeholder Records Cleanup Audit

## Scope and safety

This read-only audit investigates the High-priority PR #87 finding that the
production Places catalogue exposes test and placeholder-looking records. It
uses baseline `8847cebf2eea5ad5745d97bdd7f585b9c278b5dd` and does not edit or
delete Firestore data, Firebase configuration or rules, production media,
Official Heritage data, or application behaviour.

The evidence combined:

- a signed-out read of all seven production `communityPlaces` documents and
  their public fields, document create times and update times;
- a redacted authenticated dependency check across 12 `placeNominations`, no
  `placeContributions`, two `news` documents and three `history` documents;
- the existing Phase 11A and Phase 11C audit trail; and
- source inspection of promotion, admin deletion, Places, Map, place detail,
  export, relationship and browser-test behaviour.

The authenticated check retained only document linkage, status and boolean
evidence-presence facts. It did not copy emails, UIDs, private text, review
notes, evidence URLs or Storage paths into this audit.

## Result

Three public records are definitely test data and should later be removed:

- `jiangxi-test-community-square`;
- `phase-11c-image-promotion-live-test-20260630024821`; and
- `test-nomination-place`.

Three additional records are not safe to delete on the current evidence.
`old-street` is a plausible real-place record needing repair; `xinyu` and
`yicun` are ambiguous promoted records requiring an owner/source decision.
`old-anyuan-company-community-park` was screened as the seventh live record
and should be retained.

The next step should be **B — a bounded code/admin change first**, followed by
a separately approved production-content cleanup. This is necessary because:

1. the browser regression suite directly focuses the production test ID
   `jiangxi-test-community-square`;
2. changing `recordStatus` away from `published` hides a record from Places
   and Map, but the direct place page and public export still expose it; and
3. the admin form, shared validation and public readers do not use one
   consistent non-public status vocabulary.

The code step must complete the existing publication-status contract and
remove the regression suite's dependency on a live test record. It must not
add a record-ID blacklist or a special filter that merely conceals these
records.

## Record decisions

| `communityPlaces` document | Public evidence and entry path | Classification | Dependencies and risk | Recommended action |
| --- | --- | --- | --- | --- |
| `jiangxi-test-community-square` | Created 2026-06-09. Published title, description, tags, grade, community use, heritage value and source reference repeatedly call it a test record created by Alex's Photo Board. It has valid coordinates and one related history article. No promoted nomination points to it, so current evidence supports direct/manual creation rather than nomination promotion; the exact creation UI cannot be proven from retained metadata. | **Definitely test data.** | Places, Map, direct detail and export expose it. `history/FQrThxwuD7ZRtqxiAduC` links to it and the place links back; that article is itself explicitly a test of relationships and export. `tests/browser-smoke.spec.mjs` uses the live ID for focus/category regression. No contribution, nomination, public image or Storage dependency was found. | Remove after the browser test is made deterministic. Remove the linked test history record in the same approved cleanup, or explicitly remove both relationship directions before deleting the place. |
| `phase-11c-image-promotion-live-test-20260630024821` | Created 2026-06-30. Every principal public field identifies a Phase 11C live-verification test. The Phase 11C verification record proves that nomination `hiWpA99eMHXNmc5B4O9A` was approved and promoted to this exact document. | **Definitely test data.** | Places, Map, direct detail and export expose it. The private nomination remains `promoted` with this `promotedPlaceId` and a review history. Its evidence image is an external GitHub Pages URL, not a Firebase Storage object. The same repository image is also used by shared site styling, so the asset must not be deleted. No contribution or article relationship was found. Test suites reuse this ID as local/emulator fixture text but do not require the live document. | Delete only the public `communityPlaces` document. Retain the private nomination and its evidence as audit history; verify the admin view handles a historical promoted link whose public record has been retired. Do not delete `Manurewa High.png`. |
| `test-nomination-place` | Created 2026-06-13. Title, address, area, description, significance and criteria explanation explicitly say they test the nomination workflow. Redacted live linkage proves nomination `m7UKyc4HlvHG0wY26bQz` was promoted to this exact document. | **Definitely test data.** | Places, direct detail and export expose it; it has no coordinates, so Map reports it as coordinate-less rather than drawing a marker. The private nomination remains `promoted`. No evidence image, Storage object, contribution or article relationship was found. | Delete only the public `communityPlaces` document and retain the private nomination as workflow history. Verify coordinate-less counts and old bookmarked URLs after cleanup. |
| `old-street` | Created 2026-06-20 from promoted nomination `hmQmRDeEB8TWQJkojn9N`. It has a Fenyi/Lindong address, valid coordinates and a Street or route type, but the title and prose are weak, no public source is recorded, and `createdAt`/`updatedAt` contain legacy server-timestamp sentinel maps rather than resolved public timestamps. | **Probable legitimate record needing repair; owner/source confirmation still required.** | Places, Map, direct detail and export expose it. The private nomination remains `promoted`. No evidence image, Storage object, contribution or article relationship was found. Deletion would discard a potentially real located place. | Do not delete. After publication-status behaviour is consistent, move it to the agreed non-public review status, inspect its private nomination/source evidence, then repair and republish or remove through a separate owner decision. |
| `xinyu` | Created 2026-06-18 from promoted nomination `oBwc2rs8h2YK4ACGTT21`. The public record says only “historical street”, uses `xinyu` as title and address, has no coordinates or public source reference, and contains incomplete prose. The private nomination has an external evidence image but no Firebase Storage object; that private evidence was not copied into this audit. | **Ambiguous / owner decision required; repair candidate.** | Places, direct detail and export expose it; Map treats it as coordinate-less. The private nomination remains `promoted` with review history and evidence. No contribution or article relationship was found. | Do not delete or cosmetically rename from assumptions. After consistent unpublishing exists, place it into non-public review, inspect the source/evidence, and either repair a specific real place or remove it with owner approval. |
| `yicun` | Created 2026-06-15 from promoted nomination `q827KmWhahMbJOxxp88b`. It has valid coordinates and Public art type, but only a generic title/address, no public source, and placeholder-quality significance and criteria text (`sdsa`, `ggod`). | **Ambiguous / owner decision required; repair candidate.** | Places, Map, direct detail and export expose it. The private nomination remains `promoted`. No evidence image, Storage object, contribution or article relationship was found. | Do not delete solely because the prose is poor. After consistent unpublishing exists, place it into non-public review and confirm the feature, location and source before repair/republication or removal. |
| `old-anyuan-company-community-park` | Created 2026-06-04. It has a specific title, coherent description, valid coordinates, location metadata and a related history record. No suspicious nomination-promotion link was found. Earlier Phase 11A reviews consistently preserve it while noting missing heritage enrichment. | **Legitimate record to retain and later repair.** | Places, Map, direct detail and export use it; its history relationship should remain intact. | Retain. Any criteria, significance or vocabulary enrichment remains a separate sourced-content task. |

## Cross-system effects

### Nominations

Five of the six reviewed suspicious/thin records came from promoted
nominations. Removing or making their public records non-public does not
automatically change the private nominations: their status remains `promoted`
and their `promotedPlaceId` remains an audit pointer. Current rules permit
promotion but provide no reverse/unpromote transition. Production cleanup must
therefore retain those private records and explicitly treat their links as
historical, unless a separately reviewed admin lifecycle change is approved.

### Relationships

Only `jiangxi-test-community-square` has a current article dependency. The
relationship is bidirectional with
`history/FQrThxwuD7ZRtqxiAduC`, whose public body says it is a test article.
Removing only the place would leave a dangling public relationship and an
obvious test history record, so the later cleanup must handle both documents
together.

### Places, Map, direct links and export

All seven records currently appear in Places and the public export. Five have
map coordinates; `test-nomination-place` and `xinyu` are coordinate-less.
Deleting a place automatically removes it from future Places/Map collection
reads and export generation, but bookmarked direct URLs will become not-found
states and saved Map focus URLs will lose their target.

Setting `recordStatus` to `draft`, `under review` or `archived` is not currently
a safe substitute for deletion or complete unpublishing. Places and Map accept
only published/legacy-empty records, while `place.js` renders any existing
document and `export.js` exports every `communityPlaces` document. The admin
form accepts `published`, `draft` and `under review`, while shared validation
defines `published`, `draft` and `archived`. This inconsistency must be resolved
before using status for the three repair candidates.

### Media and contributions

There are currently no `placeContributions` documents. None of the candidate
nominations uses a Firebase Storage-backed evidence object. The Phase 11C test
record uses `Manurewa High.png` through a public GitHub Pages URL, and that same
file is still a shared CSS background; public-record cleanup must not remove
the asset. `xinyu` has private external evidence attached to its nomination,
which should be retained for owner review.

## Required next code/admin change

Before any production-content mutation, prepare one bounded PR that:

1. replaces the browser test's live
   `jiangxi-test-community-square` dependency with a deterministic local
   fixture or mocked collection response;
2. makes the direct place reader and public export enforce the same existing
   publication-state decision as Places and Map;
3. reconciles the admin form and shared public-status vocabulary; and
4. adds regression coverage proving a non-public record is absent from Places,
   Map, direct detail and export without using a special test-record ID list.

That PR should not change production content. Its purpose is to make the
existing publication lifecycle coherent and to ensure production cleanup does
not break CI.

## Exact later production cleanup steps

After that code/admin PR is merged, deployed and separately approved:

1. Create fresh private backups of `communityPlaces`, `history` and
   `placeNominations`; record the target document update times and retain a
   rollback copy outside the repository.
2. Re-read the target documents and stop if their IDs, classification evidence,
   nomination links, relationships or update times differ from this audit.
3. Permanently delete these three `communityPlaces` documents through the
   existing admin delete flow, typing each exact ID:
   - `jiangxi-test-community-square`;
   - `phase-11c-image-promotion-live-test-20260630024821`;
   - `test-nomination-place`.
4. Delete the linked test-only history document
   `history/FQrThxwuD7ZRtqxiAduC` in the same controlled cleanup. If that
   deletion is not separately approved, stop rather than leave one side of the
   relationship dangling.
5. Retain the promoted private nominations and all evidence. Do not delete
   `Manurewa High.png` and do not delete any Storage object.
6. With owner approval, set `old-street`, `xinyu` and `yicun` to the newly
   agreed, consistently enforced non-public review status. Do not repair or
   remove them until their underlying source/evidence is reviewed.
7. Verify signed-out Places, Map, direct URLs and `heritage.json`; expected
   definite-test cleanup leaves four `communityPlaces` records and three map
   markers before any provisional unpublishing of the repair candidates.
8. Verify the remaining history relationship, admin nomination history,
   browser suite, full tests and rollback evidence. Record the cleanup time and
   exact post-cleanup counts.

No production cleanup is authorized by this document or PR #89.
