import {
  cleanText,
  isHttpsUrl,
  normalizeCoordinate,
  normalizeCriteriaList
} from "./validation.js";
import { buildPromotionHistoryEntry } from "./audit.js";

const PROMOTION_STATUS = "promoted";
const DEFAULT_PROMOTED_RECORD_STATUS = "published";
const PROMOTION_ID_LIMIT = 120;
const PUBLIC_PROMOTION_TEXT_FIELDS = Object.freeze([
  "assetType",
  "area",
  "address",
  "city",
  "district",
  "province",
  "description",
  "localSignificanceSummary",
  "criteriaExplanation",
  "condition",
  "communityUse",
  "sourceReference"
]);
const PUBLIC_PROMOTION_EVIDENCE_RIGHTS_STATUSES = Object.freeze([
  "own-work",
  "permission-granted",
  "public-domain-or-open-license"
]);
const PRIVATE_PROMOTION_FIELDS = Object.freeze([
  "evidenceImageUrl",
  "evidenceImageCaption",
  "evidenceSourceCredit",
  "evidenceRightsStatus",
  "evidencePermissionConfirmed",
  "evidenceVisibility",
  "evidenceStoragePath",
  "evidenceFileName",
  "evidenceFileContentType",
  "evidenceFileSize",
  "evidenceUploadedAt",
  "evidenceUploadedByUid",
  "submittedByUid",
  "submitterEmail",
  "submitterDisplayName",
  "submissionAuthType",
  "nominatorEmail",
  "adminNotes",
  "adminHistoricInterest",
  "adminArchitecturalInterest",
  "adminCommunityValue",
  "adminConditionRisk",
  "adminAssessmentSummary",
  "reviewHistory",
  "promotedPlaceId",
  "promotedAt",
  "termsAccepted",
  "privacyAccepted",
  "organisationName"
]);

function getPromotionStatus() {
  return PROMOTION_STATUS;
}

function getDefaultPromotedRecordStatus() {
  return DEFAULT_PROMOTED_RECORD_STATUS;
}

function slugifyPromotionId(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, PROMOTION_ID_LIMIT);
}

function normalizePromotedPlaceId(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, PROMOTION_ID_LIMIT);
}

function getPromotedPlaceId(source = {}, fallbackId = "") {
  const sourceRecord = typeof source === "string" ? { title: source } : source || {};
  const nominationId = cleanText(sourceRecord.id) || cleanText(sourceRecord.nominationId) || cleanText(fallbackId);
  const fromTitle = slugifyPromotionId(sourceRecord.title);
  if (fromTitle) return fromTitle;

  const shortId = cleanText(nominationId)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  return `nomination-${shortId || "record"}`;
}

function normalizePromotionSource(source = {}) {
  const normalized = stripPrivateFieldsForPromotion(source);
  normalized.id = cleanText(source.id);
  normalized.title = cleanText(source.title);
  normalized.nominationStatus = cleanText(source.nominationStatus).toLowerCase();
  normalized.heritageCriteria = normalizeCriteriaList(source.heritageCriteria);

  PUBLIC_PROMOTION_TEXT_FIELDS.forEach((field) => {
    normalized[field] = cleanText(source[field]);
  });

  const lat = normalizeCoordinate(source.lat);
  const lng = normalizeCoordinate(source.lng);
  if (lat !== null) normalized.lat = lat;
  if (lng !== null) normalized.lng = lng;

  return normalized;
}

function getPromotionValidationErrors(source = {}) {
  const normalized = normalizePromotionSource(source);
  const errors = [];

  if (normalized.nominationStatus !== "approved") {
    errors.push("Only approved nominations can be promoted.");
  }
  if (!normalized.title) {
    errors.push("A promoted community place needs a title.");
  }

  return errors;
}

function validatePromotionSource(source = {}) {
  return getPromotionValidationErrors(source).length === 0;
}

function shouldAllowPromotion(source = {}) {
  return validatePromotionSource(source);
}

function stripPrivateFieldsForPromotion(value) {
  if (Array.isArray(value)) {
    return value.map(stripPrivateFieldsForPromotion);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((clean, [key, entry]) => {
    if (PRIVATE_PROMOTION_FIELDS.includes(key)) {
      return clean;
    }
    clean[key] = stripPrivateFieldsForPromotion(entry);
    return clean;
  }, {});
}

function addOptionalText(payload, field, value) {
  const cleanValue = cleanText(value);
  if (cleanValue) payload[field] = cleanValue;
}

function hasPromotableEvidenceImage(source = {}) {
  const evidenceImageUrl = cleanText(source.evidenceImageUrl);
  const rightsStatus = cleanText(source.evidenceRightsStatus);
  return Boolean(evidenceImageUrl)
    && isHttpsUrl(evidenceImageUrl)
    && source.evidencePermissionConfirmed === true
    && PUBLIC_PROMOTION_EVIDENCE_RIGHTS_STATUSES.includes(rightsStatus);
}

function addPromotedImageFields(payload, source = {}) {
  if (!hasPromotableEvidenceImage(source)) return;

  addOptionalText(payload, "imageUrl", source.evidenceImageUrl);
  addOptionalText(payload, "imageCaption", source.evidenceImageCaption);
  addOptionalText(payload, "imageCredit", source.evidenceSourceCredit);
  addOptionalText(payload, "imageRightsStatus", source.evidenceRightsStatus);

  // `place.js` currently renders the public image source line from `source`.
  // Use the reviewed evidence credit there so the public detail page explains
  // where the promoted image came from without exposing nomination-private fields.
  addOptionalText(payload, "source", source.evidenceSourceCredit);
}

function buildPublicPlacePayloadFromNomination(source = {}, options = {}) {
  const normalized = normalizePromotionSource(source);
  const placeId = normalizePromotedPlaceId(options.placeId) || getPromotedPlaceId(normalized, normalized.id);
  const payload = {
    id: placeId,
    title: normalized.title,
    category: normalized.assetType || cleanText(source.category) || "Community Place",
    recordStatus: cleanText(options.recordStatus) || getDefaultPromotedRecordStatus()
  };

  PUBLIC_PROMOTION_TEXT_FIELDS.forEach((field) => {
    addOptionalText(payload, field, normalized[field]);
  });

  addPromotedImageFields(payload, source);

  if (normalized.heritageCriteria.length > 0) {
    payload.heritageCriteria = normalized.heritageCriteria;
  }
  if (Number.isFinite(normalized.lat) && Number.isFinite(normalized.lng)) {
    payload.lat = normalized.lat;
    payload.lng = normalized.lng;
  }
  if (cleanText(options.dateAdded)) {
    payload.dateAdded = cleanText(options.dateAdded);
  }
  if (cleanText(options.lastReviewed)) {
    payload.lastReviewed = cleanText(options.lastReviewed);
  }
  if (options.createdAt !== undefined) {
    payload.createdAt = options.createdAt;
  }
  if (options.updatedAt !== undefined) {
    payload.updatedAt = options.updatedAt;
  }
  if (options.includeSourceNominationId === true && normalized.id) {
    payload.sourceNominationId = normalized.id;
  }

  return stripPrivateFieldsForPromotion(payload);
}

function buildPromotionHistoryEntryPayload(promotedPlaceId, options = {}) {
  return buildPromotionHistoryEntry(promotedPlaceId, {
    ...options,
    fromStatus: "approved",
    toStatus: getPromotionStatus()
  });
}

function buildPromotionUpdatePayload(promotedPlaceId, options = {}) {
  const payload = {
    nominationStatus: getPromotionStatus(),
    promotedPlaceId: normalizePromotedPlaceId(promotedPlaceId) || cleanText(promotedPlaceId)
  };

  if (Array.isArray(options.reviewHistory)) {
    payload.reviewHistory = options.reviewHistory;
  }
  if (options.promotedAt !== undefined) {
    payload.promotedAt = options.promotedAt;
  }
  if (options.updatedAt !== undefined) {
    payload.updatedAt = options.updatedAt;
  }

  return payload;
}

function getPromotionSummary(source = {}, options = {}) {
  const placeId = normalizePromotedPlaceId(options.placeId) || getPromotedPlaceId(source);
  const errors = getPromotionValidationErrors(source);

  return {
    allowed: errors.length === 0,
    placeId,
    status: cleanText(source.nominationStatus).toLowerCase(),
    title: cleanText(source.title),
    errors
  };
}

export {
  DEFAULT_PROMOTED_RECORD_STATUS,
  PRIVATE_PROMOTION_FIELDS,
  PROMOTION_ID_LIMIT,
  PROMOTION_STATUS,
  PUBLIC_PROMOTION_EVIDENCE_RIGHTS_STATUSES,
  PUBLIC_PROMOTION_TEXT_FIELDS,
  buildPromotionHistoryEntryPayload,
  buildPromotionUpdatePayload,
  buildPublicPlacePayloadFromNomination,
  getDefaultPromotedRecordStatus,
  getPromotedPlaceId,
  getPromotionStatus,
  getPromotionSummary,
  getPromotionValidationErrors,
  hasPromotableEvidenceImage,
  normalizePromotionSource,
  shouldAllowPromotion,
  stripPrivateFieldsForPromotion,
  validatePromotionSource
};
