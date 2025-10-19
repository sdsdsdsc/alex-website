import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, increment, serverTimestamp 
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
const communityBtn = document.getElementById("communityBtn");
const menuContent = document.getElementById("menuContent");
const galleryBtn = document.getElementById("galleryBtn");
const imageUploadBtn = document.getElementById("imageUploadBtn");
const uploadSection = document.getElementById("uploadSection");
const gallerySection = document.getElementById("gallerySection");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const gallery = document.getElementById("gallery");

// --- MENU LOGIC --- //
communityBtn.addEventListener("click", () => {
  menuContent.classList.toggle("hidden");
});

galleryBtn.addEventListener("click", () => {
  gallerySection.classList.toggle("hidden");
  uploadSection.classList.add("hidden");
  loadGallery();
});

imageUploadBtn.addEventListener("click", () => {
  uploadSection.classList.toggle("hidden");
  gallerySection.classList.add("hidden");
});

// --- UPLOAD IMAGE --- //
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
      createdAt: serverTimestamp()
    });

    alert("Uploaded successfully!");
    fileInput.value = "";
    msgInput.value = "";
    nameInput.value = "";
    loadGallery();
  } catch (err) {
    console.error("Upload error:", err);
  }
});

// --- LOAD GALLERY WITH COMMENTS --- //
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

    // --- Comments ---
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

    commentSection.append(commentList, commentInput, commentBtn);

    postDiv.append(img, caption, author, likeBtn, likeCount, time, commentSection);
    gallery.appendChild(postDiv);
  }
}
