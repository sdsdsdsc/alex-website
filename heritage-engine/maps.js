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

function getDescription(record) {
  return record?.desc || record?.description || "";
}

function getType(record) {
  return record?.type || record?.category || "schema:Place";
}

function getTags(record) {
  return Array.isArray(record?.tags) ? record.tags.join(" ") : record?.tags || "";
}

function getCommunityDisplayLocation(record) {
  const city = cleanText(record?.city);
  const province = cleanText(record?.province);
  if (city && province) return `${city}, ${province}`;
  return cleanText(record?.location);
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
    record?.location,
    record?.province,
    record?.city,
    record?.district,
    record?.address,
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
    url.searchParams.set("search", cleanTerm);
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
