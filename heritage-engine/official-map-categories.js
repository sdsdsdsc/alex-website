const OFFICIAL_MAP_CATEGORY_KEYS = Object.freeze({
  ANCIENT_BUILDINGS: "ancient-buildings",
  IMPORTANT_MODERN_HISTORIC_SITES: "important-modern-historic-sites",
  ARCHAEOLOGICAL_SITES: "archaeological-sites",
  OTHER_OFFICIAL_HERITAGE: "other-official-heritage"
});

const OFFICIAL_MAP_CATEGORY_DEFINITIONS = Object.freeze([
  Object.freeze({
    key: OFFICIAL_MAP_CATEGORY_KEYS.ANCIENT_BUILDINGS,
    label: "Ancient buildings",
    officialValuesZh: Object.freeze(["古建筑"]),
    glyphSvg: '<svg class="official-map-marker__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3.5 7 4.5-4 4.5 4M4.5 7h7M5 7v5m3-5v5m3-5v5M3.5 12.5h9"/></svg>'
  }),
  Object.freeze({
    key: OFFICIAL_MAP_CATEGORY_KEYS.IMPORTANT_MODERN_HISTORIC_SITES,
    label: "Important modern historic sites",
    officialValuesZh: Object.freeze(["近现代重要史迹"]),
    glyphSvg: '<svg class="official-map-marker__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5 12.5v-9m0 1h6l-1.5 2L11 8.5H5M3.5 12.5h9"/></svg>'
  }),
  Object.freeze({
    key: OFFICIAL_MAP_CATEGORY_KEYS.ARCHAEOLOGICAL_SITES,
    label: "Archaeological sites",
    officialValuesZh: Object.freeze(["古遗址"]),
    glyphSvg: '<svg class="official-map-marker__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 11c1.3-2.7 3-4 5-4s3.7 1.3 5 4M4.5 10h7M3 13h10"/></svg>'
  }),
  Object.freeze({
    key: OFFICIAL_MAP_CATEGORY_KEYS.OTHER_OFFICIAL_HERITAGE,
    label: "Other official heritage",
    officialValuesZh: Object.freeze([]),
    glyphSvg: '<svg class="official-map-marker__glyph official-map-marker__glyph--fallback" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="4"/><circle class="official-map-marker__glyph-dot" cx="8" cy="8" r="1.4"/></svg>'
  })
]);

const OFFICIAL_MAP_CATEGORY_BY_KEY = new Map(
  OFFICIAL_MAP_CATEGORY_DEFINITIONS.map((definition) => [definition.key, definition])
);

const OFFICIAL_MAP_CATEGORY_BY_OFFICIAL_VALUE = new Map(
  OFFICIAL_MAP_CATEGORY_DEFINITIONS.flatMap((definition) => (
    definition.officialValuesZh.map((value) => [value, definition])
  ))
);

function getOfficialMapCategory(officialCategoryZh) {
  if (typeof officialCategoryZh !== "string" || officialCategoryZh.trim().length === 0) {
    return null;
  }
  return OFFICIAL_MAP_CATEGORY_BY_OFFICIAL_VALUE.get(officialCategoryZh)
    || OFFICIAL_MAP_CATEGORY_BY_KEY.get(OFFICIAL_MAP_CATEGORY_KEYS.OTHER_OFFICIAL_HERITAGE);
}

function getOfficialMapCategoryByKey(key) {
  return OFFICIAL_MAP_CATEGORY_BY_KEY.get(key)
    || OFFICIAL_MAP_CATEGORY_BY_KEY.get(OFFICIAL_MAP_CATEGORY_KEYS.OTHER_OFFICIAL_HERITAGE);
}

function getPublishedOfficialMapCategories(features = []) {
  const publishedKeys = new Set(
    features
      .map((feature) => getOfficialMapCategory(feature?.properties?.officialCategoryZh)?.key)
      .filter(Boolean)
  );
  return OFFICIAL_MAP_CATEGORY_DEFINITIONS.filter((definition) => publishedKeys.has(definition.key));
}

export {
  OFFICIAL_MAP_CATEGORY_DEFINITIONS,
  OFFICIAL_MAP_CATEGORY_KEYS,
  getOfficialMapCategory,
  getOfficialMapCategoryByKey,
  getPublishedOfficialMapCategories
};
