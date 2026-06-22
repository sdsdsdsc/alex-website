import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const workspaceRoot = process.cwd();
const tempModuleRoot = await mkdtemp(path.join(os.tmpdir(), "alex-website-phase14b-"));
const tempEngineRoot = path.join(tempModuleRoot, "heritage-engine");

await mkdir(tempEngineRoot, { recursive: true });

for (const moduleName of ["validation", "relationships", "export", "nominations"]) {
  const sourcePath = path.join(workspaceRoot, "heritage-engine", `${moduleName}.js`);
  const targetPath = path.join(tempEngineRoot, `${moduleName}.mjs`);
  const source = await readFile(sourcePath, "utf8");
  const rewritten = source.replaceAll(/from "\.\/([^"]+)\.js"/g, 'from "./$1.mjs"');
  await writeFile(targetPath, rewritten, "utf8");
}

const nominations = await import(pathToFileURL(path.join(tempEngineRoot, "nominations.mjs")).href);
const validation = await import(pathToFileURL(path.join(tempEngineRoot, "validation.mjs")).href);
const publicExport = await import(pathToFileURL(path.join(tempEngineRoot, "export.mjs")).href);

const {
  NOMINATION_PRIVATE_EVIDENCE_VISIBILITY,
  buildNominationOwnershipMetadata,
  buildSubmittedNominationPayload
} = nominations;
const { UNSAFE_PUBLIC_FIELD_NAMES, containsUnsafePublicField, stripUnsafePublicFields } = validation;
const { buildPublicGraph, buildPublicHeritageJsonLd } = publicExport;

function buildValidNominationValues(overrides = {}) {
  return {
    title: "Test Community Place",
    address: "1 Test Street, Pingxiang",
    area: "Test Area",
    lat: "27.720570019360082",
    lng: "114.15617044085226",
    assetType: "Public space",
    description: "A test place used only for nomination helper validation.",
    localSignificanceSummary: "A locally valued test place.",
    heritageCriteria: ["Historic interest", "Rarity"],
    criteriaExplanation: "The place has local memory and rarity value.",
    condition: undefined,
    communityUse: undefined,
    sourceReference: undefined,
    evidenceImageUrl: "",
    evidenceImageCaption: "",
    evidenceSourceCredit: "",
    evidenceRightsStatus: "",
    evidencePermissionConfirmed: false,
    nominatorDisplayName: "Test Nominator",
    nominatorEmail: "test@example.org",
    organisationName: "",
    submittedOnBehalfOf: "self",
    projectPositionAccepted: true,
    reviewAccepted: true,
    termsAccepted: true,
    privacyAccepted: true,
    publicUsers: { unsafe: true },
    placeNominations: { unsafe: true },
    submittedByUid: "forged-user",
    submitterEmail: "forged@example.org",
    submitterDisplayName: "Forged Name",
    submissionAuthType: "guest",
    adminNotes: "private note",
    adminHistoricInterest: true,
    adminArchitecturalInterest: true,
    adminCommunityValue: true,
    adminConditionRisk: false,
    adminAssessmentSummary: "private assessment",
    reviewHistory: [{ action: "review_saved" }],
    privateReviewData: { hidden: true },
    adminBackupMetadata: { hidden: true },
    promotedPlaceId: "private-place",
    promotedAt: "private-date",
    ...overrides
  };
}

function assertNoUndefined(value, pathLabel = "root") {
  assert.notStrictEqual(value, undefined, `${pathLabel} should not be undefined`);

  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoUndefined(entry, `${pathLabel}[${index}]`));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  Object.entries(value).forEach(([key, entry]) => {
    assertNoUndefined(entry, `${pathLabel}.${key}`);
  });
}

test("builds a valid nomination payload with blank optional evidence fields", () => {
  const ownershipMetadata = buildNominationOwnershipMetadata({
    uid: "public-user-1",
    email: "account@example.org",
    displayName: "Account User"
  });

  const payload = buildSubmittedNominationPayload(buildValidNominationValues(), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata
  });

  assert.equal(payload.title, "Test Community Place");
  assert.equal(payload.nominationStatus, "submitted");
  assert.equal(payload.submittedByUid, "public-user-1");
  assert.equal(payload.submitterEmail, "account@example.org");
  assert.equal(payload.submitterDisplayName, "Account User");
  assert.equal(payload.submissionAuthType, "signedIn");
  assert.equal(typeof payload.lat, "number");
  assert.equal(typeof payload.lng, "number");
  assert.equal(payload.lat, 27.720570019360082);
  assert.equal(payload.lng, 114.15617044085226);
  assert.equal("evidenceImageUrl" in payload, false);
  assert.equal("evidenceImageCaption" in payload, false);
  assert.equal("evidenceSourceCredit" in payload, false);
  assert.equal("evidenceRightsStatus" in payload, false);
  assert.equal("evidencePermissionConfirmed" in payload, false);
  assert.equal("evidenceVisibility" in payload, false);

  [
    "publicUsers",
    "placeNominations",
    "adminNotes",
    "adminHistoricInterest",
    "adminArchitecturalInterest",
    "adminCommunityValue",
    "adminConditionRisk",
    "adminAssessmentSummary",
    "reviewHistory",
    "privateReviewData",
    "adminBackupMetadata",
    "promotedPlaceId",
    "promotedAt"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(payload, fieldName), false, `${fieldName} should be stripped`);
  });

  assertNoUndefined(payload);
});

test("builds a valid nomination payload with evidence metadata and boolean ownership fields", () => {
  const ownershipMetadata = buildNominationOwnershipMetadata({
    uid: "public-user-2",
    email: "owner@example.org",
    submissionAuthType: "signedIn"
  });

  const payload = buildSubmittedNominationPayload(buildValidNominationValues({
    evidenceImageUrl: "https://example.org/evidence.jpg",
    evidenceImageCaption: "Front view",
    evidenceSourceCredit: "Photo by nominator",
    evidenceRightsStatus: "own-work",
    evidencePermissionConfirmed: true,
    submitterEmail: undefined,
    submissionAuthType: undefined
  }), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata
  });

  assert.equal(payload.evidenceImageUrl, "https://example.org/evidence.jpg");
  assert.equal(payload.evidenceImageCaption, "Front view");
  assert.equal(payload.evidenceSourceCredit, "Photo by nominator");
  assert.equal(payload.evidenceRightsStatus, "own-work");
  assert.equal(payload.evidencePermissionConfirmed, true);
  assert.equal(typeof payload.evidencePermissionConfirmed, "boolean");
  assert.equal(payload.evidenceVisibility, NOMINATION_PRIVATE_EVIDENCE_VISIBILITY);
  assert.equal(payload.submittedByUid, "public-user-2");
  assert.equal(payload.submitterEmail, "owner@example.org");
  assert.equal(payload.submissionAuthType, "signedIn");
  assertNoUndefined(payload);
});

test("public validation and export helpers recursively strip unsafe private fields", () => {
  const unsafeObject = {
    title: "Public title",
    publicUsers: [{ email: "hidden@example.org" }],
    nested: {
      adminNotes: "private note",
      privateReviewData: {
        submitterEmail: "account@example.org",
        promotedAt: "2026-06-22T00:00:00Z"
      },
      safeValue: "public value"
    },
    reviewHistory: [{ action: "review_saved" }],
    nominatorEmail: "private@example.com",
    submittedByUid: "public-user-1",
    submitterEmail: "account@example.com",
    submitterDisplayName: "Account User",
    submissionAuthType: "signedIn",
    evidenceImageUrl: "https://example.org/private-evidence.jpg",
    evidenceImageCaption: "Private evidence caption",
    evidenceSourceCredit: "Private evidence credit",
    evidenceRightsStatus: "permission-granted",
    evidencePermissionConfirmed: true,
    evidenceVisibility: "nomination-private",
    adminHistoricInterest: true,
    adminArchitecturalInterest: true,
    adminCommunityValue: true,
    adminConditionRisk: false,
    adminAssessmentSummary: "private assessment",
    adminBackupMetadata: { exportedAt: "private" },
    placeNominations: "private collection name",
    promotedPlaceId: "alpha-square",
    promotedAt: "2026-06-22T00:00:00Z"
  };

  const stripped = stripUnsafePublicFields(unsafeObject);
  const exportPayload = buildPublicHeritageJsonLd(buildPublicGraph([
    {
      id: "alpha-square",
      collectionName: "communityPlaces",
      data: {
        title: "Alpha Square",
        description: "Public description",
        jsonld: unsafeObject
      }
    }
  ]));

  const strippedSerialized = JSON.stringify(stripped);
  const exportSerialized = JSON.stringify(exportPayload);

  assert.equal(containsUnsafePublicField(unsafeObject), true);
  assert.equal(containsUnsafePublicField(stripped), false);
  assert.equal(containsUnsafePublicField(exportPayload), false);
  assert.equal(stripped.nested.safeValue, "public value");

  [
    "evidenceImageUrl",
    "evidenceImageCaption",
    "evidenceSourceCredit",
    "evidenceRightsStatus",
    "evidencePermissionConfirmed",
    "evidenceVisibility",
    "submittedByUid",
    "submitterEmail",
    "submitterDisplayName",
    "submissionAuthType",
    "nominatorEmail",
    "adminNotes",
    "adminHistoricInterest",
    "adminArchitecturalInterest",
    "adminCommunityValue",
    "adminConditionRisk",
    "adminAssessmentSummary",
    "reviewHistory"
  ].forEach((fieldName) => {
    assert.doesNotMatch(strippedSerialized, new RegExp(fieldName));
    assert.doesNotMatch(exportSerialized, new RegExp(fieldName));
  });

  [
    "placeNominations",
    "publicUsers",
    "private@example.com",
    "account@example.com",
    "Private evidence caption",
    "Private evidence credit",
    "private assessment",
    "private collection name"
  ].forEach((privateValue) => {
    assert.doesNotMatch(exportSerialized, new RegExp(privateValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test.todo("public export should recursively strip export-only nested fields like privateReviewData, adminBackupMetadata, promotedPlaceId, and promotedAt");

test("unsafe public field list covers the Phase 14B regression boundary", () => {
  [
    "placeNominations",
    "publicUsers",
    "evidenceImageUrl",
    "evidenceImageCaption",
    "evidenceSourceCredit",
    "evidenceRightsStatus",
    "evidencePermissionConfirmed",
    "evidenceVisibility",
    "submittedByUid",
    "submitterEmail",
    "submitterDisplayName",
    "submissionAuthType",
    "nominatorEmail",
    "adminNotes",
    "adminHistoricInterest",
    "adminArchitecturalInterest",
    "adminCommunityValue",
    "adminConditionRisk",
    "adminAssessmentSummary",
    "reviewHistory"
  ].forEach((fieldName) => {
    assert(UNSAFE_PUBLIC_FIELD_NAMES.includes(fieldName), `${fieldName} should stay on the unsafe public field list`);
  });
});
