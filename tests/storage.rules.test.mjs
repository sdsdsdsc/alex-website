import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after, before, beforeEach } from "node:test";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import {
  deleteObject,
  getBytes,
  ref,
  uploadBytes
} from "firebase/storage";

const PROJECT_ID = "alex-photo-board-test";
const BUCKET_URL = "gs://alex-photo-board-test.appspot.com";
const ADMIN_UID = "VT3I9KMktMXsdJeyYBye54Sgnqu2";
const OWNER_UID = "nomination-owner";
const OTHER_UID = "another-user";
const RULES_PATH = new URL("../storage.rules", import.meta.url);
const MAX_NOMINATION_IMAGE_BYTES = 5 * 1024 * 1024;

let testEnv;

function smallImageBytes() {
  return new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
}

function oversizedImageBytes() {
  return new Uint8Array(MAX_NOMINATION_IMAGE_BYTES + 1);
}

function evidencePath(uid = OWNER_UID, fileId = "front-view.png") {
  return `nomination-evidence/${uid}/draft-123/${fileId}`;
}

function contributionImagePath(uid = OWNER_UID, fileId = "contribution-photo.png") {
  return `place-contribution-images/${uid}/draft-456/${fileId}`;
}

function ownerStorage() {
  return testEnv.authenticatedContext(OWNER_UID).storage(BUCKET_URL);
}

function otherStorage() {
  return testEnv.authenticatedContext(OTHER_UID).storage(BUCKET_URL);
}

function adminStorage() {
  return testEnv.authenticatedContext(ADMIN_UID).storage(BUCKET_URL);
}

function publicStorage() {
  return testEnv.unauthenticatedContext().storage(BUCKET_URL);
}

async function seedStorageObject(path, bytes = smallImageBytes(), metadata = { contentType: "image/png" }) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await uploadBytes(ref(context.storage(BUCKET_URL), path), bytes, metadata);
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    storage: {
      host: "127.0.0.1",
      port: 9199,
      rules: await readFile(RULES_PATH, "utf8")
    }
  });
});

beforeEach(async () => {
  await testEnv.clearStorage();
});

after(async () => {
  await testEnv?.cleanup();
});

test("signed-in users can upload image evidence under their own UID path", async () => {
  await assertSucceeds(uploadBytes(
    ref(ownerStorage(), evidencePath()),
    smallImageBytes(),
    { contentType: "image/png" }
  ));
});

test("signed-out users cannot upload nomination evidence", async () => {
  await assertFails(uploadBytes(
    ref(publicStorage(), evidencePath()),
    smallImageBytes(),
    { contentType: "image/png" }
  ));
});

test("signed-in users cannot upload under another UID path", async () => {
  await assertFails(uploadBytes(
    ref(otherStorage(), evidencePath(OWNER_UID, "wrong-owner.png")),
    smallImageBytes(),
    { contentType: "image/png" }
  ));
});

test("nomination evidence uploads are image-only", async () => {
  await assertSucceeds(uploadBytes(
    ref(ownerStorage(), evidencePath(OWNER_UID, "allowed.webp")),
    smallImageBytes(),
    { contentType: "image/webp" }
  ));

  await assertFails(uploadBytes(
    ref(ownerStorage(), evidencePath(OWNER_UID, "blocked.txt")),
    new Uint8Array([1, 2, 3]),
    { contentType: "text/plain" }
  ));
});

test("nomination evidence uploads are capped at five megabytes", async () => {
  await assertFails(uploadBytes(
    ref(ownerStorage(), evidencePath(OWNER_UID, "too-large.png")),
    oversizedImageBytes(),
    { contentType: "image/png" }
  ));
});

test("public users cannot read nomination evidence files", async () => {
  const path = evidencePath(OWNER_UID, "private-review.png");
  await seedStorageObject(path);

  await assertFails(getBytes(ref(publicStorage(), path)));
});

test("admins can read nomination evidence files for review", async () => {
  const path = evidencePath(OWNER_UID, "admin-review.png");
  await seedStorageObject(path);

  const bytes = await assertSucceeds(getBytes(ref(adminStorage(), path)));
  assert.equal(bytes.byteLength, smallImageBytes().byteLength);
});

test("nomination evidence files cannot be deleted by public submitters", async () => {
  const path = evidencePath(OWNER_UID, "no-delete.png");
  await seedStorageObject(path);

  await assertFails(deleteObject(ref(ownerStorage(), path)));
});

test("signed-in users can upload contribution images under their own UID path", async () => {
  await assertSucceeds(uploadBytes(
    ref(ownerStorage(), contributionImagePath(OWNER_UID, "allowed-contribution.gif")),
    smallImageBytes(),
    { contentType: "image/gif" }
  ));
});

test("signed-out users cannot upload contribution images", async () => {
  await assertFails(uploadBytes(
    ref(publicStorage(), contributionImagePath()),
    smallImageBytes(),
    { contentType: "image/png" }
  ));
});

test("signed-in users cannot upload contribution images under another UID path", async () => {
  await assertFails(uploadBytes(
    ref(otherStorage(), contributionImagePath(OWNER_UID, "wrong-owner.png")),
    smallImageBytes(),
    { contentType: "image/png" }
  ));
});

test("contribution image uploads are image-only", async () => {
  await assertSucceeds(uploadBytes(
    ref(ownerStorage(), contributionImagePath(OWNER_UID, "allowed.jpeg")),
    smallImageBytes(),
    { contentType: "image/jpeg" }
  ));

  await assertFails(uploadBytes(
    ref(ownerStorage(), contributionImagePath(OWNER_UID, "blocked.txt")),
    new Uint8Array([1, 2, 3]),
    { contentType: "text/plain" }
  ));
});

test("contribution image uploads are capped at five megabytes", async () => {
  await assertFails(uploadBytes(
    ref(ownerStorage(), contributionImagePath(OWNER_UID, "too-large.png")),
    oversizedImageBytes(),
    { contentType: "image/png" }
  ));
});

test("public users cannot read contribution image files", async () => {
  const path = contributionImagePath(OWNER_UID, "private-review.png");
  await seedStorageObject(path);

  await assertFails(getBytes(ref(publicStorage(), path)));
});

test("admins can read contribution image files for review", async () => {
  const path = contributionImagePath(OWNER_UID, "admin-review.webp");
  await seedStorageObject(path, smallImageBytes(), { contentType: "image/webp" });

  const bytes = await assertSucceeds(getBytes(ref(adminStorage(), path)));
  assert.equal(bytes.byteLength, smallImageBytes().byteLength);
});

test("contribution image files cannot be deleted by public submitters", async () => {
  const path = contributionImagePath(OWNER_UID, "no-delete.png");
  await seedStorageObject(path);

  await assertFails(deleteObject(ref(ownerStorage(), path)));
});
