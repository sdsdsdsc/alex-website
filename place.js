import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  deleteObject,
  getStorage,
  ref as storageRef,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import {
  buildMapUrl,
  buildPlaceJsonLd,
  buildPublicPlaceSummary,
  cleanText,
  formatPlaceLocationAddress,
  formatRecordDate,
  getAssetType,
  getCoordinateDisplay,
  getDisplayTitle,
  getHeritageCriteria,
  getPublicDescription,
  getRelatedArticleUrl,
  getTags,
  hasUsableJsonLd,
  hasValidCoordinates,
  normalizeCoordinate,
  toSafeUrl
} from "./heritage-engine/places.js?v=2026-06-20-releasepolish";
import {
  ARTICLE_RELATIONSHIP_COLLECTIONS,
  getRelationshipWarningSummary,
  normalizeRelationshipReferences
} from "./heritage-engine/relationships.js?v=2026-06-19-12a";
import {
  buildPlaceContributionCreatePayload,
  buildPlaceContributionReplyCreatePayload,
  buildPublicPlaceContributionPayload,
  groupPublicPlaceContributionRepliesByContribution
} from "./heritage-engine/place-contributions.js?v=2026-07-11-13d-public-reply-query";

const firebaseConfig = {
  apiKey: "AIzaSyDr8hSSoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const MAX_CONTRIBUTION_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_CONTRIBUTION_IMAGE_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

const els = {
  status: document.getElementById("placeRecordStatus"),
  content: document.getElementById("placeRecordContent"),
  title: document.getElementById("placeTitle"),
  breadcrumbTitle: document.getElementById("placeBreadcrumbTitle"),
  description: document.getElementById("placeDescription"),
  tags: document.getElementById("placeTags"),
  actions: document.getElementById("placeActions"),
  imageWrap: document.getElementById("placeImageWrap"),
  imageCredit: document.getElementById("placeImageCredit"),
  locationContent: document.getElementById("placeLocationContent"),
  localHeritageSection: document.getElementById("localHeritageRecord"),
  localHeritageContent: document.getElementById("placeLocalHeritageRecord"),
  relatedArticlesSection: document.getElementById("relatedArticles"),
  relatedArticles: document.getElementById("placeRelatedArticles"),
  sourceReference: document.getElementById("placeSourceReference"),
  metadata: document.getElementById("placeMetadata"),
  contributionCount: document.getElementById("placeContributionCount"),
  contributionSummary: document.getElementById("placeContributionSummary"),
  contributionEntryButton: document.getElementById("placeContributionEntryButton"),
  contributionEntryHint: document.getElementById("placeContributionEntryHint"),
  contributionSignInLink: document.getElementById("placeContributionSignInLink"),
  contributionModal: document.getElementById("placeContributionModal"),
  contributionModalBackdrop: document.getElementById("placeContributionModalBackdrop"),
  contributionModalClose: document.getElementById("placeContributionModalClose"),
  contributionModalCancel: document.getElementById("placeContributionModalCancel"),
  contributionSignedOut: document.getElementById("placeContributionSignedOut"),
  contributionSignedIn: document.getElementById("placeContributionSignedIn"),
  contributionSignedInSummary: document.getElementById("placeContributionSignedInSummary"),
  contributionForm: document.getElementById("placeContributionForm"),
  contributionText: document.getElementById("placeContributionText"),
  contributionImageUrl: document.getElementById("placeContributionImageUrl"),
  contributionImageFile: document.getElementById("placeContributionImageFile"),
  contributionImageUploadStatus: document.getElementById("placeContributionImageUploadStatus"),
  contributionImageCaption: document.getElementById("placeContributionImageCaption"),
  contributionImageCredit: document.getElementById("placeContributionImageCredit"),
  contributionImageRightsStatus: document.getElementById("placeContributionImageRightsStatus"),
  contributionImagePermissionConfirmed: document.getElementById("placeContributionImagePermissionConfirmed"),
  contributionSubmitButton: document.getElementById("placeContributionSubmitButton"),
  contributionFormStatus: document.getElementById("placeContributionFormStatus"),
  contributionsList: document.getElementById("placeContributionsList"),
  contributionsEmpty: document.getElementById("placeContributionsEmpty"),
  tabs: Array.from(document.querySelectorAll(".place-record-tab")),
  panels: Array.from(document.querySelectorAll(".place-tab-panel"))
};

let placeMap = null;
let currentPlace = null;
let currentUser = null;
let lastContributionTrigger = null;
const validSections = new Set(["overview", "comments-photos"]);

function buildContributionSignInHref() {
  const url = new URL(window.location.href);
  url.searchParams.set("section", "comments-photos");
  url.hash = "comments-photos-panel";
  return `public-auth.html?next=${encodeURIComponent(`${url.pathname}${url.search}${url.hash}`)}`;
}

function refreshReplyEntryStates() {
  const isSignedIn = Boolean(currentUser);
  document.querySelectorAll(".place-contribution-reply-entry").forEach((entry) => {
    const signedInPanel = entry.querySelector(".place-contribution-reply-entry__signed-in");
    const signedOutPanel = entry.querySelector(".place-contribution-reply-entry__signed-out");
    const signInLink = entry.querySelector(".place-contribution-reply-entry__sign-in");

    if (signedInPanel) signedInPanel.hidden = !isSignedIn;
    if (signedOutPanel) signedOutPanel.hidden = isSignedIn;
    if (signInLink) signInLink.href = buildContributionSignInHref();
  });
}

function setContributionFormStatus(message, type = "") {
  if (!els.contributionFormStatus) return;
  els.contributionFormStatus.textContent = message;
  els.contributionFormStatus.className = type === "error"
    ? "place-contribution-form__status admin-error"
    : type === "success"
      ? "place-contribution-form__status admin-success"
      : "place-contribution-form__status";
}

function setContributionUploadStatus(message, type = "") {
  if (!els.contributionImageUploadStatus) return;
  els.contributionImageUploadStatus.textContent = message;
  els.contributionImageUploadStatus.className = type === "error"
    ? "place-contribution-form__upload-status place-contribution-form__upload-status--error"
    : type === "success"
      ? "place-contribution-form__upload-status place-contribution-form__upload-status--success"
      : "place-contribution-form__upload-status";
}

function setContributionEntryState(user) {
  currentUser = user || null;
  const isSignedIn = Boolean(user);
  refreshReplyEntryStates();

  if (els.contributionSignedOut) {
    els.contributionSignedOut.hidden = isSignedIn;
  }
  if (els.contributionSignedIn) {
    els.contributionSignedIn.hidden = !isSignedIn;
  }
  if (els.contributionSignInLink) {
    els.contributionSignInLink.href = buildContributionSignInHref();
  }
  if (els.contributionEntryButton) {
    els.contributionEntryButton.disabled = false;
    els.contributionEntryButton.setAttribute("aria-disabled", "false");
    els.contributionEntryButton.textContent = isSignedIn
      ? "Add comments and photos"
      : "Sign in to contribute";
  }
  if (els.contributionEntryHint) {
    els.contributionEntryHint.textContent = isSignedIn
      ? "New submissions stay private until an admin approves them."
      : "Sign in with a public account before adding a place-specific contribution.";
  }
  if (els.contributionSignedInSummary) {
    const identity = cleanText(user?.displayName || user?.email || "your public account");
    els.contributionSignedInSummary.textContent = `Signed in as ${identity}. Your submission will be saved for admin review and will not appear publicly until it is approved.`;
  }
  if (!isSignedIn) {
    setContributionFormStatus("Please sign in before submitting a place-specific contribution.");
    return;
  }
  setContributionFormStatus("");
}

function getContributionFormValues() {
  return {
    contributionText: els.contributionText?.value || "",
    imageUrl: els.contributionImageUrl?.value || "",
    imageCaption: els.contributionImageCaption?.value || "",
    imageCredit: els.contributionImageCredit?.value || "",
    imageRightsStatus: els.contributionImageRightsStatus?.value || "",
    imagePermissionConfirmed: els.contributionImagePermissionConfirmed?.checked === true
  };
}

function resetContributionForm() {
  els.contributionForm?.reset();
  setContributionUploadStatus("No file selected.");
}

function getSelectedContributionImageFile() {
  return els.contributionImageFile?.files?.[0] || null;
}

function getRandomId() {
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getSafeContributionStorageFileId(file) {
  const fallbackName = "contribution-image";
  const safeName = cleanText(file?.name)
    .replace(/[/\\?#%]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 80) || fallbackName;
  return `${getRandomId()}-${safeName}`;
}

function validateContributionImageFile(file) {
  if (!file) return null;
  if (!ALLOWED_CONTRIBUTION_IMAGE_FILE_TYPES.has(file.type)) {
    return "Choose a JPEG, PNG, WebP, or GIF image.";
  }
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_CONTRIBUTION_IMAGE_FILE_SIZE) {
    return "Choose an image file up to 5 MB.";
  }
  return null;
}

function buildUploadedContributionImageMetadata(user, file, storagePath, uploadedAt = serverTimestamp()) {
  return {
    imageStoragePath: storagePath,
    imageFileName: cleanText(file.name),
    imageFileContentType: cleanText(file.type),
    imageFileSize: file.size,
    imageUploadedAt: uploadedAt,
    imageUploadedByUid: cleanText(user.uid),
    imageUploadVisibility: "contribution-private"
  };
}

function createContributionImageUploadPlan(user, file) {
  const draftId = getRandomId();
  const fileId = getSafeContributionStorageFileId(file);
  const storagePath = `place-contribution-images/${cleanText(user.uid)}/${draftId}/${fileId}`;
  return {
    file,
    storagePath,
    metadata: buildUploadedContributionImageMetadata(user, file, storagePath)
  };
}

async function uploadContributionImageFile(uploadPlan) {
  const imageRef = storageRef(storage, uploadPlan.storagePath);
  setContributionUploadStatus("Uploading selected image...");
  await uploadBytes(imageRef, uploadPlan.file, {
    contentType: uploadPlan.file.type,
    customMetadata: {
      uploadedByUid: cleanText(uploadPlan.metadata.imageUploadedByUid),
      visibility: "contribution-private"
    }
  });
  setContributionUploadStatus("Upload complete.", "success");
}

async function deleteUploadedContributionImageFile(uploadPlan) {
  if (!uploadPlan?.storagePath) return;
  await deleteObject(storageRef(storage, uploadPlan.storagePath));
}

function openContributionModal() {
  if (!els.contributionModal) return;
  lastContributionTrigger = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
  els.contributionModal.hidden = false;
  els.contributionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("place-contribution-modal-open");
  window.setTimeout(() => {
    if (currentUser && els.contributionText) {
      els.contributionText.focus();
      return;
    }
    els.contributionModalClose?.focus();
  }, 0);
}

function closeContributionModal() {
  if (!els.contributionModal || els.contributionModal.hidden) return;
  els.contributionModal.hidden = true;
  els.contributionModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("place-contribution-modal-open");
  if (lastContributionTrigger?.isConnected) {
    lastContributionTrigger.focus();
  }
}

async function handleContributionSubmit(event) {
  event.preventDefault();

  if (!currentUser) {
    setContributionFormStatus("Please sign in before submitting a place-specific contribution.", "error");
    return;
  }

  if (!currentPlace?.id) {
    setContributionFormStatus("This place record is still loading. Please try again in a moment.", "error");
    return;
  }

  if (els.contributionSubmitButton) {
    els.contributionSubmitButton.disabled = true;
  }
  setContributionFormStatus("Submitting your contribution for review...");
  let uploadPlan = null;
  let uploadComplete = false;
  let uploadedImageMetadata = {};

  try {
    const selectedImageFile = getSelectedContributionImageFile();
    const fileError = validateContributionImageFile(selectedImageFile);
    if (fileError) {
      setContributionUploadStatus(fileError, "error");
      throw new Error(fileError);
    }

    if (selectedImageFile) {
      uploadPlan = createContributionImageUploadPlan(currentUser, selectedImageFile);
      await uploadContributionImageFile(uploadPlan);
      uploadComplete = true;
      uploadedImageMetadata = uploadPlan.metadata;
    }

    const payload = buildPlaceContributionCreatePayload({
      placeId: currentPlace.id,
      placeTitleSnapshot: getDisplayTitle(currentPlace),
      submittedByUid: currentUser.uid,
      submitterEmail: currentUser.email || "",
      submitterDisplayName: currentUser.displayName || "",
      ...getContributionFormValues(),
      ...uploadedImageMetadata
    }, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await addDoc(collection(db, "placeContributions"), payload);
    resetContributionForm();
    setContributionFormStatus("Thank you. Your contribution has been submitted for review and will not appear publicly until it is approved.", "success");
  } catch (error) {
    console.error("Failed to submit place contribution:", error);
    if (uploadComplete && uploadPlan?.storagePath) {
      try {
        await deleteUploadedContributionImageFile(uploadPlan);
        setContributionUploadStatus("Upload failed. The uploaded file was cleaned up.", "error");
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded contribution image after submission failure:", cleanupError);
        setContributionUploadStatus("Upload failed. Could not clean up the uploaded file automatically.", "error");
      }
    } else if (uploadPlan?.storagePath) {
      setContributionUploadStatus("Upload failed. No contribution record was created.", "error");
    }
    if (error?.code === "permission-denied" || error?.code === "firestore/permission-denied") {
      setContributionFormStatus(
        uploadComplete
          ? "Your image upload succeeded, but current Firestore rules blocked the contribution record. The uploaded file was cleaned up when possible."
          : "Current Firestore rules blocked the contribution record.",
        "error"
      );
      return;
    }
    setContributionFormStatus(error?.message || "Could not submit your contribution right now. Please try again.", "error");
  } finally {
    if (els.contributionSubmitButton) {
      els.contributionSubmitButton.disabled = false;
    }
  }
}

function handleContributionImageFileChange() {
  const selectedImageFile = getSelectedContributionImageFile();
  if (!selectedImageFile) {
    setContributionUploadStatus("No file selected.");
    return;
  }
  const fileError = validateContributionImageFile(selectedImageFile);
  if (fileError) {
    setContributionUploadStatus(fileError, "error");
    return;
  }
  setContributionUploadStatus(`Selected ${selectedImageFile.name}.`, "success");
}

function handleContributionEntryButtonClick() {
  if (!currentUser) {
    window.location.href = buildContributionSignInHref();
    return;
  }
  openContributionModal();
}

function handleContributionModalBackdropClick(event) {
  if (event.target === els.contributionModalBackdrop) {
    closeContributionModal();
  }
}

function handleContributionModalKeydown(event) {
  if (event.key === "Escape") {
    closeContributionModal();
  }
}

async function handleReplySubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  const status = form.querySelector(".place-contribution-reply-entry__status");
  const submitButton = form.querySelector("button[type='submit']");
  const textarea = form.querySelector("textarea[name='replyText']");
  const contributionId = cleanText(form.dataset.contributionId);

  function setStatus(message, type = "") {
    if (!status) return;
    status.textContent = message;
    status.className = type === "error"
      ? "place-contribution-reply-entry__status admin-error"
      : type === "success"
        ? "place-contribution-reply-entry__status admin-success"
        : "place-contribution-reply-entry__status";
  }

  if (!currentUser) {
    setStatus("Please sign in before replying.", "error");
    return;
  }

  if (!currentPlace?.id || !contributionId) {
    setStatus("This contribution is still loading. Please try again in a moment.", "error");
    return;
  }

  try {
    if (submitButton) submitButton.disabled = true;
    setStatus("Submitting reply for review...");

    const payload = buildPlaceContributionReplyCreatePayload({
      placeId: currentPlace.id,
      contributionId,
      replyText: textarea?.value || "",
      submittedByUid: currentUser.uid,
      submittedByDisplayName: currentUser.displayName || ""
    }, {
      submittedAt: serverTimestamp()
    });

    await addDoc(collection(db, "placeContributionReplies"), payload);
    form.reset();
    setStatus("Reply submitted for review.", "success");
  } catch (error) {
    console.error("Failed to submit place contribution reply:", error);
    setStatus(error?.message || "Could not submit your reply right now. Please try again.", "error");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

function getSectionFromUrl() {
  const section = new URLSearchParams(window.location.search).get("section");
  return validSections.has(section) ? section : "overview";
}

function buildSectionUrl(section) {
  const url = new URL(window.location.href);
  url.searchParams.set("section", section);
  url.hash = section === "comments-photos" ? "comments-photos-panel" : "overview-panel";
  return `${url.pathname}${url.search}${url.hash}`;
}

function setActiveSection(section, options = {}) {
  const activeSection = validSections.has(section) ? section : "overview";

  els.tabs.forEach((tab) => {
    const tabSection = tab.dataset.section;
    const isActive = tabSection === activeSection;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
    if (isActive) {
      tab.setAttribute("aria-current", "page");
    } else {
      tab.removeAttribute("aria-current");
    }
  });

  els.panels.forEach((panel) => {
    panel.hidden = panel.dataset.section !== activeSection;
  });

  if (activeSection === "overview" && placeMap) {
    window.setTimeout(() => placeMap.invalidateSize(), 0);
  }

  if (!options.skipHistory) {
    window.history.replaceState({}, "", buildSectionUrl(activeSection));
  }
}

function setupTabs() {
  els.tabs.forEach((tab) => {
    const controls = tab.getAttribute("aria-controls");
    const panel = controls ? document.getElementById(controls) : null;
    const section = controls === "comments-photos-panel" ? "comments-photos" : "overview";
    tab.dataset.section = section;
    if (panel) panel.dataset.section = section;
    tab.href = buildSectionUrl(section);

    tab.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveSection(section);
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const currentIndex = els.tabs.indexOf(tab);
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = els.tabs[(currentIndex + offset + els.tabs.length) % els.tabs.length];
      nextTab.focus();
      setActiveSection(nextTab.dataset.section);
    });
  });
}

function appendMetadata(label, value, emptyText = "Not recorded yet.", options = {}) {
  if (!els.metadata) return;
  const safeValue = cleanText(value);
  if (!safeValue && options.hideIfEmpty) {
    return;
  }
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  if (safeValue) {
    dd.textContent = safeValue;
  } else {
    dd.textContent = emptyText;
    dd.className = "place-empty-value";
  }
  els.metadata.append(dt, dd);
}

function appendHeritageDetail(details, label, value, options = {}) {
  const safeValue = cleanText(value);
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = safeValue || options.emptyText || "Not recorded yet.";
  if (options.long) {
    dt.className = "place-local-heritage__long-label";
    dd.className = "place-local-heritage__long-value";
  }
  if (!safeValue) {
    dd.classList.add("place-empty-value");
  }
  details.append(dt, dd);
  return Boolean(safeValue);
}

function appendHeritageCriteria(details, criteria) {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = "Community heritage criteria";
  dt.className = "place-local-heritage__long-label";
  dd.className = "place-local-heritage__long-value";

  if (criteria.length === 0) {
    dd.textContent = "No criteria recorded yet.";
    dd.classList.add("place-empty-value");
    details.append(dt, dd);
    return false;
  }

  const list = document.createElement("div");
  list.className = "place-local-heritage__criteria";
  criteria.forEach((criterion) => {
    const item = document.createElement("span");
    item.className = "place-local-heritage__criterion";
    item.textContent = criterion;
    list.appendChild(item);
  });

  dd.appendChild(list);
  details.append(dt, dd);
  return true;
}

function renderLocalHeritageRecord(place) {
  if (!els.localHeritageSection || !els.localHeritageContent) return;
  els.localHeritageContent.textContent = "";

  const details = document.createElement("dl");
  details.className = "place-local-heritage__details";
  appendHeritageDetail(details, "Local significance", place.localSignificanceSummary, {
    long: true,
    emptyText: "No local significance summary recorded yet."
  });
  appendHeritageCriteria(details, getHeritageCriteria(place));
  appendHeritageDetail(details, "Criteria explanation", place.criteriaExplanation, {
    long: true,
    emptyText: "No criteria explanation recorded yet."
  });
  appendHeritageDetail(details, "Heritage value", place.heritageValue, {
    long: true,
    emptyText: "No heritage value note recorded yet."
  });
  appendHeritageDetail(details, "Condition", place.condition, {
    emptyText: "No condition note recorded yet."
  });
  appendHeritageDetail(details, "Community use", place.communityUse, {
    long: true,
    emptyText: "No community use note recorded yet."
  });
  appendHeritageDetail(details, "Date added", formatRecordDate(place.dateAdded), {
    emptyText: "Date not recorded yet."
  });
  appendHeritageDetail(details, "Last reviewed", formatRecordDate(place.lastReviewed), {
    emptyText: "No review date recorded yet."
  });
  appendHeritageDetail(details, "Record status", place.recordStatus, {
    emptyText: "No public record status recorded yet."
  });

  els.localHeritageContent.appendChild(details);
}

function renderImage(place) {
  if (!els.imageWrap) return;
  els.imageWrap.textContent = "";
  const imageUrl = toSafeUrl(place.imageUrl);
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = cleanText(place.title) || "Community place image";
    els.imageWrap.appendChild(image);
    return;
  }
  const placeholder = document.createElement("div");
  placeholder.className = "place-record-image__placeholder";
  placeholder.textContent = "Community place";
  els.imageWrap.appendChild(placeholder);
}

function renderImageCredit(place) {
  if (!els.imageCredit) return;
  const source = cleanText(place.source) || "Alex's Photo Board";
  const contributor = cleanText(place.imageCredit || place.contributor);
  els.imageCredit.textContent = "";

  const creditLines = [["Image source", source]];
  if (contributor) creditLines.push(["Contributor", contributor]);

  creditLines.forEach(([label, value]) => {
    const line = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    line.append(strong, value);
    els.imageCredit.appendChild(line);
  });

  const note = document.createElement("span");
  note.textContent = "This image is part of the community place record.";
  els.imageCredit.appendChild(note);
}

function renderTags(place) {
  if (!els.tags) return;
  els.tags.textContent = "";
  const tags = getTags(place);
  if (tags.length === 0) return;
  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    els.tags.appendChild(item);
  });
}

function renderActions(place) {
  if (!els.actions) return;
  els.actions.textContent = "";
  const mapLink = document.createElement("a");
  mapLink.href = buildMapUrl(place);
  mapLink.textContent = "View on map";
  els.actions.appendChild(mapLink);

  const relatedArticle = getRelatedArticleUrl(place);
  if (relatedArticle) {
    const articleLink = document.createElement("a");
    articleLink.href = relatedArticle;
    articleLink.textContent = "Open related story";
    els.actions.appendChild(articleLink);
  }
}

function renderRelatedArticles(place) {
  if (!els.relatedArticles || !els.relatedArticlesSection) return;
  els.relatedArticles.textContent = "";

  const relationshipReport = normalizeRelationshipReferences(place?.relatedArticles, {
    allowedCollections: ARTICLE_RELATIONSHIP_COLLECTIONS
  });
  const relatedArticles = relationshipReport.references;

  if (relationshipReport.warnings.length > 0) {
    console.warn("Skipped unsafe or malformed place relationships:", getRelationshipWarningSummary(relationshipReport.warnings));
  }

  if (relatedArticles.length > 0) {
    els.relatedArticlesSection.hidden = false;
    relatedArticles.forEach((reference) => {
      const link = document.createElement("a");
      link.href = reference.url;
      link.className = "place-related-articles__item";

      const title = document.createElement("span");
      title.className = "place-related-articles__title";
      title.textContent = reference.title;

      const meta = document.createElement("span");
      meta.className = "place-related-articles__meta";
      meta.textContent = reference.collection === "history" ? "History" : "News";

      link.append(title, meta);
      els.relatedArticles.appendChild(link);
    });
    return;
  }

  const legacyArticle = getRelatedArticleUrl(place);
  if (legacyArticle) {
    els.relatedArticlesSection.hidden = false;
    const link = document.createElement("a");
    link.href = legacyArticle;
    link.className = "place-related-articles__item";

    const title = document.createElement("span");
    title.className = "place-related-articles__title";
    title.textContent = "Read related article";

      const meta = document.createElement("span");
      meta.className = "place-related-articles__meta";
      meta.textContent = "Related story";

      link.append(title, meta);
      els.relatedArticles.appendChild(link);
    return;
  }
  els.relatedArticlesSection.hidden = true;
}

function renderSourceReference(place) {
  if (!els.sourceReference) return;
  const sourceReference = cleanText(place.sourceReference);
  if (sourceReference) {
    els.sourceReference.textContent = sourceReference;
    els.sourceReference.classList.remove("place-empty-value");
    return;
  }

  els.sourceReference.textContent = "No source reference recorded yet.";
  els.sourceReference.classList.add("place-empty-value");
}

function getContributionSortTime(contribution) {
  const dateValue = contribution?.reviewedAt || contribution?.updatedAt || contribution?.createdAt;
  if (typeof dateValue?.toMillis === "function") return dateValue.toMillis();
  if (typeof dateValue?.toDate === "function") return dateValue.toDate().getTime();
  const parsed = Date.parse(cleanText(dateValue));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRightsStatus(status) {
  return cleanText(status)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function updateContributionSummary(count, options = {}) {
  if (!els.contributionCount || !els.contributionSummary) return;

  if (options.loading) {
    els.contributionCount.textContent = "Loading approved community contributions...";
    els.contributionSummary.textContent = "Community comments and photos approved for this place will appear here.";
    return;
  }

  if (count === 0) {
    els.contributionCount.textContent = "No approved community contributions yet";
    els.contributionSummary.textContent = "Use the button above to submit a place-specific comment or photo reference. Approved contributions will appear here after review.";
    return;
  }

  const contributionLabel = count === 1
    ? "1 approved community contribution"
    : `${count} approved community contributions`;
  els.contributionCount.textContent = contributionLabel;
  els.contributionSummary.textContent = "Approved community comments and photos connected to this place are shown below.";
}

function renderContributionImage(contribution, card) {
  const imageUrl = toSafeUrl(contribution.imageUrl);
  if (!imageUrl) return;

  const figure = document.createElement("figure");
  figure.className = "place-contribution-card__figure";

  const mediaFrame = document.createElement("div");
  mediaFrame.className = "place-contribution-card__media-frame";

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = cleanText(contribution.imageCaption) || "Community contribution photo";
  mediaFrame.appendChild(image);
  figure.appendChild(mediaFrame);

  const captionParts = [];
  const imageCaption = cleanText(contribution.imageCaption);
  const imageCredit = cleanText(contribution.imageCredit);
  const rightsStatus = formatRightsStatus(contribution.imageRightsStatus);

  if (imageCaption) captionParts.push(imageCaption);
  if (imageCredit) captionParts.push(`Source: ${imageCredit}`);
  if (rightsStatus) captionParts.push(`Rights: ${rightsStatus}`);

  if (captionParts.length > 0) {
    const caption = document.createElement("figcaption");
    caption.textContent = captionParts.join(" | ");
    figure.appendChild(caption);
  }

  card.appendChild(figure);
}

function getReplySortTime(reply) {
  const dateValue = reply?.approvedAt || reply?.submittedAt;
  if (typeof dateValue?.toMillis === "function") return dateValue.toMillis();
  if (typeof dateValue?.toDate === "function") return dateValue.toDate().getTime();
  const parsed = Date.parse(cleanText(dateValue));
  return Number.isFinite(parsed) ? parsed : 0;
}

function renderContributionReplies(replies, footer) {
  if (!Array.isArray(replies) || replies.length === 0 || !footer) return;

  const wrapper = document.createElement("div");
  wrapper.className = "place-contribution-card__replies";

  const heading = document.createElement("p");
  heading.className = "place-contribution-card__reply-heading";
  heading.textContent = replies.length === 1 ? "1 approved reply" : `${replies.length} approved replies`;
  wrapper.appendChild(heading);

  const list = document.createElement("div");
  list.className = "place-contribution-card__reply-list";

  replies
    .slice()
    .sort((a, b) => getReplySortTime(a) - getReplySortTime(b))
    .forEach((reply) => {
      const item = document.createElement("article");
      item.className = "place-contribution-card__reply-item";

      const text = document.createElement("p");
      text.className = "place-contribution-card__reply-text";
      text.textContent = cleanText(reply.replyText) || "Approved reply";
      item.appendChild(text);

      const dateText = formatRecordDate(reply.approvedAt || reply.submittedAt);
      if (dateText) {
        const date = document.createElement("p");
        date.className = "place-contribution-card__reply-date";
        date.textContent = `Approved reply | ${dateText}`;
        item.appendChild(date);
      }

      list.appendChild(item);
    });

  wrapper.appendChild(list);
  footer.appendChild(wrapper);
}

function renderContributionReplyEntry(contribution, card) {
  const contributionId = cleanText(contribution?.id);
  if (!contributionId || !card) return;

  const entry = document.createElement("div");
  entry.className = "place-contribution-reply-entry";

  const signedOut = document.createElement("p");
  signedOut.className = "place-contribution-reply-entry__signed-out";
  signedOut.hidden = Boolean(currentUser);
  const signInLink = document.createElement("a");
  signInLink.className = "place-contribution-reply-entry__sign-in";
  signInLink.href = buildContributionSignInHref();
  signInLink.textContent = "Sign in to reply";
  signedOut.appendChild(signInLink);
  signedOut.append(" to this approved contribution.");

  const form = document.createElement("form");
  form.className = "place-contribution-reply-entry__signed-in";
  form.dataset.contributionId = contributionId;
  form.hidden = !currentUser;
  form.noValidate = true;

  const label = document.createElement("label");
  label.className = "place-contribution-reply-entry__label";
  label.textContent = "Add a reply";
  const textarea = document.createElement("textarea");
  textarea.name = "replyText";
  textarea.rows = 3;
  textarea.maxLength = 2000;
  textarea.placeholder = "Add a short reply for admin review.";
  label.appendChild(textarea);

  const actions = document.createElement("div");
  actions.className = "place-contribution-reply-entry__actions";
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "place-contribution-reply-entry__submit";
  button.textContent = "Submit reply";
  actions.appendChild(button);

  const status = document.createElement("p");
  status.className = "place-contribution-reply-entry__status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  form.append(label, actions, status);
  form.addEventListener("submit", handleReplySubmit);

  entry.append(signedOut, form);
  card.appendChild(entry);
}

function renderApprovedPlaceContributions(contributions, repliesByContribution = {}) {
  if (!els.contributionsList || !els.contributionsEmpty) return;
  els.contributionsList.textContent = "";

  const publicContributions = contributions
    .map((contribution) => {
      const publicContribution = buildPublicPlaceContributionPayload(contribution);
      return publicContribution ? { id: contribution.id, ...publicContribution } : null;
    })
    .filter(Boolean)
    .sort((a, b) => getContributionSortTime(b) - getContributionSortTime(a));

  updateContributionSummary(publicContributions.length);
  els.contributionsEmpty.hidden = publicContributions.length > 0;

  publicContributions.forEach((contribution) => {
    const card = document.createElement("article");
    card.className = "place-contribution-card";

    const dateText = formatRecordDate(contribution.reviewedAt || contribution.updatedAt || contribution.createdAt);
    const contributorName = cleanText(
      contribution.publicContributorName
      || contribution.contributorDisplayName
      || contribution.contributorName
      || "Approved community contributor"
    );

    const header = document.createElement("div");
    header.className = "place-contribution-card__header";

    const avatar = document.createElement("div");
    avatar.className = "place-contribution-card__avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = contributorName.charAt(0).toUpperCase() || "C";

    const identity = document.createElement("div");
    identity.className = "place-contribution-card__identity";

    const name = document.createElement("p");
    name.className = "place-contribution-card__name";
    name.textContent = contributorName;
    identity.appendChild(name);

    if (dateText) {
      const date = document.createElement("p");
      date.className = "place-contribution-card__date";
      date.textContent = dateText;
      identity.appendChild(date);
    }

    header.append(avatar, identity);
    card.appendChild(header);

    const text = cleanText(contribution.contributionText);
    if (text) {
      const paragraph = document.createElement("p");
      paragraph.className = "place-contribution-card__text";
      paragraph.textContent = text;
      card.appendChild(paragraph);
    }

    renderContributionImage(contribution, card);

    const footer = document.createElement("div");
    footer.className = "place-contribution-card__footer";

    const meta = document.createElement("p");
    meta.className = "place-contribution-card__meta";
    meta.textContent = dateText
      ? `Approved community contribution | ${dateText}`
      : "Approved community contribution";
    footer.appendChild(meta);

    renderContributionReplies(repliesByContribution[contribution.id] || [], footer);

    card.appendChild(footer);

    renderContributionReplyEntry(contribution, card);

    els.contributionsList.appendChild(card);
  });
}

async function loadApprovedPlaceContributions(placeId) {
  if (!els.contributionsList || !els.contributionsEmpty) return;
  els.contributionsList.textContent = "";
  els.contributionsEmpty.hidden = false;
  els.contributionsEmpty.textContent = "Loading approved community comments and photos...";
  updateContributionSummary(0, { loading: true });

  try {
    const contributionsQuery = query(
      collection(db, "placeContributions"),
      where("placeId", "==", placeId),
      where("contributionStatus", "==", "approved")
    );
    const repliesQuery = query(
      collection(db, "placeContributionReplies"),
      where("placeId", "==", placeId),
      where("replyStatus", "==", "approved"),
      where("publicSafe", "==", true)
    );
    const [contributionSnapshot, replySnapshot] = await Promise.all([
      getDocs(contributionsQuery),
      getDocs(repliesQuery)
    ]);
    renderApprovedPlaceContributions(
      contributionSnapshot.docs.map((contributionDoc) => ({
        id: contributionDoc.id,
        ...contributionDoc.data()
      })),
      groupPublicPlaceContributionRepliesByContribution(
        replySnapshot.docs.map((replyDoc) => replyDoc.data())
      )
    );
    if (!els.contributionsEmpty.hidden) {
      els.contributionsEmpty.textContent = "No approved community comments or photos have been added yet. Approved community comments and photos will appear here after review.";
    }
  } catch (err) {
    console.error("Failed to load approved place contributions:", err);
    els.contributionsEmpty.hidden = false;
    els.contributionsEmpty.textContent = "Could not load community comments and photos. Please try again later.";
  }
}

function renderLocation(place) {
  if (!els.locationContent) return;
  els.locationContent.textContent = "";

  if (!hasValidCoordinates(place)) {
    const message = document.createElement("p");
    message.className = "place-location__message";
    message.textContent = "Location coordinates are not available yet.";

    const fallbackLink = document.createElement("a");
    fallbackLink.className = "place-location__button";
    fallbackLink.href = buildMapUrl(place);
    fallbackLink.textContent = "Search on full map";

    els.locationContent.append(message, fallbackLink);
    return;
  }

  const mapEl = document.createElement("div");
  mapEl.id = "placeLocationMap";
  mapEl.className = "place-location__map";

  const coords = document.createElement("p");
  coords.className = "place-location__coords";
  coords.textContent = `Coordinates: ${getCoordinateDisplay(place)}`;

  const mapLink = document.createElement("a");
  mapLink.className = "place-location__button";
  mapLink.href = buildMapUrl(place);
  mapLink.textContent = "View on full map";

  els.locationContent.append(mapEl, coords, mapLink);

  if (!window.L) {
    mapEl.textContent = "Map library could not be loaded.";
    return;
  }

  if (placeMap) {
    placeMap.remove();
    placeMap = null;
  }

  placeMap = L.map(mapEl).setView([place.lat, place.lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(placeMap);
  L.marker([place.lat, place.lng]).addTo(placeMap)
    .bindPopup(cleanText(place.title) || "Community place");
}

function injectJsonLd(place) {
  const generatedJsonLd = buildPlaceJsonLd(place, window.location.href);
  const jsonld = hasUsableJsonLd(place.jsonld)
    ? { ...generatedJsonLd, ...place.jsonld }
    : generatedJsonLd;
  let script = document.getElementById("place-jsonld");
  if (!script) {
    script = document.createElement("script");
    script.id = "place-jsonld";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonld, null, 2);
}

function renderPlace(place) {
  currentPlace = place;
  const summary = buildPublicPlaceSummary(place);
  const title = getDisplayTitle(place);
  const category = summary.category;
  const publicDescription = getPublicDescription(place);
  document.title = `${title} | Alex's Photo Board`;
  if (els.title) els.title.textContent = title;
  if (els.breadcrumbTitle) els.breadcrumbTitle.textContent = title;
  if (els.description) els.description.textContent = publicDescription;

  if (els.metadata) {
    els.metadata.textContent = "";
    appendMetadata("Category", category);
    appendMetadata("Asset type", getAssetType(place), "No asset type recorded yet.");
    appendMetadata("Location / Address", formatPlaceLocationAddress(place), "No location/address recorded yet.");
    appendMetadata("Coordinates", summary.coordinates, "Location coordinates are not available yet.");
    appendMetadata("Associated type", place.associatedType, "No associated type recorded yet.", { hideIfEmpty: true });
    appendMetadata("Period", place.period, "No period recorded yet.", { hideIfEmpty: true });
    appendMetadata("Grade", place.grade, "No grade or classification recorded yet.", { hideIfEmpty: true });
  }

  renderImage(place);
  renderImageCredit(place);
  renderTags(place);
  renderActions(place);
  renderLocalHeritageRecord(place);
  renderSourceReference(place);
  renderRelatedArticles(place);
  renderLocation(place);
  injectJsonLd(place);
  setActiveSection(getSectionFromUrl(), { skipHistory: true });

  if (els.status) els.status.textContent = "";
  if (els.content) els.content.hidden = false;
}

async function loadPlace() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    if (els.status) els.status.textContent = "No community place record was requested.";
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, "communityPlaces", id));
    if (!snapshot.exists()) {
      if (els.status) els.status.textContent = "Community place record not found.";
      return;
    }
    const data = snapshot.data();
    renderPlace({
      id: snapshot.id,
      ...data,
      lat: normalizeCoordinate(data.lat),
      lng: normalizeCoordinate(data.lng)
    });
    await loadApprovedPlaceContributions(snapshot.id);
  } catch (err) {
    console.error("Failed to load community place:", err);
    if (els.status) els.status.textContent = "Could not load this community place record. Please try again later.";
  }
}

function setupContributionForm() {
  setContributionEntryState(auth.currentUser || null);
  els.contributionEntryButton?.addEventListener("click", handleContributionEntryButtonClick);
  els.contributionModalClose?.addEventListener("click", closeContributionModal);
  els.contributionModalCancel?.addEventListener("click", closeContributionModal);
  els.contributionModalBackdrop?.addEventListener("click", handleContributionModalBackdropClick);
  els.contributionModal?.addEventListener("keydown", handleContributionModalKeydown);
  els.contributionForm?.addEventListener("submit", handleContributionSubmit);
  els.contributionImageFile?.addEventListener("change", handleContributionImageFileChange);

  onAuthStateChanged(auth, (user) => {
    setContributionEntryState(user);
  });
}

setupTabs();
setupContributionForm();
loadPlace();
