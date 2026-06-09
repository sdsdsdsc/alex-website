// === Import Firebase ===
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Firebase Config ===
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

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function hasValidCoordinates(record) {
  return Number.isFinite(record?.lat)
    && Number.isFinite(record?.lng)
    && record.lat >= -90
    && record.lat <= 90
    && record.lng >= -180
    && record.lng <= 180;
}

function normalizeSearchValue(value) {
  return String(value || "").trim().toLowerCase();
}

function getTitle(record) {
  return record?.name || record?.title || "Untitled";
}

function getDescription(record) {
  return record?.desc || record?.description || "";
}

function getType(record) {
  return record?.type || record?.category || "schema:Place";
}

function getTags(record) {
  return Array.isArray(record?.tags) ? record.tags.join(" ") : record?.tags || "";
}

function getCommunityTags(record) {
  if (Array.isArray(record?.tags)) return record.tags.map(cleanText).filter(Boolean);
  return cleanText(record?.tags).split(",").map(cleanText).filter(Boolean);
}

function getCommunityDisplayLocation(record) {
  const city = cleanText(record.city);
  const province = cleanText(record.province);
  if (city && province) return `${city}, ${province}`;
  return cleanText(record.location);
}

function recordMatchesSearch(record, term) {
  if (!term) return true;

  const searchableText = [
    record?.name,
    record?.title,
    record?.desc,
    record?.description,
    record?.message,
    record?.articleTitle,
    record?.linkedArticleTitle,
    record?.linkedArticle,
    record?.type,
    record?.category,
    record?.location,
    record?.province,
    record?.city,
    record?.district,
    record?.address,
    record?.associatedType,
    record?.contributor,
    record?.period,
    getTags(record)
  ].filter(Boolean).join(" ").toLowerCase();

  return searchableText.includes(term);
}

function buildFullMapUrl(searchTerm) {
  const url = new URL("map.html", window.location.href);
  const cleanTerm = String(searchTerm || "").trim();
  if (cleanTerm) {
    url.searchParams.set("search", cleanTerm);
  }
  return `${url.pathname}${url.search}`;
}

function buildCommunityPopupHtml(record, searchTerm = "", options = {}) {
  const safeTitle = escapeHTML(getTitle(record));
  const safeDesc = escapeHTML(getDescription(record));
  const safeType = escapeHTML(getType(record));
  const safeArticleLink = toSafeUrl(record?.linkedArticle || "");
  const fullMapUrl = buildFullMapUrl(searchTerm);
  const showAdminPointControls = Boolean(options.showAdminPointControls && record?.id);

  let html = `
    <article class="map-point-card">
      <h3>${safeTitle}</h3>
      ${safeDesc ? `<p>${safeDesc}</p>` : ""}
      <p class="map-point-card__meta"><span>Category/type:</span> ${safeType}</p>
  `;

  if (safeArticleLink) {
    html += `<a class="map-point-card__link" href="${safeArticleLink}" target="_blank" rel="noopener noreferrer">View linked article</a>`;
  }

  html += `
      <a class="map-point-card__link" href="${fullMapUrl}">Open in full map</a>
      <button class="map-point-card__zoom" type="button" data-action="zoom-point">Zoom in</button>
  `;

  if (showAdminPointControls) {
    html += `
      <div class="map-point-card__admin-actions">
        <button type="button" data-action="edit-point" data-point-id="${escapeHTML(record.id)}">Edit Point</button>
        <button type="button" data-action="delete-point" data-point-id="${escapeHTML(record.id)}">Delete Point</button>
      </div>
    `;
  }

  html += `
    </article>
  `;

  return html;
}

function buildCommunityPlacePopupHtml(record) {
  const safeTitle = escapeHTML(cleanText(record.title) || "Untitled community place");
  const safeCategory = escapeHTML(cleanText(record.category) || "Not specified");
  const safeLocation = escapeHTML(getCommunityDisplayLocation(record) || "Not specified");
  const safePeriod = escapeHTML(cleanText(record.period) || "Not specified");
  const safeDescription = escapeHTML(cleanText(record.description) || "No description has been added yet.");
  const recordUrl = `place.html?id=${encodeURIComponent(record.id)}`;

  return `
    <article class="map-point-card map-point-card--record">
      <h3>${safeTitle}</h3>
      <dl class="map-point-card__facts">
        <div>
          <dt>Category</dt>
          <dd>${safeCategory}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>${safeLocation}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>${safePeriod}</dd>
        </div>
      </dl>
      <p>${safeDescription}</p>
      <a class="map-point-card__link" href="${recordUrl}">View record</a>
    </article>
  `;
}

function makeBluePinIcon() {
  return L.divIcon({
    className: "community-map-pin",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  });
}

function createBaseLayers() {
  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  const gaode = L.tileLayer(
    "https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      attribution: "© 高德地图"
    }
  );

  const esri = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "Tiles © Esri — Source: Esri, HERE, Garmin, OpenStreetMap contributors"
    }
  );

  return { osm, gaode, esri };
}

function fitMapToLayers(map, boundsItems, fallbackCenter) {
  if (boundsItems.length === 0) {
    map.setView(fallbackCenter, 13);
    return;
  }

  const bounds = L.latLngBounds(boundsItems);
  map.fitBounds(bounds, { padding: [50, 50] });
  if (boundsItems.length === 1) {
    map.setZoom(14);
    map.panTo(bounds.getCenter());
  }
}

function updateUrlSearch(term) {
  const url = new URL(window.location.href);
  url.searchParams.delete("lat");
  url.searchParams.delete("lng");
  if (term) {
    url.searchParams.set("search", term);
  } else {
    url.searchParams.delete("search");
  }
  window.history.replaceState({}, "", url);
}

function initCommunityMap({
  containerId,
  mode,
  searchFormId,
  searchInputId,
  clearButtonId,
  statusId
}) {
  const container = document.getElementById(containerId);
  if (!container || typeof L === "undefined") return;

  const searchForm = document.getElementById(searchFormId);
  const searchInput = document.getElementById(searchInputId);
  const clearButton = clearButtonId ? document.getElementById(clearButtonId) : null;
  const statusEl = statusId ? document.getElementById(statusId) : null;
  const urlParams = new URLSearchParams(window.location.search);
  const isRetiredAdminRequest = urlParams.get("admin") === "true";
  const isPublicCommunityMode = true;
  const filterPanel = document.getElementById("mapFilterPanel");
  const filterToggle = document.getElementById("mapFilterToggle");
  const filterClose = document.getElementById("mapFilterClose");
  const filterApply = document.getElementById("mapFilterApply");
  const filterReset = document.getElementById("mapFilterReset");
  const drawSearchToggle = document.getElementById("mapDrawSearchToggle");
  const drawSearchPanel = document.getElementById("mapDrawSearchPanel");
  const drawSearchClose = document.getElementById("mapDrawSearchClose");
  const drawSearchX = document.getElementById("mapDrawSearchX");
  const drawSearchMessage = document.getElementById("mapDrawSearchMessage");
  const customFilters = Array.from(document.querySelectorAll(".map-custom-filter"));
  const categoryInputs = Array.from(document.querySelectorAll('input[name="mapCategory"]'));
  const initialSearchTerm = urlParams.get("search") || "";
  const requestedLatParam = urlParams.get("lat");
  const requestedLngParam = urlParams.get("lng");
  const hasRequestedLatLng = requestedLatParam !== null
    && requestedLngParam !== null
    && requestedLatParam.trim() !== ""
    && requestedLngParam.trim() !== "";
  const requestedLat = hasRequestedLatLng ? Number(requestedLatParam) : NaN;
  const requestedLng = hasRequestedLatLng ? Number(requestedLngParam) : NaN;
  const requestedLocation = hasRequestedLatLng
    && Number.isFinite(requestedLat)
    && Number.isFinite(requestedLng)
    ? [requestedLat, requestedLng]
    : null;
  const fallbackCenter = isPublicCommunityMode ? [27.6202, 113.8825] : [51.505, -0.09];
  const map = L.map(containerId).setView(fallbackCenter, 13);
  const pointLayer = L.layerGroup().addTo(map);
  const polygonLayer = L.layerGroup().addTo(map);
  const focusLayer = L.layerGroup().addTo(map);
  const bluePinIcon = makeBluePinIcon();
  const baseLayers = createBaseLayers();
  let allMapPoints = [];
  let allMapPolygons = [];
  let hasFocusedRequestedLocation = false;
  const pendingFilters = {
    city: ""
  };
  const appliedFilters = {
    categories: [],
    city: ""
  };

  baseLayers.osm.addTo(map);
  map.whenReady(() => {
    if (!map.hasLayer(baseLayers.osm)) {
      baseLayers.osm.addTo(map);
    }
    setTimeout(() => map.invalidateSize(), 0);
  });

  if (mode === "full") {
    L.control.layers({
      "OpenStreetMap": baseLayers.osm,
      "Gaode (AMap)": baseLayers.gaode,
      "Esri World Street": baseLayers.esri
    }).addTo(map);
  }

  if (searchInput && initialSearchTerm) {
    searchInput.value = initialSearchTerm;
  }

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  function getSelectedMapCategories() {
    return categoryInputs.filter((input) => input.checked).map((input) => input.value);
  }

  function getCustomFilter(key) {
    return customFilters.find((filter) => filter.dataset.filterKey === key);
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
    customFilters.forEach((filter) => {
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
    const selectedValue = pendingFilters[key] || "";
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
    pendingFilters[key] = value;
    updateCustomFilterSelection(filter);
    closeCustomFilter(filter, true);
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

  function getOptionCount(field, value) {
    if (!value) return allMapPoints.length;
    return allMapPoints.filter((record) => cleanText(record[field]) === value).length;
  }

  function populateCustomFilter(key, values) {
    const filter = getCustomFilter(key);
    const { panel } = getCustomFilterParts(filter);
    if (!filter || !panel) return;

    if (pendingFilters[key] && !values.includes(pendingFilters[key])) {
      pendingFilters[key] = "";
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
    if (!isPublicCommunityMode) return;
    populateCustomFilter("city", CITY_OPTIONS);
  }

  function matchesAppliedFilters(record) {
    const categoryMatches = appliedFilters.categories.length === 0
      || appliedFilters.categories.includes(cleanText(record.category));
    const cityMatches = !appliedFilters.city || cleanText(record.city) === appliedFilters.city;
    return categoryMatches && cityMatches;
  }

  function applyMapFilters() {
    appliedFilters.categories = getSelectedMapCategories();
    appliedFilters.city = pendingFilters.city;
    renderMapFeatures(searchInput?.value || "");
  }

  function resetMapFilters() {
    categoryInputs.forEach((input) => {
      input.checked = false;
    });
    Object.keys(pendingFilters).forEach((key) => {
      pendingFilters[key] = "";
      appliedFilters[key] = "";
    });
    appliedFilters.categories = [];
    customFilters.forEach(updateCustomFilterSelection);
    closeAllCustomFilters();
    renderMapFeatures(searchInput?.value || "");
  }

  function closeDrawSearchPanel(restoreFocus = false) {
    if (!drawSearchPanel || !drawSearchToggle) return;
    drawSearchPanel.hidden = true;
    drawSearchToggle.setAttribute("aria-expanded", "false");
    if (drawSearchMessage) drawSearchMessage.textContent = "";
    if (restoreFocus) drawSearchToggle.focus();
  }

  function openDrawSearchPanel() {
    if (!drawSearchPanel || !drawSearchToggle) return;
    closeFilterPanel();
    drawSearchPanel.hidden = false;
    drawSearchToggle.setAttribute("aria-expanded", "true");
  }

  function closeFilterPanel(restoreFocus = false) {
    if (!filterPanel || !filterToggle) return;
    filterPanel.hidden = true;
    filterToggle.setAttribute("aria-expanded", "false");
    closeAllCustomFilters();
    if (restoreFocus) filterToggle.focus();
  }

  function openFilterPanel() {
    if (!filterPanel || !filterToggle) return;
    closeDrawSearchPanel();
    filterPanel.hidden = false;
    filterToggle.setAttribute("aria-expanded", "true");
  }

  function renderMapFeatures(searchTerm = "") {
    const normalizedTerm = normalizeSearchValue(searchTerm);
    pointLayer.clearLayers();
    polygonLayer.clearLayers();

    const matchingPoints = allMapPoints.filter((point) => {
      const searchMatches = recordMatchesSearch(point, normalizedTerm);
      return isPublicCommunityMode ? searchMatches && matchesAppliedFilters(point) : searchMatches;
    });
    const matchingPolygons = isPublicCommunityMode
      ? []
      : allMapPolygons.filter((polygon) => recordMatchesSearch(polygon, normalizedTerm));
    const boundsItems = [];

    matchingPoints.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], { icon: bluePinIcon }).addTo(pointLayer);
      const popupHtml = buildCommunityPlacePopupHtml(point);
      marker.bindPopup(popupHtml, {
        className: "community-map-popup",
        closeButton: true,
        autoClose: true
      });
      boundsItems.push([point.lat, point.lng]);
    });

    matchingPolygons.forEach((polygonRecord) => {
      const polygonCoords = polygonRecord.points
        .filter((point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lng))
        .map((point) => [point.lat, point.lng]);

      if (polygonCoords.length < 3) return;

      const polygon = L.polygon(polygonCoords, {
        color: "#1f6feb",
        fillColor: "#1f6feb",
        fillOpacity: 0.18,
        weight: 2
      }).addTo(polygonLayer);

      polygon.bindPopup(buildCommunityPopupHtml(polygonRecord, searchTerm), {
        className: "community-map-popup",
        closeButton: true,
        autoClose: true
      });
      polygonCoords.forEach((coord) => boundsItems.push(coord));
    });

    const totalMatches = matchingPoints.length + matchingPolygons.length;
    if (totalMatches === 0) {
      setStatus(normalizedTerm || isPublicCommunityMode
        ? "No matching map records found."
        : "No matching map points found.");
    } else {
      const label = totalMatches === 1 ? "map result" : "map results";
      setStatus(normalizedTerm ? `${totalMatches} matching ${label} found.` : `${totalMatches} ${label} shown.`);
    }

    fitMapToLayers(map, boundsItems, fallbackCenter);
    if (mode === "full" && requestedLocation && !hasFocusedRequestedLocation && !normalizedTerm) {
      hasFocusedRequestedLocation = true;
      focusLayer.clearLayers();
      L.circleMarker(requestedLocation, {
        radius: 9,
        color: "#1d3557",
        fillColor: "#fcbf49",
        fillOpacity: 0.95,
        weight: 3
      }).addTo(focusLayer).bindPopup("Selected community place");
      map.setView(requestedLocation, Math.max(map.getZoom(), 15));
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("lat");
      cleanUrl.searchParams.delete("lng");
      window.history.replaceState({}, "", cleanUrl);
    }
    setTimeout(() => map.invalidateSize(), 0);
  }

  function runSearch(term) {
    const searchTerm = String(term || "").trim();
    if (searchInput) {
      searchInput.value = searchTerm;
    }
    if (mode === "full") {
      updateUrlSearch(searchTerm);
    }
    renderMapFeatures(searchTerm);
  }

  async function loadMarkers() {
    try {
      const snapshot = await getDocs(query(collection(db, "communityPlaces")));
      allMapPoints = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const lat = normalizeCoordinate(data.lat);
        const lng = normalizeCoordinate(data.lng);

        const communityRecord = {
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
          tags: data.tags,
          lat,
          lng
        };
        if (!hasValidCoordinates(communityRecord)) return;
        allMapPoints.push(communityRecord);
      });
    } catch (err) {
      console.error("Error loading map records:", err);
      setStatus("Could not load map records. Please try again later.");
    }
  }

  async function loadPolygons() {
    allMapPolygons = [];
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(searchInput?.value || "");
  });

  clearButton?.addEventListener("click", () => {
    runSearch("");
    searchInput?.focus();
  });

  if (isPublicCommunityMode) {
    filterToggle?.addEventListener("click", () => {
      const isOpen = filterToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeFilterPanel(true);
      } else {
        openFilterPanel();
      }
    });

    filterClose?.addEventListener("click", () => closeFilterPanel(true));
    filterApply?.addEventListener("click", () => {
      applyMapFilters();
      closeFilterPanel(true);
    });
    filterReset?.addEventListener("click", () => {
      resetMapFilters();
      closeFilterPanel(true);
    });

    drawSearchToggle?.addEventListener("click", () => {
      const isOpen = drawSearchToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeDrawSearchPanel(true);
      } else {
        openDrawSearchPanel();
      }
    });

    drawSearchClose?.addEventListener("click", () => closeDrawSearchPanel(true));
    drawSearchX?.addEventListener("click", () => closeDrawSearchPanel(true));
    drawSearchPanel?.querySelectorAll("[data-draw-search-option]").forEach((button) => {
      button.addEventListener("click", () => {
        if (drawSearchMessage) {
          drawSearchMessage.textContent = "Draw search will be added in the next phase.";
        }
      });
    });

    customFilters.forEach((filter) => {
      const { trigger } = getCustomFilterParts(filter);
      trigger?.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeCustomFilter(filter);
        } else {
          openCustomFilter(filter);
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
      const target = event.target;
      if (target instanceof Node && !customFilters.some((filter) => filter.contains(target))) {
        closeAllCustomFilters();
      }
      if (
        filterPanel
        && filterToggle
        && target instanceof Node
        && !filterPanel.hidden
        && !filterPanel.contains(target)
        && !filterToggle.contains(target)
      ) {
        closeFilterPanel();
      }
      if (
        drawSearchPanel
        && drawSearchToggle
        && target instanceof Node
        && !drawSearchPanel.hidden
        && !drawSearchPanel.contains(target)
        && !drawSearchToggle.contains(target)
      ) {
        closeDrawSearchPanel();
      }
    });
  }

  map.on("popupopen", (event) => {
    const popupEl = event.popup.getElement();
    const zoomButton = popupEl?.querySelector('[data-action="zoom-point"]');
    zoomButton?.addEventListener("click", () => {
      map.setView(event.popup.getLatLng(), Math.max(map.getZoom() + 2, 16));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (isPublicCommunityMode && filterPanel && !filterPanel.hidden) {
        closeFilterPanel(true);
        return;
      }
      if (isPublicCommunityMode && drawSearchPanel && !drawSearchPanel.hidden) {
        closeDrawSearchPanel(true);
        return;
      }
      closeAllCustomFilters();
      map.closePopup();
    }
  });

  Promise.all([loadMarkers(), loadPolygons()]).then(() => {
    renderFilterOptions();
    runSearch(searchInput?.value || initialSearchTerm);
    if (isRetiredAdminRequest) {
      setStatus("Legacy map editing has been retired. Manage community place records from the admin dashboard.");
    }
  });

  return map;
}

function initFullMap() {
  if (!document.getElementById("map")) return;

  initCommunityMap({
    containerId: "map",
    mode: "full",
    searchFormId: "mapSearchForm",
    searchInputId: "mapSearchInput",
    clearButtonId: "mapSearchClear",
    statusId: "mapSearchStatus"
  });
}

initFullMap();
