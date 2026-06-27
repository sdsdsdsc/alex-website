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
  EVIDENCE_RIGHTS_STATUSES,
  NOMINATION_PRIVATE_EVIDENCE_VISIBILITY,
  buildNominationDebugSummary,
  buildNominationOwnershipMetadata,
  buildSubmittedNominationPayload,
  normalizeNominationCoordinates,
  sanitizePublicNominationPayload,
  validateNominationAgreements,
  validateNominationEvidenceFields
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

function buildSignedInOwnership(overrides = {}) {
  return buildNominationOwnershipMetadata({
    uid: "public-user-1",
    email: "account@example.org",
    displayName: "Account User",
    ...overrides
  });
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
  const ownershipMetadata = buildSignedInOwnership();

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
  assert.equal("condition" in payload, false);
  assert.equal("communityUse" in payload, false);
  assert.equal("sourceReference" in payload, false);

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

test("builds a valid nomination payload with the temporary 13C evidence-url rollback shape", () => {
  const ownershipMetadata = buildSignedInOwnership({
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
  assert.equal(payload.evidencePermissionConfirmed, true);
  assert.equal(typeof payload.evidencePermissionConfirmed, "boolean");
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "evidenceRightsStatus"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "evidenceVisibility"), false);
  assert.equal(payload.submittedByUid, "public-user-2");
  assert.equal(payload.submitterEmail, "owner@example.org");
  assert.equal(payload.submissionAuthType, "signedIn");
  assertNoUndefined(payload);
});

test("builds an evidence-url payload without blank caption or source-credit fields", () => {
  const payload = buildSubmittedNominationPayload(buildValidNominationValues({
    evidenceImageUrl: "https://example.org/photo.jpg",
    evidenceImageCaption: "",
    evidenceSourceCredit: "",
    evidenceRightsStatus: "public-web-reference",
    evidencePermissionConfirmed: true
  }), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata: buildSignedInOwnership()
  });

  assert.equal(payload.evidenceImageUrl, "https://example.org/photo.jpg");
  assert.equal(payload.evidencePermissionConfirmed, true);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "evidenceRightsStatus"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "evidenceVisibility"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "evidenceImageCaption"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "evidenceSourceCredit"), false);
  assertNoUndefined(payload);
});

test("nomination debug summary reports clean evidence payload keys and field types", () => {
  const payload = buildSubmittedNominationPayload(buildValidNominationValues({
    evidenceImageUrl: "https://example.org/photo.jpg",
    evidenceImageCaption: "Phase 16D test caption",
    evidenceSourceCredit: "Phase 16D test source",
    evidenceRightsStatus: "public-web-reference",
    evidencePermissionConfirmed: true
  }), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata: buildSignedInOwnership({
      uid: "public-user-phase-16d",
      email: "alex.home@gmail.com"
    })
  });

  const debug = buildNominationDebugSummary(payload);

  assert.deepEqual(debug.missingRequiredFields, []);
  assert.deepEqual(debug.forbiddenExtraFields, []);
  assert.deepEqual(debug.undefinedFields, []);
  assert.equal(debug.evidence.evidenceImageUrl, "https://example.org/photo.jpg");
  assert.equal(debug.evidence.evidenceImageCaption, "Phase 16D test caption");
  assert.equal(debug.evidence.evidenceSourceCredit, "Phase 16D test source");
  assert.equal(debug.evidence.evidencePermissionConfirmed, true);
  assert.equal(debug.evidence.evidenceRightsStatus, undefined);
  assert.equal(debug.evidence.evidenceVisibility, undefined);
  assert.equal(debug.submittedByUidPresent, true);
  assert.equal(debug.submittedByUidRedacted, "publ...-16d");
  assert.equal(debug.submitterEmail, "alex.home@gmail.com");
  assert.equal(debug.latType, "number");
  assert.equal(debug.lngType, "number");
});

test("nomination debug summary detects forbidden extras and missing required fields", () => {
  const validPayload = buildSubmittedNominationPayload(buildValidNominationValues(), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata: buildSignedInOwnership()
  });

  const extraFieldDebug = buildNominationDebugSummary({
    ...validPayload,
    fakeExtraField: "not allowed"
  });
  assert.deepEqual(extraFieldDebug.forbiddenExtraFields, ["fakeExtraField"]);

  const missingRequiredPayload = { ...validPayload };
  delete missingRequiredPayload.title;
  const missingRequiredDebug = buildNominationDebugSummary(missingRequiredPayload);
  assert.deepEqual(missingRequiredDebug.missingRequiredFields, ["title"]);
});

test("final nomination payload sanitization omits undefined entries and blank optional evidence text", () => {
  const sanitized = sanitizePublicNominationPayload({
    title: "Safe title",
    evidenceImageUrl: "https://example.org/photo.jpg",
    evidenceImageCaption: "",
    evidenceSourceCredit: undefined,
    evidenceRightsStatus: "public-web-reference",
    evidencePermissionConfirmed: true,
    evidenceVisibility: "nomination-private",
    submittedByUid: "uid-123",
    submitterEmail: "person@example.org",
    submissionAuthType: "signedIn",
    termsAccepted: true,
    privacyAccepted: true,
    nominationStatus: "submitted",
    notAllowed: "drop me"
  });

  assert.deepEqual(Object.keys(sanitized).sort(), [
    "evidenceImageUrl",
    "evidencePermissionConfirmed",
    "evidenceRightsStatus",
    "evidenceVisibility",
    "nominationStatus",
    "privacyAccepted",
    "submissionAuthType",
    "submittedByUid",
    "submitterEmail",
    "termsAccepted",
    "title"
  ]);
  assert.equal(Object.prototype.hasOwnProperty.call(sanitized, "evidenceImageCaption"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(sanitized, "evidenceSourceCredit"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(sanitized, "notAllowed"), false);
  assertNoUndefined(sanitized);
});

test("rejects invalid evidence URLs at the helper layer", () => {
  assert(validateNominationEvidenceFields({
    evidenceImageUrl: "http://example.org/photo.jpg",
    evidenceRightsStatus: "own-work",
    evidencePermissionConfirmed: true
  }).includes("Evidence image URL must begin with https://."));

  assert(validateNominationEvidenceFields({
    evidenceImageUrl: "definitely-not-a-url",
    evidenceRightsStatus: "own-work",
    evidencePermissionConfirmed: true
  }).includes("Evidence image URL must begin with https://."));

  assert.throws(() => {
    buildSubmittedNominationPayload(buildValidNominationValues({
      evidenceImageUrl: "http://example.org/photo.jpg",
      evidenceRightsStatus: "own-work",
      evidencePermissionConfirmed: true
    }), {
      createdAt: "created",
      updatedAt: "updated",
      submittedAt: "submitted",
      ownershipMetadata: buildSignedInOwnership()
    });
  }, /Evidence image URL must begin with https:\/\//);
});

test("keeps nominator and signed-in submitter identity separate", () => {
  const ownershipMetadata = buildSignedInOwnership({
    uid: "auth-user-9",
    email: "signed-in@example.org",
    displayName: "Signed In User"
  });

  const payload = buildSubmittedNominationPayload(buildValidNominationValues({
    nominatorEmail: "nominator@example.org",
    nominatorDisplayName: "Different Nominator"
  }), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata
  });

  assert.equal(payload.submittedByUid, "auth-user-9");
  assert.equal(payload.submitterEmail, "signed-in@example.org");
  assert.equal(payload.submitterDisplayName, "Signed In User");
  assert.equal(payload.submissionAuthType, "signedIn");
  assert.equal(payload.nominatorEmail, "nominator@example.org");
  assert.notEqual(payload.nominatorEmail, payload.submitterEmail);
  assertNoUndefined(payload);
});

test("ownership helper shapes signed-in metadata and rejects non-signed-in input", () => {
  const ownership = buildSignedInOwnership();

  assert.equal(ownership.submittedByUid, "public-user-1");
  assert.equal(ownership.submitterEmail, "account@example.org");
  assert.equal(ownership.submitterDisplayName, "Account User");
  assert.equal(ownership.submissionAuthType, "signedIn");

  assert.throws(() => buildNominationOwnershipMetadata({ email: "missing-uid@example.org" }), /Please sign in/);
  assert.throws(() => buildNominationOwnershipMetadata({ uid: "missing-email" }), /Please sign in/);
  assert.throws(() => buildNominationOwnershipMetadata({
    uid: "public-user-1",
    email: "account@example.org",
    submissionAuthType: "guest"
  }), /Please sign in/);
});

test("helper layer does not validate auth/payload UID-email mismatch because Firestore rules own that boundary", () => {
  const payload = buildSubmittedNominationPayload(buildValidNominationValues({
    submittedByUid: "forged-user",
    submitterEmail: "forged@example.org"
  }), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata: buildSignedInOwnership({
      uid: "actual-auth-user",
      email: "actual-auth@example.org"
    })
  });

  assert.equal(payload.submittedByUid, "actual-auth-user");
  assert.equal(payload.submitterEmail, "actual-auth@example.org");
  assert.equal(payload.submissionAuthType, "signedIn");
});

test("normalizes coordinates to numbers and omits blank coordinates from the submitted payload", () => {
  const coordinates = normalizeNominationCoordinates({
    lat: " 27.720570019360082 ",
    lng: "114.15617044085226"
  });

  assert.equal(typeof coordinates.lat, "number");
  assert.equal(typeof coordinates.lng, "number");
  assert.equal(coordinates.lat, 27.720570019360082);
  assert.equal(coordinates.lng, 114.15617044085226);

  const blankCoordinates = normalizeNominationCoordinates({
    lat: "",
    lng: ""
  });

  assert.equal(blankCoordinates.lat, null);
  assert.equal(blankCoordinates.lng, null);

  const payload = buildSubmittedNominationPayload(buildValidNominationValues({
    lat: "",
    lng: ""
  }), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata: buildSignedInOwnership()
  });

  assert.equal("lat" in payload, false);
  assert.equal("lng" in payload, false);
  assertNoUndefined(payload);
});

test("rejects invalid coordinates instead of coercing them into misleading payload numbers", () => {
  assert.throws(() => normalizeNominationCoordinates({ lat: "north", lng: "114.15617044085226" }), /Enter a valid latitude/);
  assert.throws(() => normalizeNominationCoordinates({ lat: "27.720570019360082", lng: "east" }), /Enter a valid longitude/);
  assert.throws(() => normalizeNominationCoordinates({ lat: "91", lng: "114.15617044085226" }), /Enter a valid latitude/);
  assert.throws(() => normalizeNominationCoordinates({ lat: "27.720570019360082", lng: "181" }), /Enter a valid longitude/);
});

test("requires terms and privacy acknowledgements for submitted payloads", () => {
  assert.deepEqual(validateNominationAgreements(buildValidNominationValues()), []);
  assert(validateNominationAgreements(buildValidNominationValues({ termsAccepted: false })).includes("Accept all required terms and privacy acknowledgements."));
  assert(validateNominationAgreements(buildValidNominationValues({ privacyAccepted: false })).includes("Accept all required terms and privacy acknowledgements."));
  assert(validateNominationAgreements(buildValidNominationValues({ projectPositionAccepted: false })).includes("Accept all required terms and privacy acknowledgements."));
  assert(validateNominationAgreements(buildValidNominationValues({ reviewAccepted: false })).includes("Accept all required terms and privacy acknowledgements."));

  assert.throws(() => {
    buildSubmittedNominationPayload(buildValidNominationValues({ termsAccepted: false }), {
      createdAt: "created",
      updatedAt: "updated",
      submittedAt: "submitted",
      ownershipMetadata: buildSignedInOwnership()
    });
  }, /Accept all required terms and privacy acknowledgements\./);
});

test("strips user-submitted private and admin fields recursively before building the Firestore payload", () => {
  const payload = buildSubmittedNominationPayload(buildValidNominationValues({
    privateReviewData: {
      adminNotes: "nested private note",
      promotedAt: "private-date"
    },
    adminBackupMetadata: {
      submitterEmail: "hidden@example.org"
    }
  }), {
    createdAt: "created",
    updatedAt: "updated",
    submittedAt: "submitted",
    ownershipMetadata: buildSignedInOwnership()
  });

  const serialized = JSON.stringify(payload);

  [
    "adminNotes",
    "adminAssessmentSummary",
    "reviewHistory",
    "promotedPlaceId",
    "promotedAt",
    "privateReviewData",
    "adminBackupMetadata"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(payload, fieldName), false, `${fieldName} should not survive payload shaping`);
    assert.doesNotMatch(serialized, new RegExp(fieldName));
  });

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

test.todo("public export should recursively strip export-only nested fields like privateReviewData, adminBackupMetadata, promotedPlaceId, and promotedAt when stored JSON-LD contains them under non-blocklisted parent keys");

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

test("evidence rights statuses stay aligned with payload validation coverage", () => {
  [
    "own-work",
    "permission-granted",
    "public-domain-or-open-license",
    "public-web-reference",
    "unknown-needs-review"
  ].forEach((status) => {
    assert(EVIDENCE_RIGHTS_STATUSES.includes(status), `${status} should remain an allowed evidence rights status`);
  });
});
