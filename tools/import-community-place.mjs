import { readFile } from "node:fs/promises";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const [, , inputPath] = process.argv;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!inputPath) {
  fail("Usage: node tools/import-community-place.mjs data/community-places/manurewa-community-centre.json");
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  fail("GOOGLE_APPLICATION_CREDENTIALS is not set. Keep the service account key outside this repo and point the environment variable to that local file.");
}

function cleanText(value) {
  return String(value || "").trim();
}

function asOptionalString(value) {
  return value === undefined || value === null ? "" : cleanText(value);
}

function asOptionalNumber(value, fieldName) {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    fail(`${fieldName} must be a number when provided.`);
  }
  return numberValue;
}

function asTags(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.map(cleanText).filter(Boolean);
  return cleanText(value).split(",").map(cleanText).filter(Boolean);
}

function normalizeRecord(rawRecord) {
  const id = cleanText(rawRecord.id);
  if (!id) fail("Record JSON must include an id field, for example manurewa-community-centre.");

  const title = cleanText(rawRecord.title);
  if (!title) fail("Record JSON must include a title.");

  const record = {
    title,
    category: asOptionalString(rawRecord.category),
    location: asOptionalString(rawRecord.location),
    period: asOptionalString(rawRecord.period),
    description: asOptionalString(rawRecord.description),
    imageUrl: asOptionalString(rawRecord.imageUrl),
    tags: asTags(rawRecord.tags),
    grade: asOptionalString(rawRecord.grade),
    source: asOptionalString(rawRecord.source),
    relatedArticle: asOptionalString(rawRecord.relatedArticle),
    createdAt: FieldValue.serverTimestamp()
  };

  const lat = asOptionalNumber(rawRecord.lat, "lat");
  const lng = asOptionalNumber(rawRecord.lng, "lng");
  if (lat !== undefined) record.lat = lat;
  if (lng !== undefined) record.lng = lng;

  return { id, record };
}

const rawJson = await readFile(inputPath, "utf8");
const rawRecord = JSON.parse(rawJson);
const { id, record } = normalizeRecord(rawRecord);

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault()
  });
}

const db = getFirestore();
await db.collection("communityPlaces").doc(id).set(record, { merge: true });

console.log(`Imported communityPlaces/${id}`);
