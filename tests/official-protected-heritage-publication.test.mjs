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

const expandedIds = [
  "JX-XY-PCH-008",
  "JX-XY-PCH-009",
  "JX-XY-PCH-014",
  "JX-XY-PCH-016"
];
const publishedIds = [
  "JX-XY-PCH-001",
  ...expandedIds
];

test("aggregate joins fifteen records and publishes five reviewed markers", () => {
  const result = generate();
  assert.equal(result.geojson.metadata.sourceRecordCount, 15);
  assert.equal(result.geojson.metadata.featureCount, 5);
  assert.equal(result.geojson.metadata.excludedRecordCount, 10);
  assert.equal(result.exclusions.length, 10);
  assert.deepEqual(result.geojson.features.map(({ id }) => id), publishedIds);
});

test("all four added source records preserve the official register facts", () => {
  const records = new Map(xinyu.records.map((record) => [record.recordId, record]));
  assert.deepEqual(
    expandedIds.map((id) => {
      const record = records.get(id);
      return [
        id,
        record.sourceSequence,
        record.official.officialNameZh,
        record.official.officialCategoryZh,
        record.official.officialLocationTextZh,
        record.official.protectionLevelZh,
        record.official.officialDesignationNumber
      ];
    }),
    [
      ["JX-XY-PCH-008", 7, "昼锦堂", "古建筑", "仙女湖区观巢镇汉泉村", "省级文物保护单位", null],
      ["JX-XY-PCH-009", 8, "蓉泉桥", "古建筑", "渝水区水北镇排江村", "省级文物保护单位", null],
      ["JX-XY-PCH-014", 14, "傅抱石故居", "近现代重要史迹", "渝水区罗坊镇章塘村", "省级文物保护单位", null],
      ["JX-XY-PCH-016", 16, "上海劳动妇女战地服务团旧址", "近现代重要史迹", "渝水区珠珊镇沙头村", "省级文物保护单位", null]
    ]
  );
});

test("all four added location decisions retain provider CRS, POI identity, and deterministic conversion documentation", () => {
  const decisions = new Map(locations.decisions.map((decision) => [decision.recordId, decision]));
  assert.deepEqual(
    expandedIds.map((id) => {
      const decision = decisions.get(id);
      return [
        id,
        decision.originalProviderCoordinate.coordinateReferenceSystem,
        decision.originalProviderCoordinate.providerUrl.split("/").at(-1),
        decision.estimatedUncertaintyMeters,
        decision.displayLocationType,
        decision.publicLocationMeaning
      ];
    }),
    [
      ["JX-XY-PCH-008", "GCJ-02", "B0IRN5X33Z", 125, "visitor-reference-point", "visitor-reference"],
      ["JX-XY-PCH-009", "GCJ-02", "B0JU95B3WN", 75, "site-point", "heritage-feature"],
      ["JX-XY-PCH-014", "GCJ-02", "B0FFJ6C27Y", 100, "visitor-reference-point", "visitor-reference"],
      ["JX-XY-PCH-016", "GCJ-02", "B0IATLWGUH", 100, "visitor-reference-point", "visitor-reference"]
    ]
  );
  expandedIds.forEach((id) => {
    const method = decisions.get(id).transformationOrReconciliationMethod;
    assert.match(method, /iterative inverse GCJ-02 transform/);
    assert.match(method, /a=6378245\.0/);
    assert.match(method, /ee=0\.00669342162296594323/);
    assert.match(method, /ten/);
  });
  const shanghai = decisions.get("JX-XY-PCH-016");
  assert.deepEqual(
    [shanghai.originalProviderCoordinate.longitude, shanghai.originalProviderCoordinate.latitude],
    [114.977746, 27.770564]
  );
  assert.match(shanghai.transformationOrReconciliationMethod, /114\.978214, 27\.769586 GCJ-02/);
});

test("published Xinyu points are WGS84 and carry project provenance", () => {
  const features = new Map(generate().geojson.features.map((feature) => [feature.id, feature]));
  assert.deepEqual(
    publishedIds.map((id) => features.get(id).geometry.coordinates),
    [
      [114.937042, 27.798123],
      [114.840705, 27.854836],
      [115.047377, 28.074011],
      [115.09312, 27.911966],
      [114.97278, 27.773914]
    ]
  );
  publishedIds.forEach((id) => {
    const feature = features.get(id);
    assert.equal(feature.properties.coordinateReferenceSystem, "WGS84");
    assert.equal(feature.properties.markerClass, "reviewed");
    assert.match(feature.properties.projectLocationProvenance, /reviewed public-location decision/);
  });
  assert.equal(features.get("JX-XY-PCH-009").properties.publicLocationMeaning, "heritage-feature");
  ["JX-XY-PCH-008", "JX-XY-PCH-014", "JX-XY-PCH-016"].forEach((id) => {
    assert.equal(features.get(id).properties.publicLocationMeaning, "visitor-reference");
  });
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
  assert.deepEqual(
    result.geojson.features.map(({ properties }) => properties.markerClass),
    ["reviewed", "generalized", "reviewed", "reviewed", "reviewed", "reviewed"]
  );
  assert.equal(result.geojson.metadata.sourceRecordCount, 16);
  assert.equal(result.geojson.metadata.featureCount, 6);
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
  assert.equal(text.includes("114.978214"), false);
  assert.equal(text.includes("27.769586"), false);
});
