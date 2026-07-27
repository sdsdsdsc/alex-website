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
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 13.5v-9h9v9m-7-9v-2h5v2M5.5 7h1m3 0h1m-5 3h1m3 0h1M2.5 13.5h11"/></svg>'
  }),
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.PARKS_GARDENS,
    label: "Parks and gardens",
    aliases: Object.freeze(["park", "park or garden"]),
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M12.8 2.7C7.4 2.8 4 5.1 4 8.7c0 2.4 1.8 3.6 3.7 3.6 3.6 0 5.2-3.7 5.1-9.6ZM3.2 13.3c1.6-2.7 3.8-4.8 7-6.4"/></svg>'
  }),
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.MONUMENTS_LANDMARKS,
    label: "Monuments and landmarks",
    aliases: Object.freeze(["landmark", "public art"]),
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m8 2 2 3H6l2-3Zm-1.5 3h3v6h-3V5ZM4 13.5h8M5 11h6v2.5H5V11Z"/></svg>'
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
    glyphSvg: '<svg class="community-map-pin__glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2.5 11.5 6 7.8l2.1 2 2.2-3 3.2 4.7M2.5 13.5h11M3.5 4.5h2"/></svg>'
  }),
  Object.freeze({
    key: COMMUNITY_MAP_CATEGORY_KEYS.UNKNOWN,
    label: "Unknown or uncategorized",
    aliases: Object.freeze(["community place"]),
    glyphSvg: '<svg class="community-map-pin__glyph community-map-pin__glyph--fallback" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="3"/></svg>'
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
