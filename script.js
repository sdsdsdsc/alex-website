import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, increment, serverTimestamp, orderBy, query
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

// DOM elements
const uploadSection = document.getElementById("uploadSection");
const gallerySection = document.getElementById("gallerySection");
const newsSection = document.getElementById("newsSection");
const historySection = document.getElementById("historySection");
const gallery = document.getElementById("gallery");

const communityBtn = document.getElementById("communityBtn");
const communityMenu = document.getElementById("communityMenu");
const galleryBtn = document.getElementById("galleryBtn");
const imageUploadBtn = document.getElementById("imageUploadBtn");
const newsBtn = document.getElementById("newsBtn");
const newsMenu = document.getElementById("newsMenu");
const showNews = document.getElementById("showNews");
const showHistory = document.getElementById("showHistory");

// --- Toggle menus ---
communityBtn.addEventListener("click", () => {
  communityMenu.classList.toggle("hidden");
  newsMenu.classList.add("hidden");
});
newsBtn.addEventListener("click", () => {
  newsMenu.classList.toggle("hidden");
  communityMenu.classList.add("hidden");
});

// --- Section controls ---
galleryBtn.addEventListener("click", () => {
  showOnly(gallerySection);
  loadGallery();
});

imageUploadBtn.addEventListener("click", () => {
  showOnly(uploadSection);
});

showNews.addEventListener("click", () => {
  showOnly(newsSection);
  loadArticles("newsContainer", "news");
});

showHistory.addEventListener("click", () => {
  showOnly(historySection);
  loadArticles("historyContainer", "history");
});

// Helper to hide all others, show only one
function showOnly(sectionToShow) {
  const sections = [uploadSection, gallerySection, newsSection, historySection];
  sections.forEach(sec => {
    if (sec === sectionToShow) {
      sec.classList.remove("hidden");
    } else {
      sec.classList.add("hidden");
    }
  });
}

// --- Upload post ---
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const name = nameInput.value.trim() || "Anonymous";
  const msg = msgInput.value.trim();
  if (!file || !msg) return alert("Please choose a file and write a message.");

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

    alert("Uploaded successfully!");
    fileInput.value = msgInput.value = nameInput.value = "";
    loadGallery();
  } catch (err) {
    console.error("Upload error:", err);
  }
});

// --- Load Gallery (with comments) ---
async function loadGallery() {
  gallery.innerHTML = "";
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const post = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("post");

    let formattedDate = "";
    if (post.createdAt?.seconds) {
      const date = new Date(post.createdAt.seconds * 1000);
      formattedDate = date.toDateString();
    }

    div.innerHTML = `
      <img src="${post.imageUrl}">
      <p>${post.message}</p>
      <p class="author">👤 ${post.name}</p>
      <button class="like-btn">❤️</button>
      <p class="likes">${post.likes || 0} likes</p>
      <p class="timestamp">🕒 ${formattedDate}</p>

      <div class="comment-section"></div>
      <input type="text" class="comment-input" placeholder="Write a comment...">
      <button class="comment-btn">Post</button>
    `;

    // Like button
    div.querySelector(".like-btn").addEventListener("click", async () => {
      const refDoc = doc(db, "posts", docSnap.id);
      await updateDoc(refDoc, { likes: increment(1) });
      loadGallery();
    });

    // Load comments
    const commentSection = div.querySelector(".comment-section");
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(c => {
        const p = document.createElement("p");
        p.classList.add("comment");
        p.textContent = `💬 ${c}`;
        commentSection.appendChild(p);
      });
    }

    // Add comment
    const commentBtn = div.querySelector(".comment-btn");
    commentBtn.addEventListener("click", async () => {
      const input = div.querySelector(".comment-input");
      const text = input.value.trim();
      if (!text) return;
      const refDoc = doc(db, "posts", docSnap.id);
      await updateDoc(refDoc, { comments: [...(post.comments || []), text] });
      input.value = "";
      loadGallery();
    });

    gallery.appendChild(div);
  });
}

// --- Load News / History ---
async function loadArticles(containerId, collectionName) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const article = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("article-card");

    let formattedDate = "";
    if (article.createdAt?.seconds) {
      const date = new Date(article.createdAt.seconds * 1000);
      formattedDate = date.toDateString();
    }

    card.innerHTML = `
      <img src="${article.imageUrl}" alt="">
      <h3>${article.title}</h3>
      <p class="timestamp">${formattedDate}</p>
    `;
    card.querySelector("h3").addEventListener("click", () => {
      window.open(`article.html?id=${docSnap.id}&type=${collectionName}`, "_blank");
    });
    container.appendChild(card);
  });
}
