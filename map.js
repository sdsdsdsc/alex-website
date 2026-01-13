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
// Polygon storage
const polygonsRef = collection(db, "polygons");

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

// === Polygon layer group ===
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
drawnItems.bringToFront();  // <-- FIX 1: ensure polygon handles sit above markers
// Only create point markers when this mode is active
let addPointMode = false;


function setMarkersPointerEvents(disabled) {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      if (layer._originalInteractive === undefined) {
        layer._originalInteractive = layer.options.interactive !== false;
      }
      layer.options.interactive = !disabled;

      const el = layer.getElement && layer.getElement();
      if (el) el.style.pointerEvents = disabled ? "none" : "auto";
    }
  });
}

// Layer switcher (top-right control)
const baseMaps = {
  "OpenStreetMap": osm,
  "Gaode (AMap)": gaode,
  "Esri World Street": esri
};
L.control.layers(baseMaps).addTo(map);

// === Enable Draw Controls ===
const drawControl = new L.Control.Draw({
  draw: {
    polygon: true,
    marker: false,
    circle: false,
    rectangle: false,
    polyline: false,
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);

// --- Add Point Mode Control (FIXED) ---
const AddPointControl = L.Control.extend({
  options: { position: "topleft" },

  onAdd: function () {
    const btn = L.DomUtil.create("button", "leaflet-bar");
    btn.type = "button";
    btn.title = "Toggle add-point mode";
    btn.innerHTML = "📍";

    btn.style.width = "32px";
    btn.style.height = "32px";
    btn.style.cursor = "pointer";
    btn.style.background = "white";

    // Prevent map drag/zoom when clicking the button
    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.disableScrollPropagation(btn);

    btn.onclick = () => {
      addPointMode = !addPointMode;
      btn.style.background = addPointMode ? "#66cc66" : "white";
    };

    return btn; // ✅ MUST be inside onAdd()
  }
});

map.addControl(new AddPointControl({ position: "topleft" }));

// Turn off add-point mode automatically when drawing starts
map.on(L.Draw.Event.DRAWSTART, () => {
  addPointMode = false;
  setMarkersPointerEvents(true);
});


// If drawing is stopped/cancelled, restore marker interactivity
map.on(L.Draw.Event.DRAWSTOP, () => {
  setMarkersPointerEvents(false);
});


// === Save polygon to Firebase (UI-first + Firestore-safe) ===
map.on(L.Draw.Event.CREATED, (event) => {
  const layer = event.layer;

  // Random test values (real formula later)
  const score_use = 18;
  const score_activities = 12;
  const score_infra = 20;
  const score_care = 14;
  const CES = score_use + score_activities + score_infra + score_care;

  // ✅ Style + add to map immediately (never "disappears")
  layer.setStyle({
    color: getCESColor(CES),
    weight: 2,
    fillOpacity: 0.45
  });

  layer.bindPopup(`
    <b>Community Engagement Score:</b> ${CES}/100<br><br>
    U (Use): ${score_use}<br>
    A (Activities): ${score_activities}<br>
    I (Infrastructure): ${score_infra}<br>
    C (Care): ${score_care}<br><br>
    <small>Saving…</small>
  `);

  drawnItems.addLayer(layer);

  // ✅ Drawing finished → restore marker interactions
  setMarkersPointerEvents(false);

  // Firestore cannot store GeoJSON Polygon coordinates (nested arrays) directly
  const geojsonStr = JSON.stringify(layer.toGeoJSON());

  addDoc(polygonsRef, {
    name: "Test Community Block",
    geojsonStr,
    score_use,
    score_activities,
    score_infra,
    score_care,
    CES,
    createdAt: serverTimestamp()
  })
    .then(() => {
      layer.setPopupContent(`
        <b>Community Engagement Score:</b> ${CES}/100<br><br>
        U (Use): ${score_use}<br>
        A (Activities): ${score_activities}<br>
        I (Infrastructure): ${score_infra}<br>
        C (Care): ${score_care}<br><br>
        <small>✅ Saved</small>
      `);
    })
    .catch((err) => {
      console.error("❌ Polygon save failed:", err);
      layer.setPopupContent(`
        <b>Community Engagement Score:</b> ${CES}/100<br><br>
        U (Use): ${score_use}<br>
        A (Activities): ${score_activities}<br>
        I (Infrastructure): ${score_infra}<br>
        C (Care): ${score_care}<br><br>
        <small style="color:#c00;">❌ Save failed</small>
      `);
    });
});


// === Add new marker on click ===
map.on('click', async (e) => {
  if (!addPointMode) return; // only create points when addPointMode is active
  const name = prompt("Enter a title for this location:");
  const desc = prompt("Enter a short description:");
  if (!name || !desc) return;

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  // Add to map immediately
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`<b>${name}</b><br>${desc}`).openPopup();

  // Save to Firebase (with semantic fields)
try {
  await addDoc(collection(db, "mapPoints"), {
    name,
    desc,
    lat,
    lng,
    type: "schema:Place",
    linkedArticle: "https://alexsphotoboard.web.app/article.html?id=abc", // optional
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
  console.log("✅ Semantic point added:", name);
} catch (err) {
  console.error("❌ Error adding point:", err);
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

    let popupContent = `
      <b>${data.name}</b><br>${data.desc}<br>
      <small><i>Type:</i> ${data.type || "schema:Place"}</small>
    `;

    // Only show link if one exists
    if (data.linkedArticle && data.linkedArticle.trim() !== "") {
      popupContent += `<br><a href="${data.linkedArticle}" target="_blank" style="color:#007bff;">View Linked Article</a>`;
    }

    marker.bindPopup(popupContent);
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


// === CES color scale ===
function getCESColor(score) {
  return score > 75 ? "#006d2c" :      // very high (dark green)
         score > 50 ? "#31a354" :      // high (green)
         score > 25 ? "#fed976" :      // medium (yellow)
                       "#fc4e2a";      // low (red)
}

// === Load polygons from Firebase ===
async function loadPolygons() {
  const snapshot = await getDocs(polygonsRef);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const geojson = data.geojsonStr ? JSON.parse(data.geojsonStr) : data.geojson;

    const layer = L.geoJSON(geojson, {
      style: {
        color: getCESColor(data.CES),
        weight: 2,
        fillOpacity: 0.45
      }
    });

    layer.bindPopup(`
      <b>${data.name}</b><br>
      <b>Community Engagement Score:</b> ${data.CES}/100<br><br>
      U (Use): ${data.score_use}<br>
      A (Activities): ${data.score_activities}<br>
      I (Infrastructure): ${data.score_infra}<br>
      C (Care): ${data.score_care}
    `);

    layer.addTo(map);
    drawnItems.addLayer(layer);
  });
}

loadPolygons();
loadMarkers();

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


