// === Firebase imports ===
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Firebase config (reuse your existing settings) ===
const firebaseConfig = {
  apiKey: "AIzaSyDr8hSSoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Collections we export ===
const COLLECTIONS = ["news", "history", "communityPlaces"];
const ARTICLE_COLLECTIONS = new Set(["news", "history"]);
const RELATIONSHIP_FIELDS = new Set([
  "schema:subjectOf",
  "subjectOf",
  "schema:about",
  "about",
  "schema:mentions",
  "mentions"
]);

function cleanText(value) {
  return String(value || "").trim();
}

function toSafeUrl(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value, window.location.href);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (err) {
    console.warn("Invalid URL skipped:", value);
  }
  return "";
}

function hasCoordinates(data) {
  return Number.isFinite(Number(data?.lat)) && Number.isFinite(Number(data?.lng));
}

function makePlaceId(docId) {
  return `place.html?id=${encodeURIComponent(docId)}`;
}

function makeArticleId(docId, type) {
  return `article.html?id=${encodeURIComponent(docId)}&type=${encodeURIComponent(type)}`;
}

function stripUnsafeStoredJsonLd(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const clean = {};

  Object.entries(value).forEach(([key, entry]) => {
    if (key === "@context" || key === "@id" || RELATIONSHIP_FIELDS.has(key)) return;
    clean[key] = entry;
  });

  return clean;
}

function mergeStoredJsonLd(base, storedJsonLd) {
  return {
    ...stripUnsafeStoredJsonLd(storedJsonLd),
    ...base
  };
}

function normalizeRelatedArticles(relatedArticles) {
  if (!Array.isArray(relatedArticles)) return [];
  const seen = new Set();

  return relatedArticles
    .map((reference) => {
      const collectionName = cleanText(reference?.collection);
      const id = cleanText(reference?.id);
      if (!ARTICLE_COLLECTIONS.has(collectionName) || !id) return null;

      const key = `${collectionName}:${id}`;
      if (seen.has(key)) return null;
      seen.add(key);

      return {
        "@id": makeArticleId(id, collectionName),
        "@type": "schema:Article",
        "schema:name": cleanText(reference?.title) || id
      };
    })
    .filter(Boolean);
}

function normalizeRelatedPlaces(relatedPlaces) {
  if (!Array.isArray(relatedPlaces)) return [];
  const seen = new Set();

  return relatedPlaces
    .map((reference) => {
      const collectionName = cleanText(reference?.collection);
      const id = cleanText(reference?.id);
      if (collectionName !== "communityPlaces" || !id) return null;

      if (seen.has(id)) return null;
      seen.add(id);

      return {
        "@id": makePlaceId(id),
        "@type": "schema:Place",
        "schema:name": cleanText(reference?.title) || id
      };
    })
    .filter(Boolean);
}

function buildCommunityPlaceJsonLd(docId, data) {
  const node = {
    "@id": makePlaceId(docId),
    "@type": "schema:Place",
    "schema:name": cleanText(data.title) || "Community place"
  };

  const description = cleanText(data.description);
  const category = cleanText(data.category);
  const location = cleanText(data.location);
  const imageUrl = toSafeUrl(data.imageUrl);
  const source = cleanText(data.source);
  const relatedArticles = normalizeRelatedArticles(data.relatedArticles);

  if (description) node["schema:description"] = description;
  if (category) node["schema:additionalType"] = category;
  if (location) node["schema:address"] = location;
  if (imageUrl) node["schema:image"] = imageUrl;
  if (source) node["schema:sourceOrganization"] = source;
  if (relatedArticles.length === 1) node["schema:subjectOf"] = relatedArticles[0];
  if (relatedArticles.length > 1) node["schema:subjectOf"] = relatedArticles;
  if (hasCoordinates(data)) {
    node["schema:geo"] = {
      "@type": "schema:GeoCoordinates",
      "schema:latitude": Number(data.lat),
      "schema:longitude": Number(data.lng)
    };
  }

  return mergeStoredJsonLd(node, data.jsonld);
}

function buildArticleJsonLd(docId, collectionName, data) {
  const node = {
    "@id": makeArticleId(docId, collectionName),
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

  return mergeStoredJsonLd(node, data.jsonld);
}

function buildGraphNode(docId, collectionName, data) {
  if (collectionName === "communityPlaces") {
    return buildCommunityPlaceJsonLd(docId, data);
  }
  if (ARTICLE_COLLECTIONS.has(collectionName)) {
    return buildArticleJsonLd(docId, collectionName, data);
  }
  return null;
}

function buildJsonLdGraph(nodes) {
  return {
    "@context": {
      "schema": "https://schema.org/",
      "dc": "http://purl.org/dc/terms/"
    },
    "@graph": nodes
  };
}

// === Export function ===
async function exportHeritageJSON() {
  const status = document.getElementById("status");
  const button = document.getElementById("downloadBtn");
  status.textContent = "⏳ Gathering data…";
  button.disabled = true;

  try {
    const graphNodes = [];

    for (const col of COLLECTIONS) {
      const snapshot = await getDocs(collection(db, col));
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const node = buildGraphNode(docSnap.id, col, data);
        if (node) graphNodes.push(node);
      });
    }

    const output = buildJsonLdGraph(graphNodes);
    status.textContent = `✅ ${graphNodes.length} JSON-LD records collected`;

    const blob = new Blob([JSON.stringify(output, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heritage.json";
    a.click();
    URL.revokeObjectURL(url);

    status.textContent += " — Downloaded!";
  } catch (err) {
    console.error("Export failed:", err);
    status.textContent = "❌ Export failed. Please try again.";
  } finally {
    button.disabled = false;
  }
}

// === Connect button ===
document.getElementById("downloadBtn").addEventListener("click", exportHeritageJSON);
