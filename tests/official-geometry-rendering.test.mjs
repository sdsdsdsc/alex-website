import assert from "node:assert/strict";
import test from "node:test";

import {
  NON_POINT_GEOMETRY_PRESENTATIONS,
  OfficialGeometryRenderingError,
  getOfficialGeometryRenderPresentation,
  getOfficialGeometrySourceLabel,
  prepareOfficialGeometryRenderModels
} from "../heritage-engine/official-geometry-rendering.js";

function makeFeature({
  type = "LineString",
  geometryMeaning = "reviewed-line",
  geometryPrecision = geometryMeaning.startsWith("reviewed-")
    ? "reviewed"
    : geometryMeaning.startsWith("approximate-")
      ? "approximate"
      : geometryMeaning === "uncertainty-area"
        ? "uncertain"
        : "generalized",
  coordinates = [[113.88, 27.62], [113.89, 27.63]]
} = {}) {
  return {
    type: "Feature",
    id: `synthetic-${geometryMeaning}`,
    properties: {
      geometryMeaning,
      geometryPrecision,
      geometrySourceType: "project-reviewed-digitization",
      officialCategoryZh: "古建筑"
    },
    geometry: { type, coordinates }
  };
}

test("uses a static meaning-driven presentation matrix", () => {
  assert.deepEqual(Object.keys(NON_POINT_GEOMETRY_PRESENTATIONS), [
    "reviewed-line",
    "approximate-line",
    "reviewed-boundary",
    "approximate-boundary",
    "generalized-reference-area",
    "uncertainty-area"
  ]);
  Object.values(NON_POINT_GEOMETRY_PRESENTATIONS).forEach((presentation) => {
    assert.equal(Object.isFrozen(presentation), true);
    assert.equal(Object.isFrozen(presentation.pathOptions), true);
    assert.match(presentation.className, /^official-heritage-geometry /);
    assert.equal(presentation.pathOptions.color.startsWith("#"), true);
  });
});

test("distinguishes reviewed and approximate line presentations", () => {
  const reviewed = getOfficialGeometryRenderPresentation(makeFeature());
  const approximate = getOfficialGeometryRenderPresentation(makeFeature({
    type: "MultiLineString",
    geometryMeaning: "approximate-line",
    coordinates: [[[113.88, 27.62], [113.89, 27.63]]]
  }));
  assert.equal(reviewed.renderer, "line");
  assert.equal(reviewed.meaningLabel, "Reviewed line");
  assert.equal(reviewed.pathOptions.dashArray, undefined);
  assert.equal(reviewed.pathOptions.weight, 5);
  assert.equal(approximate.renderer, "line");
  assert.equal(approximate.meaningLabel, "Approximate line");
  assert.equal(approximate.pathOptions.dashArray, "8 7");
  assert.ok(approximate.pathOptions.weight < reviewed.pathOptions.weight);
  assert.ok(approximate.pathOptions.opacity < reviewed.pathOptions.opacity);
});

test("uses restrained meaning-specific area presentations", () => {
  const cases = [
    ["reviewed-boundary", "Reviewed boundary", undefined, 0.14],
    ["approximate-boundary", "Approximate boundary", "8 6", 0.08],
    ["generalized-reference-area", "Generalized project reference area", "3 7", 0.045],
    ["uncertainty-area", "Uncertainty area", "2 8", 0.1]
  ];
  cases.forEach(([geometryMeaning, label, dashArray, fillOpacity]) => {
    const presentation = getOfficialGeometryRenderPresentation(makeFeature({
      type: geometryMeaning === "uncertainty-area" ? "MultiPolygon" : "Polygon",
      geometryMeaning,
      coordinates: geometryMeaning === "uncertainty-area"
        ? [[[[113.88, 27.62], [113.89, 27.62], [113.89, 27.63], [113.88, 27.62]]]]
        : [[[113.88, 27.62], [113.89, 27.62], [113.89, 27.63], [113.88, 27.62]]]
    }));
    assert.equal(presentation.renderer, "area");
    assert.equal(presentation.meaningLabel, label);
    assert.equal(presentation.pathOptions.dashArray, dashArray);
    assert.equal(presentation.pathOptions.fillOpacity, fillOpacity);
    assert.ok(presentation.pathOptions.fillOpacity <= 0.14);
  });
});

test("keeps legacy Point presentation separate and marker-compatible", () => {
  const point = getOfficialGeometryRenderPresentation({
    type: "Feature",
    properties: {
      displayLocationType: "visitor-reference-point",
      publicLocationMeaning: "visitor-reference"
    },
    geometry: { type: "Point", coordinates: [113.88, 27.62] }
  });
  assert.deepEqual(point, {
    geometryType: "Point",
    geometryMeaning: "visitor-reference-point",
    meaningLabel: "Visitor reference point",
    renderer: "point",
    className: null,
    pathOptions: null
  });
});

test("keeps the heritage-building reference Point ordinary and marker-compatible", () => {
  const point = getOfficialGeometryRenderPresentation({
    type: "Feature",
    properties: {
      geometryMeaning: "heritage-building-reference-point",
      geometryPrecision: "approximate",
      geometrySourceType: "project-reviewed-digitization"
    },
    geometry: { type: "Point", coordinates: [114.937158, 27.79789] }
  });
  assert.deepEqual(point, {
    geometryType: "Point",
    geometryMeaning: "heritage-building-reference-point",
    meaningLabel: "Heritage building reference point (approximate project-reviewed location)",
    renderer: "point",
    className: null,
    pathOptions: null
  });
});

test("fails closed instead of inferring a style from geometry type", () => {
  assert.throws(
    () => getOfficialGeometryRenderPresentation(makeFeature({
      type: "LineString",
      geometryMeaning: "reviewed-boundary"
    })),
    (error) => (
      error instanceof OfficialGeometryRenderingError
      && /No controlled rendering presentation/.test(error.message)
    )
  );
  assert.throws(
    () => getOfficialGeometryRenderPresentation(makeFeature({
      geometryMeaning: "future-line-meaning"
    })),
    /Unsupported official geometry meaning/
  );
  assert.throws(
    () => getOfficialGeometryRenderPresentation(makeFeature({
      geometryMeaning: "reviewed-line",
      geometryPrecision: "approximate"
    })),
    /No controlled rendering presentation exists for reviewed-line with approximate/
  );
});

test("prepares a complete collection before returning render models", () => {
  const valid = makeFeature();
  const invalid = makeFeature({
    type: "LineString",
    geometryMeaning: "reviewed-boundary"
  });
  assert.throws(
    () => prepareOfficialGeometryRenderModels([valid, invalid]),
    /No controlled rendering presentation/
  );
});

test("uses controlled provenance labels and rejects unknown source labels", () => {
  assert.equal(
    getOfficialGeometrySourceLabel("official-published-geometry"),
    "Official published geometry"
  );
  assert.equal(
    getOfficialGeometrySourceLabel("project-reviewed-digitization"),
    "Project-reviewed digitization"
  );
  assert.equal(
    getOfficialGeometrySourceLabel("project-generalized-reference"),
    "Project-generalized reference"
  );
  assert.equal(getOfficialGeometrySourceLabel("future-source"), null);
});
