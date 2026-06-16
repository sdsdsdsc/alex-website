import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  collection,
  getDocs,
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDr8hSSoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const ADMIN_UID = "VT3I9KMktMXsdJeyYBye54Sgnqu2";
const BACKUP_COLLECTIONS = [
  "communityPlaces",
  "placeNominations",
  "news",
  "history"
];

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function buildLoginUrl() {
  const loginUrl = new URL("admin-login.html", window.location.href);
  loginUrl.searchParams.set("next", `${window.location.pathname}${window.location.search}`);
  return loginUrl.href;
}

function buildDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function serializeBackupValue(value) {
  if (!value) return value;
  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return {
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
      iso: Number.isNaN(date.getTime()) ? "" : date.toISOString()
    };
  }
  if (Array.isArray(value)) return value.map(serializeBackupValue);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, serializeBackupValue(entry)])
    );
  }
  return value;
}

function setStatus(message, type = "") {
  const status = document.getElementById("adminExportStatus");
  if (!status) return;
  status.textContent = message;
  status.className = type === "error" ? "admin-error" : type === "success" ? "admin-success" : "admin-status";
}

async function fetchCollectionBackup(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    data: serializeBackupValue(docSnap.data())
  }));
}

function buildBackupPayload(collectionName, records) {
  return {
    backupType: "admin-internal",
    project: "alex-photo-board",
    collection: collectionName,
    exportedAt: new Date().toISOString(),
    recordCount: records.length,
    warning: "Private/internal admin backup. Do not publish publicly.",
    records
  };
}

function downloadJsonFile(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadCollectionBackup(collectionName) {
  const button = document.querySelector(`[data-backup-collection="${collectionName}"]`);
  if (button) button.disabled = true;
  setStatus(`Preparing ${collectionName} backup...`);

  try {
    const records = await fetchCollectionBackup(collectionName);
    const payload = buildBackupPayload(collectionName, records);
    downloadJsonFile(`${collectionName}-backup-${buildDateStamp()}.json`, payload);
    setStatus(`${collectionName} backup downloaded.`, "success");
  } catch (err) {
    console.error(`${collectionName} backup failed:`, err);
    setStatus(`Could not download ${collectionName} backup. Check admin sign-in and Firestore rules.`, "error");
  } finally {
    if (button) button.disabled = false;
  }
}

async function downloadAllBackupData() {
  const button = document.querySelector("[data-backup-all]");
  if (button) button.disabled = true;
  setStatus("Preparing all backup data...");

  try {
    const collectionEntries = await Promise.all(
      BACKUP_COLLECTIONS.map(async (collectionName) => [
        collectionName,
        buildBackupPayload(collectionName, await fetchCollectionBackup(collectionName))
      ])
    );
    const payload = {
      backupType: "admin-internal",
      project: "alex-photo-board",
      exportedAt: new Date().toISOString(),
      warning: "Private/internal admin backup. Do not publish publicly.",
      collections: Object.fromEntries(collectionEntries)
    };
    downloadJsonFile(`alex-photo-board-backup-${buildDateStamp()}.json`, payload);
    setStatus("All backup data downloaded.", "success");
  } catch (err) {
    console.error("All backup data failed:", err);
    setStatus("Could not download all backup data. Check admin sign-in and Firestore rules.", "error");
  } finally {
    if (button) button.disabled = false;
  }
}

function bindBackupActions() {
  document.querySelectorAll("[data-backup-collection]").forEach((button) => {
    button.addEventListener("click", () => downloadCollectionBackup(button.dataset.backupCollection));
  });
  document.querySelector("[data-backup-all]")?.addEventListener("click", downloadAllBackupData);
}

function showAdminPage() {
  const page = document.getElementById("adminExportPage");
  if (page) page.hidden = false;
  setStatus("Signed in. Choose a private backup download.");
  bindBackupActions();
}

function initAdminExport() {
  const signOutButton = document.getElementById("adminExportSignOut");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = buildLoginUrl();
      return;
    }
    if (user.uid !== ADMIN_UID) {
      setStatus("This page is restricted to the configured admin account.", "error");
      await signOut(auth);
      return;
    }
    showAdminPage();
  });

  signOutButton?.addEventListener("click", async () => {
    signOutButton.disabled = true;
    try {
      await signOut(auth);
      window.location.href = "admin-login.html";
    } catch (err) {
      console.error("Sign out failed:", err);
      signOutButton.disabled = false;
    }
  });
}

initAdminExport();
