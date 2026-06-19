import {
  ARTICLE_RELATIONSHIP_COLLECTIONS,
  buildPublicRelationshipUrl,
  normalizeRelationshipReferences
} from "./relationships.js";

const ARTICLE_COLLECTIONS = new Set(["news", "history"]);

function cleanText(value) {
  return String(value || "").trim();
}

function getDefaultBaseHref() {
  return typeof window === "undefined" ? "http://localhost/" : window.location.href;
}

function toSafeUrl(value, baseHref = getDefaultBaseHref()) {
  if (!value) return "";
  try {
    const parsed = new URL(value, baseHref);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (err) {
    return "";
  }
  return "";
}

function normalizeCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function hasValidCoordinates(place) {
  return Number.isFinite(place?.lat)
    && Number.isFinite(place?.lng)
    && place.lat >= -90
    && place.lat <= 90
    && place.lng >= -180
    && place.lng <= 180;
}

function normalizeTextList(value, separatorPattern = /[\n,;]+/) {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean);
  }
  return cleanText(value).split(separatorPattern).map(cleanText).filter(Boolean);
}

function getTags(place) {
  return normalizeTextList(place?.tags, /,/);
}

function hasUsableJsonLd(value) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length > 0;
}

function getDisplayTitle(place) {
  return cleanText(place?.title) || "Untitled community place";
}

function getAssetType(place) {
  return cleanText(place?.assetType || place?.category) || "Community place";
}

function getDisplayLocation(place) {
  const parts = [
    cleanText(place?.city),
    cleanText(place?.province)
  ].filter(Boolean);

  return parts.join(", ") || cleanText(place?.location);
}

function getPublicDescription(place) {
  return cleanText(place?.description) || "No public description has been added yet.";
}

function getAreaAddress(place) {
  const parts = [
    cleanText(place?.area),
    cleanText(place?.address)
  ].filter(Boolean);

  return parts.join(" | ");
}

function normalizePlacePartForComparison(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[|,/()-]+/g, " ")
    .replace(/\b(province|city|district|neighbourhood|neighborhood|area)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pushUniquePlacePart(parts, rawValue) {
  const value = cleanText(rawValue);
  if (!value) return;

  const normalizedValue = normalizePlacePartForComparison(value);
  if (!normalizedValue) return;

  const existingIndex = parts.findIndex((part) => {
    const normalizedPart = normalizePlacePartForComparison(part);
    return normalizedPart === normalizedValue
      || normalizedPart.includes(normalizedValue)
      || normalizedValue.includes(normalizedPart);
  });

  if (existingIndex === -1) {
    parts.push(value);
    return;
  }

  if (normalizedValue.length > parts[existingIndex].length) {
    parts[existingIndex] = value;
  }
}

function formatPlaceLocationAddress(place) {
  const parts = [];
  pushUniquePlacePart(parts, place?.address);
  pushUniquePlacePart(parts, place?.area);
  pushUniquePlacePart(parts, place?.district);
  pushUniquePlacePart(parts, getDisplayLocation(place) || place?.location);
  return parts.join(" | ");
}

function getRecordStatusLabel(place) {
  return cleanText(place?.recordStatus);
}

function buildMapUrl(place) {
  const title = cleanText(place?.title);
  if (hasValidCoordinates(place)) {
    return `map.html?lat=${encodeURIComponent(place.lat)}&lng=${encodeURIComponent(place.lng)}`;
  }
  return `map.html?search=${encodeURIComponent(title)}`;
}

function getHeritageCriteria(place) {
  return [...new Set(normalizeTextList(place?.heritageCriteria))];
}

function formatCriteriaList(place) {
  return getHeritageCriteria(place);
}

function formatRecordDate(value) {
  if (!value) return "";

  let date = null;
  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    const textValue = cleanText(value);
    const dateOnlyMatch = textValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    date = dateOnlyMatch
      ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
      : new Date(textValue);
  }

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatCoordinate(value) {
  if (!Number.isFinite(value)) return "";
  return Number(value).toFixed(6).replace(/\.?0+$/, "");
}

function getCoordinateDisplay(place) {
  if (!hasValidCoordinates(place)) return "";
  return `${formatCoordinate(place.lat)}, ${formatCoordinate(place.lng)}`;
}

function buildRelatedArticleUrl(reference, options = {}) {
  const collection = cleanText(reference?.collection);
  if (!ARTICLE_COLLECTIONS.has(collection)) return "";
  return buildPublicRelationshipUrl(reference, options);
}

function getRelatedArticleUrl(place) {
  return toSafeUrl(place?.relatedArticle || place?.linkedArticle || "");
}

function getRelatedArticleReferences(place) {
  return normalizeRelationshipReferences(place?.relatedArticles, {
    allowedCollections: ARTICLE_RELATIONSHIP_COLLECTIONS
  }).references;
}

function getRelatedArticleSubjectUrls(place, baseHref = getDefaultBaseHref()) {
  const urls = getRelatedArticleReferences(place)
    .map((reference) => buildRelatedArticleUrl(reference, { absolute: true, baseHref }))
    .filter(Boolean);
  const legacyArticle = getRelatedArticleUrl(place);

  if (legacyArticle && !urls.includes(legacyArticle)) {
    urls.push(legacyArticle);
  }

  return urls;
}

function buildPublicPlaceSummary(place) {
  return {
    title: getDisplayTitle(place),
    category: cleanText(place?.category) || "Community place",
    location: getDisplayLocation(place),
    description: getPublicDescription(place),
    assetType: getAssetType(place),
    recordStatus: getRecordStatusLabel(place),
    coordinates: getCoordinateDisplay(place)
  };
}

function buildPlaceJsonLd(place, pageUrl = getDefaultBaseHref()) {
  const tags = getTags(place);
  const title = cleanText(place?.title) || "Community place";
  const description = cleanText(place?.description) || "Community place record from Alex's Photo Board.";
  const category = cleanText(place?.category) || "Community place";
  const location = cleanText(place?.location) || "Not specified";
  const source = cleanText(place?.source) || "Alex's Photo Board";
  const relatedArticleUrls = getRelatedArticleSubjectUrls(place, pageUrl);
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: title,
    url: pageUrl,
    description,
    additionalType: category,
    category,
    address: location,
    location,
    keywords: tags.length > 0 ? tags.join(", ") : category,
    sourceOrganization: source
  };

  const imageUrl = toSafeUrl(place?.imageUrl);

  if (imageUrl) jsonld.image = imageUrl;
  if (relatedArticleUrls.length === 1) {
    jsonld.subjectOf = relatedArticleUrls[0];
  } else if (relatedArticleUrls.length > 1) {
    jsonld.subjectOf = relatedArticleUrls;
  }
  if (hasValidCoordinates(place)) {
    jsonld.geo = {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng
    };
  }

  return jsonld;
}

export {
  buildMapUrl,
  buildPlaceJsonLd,
  buildPublicPlaceSummary,
  buildRelatedArticleUrl,
  cleanText,
  formatCriteriaList,
  formatRecordDate,
  getAssetType,
  getAreaAddress,
  getCoordinateDisplay,
  getDisplayLocation,
  getDisplayTitle,
  getHeritageCriteria,
  getPublicDescription,
  formatPlaceLocationAddress,
  getRecordStatusLabel,
  getRelatedArticleReferences,
  getRelatedArticleSubjectUrls,
  getRelatedArticleUrl,
  getTags,
  hasUsableJsonLd,
  hasValidCoordinates,
  normalizeCoordinate,
  normalizeTextList,
  toSafeUrl
};
