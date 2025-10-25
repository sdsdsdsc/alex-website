import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, updateDoc,
  orderBy, query, serverTimestamp
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// === Dropdowns ===
const communityBtn = document.getElementById("communityBtn");
const communityMenu = document.getElementById("communityMenu");
const newsBtn = document.getElementById("newsBtn");
const newsMenu = document.getElementById("newsMenu");

communityBtn?.addEventListener("click", e => {
  e.stopPropagation();
  communityMenu.classList.toggle("show");
  newsMenu?.classList.remove("show");
});

newsBtn?.addEventListener("click", e => {
  e.stopPropagation();
  newsMenu.classList.toggle("show");
  communityMenu?.classList.remove("show");
});

document.addEventListener("click", e => {
  if (!e.target.closest(".menu")) {
    communityMenu?.classList.remove("show");
    newsMenu?.classList.remove("show");
  }
});

// === Firebase Upload ===
const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const nameInput = document.getElementById("nameInput");
    const msgInput = document.getElementById("msgInput");

    const file = fileInput.files[0];
    const name = nameInput.value.trim() || "Anonymous";
    const msg = msgInput.value.trim();

    if (!file || !msg) return alert("Please select an image and write a message.");

    try {
      const storageRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "posts"), {
        name,
        message: msg,
        imageUrl: url,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp()
      });

      alert("Upload successful!");
      fileInput.value = msgInput.value = nameInput.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
    }
  });
}

// === Load Firebase Articles ===
async function loadArticles(containerId, collectionName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("article-card");

    const date = data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toDateString()
      : "";

    card.innerHTML = `
      <img src="${data.imageUrl}" alt="">
      <h3>${data.title}</h3>
      <p class="timestamp">${date}</p>
    `;

    card.querySelector("h3").addEventListener("click", () => {
      window.open(`article.html?id=${docSnap.id}&type=${collectionName}`, "_blank");
    });

    container.appendChild(card);
  });
}

// === Load Drupal CMS Articles ===
async function loadDrupalNews() {
  const container = document.getElementById("drupalNewsContainer");
  if (!container) return;

  try {
    const res = await fetch("https://dev-alex-photo-cms.pantheonsite.io/jsonapi/node/article?include=field_image");
    if (!res.ok) throw new Error("Failed to fetch CMS data");
    const json = await res.json();

    container.innerHTML = "";
    const { data, included = [] } = json;

    data.forEach(item => {
      const title = item.attributes.title || "Untitled";
      const created = new Date(item.attributes.created).toDateString();

      let imageUrl = "";
      const rel = item.relationships.field_image?.data;
      if (rel) {
        const file = included.find(f => f.id === rel.id && f.type === "file--file");
        if (file) imageUrl = file.attributes.uri.url;
      }
      if (imageUrl.startsWith("/")) {
        imageUrl = `https://dev-alex-photo-cms.pantheonsite.io${imageUrl}`;
      }

      const div = document.createElement("div");
      div.classList.add("article-card");
      div.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="">` : ""}
        <h3 class="cms-title" style="cursor:pointer; color:#007bff; text-decoration:underline;">${title}</h3>
        <p class="timestamp">${created}</p>
      `;

      div.querySelector(".cms-title").addEventListener("click", () => {
        const articleId = item.id;
        window.open(`article.html?id=${articleId}&type=drupal`, "_blank");
      });

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading CMS:", err);
    container.innerHTML = "<p>Failed to load CMS news.</p>";
  }
}

// === Execute loads ===
loadArticles("newsContainer", "news");
loadDrupalNews();
