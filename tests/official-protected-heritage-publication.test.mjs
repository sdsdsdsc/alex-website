import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  OfficialProtectedHeritagePublicationError,
  AGGREGATE_SCHEMA_VERSION,
  generateOfficialProtectedHeritageMap,
  serializeJson,
  validateGeneratedFeatureGeometry
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
const xiabuId = "JX-XY-PCH-018";
const n07Id = "JX-XY-NCH-007";
const publishedIds = [
  n07Id,
  "JX-XY-PCH-001",
  ...expandedIds,
  xiabuId
];

test("aggregate joins seventeen records and publishes seven reviewed Points", () => {
  const result = generate();
  assert.equal(AGGREGATE_SCHEMA_VERSION, "2.0.0");
  assert.equal(result.geojson.metadata.sourceRecordCount, 17);
  assert.equal(result.geojson.metadata.featureCount, 7);
  assert.equal(result.geojson.metadata.excludedRecordCount, 10);
  assert.equal(result.exclusions.length, 10);
  assert.equal(result.hardErrorCount, 0);
  assert.equal(result.geojson.metadata.generationStatus, "valid");
  assert.deepEqual(result.geojson.features.map(({ id }) => id), publishedIds);
});

test("publishes the approved N07 provider-located project-reviewed Point", () => {
  const record = xinyu.records.find(({ recordId }) => recordId === n07Id);
  const decision = locations.decisions.find(({ recordId }) => recordId === n07Id);
  const feature = generate().geojson.features.find(({ id }) => id === n07Id);

  assert.deepEqual(
    [
      record.sourceSequence,
      record.official.officialNameZh,
      record.official.officialCategoryZh,
      record.official.officialLocationTextZh,
      record.official.protectionLevelZh,
      record.official.officialDesignationNumber,
      record.official.designationBatch
    ],
    [
      4,
      "水西红三军团指挥部旧址",
      "近现代重要史迹",
      "高新区水西镇沙陂村",
      "全国重点文物保护单位",
      "8-0617-5-101",
      "第八批全国重点文物保护单位"
    ]
  );
  assert.deepEqual(feature.geometry, { type: "Point", coordinates: [115.011333, 27.805882] });
  assert.equal(decision.estimatedUncertaintyMeters, 100);
  assert.equal(feature.properties.geometryMeaning, "provider-located-project-reviewed-reference-point");
  assert.equal(feature.properties.representationStatus, "project-reviewed-interpretation");
  assert.equal(feature.properties.geometrySourceType, "project-reviewed-digitization");
  assert.equal(feature.properties.geometryPrecision, "approximate");
  assert.equal(feature.properties.horizontalUncertaintyMetres, 100);
  assert.match(feature.properties.publicLocationNote, /not an authority-supplied coordinate/);
  assert.match(feature.properties.publicLocationNote, /building footprint/);
  assert.match(feature.properties.publicLocationNote, /legal protection boundary/);
  assert.match(feature.properties.publicLocationNote, /guaranteed visitor entrance/);
});

test("N07 preserves the documented coordinate construction and provider reconciliation", () => {
  const decision = locations.decisions.find(({ recordId }) => recordId === n07Id);
  assert.deepEqual(
    [
      decision.originalProviderCoordinate.longitude,
      decision.originalProviderCoordinate.latitude,
      decision.originalProviderCoordinate.coordinateReferenceSystem
    ],
    [115.016436, 27.802641, "GCJ-02"]
  );
  [
    /B0IDTHR05Y/,
    /115\.01133320220836, 27\.805881566984727/,
    /ten forward-residual correction iterations/,
    /Baidu identity\/locality\/building evidence/,
    /100-metre uncertainty/
  ].forEach((pattern) => assert.match(decision.transformationOrReconciliationMethod, pattern));
});

test("publishes only the approved Xiabu uprising-site component", () => {
  const record = xinyu.records.find(({ recordId }) => recordId === xiabuId);
  const decision = locations.decisions.find(({ recordId }) => recordId === xiabuId);
  const feature = generate().geojson.features.find(({ id }) => id === xiabuId);

  assert.deepEqual(
    [
      record.sourceSequence,
      record.official.officialNameZh,
      record.official.officialCategoryZh,
      record.official.officialLocationTextZh,
      record.official.officialDesignationNumber,
      record.official.designationBatch,
      record.official.periodZh
    ],
    [18, "下保农民暴动旧址——暴动举行地旧址", "近现代重要史迹", "渝水区良山镇下保村", "6-5-321", "第六批江西省文物保护单位", "1929"]
  );
  assert.deepEqual(feature.geometry, { type: "Point", coordinates: [114.99557, 27.66762] });
  assert.equal(decision.displayLocationType, "component-reference-point");
  assert.equal(decision.publicLocationMeaning, "component-reference");
  assert.equal(decision.estimatedUncertaintyMeters, 150);
  assert.match(decision.publicLocationNote, /暴动会议地旧址/);
  assert.match(decision.publicLocationNote, /footprint|building footprint/);
  assert.match(decision.publicLocationNote, /official\/legal boundary/);

  const serialized = JSON.stringify({ xinyu, locations, feature });
  assert.equal(serialized.includes("JX-XY-PCH-019"), false);
  assert.equal(serialized.includes("下保农民暴动旧址——暴动会议地旧址"), false);
  assert.equal(serialized.includes("谢蔚明烈士墓"), false);
});

test("Xiabu preserves deterministic provider conversion and selection evidence", () => {
  const decision = locations.decisions.find(({ recordId }) => recordId === xiabuId);
  assert.deepEqual(
    [
      decision.originalProviderCoordinate.longitude,
      decision.originalProviderCoordinate.latitude,
      decision.originalProviderCoordinate.coordinateReferenceSystem
    ],
    [115.007145335, 27.670165011, "BD-09"]
  );
  [
    /ba0c8d3a43ce938b13293507/,
    /12802676\.16, 3187429\.36/,
    /115\.000605641, 27\.664348519/,
    /114\.995569672, 27\.667620470/,
    /B0L1RCC3EM/,
    /114\.994632317, 27\.668364844/,
    /124\.0 metres apart/,
    /selected, not averaged/
  ].forEach((pattern) => assert.match(decision.transformationOrReconciliationMethod, pattern));
});

test("current generated Points pass the shared geometry foundation with explicit N07 metadata only", () => {
  const features = generate().geojson.features;
  features.forEach((feature, index) => {
    assert.deepEqual(validateGeneratedFeatureGeometry(feature, `features[${index}]`), []);
    assert.equal(feature.geometry.type, "Point");
    const explicit = feature.id === n07Id;
    assert.equal(Object.hasOwn(feature.properties, "geometryMeaning"), explicit);
    assert.equal(Object.hasOwn(feature.properties, "geometrySourceType"), explicit);
    assert.equal(Object.hasOwn(feature.properties, "geometryPrecision"), explicit);
    assert.equal(Object.hasOwn(feature.properties, "horizontalUncertaintyMetres"), explicit);
  });
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
      [115.011333, 27.805882],
      [114.937042, 27.798123],
      [114.840705, 27.854836],
      [115.047377, 28.074011],
      [115.09312, 27.911966],
      [114.97278, 27.773914],
      [114.99557, 27.66762]
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
  assert.equal(features.get(xiabuId).properties.publicLocationMeaning, "component-reference");
  assert.equal(features.get(n07Id).properties.publicLocationMeaning, "heritage-feature");
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
    ["reviewed", "reviewed", "generalized", "reviewed", "reviewed", "reviewed", "reviewed", "reviewed"]
  );
  assert.equal(result.geojson.metadata.sourceRecordCount, 18);
  assert.equal(result.geojson.metadata.featureCount, 8);
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
