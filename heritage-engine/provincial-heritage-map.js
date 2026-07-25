const SUPPORTED_SCHEMA_VERSION = "2.0.0";
const PROVINCIAL_HERITAGE_DATASET_ID = "jiangxi-provincial-protected-heritage-map";
const PROVINCIAL_HERITAGE_SOURCE_RECORD_COUNT = 11;
const PROVINCIAL_HERITAGE_LOADING_MESSAGE = "Loading provincial heritage preview…";
const PROVINCIAL_HERITAGE_EMPTY_MESSAGE = "No approved provincial heritage locations are available to display yet.";
const PROVINCIAL_HERITAGE_FAILURE_MESSAGE = "The provincial heritage preview could not be loaded.";
const PROJECT_COORDINATE_PROVENANCE = "Displayed location: Alex's Photo Board reviewed public-location decision, not an official designation coordinate.";

const SUPPORTED_CONFIDENCE = new Set(["High", "Medium"]);
const SUPPORTED_PUBLICATION_POLICIES = new Set(["exact", "approximate", "generalized"]);
const SUPPORTED_MARKER_CLASSES = new Set(["reviewed", "generalized"]);
const SUPPORTED_LOCATION_MEANINGS = new Set([
  "heritage-feature",
  "heritage-compound-centre",
  "public-entrance",
  "visitor-reference",
  "official-locality-centre",
  "representative-area"
]);

class ProvincialHeritageMapValidationError extends Error {
  constructor(errors) {
    super(`Provincial heritage GeoJSON validation failed:\n- ${errors.join("\n- ")}`);
    this.name = "ProvincialHeritageMapValidationError";
    this.errors = errors;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function addError(errors, condition, message) {
  if (!condition) errors.push(message);
}

function validateFeature(feature, index, seenIds) {
  const errors = [];
  const path = `features[${index}]`;
  addError(errors, isPlainObject(feature), `${path} must be an object.`);
  if (!isPlainObject(feature)) return errors;

  addError(errors, feature.type === "Feature", `${path}.type must be Feature.`);
  addError(errors, isNonEmptyString(feature.id), `${path}.id must be a non-empty string.`);

  if (isNonEmptyString(feature.id)) {
    addError(errors, !seenIds.has(feature.id), `${path}.id duplicates ${feature.id}.`);
    seenIds.add(feature.id);
  }

  const properties = feature.properties;
  addError(errors, isPlainObject(properties), `${path}.properties must be an object.`);
  if (isPlainObject(properties)) {
    [
      "recordId",
      "projectNameEn",
      "officialNameZh",
      "protectionLevelZh",
      "officialCategoryZh",
      "officialLocationTextZh",
      "locationEvidenceConfidence",
      "coordinateReferenceSystem",
      "publicationLocationPolicy",
      "locationPrecision",
      "publicLocationMeaning",
      "displayLocationType",
      "markerClass",
      "publicLocationNote",
      "sourceAccessedDate",
      "projectLocationProvenance"
    ].forEach((key) => {
      addError(errors, properties[key] !== undefined && properties[key] !== null, `${path}.properties.${key} is required.`);
    });

    addError(errors, properties.recordId === feature.id, `${path}.properties.recordId must match feature.id.`);
    addError(errors, isNonEmptyString(properties.projectNameEn), `${path}.properties.projectNameEn must be a non-empty string.`);
    addError(errors, isNonEmptyString(properties.officialNameZh), `${path}.properties.officialNameZh must be a non-empty string.`);
    addError(
      errors,
      isNonEmptyString(properties.sourceTitleZh) || isNonEmptyString(properties.sourceIssuerZh),
      `${path}.properties must include an official source title or issuer.`
    );
    addError(
      errors,
      SUPPORTED_CONFIDENCE.has(properties.locationEvidenceConfidence),
      `${path}.properties.locationEvidenceConfidence must be High or Medium.`
    );
    addError(
      errors,
      properties.coordinateReferenceSystem === "WGS84",
      `${path}.properties.coordinateReferenceSystem must be WGS84.`
    );
    addError(
      errors,
      SUPPORTED_PUBLICATION_POLICIES.has(properties.publicationLocationPolicy),
      `${path}.properties.publicationLocationPolicy is not public and supported.`
    );
    addError(
      errors,
      SUPPORTED_MARKER_CLASSES.has(properties.markerClass),
      `${path}.properties.markerClass is unsupported.`
    );
    addError(
      errors,
      SUPPORTED_LOCATION_MEANINGS.has(properties.publicLocationMeaning),
      `${path}.properties.publicLocationMeaning is unsupported.`
    );

    if (properties.markerClass === "reviewed") {
      addError(
        errors,
        ["exact", "approximate"].includes(properties.publicationLocationPolicy),
        `${path} reviewed markers require exact or approximate publication.`
      );
      addError(
        errors,
        properties.generalizationRadiusMeters === null,
        `${path} reviewed markers must not carry a generalization radius.`
      );
    }
    if (properties.markerClass === "generalized") {
      addError(
        errors,
        properties.publicationLocationPolicy === "generalized"
          && properties.locationPrecision === "generalized",
        `${path} generalized markers require generalized policy and precision.`
      );
      addError(
        errors,
        Number.isFinite(properties.generalizationRadiusMeters)
          && properties.generalizationRadiusMeters > 0,
        `${path} generalized markers require a positive radius.`
      );
    }
  }

  const geometry = feature.geometry;
  addError(errors, isPlainObject(geometry), `${path}.geometry must be an object.`);
  if (!isPlainObject(geometry)) return errors;

  addError(errors, geometry.type === "Point", `${path}.geometry.type must be Point.`);
  addError(
    errors,
    Array.isArray(geometry.coordinates) && geometry.coordinates.length === 2,
    `${path}.geometry.coordinates must be [longitude, latitude].`
  );

  if (Array.isArray(geometry.coordinates) && geometry.coordinates.length === 2) {
    const [longitude, latitude] = geometry.coordinates;
    addError(errors, Number.isFinite(longitude), `${path} longitude must be finite.`);
    addError(errors, Number.isFinite(latitude), `${path} latitude must be finite.`);
    if (Number.isFinite(longitude)) {
      addError(errors, longitude >= -180 && longitude <= 180, `${path} longitude is outside -180 to 180.`);
    }
    if (Number.isFinite(latitude)) {
      addError(errors, latitude >= -90 && latitude <= 90, `${path} latitude is outside -90 to 90.`);
    }
  }

  return errors;
}

function validateProvincialHeritageGeoJson(value) {
  const errors = [];
  addError(errors, isPlainObject(value), "GeoJSON must be an object.");
  if (!isPlainObject(value)) throw new ProvincialHeritageMapValidationError(errors);

  addError(errors, value.type === "FeatureCollection", "GeoJSON type must be FeatureCollection.");
  addError(errors, isPlainObject(value.metadata), "GeoJSON metadata must be an object.");
  addError(errors, Array.isArray(value.features), "GeoJSON features must be an array.");

  const metadata = value.metadata;
  if (isPlainObject(metadata)) {
    addError(errors, metadata.schemaVersion === SUPPORTED_SCHEMA_VERSION, "metadata.schemaVersion is unsupported.");
    addError(errors, metadata.datasetId === PROVINCIAL_HERITAGE_DATASET_ID, "metadata.datasetId is unsupported.");
    addError(
      errors,
      metadata.sourceRecordCount === PROVINCIAL_HERITAGE_SOURCE_RECORD_COUNT,
      `metadata.sourceRecordCount must be ${PROVINCIAL_HERITAGE_SOURCE_RECORD_COUNT}.`
    );
    addError(errors, Number.isInteger(metadata.featureCount) && metadata.featureCount >= 0, "metadata.featureCount must be a non-negative integer.");
    addError(
      errors,
      Number.isInteger(metadata.excludedRecordCount) && metadata.excludedRecordCount >= 0,
      "metadata.excludedRecordCount must be a non-negative integer."
    );

    if (Array.isArray(value.features)) {
      addError(errors, metadata.featureCount === value.features.length, "metadata.featureCount must equal features.length.");
    }
    if (Number.isInteger(metadata.featureCount) && Number.isInteger(metadata.excludedRecordCount)) {
      addError(
        errors,
        metadata.featureCount + metadata.excludedRecordCount === metadata.sourceRecordCount,
        "Feature and exclusion counts must equal sourceRecordCount."
      );
      const expectedStatus = metadata.featureCount === 0 ? "valid-empty" : "valid";
      addError(errors, metadata.generationStatus === expectedStatus, "metadata.generationStatus contradicts featureCount.");
    }
  }

  if (Array.isArray(value.features)) {
    const seenIds = new Set();
    value.features.forEach((feature, index) => {
      errors.push(...validateFeature(feature, index, seenIds));
    });
  }

  if (errors.length > 0) throw new ProvincialHeritageMapValidationError(errors);

  return {
    metadata: value.metadata,
    features: value.features,
    status: value.features.length === 0 ? "valid-empty" : "valid"
  };
}

function buildProvincialMarkerAccessibleName(feature) {
  const properties = feature?.properties || {};
  const title = isNonEmptyString(properties.projectNameEn)
    ? properties.projectNameEn.trim()
    : "Untitled provincial heritage record";
  const officialName = isNonEmptyString(properties.officialNameZh)
    ? ` (${properties.officialNameZh.trim()})`
    : "";
  const locationLabel = properties.markerClass === "generalized"
    ? ", generalized area reference"
    : properties.publicationLocationPolicy === "approximate"
      ? ", approximate reviewed location"
      : ", reviewed location";
  return `Open official protected heritage record: ${title}${officialName}${locationLabel}`;
}

function buildProvincialPopupData(feature) {
  const properties = feature?.properties || {};
  return {
    projectNameEn: String(properties.projectNameEn || "").trim(),
    officialNameZh: String(properties.officialNameZh || "").trim(),
    protectionLevelZh: String(properties.protectionLevelZh || "").trim(),
    officialCategoryZh: String(properties.officialCategoryZh || "").trim(),
    officialLocationTextZh: String(properties.officialLocationTextZh || "").trim(),
    locationEvidenceConfidence: String(properties.locationEvidenceConfidence || "").trim(),
    markerClass: String(properties.markerClass || "").trim(),
    displayLocationType: String(properties.displayLocationType || "").trim(),
    locationPrecision: String(properties.locationPrecision || "").trim(),
    publicLocationMeaning: String(properties.publicLocationMeaning || "").trim(),
    publicLocationNote: String(properties.publicLocationNote || "").trim(),
    estimatedUncertaintyMeters: properties.estimatedUncertaintyMeters,
    generalizationRadiusMeters: properties.generalizationRadiusMeters,
    sourceLabel: String(properties.sourceTitleZh || properties.sourceIssuerZh || "").trim(),
    sourceUrl: String(properties.sourceUrl || "").trim(),
    sourceAccessedDate: String(properties.sourceAccessedDate || "").trim(),
    coordinateProvenance: PROJECT_COORDINATE_PROVENANCE
  };
}

export {
  PROJECT_COORDINATE_PROVENANCE,
  PROVINCIAL_HERITAGE_DATASET_ID,
  PROVINCIAL_HERITAGE_EMPTY_MESSAGE,
  PROVINCIAL_HERITAGE_FAILURE_MESSAGE,
  PROVINCIAL_HERITAGE_LOADING_MESSAGE,
  PROVINCIAL_HERITAGE_SOURCE_RECORD_COUNT,
  ProvincialHeritageMapValidationError,
  SUPPORTED_SCHEMA_VERSION,
  buildProvincialMarkerAccessibleName,
  buildProvincialPopupData,
  validateProvincialHeritageGeoJson
};
