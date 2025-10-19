// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
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

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const msgInput = document.getElementById("msgInput");
const gallery = document.getElementById("gallery");

// Upload image + message
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const msg = msgInput.value.trim();
  if (!file || !msg) return alert("Pick a file and type a message!");

  try {
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "posts"), {
      message: msg,
      imageUrl: url,
      createdAt: serverTimestamp()
    });

    fileInput.value = "";
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

  snapshot.forEach(doc => posts.push(doc.data()));

  // Sort posts newest → oldest
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
    postDiv.appendChild(time);
    gallery.appendChild(postDiv);
  });
}

loadGallery();
