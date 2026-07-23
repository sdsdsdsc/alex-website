import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  EXPECTED_RECORD_IDS,
  ProvincialHeritageValidationError,
  generateProvincialHeritageGeoJson,
  getGeometryExclusionReasons,
  serializeJson,
  validateProvincialHeritageDataset
} from "../scripts/lib/provincial-heritage-data.mjs";

const datasetUrl = new URL("../data/jiangxi-provincial-heritage-pilot.json", import.meta.url);
const geoJsonUrl = new URL("../data/jiangxi-provincial-heritage-pilot.geojson", import.meta.url);
const datasetBytes = await readFile(datasetUrl, "utf8");
const committedGeoJsonBytes = await readFile(geoJsonUrl, "utf8");
const canonicalDataset = JSON.parse(datasetBytes);
const committedGeoJson = JSON.parse(committedGeoJsonBytes);

function cloneDataset() {
  return structuredClone(canonicalDataset);
}

function recordById(dataset, recordId) {
  return dataset.records.find((record) => record.recordId === recordId);
}

function makeRenderableDataset({
  recordId = "JX-PCH-7-001",
  confidence = "High",
  publicationPolicy = "exact",
  sensitivityAssessment = "public-exact-acceptable",
  latitude = 27.801234,
  longitude = 114.901234
} = {}) {
  const dataset = cloneDataset();
  const record = recordById(dataset, recordId);
  Object.assign(record.coordinateReview, {
    researchStatus: "reviewed",
    coordinateConfidence: confidence,
    coordinateMethod: confidence === "High" ? "authoritative-coordinate" : "address-or-compound-match",
    approvedLatitude: latitude,
    approvedLongitude: longitude,
    coordinateReferenceSystem: "WGS84",
    estimatedUncertaintyMeters: confidence === "High" ? 5 : 100,
    renderable: true,
    sensitivityAssessment,
    publicationLocationPolicy: publicationPolicy,
    selectedCandidateId: `${recordId}-C99`
  });
  return dataset;
}

function validateSynthetic(dataset) {
  return validateProvincialHeritageDataset(dataset, { enforceApprovedPilotParity: false });
}

function generateSynthetic(dataset) {
  return generateProvincialHeritageGeoJson(dataset, { enforceApprovedPilotParity: false });
}

function expectSyntheticError(dataset, pattern) {
  const result = validateSynthetic(dataset);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), pattern);
}

test("canonical dataset validates with exactly ten fixed sequential records", () => {
  const result = validateProvincialHeritageDataset(canonicalDataset);
  assert.equal(result.valid, true, result.errors.join("\n"));
  assert.equal(result.recordCount, 10);
  assert.deepEqual(canonicalDataset.records.map(({ recordId }) => recordId), EXPECTED_RECORD_IDS);
  assert.equal(new Set(EXPECTED_RECORD_IDS).size, 10);
});

test("canonical dataset preserves exact approved Phase 14A parity", () => {
  const dataset = cloneDataset();
  recordById(dataset, "JX-PCH-7-001").official.officialNameZh = "changed";
  const result = validateProvincialHeritageDataset(dataset);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /Phase 14A official-source parity mismatch/);
});

test("canonical dataset preserves exact approved Phase 14B parity", () => {
  const dataset = cloneDataset();
  recordById(dataset, "JX-PCH-7-001").projectInterpretation.projectNameEn = "Changed";
  const result = validateProvincialHeritageDataset(dataset);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /Phase 14B project-interpretation parity mismatch/);
});

test("canonical dataset preserves exact approved Phase 14C parity", () => {
  const dataset = cloneDataset();
  recordById(dataset, "JX-PCH-7-001").coordinateReview.coordinateConfidence = "None";
  const result = validateProvincialHeritageDataset(dataset);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /Phase 14C coordinate-review parity mismatch/);
});

test("canonical coordinate outcomes remain five Low, five None, and entirely non-spatial", () => {
  const reviews = canonicalDataset.records.map(({ coordinateReview }) => coordinateReview);
  assert.equal(reviews.filter(({ researchStatus, coordinateConfidence }) => researchStatus === "reviewed" && coordinateConfidence === "Low").length, 5);
  assert.equal(reviews.filter(({ researchStatus, coordinateConfidence }) => researchStatus === "unresolved" && coordinateConfidence === "None").length, 5);
  assert.equal(reviews.filter(({ coordinateConfidence }) => coordinateConfidence === "High").length, 0);
  assert.equal(reviews.filter(({ coordinateConfidence }) => coordinateConfidence === "Medium").length, 0);
  assert.equal(reviews.filter(({ renderable }) => renderable).length, 0);
  assert.equal(reviews.filter(({ approvedLatitude }) => approvedLatitude !== null).length, 0);
  assert.equal(reviews.filter(({ approvedLongitude }) => approvedLongitude !== null).length, 0);
  assert.equal(reviews.filter(({ selectedCandidateId }) => selectedCandidateId !== null).length, 0);
  assert(reviews.every(({ publicationLocationPolicy }) => publicationLocationPolicy === "withheld"));
});

test("multi-component records remain one parent each with descriptive components only", () => {
  const record004 = recordById(canonicalDataset, "JX-PCH-7-004");
  const record006 = recordById(canonicalDataset, "JX-PCH-7-006");
  assert.equal(record004.projectInterpretation.components.length, 4);
  assert.equal(record006.projectInterpretation.components.length, 3);
  assert.deepEqual(
    record004.projectInterpretation.components.map(({ nameZh, nameEn }) => [nameZh, nameEn]),
    [
      ["灵泉池段", "Lingquanchi Section"],
      ["高士南路段", "Gaoshi South Road Section"],
      ["王子巷段", "Wangzi Lane Section"],
      ["马家园段", "Majiayuan Section"]
    ]
  );
  assert.deepEqual(
    record006.projectInterpretation.components.map(({ nameZh, nameEn }) => [nameZh, nameEn]),
    [
      ["凤凰坡", "Fenghuangpo"],
      ["庵子坡", "Anzipo"],
      ["瓦子坳", "Wazi’ao"]
    ]
  );
  [...record004.projectInterpretation.components, ...record006.projectInterpretation.components]
    .forEach((component) => assert.deepEqual(Object.keys(component).sort(), ["nameEn", "nameZh"]));
});

test("runtime dataset excludes research evidence, rejected coordinates, private fields, and component geometry", () => {
  const forbiddenKeys = [
    "candidateLatitude",
    "candidateLongitude",
    "candidateStatus",
    "evidenceQuoteOrSummary",
    "researchNotes",
    "geometry",
    "coordinates",
    "componentId",
    "adminNotes",
    "nominatorEmail",
    "privateReviewData"
  ];
  forbiddenKeys.forEach((key) => assert.doesNotMatch(datasetBytes, new RegExp(`\"${key}\"`)));
  canonicalDataset.records.forEach((record) => {
    assert.deepEqual(Object.keys(record).sort(), ["coordinateReview", "official", "projectInterpretation", "recordId"]);
  });
});

test("generation is deterministic and committed GeoJSON is byte-for-byte current", () => {
  const first = generateProvincialHeritageGeoJson(canonicalDataset);
  const second = generateProvincialHeritageGeoJson(canonicalDataset);
  const firstBytes = serializeJson(first.geojson);
  assert.equal(firstBytes, serializeJson(second.geojson));
  assert.equal(firstBytes, committedGeoJsonBytes);
  assert.notEqual(`${firstBytes} `, committedGeoJsonBytes);
  assert(committedGeoJsonBytes.endsWith("\n"));
  assert(!committedGeoJsonBytes.endsWith("\n\n"));
});

test("committed GeoJSON is the approved valid empty FeatureCollection", () => {
  assert.deepEqual(committedGeoJson, {
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
  });
});

test("current expected exclusions report every approved record and no hard errors", () => {
  const result = generateProvincialHeritageGeoJson(canonicalDataset);
  assert.deepEqual(result.exclusions.map(({ recordId }) => recordId), EXPECTED_RECORD_IDS);
  assert.equal(result.exclusions.length, 10);
  assert.equal(result.hardErrorCount, 0);
  assert.equal(result.geojson.features.length, 0);
});

test("Low, None, unresolved, withheld, non-renderable, and null-coordinate states are controlled exclusions", () => {
  const lowReasons = getGeometryExclusionReasons(recordById(canonicalDataset, "JX-PCH-7-001"));
  const noneReasons = getGeometryExclusionReasons(recordById(canonicalDataset, "JX-PCH-7-002"));
  assert(lowReasons.includes("low-confidence"));
  assert(lowReasons.includes("withheld-publication"));
  assert(lowReasons.includes("non-renderable"));
  assert(lowReasons.includes("missing-approved-coordinates"));
  assert(noneReasons.includes("none-confidence"));
  assert(noneReasons.includes("unresolved-research"));
  assert(noneReasons.includes("withheld-publication"));
  assert(noneReasons.includes("non-renderable"));
  assert(noneReasons.includes("missing-approved-coordinates"));
});

test("validator rejects duplicate IDs, non-sequential IDs, wrong order, and wrong record count", () => {
  const duplicate = cloneDataset();
  duplicate.records[1].recordId = duplicate.records[0].recordId;
  expectSyntheticError(duplicate, /duplicate record IDs|approved sequential order/);

  const wrongOrder = cloneDataset();
  [wrongOrder.records[0], wrongOrder.records[1]] = [wrongOrder.records[1], wrongOrder.records[0]];
  expectSyntheticError(wrongOrder, /approved sequential order/);

  const missing = cloneDataset();
  missing.records.pop();
  expectSyntheticError(missing, /exactly ten records/);
});

test("validator rejects omitted required nulls and incomplete coordinate pairs", () => {
  const omitted = cloneDataset();
  delete omitted.records[0].coordinateReview.approvedLatitude;
  expectSyntheticError(omitted, /must contain exactly/);

  const incomplete = cloneDataset();
  incomplete.records[0].coordinateReview.approvedLatitude = 27.8;
  expectSyntheticError(incomplete, /incomplete coordinate pair/);
});

test("validator rejects unknown controlled vocabulary values", () => {
  const cases = [
    ["researchStatus", "unknown", /researchStatus is unknown/],
    ["coordinateConfidence", "Unknown", /coordinateConfidence is unknown/],
    ["coordinateMethod", "guessed", /coordinateMethod is unknown/],
    ["sensitivityAssessment", "safe", /sensitivityAssessment is unknown/],
    ["publicationLocationPolicy", "public", /publicationLocationPolicy is unknown/],
    ["coordinateReviewStatus", "verified", /coordinateReviewStatus is unknown/]
  ];
  cases.forEach(([field, value, pattern]) => {
    const dataset = cloneDataset();
    dataset.records[0].coordinateReview[field] = value;
    expectSyntheticError(dataset, pattern);
  });

  const translation = cloneDataset();
  translation.records[0].projectInterpretation.translationStatus = "official";
  expectSyntheticError(translation, /translationStatus is unknown/);
});

test("validator rejects NaN, Infinity, invalid latitude, invalid longitude, and invalid CRS", () => {
  const invalidValues = [
    ["approvedLatitude", Number.NaN, /approvedLatitude must be finite/],
    ["approvedLongitude", Number.POSITIVE_INFINITY, /approvedLongitude must be finite/],
    ["approvedLatitude", 91, /outside -90 to 90/],
    ["approvedLongitude", -181, /outside -180 to 180/]
  ];
  invalidValues.forEach(([field, value, pattern]) => {
    const dataset = makeRenderableDataset();
    dataset.records[0].coordinateReview[field] = value;
    expectSyntheticError(dataset, pattern);
  });

  const invalidCrs = makeRenderableDataset();
  invalidCrs.records[0].coordinateReview.coordinateReferenceSystem = "GCJ-02";
  expectSyntheticError(invalidCrs, /without WGS84/);
});

test("validator rejects Low, None, and unresolved geometry", () => {
  for (const [status, confidence, method] of [
    ["reviewed", "Low", "broad-locality-only"],
    ["reviewed", "None", "unresolved"],
    ["unresolved", "None", "unresolved"]
  ]) {
    const dataset = makeRenderableDataset();
    Object.assign(dataset.records[0].coordinateReview, {
      researchStatus: status,
      coordinateConfidence: confidence,
      coordinateMethod: method
    });
    expectSyntheticError(dataset, /without High or Medium|approved coordinates|unresolved record/);
  }
});

test("validator rejects renderable withheld, restricted, and candidate-less records", () => {
  const withheld = makeRenderableDataset();
  withheld.records[0].coordinateReview.publicationLocationPolicy = "withheld";
  expectSyntheticError(withheld, /publication is withheld/);

  const restricted = makeRenderableDataset();
  restricted.records[0].coordinateReview.sensitivityAssessment = "restricted";
  expectSyntheticError(restricted, /restricted exact coordinate|sensitivity does not permit/);

  const candidateLess = makeRenderableDataset();
  candidateLess.records[0].coordinateReview.selectedCandidateId = null;
  expectSyntheticError(candidateLess, /without selectedCandidateId/);
});

test("validator rejects the documented rejected candidate and forbidden runtime evidence", () => {
  const rejected = makeRenderableDataset({ recordId: "JX-PCH-7-010" });
  rejected.records[9].coordinateReview.selectedCandidateId = "JX-PCH-7-010-C01";
  expectSyntheticError(rejected, /rejected Phase 14C candidate/);

  const evidence = cloneDataset();
  evidence.records[0].coordinateReview.researchNotes = "Do not publish.";
  expectSyntheticError(evidence, /must contain exactly|forbidden in runtime data/);
});

test("records 004 and 006 cannot become Point features", () => {
  for (const recordId of ["JX-PCH-7-004", "JX-PCH-7-006"]) {
    const dataset = makeRenderableDataset({ recordId });
    expectSyntheticError(dataset, /cannot become a Point/);
  }
});

test("synthetic valid High exact record generates one exact Point", () => {
  const dataset = makeRenderableDataset({
    confidence: "High",
    publicationPolicy: "exact",
    latitude: 27.812345,
    longitude: 114.912345
  });
  const result = generateSynthetic(dataset);
  assert.equal(result.geojson.features.length, 1);
  const feature = result.geojson.features[0];
  const review = dataset.records[0].coordinateReview;
  assert.equal(feature.id, "JX-PCH-7-001");
  assert.equal(feature.properties.recordId, feature.id);
  assert.equal(feature.properties.approximateLocation, false);
  assert.deepEqual(feature.geometry, {
    type: "Point",
    coordinates: [review.approvedLongitude, review.approvedLatitude]
  });
  assert.equal(Object.hasOwn(feature.properties, "approvedLatitude"), false);
  assert.equal(Object.hasOwn(feature.properties, "approvedLongitude"), false);
});

test("synthetic valid Medium approximate record generates one approximate Point", () => {
  const dataset = makeRenderableDataset({
    confidence: "Medium",
    publicationPolicy: "approximate",
    latitude: 28.1234,
    longitude: 117.2345
  });
  const result = generateSynthetic(dataset);
  assert.equal(result.geojson.features.length, 1);
  const feature = result.geojson.features[0];
  assert.equal(feature.properties.coordinateConfidence, "Medium");
  assert.equal(feature.properties.approximateLocation, true);
  assert.deepEqual(feature.geometry.coordinates, [117.2345, 28.1234]);
});

test("synthetic generalized Point is explicitly approximate", () => {
  const dataset = makeRenderableDataset({
    confidence: "High",
    publicationPolicy: "generalized",
    sensitivityAssessment: "public-generalized-only"
  });
  const result = generateSynthetic(dataset);
  assert.equal(result.geojson.features[0].properties.approximateLocation, true);
});

test("generated feature IDs cannot duplicate", () => {
  const dataset = cloneDataset();
  dataset.records[1].recordId = dataset.records[0].recordId;
  assert.throws(
    () => generateSynthetic(dataset),
    (error) => error instanceof ProvincialHeritageValidationError
      && /duplicate record IDs/.test(error.message)
  );
});

test("generation cannot bypass dataset validation", () => {
  const dataset = makeRenderableDataset();
  dataset.records[0].coordinateReview.publicationLocationPolicy = "invented";
  assert.throws(
    () => generateSynthetic(dataset),
    (error) => error instanceof ProvincialHeritageValidationError
      && /publicationLocationPolicy is unknown/.test(error.message)
  );
});
