# Phase 9 Nomination Workflow Specification

## 1. Purpose

Phase 9 will add a future public workflow for suggesting community-valued places. It is inspired by useful Local Heritage Listing practices such as identifying a location, explaining significance, supplying evidence, and separating submission from review.

This specification defines the intended records, statuses, public form, admin review, privacy safeguards, and promotion process before any nomination pages or Firebase writes are implemented.

## 2. Project Position

Alex's Photo Board is a community heritage record project inspired by local heritage listing practice. It is not an official statutory Local Heritage List and does not represent a planning authority.

The nomination workflow must use community heritage language and must not imply that nomination, approval, or publication creates a statutory designation or planning status.

## 3. Core Principle

Public nominations must not directly create, overwrite, or publish `communityPlaces` records.

Public nominations should be stored separately in `placeNominations`. An admin must review each submitted nomination before deciding whether it should become a published `communityPlaces` record. The nomination and its evidence should remain available as a review record after promotion.

## 4. Proposed Future Files

Public:

- `nominate-place.html`: public nomination form and submission guidance.

Admin:

- `manage-nominations.html`: protected list and review workflow for nominations.

Optional later additions:

- `nomination-detail.html`: separate review page if the admin list becomes too complex.
- Public registration, login, or account pages only if a later phase demonstrates a clear need.

The first version should not require public accounts.

## 5. Proposed Firestore Collection

Collection: `placeNominations`

Suggested fields:

| Field | Intended use |
| --- | --- |
| `title` | Proposed public name of the place or asset. |
| `assetType` | Broad place, building, landscape, route, artwork, feature, or heritage asset type. |
| `area` | Area, neighbourhood, settlement, or locality. |
| `address` | Street address or descriptive location. |
| `lat` | Latitude as a number when known. |
| `lng` | Longitude as a number when known. |
| `description` | Factual description of the place. |
| `localSignificanceSummary` | Concise explanation of why the place matters locally. |
| `heritageCriteria` | Array of selected community heritage criteria. |
| `criteriaExplanation` | Evidence explaining how the place meets the selected criteria. |
| `condition` | Current condition or vulnerability. |
| `communityUse` | Current community use or social function. |
| `sourceReference` | Source, citation, archive reference, or supporting note. |
| `nominatorName` | Private full name when needed for accountability and contact. |
| `nominatorEmail` | Private contact email for admin follow-up. |
| `nominatorDisplayName` | Name that may be credited publicly when consent is given. |
| `submittedOnBehalfOf` | Indicates whether the nomination is personal or submitted for a group. |
| `organisationName` | Optional organisation or community group name. |
| `photoUrl` | Future photo URL or storage reference. |
| `photoDescription` | Description, caption, source, or accessibility text for the photo. |
| `supportingMaterialNote` | Note describing other evidence or material supplied. |
| `termsAccepted` | Boolean recording acceptance of submission terms. |
| `privacyAccepted` | Boolean recording acknowledgement of the privacy notice. |
| `nominationStatus` | Controlled workflow status. |
| `adminNotes` | Private admin review notes; not public by default. |
| `createdAt` | Server timestamp for initial creation. |
| `updatedAt` | Server timestamp for the latest update. |
| `submittedAt` | Server timestamp for formal submission. |
| `reviewedAt` | Server timestamp for the latest substantive review. |
| `approvedAt` | Server timestamp for approval. |
| `promotedPlaceId` | Stable `communityPlaces` document ID created during promotion. |

Personal contact fields and private admin notes must not be copied into public place records or open-data exports.

## 6. Recommended Nomination Statuses

Use a small controlled set of lowercase status values:

- `draft`: the nomination is being prepared and has not been submitted for review.
- `submitted`: the nominator has completed submission and the record is waiting for admin review.
- `under review`: an admin has begun checking the nomination and its evidence.
- `needs more information`: review cannot continue until clarification or further evidence is supplied.
- `approved`: the nomination has passed review but has not yet become a published place record.
- `rejected`: the nomination will not proceed. Admin notes should record the reason.
- `promoted`: an approved nomination has been used to create a `communityPlaces` record, identified by `promotedPlaceId`.

Status changes should be deliberate admin actions. Public submission should set `submitted`; it must never set `approved`, `rejected`, `promoted`, or `promotedPlaceId`.

## 7. Public Nomination Form Fields

The first public form should request:

- Place / asset name
- Asset type
- Area / neighbourhood
- Address or location description
- Latitude and longitude, when known
- Description
- Local significance summary
- Community heritage criteria
- Criteria explanation
- Condition
- Community use
- Source / reference
- Photo URL or a clearly labelled future photo-upload placeholder
- Photo description
- Nominator display name
- Nominator email
- Organisation / group, optional
- Terms and privacy acknowledgement

The form should explain required and optional fields clearly. Location may begin with an address or descriptive location; coordinates should not be required when a nominator cannot provide them reliably.

Until storage, security, moderation, and privacy are planned, the form must not accept direct file uploads.

## 8. Criteria Options

Use the same criteria as current `communityPlaces` records:

- Historic interest
- Social or communal value
- Landmark or streetscape value
- Architectural, design or artistic interest
- Archaeological or evidential interest
- Rarity
- Group value
- Age
- Condition or vulnerability

These are community heritage criteria, not statutory designation criteria. The form should ask nominators to support selected criteria with a concise explanation or evidence.

## 9. Future Public Flow

1. A visitor opens **Nominate a Place**.
2. The visitor reads the project position, privacy note, and submission guidance.
3. The visitor identifies the place and completes the nomination form.
4. The visitor accepts the terms and privacy acknowledgement.
5. The visitor submits the nomination.
6. The record is saved to `placeNominations` with `nominationStatus: "submitted"` and server timestamps.
7. The visitor receives a clear confirmation that submission does not publish the place or create an official designation.
8. An admin reviews the nomination in `manage-nominations.html`.
9. The admin may approve it, reject it, request more information, or later promote it to `communityPlaces`.

The public workflow must never write directly to `communityPlaces`.

## 10. Future Admin Review Flow

1. An authenticated admin opens `manage-nominations.html`.
2. The admin filters or selects submitted nominations.
3. The admin checks location, completeness, criteria, evidence, sources, privacy choices, and possible duplication with existing records.
4. The admin may correct review metadata or add private `adminNotes` without silently changing the nominator's original evidence.
5. The admin changes `nominationStatus` to `under review`, `needs more information`, `approved`, or `rejected` as appropriate.
6. If more information is needed, the admin uses the private email only to contact the nominator about that nomination.
7. An approved nomination may later be promoted through a separate protected action.
8. Promotion creates a stable `communityPlaces` document ID, records it in `promotedPlaceId`, and changes the nomination status to `promoted` only after the place record is created successfully.

Promotion should be auditable and should preserve the original nomination evidence. It must guard against duplicate promotion and partial writes.

## 11. Map and List Entry Points

Possible later entry points:

- `map.html`: **Nominate a place near here**, optionally carrying a selected map location into the nomination form.
- `search.html` / Places: **Nominate a community place**.

These links and map interactions are not part of Phase 9A and should not be implemented until the public submission workflow is ready.

## 12. Privacy and Safety Notes

- Do not publicly expose `nominatorEmail`.
- A display name may be public only when the nominator has knowingly agreed to public credit.
- Email should be used only for admin contact about the nomination unless separate consent is obtained.
- Do not add public accounts until there is a clear operational need.
- Avoid collecting more personal data than necessary.
- Require privacy and terms acknowledgement before accepting a public submission.
- Keep private identity, contact details, and admin notes out of `communityPlaces`, public pages, and `heritage.json`.
- Define retention and deletion rules before collecting public personal data.
- Validate URLs, coordinates, text length, and allowed criteria values before writing to Firestore.
- Treat all public text and links as untrusted input when displayed in admin tools.

## 13. Relationship to `communityPlaces`

An approved nomination may provide the following starting values for a new `communityPlaces` record:

| `placeNominations` | `communityPlaces` |
| --- | --- |
| `title` | `title` |
| `assetType` | `assetType` |
| `area` | `area` |
| `address` | `address` |
| `lat` / `lng` | `lat` / `lng` |
| `description` | `description` |
| `localSignificanceSummary` | `localSignificanceSummary` |
| `heritageCriteria` | `heritageCriteria` |
| `criteriaExplanation` | `criteriaExplanation` |
| `condition` | `condition` |
| `communityUse` | `communityUse` |
| `sourceReference` | `sourceReference` |
| `approvedAt` | Starting value for `dateAdded`, converted to the public date format chosen by the implementation. |

Nomination evidence may contribute to `sourceReference` or remain with private review notes, depending on its rights, privacy, and suitability for publication. Private contact information and `adminNotes` must not be promoted.

Promotion should not be a blind field copy. The admin must be able to review public wording, choose a stable document ID, check required `communityPlaces` fields, and confirm the final published record.

## 14. Things Not to Do Yet

- Do not create public registration or login.
- Do not create a forum.
- Do not allow public users to edit `communityPlaces`.
- Do not publish nominations automatically.
- Do not change Firebase security rules without a separate careful phase.
- Do not add file upload until storage, security, moderation, copyright, and privacy are planned.
- Do not expose the `placeNominations` collection through public listing or open-data exports.
- Do not implement map or search nomination entry points before submission and review are working safely.

## 15. Recommended Phase 9 Implementation Roadmap

- **Phase 9A:** Create and agree this nomination workflow specification.
- **Phase 9B:** Create `nominate-place.html` as a static, accessible form layout with no Firebase write.
- **Phase 9C:** Add validated `placeNominations` Firebase submission with privacy and terms safeguards.
- **Phase 9D:** Create protected `manage-nominations.html` admin review list.
- **Phase 9E:** Add protected admin status changes, review timestamps, and private notes.
- **Phase 9F:** Add a safe promote-to-`communityPlaces` workflow with stable IDs, duplicate protection, and evidence preservation.
- **Phase 9G:** Add nomination entry points to Map and Places after the end-to-end workflow is verified.
- **Phase 9H:** Consider photo upload, data retention controls, and further privacy improvements.

Each phase should be tested independently. Firebase security rules, Storage uploads, and public personal-data handling require their own explicit review before release.
