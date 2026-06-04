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

const CITY_OPTIONS = [
  "Nanchang",
  "Jiujiang",
  "Jingdezhen",
  "Pingxiang",
  "Xinyu",
  "Yingtan",
  "Ganzhou",
  "Yichun",
  "Shangrao",
  "Ji'an",
  "Fuzhou"
];

const els = {
  form: document.getElementById("communitySearchForm"),
  input: document.getElementById("communitySearchInput"),
  sort: document.getElementById("communitySearchSort"),
  count: document.getElementById("communitySearchCount"),
  results: document.getElementById("communitySearchResults"),
  empty: document.getElementById("communitySearchEmpty"),
  customFilters: Array.from(document.querySelectorAll(".community-custom-filter")),
  clearFilters: document.getElementById("communitySearchClearFilters"),
  listView: document.getElementById("communityListView"),
  gridView: document.getElementById("communityGridView")
};

let allPlaces = [];
let currentView = "list";
const filterValues = {
  city: "",
  associatedType: "",
  contributor: "",
  period: ""
};

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

function getCustomFilter(key) {
  return els.customFilters.find((filter) => filter.dataset.filterKey === key);
}

function getCustomFilterParts(filter) {
  return {
    trigger: filter?.querySelector(".community-custom-filter__trigger"),
    valueLabel: filter?.querySelector(".community-custom-filter__value"),
    panel: filter?.querySelector(".community-custom-filter__panel")
  };
}

function closeCustomFilter(filter, restoreFocus = false) {
  if (!filter) return;
  const { trigger, panel } = getCustomFilterParts(filter);
  if (!trigger || !panel) return;
  panel.hidden = true;
  filter.classList.remove("is-open");
  trigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) trigger.focus();
}

function closeAllCustomFilters(exceptFilter = null) {
  els.customFilters.forEach((filter) => {
    if (filter !== exceptFilter) closeCustomFilter(filter);
  });
}

function getOptionButtons(filter) {
  return Array.from(filter?.querySelectorAll(".community-custom-filter__option") || []);
}

function openCustomFilter(filter, focusSelected = false) {
  if (!filter) return;
  const { trigger, panel } = getCustomFilterParts(filter);
  if (!trigger || !panel) return;
  closeAllCustomFilters(filter);
  panel.hidden = false;
  filter.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");

  if (focusSelected) {
    const options = getOptionButtons(filter);
    const selected = options.find((option) => option.getAttribute("aria-selected") === "true");
    (selected || options[0])?.focus();
  }
}

function updateCustomFilterSelection(filter) {
  if (!filter) return;
  const key = filter.dataset.filterKey;
  const selectedValue = filterValues[key] || "";
  const { valueLabel } = getCustomFilterParts(filter);
  if (valueLabel) valueLabel.textContent = selectedValue || "Show all";

  getOptionButtons(filter).forEach((option) => {
    const isSelected = option.dataset.value === selectedValue;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-selected", String(isSelected));
  });
}

function selectCustomFilterOption(filter, value) {
  const key = filter?.dataset.filterKey;
  if (!key) return;
  filterValues[key] = value;
  updateCustomFilterSelection(filter);
  closeCustomFilter(filter, true);
  renderResults();
}

function handleOptionKeydown(event, filter, option) {
  const options = getOptionButtons(filter);
  const currentIndex = options.indexOf(option);
  let nextIndex = null;

  if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % options.length;
  if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + options.length) % options.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = options.length - 1;

  if (nextIndex !== null) {
    event.preventDefault();
    options[nextIndex]?.focus();
  }
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
    city: filterValues.city,
    associatedType: filterValues.associatedType,
    contributor: filterValues.contributor,
    period: filterValues.period
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

function getOptionCount(field, value) {
  if (!value) return allPlaces.length;
  return allPlaces.filter((place) => cleanText(place[field]) === value).length;
}

function populateCustomFilter(key, values) {
  const filter = getCustomFilter(key);
  const { panel } = getCustomFilterParts(filter);
  if (!filter || !panel) return;

  if (filterValues[key] && !values.includes(filterValues[key])) {
    filterValues[key] = "";
  }

  panel.textContent = "";
  ["", ...values].forEach((value) => {
    const option = document.createElement("button");
    option.className = "community-custom-filter__option";
    option.type = "button";
    option.dataset.value = value;
    option.setAttribute("role", "option");

    const label = document.createElement("span");
    label.className = "community-custom-filter__option-label";
    label.textContent = value || "Show all";

    const count = document.createElement("span");
    count.className = "community-custom-filter__option-count";
    count.textContent = String(getOptionCount(key, value));
    count.setAttribute("aria-label", `${count.textContent} records`);

    option.append(label, count);
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      selectCustomFilterOption(filter, value);
    });
    option.addEventListener("keydown", (event) => handleOptionKeydown(event, filter, option));
    panel.appendChild(option);
  });

  updateCustomFilterSelection(filter);
}

function renderFilterOptions() {
  populateCustomFilter("city", CITY_OPTIONS);
  populateCustomFilter("associatedType", getUniqueValues("associatedType"));
  populateCustomFilter("contributor", getUniqueValues("contributor"));
  populateCustomFilter("period", getUniqueValues("period"));
}

function bindEvents() {
  els.form?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderResults();
  });

  document.querySelectorAll('input[name="category"]').forEach((input) => {
    input.addEventListener("change", renderResults);
  });

  els.customFilters.forEach((filter) => {
    const { trigger, panel } = getCustomFilterParts(filter);
    trigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (panel?.hidden) {
        openCustomFilter(filter);
      } else {
        closeCustomFilter(filter);
      }
    });
    trigger?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openCustomFilter(filter, true);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".community-custom-filter")) closeAllCustomFilters();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openFilter = els.customFilters.find((filter) => filter.classList.contains("is-open"));
    if (openFilter) closeCustomFilter(openFilter, true);
  });

  els.sort?.addEventListener("change", renderResults);
  els.clearFilters?.addEventListener("click", () => {
    document.querySelectorAll('.community-search-filters input[name="category"]').forEach((input) => {
      input.checked = false;
    });
    Object.keys(filterValues).forEach((key) => {
      filterValues[key] = "";
      updateCustomFilterSelection(getCustomFilter(key));
    });
    closeAllCustomFilters();
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
