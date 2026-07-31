# Phase 15C-11 — Xinyu fallback Point evidence audit

## Scope and conclusion

This documentation-only audit applies the controlling
[Official Heritage spatial representation and publication policy](../policy/official-record-publication-policy.md)
to every unpublished Xinyu identity that has either a confirmed provider lead
or a plausible future line/area representation. It asks whether any identity
can safely use an ordinary or generalized Point now, with a separately
approved shape superseding that Point later.

**Conclusion: no additional identity passes the Point publication gates.**
All 39 candidates remain **Withhold pending evidence**. The future PR #69
addition list is therefore exactly `[]`; the paused PR continues to contain
only the previously approved Xiabu P19 proposal.

This result does not say that the strong provider results are wrong. It says
that none of the 39 candidates has a preserved, legitimate feature coordinate
with a record-specific CRS, deterministic WGS84 conversion, independently
reviewed public meaning, uncertainty, sensitivity decision, and
misleading-risk clearance. Search-map viewport centres and Baidu Web Mercator
display centres are not source POI coordinates and were not converted.

Policy consistency conclusion:

> **Existing policy applied successfully; no change required.**

No policy wording is changed or proposed. The existing minimum Point threshold
already makes the correct distinction between a useful provider identity lead
and publishable spatial evidence.

## Controlling baseline and boundaries

- Phase 15C-1 / PR #60 already supplies the production-verified Point,
  LineString, MultiLineString, Polygon, and MultiPolygon validation foundation.
- Phase 15C-2 / PR #62 already supplies the production-verified mixed-geometry
  renderer using synthetic line and area fixtures.
- Phase 15C-10 / merged PR #70 supplies the reconciled 62-identity list, the
  213-search Gaode/Baidu evidence pass, and the 29-candidate future non-Point
  inventory.
- Production remains five Official Heritage Points and no real line or area.
- The newly approved one-active-representation lifecycle is not implemented.
  A future shape would supersede, never supplement, a temporary Point.
- Xiabu P19 is a comparison control only. Its existing component-specific
  evidence and paused implementation proposal are not reopened.
- No runtime, source data, schema implementation, generated GeoJSON,
  rendering, Community Heritage, Firebase, deployment, or production change
  is authorized here.

## Reproducible candidate universe

The universe is the union of two independently reproducible sets:

1. **19 unpublished provider-confirmed identities** with `C` on Gaode or
   Baidu in the Phase 15C-10 provider matrix:
   `N01–N08`, `P01`, `P05`, `P12`, `P22`, `M01`, `M04`, `M13`, `M21`,
   `M23`, `M30`, and `M31`.
2. **28 unpublished future non-Point candidates** from the Phase 15C-10
   inventory: its 29 rows less the already published P09 bridge Point.

The sets overlap on eight identities:
`N01`, `N02`, `P01`, `P12`, `M01`, `M04`, `M21`, and `M31`.

Therefore:

`19 + 28 - 8 = 39 unpublished fallback-Point candidates`.

The 39 identities are:

- national: `N01–N08` — 8;
- provincial: `P01`, `P02`, `P03`, `P04`, `P05`, `P12`, `P16`, `P21`,
  `P22` — 9;
- municipal: `M01`, `M02`, `M03`, `M04`, `M05`, `M06`, `M07`, `M08`,
  `M09`, `M11`, `M13`, `M18`, `M19`, `M20`, `M21`, `M23`, `M24`, `M25`,
  `M26`, `M28`, `M30`, `M31` — 22.

The detailed set construction, evidence record, and candidate-by-candidate gate
matrix are in the
[fallback Point candidate matrix](../research/phase-15c-11-xinyu-fallback-point-candidate-matrix.md).

## Evidence method

### Reused evidence

The audit reuses, without weakening or reclassifying:

- the exact official identities, levels, categories, locations, and
  parent/component reconciliation from Phase 15C-10;
- all 124 base and 89 locality/component provider searches in its complete
  provider matrix;
- its stable Gaode place IDs and Baidu UIDs;
- the independent national, provincial, museum, institutional, and
  component-specific corroboration already recorded there;
- the Phase 15C-5 Xiabu raw coordinates and component-plaque evidence;
- the Phase 15C-7 Xieli misleading-risk result; and
- the five production decisions and their preserved raw-coordinate,
  conversion, uncertainty, and public-meaning records.

### Focused public-interface recheck

On 2026-07-31 the public Baidu interface was rechecked for the priority
identities `N03`, `N07`, `N08`, `P22`, `M23`, `M30`, `M21`, and `P12`, plus
the `N01` areal control. The visible results reinforced the earlier evidence:

| Identity | Visible Baidu result | Evidential effect |
| --- | --- | --- |
| N01 凤凰山铁矿遗址 | exact heritage result; `文物古迹`; 分宜县 215乡道 | Identity/locality lead only; no legitimate raw POI coordinate. |
| N03 罗坊会议旧址 | exact old-site result plus separate 陈家闹红军驻地 result and visitor-complex results | Component/complex distinction remains necessary. |
| N07 水西红三军团指挥部旧址 | exact revolutionary-site result in 水西镇 | Strong identity lead; no source coordinate or meaning decision. |
| N08 第58师师部遗址 | exact longer-form result in 大桥村 | Strong identity lead; still separate from P22. |
| P22 第十九集团军总司令部旧址 | exact longer-form result near 新余黄冈学校 | Strong identity lead; address is not a reviewed feature coordinate. |
| M23 枫溪彭氏民居 | exact result, `旅游景点`, 233乡道西50米 | Strong POI lead; provider venue meaning and coordinate remain unresolved. |
| M30 罗坊会议纪念馆 | exact museum result plus visitor-complex subresults | Museum/visitor venue must not be substituted for N04. |
| M21 八斗桥 | no bridge feature in the focused Baidu recheck; locality facilities only | Confirms the earlier Baidu `N`; Gaode-only exact-name lead remains insufficient. |
| P12 金鸡埔陵园 | named cemetery-site variant on 223乡道 | Identifies a venue/site lead, not a defensible cemetery-centre surrogate. |

Baidu search URLs exposed map viewport values in Web Mercator. They are display
centres, can lag between successive searches, and are not asserted by the
interface to be raw feature coordinates. They were therefore rejected.
Gaode place-detail retrieval presented a public slide-verification control
during the focused recheck. It was not bypassed. Existing stable place IDs were
retained, but no new raw value was claimed.

### Coordinate and distance rule

For every candidate, the legitimate raw-coordinate field is `not obtained`.
Consequently:

- source CRS is unresolved;
- no GCJ-02 or BD-09 value is asserted;
- no conversion to WGS84 is performed;
- no selected public Point is created; and
- no cross-provider or control-point distance is calculated.

This is a positive audit result, not missing arithmetic: calculating a distance
from rejected viewport/display-centre values would manufacture precision.

## Publication gate

The matrix uses these gates:

| Gate | Requirement |
| --- | --- |
| G1 | Official identity, designation level, component treatment, and locality reconciled. |
| G2 | Provider result identifies the protected feature rather than only a locality, venue, parent, or same-name result. |
| G3 | Independent feature-specific corroboration supports the identity and location meaning. |
| G4 | Legitimate raw feature coordinate and record-specific source CRS are preserved. |
| G5 | Deterministic WGS84 conversion and cross-provider/basemap reconciliation pass. |
| G6 | One controlled Point meaning, uncertainty, and public limitation wording are defensible. |
| G7 | Sensitivity and access disclosure are reviewed. |
| G8 | Overview/detail misleading-risk and duplicate/substitution risks pass. |

`G1`, `G4`, `G5`, `G6`, and `G8` are mandatory for Point publication; `G7`
is also mandatory whenever sensitivity is relevant. Under the policy, any
mandatory `Unresolved` result requires withholding. G4 and G5 are unresolved
for every candidate, so no provider strength can by itself produce a
publication recommendation.

## Findings by candidate class

### Strong point-like or modern-site results

`N03`, `N04`, `N07`, `N08`, `P05`, `P22`, `M13`, `M23`, and `M30` are the
strongest ordinary-Point research leads. None has a publishable raw-coordinate
chain. Additional identity-specific cautions remain:

- N03/N04 are components of one national parent and cannot be labelled as the
  entire designation.
- N04 and M30 are a historic component and a museum, not duplicates.
- N08 and P22 concern different 上高会战 headquarters in different localities.
- P05 must distinguish the protected tomb from a memorial or visitor venue.
- M13 must remain distinct from nearby P10 新余孔庙.
- M23's provider tourism label does not establish whether its centre is the
  protected residence, entrance, or visitor facility.

Their outcome is **Withhold pending evidence**, not rejection forever.

### Multipart modern components

N05 and N06 have strong Gaode sublabel leads, but each official component
contains more than one named subfeature. A single provider centre could
misrepresent the whole component. Component topology, a defensible visitor or
compound reference, raw-coordinate provenance, and limitation wording remain
unresolved. Both are **Withhold pending evidence**.

### Archaeological and landscape candidates

The 21 unpublished area candidates are not made safer merely by replacing a
future area with a provider centre. A temporary generalized Point could be
considered only after its own location, uncertainty, sensitivity, and
misleading-risk evidence passes.

P03 and P21 retain explicit provider/locality conflicts. P04 retains the
Phase 15C-7 conclusion that its synthetic square and uncertainty area are
misleading; even a generalized Point still lacks a verified datum and cleared
presentation. P12, P16, and M31 cannot use a cemetery, park, memorial, or
landscape viewport centre as though it represented the protected extent.
All area candidates remain **Withhold pending evidence**.

### Bridges

M18, M19, M20, M21, M24, M25, and M26 all remain unpublished. A bridge may
legitimately use a reviewed feature or visitor-reference Point before a later
surveyed line, as production control P09 demonstrates. These seven do not yet
meet that standard:

- M21 has only a Gaode exact-name lead and no Baidu feature result;
- M18, M19, M24, and M25 have locality or bridge-name variants without a
  resolved feature coordinate;
- M20 returns the village, not the protected bridge; and
- M26 returns a cultural-base/locality variant, not the historic alignment.

All seven are **Withhold pending evidence**. A later approved line would
supersede any separately approved temporary Point.

## Control comparisons

### Five production Points

The five controls pass because their publication decisions preserve a
record-specific raw-coordinate source, CRS treatment, WGS84 reconciliation,
selected meaning, uncertainty, provenance, and review:

| Identity | Control lesson |
| --- | --- |
| P08 昼锦堂 | A named Gaode POI was independently reconciled as a visitor reference with 125 m uncertainty. |
| P09 蓉泉桥 | A bridge can validly be Point now and line later when a feature-specific raw coordinate and independent bridge context exist. |
| P10 新余孔庙 | A compound-reference Point needs explicit compound meaning and an independently reviewed WGS84 reference. |
| P15 傅抱石故居 | A visitor venue is labelled as a visitor reference, not asserted as exact protected fabric. |
| P17 上海劳动妇女战地服务团旧址 | Exact-name provider evidence was only one part of a reviewed coordinate and uncertainty chain. |

No candidate matches that complete chain.

### Xiabu P19

P19 remains the only unpublished ordinary-Point control because it preserves
two raw provider coordinate chains, deterministic conversions, a
component-specific plaque, a selected component-reference Point, 150 m
uncertainty, and explicit limitations. P19 is point-like and
`futureNonPointRepresentation: unnecessary`. Nothing in this audit modifies
its branch, commit, files, or evidence conclusion.

### Consistency controls

- P04 Xieli: conditional generalized-Point research remains withheld.
- P03 and P21: locality conflicts continue to block any representation.
- M22 四眼井: the same-name community remains insufficient to identify the
  protected well; it is not added to the candidate universe merely because a
  community centre is easy to map.

These controls show that the audit did not lower the gate for candidates with
more attractive provider results.

## Operational outcomes and future batch

| Operational outcome | Count | Identities |
| --- | ---: | --- |
| Point now | 0 | none |
| Point now, shape later | 0 | none |
| Shape now | 0 | none |
| Withhold pending evidence | 39 | every candidate in the matrix |

Exact ordered additions to the paused PR #69 batch: **none (`[]`)**.

The PR #69 proposal remains P19 only. This audit does not approve, modify,
amend, rebase, merge, deploy, or close that draft.

## Evidence needed to change an outcome

For a point-like identity:

1. preserve the feature-specific raw provider or institutional coordinate;
2. record its asserted CRS and coordinate meaning;
3. add independent feature-specific corroboration;
4. convert and reconcile it deterministically to WGS84;
5. select a controlled Point meaning and honest uncertainty;
6. clear sensitivity and misleading-risk review; and
7. obtain separate publication approval.

For an areal or linear identity, a temporary Point must pass the same Point
gate on its own merits. A future shape additionally needs authoritative or
licensed geometry, topology, provenance, uncertainty, and separate approval.
When approved, it supersedes the temporary Point under the
one-active-representation rule.

## Verification boundary

The audit must remain byte-neutral for
`data/jiangxi-provincial-protected-heritage-map.geojson` and must not alter the
five public-location decisions. Documentation links, count reconciliation,
contradiction searches, JSON parsing, existing geometry/publication validators,
the generator check, the full test suite, and the repository browser harness
are rerun before the draft documentation PR is opened.
