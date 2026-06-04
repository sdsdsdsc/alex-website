import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
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
  form: document.getElementById("communitySearchForm"),
  input: document.getElementById("communitySearchInput"),
  sort: document.getElementById("communitySearchSort"),
  count: document.getElementById("communitySearchCount"),
  results: document.getElementById("communitySearchResults"),
  empty: document.getElementById("communitySearchEmpty"),
  cityFilter: document.getElementById("communityCityFilter"),
  associatedTypeFilter: document.getElementById("communityAssociatedTypeFilter"),
  contributorFilter: document.getElementById("communityContributorFilter"),
  periodFilter: document.getElementById("communityPeriodFilter"),
  clearFilters: document.getElementById("communitySearchClearFilters"),
  listView: document.getElementById("communityListView"),
  gridView: document.getElementById("communityGridView")
};

let allPlaces = [];
let currentView = "list";

function cleanText(value) {
  return String(value || "").trim();
}

function normalize(value) {
  return cleanText(value).toLowerCase();
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

function createdAtMillis(place) {
  const seconds = place?.createdAt?.seconds;
  return Number.isFinite(seconds) ? seconds * 1000 : 0;
}

function getSearchText(place) {
  return [
    place.title,
    place.description,
    place.category,
    place.location,
    place.province,
    place.city,
    place.district,
    place.address,
    place.associatedType,
    place.contributor,
    place.period,
    place.grade,
    place.source,
    ...getTags(place)
  ].filter(Boolean).join(" ").toLowerCase();
}

function getSelectedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function getDisplayLocation(place) {
  const city = cleanText(place.city);
  const province = cleanText(place.province);
  if (city && province) return `${city}, ${province}`;
  return cleanText(place.location);
}

function updateUrl(query) {
  const url = new URL(window.location.href);
  if (query) {
    url.searchParams.set("q", query);
  } else {
    url.searchParams.delete("q");
  }
  window.history.replaceState({}, "", url);
}

function setEmptyMessage(message) {
  if (!els.empty) return;
  els.empty.textContent = message;
  els.empty.hidden = !message;
}

function setView(view) {
  currentView = view;
  els.results?.classList.toggle("community-result-grid", view === "grid");
  els.results?.classList.toggle("community-result-list", view !== "grid");
  els.listView?.classList.toggle("active", view === "list");
  els.gridView?.classList.toggle("active", view === "grid");
  els.listView?.setAttribute("aria-pressed", String(view === "list"));
  els.gridView?.setAttribute("aria-pressed", String(view === "grid"));
}

function buildMapUrl(place) {
  const title = cleanText(place.title);
  if (hasCoordinates(place)) {
    return `map.html?lat=${encodeURIComponent(place.lat)}&lng=${encodeURIComponent(place.lng)}`;
  }
  return `map.html?search=${encodeURIComponent(title)}`;
}

function makePlaceholder() {
  const placeholder = document.createElement("div");
  placeholder.className = "community-result-card__placeholder";
  placeholder.textContent = "Community place";
  return placeholder;
}

function makeResultCard(place) {
  const card = document.createElement("article");
  card.className = "community-result-card";

  const imageUrl = toSafeUrl(place.imageUrl);
  const media = document.createElement("div");
  media.className = "community-result-card__media";
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = cleanText(place.title) || "Community place image";
    media.appendChild(image);
  } else {
    media.appendChild(makePlaceholder());
  }

  const body = document.createElement("div");
  body.className = "community-result-card__body";

  const meta = document.createElement("p");
  meta.className = "community-result-card__meta";
  meta.textContent = [place.category, getDisplayLocation(place), place.period].map(cleanText).filter(Boolean).join(" | ") || "Community place";

  const title = document.createElement("h3");
  const titleLink = document.createElement("a");
  titleLink.href = `place.html?id=${encodeURIComponent(place.id)}`;
  titleLink.textContent = cleanText(place.title) || "Untitled community place";
  title.appendChild(titleLink);

  const summary = document.createElement("p");
  summary.className = "community-result-card__summary";
  const description = cleanText(place.description);
  summary.textContent = description || "No description has been added yet.";

  const tags = getTags(place);
  const tagWrap = document.createElement("div");
  tagWrap.className = "community-result-card__tags";
  tags.slice(0, 6).forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.textContent = tag;
    tagWrap.appendChild(tagEl);
  });

  const actions = document.createElement("div");
  actions.className = "community-result-card__actions";
  const recordLink = document.createElement("a");
  recordLink.href = `place.html?id=${encodeURIComponent(place.id)}`;
  recordLink.textContent = "View record";
  const mapLink = document.createElement("a");
  mapLink.href = buildMapUrl(place);
  mapLink.textContent = "View on map";
  actions.append(recordLink, mapLink);

  body.append(meta, title, summary);
  if (tags.length > 0) body.appendChild(tagWrap);
  body.appendChild(actions);
  card.append(media, body);
  return card;
}

function matchesFilters(place, filters) {
  const {
    query,
    categories,
    city,
    associatedType,
    contributor,
    period
  } = filters;
  const searchMatches = !query || getSearchText(place).includes(query);
  const categoryMatches = categories.length === 0 || categories.includes(cleanText(place.category));
  const cityMatches = !city || cleanText(place.city) === city;
  const associatedTypeMatches = !associatedType || cleanText(place.associatedType) === associatedType;
  const contributorMatches = !contributor || cleanText(place.contributor) === contributor;
  const periodMatches = !period || cleanText(place.period) === period;
  return searchMatches
    && categoryMatches
    && cityMatches
    && associatedTypeMatches
    && contributorMatches
    && periodMatches;
}

function sortPlaces(places, query) {
  const sortMode = els.sort?.value || "relevance";
  const cloned = [...places];

  if (sortMode === "title") {
    cloned.sort((a, b) => cleanText(a.title).localeCompare(cleanText(b.title)));
    return cloned;
  }

  if (sortMode === "newest") {
    cloned.sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
    return cloned;
  }

  cloned.sort((a, b) => {
    const aTitle = normalize(a.title);
    const bTitle = normalize(b.title);
    const aStarts = query && aTitle.startsWith(query) ? 1 : 0;
    const bStarts = query && bTitle.startsWith(query) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;
    return cleanText(a.title).localeCompare(cleanText(b.title));
  });
  return cloned;
}

function renderResults() {
  if (!els.results || !els.count) return;

  const rawQuery = cleanText(els.input?.value || "");
  const query = normalize(rawQuery);
  const selectedCategories = getSelectedValues("category");
  const filters = {
    query,
    categories: selectedCategories,
    city: cleanText(els.cityFilter?.value),
    associatedType: cleanText(els.associatedTypeFilter?.value),
    contributor: cleanText(els.contributorFilter?.value),
    period: cleanText(els.periodFilter?.value)
  };

  updateUrl(rawQuery);
  els.results.textContent = "";

  if (allPlaces.length === 0) {
    els.count.textContent = "0 community place records";
    setEmptyMessage("No community place records have been added yet. Records will appear here once communityPlaces data is added in Firestore.");
    return;
  }

  const filtered = allPlaces.filter((place) => matchesFilters(place, filters));
  const sorted = sortPlaces(filtered, query);

  els.count.textContent = `${sorted.length} ${sorted.length === 1 ? "community place" : "community places"} found`;
  setEmptyMessage(sorted.length === 0 ? "No matching community places found." : "");
  sorted.forEach((place) => els.results.appendChild(makeResultCard(place)));
  setView(currentView);
}

function getUniqueValues(field) {
  return [...new Set(allPlaces.map((place) => cleanText(place[field])).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function populateSelect(select, values) {
  if (!select) return;
  const currentValue = select.value;
  select.textContent = "";

  const showAll = document.createElement("option");
  showAll.value = "";
  showAll.textContent = "Show all";
  select.appendChild(showAll);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });

  select.value = values.includes(currentValue) ? currentValue : "";
}

function renderFilterOptions() {
  populateSelect(els.associatedTypeFilter, getUniqueValues("associatedType"));
  populateSelect(els.contributorFilter, getUniqueValues("contributor"));
  populateSelect(els.periodFilter, getUniqueValues("period"));
}

function bindEvents() {
  els.form?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderResults();
  });

  document.querySelectorAll('input[name="category"]').forEach((input) => {
    input.addEventListener("change", renderResults);
  });

  [els.cityFilter, els.associatedTypeFilter, els.contributorFilter, els.periodFilter].forEach((select) => {
    select?.addEventListener("change", renderResults);
  });

  els.sort?.addEventListener("change", renderResults);
  els.clearFilters?.addEventListener("click", () => {
    document.querySelectorAll('.community-search-filters input[name="category"]').forEach((input) => {
      input.checked = false;
    });
    [els.cityFilter, els.associatedTypeFilter, els.contributorFilter, els.periodFilter].forEach((select) => {
      if (select) select.value = "";
    });
    renderResults();
  });
  els.listView?.addEventListener("click", () => setView("list"));
  els.gridView?.addEventListener("click", () => setView("grid"));
}

async function loadCommunityPlaces() {
  if (!els.results) return;
  bindEvents();
  const initialQuery = new URLSearchParams(window.location.search).get("q") || "";
  if (els.input) els.input.value = initialQuery;

  try {
    const snapshot = await getDocs(collection(db, "communityPlaces"));
    allPlaces = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allPlaces.push({
        id: docSnap.id,
        title: cleanText(data.title),
        category: cleanText(data.category),
        location: cleanText(data.location),
        province: cleanText(data.province),
        city: cleanText(data.city),
        district: cleanText(data.district),
        address: cleanText(data.address),
        associatedType: cleanText(data.associatedType),
        contributor: cleanText(data.contributor),
        period: cleanText(data.period),
        description: cleanText(data.description),
        imageUrl: cleanText(data.imageUrl),
        grade: cleanText(data.grade),
        source: cleanText(data.source),
        relatedArticle: cleanText(data.relatedArticle),
        tags: data.tags,
        lat: normalizeCoordinate(data.lat),
        lng: normalizeCoordinate(data.lng),
        createdAt: data.createdAt
      });
    });
    renderFilterOptions();
    renderResults();
  } catch (err) {
    console.error("Failed to load communityPlaces:", err);
    if (els.count) els.count.textContent = "Community place records unavailable";
    setEmptyMessage("Could not load community place records. Please try again later.");
  }
}

loadCommunityPlaces();
