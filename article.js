// === Firebase imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Firebase config ===
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

// === Get params from URL ===
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type"); // e.g. "news" or "history"

// === Page elements ===
const articleTitle = document.getElementById("articleTitle");
const articleImage = document.getElementById("articleImage");
const articleDate = document.getElementById("articleDate");
const articleContent = document.getElementById("articleContent");

// === Load article ===
async function loadArticle() {
  try {
    const refDoc = doc(db, type, id);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) {
      articleContent.textContent = "Article not found.";
      return;
    }

    const data = snap.data();

    // === Set article info ===
    articleTitle.textContent = data.title || "Untitled";
    articleDate.textContent = data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toDateString()
      : "";
    articleImage.src = data.imageUrl || "";

    // === Render HTML directly from Firestore ===
    if (data.htmlContent) {
      articleContent.innerHTML = data.htmlContent;
    } else {
      articleContent.innerHTML = `<p>${data.content || ""}</p>`;
    }

    // === Inject JSON-LD ===
    const jsonld = data.jsonld || {
      "@context": {
        "schema": "https://schema.org/",
        "dc": "http://purl.org/dc/elements/1.1/"
      },
      "@type": "schema:Article",
      "schema:name": data.title || "Untitled",
      "schema:creator": {
        "@type": "schema:Person",
        "schema:name": data.author || "Anonymous"
      },
      "schema:contentUrl": window.location.href,
      "schema:image": data.imageUrl || "",
      "schema:source": "Alex's Photo Board (Firestore)",
      "dc:date": new Date().toISOString()
    };

    const ldScript = document.createElement("script");
    ldScript.type = "application/ld+json";
    ldScript.textContent = JSON.stringify(jsonld, null, 2);
    document.head.appendChild(ldScript);
  } catch (err) {
    console.error("Error loading article:", err);
    articleContent.textContent = "Failed to load article.";
  }
}

loadArticle();
