import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const helperSource = await readFile(
  new URL("../heritage-engine/provincial-heritage-map.js", import.meta.url),
  "utf8"
);
const helper = await import(`data:text/javascript;base64,${Buffer.from(helperSource).toString("base64")}`);

const {
  ProvincialHeritageMapValidationError,
  buildProvincialMarkerAccessibleName,
  buildProvincialPopupData,
  validateProvincialHeritageGeoJson
} = helper;

function makeValidEmpty() {
  return {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: "1.0.0",
      datasetId: "jiangxi-provincial-protected-heritage-pilot",
      sourceDataset: "data/jiangxi-provincial-heritage-pilot.json",
      sourceRecordCount: 10,
      featureCount: 0,
      excludedRecordCount: 10,
      generationStatus: "valid-empty",
      geometryProvenance: "Alex's Photo Board project coordinate review"
    },
    features: []
  };
}

function makeValidFeature(overrides = {}) {
  const feature = {
    type: "Feature",
    id: "JX-PCH-7-001",
    properties: {
      recordId: "JX-PCH-7-001",
      officialNameZh: "测试遗址",
      projectNameEn: "Test Archaeological Site",
      coordinateConfidence: "High",
      coordinateReferenceSystem: "WGS84",
      publicationLocationPolicy: "exact",
      sensitivityAssessment: "public-exact-acceptable",
      approximateLocation: false,
      sourceIssuerZh: "江西省人民政府",
      sourceTitleZh: "江西省人民政府关于公布第七批江西省文物保护单位的通知",
      sourceUrl: "https://example.gov.cn/source",
      sourceAccessedDate: "2026-07-23",
      geometryProvenance: "Alex's Photo Board project coordinate review"
    },
    geometry: {
      type: "Point",
      coordinates: [113.8825, 27.6202]
    }
  };

  if (overrides.properties) Object.assign(feature.properties, overrides.properties);
  if (overrides.geometry) Object.assign(feature.geometry, overrides.geometry);
  Object.entries(overrides)
    .filter(([key]) => !["properties", "geometry"].includes(key))
    .forEach(([key, value]) => {
      feature[key] = value;
    });
  return feature;
}

function makeFeatureCollection(features) {
  return {
    ...makeValidEmpty(),
    metadata: {
      ...makeValidEmpty().metadata,
      featureCount: features.length,
      excludedRecordCount: 10 - features.length,
      generationStatus: features.length === 0 ? "valid-empty" : "valid"
    },
    features
  };
}

function expectInvalid(value, pattern) {
  assert.throws(
    () => validateProvincialHeritageGeoJson(value),
    (error) => error instanceof ProvincialHeritageMapValidationError && pattern.test(error.message)
  );
}

test("accepts the committed valid-empty contract", () => {
  const result = validateProvincialHeritageGeoJson(makeValidEmpty());
  assert.equal(result.status, "valid-empty");
  assert.equal(result.features.length, 0);
  assert.equal(result.metadata.excludedRecordCount, 10);
});

test("rejects an unsupported schema", () => {
  const value = makeValidEmpty();
  value.metadata.schemaVersion = "2.0.0";
  expectInvalid(value, /schemaVersion is unsupported/);
});

test("rejects the wrong dataset ID", () => {
  const value = makeValidEmpty();
  value.metadata.datasetId = "another-dataset";
  expectInvalid(value, /datasetId is unsupported/);
});

test("rejects the wrong top-level type", () => {
  const value = makeValidEmpty();
  value.type = "Feature";
  expectInvalid(value, /type must be FeatureCollection/);
});

test("rejects missing metadata", () => {
  const value = makeValidEmpty();
  delete value.metadata;
  expectInvalid(value, /metadata must be an object/);
});

test("rejects non-array features", () => {
  const value = makeValidEmpty();
  value.features = {};
  expectInvalid(value, /features must be an array/);
});

test("rejects the wrong source record count", () => {
  const value = makeValidEmpty();
  value.metadata.sourceRecordCount = 9;
  expectInvalid(value, /sourceRecordCount must be 10/);
});

test("rejects a feature count mismatch", () => {
  const value = makeValidEmpty();
  value.metadata.featureCount = 1;
  expectInvalid(value, /featureCount must equal features.length/);
});

test("rejects inconsistent feature and exclusion counts", () => {
  const value = makeValidEmpty();
  value.metadata.excludedRecordCount = 9;
  expectInvalid(value, /Feature and exclusion counts must equal/);
});

test("rejects a generation status inconsistent with zero features", () => {
  const value = makeValidEmpty();
  value.metadata.generationStatus = "valid";
  expectInvalid(value, /generationStatus contradicts featureCount/);
});

test("rejects duplicate feature IDs", () => {
  const first = makeValidFeature();
  const second = makeValidFeature();
  expectInvalid(makeFeatureCollection([first, second]), /duplicates JX-PCH-7-001/);
});

test("rejects unsupported geometry", () => {
  const feature = makeValidFeature({ geometry: { type: "Polygon" } });
  expectInvalid(makeFeatureCollection([feature]), /geometry.type must be Point/);
});

test("rejects incomplete coordinates", () => {
  const feature = makeValidFeature({ geometry: { coordinates: [113.8825] } });
  expectInvalid(makeFeatureCollection([feature]), /coordinates must be \[longitude, latitude\]/);
});

test("rejects non-finite longitude and latitude", () => {
  const longitude = makeValidFeature({ geometry: { coordinates: [Infinity, 27.6202] } });
  const latitude = makeValidFeature({ geometry: { coordinates: [113.8825, Number.NaN] } });
  expectInvalid(makeFeatureCollection([longitude]), /longitude must be finite/);
  expectInvalid(makeFeatureCollection([latitude]), /latitude must be finite/);
});

test("rejects invalid latitude", () => {
  const feature = makeValidFeature({ geometry: { coordinates: [113.8825, 91] } });
  expectInvalid(makeFeatureCollection([feature]), /latitude is outside/);
});

test("rejects invalid longitude", () => {
  const feature = makeValidFeature({ geometry: { coordinates: [181, 27.6202] } });
  expectInvalid(makeFeatureCollection([feature]), /longitude is outside/);
});

test("rejects Low and None features", () => {
  const low = makeValidFeature({ properties: { coordinateConfidence: "Low" } });
  const none = makeValidFeature({ properties: { coordinateConfidence: "None" } });
  expectInvalid(makeFeatureCollection([low]), /must be High or Medium/);
  expectInvalid(makeFeatureCollection([none]), /must be High or Medium/);
});

test("rejects withheld publication", () => {
  const feature = makeValidFeature({ properties: { publicationLocationPolicy: "withheld" } });
  expectInvalid(makeFeatureCollection([feature]), /not public and supported/);
});

test("rejects restricted sensitivity", () => {
  const feature = makeValidFeature({ properties: { sensitivityAssessment: "restricted" } });
  expectInvalid(makeFeatureCollection([feature]), /does not permit public display/);
});

test("accepts a synthetic High exact Point", () => {
  const feature = makeValidFeature();
  const result = validateProvincialHeritageGeoJson(makeFeatureCollection([feature]));
  assert.equal(result.status, "valid");
  assert.deepEqual(result.features[0].geometry.coordinates, [113.8825, 27.6202]);
  assert.equal(result.features[0].properties.approximateLocation, false);
});

test("accepts a synthetic Medium approximate Point", () => {
  const feature = makeValidFeature({
    properties: {
      coordinateConfidence: "Medium",
      publicationLocationPolicy: "approximate",
      approximateLocation: true
    }
  });
  const result = validateProvincialHeritageGeoJson(makeFeatureCollection([feature]));
  assert.equal(result.features[0].properties.coordinateConfidence, "Medium");
  assert.equal(result.features[0].properties.approximateLocation, true);
});

test("preserves GeoJSON longitude-latitude order", () => {
  const feature = makeValidFeature({ geometry: { coordinates: [114.25, 28.75] } });
  const result = validateProvincialHeritageGeoJson(makeFeatureCollection([feature]));
  const [longitude, latitude] = result.features[0].geometry.coordinates;
  assert.equal(longitude, 114.25);
  assert.equal(latitude, 28.75);
});

test("rejects contradictory exact approximation state", () => {
  const feature = makeValidFeature({ properties: { approximateLocation: true } });
  expectInvalid(makeFeatureCollection([feature]), /approximateLocation contradicts/);
});

test("rejects contradictory Medium or approximate non-approximation state", () => {
  const medium = makeValidFeature({
    properties: {
      coordinateConfidence: "Medium",
      publicationLocationPolicy: "approximate",
      approximateLocation: false
    }
  });
  expectInvalid(makeFeatureCollection([medium]), /approximateLocation contradicts/);
});

test("builds a descriptive accessible marker name", () => {
  const feature = makeValidFeature({
    properties: {
      coordinateConfidence: "Medium",
      publicationLocationPolicy: "approximate",
      approximateLocation: true
    }
  });
  assert.equal(
    buildProvincialMarkerAccessibleName(feature),
    "Open provincial heritage record: Test Archaeological Site (测试遗址), approximate location"
  );
});

test("builds provenance-safe popup display data", () => {
  const popup = buildProvincialPopupData(makeValidFeature());
  assert.equal(popup.projectNameEn, "Test Archaeological Site");
  assert.equal(popup.officialNameZh, "测试遗址");
  assert.equal(popup.coordinateConfidence, "High");
  assert.equal(popup.approximateLocation, false);
  assert.match(popup.coordinateProvenance, /project coordinate review/);
  assert.match(popup.coordinateProvenance, /not an official designation coordinate/);
});
