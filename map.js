import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  buildNominationUrlFromCoordinates,
  buildPlaceRecordUrl,
  cleanText,
  escapeHTML,
  getCommunityDisplayLocation,
  hasValidCoordinates,
  normalizeCoordinate
} from "./heritage-engine/maps.js?v=2026-06-20-releasepolish";
import {
  buildDiscoveryUrl,
  getAssetType,
  getMatchingPublicRecords,
  getOptionCount,
  getPublicRecordById,
  getUniqueCriteria,
  getUniqueValues,
  isPublicRecord,
  normalizeSearchText,
  parseSharedDiscoveryState,
  writeSharedDiscoveryState
} from "./heritage-engine/search.js";

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
  map.fitBounds(bounds, { padding: [40, 40] });
  if (boundsItems.length === 1) {
    map.setZoom(15);
    map.panTo(bounds.getCenter());
  }
}

function buildCommunityPlacePopupHtml(record) {
  const safeTitle = escapeHTML(cleanText(record.title) || "Untitled community place");
  const safeAssetType = escapeHTML(cleanText(record.assetType) || cleanText(record.category) || "Not specified");
  const safeLocation = escapeHTML(getCommunityDisplayLocation(record) || "Not specified");
  const safeArea = escapeHTML(cleanText(record.district) || cleanText(record.city) || cleanText(record.area) || "Not specified");
  const safeDescription = escapeHTML(
    cleanText(record.localSignificanceSummary)
      || cleanText(record.description)
      || "No description has been added yet."
  );
  const recordUrl = buildPlaceRecordUrl(record.id);

  return `
    <article class="map-point-card map-point-card--record">
      <h3>${safeTitle}</h3>
      <dl class="map-point-card__facts">
        <div>
          <dt>Type</dt>
          <dd>${safeAssetType}</dd>
        </div>
        <div>
          <dt>Area</dt>
          <dd>${safeArea}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>${safeLocation}</dd>
        </div>
      </dl>
      <p>${safeDescription}</p>
      <a class="map-point-card__link" href="${recordUrl}">View record</a>
    </article>
  `;
}

function initCommunityMap({
  containerId,
  mode,
  searchFormId,
  searchInputId,
  statusId
}) {
  const container = document.getElementById(containerId);
  if (!container || typeof L === "undefined") return;

  const searchForm = document.getElementById(searchFormId);
  const searchInput = document.getElementById(searchInputId);
  const statusEl = document.getElementById(statusId);
  const focusStatusEl = document.getElementById("mapFocusStatus");
  const listLink = document.getElementById("mapViewResultsList");
  const resetButton = document.getElementById("mapFilterReset");
  const toolButtons = Array.from(document.querySelectorAll(".map-tool-index__button"));
  const toolPanels = Array.from(document.querySelectorAll("[data-tool-panel]"));
  const urlParams = new URLSearchParams(window.location.search);
  const initialDiscoveryState = parseSharedDiscoveryState(urlParams);
  const requestedPlaceId = cleanText(urlParams.get("place"));
  const fallbackCenter = [27.6202, 113.8825];
  const customFilters = Array.from(document.querySelectorAll(".map-custom-filter"));
  const mapNominationToggle = document.getElementById("mapNominationToggle");
  const mapNominationStatus = document.getElementById("mapNominationStatus");

  const map = L.map(containerId).setView(fallbackCenter, 13);
  const pointLayer = L.layerGroup().addTo(map);
  const bluePinIcon = makeBluePinIcon();
  const baseLayers = createBaseLayers();
  const markersById = new Map();
  const pendingFilters = {
    category: initialDiscoveryState.categories,
    city: initialDiscoveryState.city,
    district: initialDiscoveryState.district,
    assetType: initialDiscoveryState.assetType,
    heritageCriteria: initialDiscoveryState.heritageCriteria
  };

  let allPublicRecords = [];
  let isNominationPickMode = false;

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

  if (searchInput && initialDiscoveryState.q) {
    searchInput.value = initialDiscoveryState.q;
  }

  function getCurrentDiscoveryState(term = searchInput?.value || "") {
    return {
      q: cleanText(term),
      categories: pendingFilters.category,
      city: pendingFilters.city,
      district: pendingFilters.district,
      assetType: pendingFilters.assetType,
      heritageCriteria: pendingFilters.heritageCriteria
    };
  }

  function updateDiscoveryLinks(term) {
    const state = getCurrentDiscoveryState(term);
    const url = new URL(window.location.href);
    writeSharedDiscoveryState(url, state);
    url.searchParams.delete("search");
    url.searchParams.delete("lat");
    url.searchParams.delete("lng");
    if (requestedPlaceId) url.searchParams.set("place", requestedPlaceId);
    window.history.replaceState({}, "", url);
    if (listLink) listLink.href = buildDiscoveryUrl("search.html", state);
  }

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  function setActiveToolPanel(panelKey) {
    toolButtons.forEach((button) => {
      const isActive = button.dataset.toolTarget === panelKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-expanded", String(isActive));
    });

    toolPanels.forEach((panel) => {
      const isActive = panel.dataset.toolPanel === panelKey;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  }

  function setNominationStatus(message = "") {
    if (!mapNominationStatus) return;
    mapNominationStatus.textContent = message;
    mapNominationStatus.hidden = !message;
  }

  function stopMapNominationMode() {
    isNominationPickMode = false;
    container.classList.remove("is-nomination-pick-mode");
    if (mapNominationToggle) {
      mapNominationToggle.textContent = "Nominate a place";
      mapNominationToggle.setAttribute("aria-pressed", "false");
    }
    setNominationStatus("");
  }

  function startMapNominationMode() {
    isNominationPickMode = true;
    closeAllCustomFilters();
    map.closePopup();
    container.classList.add("is-nomination-pick-mode");
    if (mapNominationToggle) {
      mapNominationToggle.textContent = "Cancel nomination";
      mapNominationToggle.setAttribute("aria-pressed", "true");
    }
    setNominationStatus("Click the map to choose the place you want to nominate.");
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
    const selectedValues = key === "category" ? selectedValue : [selectedValue];
    const { valueLabel } = getCustomFilterParts(filter);
    if (valueLabel) valueLabel.textContent = key === "category"
      ? selectedValues.join(", ") || "Show all"
      : selectedValue || "Show all";

    getOptionButtons(filter).forEach((option) => {
      const isSelected = option.dataset.value
        ? selectedValues.includes(option.dataset.value)
        : selectedValues.length === 0 || !selectedValues[0];
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
    });
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

  function buildFilterOptions(key) {
    const storedValues = key === "heritageCriteria"
      ? getUniqueCriteria(allPublicRecords)
      : getUniqueValues(key, allPublicRecords);
    const selectedValues = key === "category"
      ? pendingFilters.category
      : [pendingFilters[key]].filter(Boolean);
    const values = [...new Set([...storedValues, ...selectedValues])].sort((a, b) => a.localeCompare(b));
    return {
      totalCount: allPublicRecords.length,
      options: values.map((value) => ({
        value,
        count: getOptionCount(key, value, allPublicRecords)
      }))
    };
  }

  function populateCustomFilter(key, config) {
    const filter = getCustomFilter(key);
    const { panel } = getCustomFilterParts(filter);
    if (!filter || !panel) return;
    const options = config.options || [];

    panel.textContent = "";
    const totalCount = config.totalCount || 0;
    [{ value: "", count: totalCount }, ...options].forEach(({ value, count: optionCount }) => {
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
      count.textContent = String(optionCount);
      count.setAttribute("aria-label", `${count.textContent} records`);

      option.append(label, count);
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        pendingFilters[key] = key === "category" ? (value ? [value] : []) : value;
        updateCustomFilterSelection(filter);
        closeCustomFilter(filter, true);
        renderMapFeatures(searchInput?.value || "");
      });
      option.addEventListener("keydown", (event) => handleOptionKeydown(event, filter, option));
      panel.appendChild(option);
    });

    updateCustomFilterSelection(filter);
  }

  function renderFilterOptions() {
    Object.keys(pendingFilters).forEach((key) => {
      populateCustomFilter(key, buildFilterOptions(key));
    });
  }

  function appendFocusLink(label, href) {
    if (!focusStatusEl) return;
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    focusStatusEl.append(" ", link);
  }

  function renderRequestedPlaceFocus(matchingRecords) {
    if (!focusStatusEl) return;
    focusStatusEl.textContent = "";
    focusStatusEl.hidden = !requestedPlaceId;
    if (!requestedPlaceId) return;

    const record = getPublicRecordById(allPublicRecords, requestedPlaceId);
    if (!record) {
      focusStatusEl.append("The requested public place could not be found.");
      appendFocusLink("View preserved Places results", buildDiscoveryUrl("search.html", getCurrentDiscoveryState()));
      return;
    }

    const recordUrl = buildPlaceRecordUrl(record.id);
    if (!hasValidCoordinates(record)) {
      focusStatusEl.append(`${cleanText(record.title) || "This public place"} has no map location yet.`);
      appendFocusLink("View its public record", recordUrl);
      appendFocusLink("View preserved Places results", buildDiscoveryUrl("search.html", getCurrentDiscoveryState()));
      return;
    }

    const marker = markersById.get(record.id);
    if (!marker || !matchingRecords.some((place) => place.id === record.id)) {
      focusStatusEl.append(`${cleanText(record.title) || "The requested place"} does not match the active discovery filters.`);
      appendFocusLink("View its public record", recordUrl);
      appendFocusLink("View preserved Places results", buildDiscoveryUrl("search.html", getCurrentDiscoveryState()));
      return;
    }

    marker.setZIndexOffset(1000);
    marker.openPopup();
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15));
    focusStatusEl.append(`Focused on ${cleanText(record.title) || "the requested public place"}.`);
    appendFocusLink("View its public record", recordUrl);
  }

  function renderMapFeatures(searchTerm = "") {
    const normalizedTerm = normalizeSearchText(searchTerm);
    pointLayer.clearLayers();
    markersById.clear();

    const filters = {
      query: normalizedTerm,
      categories: pendingFilters.category,
      city: pendingFilters.city,
      district: pendingFilters.district,
      assetType: pendingFilters.assetType,
      heritageCriteria: pendingFilters.heritageCriteria
    };
    const matchingRecords = getMatchingPublicRecords(allPublicRecords, filters);
    const matchingPoints = matchingRecords
      .filter(hasValidCoordinates)
      .sort((a, b) => cleanText(a.title).localeCompare(cleanText(b.title)));

    const boundsItems = [];
    matchingPoints.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], { icon: bluePinIcon }).addTo(pointLayer);
      marker.bindPopup(buildCommunityPlacePopupHtml(point), {
        className: "community-map-popup",
        closeButton: true,
        autoClose: true
      });
      markersById.set(point.id, marker);
      boundsItems.push([point.lat, point.lng]);
    });

    renderFilterOptions();
    const unavailableCount = matchingRecords.length - matchingPoints.length;
    const matchingLabel = `${matchingRecords.length} matching ${matchingRecords.length === 1 ? "record" : "records"}`;
    const mapLabel = `${matchingPoints.length} on map`;
    const unavailableLabel = unavailableCount > 0
      ? `; ${unavailableCount} ${unavailableCount === 1 ? "has" : "have"} no map location and ${unavailableCount === 1 ? "remains" : "remain"} available in Places`
      : "";
    setStatus(matchingRecords.length === 0
      ? "No community places match this search or filter."
      : `${matchingLabel}; ${mapLabel}${unavailableLabel}.`);

    fitMapToLayers(map, boundsItems, fallbackCenter);

    renderRequestedPlaceFocus(matchingRecords);
    updateDiscoveryLinks(searchTerm);

    setTimeout(() => map.invalidateSize(), 0);
  }

  function runSearch(term) {
    const searchTerm = String(term || "").trim();
    if (searchInput) {
      searchInput.value = searchTerm;
    }
    if (mode === "full") {
      updateDiscoveryLinks(searchTerm);
    }
    renderMapFeatures(searchTerm);
  }

  async function loadMarkers() {
    try {
      const snapshot = await getDocs(query(collection(db, "communityPlaces")));
      allPublicRecords = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const record = {
          ...data,
          id: docSnap.id,
          title: cleanText(data.title),
          category: cleanText(data.category),
          assetType: getAssetType(data),
          area: cleanText(data.area),
          address: cleanText(data.address),
          description: cleanText(data.description),
          localSignificanceSummary: cleanText(data.localSignificanceSummary),
          heritageCriteria: data.heritageCriteria,
          locationName: cleanText(data.locationName),
          location: cleanText(data.location),
          locality: cleanText(data.locality),
          community: cleanText(data.community),
          neighbourhood: cleanText(data.neighbourhood || data.neighborhood),
          province: cleanText(data.province),
          city: cleanText(data.city),
          district: cleanText(data.district),
          lat: normalizeCoordinate(data.lat),
          lng: normalizeCoordinate(data.lng),
          recordStatus: cleanText(data.recordStatus)
        };

        if (!isPublicRecord(record)) return;
        allPublicRecords.push(record);
      });
    } catch (err) {
      console.error("Error loading map records:", err);
      setStatus("Could not load map records. Please try again later.");
    }
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(searchInput?.value || "");
  });

  resetButton?.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
    }
    Object.keys(pendingFilters).forEach((key) => {
      pendingFilters[key] = key === "category" ? [] : "";
      updateCustomFilterSelection(getCustomFilter(key));
    });
    closeAllCustomFilters();
    runSearch("");
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

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveToolPanel(button.dataset.toolTarget || "search");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Node && !customFilters.some((filter) => filter.contains(target))) {
      closeAllCustomFilters();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (isNominationPickMode) {
        stopMapNominationMode();
        return;
      }
      closeAllCustomFilters();
      map.closePopup();
    }
  });

  map.on("click", (event) => {
    if (!isNominationPickMode) return;
    const { lat, lng } = event.latlng;
    stopMapNominationMode();
    window.location.href = buildNominationUrlFromCoordinates(lat, lng);
  });

  mapNominationToggle?.addEventListener("click", () => {
    if (isNominationPickMode) {
      stopMapNominationMode();
      return;
    }
    startMapNominationMode();
  });

  loadMarkers().then(() => {
    setActiveToolPanel("search");
    runSearch(searchInput?.value || initialDiscoveryState.q);
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
    statusId: "mapSearchStatus"
  });
}

initFullMap();
