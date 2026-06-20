# Phase 13A Media, Evidence, and Rights Model

This document sets the planning model for Phase 13 media, evidence, source credit, copyright, consent, visibility, retention, and Storage backup.

It is a planning document only. It does not change application behavior, Firestore rules, Firebase Storage structure, export behavior, or live data.

## 1. Purpose

Phase 13 exists to make media and evidence handling safe before any further upload capability is added.

The current project already has:

- public place records that can show images;
- article publishing that uses Firebase Storage;
- nomination evidence fields that accept image URLs and source-credit text;
- public export behavior that may include public-safe URLs.

What is still missing is a clear model for rights, consent, visibility, moderation, retention, and backup. This phase should define that model before expanding uploads or public media features.

## 2. Current Media And Evidence State

Current source behavior and data boundaries:

- `upload-article.html` already supports article publishing that stores article HTML and images through Firebase Storage.
- `nominate-place.html` and `nominate-place.js` currently accept optional evidence and photo URL fields plus source and credit text fields.
- nomination media is currently URL-only; the public nomination form explicitly says photo upload will be added later and does not upload image bytes now.
- `heritage-engine/nominations.js` shapes nomination payloads with `evidenceImageUrl`, `evidenceImageCaption`, and `evidenceSourceCredit`, plus other nomination text fields.
- `manage-nominations.html` gives admins visibility into private nomination-review records, including submitted evidence fields where present.
- public place records in `communityPlaces` can display public image fields where available.
- `export.js` and `heritage-engine/export.js` build public `heritage.json` only from `communityPlaces`, `news`, and `history`, and may include public-safe content or image URLs where appropriate.
- `admin-export.html` and `admin-export.js` create private Firestore document backups for `communityPlaces`, `placeNominations`, `news`, and `history`.
- Firestore document backup does not back up Firebase Storage file bytes. Any uploaded article HTML or images in Storage need a separate backup/export plan.

## 3. Risks

The current and future media/evidence model needs to address these risks:

- copyright uncertainty when a user submits an image they do not own or cannot license;
- weak provenance when source credit is missing, vague, or unverifiable;
- private or sensitive images being submitted into a workflow that is meant for community heritage records;
- people or faces appearing in photos without appropriate consent;
- location/privacy risk where an image exposes personal, private, or vulnerable-site information;
- orphaned Firebase Storage files after article edits, deletions, or partial uploads;
- accidental public export or public rendering of URLs that should remain nomination-private or admin-only;
- long-term retention risk if files are stored without a clear backup, audit, or deletion policy;
- admin moderation burden if the workflow accepts more media than can be safely reviewed;
- mismatch between public visibility expectations and what the site may later publish to public pages or open data.

## 4. Proposed Media Categories

Phase 13 should treat media and evidence as separate categories with different visibility and review expectations:

- `public article image`
  Used on public news/history records and already aligned with the article publishing workflow.

- `public place record image`
  Used on published `communityPlaces` records and allowed on public pages and public export only after approval.

- `nomination evidence image`
  Evidence attached to a nomination to help review a suggested place. This should default to private review use, not public display.

- `private/admin review evidence`
  Media or supporting files used only for internal review, moderation, or provenance checking.

- `external URL-only source image`
  A referenced remote image URL stored as a source pointer rather than a hosted upload. This needs special caution because the source can change or disappear.

- `future uploaded public user media`
  Any later direct public-user upload flow. This should not be added until rights, moderation, retention, and backup rules are agreed first.

## 5. Proposed Rights Fields

The project should standardize future media metadata before implementing new uploads. Recommended field names:

- `mediaUrl`
- `mediaCaption`
- `mediaCreator`
- `mediaSource`
- `mediaCredit`
- `mediaLicense`
- `mediaRightsStatus`
- `mediaConsentConfirmed`
- `mediaVisibility`
- `mediaUploadedByUid`
- `mediaCreatedAt`
- `mediaReviewStatus`

Recommended meaning:

- `mediaUrl`: canonical stored or referenced media URL.
- `mediaCaption`: short descriptive caption suitable for public display.
- `mediaCreator`: original photographer, creator, or organization if known.
- `mediaSource`: source location, archive, website, collection, or submission origin.
- `mediaCredit`: public-facing credit line.
- `mediaLicense`: stated license or permissions basis.
- `mediaRightsStatus`: simple rights state such as `unknown`, `claimed-by-submitter`, `licensed`, `public-domain`, `permission-confirmed`, or `rejected`.
- `mediaConsentConfirmed`: whether the submitter explicitly confirmed they had rights and necessary consent.
- `mediaVisibility`: intended visibility state, separate from rights status.
- `mediaUploadedByUid`: submitting account when the media entered through an authenticated workflow.
- `mediaCreatedAt`: timestamp for the media record or media-reference entry.
- `mediaReviewStatus`: admin review state such as `pending`, `approved`, `restricted`, or `rejected`.

These fields are recommendations only for later implementation. They should not be added ad hoc in Phase 13A.

## 6. Visibility Model

Future media handling should use an explicit visibility model:

- `public media`
  Approved for public pages and, where appropriate, public export.

- `nomination-private media`
  Visible only within the nomination workflow and never exposed on public pages or `heritage.json`.

- `admin-only review media`
  Visible only to the configured admin/review workflow.

- `external reference only`
  Stored as a citation or reference pointer without implying the project owns, mirrors, or republishes the media.

- `hidden/rejected media`
  Kept out of public rendering and public export because of rights, consent, relevance, or moderation concerns.

Visibility should not be inferred only from where a field happens to live. It should be explicit and reviewable.

## 7. Consent And Copyright Wording

Future public-facing upload or media-submission forms should use simple wording like this:

- “I confirm that I created this image or have the right to share it for this project.”
- “I understand that submitted images may be reviewed before any public publication.”
- “I understand that approved public images may appear on public place records, articles, or open-data outputs.”
- “I will not upload private, sensitive, or personal images without appropriate consent.”

Additional guidance that should appear near future media inputs:

- do not upload images that reveal private personal information;
- do not upload images of people where consent is unclear;
- do not assume that finding an image online means it can be republished;
- where possible, provide creator, source, and credit information at submission time.

## 8. Storage And Backup Model

Phase 13 should treat Storage backup as a separate operational concern from Firestore backup:

- Firestore backup does not back up Firebase Storage file bytes.
- Firebase Storage needs its own backup or export plan for article HTML files and article images.
- Any future uploaded nomination or place media would also need a Storage backup and audit plan before routine use.
- orphan-file auditing should exist before files are deleted from Storage.
- no Storage deletion should happen without backup and explicit approval.
- article edit and delete workflows should eventually be reviewed against orphan-file risk, even if no behavior changes are made in Phase 13A.

The practical rule is: document metadata backup and file-byte backup are separate responsibilities.

## 9. Export Safety

Public export must remain deliberately narrow:

- public export may include only public-approved media URLs tied to public records in `communityPlaces`, `news`, or `history`;
- nomination-private media must not appear in `heritage.json`;
- `placeNominations` must remain excluded from public export;
- ownership, admin, and review fields must remain excluded from public export;
- future media rights or moderation fields must also be reviewed before any public export inclusion;
- external reference URLs should be exported only when they are intentionally public and safe to expose.

This means media visibility must be treated as part of export safety, not only page rendering.

## 10. Phase 13B Recommendation

The recommended next Phase 13 step is:

**Create a Storage backup and media-audit plan first, then add structured rights/review fields to nomination and public-media records as URL-only metadata before any new public upload feature.**

Why this is the safest next step:

- article Storage already exists today, so backup and orphan-file risk are current, not hypothetical;
- URL-only rights metadata is a smaller and safer increment than introducing new uploaded public-user media immediately;
- admin review/status fields for media will make more sense once backup and visibility rules are defined.

In short: stabilize Storage and rights governance first, then expand media capability in controlled steps.
