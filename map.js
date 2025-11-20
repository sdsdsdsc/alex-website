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

// Default base layer
osm.addTo(map);

// Layer switcher (top-right control)
const baseMaps = {
  "OpenStreetMap": osm,
  "Gaode (AMap)": gaode
};
L.control.layers(baseMaps).addTo(map);

// === Add new marker on click ===
map.on('click', async (e) => {
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
