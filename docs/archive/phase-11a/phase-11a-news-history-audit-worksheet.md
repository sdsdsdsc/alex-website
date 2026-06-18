# Phase 11A News and History Audit Worksheet

## Purpose

This worksheet records a read-only review of locally available evidence for public `news` and `history` records. It applies the checks in `docs/phase-11a-data-cleanup-audit-plan.md` without connecting to Firebase or changing application data or behavior.

The main record evidence is the previously generated `maintenance/reports/article-storage-audit.html`, supported by `maintenance/reports/article-storage-audit.csv`. The report was generated on 2026-06-03 and identified four then-current Firestore documents. It is a historical local snapshot, not proof of current Firebase contents.

## Safety Boundaries

- No Firebase or Firebase Storage connection was made.
- No public or private data was changed.
- No article, JSON, export, maintenance, or application file was changed.
- No private `placeNominations` data was inspected or copied into this worksheet.
- No record is recommended for deletion. Records needing a later decision use `possible cleanup later` only.

## Evidence Limits

The local report provides document IDs, titles, collection names, `htmlUrl` matching status, storage-file timestamps, body previews for three stored HTML files, and evidence that those three files contain image URLs.

It does not provide complete Firestore documents. Therefore:

- Firestore `createdAt` and other ordering fields cannot be confirmed.
- Storage creation dates are not treated as substitutes for Firestore `createdAt`.
- Firestore `imageUrl`, `relatedPlaces`, publication status, and full field safety cannot be confirmed.
- Remote HTML and image availability was not tested.
- Body content for an article without a matching stored HTML file may still exist in Firestore `htmlContent` or `content`; the local report cannot establish that.

## Local Source Summary

- News records evidenced locally: 2
- History records evidenced locally: 2
- Total records reviewed: 4
- Matching stored HTML files: 3
- Records without an `htmlUrl`: 1
- Known regression limitation: `history / FQrThxwuD7ZRtqxiAduC` is named in the Phase 11A plan but is absent from the local article report, so it is not classified as a reviewed record below.

## Record Audit

| Collection | Record ID | Public title/headline | Likely public status | Content/body status | Image status | Date/status ordering field | `relatedPlaces` status | Public/private field safety check | Recommended next action | Needs user confirmation? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `news` | `hcAoUBmPZEJJn2tkremf` | Why the image got duplicated | Identified as a current `news` document in the 2026-06-03 local report; explicit publication status is unavailable | Matching HTML body was found. The preview begins with informal text and describes an image-upload implementation issue, so public-news relevance and body polish need review | An image URL was found in the stored HTML; remote availability was not tested, so broken image risk remains unverified | Firestore ordering date unavailable. Stored HTML was created and updated on 2025-11-04, but that is not the article `createdAt` | Not included in the local report; unverified | No private/admin content is visible in the limited preview, but the full record field set was not captured | Possible cleanup later. First confirm whether this technical troubleshooting article belongs in public Community News; polish the opening if it remains public and verify its image | Yes |
| `news` | `XloYqPaGaKapX0ub8qic` | community introduce | Identified as a current `news` document in the 2026-06-03 local report; explicit publication status is unavailable | Matching HTML body was found. The preview discusses an older CMS/content-loading setup rather than clearly presenting community news; weak body content or public-purpose mismatch needs review | An image URL was found in the stored HTML; remote availability was not tested, so broken image risk remains unverified | Firestore ordering date unavailable. Stored HTML was created and updated on 2025-11-05, but that is not the article `createdAt` | Not included in the local report; unverified | No private/admin content is visible in the limited preview, but the full record field set was not captured | Needs headline polish and content-purpose review. Possible cleanup later if it is confirmed as obsolete technical sample content | Yes |
| `history` | `nvNabJ6fvHMzOz8eHzPv` | a few key contributors and milestones | Identified as a current `history` document in the 2026-06-03 local report; explicit publication status is unavailable | Matching HTML body was found. The preview contains substantive historical/contextual material about contributors and participation theory; strong public history story evidence, subject to full editorial review | An image URL was found in the stored HTML; remote availability was not tested, so broken image risk remains unverified | Firestore ordering date unavailable. Stored HTML was created and updated on 2025-11-04, but that is not the article `createdAt` | The article field is not included in the report. A reverse `relatedArticles` reference from local `communityPlaces / old-anyuan-company-community-park` points to this record; reciprocal link status is unverified | No private/admin content is visible in the limited preview, but the full record field set was not captured | Keep as a public history candidate and verify the full story, sources, reciprocal place relationship, and image. Polish headline capitalization and specificity if confirmed | Yes, for editorial wording and relationship verification |
| `history` | `vIbjpOJjcUGRHXDS6kQb` | an old house | Identified as a current `history` document in the 2026-06-03 local report; explicit publication status is unavailable | No `htmlUrl` or matching stored HTML file was recorded. Body may exist in Firestore `htmlContent` or `content`, so weak or missing body cannot be confirmed locally | Not available in the local report; unverified | Firestore ordering date unavailable; no matching storage timestamp exists | Not included in the local report; unverified | The report contains no body preview or full field set, so privacy safety cannot be established from local evidence | Needs headline polish and a later read-only full-record check for body, image, date, and relationships. Possible cleanup later only if confirmed incomplete or obsolete | Yes |

## Classification Summary

### Strong Public Content Evidence

- `history / nvNabJ6fvHMzOz8eHzPv`: the available body preview contains substantive contextual material and a valid structured reverse relationship is visible in the local communityPlaces snapshot. The full story and sources still need verification.

No news record can be classified as a strong public article from the local evidence alone. Both available news previews appear oriented toward technical website or CMS issues rather than clearly framed community news.

### Sample / Regression Records

- `history / FQrThxwuD7ZRtqxiAduC`: identified by the Phase 11A plan as a regression record to protect, but absent from the local article report and therefore not counted among the four reviewed records.
- `news / XloYqPaGaKapX0ub8qic` and `news / hcAoUBmPZEJJn2tkremf`: possible technical or sample content, but this classification requires user confirmation. They are not deletion recommendations.

### Records Needing Later Polish

- `news / hcAoUBmPZEJJn2tkremf`: review public-news relevance and polish the informal body opening.
- `news / XloYqPaGaKapX0ub8qic`: polish the lowercase, generic headline and review whether the CMS-focused body still belongs publicly.
- `history / nvNabJ6fvHMzOz8eHzPv`: polish headline capitalization/specificity and verify sources, image, and reciprocal `relatedPlaces` data.
- `history / vIbjpOJjcUGRHXDS6kQb`: review the full record because the local report has no body, image, date, or relationship evidence; the title is generic and lowercase.

## Privacy Review

No nomination email, admin note, admin assessment, review history, or other clearly private data appears in the locally stored previews or report fields.

This is not a complete privacy clearance. The report did not preserve the full Firestore field set for any article, so a later read-only admin backup review should confirm that public `news` and `history` records do not contain:

- `nominatorEmail`
- `adminNotes`
- `adminHistoricInterest`
- `adminArchitecturalInterest`
- `adminCommunityValue`
- `adminConditionRisk`
- `adminAssessmentSummary`
- `reviewHistory`
- other nomination-private or admin-only review data

## Later Review Notes

Before any later data edit:

1. Compare this worksheet with a fresh private admin backup of `news` and `history`.
2. Confirm whether the two technically focused news records are intentional public content, samples, or obsolete material.
3. Confirm Firestore `createdAt`, `imageUrl`, body fields, and `relatedPlaces` for every record.
4. Verify that every relationship target exists in `communityPlaces` and that important reverse links remain coherent.
5. Confirm the regression role and current contents of `history / FQrThxwuD7ZRtqxiAduC`.
6. Verify remote HTML and image availability separately before labelling a link broken.
7. Obtain explicit confirmation before any cleanup action.
