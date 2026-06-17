import { cleanText } from "./validation.js";

const DEFAULT_REVIEW_HISTORY_LIMIT = 50;
const REVIEW_HISTORY_ACTIONS = Object.freeze([
  "review_saved",
  "status_changed",
  "promoted"
]);
const ACTION_LABELS = Object.freeze({
  review_saved: "Review saved",
  status_changed: "Status changed",
  promoted: "Promoted"
});

function getAuditActor(actor = "admin") {
  return cleanText(actor) || "admin";
}

function normalizeReviewStatusForAudit(status) {
  return cleanText(status).toLowerCase();
}

function normalizeReviewHistoryAction(action) {
  const cleanAction = cleanText(action);
  return REVIEW_HISTORY_ACTIONS.includes(cleanAction) ? cleanAction : "review_saved";
}

function buildReviewHistoryEntry(action, options = {}) {
  const entry = {
    action: normalizeReviewHistoryAction(action),
    at: options.at || null,
    by: getAuditActor(options.by)
  };
  const fromStatus = normalizeReviewStatusForAudit(options.fromStatus);
  const toStatus = normalizeReviewStatusForAudit(options.toStatus);
  const note = cleanText(options.note);
  const promotedPlaceId = cleanText(options.promotedPlaceId);

  if (fromStatus) entry.fromStatus = fromStatus;
  if (toStatus) entry.toStatus = toStatus;
  if (note) entry.note = note;
  if (promotedPlaceId) entry.promotedPlaceId = promotedPlaceId;

  return entry;
}

function buildReviewSavedHistoryEntry(options = {}) {
  return buildReviewHistoryEntry("review_saved", options);
}

function buildStatusChangedHistoryEntry(fromStatus, toStatus, options = {}) {
  return buildReviewHistoryEntry("status_changed", {
    ...options,
    fromStatus,
    toStatus
  });
}

function buildPromotionHistoryEntry(promotedPlaceId, options = {}) {
  const cleanPromotedPlaceId = cleanText(promotedPlaceId);
  return buildReviewHistoryEntry("promoted", {
    ...options,
    toStatus: "promoted",
    promotedPlaceId: cleanPromotedPlaceId,
    note: cleanText(options.note) || `Promoted to communityPlaces: ${cleanPromotedPlaceId}`
  });
}

function trimReviewHistory(history = [], limit = DEFAULT_REVIEW_HISTORY_LIMIT) {
  const safeLimit = Math.max(0, Number(limit) || DEFAULT_REVIEW_HISTORY_LIMIT);
  const entries = Array.isArray(history) ? history.filter(Boolean) : [];
  return entries.slice(-safeLimit);
}

function appendReviewHistory(history = [], entry, limit = DEFAULT_REVIEW_HISTORY_LIMIT) {
  return trimReviewHistory([...(Array.isArray(history) ? history : []), entry].filter(Boolean), limit);
}

function formatReviewHistoryAction(action) {
  const cleanAction = cleanText(action);
  if (ACTION_LABELS[cleanAction]) return ACTION_LABELS[cleanAction];
  if (!cleanAction) return "Review action";
  return cleanAction
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAuditTimestamp(value) {
  if (!value) return "";
  if (typeof value.toDate === "function") {
    return value.toDate().toLocaleString();
  }
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (typeof value === "object" && Number.isFinite(value.seconds)) {
    return new Date(value.seconds * 1000).toLocaleString();
  }
  return cleanText(value);
}

function formatReviewHistoryEntry(entry = {}) {
  const action = formatReviewHistoryAction(entry.action);
  const timestamp = formatAuditTimestamp(entry.at);
  const actor = getAuditActor(entry.by);
  const statusText = [entry.fromStatus, entry.toStatus]
    .map(normalizeReviewStatusForAudit)
    .filter(Boolean)
    .join(" to ");
  const parts = [timestamp, action, statusText, `by ${actor}`, cleanText(entry.note)]
    .filter(Boolean);

  return parts.join(" - ");
}

function getReviewHistorySummary(history = []) {
  const entries = trimReviewHistory(history);
  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  const actions = entries.reduce((counts, entry) => {
    const action = normalizeReviewHistoryAction(entry?.action);
    counts[action] = (counts[action] || 0) + 1;
    return counts;
  }, {});

  return {
    count: entries.length,
    latest,
    actions
  };
}

export {
  DEFAULT_REVIEW_HISTORY_LIMIT,
  REVIEW_HISTORY_ACTIONS,
  appendReviewHistory,
  buildPromotionHistoryEntry,
  buildReviewHistoryEntry,
  buildReviewSavedHistoryEntry,
  buildStatusChangedHistoryEntry,
  formatReviewHistoryAction,
  formatReviewHistoryEntry,
  getAuditActor,
  getReviewHistorySummary,
  normalizeReviewStatusForAudit,
  trimReviewHistory
};
