// article.js
// Loads an article document from Firestore and renders it.
// If the Firestore doc contains `htmlContent` we use that.
// If it contains `htmlUrl` (a Firebase Storage download URL), we fetch that file and inject its HTML.
// Otherwise we fall back to `content` (plain text).

import {
  getApps
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

(async function () {
  // Helper: read query param
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  // Simple sleep
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  // Wait for firebase app to be initialized (polls getApps())
  async function waitForFirebaseInit(timeoutMs = 5000, intervalMs = 100) {
    const attempts = Math.ceil(timeoutMs / intervalMs);
    for (let i = 0; i < attempts; i++) {
      try {
        if (getApps && getApps().length > 0) return true;
      } catch (e) {
        // ignore occasional transient errors
      }
      await sleep(intervalMs);
    }
    return false;
  }

  // DOM nodes (adjust IDs if your markup uses different ids)
  const titleEl = document.getElementById('articleTitle');
  const dateEl = document.getElementById('articleDate');
  const imgEl = document.getElementById('articleImage');
  const articleContent = document.getElementById('articleContent');
  const spinnerEl = document.getElementById('articleSpinner'); // optional spinner in markup

  function showSpinner() {
    if (spinnerEl) spinnerEl.style.display = '';
  }
  function hideSpinner() {
    if (spinnerEl) spinnerEl.style.display = 'none';
  }

  function collectionForType(t) {
    if (!t) return 'news';
    const map = {
      news: 'news',
      history: 'history',
      gallery: 'gallery',
    };
    return map[t] || 'news';
  }

  async function loadArticle() {
    const id = getQueryParam('id');
    const type = getQueryParam('type') || 'news';
    if (!id) {
      console.error('No article id provided in URL');
      if (articleContent) articleContent.innerHTML = '<p>No article specified.</p>';
      return;
    }

    showSpinner();

    // Wait for Firebase to be initialized by other scripts (e.g., your firebase config/init)
    const firebaseReady = await waitForFirebaseInit(5000, 100);
    if (!firebaseReady) {
      console.error('Firebase app not initialized: article.js waited but no app detected. Ensure your firebase initializeApp() runs before article.js.');
      if (titleEl) titleEl.textContent = 'Error loading article';
      if (articleContent) articleContent.innerHTML = '<p>Error loading article: Firebase not initialized. Make sure your Firebase initialization script runs before article.js.</p>';
      hideSpinner();
      return;
    }

    try {
      const db = getFirestore();
      const coll = collectionForType(type);
      const docRef = doc(db, coll, id);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        console.warn('Article doc not found:', id, 'collection:', coll);
        if (titleEl) titleEl.textContent = 'Article not found';
        if (articleContent) articleContent.innerHTML = '<p>Article not found.</p>';
        return;
      }

      const data = snap.data();

      // Title
      if (titleEl) titleEl.textContent = data.title || data.name || '';

      // Date
      if (dateEl) {
        const dateVal = data.date || data.publishedAt || data.createdAt || data.time;
        if (dateVal) {
          try {
            const d = new Date(dateVal);
            dateEl.textContent = !isNaN(d) ? d.toDateString() : dateVal;
          } catch (e) {
            dateEl.textContent = dateVal;
          }
        } else {
          dateEl.textContent = '';
        }
      }

      // Image
      if (imgEl) {
        const imgUrl = data.image || data.coverImage || data.photoUrl || data.thumbnail;
        if (imgUrl) {
          imgEl.src = imgUrl;
          imgEl.style.display = '';
        } else {
          imgEl.style.display = 'none';
        }
      }

      // === Render content ===
      if (data.htmlContent) {
        articleContent.innerHTML = data.htmlContent;
      } else if (data.htmlUrl) {
        try {
          const res = await fetch(data.htmlUrl, { method: 'GET' });
          if (!res.ok) {
            throw new Error('Fetch failed, status: ' + res.status);
          }
          const html = await res.text();
          articleContent.innerHTML = html;
        } catch (err) {
          console.error('Failed to fetch htmlUrl:', err);
          articleContent.innerHTML = `<p>Failed to load article content.</p>`;
        }
      } else if (data.content) {
        articleContent.innerHTML = data.content;
      } else if (data.quillHtml) {
        articleContent.innerHTML = data.quillHtml;
      } else if (data.body) {
        articleContent.innerHTML = data.body;
      } else {
        articleContent.innerHTML = '<p>No content available for this article.</p>';
      }
    } catch (err) {
      console.error('Error loading article:', err);
      if (articleContent) articleContent.innerHTML = '<p>Error loading article. See console for details.</p>';
    } finally {
      hideSpinner();
    }
  }

  loadArticle();

})();
