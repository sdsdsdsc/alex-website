// === Firebase imports ===
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
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

function toSafeUrl(value, allowRelative = false) {
  if (!value) return "";
  try {
    const parsed = new URL(value, window.location.href);
    const allowed = parsed.protocol === "http:" || parsed.protocol === "https:";
    if (!allowed) return "";
    if (!allowRelative && parsed.origin === window.location.origin && !value.startsWith("http")) {
      return "";
    }
    return parsed.href;
  } catch (err) {
    console.warn("Invalid URL skipped:", value);
    return "";
  }
}

function sanitizeRichHtml(rawHtml) {
  const dirty = String(rawHtml || "");
  const domPurify = globalThis.DOMPurify;

  let clean = dirty;
  if (domPurify && typeof domPurify.sanitize === "function") {
    clean = domPurify.sanitize(dirty, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["script", "iframe", "object", "embed", "link", "meta"],
      FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"]
    });
  }

  const template = document.createElement("template");
  template.innerHTML = clean;
  const blockedTags = ["script", "iframe", "object", "embed", "link", "meta"];
  blockedTags.forEach((tag) => {
    template.content.querySelectorAll(tag).forEach((el) => el.remove());
  });

  template.content.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value;
      if (attrName.startsWith("on")) {
        el.removeAttribute(attr.name);
        return;
      }
      if (attrName === "href") {
        const safeHref = toSafeUrl(attrValue, true);
        if (!safeHref) {
          el.removeAttribute(attr.name);
        } else {
          el.setAttribute("href", safeHref);
          if (el.tagName.toLowerCase() === "a") {
            el.setAttribute("rel", "noopener noreferrer");
          }
        }
      }
      if (attrName === "src") {
        const safeSrc = toSafeUrl(attrValue, true);
        if (!safeSrc) {
          el.removeAttribute(attr.name);
        } else {
          el.setAttribute("src", safeSrc);
        }
      }
    });
  });

  return template.innerHTML;
}

function setArticleImage(url) {
  const safeUrl = toSafeUrl(url, true);
  if (!safeUrl) {
    articleImage.removeAttribute("src");
    articleImage.style.display = "none";
    return;
  }
  articleImage.src = safeUrl;
  articleImage.style.display = "block";
}

// === Load article ===
async function loadArticle() {
  try {
    if (!id || !type) {
      articleContent.textContent = "Missing article parameters.";
      return;
    }

    // === 🏛 If it's a Drupal CMS article ===
    if (type === "drupal") {
      const res = await fetch(`https://dev-alex-photo-cms.pantheonsite.io/jsonapi/node/article/${encodeURIComponent(id)}?include=field_image`);
      if (!res.ok) throw new Error(`Drupal fetch failed: ${res.status}`);
      const json = await res.json();
      const data = json.data;
      const included = json.included || [];

      if (!data?.attributes) {
        articleContent.textContent = "Article not found.";
        return;
      }

      const title = data.attributes.title || "Untitled";
      const created = new Date(data.attributes.created).toDateString();
      const body = data.attributes.body?.value || "No content available.";

      // === Handle image ===
      let imageUrl = "";
      const rel = data.relationships.field_image?.data;
      if (rel) {
        const file = included.find(f => f.id === rel.id && f.type === "file--file");
        if (file) imageUrl = file.attributes.uri.url;
        if (imageUrl.startsWith("/")) {
          imageUrl = `https://dev-alex-photo-cms.pantheonsite.io${imageUrl}`;
        }
      }

      // === Render content ===
      articleTitle.textContent = title;
      articleDate.textContent = created;
      setArticleImage(imageUrl);
      articleContent.innerHTML = sanitizeRichHtml(body);

      return;
    }

    const allowedTypes = new Set(["news", "history"]);
    if (!allowedTypes.has(type)) {
      articleContent.textContent = "Unsupported article type.";
      return;
    }

    // === 🧱 Otherwise load from Firestore ===
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
    setArticleImage(data.imageUrl || "");

    // === Render HTML directly from Firestore ===
    if (data.htmlContent) {
      articleContent.innerHTML = sanitizeRichHtml(data.htmlContent);
    } else if (data.content) {
      articleContent.innerHTML = sanitizeRichHtml(data.content);
    } else {
      articleContent.textContent = "";
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
