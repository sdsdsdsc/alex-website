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
  buildNominationDebugSummary,
  buildNominationOwnershipMetadata,
  buildSubmittedNominationPayload
} from "./heritage-engine/nominations.js?v=2026-06-27-16e-diagnosis";

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
let authResolved = false;
const debugNomination = new URLSearchParams(window.location.search).get("debugNomination") === "1";

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

function readNominationFormValues(formData) {
  const values = {};
  FORM_TEXT_FIELDS.forEach((field) => {
    values[field] = cleanText(formData.get(field));
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

function buildNominationPayload(formData, user) {
  return buildSubmittedNominationPayload(readNominationFormValues(formData), {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    submittedAt: serverTimestamp(),
    ownershipMetadata: buildNominationOwnershipMetadata(user)
  });
}

function showStatus(element, message, type = "") {
  if (!element) return;
  element.textContent = message;
  element.className = "nomination-submit__status";
  if (type) element.classList.add(`nomination-submit__status--${type}`);
}

const form = document.getElementById("nominationForm");
const submitButton = document.getElementById("nominationSubmitButton");
const status = document.getElementById("nominationFormStatus");
const signInRequiredSection = document.getElementById("nominationAuthRequired");
const signedInSection = document.getElementById("nominationAuthSignedIn");
const signedInEmail = document.getElementById("nominationSignedInEmail");
const signInLink = document.getElementById("nominationAuthLink");

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

  let payload;
  try {
    payload = buildNominationPayload(new FormData(form), user);
  } catch (err) {
    showStatus(status, err.message || "Please check the nomination details.", "error");
    return;
  }

  if (debugNomination) {
    const debugSummary = buildNominationDebugSummary(payload);
    window.__lastNominationDebug = debugSummary;
    console.info("Nomination debug payload summary:", debugSummary);
    showStatus(status, "Debug mode: payload logged. Firestore write skipped.", "success");
    return;
  }

  const safePayloadSummary = buildNominationDebugSummary(payload);
  console.info("Nomination normal-mode payload summary:", safePayloadSummary);

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await addDoc(collection(db, "placeNominations"), payload);
    form.reset();
    fillNominationCoordinates();
    showStatus(
      status,
      "Thank you. Your nomination has been submitted for review. It has not been published and does not create an official designation.",
      "success"
    );
  } catch (err) {
    console.error("Nomination submission failed:", {
      code: err?.code || "",
      message: err?.message || "",
      payloadSummary: safePayloadSummary || buildNominationDebugSummary(payload)
    });
    showStatus(
      status,
      "Sorry, the nomination could not be submitted. Please check the form and try again.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit nomination for review";
  }
});

export { buildNominationPayload };
