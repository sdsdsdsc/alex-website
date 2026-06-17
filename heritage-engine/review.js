import { NOMINATION_STATUSES, cleanText } from "./validation.js";

const REVIEW_STATUSES = Object.freeze([
  "submitted",
  "under review",
  "needs more information",
  "approved",
  "rejected",
  "promoted"
]);
const REVIEW_STATUS_LABELS = Object.freeze({
  submitted: "Submitted",
  "under review": "Under review",
  "needs more information": "Needs more information",
  approved: "Approved",
  rejected: "Rejected",
  promoted: "Promoted"
});
const ADMIN_ASSESSMENT_FIELDS = Object.freeze([
  "adminHistoricInterest",
  "adminArchitecturalInterest",
  "adminCommunityValue",
  "adminConditionRisk",
  "adminAssessmentSummary"
]);
const REVIEW_UPDATE_FIELDS = Object.freeze([
  "nominationStatus",
  "adminNotes",
  ...ADMIN_ASSESSMENT_FIELDS,
  "reviewHistory",
  "reviewedAt",
  "updatedAt"
]);
const DISALLOWED_REVIEW_FIELDS = Object.freeze([
  "promotedPlaceId",
  "promotedAt",
  "communityPlaces",
  "placeNominations",
  "nominatorEmail",
  "termsAccepted",
  "privacyAccepted",
  "createdAt",
  "submittedAt"
]);
const REVIEW_TEXT_LIMITS = Object.freeze({
  adminNotes: 5000,
  adminAssessmentSummary: 5000
});

function getAllowedReviewStatuses() {
  return REVIEW_STATUSES.filter((status) => NOMINATION_STATUSES.includes(status));
}

function normalizeReviewStatus(status, fallback = "submitted") {
  const cleanStatus = cleanText(status).toLowerCase();
  if (getAllowedReviewStatuses().includes(cleanStatus)) return cleanStatus;
  const cleanFallback = cleanText(fallback).toLowerCase();
  return getAllowedReviewStatuses().includes(cleanFallback) ? cleanFallback : "submitted";
}

function getReviewStatusLabel(status) {
  const cleanStatus = normalizeReviewStatus(status);
  return REVIEW_STATUS_LABELS[cleanStatus] || cleanStatus;
}

function isAllowedReviewStatus(status) {
  return getAllowedReviewStatuses().includes(cleanText(status).toLowerCase());
}

function normalizeAdminNotes(notes) {
  return cleanText(notes).slice(0, REVIEW_TEXT_LIMITS.adminNotes);
}

function normalizeAdminAssessmentValue(value) {
  return value === true;
}

function normalizeAdminAssessmentFields(values = {}) {
  return {
    adminHistoricInterest: normalizeAdminAssessmentValue(values.adminHistoricInterest),
    adminArchitecturalInterest: normalizeAdminAssessmentValue(values.adminArchitecturalInterest),
    adminCommunityValue: normalizeAdminAssessmentValue(values.adminCommunityValue),
    adminConditionRisk: normalizeAdminAssessmentValue(values.adminConditionRisk),
    adminAssessmentSummary: cleanText(values.adminAssessmentSummary).slice(0, REVIEW_TEXT_LIMITS.adminAssessmentSummary)
  };
}

function buildAdminAssessmentSummary(values = {}) {
  const assessment = normalizeAdminAssessmentFields(values);
  const activeCriteria = [
    assessment.adminHistoricInterest ? "Historic interest" : "",
    assessment.adminArchitecturalInterest ? "Architectural / artistic interest" : "",
    assessment.adminCommunityValue ? "Social or community value" : "",
    assessment.adminConditionRisk ? "Condition / vulnerability" : ""
  ].filter(Boolean);

  return {
    activeCriteria,
    summary: assessment.adminAssessmentSummary
  };
}

function stripDisallowedReviewFields(values = {}) {
  return Object.entries(values || {}).reduce((clean, [key, value]) => {
    if (!DISALLOWED_REVIEW_FIELDS.includes(key)) {
      clean[key] = value;
    }
    return clean;
  }, {});
}

function getReviewValidationErrors(values = {}) {
  const errors = [];
  const cleanValues = stripDisallowedReviewFields(values);

  if (!isAllowedReviewStatus(cleanValues.nominationStatus)) {
    errors.push("Choose a valid nomination status.");
  }
  if (cleanText(cleanValues.adminNotes).length > REVIEW_TEXT_LIMITS.adminNotes) {
    errors.push("Admin notes are too long.");
  }
  if (cleanText(cleanValues.adminAssessmentSummary).length > REVIEW_TEXT_LIMITS.adminAssessmentSummary) {
    errors.push("Admin assessment summary is too long.");
  }

  return errors;
}

function validateReviewUpdate(values = {}) {
  return getReviewValidationErrors(values).length === 0;
}

function shouldRecordStatusChanged(previousStatus, nextStatus) {
  return normalizeReviewStatus(previousStatus) !== normalizeReviewStatus(nextStatus);
}

function buildReviewUpdatePayload(values = {}, timestamps = {}) {
  const cleanValues = stripDisallowedReviewFields(values);
  const payload = {
    nominationStatus: normalizeReviewStatus(cleanValues.nominationStatus),
    adminNotes: normalizeAdminNotes(cleanValues.adminNotes),
    ...normalizeAdminAssessmentFields(cleanValues)
  };

  if (Array.isArray(cleanValues.reviewHistory)) {
    payload.reviewHistory = cleanValues.reviewHistory;
  }
  if (timestamps.reviewedAt !== undefined) {
    payload.reviewedAt = timestamps.reviewedAt;
  }
  if (timestamps.updatedAt !== undefined) {
    payload.updatedAt = timestamps.updatedAt;
  }

  return payload;
}

function buildStatusChangeReviewPayload(previousStatus, nextStatus, values = {}, timestamps = {}) {
  return {
    ...buildReviewUpdatePayload({ ...values, nominationStatus: nextStatus }, timestamps),
    previousStatus: normalizeReviewStatus(previousStatus),
    statusChanged: shouldRecordStatusChanged(previousStatus, nextStatus)
  };
}

export {
  ADMIN_ASSESSMENT_FIELDS,
  DISALLOWED_REVIEW_FIELDS,
  REVIEW_STATUSES,
  REVIEW_STATUS_LABELS,
  REVIEW_TEXT_LIMITS,
  REVIEW_UPDATE_FIELDS,
  buildAdminAssessmentSummary,
  buildReviewUpdatePayload,
  buildStatusChangeReviewPayload,
  getAllowedReviewStatuses,
  getReviewStatusLabel,
  getReviewValidationErrors,
  isAllowedReviewStatus,
  normalizeAdminAssessmentFields,
  normalizeAdminAssessmentValue,
  normalizeAdminNotes,
  normalizeReviewStatus,
  shouldRecordStatusChanged,
  stripDisallowedReviewFields,
  validateReviewUpdate
};
