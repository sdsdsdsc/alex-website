// === Firebase Imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// === Load Firebase Article ===
async function loadFirebaseArticle() {
  try {
    const refDoc = doc(db, type, id);
    const snap = await getDoc(refDoc);

    if (!snap.exists()) {
      articleContent.textContent = "Article not found.";
      return;
    }

    const data = snap.data();
    document.title = `${data.title} | Alex's Photo Board`;
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

// === Load Drupal Article ===
async function loadDrupalArticle(id) {
  try {
    const res = await fetch(`https://dev-alex-photo-cms.pantheonsite.io/jsonapi/node/article/${id}?include=field_image`);
    if (!res.ok) throw new Error("Failed to fetch article data");
    const json = await res.json();
    const article = json.data;

    const title = article.attributes.title;
    const bodyHtml = article.attributes.body?.processed || "";
    const created = new Date(article.attributes.created).toDateString();

    let imageUrl = "";
    const included = json.included || [];
    const rel = article.relationships.field_image?.data;
    if (rel) {
      const file = included.find(f => f.id === rel.id && f.type === "file--file");
      if (file) imageUrl = file.attributes.uri.url;
    }
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `https://dev-alex-photo-cms.pantheonsite.io${imageUrl}`;
    }

    document.title = `${title} | Alex's Photo Board`;
    articleTitle.textContent = title;
    articleImage.src = imageUrl;
    articleDate.textContent = created;
    articleContent.innerHTML = bodyHtml;
  } catch (err) {
    console.error("Error loading Drupal article:", err);
    articleContent.textContent = "Failed to load this article.";
  }
}

// === Router ===
if (type === "drupal") {
  loadDrupalArticle(id);
} else {
  loadFirebaseArticle();
}
