// article.js
// Loads an article document from Firestore and renders it.
// If the Firestore doc contains `htmlContent` we use that.
// If it contains `htmlUrl` (a Firebase Storage download URL), we fetch that file and inject its HTML.
// Otherwise we fall back to `content` (plain text).

/*
Notes:
- This file assumes Firebase app is already initialized on the page (your other scripts do that).
- It imports only Firestore functions and uses fetch() to load htmlUrl.
- Replace collection-mapping if your collections use different names.
*/

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

  // DOM nodes (adjust IDs if your markup uses different ids)
  const titleEl = document.getElementById('articleTitle');
  const dateEl = document.getElementById('articleDate');
  const imgEl = document.getElementById('articleImage');
  const articleContent = document.getElementById('articleContent');
  const spinnerEl = document.getElementById('articleSpinner'); // optional spinner in markup

  // Show/Hide spinner helper
  function showSpinner() {
    if (spinnerEl) spinnerEl.style.display = '';
  }
  function hideSpinner() {
    if (spinnerEl) spinnerEl.style.display = 'none';
  }

  // Collection selection based on "type" param (customize if needed)
  function collectionForType(t) {
    if (!t) return 'news';
    const map = {
      news: 'news',
      history: 'history',
      gallery: 'gallery',
      // add more mappings if you use other collection names
    };
    return map[t] || 'news';
  }

  // Main loader
  async function loadArticle() {
    const id = getQueryParam('id');
    const type = getQueryParam('type') || 'news';
    if (!id) {
      console.error('No article id provided in URL');
      if (articleContent) articleContent.innerHTML = '<p>No article specified.</p>';
      return;
    }

    showSpinner();

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

      // Date (try a few fields)
      if (dateEl) {
        const dateVal = data.date || data.publishedAt || data.createdAt || data.time;
        if (dateVal) {
          // simple formatting
          try {
            const d = new Date(dateVal);
            if (!isNaN(d)) {
              dateEl.textContent = d.toDateString();
            } else {
              dateEl.textContent = dateVal;
            }
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
      // Priority: htmlContent -> htmlUrl (fetch file) -> content (plain) -> quillHtml / body
      if (data.htmlContent) {
        articleContent.innerHTML = data.htmlContent;
      } else if (data.htmlUrl) {
        // htmlUrl should be a full download URL (getDownloadURL() result)
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
        // If content is stored as HTML, use innerHTML; otherwise escape?
        // We assume it's safe/intentional HTML from Quill or similar.
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

  // Run
  loadArticle();

})();
