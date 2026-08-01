import { getOfficialMapCategory } from "./official-map-categories.js?v=2026-07-27-official-category-filters";
import {
  validateOfficialGeometry,
  validateOfficialGeometryMetadata
} from "./official-geometry-schema.js?v=2026-08-01-xinyu-point-batch";
import {
  getFeatureGeometryMeaning,
  getOfficialGeometryRenderPresentation,
  getOfficialGeometrySourceLabel,
  prepareOfficialGeometryRenderModels
} from "./official-geometry-rendering.js?v=2026-08-01-xinyu-point-batch";

const SUPPORTED_SCHEMA_VERSION = "2.0.0";
const PROVINCIAL_HERITAGE_DATASET_ID = "jiangxi-provincial-protected-heritage-map";
const PROVINCIAL_HERITAGE_SOURCE_RECORD_COUNT = 17;
const PROVINCIAL_HERITAGE_LOADING_MESSAGE = "Loading provincial heritage preview…";
const PROVINCIAL_HERITAGE_EMPTY_MESSAGE = "No approved provincial heritage locations are available to display yet.";
const PROVINCIAL_HERITAGE_FAILURE_MESSAGE = "The provincial heritage preview could not be loaded.";
const PROJECT_COORDINATE_PROVENANCE = "Displayed location: Alex's Photo Board reviewed public-location decision, not an official designation coordinate.";
const PROJECT_GEOMETRY_CAUTION = "This geometry is a project reference or approximation, not an official legal boundary.";

const SUPPORTED_CONFIDENCE = new Set(["High", "Medium"]);
const SUPPORTED_PUBLICATION_POLICIES = new Set(["exact", "approximate", "generalized"]);
const SUPPORTED_MARKER_CLASSES = new Set(["reviewed", "generalized"]);
const SUPPORTED_LOCATION_MEANINGS = new Set([
  "heritage-feature",
  "heritage-compound-centre",
  "public-entrance",
  "visitor-reference",
  "component-reference",
  "official-locality-centre",
  "representative-area"
]);
const REVIEWED_DISPLAY_MEANINGS = new Map([
  ["site-point", new Set(["heritage-feature"])],
  ["compound-centroid", new Set(["heritage-compound-centre"])],
  ["public-entrance", new Set(["public-entrance"])],
  ["visitor-reference-point", new Set(["visitor-reference"])],
  ["component-reference-point", new Set(["component-reference"])]
]);
const GENERALIZED_DISPLAY_MEANINGS = new Map([
  ["generalized-locality", new Set(["official-locality-centre"])],
  ["generalized-area-reference", new Set(["representative-area"])]
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

function normalizeHttpsUrl(value) {
  if (!isNonEmptyString(value)) return null;
  const candidate = value.trim();
  if (!/^https:\/\//i.test(candidate)) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && isNonEmptyString(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
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

  const geometryType = isPlainObject(feature.geometry) ? feature.geometry.type : null;
  const isPointFeature = geometryType === "Point";
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
      "publicLocationNote",
      "sourceUrl",
      "sourceAccessedDate",
      "projectLocationProvenance"
    ].forEach((key) => {
      addError(errors, properties[key] !== undefined && properties[key] !== null, `${path}.properties.${key} is required.`);
    });
    if (isPointFeature) {
      [
        "locationPrecision",
        "publicLocationMeaning",
        "displayLocationType",
        "markerClass",
        "estimatedUncertaintyMeters"
      ].forEach((key) => {
        addError(errors, properties[key] !== undefined && properties[key] !== null, `${path}.properties.${key} is required.`);
      });
    }

    addError(errors, properties.recordId === feature.id, `${path}.properties.recordId must match feature.id.`);
    addError(errors, isNonEmptyString(properties.projectNameEn), `${path}.properties.projectNameEn must be a non-empty string.`);
    addError(errors, isNonEmptyString(properties.officialNameZh), `${path}.properties.officialNameZh must be a non-empty string.`);
    addError(errors, isNonEmptyString(properties.officialCategoryZh), `${path}.properties.officialCategoryZh must be a non-empty string.`);
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
    if (isPointFeature) {
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
      addError(
        errors,
        Number.isFinite(properties.estimatedUncertaintyMeters)
          && properties.estimatedUncertaintyMeters > 0,
        `${path}.properties.estimatedUncertaintyMeters must be a positive finite number.`
      );
      if (properties.geometryMeaning === "provider-located-project-reviewed-reference-point") {
        addError(
          errors,
          properties.representationStatus === "project-reviewed-interpretation",
          `${path}.properties.representationStatus must identify a project-reviewed interpretation.`
        );
      }
    }
    addError(
      errors,
      normalizeHttpsUrl(properties.sourceUrl) !== null,
      `${path}.properties.sourceUrl must be a valid HTTPS URL.`
    );

    if (isPointFeature && properties.markerClass === "reviewed") {
      addError(
        errors,
        ["exact", "approximate"].includes(properties.publicationLocationPolicy),
        `${path} reviewed markers require exact or approximate publication.`
      );
      addError(
        errors,
        properties.publicationLocationPolicy === "exact"
          ? ["exact", "near-exact"].includes(properties.locationPrecision)
          : properties.locationPrecision === "approximate",
        `${path} reviewed marker precision contradicts its publication policy.`
      );
      addError(
        errors,
        REVIEWED_DISPLAY_MEANINGS.get(properties.displayLocationType)
          ?.has(properties.publicLocationMeaning) === true,
        `${path} reviewed marker display type and public-location meaning are incompatible.`
      );
      addError(
        errors,
        properties.generalizationRadiusMeters === null,
        `${path} reviewed markers must not carry a generalization radius.`
      );
    }
    if (isPointFeature && properties.markerClass === "generalized") {
      addError(
        errors,
        properties.publicationLocationPolicy === "generalized"
          && properties.locationPrecision === "generalized",
        `${path} generalized markers require generalized policy and precision.`
      );
      addError(
        errors,
        GENERALIZED_DISPLAY_MEANINGS.get(properties.displayLocationType)
          ?.has(properties.publicLocationMeaning) === true,
        `${path} generalized marker display type and public-location meaning are incompatible.`
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
  const geometryResult = validateOfficialGeometry(geometry, { path: `${path}.geometry` });
  errors.push(...geometryResult.errors);
  if (isPlainObject(properties) && geometryResult.geometryType) {
    const metadataResult = validateOfficialGeometryMetadata(
      properties,
      geometryResult.geometryType,
      { path: `${path}.properties`, allowLegacyPoint: true }
    );
    errors.push(...metadataResult.errors);
  }

  return errors;
}

function validateProvincialHeritagePublicationGeoJson(value) {
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

function validateProvincialHeritageGeoJson(value) {
  const result = validateProvincialHeritagePublicationGeoJson(value);
  try {
    return {
      ...result,
      renderModels: prepareOfficialGeometryRenderModels(result.features)
    };
  } catch (error) {
    throw new ProvincialHeritageMapValidationError([
      `Official geometry rendering configuration is unsupported. ${error.message}`
    ]);
  }
}

function buildProvincialMarkerAccessibleName(feature) {
  const properties = feature?.properties || {};
  const title = isNonEmptyString(properties.projectNameEn)
    ? properties.projectNameEn.trim()
    : "Untitled provincial heritage record";
  const officialName = isNonEmptyString(properties.officialNameZh)
    ? ` (${properties.officialNameZh.trim()})`
    : "";
  const category = getOfficialMapCategory(properties.officialCategoryZh);
  const categoryLabel = category?.label || "Other official heritage";
  const locationLabel = properties.geometryMeaning
    ? getOfficialGeometryRenderPresentation(feature).meaningLabel
    : properties.markerClass === "generalized"
    ? "Generalized official reference"
    : properties.displayLocationType === "visitor-reference-point"
      ? "Visitor reference point"
      : properties.displayLocationType === "component-reference-point"
        ? "Component reference point"
      : (
        properties.displayLocationType === "compound-centroid"
          || properties.publicLocationMeaning === "heritage-compound-centre"
      )
        ? "Compound reference point (approximate project-reviewed location)"
      : properties.displayLocationType === "site-point" && properties.locationPrecision === "approximate"
        ? "Approximate site location"
        : properties.publicationLocationPolicy === "approximate"
          ? "Approximate reviewed location"
          : "Reviewed location";
  return `Open official protected heritage record: ${title}${officialName}; Map category: ${categoryLabel}; ${locationLabel}`;
}

function buildProvincialFeatureAccessibleName(feature) {
  if (feature?.geometry?.type === "Point") {
    return buildProvincialMarkerAccessibleName(feature);
  }
  const properties = feature?.properties || {};
  const title = isNonEmptyString(properties.projectNameEn)
    ? properties.projectNameEn.trim()
    : "Untitled provincial heritage record";
  const officialName = isNonEmptyString(properties.officialNameZh)
    ? ` (${properties.officialNameZh.trim()})`
    : "";
  const category = getOfficialMapCategory(properties.officialCategoryZh);
  const categoryLabel = category?.label || "Other official heritage";
  const presentation = getOfficialGeometryRenderPresentation(feature);
  return `Open official protected heritage record: ${title}${officialName}; Map category: ${categoryLabel}; ${presentation.meaningLabel}`;
}

function buildProvincialPopupData(feature) {
  const properties = feature?.properties || {};
  const geometryType = String(feature?.geometry?.type || "").trim();
  const geometryMeaning = getFeatureGeometryMeaning(feature);
  const geometryPresentation = geometryType
    ? getOfficialGeometryRenderPresentation(feature)
    : null;
  const geometrySourceType = String(properties.geometrySourceType || "").trim();
  const isProjectGeometry = [
    "project-reviewed-digitization",
    "project-generalized-reference"
  ].includes(geometrySourceType);
  const isQualifiedGeometry = [
    "approximate-line",
    "approximate-boundary",
    "generalized-reference-area",
    "uncertainty-area"
  ].includes(geometryMeaning);
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
    sourceUrl: normalizeHttpsUrl(properties.sourceUrl),
    sourceAccessedDate: String(properties.sourceAccessedDate || "").trim(),
    coordinateProvenance: PROJECT_COORDINATE_PROVENANCE,
    geometryType,
    geometryMeaning,
    geometryMeaningLabel: geometryPresentation?.meaningLabel || "",
    geometryPrecision: String(properties.geometryPrecision || "").trim(),
    horizontalUncertaintyMetres: properties.horizontalUncertaintyMetres,
    geometrySourceType,
    geometrySourceTypeLabel: getOfficialGeometrySourceLabel(geometrySourceType),
    geometrySourceLabel: String(properties.geometrySourceLabel || "").trim(),
    geometrySourceUrl: normalizeHttpsUrl(properties.geometrySourceUrl),
    geometryReviewedAt: String(properties.geometryReviewedAt || "").trim(),
    geometryReviewNotes: String(properties.geometryReviewNotes || "").trim(),
    representationStatus: String(properties.representationStatus || "").trim(),
    geometryCaution: geometryType !== "Point" && (isProjectGeometry || isQualifiedGeometry)
      ? PROJECT_GEOMETRY_CAUTION
      : ""
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
  buildProvincialFeatureAccessibleName,
  buildProvincialMarkerAccessibleName,
  buildProvincialPopupData,
  validateProvincialHeritageGeoJson,
  validateProvincialHeritagePublicationGeoJson
};
