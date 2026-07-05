import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const workspaceRoot = process.cwd();
const tempModuleRoot = await mkdtemp(path.join(os.tmpdir(), "alex-website-promotion-"));
const tempEngineRoot = path.join(tempModuleRoot, "heritage-engine");

await mkdir(tempEngineRoot, { recursive: true });

for (const moduleName of ["validation", "audit", "promotion"]) {
  const sourcePath = path.join(workspaceRoot, "heritage-engine", `${moduleName}.js`);
  const targetPath = path.join(tempEngineRoot, `${moduleName}.mjs`);
  const source = await readFile(sourcePath, "utf8");
  const rewritten = source.replaceAll(/from "\.\/([^"]+)\.js"/g, 'from "./$1.mjs"');
  await writeFile(targetPath, rewritten, "utf8");
}

const promotion = await import(pathToFileURL(path.join(tempEngineRoot, "promotion.mjs")).href);
const validation = await import(pathToFileURL(path.join(tempEngineRoot, "validation.mjs")).href);

const {
  PUBLIC_PROMOTION_EVIDENCE_RIGHTS_STATUSES,
  buildPublicPlacePayloadFromNomination,
  hasPromotableEvidenceImage,
  stripPrivateFieldsForPromotion
} = promotion;
const { containsUnsafePublicField } = validation;

function buildApprovedNomination(overrides = {}) {
  return {
    id: "nomination-001",
    title: "Alpha Community Square",
    area: "Old Town",
    address: "1 Memory Lane",
    city: "Pingxiang",
    district: "Anyuan",
    province: "Jiangxi",
    category: "Submitted category",
    assetType: "Square",
    description: "A public place nominated by the community.",
    localSignificanceSummary: "A locally valued gathering space.",
    heritageCriteria: ["Social or communal value", "Rarity"],
    criteriaExplanation: "The nomination explains social value and rarity.",
    condition: "In use",
    communityUse: "Gathering and everyday use",
    sourceReference: "Community nomination",
    lat: 27.622,
    lng: 113.885,
    nominationStatus: "approved",
    evidenceImageUrl: "https://example.org/approved-public-image.jpg",
    evidenceImageCaption: "Front view of Alpha Community Square",
    evidenceSourceCredit: "Photo by nominator",
    evidenceRightsStatus: "permission-granted",
    evidencePermissionConfirmed: true,
    evidenceVisibility: "nomination-private",
    evidenceStoragePath: "nomination-evidence/public-user-1/draft-001/photo-001.webp",
    evidenceFileName: "photo-001.webp",
    evidenceFileContentType: "image/webp",
    evidenceFileSize: 123456,
    evidenceUploadedAt: "private uploaded timestamp",
    evidenceUploadedByUid: "public-user-1",
    submittedByUid: "public-user-1",
    submitterEmail: "account@example.org",
    submitterDisplayName: "Account User",
    submissionAuthType: "signedIn",
    nominatorEmail: "private@example.org",
    adminNotes: "private admin note",
    adminAssessmentSummary: "private assessment",
    reviewHistory: [{ action: "review_saved" }],
    promotedPlaceId: "old-id",
    promotedAt: "private timestamp",
    ...overrides
  };
}

function buildPromotedPlace(overrides = {}) {
  return buildPublicPlacePayloadFromNomination(buildApprovedNomination(overrides), {
    placeId: "alpha-community-square",
    dateAdded: "2026-06-29",
    lastReviewed: "2026-06-29",
    createdAt: "created",
    updatedAt: "updated"
  });
}

test("promotes safe approved nomination evidence into public image fields", () => {
  const payload = buildPromotedPlace();
  const serialized = JSON.stringify(payload);

  assert.equal(hasPromotableEvidenceImage(buildApprovedNomination()), true);
  assert.equal(payload.imageUrl, "https://example.org/approved-public-image.jpg");
  assert.equal(payload.imageCaption, "Front view of Alpha Community Square");
  assert.equal(payload.imageCredit, "Photo by nominator");
  assert.equal(payload.imageRightsStatus, "permission-granted");
  assert.equal(payload.source, "Photo by nominator");
  assert.equal(containsUnsafePublicField(payload), false);

  [
    "evidenceImageUrl",
    "evidenceImageCaption",
    "evidenceSourceCredit",
    "evidenceRightsStatus",
    "evidencePermissionConfirmed",
    "evidenceVisibility",
    "evidenceStoragePath",
    "evidenceFileName",
    "evidenceFileContentType",
    "evidenceFileSize",
    "evidenceUploadedAt",
    "evidenceUploadedByUid",
    "private@example.org",
    "private admin note",
    "private assessment",
    "reviewHistory",
    "promotedAt"
  ].forEach((forbiddenText) => {
    assert.equal(serialized.includes(forbiddenText), false, `${forbiddenText} should not be exposed in public place payload`);
  });
});

test("does not promote review-only or unsafe evidence into public image fields", () => {
  assert.equal(PUBLIC_PROMOTION_EVIDENCE_RIGHTS_STATUSES.includes("public-web-reference"), false);

  [
    { evidenceRightsStatus: "public-web-reference" },
    { evidenceRightsStatus: "unknown-needs-review" },
    { evidenceImageUrl: "http://example.org/not-https.jpg" },
    { evidencePermissionConfirmed: false },
    { evidenceImageUrl: "" }
  ].forEach((overrides) => {
    const source = buildApprovedNomination(overrides);
    const payload = buildPromotedPlace(overrides);
    assert.equal(hasPromotableEvidenceImage(source), false);
    assert.equal(Object.prototype.hasOwnProperty.call(payload, "imageUrl"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(payload, "imageCaption"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(payload, "imageCredit"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(payload, "imageRightsStatus"), false);
  });
});

test("private nomination evidence field names remain stripped by the promotion sanitizer", () => {
  const stripped = stripPrivateFieldsForPromotion(buildApprovedNomination());

  [
    "evidenceImageUrl",
    "evidenceImageCaption",
    "evidenceSourceCredit",
    "evidenceRightsStatus",
    "evidencePermissionConfirmed",
    "evidenceVisibility",
    "evidenceStoragePath",
    "evidenceFileName",
    "evidenceFileContentType",
    "evidenceFileSize",
    "evidenceUploadedAt",
    "evidenceUploadedByUid",
    "submittedByUid",
    "submitterEmail",
    "nominatorEmail",
    "adminNotes",
    "adminAssessmentSummary",
    "reviewHistory",
    "promotedAt"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(stripped, fieldName), false, `${fieldName} should be stripped`);
  });
});
