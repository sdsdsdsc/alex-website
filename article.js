// === Firebase imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const type = params.get("type"); // e.g. "news", "posts", "history", or "drupal"

// === Page elements ===
const articleTitle = document.getElementById("articleTitle");
const articleImage = document.getElementById("articleImage");
const articleDate = document.getElementById("articleDate");
const articleContent = document.getElementById("articleContent");

// === Loader switch ===
if (type === "drupal") {
  loadDrupalArticle(id);
} else {
  loadFirebaseArticle();
}

// === Firebase loader ===
async function loadFirebaseArticle() {
  try {
    const refDoc = doc(db, type, id);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) {
      articleContent.textContent = "Article not found.";
      return;
    }

    const data = snap.data();

    // === 1️⃣ Set basic info ===
    articleTitle.textContent = data.title || data.message || "Untitled";
    articleDate.textContent = data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toDateString()
      : "";
    articleImage.src = data.imageUrl || "";

    // === 2️⃣ Display content ===
    if (data.htmlUrl) {
      // Rich-format article from upload-article.html
      const res = await fetch(data.htmlUrl);
      const html = await res.text();
      articleContent.innerHTML = html;
    } else {
      // Normal Firebase message post
      articleContent.innerHTML = `<p>${data.content || data.message || ""}</p>`;
    }

    // === 3️⃣ Inject JSON-LD ===
    const createdAt = data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toISOString()
      : new Date().toISOString();

    const jsonld = data.jsonld || {
      "@context": {
        "schema": "https://schema.org/",
        "dc": "http://purl.org/dc/elements/1.1/"
      },
      "@type": data.htmlUrl ? "schema:Article" : "schema:Photograph",
      "schema:name": data.title || data.message || "Untitled",
      "schema:creator": {
        "@type": "schema:Person",
        "schema:name": data.author || data.name || "Anonymous"
      },
      "schema:contentUrl": data.htmlUrl || data.imageUrl || "",
      "schema:source": "Alex's Photo Board (Firebase)",
      "dc:date": createdAt
    };

    const ldScript = document.createElement("script");
    ldScript.type = "application/ld+json";
    ldScript.textContent = JSON.stringify(jsonld, null, 2);
    document.head.appendChild(ldScript);
  } catch (err) {
    console.error("Error loading Firebase article:", err);
    articleContent.textContent = "Failed to load article.";
  }
}

// === Drupal loader ===
async function loadDrupalArticle(id) {
  try {
    const res = await fetch(
      `https://dev-alex-photo-cms.pantheonsite.io/jsonapi/node/article/${id}?include=field_image,uid,field_tags`
    );
    const json = await res.json();

    const article = json.data;
    const title = article.attributes.title;
    const body = article.attributes.body?.processed || "";
    const created = new Date(article.attributes.created).toDateString();

    // === Author ===
    let author = "Anonymous";
    const included = json.included || [];
    const authorRel = article.relationships.uid?.data;
    if (authorRel) {
      const authorObj = included.find(
        (item) => item.id === authorRel.id && item.type === "user--user"
      );
      if (authorObj) author = authorObj.attributes.name;
    }

    // === Tags ===
    const tags = [];
    const tagRels = article.relationships.field_tags?.data || [];
    tagRels.forEach((tagRel) => {
      const tagObj = included.find(
        (item) => item.id === tagRel.id && item.type === "taxonomy_term--tags"
      );
      if (tagObj) tags.push(tagObj.attributes.name);
    });

    // === Image ===
    let imageUrl = "";
    const rel = article.relationships.field_image?.data;
    if (rel) {
      const file = included.find(
        (f) => f.id === rel.id && f.type === "file--file"
      );
      if (file) imageUrl = file.attributes.uri.url;
    }
    if (imageUrl.startsWith("/")) {
      imageUrl = `https://dev-alex-photo-cms.pantheonsite.io${imageUrl}`;
    }

    // === Render ===
    articleTitle.textContent = title;
    articleImage.src = imageUrl;
    articleDate.textContent = `${created} | by ${author}`;
    articleContent.innerHTML = `
      <div class="article-body">${body}</div>
      ${
        tags.length
          ? `<div class="tags">🏷️ <strong>Tags:</strong> ${tags.join(", ")}</div>`
          : ""
      }
    `;

    // === Inject JSON-LD for Drupal ===
    const jsonld = {
      "@context": {
        "schema": "https://schema.org/",
        "dc": "http://purl.org/dc/elements/1.1/"
      },
      "@type": "schema:Article",
      "schema:headline": title,
      "schema:author": { "@type": "schema:Person", "schema:name": author },
      "schema:datePublished": created,
      "schema:about": tags,
      "schema:image": imageUrl,
      "schema:source": "Alex's Photo Board (Drupal CMS)"
    };

    const ldScript = document.createElement("script");
    ldScript.type = "application/ld+json";
    ldScript.textContent = JSON.stringify(jsonld, null, 2);
    document.head.appendChild(ldScript);
  } catch (err) {
    console.error("Error loading Drupal article:", err);
    articleContent.textContent = "Failed to load Drupal article.";
  }
}
