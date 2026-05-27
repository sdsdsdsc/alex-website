import { readFile } from "node:fs/promises";
import { GoogleAuth } from "google-auth-library";

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
    createdAt: new Date()
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

function toFirestoreValue(value) {
  if (value === undefined) return undefined;
  if (value === null) return { nullValue: null };
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue).filter(Boolean)
      }
    };
  }
  if (typeof value === "number") {
    return { doubleValue: value };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  return { stringValue: cleanText(value) };
}

function toFirestoreFields(recordData) {
  return Object.fromEntries(
    Object.entries(recordData)
      .map(([key, value]) => [key, toFirestoreValue(value)])
      .filter(([, value]) => value !== undefined)
  );
}

try {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/datastore"]
  });
  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const accessToken = await client.getAccessToken();
  const token = typeof accessToken === "string" ? accessToken : accessToken?.token;

  if (!projectId) {
    fail("Could not determine the Firebase project ID from GOOGLE_APPLICATION_CREDENTIALS.");
  }
  if (!token) {
    fail("Could not get an access token from GOOGLE_APPLICATION_CREDENTIALS.");
  }

  const documentPath = `projects/${projectId}/databases/(default)/documents/communityPlaces/${encodeURIComponent(id)}`;
  const url = `https://firestore.googleapis.com/v1/${documentPath}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields: toFirestoreFields(record) }),
    signal: controller.signal
  });
  clearTimeout(timeout);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firestore REST request failed with HTTP ${response.status}: ${body}`);
  }

  console.log(`Imported communityPlaces/${id}`);
} catch (err) {
  console.error(`Failed to import communityPlaces/${id}.`);
  console.error("Check that GOOGLE_APPLICATION_CREDENTIALS points to a local service account key and that this computer can reach firestore.googleapis.com.");
  console.error(err?.message || err);
  process.exit(1);
}
