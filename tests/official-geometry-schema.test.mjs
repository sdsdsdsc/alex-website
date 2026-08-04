import assert from "node:assert/strict";
import test from "node:test";
import {
  GEOMETRY_MEANINGS_BY_TYPE,
  OFFICIAL_GEOMETRY_MEANINGS,
  OFFICIAL_GEOMETRY_PRECISIONS,
  OFFICIAL_GEOMETRY_SOURCE_TYPES,
  OFFICIAL_GEOMETRY_TYPES,
  GENERALIZED_POINT_MANDATORY_LIMITATION,
  deriveLegacyPointGeometryMeaning,
  getOfficialGeometryMeaningLabel,
  validateOfficialGeometry,
  validateOfficialGeometryMetadata,
  validateGeneralizedPointContract
} from "../heritage-engine/official-geometry-schema.js";
import { makeSyntheticGeneralizedPointContract } from "./fixtures/generalized-point-contract.mjs";

const line = [
  [114.9, 27.7],
  [115.0, 27.8]
];
const ring = [
  [114.9, 27.7],
  [115.0, 27.7],
  [115.0, 27.8],
  [114.9, 27.7]
];

const validGeometries = {
  Point: { type: "Point", coordinates: [114.9, 27.7] },
  LineString: { type: "LineString", coordinates: line },
  MultiLineString: { type: "MultiLineString", coordinates: [line] },
  Polygon: { type: "Polygon", coordinates: [ring] },
  MultiPolygon: { type: "MultiPolygon", coordinates: [[ring]] }
};

function expectGeometryInvalid(geometry, pattern) {
  const result = validateOfficialGeometry(geometry);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), pattern);
}

function makeMetadata(overrides = {}) {
  return {
    geometryMeaning: "reviewed-line",
    geometrySourceType: "official-published-geometry",
    geometrySourceLabel: "Official published geometry",
    geometrySourceUrl: "https://example.gov.cn/geometry",
    geometryReviewedAt: "2026-07-28",
    geometryReviewNotes: "Reviewed for bounded project publication.",
    geometryPrecision: "reviewed",
    horizontalUncertaintyMetres: null,
    ...overrides
  };
}

function expectMetadataInvalid(properties, geometryType, pattern) {
  const result = validateOfficialGeometryMetadata(properties, geometryType);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), pattern);
}

test("controlled geometry vocabularies remain bounded", () => {
  assert.deepEqual(OFFICIAL_GEOMETRY_TYPES, [
    "Point",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon"
  ]);
  assert.equal(OFFICIAL_GEOMETRY_MEANINGS.length, 13);
  assert.ok(OFFICIAL_GEOMETRY_MEANINGS.includes("component-reference-point"));
  assert.ok(OFFICIAL_GEOMETRY_MEANINGS.includes("provider-located-project-reviewed-reference-point"));
  assert.equal(OFFICIAL_GEOMETRY_SOURCE_TYPES.length, 6);
  assert.deepEqual(OFFICIAL_GEOMETRY_PRECISIONS, [
    "reviewed",
    "approximate",
    "generalized",
    "uncertain"
  ]);
  assert.deepEqual(GEOMETRY_MEANINGS_BY_TYPE.MultiLineString, GEOMETRY_MEANINGS_BY_TYPE.LineString);
  assert.deepEqual(GEOMETRY_MEANINGS_BY_TYPE.MultiPolygon, GEOMETRY_MEANINGS_BY_TYPE.Polygon);
});

test("accepts provider-located project-reviewed Point metadata", () => {
  const result = validateOfficialGeometryMetadata(makeMetadata({
    geometryMeaning: "provider-located-project-reviewed-reference-point",
    geometrySourceType: "project-reviewed-digitization",
    geometrySourceLabel: "Project-reviewed provider-located reference Point",
    geometryReviewedAt: "2026-07-31",
    geometryReviewNotes: "Project-reviewed reference; not an authority coordinate or boundary.",
    geometryPrecision: "approximate",
    horizontalUncertaintyMetres: 100
  }), "Point");
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.equal(
    getOfficialGeometryMeaningLabel("provider-located-project-reviewed-reference-point"),
    "Provider-located project-reviewed reference point"
  );
});

test("accepts the complete synthetic non-Xinyu Generalized reference Point contract", () => {
  const contract = makeSyntheticGeneralizedPointContract();
  const contractResult = validateGeneralizedPointContract(contract);
  assert.equal(contractResult.valid, true, contractResult.errors.join("; "));
  const metadataResult = validateOfficialGeometryMetadata(makeMetadata({
    geometryMeaning: "generalized-reference-point",
    geometrySourceType: "project-generalized-reference",
    geometrySourceLabel: "Synthetic project Generalized reference Point",
    geometryReviewNotes: "Synthetic test only; not an exact feature or boundary.",
    geometryPrecision: "generalized",
    horizontalUncertaintyMetres: 40,
    generalizedPointContract: contract
  }), "Point");
  assert.equal(metadataResult.valid, true, metadataResult.errors.join("; "));
  assert.equal(contract.mandatoryPublicLimitation, GENERALIZED_POINT_MANDATORY_LIMITATION);
});

test("rejects incomplete, collapsed, over-sharp, misleading, and unsafe Generalized Point contracts", () => {
  const cases = [
    [contract => { delete contract.originalSpatialBasis.methodBasis; }, /methodBasis/],
    [contract => { contract.originalSpatialBasis.basisType = "ordinary-provider-pin"; }, /basisType is unsupported/],
    [contract => { contract.datumInterpretations = []; }, /datumInterpretations must be a non-empty array/],
    [contract => { contract.datumInterpretations[0].frameAllowanceMetres = -1; }, /frameAllowanceMetres must be a finite non-negative/],
    [contract => { contract.multiInterpretationEnvelope.maximumSeparationMetres = 0; }, /must be positive when applicable/],
    [contract => { contract.outwardCoverageMetres = 20; }, /does not cover the separately recorded/],
    [contract => { contract.displayedCoordinatePrecision.decimalPlaces = 6; }, /integer from 0 to 4/],
    [contract => { contract.displayedCoordinatePrecision.approximateResolutionMetres = 1; }, /sharper than the declared decimal precision/],
    [contract => { contract.provenance.limitation.url = "http:\/\/example.test/policy"; }, /valid HTTPS URL/],
    [contract => { contract.review.reviewDate = "2026-02-30"; }, /valid YYYY-MM-DD/],
    [contract => { contract.sourceCoordinatePrecision.metres = Number.NaN; }, /finite non-negative/],
    [contract => { contract.mandatoryPublicLimitation = "Candidate-only wording"; }, /controlled public wording/],
    [contract => { contract.candidateSpecificLimitation = contract.mandatoryPublicLimitation; }, /separate additive limitation/],
    [contract => { contract.candidateSpecificLimitation = "This marker shows the exact feature."; }, /must not claim an exact feature/],
    [contract => { contract.review.policyVersion = "Phase 15C-16"; }, /must be Phase 15C-17/],
    [contract => { contract.representation.status = "superseded"; }, /status must be active/],
    [contract => { contract.representation.supersedesRepresentationIds = [contract.representation.representationId]; }, /cannot supersede itself/],
    [contract => { contract.originalSpatialBasis.restrictedEvidenceReference = { referenceId: "restricted-1", custodian: "Test custodian", accessStatus: "restricted", latitude: 27.1 }; }, /must contain exactly|must not expose restricted coordinates/]
  ];
  cases.forEach(([mutate, pattern]) => {
    const contract = makeSyntheticGeneralizedPointContract();
    mutate(contract);
    const result = validateGeneralizedPointContract(contract);
    assert.equal(result.valid, false);
    assert.match(result.errors.join("\n"), pattern);
  });
});

test("does not permit legacy summary fields to replace or contradict the structured contract", () => {
  const contract = makeSyntheticGeneralizedPointContract();
  expectMetadataInvalid(makeMetadata({
    geometryMeaning: "generalized-reference-point",
    geometrySourceType: "project-generalized-reference",
    geometryPrecision: "generalized",
    horizontalUncertaintyMetres: 41,
    generalizedPointContract: contract
  }), "Point", /legacy outward-coverage summary/);
  expectMetadataInvalid(makeMetadata({
    geometryMeaning: "generalized-reference-point",
    geometrySourceType: "project-generalized-reference",
    geometryPrecision: "generalized",
    horizontalUncertaintyMetres: 40
  }), "Point", /generalizedPointContract/);
});

test("accepts every supported GeoJSON geometry type", () => {
  Object.entries(validGeometries).forEach(([type, geometry]) => {
    const result = validateOfficialGeometry(geometry);
    assert.equal(result.valid, true, `${type}: ${result.errors.join("; ")}`);
    assert.equal(result.geometryType, type);
  });
});

test("rejects unsupported geometry and GeometryCollection", () => {
  expectGeometryInvalid({ type: "GeometryCollection", geometries: [] }, /GeometryCollection is not supported/);
  expectGeometryInvalid({ type: "MultiPoint", coordinates: [[114.9, 27.7]] }, /type is unsupported/);
  expectGeometryInvalid({ type: "Feature", coordinates: [] }, /type is unsupported/);
});

test("rejects malformed Point positions and coordinate values", () => {
  [
    { value: { type: "Point", coordinates: [114.9] }, pattern: /exactly \[longitude, latitude\]/ },
    { value: { type: "Point", coordinates: ["114.9", 27.7] }, pattern: /longitude must be finite/ },
    { value: { type: "Point", coordinates: [null, 27.7] }, pattern: /longitude must be finite/ },
    { value: { type: "Point", coordinates: [Number.NaN, 27.7] }, pattern: /longitude must be finite/ },
    { value: { type: "Point", coordinates: [114.9, Infinity] }, pattern: /latitude must be finite/ },
    { value: { type: "Point", coordinates: [181, 27.7] }, pattern: /longitude is outside/ },
    { value: { type: "Point", coordinates: [114.9, -91] }, pattern: /latitude is outside/ }
  ].forEach(({ value, pattern }) => expectGeometryInvalid(value, pattern));
});

test("rejects malformed and undersized line geometries", () => {
  expectGeometryInvalid({ type: "LineString", coordinates: [] }, /at least two positions/);
  expectGeometryInvalid({ type: "LineString", coordinates: [[114.9, 27.7]] }, /at least two positions/);
  expectGeometryInvalid({ type: "LineString", coordinates: [line[0], [115.0, null]] }, /latitude must be finite/);
  expectGeometryInvalid({ type: "MultiLineString", coordinates: [] }, /at least one LineString/);
  expectGeometryInvalid({ type: "MultiLineString", coordinates: [[]] }, /at least two positions/);
  expectGeometryInvalid({ type: "MultiLineString", coordinates: [null] }, /array of positions/);
});

test("rejects empty, short, open, and malformed polygon rings", () => {
  expectGeometryInvalid({ type: "Polygon", coordinates: [] }, /at least one linear ring/);
  expectGeometryInvalid(
    { type: "Polygon", coordinates: [[[114.9, 27.7], [115.0, 27.7], [114.9, 27.7]]] },
    /at least four positions/
  );
  expectGeometryInvalid(
    { type: "Polygon", coordinates: [[[114.9, 27.7], [115.0, 27.7], [115.0, 27.8], [114.8, 27.8]]] },
    /must be closed/
  );
  expectGeometryInvalid({ type: "Polygon", coordinates: [null] }, /array of positions/);
  expectGeometryInvalid(
    { type: "Polygon", coordinates: [[ring[0], ring[1], [115.0, "27.8"], ring[0]]] },
    /latitude must be finite/
  );
});

test("rejects empty or malformed MultiPolygon children", () => {
  expectGeometryInvalid({ type: "MultiPolygon", coordinates: [] }, /at least one Polygon/);
  expectGeometryInvalid({ type: "MultiPolygon", coordinates: [[]] }, /at least one linear ring/);
  expectGeometryInvalid({ type: "MultiPolygon", coordinates: [[[]]] }, /at least four positions/);
  expectGeometryInvalid({ type: "MultiPolygon", coordinates: [null] }, /array of linear rings/);
});

test("validates explicit provenance and optional review fields", () => {
  assert.equal(validateOfficialGeometryMetadata(makeMetadata(), "LineString").valid, true);
  assert.equal(validateOfficialGeometryMetadata(makeMetadata({
    geometrySourceUrl: null,
    geometryReviewedAt: null,
    geometryReviewNotes: null
  }), "LineString").valid, true);
  expectMetadataInvalid(
    makeMetadata({ geometrySourceType: "crowdsourced-shape" }),
    "LineString",
    /geometrySourceType is unsupported/
  );
  expectMetadataInvalid(
    makeMetadata({ geometrySourceLabel: "  " }),
    "LineString",
    /geometrySourceLabel must be a non-empty string/
  );
  expectMetadataInvalid(
    makeMetadata({ geometrySourceUrl: "http://example.gov.cn/geometry" }),
    "LineString",
    /valid HTTPS URL/
  );
  expectMetadataInvalid(
    makeMetadata({ geometryReviewedAt: "2026-02-30" }),
    "LineString",
    /valid YYYY-MM-DD/
  );
});

test("project-created geometry requires review notes without implying an official boundary", () => {
  expectMetadataInvalid(
    makeMetadata({
      geometrySourceType: "project-reviewed-digitization",
      geometryReviewNotes: null
    }),
    "LineString",
    /geometryReviewNotes is required for project-created geometry/
  );
  const valid = validateOfficialGeometryMetadata(makeMetadata({
    geometrySourceType: "project-reviewed-digitization",
    geometryReviewNotes: "Project-reviewed digitization; not an official legal boundary."
  }), "LineString");
  assert.equal(valid.valid, true);
});

test("enforces meaning-to-geometry compatibility", () => {
  const validCases = [
    ["Point", makeMetadata({ geometryMeaning: "visitor-reference-point", geometryPrecision: "approximate", horizontalUncertaintyMetres: 50 })],
    ["LineString", makeMetadata()],
    ["MultiLineString", makeMetadata({ geometryMeaning: "approximate-line", geometryPrecision: "approximate", horizontalUncertaintyMetres: 25 })],
    ["Polygon", makeMetadata({ geometryMeaning: "reviewed-boundary" })],
    ["MultiPolygon", makeMetadata({ geometryMeaning: "generalized-reference-area", geometryPrecision: "generalized", horizontalUncertaintyMetres: 100 })]
  ];
  validCases.forEach(([geometryType, properties]) => {
    const result = validateOfficialGeometryMetadata(properties, geometryType);
    assert.equal(result.valid, true, `${geometryType}: ${result.errors.join("; ")}`);
  });

  [
    ["Point", "reviewed-line"],
    ["Polygon", "visitor-reference-point"],
    ["LineString", "reviewed-boundary"],
    ["MultiLineString", "uncertainty-area"],
    ["MultiPolygon", "approximate-line"]
  ].forEach(([geometryType, geometryMeaning]) => {
    expectMetadataInvalid(
      makeMetadata({ geometryMeaning }),
      geometryType,
      /geometryMeaning is incompatible/
    );
  });
});

test("enforces controlled precision and uncertainty", () => {
  assert.equal(validateOfficialGeometryMetadata(makeMetadata({
    geometryMeaning: "reviewed-boundary"
  }), "Polygon").valid, true);
  expectMetadataInvalid(
    makeMetadata({ geometryMeaning: "reviewed-boundary", geometryPrecision: "approximate", horizontalUncertaintyMetres: 10 }),
    "Polygon",
    /geometryPrecision must be reviewed/
  );
  [
    undefined,
    null,
    -1,
    Number.NaN,
    Infinity,
    "25"
  ].forEach((horizontalUncertaintyMetres) => {
    expectMetadataInvalid(
      makeMetadata({
        geometryMeaning: "approximate-line",
        geometryPrecision: "approximate",
        horizontalUncertaintyMetres
      }),
      "LineString",
      /horizontalUncertaintyMetres/
    );
  });
  assert.equal(validateOfficialGeometryMetadata(makeMetadata({
    geometryMeaning: "uncertainty-area",
    geometryPrecision: "uncertain",
    horizontalUncertaintyMetres: 0
  }), "Polygon").valid, true);
});

test("retains legacy Point compatibility without fabricating new provenance", () => {
  const currentPointProperties = {
    displayLocationType: "visitor-reference-point",
    publicLocationMeaning: "visitor-reference",
    locationPrecision: "approximate",
    publicationLocationPolicy: "approximate",
    markerClass: "reviewed"
  };
  const result = validateOfficialGeometryMetadata(currentPointProperties, "Point");
  assert.equal(result.valid, true);
  assert.equal(result.legacyPoint, true);
  assert.equal(result.geometryMeaning, "visitor-reference-point");
  assert.equal(Object.hasOwn(currentPointProperties, "geometrySourceType"), false);
  assert.equal(
    deriveLegacyPointGeometryMeaning({
      displayLocationType: "compound-centroid",
      publicLocationMeaning: "heritage-compound-centre"
    }),
    "compound-reference-point"
  );
});

test("provides provenance-safe accessible geometry labels", () => {
  assert.equal(getOfficialGeometryMeaningLabel("reviewed-line"), "Reviewed line");
  assert.equal(getOfficialGeometryMeaningLabel("approximate-line"), "Approximate line");
  assert.equal(getOfficialGeometryMeaningLabel("reviewed-boundary"), "Reviewed boundary");
  assert.equal(getOfficialGeometryMeaningLabel("approximate-boundary"), "Approximate boundary");
  assert.equal(
    getOfficialGeometryMeaningLabel("generalized-reference-area"),
    "Generalized project reference area"
  );
  assert.equal(getOfficialGeometryMeaningLabel("uncertainty-area"), "Uncertainty area");
  OFFICIAL_GEOMETRY_MEANINGS.forEach((meaning) => {
    const label = getOfficialGeometryMeaningLabel(meaning);
    assert.ok(label);
    assert.doesNotMatch(label, /legal|cadastral|designation extent/i);
  });
});
