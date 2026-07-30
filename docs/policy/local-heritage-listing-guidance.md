# Local Heritage Listing Guidance

This document provides reusable direction for future Codex phases working on Alex's Photo Board. It adapts useful Local Heritage Listing practices to the project's scale and community purpose.

## Project Position

Alex's Photo Board is a community heritage record and storytelling platform inspired by Local Heritage Listing practice. It is not an official statutory Local Heritage List and does not represent a planning authority.

## Core Model

- `communityPlaces` is the primary community heritage record layer.
- `news` and `history` are storytelling and article layers connected to places.
- `map.html` and `search.html` are discovery tools for community place records.
- `heritage.json` is the open-data JSON-LD export.

## Suggested Future `communityPlaces` Fields

- `assetType`: broad type of place, structure, landscape, feature, or community asset.
- `area`: locality, neighborhood, settlement, or administrative area.
- `localSignificanceSummary`: concise explanation of why the place matters locally.
- `heritageCriteria`: array of criteria met by the record.
- `criteriaExplanation`: evidence explaining how the place meets the selected criteria.
- `condition`: current physical condition or preservation status.
- `communityUse`: current community use or social function.
- `sourceReference`: citation, source note, or supporting reference.
- `dateAdded`: date the published record was added.
- `lastReviewed`: date the record was last reviewed.
- `recordStatus`: controlled publication or review status.

Stable IDs, location data, sources, criteria, and clean relationships should be prioritized over adding many new record types.

## Suggested Criteria

- Historic interest
- Social or communal value
- Landmark or streetscape value
- Design or artistic interest
- Rarity
- Group value
- Condition or vulnerability

Criteria should be selected consistently and supported by a short evidence-based explanation. They are community heritage assessment criteria, not statutory designation criteria.

## Nomination Workflow Principles

- Public nominations should be stored in a separate `placeNominations` collection.
- Public users should not directly publish `communityPlaces` records.
- Admin review should approve, reject, or request more information for each nomination.
- Approved nominations may later become published `communityPlaces` records.
- Review should preserve the nomination evidence and create a clear distinction between submitted and published content.

## Wording Rules

Prefer:

- "community heritage record"
- "community-valued place"
- "local story"
- "open heritage data"
- "inspired by Local Heritage Listing practice"

Avoid:

- "official Local Heritage List"
- "statutory list"
- claims that the project has planning authority or statutory status

## Things Not to Do

- Do not overbuild many record types too early.
- Do not remove or replace stable IDs.
- Do not break `relatedArticles` or `relatedPlaces`; they are core relationship links.
- Do not change Firebase data without explicit instruction.
- Do not let public submissions directly create, overwrite, or publish `communityPlaces` records.
