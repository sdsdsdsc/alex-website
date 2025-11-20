// === Firebase imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Collections we export ===
const COLLECTIONS = ["posts", "news", "history", "mapPoints"];

// === Export function ===
async function exportHeritageJSON() {
  const status = document.getElementById("status");
  status.textContent = "⏳ Gathering data…";

  const output = [];

  for (const col of COLLECTIONS) {
    const snapshot = await getDocs(collection(db, col));
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.jsonld) {
        output.push(data.jsonld);
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

  status.textContent += " — Downloaded!";
}

// === Connect button ===
document.getElementById("downloadBtn").addEventListener("click", exportHeritageJSON);
