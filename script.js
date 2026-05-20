// === Firebase imports ===
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
  increment,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// === Firebase setup ===
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
const storage = getStorage(app);

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

function openInNewTab(url) {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) win.opener = null;
}

function formatDate(createdAt) {
  return createdAt?.seconds
    ? new Date(createdAt.seconds * 1000).toDateString()
    : "";
}

// === Dropdown Menus ===
const communityBtn = document.getElementById("communityBtn");
const communityMenu = document.getElementById("communityMenu");
const newsBtn = document.getElementById("newsBtn");
const newsMenu = document.getElementById("newsMenu");

communityBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  communityMenu?.classList.toggle("show");
  newsMenu?.classList.remove("show");
});

newsBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  newsMenu?.classList.toggle("show");
  communityMenu?.classList.remove("show");
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu")) {
    communityMenu?.classList.remove("show");
    newsMenu?.classList.remove("show");
  }
});

// === Homepage image caption panel ===
const imageCaption = document.querySelector(".image-caption");
const imageCaptionToggle = imageCaption?.querySelector(".image-caption__toggle");
const imageCaptionContent = imageCaption?.querySelector(".image-caption__content");

imageCaptionToggle?.addEventListener("click", () => {
  const isOpen = imageCaption.classList.toggle("is-open");
  imageCaptionToggle.setAttribute("aria-expanded", String(isOpen));
  imageCaptionContent?.setAttribute("aria-hidden", String(!isOpen));
});

// === Homepage map search ===
const homeMapSearchForm = document.getElementById("homeMapSearchForm");
const homeMapSearchInput = document.getElementById("homeMapSearchInput");

homeMapSearchForm?.addEventListener("submit", (event) => {
  const searchTerm = homeMapSearchInput?.value.trim() || "";
  if (!searchTerm) {
    event.preventDefault();
    window.location.href = "map.html";
  }
});

// === Connecting Communities modal ===
const communityCards = document.querySelectorAll(".community-connect__card");
const communityModal = document.querySelector(".community-modal");
const communityModalImage = communityModal?.querySelector(".community-modal__image");
const communityModalTitle = communityModal?.querySelector("#communityModalTitle");
const communityModalDescription = communityModal?.querySelector("#communityModalDescription");
const communityModalLink = communityModal?.querySelector(".community-modal__link");
const communityModalCloseTriggers = communityModal?.querySelectorAll("[data-community-modal-close]");
let lastCommunityTrigger = null;

function closeCommunityModal() {
  if (!communityModal) return;
  communityModal.hidden = true;
  document.body.classList.remove("community-modal-open");
  lastCommunityTrigger?.focus();
}

function openCommunityModal(card) {
  if (!communityModal || !communityModalImage || !communityModalTitle || !communityModalDescription || !communityModalLink) return;

  const { title, description, image, link } = card.dataset;
  lastCommunityTrigger = card;
  communityModalImage.src = image || "";
  communityModalImage.alt = title ? `${title} image` : "Community image";
  communityModalTitle.textContent = title || "";
  communityModalDescription.textContent = description || "";
  communityModalLink.href = link || "#";
  communityModal.hidden = false;
  document.body.classList.add("community-modal-open");
  communityModal.querySelector(".community-modal__close")?.focus();
}

communityCards.forEach((card) => {
  card.addEventListener("click", () => openCommunityModal(card));
});

communityModalCloseTriggers?.forEach((trigger) => {
  trigger.addEventListener("click", closeCommunityModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && communityModal && !communityModal.hidden) {
    closeCommunityModal();
  }
});

// === Image Upload (Gallery) ===
const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const nameInput = document.getElementById("nameInput");
    const msgInput = document.getElementById("msgInput");

    const file = fileInput?.files?.[0];
    const name = nameInput?.value.trim() || "Anonymous";
    const msg = msgInput?.value.trim() || "";

    if (!file || !msg) {
      alert("Please select an image and write a message.");
      return;
    }

    uploadBtn.disabled = true;

    try {
      const safeFileName = file.name.replace(/[^\w.-]/g, "_");
      const suffix = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2, 10);
      const storageRef = ref(storage, `uploads/${Date.now()}_${suffix}_${safeFileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const createdAt = new Date();
      const jsonld = {
        "@context": {
          schema: "https://schema.org/",
          dc: "http://purl.org/dc/elements/1.1/"
        },
        "@type": "schema:Photograph",
        "schema:name": msg,
        "schema:creator": { "@type": "schema:Person", "schema:name": name },
        "schema:contentUrl": url,
        "schema:source": "Alex's Photo Board",
        "dc:date": createdAt.toISOString()
      };

      await addDoc(collection(db, "posts"), {
        name,
        message: msg,
        imageUrl: url,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
        jsonld
      });

      alert("✅ Upload successful (with semantic metadata)!");
      if (fileInput) fileInput.value = "";
      if (msgInput) msgInput.value = "";
      if (nameInput) nameInput.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Please try again.");
    } finally {
      uploadBtn.disabled = false;
    }
  });
}

// === Article Loader ===
async function loadArticles(containerId, collectionName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.textContent = "";

  try {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.textContent = "No articles yet.";
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const title = String(data.title || data.message || "Untitled");
      const isRich = Boolean(data.htmlContent || data.htmlUrl || data.content);
      const imageCandidate = data.imageUrl || data.jsonld?.["schema:image"] || "";
      const imageUrl = toSafeUrl(imageCandidate);

      const card = document.createElement("div");
      card.classList.add("article-card");

      if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = title;
        card.appendChild(image);
      }

      const heading = document.createElement("h3");
      heading.textContent = title;
      heading.tabIndex = 0;

      if (isRich) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.style.cssText = "background:#007bff;color:#fff;padding:2px 6px;border-radius:6px;font-size:12px;margin-left:6px;";
        badge.textContent = "Rich Format";
        heading.appendChild(badge);
      }

      heading.addEventListener("click", () => {
        openInNewTab(`article.html?id=${encodeURIComponent(docSnap.id)}&type=${encodeURIComponent(collectionName)}`);
      });
      heading.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          openInNewTab(`article.html?id=${encodeURIComponent(docSnap.id)}&type=${encodeURIComponent(collectionName)}`);
        }
      });

      const timestamp = document.createElement("p");
      timestamp.className = "timestamp";
      timestamp.textContent = formatDate(data.createdAt);

      card.appendChild(heading);
      card.appendChild(timestamp);
      container.appendChild(card);
    });
  } catch (err) {
    console.error(`Failed to load ${collectionName}:`, err);
    container.textContent = "Failed to load articles.";
  }
}

// === Gallery Loader ===
async function loadGallery() {
  const galleryContainer = document.getElementById("galleryContainer");
  if (!galleryContainer) return;
  galleryContainer.textContent = "";

  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const postRef = doc(db, "posts", docSnap.id);
      const jsonld = data.jsonld || {};

      const post = document.createElement("div");
      post.classList.add("post");

      const safePostImage = toSafeUrl(data.imageUrl);
      if (safePostImage) {
        const image = document.createElement("img");
        image.src = safePostImage;
        image.alt = String(data.message || "User photo");
        post.appendChild(image);
      }

      const commentSection = document.createElement("div");
      commentSection.className = "comment-section";

      const timestamp = document.createElement("p");
      timestamp.className = "timestamp";
      timestamp.textContent = new Date(data.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString();
      commentSection.appendChild(timestamp);

      const intro = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = String(data.name || "Anonymous");
      intro.appendChild(strong);
      intro.append(`: ${String(data.message || "")}`);
      commentSection.appendChild(intro);

      const linkedDataUrl = toSafeUrl(jsonld["schema:contentUrl"]);
      if (linkedDataUrl) {
        const linkedData = document.createElement("p");
        linkedData.className = "linked-data";
        linkedData.textContent = "📎 ";

        const link = document.createElement("a");
        link.href = linkedDataUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Open JSON-LD link";
        linkedData.appendChild(link);
        commentSection.appendChild(linkedData);
      }

      let likes = Number(data.likes) || 0;
      const likeBtn = document.createElement("button");
      likeBtn.className = "like-btn";
      likeBtn.textContent = `❤️ ${likes}`;
      likeBtn.addEventListener("click", async () => {
        likeBtn.disabled = true;
        try {
          await updateDoc(postRef, { likes: increment(1) });
          likes += 1;
          likeBtn.textContent = `❤️ ${likes}`;
        } catch (err) {
          console.error("Like update failed:", err);
        } finally {
          likeBtn.disabled = false;
        }
      });
      commentSection.appendChild(likeBtn);

      const commentList = document.createElement("div");
      commentList.className = "comments";
      (Array.isArray(data.comments) ? data.comments : []).forEach((comment) => {
        const commentEl = document.createElement("p");
        commentEl.className = "comment";
        commentEl.textContent = String(comment);
        commentList.appendChild(commentEl);
      });
      commentSection.appendChild(commentList);

      const commentInput = document.createElement("input");
      commentInput.className = "comment-input";
      commentInput.placeholder = "Write a comment...";
      commentSection.appendChild(commentInput);

      const commentBtn = document.createElement("button");
      commentBtn.className = "comment-btn";
      commentBtn.textContent = "Send";
      commentBtn.addEventListener("click", async () => {
        const text = commentInput.value.trim();
        if (!text) return;
        commentBtn.disabled = true;
        try {
          await updateDoc(postRef, { comments: arrayUnion(text) });
          const commentEl = document.createElement("p");
          commentEl.className = "comment";
          commentEl.textContent = text;
          commentList.appendChild(commentEl);
          commentInput.value = "";
        } catch (err) {
          console.error("Comment update failed:", err);
        } finally {
          commentBtn.disabled = false;
        }
      });
      commentSection.appendChild(commentBtn);

      post.appendChild(commentSection);
      galleryContainer.appendChild(post);
    });
  } catch (err) {
    console.error("Gallery load error:", err);
    galleryContainer.textContent = "Failed to load gallery.";
  }
}

function loadHistory() {
  return loadArticles("historyContainer", "history");
}

// === Heritage News from Drupal ===
async function loadDrupalNews() {
  const container = document.getElementById("drupalNewsContainer");
  if (!container) return;

  try {
    const res = await fetch("https://dev-alex-photo-cms.pantheonsite.io/jsonapi/node/article?include=field_image");
    if (!res.ok) throw new Error(`Drupal fetch failed: ${res.status}`);

    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    const included = Array.isArray(json.included) ? json.included : [];
    container.textContent = "";

    list.forEach((item) => {
      const title = String(item.attributes?.title || "Untitled");
      const created = item.attributes?.created ? new Date(item.attributes.created).toDateString() : "";
      const rel = item.relationships?.field_image?.data;

      let imageUrl = "";
      if (rel) {
        const file = included.find((entry) => entry.id === rel.id && entry.type === "file--file");
        imageUrl = file?.attributes?.uri?.url || "";
      }
      if (imageUrl.startsWith("/")) {
        imageUrl = `https://dev-alex-photo-cms.pantheonsite.io${imageUrl}`;
      }
      imageUrl = toSafeUrl(imageUrl);

      const card = document.createElement("div");
      card.classList.add("article-card");

      if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = title;
        card.appendChild(image);
      }

      const heading = document.createElement("h3");
      heading.className = "cms-title";
      heading.style.cssText = "cursor:pointer;color:#007bff;text-decoration:underline;";
      heading.textContent = title;
      heading.addEventListener("click", () => {
        openInNewTab(`article.html?id=${encodeURIComponent(item.id)}&type=drupal`);
      });
      card.appendChild(heading);

      const stamp = document.createElement("p");
      stamp.className = "timestamp";
      stamp.textContent = created;
      card.appendChild(stamp);

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading CMS:", err);
    container.textContent = "Failed to load CMS news.";
  }
}

// === Initialize ===
loadArticles("newsContainer", "news");
loadGallery();
loadHistory();
loadDrupalNews();
