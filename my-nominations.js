import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDr8hSSoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let authResolved = false;

function cleanText(value) {
  return String(value || "").trim();
}

function buildSignInHref() {
  return "public-auth.html?next=my-nominations.html";
}

function setStatus(message, type = "") {
  const status = document.getElementById("myNominationsStatus");
  if (!status) return;
  status.textContent = message;
  status.className = type === "error"
    ? "admin-error"
    : type === "success"
      ? "admin-success"
      : "admin-status";
}

function normalizeNominationStatus(status) {
  return cleanText(status).toLowerCase();
}

function getPublicStatusLabel(status) {
  switch (normalizeNominationStatus(status)) {
    case "submitted":
      return "Submitted for review";
    case "under review":
    case "underreview":
      return "Under review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Not accepted";
    case "needs more information":
    case "needsmoreinfo":
      return "More information may be needed";
    case "promoted":
      return "Published as a community place";
    default:
      return "Submitted for review";
  }
}

function formatTimestamp(value) {
  if (!value) return "Pending";

  const date = typeof value?.toDate === "function"
    ? value.toDate()
    : value?.seconds
      ? new Date(value.seconds * 1000)
      : value instanceof Date
        ? value
        : null;

  if (!date || !Number.isFinite(date.getTime())) {
    return "Pending";
  }

  return date.toLocaleString();
}

function getSortTimestamp(record) {
  const source = record.submittedAt || record.createdAt || null;
  if (!source) return 0;
  if (typeof source?.toMillis === "function") return source.toMillis();
  if (source?.seconds) return source.seconds * 1000;
  if (source instanceof Date) return source.getTime();
  return 0;
}

function createDetailRow(label, value) {
  const text = cleanText(value);
  if (!text) return null;

  const wrapper = document.createElement("div");
  wrapper.className = "manage-nominations-card__detail";

  const dt = document.createElement("dt");
  dt.textContent = label;

  const dd = document.createElement("dd");
  dd.textContent = text;

  wrapper.append(dt, dd);
  return wrapper;
}

function renderNominations(records) {
  const container = document.getElementById("myNominationsList");
  if (!container) return;
  container.textContent = "";

  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.className = "my-nominations-empty";
    empty.textContent = "You have not submitted any nominations yet.";
    container.appendChild(empty);
    return;
  }

  records.forEach((record) => {
    const article = document.createElement("article");
    article.className = "manage-nominations-card";

    const summary = document.createElement("div");
    summary.className = "manage-nominations-card__summary";

    const heading = document.createElement("div");
    heading.className = "manage-nominations-card__heading";

    const title = document.createElement("h3");
    title.textContent = cleanText(record.title) || "Untitled nomination";

    const chips = document.createElement("div");
    chips.className = "manage-nominations-card__chips";

    const statusChip = document.createElement("span");
    statusChip.className = "manage-nominations-card__chip manage-nominations-card__chip--status";
    statusChip.textContent = getPublicStatusLabel(record.nominationStatus);
    chips.appendChild(statusChip);

    heading.append(title, chips);

    const details = document.createElement("dl");
    details.className = "manage-nominations-card__detail-grid";
    [
      createDetailRow("Area", record.area),
      createDetailRow("Location", record.address),
      createDetailRow("Submitted", formatTimestamp(record.submittedAt || record.createdAt)),
      createDetailRow("Submission type", cleanText(record.submissionAuthType) === "signedIn" ? "Signed in account" : "")
    ].filter(Boolean).forEach((row) => details.appendChild(row));

    const description = cleanText(record.localSignificanceSummary || record.description);
    if (description) {
      const summaryText = document.createElement("p");
      summaryText.className = "my-nominations-summary";
      summaryText.textContent = description;
      summary.append(heading, details, summaryText);
    } else {
      summary.append(heading, details);
    }

    article.appendChild(summary);
    container.appendChild(article);
  });
}

async function loadNominationsForUser(user) {
  const nominationsQuery = query(
    collection(db, "placeNominations"),
    where("submittedByUid", "==", user.uid)
  );
  const snapshot = await getDocs(nominationsQuery);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
    .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));
}

async function handleSignedInUser(user) {
  const signedOut = document.getElementById("myNominationsSignedOut");
  const signedIn = document.getElementById("myNominationsSignedIn");
  const email = document.getElementById("myNominationsCurrentEmail");

  if (signedOut) signedOut.hidden = true;
  if (signedIn) signedIn.hidden = false;
  if (email) email.textContent = cleanText(user?.email);

  console.log("Auth state resolved: signed in");
  setStatus("Loading your nominations...");

  try {
    const records = await loadNominationsForUser(user);
    renderNominations(records);
    setStatus(
      records.length === 0
        ? "No nominations are linked to this account yet."
        : `Loaded ${records.length} nomination${records.length === 1 ? "" : "s"}.`,
      records.length === 0 ? "" : "success"
    );
  } catch (error) {
    console.error("Failed to load account nominations:", error);
    renderNominations([]);
    if (error?.code === "permission-denied" || error?.code === "firestore/permission-denied") {
      setStatus(
        "You are signed in, but this page could not access your nominations. Please try again later or contact the site admin.",
        "error"
      );
      return;
    }
    setStatus("Could not load your nominations. Please try again later or contact the site admin.", "error");
  }
}

function handleSignedOutUser() {
  const signedOut = document.getElementById("myNominationsSignedOut");
  const signedIn = document.getElementById("myNominationsSignedIn");
  const container = document.getElementById("myNominationsList");

  if (signedOut) signedOut.hidden = false;
  if (signedIn) signedIn.hidden = true;
  if (container) container.textContent = "";
  console.log("Auth state resolved: signed out");
  setStatus("Please sign in to view your nominations.");
}

window.addEventListener("DOMContentLoaded", () => {
  const signedOut = document.getElementById("myNominationsSignedOut");
  const signedIn = document.getElementById("myNominationsSignedIn");
  if (signedOut) signedOut.hidden = true;
  if (signedIn) signedIn.hidden = true;
  setStatus("Checking sign-in...");

  document.querySelectorAll('#myNominationsSignInLink, #myNominationsPrimarySignInLink').forEach((link) => {
    link.setAttribute("href", buildSignInHref());
  });

  onAuthStateChanged(auth, (user) => {
    authResolved = true;
    if (!user) {
      handleSignedOutUser();
      return;
    }

    handleSignedInUser(user);
  });
});
