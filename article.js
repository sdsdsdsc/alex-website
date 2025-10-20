// === Firebase Imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyDr8hSsoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alex-photo-board.firebaseapp.com",
  projectId: "alex-photo-board",
  storageBucket: "alex-photo-board.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

// === Initialize Firebase ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Extract URL Parameters ===
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

// === Target DOM Elements ===
const articleTitle = document.getElementById("articleTitle");
const articleImage = document.getElementById("articleImage");
const articleContent = document.getElementById("articleContent");
const articleDate = document.getElementById("articleDate");

// === Load Article from Firestore ===
async function loadArticle() {
  if (!id || !type) {
    articleContent.textContent = "Invalid article link.";
    return;
  }

  try {
    const docRef = doc(db, type, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Update page content
      document.title = data.title + " | Alex's Photo Board";
      articleTitle.textContent = data.title;
      articleImage.src = data.imageUrl;
      articleContent.textContent = data.content;

      if (data.createdAt?.seconds) {
        const date = new Date(data.createdAt.seconds * 1000);
        articleDate.textContent = date.toDateString();
      }
    } else {
      articleTitle.textContent = "Article Not Found";
      articleContent.textContent = "Sorry, this article no longer exists.";
    }
  } catch (error) {
    console.error("Error loading article:", error);
    articleTitle.textContent = "Error";
    articleContent.textContent = "An error occurred while loading the article.";
  }
}

loadArticle();
