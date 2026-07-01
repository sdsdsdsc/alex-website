import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const workspaceRoot = process.cwd();
const tempModuleRoot = await mkdtemp(path.join(os.tmpdir(), "alex-website-place-contributions-"));
const tempEngineRoot = path.join(tempModuleRoot, "heritage-engine");

await mkdir(tempEngineRoot, { recursive: true });

for (const moduleName of ["validation", "place-contributions"]) {
  const sourcePath = path.join(workspaceRoot, "heritage-engine", `${moduleName}.js`);
  const targetPath = path.join(tempEngineRoot, `${moduleName}.mjs`);
  const source = await readFile(sourcePath, "utf8");
  const rewritten = source.replaceAll(/from "\.\/([^"]+)\.js"/g, 'from "./$1.mjs"');
  await writeFile(targetPath, rewritten, "utf8");
}

const placeContributions = await import(pathToFileURL(path.join(tempEngineRoot, "place-contributions.mjs")).href);

const {
  buildApproveContributionUpdate,
  buildPlaceContributionCreatePayload,
  buildPublicPlaceContributionPayload,
  buildRejectContributionUpdate,
  getInitialContributionStatus,
  getPlaceContributionValidationErrors
} = placeContributions;

function buildValidContribution(overrides = {}) {
  return {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    placeTitleSnapshot: "Phase 11C Image Promotion Live Test 20260630024821",
    contributionText: "A local resident remembers events here.",
    imageUrl: "",
    imageCaption: "",
    imageCredit: "",
    imageRightsStatus: "",
    imagePermissionConfirmed: false,
    submittedByUid: "public-user-1",
    submitterEmail: "user@example.org",
    submitterDisplayName: "Resident One",
    contributionStatus: "submitted",
    ...overrides
  };
}

test("valid text-only submitted contribution normalizes correctly", () => {
  const payload = buildPlaceContributionCreatePayload(buildValidContribution(), {
    createdAt: "created",
    updatedAt: "updated"
  });

  assert.equal(payload.placeId, "phase-11c-image-promotion-live-test-20260630024821");
  assert.equal(payload.placeTitleSnapshot, "Phase 11C Image Promotion Live Test 20260630024821");
  assert.equal(payload.contributionText, "A local resident remembers events here.");
  assert.equal(payload.submittedByUid, "public-user-1");
  assert.equal(payload.submitterEmail, "user@example.org");
  assert.equal(payload.submitterDisplayName, "Resident One");
  assert.equal(payload.contributionStatus, getInitialContributionStatus());
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "imageUrl"), false);
});

test("valid image URL contribution normalizes correctly", () => {
  const payload = buildPlaceContributionCreatePayload(buildValidContribution({
    contributionText: "",
    imageUrl: "https://example.org/contribution-photo.jpg",
    imageCaption: "South entrance in summer",
    imageCredit: "Photo by resident",
    imageRightsStatus: "permission-granted",
    imagePermissionConfirmed: true
  }));

  assert.equal(payload.imageUrl, "https://example.org/contribution-photo.jpg");
  assert.equal(payload.imageCaption, "South entrance in summer");
  assert.equal(payload.imageCredit, "Photo by resident");
  assert.equal(payload.imageRightsStatus, "permission-granted");
  assert.equal(payload.imagePermissionConfirmed, true);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "contributionText"), false);
});

test("blank optional image metadata fields are omitted from submitted payload", () => {
  const payload = buildPlaceContributionCreatePayload(buildValidContribution({
    contributionText: "",
    imageUrl: "https://example.org/contribution-photo.jpg",
    imageCaption: "   ",
    imageCredit: "",
    imageRightsStatus: "",
    imagePermissionConfirmed: false
  }));

  assert.equal(payload.imageUrl, "https://example.org/contribution-photo.jpg");
  [
    "imageCaption",
    "imageCredit",
    "imageRightsStatus",
    "imagePermissionConfirmed"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(payload, fieldName), false, `${fieldName} should be omitted when blank or false`);
  });
});

test("submitted create payload does not emit undefined optional fields", () => {
  const payload = buildPlaceContributionCreatePayload(buildValidContribution({
    placeTitleSnapshot: undefined,
    contributionText: "A short approved-history note.",
    imageUrl: undefined,
    imageCaption: undefined,
    imageCredit: undefined,
    imageRightsStatus: undefined,
    submitterDisplayName: undefined
  }));

  assert.equal(payload.contributionStatus, "submitted");
  Object.entries(payload).forEach(([fieldName, value]) => {
    assert.notEqual(value, undefined, `${fieldName} should never be undefined`);
  });
});

test("submitted create payload always uses submitted status", () => {
  const payload = buildPlaceContributionCreatePayload(buildValidContribution({
    contributionStatus: "approved"
  }));

  assert.equal(payload.contributionStatus, "submitted");
});

test("invalid non-HTTPS imageUrl is rejected", () => {
  const errors = getPlaceContributionValidationErrors(buildValidContribution({
    contributionText: "",
    imageUrl: "http://example.org/not-secure.jpg"
  }));

  assert.equal(errors.includes("Image URL must begin with https://."), true);
});

test("blank contribution with no text and no image is invalid", () => {
  const errors = getPlaceContributionValidationErrors(buildValidContribution({
    contributionText: "",
    imageUrl: ""
  }));

  assert.equal(errors.includes("Contribution must include text and/or an image URL."), true);
});

test("public payload is returned only for approved contributions", () => {
  const publicPayload = buildPublicPlaceContributionPayload({
    ...buildValidContribution({
      contributionStatus: "approved",
      imageUrl: "https://example.org/contribution-photo.jpg",
      imageCaption: "South entrance in summer",
      imageCredit: "Photo by resident",
      imageRightsStatus: "permission-granted"
    }),
    createdAt: "created",
    updatedAt: "updated",
    reviewedAt: "reviewed",
    adminNotes: "private note",
    reviewHistory: [{ action: "reviewed" }]
  });

  assert.deepEqual(publicPayload, {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    placeTitleSnapshot: "Phase 11C Image Promotion Live Test 20260630024821",
    contributionText: "A local resident remembers events here.",
    imageUrl: "https://example.org/contribution-photo.jpg",
    imageCaption: "South entrance in summer",
    imageCredit: "Photo by resident",
    imageRightsStatus: "permission-granted",
    contributionStatus: "approved",
    createdAt: "created",
    updatedAt: "updated",
    reviewedAt: "reviewed"
  });
});

test("submitted contribution does not create public payload", () => {
  assert.equal(buildPublicPlaceContributionPayload(buildValidContribution({
    contributionStatus: "submitted"
  })), null);
});

test("rejected contribution does not create public payload", () => {
  assert.equal(buildPublicPlaceContributionPayload(buildValidContribution({
    contributionStatus: "rejected"
  })), null);
});

test("private submitter and admin fields do not appear in public payload", () => {
  const publicPayload = buildPublicPlaceContributionPayload({
    ...buildValidContribution({
      contributionStatus: "approved",
      imageUrl: "https://example.org/contribution-photo.jpg"
    }),
    adminNotes: "private moderation note",
    reviewHistory: [{ action: "reviewed" }]
  });

  [
    "submittedByUid",
    "submitterEmail",
    "submitterDisplayName",
    "imagePermissionConfirmed",
    "adminNotes",
    "reviewHistory"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(publicPayload, fieldName), false, `${fieldName} should not be public`);
  });
});

test("admin approve update payload is correct", () => {
  const payload = buildApproveContributionUpdate({
    adminNotes: "Approved for public display.",
    reviewHistory: [{ action: "approved" }]
  }, {
    reviewedAt: "reviewed",
    updatedAt: "updated"
  });

  assert.deepEqual(payload, {
    contributionStatus: "approved",
    reviewedAt: "reviewed",
    updatedAt: "updated",
    adminNotes: "Approved for public display.",
    reviewHistory: [{ action: "approved" }]
  });
});

test("admin reject update payload is correct", () => {
  const payload = buildRejectContributionUpdate({
    adminNotes: "Rejected because the image source could not be verified."
  }, {
    reviewedAt: "reviewed",
    updatedAt: "updated"
  });

  assert.deepEqual(payload, {
    contributionStatus: "rejected",
    reviewedAt: "reviewed",
    updatedAt: "updated",
    adminNotes: "Rejected because the image source could not be verified."
  });
});
