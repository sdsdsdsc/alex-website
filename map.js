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

// Base map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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

  // Save to Firebase
  try {
    await addDoc(collection(db, "mapPoints"), {
      name,
      desc,
      lat,
      lng,
      createdAt: serverTimestamp()
    });
    console.log("✅ Point added:", name);
  } catch (err) {
    console.error("❌ Error adding point:", err);
  }
});

// === Load existing markers ===
async function loadMarkers() {
  const q = query(collection(db, "mapPoints"));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const marker = L.marker([data.lat, data.lng]).addTo(map);
    marker.bindPopup(`<b>${data.name}</b><br>${data.desc}`);
  });
}

loadMarkers();
