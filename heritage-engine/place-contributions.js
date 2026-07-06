import {
  cleanText,
  isHttpsUrl,
  isValidEmail
} from "./validation.js";

const PLACE_CONTRIBUTION_STATUSES = Object.freeze([
  "submitted",
  "approved",
  "rejected"
]);
const IMAGE_RIGHTS_STATUSES = Object.freeze([
  "own-work",
  "permission-granted",
  "public-domain-or-open-license",
  "public-web-reference",
  "unknown-needs-review"
]);
const CONTRIBUTION_IMAGE_UPLOAD_VISIBILITY = "contribution-private";
const CONTRIBUTION_IMAGE_UPLOAD_CONTENT_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);
const MAX_CONTRIBUTION_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const PUBLIC_PLACE_CONTRIBUTION_FIELDS = Object.freeze([
  "placeId",
  "placeTitleSnapshot",
  "contributionText",
  "imageUrl",
  "imageCaption",
  "imageCredit",
  "imageRightsStatus",
  "contributionStatus",
  "createdAt",
  "updatedAt",
  "reviewedAt"
]);
const PUBLIC_PLACE_IMAGE_PROMOTION_FIELDS = Object.freeze([
  "imageUrl",
  "imageCaption",
  "imageCredit",
  "imageRightsStatus",
  "promotedContributionId",
  "promotedContributionImageUrl",
  "promotedContributionImageCaption",
  "promotedContributionImageCredit",
  "promotedContributionImageRightsStatus",
  "promotedContributionImageAt",
  "updatedAt"
]);
const PRIVATE_PLACE_CONTRIBUTION_FIELDS = Object.freeze([
  "imagePermissionConfirmed",
  "submittedByUid",
  "submitterEmail",
  "submitterDisplayName",
  "reviewedByUid",
  "adminNotes",
  "reviewHistory",
  "imageStoragePath",
  "imageFileName",
  "imageFileContentType",
  "imageFileSize",
  "imageUploadedAt",
  "imageUploadedByUid",
  "imageUploadVisibility"
]);
const FIELD_LIMITS = Object.freeze({
  placeId: 160,
  placeTitleSnapshot: 160,
  contributionText: 5000,
  imageUrl: 1000,
  imageCaption: 300,
  imageCredit: 300,
  imageRightsStatus: 64,
  imageStoragePath: 1000,
  imageFileName: 255,
  imageFileContentType: 64,
  imageUploadedByUid: 120,
  imageUploadVisibility: 64,
  submitterEmail: 254,
  submitterDisplayName: 120,
  reviewedByUid: 120,
  adminNotes: 5000
});

function getInitialContributionStatus() {
  return "submitted";
}

function normalizeContributionStatus(status, fallback = "submitted") {
  const cleanStatus = cleanText(status).toLowerCase();
  if (PLACE_CONTRIBUTION_STATUSES.includes(cleanStatus)) return cleanStatus;
  return PLACE_CONTRIBUTION_STATUSES.includes(cleanText(fallback).toLowerCase())
    ? cleanText(fallback).toLowerCase()
    : "submitted";
}

function normalizeImageRightsStatus(status) {
  const cleanStatus = cleanText(status).toLowerCase();
  return IMAGE_RIGHTS_STATUSES.includes(cleanStatus) ? cleanStatus : "";
}

function escapeRegExp(value) {
  return cleanText(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidContributionImageStoragePath(storagePath, uid) {
  const cleanPath = cleanText(storagePath);
  const cleanUid = cleanText(uid);
  if (!cleanPath || !cleanUid || cleanPath.length > FIELD_LIMITS.imageStoragePath) return false;
  return new RegExp(`^place-contribution-images/${escapeRegExp(cleanUid)}/[^/]+/[^/]+$`).test(cleanPath);
}

function hasUploadedContributionImageMetadata(values = {}) {
  return [
    "imageStoragePath",
    "imageFileName",
    "imageFileContentType",
    "imageFileSize",
    "imageUploadedAt",
    "imageUploadedByUid",
    "imageUploadVisibility"
  ].some((field) => values[field] !== undefined && values[field] !== null && values[field] !== "");
}

function hasValidUploadedContributionImage(values = {}) {
  const normalized = normalizeContributionTextFields(values);
  const fileSize = values.imageFileSize;

  return isValidContributionImageStoragePath(normalized.imageStoragePath, values.submittedByUid)
    && normalized.imageFileName.length > 0
    && CONTRIBUTION_IMAGE_UPLOAD_CONTENT_TYPES.includes(normalized.imageFileContentType)
    && Number.isInteger(fileSize)
    && fileSize > 0
    && fileSize <= MAX_CONTRIBUTION_IMAGE_FILE_SIZE
    && values.imageUploadedAt !== undefined
    && values.imageUploadedAt !== null
    && normalized.imageUploadedByUid === cleanText(values.submittedByUid)
    && normalized.imageUploadVisibility === CONTRIBUTION_IMAGE_UPLOAD_VISIBILITY;
}

function normalizeContributionTextFields(values = {}) {
  const normalized = {};

  Object.keys(FIELD_LIMITS).forEach((field) => {
    const value = cleanText(values[field]);
    if (value.length > FIELD_LIMITS[field]) {
      throw new Error(`${field} is too long.`);
    }
    normalized[field] = value;
  });

  return normalized;
}

function validatePlaceContributionRequiredFields(values = {}) {
  const errors = [];
  const normalized = normalizeContributionTextFields(values);

  if (!normalized.placeId) {
    errors.push("Place ID is required.");
  }

  if (!cleanText(values.submittedByUid)) {
    errors.push("Signed-in submitter UID is required.");
  }

  if (!normalized.contributionText && !normalized.imageUrl && !hasUploadedContributionImageMetadata(values)) {
    errors.push("Contribution must include text and/or an image.");
  }

  if (normalized.submitterEmail && !isValidEmail(normalized.submitterEmail)) {
    errors.push("Submitter email must be valid.");
  }

  return errors;
}

function validatePlaceContributionImageFields(values = {}) {
  const errors = [];
  const normalized = normalizeContributionTextFields(values);

  if (normalized.imageUrl && !isHttpsUrl(normalized.imageUrl)) {
    errors.push("Image URL must begin with https://.");
  }

  if (normalized.imageRightsStatus && !normalizeImageRightsStatus(normalized.imageRightsStatus)) {
    errors.push("Image rights status is not recognised.");
  }

  if (hasUploadedContributionImageMetadata(values) && !hasValidUploadedContributionImage(values)) {
    errors.push("Uploaded image metadata is not valid.");
  }

  return errors;
}

function getPlaceContributionValidationErrors(values = {}) {
  return [
    ...validatePlaceContributionRequiredFields(values),
    ...validatePlaceContributionImageFields(values)
  ];
}

function validatePlaceContributionSubmission(values = {}) {
  return getPlaceContributionValidationErrors(values).length === 0;
}

function addOptionalText(payload, field, value) {
  const cleanValue = cleanText(value);
  if (cleanValue) payload[field] = cleanValue;
}

function addUploadedContributionImageMetadata(payload, values = {}, normalized = {}) {
  if (!hasValidUploadedContributionImage(values)) return;

  payload.imageStoragePath = normalized.imageStoragePath;
  payload.imageFileName = normalized.imageFileName;
  payload.imageFileContentType = normalized.imageFileContentType;
  payload.imageFileSize = values.imageFileSize;
  payload.imageUploadedAt = values.imageUploadedAt;
  payload.imageUploadedByUid = normalized.imageUploadedByUid;
  payload.imageUploadVisibility = CONTRIBUTION_IMAGE_UPLOAD_VISIBILITY;
}

function buildPlaceContributionCreatePayload(values = {}, timestamps = {}) {
  const errors = getPlaceContributionValidationErrors(values);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  const normalized = normalizeContributionTextFields(values);
  const payload = {
    placeId: normalized.placeId,
    submittedByUid: cleanText(values.submittedByUid),
    contributionStatus: getInitialContributionStatus()
  };

  addOptionalText(payload, "placeTitleSnapshot", normalized.placeTitleSnapshot);
  addOptionalText(payload, "contributionText", normalized.contributionText);

  if (normalized.imageUrl) {
    payload.imageUrl = normalized.imageUrl;
    addOptionalText(payload, "imageCaption", normalized.imageCaption);
    addOptionalText(payload, "imageCredit", normalized.imageCredit);

    const imageRightsStatus = normalizeImageRightsStatus(normalized.imageRightsStatus);
    if (imageRightsStatus) {
      payload.imageRightsStatus = imageRightsStatus;
    }

    if (values.imagePermissionConfirmed === true) {
      payload.imagePermissionConfirmed = true;
    }
  }

  addUploadedContributionImageMetadata(payload, values, normalized);

  addOptionalText(payload, "submitterEmail", normalized.submitterEmail);
  addOptionalText(payload, "submitterDisplayName", normalized.submitterDisplayName);

  if (timestamps.createdAt !== undefined) {
    payload.createdAt = timestamps.createdAt;
  }
  if (timestamps.updatedAt !== undefined) {
    payload.updatedAt = timestamps.updatedAt;
  }

  return payload;
}

function stripPrivatePlaceContributionFields(value) {
  if (Array.isArray(value)) {
    return value.map(stripPrivatePlaceContributionFields);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((clean, [key, entry]) => {
    if (PRIVATE_PLACE_CONTRIBUTION_FIELDS.includes(key)) {
      return clean;
    }
    clean[key] = stripPrivatePlaceContributionFields(entry);
    return clean;
  }, {});
}

function buildPublicPlaceContributionPayload(record = {}) {
  if (normalizeContributionStatus(record.contributionStatus) !== "approved") {
    return null;
  }

  const stripped = stripPrivatePlaceContributionFields(record);
  const payload = {};

  PUBLIC_PLACE_CONTRIBUTION_FIELDS.forEach((field) => {
    const value = stripped[field];

    if (value === undefined || value === null || value === "") {
      return;
    }

    payload[field] = value;
  });

  return payload;
}

function buildContributionImagePromotionPayload(record = {}, options = {}) {
  const publicContribution = buildPublicPlaceContributionPayload(record);
  const contributionId = cleanText(options.contributionId || record.id);

  if (!publicContribution || !isHttpsUrl(publicContribution.imageUrl)) {
    throw new Error("Only approved contribution images can be promoted.");
  }

  if (!contributionId) {
    throw new Error("Contribution ID is required for image promotion.");
  }

  const payload = {
    imageUrl: publicContribution.imageUrl,
    promotedContributionId: contributionId,
    promotedContributionImageUrl: publicContribution.imageUrl
  };

  addOptionalText(payload, "imageCaption", publicContribution.imageCaption);
  addOptionalText(payload, "imageCredit", publicContribution.imageCredit);
  addOptionalText(payload, "imageRightsStatus", publicContribution.imageRightsStatus);
  addOptionalText(payload, "promotedContributionImageCaption", publicContribution.imageCaption);
  addOptionalText(payload, "promotedContributionImageCredit", publicContribution.imageCredit);
  addOptionalText(payload, "promotedContributionImageRightsStatus", publicContribution.imageRightsStatus);

  if (options.promotedContributionImageAt !== undefined) {
    payload.promotedContributionImageAt = options.promotedContributionImageAt;
  }
  if (options.updatedAt !== undefined) {
    payload.updatedAt = options.updatedAt;
  }

  return payload;
}

function buildContributionReviewUpdatePayload(nextStatus, values = {}, timestamps = {}) {
  const normalizedStatus = normalizeContributionStatus(nextStatus);
  if (!["approved", "rejected"].includes(normalizedStatus)) {
    throw new Error("Contribution review status must be approved or rejected.");
  }

  const normalized = normalizeContributionTextFields(values);
  const payload = {
    contributionStatus: normalizedStatus
  };

  if (timestamps.reviewedAt !== undefined) {
    payload.reviewedAt = timestamps.reviewedAt;
  }
  if (timestamps.updatedAt !== undefined) {
    payload.updatedAt = timestamps.updatedAt;
  }

  if (normalizedStatus === "rejected") {
    addOptionalText(payload, "reviewedByUid", normalized.reviewedByUid);
    addOptionalText(payload, "adminNotes", normalized.adminNotes);
  }

  if (normalizedStatus === "rejected" && Array.isArray(values.reviewHistory)) {
    payload.reviewHistory = values.reviewHistory;
  }

  return payload;
}

function buildApproveContributionUpdate(values = {}, timestamps = {}) {
  return buildContributionReviewUpdatePayload("approved", values, timestamps);
}

function buildRejectContributionUpdate(values = {}, timestamps = {}) {
  return buildContributionReviewUpdatePayload("rejected", values, timestamps);
}

export {
  CONTRIBUTION_IMAGE_UPLOAD_CONTENT_TYPES,
  CONTRIBUTION_IMAGE_UPLOAD_VISIBILITY,
  FIELD_LIMITS,
  IMAGE_RIGHTS_STATUSES,
  MAX_CONTRIBUTION_IMAGE_FILE_SIZE,
  PLACE_CONTRIBUTION_STATUSES,
  PRIVATE_PLACE_CONTRIBUTION_FIELDS,
  PUBLIC_PLACE_IMAGE_PROMOTION_FIELDS,
  PUBLIC_PLACE_CONTRIBUTION_FIELDS,
  buildApproveContributionUpdate,
  buildContributionReviewUpdatePayload,
  buildContributionImagePromotionPayload,
  buildPlaceContributionCreatePayload,
  buildPublicPlaceContributionPayload,
  buildRejectContributionUpdate,
  getInitialContributionStatus,
  getPlaceContributionValidationErrors,
  hasValidUploadedContributionImage,
  isValidContributionImageStoragePath,
  normalizeContributionStatus,
  normalizeContributionTextFields,
  normalizeImageRightsStatus,
  stripPrivatePlaceContributionFields,
  validatePlaceContributionImageFields,
  validatePlaceContributionRequiredFields,
  validatePlaceContributionSubmission
};
