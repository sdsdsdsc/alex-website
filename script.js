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

// 🔑 Firebase config
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

// DOM
const communityBtn = document.getElementById("communityBtn");
const menuContent = document.getElementById("menuContent");
const imageUploadBtn = document.getElementById("imageUploadBtn");
const uploadSection = document.getElementById("uploadSection");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const gallery = document.getElementById("gallery");

// Menu toggle
communityBtn.addEventListener("click", () => {
  menuContent.classList.toggle("hidden");
});

// Show upload form
imageUploadBtn.addEventListener("click", () => {
  uploadSection.classList.toggle("hidden");
});

// Upload new post
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
      name,
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
    console.error(err);
    alert("Upload failed!");
  }
});

// Load posts + comments
async function loadGallery() {
  gallery.innerHTML = "";
  const snapshot = await getDocs(collection(db, "posts"));
  const posts = [];

  snapshot.forEach(docSnap => posts.push({ id: docSnap.id, ...docSnap.data() }));

  posts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  for (const post of posts) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const img = document.createElement("img");
    img.src = post.imageUrl;

    const caption = document.createElement("p");
    caption.textContent = post.message;

    const author = document.createElement("p");
    author.classList.add("author");
    author.textContent = `👤 ${post.name}`;

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.textContent = "❤️";
    likeBtn.addEventListener("click", async () => {
      const refDoc = doc(db, "posts", post.id);
      await updateDoc(refDoc, { likes: increment(1) });
      loadGallery();
    });

    const likeCount = document.createElement("p");
    likeCount.classList.add("likes");
    likeCount.textContent = `${post.likes || 0} likes`;

    const time = document.createElement("p");
    time.classList.add("timestamp");
    if (post.createdAt) {
      const date = new Date(post.createdAt.seconds * 1000);
      time.textContent = `Posted on ${date.toDateString()}`;
    }

    // --- Comment section ---
    const commentSection = document.createElement("div");
    commentSection.classList.add("comment-section");

    const commentList = document.createElement("div");
    commentList.classList.add("comment-list");

    // Load comments
    const commentsSnap = await getDocs(collection(db, "posts", post.id, "comments"));
    commentsSnap.forEach(c => {
      const data = c.data();
      const comment = document.createElement("p");
      comment.classList.add("comment");
      comment.textContent = `💬 ${data.name || "Anonymous"}: ${data.text}`;
      commentList.appendChild(comment);
    });

    const commentInput = document.createElement("input");
    commentInput.classList.add("comment-input");
    commentInput.placeholder = "Write a comment...";

    const commentBtn = document.createElement("button");
    commentBtn.classList.add("comment-btn");
    commentBtn.textContent = "Post";
    commentBtn.addEventListener("click", async () => {
      const text = commentInput.value.trim();
      if (!text) return;
      await addDoc(collection(db, "posts", post.id, "comments"), {
        text,
        name: "Anonymous",
        createdAt: serverTimestamp()
      });
      commentInput.value = "";
      loadGallery();
    });

    commentSection.appendChild(commentList);
    commentSection.appendChild(commentInput);
    commentSection.appendChild(commentBtn);

    // Assemble post
    postDiv.appendChild(img);
    postDiv.appendChild(caption);
    postDiv.appendChild(author);
    postDiv.appendChild(likeBtn);
    postDiv.appendChild(likeCount);
    postDiv.appendChild(time);
    postDiv.appendChild(commentSection);
    gallery.appendChild(postDiv);
  }
}

loadGallery();
