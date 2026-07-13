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

function buildMapUrl(place) {
  if (hasMapCoordinates(place)) {
    return `map.html?lat=${encodeURIComponent(place.lat)}&lng=${encodeURIComponent(place.lng)}`;
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
  buildMapUrl,
  cleanText,
  getAssetType,
  getDisplayLocation,
  getHeritageCriteria,
  getMatchingPublicRecords,
  getOptionCount,
  getSearchText,
  getUniqueCriteria,
  getUniqueValues,
  hasMapCoordinates,
  isPublicRecord,
  normalizeCoordinate,
  normalizeSearchText,
  normalizeTextList,
  placeMatchesFilters,
  placeMatchesSearch,
  sortPlaces
};
