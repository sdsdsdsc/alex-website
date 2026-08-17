import { stripUnsafePublicFields } from "./validation.js";
import { isPublicRecord } from "./search.js";
import {
  ARTICLE_RELATIONSHIP_COLLECTIONS,
  PLACE_RELATIONSHIP_COLLECTIONS,
  normalizeRelationshipReferences
} from "./relationships.js";

const ARTICLE_COLLECTIONS = new Set(["news", "history"]);
const RELATIONSHIP_FIELDS = new Set([
  "schema:subjectOf",
  "subjectOf",
  "schema:about",
  "about",
  "schema:mentions",
  "mentions"
]);
const UNSAFE_PUBLIC_EXPORT_FIELDS = new Set([
  "placeNominations",
  "evidenceImageUrl",
  "evidenceImageCaption",
  "evidenceSourceCredit",
  "evidenceRightsStatus",
  "evidencePermissionConfirmed",
  "evidenceVisibility",
  "evidenceStoragePath",
  "evidenceFileName",
  "evidenceFileContentType",
  "evidenceFileSize",
  "evidenceUploadedAt",
  "evidenceUploadedByUid",
  "nominatorEmail",
  "adminNotes",
  "adminHistoricInterest",
  "adminArchitecturalInterest",
  "adminCommunityValue",
  "adminConditionRisk",
  "adminAssessmentSummary",
  "reviewHistory",
  "privateReviewData",
  "adminBackupMetadata"
]);

function cleanText(value) {
  return String(value || "").trim();
}

function getDefaultBaseHref() {
  return typeof window === "undefined" ? "http://localhost/" : window.location.href;
}

function normalizeTextList(value) {
  const values = Array.isArray(value)
    ? value
    : cleanText(value).split(/[\n,;]+/);

  return [...new Set(values.map(cleanText).filter(Boolean))];
}

function singleOrArray(values) {
  if (values.length === 0) return null;
  return values.length === 1 ? values[0] : values;
}

function normalizeDate(value) {
  if (!value) return "";

  if (typeof value === "string") {
    const textValue = cleanText(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(textValue)) return textValue;
  }

  let date = null;
  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else if (Number.isFinite(value?.seconds)) {
    date = new Date(value.seconds * 1000);
  } else {
    date = new Date(value);
  }

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function toSafeUrl(value, baseHref = getDefaultBaseHref()) {
  if (!value) return "";
  try {
    const parsed = new URL(value, baseHref);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (err) {
    return "";
  }
  return "";
}

function normalizeCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function hasValidCoordinates(data) {
  return normalizeCoordinate(data?.lat) !== null && normalizeCoordinate(data?.lng) !== null;
}

function buildStablePlaceId(docId) {
  return `place.html?id=${encodeURIComponent(docId)}`;
}

function buildStableArticleId(docId, type) {
  return `article.html?id=${encodeURIComponent(docId)}&type=${encodeURIComponent(type)}`;
}

function removeUnsafeJsonLdFields(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const clean = {};

  Object.entries(value).forEach(([key, entry]) => {
    if (
      key === "@context"
      || key === "@id"
      || RELATIONSHIP_FIELDS.has(key)
      || UNSAFE_PUBLIC_EXPORT_FIELDS.has(key)
    ) {
      return;
    }
    clean[key] = stripUnsafePublicFields(entry);
  });

  return clean;
}

function mergeSafeJsonLd(base, storedJsonLd) {
  return {
    ...removeUnsafeJsonLdFields(storedJsonLd),
    ...base
  };
}

function normalizeRelatedArticles(relatedArticles) {
  return normalizeRelationshipReferences(relatedArticles, {
    allowedCollections: ARTICLE_RELATIONSHIP_COLLECTIONS
  }).references.map((reference) => ({
    "@id": buildStableArticleId(reference.id, reference.collection),
    "@type": "schema:Article",
    "schema:name": reference.title
  }));
}

function normalizeRelatedPlaces(relatedPlaces) {
  return normalizeRelationshipReferences(relatedPlaces, {
    allowedCollections: PLACE_RELATIONSHIP_COLLECTIONS
  }).references.map((reference) => ({
    "@id": buildStablePlaceId(reference.id),
    "@type": "schema:Place",
    "schema:name": reference.title
  }));
}

function buildPlaceJsonLdNode(docId, data) {
  const node = {
    "@id": buildStablePlaceId(docId),
    "@type": "schema:Place",
    "schema:name": cleanText(data.title) || "Community place"
  };

  const description = cleanText(data.description);
  const category = cleanText(data.category);
  const assetType = cleanText(data.assetType);
  const area = cleanText(data.area);
  const localSignificanceSummary = cleanText(data.localSignificanceSummary);
  const heritageCriteria = normalizeTextList(data.heritageCriteria);
  const keywords = normalizeTextList(data.tags).concat(heritageCriteria);
  const criteriaExplanation = cleanText(data.criteriaExplanation);
  const recordStatus = cleanText(data.recordStatus);
  const location = cleanText(data.location);
  const imageUrl = toSafeUrl(data.imageUrl);
  const source = cleanText(data.source);
  const heritageValue = cleanText(data.heritageValue);
  const condition = cleanText(data.condition);
  const communityUse = cleanText(data.communityUse);
  const sourceReference = cleanText(data.sourceReference);
  const dateCreated = normalizeDate(data.dateAdded || data.createdAt);
  const dateModified = normalizeDate(data.lastReviewed || data.updatedAt);
  const relatedArticles = normalizeRelatedArticles(data.relatedArticles);

  if (description) node["schema:description"] = description;
  const additionalTypes = singleOrArray([...new Set([category, assetType].filter(Boolean))]);
  if (additionalTypes) node["schema:additionalType"] = additionalTypes;
  if (area) {
    node["schema:containedInPlace"] = {
      "@type": "schema:Place",
      "schema:name": area
    };
  }
  if (localSignificanceSummary) node["schema:abstract"] = localSignificanceSummary;
  const normalizedKeywords = singleOrArray([...new Set(keywords)]);
  if (normalizedKeywords) node["schema:keywords"] = normalizedKeywords;
  if (location) node["schema:address"] = location;
  if (imageUrl) node["schema:image"] = imageUrl;
  if (source) node["schema:sourceOrganization"] = source;
  const additionalProperties = [
    ["Criteria explanation", criteriaExplanation],
    ["Record status", recordStatus],
    ["Heritage value", heritageValue],
    ["Condition", condition],
    ["Community use", communityUse]
  ].filter(([, value]) => value).map(([name, value]) => ({
    "@type": "schema:PropertyValue",
    "schema:name": name,
    "schema:value": value
  }));
  if (additionalProperties.length > 0) node["schema:additionalProperty"] = additionalProperties;
  if (sourceReference) node["dc:source"] = sourceReference;
  if (dateCreated) node["schema:dateCreated"] = dateCreated;
  if (dateModified) node["schema:dateModified"] = dateModified;
  if (relatedArticles.length === 1) node["schema:subjectOf"] = relatedArticles[0];
  if (relatedArticles.length > 1) node["schema:subjectOf"] = relatedArticles;
  if (hasValidCoordinates(data)) {
    node["schema:geo"] = {
      "@type": "schema:GeoCoordinates",
      "schema:latitude": Number(data.lat),
      "schema:longitude": Number(data.lng)
    };
  }

  return mergeSafeJsonLd(node, data.jsonld);
}

function buildArticleJsonLdNode(docId, collectionName, data) {
  const node = {
    "@id": buildStableArticleId(docId, collectionName),
    "@type": "schema:Article",
    "schema:name": cleanText(data.title || data.message) || "Untitled article",
    "schema:isPartOf": collectionName
  };

  const imageUrl = toSafeUrl(data.imageUrl);
  const author = cleanText(data.author);
  const contentUrl = toSafeUrl(data.htmlUrl);
  const relatedPlaces = normalizeRelatedPlaces(data.relatedPlaces);

  if (imageUrl) node["schema:image"] = imageUrl;
  if (author) {
    node["schema:creator"] = {
      "@type": "schema:Person",
      "schema:name": author
    };
  }
  if (contentUrl) node["schema:contentUrl"] = contentUrl;
  if (relatedPlaces.length === 1) node["schema:about"] = relatedPlaces[0];
  if (relatedPlaces.length > 1) node["schema:about"] = relatedPlaces;

  return mergeSafeJsonLd(node, data.jsonld);
}

function buildGraphNode(docId, collectionName, data) {
  if (collectionName === "communityPlaces") {
    if (!isPublicRecord(data)) return null;
    return buildPlaceJsonLdNode(docId, data);
  }
  if (ARTICLE_COLLECTIONS.has(collectionName)) {
    return buildArticleJsonLdNode(docId, collectionName, data);
  }
  return null;
}

function buildPublicGraph(records) {
  const publicPlaceIds = new Set(records
    .filter((record) => record.collectionName === "communityPlaces" && isPublicRecord(record.data))
    .map((record) => cleanText(record.id))
    .filter(Boolean));

  return records
    .map((record) => {
      if (!ARTICLE_COLLECTIONS.has(record.collectionName)) {
        return buildGraphNode(record.id, record.collectionName, record.data);
      }

      const publicRelatedPlaces = normalizeRelationshipReferences(record.data?.relatedPlaces, {
        allowedCollections: PLACE_RELATIONSHIP_COLLECTIONS
      }).references.filter((reference) => publicPlaceIds.has(reference.id));
      return buildGraphNode(record.id, record.collectionName, {
        ...record.data,
        relatedPlaces: publicRelatedPlaces
      });
    })
    .filter(Boolean);
}

function buildPublicHeritageJsonLd(nodes) {
  return stripUnsafePublicFields({
    "@context": {
      "schema": "https://schema.org/",
      "dc": "http://purl.org/dc/terms/"
    },
    "@graph": nodes
  });
}

export {
  buildArticleJsonLdNode,
  buildGraphNode,
  buildPlaceJsonLdNode,
  buildPublicGraph,
  buildPublicHeritageJsonLd,
  buildStableArticleId,
  buildStablePlaceId,
  cleanText,
  hasValidCoordinates,
  mergeSafeJsonLd,
  normalizeCoordinate,
  normalizeDate,
  normalizeRelatedArticles,
  normalizeRelatedPlaces,
  normalizeTextList,
  removeUnsafeJsonLdFields,
  toSafeUrl
};
