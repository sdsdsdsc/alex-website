import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp
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
  buildNominationDebugSummary,
  buildNominationOwnershipMetadata,
  buildSubmittedNominationPayload
} from "./heritage-engine/nominations.js?v=2026-07-04-evidence-upload-timestamp-fix";

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
let authResolved = false;
const debugNomination = new URLSearchParams(window.location.search).get("debugNomination") === "1";
const MAX_EVIDENCE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EVIDENCE_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

const FORM_TEXT_FIELDS = [
  "title",
  "assetType",
  "area",
  "address",
  "lat",
  "lng",
  "description",
  "localSignificanceSummary",
  "criteriaExplanation",
  "condition",
  "communityUse",
  "sourceReference",
  "evidenceImageUrl",
  "evidenceImageCaption",
  "evidenceSourceCredit",
  "evidenceRightsStatus",
  "nominatorDisplayName",
  "nominatorEmail",
  "organisationName",
  "submittedOnBehalfOf"
];

function cleanText(value) {
  return String(value || "").trim();
}

function getNominationCoordinatesFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const latParam = cleanText(params.get("lat"));
  const lngParam = cleanText(params.get("lng"));
  if (!latParam || !lngParam) return null;

  const lat = Number(latParam);
  const lng = Number(lngParam);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

function fillNominationCoordinates() {
  const coordinates = getNominationCoordinatesFromUrl();
  if (!coordinates) return;

  const latInput = document.getElementById("nominationLat");
  const lngInput = document.getElementById("nominationLng");
  if (latInput && !cleanText(latInput.value)) {
    latInput.value = String(coordinates.lat);
  }
  if (lngInput && !cleanText(lngInput.value)) {
    lngInput.value = String(coordinates.lng);
  }
}

function readNominationFormValues(formData, uploadedEvidenceMetadata = {}) {
  const values = {};
  FORM_TEXT_FIELDS.forEach((field) => {
    values[field] = cleanText(formData.get(field));
  });
  Object.entries(uploadedEvidenceMetadata).forEach(([field, value]) => {
    values[field] = value;
  });
  values.heritageCriteria = formData.getAll("heritageCriteria").map(cleanText).filter(Boolean);
  [
    "projectPositionAccepted",
    "reviewAccepted",
    "evidencePermissionConfirmed",
    "privacyAccepted",
    "termsAccepted"
  ].forEach((field) => {
    values[field] = formData.get(field) === "on";
  });
  return values;
}

function buildPublicAuthUrlWithNext() {
  const authUrl = new URL("public-auth.html", window.location.href);
  authUrl.searchParams.set("next", `${window.location.pathname}${window.location.search}`);
  return `${authUrl.pathname}${authUrl.search}`;
}

function buildNominationPayload(formData, user, uploadedEvidenceMetadata = {}) {
  return buildSubmittedNominationPayload(readNominationFormValues(formData, uploadedEvidenceMetadata), {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    submittedAt: serverTimestamp(),
    ownershipMetadata: buildNominationOwnershipMetadata(user)
  });
}

function buildSafeNominationWriteLog(payload) {
  const debugSummary = buildNominationDebugSummary(payload);
  const evidenceFieldsPresent = Object.fromEntries(
    Object.entries(debugSummary.evidence).filter(([field]) => Object.prototype.hasOwnProperty.call(payload, field))
  );

  return {
    payloadKeys: debugSummary.keys,
    fieldTypes: debugSummary.fieldTypes,
    evidenceFieldsPresent,
    missingRequiredFields: debugSummary.missingRequiredFields,
    forbiddenExtraFields: debugSummary.forbiddenExtraFields,
    undefinedFields: debugSummary.undefinedFields
  };
}

function showStatus(element, message, type = "") {
  if (!element) return;
  element.textContent = message;
  element.className = "nomination-submit__status";
  if (type) element.classList.add(`nomination-submit__status--${type}`);
}

function showUploadStatus(message, type = "") {
  const element = document.getElementById("nominationEvidenceUploadStatus");
  if (!element) return;
  element.textContent = message;
  element.className = "nomination-upload-status";
  if (type) element.classList.add(`nomination-upload-status--${type}`);
}

function getSelectedEvidenceFile() {
  const input = document.getElementById("nominationEvidenceFile");
  return input?.files?.[0] || null;
}

function getRandomId() {
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getSafeStorageFileId(file) {
  const fallbackName = "evidence-image";
  const safeName = cleanText(file?.name)
    .replace(/[/\\?#%]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 80) || fallbackName;
  return `${getRandomId()}-${safeName}`;
}

function validateEvidenceFile(file) {
  if (!file) return null;
  if (!ALLOWED_EVIDENCE_FILE_TYPES.has(file.type)) {
    return "Choose a JPEG, PNG, WebP, or GIF image.";
  }
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_EVIDENCE_FILE_SIZE) {
    return "Choose an image file up to 5 MB.";
  }
  return null;
}

function buildUploadedEvidenceMetadata(user, file, storagePath, uploadedAt = serverTimestamp()) {
  return {
    evidenceStoragePath: storagePath,
    evidenceFileName: cleanText(file.name),
    evidenceFileContentType: cleanText(file.type),
    evidenceFileSize: file.size,
    evidenceUploadedAt: uploadedAt,
    evidenceUploadedByUid: cleanText(user.uid),
    evidenceVisibility: "nomination-private"
  };
}

function createEvidenceUploadPlan(user, file) {
  const draftId = getRandomId();
  const fileId = getSafeStorageFileId(file);
  const storagePath = `nomination-evidence/${cleanText(user.uid)}/${draftId}/${fileId}`;
  return {
    file,
    storagePath,
    metadata: buildUploadedEvidenceMetadata(user, file, storagePath)
  };
}

async function uploadEvidenceFile(uploadPlan) {
  const evidenceRef = storageRef(storage, uploadPlan.storagePath);
  await uploadBytes(evidenceRef, uploadPlan.file, {
    contentType: uploadPlan.file.type,
    customMetadata: {
      uploadedByUid: cleanText(uploadPlan.metadata.evidenceUploadedByUid),
      visibility: "nomination-private"
    }
  });
}

async function deleteUploadedEvidenceFile(uploadPlan) {
  if (!uploadPlan?.storagePath) return;
  await deleteObject(storageRef(storage, uploadPlan.storagePath));
}

const form = document.getElementById("nominationForm");
const submitButton = document.getElementById("nominationSubmitButton");
const status = document.getElementById("nominationFormStatus");
const signInRequiredSection = document.getElementById("nominationAuthRequired");
const signedInSection = document.getElementById("nominationAuthSignedIn");
const signedInEmail = document.getElementById("nominationSignedInEmail");
const signInLink = document.getElementById("nominationAuthLink");
const evidenceFileInput = document.getElementById("nominationEvidenceFile");

function setNominationAccessState(user) {
  if (signInLink) {
    signInLink.href = buildPublicAuthUrlWithNext();
  }

  if (signInRequiredSection) signInRequiredSection.hidden = Boolean(user);
  if (signedInSection) signedInSection.hidden = !user;
  if (signedInEmail) signedInEmail.textContent = cleanText(user?.email) || "";

  if (submitButton) {
    submitButton.disabled = !user;
  }

  if (!user) {
    console.log("Auth state resolved: signed out");
    showStatus(status, "Please sign in before submitting a place nomination.", "error");
    return;
  }

  console.log("Auth state resolved: signed in");
  showStatus(
    status,
    `You are signed in as ${cleanText(user.email)}. This nomination will be linked privately to your account.`,
    "success"
  );
}

fillNominationCoordinates();
if (submitButton) {
  submitButton.disabled = true;
}
if (signInRequiredSection) signInRequiredSection.hidden = true;
if (signedInSection) signedInSection.hidden = true;
showStatus(status, "Checking sign-in...");
showUploadStatus("No file selected.");

evidenceFileInput?.addEventListener("change", () => {
  const file = getSelectedEvidenceFile();
  if (!file) {
    showUploadStatus("No file selected.");
    return;
  }

  const fileError = validateEvidenceFile(file);
  if (fileError) {
    showUploadStatus(fileError, "error");
    return;
  }

  showUploadStatus(`Selected ${file.name}. It will upload privately when you submit.`, "success");
});

onAuthStateChanged(auth, (user) => {
  authResolved = true;
  setNominationAccessState(user);
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showStatus(status, "");

  if (!authResolved) {
    showStatus(status, "Checking sign-in...", "error");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    setNominationAccessState(null);
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    showStatus(status, "Please complete the required fields and acknowledgements.", "error");
    return;
  }

  const evidenceFile = getSelectedEvidenceFile();
  const fileError = validateEvidenceFile(evidenceFile);
  if (fileError) {
    showUploadStatus(fileError, "error");
    showStatus(status, "Please choose a valid evidence image or remove the selected file.", "error");
    return;
  }

  const uploadPlan = evidenceFile ? createEvidenceUploadPlan(user, evidenceFile) : null;
  const uploadedEvidenceMetadata = uploadPlan?.metadata || {};

  let payload;
  try {
    payload = buildNominationPayload(new FormData(form), user, uploadedEvidenceMetadata);
  } catch (err) {
    showStatus(status, err.message || "Please check the nomination details.", "error");
    return;
  }

  if (debugNomination) {
    const safePayloadLog = buildSafeNominationWriteLog(payload);
    window.__lastNominationDebug = safePayloadLog;
    console.info("Nomination debug payload summary:", safePayloadLog);
    showStatus(status, "Debug mode: payload logged. Firestore write skipped.", "success");
    return;
  }

  const safePayloadLog = buildSafeNominationWriteLog(payload);
  console.info("Nomination pre-submit payload summary:", safePayloadLog);

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  let uploadSucceeded = false;

  try {
    if (uploadPlan) {
      showUploadStatus("Uploading evidence image...");
      await uploadEvidenceFile(uploadPlan);
      uploadSucceeded = true;
      showUploadStatus("Upload complete.", "success");
    }

    await addDoc(collection(db, "placeNominations"), payload);
    form.reset();
    fillNominationCoordinates();
    showUploadStatus("No file selected.");
    showStatus(
      status,
      "Thank you. Your nomination has been submitted for review. It has not been published and does not create an official designation.",
      "success"
    );
  } catch (err) {
    let uploadCleanup = null;
    const isStorageError = Boolean(err?.code?.startsWith("storage/"));
    if (uploadSucceeded && uploadPlan && !isStorageError) {
      try {
        await deleteUploadedEvidenceFile(uploadPlan);
        uploadCleanup = "deleted-uploaded-evidence";
        showUploadStatus("Upload removed after nomination submission failed.", "error");
      } catch (cleanupErr) {
        uploadCleanup = "cleanup-failed";
        showUploadStatus("Upload cleanup failed after nomination submission failed.", "error");
        console.error("Nomination evidence cleanup failed:", JSON.stringify({
          code: cleanupErr?.code || "",
          message: cleanupErr?.message || "",
          storagePath: uploadPlan.storagePath
        }));
      }
    }

    const failureSummary = {
      code: err?.code || "",
      message: err?.message || "",
      payloadSummary: safePayloadLog,
      storagePath: uploadPlan?.storagePath || "",
      uploadCleanup
    };
    console.error("Nomination submission failed:", JSON.stringify(failureSummary));
    showStatus(
      status,
      isStorageError
        ? "Upload failed. Please check the selected image and try again."
        : `Sorry, the nomination could not be submitted (${err?.code || "unknown error"}). ${
          uploadCleanup === "deleted-uploaded-evidence"
            ? "The uploaded image was removed; please try again."
            : "Please check the form and try again."
        }`,
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit nomination for review";
  }
});

export { buildNominationPayload };
