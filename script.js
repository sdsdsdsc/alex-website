// === Dropdown Menu Logic (fixed version) ===
const communityBtn = document.getElementById("communityBtn");
const communityMenu = document.getElementById("communityMenu");
const newsBtn = document.getElementById("newsBtn");
const newsMenu = document.getElementById("newsMenu");

// Community dropdown
if (communityBtn && communityMenu) {
  communityBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    communityMenu.classList.toggle("show");
    newsMenu?.classList.remove("show");
  });
}

// News dropdown
if (newsBtn && newsMenu) {
  newsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    newsMenu.classList.toggle("show");
    communityMenu?.classList.remove("show");
  });
}

// Hide dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu")) {
    communityMenu?.classList.remove("show");
    newsMenu?.classList.remove("show");
  }
});


// === Firebase Logic ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, updateDoc,
  increment, orderBy, query, serverTimestamp
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


// === Upload Image Logic ===
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
      console.error("Upload failed:", err);
    }
  });
}


// === Load Gallery ===
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

    let formattedDate = "";
    if (post.createdAt?.seconds) {
      const date = new Date(post.createdAt.seconds * 1000);
      formattedDate = date.toDateString();
    }

    div.innerHTML = `
      <img src="${post.imageUrl}" alt="">
      <p>${post.message}</p>
      <p>👤 ${post.name}</p>
      <p>❤️ ${post.likes || 0} likes</p>
      <p class="timestamp">${formattedDate}</p>
      <div class="comment-section"></div>
      <input type="text" class="comment-input" placeholder="Write a comment...">
      <button class="comment-btn">Post</button>
    `;

    const commentSection = div.querySelector(".comment-section");
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(c => {
        const p = document.createElement("p");
        p.classList.add("comment");
        p.textContent = `💬 ${c}`;
        commentSection.appendChild(p);
      });
    }

    const commentBtn = div.querySelector(".comment-btn");
    if (commentBtn) {
      commentBtn.addEventListener("click", async () => {
        const input = div.querySelector(".comment-input");
        const text = input.value.trim();
        if (!text) return;
        const refDoc = doc(db, "posts", docSnap.id);
        await updateDoc(refDoc, { comments: [...(post.comments || []), text] });
        input.value = "";
        loadGallery();
      });
    }

    gallery.appendChild(div);
  });
}
loadGallery();


// === Load Articles (News & History) ===
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

// Load News and History articles
loadArticles("newsContainer", "news");
loadArticles("historyContainer", "history");
// === FETCH DRUPAL NEWS FROM OPEN CMS ===
async function loadDrupalNews() {
  const container = document.getElementById("drupalNewsContainer");
  if (!container) return;

  try {
    const res = await fetch("https://dev-alex-photo-cms.pantheonsite.io/jsonapi/node/article");
    if (!res.ok) throw new Error("Failed to fetch Drupal data");
    const json = await res.json();

    const { data, included = [] } = json;
    container.innerHTML = ""; // clear

    data.forEach(item => {
      const title = item.attributes.title;
      const body = item.attributes.body.value;
      const created = new Date(item.attributes.created).toDateString();

      // find image
      let imageUrl = "";
      const rel = item.relationships.field_image?.data;
      if (rel) {
        const file = included.find(f => f.id === rel.id && f.type === "file--file");
        if (file) imageUrl = file.attributes.uri.url;
      }

      const article = document.createElement("div");
      article.classList.add("drupal-article");
      article.innerHTML = `
        <div class="article-card">
          ${imageUrl ? `<img src="${imageUrl}" alt="">` : ""}
          <h3>${title}</h3>
          <p class="timestamp">${created}</p>
          <p>${body}</p>
        </div>
      `;
      container.appendChild(article);
    });
  } catch (err) {
    console.error("Error loading Drupal news:", err);
    container.innerHTML = "<p>Failed to load news from CMS.</p>";
  }
}
