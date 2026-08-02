# Phase 15C-9 Xiabu uprising-site Point publication

## Outcome

PR #69 publishes one new Official Heritage Point and no other spatial record:
the separately listed `暴动举行地旧址` component of
`下保农民暴动旧址`, canonical ID `JX-XY-PCH-018`.

The reviewed WGS84 coordinate is `[114.995570, 27.667620]`, with estimated
horizontal uncertainty of 150 metres and the controlled meaning
`component-reference-point`. The Point is a public component reference only.
It is not the parent designation, the separately listed `暴动会议地旧址`
component, a building footprint, entrance, centroid, complete protected
extent, or official/legal boundary.

## Evidence and reconciliation

The current Xinyu register supplies the exact component name, category, and
locality. The designation reference `6-5-321`, period `1929`, and photographed
protection plaque preserve the component-specific identity. The canonical
record does not create a parent record or a record for the meeting-site
component.

Baidu UID `ba0c8d3a43ce938b13293507` converts deterministically from Baidu
Mercator through BD-09 and GCJ-02 to
`[114.995569672, 27.667620470]` WGS84. Gaode POI `B0L1RCC3EM` converts
independently to `[114.994632317, 27.668364844]` WGS84. The two results are
124.0 metres apart. The Baidu-derived result was selected, not averaged,
because its venue photograph shows the component-specific plaque. Six-decimal
rounding is for reproducibility and does not imply survey precision.

## Publication boundary

The deterministic aggregate is now 16 source records, 6 published features,
and 10 expected exclusions, with zero hard errors. All six production
geometries remain Points: three Ancient buildings and three Important modern
historic sites. The previous five records retain their identifiers,
coordinates, categories, and publication semantics.

Xieli, the Xiabu parent, the `暴动会议地旧址` component, and every line or
polygon remain unpublished. Community Heritage is unchanged. This PR does not
deploy production and does not begin PR #70.

## Verification

Publication validation, deterministic generation checks, geometry validation,
unit tests, and the browser smoke suite cover the component identity,
coordinate order, uncertainty, limitation wording, category controls,
keyboard activation, atomic failure, and absence of sibling or Xieli
publication.
