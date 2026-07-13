function cleanText(value) {
  return String(value || "").trim();
}

function normalizeSearchText(value) {
  return cleanText(value).toLowerCase();
}

function normalizeCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeTextList(value) {
  if (Array.isArray(value)) return value.map(cleanText).filter(Boolean);
  return cleanText(value).split(/[\n,;]+/).map(cleanText).filter(Boolean);
}

const SHARED_DISCOVERY_PARAMS = [
  "q",
  "category",
  "city",
  "district",
  "assetType",
  "heritageCriteria"
];

function toSearchParams(value) {
  if (value instanceof URLSearchParams) return new URLSearchParams(value);
  if (value instanceof URL) return new URLSearchParams(value.search);
  const text = cleanText(value);
  if (!text) return new URLSearchParams();
  if (!text.includes("://")) {
    const queryIndex = text.indexOf("?");
    return new URLSearchParams(queryIndex >= 0 ? text.slice(queryIndex + 1) : text);
  }
  return new URL(text).searchParams;
}

function parseSharedDiscoveryState(value = "") {
  const params = toSearchParams(value);
  return {
    q: cleanText(params.get("q")),
    categories: [...new Set(params.getAll("category").map(cleanText).filter(Boolean))],
    city: cleanText(params.get("city")),
    district: cleanText(params.get("district")),
    assetType: cleanText(params.get("assetType")),
    heritageCriteria: cleanText(params.get("heritageCriteria"))
  };
}

function writeSharedDiscoveryState(url, state = {}) {
  SHARED_DISCOVERY_PARAMS.forEach((key) => url.searchParams.delete(key));
  const q = cleanText(state.q);
  if (q) url.searchParams.set("q", q);
  [...new Set((state.categories || []).map(cleanText).filter(Boolean))]
    .forEach((category) => url.searchParams.append("category", category));
  ["city", "district", "assetType", "heritageCriteria"].forEach((key) => {
    const value = cleanText(state[key]);
    if (value) url.searchParams.set(key, value);
  });
  return url;
}

function getDefaultBaseHref() {
  return typeof window === "undefined" ? "http://localhost/" : window.location.href;
}

function buildDiscoveryUrl(path, state = {}, options = {}) {
  const url = new URL(path, options.baseHref || getDefaultBaseHref());
  writeSharedDiscoveryState(url, state);
  url.searchParams.delete("place");
  const placeId = cleanText(options.place);
  if (placeId) url.searchParams.set("place", placeId);
  return `${url.pathname}${url.search}`;
}

function createdAtMillis(place) {
  const seconds = place?.createdAt?.seconds;
  return Number.isFinite(seconds) ? seconds * 1000 : 0;
}

function getHeritageCriteria(place) {
  return normalizeTextList(place?.heritageCriteria);
}

function getAssetType(place) {
  return cleanText(place?.assetType) || cleanText(place?.category);
}

function getContainedInPlaceName(place) {
  return cleanText(
    place?.containedInPlace?.name
      || place?.containedInPlace?.["schema:name"]
      || place?.["schema:containedInPlace"]?.name
      || place?.["schema:containedInPlace"]?.["schema:name"]
  );
}

function getSearchText(place) {
  return [
    place.name,
    place.title,
    place.desc,
    place.message,
    place.articleTitle,
    place.linkedArticleTitle,
    place.linkedArticle,
    place.area,
    place.locationName,
    place.location,
    place.locality,
    place.community,
    place.neighbourhood,
    place.neighborhood,
    place.address,
    place.city,
    place.district,
    place.province,
    place.category,
    getAssetType(place),
    place.associatedType,
    place.contributor,
    place.period,
    place.localSignificanceSummary,
    place.description,
    getContainedInPlaceName(place),
    ...normalizeTextList(place.tags),
    ...getHeritageCriteria(place)
  ].filter(Boolean).join(" ").toLowerCase();
}

function placeMatchesSearch(place, query) {
  const normalizedQuery = normalizeSearchText(query);
  return !normalizedQuery || getSearchText(place).includes(normalizedQuery);
}

function isPublicRecord(place) {
  const status = normalizeSearchText(place?.recordStatus);
  return !status || status === "published";
}

function placeMatchesFilters(place, filters) {
  const {
    query,
    categories,
    city,
    district,
    assetType,
    heritageCriteria
  } = filters;

  const normalizedCategories = (categories || []).map(normalizeSearchText);
  const categoryMatches = normalizedCategories.length === 0
    || normalizedCategories.includes(normalizeSearchText(place.category));
  const cityMatches = !city || normalizeSearchText(place.city) === normalizeSearchText(city);
  const districtMatches = !district || normalizeSearchText(place.district) === normalizeSearchText(district);
  const assetTypeMatches = !assetType || normalizeSearchText(getAssetType(place)) === normalizeSearchText(assetType);
  const heritageCriteriaMatches = !heritageCriteria
    || getHeritageCriteria(place).map(normalizeSearchText).includes(normalizeSearchText(heritageCriteria));

  return placeMatchesSearch(place, query)
    && categoryMatches
    && cityMatches
    && districtMatches
    && assetTypeMatches
    && heritageCriteriaMatches;
}

function sortPlaces(places, query, sortMode = "relevance") {
  const cloned = [...places];

  if (sortMode === "title") {
    cloned.sort((a, b) => cleanText(a.title).localeCompare(cleanText(b.title)));
    return cloned;
  }

  if (sortMode === "newest") {
    cloned.sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
    return cloned;
  }

  cloned.sort((a, b) => {
    const aTitle = normalizeSearchText(a.title);
    const bTitle = normalizeSearchText(b.title);
    const aStarts = query && aTitle.startsWith(query) ? 1 : 0;
    const bStarts = query && bTitle.startsWith(query) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;
    return cleanText(a.title).localeCompare(cleanText(b.title));
  });
  return cloned;
}

function getMatchingPublicRecords(source = [], filters = {}) {
  return source.filter(isPublicRecord).filter((place) => placeMatchesFilters(place, {
    query: "",
    categories: [],
    city: "",
    district: "",
    assetType: "",
    heritageCriteria: "",
    ...filters
  }));
}

function getPublicRecordById(source = [], id = "") {
  const cleanId = cleanText(id);
  if (!cleanId) return null;
  return source.find((place) => cleanText(place?.id) === cleanId && isPublicRecord(place)) || null;
}

function getDisplayLocation(place) {
  return [
    cleanText(place.district),
    cleanText(place.city),
    cleanText(place.province)
  ].filter(Boolean).join(", ") || cleanText(place.address) || cleanText(place.area);
}

function hasMapCoordinates(place) {
  return Number.isFinite(place?.lat)
    && place.lat >= -90
    && place.lat <= 90
    && Number.isFinite(place?.lng)
    && place.lng >= -180
    && place.lng <= 180;
}

function buildMapUrl(place, state = {}) {
  if (hasMapCoordinates(place) && cleanText(place?.id)) {
    return buildDiscoveryUrl("map.html", state, { place: place.id });
  }
  return "";
}

function getUniqueValues(field, source = []) {
  return [...new Set(source.map((place) => field === "assetType" ? getAssetType(place) : cleanText(place[field])).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function getUniqueCriteria(source = []) {
  return [...new Set(source.flatMap((place) => getHeritageCriteria(place)).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function getOptionCount(key, value, source = []) {
  const publicPlaces = source.filter(isPublicRecord);
  if (!value) return publicPlaces.length;
  if (key === "heritageCriteria") {
    return publicPlaces.filter((place) => getHeritageCriteria(place)
      .map(normalizeSearchText)
      .includes(normalizeSearchText(value))).length;
  }
  if (key === "assetType") {
    return publicPlaces.filter((place) => normalizeSearchText(getAssetType(place)) === normalizeSearchText(value)).length;
  }
  return publicPlaces.filter((place) => normalizeSearchText(place[key]) === normalizeSearchText(value)).length;
}

export {
  SHARED_DISCOVERY_PARAMS,
  buildDiscoveryUrl,
  buildMapUrl,
  cleanText,
  getAssetType,
  getDisplayLocation,
  getHeritageCriteria,
  getMatchingPublicRecords,
  getOptionCount,
  getPublicRecordById,
  getSearchText,
  getUniqueCriteria,
  getUniqueValues,
  hasMapCoordinates,
  isPublicRecord,
  normalizeCoordinate,
  normalizeSearchText,
  normalizeTextList,
  parseSharedDiscoveryState,
  placeMatchesFilters,
  placeMatchesSearch,
  sortPlaces,
  writeSharedDiscoveryState
};
