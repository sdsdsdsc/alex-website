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

function getSearchText(place) {
  return [
    place.title,
    place.area,
    place.address,
    place.city,
    place.district,
    place.category,
    place.assetType,
    place.localSignificanceSummary,
    place.description,
    ...getHeritageCriteria(place)
  ].filter(Boolean).join(" ").toLowerCase();
}

function placeMatchesSearch(place, query) {
  return !query || getSearchText(place).includes(query);
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

  const categoryMatches = categories.length === 0 || categories.includes(cleanText(place.category));
  const cityMatches = !city || cleanText(place.city) === city;
  const districtMatches = !district || cleanText(place.district) === district;
  const assetTypeMatches = !assetType || cleanText(place.assetType) === assetType;
  const heritageCriteriaMatches = !heritageCriteria || getHeritageCriteria(place).includes(heritageCriteria);

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

function getDisplayLocation(place) {
  return [
    cleanText(place.district),
    cleanText(place.city),
    cleanText(place.province)
  ].filter(Boolean).join(", ") || cleanText(place.address) || cleanText(place.area);
}

function hasCoordinates(place) {
  return Number.isFinite(place?.lat) && Number.isFinite(place?.lng);
}

function buildMapUrl(place) {
  const title = cleanText(place.title);
  if (hasCoordinates(place)) {
    return `map.html?lat=${encodeURIComponent(place.lat)}&lng=${encodeURIComponent(place.lng)}`;
  }
  return `map.html?search=${encodeURIComponent(title)}`;
}

function getUniqueValues(field, source = []) {
  return [...new Set(source.map((place) => cleanText(place[field])).filter(Boolean))]
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
    return publicPlaces.filter((place) => getHeritageCriteria(place).includes(value)).length;
  }
  return publicPlaces.filter((place) => cleanText(place[key]) === value).length;
}

export {
  buildMapUrl,
  cleanText,
  getDisplayLocation,
  getHeritageCriteria,
  getOptionCount,
  getSearchText,
  getUniqueCriteria,
  getUniqueValues,
  isPublicRecord,
  normalizeCoordinate,
  normalizeSearchText,
  normalizeTextList,
  placeMatchesFilters,
  placeMatchesSearch,
  sortPlaces
};
