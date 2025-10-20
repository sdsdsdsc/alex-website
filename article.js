import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

async function loadArticle() {
  const docRef = doc(db, type, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.title = data.title;
    document.getElementById("articleTitle").textContent = data.title;
    document.getElementById("articleImage").src = data.imageUrl;
    document.getElementById("articleContent").textContent = data.content;
  } else {
    document.getElementById("articleTitle").textContent = "Article not found";
    document.getElementById("articleContent").textContent = "Sorry, this article doesn’t exist.";
  }
}
loadArticle();
