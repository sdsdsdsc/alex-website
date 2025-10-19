// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// 🔑 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDr8hSsoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM elements
const communityBtn = document.getElementById("communityBtn");
const menuContent = document.getElementById("menuContent");
const imageUploadBtn = document.getElementById("imageUploadBtn");
const uploadSection = document.getElementById("uploadSection");

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const gallery = document.getElementById("gallery");

// Toggle dropdown menu
communityBtn.addEventListener("click", () => {
  menuContent.classList.toggle("hidden");
});

// Show upload section when clicking “Image”
imageUploadBtn.addEventListener("click", () => {
  uploadSection.classList.toggle("hidden");
});

// Upload image + message + name
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const name = nameInput.value.trim() || "Anonymous";
  const msg = msgInput.value.trim();
  if (!file || !msg) return alert("Pick a file and type a message!");

  try {
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "posts"), {
      name: name,
      message: msg,
      imageUrl: url,
      likes: 0,
      createdAt: serverTimestamp()
    });

    fileInput.value = "";
    nameInput.value = "";
    msgInput.value = "";
    alert("Uploaded!");
    loadGallery();
  } catch (err) {
    console.error("Upload error:", err);
    alert("Something went wrong during upload!");
  }
});

// Load gallery
async function loadGallery() {
  gallery.innerHTML = "";
  const snapshot = await getDocs(collection(db, "posts"));
  const posts = [];

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    posts.push({ id: docSnap.id, ...data });
  });

  // Sort newest → oldest
  posts.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return b.createdAt.seconds - a.createdAt.seconds;
  });

  posts.forEach(data => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const img = document.createElement("img");
    img.src = data.imageUrl;

    const caption = document.createElement("p");
    caption.textContent = data.message;

    const author = document.createElement("p");
    author.classList.add("author");
    author.textContent = data.name ? `👤 ${data.name}` : "👤 Anonymous";

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.textContent = "❤️";
    likeBtn.addEventListener("click", async () => {
      const docRef = doc(db, "posts", data.id);
      await updateDoc(docRef, { likes: increment(1) });
      loadGallery();
    });

    const likeCount = document.createElement("p");
    likeCount.classList.add("likes");
    likeCount.textContent = `${data.likes || 0} likes`;

    const time = document.createElement("p");
    time.classList.add("timestamp");

    if (data.createdAt) {
      const date = new Date(data.createdAt.seconds * 1000);
      time.textContent = `Posted on ${date.toDateString()}`;
    } else {
      time.textContent = "Posted recently";
    }

    postDiv.appendChild(img);
    postDiv.appendChild(caption);
    postDiv.appendChild(author);
    postDiv.appendChild(likeBtn);
    postDiv.appendChild(likeCount);
    postDiv.appendChild(time);
    gallery.appendChild(postDiv);
  });
}

loadGallery();
