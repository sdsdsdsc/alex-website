# Phase 15C-12 — Provider-located project-reviewed Point policy clarification

## Decision

The controlling Official Heritage publication policy now explicitly permits a
**provider-located project-reviewed reference Point** as a documented evidence
method when a mapped provider identifies a specific point-like heritage feature
but does not expose a legitimate raw feature coordinate.

This is a non-substantive clarification of the existing policy. The policy
already permits corroborated provider Points of Interest and documented,
reproducible project-reviewed digitization. This decision explains how those
existing clauses work together; it does not lower the minimum Point gate,
approve a candidate, create a runtime field, or authorize digitization.

## Why clarification was needed

The Phase 15C-11 fallback audit applied “reproducible source coordinate”
strictly as a raw provider or institutional numerical coordinate. Owner-supplied
N07 evidence then demonstrated a concrete edge case: Gaode and Baidu identify
the same point-like physical building/site with consistent identity, locality,
and provider-hosted photographs, but the reviewed evidence supplies no
extractable legitimate feature coordinate.

The existing policy clearly allowed project-reviewed interpretations but did
not spell out the controlled Point workflow for that situation. The clarified
wording removes that ambiguity while keeping feature identification, numerical
construction, and publication approval as three separate decisions.

## Clauses clarified

The controlling policy now states that:

- legitimate provider-owned feature coordinates remain preferred;
- exact record/component identity and a specific physical feature must be
  established before digitization;
- corroboration requires two genuinely useful providers or one strong provider
  plus independent feature-specific evidence;
- circular copies, same-name locality results, generic villages, parks,
  businesses, visitor complexes, roads, administrative areas, and viewports do
  not establish the heritage feature;
- an accepted digitization method must preserve the provider reference,
  evidence, coordinate-aware environment or WGS84 feature match, CRS chain,
  conversions, output, rounding, reviewer, review date, and uncertainty;
- screenshot pixels, guessed coordinates, viewport/display/highlighted-area
  centres, village centroids, undocumented clicks, and unresolved provider
  shapes are prohibited substitutes;
- the result uses an existing Point meaning and policy-level
  `project-reviewed-interpretation` status rather than a new geometry meaning
  or runtime enum;
- uncertainty is evidence-specific, with no universal low-uncertainty default;
- sensitivity, access, misleading-risk, provenance, accessibility, limitation
  wording, review, and approval gates remain mandatory; and
- provider-located Point evidence does not support any footprint, compound,
  alignment, extent, or legal boundary.

## N07 is not approved

N07 is a non-approving example only. Its reviewed screenshots support the
feature-identification stage. They do not provide an approved numerical Point,
CRS chain, transfer method, uncertainty, sensitivity or access decision,
misleading-risk finding, public wording, or publication approval.

N07 and the other bounded provider-located candidates may be re-evaluated only
after this clarification is merged and separate work is approved. Digitization
belongs to that later evidence audit, not this decision record.

## Unchanged policy and publication state

The following remain unchanged:

- evidence-led natural spatial form;
- one active public representation per official record or separately resolved
  component identity;
- stable identity, supersession, and representation-history direction;
- preference for authority-supplied GIS and legitimate source coordinates;
- all shape-evidence, rights, CRS, uncertainty, sensitivity, misleading-risk,
  provenance, review, and approval gates;
- the five current production Official Heritage Points and zero real lines or
  polygons;
- P19 Xiabu as the only approved-but-unpublished proposal in paused draft PR
  #69;
- Xiabu and Xieli remaining unpublished;
- all 39 Phase 15C-11 fallback identities remaining operationally withheld;
  and
- Community Heritage remaining unchanged and Point-based.

If exceptional replacement geometry is later separately justified and
approved, it supersedes the Point rather than being published alongside it.

## Documentation-only boundary

This clarification changes only current documentation. It does not digitize or
approve any candidate, re-run provider searches, revise historical audit
results, change runtime or schema implementation, modify source data or
generated GeoJSON, alter rendering or controls, touch Community Heritage or
Firebase, deploy, or resume PR #69.

## Next gated work

After this clarification is merged, a separately approved evidence audit may
re-evaluate the bounded priority queue: N03, N07, N08, P22, M23, and M30.
Numerical digitization, if needed, occurs in that later audit. Candidate-specific
Point publication still requires a further explicit approval and must not be
added to paused PR #69 automatically.
