const OFFICIAL_GEOMETRY_TYPES = Object.freeze([
  "Point",
  "LineString",
  "MultiLineString",
  "Polygon",
  "MultiPolygon"
]);

const OFFICIAL_GEOMETRY_MEANINGS = Object.freeze([
  "reviewed-location-point",
  "visitor-reference-point",
  "compound-reference-point",
  "component-reference-point",
  "provider-located-project-reviewed-reference-point",
  "approximate-site-point",
  "generalized-reference-point",
  "reviewed-line",
  "approximate-line",
  "reviewed-boundary",
  "approximate-boundary",
  "generalized-reference-area",
  "uncertainty-area"
]);

const OFFICIAL_GEOMETRY_SOURCE_TYPES = Object.freeze([
  "official-published-geometry",
  "official-map-reference",
  "institutional-map-reference",
  "provider-map-reference",
  "project-reviewed-digitization",
  "project-generalized-reference"
]);

const OFFICIAL_GEOMETRY_PRECISIONS = Object.freeze([
  "reviewed",
  "approximate",
  "generalized",
  "uncertain"
]);

const OFFICIAL_GEOMETRY_METADATA_FIELDS = Object.freeze([
  "geometryMeaning",
  "geometrySourceType",
  "geometrySourceLabel",
  "geometrySourceUrl",
  "geometryReviewedAt",
  "geometryReviewNotes",
  "geometryPrecision",
  "horizontalUncertaintyMetres"
]);

const GEOMETRY_MEANINGS_BY_TYPE = Object.freeze({
  Point: Object.freeze([
    "reviewed-location-point",
    "visitor-reference-point",
    "compound-reference-point",
    "component-reference-point",
    "provider-located-project-reviewed-reference-point",
    "approximate-site-point",
    "generalized-reference-point"
  ]),
  LineString: Object.freeze(["reviewed-line", "approximate-line"]),
  MultiLineString: Object.freeze(["reviewed-line", "approximate-line"]),
  Polygon: Object.freeze([
    "reviewed-boundary",
    "approximate-boundary",
    "generalized-reference-area",
    "uncertainty-area"
  ]),
  MultiPolygon: Object.freeze([
    "reviewed-boundary",
    "approximate-boundary",
    "generalized-reference-area",
    "uncertainty-area"
  ])
});

const GEOMETRY_MEANING_PRESENTATION_LABELS = Object.freeze({
  "reviewed-location-point": "Reviewed location",
  "visitor-reference-point": "Visitor reference point",
  "compound-reference-point": "Compound reference point",
  "component-reference-point": "Component reference point",
  "provider-located-project-reviewed-reference-point": "Provider-located project-reviewed reference point",
  "approximate-site-point": "Approximate site location",
  "generalized-reference-point": "Generalized project reference point",
  "reviewed-line": "Reviewed line",
  "approximate-line": "Approximate line",
  "reviewed-boundary": "Reviewed boundary",
  "approximate-boundary": "Approximate boundary",
  "generalized-reference-area": "Generalized project reference area",
  "uncertainty-area": "Uncertainty area"
});

const REQUIRED_PRECISION_BY_MEANING = Object.freeze({
  "reviewed-location-point": "reviewed",
  "provider-located-project-reviewed-reference-point": "approximate",
  "approximate-site-point": "approximate",
  "generalized-reference-point": "generalized",
  "reviewed-line": "reviewed",
  "approximate-line": "approximate",
  "reviewed-boundary": "reviewed",
  "approximate-boundary": "approximate",
  "generalized-reference-area": "generalized",
  "uncertainty-area": "uncertain"
});

const PROJECT_CREATED_SOURCE_TYPES = new Set([
  "project-reviewed-digitization",
  "project-generalized-reference"
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function addError(errors, condition, message) {
  if (!condition) errors.push(message);
}

function isSafeHttpsUrl(value) {
  if (!isNonEmptyString(value) || !/^https:\/\//i.test(value.trim())) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && isNonEmptyString(url.hostname);
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  if (typeof value !== "string") return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

function validatePosition(position, path, errors) {
  if (!Array.isArray(position) || position.length !== 2) {
    errors.push(`${path} must be exactly [longitude, latitude].`);
    return;
  }
  const [longitude, latitude] = position;
  addError(errors, Number.isFinite(longitude), `${path} longitude must be finite.`);
  addError(errors, Number.isFinite(latitude), `${path} latitude must be finite.`);
  if (Number.isFinite(longitude)) {
    addError(errors, longitude >= -180 && longitude <= 180, `${path} longitude is outside -180 to 180.`);
  }
  if (Number.isFinite(latitude)) {
    addError(errors, latitude >= -90 && latitude <= 90, `${path} latitude is outside -90 to 90.`);
  }
}

function validateLineStringCoordinates(coordinates, path, errors) {
  if (!Array.isArray(coordinates)) {
    errors.push(`${path} must be an array of positions.`);
    return;
  }
  addError(errors, coordinates.length >= 2, `${path} must contain at least two positions.`);
  coordinates.forEach((position, index) => validatePosition(position, `${path}[${index}]`, errors));
}

function positionsMatch(first, last) {
  return Array.isArray(first)
    && Array.isArray(last)
    && first.length === 2
    && last.length === 2
    && first[0] === last[0]
    && first[1] === last[1];
}

function validateLinearRing(ring, path, errors) {
  if (!Array.isArray(ring)) {
    errors.push(`${path} must be an array of positions.`);
    return;
  }
  addError(errors, ring.length >= 4, `${path} must contain at least four positions.`);
  ring.forEach((position, index) => validatePosition(position, `${path}[${index}]`, errors));
  if (ring.length > 0) {
    addError(
      errors,
      positionsMatch(ring[0], ring[ring.length - 1]),
      `${path} must be closed with identical first and last positions.`
    );
  }
}

function validatePolygonCoordinates(coordinates, path, errors) {
  if (!Array.isArray(coordinates)) {
    errors.push(`${path} must be an array of linear rings.`);
    return;
  }
  addError(errors, coordinates.length >= 1, `${path} must contain at least one linear ring.`);
  coordinates.forEach((ring, index) => validateLinearRing(ring, `${path}[${index}]`, errors));
}

function validateOfficialGeometry(geometry, { path = "geometry" } = {}) {
  const errors = [];
  if (!isPlainObject(geometry)) {
    errors.push(`${path} must be an object.`);
    return { valid: false, errors, geometryType: null };
  }

  if (geometry.type === "GeometryCollection") {
    errors.push(`${path}.type GeometryCollection is not supported.`);
    return { valid: false, errors, geometryType: geometry.type };
  }
  if (!OFFICIAL_GEOMETRY_TYPES.includes(geometry.type)) {
    errors.push(`${path}.type is unsupported.`);
    return { valid: false, errors, geometryType: geometry.type || null };
  }

  const coordinatesPath = `${path}.coordinates`;
  switch (geometry.type) {
    case "Point":
      validatePosition(geometry.coordinates, coordinatesPath, errors);
      break;
    case "LineString":
      validateLineStringCoordinates(geometry.coordinates, coordinatesPath, errors);
      break;
    case "MultiLineString":
      if (!Array.isArray(geometry.coordinates)) {
        errors.push(`${coordinatesPath} must be an array of LineStrings.`);
      } else {
        addError(errors, geometry.coordinates.length >= 1, `${coordinatesPath} must contain at least one LineString.`);
        geometry.coordinates.forEach((line, index) => (
          validateLineStringCoordinates(line, `${coordinatesPath}[${index}]`, errors)
        ));
      }
      break;
    case "Polygon":
      validatePolygonCoordinates(geometry.coordinates, coordinatesPath, errors);
      break;
    case "MultiPolygon":
      if (!Array.isArray(geometry.coordinates)) {
        errors.push(`${coordinatesPath} must be an array of Polygons.`);
      } else {
        addError(errors, geometry.coordinates.length >= 1, `${coordinatesPath} must contain at least one Polygon.`);
        geometry.coordinates.forEach((polygon, index) => (
          validatePolygonCoordinates(polygon, `${coordinatesPath}[${index}]`, errors)
        ));
      }
      break;
    default:
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    geometryType: geometry.type
  };
}

function deriveLegacyPointGeometryMeaning(properties = {}) {
  if (
    properties.displayLocationType === "component-reference-point"
    || properties.publicLocationMeaning === "component-reference"
  ) {
    return "component-reference-point";
  }
  if (
    properties.displayLocationType === "visitor-reference-point"
    || properties.publicLocationMeaning === "visitor-reference"
  ) {
    return "visitor-reference-point";
  }
  if (
    properties.displayLocationType === "compound-centroid"
    || properties.publicLocationMeaning === "heritage-compound-centre"
  ) {
    return "compound-reference-point";
  }
  if (
    properties.markerClass === "generalized"
    || properties.locationPrecision === "generalized"
    || ["generalized-locality", "generalized-area-reference"].includes(properties.displayLocationType)
  ) {
    return "generalized-reference-point";
  }
  if (
    properties.displayLocationType === "site-point"
    && (
      properties.locationPrecision === "approximate"
      || properties.publicationLocationPolicy === "approximate"
    )
  ) {
    return "approximate-site-point";
  }
  return "reviewed-location-point";
}

function hasGeometryMetadata(properties) {
  return isPlainObject(properties)
    && OFFICIAL_GEOMETRY_METADATA_FIELDS.some((field) => properties[field] !== undefined);
}

function validateOfficialGeometryMetadata(
  properties,
  geometryType,
  { path = "properties", allowLegacyPoint = true } = {}
) {
  const errors = [];
  if (!isPlainObject(properties)) {
    errors.push(`${path} must be an object.`);
    return { valid: false, errors, geometryMeaning: null, legacyPoint: false };
  }

  const legacyPoint = geometryType === "Point" && allowLegacyPoint && !hasGeometryMetadata(properties);
  if (legacyPoint) {
    return {
      valid: true,
      errors,
      geometryMeaning: deriveLegacyPointGeometryMeaning(properties),
      legacyPoint: true
    };
  }

  addError(
    errors,
    OFFICIAL_GEOMETRY_MEANINGS.includes(properties.geometryMeaning),
    `${path}.geometryMeaning is unsupported.`
  );
  addError(
    errors,
    OFFICIAL_GEOMETRY_SOURCE_TYPES.includes(properties.geometrySourceType),
    `${path}.geometrySourceType is unsupported.`
  );
  addError(
    errors,
    isNonEmptyString(properties.geometrySourceLabel),
    `${path}.geometrySourceLabel must be a non-empty string.`
  );
  addError(
    errors,
    OFFICIAL_GEOMETRY_PRECISIONS.includes(properties.geometryPrecision),
    `${path}.geometryPrecision is unsupported.`
  );

  if (properties.geometrySourceUrl !== undefined && properties.geometrySourceUrl !== null) {
    addError(
      errors,
      isSafeHttpsUrl(properties.geometrySourceUrl),
      `${path}.geometrySourceUrl must be a valid HTTPS URL when present.`
    );
  }
  if (properties.geometryReviewedAt !== undefined && properties.geometryReviewedAt !== null) {
    addError(
      errors,
      isIsoDate(properties.geometryReviewedAt),
      `${path}.geometryReviewedAt must use a valid YYYY-MM-DD date when present.`
    );
  }
  if (properties.geometryReviewNotes !== undefined && properties.geometryReviewNotes !== null) {
    addError(
      errors,
      isNonEmptyString(properties.geometryReviewNotes),
      `${path}.geometryReviewNotes must be a non-empty string when present.`
    );
  }
  if (PROJECT_CREATED_SOURCE_TYPES.has(properties.geometrySourceType)) {
    addError(
      errors,
      isNonEmptyString(properties.geometryReviewNotes),
      `${path}.geometryReviewNotes is required for project-created geometry.`
    );
  }

  const uncertainty = properties.horizontalUncertaintyMetres;
  if (uncertainty !== undefined && uncertainty !== null) {
    addError(
      errors,
      Number.isFinite(uncertainty) && uncertainty >= 0,
      `${path}.horizontalUncertaintyMetres must be a finite non-negative number when present.`
    );
  }
  if (["approximate", "generalized", "uncertain"].includes(properties.geometryPrecision)) {
    addError(
      errors,
      Number.isFinite(uncertainty) && uncertainty >= 0,
      `${path}.horizontalUncertaintyMetres is required for approximate, generalized, or uncertain geometry.`
    );
  }

  const allowedMeanings = GEOMETRY_MEANINGS_BY_TYPE[geometryType] || [];
  addError(
    errors,
    allowedMeanings.includes(properties.geometryMeaning),
    `${path}.geometryMeaning is incompatible with ${geometryType || "the geometry type"}.`
  );

  const requiredPrecision = REQUIRED_PRECISION_BY_MEANING[properties.geometryMeaning];
  if (requiredPrecision) {
    addError(
      errors,
      properties.geometryPrecision === requiredPrecision,
      `${path}.geometryPrecision must be ${requiredPrecision} for ${properties.geometryMeaning}.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    geometryMeaning: properties.geometryMeaning || null,
    legacyPoint: false
  };
}

function getOfficialGeometryMeaningLabel(geometryMeaning) {
  return GEOMETRY_MEANING_PRESENTATION_LABELS[geometryMeaning] || null;
}

export {
  GEOMETRY_MEANINGS_BY_TYPE,
  OFFICIAL_GEOMETRY_MEANINGS,
  OFFICIAL_GEOMETRY_METADATA_FIELDS,
  OFFICIAL_GEOMETRY_PRECISIONS,
  OFFICIAL_GEOMETRY_SOURCE_TYPES,
  OFFICIAL_GEOMETRY_TYPES,
  deriveLegacyPointGeometryMeaning,
  getOfficialGeometryMeaningLabel,
  hasGeometryMetadata,
  validateOfficialGeometry,
  validateOfficialGeometryMetadata
};
