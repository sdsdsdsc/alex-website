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
  heroLocation: document.getElementById("placeHeroLocation"),
  breadcrumbTitle: document.getElementById("placeBreadcrumbTitle"),
  description: document.getElementById("placeDescription"),
  tags: document.getElementById("placeTags"),
  actions: document.getElementById("placeActions"),
  imageWrap: document.getElementById("placeImageWrap"),
  imageCredit: document.getElementById("placeImageCredit"),
  locationContent: document.getElementById("placeLocationContent"),
  metadata: document.getElementById("placeMetadata")
};

let placeMap = null;

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

function renderImageCredit(place) {
  if (!els.imageCredit) return;
  const source = cleanText(place.source) || "Alex's Photo Board";
  const contributor = cleanText(place.imageCredit) || "Not specified";
  els.imageCredit.textContent = "";

  [
    ["Image source", source],
    ["Contributor", contributor]
  ].forEach(([label, value]) => {
    const line = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    line.append(strong, value);
    els.imageCredit.appendChild(line);
  });

  const note = document.createElement("span");
  note.textContent = "This image is part of the community place record.";
  els.imageCredit.appendChild(note);
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

function renderLocation(place) {
  if (!els.locationContent) return;
  els.locationContent.textContent = "";

  if (!hasCoordinates(place)) {
    const message = document.createElement("p");
    message.className = "place-location__message";
    message.textContent = "Location coordinates are not available yet.";

    const fallbackLink = document.createElement("a");
    fallbackLink.className = "place-location__button";
    fallbackLink.href = buildMapUrl(place);
    fallbackLink.textContent = "Search on full map";

    els.locationContent.append(message, fallbackLink);
    return;
  }

  const mapEl = document.createElement("div");
  mapEl.id = "placeLocationMap";
  mapEl.className = "place-location__map";

  const coords = document.createElement("p");
  coords.className = "place-location__coords";
  coords.textContent = `Latitude ${place.lat}, Longitude ${place.lng}`;

  const mapLink = document.createElement("a");
  mapLink.className = "place-location__button";
  mapLink.href = buildMapUrl(place);
  mapLink.textContent = "View on full map";

  els.locationContent.append(mapEl, coords, mapLink);

  if (!window.L) {
    mapEl.textContent = "Map library could not be loaded.";
    return;
  }

  if (placeMap) {
    placeMap.remove();
    placeMap = null;
  }

  placeMap = L.map(mapEl).setView([place.lat, place.lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(placeMap);
  L.marker([place.lat, place.lng]).addTo(placeMap)
    .bindPopup(cleanText(place.title) || "Community place");
}

function generatePlaceJsonLd(place) {
  const tags = getTags(place);
  const title = cleanText(place.title) || "Community place";
  const description = cleanText(place.description) || "Community place record from Alex's Photo Board.";
  const category = cleanText(place.category) || "Community place";
  const location = cleanText(place.location) || "Not specified";
  const source = cleanText(place.source) || "Alex's Photo Board";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: title,
    url: window.location.href,
    description,
    additionalType: category,
    category,
    address: location,
    location,
    keywords: tags.length > 0 ? tags.join(", ") : category,
    sourceOrganization: source
  };

  const imageUrl = toSafeUrl(place.imageUrl);

  if (imageUrl) jsonld.image = imageUrl;
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
  const generatedJsonLd = generatePlaceJsonLd(place);
  const jsonld = hasUsableJsonLd(place.jsonld)
    ? { ...generatedJsonLd, ...place.jsonld }
    : generatedJsonLd;
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
  if (els.heroLocation) els.heroLocation.textContent = cleanText(place.location);
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
  renderImageCredit(place);
  renderTags(place);
  renderActions(place);
  renderLocation(place);
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
