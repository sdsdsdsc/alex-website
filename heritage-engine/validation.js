const HERITAGE_CRITERIA = Object.freeze([
  "Historic interest",
  "Social or communal value",
  "Landmark or streetscape value",
  "Architectural, design or artistic interest",
  "Archaeological or evidential interest",
  "Rarity",
  "Group value",
  "Age",
  "Condition or vulnerability"
]);

const NOMINATION_STATUSES = Object.freeze([
  "submitted",
  "under review",
  "needs more information",
  "approved",
  "rejected",
  "promoted"
]);

const PUBLIC_RECORD_STATUSES = Object.freeze([
  "draft",
  "published",
  "archived"
]);

const UNSAFE_PUBLIC_FIELD_NAMES = Object.freeze([
  "placeNominations",
  "nominatorEmail",
  "adminNotes",
  "adminHistoricInterest",
  "adminArchitecturalInterest",
  "adminCommunityValue",
  "adminConditionRisk",
  "adminAssessmentSummary",
  "reviewHistory"
]);

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeText(value) {
  return cleanText(value).toLowerCase();
}

function normalizeTextList(value) {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean);
  }
  return cleanText(value).split(/[\n,;]+/).map(cleanText).filter(Boolean);
}

function isNonEmptyString(value) {
  return typeof value === "string" && cleanText(value).length > 0;
}

function isValidEmail(value) {
  const email = cleanText(value);
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function isHttpsUrl(value) {
  const url = cleanText(value);
  if (!url) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch (err) {
    return false;
  }
}

function normalizeCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function isValidLatitude(value) {
  const coordinate = normalizeCoordinate(value);
  return coordinate !== null && coordinate >= -90 && coordinate <= 90;
}

function isValidLongitude(value) {
  const coordinate = normalizeCoordinate(value);
  return coordinate !== null && coordinate >= -180 && coordinate <= 180;
}

function hasValidCoordinates(record) {
  return isValidLatitude(record?.lat) && isValidLongitude(record?.lng);
}

function isAllowedHeritageCriterion(value) {
  return HERITAGE_CRITERIA.includes(cleanText(value));
}

function normalizeCriteriaList(value) {
  return [...new Set(normalizeTextList(value).filter(isAllowedHeritageCriterion))];
}

function stripUnsafePublicFields(value) {
  if (Array.isArray(value)) {
    return value.map(stripUnsafePublicFields);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((clean, [key, entry]) => {
    if (UNSAFE_PUBLIC_FIELD_NAMES.includes(key)) {
      return clean;
    }
    clean[key] = stripUnsafePublicFields(entry);
    return clean;
  }, {});
}

function containsUnsafePublicField(serializedOrObject) {
  if (typeof serializedOrObject === "string") {
    return UNSAFE_PUBLIC_FIELD_NAMES.some((fieldName) => serializedOrObject.includes(fieldName));
  }

  if (Array.isArray(serializedOrObject)) {
    return serializedOrObject.some(containsUnsafePublicField);
  }

  if (!serializedOrObject || typeof serializedOrObject !== "object") {
    return false;
  }

  return Object.entries(serializedOrObject).some(([key, entry]) => (
    UNSAFE_PUBLIC_FIELD_NAMES.includes(key) || containsUnsafePublicField(entry)
  ));
}

export {
  HERITAGE_CRITERIA,
  NOMINATION_STATUSES,
  PUBLIC_RECORD_STATUSES,
  UNSAFE_PUBLIC_FIELD_NAMES,
  cleanText,
  containsUnsafePublicField,
  hasValidCoordinates,
  isAllowedHeritageCriterion,
  isHttpsUrl,
  isNonEmptyString,
  isValidEmail,
  isValidLatitude,
  isValidLongitude,
  normalizeCoordinate,
  normalizeCriteriaList,
  normalizeText,
  normalizeTextList,
  stripUnsafePublicFields
};
