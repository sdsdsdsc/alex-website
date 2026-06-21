// === Firebase imports ===
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  buildGraphNode,
  buildPublicHeritageJsonLd
} from "./heritage-engine/export.js?v=2026-06-20-13c";

// === Firebase config (reuse your existing settings) ===
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

// === Collections we export ===
const COLLECTIONS = ["news", "history", "communityPlaces"];

// === Export function ===
async function exportHeritageJSON() {
  const status = document.getElementById("status");
  const button = document.getElementById("downloadBtn");
  status.textContent = "⏳ Gathering data…";
  button.disabled = true;

  try {
    const graphNodes = [];

    for (const col of COLLECTIONS) {
      const snapshot = await getDocs(collection(db, col));
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const node = buildGraphNode(docSnap.id, col, data);
        if (node) graphNodes.push(node);
      });
    }

    const output = buildPublicHeritageJsonLd(graphNodes);
    status.textContent = `✅ ${graphNodes.length} JSON-LD records collected`;

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
