import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after, before, beforeEach } from "node:test";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";

const PROJECT_ID = "alex-photo-board-test";
const ADMIN_UID = "VT3I9KMktMXsdJeyYBye54Sgnqu2";
const OWNER_UID = "nomination-owner";
const OWNER_EMAIL = "owner@example.org";
const OTHER_UID = "another-user";
const OTHER_EMAIL = "another@example.org";
const RULES_PATH = new URL("../firestore.rules", import.meta.url);

let testEnv;

function timestamp(offset = 0) {
  return Timestamp.fromMillis(1_750_000_000_000 + offset);
}

function validNomination(overrides = {}) {
  return {
    title: "Test Community Place",
    address: "1 Test Street, Pingxiang",
    description: "A deterministic nomination used only by emulator tests.",
    localSignificanceSummary: "A locally valued place.",
    heritageCriteria: ["Historic interest"],
    criteriaExplanation: "The place has documented local historic interest.",
    nominatorEmail: "nominator@example.org",
    submittedByUid: OWNER_UID,
    submitterEmail: OWNER_EMAIL,
    submissionAuthType: "signedIn",
    termsAccepted: true,
    privacyAccepted: true,
    nominationStatus: "submitted",
    createdAt: timestamp(1),
    updatedAt: timestamp(2),
    submittedAt: timestamp(3),
    ...overrides
  };
}

function validPlaceContribution(overrides = {}) {
  return {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    placeTitleSnapshot: "Phase 11C Image Promotion Live Test 20260630024821",
    contributionText: "An approved community note for the place.",
    imageUrl: "https://example.org/contribution-photo.jpg",
    imageCaption: "South entrance",
    imageCredit: "Photo by resident",
    imageRightsStatus: "permission-granted",
    contributionStatus: "approved",
    createdAt: timestamp(30),
    updatedAt: timestamp(31),
    reviewedAt: timestamp(32),
    ...overrides
  };
}

function ownerFirestore() {
  return testEnv.authenticatedContext(OWNER_UID, { email: OWNER_EMAIL }).firestore();
}

function ownerFirestoreWithoutEmailClaim() {
  return testEnv.authenticatedContext(OWNER_UID, {}).firestore();
}

function ownerFirestoreWithUppercaseEmailClaim() {
  return testEnv.authenticatedContext(OWNER_UID, { email: OWNER_EMAIL.toUpperCase() }).firestore();
}

function otherFirestore() {
  return testEnv.authenticatedContext(OTHER_UID, { email: OTHER_EMAIL }).firestore();
}

function adminFirestore() {
  return testEnv.authenticatedContext(ADMIN_UID, { email: "admin@example.org" }).firestore();
}

async function seedDocument(path, data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), path), data);
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile(RULES_PATH, "utf8")
    }
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv?.cleanup();
});

test("public collections are readable while nominations remain private", async () => {
  for (const collectionName of ["communityPlaces", "news", "history"]) {
    await seedDocument(`${collectionName}/public-document`, { title: "Public document" });
  }
  await seedDocument("placeNominations/private-nomination", validNomination());

  const publicDb = testEnv.unauthenticatedContext().firestore();
  for (const collectionName of ["communityPlaces", "news", "history"]) {
    const snapshot = await assertSucceeds(getDoc(doc(publicDb, collectionName, "public-document")));
    assert.equal(snapshot.exists(), true);
  }
  await assertFails(getDoc(doc(publicDb, "placeNominations", "private-nomination")));
});

test("approved place contributions can be read publicly", async () => {
  await seedDocument(
    "placeContributions/approved-public-contribution",
    validPlaceContribution()
  );

  const publicDb = testEnv.unauthenticatedContext().firestore();
  const snapshot = await assertSucceeds(getDoc(
    doc(publicDb, "placeContributions", "approved-public-contribution")
  ));
  assert.equal(snapshot.exists(), true);
  assert.equal(snapshot.data().contributionStatus, "approved");
});

test("submitted and rejected place contributions cannot be read publicly", async () => {
  await seedDocument(
    "placeContributions/submitted-private-contribution",
    validPlaceContribution({
      contributionStatus: "submitted",
      submittedByUid: OWNER_UID,
      submitterEmail: OWNER_EMAIL
    })
  );
  await seedDocument(
    "placeContributions/rejected-private-contribution",
    validPlaceContribution({
      contributionStatus: "rejected",
      submittedByUid: OWNER_UID,
      submitterEmail: OWNER_EMAIL
    })
  );

  const publicDb = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(
    doc(publicDb, "placeContributions", "submitted-private-contribution")
  ));
  await assertFails(getDoc(
    doc(publicDb, "placeContributions", "rejected-private-contribution")
  ));
});

test("approved place contributions with private fields cannot be read publicly", async () => {
  await seedDocument(
    "placeContributions/approved-private-field-contribution",
    validPlaceContribution({
      submittedByUid: OWNER_UID,
      submitterEmail: OWNER_EMAIL,
      adminNotes: "private moderation note",
      reviewHistory: [{ action: "approved" }]
    })
  );

  await assertFails(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributions", "approved-private-field-contribution")
  ));
});

test("approved place contributions query is public while non-approved records stay hidden", async () => {
  const placeId = "phase-11c-image-promotion-live-test-20260630024821";
  await seedDocument("placeContributions/approved-matching", validPlaceContribution({ placeId }));
  await seedDocument("placeContributions/submitted-matching", validPlaceContribution({
    placeId,
    contributionStatus: "submitted"
  }));

  const publicDb = testEnv.unauthenticatedContext().firestore();
  const snapshot = await assertSucceeds(getDocs(query(
    collection(publicDb, "placeContributions"),
    where("placeId", "==", placeId),
    where("contributionStatus", "==", "approved")
  )));

  assert.deepEqual(snapshot.docs.map((contributionDoc) => contributionDoc.id), ["approved-matching"]);
});

test("public and signed-in users cannot create place contributions yet", async () => {
  await assertFails(setDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributions", "signed-out-create"),
    validPlaceContribution({
      contributionStatus: "submitted",
      submittedByUid: OWNER_UID,
      submitterEmail: OWNER_EMAIL
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "signed-in-create"),
    validPlaceContribution({
      contributionStatus: "submitted",
      submittedByUid: OWNER_UID,
      submitterEmail: OWNER_EMAIL
    })
  ));
});

test("a signed-in owner can create a valid nomination", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "valid-create"),
    validNomination()
  ));
});

test("a signed-in owner can create a valid nomination when the auth token omits email", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestoreWithoutEmailClaim(), "placeNominations", "valid-create-no-email-claim"),
    validNomination()
  ));
});

test("a signed-in owner can create a nomination when the auth token email only differs by case", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestoreWithUppercaseEmailClaim(), "placeNominations", "valid-create-case-insensitive-email"),
    validNomination()
  ));
});

test("optional evidence fields may be omitted or blank where the rules permit", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "missing-evidence"),
    validNomination()
  ));

  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "empty-evidence-url"),
    validNomination({ evidenceImageUrl: "" })
  ));

  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "blank-evidence-metadata"),
    validNomination({
      evidenceImageCaption: "",
      evidenceSourceCredit: "",
      evidenceRightsStatus: "",
      evidenceVisibility: ""
    })
  ));
});

test("HTTPS evidence and nomination-private rights metadata are accepted", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "https-evidence-only"),
    validNomination({ evidenceImageUrl: "https://example.org/photo.jpg" })
  ));

  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "https-evidence-metadata"),
    validNomination({
      evidenceImageUrl: "https://example.org/evidence.jpg",
      evidenceRightsStatus: "permission-granted",
      evidencePermissionConfirmed: true,
      evidenceVisibility: "nomination-private"
    })
  ));

  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "https-evidence-caption-credit"),
    validNomination({
      evidenceImageUrl: "https://example.org/evidence.jpg",
      evidenceImageCaption: "Community archive photo.",
      evidenceSourceCredit: "Example.org test source",
      evidenceRightsStatus: "public-web-reference",
      evidencePermissionConfirmed: true,
      evidenceVisibility: "nomination-private"
    })
  ));
});

test("evidence URL is treated as an optional review string rather than a fetchable URL gate", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "review-string-evidence"),
    validNomination({ evidenceImageUrl: "http://example.org/evidence.jpg" })
  ));
});

test("evidence rights metadata is accepted as an optional review string", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "review-string-evidence-rights"),
    validNomination({
      evidenceImageUrl: "https://example.org/evidence.jpg",
      evidenceRightsStatus: "review-only",
      evidencePermissionConfirmed: true,
      evidenceVisibility: "nomination-private"
    })
  ));
});

test("invalid evidence visibility is denied", async () => {
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "invalid-evidence-visibility"),
    validNomination({
      evidenceImageUrl: "https://example.org/evidence.jpg",
      evidenceRightsStatus: "public-web-reference",
      evidencePermissionConfirmed: true,
      evidenceVisibility: "public"
    })
  ));
});

test("signed-out users cannot create nominations", async () => {
  await assertFails(setDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeNominations", "signed-out-create"),
    validNomination()
  ));
});

test("nomination creation keeps UID ownership as the security boundary instead of token email equality", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "different-submitter-email"),
    validNomination({ submitterEmail: OTHER_EMAIL })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "uid-mismatch"),
    validNomination({ submittedByUid: OTHER_UID })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "uid-mismatch-email-match"),
    validNomination({
      submittedByUid: OTHER_UID,
      submitterEmail: OWNER_EMAIL
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "invalid-submitter-email"),
    validNomination({ submitterEmail: "not-an-email" })
  ));
});

test("nomination creation rejects missing required fields and forbidden extras", async () => {
  const missingTitle = validNomination();
  delete missingTitle.title;
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "missing-title"),
    missingTitle
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "unknown-extra"),
    validNomination({ unexpectedField: "not allowed" })
  ));

  for (const fieldName of [
    "adminNotes",
    "adminAssessmentSummary",
    "reviewHistory",
    "promotedPlaceId",
    "promotedAt"
  ]) {
    await assertFails(setDoc(
      doc(ownerFirestore(), "placeNominations", `forbidden-${fieldName}`),
      validNomination({ [fieldName]: fieldName === "reviewHistory" ? [] : "private" })
    ));
  }
});

test("owners and admins can read nominations but other users and guests cannot", async () => {
  await seedDocument("placeNominations/read-boundary", validNomination());

  await assertSucceeds(getDoc(doc(ownerFirestore(), "placeNominations", "read-boundary")));
  await assertFails(getDoc(doc(otherFirestore(), "placeNominations", "read-boundary")));
  await assertFails(getDoc(doc(
    testEnv.unauthenticatedContext().firestore(),
    "placeNominations",
    "read-boundary"
  )));
  await assertSucceeds(getDoc(doc(adminFirestore(), "placeNominations", "read-boundary")));
});

test("only admins can update the allowed review fields", async () => {
  const reviewUpdate = {
    nominationStatus: "under review",
    adminNotes: "Review note",
    adminHistoricInterest: true,
    adminArchitecturalInterest: false,
    adminCommunityValue: true,
    adminConditionRisk: false,
    adminAssessmentSummary: "Initial assessment",
    reviewHistory: [{ action: "review_saved", by: ADMIN_UID }],
    reviewedAt: timestamp(10),
    updatedAt: timestamp(11)
  };

  await seedDocument("placeNominations/admin-review", validNomination());
  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "placeNominations", "admin-review"),
    reviewUpdate
  ));

  await seedDocument("placeNominations/non-admin-review", validNomination());
  await assertFails(updateDoc(
    doc(ownerFirestore(), "placeNominations", "non-admin-review"),
    reviewUpdate
  ));

  await seedDocument("placeNominations/outside-review-allowlist", validNomination());
  await assertFails(updateDoc(
    doc(adminFirestore(), "placeNominations", "outside-review-allowlist"),
    { ...reviewUpdate, title: "Changed by review" }
  ));
});

test("promotion is admin-only, approved-only, and restricted to its allowed shape", async () => {
  const promotionUpdate = {
    nominationStatus: "promoted",
    promotedPlaceId: "promoted-place-id",
    promotedAt: timestamp(20),
    updatedAt: timestamp(21),
    reviewHistory: [{ action: "nomination_promoted", by: ADMIN_UID }]
  };

  await seedDocument(
    "placeNominations/admin-promotion",
    validNomination({ nominationStatus: "approved" })
  );
  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "placeNominations", "admin-promotion"),
    promotionUpdate
  ));

  await seedDocument(
    "placeNominations/non-admin-promotion",
    validNomination({ nominationStatus: "approved" })
  );
  await assertFails(updateDoc(
    doc(ownerFirestore(), "placeNominations", "non-admin-promotion"),
    promotionUpdate
  ));

  await seedDocument("placeNominations/non-approved-promotion", validNomination());
  await assertFails(updateDoc(
    doc(adminFirestore(), "placeNominations", "non-approved-promotion"),
    promotionUpdate
  ));

  await seedDocument(
    "placeNominations/outside-promotion-allowlist",
    validNomination({ nominationStatus: "approved" })
  );
  await assertFails(updateDoc(
    doc(adminFirestore(), "placeNominations", "outside-promotion-allowlist"),
    { ...promotionUpdate, title: "Promotion must not rewrite the nomination title" }
  ));
});

test("admin updates reject newly added fields outside the review and promotion allowlists", async () => {
  const reviewUpdate = {
    nominationStatus: "under review",
    adminNotes: "Review note",
    adminHistoricInterest: true,
    adminArchitecturalInterest: false,
    adminCommunityValue: true,
    adminConditionRisk: false,
    adminAssessmentSummary: "Initial assessment",
    reviewHistory: [{ action: "review_saved", by: ADMIN_UID }],
    reviewedAt: timestamp(10),
    updatedAt: timestamp(11),
    unexpectedField: "should be denied"
  };

  await seedDocument("placeNominations/review-added-field", validNomination());
  await assertFails(updateDoc(
    doc(adminFirestore(), "placeNominations", "review-added-field"),
    reviewUpdate
  ));

  const promotionUpdate = {
    nominationStatus: "promoted",
    promotedPlaceId: "promoted-place-id",
    promotedAt: timestamp(20),
    updatedAt: timestamp(21),
    reviewHistory: [{ action: "nomination_promoted", by: ADMIN_UID }],
    unexpectedField: "should be denied"
  };

  await seedDocument(
    "placeNominations/promotion-added-field",
    validNomination({ nominationStatus: "approved" })
  );
  await assertFails(updateDoc(
    doc(adminFirestore(), "placeNominations", "promotion-added-field"),
    promotionUpdate
  ));
});
