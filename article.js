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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

const articleTitle = document.getElementById("articleTitle");
const articleImage = document.getElementById("articleImage");
const articleContent = document.getElementById("articleContent");
const articleDate = document.getElementById("articleDate");

/* === Firebase Articles (news/history) === */
async function loadFirebaseArticle() {
  const refDoc = doc(db, type, id);
  const snap = await getDoc(refDoc);

  if (!snap.exists()) {
    articleContent.textContent = "Article not found.";
    return;
  }

  const data = snap.data();
  articleTitle.textContent = data.title || "Untitled";
  articleImage.src = data.imageUrl || "";
  articleContent.innerHTML = `
    <p>${data.content || ""}</p>
    ${
      data.tags
        ? `<div class="tags">🏷️ <strong>Tags:</strong> ${data.tags.join(", ")}</div>`
        : ""
    }
  `;
  if (data.createdAt?.seconds) {
    articleDate.textContent = new Date(data.createdAt.seconds * 1000).toDateString();
  }
}

/* === Drupal CMS Articles === */
async function loadDrupalArticle(id) {
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
    const file = included.find((f) => f.id === rel.id && f.type === "file--file");
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
}

/* === Run the correct loader === */
if (type === "drupal") loadDrupalArticle(id);
else loadFirebaseArticle();
