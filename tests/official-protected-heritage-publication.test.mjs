import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  OfficialProtectedHeritagePublicationError,
  AGGREGATE_SCHEMA_VERSION,
  buildOfficialProtectedHeritageFeature,
  generateOfficialProtectedHeritageMap,
  generateProvincialCompatibilityMap,
  serializeJson,
  validateGeneratedFeatureGeometry,
  validatePublicLocationDataset,
  validateProvincialCompatibilityDataset
} from "../scripts/lib/official-protected-heritage-publication.mjs";
import { makeSyntheticGeneralizedPointContract } from "./fixtures/generalized-point-contract.mjs";

const readJson = (path) => readFile(new URL(path, import.meta.url), "utf8").then(JSON.parse);
const [phase14, xinyu, legacyXinyu, locations, committedGeoJson, committedLegacyGeoJson] = await Promise.all([
  readJson("../data/jiangxi-provincial-heritage-pilot.json"),
  readJson("../data/xinyu-official-heritage-records.json"),
  readJson("../data/xinyu-provincial-heritage-marker-pilot.json"),
  readJson("../data/official-protected-heritage-public-locations.json"),
  readJson("../data/jiangxi-official-protected-heritage-map.geojson").catch(() => null),
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
const generateLegacy = (overrides = {}) => generateProvincialCompatibilityMap({
  phase14Dataset: overrides.phase14 || clone(phase14),
  legacyProvincialDataset: overrides.legacyXinyu || clone(legacyXinyu),
  publicLocationDataset: overrides.locations || clone(locations)
});

function makeSyntheticGeneralizedInputs() {
  const recordId = "JX-TEST-PCH-001";
  const sourceDatasetId = "synthetic-non-xinyu-official-records";
  const generalizedRecord = {
    sourceDatasetId,
    sourcePath: "tests/fixtures/synthetic-non-xinyu.json",
    official: {
      officialNameZh: "合成非新余测试遗产",
      protectionLevelZh: "省级文物保护单位",
      officialCategoryZh: "古遗址",
      officialLocationTextZh: "合成测试地点"
    },
    projectInterpretation: {
      projectNameEn: "Synthetic Non-Xinyu Generalized Point"
    },
    officialSource: {
      sourceTitleZh: "合成官方记录",
      sourceIssuerZh: "合成测试机构",
      sourceUrl: "https://example.gov.cn/synthetic-official-record",
      sourceAccessedDate: "2026-08-04"
    }
  };

  const generalizedDecision = clone(locations.decisions[0]);
  generalizedDecision.recordId = recordId;
  generalizedDecision.sourceDatasetId = sourceDatasetId;
  generalizedDecision.siteLocationConfidence = "Low";
  generalizedDecision.displayLocationType = "generalized-locality";
  generalizedDecision.locationPrecision = "generalized";
  generalizedDecision.publicLocationMeaning = "official-locality-centre";
  generalizedDecision.publicationLocationPolicy = "generalized";
  generalizedDecision.sensitivityAssessment = "public-generalized-only";
  generalizedDecision.latitude = 27.6202;
  generalizedDecision.longitude = 113.8825;
  generalizedDecision.estimatedUncertaintyMeters = 40;
  generalizedDecision.generalizationRadiusMeters = 40;
  generalizedDecision.geometryMeaning = "generalized-reference-point";
  generalizedDecision.representationStatus = "project-reviewed-interpretation";
  generalizedDecision.generalizedPointContract = makeSyntheticGeneralizedPointContract({
    identityId: recordId
  });
  generalizedDecision.publicLocationNote = "Synthetic project Generalized reference location; not an exact feature, centre, entrance, extent, or boundary.";
  generalizedDecision.locationEvidenceSummary = "Synthetic bounded-support evidence for contract testing only.";
  generalizedDecision.projectLocationSources = [
    {
      sourceId: "SYN-S01",
      sourceType: "official-record",
      sourceTitle: "Synthetic official identity source",
      sourcePublisher: "Synthetic authority",
      sourceUrl: "https://example.gov.cn/synthetic-official-record",
      sourceAccessedDate: "2026-08-04",
      supports: ["official-identity", "official-locality"]
    },
    {
      sourceId: "SYN-S02",
      sourceType: "institutional-description",
      sourceTitle: "Synthetic institutional description",
      sourcePublisher: "Synthetic institution",
      sourceUrl: "https://example.gov.cn/synthetic-institutional-description",
      sourceAccessedDate: "2026-08-04",
      supports: ["independent-identity", "compound-description"]
    },
    {
      sourceId: "SYN-S03",
      sourceType: "official-map",
      sourceTitle: "Synthetic bounded support map",
      sourcePublisher: "Synthetic authority",
      sourceUrl: "https://example.gov.cn/synthetic-support-map",
      sourceAccessedDate: "2026-08-04",
      supports: ["locality-match", "wgs84-reference"]
    }
  ];
  generalizedDecision.originalProviderCoordinate = null;
  generalizedDecision.transformationOrReconciliationMethod = "Synthetic deterministic two-path envelope and predeclared representative selection.";
  const locationValue = {
    ...clone(locations),
    decisions: [generalizedDecision]
  };
  const recordIndex = new Map([[recordId, generalizedRecord]]);
  return { locationValue, recordIndex, generalizedRecord, generalizedDecision };
}

const expandedIds = [
  "JX-XY-PCH-008",
  "JX-XY-PCH-009",
  "JX-XY-PCH-014",
  "JX-XY-PCH-016"
];
const xiabuId = "JX-XY-PCH-018";
const xieliId = "JX-XY-PCH-004";
const n07Id = "JX-XY-NCH-007";
const publishedIds = [
  n07Id,
  "JX-XY-PCH-001",
  xieliId,
  ...expandedIds,
  xiabuId
];

test("aggregate joins eighteen records and publishes seven ordinary Points plus Xieli", () => {
  const result = generate();
  assert.equal(AGGREGATE_SCHEMA_VERSION, "2.0.0");
  assert.equal(result.geojson.metadata.sourceRecordCount, 18);
  assert.equal(result.geojson.metadata.featureCount, 8);
  assert.equal(result.geojson.metadata.excludedRecordCount, 10);
  assert.equal(result.exclusions.length, 10);
  assert.equal(result.hardErrorCount, 0);
  assert.equal(result.geojson.metadata.generationStatus, "valid");
  assert.deepEqual(result.geojson.features.map(({ id }) => id), publishedIds);
});

test("authority-neutral source and aggregate preserve one national and seven provincial records", () => {
  assert.equal(xinyu.datasetId, "xinyu-official-heritage-records");
  assert.equal(xinyu.dataLayer, "official-heritage-records");
  assert.equal(Object.hasOwn(xinyu, "protectionLevelCode"), false);
  const features = generate().geojson.features;
  const levels = features.map(({ properties }) => properties.protectionLevelZh);
  assert.equal(levels.filter((value) => value === "全国重点文物保护单位").length, 1);
  assert.equal(levels.filter((value) => value === "省级文物保护单位").length, 7);
  assert.equal(features.find(({ id }) => id === n07Id).properties.protectionLevelZh, "全国重点文物保护单位");
  assert.equal(features.find(({ id }) => id === xiabuId).properties.protectionLevelZh, "省级文物保护单位");
  assert.equal(features.filter(({ properties }) => properties.officialCategoryZh === "古建筑").length, 3);
  assert.equal(features.filter(({ properties }) => properties.officialCategoryZh === "近现代重要史迹").length, 4);
  assert.equal(features.filter(({ properties }) => properties.officialCategoryZh === "古遗址").length, 1);
  assert.equal(locations.decisions.every(({ sourceDatasetId }) => (
    sourceDatasetId === "xinyu-official-heritage-records"
  )), true);
});

test("missing, unknown, and contradictory official designation levels fail validation", () => {
  expectInvalid(({ xinyu: value }) => {
    delete value.records[0].official.protectionLevelZh;
  }, /protectionLevelZh/);
  expectInvalid(({ xinyu: value }) => {
    value.records[0].official.protectionLevelZh = "县级文物保护单位";
  }, /controlled national, provincial, or municipal/);
  expectInvalid(({ xinyu: value }) => {
    value.records.find(({ recordId }) => recordId === n07Id).official.protectionLevelZh = "省级文物保护单位";
  }, /contradicts the record ID authority level/);
});

test("legacy provincial source and public URL remain provincial-only compatibility outputs", () => {
  const validation = validateProvincialCompatibilityDataset(clone(legacyXinyu));
  assert.equal(validation.valid, true);
  assert.equal(validation.recordCount, 7);
  assert.equal(legacyXinyu.records.every(({ official }) => (
    official.protectionLevelZh === "省级文物保护单位"
  )), true);
  const result = generateLegacy();
  assert.equal(result.geojson.metadata.datasetId, "jiangxi-provincial-protected-heritage-map");
  assert.equal(result.geojson.metadata.compatibilityStatus, "provincial-only-legacy-public-url");
  assert.equal(result.geojson.metadata.canonicalCombinedDataset, "data/jiangxi-official-protected-heritage-map.geojson");
  assert.equal(result.geojson.features.length, 7);
  assert.equal(result.geojson.features.some(({ id }) => id === n07Id), false);
  assert.equal(result.geojson.features.every(({ properties }) => (
    properties.protectionLevelZh === "省级文物保护单位"
  )), true);
  assert.equal(serializeJson(result.geojson), serializeJson(committedLegacyGeoJson));
});

test("provincial compatibility input rejects national and municipal records", () => {
  ["全国重点文物保护单位", "市级文物保护单位"].forEach((level) => {
    const value = clone(legacyXinyu);
    value.records[0].official.protectionLevelZh = level;
    const result = validateProvincialCompatibilityDataset(value);
    assert.equal(result.valid, false);
    assert.match(result.errors.join("\n"), /must contain only provincial records/);
  });
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

test("current generated Points pass the shared geometry foundation with explicit N07 and Xieli metadata", () => {
  const features = generate().geojson.features;
  features.forEach((feature, index) => {
    assert.deepEqual(validateGeneratedFeatureGeometry(feature, `features[${index}]`), []);
    assert.equal(feature.geometry.type, "Point");
    const explicit = [n07Id, xieliId].includes(feature.id);
    assert.equal(Object.hasOwn(feature.properties, "geometryMeaning"), explicit);
    assert.equal(Object.hasOwn(feature.properties, "geometrySourceType"), explicit);
    assert.equal(Object.hasOwn(feature.properties, "geometryPrecision"), explicit);
    assert.equal(Object.hasOwn(feature.properties, "horizontalUncertaintyMetres"), explicit);
  });
});

test("publishes Xieli as the sole Generalized Point under the approved structured contract", () => {
  const record = xinyu.records.find(({ recordId }) => recordId === xieliId);
  const decision = locations.decisions.find(({ recordId }) => recordId === xieliId);
  const feature = generate().geojson.features.find(({ id }) => id === xieliId);
  const contract = decision.generalizedPointContract;

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
    [3, "斜里遗址", "古遗址", "渝水区珠珊镇洋津村", "省级文物保护单位", "6-1-040", "第六批江西省文物保护单位"]
  );
  assert.deepEqual(feature.geometry, { type: "Point", coordinates: [114.9198, 27.7626] });
  assert.equal(decision.displayLocationType, "generalized-area-reference");
  assert.equal(decision.publicLocationMeaning, "representative-area");
  assert.equal(decision.originalProviderCoordinate, null);
  assert.equal(feature.properties.markerClass, "generalized");
  assert.equal(feature.properties.geometryMeaning, "generalized-reference-point");
  assert.equal(feature.properties.geometrySourceType, "project-generalized-reference");
  assert.equal(feature.properties.geometryPrecision, "generalized");
  assert.equal(feature.properties.horizontalUncertaintyMetres, 50);
  assert.equal(feature.properties.estimatedUncertaintyMeters, 50);
  assert.equal(feature.properties.generalizationRadiusMeters, 50);
  assert.equal(contract.originalSpatialBasis.sourceNotation.includes("27°45′45.3″ N, 114°55′11.2″ E"), true);
  assert.deepEqual(contract.datumInterpretations.map(({ datum }) => datum), ["WGS84", "CGCS2000"]);
  assert.equal(contract.sourceCoordinatePrecision.metres, 2.07);
  assert.equal(contract.multiInterpretationEnvelope.maximumSeparationMetres, 1);
  assert.equal(contract.supportArea.maximumDistanceFromRepresentativeMetres, 42.43);
  assert.equal(contract.intentionalGeneralization.displacementMetres, 2.87);
  assert.equal(contract.displayedCoordinatePrecision.decimalPlaces, 4);
  assert.equal(contract.outwardCoverageMetres, 50);
  assert.equal(contract.review.publicationDecision, "approved-for-publication");
  assert.equal(contract.representation.identityId, xieliId);
  assert.equal(contract.representation.status, "active");
  assert.deepEqual(contract.representation.supersedesRepresentationIds, []);
  assert.match(contract.mandatoryPublicLimitation, /does not show the exact feature/);
  assert.match(contract.candidateSpecificLimitation, /neither an excavation, grave, entrance/);
  assert.deepEqual(feature.properties.generalizedPointContract, contract);
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
      [114.9198, 27.7626],
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
    assert.equal(feature.properties.markerClass, id === xieliId ? "generalized" : "reviewed");
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
  }, /not a stable Xinyu official ID|Cross-dataset duplicate record ID/);
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

test("the deterministic generator path emits a complete synthetic non-Xinyu Generalized Point", () => {
  const { locationValue, recordIndex, generalizedRecord, generalizedDecision } = makeSyntheticGeneralizedInputs();
  const decisionValidation = validatePublicLocationDataset(locationValue, recordIndex);
  assert.equal(decisionValidation.valid, true, decisionValidation.errors.join("; "));
  const feature = buildOfficialProtectedHeritageFeature(
    generalizedDecision.recordId,
    generalizedRecord,
    generalizedDecision
  );
  assert.deepEqual(feature.geometry, { type: "Point", coordinates: [113.8825, 27.6202] });
  assert.equal(feature.properties.markerClass, "generalized");
  assert.equal(feature.properties.geometryMeaning, "generalized-reference-point");
  assert.equal(feature.properties.geometrySourceType, "project-generalized-reference");
  assert.equal(feature.properties.geometryPrecision, "generalized");
  assert.equal(feature.properties.horizontalUncertaintyMetres, 40);
  assert.deepEqual(feature.properties.generalizedPointContract, generalizedDecision.generalizedPointContract);
  assert.equal(feature.properties.generalizedPointContract.representation.status, "active");
  assert.equal(feature.properties.generalizedPointContract.mandatoryPublicLimitation.includes("exact feature"), true);
  assert.deepEqual(validateGeneratedFeatureGeometry(feature, "syntheticFeature"), []);
  const second = buildOfficialProtectedHeritageFeature(generalizedDecision.recordId, generalizedRecord, generalizedDecision);
  assert.equal(serializeJson(feature), serializeJson(second));
});

test("Generalized Point decisions reject semantic, summary, precision, review, and representation contradictions", () => {
  const cases = [
    [decision => { decision.geometryMeaning = "approximate-site-point"; }, /geometryMeaning must be generalized-reference-point/],
    [decision => { decision.estimatedUncertaintyMeters = 41; }, /estimatedUncertaintyMeters must equal/],
    [decision => { decision.generalizationRadiusMeters = 41; }, /generalizationRadiusMeters must equal/],
    [decision => { decision.longitude = 113.88251; }, /coordinates are sharper/],
    [decision => { decision.generalizedPointContract.review.publicationDecision = "research-recommendation"; }, /publicationDecision is unsupported/],
    [decision => { decision.publicLocationNote = "This marker shows the exact feature."; }, /publicLocationNote must not claim an exact feature/],
    [decision => { decision.generalizedPointContract.representation.identityId = "JX-TEST-PCH-999"; }, /identityId must match recordId/],
    [decision => { delete decision.generalizedPointContract; }, /generalizedPointContract is required/]
  ];
  cases.forEach(([mutate, pattern]) => {
    const { locationValue, recordIndex, generalizedDecision } = makeSyntheticGeneralizedInputs();
    mutate(generalizedDecision);
    const result = validatePublicLocationDataset(locationValue, recordIndex);
    assert.equal(result.valid, false);
    assert.match(result.errors.join("\n"), pattern);
  });
});

test("publication decisions reject simultaneous active representations for one identity", () => {
  const { locationValue, recordIndex, generalizedDecision } = makeSyntheticGeneralizedInputs();
  locationValue.decisions.push(clone(generalizedDecision));
  const result = validatePublicLocationDataset(locationValue, recordIndex);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /duplicate record IDs|duplicate active representation IDs/);
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
