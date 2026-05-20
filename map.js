// === Import Firebase ===
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Firebase Config ===
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

function buildCommunityPopupHtml(record, searchTerm = "") {
  const safeTitle = escapeHTML(getTitle(record));
  const safeDesc = escapeHTML(getDescription(record));
  const safeType = escapeHTML(getType(record));
  const safeArticleLink = toSafeUrl(record?.linkedArticle || "");
  const fullMapUrl = buildFullMapUrl(searchTerm);

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
    </article>
  `;

  return html;
}

function buildPointFormHtml() {
  return `
    <form class="point-form" style="min-width:240px; display:grid; gap:8px;">
      <label style="display:grid; gap:4px;">
        <span style="font-size:12px;">Title</span>
        <input name="name" required maxlength="100" placeholder="Location title" />
      </label>
      <label style="display:grid; gap:4px;">
        <span style="font-size:12px;">Description</span>
        <textarea name="desc" required rows="3" maxlength="300" placeholder="Short description"></textarea>
      </label>
      <label style="display:grid; gap:4px;">
        <span style="font-size:12px;">Linked Article (optional)</span>
        <input name="linkedArticle" type="url" placeholder="https://..." />
      </label>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button type="button" data-action="cancel">Cancel</button>
        <button type="submit" data-action="save">Save Point</button>
      </div>
    </form>
  `;
}

function buildPolygonFormHtml() {
  return `
    <form class="polygon-form" style="min-width:240px; display:grid; gap:8px;">
      <label style="display:grid; gap:4px;">
        <span style="font-size:12px;">Title (optional)</span>
        <input name="title" maxlength="100" placeholder="Area title" />
      </label>
      <label style="display:grid; gap:4px;">
        <span style="font-size:12px;">Description (optional)</span>
        <textarea name="desc" rows="3" maxlength="300" placeholder="Area description"></textarea>
      </label>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button type="button" data-action="cancel">Cancel</button>
        <button type="submit" data-action="save">Save Polygon</button>
      </div>
    </form>
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
  statusId,
  fullMapLinkId,
  allowUpload = false,
  allowDrawing = false
}) {
  const container = document.getElementById(containerId);
  if (!container || typeof L === "undefined") return;

  const searchForm = document.getElementById(searchFormId);
  const searchInput = document.getElementById(searchInputId);
  const clearButton = clearButtonId ? document.getElementById(clearButtonId) : null;
  const statusEl = statusId ? document.getElementById(statusId) : null;
  const fullMapLink = fullMapLinkId ? document.getElementById(fullMapLinkId) : null;
  const initialSearchTerm = new URLSearchParams(window.location.search).get("search") || "";
  const fallbackCenter = [51.505, -0.09];
  const map = L.map(containerId).setView(fallbackCenter, 13);
  const pointLayer = L.layerGroup().addTo(map);
  const polygonLayer = L.layerGroup().addTo(map);
  const drawnItems = new L.FeatureGroup();
  const bluePinIcon = makeBluePinIcon();
  const baseLayers = createBaseLayers();
  let allMapPoints = [];
  let allMapPolygons = [];
  let isDrawing = false;

  baseLayers.osm.addTo(map);
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

  if (allowDrawing && L.Control?.Draw) {
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: false
      }
    });
    map.addControl(drawControl);
    map.on(L.Draw.Event.DRAWSTART, () => {
      isDrawing = true;
    });
    map.on(L.Draw.Event.DRAWSTOP, () => {
      isDrawing = false;
    });
  }

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  function updateFullMapLink(term) {
    if (fullMapLink) {
      fullMapLink.href = buildFullMapUrl(term);
    }
  }

  function renderMapFeatures(searchTerm = "") {
    const normalizedTerm = normalizeSearchValue(searchTerm);
    pointLayer.clearLayers();
    polygonLayer.clearLayers();

    const matchingPoints = allMapPoints.filter((point) => recordMatchesSearch(point, normalizedTerm));
    const matchingPolygons = allMapPolygons.filter((polygon) => recordMatchesSearch(polygon, normalizedTerm));
    const boundsItems = [];

    matchingPoints.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], { icon: bluePinIcon }).addTo(pointLayer);
      marker.bindPopup(buildCommunityPopupHtml(point, searchTerm), {
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
    if (normalizedTerm && totalMatches === 0) {
      setStatus("No matching map points found.");
    } else {
      const label = totalMatches === 1 ? "map result" : "map results";
      setStatus(normalizedTerm ? `${totalMatches} matching ${label} found.` : `${totalMatches} ${label} shown.`);
    }

    updateFullMapLink(searchTerm);
    fitMapToLayers(map, boundsItems, fallbackCenter);
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
      const snapshot = await getDocs(query(collection(db, "mapPoints")));
      allMapPoints = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!Number.isFinite(data?.lat) || !Number.isFinite(data?.lng)) return;
        allMapPoints.push({
          id: docSnap.id,
          ...data
        });
      });
    } catch (err) {
      console.error("Error loading map points:", err);
      setStatus("Could not load map points. Please try again later.");
    }
  }

  async function loadPolygons() {
    try {
      const snapshot = await getDocs(query(collection(db, "mapPolygons")));
      allMapPolygons = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!Array.isArray(data.points) || data.points.length < 3) return;
        allMapPolygons.push({
          id: docSnap.id,
          type: data.type || "schema:Place",
          ...data
        });
      });
    } catch (err) {
      console.error("Error loading polygons:", err);
    }
  }

  function enablePointUpload() {
    if (!allowUpload) return;

    map.on("click", async (event) => {
      if (isDrawing) return;

      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      const marker = L.marker([lat, lng]).addTo(map);
      let isSaved = false;

      const onPopupOpen = () => {
        const popupEl = marker.getPopup()?.getElement();
        if (!popupEl) return;

        const form = popupEl.querySelector(".point-form");
        const cancelButton = popupEl.querySelector('[data-action="cancel"]');
        const saveButton = popupEl.querySelector('[data-action="save"]');
        const titleInput = popupEl.querySelector('input[name="name"]');

        if (titleInput) titleInput.focus();

        cancelButton?.addEventListener("click", () => {
          map.removeLayer(marker);
          map.closePopup(marker.getPopup());
        }, { once: true });

        form?.addEventListener("submit", async (submitEvent) => {
          submitEvent.preventDefault();

          const formData = new FormData(form);
          const name = String(formData.get("name") || "").trim();
          const desc = String(formData.get("desc") || "").trim();
          const linkedArticleRaw = String(formData.get("linkedArticle") || "").trim();

          if (!name || !desc) {
            alert("Please provide both title and description.");
            return;
          }

          const linkedArticle = toSafeUrl(linkedArticleRaw);
          if (linkedArticleRaw && !linkedArticle) {
            alert("Please enter a valid http(s) link or leave it blank.");
            return;
          }

          if (saveButton) saveButton.disabled = true;

          try {
            const docRef = await addDoc(collection(db, "mapPoints"), {
              name,
              desc,
              lat,
              lng,
              type: "schema:Place",
              linkedArticle,
              createdAt: serverTimestamp(),
              jsonld: {
                "@context": "https://schema.org",
                "@type": "Place",
                "name": name,
                "description": desc,
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": lat,
                  "longitude": lng
                }
              }
            });

            isSaved = true;
            const savedPoint = {
              id: docRef.id,
              name,
              desc,
              lat,
              lng,
              type: "schema:Place",
              linkedArticle
            };
            allMapPoints.push(savedPoint);
            marker.bindPopup(buildCommunityPopupHtml(savedPoint, searchInput?.value || ""), {
              className: "community-map-popup",
              closeButton: true,
              autoClose: true
            }).openPopup();
          } catch (err) {
            if (saveButton) saveButton.disabled = false;
            console.error("Error adding point:", err);
            alert("Could not save point. Please try again.");
          }
        }, { once: true });
      };

      const onPopupClose = () => {
        if (!isSaved && map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
        marker.off("popupopen", onPopupOpen);
        marker.off("popupclose", onPopupClose);
      };

      marker.on("popupopen", onPopupOpen);
      marker.on("popupclose", onPopupClose);
      marker.bindPopup(buildPointFormHtml(), {
        closeButton: true,
        autoClose: true,
        closeOnClick: false
      }).openPopup();
    });
  }

  function enablePolygonDrawing() {
    if (!allowDrawing || !L.Draw) return;

    map.on(L.Draw.Event.CREATED, async (event) => {
      const { layer, layerType } = event;
      if (layerType !== "polygon") return;

      drawnItems.addLayer(layer);
      let isSaved = false;

      const onPopupOpen = () => {
        const popupEl = layer.getPopup()?.getElement();
        if (!popupEl) return;

        const form = popupEl.querySelector(".polygon-form");
        const cancelButton = popupEl.querySelector('[data-action="cancel"]');
        const saveButton = popupEl.querySelector('[data-action="save"]');
        const titleInput = popupEl.querySelector('input[name="title"]');

        if (titleInput) titleInput.focus();

        cancelButton?.addEventListener("click", () => {
          drawnItems.removeLayer(layer);
          map.closePopup(layer.getPopup());
        }, { once: true });

        form?.addEventListener("submit", async (submitEvent) => {
          submitEvent.preventDefault();
          const formData = new FormData(form);
          const title = String(formData.get("title") || "").trim();
          const desc = String(formData.get("desc") || "").trim();
          const latlngs = layer.getLatLngs()[0].map(({ lat, lng }) => ({ lat, lng }));

          if (saveButton) saveButton.disabled = true;

          try {
            const docRef = await addDoc(collection(db, "mapPolygons"), {
              title,
              desc,
              points: latlngs,
              type: "schema:Place",
              createdAt: serverTimestamp(),
              jsonld: {
                "@context": "https://schema.org",
                "@type": "Place",
                name: title || "Polygon",
                description: desc || "",
                geo: {
                  "@type": "GeoShape",
                  polygon: latlngs.map((point) => `${point.lat},${point.lng}`).join(" ")
                }
              }
            });

            isSaved = true;
            const savedPolygon = {
              id: docRef.id,
              title,
              desc,
              points: latlngs,
              type: "schema:Place"
            };
            allMapPolygons.push(savedPolygon);
            layer.bindPopup(buildCommunityPopupHtml(savedPolygon, searchInput?.value || ""), {
              className: "community-map-popup",
              closeButton: true,
              autoClose: true
            }).openPopup();
          } catch (err) {
            if (saveButton) saveButton.disabled = false;
            console.error("Error adding polygon:", err);
            alert("Could not save polygon. Please try again.");
          }
        }, { once: true });
      };

      const onPopupClose = () => {
        if (!isSaved && drawnItems.hasLayer(layer)) {
          drawnItems.removeLayer(layer);
        }
        layer.off("popupopen", onPopupOpen);
        layer.off("popupclose", onPopupClose);
      };

      layer.on("popupopen", onPopupOpen);
      layer.on("popupclose", onPopupClose);
      layer.bindPopup(buildPolygonFormHtml(), {
        closeButton: true,
        autoClose: true,
        closeOnClick: false
      }).openPopup();
    });
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(searchInput?.value || "");
  });

  clearButton?.addEventListener("click", () => {
    runSearch("");
    searchInput?.focus();
  });

  map.on("popupopen", (event) => {
    const popupEl = event.popup.getElement();
    const zoomButton = popupEl?.querySelector('[data-action="zoom-point"]');
    zoomButton?.addEventListener("click", () => {
      map.setView(event.popup.getLatLng(), Math.max(map.getZoom() + 2, 16));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      map.closePopup();
    }
  });

  enablePointUpload();
  enablePolygonDrawing();

  Promise.all([loadMarkers(), loadPolygons()]).then(() => {
    runSearch(searchInput?.value || initialSearchTerm);
  });

  return map;
}

async function exportJSONLD() {
  if (!document.getElementById("map")) return;

  try {
    const collectionsToExport = ["mapPoints", "mapPolygons"];
    const all = [];

    for (const name of collectionsToExport) {
      const snapshot = await getDocs(collection(db, name));
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.jsonld) all.push(data.jsonld);
      });
    }

    let el = document.getElementById("map-jsonld");
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "map-jsonld";
      document.head.appendChild(el);
    }

    el.textContent = JSON.stringify(all, null, 2);
  } catch (err) {
    console.error("Error exporting map JSON-LD:", err);
  }
}

initCommunityMap({
  containerId: "map",
  mode: "full",
  searchFormId: "mapSearchForm",
  searchInputId: "mapSearchInput",
  clearButtonId: "mapSearchClear",
  statusId: "mapSearchStatus",
  allowUpload: true,
  allowDrawing: true
});

initCommunityMap({
  containerId: "homeMapPreview",
  mode: "preview",
  searchFormId: "homeMapSearchForm",
  searchInputId: "homeMapSearchInput",
  statusId: "homeMapSearchStatus",
  fullMapLinkId: "homeMapFullLink",
  allowUpload: false,
  allowDrawing: false
});

exportJSONLD();
