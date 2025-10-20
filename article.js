// === Firebase Imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore, doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// === Read URL Params ===
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

// === DOM Elements ===
const articleTitle = document.getElementById("articleTitle");
const articleImage = document.getElementById("articleImage");
const articleContent = document.getElementById("articleContent");
const articleDate = document.getElementById("articleDate");

// === Load Article ===
async function loadArticle() {
  if (!id || !type) {
    articleContent.textContent = "Invalid article link.";
    return;
  }

  try {
    const refDoc = doc(db, type, id);
    const snap = await getDoc(refDoc);

    if (!snap.exists()) {
      articleContent.textContent = "Article not found.";
      return;
    }

    const data = snap.data();

    // --- Fill Page ---
    document.title = data.title + " | Alex's Photo Board";
    articleTitle.textContent = data.title;
    articleImage.src = data.imageUrl;
    articleContent.textContent = data.content;

    if (data.createdAt?.seconds) {
      const date = new Date(data.createdAt.seconds * 1000);
      articleDate.textContent = date.toDateString();
    }

  } catch (err) {
    console.error("Error loading article:", err);
    articleContent.textContent = "Error loading this article.";
  }
}

loadArticle();
