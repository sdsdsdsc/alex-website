// === Firebase imports ===
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Firebase config (reuse your existing settings) ===
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

// === Collections we export ===
const COLLECTIONS = ["posts", "news", "history", "mapPoints", "mapPolygons", "communityPlaces"];

function cleanText(value) {
  return String(value || "").trim();
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

function hasCoordinates(data) {
  return Number.isFinite(Number(data?.lat)) && Number.isFinite(Number(data?.lng));
}

function buildCommunityPlaceJsonLd(data) {
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: cleanText(data.title) || "Community place"
  };

  const description = cleanText(data.description);
  const category = cleanText(data.category);
  const location = cleanText(data.location);
  const imageUrl = toSafeUrl(data.imageUrl);
  const source = cleanText(data.source);

  if (description) jsonld.description = description;
  if (category) jsonld.additionalType = category;
  if (location) jsonld.address = location;
  if (imageUrl) jsonld.image = imageUrl;
  if (source) jsonld.sourceOrganization = source;
  if (hasCoordinates(data)) {
    jsonld.geo = {
      "@type": "GeoCoordinates",
      latitude: Number(data.lat),
      longitude: Number(data.lng)
    };
  }

  return jsonld;
}

// === Export function ===
async function exportHeritageJSON() {
  const status = document.getElementById("status");
  const button = document.getElementById("downloadBtn");
  status.textContent = "⏳ Gathering data…";
  button.disabled = true;

  try {
    const output = [];

    for (const col of COLLECTIONS) {
      const snapshot = await getDocs(collection(db, col));
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.jsonld) {
          output.push(data.jsonld);
        } else if (col === "communityPlaces") {
          output.push(buildCommunityPlaceJsonLd(data));
        }
      });
    }

    status.textContent = `✅ ${output.length} JSON-LD records collected`;

    const blob = new Blob([JSON.stringify(output, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heritage.json";
    a.click();
    URL.revokeObjectURL(url);

    status.textContent += " — Downloaded!";
  } catch (err) {
    console.error("Export failed:", err);
    status.textContent = "❌ Export failed. Please try again.";
  } finally {
    button.disabled = false;
  }
}

// === Connect button ===
document.getElementById("downloadBtn").addEventListener("click", exportHeritageJSON);
