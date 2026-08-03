# Phase 15C-16 — Xinyu Generalized reference Point eligibility audit

> **Historical-policy note:** This audit remains an accurate application of
> the gate controlling during Phase 15C-16: zero Generalized reference Points
> were eligible. The later candidate-neutral
> [Phase 15C-17 policy recalibration](../policy/phase-15c-17-generalized-point-policy-recalibration.md)
> does not change any conclusion here. Candidate eligibility must be
> reassessed separately across all 55 unpublished identities; no outcome or
> shortlist changes automatically.

## Decision and scope

This documentation-only audit asks whether any of the **55 currently
unpublished** Xinyu Official Heritage public identities can truthfully use a
`generalized-reference-point` even though the current evidence does not support
an ordinary project-reviewed reference Point.

The result is:

> **0 Generalized reference Points are currently eligible.**

Two identities reach detailed review, but both remain research-only outcome
**B — Generalized Point potentially suitable, specific evidence required**:

- P04 斜里遗址 (Xieli Site); and
- P01 棋盘山遗址 (Qipanshan Site).

No publication-review batch is proposed. Production remains seven ordinary
Points, zero Generalized reference Points, and zero real line or area features.
This audit changes no data, coordinate, geometry, runtime, renderer, control,
symbol, popup, Community Heritage record, Firebase resource, or deployment.

## Controlling distinction

The controlling rule is:

> **Coordinate uncertainty is not spatial generalization.**

Coordinate uncertainty estimates positional error around the intended Point.
Spatial generalization is a deliberate and documented reduction, displacement,
rounding, gridding, broadening, or general-area meaning applied for an
evidential, sensitivity, privacy, access, or publication reason.

Consequently:

- a 100 m or 150 m ordinary Point is not automatically generalized;
- a weak coordinate does not become publishable by attaching a larger number;
- a provider result, viewport centre, village label, or arbitrary centroid is
  not a generalized Point;
- generalization cannot repair unresolved identity or feature substitution;
- the input spatial basis, reason, numerical construction, retained precision,
  uncertainty components, and public meaning must remain reproducible; and
- the popup and accessible wording must explain both the reason for
  generalization and what the Point does not represent.

The current schema already controls `generalized-reference-point`,
`geometryPrecision: generalized`, `project-generalized-reference`, generalized
marker styling, and generalized locality/area-reference public meanings. No new
runtime representation type is required.

## Operational eligibility gate

The existing publication policy is sufficient after a narrow, non-substantive
clarification making the uncertainty/generalization distinction and review
accountability explicit. The audit applies these gates without weakening the
policy:

| Gate | Requirement |
| --- | --- |
| G1 — official identity | Confirm the exact official identity, level, locality, and parent/component treatment. |
| G2 — general-area evidence | Establish the correct general area through reliable official, institutional, or strongly corroborated evidence; resolve conflicts. |
| G3 — generalization purpose | Record a legitimate evidential, sensitivity, privacy, access, or publication reason before constructing the Point. |
| G4 — numerical construction and CRS | Preserve the input spatial basis and CRS; document a reproducible WGS84 construction and deliberate generalization method. Reject viewport centres, guessed centroids, screenshots, and undocumented copying. |
| G5 — Point meaning | Use the existing controlled `generalized-reference-point` meaning and avoid entrance, centroid, footprint, extent, surveyed-position, or legal-boundary claims. |
| G6 — uncertainty and precision | Separate source uncertainty, transformation uncertainty, intentional generalization, final horizontal uncertainty, and retained precision. |
| G7 — sensitivity, privacy, and access | Assess whether machine-readable publication increases harm and whether the generalization actually reduces an identified risk. |
| G8 — misleading risk | Confirm that wording and styling can prevent reasonable users from reading the Point as exact, official, an entrance, a centre, a component, or a legal boundary. |
| G9 — representation and supersession | Confirm that the identity has no other active representation and that any later approved Point, line, or area would supersede the generalized Point. |
| G10 — review accountability | Record the evidence reviewer, accountable project role, review date, and unresolved approval requirement. Research recommendation is not publication approval. |

For this audit the evidence reviewer is the **Codex documentation research
agent**. The accountable publication role remains the **Alex's Photo Board
project owner**. Review date is `2026-08-01`; separate owner approval remains
mandatory for any later implementation.

## Candidate funnel

The complete-list audit contains 62 proposed public identities. Seven now have
active ordinary Points, leaving **55 unpublished identities** at screening
level. The screen reuses the complete-list, provider, non-Point, fallback, and
priority matrices; it is not a new 62-row provider search.

Two candidates were shortlisted because their existing evidence goes beyond a
search label:

1. P04 Xieli has a government-published DMS centre and cardinal protection
   rule, a prior generalized-only recommendation, institutional site evidence,
   and an explicit misleading-risk history.
2. P01 Qipanshan has a confirmed official identity and a current institutional
   description placing a large rectangular hilltop site about 100 m north of
   the Zhangtang village group, plus exact-name provider leads. This is enough
   to test the concept, not enough to construct a Point.

The other **53** identities were screened out using one primary reason each:

- **25** point-like identities have ordinary feature/identity, coordinate, or
  venue-meaning gaps; generalization would be an evidential shortcut;
- **5** multipart, parent/component, tomb-group, or memorial-landscape
  identities have no honest shared Point meaning;
- **7** linear bridge identities lack verified protected fabric and a Point
  would risk substituting a village, road crossing, or provider label; and
- **16** areal archaeological or landscape identities lack a reproducible
  numerical basis or a documented generalization purpose and are better kept
  on the evidence-led area/withhold route.

The exact grouped identities and count reconciliation are preserved in the
[candidate matrix](../research/phase-15c-16-xinyu-generalized-point-candidate-matrix.md).

## Xieli classification chronology

1. **Phase 15C-3 strict audit:** Xieli was the strongest candidate but remained
   unpublished because the official table said only `GPS`, supplied no datum
   or WGS84 vertices, and the archaeological sensitivity made the ambiguity
   material.
2. **Phase 15C-4 re-audit:** under the then-current project-reference standard,
   the published centre and ±30 m rule supported a proposed generalized
   reference area, still research-only.
3. **Phase 15C-6 historical plan:** retained a reproducible theoretical 60 ×
   60 m square with 500 m uncertainty, while requiring a final misleading-risk
   decision.
4. **Phase 15C-7 misleading-risk review:** rejected both the square and a broad
   uncertainty area. It recommended only a generalized Point at the arithmetic
   DMS transcription, with 500 m uncertainty, distinct styling, persistent
   limitations, and sensitivity approval.
5. **Phase 15C-8 Point re-audit:** preserved that result as
   `ready-only-as-generalized-point` but excluded it from PR #69 because the
   datum, styling, limitation, sensitivity, and presentation gates were not
   complete.
6. **Phase 15C-10 complete-list audit:** provider refresh found locality results
   but no site-level heritage Point, verified datum, or independent evidence
   closing those gaps. It changed the operational classification to
   `needs-more-evidence`, while preserving generalized Point as the only
   potential future Point form.
7. **Phase 15C-11 fallback audit:** applied its ordinary/fallback Point gate to
   the 39-candidate union. It explicitly noted the prior generalized result but
   withheld Xieli because the datum and cleared presentation were still absent.

The later classification therefore did not prove that a Generalized Point was
intrinsically unsuitable. It applied a broader operational withholding rule
after the required numerical/CRS and presentation gates remained unresolved.
It did mention the generalized route, but it did not perform the present
G1–G10 generalized-method separation or test the historical 500 m value as a
datum-ambiguity treatment.

## Xieli evidence refresh and numerical test

The decisive sources were refreshed on `2026-08-01`:

- the [archived Jiangxi government protection-range table](https://upload.wikimedia.org/wikipedia/commons/6/63/%E7%AC%AC%E5%85%AD%E6%89%B9%E6%B1%9F%E8%A5%BF%E7%9C%81%E6%96%87%E7%89%A9%E4%BF%9D%E6%8A%A4%E5%8D%95%E4%BD%8D%E4%BF%9D%E6%8A%A4%E8%8C%83%E5%9B%B4%E4%B8%80%E8%A7%88%E8%A1%A8.pdf)
  still gives `27°45′45.3″ N, 114°55′11.2″ E` and ±30 m in the four
  cardinal directions, but no datum;
- the [Xinyu Museum Xieli record](https://www.xysmuseum.com/596.html) still
  identifies the archaeological site in Xieli Village, records about 5,000 m²,
  cultural deposits, excavation, and tomb evidence; and
- the current repository transcription preserves Xieli as the same provincial
  identity and locality.

Arithmetic DMS transcription gives
`[114.919777778, 27.762583333]`. That is not a datum conversion.

A reproducible stress test was performed without treating web-map systems as
proven source datums:

| Literal interpretation test | Resulting WGS84 | Separation from literal transcription |
| --- | --- | ---: |
| WGS84-like literal | `[114.919777778, 27.762583333]` | 0 m by definition |
| If the same numerals were GCJ-02, ten-iteration inverse | `[114.914936920, 27.766034965]` | 611.7 m |
| If the same numerals were BD-09, BD-09 → GCJ-02 → inverse WGS84 | `[114.908359254, 27.760297407]` | 1,151.9 m |

GCJ-02 and BD-09 are **stress tests**, not claims about the annex. The annex's
word `GPS` does not identify either system, but it also does not provide enough
metadata to enumerate and approve the real source datum. The test demonstrates
that the historical 500 m value cannot be treated as a universal repair for an
unknown CRS. It is smaller than the GCJ-02 stress-test displacement and was
never documented as an intentional displacement, rounding, grid, or
general-area construction.

The published centre could support an ordinary Point only after datum
confirmation and normal Point review. It could support a Generalized Point
only after an approved method deliberately constructs one from a known spatial
basis. The present evidence supports neither operation. Archaeological
sensitivity does not itself create a generalization method; the source already
publishes the centre, but machine-readable reuse still needs an accountable
sensitivity decision.

### Xieli gate outcome

| Gate | Result | Reason |
| --- | --- | --- |
| G1 | Pass | Official identity, level, locality, and standalone status are reconciled. |
| G2 | Pass | Government and museum evidence establish the correct general area. |
| G3 | Pass | A deliberately qualified general-area reference has a documented evidential and misleading-risk purpose. |
| G4 | Fail | Source datum is unspecified; no policy-permitted WGS84/generalization construction is approved. |
| G5 | Pass | `generalized-reference-point` is an existing controlled meaning. |
| G6 | Fail | The historical 500 m value mixes datum uncertainty with generalization and does not cover the documented stress test. |
| G7 | Conditional | The centre is already public, but machine-readable archaeological sensitivity has no accountable approval. |
| G8 | Conditional | Required wording is known, but persistent generalized presentation still needs publication review. |
| G9 | Pass | Xieli has no active representation; later approved geometry would supersede the Point. |
| G10 | Conditional | Reviewer and accountable role are now recorded; owner publication approval remains unresolved. |

**Outcome B — potentially suitable, specific evidence required.** Xieli is not
eligible now and remains unpublished.

Required evidence is one of:

1. authority confirmation of the published centre datum and its public reuse;
2. authority-supplied GIS or a datum-certified point/boundary; or
3. another approved spatial basis that permits a reproducible, deliberate
   generalized WGS84 construction without silently assuming the source CRS.

It also requires an accountable sensitivity decision, a separately approved
generalization method and distance/precision, final uncertainty components,
and persistent popup/accessibility wording equivalent to:

> Project-created generalized reference Point for the documented Xieli general
> area. It is not a surveyed feature position, archaeological footprint,
> entrance, site centre, protection extent, or official legal boundary. The
> source datum and final publication method must be stated before use.

## Qipanshan review

The [Xinyu Museum record](https://www.xysmuseum.com/591.html), refreshed on
`2026-08-01`, confirms the provincial identity and describes a rectangular
hilltop archaeological site about 100 m north of the Zhangtang village group,
larger than 10,000 m² with a 3,000 m² central area and surrounding ditch. The
complete-list/provider research records exact-name results in the correct
locality, but no legitimate raw feature coordinate, source CRS, surveyed
centre, reusable extent, or approved numerical transfer.

The description establishes a general area and natural areal form. It does not
define a Point, centroid, grid cell, rounding method, safe displacement, or
generalization distance. Using the village label, provider pin, hilltop visual
centre, or a 100 m offset without a documented origin and bearing would be an
invented coordinate.

### Qipanshan gate outcome

| Gate | Result | Reason |
| --- | --- | --- |
| G1 | Pass | Official identity and locality are confirmed. |
| G2 | Pass | Institutional text establishes the hilltop general area. |
| G3 | Conditional | A temporary general-area reference may be defensible, but no record-specific generalization purpose or risk reduction is approved. |
| G4 | Fail | No legitimate coordinate, CRS, origin/bearing, centroid, or reproducible construction exists. |
| G5 | Pass | `generalized-reference-point` could truthfully describe a future general-area reference. |
| G6 | Fail | No source, transformation, generalization, or final uncertainty can be separated or quantified. |
| G7 | Conditional | Archaeological sensitivity is material; publication risk and access remain unreviewed. |
| G8 | Conditional | A Point could imply the centre of the 10,000 m² site without stronger wording and method. |
| G9 | Pass | No active representation exists; later approved area geometry would supersede a temporary Point. |
| G10 | Conditional | Reviewer and accountable role are recorded; candidate-specific owner approval remains absent. |

**Outcome B — potentially suitable, specific evidence required.** Required
evidence is a datum-known authority/institutional coordinate or georeferenced
site plan, an explicit generalization purpose and reproducible construction,
separate uncertainty components, and archaeological sensitivity/access review.

## Outcome reconciliation and next decision

| Outcome | Count | Identities |
| --- | ---: | --- |
| A — eligible for separate publication proposal | 0 | none |
| B — potentially suitable, specific evidence required | 2 | P04 Xieli; P01 Qipanshan |
| C — retain future line/area route | 0 shortlisted | none |
| D — withhold pending evidence | 0 shortlisted | none |
| **Detailed shortlist total** | **2** | **2 unique identities** |

The 53 screening exclusions remain operationally withheld under their existing
ordinary-Point, non-Point, identity, or evidence classifications. They are not
reclassified by this focused audit.

No future publication-review batch is proposed. The next decision is whether
to seek the exact Xieli and Qipanshan evidence listed above. Publication,
digitization, another provider sweep, or a broader candidate audit requires a
separate instruction.

## Production preservation, limitations, and rollback

This research cannot establish that no future Generalized Point will ever be
valid. Public sources can change, provider records can move, and an authority
may later publish datum-certified spatial data. The screen uses the current
62-identity repository universe and does not claim completeness beyond Xinyu's
reviewed 2025 official list.

Production remains:

- 17 canonical source records;
- seven ordinary Points: one national and six provincial;
- ten exclusions;
- zero Generalized reference Points;
- zero real line or area features;
- canonical SHA-256
  `fd5ea0c50b858eab90aad226027bf9f4914469783b741823285c9ddfbd8e665b`;
- provincial compatibility SHA-256
  `f0140d2d841fc0b4694100e6841d6adf086d70e8e870014f3e3b8c7a17787625`.

Rollback is documentation-only: revert the Phase 15C-16 documentation commit.
No generator, data, runtime, Firebase, Community Heritage, or deployment
rollback is required.
