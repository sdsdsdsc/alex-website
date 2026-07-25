import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  OfficialProtectedHeritagePublicationError,
  generateOfficialProtectedHeritageMap,
  serializeJson
} from "../scripts/lib/official-protected-heritage-publication.mjs";

const readJson = (path) => readFile(new URL(path, import.meta.url), "utf8").then(JSON.parse);
const [phase14, xinyu, locations, committedGeoJson] = await Promise.all([
  readJson("../data/jiangxi-provincial-heritage-pilot.json"),
  readJson("../data/xinyu-provincial-heritage-marker-pilot.json"),
  readJson("../data/official-protected-heritage-public-locations.json"),
  readJson("../data/jiangxi-provincial-protected-heritage-map.geojson").catch(() => null)
]);

const clone = (value) => structuredClone(value);
const generate = (overrides = {}) => generateOfficialProtectedHeritageMap({
  phase14Dataset: overrides.phase14 || clone(phase14),
  xinyuDataset: overrides.xinyu || clone(xinyu),
  publicLocationDataset: overrides.locations || clone(locations)
});
const expectInvalid = (mutate, pattern) => {
  const inputs = { phase14: clone(phase14), xinyu: clone(xinyu), locations: clone(locations) };
  mutate(inputs);
  assert.throws(
    () => generate(inputs),
    (error) => error instanceof OfficialProtectedHeritagePublicationError && pattern.test(error.message)
  );
};

test("aggregate joins eleven records and publishes one reviewed marker", () => {
  const result = generate();
  assert.equal(result.geojson.metadata.sourceRecordCount, 11);
  assert.equal(result.geojson.metadata.featureCount, 1);
  assert.equal(result.geojson.metadata.excludedRecordCount, 10);
  assert.equal(result.exclusions.length, 10);
  assert.deepEqual(result.geojson.features.map(({ id }) => id), ["JX-XY-PCH-001"]);
});

test("published Xinyu point is WGS84 and carries project provenance", () => {
  const feature = generate().geojson.features[0];
  assert.deepEqual(feature.geometry.coordinates, [114.937042, 27.798123]);
  assert.equal(feature.properties.coordinateReferenceSystem, "WGS84");
  assert.equal(feature.properties.markerClass, "reviewed");
  assert.equal(feature.properties.publicLocationMeaning, "heritage-compound-centre");
  assert.match(feature.properties.projectLocationProvenance, /reviewed public-location decision/);
});

test("official sequence remains distinct from a designation number", () => {
  assert.equal(xinyu.records[0].sourceSequence, 9);
  assert.equal(xinyu.records[0].official.officialDesignationNumber, null);
});

test("committed aggregate is deterministic", { skip: !committedGeoJson }, () => {
  assert.equal(serializeJson(generate().geojson), serializeJson(committedGeoJson));
});

test("rejects a cross-dataset ID collision before joining", () => {
  expectInvalid(({ xinyu: value }) => {
    value.records[0].recordId = phase14.records[0].recordId;
  }, /not a stable Xinyu pilot ID|Cross-dataset duplicate record ID/);
});

test("rejects an unknown official record decision", () => {
  expectInvalid(({ locations: value }) => {
    value.decisions[0].recordId = "JX-XY-PCH-999";
  }, /does not reference an official record/);
});

test("rejects low identity or location evidence", () => {
  expectInvalid(({ locations: value }) => {
    value.decisions[0].identityConfidence = "probable";
    value.decisions[0].locationEvidenceConfidence = "Low";
  }, /confirmed identity|High or Medium display-location evidence/);
});

test("rejects coordinates without WGS84", () => {
  expectInvalid(({ locations: value }) => {
    value.decisions[0].coordinateReferenceSystem = "GCJ-02";
  }, /must be WGS84/);
});

test("rejects provider-only spatial evidence", () => {
  expectInvalid(({ locations: value }) => {
    value.decisions[0].projectLocationSources = value.decisions[0].projectLocationSources
      .filter(({ sourceType }) => !["institutional-description", "open-map-geometry"].includes(sourceType));
  }, /independent institutional confirmation|spatial evidence beyond/);
});

test("rejects unreviewed publication decisions", () => {
  expectInvalid(({ locations: value }) => {
    value.decisions[0].reviewStatus = "draft";
  }, /reviewStatus must be approved/);
});

test("rejects misleading reviewed-point meanings", () => {
  expectInvalid(({ locations: value }) => {
    value.decisions[0].publicLocationMeaning = "official-locality-centre";
  }, /contradicts displayLocationType/);
});

test("generalized markers require a radius and compatible labels", () => {
  expectInvalid(({ locations: value }) => {
    const decision = value.decisions[0];
    decision.displayLocationType = "generalized-locality";
    decision.locationPrecision = "generalized";
    decision.publicLocationMeaning = "official-locality-centre";
    decision.publicationLocationPolicy = "generalized";
    decision.sensitivityAssessment = "public-generalized-only";
  }, /generalizationRadiusMeters is required/);
});

test("deterministic aggregate supports mixed reviewed and generalized marker classes", () => {
  const xinyuValue = clone(xinyu);
  const generalizedRecord = clone(xinyuValue.records[0]);
  generalizedRecord.recordId = "JX-XY-PCH-002";
  generalizedRecord.sourceSequence = 5;
  generalizedRecord.official.officialNameZh = "测试总表记录";
  generalizedRecord.projectInterpretation.projectNameEn = "Test Generalized Record";
  xinyuValue.records.push(generalizedRecord);

  const locationValue = clone(locations);
  const generalizedDecision = clone(locationValue.decisions[0]);
  generalizedDecision.recordId = generalizedRecord.recordId;
  generalizedDecision.siteLocationConfidence = "Low";
  generalizedDecision.displayLocationType = "generalized-locality";
  generalizedDecision.locationPrecision = "generalized";
  generalizedDecision.publicLocationMeaning = "official-locality-centre";
  generalizedDecision.publicationLocationPolicy = "generalized";
  generalizedDecision.sensitivityAssessment = "public-generalized-only";
  generalizedDecision.generalizationRadiusMeters = 1500;
  locationValue.decisions.push(generalizedDecision);

  const result = generate({ xinyu: xinyuValue, locations: locationValue });
  assert.deepEqual(result.geojson.features.map(({ properties }) => properties.markerClass), ["reviewed", "generalized"]);
  assert.equal(result.geojson.metadata.sourceRecordCount, 12);
  assert.equal(result.geojson.metadata.featureCount, 2);
});

test("Phase 14 multi-component parents cannot become Point features", () => {
  expectInvalid(({ locations: value }) => {
    const decision = clone(value.decisions[0]);
    decision.recordId = "JX-PCH-7-004";
    decision.sourceDatasetId = "jiangxi-provincial-protected-heritage-pilot";
    value.decisions.push(decision);
  }, /parent Point for a protected multi-component record/);
});

test("the public feature excludes candidate and research internals", () => {
  const text = JSON.stringify(generate().geojson);
  ["originalProviderCoordinate", "projectLocationSources", "locationEvidenceSummary", "reviewedBy"].forEach((field) => {
    assert.equal(text.includes(field), false);
  });
});
