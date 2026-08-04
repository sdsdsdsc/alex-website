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
  "horizontalUncertaintyMetres",
  "generalizedPointContract"
]);

const GENERALIZED_POINT_CONTRACT_VERSION = "phase-15c-19-v1";
const GENERALIZED_POINT_MANDATORY_LIMITATION = "Generalized reference location. This marker represents the documented general vicinity of the heritage record. It does not show the exact feature, centre, entrance, extent, or legal protection boundary.";
const GENERALIZED_POINT_BASIS_TYPES = new Set([
  "documented-support-area",
  "identity-linked-coordinate",
  "restricted-coordinate"
]);
const GENERALIZED_POINT_PRECISION_KINDS = new Set([
  "stated-accuracy",
  "notation-resolution",
  "estimated-from-source"
]);
const GENERALIZED_POINT_PUBLICATION_DECISIONS = new Set(["approved-for-publication"]);

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

function hasExactKeys(value, keys) {
  return isPlainObject(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());
}

function validateExactObject(errors, value, keys, path) {
  addError(errors, hasExactKeys(value, keys), `${path} must contain exactly: ${[...keys].sort().join(", ")}.`);
  return isPlainObject(value);
}

function validateFiniteNonNegative(errors, value, path) {
  addError(errors, Number.isFinite(value) && value >= 0, `${path} must be a finite non-negative number.`);
}

function hasProhibitedExactClaim(value) {
  return typeof value === "string"
    && /(?:shows?|marks?|is) (?:an? |the )?(?:exact (?:feature|centre|center|entrance|extent)|official (?:legal )?boundary|legal protection boundary)/i.test(value);
}

function validateGeneralizedPointContract(contract, { path = "generalizedPointContract" } = {}) {
  const errors = [];
  const topLevelKeys = [
    "contractVersion", "originalSpatialBasis", "sourceCoordinatePrecision",
    "datumInterpretations", "multiInterpretationEnvelope", "supportArea",
    "representativePoint", "intentionalGeneralization", "displayedCoordinatePrecision",
    "outwardCoverageMetres", "provenance", "mandatoryPublicLimitation",
    "candidateSpecificLimitation", "review", "representation"
  ];
  if (!validateExactObject(errors, contract, topLevelKeys, path)) {
    return { valid: false, errors };
  }

  addError(errors, contract.contractVersion === GENERALIZED_POINT_CONTRACT_VERSION, `${path}.contractVersion is unsupported.`);

  const basis = contract.originalSpatialBasis;
  if (validateExactObject(errors, basis, [
    "basisType", "sourceNotation", "coordinateReferenceSystem", "methodBasis",
    "publicEvidenceReference", "restrictedEvidenceReference"
  ], `${path}.originalSpatialBasis`)) {
    addError(errors, GENERALIZED_POINT_BASIS_TYPES.has(basis.basisType), `${path}.originalSpatialBasis.basisType is unsupported.`);
    ["sourceNotation", "coordinateReferenceSystem", "methodBasis"].forEach((key) => {
      addError(errors, isNonEmptyString(basis[key]), `${path}.originalSpatialBasis.${key} must be a non-empty string.`);
    });
    const reference = basis.publicEvidenceReference;
    if (validateExactObject(errors, reference, ["label", "url"], `${path}.originalSpatialBasis.publicEvidenceReference`)) {
      addError(errors, isNonEmptyString(reference.label), `${path}.originalSpatialBasis.publicEvidenceReference.label must be a non-empty string.`);
      addError(errors, isSafeHttpsUrl(reference.url), `${path}.originalSpatialBasis.publicEvidenceReference.url must be a valid HTTPS URL.`);
    }
    const restricted = basis.restrictedEvidenceReference;
    if (restricted !== null) {
      if (validateExactObject(errors, restricted, ["referenceId", "custodian", "accessStatus"], `${path}.originalSpatialBasis.restrictedEvidenceReference`)) {
        ["referenceId", "custodian", "accessStatus"].forEach((key) => {
          addError(errors, isNonEmptyString(restricted[key]), `${path}.originalSpatialBasis.restrictedEvidenceReference.${key} must be a non-empty string.`);
        });
      }
      addError(
        errors,
        !Object.keys(restricted || {}).some((key) => /coordinate|latitude|longitude/i.test(key)),
        `${path}.originalSpatialBasis.restrictedEvidenceReference must not expose restricted coordinates.`
      );
    }
  }

  const sourcePrecision = contract.sourceCoordinatePrecision;
  if (validateExactObject(errors, sourcePrecision, ["kind", "metres", "explanation"], `${path}.sourceCoordinatePrecision`)) {
    addError(errors, GENERALIZED_POINT_PRECISION_KINDS.has(sourcePrecision.kind), `${path}.sourceCoordinatePrecision.kind is unsupported.`);
    validateFiniteNonNegative(errors, sourcePrecision.metres, `${path}.sourceCoordinatePrecision.metres`);
    addError(errors, isNonEmptyString(sourcePrecision.explanation), `${path}.sourceCoordinatePrecision.explanation must be a non-empty string.`);
  }

  addError(errors, Array.isArray(contract.datumInterpretations) && contract.datumInterpretations.length > 0, `${path}.datumInterpretations must be a non-empty array.`);
  if (Array.isArray(contract.datumInterpretations)) {
    const names = [];
    contract.datumInterpretations.forEach((interpretation, index) => {
      const itemPath = `${path}.datumInterpretations[${index}]`;
      if (!validateExactObject(errors, interpretation, ["datum", "rationale", "transformationMethod", "frameAllowanceMetres"], itemPath)) return;
      ["datum", "rationale", "transformationMethod"].forEach((key) => {
        addError(errors, isNonEmptyString(interpretation[key]), `${itemPath}.${key} must be a non-empty string.`);
      });
      validateFiniteNonNegative(errors, interpretation.frameAllowanceMetres, `${itemPath}.frameAllowanceMetres`);
      names.push(interpretation.datum);
    });
    addError(errors, new Set(names).size === names.length, `${path}.datumInterpretations must not repeat a datum.`);
  }

  const envelope = contract.multiInterpretationEnvelope;
  if (validateExactObject(errors, envelope, ["applicable", "method", "maximumSeparationMetres"], `${path}.multiInterpretationEnvelope`)) {
    addError(errors, typeof envelope.applicable === "boolean", `${path}.multiInterpretationEnvelope.applicable must be boolean.`);
    addError(errors, isNonEmptyString(envelope.method), `${path}.multiInterpretationEnvelope.method must be a non-empty string.`);
    validateFiniteNonNegative(errors, envelope.maximumSeparationMetres, `${path}.multiInterpretationEnvelope.maximumSeparationMetres`);
    if (envelope.applicable) {
      addError(errors, contract.datumInterpretations.length >= 2, `${path}.multiInterpretationEnvelope requires at least two datum interpretations.`);
      addError(errors, envelope.maximumSeparationMetres > 0, `${path}.multiInterpretationEnvelope.maximumSeparationMetres must be positive when applicable.`);
    } else {
      addError(errors, envelope.method === "not-applicable" && envelope.maximumSeparationMetres === 0, `${path}.multiInterpretationEnvelope must use the explicit not-applicable zero form.`);
    }
  }

  const support = contract.supportArea;
  if (validateExactObject(errors, support, ["meaning", "shape", "extentDescription", "maximumDistanceFromRepresentativeMetres", "sourceReferenceLabel", "sourceReferenceUrl"], `${path}.supportArea`)) {
    ["meaning", "shape", "extentDescription", "sourceReferenceLabel"].forEach((key) => {
      addError(errors, isNonEmptyString(support[key]), `${path}.supportArea.${key} must be a non-empty string.`);
    });
    addError(errors, isSafeHttpsUrl(support.sourceReferenceUrl), `${path}.supportArea.sourceReferenceUrl must be a valid HTTPS URL.`);
    addError(errors, Number.isFinite(support.maximumDistanceFromRepresentativeMetres) && support.maximumDistanceFromRepresentativeMetres > 0, `${path}.supportArea.maximumDistanceFromRepresentativeMetres must be positive.`);
  }

  const representative = contract.representativePoint;
  if (validateExactObject(errors, representative, ["method", "methodVersion", "selectionRule"], `${path}.representativePoint`)) {
    ["method", "methodVersion", "selectionRule"].forEach((key) => {
      addError(errors, isNonEmptyString(representative[key]), `${path}.representativePoint.${key} must be a non-empty string.`);
    });
  }

  const generalization = contract.intentionalGeneralization;
  if (validateExactObject(errors, generalization, ["method", "displacementMetres", "explanation"], `${path}.intentionalGeneralization`)) {
    ["method", "explanation"].forEach((key) => {
      addError(errors, isNonEmptyString(generalization[key]), `${path}.intentionalGeneralization.${key} must be a non-empty string.`);
    });
    validateFiniteNonNegative(errors, generalization.displacementMetres, `${path}.intentionalGeneralization.displacementMetres`);
  }

  const displayedPrecision = contract.displayedCoordinatePrecision;
  if (validateExactObject(errors, displayedPrecision, ["decimalPlaces", "approximateResolutionMetres"], `${path}.displayedCoordinatePrecision`)) {
    addError(errors, Number.isInteger(displayedPrecision.decimalPlaces) && displayedPrecision.decimalPlaces >= 0 && displayedPrecision.decimalPlaces <= 4, `${path}.displayedCoordinatePrecision.decimalPlaces must be an integer from 0 to 4.`);
    addError(errors, Number.isFinite(displayedPrecision.approximateResolutionMetres) && displayedPrecision.approximateResolutionMetres > 0, `${path}.displayedCoordinatePrecision.approximateResolutionMetres must be positive.`);
    const minimumResolution = 100000 * (10 ** -displayedPrecision.decimalPlaces);
    addError(errors, displayedPrecision.approximateResolutionMetres >= minimumResolution, `${path}.displayedCoordinatePrecision.approximateResolutionMetres is sharper than the declared decimal precision supports.`);
  }

  addError(errors, Number.isFinite(contract.outwardCoverageMetres) && contract.outwardCoverageMetres > 0, `${path}.outwardCoverageMetres must be positive.`);
  const maximumFrameAllowance = Array.isArray(contract.datumInterpretations)
    ? Math.max(0, ...contract.datumInterpretations.map(({ frameAllowanceMetres }) => Number.isFinite(frameAllowanceMetres) ? frameAllowanceMetres : 0))
    : 0;
  const minimumCoverage = (support?.maximumDistanceFromRepresentativeMetres || 0)
    + (sourcePrecision?.metres || 0)
    + maximumFrameAllowance
    + (generalization?.displacementMetres || 0);
  addError(errors, contract.outwardCoverageMetres >= minimumCoverage, `${path}.outwardCoverageMetres does not cover the separately recorded support, source precision, transformation, and generalization quantities.`);

  const provenance = contract.provenance;
  if (validateExactObject(errors, provenance, ["spatialBasis", "limitation"], `${path}.provenance`)) {
    ["spatialBasis", "limitation"].forEach((key) => {
      const reference = provenance[key];
      const refPath = `${path}.provenance.${key}`;
      if (!validateExactObject(errors, reference, ["label", "url", "accessedDate"], refPath)) return;
      addError(errors, isNonEmptyString(reference.label), `${refPath}.label must be a non-empty string.`);
      addError(errors, isSafeHttpsUrl(reference.url), `${refPath}.url must be a valid HTTPS URL.`);
      addError(errors, isIsoDate(reference.accessedDate), `${refPath}.accessedDate must use a valid YYYY-MM-DD date.`);
    });
  }

  addError(errors, contract.mandatoryPublicLimitation === GENERALIZED_POINT_MANDATORY_LIMITATION, `${path}.mandatoryPublicLimitation must use the controlled public wording.`);
  addError(errors, isNonEmptyString(contract.candidateSpecificLimitation) && contract.candidateSpecificLimitation !== contract.mandatoryPublicLimitation, `${path}.candidateSpecificLimitation must be a separate additive limitation.`);
  addError(
    errors,
    typeof contract.candidateSpecificLimitation === "string"
      && !hasProhibitedExactClaim(contract.candidateSpecificLimitation),
    `${path}.candidateSpecificLimitation must not claim an exact feature, centre, entrance, extent, or legal boundary.`
  );

  const review = contract.review;
  if (validateExactObject(errors, review, ["evidenceReviewer", "reviewDate", "policyVersion", "accountableRole", "publicationDecision"], `${path}.review`)) {
    ["evidenceReviewer", "accountableRole"].forEach((key) => addError(errors, isNonEmptyString(review[key]), `${path}.review.${key} must be a non-empty string.`));
    addError(errors, isIsoDate(review.reviewDate), `${path}.review.reviewDate must use a valid YYYY-MM-DD date.`);
    addError(errors, review.policyVersion === "Phase 15C-17", `${path}.review.policyVersion must be Phase 15C-17.`);
    addError(errors, GENERALIZED_POINT_PUBLICATION_DECISIONS.has(review.publicationDecision), `${path}.review.publicationDecision is unsupported.`);
  }

  const representation = contract.representation;
  if (validateExactObject(errors, representation, ["identityId", "representationId", "status", "supersedesRepresentationIds", "supersessionHistoryReference"], `${path}.representation`)) {
    ["identityId", "representationId", "supersessionHistoryReference"].forEach((key) => addError(errors, isNonEmptyString(representation[key]), `${path}.representation.${key} must be a non-empty string.`));
    addError(errors, representation.status === "active", `${path}.representation.status must be active.`);
    addError(errors, Array.isArray(representation.supersedesRepresentationIds), `${path}.representation.supersedesRepresentationIds must be an array.`);
    if (Array.isArray(representation.supersedesRepresentationIds)) {
      addError(errors, new Set(representation.supersedesRepresentationIds).size === representation.supersedesRepresentationIds.length, `${path}.representation.supersedesRepresentationIds must not contain duplicates.`);
      representation.supersedesRepresentationIds.forEach((value, index) => addError(errors, isNonEmptyString(value), `${path}.representation.supersedesRepresentationIds[${index}] must be a non-empty string.`));
      addError(errors, !representation.supersedesRepresentationIds.includes(representation.representationId), `${path}.representation cannot supersede itself.`);
    }
  }

  return { valid: errors.length === 0, errors };
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

  const isGeneralizedPoint = geometryType === "Point" && properties.geometryMeaning === "generalized-reference-point";
  addError(
    errors,
    isGeneralizedPoint === (properties.generalizedPointContract !== undefined),
    `${path}.generalizedPointContract must be present only for generalized-reference-point Point geometry.`
  );
  if (isGeneralizedPoint) {
    addError(errors, properties.geometrySourceType === "project-generalized-reference", `${path}.geometrySourceType must be project-generalized-reference for a Generalized reference Point.`);
    errors.push(...validateGeneralizedPointContract(properties.generalizedPointContract, {
      path: `${path}.generalizedPointContract`
    }).errors);
    const coverage = properties.generalizedPointContract?.outwardCoverageMetres;
    addError(errors, properties.horizontalUncertaintyMetres === coverage, `${path}.horizontalUncertaintyMetres must equal generalizedPointContract.outwardCoverageMetres as the legacy outward-coverage summary.`);
    addError(errors, !hasProhibitedExactClaim(properties.geometryReviewNotes), `${path}.geometryReviewNotes must not claim an exact feature, centre, entrance, extent, or legal boundary.`);
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
  GENERALIZED_POINT_CONTRACT_VERSION,
  GENERALIZED_POINT_MANDATORY_LIMITATION,
  deriveLegacyPointGeometryMeaning,
  getOfficialGeometryMeaningLabel,
  hasGeometryMetadata,
  validateOfficialGeometry,
  validateOfficialGeometryMetadata,
  validateGeneralizedPointContract
};
