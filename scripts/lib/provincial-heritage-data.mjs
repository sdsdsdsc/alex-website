import { createHash } from "node:crypto";

const DATASET_SCHEMA_VERSION = "1.0.0";
const DATASET_ID = "jiangxi-provincial-protected-heritage-pilot";
const SOURCE_DATASET_PATH = "data/jiangxi-provincial-heritage-pilot.json";
const GEOMETRY_PROVENANCE = "Alex's Photo Board project coordinate review";
const EXPECTED_RECORD_IDS = Object.freeze(
  Array.from({ length: 10 }, (_, index) => `JX-PCH-7-${String(index + 1).padStart(3, "0")}`)
);
const POINT_INCOMPATIBLE_RECORD_IDS = new Set(["JX-PCH-7-004", "JX-PCH-7-006"]);

const RESEARCH_STATUSES = new Set(["reviewed", "unresolved"]);
const COORDINATE_CONFIDENCES = new Set(["High", "Medium", "Low", "None"]);
const COORDINATE_METHODS = new Set([
  "authoritative-coordinate",
  "official-gis-feature",
  "official-map-identification",
  "archaeological-report-map",
  "published-grid-reference-conversion",
  "site-plan-georeference",
  "address-or-compound-match",
  "satellite-visual-match",
  "multi-source-place-match",
  "broad-locality-only",
  "unresolved"
]);
const SENSITIVITY_ASSESSMENTS = new Set([
  "not-assessed",
  "public-exact-acceptable",
  "public-generalized-only",
  "restricted",
  "unresolved"
]);
const PUBLICATION_POLICIES = new Set(["exact", "approximate", "generalized", "withheld"]);
const STRUCTURED_LOCATION_STATUSES = new Set(["derived", "partial", "unresolved"]);
const TRANSLATION_STATUSES = new Set(["reviewed"]);
const COORDINATE_REVIEW_STATUSES = new Set(["approved"]);

const APPROVED_PROVENANCE_HASH = "403caaa1699f956e4d2fad678f73f1176d594101faf04017850d864f9223ebe9";
const APPROVED_RECORD_HASHES = Object.freeze({
  "JX-PCH-7-001": {
    official: "0a3dce2a76f5102a4cc7a591a8e8a6dda2b52dc9dad7104e546956418a203f4e",
    projectInterpretation: "1fa100d9ae8862d1e3a528ddaf43c89a080fc11f699f9384115261c1f5dc4978",
    coordinateReview: "d8ecff6e78b271e78d1c73cd765ee20904ffd1f4d07a731843195dd304cef649"
  },
  "JX-PCH-7-002": {
    official: "4dd27626f66b3dab76288c6eba502810750b0c11bc8d7394985123680d693ee6",
    projectInterpretation: "9fb56ef26beabc71f05208136926f7fab704540e3d00ad8ee51da4f6101e1eda",
    coordinateReview: "bd9b2cbdab44218063c05983872cf91125d9ed4d9e7e1683e26683d68051fc14"
  },
  "JX-PCH-7-003": {
    official: "77d18166e24adc712cf22a6c1ccb7d37811000d1d066ef4d640f10d1dc6f34c0",
    projectInterpretation: "820bd11baec3440badbca237f8fec0c9df0e1d7db12ee4155143e8ca40ab01fe",
    coordinateReview: "d8ecff6e78b271e78d1c73cd765ee20904ffd1f4d07a731843195dd304cef649"
  },
  "JX-PCH-7-004": {
    official: "ea856d0020e2477a2fde1bfd9dc730e8bb796a06f987c6085b185046e6d938db",
    projectInterpretation: "42829ecced555e3b4a8dc12f7a76c554ee603bc567c989973c89f02205d311ca",
    coordinateReview: "bd9b2cbdab44218063c05983872cf91125d9ed4d9e7e1683e26683d68051fc14"
  },
  "JX-PCH-7-005": {
    official: "b61e10780f32dfd32cdd25b1d6206bb202b9044fb89347735257a5cb9ac86c13",
    projectInterpretation: "82b289eb7f6477decb63031a3ab726c10ede237cf534580eec10da324b416b86",
    coordinateReview: "d8ecff6e78b271e78d1c73cd765ee20904ffd1f4d07a731843195dd304cef649"
  },
  "JX-PCH-7-006": {
    official: "87ec5e52fb348c1e575d91efdb4a9c796497e64c4a48bc0caf61a8ed1079f76f",
    projectInterpretation: "a7652fdf4ab4f809210af7ff3554ef598e62ea9a5ae5d501e5049dc7abd8b5d2",
    coordinateReview: "bd9b2cbdab44218063c05983872cf91125d9ed4d9e7e1683e26683d68051fc14"
  },
  "JX-PCH-7-007": {
    official: "df7ba8ccf6b44e834c16d696dc5268ff6d1e772e72034f84b6caf5844fae50b2",
    projectInterpretation: "82f17ba1d7d116b1d42f7e3913e17d5d43a95cb8a56873907054070b6a65e0d6",
    coordinateReview: "bd9b2cbdab44218063c05983872cf91125d9ed4d9e7e1683e26683d68051fc14"
  },
  "JX-PCH-7-008": {
    official: "4d1fe0b04c4c253ab969086bab6c196013ed1f34588a68c45f6e9171b1f0b85d",
    projectInterpretation: "7f28e58211b8ab9cd7151234dc9246314faea4298cf356ed2e4b1139d300a217",
    coordinateReview: "d8ecff6e78b271e78d1c73cd765ee20904ffd1f4d07a731843195dd304cef649"
  },
  "JX-PCH-7-009": {
    official: "fc767c4139ad110979d2e75df7a6f950c01e0c88a37d42c2db0247312e48aaa2",
    projectInterpretation: "4f3dafa4bf4a77c880221337459c698ee5e4304fdd64a334c05f0799fea4f050",
    coordinateReview: "d8ecff6e78b271e78d1c73cd765ee20904ffd1f4d07a731843195dd304cef649"
  },
  "JX-PCH-7-010": {
    official: "af20113b611811b5e68d61357efe061c18a80481b879899e3113133653f13b0e",
    projectInterpretation: "7902535e14e7ef0447d1f132b8e9c4e8d8c4dba098615886026c599ef3b07a76",
    coordinateReview: "bd9b2cbdab44218063c05983872cf91125d9ed4d9e7e1683e26683d68051fc14"
  }
});

const FORBIDDEN_RUNTIME_FIELDS = new Set([
  "candidateLatitude",
  "candidateLongitude",
  "candidateSourceCRS",
  "candidatePrecision",
  "candidateStatus",
  "candidateRejectionReason",
  "coordinateSourceTitle",
  "coordinateSourcePublisher",
  "coordinateSourceUrl",
  "coordinateSourceType",
  "coordinateSourceDate",
  "coordinateAccessedDate",
  "evidenceQuoteOrSummary",
  "placeMatchEvidence",
  "coordinateDerivationNote",
  "coordinateTransformationMethod",
  "independentCrossCheck",
  "evidenceLimitations",
  "researchNotes",
  "candidateRejectionReason",
  "geometry",
  "coordinates",
  "componentId",
  "recordType",
  "designationStatus",
  "adminNotes",
  "reviewHistory",
  "nominatorEmail",
  "submittedByUid",
  "privateReviewData"
]);

class ProvincialHeritageValidationError extends Error {
  constructor(errors) {
    super(`Provincial heritage validation failed:\n- ${errors.join("\n- ")}`);
    this.name = "ProvincialHeritageValidationError";
    this.errors = errors;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stableSortObject(value) {
  if (Array.isArray(value)) return value.map(stableSortObject);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, stableSortObject(value[key])])
  );
}

function hashObject(value) {
  return createHash("sha256")
    .update(JSON.stringify(stableSortObject(value)))
    .digest("hex");
}

function serializeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function addError(errors, condition, message) {
  if (!condition) errors.push(message);
}

function validateExactKeys(errors, value, expectedKeys, path) {
  if (!isPlainObject(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }

  const actualKeys = Object.keys(value).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  addError(
    errors,
    JSON.stringify(actualKeys) === JSON.stringify(sortedExpectedKeys),
    `${path} must contain exactly: ${sortedExpectedKeys.join(", ")}.`
  );
  return true;
}

function validateNonEmptyString(errors, value, path) {
  addError(errors, typeof value === "string" && value.trim().length > 0, `${path} must be a non-empty string.`);
}

function validateNullableNonEmptyString(errors, value, path) {
  addError(
    errors,
    value === null || (typeof value === "string" && value.trim().length > 0),
    `${path} must be null or a non-empty string.`
  );
}

function validateIsoDate(errors, value, path) {
  validateNonEmptyString(errors, value, path);
  if (typeof value !== "string") return;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const parsed = match ? new Date(`${value}T00:00:00Z`) : null;
  addError(
    errors,
    Boolean(match) && !Number.isNaN(parsed?.getTime()) && parsed.toISOString().startsWith(value),
    `${path} must use a valid YYYY-MM-DD date.`
  );
}

function validateHttpsUrl(errors, value, path) {
  validateNonEmptyString(errors, value, path);
  if (typeof value !== "string") return;
  try {
    addError(errors, new URL(value).protocol === "https:", `${path} must be an HTTPS URL.`);
  } catch {
    errors.push(`${path} must be a valid HTTPS URL.`);
  }
}

function findForbiddenRuntimeFields(value, path = "dataset", found = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => findForbiddenRuntimeFields(entry, `${path}[${index}]`, found));
    return found;
  }
  if (!isPlainObject(value)) return found;

  Object.entries(value).forEach(([key, entry]) => {
    const isAllowedDatasetRecordType = path === "dataset" && key === "recordType";
    if (FORBIDDEN_RUNTIME_FIELDS.has(key) && !isAllowedDatasetRecordType) found.push(`${path}.${key}`);
    findForbiddenRuntimeFields(entry, `${path}.${key}`, found);
  });
  return found;
}

function validateOfficialSource(errors, source) {
  const path = "dataset.provenance.officialSource";
  const keys = [
    "sourceIssuerZh",
    "sourceRepublisherZh",
    "sourceTitleZh",
    "sourceAttachmentTitleZh",
    "sourceDocumentNumber",
    "sourceDocumentNumberVerificationStatus",
    "sourcePublicationDate",
    "sourceUrl",
    "sourceAttachmentUrl",
    "sourceAccessedDate"
  ];
  if (!validateExactKeys(errors, source, keys, path)) return;

  [
    "sourceIssuerZh",
    "sourceRepublisherZh",
    "sourceTitleZh",
    "sourceAttachmentTitleZh",
    "sourceDocumentNumber"
  ].forEach((key) => validateNonEmptyString(errors, source[key], `${path}.${key}`));
  addError(
    errors,
    source.sourceDocumentNumberVerificationStatus === "pending",
    `${path}.sourceDocumentNumberVerificationStatus must remain pending.`
  );
  validateIsoDate(errors, source.sourcePublicationDate, `${path}.sourcePublicationDate`);
  validateIsoDate(errors, source.sourceAccessedDate, `${path}.sourceAccessedDate`);
  validateHttpsUrl(errors, source.sourceUrl, `${path}.sourceUrl`);
  validateHttpsUrl(errors, source.sourceAttachmentUrl, `${path}.sourceAttachmentUrl`);
}

function validateProvenance(errors, provenance) {
  const path = "dataset.provenance";
  const keys = ["officialSource", "projectLayers", "projectMaintainer", "projectLastReviewedDate"];
  if (!validateExactKeys(errors, provenance, keys, path)) return;

  validateOfficialSource(errors, provenance.officialSource);
  if (validateExactKeys(
    errors,
    provenance.projectLayers,
    ["officialTranscription", "projectInterpretation", "coordinateReview"],
    `${path}.projectLayers`
  )) {
    Object.entries(provenance.projectLayers).forEach(([key, value]) => {
      validateNonEmptyString(errors, value, `${path}.projectLayers.${key}`);
      addError(errors, value.startsWith("docs/") && value.endsWith(".md"), `${path}.projectLayers.${key} must reference a docs Markdown file.`);
    });
  }
  addError(errors, provenance.projectMaintainer === "Alex's Photo Board", `${path}.projectMaintainer must identify Alex's Photo Board.`);
  validateIsoDate(errors, provenance.projectLastReviewedDate, `${path}.projectLastReviewedDate`);
}

function validateOfficialRecord(errors, official, path) {
  const keys = [
    "officialListNumber",
    "officialNameZh",
    "protectionLevelZh",
    "batchZh",
    "designationDate",
    "officialCategoryZh",
    "periodZh",
    "officialLocationTextZh",
    "remarksZh"
  ];
  if (!validateExactKeys(errors, official, keys, path)) return;
  keys.filter((key) => key !== "remarksZh").forEach((key) => {
    validateNonEmptyString(errors, official[key], `${path}.${key}`);
  });
  validateNullableNonEmptyString(errors, official.remarksZh, `${path}.remarksZh`);
  validateIsoDate(errors, official.designationDate, `${path}.designationDate`);
  addError(errors, official.protectionLevelZh === "江西省文物保护单位", `${path}.protectionLevelZh is not the approved protection level.`);
  addError(errors, official.batchZh === "第七批", `${path}.batchZh is not the approved batch.`);
  addError(errors, official.officialCategoryZh === "古遗址", `${path}.officialCategoryZh is not the approved category.`);
}

function validateAdministrativeLocation(errors, location, path) {
  const keys = [
    "prefectureLevelCityZh",
    "countyLevelDivisionZh",
    "subdistrictTownshipZh",
    "villageCommunityZh",
    "subVillageLocalityZh",
    "siteDetailZh"
  ];
  if (!validateExactKeys(errors, location, keys, path)) return;
  keys.forEach((key) => validateNullableNonEmptyString(errors, location[key], `${path}.${key}`));
  addError(errors, typeof location.prefectureLevelCityZh === "string", `${path}.prefectureLevelCityZh is required.`);
  addError(errors, typeof location.countyLevelDivisionZh === "string", `${path}.countyLevelDivisionZh is required.`);
}

function validateComponents(errors, components, recordId, path) {
  if (!Array.isArray(components)) {
    errors.push(`${path} must be an array.`);
    return;
  }
  components.forEach((component, index) => {
    const componentPath = `${path}[${index}]`;
    if (!validateExactKeys(errors, component, ["nameZh", "nameEn"], componentPath)) return;
    validateNonEmptyString(errors, component.nameZh, `${componentPath}.nameZh`);
    validateNonEmptyString(errors, component.nameEn, `${componentPath}.nameEn`);
  });

  const expectedCount = recordId === "JX-PCH-7-004" ? 4 : recordId === "JX-PCH-7-006" ? 3 : 0;
  addError(errors, components.length === expectedCount, `${path} must contain exactly ${expectedCount} descriptive components.`);
}

function validateProjectInterpretation(errors, project, recordId, path) {
  const keys = [
    "namePinyin",
    "projectNameEn",
    "projectProtectionLevelEn",
    "projectCategoryEn",
    "projectPeriodEn",
    "projectLocationTextEn",
    "projectRemarksEn",
    "translationStatus",
    "translationNote",
    "administrativeLocation",
    "components",
    "structuredLocationStatus",
    "structuredLocationNote"
  ];
  if (!validateExactKeys(errors, project, keys, path)) return;

  [
    "namePinyin",
    "projectNameEn",
    "projectProtectionLevelEn",
    "projectCategoryEn",
    "projectPeriodEn",
    "projectLocationTextEn",
    "translationNote",
    "structuredLocationNote"
  ].forEach((key) => validateNonEmptyString(errors, project[key], `${path}.${key}`));
  validateNullableNonEmptyString(errors, project.projectRemarksEn, `${path}.projectRemarksEn`);
  addError(errors, TRANSLATION_STATUSES.has(project.translationStatus), `${path}.translationStatus is unknown.`);
  addError(
    errors,
    project.projectProtectionLevelEn === "Jiangxi Provincial Cultural Heritage Site",
    `${path}.projectProtectionLevelEn is not approved.`
  );
  addError(errors, project.projectCategoryEn === "Archaeological Site", `${path}.projectCategoryEn is not approved.`);
  addError(
    errors,
    STRUCTURED_LOCATION_STATUSES.has(project.structuredLocationStatus),
    `${path}.structuredLocationStatus is unknown.`
  );
  validateAdministrativeLocation(errors, project.administrativeLocation, `${path}.administrativeLocation`);
  validateComponents(errors, project.components, recordId, `${path}.components`);
}

function validateCoordinateReview(errors, review, recordId, path) {
  const keys = [
    "researchStatus",
    "coordinateConfidence",
    "coordinateMethod",
    "approvedLatitude",
    "approvedLongitude",
    "coordinateReferenceSystem",
    "estimatedUncertaintyMeters",
    "renderable",
    "sensitivityAssessment",
    "publicationLocationPolicy",
    "selectedCandidateId",
    "coordinateReviewedBy",
    "coordinateReviewDate",
    "coordinateReviewStatus"
  ];
  if (!validateExactKeys(errors, review, keys, path)) return;

  addError(errors, RESEARCH_STATUSES.has(review.researchStatus), `${path}.researchStatus is unknown.`);
  addError(errors, COORDINATE_CONFIDENCES.has(review.coordinateConfidence), `${path}.coordinateConfidence is unknown.`);
  addError(errors, COORDINATE_METHODS.has(review.coordinateMethod), `${path}.coordinateMethod is unknown.`);
  addError(errors, SENSITIVITY_ASSESSMENTS.has(review.sensitivityAssessment), `${path}.sensitivityAssessment is unknown.`);
  addError(errors, PUBLICATION_POLICIES.has(review.publicationLocationPolicy), `${path}.publicationLocationPolicy is unknown.`);
  addError(errors, typeof review.renderable === "boolean", `${path}.renderable must be boolean.`);
  validateNullableNonEmptyString(errors, review.coordinateReferenceSystem, `${path}.coordinateReferenceSystem`);
  validateNullableNonEmptyString(errors, review.selectedCandidateId, `${path}.selectedCandidateId`);
  validateNonEmptyString(errors, review.coordinateReviewedBy, `${path}.coordinateReviewedBy`);
  validateIsoDate(errors, review.coordinateReviewDate, `${path}.coordinateReviewDate`);
  addError(errors, COORDINATE_REVIEW_STATUSES.has(review.coordinateReviewStatus), `${path}.coordinateReviewStatus is unknown.`);

  const latitudeIsNull = review.approvedLatitude === null;
  const longitudeIsNull = review.approvedLongitude === null;
  const hasCoordinatePair = !latitudeIsNull && !longitudeIsNull;
  addError(errors, latitudeIsNull === longitudeIsNull, `${path} has an incomplete coordinate pair.`);

  if (hasCoordinatePair) {
    addError(errors, Number.isFinite(review.approvedLatitude), `${path}.approvedLatitude must be finite.`);
    addError(errors, Number.isFinite(review.approvedLongitude), `${path}.approvedLongitude must be finite.`);
    if (Number.isFinite(review.approvedLatitude)) {
      addError(errors, review.approvedLatitude >= -90 && review.approvedLatitude <= 90, `${path}.approvedLatitude is outside -90 to 90.`);
    }
    if (Number.isFinite(review.approvedLongitude)) {
      addError(errors, review.approvedLongitude >= -180 && review.approvedLongitude <= 180, `${path}.approvedLongitude is outside -180 to 180.`);
    }
    addError(errors, review.coordinateReferenceSystem === "WGS84", `${path} has numeric coordinates without WGS84.`);
    addError(errors, review.renderable === true, `${path} exposes an approved coordinate while non-renderable.`);
    addError(errors, review.sensitivityAssessment !== "restricted", `${path} exposes a restricted exact coordinate.`);
  } else {
    addError(errors, review.coordinateReferenceSystem === null, `${path}.coordinateReferenceSystem must be null without coordinates.`);
    addError(errors, review.estimatedUncertaintyMeters === null, `${path}.estimatedUncertaintyMeters must be null without coordinates.`);
    addError(errors, review.selectedCandidateId === null, `${path}.selectedCandidateId must be null without coordinates.`);
  }

  if (review.estimatedUncertaintyMeters !== null) {
    addError(
      errors,
      Number.isFinite(review.estimatedUncertaintyMeters) && review.estimatedUncertaintyMeters >= 0,
      `${path}.estimatedUncertaintyMeters must be null or a non-negative finite number.`
    );
  }

  if (review.coordinateConfidence === "Low" || review.coordinateConfidence === "None") {
    addError(errors, !hasCoordinatePair, `${path} gives a ${review.coordinateConfidence} record approved coordinates.`);
    addError(errors, review.renderable === false, `${path} makes a ${review.coordinateConfidence} record renderable.`);
  }
  if (review.researchStatus === "unresolved") {
    addError(errors, !hasCoordinatePair, `${path} gives an unresolved record approved coordinates.`);
    addError(errors, review.renderable === false, `${path} makes an unresolved record renderable.`);
  }

  if (review.renderable === true) {
    addError(errors, review.researchStatus === "reviewed", `${path} is renderable without reviewed research.`);
    addError(errors, ["High", "Medium"].includes(review.coordinateConfidence), `${path} is renderable without High or Medium confidence.`);
    addError(errors, hasCoordinatePair, `${path} is renderable without approved coordinates.`);
    addError(errors, review.coordinateReferenceSystem === "WGS84", `${path} is renderable without WGS84.`);
    addError(
      errors,
      ["exact", "approximate", "generalized"].includes(review.publicationLocationPolicy),
      `${path} is renderable while publication is withheld.`
    );
    addError(
      errors,
      ["public-exact-acceptable", "public-generalized-only"].includes(review.sensitivityAssessment),
      `${path} is renderable while sensitivity does not permit publication.`
    );
    addError(errors, typeof review.selectedCandidateId === "string" && review.selectedCandidateId.trim(), `${path} is renderable without selectedCandidateId.`);
    addError(errors, !POINT_INCOMPATIBLE_RECORD_IDS.has(recordId), `${recordId} cannot become a Point under the current parent-record contract.`);
  }

  if (review.publicationLocationPolicy === "exact" || review.publicationLocationPolicy === "approximate") {
    if (review.renderable) {
      addError(
        errors,
        review.sensitivityAssessment === "public-exact-acceptable",
        `${path} exact/approximate publication requires public-exact-acceptable sensitivity.`
      );
    }
  }
  if (review.publicationLocationPolicy === "generalized" && review.renderable) {
    addError(
      errors,
      ["public-exact-acceptable", "public-generalized-only"].includes(review.sensitivityAssessment),
      `${path} generalized publication lacks an approved sensitivity outcome.`
    );
  }

  addError(
    errors,
    review.selectedCandidateId !== "JX-PCH-7-010-C01",
    `${path} contains the rejected Phase 14C candidate.`
  );
}

function validateRecord(errors, record, index, enforceApprovedPilotParity) {
  const path = `dataset.records[${index}]`;
  if (!validateExactKeys(errors, record, ["recordId", "official", "projectInterpretation", "coordinateReview"], path)) return;
  validateNonEmptyString(errors, record.recordId, `${path}.recordId`);
  addError(errors, record.recordId === EXPECTED_RECORD_IDS[index], `${path}.recordId is not in the approved sequential order.`);
  validateOfficialRecord(errors, record.official, `${path}.official`);
  validateProjectInterpretation(errors, record.projectInterpretation, record.recordId, `${path}.projectInterpretation`);
  validateCoordinateReview(errors, record.coordinateReview, record.recordId, `${path}.coordinateReview`);

  if (!enforceApprovedPilotParity || !APPROVED_RECORD_HASHES[record.recordId]) return;
  const expected = APPROVED_RECORD_HASHES[record.recordId];
  addError(errors, hashObject(record.official) === expected.official, `${record.recordId} Phase 14A official-source parity mismatch.`);
  addError(
    errors,
    hashObject(record.projectInterpretation) === expected.projectInterpretation,
    `${record.recordId} Phase 14B project-interpretation parity mismatch.`
  );
  addError(
    errors,
    hashObject(record.coordinateReview) === expected.coordinateReview,
    `${record.recordId} Phase 14C coordinate-review parity mismatch.`
  );
}

function validateProvincialHeritageDataset(dataset, options = {}) {
  const errors = [];
  const enforceApprovedPilotParity = options.enforceApprovedPilotParity !== false;
  const topLevelKeys = ["schemaVersion", "datasetId", "recordType", "dataLayer", "provenance", "records"];

  if (!validateExactKeys(errors, dataset, topLevelKeys, "dataset")) {
    return { valid: false, errors };
  }
  addError(errors, dataset.schemaVersion === DATASET_SCHEMA_VERSION, "dataset.schemaVersion is unsupported.");
  addError(errors, dataset.datasetId === DATASET_ID, "dataset.datasetId is unsupported.");
  addError(errors, dataset.recordType === "official-reference", "dataset.recordType must be official-reference.");
  addError(errors, dataset.dataLayer === "provincial-protected-heritage-pilot", "dataset.dataLayer is unsupported.");
  validateProvenance(errors, dataset.provenance);

  if (!Array.isArray(dataset.records)) {
    errors.push("dataset.records must be an array.");
  } else {
    addError(errors, dataset.records.length === 10, "dataset.records must contain exactly ten records.");
    const ids = dataset.records.map((record) => record?.recordId);
    addError(errors, new Set(ids).size === ids.length, "dataset.records contains duplicate record IDs.");
    dataset.records.forEach((record, index) => validateRecord(errors, record, index, enforceApprovedPilotParity));
  }

  const forbiddenFields = findForbiddenRuntimeFields(dataset);
  forbiddenFields.forEach((path) => errors.push(`${path} is forbidden in runtime data.`));

  if (enforceApprovedPilotParity && isPlainObject(dataset.provenance)) {
    addError(errors, hashObject(dataset.provenance) === APPROVED_PROVENANCE_HASH, "dataset provenance parity mismatch.");
  }

  return {
    valid: errors.length === 0,
    errors,
    recordCount: Array.isArray(dataset.records) ? dataset.records.length : 0
  };
}

function assertValidProvincialHeritageDataset(dataset, options = {}) {
  const result = validateProvincialHeritageDataset(dataset, options);
  if (!result.valid) throw new ProvincialHeritageValidationError(result.errors);
  return result;
}

function getGeometryExclusionReasons(record) {
  const review = record.coordinateReview;
  const reasons = [];
  if (review.researchStatus === "unresolved") reasons.push("unresolved-research");
  if (review.coordinateConfidence === "Low") reasons.push("low-confidence");
  if (review.coordinateConfidence === "None") reasons.push("none-confidence");
  if (!review.renderable) reasons.push("non-renderable");
  if (review.publicationLocationPolicy === "withheld") reasons.push("withheld-publication");
  if (!Number.isFinite(review.approvedLatitude) || !Number.isFinite(review.approvedLongitude)) {
    reasons.push("missing-approved-coordinates");
  }
  if (review.coordinateReferenceSystem !== "WGS84") reasons.push("missing-wgs84-coordinate-reference-system");
  if (!review.selectedCandidateId) reasons.push("missing-selected-candidate");
  if (!["public-exact-acceptable", "public-generalized-only"].includes(review.sensitivityAssessment)) {
    reasons.push("sensitivity-not-public");
  }
  if (POINT_INCOMPATIBLE_RECORD_IDS.has(record.recordId)) reasons.push("point-contract-incompatible");
  return reasons;
}

function isGeometryEligible(record) {
  return getGeometryExclusionReasons(record).length === 0
    && record.coordinateReview.researchStatus === "reviewed"
    && ["High", "Medium"].includes(record.coordinateReview.coordinateConfidence)
    && ["exact", "approximate", "generalized"].includes(record.coordinateReview.publicationLocationPolicy);
}

function buildGeoJsonFeature(record, officialSource) {
  const official = record.official;
  const project = record.projectInterpretation;
  const review = record.coordinateReview;
  const approximateLocation = review.coordinateConfidence === "Medium"
    || review.publicationLocationPolicy !== "exact";

  return {
    type: "Feature",
    id: record.recordId,
    properties: {
      recordId: record.recordId,
      officialListNumber: official.officialListNumber,
      officialNameZh: official.officialNameZh,
      projectNameEn: project.projectNameEn,
      protectionLevelZh: official.protectionLevelZh,
      projectProtectionLevelEn: project.projectProtectionLevelEn,
      officialCategoryZh: official.officialCategoryZh,
      projectCategoryEn: project.projectCategoryEn,
      periodZh: official.periodZh,
      projectPeriodEn: project.projectPeriodEn,
      officialLocationTextZh: official.officialLocationTextZh,
      projectLocationTextEn: project.projectLocationTextEn,
      remarksZh: official.remarksZh,
      projectRemarksEn: project.projectRemarksEn,
      administrativeLocation: project.administrativeLocation,
      components: project.components,
      translationStatus: project.translationStatus,
      sourceIssuerZh: officialSource.sourceIssuerZh,
      sourceTitleZh: officialSource.sourceTitleZh,
      sourceUrl: officialSource.sourceUrl,
      sourceAccessedDate: officialSource.sourceAccessedDate,
      coordinateConfidence: review.coordinateConfidence,
      coordinateMethod: review.coordinateMethod,
      coordinateReferenceSystem: review.coordinateReferenceSystem,
      estimatedUncertaintyMeters: review.estimatedUncertaintyMeters,
      sensitivityAssessment: review.sensitivityAssessment,
      publicationLocationPolicy: review.publicationLocationPolicy,
      coordinateReviewDate: review.coordinateReviewDate,
      approximateLocation,
      geometryProvenance: GEOMETRY_PROVENANCE
    },
    geometry: {
      type: "Point",
      coordinates: [review.approvedLongitude, review.approvedLatitude]
    }
  };
}

function generateProvincialHeritageGeoJson(dataset, options = {}) {
  assertValidProvincialHeritageDataset(dataset, options);
  const exclusions = [];
  const features = [];
  const seenFeatureIds = new Set();
  const records = [...dataset.records].sort((a, b) => a.recordId.localeCompare(b.recordId));

  records.forEach((record) => {
    if (!isGeometryEligible(record)) {
      exclusions.push({
        recordId: record.recordId,
        reasons: getGeometryExclusionReasons(record)
      });
      return;
    }
    if (seenFeatureIds.has(record.recordId)) {
      throw new ProvincialHeritageValidationError([`Duplicate GeoJSON feature ID: ${record.recordId}.`]);
    }
    seenFeatureIds.add(record.recordId);
    features.push(buildGeoJsonFeature(record, dataset.provenance.officialSource));
  });

  const geojson = {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: DATASET_SCHEMA_VERSION,
      datasetId: DATASET_ID,
      sourceDataset: SOURCE_DATASET_PATH,
      sourceRecordCount: records.length,
      featureCount: features.length,
      excludedRecordCount: exclusions.length,
      generationStatus: features.length === 0 ? "valid-empty" : "valid",
      geometryProvenance: GEOMETRY_PROVENANCE
    },
    features
  };

  return { geojson, exclusions, hardErrorCount: 0 };
}

export {
  APPROVED_RECORD_HASHES,
  COORDINATE_CONFIDENCES,
  COORDINATE_METHODS,
  DATASET_ID,
  DATASET_SCHEMA_VERSION,
  EXPECTED_RECORD_IDS,
  GEOMETRY_PROVENANCE,
  POINT_INCOMPATIBLE_RECORD_IDS,
  ProvincialHeritageValidationError,
  PUBLICATION_POLICIES,
  RESEARCH_STATUSES,
  SENSITIVITY_ASSESSMENTS,
  SOURCE_DATASET_PATH,
  assertValidProvincialHeritageDataset,
  buildGeoJsonFeature,
  generateProvincialHeritageGeoJson,
  getGeometryExclusionReasons,
  hashObject,
  isGeometryEligible,
  serializeJson,
  validateProvincialHeritageDataset
};
