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

function buildExtendedRelationshipWarning(reference, code, detail, allowedCollections, extra = {}) {
  return {
    ...buildRelationshipWarning(reference, code, detail, allowedCollections),
    ...extra
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
    const title = cleanText(reference.title);

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

    if (!title) {
      warnings.push(buildRelationshipWarning(reference, "missing_title", "Relationship title is missing and a fallback label will be used.", allowedCollections));
    }

    references.push({
      collection,
      id,
      title: title || getFallbackRelationshipTitle(collection, id),
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

function buildStoredRelationshipReferences(value, options = {}) {
  return normalizeRelationshipReferences(value, options).references.map((reference) => ({
    collection: reference.collection,
    id: reference.id,
    title: reference.title
  }));
}

function getRelationshipRecordTitle(record, collection) {
  const title = cleanText(record?.title || record?.message);
  return title || getFallbackRelationshipTitle(collection, record?.id);
}

function buildRelationshipRecordLookup(recordsByCollection = {}) {
  const lookup = {};

  Object.entries(recordsByCollection || {}).forEach(([collection, records]) => {
    const safeCollection = cleanText(collection);
    if (!safeCollection || !Array.isArray(records)) return;

    lookup[safeCollection] = {};
    records.forEach((record) => {
      const id = cleanText(record?.id);
      if (!id) return;
      lookup[safeCollection][id] = {
        ...record,
        id
      };
    });
  });

  return lookup;
}

function hasReciprocalRelationship(targetRecord, sourceReference, reciprocalField, reciprocalAllowedCollections) {
  if (!targetRecord || !sourceReference || !reciprocalField) return false;

  const reciprocalReport = normalizeRelationshipReferences(targetRecord?.[reciprocalField], {
    allowedCollections: reciprocalAllowedCollections
  });

  return reciprocalReport.references.some((reference) => (
    reference.collection === sourceReference.collection
      && reference.id === sourceReference.id
  ));
}

function auditRelationshipReferences(value, options = {}) {
  const allowedCollections = normalizeAllowedCollections(options.allowedCollections);
  const normalized = normalizeRelationshipReferences(value, {
    ...options,
    allowedCollections
  });
  const warnings = [...normalized.warnings];
  const targetLookup = options.targetLookup || buildRelationshipRecordLookup(options.targetRecordsByCollection);
  const sourceReference = options.sourceReference && cleanText(options.sourceReference.collection) && cleanText(options.sourceReference.id)
    ? {
        collection: cleanText(options.sourceReference.collection),
        id: cleanText(options.sourceReference.id),
        title: cleanText(options.sourceReference.title)
      }
    : null;
  const reciprocalField = cleanText(options.reciprocalField);
  const reciprocalAllowedCollections = normalizeAllowedCollections(
    options.reciprocalAllowedCollections || PUBLIC_RELATIONSHIP_COLLECTIONS
  );

  normalized.references.forEach((reference) => {
    const targetRecord = targetLookup?.[reference.collection]?.[reference.id];

    if (!targetRecord) {
      warnings.push(buildExtendedRelationshipWarning(
        reference,
        "missing_target",
        "Linked record could not be found.",
        allowedCollections
      ));
      return;
    }

    const currentTitle = getRelationshipRecordTitle(targetRecord, reference.collection);
    if (currentTitle && cleanText(reference.title) !== currentTitle) {
      warnings.push(buildExtendedRelationshipWarning(
        reference,
        "stale_title",
        "Saved relationship title differs from the linked record title.",
        allowedCollections,
        { currentTitle }
      ));
    }

    if (
      sourceReference
      && reciprocalField
      && !hasReciprocalRelationship(targetRecord, sourceReference, reciprocalField, reciprocalAllowedCollections)
    ) {
      warnings.push(buildExtendedRelationshipWarning(
        reference,
        "missing_reciprocal",
        "Linked record does not currently link back.",
        allowedCollections,
        {
          reciprocalField,
          sourceCollection: sourceReference.collection,
          sourceId: sourceReference.id
        }
      ));
    }
  });

  return {
    references: normalized.references,
    warnings
  };
}

export {
  ARTICLE_RELATIONSHIP_COLLECTIONS,
  PLACE_RELATIONSHIP_COLLECTIONS,
  PUBLIC_RELATIONSHIP_COLLECTIONS,
  auditRelationshipReferences,
  buildRelationshipRecordLookup,
  buildPublicRelationshipUrl,
  buildStoredRelationshipReferences,
  cleanText,
  getFallbackRelationshipTitle,
  getRelationshipCollectionLabel,
  getRelationshipRecordTitle,
  getRelationshipWarningSummary,
  normalizeRelationshipReferences
};
