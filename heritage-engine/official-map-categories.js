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
    glyphSvg: '<svg class="official-map-marker__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 1.8 14.5 6v1.4h-13V6ZM3 8.4h2.2v4.2H3ZM6.9 8.4h2.2v4.2H6.9ZM10.8 8.4H13v4.2h-2.2ZM1.5 13.4h13v1.4h-13Z"/></svg>'
  }),
  Object.freeze({
    key: OFFICIAL_MAP_CATEGORY_KEYS.IMPORTANT_MODERN_HISTORIC_SITES,
    label: "Important modern historic sites",
    officialValuesZh: Object.freeze(["近现代重要史迹"]),
    glyphSvg: '<svg class="official-map-marker__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.6 1.6h1.5v1.1h8.6L11.4 6l2.3 3.3H5.1v4.2h2v1.4H1.8v-1.4h1.8Z"/></svg>'
  }),
  Object.freeze({
    key: OFFICIAL_MAP_CATEGORY_KEYS.ARCHAEOLOGICAL_SITES,
    label: "Archaeological sites",
    officialValuesZh: Object.freeze(["古遗址"]),
    glyphSvg: '<svg class="official-map-marker__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M1.5 13.5c.7-4.2 3.3-7 6.5-7s5.8 2.8 6.5 7ZM6 13.5v-2a2 2 0 0 1 4 0v2Z"/></svg>'
  }),
  Object.freeze({
    key: OFFICIAL_MAP_CATEGORY_KEYS.OTHER_OFFICIAL_HERITAGE,
    label: "Other official heritage",
    officialValuesZh: Object.freeze([]),
    glyphSvg: '<svg class="official-map-marker__glyph official-map-marker__glyph--fallback" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="5"/><circle class="official-map-marker__glyph-dot" cx="8" cy="8" r="1.8"/></svg>'
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
