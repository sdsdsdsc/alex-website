# Phase 15C-23 Kuixing Pavilion Point publication

## Decision and scope

This candidate-specific proposal publishes only M13 魁星阁, using stable
canonical identity `JX-XY-MCH-013`. It follows the merged Phase 15C-22
evidence investigation, but independently rechecks the publication gates; the
earlier Outcome A was research eligibility rather than publication approval.
The project owner separately approved this one-record implementation.

M13 receives exactly one active ordinary Point representation:

- WGS84 longitude/latitude: `[114.937158, 27.797890]`;
- geometry meaning: `heritage-building-reference-point`;
- representation status: `project-reviewed-interpretation`;
- horizontal uncertainty: `30 m`; and
- method: reproducible centroid of the named 魁星阁 building footprint.

The Point is an approximate project-reviewed building reference. It is not an
official GIS or survey coordinate, exact entrance, complete building or
heritage extent, legal centre, or legal protection boundary. It is not a
Generalized Point and does not use the Generalized-Point contract.

## Evidence revalidation

OpenStreetMap way
[`1255899576`](https://www.openstreetmap.org/way/1255899576) remains a closed
WGS84 building footprint named 魁星阁. The separate surrounding P10 新余孔庙
compound is way
[`1255899577`](https://www.openstreetmap.org/way/1255899577), so the compound
geometry is not substituted for M13. Xinyu Museum visitor information names
孔庙 and 魁星阁 as visitor features and does not contradict the physical-feature
identity.

An independent translated signed-area shoelace calculation on the closed M13
footprint reproduces unrounded `[114.9371580, 27.7978904]`, retained as
`[114.937158, 27.797890]`. No Gaode or Baidu coordinate, conversion, API, or
runtime dependency is used. The 30 m uncertainty combines the footprint's
approximately 9 m centre-to-corner extent with a conservative allowance for
open-map digitization and cross-source physical-feature identification; it is
not GPS or survey-grade accuracy. No material contradiction was found.

## Branch effect and preservation

The branch contains 19 source records, nine Point Features, and ten exclusions:
eight ordinary Points plus Xieli as the sole Generalized Point, split across
one national, seven provincial, and one municipal published record. It adds no
line or area. The intentionally provincial-only compatibility GeoJSON remains
seven Points—six ordinary plus Xieli—and excludes M13.

The preservation comparison confirms that M13 is the sole new source identity,
public-location decision, and canonical Feature. The preceding 18 source
records, eight decisions, eight Features, ten exclusions, Xieli contract, and
provincial compatibility bytes remain unchanged. Aggregate counts and review
metadata change only where the added record requires them.

## Determinism, rollback, and non-scope

Two consecutive generator runs must produce byte-for-byte identical outputs.
At the verified PR head, the SHA-256 values are recorded as:

- public-location decisions: `95c6531d51e49caabf566b68f62087a6512bf9e4fd046d35819f44d8b3782f5b`;
- canonical Official Heritage GeoJSON: `eb99e7a222d2a8af40e294f650e043cb73bdc82f6eabf728f5c1ef29c03a64b3`; and
- provincial compatibility GeoJSON: `c5fbfbef3cbdc30f0b3d02443b250a8089be668f701c3c9eca7391a1e488cbd9`.

Rollback is bounded to the M13 source record, M13 decision, generated M13
Feature, controlled meaning support, count/cache adjustments, focused tests,
and this status documentation. The PR does not publish or research any other
candidate; add a line or area; change Community Heritage, Firebase, provider
APIs, map architecture, or policy; deploy manually; or merge itself.
