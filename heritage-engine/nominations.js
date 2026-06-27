import {
  NOMINATION_STATUSES,
  cleanText,
  isHttpsUrl,
  isValidEmail,
  normalizeCoordinate,
  normalizeCriteriaList
} from "./validation.js";

const SUBMISSION_ROLES = Object.freeze(["self", "someone-else", "organisation"]);
const EVIDENCE_RIGHTS_STATUSES = Object.freeze([
  "own-work",
  "permission-granted",
  "public-domain-or-open-license",
  "public-web-reference",
  "unknown-needs-review"
]);
const EVIDENCE_METADATA_TEST_MODES = Object.freeze(["rights", "visibility", "both"]);
const NOMINATION_PRIVATE_EVIDENCE_VISIBILITY = "nomination-private";
const PUBLIC_NOMINATION_FIELDS = Object.freeze([
  "title",
  "assetType",
  "area",
  "address",
  "lat",
  "lng",
  "description",
  "localSignificanceSummary",
  "heritageCriteria",
  "criteriaExplanation",
  "condition",
  "communityUse",
  "sourceReference",
  "evidenceImageUrl",
  "evidenceImageCaption",
  "evidenceSourceCredit",
  "evidenceRightsStatus",
  "evidencePermissionConfirmed",
  "evidenceVisibility",
  "nominatorDisplayName",
  "nominatorEmail",
  "organisationName",
  "submittedOnBehalfOf",
  "submittedByUid",
  "submitterEmail",
  "submitterDisplayName",
  "submissionAuthType",
  "termsAccepted",
  "privacyAccepted",
  "nominationStatus",
  "createdAt",
  "updatedAt",
  "submittedAt"
]);
const NOMINATION_CREATE_ALLOWED_FIELDS = Object.freeze([
  ...PUBLIC_NOMINATION_FIELDS,
  "evidenceCaption",
  "photoUrl",
  "photoDescription"
]);
const REQUIRED_NOMINATION_CREATE_FIELDS = Object.freeze([
  "title",
  "address",
  "description",
  "localSignificanceSummary",
  "heritageCriteria",
  "criteriaExplanation",
  "nominatorEmail",
  "submittedByUid",
  "submitterEmail",
  "submissionAuthType",
  "termsAccepted",
  "privacyAccepted",
  "nominationStatus",
  "createdAt",
  "updatedAt",
  "submittedAt"
]);
const DEBUG_EVIDENCE_FIELDS = Object.freeze([
  "evidenceImageUrl",
  "evidenceImageCaption",
  "evidenceSourceCredit",
  "evidenceRightsStatus",
  "evidencePermissionConfirmed",
  "evidenceVisibility"
]);
const PUBLIC_DISALLOWED_NOMINATION_FIELDS = Object.freeze([
  "adminNotes",
  "adminHistoricInterest",
  "adminArchitecturalInterest",
  "adminCommunityValue",
  "adminConditionRisk",
  "adminAssessmentSummary",
  "reviewHistory",
  "promotedPlaceId",
  "promotedAt",
  "communityPlaces"
]);
const FIELD_LIMITS = Object.freeze({
  title: 160,
  assetType: 100,
  area: 160,
  address: 1000,
  description: 5000,
  localSignificanceSummary: 2000,
  criteriaExplanation: 5000,
  condition: 1500,
  communityUse: 1500,
  sourceReference: 2000,
  evidenceImageUrl: 1000,
  evidenceImageCaption: 300,
  evidenceSourceCredit: 300,
  evidenceRightsStatus: 64,
  nominatorDisplayName: 120,
  nominatorEmail: 254,
  organisationName: 180
});
const REQUIRED_TEXT_FIELDS = Object.freeze([
  ["title", "Enter the place or asset name."],
  ["address", "Enter an address or clear location description."],
  ["description", "Describe the place."],
  ["localSignificanceSummary", "Explain why the place matters locally."],
  ["criteriaExplanation", "Explain the evidence for the selected criteria."],
  ["nominatorEmail", "Enter an email address for admin follow-up."]
]);

function getInitialNominationStatus() {
  return NOMINATION_STATUSES.includes("submitted") ? "submitted" : "submitted";
}

function normalizeEvidenceMetadataTestMode(value) {
  const mode = cleanText(value).toLowerCase();
  return EVIDENCE_METADATA_TEST_MODES.includes(mode) ? mode : "";
}

function normalizeNominationTextFields(values = {}) {
  return Object.keys(FIELD_LIMITS).reduce((normalized, field) => {
    const value = cleanText(values[field]);
    const limit = FIELD_LIMITS[field];
    if (limit && value.length > limit) {
      throw new Error(`${field} is too long.`);
    }
    normalized[field] = value;
    return normalized;
  }, {});
}

function normalizeNominationCoordinates(values = {}) {
  const lat = normalizeCoordinate(values.lat);
  const lng = normalizeCoordinate(values.lng);

  if (values.lat !== undefined && cleanText(values.lat) && (lat === null || lat < -90 || lat > 90)) {
    throw new Error("Enter a valid latitude.");
  }
  if (values.lng !== undefined && cleanText(values.lng) && (lng === null || lng < -180 || lng > 180)) {
    throw new Error("Enter a valid longitude.");
  }

  return { lat, lng };
}

function normalizeNominationCriteria(value) {
  return normalizeCriteriaList(value);
}

function validateNominationRequiredFields(values = {}) {
  const errors = [];

  REQUIRED_TEXT_FIELDS.forEach(([field, message]) => {
    if (!cleanText(values[field])) {
      errors.push(message);
    }
  });

  if (cleanText(values.nominatorEmail) && !isValidEmail(values.nominatorEmail)) {
    errors.push("Enter a valid email address.");
  }

  const criteria = normalizeNominationCriteria(values.heritageCriteria);
  if (criteria.length === 0) {
    errors.push("Select at least one community heritage criterion.");
  }

  return errors;
}

function validateNominationEvidenceFields(values = {}) {
  const errors = [];
  const evidenceImageUrl = cleanText(values.evidenceImageUrl);
  const evidencePermissionConfirmed = values.evidencePermissionConfirmed === true;

  if (evidenceImageUrl && !isHttpsUrl(evidenceImageUrl)) {
    errors.push("Evidence image URL must begin with https://.");
  }

  if (!evidenceImageUrl) {
    return errors;
  }

  if (!evidencePermissionConfirmed) {
    errors.push("Confirm that the evidence link can be shared for review.");
  }

  return errors;
}

function validateNominationAgreements(values = {}) {
  const requiredAcknowledgements = [
    "projectPositionAccepted",
    "reviewAccepted",
    "privacyAccepted",
    "termsAccepted"
  ];

  return requiredAcknowledgements.every((field) => values[field] === true)
    ? []
    : ["Accept all required terms and privacy acknowledgements."];
}

function validateSubmissionRole(value) {
  return SUBMISSION_ROLES.includes(cleanText(value))
    ? []
    : ["Select who the nomination is being submitted for."];
}

function getNominationValidationErrors(values = {}) {
  return [
    ...validateNominationRequiredFields(values),
    ...validateNominationEvidenceFields(values),
    ...validateNominationAgreements(values),
    ...validateSubmissionRole(values.submittedOnBehalfOf)
  ];
}

function stripPublicDisallowedNominationFields(value) {
  if (Array.isArray(value)) {
    return value.map(stripPublicDisallowedNominationFields);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((clean, [key, entry]) => {
    if (PUBLIC_DISALLOWED_NOMINATION_FIELDS.includes(key)) {
      return clean;
    }
    clean[key] = stripPublicDisallowedNominationFields(entry);
    return clean;
  }, {});
}

function addOptionalText(payload, field, value) {
  const cleanValue = cleanText(value);
  if (cleanValue) payload[field] = cleanValue;
}

function sanitizePublicNominationPayload(payload = {}) {
  return Object.entries(payload).reduce((clean, [key, entry]) => {
    if (!PUBLIC_NOMINATION_FIELDS.includes(key) || entry === undefined) {
      return clean;
    }

    if (
      entry === ""
      && [
        "assetType",
        "area",
        "condition",
        "communityUse",
        "sourceReference",
        "evidenceImageUrl",
        "evidenceImageCaption",
        "evidenceSourceCredit",
        "evidenceRightsStatus",
        "evidenceVisibility",
        "nominatorDisplayName",
        "organisationName",
        "submitterDisplayName"
      ].includes(key)
    ) {
      return clean;
    }

    clean[key] = entry;
    return clean;
  }, {});
}

function buildNominationOwnershipMetadata(user = {}) {
  const uid = cleanText(user.submittedByUid || user.uid);
  const submitterEmail = cleanText(user.submitterEmail || user.email);
  const submissionAuthType = cleanText(user.submissionAuthType) || "signedIn";

  if (!uid || !submitterEmail || submissionAuthType !== "signedIn") {
    throw new Error("Please sign in before submitting a place nomination.");
  }

  const ownership = {
    submittedByUid: uid,
    submitterEmail,
    submissionAuthType
  };

  const submitterDisplayName = cleanText(user.submitterDisplayName || user.displayName);
  if (submitterDisplayName) {
    ownership.submitterDisplayName = submitterDisplayName;
  }

  return ownership;
}

function buildSubmittedNominationPayload(values = {}, timestamps = {}) {
  const cleanValues = stripPublicDisallowedNominationFields(values);
  const textValues = normalizeNominationTextFields(cleanValues);
  const heritageCriteria = normalizeNominationCriteria(cleanValues.heritageCriteria);
  const evidenceMetadataTestMode = normalizeEvidenceMetadataTestMode(timestamps.evidenceMetadataTestMode);
  const errors = getNominationValidationErrors({ ...cleanValues, ...textValues, heritageCriteria });

  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  const payload = {
    title: textValues.title,
    address: textValues.address,
    description: textValues.description,
    localSignificanceSummary: textValues.localSignificanceSummary,
    heritageCriteria,
    criteriaExplanation: textValues.criteriaExplanation,
    nominatorEmail: textValues.nominatorEmail,
    submittedOnBehalfOf: cleanText(cleanValues.submittedOnBehalfOf),
    termsAccepted: true,
    privacyAccepted: true,
    nominationStatus: getInitialNominationStatus()
  };

  addOptionalText(payload, "assetType", textValues.assetType);
  addOptionalText(payload, "area", textValues.area);
  addOptionalText(payload, "condition", textValues.condition);
  addOptionalText(payload, "communityUse", textValues.communityUse);
  addOptionalText(payload, "sourceReference", textValues.sourceReference);
  addOptionalText(payload, "evidenceImageUrl", textValues.evidenceImageUrl);
  addOptionalText(payload, "evidenceImageCaption", textValues.evidenceImageCaption);
  addOptionalText(payload, "evidenceSourceCredit", textValues.evidenceSourceCredit);
  if (textValues.evidenceImageUrl) {
    payload.evidencePermissionConfirmed = cleanValues.evidencePermissionConfirmed === true;
    if (evidenceMetadataTestMode === "rights" || evidenceMetadataTestMode === "both") {
      addOptionalText(payload, "evidenceRightsStatus", textValues.evidenceRightsStatus);
    }
    if (evidenceMetadataTestMode === "visibility" || evidenceMetadataTestMode === "both") {
      payload.evidenceVisibility = NOMINATION_PRIVATE_EVIDENCE_VISIBILITY;
    }
  }
  addOptionalText(payload, "nominatorDisplayName", textValues.nominatorDisplayName);
  addOptionalText(payload, "organisationName", textValues.organisationName);

  const { lat, lng } = normalizeNominationCoordinates(cleanValues);
  if (lat !== null) payload.lat = lat;
  if (lng !== null) payload.lng = lng;

  ["createdAt", "updatedAt", "submittedAt"].forEach((field) => {
    if (timestamps[field]) payload[field] = timestamps[field];
  });

  if (timestamps.ownershipMetadata) {
    Object.assign(payload, buildNominationOwnershipMetadata(timestamps.ownershipMetadata));
  }

  return sanitizePublicNominationPayload(payload);
}

function buildNominationDraftFromFormValues(values = {}) {
  return stripPublicDisallowedNominationFields({
    ...values,
    heritageCriteria: normalizeNominationCriteria(values.heritageCriteria),
    ...normalizeNominationCoordinates(values)
  });
}

function getFieldType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function redactUid(uid) {
  const value = cleanText(uid);
  if (!value) return "";
  if (value.length <= 8) return `${value.slice(0, 1)}...${value.slice(-1)}`;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function buildNominationDebugSummary(payload = {}) {
  const keys = Object.keys(payload).sort();
  const fieldTypes = Object.fromEntries(keys.map((field) => [field, getFieldType(payload[field])]));
  const missingRequiredFields = REQUIRED_NOMINATION_CREATE_FIELDS.filter((field) => !keys.includes(field));
  const forbiddenExtraFields = keys.filter((field) => !NOMINATION_CREATE_ALLOWED_FIELDS.includes(field));
  const undefinedFields = Object.entries(payload)
    .filter(([, value]) => value === undefined)
    .map(([field]) => field)
    .sort();

  return {
    keys,
    fieldTypes,
    evidence: Object.fromEntries(DEBUG_EVIDENCE_FIELDS.map((field) => [field, payload[field]])),
    submittedByUidPresent: Boolean(cleanText(payload.submittedByUid)),
    submittedByUidRedacted: redactUid(payload.submittedByUid),
    submitterEmail: payload.submitterEmail || "",
    nominationStatus: payload.nominationStatus || "",
    submissionAuthType: payload.submissionAuthType || "",
    termsAccepted: payload.termsAccepted === true,
    privacyAccepted: payload.privacyAccepted === true,
    lat: payload.lat,
    latType: getFieldType(payload.lat),
    lng: payload.lng,
    lngType: getFieldType(payload.lng),
    missingRequiredFields,
    forbiddenExtraFields,
    undefinedFields
  };
}

export {
  EVIDENCE_METADATA_TEST_MODES,
  EVIDENCE_RIGHTS_STATUSES,
  FIELD_LIMITS,
  NOMINATION_PRIVATE_EVIDENCE_VISIBILITY,
  NOMINATION_CREATE_ALLOWED_FIELDS,
  PUBLIC_DISALLOWED_NOMINATION_FIELDS,
  PUBLIC_NOMINATION_FIELDS,
  REQUIRED_NOMINATION_CREATE_FIELDS,
  REQUIRED_TEXT_FIELDS,
  SUBMISSION_ROLES,
  buildNominationDebugSummary,
  buildNominationDraftFromFormValues,
  buildNominationOwnershipMetadata,
  buildSubmittedNominationPayload,
  getInitialNominationStatus,
  getNominationValidationErrors,
  normalizeEvidenceMetadataTestMode,
  normalizeNominationCoordinates,
  normalizeNominationCriteria,
  normalizeNominationTextFields,
  sanitizePublicNominationPayload,
  stripPublicDisallowedNominationFields,
  validateNominationAgreements,
  validateNominationEvidenceFields,
  validateNominationRequiredFields
};
