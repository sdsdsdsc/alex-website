import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const APPROVED_CRITERIA = new Set([
  "Historic interest",
  "Social or communal value",
  "Landmark or streetscape value",
  "Architectural, design or artistic interest",
  "Archaeological or evidential interest",
  "Rarity",
  "Group value",
  "Age",
  "Condition or vulnerability"
]);

const SUBMISSION_ROLES = new Set(["self", "someone-else", "organisation"]);
const FIELD_LIMITS = {
  title: 160,
  assetType: 100,
  area: 160,
  address: 1000,
  description: 5000,
  localSignificanceSummary: 2000,
  criteriaExplanation: 5000,
  condition: 1500,
  communityUse: 1500,
  sourceReference: 2000,
  photoUrl: 2048,
  photoDescription: 1000,
  nominatorDisplayName: 120,
  nominatorEmail: 254,
  organisationName: 180
};

const REQUIRED_TEXT_FIELDS = [
  ["title", "Enter the place or asset name."],
  ["address", "Enter an address or clear location description."],
  ["description", "Describe the place."],
  ["localSignificanceSummary", "Explain why the place matters locally."],
  ["criteriaExplanation", "Explain the evidence for the selected criteria."],
  ["nominatorEmail", "Enter an email address for admin follow-up."]
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

function readText(formData, field) {
  const value = cleanText(formData.get(field));
  const limit = FIELD_LIMITS[field];
  if (limit && value.length > limit) {
    throw new Error(`${field} is too long.`);
  }
  return value;
}

function parseCoordinate(formData, field, min, max) {
  const value = cleanText(formData.get(field));
  if (!value) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(`Enter a valid ${field === "lat" ? "latitude" : "longitude"}.`);
  }
  return number;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (err) {
    return false;
  }
}

function addOptionalText(payload, field, value) {
  if (value) payload[field] = value;
}

function buildNominationPayload(formData) {
  const values = {};
  Object.keys(FIELD_LIMITS).forEach((field) => {
    values[field] = readText(formData, field);
  });

  for (const [field, message] of REQUIRED_TEXT_FIELDS) {
    if (!values[field]) throw new Error(message);
  }

  if (!isValidEmail(values.nominatorEmail)) {
    throw new Error("Enter a valid email address.");
  }
  if (!isValidHttpUrl(values.photoUrl)) {
    throw new Error("Photo URL must begin with http:// or https://.");
  }

  const submittedCriteria = formData.getAll("heritageCriteria").map(cleanText).filter(Boolean);
  if (submittedCriteria.some((value) => !APPROVED_CRITERIA.has(value))) {
    throw new Error("One or more heritage criteria are not recognised.");
  }
  const heritageCriteria = [...new Set(submittedCriteria)];
  if (heritageCriteria.length === 0) {
    throw new Error("Select at least one community heritage criterion.");
  }

  const requiredAcknowledgements = [
    "projectPositionAccepted",
    "reviewAccepted",
    "privacyAccepted",
    "termsAccepted"
  ];
  if (requiredAcknowledgements.some((field) => formData.get(field) !== "on")) {
    throw new Error("Accept all required terms and privacy acknowledgements.");
  }

  const submittedOnBehalfOf = cleanText(formData.get("submittedOnBehalfOf"));
  if (!SUBMISSION_ROLES.has(submittedOnBehalfOf)) {
    throw new Error("Select who the nomination is being submitted for.");
  }

  const payload = {
    title: values.title,
    address: values.address,
    description: values.description,
    localSignificanceSummary: values.localSignificanceSummary,
    heritageCriteria,
    criteriaExplanation: values.criteriaExplanation,
    nominatorEmail: values.nominatorEmail,
    submittedOnBehalfOf,
    termsAccepted: true,
    privacyAccepted: true,
    nominationStatus: "submitted",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    submittedAt: serverTimestamp()
  };

  addOptionalText(payload, "assetType", values.assetType);
  addOptionalText(payload, "area", values.area);
  addOptionalText(payload, "condition", values.condition);
  addOptionalText(payload, "communityUse", values.communityUse);
  addOptionalText(payload, "sourceReference", values.sourceReference);
  addOptionalText(payload, "photoUrl", values.photoUrl);
  addOptionalText(payload, "photoDescription", values.photoDescription);
  addOptionalText(payload, "nominatorDisplayName", values.nominatorDisplayName);
  addOptionalText(payload, "organisationName", values.organisationName);

  const lat = parseCoordinate(formData, "lat", -90, 90);
  const lng = parseCoordinate(formData, "lng", -180, 180);
  if (lat !== null) payload.lat = lat;
  if (lng !== null) payload.lng = lng;

  return payload;
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

fillNominationCoordinates();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showStatus(status, "");

  if (!form.checkValidity()) {
    form.reportValidity();
    showStatus(status, "Please complete the required fields and acknowledgements.", "error");
    return;
  }

  let payload;
  try {
    payload = buildNominationPayload(new FormData(form));
  } catch (err) {
    showStatus(status, err.message || "Please check the nomination details.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await addDoc(collection(db, "placeNominations"), payload);
    form.reset();
    showStatus(
      status,
      "Thank you. Your nomination has been submitted for review. It has not been published and does not create an official designation.",
      "success"
    );
  } catch (err) {
    console.error("Nomination submission failed:", err);
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
