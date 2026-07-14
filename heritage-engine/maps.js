function cleanText(value) {
  return String(value || "").trim();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function isValidLatitude(value) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

function hasValidCoordinates(record) {
  return isValidLatitude(record?.lat) && isValidLongitude(record?.lng);
}

function normalizeSearchValue(value) {
  return cleanText(value).toLowerCase();
}

function getTitle(record) {
  return record?.name || record?.title || "Untitled";
}

function buildMarkerAccessibleName(record) {
  return `Open map record: ${cleanText(getTitle(record)) || "Untitled"}`;
}

function getDescription(record) {
  return record?.desc || record?.description || "";
}

function getType(record) {
  return record?.type || record?.category || "schema:Place";
}

function getTags(record) {
  return Array.isArray(record?.tags) ? record.tags.join(" ") : record?.tags || "";
}

function normalizePlacePartForComparison(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[|,/()-]+/g, " ")
    .replace(/\b(province|city|district|neighbourhood|neighborhood|area|community|locality)\b/g, " ")
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

  if (value.length > parts[existingIndex].length) {
    parts[existingIndex] = value;
  }
}

function getContainedInPlaceName(record) {
  return cleanText(
    record?.containedInPlace?.name
      || record?.containedInPlace?.["schema:name"]
      || record?.["schema:containedInPlace"]?.name
      || record?.["schema:containedInPlace"]?.["schema:name"]
  );
}

function getCommunityDisplayLocation(record) {
  const parts = [];

  [
    record?.locationName,
    record?.location,
    record?.address,
    record?.area,
    record?.locality,
    record?.community,
    record?.neighbourhood || record?.neighborhood,
    getContainedInPlaceName(record)
  ].forEach((value) => {
    pushUniquePlacePart(parts, value);
  });

  if (parts.length > 0) {
    return parts.join(", ");
  }

  const city = cleanText(record?.city);
  const province = cleanText(record?.province);
  if (city && province) return `${city}, ${province}`;
  if (city) return city;
  return province;
}

function recordMatchesSearch(record, term) {
  if (!term) return true;

  const searchableText = [
    record?.name,
    record?.title,
    record?.desc,
    record?.description,
    record?.message,
    record?.articleTitle,
    record?.linkedArticleTitle,
    record?.linkedArticle,
    record?.type,
    record?.category,
    record?.locationName,
    record?.location,
    record?.area,
    record?.locality,
    record?.community,
    record?.neighbourhood,
    record?.neighborhood,
    record?.province,
    record?.city,
    record?.district,
    record?.address,
    getContainedInPlaceName(record),
    record?.associatedType,
    record?.contributor,
    record?.period,
    getTags(record)
  ].filter(Boolean).join(" ").toLowerCase();

  return searchableText.includes(term);
}

function buildPlaceRecordUrl(id) {
  return `place.html?id=${encodeURIComponent(cleanText(id))}`;
}

function getDefaultBaseHref() {
  return typeof window === "undefined" ? "http://localhost/" : window.location.href;
}

function buildFullMapUrl(searchTerm = "", baseHref = getDefaultBaseHref()) {
  const url = new URL("map.html", baseHref);
  const cleanTerm = cleanText(searchTerm);
  if (cleanTerm) {
    url.searchParams.set("q", cleanTerm);
  }
  return `${url.pathname}${url.search}`;
}

function buildNominationUrlFromCoordinates(lat, lng, baseHref = getDefaultBaseHref()) {
  const url = new URL("nominate-place.html", baseHref);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lng", String(lng));
  return `${url.pathname}${url.search}`;
}

function buildMapStatusText(totalMatches, hasSearchTerm, publicCommunityMode = true) {
  if (totalMatches === 0) {
    return hasSearchTerm || publicCommunityMode
      ? "No matching map records found."
      : "No matching map points found.";
  }

  const label = totalMatches === 1 ? "map result" : "map results";
  return hasSearchTerm ? `${totalMatches} matching ${label} found.` : `${totalMatches} ${label} shown.`;
}

export {
  buildMarkerAccessibleName,
  buildFullMapUrl,
  buildMapStatusText,
  buildNominationUrlFromCoordinates,
  buildPlaceRecordUrl,
  cleanText,
  escapeHTML,
  getCommunityDisplayLocation,
  getDescription,
  getTitle,
  getType,
  hasValidCoordinates,
  isValidLatitude,
  isValidLongitude,
  normalizeCoordinate,
  normalizeSearchValue,
  recordMatchesSearch
};
