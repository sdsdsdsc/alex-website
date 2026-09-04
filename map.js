import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  buildPlaceRecordUrl,
  cleanText,
  getCommunityDisplayLocation,
  hasValidCoordinates,
  normalizeCoordinate
} from "./heritage-engine/maps.js?v=2026-07-14-pr41-review-fixes";
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
import {
  OFFICIAL_HERITAGE_EMPTY_MESSAGE,
  OFFICIAL_HERITAGE_FAILURE_MESSAGE,
  OFFICIAL_HERITAGE_LOADING_MESSAGE,
  buildOfficialFeatureAccessibleName,
  buildOfficialMarkerAccessibleName,
  buildOfficialPopupData,
  validateOfficialHeritageGeoJson
} from "./heritage-engine/official-heritage-map.js?v=2026-08-09-kuixing-pavilion-point";
import {
  COMMUNITY_MAP_CATEGORY_DEFINITIONS,
  buildCommunityMarkerAccessibleName,
  getCommunityMapCategory,
  getCommunityMapCategoryByKey
} from "./heritage-engine/community-map-categories.js?v=2026-07-26-community-category-icons";
import {
  getOfficialMapCategory,
  getOfficialMapCategoryByKey,
  getPublishedOfficialMapCategories
} from "./heritage-engine/official-map-categories.js?v=2026-07-27-official-category-filters";

const OFFICIAL_HERITAGE_GEOJSON_URL = "./data/jiangxi-official-protected-heritage-map.geojson?v=2026-08-09-kuixing-pavilion-point";
const HOVER_GROUP_THRESHOLD_PX = 34;

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

const MAP_HELP_TOPICS = Object.freeze({
  community: {
    title: "Community heritage",
    paragraphs: [
      "Community records are contributed and maintained by this project. They describe places that people value locally; they are not statutory designations.",
      "The category controls change which published community records are visible on this map."
    ],
    link: "about-local-heritage.html#community-and-official-heritage",
    linkLabel: "Community and Official Heritage"
  },
  buildings: {
    title: "Buildings",
    paragraphs: ["Standing buildings and structures, such as homes, halls, places of worship, shops, schools, bridges and industrial buildings."],
    link: "asset-type-buildings.html",
    linkLabel: "Buildings in Asset Type guidance"
  },
  "parks-gardens": {
    title: "Parks and gardens",
    paragraphs: ["Designed or community-valued green spaces, such as parks, gardens, cemeteries, recreation grounds and planted public spaces."],
    link: "asset-type-parks-gardens.html",
    linkLabel: "Parks and gardens in Asset Type guidance"
  },
  "monuments-landmarks": {
    title: "Monuments and landmarks",
    paragraphs: ["Features that commemorate, orient or give identity to a place, such as memorials, statues, public art, gates and waymarkers."],
    link: "asset-type-monuments-landmarks.html",
    linkLabel: "Monuments and landmarks in Asset Type guidance"
  },
  "other-sites-landscapes": {
    title: "Other sites and landscapes",
    paragraphs: ["Heritage places that are not mainly a building, park or monument, including routes, archaeological sites, industrial remains, waterways and wider landscapes."],
    link: "asset-type-other-sites-landscapes.html",
    linkLabel: "Other sites and landscapes in Asset Type guidance"
  },
  unknown: {
    title: "Unknown or uncategorized",
    paragraphs: ["Published community records appear here when their asset type is missing or does not match a current map category. The record can still be explored and improved."],
    link: "asset-types.html",
    linkLabel: "Uncategorized records in Asset Type guidance"
  },
  official: {
    title: "Official Heritage",
    paragraphs: [
      "Official Heritage records come from national, provincial or municipal registers. They are a separate layer from this project's Community heritage records.",
      "An official record's designation authority and the source of its displayed map location are not always the same. Open a marker to see its designation level, location type, uncertainty and source."
    ],
    link: "about-local-heritage.html#community-and-official-heritage",
    linkLabel: "Community and Official Heritage"
  },
  "official-category-ancient-buildings": {
    title: "Ancient buildings",
    paragraphs: [
      "This category groups Official Heritage records whose protected subject is principally an older or historic building or built structure.",
      "Ancient buildings is this project's simplified public Map category. It does not replace the original official classification, which remains visible in the individual record popup."
    ]
  },
  "official-category-important-modern-historic-sites": {
    title: "Important modern historic sites",
    paragraphs: [
      "This category groups Official Heritage records associated principally with important modern historic buildings, places, events or sites.",
      "It is this project's simplified public Map category. The source register's original classification remains visible in the record popup, and this Map category does not create or alter the official designation."
    ]
  },
  "official-category-archaeological-sites": {
    title: "Archaeological sites",
    paragraphs: [
      "This category groups Official Heritage records whose significance is principally archaeological or evidential, including places where physical remains or archaeological evidence are central to the official record.",
      "It is a simplified public Map category, and the source register's original classification remains visible in the record popup. A displayed Point does not represent an archaeological extent or legal protection boundary."
    ]
  },
  "official-reviewed-points": {
    title: "Project-reviewed reference Points",
    paragraphs: [
      "A filled diamond is a Point reviewed by this project to give visitors a useful public reference location for an Official Heritage record.",
      "The Point may not be an authority-supplied survey or GIS coordinate. It does not necessarily identify an entrance, centroid, complete extent, building footprint, legal centre or legal protection boundary.",
      "Open an individual record for its location evidence, source and estimated uncertainty, including any record-specific limitation."
    ],
    link: "about-local-heritage.html#community-and-official-heritage",
    linkLabel: "How project-reviewed Points are represented"
  },
  "official-generalized-points": {
    title: "Generalized reference Points",
    paragraphs: [
      "A hollow diamond represents a documented general vicinity. It intentionally does not claim an exact heritage location.",
      "The project may construct a Generalized Point from published reference evidence together with reviewed offsets, coverage or another approved method. Uncertainty and limitations are part of the representation.",
      "Open the individual record for the authoritative record-specific warning, evidence and construction details."
    ],
    link: "about-local-heritage.html#community-and-official-heritage",
    linkLabel: "How Generalized Points are represented"
  },
  "official-other-representations": {
    title: "Other supported Official Heritage representations",
    paragraphs: [
      "The map can support solid reviewed lines and areas, as well as dashed approximate or generalized lines and areas.",
      "No official lines or areas are currently published. The current Official Heritage layer contains Points only."
    ],
    link: "about-local-heritage.html#community-and-official-heritage",
    linkLabel: "How official records are represented"
  }
});

function initMapContextualHelp() {
  const modal = document.getElementById("mapContextHelp");
  const dialog = modal?.querySelector("[role='dialog']");
  const title = document.getElementById("mapContextHelpTitle");
  const body = document.getElementById("mapContextHelpBody");
  const link = document.getElementById("mapContextHelpLink");
  if (!modal || !dialog || !title || !body || !link) return;

  let returnFocus = null;
  const pageRegions = [document.querySelector("body > header"), document.querySelector("body > main"), document.querySelector("body > footer")].filter(Boolean);
  const closeHelp = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("map-context-help-open");
    pageRegions.forEach((region) => { region.inert = false; });
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  };
  const openHelp = (trigger, topicKey) => {
    const topic = MAP_HELP_TOPICS[topicKey];
    if (!topic) return;
    returnFocus = trigger;
    title.textContent = topic.title;
    body.replaceChildren(...topic.paragraphs.map((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    }));
    const hasLink = Boolean(topic.link && topic.linkLabel);
    link.hidden = !hasLink;
    if (hasLink) {
      link.href = topic.link;
      link.textContent = topic.linkLabel;
    } else {
      link.removeAttribute("href");
      link.textContent = "";
    }
    modal.hidden = false;
    document.body.classList.add("map-context-help-open");
    pageRegions.forEach((region) => { region.inert = true; });
    modal.querySelector(".map-context-help__close")?.focus();
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-map-help-topic]");
    if (trigger instanceof HTMLButtonElement) {
      openHelp(trigger, trigger.dataset.mapHelpTopic);
      return;
    }
    if (event.target.closest?.("[data-map-help-close]")) closeHelp();
  });
  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeHelp();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialog.querySelectorAll("a[href]:not([hidden]), button:not([disabled])"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, true);
}

function makeBluePinIcon(categoryKey) {
  const category = getCommunityMapCategoryByKey(categoryKey);
  return L.divIcon({
    className: `community-map-pin community-map-pin--${category.key}`,
    html: category.glyphSvg,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  });
}

function makeOfficialHeritageIcon(markerClass = "reviewed", categoryKey) {
  const category = getOfficialMapCategoryByKey(categoryKey);
  return L.divIcon({
    className: [
      "official-heritage-map-marker",
      `official-heritage-map-marker--${markerClass}`,
      `official-heritage-map-marker--${category.key}`
    ].join(" "),
    html: category.glyphSvg,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -19]
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

function getOfficialDisplayLocationLabel(data) {
  const badgeLabels = {
    "site-point": data.locationPrecision === "approximate" ? "Approximate site location" : "Reviewed site location",
    "compound-centroid": "Compound reference point",
    "public-entrance": "Public entrance",
    "visitor-reference-point": "Visitor reference point",
    "component-reference-point": "Component reference point",
    "generalized-locality": "General locality",
    "generalized-area-reference": "General area reference"
  };
  return data.geometryType === "Point"
    ? (data.representationStatus ? data.geometryMeaningLabel : null)
      || badgeLabels[data.displayLocationType]
      || "Reviewed official location"
    : data.geometryMeaningLabel;
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
  const explorerBodyEl = document.querySelector(".map-explorer-panel__body");
  const urlParams = new URLSearchParams(window.location.search);
  const initialDiscoveryState = parseSharedDiscoveryState(urlParams);
  const requestedPlaceId = cleanText(urlParams.get("place"));
  const fallbackCenter = [27.6202, 113.8825];
  const customFilters = Array.from(document.querySelectorAll(".map-custom-filter"));
  const infoPanelEl = document.getElementById("mapSelectionInfo");
  const infoStatusEl = document.getElementById("mapInfoStatus");
  const officialStatusEl = document.getElementById("officialHeritageStatus");
  const officialErrorEl = document.getElementById("officialHeritageError");
  const communityLayerToggle = document.getElementById("communityHeritageLayerToggle");
  const communityCategoryToggles = Array.from(
    document.querySelectorAll("[data-community-map-category]")
  );
  const communityCategoryStatusEl = document.getElementById("communityCategoryStatus");
  const officialLayerToggle = document.getElementById("officialHeritageLayerToggle");
  const officialCategoryAvailabilityEl = document.getElementById("officialCategoryAvailability");
  const officialCategoryControlsEl = document.getElementById("officialCategoryControls");
  const officialCategoryAllToggle = document.getElementById("officialCategoryAll");
  const officialCategoryListEl = document.getElementById("officialCategoryList");
  const officialCategoryDisabledHelpEl = document.getElementById("officialCategoryDisabledHelp");
  const officialCategoryStatusEl = document.getElementById("officialCategoryStatus");
  const officialReviewedPointStatusEl = document.getElementById("officialReviewedPointStatus");
  const officialGeneralizedPointStatusEl = document.getElementById("officialGeneralizedPointStatus");

  const map = L.map(containerId).setView(fallbackCenter, 13);
  const communityLayer = L.layerGroup().addTo(map);
  const officialLayer = L.layerGroup();
  const baseLayers = createBaseLayers();
  const markersById = new Map();
  const selectedCommunityCategoryKeys = new Set(
    COMMUNITY_MAP_CATEGORY_DEFINITIONS.map((category) => category.key)
  );
  const pendingFilters = {
    assetType: initialDiscoveryState.assetType,
    heritageCriteria: initialDiscoveryState.heritageCriteria
  };

  let allPublicRecords = [];
  let selectedFeature = null;
  let persistentFeatureGroup = null;
  let hoverPreview = null;
  let hoverOriginKey = "";
  let infoActivationMouseoutKey = "";
  let communityPointEntries = [];
  let officialPointEntries = [];
  const visibleFeaturesByKey = new Map();
  const hoverTooltip = L.tooltip({
    className: "map-feature-hover-tooltip",
    direction: "top",
    offset: [0, -18],
    opacity: 1
  });
  let officialLoadPromise = null;
  let lastOfficialAnnouncement = "";
  let displayedOfficialMarkerCount = null;
  let officialLayerState = "off";
  let publishedOfficialFeatures = [];
  let publishedOfficialRenderModels = [];
  let availableOfficialCategories = [];
  let officialCategoriesInitialized = false;
  const selectedOfficialCategoryKeys = new Set();
  let matchingCommunityPointCount = 0;
  let visibleCommunityPointCount = 0;

  baseLayers.osm.addTo(map);
  map.whenReady(() => {
    if (!map.hasLayer(baseLayers.osm)) {
      baseLayers.osm.addTo(map);
    }
    setTimeout(() => map.invalidateSize(), 0);
  });

  if (mode === "full") {
    const layerControl = L.control.layers({
      "OpenStreetMap": baseLayers.osm,
      "Gaode (AMap)": baseLayers.gaode,
      "Esri World Street": baseLayers.esri
    }).addTo(map);
    const layerControlContainer = layerControl.getContainer();
    const layerControlToggle = layerControlContainer?.querySelector(".leaflet-control-layers-toggle");
    layerControlContainer?.setAttribute("aria-label", "Basemap");
    layerControlToggle?.setAttribute("aria-label", "Choose basemap");
    layerControlContainer?.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      layerControl.collapse();
      setTimeout(() => layerControlToggle?.focus(), 0);
    });
  }

  if (searchInput && initialDiscoveryState.q) {
    searchInput.value = initialDiscoveryState.q;
  }

  function getCurrentDiscoveryState(term = searchInput?.value || "") {
    return {
      q: cleanText(term),
      assetType: pendingFilters.assetType,
      heritageCriteria: pendingFilters.heritageCriteria,
      place: requestedPlaceId
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

  function getVisibleLayerStatus() {
    const communityVisible = map.hasLayer(communityLayer);
    const officialVisible = map.hasLayer(officialLayer);
    const communityCount = communityVisible ? communityLayer.getLayers().length : 0;
    const officialCount = officialVisible && Number.isInteger(displayedOfficialMarkerCount)
      ? displayedOfficialMarkerCount
      : 0;
    const communityLabel = `${communityCount} community ${communityCount === 1 ? "record" : "records"}`;
    const officialLabel = `${officialCount} official heritage ${officialCount === 1 ? "location" : "locations"}`;

    if (officialVisible && officialLayerState === "loading") {
      return `${OFFICIAL_HERITAGE_LOADING_MESSAGE} ${communityVisible ? `${communityLabel} displayed.` : ""}`.trim();
    }
    if (officialVisible && officialLayerState === "valid-empty") {
      return communityVisible
        ? `${communityLabel} displayed. ${OFFICIAL_HERITAGE_EMPTY_MESSAGE}`
        : OFFICIAL_HERITAGE_EMPTY_MESSAGE;
    }
    if (communityCount > 0 && officialCount > 0) {
      return `${communityLabel} and ${officialLabel} displayed.`;
    }
    if (communityCount > 0) return `${communityLabel} displayed.`;
    if (officialCount > 0) return `${officialLabel} displayed.`;
    return "No heritage records displayed.";
  }

  function updateVisibleLayerStatus(announcementKey = "") {
    if (!officialStatusEl) return;
    const message = getVisibleLayerStatus();
    officialStatusEl.hidden = false;
    if (lastOfficialAnnouncement !== announcementKey || officialStatusEl.textContent !== message) {
      officialStatusEl.textContent = message;
      lastOfficialAnnouncement = announcementKey;
    }
  }

  function updateCommunityCategoryStatus() {
    if (!communityCategoryStatusEl) return;
    const matchingLabel = matchingCommunityPointCount === 1
      ? "matching community location"
      : "matching community locations";
    communityCategoryStatusEl.textContent = `${visibleCommunityPointCount} of ${matchingCommunityPointCount} ${matchingLabel} displayed.`;
  }

  function getOfficialCategoryToggles() {
    return Array.from(
      officialCategoryListEl?.querySelectorAll("[data-official-map-category]") || []
    );
  }

  function updateOfficialCategoryStatus() {
    if (!officialCategoryStatusEl || publishedOfficialFeatures.length === 0) return;
    const visibleCount = map.hasLayer(officialLayer)
      ? publishedOfficialFeatures.filter((feature) => {
        const category = getOfficialMapCategory(feature.properties.officialCategoryZh);
        return category && selectedOfficialCategoryKeys.has(category.key);
      }).length
      : 0;
    const locationLabel = publishedOfficialFeatures.length === 1
      ? "published official location"
      : "published official locations";
    officialCategoryStatusEl.textContent = `${visibleCount} of ${publishedOfficialFeatures.length} ${locationLabel} displayed.`;
  }

  function showOfficialCategoryAvailability(message) {
    if (officialCategoryAvailabilityEl) {
      officialCategoryAvailabilityEl.textContent = message;
      officialCategoryAvailabilityEl.hidden = false;
    }
    if (officialCategoryControlsEl) officialCategoryControlsEl.hidden = true;
  }

  function buildOfficialCategoryControls() {
    if (!officialCategoryListEl) return;
    officialCategoryListEl.replaceChildren();

    availableOfficialCategories.forEach((category) => {
      const label = document.createElement("label");
      label.className = "map-layer-toggle map-layer-toggle--category";
      label.htmlFor = `officialCategory-${category.key}`;

      const input = document.createElement("input");
      input.id = label.htmlFor;
      input.type = "checkbox";
      input.dataset.officialMapCategory = category.key;

      const symbol = document.createElement("span");
      symbol.className = "map-layer-category-symbol map-layer-category-symbol--official";
      symbol.setAttribute("aria-hidden", "true");
      symbol.innerHTML = category.glyphSvg;

      const text = document.createElement("span");
      text.textContent = category.label;

      label.append(input, symbol, text);

      const row = document.createElement("div");
      row.className = "map-layer-control-row";
      row.appendChild(label);

      const helpTopic = `official-category-${category.key}`;
      if (MAP_HELP_TOPICS[helpTopic]) {
        const helpButton = document.createElement("button");
        helpButton.className = "map-context-help-button";
        helpButton.type = "button";
        helpButton.dataset.mapHelpTopic = helpTopic;
        helpButton.setAttribute("aria-label", `About ${category.label} category`);
        helpButton.textContent = "?";
        row.appendChild(helpButton);
      }

      officialCategoryListEl.appendChild(row);
    });
  }

  function initializeOfficialCategories(features) {
    publishedOfficialFeatures = features;
    if (officialReviewedPointStatusEl) {
      const reviewedPointCount = features.filter(({ geometry, properties }) => (
        geometry?.type === "Point" && properties?.markerClass === "reviewed"
      )).length;
      officialReviewedPointStatusEl.textContent = `Filled diamond. Currently displayed: ${reviewedPointCount}.`;
    }
    if (officialGeneralizedPointStatusEl) {
      const generalizedPointCount = features.filter(({ geometry, properties }) => (
        geometry?.type === "Point" && properties?.markerClass === "generalized"
      )).length;
      officialGeneralizedPointStatusEl.textContent = `Hollow diamond. Currently displayed: ${generalizedPointCount}.`;
    }
    availableOfficialCategories = getPublishedOfficialMapCategories(features);

    if (availableOfficialCategories.length === 0) {
      showOfficialCategoryAvailability("No published official categories are available.");
      return;
    }

    if (!officialCategoriesInitialized) {
      availableOfficialCategories.forEach((category) => {
        selectedOfficialCategoryKeys.add(category.key);
      });
      officialCategoriesInitialized = true;
    }

    buildOfficialCategoryControls();
    if (officialCategoryAvailabilityEl) officialCategoryAvailabilityEl.hidden = true;
    if (officialCategoryControlsEl) officialCategoryControlsEl.hidden = false;
    updateOfficialCategoryStatus();
  }

  function showOfficialError() {
    if (!officialErrorEl) return;
    officialErrorEl.hidden = false;
    if (
      lastOfficialAnnouncement !== "failure"
      || officialErrorEl.textContent !== OFFICIAL_HERITAGE_FAILURE_MESSAGE
    ) {
      officialErrorEl.textContent = OFFICIAL_HERITAGE_FAILURE_MESSAGE;
      lastOfficialAnnouncement = "failure";
    }
    publishedOfficialFeatures = [];
    publishedOfficialRenderModels = [];
    availableOfficialCategories = [];
    selectedOfficialCategoryKeys.clear();
    officialCategoriesInitialized = false;
    showOfficialCategoryAvailability("Official categories are unavailable because the official layer could not be loaded.");
    updateVisibleLayerStatus("failure-status");
  }

  function syncLayerControls() {
    if (communityLayerToggle) {
      const selectedCount = selectedCommunityCategoryKeys.size;
      communityLayerToggle.checked = selectedCount === COMMUNITY_MAP_CATEGORY_DEFINITIONS.length;
      communityLayerToggle.indeterminate = selectedCount > 0
        && selectedCount < COMMUNITY_MAP_CATEGORY_DEFINITIONS.length;
    }
    communityCategoryToggles.forEach((toggle) => {
      toggle.checked = selectedCommunityCategoryKeys.has(toggle.dataset.communityMapCategory);
    });
    if (officialLayerToggle) {
      officialLayerToggle.checked = map.hasLayer(officialLayer) && officialLayerState !== "failed";
      officialLayerToggle.setAttribute("aria-invalid", String(officialLayerState === "failed"));
    }
    const officialCategoriesEnabled = map.hasLayer(officialLayer)
      && officialLayerState === "valid";
    if (officialCategoryDisabledHelpEl) {
      officialCategoryDisabledHelpEl.hidden = officialCategoriesEnabled
        || availableOfficialCategories.length === 0;
    }
    if (officialCategoryAllToggle) {
      const selectedCount = availableOfficialCategories.filter((category) => (
        selectedOfficialCategoryKeys.has(category.key)
      )).length;
      officialCategoryAllToggle.checked = availableOfficialCategories.length > 0
        && selectedCount === availableOfficialCategories.length;
      officialCategoryAllToggle.indeterminate = selectedCount > 0
        && selectedCount < availableOfficialCategories.length;
      officialCategoryAllToggle.disabled = !officialCategoriesEnabled;
    }
    getOfficialCategoryToggles().forEach((toggle) => {
      toggle.checked = selectedOfficialCategoryKeys.has(toggle.dataset.officialMapCategory);
      toggle.disabled = !officialCategoriesEnabled;
    });
  }

  function buildOfficialPointLayer(feature) {
      const [longitude, latitude] = feature.geometry.coordinates;
      const markerName = buildOfficialMarkerAccessibleName(feature);
      const category = getOfficialMapCategory(feature.properties.officialCategoryZh);
      const marker = L.marker([latitude, longitude], {
        icon: makeOfficialHeritageIcon(feature.properties.markerClass, category.key),
        alt: markerName,
        keyboard: true,
        riseOnFocus: true
      });
      const entry = {
        source: "official",
        value: feature,
        layer: marker,
        latLng: L.latLng(latitude, longitude),
        isPoint: true
      };
      officialPointEntries.push(entry);
      registerFeatureEntry(entry);
      marker.on("add", () => {
        const element = marker.getElement();
        element?.setAttribute("aria-label", markerName);
        element?.removeAttribute("title");
        if (!element || element.dataset.officialKeyboardBound === "true") return;
        element.dataset.officialKeyboardBound = "true";
        element.addEventListener("keydown", (event) => {
          if (!["Enter", " ", "Spacebar"].includes(event.key)) return;
          event.preventDefault();
          event.stopPropagation();
          selectMapFeature("official", feature);
        });
      });
      return marker;
  }

  function convertOfficialCoordinatesToLatLngs(coordinates) {
    if (Array.isArray(coordinates) && coordinates.length === 2 && coordinates.every(Number.isFinite)) {
      return [coordinates[1], coordinates[0]];
    }
    return coordinates.map(convertOfficialCoordinatesToLatLngs);
  }

  function decorateOfficialGeometryLayer(layer, accessibleName, feature) {
    layer.on("add", () => {
      const element = layer.getElement();
      if (!element) return;
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");
      element.setAttribute("focusable", "true");
      element.setAttribute("aria-label", accessibleName);
      element.dataset.officialFeatureId = feature.id;
      if (element.dataset.officialKeyboardBound === "true") return;
      element.dataset.officialKeyboardBound = "true";
      element.addEventListener("keydown", (event) => {
        if (!["Enter", " ", "Spacebar"].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        selectMapFeature("official", feature);
      });
    });
  }

  function buildOfficialGeometryLayer(renderModel) {
    const { feature, presentation } = renderModel;
    if (presentation.renderer === "point") {
      return buildOfficialPointLayer(feature);
    }
    const latLngs = convertOfficialCoordinatesToLatLngs(feature.geometry.coordinates);
    const layer = presentation.renderer === "line"
      ? L.polyline(latLngs, presentation.pathOptions)
      : L.polygon(latLngs, presentation.pathOptions);
    const accessibleName = buildOfficialFeatureAccessibleName(feature);
    decorateOfficialGeometryLayer(layer, accessibleName, feature);
    const entry = {
      source: "official",
      value: feature,
      layer,
      latLng: layer.getBounds().getCenter(),
      isPoint: false
    };
    registerFeatureEntry(entry);
    layer.on("add", () => {
      entry.latLng = layer.getBounds().getCenter();
    });
    return layer;
  }

  function renderOfficialFeatures() {
    const visibleModels = publishedOfficialRenderModels.filter(({ feature }) => {
      const category = getOfficialMapCategory(feature.properties.officialCategoryZh);
      return category && selectedOfficialCategoryKeys.has(category.key);
    });
    if (
      selectedFeature?.source === "official"
      && !visibleModels.some(({ feature }) => String(feature.id) === selectedFeature.id)
    ) {
      clearSelectedFeature();
    }
    let renderedLayers;
    try {
      clearTemporaryPreview();
      if (persistentFeatureGroup) clearSelectedFeature();
      officialPointEntries = [];
      [...visibleFeaturesByKey.keys()]
        .filter((key) => key.startsWith("official:"))
        .forEach((key) => visibleFeaturesByKey.delete(key));
      renderedLayers = visibleModels.map(buildOfficialGeometryLayer);
    } catch (error) {
      console.error("Error rendering official heritage preview:", error);
      officialLayer.clearLayers();
      displayedOfficialMarkerCount = null;
      officialLayerState = "failed";
      map.removeLayer(officialLayer);
      syncLayerControls();
      showOfficialError();
      return;
    }
    officialLayer.clearLayers();
    renderedLayers.forEach((layer) => layer.addTo(officialLayer));
    displayedOfficialMarkerCount = visibleModels.length;
    updateOfficialCategoryStatus();
    syncLayerControls();
    updateVisibleLayerStatus(`valid-${displayedOfficialMarkerCount}`);
  }

  function getOfficialHeritageResult() {
    if (officialLoadPromise) return officialLoadPromise;

    officialLoadPromise = (async () => {
      const response = await fetch(OFFICIAL_HERITAGE_GEOJSON_URL);
      if (!response.ok) {
        throw new Error(`Official heritage GeoJSON request failed with HTTP ${response.status}.`);
      }
      const value = await response.json();
      return {
        ok: true,
        value: validateOfficialHeritageGeoJson(value)
      };
    })().catch((error) => ({
      ok: false,
      error
    }));

    return officialLoadPromise;
  }

  async function activateOfficialHeritageLayer() {
    if (!officialLoadPromise) {
      officialLayerState = "loading";
      if (officialErrorEl) officialErrorEl.hidden = true;
      updateVisibleLayerStatus("loading");
    }

    const result = await getOfficialHeritageResult();
    if (!map.hasLayer(officialLayer)) return;

    officialLayer.clearLayers();
    if (!result.ok) {
      console.error("Error loading official heritage preview:", result.error);
      officialLayerState = "failed";
      displayedOfficialMarkerCount = null;
      map.removeLayer(officialLayer);
      syncLayerControls();
      showOfficialError();
      return;
    }

    if (result.value.status === "valid-empty") {
      officialLayerState = "valid-empty";
      displayedOfficialMarkerCount = 0;
      publishedOfficialFeatures = [];
      publishedOfficialRenderModels = [];
      availableOfficialCategories = [];
      showOfficialCategoryAvailability("No published official categories are available.");
      syncLayerControls();
      updateVisibleLayerStatus("valid-empty");
      return;
    }

    officialLayerState = "valid";
    publishedOfficialRenderModels = result.value.renderModels;
    initializeOfficialCategories(result.value.features);
    renderOfficialFeatures();
  }

  function setActiveToolPanel(panelKey, { moveFocus = true } = {}) {
    toolButtons.forEach((button) => {
      const isActive = button.dataset.toolTarget === panelKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });

    toolPanels.forEach((panel) => {
      const isActive = panel.dataset.toolPanel === panelKey;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
      if (isActive && moveFocus) {
        const focusTarget = panel.querySelector("input, button, a[href]") || panel;
        focusTarget.focus();
      }
    });
  }

  function appendInfoFact(list, label, value, language = "") {
    const cleanValue = cleanText(value);
    if (!cleanValue) return;
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = cleanValue;
    if (language) description.lang = language;
    row.append(term, description);
    list.appendChild(row);
  }

  function getFeatureKey(source, value) {
    return `${source}:${String(value?.id || value?.properties?.recordId || "")}`;
  }

  function getCommunityHeritageArea(record) {
    const province = cleanText(record.province);
    if (province) {
      return /(?:province|省)$/i.test(province) ? province : `${province} Province`;
    }
    const area = cleanText(record.area);
    return /(?:province|省)$/i.test(area) ? area : "";
  }

  function getCommunityAdministrativeArea(record) {
    const city = cleanText(record.city);
    const subdivision = cleanText(record.county) || cleanText(record.district);
    return [...new Set([city, subdivision].filter(Boolean))].join(" · ");
  }

  function getCommunityConciseLocation(record) {
    const province = cleanText(record.province);
    const provinceLabels = new Set([
      province.toLocaleLowerCase(),
      `${province} province`.trim().toLocaleLowerCase()
    ].filter(Boolean));
    const rawLocation = cleanText(record.address) || getCommunityDisplayLocation(record);
    const conciseParts = rawLocation
      .split(",")
      .map(cleanText)
      .filter((part) => part && !provinceLabels.has(part.toLocaleLowerCase()));
    return conciseParts.join(", ")
      || cleanText(record.district)
      || cleanText(record.county)
      || cleanText(record.city)
      || cleanText(record.area);
  }

  function getFeatureIdentity(source, value) {
    if (source === "community") {
      return {
        title: cleanText(value.title) || "Untitled community place",
        locality: getCommunityConciseLocation(value),
        type: "Community Heritage"
      };
    }
    const data = buildOfficialPopupData(value);
    return {
      title: data.projectNameEn || "Untitled Official Heritage record",
      locality: cleanText(data.officialLocationTextZh),
      type: "Official Heritage",
      localityLanguage: "zh-Hans"
    };
  }

  function buildHoverTooltipContent(entries) {
    const list = document.createElement("div");
    list.className = "map-hover-identities";
    entries.forEach((entry) => {
      const identity = getFeatureIdentity(entry.source, entry.value);
      const item = document.createElement("div");
      item.className = "map-hover-identity";
      const title = document.createElement("strong");
      title.textContent = identity.title;
      item.appendChild(title);
      if (identity.locality) {
        const locality = document.createElement("span");
        locality.textContent = identity.locality;
        if (identity.localityLanguage) locality.lang = identity.localityLanguage;
        item.appendChild(locality);
      }
      list.appendChild(item);
    });
    return list;
  }

  function renderInfoEmptyState() {
    if (!infoPanelEl) return;
    const title = document.createElement("h3");
    title.textContent = "Selected feature";
    const message = document.createElement("p");
    message.className = "map-explorer-section__text";
    message.textContent = "Select a Community Heritage or Official Heritage feature on the map to see information about it here.";
    infoPanelEl.replaceChildren(title, message);
  }

  function appendClearSelectionButton(parent) {
    const button = document.createElement("button");
    button.className = "map-selection-info__clear";
    button.id = "mapClearSelection";
    button.type = "button";
    button.textContent = "Clear selection";
    parent.appendChild(button);
  }

  function renderCommunityInfo(record, { showClear = true } = {}) {
    if (!infoPanelEl) return;
    const title = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.className = "map-selection-info__title-link";
    titleLink.href = buildPlaceRecordUrl(record.id);
    titleLink.textContent = cleanText(record.title) || "Untitled community place";
    title.appendChild(titleLink);
    const location = document.createElement("p");
    location.className = "map-selection-info__location";
    location.textContent = getCommunityConciseLocation(record);
    const facts = document.createElement("dl");
    facts.className = "map-selection-info__facts map-selection-info__facts--compact";
    appendInfoFact(facts, "Community heritage area", getCommunityHeritageArea(record));
    appendInfoFact(facts, "Administrative area", getCommunityAdministrativeArea(record));
    const children = [title];
    if (location.textContent) children.push(location);
    if (facts.children.length) children.push(facts);
    infoPanelEl.replaceChildren(...children);
    if (showClear) appendClearSelectionButton(infoPanelEl);
  }

  function appendExternalInfoLink(parent, label, href) {
    if (!href) return;
    const link = document.createElement("a");
    link.className = "map-selection-info__link";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    parent.appendChild(link);
  }

  function renderOfficialInfo(feature, { showClear = true } = {}) {
    if (!infoPanelEl) return;
    const data = buildOfficialPopupData(feature);
    const category = getOfficialMapCategory(data.officialCategoryZh);
    const categoryRow = document.createElement("div");
    categoryRow.className = "map-selection-info__category";
    const categoryName = document.createElement("strong");
    categoryName.textContent = category.label;
    categoryRow.appendChild(categoryName);
    const categoryHelpTopic = `official-category-${category.key}`;
    if (MAP_HELP_TOPICS[categoryHelpTopic]) {
      const categoryHelp = document.createElement("button");
      categoryHelp.className = "map-context-help-button";
      categoryHelp.type = "button";
      categoryHelp.dataset.mapHelpTopic = categoryHelpTopic;
      categoryHelp.setAttribute("aria-label", `About ${category.label} category`);
      categoryHelp.textContent = "?";
      categoryRow.appendChild(categoryHelp);
    }
    const title = document.createElement("h3");
    title.textContent = data.projectNameEn || "Untitled Official Heritage record";
    const recordType = document.createElement("p");
    recordType.className = "map-selection-info__type map-selection-info__type--official";
    recordType.textContent = "Official Heritage record";
    const facts = document.createElement("dl");
    facts.className = "map-selection-info__facts map-selection-info__facts--compact";
    appendInfoFact(facts, "Official name", data.officialNameZh, "zh-Hans");
    appendInfoFact(facts, "Designation level", data.officialDesignationLevelLabel);
    appendInfoFact(facts, "Original official category", data.officialCategoryZh, "zh-Hans");
    appendInfoFact(facts, "Official location", data.officialLocationTextZh, "zh-Hans");
    appendInfoFact(facts, "Map representation", getOfficialDisplayLocationLabel(data));
    appendInfoFact(facts, "Location evidence", data.locationEvidenceConfidence);
    if (data.geometrySourceTypeLabel && data.geometrySourceLabel) {
      appendInfoFact(facts, "Map location source", `${data.geometrySourceTypeLabel}: ${data.geometrySourceLabel}`);
    }
    if (data.generalizedPointContract) {
      appendInfoFact(facts, "Representative-Point method", data.generalizedPointRepresentativeMethod);
      appendInfoFact(facts, "Reference-area coverage", Number.isFinite(data.generalizedPointOutwardCoverageMetres)
        ? `${data.generalizedPointOutwardCoverageMetres} metres`
        : "");
      appendInfoFact(facts, "Record-specific limitation", data.generalizedPointCandidateLimitation);
    } else if (data.geometryType === "Point") {
      appendInfoFact(facts, "Estimated location uncertainty", Number.isFinite(data.estimatedUncertaintyMeters)
        ? `${data.estimatedUncertaintyMeters} metres`
        : "");
    } else {
      appendInfoFact(facts, "Geometry precision", data.geometryPrecision);
      appendInfoFact(facts, "Horizontal uncertainty", Number.isFinite(data.horizontalUncertaintyMetres)
        ? `${data.horizontalUncertaintyMetres} metres`
        : "");
      appendInfoFact(facts, "Geometry reviewed", data.geometryReviewedAt);
    }
    appendInfoFact(facts, "Official source", data.sourceLabel, "zh-Hans");
    appendInfoFact(facts, "Source accessed", data.sourceAccessedDate);
    infoPanelEl.replaceChildren(categoryRow, title, recordType, facts);
    const cautionText = cleanText(data.geometryCaution) || cleanText(data.publicLocationNote);
    if (cautionText) {
      const caution = document.createElement("p");
      caution.className = "map-selection-info__caution";
      caution.textContent = cautionText;
      infoPanelEl.appendChild(caution);
    }
    if (data.generalizedPointContract) {
      const warning = document.createElement("p");
      warning.className = "map-selection-info__warning";
      warning.textContent = data.generalizedPointMandatoryLimitation;
      infoPanelEl.appendChild(warning);
    }
    appendExternalInfoLink(infoPanelEl, "Open official source", data.sourceUrl);
    if (data.geometrySourceUrl && data.geometrySourceUrl !== data.sourceUrl) {
      appendExternalInfoLink(infoPanelEl, "Open map-location source", data.geometrySourceUrl);
    }
    if (showClear) appendClearSelectionButton(infoPanelEl);
  }

  function renderFeatureGroup(entries, { showClear = true } = {}) {
    if (!infoPanelEl) return;
    const title = document.createElement("h3");
    title.textContent = `${entries.length} nearby records`;
    const hint = document.createElement("p");
    hint.className = "map-explorer-section__text";
    hint.textContent = "Choose a record to keep its information in this panel.";
    const list = document.createElement("ul");
    list.className = "map-selection-group";
    entries.forEach((entry) => {
      const identity = getFeatureIdentity(entry.source, entry.value);
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.mapFeatureKey = getFeatureKey(entry.source, entry.value);
      const name = document.createElement("strong");
      name.textContent = identity.title;
      const meta = document.createElement("span");
      meta.textContent = [identity.locality, identity.type].filter(Boolean).join(" · ");
      button.append(name, meta);
      item.appendChild(button);
      list.appendChild(item);
    });
    infoPanelEl.replaceChildren(title, hint, list);
    if (showClear) appendClearSelectionButton(infoPanelEl);
  }

  function renderFeatureInfo(entry, options) {
    if (entry.source === "community") renderCommunityInfo(entry.value, options);
    else renderOfficialInfo(entry.value, options);
  }

  function renderCurrentInfo() {
    if (hoverPreview?.length) {
      const options = { showClear: Boolean(selectedFeature || persistentFeatureGroup) };
      if (hoverPreview.length === 1) renderFeatureInfo(hoverPreview[0], options);
      else renderFeatureGroup(hoverPreview, options);
      return;
    }
    if (selectedFeature) {
      renderFeatureInfo(selectedFeature);
      return;
    }
    if (persistentFeatureGroup?.length) {
      renderFeatureGroup(persistentFeatureGroup);
      return;
    }
    renderInfoEmptyState();
  }

  function selectMapFeature(source, value) {
    selectedFeature = { source, id: String(value?.id || value?.properties?.recordId || ""), value };
    persistentFeatureGroup = null;
    hoverPreview = null;
    hoverOriginKey = "";
    infoActivationMouseoutKey = "";
    map.closeTooltip(hoverTooltip);
    setActiveToolPanel("info", { moveFocus: false });
    if (explorerBodyEl) explorerBodyEl.scrollTop = 0;
    renderCurrentInfo();
    if (infoStatusEl) {
      infoStatusEl.textContent = `Showing information for ${getFeatureIdentity(source, value).title}.`;
    }
  }

  function clearSelectedFeature({ announce = true } = {}) {
    if (!selectedFeature && !persistentFeatureGroup) return;
    selectedFeature = null;
    persistentFeatureGroup = null;
    renderCurrentInfo();
    if (announce && infoStatusEl) infoStatusEl.textContent = "Selection cleared.";
  }

  function clearTemporaryPreview(originKey = "") {
    if (typeof originKey === "string" && originKey && originKey !== hoverOriginKey) return;
    if (!hoverPreview) return;
    hoverPreview = null;
    hoverOriginKey = "";
    infoActivationMouseoutKey = "";
    map.closeTooltip(hoverTooltip);
    renderCurrentInfo();
  }

  function getVisiblePointEntries() {
    return [...communityPointEntries, ...officialPointEntries]
      .filter((entry) => map.hasLayer(entry.layer));
  }

  function getHoverGroup(entry) {
    if (!entry.isPoint) return [entry];
    const origin = map.latLngToContainerPoint(entry.latLng);
    return getVisiblePointEntries()
      .filter((candidate) => {
        const point = map.latLngToContainerPoint(candidate.latLng);
        return origin.distanceTo(point) <= HOVER_GROUP_THRESHOLD_PX;
      })
      .sort((a, b) => getFeatureIdentity(a.source, a.value).title.localeCompare(
        getFeatureIdentity(b.source, b.value).title
      ));
  }

  function previewFeature(entry, latLng = entry.latLng) {
    const entryKey = getFeatureKey(entry.source, entry.value);
    const infoWasActive = toolButtons.some((button) => (
      button.dataset.toolTarget === "info" && button.getAttribute("aria-selected") === "true"
    ));
    hoverPreview = getHoverGroup(entry);
    hoverOriginKey = entryKey;
    infoActivationMouseoutKey = infoWasActive ? "" : entryKey;
    setActiveToolPanel("info", { moveFocus: false });
    renderCurrentInfo();
    hoverTooltip.setLatLng(latLng).setContent(buildHoverTooltipContent(hoverPreview)).openOn(map);
  }

  function isTouchActivation(event) {
    const originalEvent = event?.originalEvent;
    return originalEvent?.pointerType === "touch" || originalEvent?.sourceCapabilities?.firesTouchEvents === true;
  }

  function activateFeature(entry, event) {
    if (entry.isPoint && isTouchActivation(event)) {
      const group = getHoverGroup(entry);
      if (group.length > 1) {
        hoverPreview = null;
        selectedFeature = null;
        persistentFeatureGroup = group;
        setActiveToolPanel("info", { moveFocus: false });
        renderCurrentInfo();
        return;
      }
    }
    selectMapFeature(entry.source, entry.value);
  }

  function registerFeatureEntry(entry) {
    const entryKey = getFeatureKey(entry.source, entry.value);
    visibleFeaturesByKey.set(entryKey, entry);
    entry.layer.on("mouseover", (event) => previewFeature(entry, event.latlng || entry.latLng));
    entry.layer.on("mouseout", (event) => {
      const movedToMapAfterInfoActivation = infoActivationMouseoutKey === entryKey
        && event.originalEvent?.relatedTarget === map.getContainer();
      if (movedToMapAfterInfoActivation) {
        infoActivationMouseoutKey = "";
        setTimeout(() => {
          map.once("mousemove", () => clearTemporaryPreview(entryKey));
        }, 0);
        return;
      }
      clearTemporaryPreview(entryKey);
    });
    entry.layer.on("click", (event) => activateFeature(entry, event));
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
    const selectedValues = [selectedValue];
    const { valueLabel } = getCustomFilterParts(filter);
    if (valueLabel) valueLabel.textContent = selectedValue || "Show all";

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
    const selectedValues = [pendingFilters[key]].filter(Boolean);
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

  function renderRequestedPlaceFocus(matchingRecords, matchingPoints, { moveMap = true } = {}) {
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

    const matchingPoint = matchingPoints.find((place) => place.id === record.id);
    if (matchingPoint && !selectedCommunityCategoryKeys.has(getCommunityMapCategory(matchingPoint).key)) {
      focusStatusEl.append(`${cleanText(record.title) || "The requested place"} is hidden by the current Map layer/category selection.`);
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

    if (!moveMap) {
      focusStatusEl.append(`${cleanText(record.title) || "The requested place"} remains visible with the current Map layer/category selection.`);
      appendFocusLink("View its public record", recordUrl);
      return;
    }

    marker.setZIndexOffset(1000);
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15));
    selectMapFeature("community", record);
    focusStatusEl.append(`Focused on ${cleanText(record.title) || "the requested public place"}.`);
    appendFocusLink("View its public record", recordUrl);
  }

  function renderMapFeatures(searchTerm = "", {
    preserveMapView = false,
    updateDiscoveryState = true,
    moveRequestedPlace = true
  } = {}) {
    const normalizedTerm = normalizeSearchText(searchTerm);
    clearTemporaryPreview();
    if (persistentFeatureGroup) clearSelectedFeature();
    communityLayer.clearLayers();
    markersById.clear();
    communityPointEntries = [];
    [...visibleFeaturesByKey.keys()]
      .filter((key) => key.startsWith("community:"))
      .forEach((key) => visibleFeaturesByKey.delete(key));

    const filters = {
      query: normalizedTerm,
      assetType: pendingFilters.assetType,
      heritageCriteria: pendingFilters.heritageCriteria
    };
    const matchingRecords = getMatchingPublicRecords(allPublicRecords, filters);
    const matchingPoints = matchingRecords
      .filter(hasValidCoordinates)
      .sort((a, b) => cleanText(a.title).localeCompare(cleanText(b.title)));
    const visiblePoints = matchingPoints.filter((point) => (
      selectedCommunityCategoryKeys.has(getCommunityMapCategory(point).key)
    ));
    if (
      selectedFeature?.source === "community"
      && !visiblePoints.some((point) => String(point.id) === selectedFeature.id)
    ) {
      clearSelectedFeature();
    }
    matchingCommunityPointCount = matchingPoints.length;
    visibleCommunityPointCount = visiblePoints.length;

    const boundsItems = [];
    visiblePoints.forEach((point) => {
      const category = getCommunityMapCategory(point);
      const markerName = buildCommunityMarkerAccessibleName(point);
      const marker = L.marker([point.lat, point.lng], {
        icon: makeBluePinIcon(category.key),
        alt: markerName,
        keyboard: true,
        riseOnFocus: true
      });
      const entry = {
        source: "community",
        value: point,
        layer: marker,
        latLng: L.latLng(point.lat, point.lng),
        isPoint: true
      };
      communityPointEntries.push(entry);
      registerFeatureEntry(entry);
      marker.on("add", () => {
        const element = marker.getElement();
        element?.setAttribute("aria-label", markerName);
        element?.removeAttribute("title");
        if (!element || element.dataset.communityKeyboardBound === "true") return;
        element.dataset.communityKeyboardBound = "true";
        element.addEventListener("keydown", (event) => {
          if (!["Enter", " ", "Spacebar"].includes(event.key)) return;
          event.preventDefault();
          event.stopPropagation();
          selectMapFeature("community", point);
        });
      });
      marker.addTo(communityLayer);
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

    if (!preserveMapView) {
      fitMapToLayers(map, boundsItems, fallbackCenter);
    }
    updateCommunityCategoryStatus();
    updateVisibleLayerStatus(`community-${map.hasLayer(communityLayer)}-${matchingPoints.length}`);

    renderRequestedPlaceFocus(matchingRecords, matchingPoints, { moveMap: moveRequestedPlace });
    if (updateDiscoveryState) {
      updateDiscoveryLinks(searchTerm);
    }

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
          county: cleanText(data.county),
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
      const panelKey = button.dataset.toolTarget || "search";
      setActiveToolPanel(panelKey);
    });
    button.addEventListener("keydown", (event) => {
      const currentIndex = toolButtons.indexOf(button);
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % toolButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + toolButtons.length) % toolButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = toolButtons.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      const nextButton = toolButtons[nextIndex];
      setActiveToolPanel(nextButton.dataset.toolTarget || "search", { moveFocus: false });
      nextButton.focus();
    });
  });

  communityLayerToggle?.addEventListener("change", () => {
    if (communityLayerToggle.checked) {
      COMMUNITY_MAP_CATEGORY_DEFINITIONS.forEach((category) => {
        selectedCommunityCategoryKeys.add(category.key);
      });
    } else {
      selectedCommunityCategoryKeys.clear();
    }
    syncLayerControls();
    renderMapFeatures(searchInput?.value || "", {
      preserveMapView: true,
      updateDiscoveryState: false,
      moveRequestedPlace: false
    });
  });

  communityCategoryToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const categoryKey = toggle.dataset.communityMapCategory;
      if (toggle.checked) {
        selectedCommunityCategoryKeys.add(categoryKey);
      } else {
        selectedCommunityCategoryKeys.delete(categoryKey);
      }
      syncLayerControls();
      renderMapFeatures(searchInput?.value || "", {
        preserveMapView: true,
        updateDiscoveryState: false,
        moveRequestedPlace: false
      });
    });
  });

  officialCategoryAllToggle?.addEventListener("change", () => {
    if (officialCategoryAllToggle.checked) {
      availableOfficialCategories.forEach((category) => {
        selectedOfficialCategoryKeys.add(category.key);
      });
    } else {
      selectedOfficialCategoryKeys.clear();
    }
    if (map.hasLayer(officialLayer) && officialLayerState === "valid") {
      renderOfficialFeatures();
    } else {
      syncLayerControls();
      updateOfficialCategoryStatus();
    }
  });

  officialCategoryListEl?.addEventListener("change", (event) => {
    const toggle = event.target;
    if (!(toggle instanceof HTMLInputElement) || !toggle.dataset.officialMapCategory) return;
    const categoryKey = toggle.dataset.officialMapCategory;
    if (toggle.checked) {
      selectedOfficialCategoryKeys.add(categoryKey);
    } else {
      selectedOfficialCategoryKeys.delete(categoryKey);
    }
    if (map.hasLayer(officialLayer) && officialLayerState === "valid") {
      renderOfficialFeatures();
    } else {
      syncLayerControls();
      updateOfficialCategoryStatus();
    }
  });

  officialLayerToggle?.addEventListener("change", () => {
    if (officialLayerToggle.checked) {
      officialLayerState = "loading";
      if (officialErrorEl) officialErrorEl.hidden = true;
      officialLayer.addTo(map);
    } else {
      map.removeLayer(officialLayer);
    }
    syncLayerControls();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Node && !customFilters.some((filter) => filter.contains(target))) {
      closeAllCustomFilters();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllCustomFilters();
      clearTemporaryPreview();
    }
  });

  infoPanelEl?.addEventListener("click", (event) => {
    if (event.target.closest?.("#mapClearSelection")) {
      clearSelectedFeature();
      return;
    }
    const groupChoice = event.target.closest?.("[data-map-feature-key]");
    if (groupChoice instanceof HTMLButtonElement) {
      const entry = visibleFeaturesByKey.get(groupChoice.dataset.mapFeatureKey);
      if (entry) selectMapFeature(entry.source, entry.value);
    }
  });

  map.on("zoomstart", clearTemporaryPreview);

  map.on("layeradd", (event) => {
    if (event.layer === communityLayer) {
      syncLayerControls();
      updateVisibleLayerStatus("community-layer-added");
      return;
    }
    if (event.layer === officialLayer) {
      syncLayerControls();
      activateOfficialHeritageLayer();
    }
  });

  map.on("layerremove", (event) => {
    if (event.layer === communityLayer) {
      clearTemporaryPreview();
      if (persistentFeatureGroup) clearSelectedFeature();
      if (selectedFeature?.source === "community") {
        clearSelectedFeature();
      }
      syncLayerControls();
      updateVisibleLayerStatus("community-layer-removed");
      return;
    }
    if (event.layer === officialLayer) {
      clearTemporaryPreview();
      if (persistentFeatureGroup) clearSelectedFeature();
      if (selectedFeature?.source === "official") {
        clearSelectedFeature();
      }
      officialLayer.clearLayers();
      displayedOfficialMarkerCount = null;
      if (officialLayerState !== "failed") {
        officialLayerState = "off";
        if (officialErrorEl) officialErrorEl.hidden = true;
      }
      syncLayerControls();
      updateOfficialCategoryStatus();
      updateVisibleLayerStatus(`official-layer-removed-${officialLayerState}`);
    }
  });

  syncLayerControls();

  loadMarkers().then(() => {
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

initMapContextualHelp();
initFullMap();
