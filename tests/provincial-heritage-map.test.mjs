import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { makeSyntheticGeneralizedPointContract } from "./fixtures/generalized-point-contract.mjs";

const helper = await import(new URL(
  "../heritage-engine/official-heritage-map.js",
  import.meta.url
));
const categoryHelper = await import(new URL(
  "../heritage-engine/official-map-categories.js",
  import.meta.url
));
const committedGeoJson = JSON.parse(await readFile(
  new URL("../data/jiangxi-official-protected-heritage-map.geojson", import.meta.url),
  "utf8"
));

const {
  OfficialHeritageMapValidationError,
  buildOfficialFeatureAccessibleName,
  buildOfficialMarkerAccessibleName,
  buildOfficialPopupData,
  validateOfficialHeritageGeoJson,
  validateOfficialHeritagePublicationGeoJson
} = helper;
const {
  OFFICIAL_MAP_CATEGORY_DEFINITIONS,
  OFFICIAL_MAP_CATEGORY_KEYS,
  getOfficialMapCategory,
  getPublishedOfficialMapCategories
} = categoryHelper;

function makeValidEmpty() {
  return {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: "2.0.0",
      datasetId: "jiangxi-official-protected-heritage-map",
      sourceRecordCount: 17,
      featureCount: 0,
      excludedRecordCount: 17,
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
  if (feature.geometry.type === "Point" && feature.properties.markerClass === "generalized") {
    const contract = makeSyntheticGeneralizedPointContract({ identityId: feature.id });
    if (Number.isFinite(feature.properties.generalizationRadiusMeters) && feature.properties.generalizationRadiusMeters > 0) {
      contract.outwardCoverageMetres = feature.properties.generalizationRadiusMeters;
      if (overrides.properties?.estimatedUncertaintyMeters === undefined) {
        feature.properties.estimatedUncertaintyMeters = feature.properties.generalizationRadiusMeters;
      }
    }
    Object.assign(feature.properties, {
      geometryMeaning: "generalized-reference-point",
      representationStatus: "project-reviewed-interpretation",
      geometrySourceType: "project-generalized-reference",
      geometrySourceLabel: "Synthetic project Generalized reference Point",
      geometrySourceUrl: "https://example.gov.cn/synthetic-generalized-point",
      geometryReviewedAt: "2026-08-04",
      geometryReviewNotes: "Synthetic Generalized reference Point; not an exact feature or boundary.",
      geometryPrecision: "generalized",
      horizontalUncertaintyMetres: contract.outwardCoverageMetres,
      generalizedPointContract: contract
    });
  }
  return feature;
}

function makeFeatureCollection(features) {
  return {
    ...makeValidEmpty(),
    metadata: {
      ...makeValidEmpty().metadata,
      featureCount: features.length,
      excludedRecordCount: 17 - features.length,
      generationStatus: features.length === 0 ? "valid-empty" : "valid"
    },
    features
  };
}

function expectInvalid(value, pattern) {
  assert.throws(
    () => validateOfficialHeritageGeoJson(value),
    (error) => error instanceof OfficialHeritageMapValidationError && pattern.test(error.message)
  );
}

test("accepts the committed valid-empty contract", () => {
  const result = validateOfficialHeritageGeoJson(makeValidEmpty());
  assert.equal(result.status, "valid-empty");
  assert.equal(result.features.length, 0);
  assert.equal(result.metadata.excludedRecordCount, 17);
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
  expectInvalid(value, /sourceRecordCount must be 17/);
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

test("rejects missing, blank, and non-string official categories", () => {
  const missing = makeValidFeature();
  delete missing.properties.officialCategoryZh;
  const blank = makeValidFeature({ properties: { officialCategoryZh: "   " } });
  const nonString = makeValidFeature({ properties: { officialCategoryZh: ["古建筑"] } });
  [missing, blank, nonString].forEach((feature) => {
    expectInvalid(
      makeFeatureCollection([feature]),
      /properties\.officialCategoryZh must be a non-empty string/
    );
  });
});

test("rejects missing and unknown official designation levels", () => {
  const missing = makeValidFeature();
  delete missing.properties.protectionLevelZh;
  const unknown = makeValidFeature({ properties: { protectionLevelZh: "县级文物保护单位" } });
  [missing, unknown].forEach((feature) => {
    expectInvalid(
      makeFeatureCollection([feature]),
      /protectionLevelZh must identify a controlled national, provincial, or municipal designation level/
    );
  });
});

test("maps exact official Chinese categories to controlled project labels", () => {
  assert.equal(getOfficialMapCategory("古建筑").label, "Ancient buildings");
  assert.equal(
    getOfficialMapCategory("近现代重要史迹").label,
    "Important modern historic sites"
  );
  assert.equal(getOfficialMapCategory("古遗址").label, "Archaeological sites");
  assert.equal(
    getOfficialMapCategory("未来官方类别").label,
    "Other official heritage"
  );
  assert.equal(
    getOfficialMapCategory(" 古建筑 ").label,
    "Other official heritage"
  );
  assert.equal(getOfficialMapCategory(""), null);
  assert.equal(getOfficialMapCategory(undefined), null);
});

test("published official categories derive only from validated feature values", () => {
  const features = [
    makeValidFeature({ properties: { officialCategoryZh: "古建筑" } }),
    makeValidFeature({
      id: "JX-PCH-7-002",
      properties: {
        recordId: "JX-PCH-7-002",
        officialCategoryZh: "近现代重要史迹"
      }
    })
  ];
  assert.deepEqual(
    getPublishedOfficialMapCategories(features).map((category) => category.label),
    ["Ancient buildings", "Important modern historic sites"]
  );
  assert.equal(
    getPublishedOfficialMapCategories(features).some(
      (category) => category.key === OFFICIAL_MAP_CATEGORY_KEYS.ARCHAEOLOGICAL_SITES
    ),
    false
  );
});

test("official category glyphs are static project-owned SVG", () => {
  const hostileValue = '<img src=x onerror="alert(1)">';
  const fallback = getOfficialMapCategory(hostileValue);
  assert.equal(fallback.label, "Other official heritage");
  assert.equal(OFFICIAL_MAP_CATEGORY_DEFINITIONS.length, 4);
  OFFICIAL_MAP_CATEGORY_DEFINITIONS.forEach((category) => {
    assert.match(category.glyphSvg, /^<svg /);
    assert.doesNotMatch(category.glyphSvg, /<script|onerror|https?:|data:/i);
    assert.doesNotMatch(category.glyphSvg, new RegExp(hostileValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("rejects unsupported geometry", () => {
  const feature = makeValidFeature({
    geometry: { type: "MultiPoint", coordinates: [[113.8825, 27.6202]] }
  });
  expectInvalid(makeFeatureCollection([feature]), /geometry\.type is unsupported/);
});

test("rejects incomplete coordinates", () => {
  const feature = makeValidFeature({ geometry: { coordinates: [113.8825] } });
  expectInvalid(makeFeatureCollection([feature]), /coordinates must be exactly \[longitude, latitude\]/);
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
  const result = validateOfficialHeritageGeoJson(makeFeatureCollection([feature]));
  assert.equal(result.status, "valid");
  assert.deepEqual(result.features[0].geometry.coordinates, [113.8825, 27.6202]);
  assert.equal(result.features[0].properties.markerClass, "reviewed");
});

test("publication validation accepts future supported geometries with explicit metadata", () => {
  const cases = [
    {
      type: "LineString",
      coordinates: [[113.88, 27.62], [113.89, 27.63]],
      geometryMeaning: "reviewed-line",
      geometryPrecision: "reviewed",
      horizontalUncertaintyMetres: null
    },
    {
      type: "MultiLineString",
      coordinates: [[[113.88, 27.62], [113.89, 27.63]]],
      geometryMeaning: "approximate-line",
      geometryPrecision: "approximate",
      horizontalUncertaintyMetres: 25
    },
    {
      type: "Polygon",
      coordinates: [[
        [113.88, 27.62],
        [113.89, 27.62],
        [113.89, 27.63],
        [113.88, 27.62]
      ]],
      geometryMeaning: "generalized-reference-area",
      geometryPrecision: "generalized",
      horizontalUncertaintyMetres: 100
    },
    {
      type: "MultiPolygon",
      coordinates: [[[
        [113.88, 27.62],
        [113.89, 27.62],
        [113.89, 27.63],
        [113.88, 27.62]
      ]]],
      geometryMeaning: "uncertainty-area",
      geometryPrecision: "uncertain",
      horizontalUncertaintyMetres: 150
    }
  ];

  cases.forEach((entry, index) => {
    const feature = makeValidFeature({
      id: `JX-PCH-7-00${index + 1}`,
      properties: {
        recordId: `JX-PCH-7-00${index + 1}`,
        geometryMeaning: entry.geometryMeaning,
        geometrySourceType: "project-generalized-reference",
        geometrySourceLabel: "Project geometry test source",
        geometrySourceUrl: "https://example.gov.cn/geometry",
        geometryReviewedAt: "2026-07-28",
        geometryReviewNotes: "Project reference geometry; not an official legal boundary.",
        geometryPrecision: entry.geometryPrecision,
        horizontalUncertaintyMetres: entry.horizontalUncertaintyMetres
      },
      geometry: {
        type: entry.type,
        coordinates: entry.coordinates
      }
    });
    const result = validateOfficialHeritagePublicationGeoJson(makeFeatureCollection([feature]));
    assert.equal(result.status, "valid");
    assert.equal(result.features[0].geometry.type, entry.type);
  });
});

test("production Map validation prepares supported non-Point rendering", () => {
  const feature = makeValidFeature({
    properties: {
      geometryMeaning: "reviewed-line",
      geometrySourceType: "official-published-geometry",
      geometrySourceLabel: "Official published geometry",
      geometrySourceUrl: "https://example.gov.cn/geometry",
      geometryReviewedAt: "2026-07-28",
      geometryReviewNotes: "Reviewed publication test geometry.",
      geometryPrecision: "reviewed",
      horizontalUncertaintyMetres: null
    },
    geometry: {
      type: "LineString",
      coordinates: [[113.88, 27.62], [113.89, 27.63]]
    }
  });
  const publication = validateOfficialHeritagePublicationGeoJson(
    makeFeatureCollection([feature])
  );
  const production = validateOfficialHeritageGeoJson(makeFeatureCollection([feature]));
  assert.equal(publication.status, "valid");
  assert.equal(production.status, "valid");
  assert.equal(production.renderModels.length, 1);
  assert.equal(production.renderModels[0].presentation.renderer, "line");
  assert.equal(production.renderModels[0].presentation.meaningLabel, "Reviewed line");
});

test("publication collection validation fails atomically for a malformed child geometry", () => {
  const validPoint = makeValidFeature();
  const invalidArea = makeValidFeature({
    id: "JX-PCH-7-002",
    properties: {
      recordId: "JX-PCH-7-002",
      geometryMeaning: "approximate-boundary",
      geometrySourceType: "project-reviewed-digitization",
      geometrySourceLabel: "Project-reviewed test digitization",
      geometryReviewNotes: "Project digitization; not an official legal boundary.",
      geometryPrecision: "approximate",
      horizontalUncertaintyMetres: 25
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [113.88, 27.62],
        [113.89, 27.62],
        [113.89, 27.63],
        [113.88, 27.64]
      ]]
    }
  });
  assert.throws(
    () => validateOfficialHeritagePublicationGeoJson(
      makeFeatureCollection([validPoint, invalidArea])
    ),
    (error) => (
      error instanceof OfficialHeritageMapValidationError
      && /must be closed/.test(error.message)
    )
  );
});

test("accepts the committed seven-marker Xinyu publication set", () => {
  const result = validateOfficialHeritageGeoJson(committedGeoJson);
  assert.equal(result.status, "valid");
  assert.equal(result.features.length, 7);
  assert.equal(result.features[0].id, "JX-XY-NCH-007");
  assert.deepEqual(result.features[0].geometry.coordinates, [115.011333, 27.805882]);
  assert.equal(result.features[0].properties.markerClass, "reviewed");
  assert.equal(result.features[0].properties.estimatedUncertaintyMeters, 100);
  assert.deepEqual(
    result.features.map(({ id }) => id),
    ["JX-XY-NCH-007", "JX-XY-PCH-001", "JX-XY-PCH-008", "JX-XY-PCH-009", "JX-XY-PCH-014", "JX-XY-PCH-016", "JX-XY-PCH-018"]
  );
  assert.deepEqual(
    getPublishedOfficialMapCategories(result.features).map((category) => category.label),
    ["Ancient buildings", "Important modern historic sites"]
  );
  assert.deepEqual(
    Object.fromEntries(
      getPublishedOfficialMapCategories(result.features).map((category) => [
        category.key,
        result.features.filter((feature) => (
          getOfficialMapCategory(feature.properties.officialCategoryZh).key === category.key
        )).length
      ])
    ),
    {
      "ancient-buildings": 3,
      "important-modern-historic-sites": 4
    }
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
  const result = validateOfficialHeritageGeoJson(makeFeatureCollection([feature]));
  assert.equal(result.features[0].properties.locationEvidenceConfidence, "Medium");
  assert.equal(result.features[0].properties.locationPrecision, "approximate");
});

test("preserves GeoJSON longitude-latitude order", () => {
  const feature = makeValidFeature({ geometry: { coordinates: [114.25, 28.75] } });
  const result = validateOfficialHeritageGeoJson(makeFeatureCollection([feature]));
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
  assert.equal(validateOfficialHeritageGeoJson(makeFeatureCollection([generalized])).status, "valid");
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
    buildOfficialMarkerAccessibleName(feature),
    "Open Official Heritage record: Test Archaeological Site (测试遗址); Official designation level: Provincial; Map category: Ancient buildings; Approximate site location"
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
    buildOfficialMarkerAccessibleName(visitorReference),
    "Open Official Heritage record: Test Archaeological Site (测试遗址); Official designation level: Provincial; Map category: Ancient buildings; Visitor reference point"
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
  const accessibleName = buildOfficialMarkerAccessibleName(compoundReference);
  assert.equal(
    accessibleName,
    "Open Official Heritage record: Test Archaeological Site (测试遗址); Official designation level: Provincial; Map category: Ancient buildings; Compound reference point (approximate project-reviewed location)"
  );
  assert.doesNotMatch(accessibleName, /; Approximate reviewed location$/);
});

test("generalized and unknown-category accessible names retain both meanings", () => {
  const generalized = makeValidFeature({
    properties: {
      officialCategoryZh: "未来官方类别",
      publicationLocationPolicy: "generalized",
      locationPrecision: "generalized",
      displayLocationType: "generalized-locality",
      publicLocationMeaning: "official-locality-centre",
      markerClass: "generalized",
      generalizationRadiusMeters: 1500
    }
  });
  const name = buildOfficialMarkerAccessibleName(generalized);
  assert.match(name, /^Open Official Heritage record: Test Archaeological Site/);
  assert.match(name, /Map category: Other official heritage; Generalized project reference point/);
  assert.match(name, /documented general vicinity/);
  assert.match(name, /Synthetic candidate limitation/);
});

test("Generalized Point public features expose separate safe popup quantities and limitations", () => {
  const generalized = makeValidFeature({
    properties: {
      locationEvidenceConfidence: "Medium",
      publicationLocationPolicy: "generalized",
      locationPrecision: "generalized",
      displayLocationType: "generalized-locality",
      publicLocationMeaning: "official-locality-centre",
      markerClass: "generalized",
      generalizationRadiusMeters: 40
    }
  });
  const popup = buildOfficialPopupData(generalized);
  assert.equal(popup.generalizedPointSourcePrecisionMetres, 2);
  assert.match(popup.generalizedPointSpatialBasis, /predeclared centre/);
  assert.match(popup.generalizedPointSupportMeaning, /not the heritage extent/);
  assert.equal(popup.generalizedPointRepresentativeMethod, "minimum-enclosing-circle-centre");
  assert.equal(popup.generalizedPointLimitationProvenance, "Phase 15C-17 Generalized reference Point policy");
  assert.equal(popup.generalizedPointMaximumFrameAllowanceMetres, 1);
  assert.equal(popup.generalizedPointEnvelopeMetres, 3);
  assert.equal(popup.generalizedPointIntentionalDisplacementMetres, 5);
  assert.equal(popup.generalizedPointSupportDistanceMetres, 30);
  assert.equal(popup.generalizedPointDisplayDecimalPlaces, 4);
  assert.equal(popup.generalizedPointOutwardCoverageMetres, 40);
  assert.match(popup.generalizedPointMandatoryLimitation, /does not show the exact feature/);
  assert.match(popup.generalizedPointCandidateLimitation, /source datum is unstated/);
});

test("public Feature validation rejects duplicate active representation IDs", () => {
  const properties = {
    locationEvidenceConfidence: "Medium",
    publicationLocationPolicy: "generalized",
    locationPrecision: "generalized",
    displayLocationType: "generalized-locality",
    publicLocationMeaning: "official-locality-centre",
    markerClass: "generalized",
    generalizationRadiusMeters: 40
  };
  const first = makeValidFeature({ properties });
  const second = makeValidFeature({ properties, id: "JX-TEST-PCH-002" });
  second.properties.recordId = second.id;
  second.properties.generalizedPointContract.representation.identityId = second.id;
  second.properties.generalizedPointContract.representation.representationId =
    first.properties.generalizedPointContract.representation.representationId;
  expectInvalid(makeFeatureCollection([first, second]), /duplicates active representation ID/);
});

test("non-Point accessible names include category and controlled geometry meaning", () => {
  const feature = makeValidFeature({
    properties: {
      geometryMeaning: "generalized-reference-area",
      geometrySourceType: "project-generalized-reference",
      geometrySourceLabel: "Project generalized test area",
      geometrySourceUrl: "https://example.gov.cn/geometry",
      geometryReviewedAt: "2026-07-28",
      geometryReviewNotes: "Project reference area; not an official legal boundary.",
      geometryPrecision: "generalized",
      horizontalUncertaintyMetres: 100
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: [[[
        [113.88, 27.62],
        [113.89, 27.62],
        [113.89, 27.63],
        [113.88, 27.62]
      ]]]
    }
  });
  assert.equal(
    buildOfficialFeatureAccessibleName(feature),
    "Open Official Heritage record: Test Archaeological Site (测试遗址); Official designation level: Provincial; Map category: Ancient buildings; Generalized project reference area"
  );
});

test("builds provenance-safe popup display data", () => {
  const popup = buildOfficialPopupData(makeValidFeature());
  assert.equal(popup.projectNameEn, "Test Archaeological Site");
  assert.equal(popup.officialNameZh, "测试遗址");
  assert.equal(popup.officialDesignationLevelLabel, "Provincial");
  assert.equal(popup.locationEvidenceConfidence, "High");
  assert.equal(popup.markerClass, "reviewed");
  assert.equal(popup.sourceUrl, "https://example.gov.cn/source");
  assert.match(popup.coordinateProvenance, /reviewed public-location decision/);
  assert.match(popup.coordinateProvenance, /not an official designation coordinate/);
});

test("builds qualified non-Point popup data with safe geometry provenance", () => {
  const popup = buildOfficialPopupData(makeValidFeature({
    properties: {
      geometryMeaning: "approximate-boundary",
      geometrySourceType: "project-reviewed-digitization",
      geometrySourceLabel: "Project-reviewed boundary digitization",
      geometrySourceUrl: "https://example.gov.cn/geometry",
      geometryReviewedAt: "2026-07-28",
      geometryReviewNotes: "Digitized as a project reference.",
      geometryPrecision: "approximate",
      horizontalUncertaintyMetres: 40
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [113.88, 27.62],
        [113.89, 27.62],
        [113.89, 27.63],
        [113.88, 27.62]
      ]]
    }
  }));
  assert.equal(popup.geometryMeaningLabel, "Approximate boundary");
  assert.equal(popup.geometrySourceTypeLabel, "Project-reviewed digitization");
  assert.equal(popup.geometrySourceUrl, "https://example.gov.cn/geometry");
  assert.equal(popup.horizontalUncertaintyMetres, 40);
  assert.match(popup.geometryCaution, /project reference or approximation/);
  assert.match(popup.geometryCaution, /not an official legal boundary/);
});

test("popup display data does not expose an invalid source URL", () => {
  const popup = buildOfficialPopupData(makeValidFeature({
    properties: { sourceUrl: "javascript:alert(1)" }
  }));
  assert.equal(popup.sourceUrl, null);
});
