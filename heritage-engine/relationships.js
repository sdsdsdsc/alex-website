const PUBLIC_RELATIONSHIP_COLLECTIONS = Object.freeze([
  "communityPlaces",
  "news",
  "history"
]);

const PLACE_RELATIONSHIP_COLLECTIONS = Object.freeze([
  "communityPlaces"
]);

const ARTICLE_RELATIONSHIP_COLLECTIONS = Object.freeze([
  "news",
  "history"
]);

const RELATIONSHIP_COLLECTION_LABELS = Object.freeze({
  communityPlaces: "Community place",
  news: "News article",
  history: "History story"
});

function cleanText(value) {
  return String(value || "").trim();
}

function getDefaultBaseHref() {
  return typeof window === "undefined" ? "http://localhost/" : window.location.href;
}

function getRelationshipCollectionLabel(collection) {
  return RELATIONSHIP_COLLECTION_LABELS[cleanText(collection)] || "Related record";
}

function getFallbackRelationshipTitle(collection, id) {
  const label = getRelationshipCollectionLabel(collection);
  const safeId = cleanText(id);
  return safeId ? `${label}: ${safeId}` : label;
}

function buildPublicRelationshipUrl(reference, options = {}) {
  const collection = cleanText(reference?.collection);
  const id = cleanText(reference?.id);
  if (!collection || !id) return "";

  let path = "";
  if (collection === "communityPlaces") {
    path = `place.html?id=${encodeURIComponent(id)}`;
  } else if (collection === "news" || collection === "history") {
    path = `article.html?id=${encodeURIComponent(id)}&type=${encodeURIComponent(collection)}`;
  } else {
    return "";
  }

  if (options.absolute) {
    return new URL(path, options.baseHref || getDefaultBaseHref()).href;
  }
  return path;
}

function normalizeAllowedCollections(allowedCollections = PUBLIC_RELATIONSHIP_COLLECTIONS) {
  return allowedCollections instanceof Set
    ? allowedCollections
    : new Set(Array.from(allowedCollections || []).map(cleanText).filter(Boolean));
}

function buildRelationshipWarning(reference, code, detail, allowedCollections) {
  return {
    code,
    detail,
    collection: cleanText(reference?.collection),
    id: cleanText(reference?.id),
    title: cleanText(reference?.title),
    allowedCollections: Array.from(allowedCollections)
  };
}

function normalizeRelationshipReferences(value, options = {}) {
  if (!Array.isArray(value)) {
    return {
      references: [],
      warnings: []
    };
  }

  const allowedCollections = normalizeAllowedCollections(options.allowedCollections);
  const seen = new Set();
  const references = [];
  const warnings = [];

  value.forEach((reference) => {
    if (!reference || typeof reference !== "object" || Array.isArray(reference)) {
      warnings.push(buildRelationshipWarning(reference, "invalid_shape", "Relationship item must be an object.", allowedCollections));
      return;
    }

    const collection = cleanText(reference.collection);
    const id = cleanText(reference.id);

    if (!collection || !id) {
      warnings.push(buildRelationshipWarning(reference, "missing_collection_or_id", "Relationship item must include both collection and id.", allowedCollections));
      return;
    }

    if (!allowedCollections.has(collection)) {
      warnings.push(buildRelationshipWarning(reference, "unsupported_collection", "Relationship collection is not allowed for this public context.", allowedCollections));
      return;
    }

    const dedupeKey = `${collection}:${id}`;
    if (seen.has(dedupeKey)) {
      warnings.push(buildRelationshipWarning(reference, "duplicate_reference", "Duplicate relationship reference was ignored.", allowedCollections));
      return;
    }
    seen.add(dedupeKey);

    const url = buildPublicRelationshipUrl({ collection, id }, options);
    if (!url) {
      warnings.push(buildRelationshipWarning(reference, "unsafe_url", "Relationship could not be converted into a safe public URL.", allowedCollections));
      return;
    }

    references.push({
      collection,
      id,
      title: cleanText(reference.title) || getFallbackRelationshipTitle(collection, id),
      label: getRelationshipCollectionLabel(collection),
      url
    });
  });

  return { references, warnings };
}

function getRelationshipWarningSummary(warnings) {
  if (!Array.isArray(warnings) || warnings.length === 0) return "";
  return warnings.map((warning) => {
    const idPart = warning.id ? ` (${warning.id})` : "";
    return `${warning.code}: ${warning.detail}${idPart}`;
  }).join(" | ");
}

export {
  ARTICLE_RELATIONSHIP_COLLECTIONS,
  PLACE_RELATIONSHIP_COLLECTIONS,
  PUBLIC_RELATIONSHIP_COLLECTIONS,
  buildPublicRelationshipUrl,
  cleanText,
  getFallbackRelationshipTitle,
  getRelationshipCollectionLabel,
  getRelationshipWarningSummary,
  normalizeRelationshipReferences
};
