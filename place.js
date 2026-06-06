import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
  metadata: document.getElementById("placeMetadata"),
  tabs: Array.from(document.querySelectorAll(".place-record-tab")),
  panels: Array.from(document.querySelectorAll(".place-tab-panel"))
};

let placeMap = null;
const validSections = new Set(["overview", "comments-photos"]);

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
  return Number.isFinite(place?.lat)
    && Number.isFinite(place?.lng)
    && place.lat >= -90
    && place.lat <= 90
    && place.lng >= -180
    && place.lng <= 180;
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

function buildMapUrl(place) {
  const title = cleanText(place.title);
  if (hasCoordinates(place)) {
    return `map.html?lat=${encodeURIComponent(place.lat)}&lng=${encodeURIComponent(place.lng)}`;
  }
  return `map.html?search=${encodeURIComponent(title)}`;
}

function getSectionFromUrl() {
  const section = new URLSearchParams(window.location.search).get("section");
  return validSections.has(section) ? section : "overview";
}

function buildSectionUrl(section) {
  const url = new URL(window.location.href);
  url.searchParams.set("section", section);
  url.hash = section === "comments-photos" ? "comments-photos-panel" : "overview-panel";
  return `${url.pathname}${url.search}${url.hash}`;
}

function setActiveSection(section, options = {}) {
  const activeSection = validSections.has(section) ? section : "overview";

  els.tabs.forEach((tab) => {
    const tabSection = tab.dataset.section;
    const isActive = tabSection === activeSection;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
    if (isActive) {
      tab.setAttribute("aria-current", "page");
    } else {
      tab.removeAttribute("aria-current");
    }
  });

  els.panels.forEach((panel) => {
    panel.hidden = panel.dataset.section !== activeSection;
  });

  if (activeSection === "overview" && placeMap) {
    window.setTimeout(() => placeMap.invalidateSize(), 0);
  }

  if (!options.skipHistory) {
    window.history.replaceState({}, "", buildSectionUrl(activeSection));
  }
}

function setupTabs() {
  els.tabs.forEach((tab) => {
    const controls = tab.getAttribute("aria-controls");
    const panel = controls ? document.getElementById(controls) : null;
    const section = controls === "comments-photos-panel" ? "comments-photos" : "overview";
    tab.dataset.section = section;
    if (panel) panel.dataset.section = section;
    tab.href = buildSectionUrl(section);

    tab.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveSection(section);
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const currentIndex = els.tabs.indexOf(tab);
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = els.tabs[(currentIndex + offset + els.tabs.length) % els.tabs.length];
      nextTab.focus();
      setActiveSection(nextTab.dataset.section);
    });
  });
}

function appendMetadata(label, value) {
  if (!els.metadata) return;
  const safeValue = cleanText(value);
  if (!safeValue) return;
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = safeValue;
  els.metadata.append(dt, dd);
}

function formatLocation(place) {
  const parts = [
    cleanText(place.city),
    cleanText(place.province)
  ].filter(Boolean);

  return parts.join(", ") || cleanText(place.location);
}

function formatCoordinate(value) {
  if (!Number.isFinite(value)) return "";
  return Number(value).toFixed(6).replace(/\.?0+$/, "");
}

function formatCoordinates(place) {
  if (!hasCoordinates(place)) return "";
  return `${formatCoordinate(place.lat)}, ${formatCoordinate(place.lng)}`;
}

function getRelatedArticleUrl(place) {
  return toSafeUrl(place.relatedArticle || place.linkedArticle || "");
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
  const contributor = cleanText(place.imageCredit || place.contributor);
  els.imageCredit.textContent = "";

  const creditLines = [["Image source", source]];
  if (contributor) creditLines.push(["Contributor", contributor]);

  creditLines.forEach(([label, value]) => {
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

  const relatedArticle = getRelatedArticleUrl(place);
  if (relatedArticle) {
    const articleLink = document.createElement("a");
    articleLink.href = relatedArticle;
    articleLink.textContent = "Read related article";
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
  coords.textContent = `Coordinates: ${formatCoordinates(place)}`;

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
  const relatedArticle = getRelatedArticleUrl(place);
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
  if (relatedArticle) jsonld.subjectOf = relatedArticle;
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
  const category = cleanText(place.category) || "Community place";
  const heroLocation = formatLocation(place);
  document.title = `${title} | Alex's Photo Board`;
  if (els.title) els.title.textContent = title;
  if (els.breadcrumbTitle) els.breadcrumbTitle.textContent = title;
  if (els.kicker) els.kicker.textContent = category;
  if (els.heroLocation) els.heroLocation.textContent = heroLocation;
  if (els.description) els.description.textContent = cleanText(place.description) || "No overview has been added yet.";

  if (els.metadata) {
    els.metadata.textContent = "";
    appendMetadata("Title", title);
    appendMetadata("Category", category);
    appendMetadata("Address", place.address);
    appendMetadata("Locality", place.location);
    appendMetadata("Associated type", place.associatedType);
    appendMetadata("Period", place.period);
    appendMetadata("Grade", place.grade);
  }

  renderImage(place);
  renderImageCredit(place);
  renderTags(place);
  renderActions(place);
  renderLocation(place);
  injectJsonLd(place);
  setActiveSection(getSectionFromUrl(), { skipHistory: true });

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

setupTabs();
loadPlace();
