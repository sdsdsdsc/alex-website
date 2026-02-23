// === Import Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Firebase Config (use yours) ===
const firebaseConfig = {
  apiKey: "AIzaSyDr8hSsoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Initialize Map ===
const map = L.map('map').setView([51.505, -0.09], 13);

// Base maps

// OpenStreetMap
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Gaode / AMap
const gaode = L.tileLayer(
  'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
  {
    maxZoom: 20,
    attribution: '© 高德地图'
  }
);

// Esri World Street Map
const esri = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution: "Tiles © Esri — Source: Esri, HERE, Garmin, OpenStreetMap contributors"
  }
);

// Default base layer
osm.addTo(map);

// Layer switcher (top-right control)
const baseMaps = {
  "OpenStreetMap": osm,
  "Gaode (AMap)": gaode,
  "Esri World Street": esri
};
L.control.layers(baseMaps).addTo(map);

// === Drawing Layer (Leaflet.Draw) ===
const drawnItems = new L.FeatureGroup();
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

let isDrawing = false;
map.on(L.Draw.Event.DRAWSTART, () => {
  isDrawing = true;
});
map.on(L.Draw.Event.DRAWSTOP, () => {
  isDrawing = false;
});

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

function buildPointPopupHtml({ name, desc, type, linkedArticle }) {
  const safeName = escapeHTML(name || "Untitled");
  const safeDesc = escapeHTML(desc || "");
  const safeType = escapeHTML(type || "schema:Place");
  const safeLink = toSafeUrl(linkedArticle || "");

  let html = `<b>${safeName}</b><br>${safeDesc}<br><small><i>Type:</i> ${safeType}</small>`;
  if (safeLink) {
    html += `<br><a href="${safeLink}" target="_blank" rel="noopener noreferrer" style="color:#007bff;">View Linked Article</a>`;
  }
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

// === Add new marker on click ===
map.on('click', async (e) => {
  if (isDrawing) return;

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  const marker = L.marker([lat, lng]).addTo(map);
  let isSaved = false;

  const onPopupOpen = () => {
    const popupEl = marker.getPopup()?.getElement();
    if (!popupEl) return;

    const form = popupEl.querySelector(".point-form");
    const cancelBtn = popupEl.querySelector('[data-action="cancel"]');
    const saveBtn = popupEl.querySelector('[data-action="save"]');
    const titleInput = popupEl.querySelector('input[name="name"]');

    if (titleInput) titleInput.focus();

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        map.removeLayer(marker);
        map.closePopup(marker.getPopup());
      }, { once: true });
    }

    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

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

      if (saveBtn) saveBtn.disabled = true;

      try {
        await addDoc(collection(db, "mapPoints"), {
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
        marker.bindPopup(buildPointPopupHtml({
          name,
          desc,
          type: "schema:Place",
          linkedArticle
        })).openPopup();
        console.log("✅ Semantic point added:", name);
      } catch (err) {
        if (saveBtn) saveBtn.disabled = false;
        console.error("❌ Error adding point:", err);
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

// === Save polygon drawn by user ===
map.on(L.Draw.Event.CREATED, async (event) => {
  const { layer, layerType } = event;
  if (layerType !== "polygon") return;

  drawnItems.addLayer(layer);

  const title = prompt("Enter a title for this polygon (optional):") || "";
  const desc = prompt("Enter a description for this polygon (optional):") || "";
  const latlngs = layer.getLatLngs()[0].map(({ lat, lng }) => ({ lat, lng }));

  if (title || desc) {
    layer.bindPopup(`<b>${title || "Polygon"}</b><br>${desc}`).openPopup();
  }

  try {
    await addDoc(collection(db, "mapPolygons"), {
      title,
      desc,
      points: latlngs,
      type: "schema:Place",
      createdAt: serverTimestamp()
    });
    console.log("✅ Polygon added");
  } catch (err) {
    console.error("❌ Error adding polygon:", err);
  }
});

// === Load existing markers ===
async function loadMarkers() {
  const q = query(collection(db, "mapPoints"));
  const snapshot = await getDocs(q);

  const markers = []; // 🌍 store all marker coordinates

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const marker = L.marker([data.lat, data.lng]).addTo(map);
    marker.bindPopup(buildPointPopupHtml({
      name: data.name,
      desc: data.desc,
      type: data.type,
      linkedArticle: data.linkedArticle
    }));
    markers.push([data.lat, data.lng]); // 🌍 collect coordinates
  });

  // 🌍 Automatically adjust the map to fit all points
  if (markers.length > 0) {
    const bounds = L.latLngBounds(markers);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Optional: if there’s only one point, zoom in closer
    if (markers.length === 1) {
      map.setZoom(14);
      map.panTo(bounds.getCenter());
    }
  }
}

loadMarkers();

// === Load existing polygons ===
async function loadPolygons() {
  const snapshot = await getDocs(query(collection(db, "mapPolygons")));

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (!Array.isArray(data.points) || data.points.length < 3) return;

    const polygonCoords = data.points
      .filter((p) => Number.isFinite(p?.lat) && Number.isFinite(p?.lng))
      .map((p) => [p.lat, p.lng]);

    if (polygonCoords.length < 3) return;

    const polygon = L.polygon(polygonCoords, {
      color: "#1f6feb",
      fillOpacity: 0.25
    });

    if (data.title || data.desc) {
      polygon.bindPopup(`<b>${data.title || "Polygon"}</b><br>${data.desc || ""}`);
    }

    drawnItems.addLayer(polygon);
  });
}

loadPolygons();

// === Export all mapPoints as JSON-LD in <head> ===
async function exportJSONLD() {
  const snapshot = await getDocs(collection(db, "mapPoints"));
  const all = [];
  snapshot.forEach(doc => {
    const d = doc.data();
    if (d.jsonld) all.push(d.jsonld);
  });

  // If the <script id="map-jsonld"> doesn't exist yet, create it
  let el = document.getElementById("map-jsonld");
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "map-jsonld";
    document.head.appendChild(el);
  }

  el.textContent = JSON.stringify(all, null, 2);
}
exportJSONLD();
