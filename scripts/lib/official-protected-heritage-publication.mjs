import {
  POINT_INCOMPATIBLE_RECORD_IDS,
  ProvincialHeritageValidationError,
  validateProvincialHeritageDataset
} from "./provincial-heritage-data.mjs";
import {
  validateOfficialGeometry,
  validateOfficialGeometryMetadata,
  validateGeneralizedPointContract
} from "../../heritage-engine/official-geometry-schema.js";

const AGGREGATE_SCHEMA_VERSION = "2.0.0";
const AGGREGATE_DATASET_ID = "jiangxi-official-protected-heritage-map";
const PHASE_14_DATASET_ID = "jiangxi-provincial-protected-heritage-pilot";
const PHASE_14_SOURCE_PATH = "data/jiangxi-provincial-heritage-pilot.json";
const XINYU_DATASET_ID = "xinyu-official-heritage-records";
const XINYU_SOURCE_PATH = "data/xinyu-official-heritage-records.json";
const LEGACY_PROVINCIAL_DATASET_ID = "xinyu-provincial-protected-heritage-marker-pilot";
const LEGACY_PROVINCIAL_SOURCE_PATH = "data/xinyu-provincial-heritage-marker-pilot.json";
const LEGACY_PROVINCIAL_AGGREGATE_DATASET_ID = "jiangxi-provincial-protected-heritage-map";
const LEGACY_PROVINCIAL_AGGREGATE_SOURCE_PATH = "data/jiangxi-provincial-protected-heritage-map.geojson";
const PUBLIC_LOCATION_DATASET_ID = "official-protected-heritage-public-location-decisions";
const PUBLIC_LOCATION_SOURCE_PATH = "data/official-protected-heritage-public-locations.json";
const AGGREGATE_SOURCE_PATH = "data/jiangxi-official-protected-heritage-map.geojson";
const PROJECT_GEOMETRY_PROVENANCE = "Alex's Photo Board reviewed public-location decision";

const OFFICIAL_DESIGNATION_LEVELS = new Map([
  ["全国重点文物保护单位", { code: "national", label: "National", idPrefix: "NCH" }],
  ["省级文物保护单位", { code: "provincial", label: "Provincial", idPrefix: "PCH" }],
  ["市级文物保护单位", { code: "municipal", label: "Municipal", idPrefix: "MCH" }]
]);

const IDENTITY_CONFIDENCES = new Set(["confirmed", "probable", "unresolved"]);
const LOCATION_CONFIDENCES = new Set(["High", "Medium", "Low", "None"]);
const DISPLAY_LOCATION_TYPES = new Set([
  "site-point",
  "compound-centroid",
  "public-entrance",
  "visitor-reference-point",
  "component-reference-point",
  "generalized-locality",
  "generalized-area-reference",
  "withheld"
]);
const LOCATION_PRECISIONS = new Set([
  "exact",
  "near-exact",
  "approximate",
  "generalized",
  "unresolved"
]);
const PUBLIC_LOCATION_MEANINGS = new Set([
  "heritage-feature",
  "heritage-compound-centre",
  "public-entrance",
  "visitor-reference",
  "component-reference",
  "official-locality-centre",
  "representative-area",
  "withheld"
]);
const PUBLICATION_POLICIES = new Set(["exact", "approximate", "generalized", "withheld"]);
const SENSITIVITY_ASSESSMENTS = new Set([
  "not-assessed",
  "public-exact-acceptable",
  "public-generalized-only",
  "restricted",
  "unresolved"
]);
const REPRESENTATION_STATUSES = new Set([
  "authority-published",
  "project-reviewed-interpretation"
]);
const EXPLICIT_POINT_GEOMETRY_MEANINGS = new Set([
  "provider-located-project-reviewed-reference-point",
  "generalized-reference-point"
]);
const SOURCE_TYPES = new Set([
  "official-record",
  "institutional-description",
  "official-map",
  "map-poi-and-satellite",
  "open-map-geometry",
  "gaode-poi",
  "provider-comparison"
]);
const SOURCE_SUPPORTS = new Set([
  "official-identity",
  "official-locality",
  "independent-identity",
  "compound-description",
  "poi-name",
  "locality-match",
  "satellite-compound",
  "internal-venue-label",
  "named-compound",
  "wgs84-reference",
  "public-entrance",
  "visitor-information",
  "venue-photograph",
  "detailed-address"
]);

const XINYU_TOP_LEVEL_KEYS = [
  "schemaVersion",
  "datasetId",
  "recordType",
  "dataLayer",
  "provenance",
  "records"
];
const LEGACY_PROVINCIAL_TOP_LEVEL_KEYS = [
  "schemaVersion",
  "datasetId",
  "recordType",
  "protectionLevelCode",
  "dataLayer",
  "provenance",
  "records"
];
const XINYU_PROVENANCE_KEYS = [
  "officialSourceTitleZh",
  "publishingAuthorityZh",
  "sourceIndexNumber",
  "publicationDate",
  "sourceUrl",
  "sourceAccessedDate"
];
const XINYU_RECORD_KEYS = ["recordId", "sourceSequence", "official", "projectInterpretation"];
const XINYU_OFFICIAL_KEYS = [
  "officialNameZh",
  "officialCategoryZh",
  "officialLocationTextZh",
  "protectionLevelZh",
  "officialDesignationNumber",
  "designationBatch",
  "designationDate",
  "periodZh"
];
const XINYU_PROJECT_KEYS = ["projectNameEn", "translationStatus", "translationNote"];
const PUBLIC_LOCATION_TOP_LEVEL_KEYS = [
  "schemaVersion",
  "datasetId",
  "projectMaintainer",
  "projectLastReviewedDate",
  "decisions"
];
const PUBLIC_LOCATION_DECISION_KEYS = [
  "recordId",
  "sourceDatasetId",
  "identityConfidence",
  "siteLocationConfidence",
  "locationEvidenceConfidence",
  "displayLocationType",
  "locationPrecision",
  "publicLocationMeaning",
  "publicationLocationPolicy",
  "sensitivityAssessment",
  "latitude",
  "longitude",
  "coordinateReferenceSystem",
  "estimatedUncertaintyMeters",
  "generalizationRadiusMeters",
  "publicLocationNote",
  "locationEvidenceSummary",
  "reviewedBy",
  "reviewedDate",
  "reviewStatus",
  "projectLocationSources",
  "originalProviderCoordinate",
  "transformationOrReconciliationMethod"
];
const PUBLIC_LOCATION_DECISION_OPTIONAL_KEYS = [
  "geometryMeaning",
  "representationStatus",
  "generalizedPointContract"
];
const PUBLIC_LOCATION_SOURCE_KEYS = [
  "sourceId",
  "sourceType",
  "sourceTitle",
  "sourcePublisher",
  "sourceUrl",
  "sourceAccessedDate",
  "supports"
];
const ORIGINAL_PROVIDER_COORDINATE_KEYS = [
  "provider",
  "poiName",
  "whatItRepresents",
  "latitude",
  "longitude",
  "coordinateReferenceSystem",
  "coordinateReferenceSystemStatus",
  "providerUrl"
];

class OfficialProtectedHeritagePublicationError extends Error {
  constructor(errors) {
    super(`Official protected heritage publication validation failed:\n- ${errors.join("\n- ")}`);
    this.name = "OfficialProtectedHeritagePublicationError";
    this.errors = errors;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function addError(errors, condition, message) {
  if (!condition) errors.push(message);
}

function validateExactKeys(errors, value, expectedKeys, path) {
  if (!isPlainObject(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  addError(
    errors,
    JSON.stringify(actual) === JSON.stringify(expected),
    `${path} must contain exactly: ${expected.join(", ")}.`
  );
  return true;
}

function validateRequiredAndOptionalKeys(errors, value, requiredKeys, optionalKeys, path) {
  if (!isPlainObject(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }
  const actual = new Set(Object.keys(value));
  const allowed = new Set([...requiredKeys, ...optionalKeys]);
  const missing = requiredKeys.filter((key) => !actual.has(key));
  const unexpected = [...actual].filter((key) => !allowed.has(key));
  addError(errors, missing.length === 0, `${path} is missing required keys: ${missing.join(", ")}.`);
  addError(errors, unexpected.length === 0, `${path} contains unsupported keys: ${unexpected.join(", ")}.`);
  return missing.length === 0 && unexpected.length === 0;
}

function validateNonEmptyString(errors, value, path) {
  addError(errors, typeof value === "string" && value.trim().length > 0, `${path} must be a non-empty string.`);
}

function validateNullableString(errors, value, path) {
  addError(
    errors,
    value === null || (typeof value === "string" && value.trim().length > 0),
    `${path} must be null or a non-empty string.`
  );
}

function validateIsoDate(errors, value, path, { nullable = false } = {}) {
  if (nullable && value === null) return;
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
    addError(errors, new URL(value).protocol === "https:", `${path} must use HTTPS.`);
  } catch {
    errors.push(`${path} must be a valid URL.`);
  }
}

function validateCoordinatePair(errors, latitude, longitude, crs, path) {
  const latitudeIsNull = latitude === null;
  const longitudeIsNull = longitude === null;
  addError(errors, latitudeIsNull === longitudeIsNull, `${path} has an incomplete coordinate pair.`);
  if (latitudeIsNull || longitudeIsNull) {
    addError(errors, crs === null, `${path}.coordinateReferenceSystem must be null without coordinates.`);
    return false;
  }
  addError(errors, Number.isFinite(latitude), `${path}.latitude must be finite.`);
  addError(errors, Number.isFinite(longitude), `${path}.longitude must be finite.`);
  if (Number.isFinite(latitude)) addError(errors, latitude >= -90 && latitude <= 90, `${path}.latitude is outside -90 to 90.`);
  if (Number.isFinite(longitude)) addError(errors, longitude >= -180 && longitude <= 180, `${path}.longitude is outside -180 to 180.`);
  addError(errors, crs === "WGS84", `${path}.coordinateReferenceSystem must be WGS84.`);
  return true;
}

function validateXinyuCompanionDataset(dataset) {
  const errors = [];
  if (!validateExactKeys(errors, dataset, XINYU_TOP_LEVEL_KEYS, "xinyuDataset")) {
    return { valid: false, errors, recordCount: 0 };
  }
  addError(errors, dataset.schemaVersion === "1.0.0", "xinyuDataset.schemaVersion is unsupported.");
  addError(errors, dataset.datasetId === XINYU_DATASET_ID, "xinyuDataset.datasetId is unsupported.");
  addError(errors, dataset.recordType === "official-reference", "xinyuDataset.recordType must be official-reference.");
  addError(
    errors,
    dataset.dataLayer === "official-heritage-records",
    "xinyuDataset.dataLayer is unsupported."
  );

  if (validateExactKeys(errors, dataset.provenance, XINYU_PROVENANCE_KEYS, "xinyuDataset.provenance")) {
    [
      "officialSourceTitleZh",
      "publishingAuthorityZh",
      "sourceIndexNumber"
    ].forEach((key) => validateNonEmptyString(errors, dataset.provenance[key], `xinyuDataset.provenance.${key}`));
    validateIsoDate(errors, dataset.provenance.publicationDate, "xinyuDataset.provenance.publicationDate");
    validateIsoDate(errors, dataset.provenance.sourceAccessedDate, "xinyuDataset.provenance.sourceAccessedDate");
    validateHttpsUrl(errors, dataset.provenance.sourceUrl, "xinyuDataset.provenance.sourceUrl");
  }

  if (!Array.isArray(dataset.records)) {
    errors.push("xinyuDataset.records must be an array.");
  } else {
    addError(errors, dataset.records.length > 0, "xinyuDataset.records must not be empty.");
    const ids = dataset.records.map((record) => record?.recordId);
    const sequences = dataset.records.map((record) => record?.sourceSequence);
    addError(errors, new Set(ids).size === ids.length, "xinyuDataset.records contains duplicate record IDs.");
    addError(errors, new Set(sequences).size === sequences.length, "xinyuDataset.records contains duplicate source sequences.");
    dataset.records.forEach((record, index) => {
      const path = `xinyuDataset.records[${index}]`;
      if (!validateExactKeys(errors, record, XINYU_RECORD_KEYS, path)) return;
      validateNonEmptyString(errors, record.recordId, `${path}.recordId`);
      addError(errors, /^JX-XY-(?:NCH|PCH|MCH)-\d{3}$/.test(record.recordId), `${path}.recordId is not a stable Xinyu official ID.`);
      addError(errors, Number.isInteger(record.sourceSequence) && record.sourceSequence > 0, `${path}.sourceSequence must be a positive integer.`);

      if (validateExactKeys(errors, record.official, XINYU_OFFICIAL_KEYS, `${path}.official`)) {
        [
          "officialNameZh",
          "officialCategoryZh",
          "officialLocationTextZh",
          "protectionLevelZh"
        ].forEach((key) => validateNonEmptyString(errors, record.official[key], `${path}.official.${key}`));
        const level = OFFICIAL_DESIGNATION_LEVELS.get(record.official.protectionLevelZh);
        addError(
          errors,
          Boolean(level),
          `${path}.official.protectionLevelZh must identify a controlled national, provincial, or municipal designation level.`
        );
        if (level && typeof record.recordId === "string") {
          addError(
            errors,
            record.recordId.includes(`-${level.idPrefix}-`),
            `${path}.official.protectionLevelZh contradicts the record ID authority level.`
          );
        }
        [
          "officialDesignationNumber",
          "designationBatch",
          "periodZh"
        ].forEach((key) => validateNullableString(errors, record.official[key], `${path}.official.${key}`));
        validateIsoDate(errors, record.official.designationDate, `${path}.official.designationDate`, { nullable: true });
        if (record.official.officialDesignationNumber !== null) {
          addError(
            errors,
            /^\d+(?:-\d+){2,3}$/.test(record.official.officialDesignationNumber),
            `${path}.official.officialDesignationNumber must use the documented designation-number form.`
          );
        }
      }

      if (validateExactKeys(errors, record.projectInterpretation, XINYU_PROJECT_KEYS, `${path}.projectInterpretation`)) {
        validateNonEmptyString(errors, record.projectInterpretation.projectNameEn, `${path}.projectInterpretation.projectNameEn`);
        addError(
          errors,
          record.projectInterpretation.translationStatus === "project-reviewed",
          `${path}.projectInterpretation.translationStatus must be project-reviewed.`
        );
        validateNonEmptyString(errors, record.projectInterpretation.translationNote, `${path}.projectInterpretation.translationNote`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    recordCount: Array.isArray(dataset.records) ? dataset.records.length : 0
  };
}

function validateProvincialCompatibilityDataset(dataset) {
  const errors = [];
  if (!validateExactKeys(errors, dataset, LEGACY_PROVINCIAL_TOP_LEVEL_KEYS, "legacyProvincialDataset")) {
    return { valid: false, errors, recordCount: 0 };
  }
  addError(errors, dataset.datasetId === LEGACY_PROVINCIAL_DATASET_ID, "legacyProvincialDataset.datasetId is unsupported.");
  addError(errors, dataset.protectionLevelCode === "provincial", "legacyProvincialDataset.protectionLevelCode must be provincial.");
  addError(
    errors,
    dataset.dataLayer === "provincial-protected-heritage-marker-pilot",
    "legacyProvincialDataset.dataLayer is unsupported."
  );
  const normalized = {
    schemaVersion: dataset.schemaVersion,
    datasetId: XINYU_DATASET_ID,
    recordType: dataset.recordType,
    dataLayer: "official-heritage-records",
    provenance: dataset.provenance,
    records: dataset.records
  };
  const normalizedResult = validateXinyuCompanionDataset(normalized);
  normalizedResult.errors.forEach((error) => errors.push(`Legacy provincial source: ${error}`));
  if (Array.isArray(dataset.records)) {
    dataset.records.forEach((record, index) => {
      addError(
        errors,
        record?.official?.protectionLevelZh === "省级文物保护单位",
        `legacyProvincialDataset.records[${index}] must contain only provincial records.`
      );
    });
  }
  return {
    valid: errors.length === 0,
    errors,
    recordCount: Array.isArray(dataset.records) ? dataset.records.length : 0,
    normalized
  };
}

function buildOfficialRecordIndex(phase14Dataset, xinyuDataset, errors = []) {
  const index = new Map();
  phase14Dataset.records.forEach((record) => {
    index.set(record.recordId, {
      sourceDatasetId: PHASE_14_DATASET_ID,
      sourcePath: PHASE_14_SOURCE_PATH,
      official: record.official,
      projectInterpretation: record.projectInterpretation,
      officialSource: {
        sourceTitleZh: phase14Dataset.provenance.officialSource.sourceTitleZh,
        sourceIssuerZh: phase14Dataset.provenance.officialSource.sourceIssuerZh,
        sourceUrl: phase14Dataset.provenance.officialSource.sourceUrl,
        sourceAccessedDate: phase14Dataset.provenance.officialSource.sourceAccessedDate
      }
    });
  });

  xinyuDataset.records.forEach((record) => {
    if (index.has(record.recordId)) {
      errors.push(`Cross-dataset duplicate record ID: ${record.recordId}.`);
      return;
    }
    index.set(record.recordId, {
      sourceDatasetId: XINYU_DATASET_ID,
      sourcePath: XINYU_SOURCE_PATH,
      official: record.official,
      projectInterpretation: record.projectInterpretation,
      officialSource: {
        sourceTitleZh: xinyuDataset.provenance.officialSourceTitleZh,
        sourceIssuerZh: xinyuDataset.provenance.publishingAuthorityZh,
        sourceUrl: xinyuDataset.provenance.sourceUrl,
        sourceAccessedDate: xinyuDataset.provenance.sourceAccessedDate
      }
    });
  });
  return index;
}

function validateLocationSource(errors, source, path) {
  if (!validateExactKeys(errors, source, PUBLIC_LOCATION_SOURCE_KEYS, path)) return;
  [
    "sourceId",
    "sourceTitle",
    "sourcePublisher"
  ].forEach((key) => validateNonEmptyString(errors, source[key], `${path}.${key}`));
  addError(errors, SOURCE_TYPES.has(source.sourceType), `${path}.sourceType is unknown.`);
  validateHttpsUrl(errors, source.sourceUrl, `${path}.sourceUrl`);
  validateIsoDate(errors, source.sourceAccessedDate, `${path}.sourceAccessedDate`);
  addError(errors, Array.isArray(source.supports) && source.supports.length > 0, `${path}.supports must be a non-empty array.`);
  if (Array.isArray(source.supports)) {
    addError(errors, new Set(source.supports).size === source.supports.length, `${path}.supports contains duplicates.`);
    source.supports.forEach((value) => addError(errors, SOURCE_SUPPORTS.has(value), `${path}.supports contains unknown value ${value}.`));
  }
}

function validateOriginalProviderCoordinate(errors, value, path) {
  if (value === null) return;
  if (!validateExactKeys(errors, value, ORIGINAL_PROVIDER_COORDINATE_KEYS, path)) return;
  ["provider", "poiName", "whatItRepresents"].forEach((key) => validateNonEmptyString(errors, value[key], `${path}.${key}`));
  addError(errors, Number.isFinite(value.latitude), `${path}.latitude must be finite.`);
  addError(errors, Number.isFinite(value.longitude), `${path}.longitude must be finite.`);
  addError(errors, ["GCJ-02", "BD-09"].includes(value.coordinateReferenceSystem), `${path}.coordinateReferenceSystem must preserve GCJ-02 or BD-09.`);
  addError(
    errors,
    ["documented", "project-assessed"].includes(value.coordinateReferenceSystemStatus),
    `${path}.coordinateReferenceSystemStatus is unknown.`
  );
  validateHttpsUrl(errors, value.providerUrl, `${path}.providerUrl`);
}

function isGeneralizedDecision(decision) {
  return ["generalized-locality", "generalized-area-reference"].includes(decision.displayLocationType);
}

function hasProhibitedGeneralizedPointClaim(value) {
  return typeof value === "string"
    && /(?:shows?|marks?|is) (?:an? |the )?(?:exact (?:feature|centre|center|entrance|extent)|official (?:legal )?boundary|legal protection boundary)/i.test(value);
}

function deriveMarkerClass(decision) {
  return isGeneralizedDecision(decision) ? "generalized" : "reviewed";
}

function validatePublicLocationDecision(errors, decision, path, recordIndex) {
  if (!validateRequiredAndOptionalKeys(
    errors,
    decision,
    PUBLIC_LOCATION_DECISION_KEYS,
    PUBLIC_LOCATION_DECISION_OPTIONAL_KEYS,
    path
  )) return;
  validateNonEmptyString(errors, decision.recordId, `${path}.recordId`);
  validateNonEmptyString(errors, decision.sourceDatasetId, `${path}.sourceDatasetId`);
  addError(errors, IDENTITY_CONFIDENCES.has(decision.identityConfidence), `${path}.identityConfidence is unknown.`);
  addError(errors, LOCATION_CONFIDENCES.has(decision.siteLocationConfidence), `${path}.siteLocationConfidence is unknown.`);
  addError(errors, LOCATION_CONFIDENCES.has(decision.locationEvidenceConfidence), `${path}.locationEvidenceConfidence is unknown.`);
  addError(errors, DISPLAY_LOCATION_TYPES.has(decision.displayLocationType), `${path}.displayLocationType is unknown.`);
  addError(errors, LOCATION_PRECISIONS.has(decision.locationPrecision), `${path}.locationPrecision is unknown.`);
  addError(errors, PUBLIC_LOCATION_MEANINGS.has(decision.publicLocationMeaning), `${path}.publicLocationMeaning is unknown.`);
  addError(errors, PUBLICATION_POLICIES.has(decision.publicationLocationPolicy), `${path}.publicationLocationPolicy is unknown.`);
  addError(errors, SENSITIVITY_ASSESSMENTS.has(decision.sensitivityAssessment), `${path}.sensitivityAssessment is unknown.`);
  validateNonEmptyString(errors, decision.publicLocationNote, `${path}.publicLocationNote`);
  validateNonEmptyString(errors, decision.locationEvidenceSummary, `${path}.locationEvidenceSummary`);
  validateNonEmptyString(errors, decision.reviewedBy, `${path}.reviewedBy`);
  addError(errors, decision.reviewedBy === "project owner", `${path}.reviewedBy must record project-owner approval.`);
  validateIsoDate(errors, decision.reviewedDate, `${path}.reviewedDate`);
  addError(errors, decision.reviewStatus === "approved", `${path}.reviewStatus must be approved.`);
  validateNonEmptyString(errors, decision.transformationOrReconciliationMethod, `${path}.transformationOrReconciliationMethod`);
  const hasGeometryMeaning = decision.geometryMeaning !== undefined;
  const hasRepresentationStatus = decision.representationStatus !== undefined;
  addError(
    errors,
    hasGeometryMeaning === hasRepresentationStatus,
    `${path}.geometryMeaning and representationStatus must be supplied together.`
  );
  if (hasGeometryMeaning) {
    addError(
      errors,
      EXPLICIT_POINT_GEOMETRY_MEANINGS.has(decision.geometryMeaning),
      `${path}.geometryMeaning is unsupported.`
    );
    addError(
      errors,
      REPRESENTATION_STATUSES.has(decision.representationStatus),
      `${path}.representationStatus is unsupported.`
    );
  }
  const hasGeneralizedPointContract = decision.generalizedPointContract !== undefined;

  const officialRecord = recordIndex.get(decision.recordId);
  addError(errors, Boolean(officialRecord), `${path}.recordId does not reference an official record.`);
  if (officialRecord) {
    addError(
      errors,
      officialRecord.sourceDatasetId === decision.sourceDatasetId,
      `${path}.sourceDatasetId does not match the official record.`
    );
  }

  const hasCoordinates = validateCoordinatePair(
    errors,
    decision.latitude,
    decision.longitude,
    decision.coordinateReferenceSystem,
    path
  );
  addError(errors, decision.identityConfidence === "confirmed", `${path} is not renderable without confirmed identity.`);
  addError(errors, ["High", "Medium"].includes(decision.locationEvidenceConfidence), `${path} lacks High or Medium display-location evidence.`);
  addError(
    errors,
    ["public-exact-acceptable", "public-generalized-only"].includes(decision.sensitivityAssessment),
    `${path}.sensitivityAssessment does not permit public display.`
  );
  addError(errors, hasCoordinates, `${path} is approved without a public coordinate.`);
  addError(
    errors,
    Number.isFinite(decision.estimatedUncertaintyMeters) && decision.estimatedUncertaintyMeters > 0,
    `${path}.estimatedUncertaintyMeters must be a positive finite number.`
  );

  const generalized = isGeneralizedDecision(decision);
  if (generalized) {
    addError(errors, decision.locationPrecision === "generalized", `${path} generalized display must use generalized precision.`);
    addError(errors, decision.publicationLocationPolicy === "generalized", `${path} generalized display must use generalized publication policy.`);
    addError(
      errors,
      ["official-locality-centre", "representative-area"].includes(decision.publicLocationMeaning),
      `${path} generalized display has a misleading publicLocationMeaning.`
    );
    addError(
      errors,
      Number.isFinite(decision.generalizationRadiusMeters) && decision.generalizationRadiusMeters > 0,
      `${path}.generalizationRadiusMeters is required for generalized display.`
    );
    addError(errors, decision.geometryMeaning === "generalized-reference-point", `${path}.geometryMeaning must be generalized-reference-point for generalized display.`);
    addError(errors, decision.representationStatus === "project-reviewed-interpretation", `${path}.representationStatus must be project-reviewed-interpretation for generalized display.`);
    addError(errors, hasGeneralizedPointContract, `${path}.generalizedPointContract is required for generalized display.`);
    addError(errors, !hasProhibitedGeneralizedPointClaim(decision.publicLocationNote), `${path}.publicLocationNote must not claim an exact feature, centre, entrance, extent, or legal boundary.`);
    if (hasGeneralizedPointContract) {
      errors.push(...validateGeneralizedPointContract(decision.generalizedPointContract, {
        path: `${path}.generalizedPointContract`
      }).errors);
      const contract = decision.generalizedPointContract;
      addError(errors, contract?.representation?.identityId === decision.recordId, `${path}.generalizedPointContract.representation.identityId must match recordId.`);
      addError(errors, decision.estimatedUncertaintyMeters === contract?.outwardCoverageMetres, `${path}.estimatedUncertaintyMeters must equal generalizedPointContract.outwardCoverageMetres as the legacy outward-coverage summary.`);
      addError(errors, decision.generalizationRadiusMeters === contract?.outwardCoverageMetres, `${path}.generalizationRadiusMeters must equal generalizedPointContract.outwardCoverageMetres as the legacy generalized-radius summary.`);
      const decimalPlaces = contract?.displayedCoordinatePrecision?.decimalPlaces;
      if (Number.isInteger(decimalPlaces) && hasCoordinates) {
        addError(errors, Number(decision.latitude.toFixed(decimalPlaces)) === decision.latitude && Number(decision.longitude.toFixed(decimalPlaces)) === decision.longitude, `${path} coordinates are sharper than generalizedPointContract.displayedCoordinatePrecision.`);
      }
    }
  } else {
    addError(errors, !hasGeneralizedPointContract, `${path}.generalizedPointContract is only permitted for generalized display.`);
    addError(errors, ["High", "Medium"].includes(decision.siteLocationConfidence), `${path} describes a site/reference Point without High or Medium site confidence.`);
    addError(errors, ["exact", "near-exact", "approximate"].includes(decision.locationPrecision), `${path} reviewed display has unsupported precision.`);
    addError(errors, ["exact", "approximate"].includes(decision.publicationLocationPolicy), `${path} reviewed display has unsupported publication policy.`);
    addError(errors, decision.generalizationRadiusMeters === null, `${path}.generalizationRadiusMeters must be null for reviewed display.`);
    addError(
      errors,
      decision.sensitivityAssessment === "public-exact-acceptable",
      `${path} exact or approximate display requires public-exact-acceptable sensitivity.`
    );
    const allowedMeanings = {
      "site-point": ["heritage-feature"],
      "compound-centroid": ["heritage-compound-centre"],
      "public-entrance": ["public-entrance"],
      "visitor-reference-point": ["visitor-reference"],
      "component-reference-point": ["component-reference"]
    };
    addError(
      errors,
      allowedMeanings[decision.displayLocationType]?.includes(decision.publicLocationMeaning),
      `${path}.publicLocationMeaning contradicts displayLocationType.`
    );
  }

  if (decision.displayLocationType === "site-point") {
    addError(errors, decision.siteLocationConfidence === "High", `${path} site-point requires High site confidence.`);
  }
  if (decision.publicationLocationPolicy === "exact") {
    addError(errors, decision.locationPrecision === "exact", `${path} exact policy requires exact precision.`);
  }
  if (POINT_INCOMPATIBLE_RECORD_IDS.has(decision.recordId)) {
    errors.push(`${path} attempts a parent Point for a protected multi-component record.`);
  }

  addError(errors, Array.isArray(decision.projectLocationSources), `${path}.projectLocationSources must be an array.`);
  if (Array.isArray(decision.projectLocationSources)) {
    const sourceIds = decision.projectLocationSources.map((source) => source?.sourceId);
    addError(errors, new Set(sourceIds).size === sourceIds.length, `${path}.projectLocationSources contains duplicate source IDs.`);
    decision.projectLocationSources.forEach((source, index) => {
      validateLocationSource(errors, source, `${path}.projectLocationSources[${index}]`);
    });
    const types = new Set(decision.projectLocationSources.map((source) => source?.sourceType));
    addError(errors, types.has("official-record"), `${path} lacks official identity evidence.`);
    addError(errors, types.has("institutional-description"), `${path} lacks independent institutional confirmation.`);
    addError(
      errors,
      ["official-map", "map-poi-and-satellite", "open-map-geometry", "gaode-poi"].some((type) => types.has(type)),
      `${path} lacks spatial evidence beyond the official locality.`
    );
  }

  validateOriginalProviderCoordinate(errors, decision.originalProviderCoordinate, `${path}.originalProviderCoordinate`);
}

function validatePublicLocationDataset(dataset, recordIndex) {
  const errors = [];
  if (!validateExactKeys(errors, dataset, PUBLIC_LOCATION_TOP_LEVEL_KEYS, "publicLocations")) {
    return { valid: false, errors, decisionCount: 0 };
  }
  addError(errors, dataset.schemaVersion === "1.0.0", "publicLocations.schemaVersion is unsupported.");
  addError(errors, dataset.datasetId === PUBLIC_LOCATION_DATASET_ID, "publicLocations.datasetId is unsupported.");
  addError(errors, dataset.projectMaintainer === "Alex's Photo Board", "publicLocations.projectMaintainer is unsupported.");
  validateIsoDate(errors, dataset.projectLastReviewedDate, "publicLocations.projectLastReviewedDate");

  if (!Array.isArray(dataset.decisions)) {
    errors.push("publicLocations.decisions must be an array.");
  } else {
    const ids = dataset.decisions.map((decision) => decision?.recordId);
    addError(errors, new Set(ids).size === ids.length, "publicLocations.decisions contains duplicate record IDs.");
    const representationIds = dataset.decisions
      .map((decision) => decision?.generalizedPointContract?.representation?.representationId)
      .filter(Boolean);
    addError(errors, new Set(representationIds).size === representationIds.length, "publicLocations.decisions contains duplicate active representation IDs.");
    dataset.decisions.forEach((decision, index) => {
      validatePublicLocationDecision(errors, decision, `publicLocations.decisions[${index}]`, recordIndex);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    decisionCount: Array.isArray(dataset.decisions) ? dataset.decisions.length : 0
  };
}

function assertAggregateInputs({ phase14Dataset, xinyuDataset, publicLocationDataset }) {
  const errors = [];
  const phase14Result = validateProvincialHeritageDataset(phase14Dataset);
  if (!phase14Result.valid) {
    phase14Result.errors.forEach((error) => errors.push(`Phase 14 dataset: ${error}`));
  }
  const xinyuResult = validateXinyuCompanionDataset(xinyuDataset);
  if (!xinyuResult.valid) {
    xinyuResult.errors.forEach((error) => errors.push(error));
  }
  if (errors.length > 0) throw new OfficialProtectedHeritagePublicationError(errors);

  const recordIndex = buildOfficialRecordIndex(phase14Dataset, xinyuDataset, errors);
  const publicLocationResult = validatePublicLocationDataset(publicLocationDataset, recordIndex);
  if (!publicLocationResult.valid) {
    publicLocationResult.errors.forEach((error) => errors.push(error));
  }
  if (errors.length > 0) throw new OfficialProtectedHeritagePublicationError(errors);
  return recordIndex;
}

function buildFeature(recordId, record, decision) {
  const official = record.official;
  const project = record.projectInterpretation;
  const markerClass = deriveMarkerClass(decision);
  const properties = {
    recordId,
    sourceDatasetId: record.sourceDatasetId,
    officialNameZh: official.officialNameZh,
    projectNameEn: project.projectNameEn,
    projectEnglishStatus: "Alex's Photo Board project interpretation",
    protectionLevelZh: official.protectionLevelZh,
    officialCategoryZh: official.officialCategoryZh,
    officialLocationTextZh: official.officialLocationTextZh,
    sourceTitleZh: record.officialSource.sourceTitleZh,
    sourceIssuerZh: record.officialSource.sourceIssuerZh,
    sourceUrl: record.officialSource.sourceUrl,
    sourceAccessedDate: record.officialSource.sourceAccessedDate,
    identityConfidence: decision.identityConfidence,
    siteLocationConfidence: decision.siteLocationConfidence,
    locationEvidenceConfidence: decision.locationEvidenceConfidence,
    displayLocationType: decision.displayLocationType,
    locationPrecision: decision.locationPrecision,
    publicLocationMeaning: decision.publicLocationMeaning,
    markerClass,
    estimatedUncertaintyMeters: decision.estimatedUncertaintyMeters,
    generalizationRadiusMeters: decision.generalizationRadiusMeters,
    publicationLocationPolicy: decision.publicationLocationPolicy,
    publicLocationNote: decision.publicLocationNote,
    coordinateReferenceSystem: decision.coordinateReferenceSystem,
    projectLocationProvenance: PROJECT_GEOMETRY_PROVENANCE
  };
  if (decision.geometryMeaning) {
    const generalized = decision.geometryMeaning === "generalized-reference-point";
    Object.assign(properties, {
      geometryMeaning: decision.geometryMeaning,
      representationStatus: decision.representationStatus,
      geometrySourceType: generalized ? "project-generalized-reference" : "project-reviewed-digitization",
      geometrySourceLabel: generalized ? "Project-reviewed Generalized reference Point" : "Project-reviewed provider-located reference Point",
      geometrySourceUrl: generalized
        ? decision.generalizedPointContract.provenance.spatialBasis.url
        : decision.originalProviderCoordinate.providerUrl,
      geometryReviewedAt: decision.reviewedDate,
      geometryReviewNotes: decision.publicLocationNote,
      geometryPrecision: generalized ? "generalized" : "approximate",
      horizontalUncertaintyMetres: decision.estimatedUncertaintyMeters
    });
    if (generalized) {
      properties.generalizedPointContract = structuredClone(decision.generalizedPointContract);
    }
  }
  return {
    type: "Feature",
    id: recordId,
    properties,
    geometry: {
      type: "Point",
      coordinates: [decision.longitude, decision.latitude]
    }
  };
}

function validateGeneratedFeatureGeometry(feature, path) {
  const geometryResult = validateOfficialGeometry(feature.geometry, { path: `${path}.geometry` });
  const errors = [...geometryResult.errors];
  if (geometryResult.geometryType) {
    errors.push(...validateOfficialGeometryMetadata(
      feature.properties,
      geometryResult.geometryType,
      { path: `${path}.properties`, allowLegacyPoint: true }
    ).errors);
  }
  return errors;
}

function generateOfficialProtectedHeritageMap({
  phase14Dataset,
  xinyuDataset,
  publicLocationDataset
}) {
  const recordIndex = assertAggregateInputs({ phase14Dataset, xinyuDataset, publicLocationDataset });
  const decisionIndex = new Map(
    publicLocationDataset.decisions.map((decision) => [decision.recordId, decision])
  );
  const recordIds = [...recordIndex.keys()].sort((a, b) => a.localeCompare(b));
  const features = [];
  const exclusions = [];
  const geometryErrors = [];

  recordIds.forEach((recordId) => {
    const decision = decisionIndex.get(recordId);
    if (!decision) {
      exclusions.push({ recordId, reasons: ["no-approved-public-location"] });
      return;
    }
    const feature = buildFeature(recordId, recordIndex.get(recordId), decision);
    geometryErrors.push(...validateGeneratedFeatureGeometry(feature, `features[${features.length}]`));
    features.push(feature);
  });
  if (geometryErrors.length > 0) {
    throw new OfficialProtectedHeritagePublicationError(geometryErrors);
  }

  const sourceDatasets = [
    {
      datasetId: PHASE_14_DATASET_ID,
      sourcePath: PHASE_14_SOURCE_PATH,
      recordCount: phase14Dataset.records.length
    },
    {
      datasetId: XINYU_DATASET_ID,
      sourcePath: XINYU_SOURCE_PATH,
      recordCount: xinyuDataset.records.length
    }
  ];

  const geojson = {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: AGGREGATE_SCHEMA_VERSION,
      datasetId: AGGREGATE_DATASET_ID,
      sourceDatasets,
      publicLocationSource: PUBLIC_LOCATION_SOURCE_PATH,
      sourceRecordCount: recordIds.length,
      featureCount: features.length,
      excludedRecordCount: exclusions.length,
      generationStatus: features.length === 0 ? "valid-empty" : "valid",
      deterministicSourceOrder: sourceDatasets.map(({ datasetId }) => datasetId),
      geometryProvenance: PROJECT_GEOMETRY_PROVENANCE
    },
    features
  };

  return { geojson, exclusions, hardErrorCount: 0 };
}

function generateProvincialCompatibilityMap({
  phase14Dataset,
  legacyProvincialDataset,
  publicLocationDataset
}) {
  const legacyResult = validateProvincialCompatibilityDataset(legacyProvincialDataset);
  if (!legacyResult.valid) {
    throw new OfficialProtectedHeritagePublicationError(legacyResult.errors);
  }
  const legacyIds = new Set(legacyProvincialDataset.records.map(({ recordId }) => recordId));
  const filteredLocations = {
    ...publicLocationDataset,
    decisions: publicLocationDataset.decisions.filter(({ recordId }) => legacyIds.has(recordId))
  };
  const generated = generateOfficialProtectedHeritageMap({
    phase14Dataset,
    xinyuDataset: legacyResult.normalized,
    publicLocationDataset: filteredLocations
  });
  const features = generated.geojson.features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      sourceDatasetId: LEGACY_PROVINCIAL_DATASET_ID
    }
  }));
  const sourceDatasets = [
    {
      datasetId: PHASE_14_DATASET_ID,
      sourcePath: PHASE_14_SOURCE_PATH,
      recordCount: phase14Dataset.records.length
    },
    {
      datasetId: LEGACY_PROVINCIAL_DATASET_ID,
      sourcePath: LEGACY_PROVINCIAL_SOURCE_PATH,
      recordCount: legacyProvincialDataset.records.length
    }
  ];
  return {
    ...generated,
    geojson: {
      ...generated.geojson,
      metadata: {
        ...generated.geojson.metadata,
        datasetId: LEGACY_PROVINCIAL_AGGREGATE_DATASET_ID,
        sourceDatasets,
        sourceRecordCount: phase14Dataset.records.length + legacyProvincialDataset.records.length,
        featureCount: features.length,
        excludedRecordCount: generated.exclusions.length,
        deterministicSourceOrder: sourceDatasets.map(({ datasetId }) => datasetId),
        compatibilityStatus: "provincial-only-legacy-public-url",
        canonicalCombinedDataset: AGGREGATE_SOURCE_PATH
      },
      features
    }
  };
}

function serializeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export {
  AGGREGATE_DATASET_ID,
  AGGREGATE_SCHEMA_VERSION,
  AGGREGATE_SOURCE_PATH,
  DISPLAY_LOCATION_TYPES,
  IDENTITY_CONFIDENCES,
  LOCATION_CONFIDENCES,
  LOCATION_PRECISIONS,
  LEGACY_PROVINCIAL_AGGREGATE_DATASET_ID,
  LEGACY_PROVINCIAL_AGGREGATE_SOURCE_PATH,
  LEGACY_PROVINCIAL_DATASET_ID,
  LEGACY_PROVINCIAL_SOURCE_PATH,
  OFFICIAL_DESIGNATION_LEVELS,
  OfficialProtectedHeritagePublicationError,
  PHASE_14_DATASET_ID,
  PROJECT_GEOMETRY_PROVENANCE,
  PUBLICATION_POLICIES,
  PUBLIC_LOCATION_DATASET_ID,
  PUBLIC_LOCATION_MEANINGS,
  SENSITIVITY_ASSESSMENTS,
  XINYU_DATASET_ID,
  assertAggregateInputs,
  buildFeature as buildOfficialProtectedHeritageFeature,
  deriveMarkerClass,
  generateOfficialProtectedHeritageMap,
  generateProvincialCompatibilityMap,
  isGeneralizedDecision,
  serializeJson,
  validateGeneratedFeatureGeometry,
  validatePublicLocationDataset,
  validateProvincialCompatibilityDataset,
  validateXinyuCompanionDataset
};
