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
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
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

function validSubmittedPlaceContribution(overrides = {}) {
  return {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    placeTitleSnapshot: "Phase 11C Image Promotion Live Test 20260630024821",
    contributionText: "A submitted community note for review.",
    submittedByUid: OWNER_UID,
    submitterEmail: OWNER_EMAIL,
    submitterDisplayName: "Owner Example",
    contributionStatus: "submitted",
    createdAt: timestamp(40),
    updatedAt: timestamp(41),
    ...overrides
  };
}

function validContributionUploadedImageMetadata(overrides = {}) {
  return {
    imageStoragePath: `place-contribution-images/${OWNER_UID}/draft-123/front-view.webp`,
    imageFileName: "front-view.webp",
    imageFileContentType: "image/webp",
    imageFileSize: 123456,
    imageUploadedAt: timestamp(42),
    imageUploadedByUid: OWNER_UID,
    imageUploadVisibility: "contribution-private",
    ...overrides
  };
}

function validSubmittedPlaceContributionReply(overrides = {}) {
  return {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-reply-parent",
    replyText: "A signed-in community reply awaiting moderation.",
    replyStatus: "submitted",
    submittedAt: timestamp(70),
    submittedByUid: OWNER_UID,
    submittedByDisplayName: "Owner Example",
    ...overrides
  };
}

function validApprovedPlaceContributionReply(overrides = {}) {
  return {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-reply-parent",
    replyText: "An approved public community reply.",
    replyStatus: "approved",
    submittedAt: timestamp(71),
    approvedAt: timestamp(72),
    publicSafe: true,
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

async function seedApprovedReplyParent(overrides = {}) {
  await seedDocument(
    "placeContributions/approved-reply-parent",
    validPlaceContribution(overrides)
  );
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

test("contribution image promotion updates public place image fields by admin only", async () => {
  await seedDocument("communityPlaces/promotion-target", {
    title: "Promotion Target",
    imageUrl: "https://example.org/original-place-image.jpg"
  });

  const promotionPayload = {
    imageUrl: "https://example.org/approved-contribution-photo.jpg",
    imageCaption: "South entrance",
    imageCredit: "Photo by resident",
    imageRightsStatus: "permission-granted",
    promotedContributionId: "approved-contribution-1",
    promotedContributionImageUrl: "https://example.org/approved-contribution-photo.jpg",
    promotedContributionImageCaption: "South entrance",
    promotedContributionImageCredit: "Photo by resident",
    promotedContributionImageRightsStatus: "permission-granted",
    promotedContributionImageAt: timestamp(22),
    updatedAt: timestamp(23)
  };

  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "communityPlaces", "promotion-target"),
    promotionPayload
  ));

  await assertFails(updateDoc(
    doc(ownerFirestore(), "communityPlaces", "promotion-target"),
    {
      imageUrl: "https://example.org/not-admin.jpg",
      promotedContributionId: "not-admin"
    }
  ));

  const publicSnapshot = await assertSucceeds(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "communityPlaces", "promotion-target")
  ));
  assert.equal(publicSnapshot.data().imageUrl, "https://example.org/approved-contribution-photo.jpg");
  assert.equal(publicSnapshot.data().promotedContributionId, "approved-contribution-1");
});

test("normal admin community place edits can update unrelated fields and updatedAt", async () => {
  await seedDocument("communityPlaces/admin-edit-target", {
    title: "Original Place Title",
    category: "Historic building",
    lat: 27.62,
    lng: 113.85,
    updatedAt: timestamp(23)
  });

  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "communityPlaces", "admin-edit-target"),
    {
      title: "Updated Place Title",
      category: "Community landmark",
      lat: 27.63,
      lng: 113.86,
      updatedAt: timestamp(24)
    }
  ));
});

test("normal admin community place edits cannot mix image fields with unrelated fields", async () => {
  await seedDocument("communityPlaces/promotion-shape-target", {
    title: "Promotion Shape Target",
    imageUrl: "https://example.org/original-place-image.jpg"
  });

  await assertFails(updateDoc(
    doc(adminFirestore(), "communityPlaces", "promotion-shape-target"),
    {
      imageUrl: "https://example.org/approved-contribution-photo.jpg",
      promotedContributionId: "approved-contribution-1",
      promotedContributionImageUrl: "https://example.org/approved-contribution-photo.jpg",
      promotedContributionImageAt: timestamp(24),
      updatedAt: timestamp(25),
      title: "Should not be rewritten through the promotion path"
    }
  ));
});

test("community place image promotion cannot write private contribution upload fields", async () => {
  await seedDocument("communityPlaces/private-promotion-target", {
    title: "Private Promotion Target",
    imageUrl: "https://example.org/original-place-image.jpg"
  });

  for (const fieldName of [
    "imageStoragePath",
    "imageFileName",
    "imageFileContentType",
    "imageFileSize",
    "imageUploadedAt",
    "imageUploadedByUid",
    "imageUploadVisibility",
    "adminNotes",
    "submittedByUid",
    "submitterEmail",
    "submitterDisplayName",
    "reviewedByUid"
  ]) {
    await assertFails(updateDoc(
      doc(adminFirestore(), "communityPlaces", "private-promotion-target"),
      {
        imageUrl: "https://example.org/approved-contribution-photo.jpg",
        promotedContributionId: "approved-contribution-1",
        promotedContributionImageUrl: "https://example.org/approved-contribution-photo.jpg",
        promotedContributionImageAt: timestamp(26),
        updatedAt: timestamp(27),
        [fieldName]: fieldName === "imageFileSize" ? 123 : "private"
      }
    ));
  }
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

test("admins can read submitted and rejected place contributions for moderation", async () => {
  await seedDocument(
    "placeContributions/admin-readable-submitted-contribution",
    validSubmittedPlaceContribution()
  );
  await seedDocument(
    "placeContributions/admin-readable-rejected-contribution",
    validSubmittedPlaceContribution({
      contributionStatus: "rejected",
      reviewedAt: timestamp(44),
      reviewedByUid: ADMIN_UID,
      adminNotes: "Needs a clearer image source."
    })
  );

  const submittedSnapshot = await assertSucceeds(getDoc(
    doc(adminFirestore(), "placeContributions", "admin-readable-submitted-contribution")
  ));
  const rejectedSnapshot = await assertSucceeds(getDoc(
    doc(adminFirestore(), "placeContributions", "admin-readable-rejected-contribution")
  ));

  assert.equal(submittedSnapshot.data().contributionStatus, "submitted");
  assert.equal(rejectedSnapshot.data().contributionStatus, "rejected");
});

test("signed-in non-admin users cannot read submitted place contributions", async () => {
  await seedDocument(
    "placeContributions/non-admin-private-submitted-contribution",
    validSubmittedPlaceContribution()
  );

  await assertFails(getDoc(
    doc(ownerFirestore(), "placeContributions", "non-admin-private-submitted-contribution")
  ));
});

test("approved place contributions with private fields cannot be read publicly", async () => {
  await seedDocument(
    "placeContributions/approved-private-field-contribution",
    validPlaceContribution({
      submittedByUid: OWNER_UID,
      submitterEmail: OWNER_EMAIL,
      ...validContributionUploadedImageMetadata(),
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

test("signed-out users cannot create place contributions", async () => {
  await assertFails(setDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributions", "signed-out-create"),
    validSubmittedPlaceContribution()
  ));
});

test("signed-in users can create submitted place contributions", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeContributions", "signed-in-create"),
    validSubmittedPlaceContribution({
      imageUrl: "https://example.org/submitted-contribution-photo.jpg",
      imageCaption: "Street frontage in spring",
      imageCredit: "Photo by owner",
      imageRightsStatus: "permission-granted",
      imagePermissionConfirmed: true
    })
  ));
});

test("signed-in users can create submitted place contributions with private uploaded image metadata", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeContributions", "signed-in-upload-create"),
    validSubmittedPlaceContribution({
      contributionText: "",
      ...validContributionUploadedImageMetadata()
    })
  ));
});

test("signed-in users cannot forge uploaded contribution image ownership metadata", async () => {
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "forged-upload-owner"),
    validSubmittedPlaceContribution({
      contributionText: "",
      ...validContributionUploadedImageMetadata({
        imageUploadedByUid: OTHER_UID
      })
    })
  ));
});

test("signed-in users cannot create uploaded contribution image metadata with another UID path", async () => {
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "forged-upload-path"),
    validSubmittedPlaceContribution({
      contributionText: "",
      ...validContributionUploadedImageMetadata({
        imageStoragePath: `place-contribution-images/${OTHER_UID}/draft-123/front-view.webp`
      })
    })
  ));
});

test("signed-in users cannot create approved or rejected place contributions directly", async () => {
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "invalid-approved-create"),
    validSubmittedPlaceContribution({
      contributionStatus: "approved"
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "invalid-rejected-create"),
    validSubmittedPlaceContribution({
      contributionStatus: "rejected"
    })
  ));
});

test("signed-in users cannot create place contributions with moderation fields", async () => {
  for (const [fieldName, value] of [
    ["adminNotes", "Private moderation note"],
    ["reviewHistory", [{ action: "submitted" }]],
    ["reviewedAt", timestamp(42)],
    ["reviewedByUid", ADMIN_UID]
  ]) {
    await assertFails(setDoc(
      doc(ownerFirestore(), "placeContributions", `forbidden-${fieldName}`),
      validSubmittedPlaceContribution({
        [fieldName]: value
      })
    ));
  }
});

test("signed-in users cannot impersonate another contributor UID", async () => {
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "uid-mismatch-create"),
    validSubmittedPlaceContribution({
      submittedByUid: OTHER_UID
    })
  ));
});

test("submitted place contributions must include text and or an HTTPS image URL", async () => {
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "blank-contribution"),
    validSubmittedPlaceContribution({
      contributionText: ""
    })
  ));

  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeContributions", "image-only-contribution"),
    validSubmittedPlaceContribution({
      contributionText: "",
      imageUrl: "https://example.org/image-only-contribution.jpg",
      imageRightsStatus: "public-web-reference"
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributions", "invalid-image-url"),
    validSubmittedPlaceContribution({
      contributionText: "",
      imageUrl: "http://example.org/not-secure.jpg"
    })
  ));
});

test("only admins can approve submitted place contributions into a public-safe shape", async () => {
  await seedDocument("communityPlaces/phase-11c-image-promotion-live-test-20260630024821", {
    title: "Phase 11C Image Promotion Live Test 20260630024821",
    imageUrl: "https://example.org/original-main-place-image.jpg"
  });

  await seedDocument(
    "placeContributions/admin-approve",
    validSubmittedPlaceContribution({
      imageUrl: "https://example.org/admin-approve.jpg",
      imageCaption: "Front elevation",
      imageCredit: "Owner upload",
      imageRightsStatus: "permission-granted",
      imagePermissionConfirmed: true
    })
  );

  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "placeContributions", "admin-approve"),
    {
      contributionStatus: "approved",
      reviewedAt: timestamp(50),
      updatedAt: timestamp(51),
      imagePermissionConfirmed: deleteField(),
      submittedByUid: deleteField(),
      submitterEmail: deleteField(),
      submitterDisplayName: deleteField()
    }
  ));

  const publicSnapshot = await assertSucceeds(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributions", "admin-approve")
  ));
  assert.equal(publicSnapshot.exists(), true);
  assert.equal(publicSnapshot.data().contributionStatus, "approved");
  assert.equal(Object.prototype.hasOwnProperty.call(publicSnapshot.data(), "submittedByUid"), false);

  const placeSnapshot = await assertSucceeds(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "communityPlaces", "phase-11c-image-promotion-live-test-20260630024821")
  ));
  assert.equal(placeSnapshot.data().imageUrl, "https://example.org/original-main-place-image.jpg");
  assert.equal(Object.prototype.hasOwnProperty.call(placeSnapshot.data(), "promotedContributionId"), false);
});

test("admin approval of uploaded-image contributions must remove private fields and leave public-safe output", async () => {
  await seedDocument(
    "placeContributions/admin-approve-upload",
    validSubmittedPlaceContribution({
      contributionText: "",
      ...validContributionUploadedImageMetadata()
    })
  );

  await assertFails(updateDoc(
    doc(adminFirestore(), "placeContributions", "admin-approve-upload"),
    {
      contributionStatus: "approved",
      reviewedAt: timestamp(60),
      updatedAt: timestamp(61),
      imagePermissionConfirmed: deleteField(),
      imageStoragePath: deleteField(),
      imageFileName: deleteField(),
      imageFileContentType: deleteField(),
      imageFileSize: deleteField(),
      imageUploadedAt: deleteField(),
      imageUploadedByUid: deleteField(),
      imageUploadVisibility: deleteField(),
      submittedByUid: deleteField(),
      submitterEmail: deleteField(),
      submitterDisplayName: deleteField()
    }
  ));

  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "placeContributions", "admin-approve-upload"),
    {
      contributionStatus: "approved",
      reviewedAt: timestamp(62),
      updatedAt: timestamp(63),
      imageUrl: "https://example.org/approved-uploaded-contribution.webp",
      imageCaption: "Approved uploaded image",
      imageCredit: "Photo by owner",
      imageRightsStatus: "permission-granted",
      imagePermissionConfirmed: deleteField(),
      imageStoragePath: deleteField(),
      imageFileName: deleteField(),
      imageFileContentType: deleteField(),
      imageFileSize: deleteField(),
      imageUploadedAt: deleteField(),
      imageUploadedByUid: deleteField(),
      imageUploadVisibility: deleteField(),
      submittedByUid: deleteField(),
      submitterEmail: deleteField(),
      submitterDisplayName: deleteField()
    }
  ));

  const publicSnapshot = await assertSucceeds(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributions", "admin-approve-upload")
  ));
  assert.equal(publicSnapshot.data().imageUrl, "https://example.org/approved-uploaded-contribution.webp");
  assert.equal(Object.prototype.hasOwnProperty.call(publicSnapshot.data(), "imageStoragePath"), false);
});

test("admins cannot approve place contributions while leaving private fields in the document", async () => {
  await seedDocument(
    "placeContributions/invalid-admin-approve",
    validSubmittedPlaceContribution()
  );

  await assertFails(updateDoc(
    doc(adminFirestore(), "placeContributions", "invalid-admin-approve"),
    {
      contributionStatus: "approved",
      reviewedAt: timestamp(52),
      updatedAt: timestamp(53)
    }
  ));
});

test("only admins can reject submitted place contributions with private moderation notes", async () => {
  await seedDocument(
    "placeContributions/admin-reject",
    validSubmittedPlaceContribution()
  );

  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "placeContributions", "admin-reject"),
    {
      contributionStatus: "rejected",
      reviewedAt: timestamp(54),
      reviewedByUid: ADMIN_UID,
      updatedAt: timestamp(55),
      adminNotes: "The source could not be verified."
    }
  ));

  await assertFails(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributions", "admin-reject")
  ));
});

test("non-admin users cannot approve or reject submitted place contributions", async () => {
  await seedDocument(
    "placeContributions/non-admin-review",
    validSubmittedPlaceContribution()
  );

  await assertFails(updateDoc(
    doc(ownerFirestore(), "placeContributions", "non-admin-review"),
    {
      contributionStatus: "approved",
      reviewedAt: timestamp(56),
      updatedAt: timestamp(57),
      imagePermissionConfirmed: deleteField(),
      submittedByUid: deleteField(),
      submitterEmail: deleteField(),
      submitterDisplayName: deleteField()
    }
  ));

  await assertFails(updateDoc(
    doc(ownerFirestore(), "placeContributions", "non-admin-review"),
    {
      contributionStatus: "rejected",
      reviewedAt: timestamp(58),
      reviewedByUid: OWNER_UID,
      updatedAt: timestamp(59),
      adminNotes: "Not allowed."
    }
  ));
});

test("signed-in users can create submitted replies to approved place contributions as themselves", async () => {
  await seedApprovedReplyParent();

  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeContributionReplies", "owner-submitted-reply"),
    validSubmittedPlaceContributionReply()
  ));
});

test("signed-out users cannot create place contribution replies", async () => {
  await seedApprovedReplyParent();

  await assertFails(setDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributionReplies", "signed-out-reply"),
    validSubmittedPlaceContributionReply()
  ));
});

test("signed-in users cannot forge another reply submitter UID", async () => {
  await seedApprovedReplyParent();

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributionReplies", "forged-reply-owner"),
    validSubmittedPlaceContributionReply({
      submittedByUid: OTHER_UID
    })
  ));
});

test("signed-in users cannot create approved or rejected replies directly", async () => {
  await seedApprovedReplyParent();

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributionReplies", "direct-approved-reply"),
    validSubmittedPlaceContributionReply({
      replyStatus: "approved",
      approvedAt: timestamp(73)
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributionReplies", "direct-rejected-reply"),
    validSubmittedPlaceContributionReply({
      replyStatus: "rejected",
      rejectedAt: timestamp(74),
      rejectedByUid: ADMIN_UID
    })
  ));
});

test("signed-in users cannot include reply moderation fields during create", async () => {
  await seedApprovedReplyParent();

  for (const [fieldName, value] of [
    ["approvedAt", timestamp(75)],
    ["approvedByUid", ADMIN_UID],
    ["rejectedAt", timestamp(76)],
    ["rejectedByUid", ADMIN_UID],
    ["adminNotes", "Private reply moderation note"]
  ]) {
    await assertFails(setDoc(
      doc(ownerFirestore(), "placeContributionReplies", `forbidden-reply-${fieldName}`),
      validSubmittedPlaceContributionReply({
        [fieldName]: value
      })
    ));
  }
});

test("signed-in users cannot create replies for non-approved or mismatched parent contributions", async () => {
  await seedDocument(
    "placeContributions/submitted-reply-parent",
    validSubmittedPlaceContribution({
      placeId: "phase-11c-image-promotion-live-test-20260630024821"
    })
  );
  await seedApprovedReplyParent({
    placeId: "another-place"
  });

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributionReplies", "submitted-parent-reply"),
    validSubmittedPlaceContributionReply({
      contributionId: "submitted-reply-parent"
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeContributionReplies", "mismatched-parent-reply"),
    validSubmittedPlaceContributionReply()
  ));
});

test("public users can read approved place contribution replies with public-safe fields", async () => {
  await seedDocument(
    "placeContributionReplies/approved-public-reply",
    validApprovedPlaceContributionReply()
  );

  const snapshot = await assertSucceeds(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributionReplies", "approved-public-reply")
  ));

  assert.equal(snapshot.exists(), true);
  assert.equal(snapshot.data().replyStatus, "approved");
  assert.equal(Object.prototype.hasOwnProperty.call(snapshot.data(), "submittedByUid"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(snapshot.data(), "adminNotes"), false);
});

test("approved place contribution replies query is public while non-approved replies stay hidden", async () => {
  const placeId = "phase-13d-approved-replies-query";
  await seedDocument(
    "placeContributionReplies/approved-query-reply",
    validApprovedPlaceContributionReply({ placeId })
  );
  await seedDocument(
    "placeContributionReplies/submitted-query-reply",
    validSubmittedPlaceContributionReply({ placeId })
  );
  await seedDocument(
    "placeContributionReplies/rejected-query-reply",
    validSubmittedPlaceContributionReply({
      placeId,
      replyStatus: "rejected",
      rejectedAt: timestamp(73),
      rejectedByUid: ADMIN_UID,
      adminNotes: "Private rejection note"
    })
  );

  const publicDb = testEnv.unauthenticatedContext().firestore();
  const snapshot = await assertSucceeds(getDocs(query(
    collection(publicDb, "placeContributionReplies"),
    where("placeId", "==", placeId),
    where("replyStatus", "==", "approved"),
    where("publicSafe", "==", true)
  )));

  assert.deepEqual(snapshot.docs.map((replyDoc) => replyDoc.id), ["approved-query-reply"]);
});

test("public users cannot read submitted or rejected place contribution replies", async () => {
  await seedDocument(
    "placeContributionReplies/submitted-private-reply",
    validSubmittedPlaceContributionReply()
  );
  await seedDocument(
    "placeContributionReplies/rejected-private-reply",
    validSubmittedPlaceContributionReply({
      replyStatus: "rejected",
      rejectedAt: timestamp(77),
      rejectedByUid: ADMIN_UID,
      adminNotes: "Reply rejected in moderation."
    })
  );

  const publicDb = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(
    doc(publicDb, "placeContributionReplies", "submitted-private-reply")
  ));
  await assertFails(getDoc(
    doc(publicDb, "placeContributionReplies", "rejected-private-reply")
  ));
});

test("admins can read submitted place contribution replies for moderation", async () => {
  await seedDocument(
    "placeContributionReplies/admin-readable-submitted-reply",
    validSubmittedPlaceContributionReply()
  );

  const snapshot = await assertSucceeds(getDoc(
    doc(adminFirestore(), "placeContributionReplies", "admin-readable-submitted-reply")
  ));

  assert.equal(snapshot.data().replyStatus, "submitted");
  assert.equal(snapshot.data().submittedByUid, OWNER_UID);
});

test("admins can approve submitted place contribution replies into a public-safe shape", async () => {
  await seedDocument(
    "placeContributionReplies/admin-approve-reply",
    validSubmittedPlaceContributionReply()
  );

  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "placeContributionReplies", "admin-approve-reply"),
    {
      replyStatus: "approved",
      approvedAt: timestamp(78),
      publicSafe: true,
      submittedByUid: deleteField(),
      submittedByDisplayName: deleteField()
    }
  ));

  const publicSnapshot = await assertSucceeds(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributionReplies", "admin-approve-reply")
  ));
  assert.equal(publicSnapshot.data().replyStatus, "approved");
  assert.equal(Object.prototype.hasOwnProperty.call(publicSnapshot.data(), "submittedByUid"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(publicSnapshot.data(), "submittedByDisplayName"), false);
});

test("admins can replace submitted place contribution replies with only public-safe approval fields", async () => {
  await seedDocument(
    "placeContributionReplies/admin-replace-approve-reply",
    validSubmittedPlaceContributionReply({
      submittedByDisplayName: "Owner Example"
    })
  );

  await assertSucceeds(setDoc(
    doc(adminFirestore(), "placeContributionReplies", "admin-replace-approve-reply"),
    {
      placeId: "phase-11c-image-promotion-live-test-20260630024821",
      contributionId: "approved-reply-parent",
      replyText: "A signed-in community reply awaiting moderation.",
      replyStatus: "approved",
      submittedAt: timestamp(70),
      approvedAt: timestamp(82),
      publicSafe: true
    }
  ));

  const publicSnapshot = await assertSucceeds(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributionReplies", "admin-replace-approve-reply")
  ));
  assert.deepEqual(Object.keys(publicSnapshot.data()).sort(), [
    "approvedAt",
    "contributionId",
    "placeId",
    "publicSafe",
    "replyStatus",
    "replyText",
    "submittedAt"
  ]);
});

test("reply approval cannot rewrite submitted reply public content", async () => {
  await seedDocument(
    "placeContributionReplies/admin-approve-rewrite-reply",
    validSubmittedPlaceContributionReply()
  );

  await assertFails(setDoc(
    doc(adminFirestore(), "placeContributionReplies", "admin-approve-rewrite-reply"),
    {
      placeId: "phase-11c-image-promotion-live-test-20260630024821",
      contributionId: "approved-reply-parent",
      replyText: "Changed during approval.",
      replyStatus: "approved",
      submittedAt: timestamp(70),
      approvedAt: timestamp(83),
      publicSafe: true
    }
  ));
});

test("reply approval cannot retain private fields while setting the public-safe marker", async () => {
  await seedDocument(
    "placeContributionReplies/admin-approve-private-reply",
    validSubmittedPlaceContributionReply()
  );

  await assertFails(setDoc(
    doc(adminFirestore(), "placeContributionReplies", "admin-approve-private-reply"),
    {
      placeId: "phase-11c-image-promotion-live-test-20260630024821",
      contributionId: "approved-reply-parent",
      replyText: "A signed-in community reply awaiting moderation.",
      replyStatus: "approved",
      submittedAt: timestamp(70),
      approvedAt: timestamp(84),
      publicSafe: true,
      submittedByUid: OWNER_UID
    }
  ));
});

test("non-admin users cannot approve or reject submitted place contribution replies", async () => {
  await seedDocument(
    "placeContributionReplies/non-admin-review-reply",
    validSubmittedPlaceContributionReply()
  );

  await assertFails(updateDoc(
    doc(ownerFirestore(), "placeContributionReplies", "non-admin-review-reply"),
    {
      replyStatus: "approved",
      approvedAt: timestamp(80),
      approvedByUid: OWNER_UID
    }
  ));

  await assertFails(updateDoc(
    doc(ownerFirestore(), "placeContributionReplies", "non-admin-review-reply"),
    {
      replyStatus: "rejected",
      rejectedAt: timestamp(81),
      rejectedByUid: OWNER_UID,
      adminNotes: "Not allowed."
    }
  ));
});

test("admins can reject submitted place contribution replies while keeping them private", async () => {
  await seedDocument(
    "placeContributionReplies/admin-reject-reply",
    validSubmittedPlaceContributionReply()
  );

  await assertSucceeds(updateDoc(
    doc(adminFirestore(), "placeContributionReplies", "admin-reject-reply"),
    {
      replyStatus: "rejected",
      rejectedAt: timestamp(79),
      rejectedByUid: ADMIN_UID,
      adminNotes: "Reply does not meet moderation guidelines."
    }
  ));

  await assertFails(getDoc(
    doc(testEnv.unauthenticatedContext().firestore(), "placeContributionReplies", "admin-reject-reply")
  ));
});

test("approved replies with private or moderation fields are not publicly readable", async () => {
  for (const [fieldName, value] of [
    ["submittedByUid", OWNER_UID],
    ["submittedByDisplayName", "Owner Example"],
    ["adminNotes", "Private moderation note"],
    ["approvedByUid", ADMIN_UID],
    ["rejectedByUid", ADMIN_UID]
  ]) {
    await seedDocument(
      `placeContributionReplies/approved-private-reply-${fieldName}`,
      validApprovedPlaceContributionReply({
        [fieldName]: value
      })
    );

    await assertFails(getDoc(
      doc(
        testEnv.unauthenticatedContext().firestore(),
        "placeContributionReplies",
        `approved-private-reply-${fieldName}`
      )
    ));
  }
});

test("approved replies query does not return a matching document that retains private fields", async () => {
  const placeId = "phase-13d-private-reply-query";
  const { publicSafe, ...legacyApprovedReply } = validApprovedPlaceContributionReply({
    placeId,
    submittedByUid: OWNER_UID
  });
  await seedDocument(
    "placeContributionReplies/approved-private-query-reply",
    legacyApprovedReply
  );

  const publicDb = testEnv.unauthenticatedContext().firestore();
  const snapshot = await assertSucceeds(getDocs(query(
    collection(publicDb, "placeContributionReplies"),
    where("placeId", "==", placeId),
    where("replyStatus", "==", "approved"),
    where("publicSafe", "==", true)
  )));
  assert.deepEqual(snapshot.docs, []);
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

test("uploaded private evidence metadata is accepted for the signed-in owner", async () => {
  await assertSucceeds(setDoc(
    doc(ownerFirestore(), "placeNominations", "uploaded-evidence-metadata"),
    validNomination({
      evidenceImageCaption: "South elevation",
      evidenceSourceCredit: "Photo by nominator",
      evidenceRightsStatus: "permission-granted",
      evidencePermissionConfirmed: true,
      evidenceVisibility: "nomination-private",
      evidenceStoragePath: `nomination-evidence/${OWNER_UID}/draft-001/photo-001.webp`,
      evidenceFileName: "photo-001.webp",
      evidenceFileContentType: "image/webp",
      evidenceFileSize: 123456,
      evidenceUploadedAt: timestamp(4),
      evidenceUploadedByUid: OWNER_UID
    })
  ));
});

test("uploaded private evidence metadata is accepted with client server timestamp transforms", async () => {
  const docRef = await assertSucceeds(addDoc(
    collection(ownerFirestore(), "placeNominations"),
    validNomination({
      title: "PR36 Phase13A live upload test 2026-07-03",
      area: "Phase 13A preview test area",
      condition: "Temporary test condition.",
      communityUse: "Temporary test community use.",
      sourceReference: "PR36 Phase13A live upload test 2026-07-03 test source reference.",
      evidenceImageCaption: "PR36 Phase13A live upload test 2026-07-03 test image caption",
      evidenceSourceCredit: "PR36 Phase13A live upload test 2026-07-03 test image credit",
      evidenceRightsStatus: "own-work",
      evidencePermissionConfirmed: true,
      evidenceVisibility: "nomination-private",
      evidenceStoragePath: `nomination-evidence/${OWNER_UID}/0449c66d-e115-46c6-9239-470d3936f236/a6cff275-f240-45df-8f43-a39fb8400967-AdobeStock_1513585232.jpeg`,
      evidenceFileName: "AdobeStock_1513585232.jpeg",
      evidenceFileContentType: "image/jpeg",
      evidenceFileSize: 493406,
      evidenceUploadedAt: serverTimestamp(),
      evidenceUploadedByUid: OWNER_UID,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submittedAt: serverTimestamp()
    })
  ));
  const storedDoc = await assertSucceeds(getDoc(docRef));
  assert.equal(storedDoc.data().evidenceUploadedAt instanceof Timestamp, true);
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

test("uploaded private evidence metadata rejects forged owners and unsafe values", async () => {
  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "uploaded-forged-uid"),
    validNomination({
      evidencePermissionConfirmed: true,
      evidenceVisibility: "nomination-private",
      evidenceStoragePath: `nomination-evidence/${OTHER_UID}/draft-001/photo-001.webp`,
      evidenceFileName: "photo-001.webp",
      evidenceFileContentType: "image/webp",
      evidenceFileSize: 123456,
      evidenceUploadedAt: timestamp(4),
      evidenceUploadedByUid: OTHER_UID
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "uploaded-orphan-forged-uid"),
    validNomination({
      evidenceUploadedByUid: OTHER_UID
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "uploaded-public-visibility"),
    validNomination({
      evidencePermissionConfirmed: true,
      evidenceVisibility: "public",
      evidenceStoragePath: `nomination-evidence/${OWNER_UID}/draft-001/photo-001.webp`,
      evidenceFileName: "photo-001.webp",
      evidenceFileContentType: "image/webp",
      evidenceFileSize: 123456,
      evidenceUploadedAt: timestamp(4),
      evidenceUploadedByUid: OWNER_UID
    })
  ));

  await assertFails(setDoc(
    doc(ownerFirestore(), "placeNominations", "uploaded-unsafe-content-type"),
    validNomination({
      evidencePermissionConfirmed: true,
      evidenceVisibility: "nomination-private",
      evidenceStoragePath: `nomination-evidence/${OWNER_UID}/draft-001/file-001.pdf`,
      evidenceFileName: "file-001.pdf",
      evidenceFileContentType: "application/pdf",
      evidenceFileSize: 123456,
      evidenceUploadedAt: timestamp(4),
      evidenceUploadedByUid: OWNER_UID
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
