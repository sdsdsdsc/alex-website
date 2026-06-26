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
  normalizeCoordinate,
  normalizeSearchValue
} from "./heritage-engine/maps.js?v=2026-06-20-releasepolish";
import {
  getHeritageCriteria,
  isPublicRecord
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
const TOWN_AREA_BLOCKLIST = /\b(province|district|county|street|road|route|lane|avenue|close|park|square|community|neighbou?rhood|village committee|residential committee)\b/i;
const SPLIT_PATTERN = /[|,/;]+|\s+-\s+/;

function toTitleCase(value) {
  const text = cleanText(value);
  if (!text) return "";
  return text.replace(/\b([a-z])([a-z]*)/gi, (_, first, rest) => `${first.toUpperCase()}${rest.toLowerCase()}`);
}

function truncateText(value, maxLength = 110) {
  const text = cleanText(value);
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function normalizeTownAreaCandidate(value) {
  return toTitleCase(cleanText(value).replace(/\s+/g, " "));
}

function isUsefulTownAreaCandidate(value) {
  const text = normalizeTownAreaCandidate(value);
  if (!text) return false;
  if (text.length < 2 || text.length > 40) return false;
  if (/\d/.test(text)) return false;
  if (/^jiangxi$/i.test(text) || /^jiangxi province$/i.test(text) || /^china$/i.test(text)) return false;
  return !TOWN_AREA_BLOCKLIST.test(text);
}

function extractBroaderTownAreaCandidates(value) {
  const segments = cleanText(value)
    .split(SPLIT_PATTERN)
    .map(normalizeTownAreaCandidate)
    .filter(Boolean);

  if (segments.length === 0) return [];

  const usefulSegments = segments.filter((segment) => isUsefulTownAreaCandidate(segment));
  if (segments.length === 1) {
    return usefulSegments;
  }

  const preferredSegment = [...segments]
    .reverse()
    .find((segment) => isUsefulTownAreaCandidate(segment));

  return preferredSegment ? [preferredSegment] : usefulSegments;
}

function getTownAreaValues(record) {
  return [
    cleanText(record.city),
    cleanText(record.area),
    cleanText(record.location),
    cleanText(record.locality),
    cleanText(record.address),
    getCommunityDisplayLocation(record)
  ]
    .flatMap((value) => extractBroaderTownAreaCandidates(value))
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
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
  const safeArea = escapeHTML(record.townAreaValues[0] || cleanText(record.area) || cleanText(record.city) || "Not specified");
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
  const areaFilterGroup = document.getElementById("mapAreaFilterGroup");
  const criteriaFilterGroup = document.getElementById("mapCriteriaFilterGroup");
  const resetButton = document.getElementById("mapFilterReset");
  const toolButtons = Array.from(document.querySelectorAll(".map-tool-index__button"));
  const toolPanels = Array.from(document.querySelectorAll("[data-tool-panel]"));
  const urlParams = new URLSearchParams(window.location.search);
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
  const initialSearchTerm = urlParams.get("search") || "";
  const fallbackCenter = [27.6202, 113.8825];
  const customFilters = Array.from(document.querySelectorAll(".map-custom-filter"));
  const mapNominationToggle = document.getElementById("mapNominationToggle");
  const mapNominationStatus = document.getElementById("mapNominationStatus");

  const map = L.map(containerId).setView(fallbackCenter, 13);
  const pointLayer = L.layerGroup().addTo(map);
  const focusLayer = L.layerGroup().addTo(map);
  const bluePinIcon = makeBluePinIcon();
  const baseLayers = createBaseLayers();
  const markersById = new Map();
  const pendingFilters = {
    assetType: "",
    area: "",
    heritageCriteria: ""
  };

  let allMapPoints = [];
  let hasFocusedRequestedLocation = false;
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

  if (searchInput && initialSearchTerm) {
    searchInput.value = initialSearchTerm;
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
    const { valueLabel } = getCustomFilterParts(filter);
    if (valueLabel) valueLabel.textContent = selectedValue || "Show all";

    getOptionButtons(filter).forEach((option) => {
      const isSelected = option.dataset.value === selectedValue;
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

  function matchesFilters(record) {
    const assetTypeMatches = !pendingFilters.assetType
      || cleanText(record.assetType) === pendingFilters.assetType;
    const areaMatches = !pendingFilters.area
      || record.townAreaValues.includes(pendingFilters.area);
    const criteriaMatches = !pendingFilters.heritageCriteria
      || getHeritageCriteria(record).includes(pendingFilters.heritageCriteria);
    return assetTypeMatches && areaMatches && criteriaMatches;
  }

  function matchesFilterContext(record, excludedKey, normalizedTerm) {
    const searchMatches = matchesSearch(record, normalizedTerm);
    const assetTypeMatches = excludedKey === "assetType"
      || !pendingFilters.assetType
      || cleanText(record.assetType) === pendingFilters.assetType;
    const areaMatches = excludedKey === "area"
      || !pendingFilters.area
      || record.townAreaValues.includes(pendingFilters.area);
    const criteriaMatches = excludedKey === "heritageCriteria"
      || !pendingFilters.heritageCriteria
      || getHeritageCriteria(record).includes(pendingFilters.heritageCriteria);
    return searchMatches && assetTypeMatches && areaMatches && criteriaMatches;
  }

  function matchesSearch(record, term) {
    if (!term) return true;

    const searchText = [
      record.title,
      record.address,
      record.description,
      record.localSignificanceSummary,
      record.area,
      record.location,
      record.locality,
      record.community,
      record.neighbourhood,
      record.city,
      record.district,
      record.assetType,
      record.category,
      ...getHeritageCriteria(record)
    ].filter(Boolean).join(" ").toLowerCase();

    return searchText.includes(term);
  }

  function getContextRecords(excludedKey, normalizedTerm) {
    return allMapPoints.filter((record) => matchesFilterContext(record, excludedKey, normalizedTerm));
  }

  function buildFilterOptions(key, normalizedTerm) {
    const source = getContextRecords(key, normalizedTerm);
    if (key === "assetType") {
      const counts = new Map();
      source.forEach((record) => {
        const value = cleanText(record.assetType);
        if (!value) return;
        counts.set(value, (counts.get(value) || 0) + 1);
      });
      return {
        totalCount: source.length,
        options: [...counts.entries()]
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
      };
    }

    if (key === "area") {
      const counts = new Map();
      source.forEach((record) => {
        record.townAreaValues.forEach((value) => {
          counts.set(value, (counts.get(value) || 0) + 1);
        });
      });
      return {
        totalCount: source.length,
        options: [...counts.entries()]
          .map(([value, count]) => ({ value, count }))
          .filter((option) => option.count > 0)
          .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
      };
    }

    if (key === "heritageCriteria") {
      const counts = new Map();
      source.forEach((record) => {
        getHeritageCriteria(record).forEach((value) => {
          counts.set(value, (counts.get(value) || 0) + 1);
        });
      });
      return {
        totalCount: source.length,
        options: [...counts.entries()]
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
      };
    }

    return { totalCount: source.length, options: [] };
  }

  function populateCustomFilter(key, config) {
    const filter = getCustomFilter(key);
    const { panel } = getCustomFilterParts(filter);
    if (!filter || !panel) return;
    const options = config.options || [];

    if (pendingFilters[key] && !options.some((option) => option.value === pendingFilters[key])) {
      pendingFilters[key] = "";
    }

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
        pendingFilters[key] = value;
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
    const normalizedTerm = normalizeSearchValue(searchInput?.value || "");
    const assetTypes = buildFilterOptions("assetType", normalizedTerm);
    const areas = buildFilterOptions("area", normalizedTerm);
    const criteria = buildFilterOptions("heritageCriteria", normalizedTerm);

    populateCustomFilter("assetType", assetTypes);
    populateCustomFilter("area", areas);
    populateCustomFilter("heritageCriteria", criteria);

    if (areaFilterGroup) {
      areaFilterGroup.hidden = areas.options.length === 0;
    }
    if (criteriaFilterGroup) {
      criteriaFilterGroup.hidden = criteria.options.length === 0;
    }
    const assetTypeGroup = getCustomFilter("assetType")?.closest(".map-filter-group");
    if (assetTypeGroup) {
      assetTypeGroup.hidden = assetTypes.options.length === 0;
    }
  }

  function renderMapFeatures(searchTerm = "") {
    const normalizedTerm = normalizeSearchValue(searchTerm);
    pointLayer.clearLayers();
    focusLayer.clearLayers();
    markersById.clear();

    const matchingPoints = allMapPoints
      .filter((record) => matchesFilters(record) && matchesSearch(record, normalizedTerm))
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
    const hasFocusControls = Boolean(normalizedTerm || pendingFilters.assetType || pendingFilters.area || pendingFilters.heritageCriteria);
    setStatus(
      matchingPoints.length === 0
        ? "No records match this search."
        : hasFocusControls
          ? `${matchingPoints.length} ${matchingPoints.length === 1 ? "record" : "records"} on map.`
          : `${matchingPoints.length} ${matchingPoints.length === 1 ? "record" : "records"} on map. Search or filter to focus the map.`
    );

    fitMapToLayers(map, boundsItems, fallbackCenter);

    if (mode === "full" && requestedLocation && !hasFocusedRequestedLocation && !normalizedTerm) {
      hasFocusedRequestedLocation = true;
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
        const record = {
          id: docSnap.id,
          title: cleanText(data.title),
          category: cleanText(data.category),
          assetType: cleanText(data.assetType || data.category),
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

        if (!hasValidCoordinates(record) || !isPublicRecord(record)) return;
        record.townAreaValues = getTownAreaValues(record);
        allMapPoints.push(record);
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
      pendingFilters[key] = "";
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
    runSearch(searchInput?.value || initialSearchTerm);
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
