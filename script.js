// Menus: same logic for all pages
const communityBtn = document.getElementById("communityBtn");
const communityMenu = document.getElementById("communityMenu");
const newsBtn = document.getElementById("newsBtn");
const newsMenu = document.getElementById("newsMenu");

if (communityBtn) {
  communityBtn.addEventListener("click", () => {
    communityMenu.classList.toggle("hidden");
    if (newsMenu) newsMenu.classList.add("hidden");
  });
}
if (newsBtn) {
  newsBtn.addEventListener("click", () => {
    newsMenu.classList.toggle("hidden");
    if (communityMenu) communityMenu.classList.add("hidden");
  });
}

/* =====================
   Firebase Functionality
   ===================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, increment, orderBy, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

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

/* =====================
   Upload Page Handling
   ===================== */
const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const nameInput = document.getElementById("nameInput");
    const msgInput = document.getElementById("msgInput");
    const file = fileInput.files[0];
    const name = nameInput.value.trim() || "Anonymous";
    const msg = msgInput.value.trim();
    if (!file || !msg) return alert("Please select an image and add a message.");

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
        createdAt: serverTimestamp(),
      });
      alert("Uploaded successfully!");
      fileInput.value = msgInput.value = nameInput.value = "";
    } catch (err) {
      console.error(err);
    }
  });
}

/* =====================
   Gallery, News & History
   ===================== */
async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  gallery.innerHTML = "";
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const post = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      <img src="${post.imageUrl}">
      <p>${post.message}</p>
      <p>👤 ${post.name}</p>
      <p>❤️ ${post.likes || 0} likes</p>
    `;
    gallery.appendChild(div);
  });
}
loadGallery();

async function loadArticles(containerId, collectionName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const article = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("article-card");
    card.innerHTML = `
      <img src="${article.imageUrl}" alt="">
      <h3>${article.title}</h3>
    `;
    card.querySelector("h3").addEventListener("click", () => {
      window.open(`article.html?id=${docSnap.id}&type=${collectionName}`, "_blank");
    });
    container.appendChild(card);
  });
}
loadArticles("newsContainer", "news");
loadArticles("historyContainer", "history");
