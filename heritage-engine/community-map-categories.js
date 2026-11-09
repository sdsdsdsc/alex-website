const COMMUNITY_MAP_CATEGORY_KEYS = Object.freeze({
  BUILDINGS: "buildings",
  PARKS_GARDENS: "parks-gardens",
  MONUMENTS_LANDMARKS: "monuments-landmarks",
  OTHER_SITES_LANDSCAPES: "other-sites-landscapes",
  UNKNOWN: "unknown"
});

const COMMUNITY_MAP_CATEGORY_DEFINITIONS = Object.freeze([
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.BUILDINGS,
    label: "Buildings",
    aliases: Object.freeze(["building"]),
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 1.8c.9 1.8 3.2 3.6 6.8 4.1l-1.2 1.7H2.4L1.2 5.9C4.8 5.4 7.1 3.6 8 1.8ZM3.5 8.6h9V14H9.6v-3.4H6.4V14H3.5Z"/></svg>'
  }),
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.PARKS_GARDENS,
    label: "Parks and gardens",
    aliases: Object.freeze(["park", "park or garden"]),
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M13.6 2C7 2.1 3.2 4.9 3.2 9c0 1.1.3 2 .9 2.8L2 13.9l.9.9 2.2-2.1c.8.5 1.7.8 2.7.8 4 0 5.9-4.5 5.8-12.5ZM10.6 5.2c-2 1.1-3.6 2.5-5 4.2l.5.5C7.5 8.4 9 7 11 6Z"/></svg>'
  }),
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.MONUMENTS_LANDMARKS,
    label: "Monuments and landmarks",
    aliases: Object.freeze(["landmark", "public art"]),
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M7.5.8h1v1.6L12 4.9l-.6 1h-1.1v1.5L13 9.3l-.6 1H11v1.4l3 2-.6 1.1H2.6l-.6-1.1 3-2v-1.4H3.6l-.6-1 2.7-1.9V5.9H4.6l-.6-1 3.5-2.5Z"/></svg>'
  }),
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.OTHER_SITES_LANDSCAPES,
    label: "Other sites and landscapes",
    aliases: Object.freeze([
      "public space",
      "street or route",
      "natural or landscape feature",
      "other"
    ]),
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M1 13.5 5.6 5.2l2.6 4.5 1.7-2.8 5.1 6.6ZM13.3 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg>'
  }),
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.UNKNOWN,
    label: "Unknown or uncategorized",
    aliases: Object.freeze(["community place"]),
    glyphSvg: '<svg class="community-map-pin__glyph community-map-pin__glyph--fallback" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="4.5"/></svg>'
  })
]);

const COMMUNITY_MAP_CATEGORY_BY_KEY = new Map(
  COMMUNITY_MAP_CATEGORY_DEFINITIONS.map((definition) => [definition.key, definition])
);

const COMMUNITY_MAP_CATEGORY_BY_ALIAS = new Map(
  COMMUNITY_MAP_CATEGORY_DEFINITIONS.flatMap((definition) => (
    definition.aliases.map((alias) => [alias, definition])
  ))
);

function cleanStoredType(value) {
  return String(value || "").trim();
}

function normalizeCommunityTypeForComparison(value) {
  return cleanStoredType(value).replace(/\s+/g, " ").toLowerCase();
}

function getEffectiveCommunityType(record = {}) {
  return cleanStoredType(record.assetType) || cleanStoredType(record.category);
}

function getCommunityMapCategory(record = {}) {
  const normalizedType = normalizeCommunityTypeForComparison(getEffectiveCommunityType(record));
  return COMMUNITY_MAP_CATEGORY_BY_ALIAS.get(normalizedType)
    || COMMUNITY_MAP_CATEGORY_BY_KEY.get(COMMUNITY_MAP_CATEGORY_KEYS.UNKNOWN);
}

function getCommunityMapCategoryByKey(key) {
  return COMMUNITY_MAP_CATEGORY_BY_KEY.get(key)
    || COMMUNITY_MAP_CATEGORY_BY_KEY.get(COMMUNITY_MAP_CATEGORY_KEYS.UNKNOWN);
}

function buildCommunityMarkerAccessibleName(record = {}) {
  const title = cleanStoredType(record.title || record.name) || "Untitled";
  const category = getCommunityMapCategory(record);
  return `Open community heritage record: ${title}. Map category: ${category.label}.`;
}

export {
  COMMUNITY_MAP_CATEGORY_DEFINITIONS,
  COMMUNITY_MAP_CATEGORY_KEYS,
  buildCommunityMarkerAccessibleName,
  getCommunityMapCategory,
  getCommunityMapCategoryByKey,
  getEffectiveCommunityType,
  normalizeCommunityTypeForComparison
};
