import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDr8hSsoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const els = {
  status: document.getElementById("placeRecordStatus"),
  content: document.getElementById("placeRecordContent"),
  title: document.getElementById("placeTitle"),
  kicker: document.getElementById("placeCategoryKicker"),
  breadcrumbTitle: document.getElementById("placeBreadcrumbTitle"),
  description: document.getElementById("placeDescription"),
  tags: document.getElementById("placeTags"),
  actions: document.getElementById("placeActions"),
  imageWrap: document.getElementById("placeImageWrap"),
  metadata: document.getElementById("placeMetadata")
};

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

function hasCoordinates(place) {
  return Number.isFinite(place?.lat) && Number.isFinite(place?.lng);
}

function normalizeCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function getTags(place) {
  if (Array.isArray(place?.tags)) return place.tags.map(cleanText).filter(Boolean);
  return cleanText(place?.tags).split(",").map(cleanText).filter(Boolean);
}

function hasUsableJsonLd(value) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length > 0;
}

function formatDate(createdAt) {
  if (!Number.isFinite(createdAt?.seconds)) return "Not specified";
  return new Date(createdAt.seconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function metadataValue(value) {
  return cleanText(value) || "Not specified";
}

function buildMapUrl(place) {
  const title = cleanText(place.title);
  if (hasCoordinates(place)) {
    return `map.html?lat=${encodeURIComponent(place.lat)}&lng=${encodeURIComponent(place.lng)}`;
  }
  return `map.html?search=${encodeURIComponent(title)}`;
}

function appendMetadata(label, value) {
  if (!els.metadata) return;
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = value;
  els.metadata.append(dt, dd);
}

function renderImage(place) {
  if (!els.imageWrap) return;
  els.imageWrap.textContent = "";
  const imageUrl = toSafeUrl(place.imageUrl);
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = cleanText(place.title) || "Community place image";
    els.imageWrap.appendChild(image);
    return;
  }
  const placeholder = document.createElement("div");
  placeholder.className = "place-record-image__placeholder";
  placeholder.textContent = "Community place";
  els.imageWrap.appendChild(placeholder);
}

function renderTags(place) {
  if (!els.tags) return;
  els.tags.textContent = "";
  const tags = getTags(place);
  if (tags.length === 0) return;
  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    els.tags.appendChild(item);
  });
}

function renderActions(place) {
  if (!els.actions) return;
  els.actions.textContent = "";
  const mapLink = document.createElement("a");
  mapLink.href = buildMapUrl(place);
  mapLink.textContent = "View on map";
  els.actions.appendChild(mapLink);

  const relatedArticle = toSafeUrl(place.relatedArticle);
  if (relatedArticle) {
    const articleLink = document.createElement("a");
    articleLink.href = relatedArticle;
    articleLink.textContent = "Related article";
    els.actions.appendChild(articleLink);
  }
}

function generatePlaceJsonLd(place) {
  const tags = getTags(place);
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: cleanText(place.title) || "Community place",
    url: window.location.href
  };

  const description = cleanText(place.description);
  const category = cleanText(place.category);
  const location = cleanText(place.location);
  const imageUrl = toSafeUrl(place.imageUrl);
  const source = cleanText(place.source);

  if (description) jsonld.description = description;
  if (category) jsonld.additionalType = category;
  if (location) {
    jsonld.address = location;
    jsonld.location = location;
  }
  if (imageUrl) jsonld.image = imageUrl;
  if (tags.length > 0) jsonld.keywords = tags.join(", ");
  if (source) jsonld.sourceOrganization = source;
  if (hasCoordinates(place)) {
    jsonld.geo = {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng
    };
  }

  return jsonld;
}

function injectJsonLd(place) {
  const jsonld = hasUsableJsonLd(place.jsonld) ? place.jsonld : generatePlaceJsonLd(place);
  let script = document.getElementById("place-jsonld");
  if (!script) {
    script = document.createElement("script");
    script.id = "place-jsonld";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonld, null, 2);
}

function renderPlace(place) {
  const title = cleanText(place.title) || "Untitled community place";
  document.title = `${title} | Alex's Photo Board`;
  if (els.title) els.title.textContent = title;
  if (els.breadcrumbTitle) els.breadcrumbTitle.textContent = title;
  if (els.kicker) els.kicker.textContent = cleanText(place.category) || "Community place";
  if (els.description) els.description.textContent = cleanText(place.description) || "No overview has been added yet.";

  if (els.metadata) {
    els.metadata.textContent = "";
    appendMetadata("Category", metadataValue(place.category));
    appendMetadata("Location", metadataValue(place.location));
    appendMetadata("Period", metadataValue(place.period));
    appendMetadata("Grade", metadataValue(place.grade));
    appendMetadata("Source", metadataValue(place.source));
    appendMetadata("Created date", formatDate(place.createdAt));
  }

  renderImage(place);
  renderTags(place);
  renderActions(place);
  injectJsonLd(place);

  if (els.status) els.status.textContent = "";
  if (els.content) els.content.hidden = false;
}

async function loadPlace() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    if (els.status) els.status.textContent = "No community place record was requested.";
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, "communityPlaces", id));
    if (!snapshot.exists()) {
      if (els.status) els.status.textContent = "Community place record not found.";
      return;
    }
    const data = snapshot.data();
    renderPlace({
      id: snapshot.id,
      ...data,
      lat: normalizeCoordinate(data.lat),
      lng: normalizeCoordinate(data.lng)
    });
  } catch (err) {
    console.error("Failed to load community place:", err);
    if (els.status) els.status.textContent = "Could not load this community place record. Please try again later.";
  }
}

loadPlace();
