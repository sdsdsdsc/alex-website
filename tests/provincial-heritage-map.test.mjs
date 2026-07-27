import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const helperSource = await readFile(
  new URL("../heritage-engine/provincial-heritage-map.js", import.meta.url),
  "utf8"
);
const helper = await import(`data:text/javascript;base64,${Buffer.from(helperSource).toString("base64")}`);
const committedGeoJson = JSON.parse(await readFile(
  new URL("../data/jiangxi-provincial-protected-heritage-map.geojson", import.meta.url),
  "utf8"
));

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
      schemaVersion: "2.0.0",
      datasetId: "jiangxi-provincial-protected-heritage-map",
      sourceRecordCount: 15,
      featureCount: 0,
      excludedRecordCount: 15,
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
      protectionLevelZh: "省级文物保护单位",
      officialCategoryZh: "古建筑",
      officialLocationTextZh: "测试地点",
      locationEvidenceConfidence: "High",
      coordinateReferenceSystem: "WGS84",
      publicationLocationPolicy: "exact",
      locationPrecision: "exact",
      publicLocationMeaning: "heritage-feature",
      displayLocationType: "site-point",
      markerClass: "reviewed",
      publicLocationNote: "Project-reviewed location; not an official coordinate.",
      estimatedUncertaintyMeters: 20,
      generalizationRadiusMeters: null,
      sourceIssuerZh: "江西省人民政府",
      sourceTitleZh: "江西省人民政府关于公布第七批江西省文物保护单位的通知",
      sourceUrl: "https://example.gov.cn/source",
      sourceAccessedDate: "2026-07-23",
      projectLocationProvenance: "Alex's Photo Board reviewed public-location decision"
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
      excludedRecordCount: 15 - features.length,
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
  assert.equal(result.metadata.excludedRecordCount, 15);
});

test("rejects an unsupported schema", () => {
  const value = makeValidEmpty();
  value.metadata.schemaVersion = "1.0.0";
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
  expectInvalid(value, /sourceRecordCount must be 15/);
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
  const low = makeValidFeature({ properties: { locationEvidenceConfidence: "Low" } });
  const none = makeValidFeature({ properties: { locationEvidenceConfidence: "None" } });
  expectInvalid(makeFeatureCollection([low]), /must be High or Medium/);
  expectInvalid(makeFeatureCollection([none]), /must be High or Medium/);
});

test("rejects withheld publication", () => {
  const feature = makeValidFeature({ properties: { publicationLocationPolicy: "withheld" } });
  expectInvalid(makeFeatureCollection([feature]), /not public and supported/);
});

test("accepts a synthetic High exact Point", () => {
  const feature = makeValidFeature();
  const result = validateProvincialHeritageGeoJson(makeFeatureCollection([feature]));
  assert.equal(result.status, "valid");
  assert.deepEqual(result.features[0].geometry.coordinates, [113.8825, 27.6202]);
  assert.equal(result.features[0].properties.markerClass, "reviewed");
});

test("accepts the committed five-marker Xinyu publication set", () => {
  const result = validateProvincialHeritageGeoJson(committedGeoJson);
  assert.equal(result.status, "valid");
  assert.equal(result.features.length, 5);
  assert.equal(result.features[0].id, "JX-XY-PCH-001");
  assert.deepEqual(result.features[0].geometry.coordinates, [114.937042, 27.798123]);
  assert.equal(result.features[0].properties.markerClass, "reviewed");
  assert.equal(result.features[0].properties.estimatedUncertaintyMeters, 75);
  assert.deepEqual(
    result.features.map(({ id }) => id),
    ["JX-XY-PCH-001", "JX-XY-PCH-008", "JX-XY-PCH-009", "JX-XY-PCH-014", "JX-XY-PCH-016"]
  );
});

test("accepts a synthetic Medium approximate Point", () => {
  const feature = makeValidFeature({
    properties: {
      locationEvidenceConfidence: "Medium",
      publicationLocationPolicy: "approximate",
      locationPrecision: "approximate",
      displayLocationType: "compound-centroid",
      publicLocationMeaning: "heritage-compound-centre"
    }
  });
  const result = validateProvincialHeritageGeoJson(makeFeatureCollection([feature]));
  assert.equal(result.features[0].properties.locationEvidenceConfidence, "Medium");
  assert.equal(result.features[0].properties.locationPrecision, "approximate");
});

test("preserves GeoJSON longitude-latitude order", () => {
  const feature = makeValidFeature({ geometry: { coordinates: [114.25, 28.75] } });
  const result = validateProvincialHeritageGeoJson(makeFeatureCollection([feature]));
  const [longitude, latitude] = result.features[0].geometry.coordinates;
  assert.equal(longitude, 114.25);
  assert.equal(latitude, 28.75);
});

test("accepts a generalized marker with explicit radius", () => {
  const generalized = makeValidFeature({
    properties: {
      locationEvidenceConfidence: "Medium",
      publicationLocationPolicy: "generalized",
      locationPrecision: "generalized",
      displayLocationType: "generalized-locality",
      publicLocationMeaning: "official-locality-centre",
      markerClass: "generalized",
      generalizationRadiusMeters: 1500
    }
  });
  assert.equal(validateProvincialHeritageGeoJson(makeFeatureCollection([generalized])).status, "valid");
});

test("rejects missing, zero, negative, and non-finite uncertainty", () => {
  const missing = makeValidFeature();
  delete missing.properties.estimatedUncertaintyMeters;
  [
    missing,
    makeValidFeature({ properties: { estimatedUncertaintyMeters: 0 } }),
    makeValidFeature({ properties: { estimatedUncertaintyMeters: -25 } }),
    makeValidFeature({ properties: { estimatedUncertaintyMeters: Infinity } }),
    makeValidFeature({ properties: { estimatedUncertaintyMeters: Number.NaN } })
  ].forEach((feature) => {
    expectInvalid(
      makeFeatureCollection([feature]),
      /estimatedUncertaintyMeters must be a positive finite number/
    );
  });
});

test("rejects non-HTTPS, script, malformed, and relative source URLs", () => {
  [
    "http://example.gov.cn/source",
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "https:example.gov.cn/source",
    "not a URL",
    "/relative/source"
  ].forEach((sourceUrl) => {
    const feature = makeValidFeature({ properties: { sourceUrl } });
    expectInvalid(makeFeatureCollection([feature]), /sourceUrl must be a valid HTTPS URL/);
  });
});

test("rejects reviewed markers with generalized semantics", () => {
  const generalizedDisplay = makeValidFeature({
    properties: {
      displayLocationType: "generalized-locality",
      publicLocationMeaning: "official-locality-centre"
    }
  });
  const generalizedMeaning = makeValidFeature({
    properties: { publicLocationMeaning: "representative-area" }
  });
  const generalizedPolicy = makeValidFeature({
    properties: {
      publicationLocationPolicy: "generalized",
      locationPrecision: "generalized"
    }
  });
  [generalizedDisplay, generalizedMeaning, generalizedPolicy].forEach((feature) => {
    expectInvalid(makeFeatureCollection([feature]), /reviewed marker|reviewed markers/);
  });
});

test("rejects generalized markers with reviewed or exact semantics", () => {
  const reviewedDisplay = makeValidFeature({
    properties: {
      markerClass: "generalized",
      publicationLocationPolicy: "generalized",
      locationPrecision: "generalized",
      generalizationRadiusMeters: 1500
    }
  });
  const exactMeaning = makeValidFeature({
    properties: {
      markerClass: "generalized",
      publicationLocationPolicy: "generalized",
      locationPrecision: "generalized",
      displayLocationType: "generalized-locality",
      publicLocationMeaning: "heritage-feature",
      generalizationRadiusMeters: 1500
    }
  });
  [reviewedDisplay, exactMeaning].forEach((feature) => {
    expectInvalid(makeFeatureCollection([feature]), /generalized marker display type and public-location meaning/);
  });
});

test("rejects generalized markers without a positive radius", () => {
  const baseProperties = {
    publicationLocationPolicy: "generalized",
    locationPrecision: "generalized",
    displayLocationType: "generalized-locality",
    publicLocationMeaning: "official-locality-centre",
    markerClass: "generalized"
  };
  [null, 0, -1, Infinity].forEach((generalizationRadiusMeters) => {
    const feature = makeValidFeature({
      properties: { ...baseProperties, generalizationRadiusMeters }
    });
    expectInvalid(makeFeatureCollection([feature]), /positive radius/);
  });
});

test("rejects generalized markers with incompatible precision or publication policy", () => {
  const incompatiblePrecision = makeValidFeature({
    properties: {
      publicationLocationPolicy: "generalized",
      locationPrecision: "approximate",
      displayLocationType: "generalized-locality",
      publicLocationMeaning: "official-locality-centre",
      markerClass: "generalized",
      generalizationRadiusMeters: 1500
    }
  });
  const incompatiblePolicy = makeValidFeature({
    properties: {
      publicationLocationPolicy: "approximate",
      locationPrecision: "generalized",
      displayLocationType: "generalized-area-reference",
      publicLocationMeaning: "representative-area",
      markerClass: "generalized",
      generalizationRadiusMeters: 1500
    }
  });
  [incompatiblePrecision, incompatiblePolicy].forEach((feature) => {
    expectInvalid(makeFeatureCollection([feature]), /generalized policy and precision/);
  });
});

test("builds a descriptive accessible marker name", () => {
  const feature = makeValidFeature({
    properties: {
      locationEvidenceConfidence: "Medium",
      publicationLocationPolicy: "approximate",
      locationPrecision: "approximate"
    }
  });
  assert.equal(
    buildProvincialMarkerAccessibleName(feature),
    "Open official protected heritage record: Test Archaeological Site (测试遗址), approximate site location"
  );
});

test("accessible marker names distinguish visitor references from feature points", () => {
  const visitorReference = makeValidFeature({
    properties: {
      locationEvidenceConfidence: "Medium",
      publicationLocationPolicy: "approximate",
      locationPrecision: "approximate",
      displayLocationType: "visitor-reference-point",
      publicLocationMeaning: "visitor-reference"
    }
  });
  assert.equal(
    buildProvincialMarkerAccessibleName(visitorReference),
    "Open official protected heritage record: Test Archaeological Site (测试遗址), visitor reference point"
  );
});

test("compound-centroid accessible names identify an approximate project-reviewed compound reference", () => {
  const compoundReference = makeValidFeature({
    properties: {
      locationEvidenceConfidence: "Medium",
      publicationLocationPolicy: "approximate",
      locationPrecision: "approximate",
      displayLocationType: "compound-centroid",
      publicLocationMeaning: "heritage-compound-centre"
    }
  });
  const accessibleName = buildProvincialMarkerAccessibleName(compoundReference);
  assert.equal(
    accessibleName,
    "Open official protected heritage record: Test Archaeological Site (测试遗址); Compound reference point (approximate project-reviewed location)"
  );
  assert.doesNotMatch(accessibleName, /, approximate reviewed location$/);
});

test("builds provenance-safe popup display data", () => {
  const popup = buildProvincialPopupData(makeValidFeature());
  assert.equal(popup.projectNameEn, "Test Archaeological Site");
  assert.equal(popup.officialNameZh, "测试遗址");
  assert.equal(popup.locationEvidenceConfidence, "High");
  assert.equal(popup.markerClass, "reviewed");
  assert.equal(popup.sourceUrl, "https://example.gov.cn/source");
  assert.match(popup.coordinateProvenance, /reviewed public-location decision/);
  assert.match(popup.coordinateProvenance, /not an official designation coordinate/);
});

test("popup display data does not expose an invalid source URL", () => {
  const popup = buildProvincialPopupData(makeValidFeature({
    properties: { sourceUrl: "javascript:alert(1)" }
  }));
  assert.equal(popup.sourceUrl, null);
});
