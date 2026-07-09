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
  buildApproveContributionReplyPayload,
  buildContributionImagePromotionPayload,
  buildPlaceContributionCreatePayload,
  buildPlaceContributionReplyCreatePayload,
  buildPublicPlaceContributionPayload,
  buildPublicPlaceContributionReplyPayload,
  buildRejectContributionReplyUpdate,
  buildRejectContributionUpdate,
  getInitialContributionStatus,
  getPlaceContributionValidationErrors,
  groupPublicPlaceContributionRepliesByContribution
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

function buildValidUploadedImageMetadata(overrides = {}) {
  return {
    imageStoragePath: "place-contribution-images/public-user-1/draft-123/front-view.webp",
    imageFileName: "front-view.webp",
    imageFileContentType: "image/webp",
    imageFileSize: 123456,
    imageUploadedAt: "uploaded",
    imageUploadedByUid: "public-user-1",
    imageUploadVisibility: "contribution-private",
    ...overrides
  };
}

function buildValidReply(overrides = {}) {
  return {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "A later resident reply adds more context.",
    replyStatus: "approved",
    submittedAt: "submitted",
    approvedAt: "approved",
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

test("valid uploaded image contribution normalizes private metadata", () => {
  const payload = buildPlaceContributionCreatePayload(buildValidContribution({
    contributionText: "",
    imageUrl: "",
    ...buildValidUploadedImageMetadata()
  }));

  assert.equal(payload.imageStoragePath, "place-contribution-images/public-user-1/draft-123/front-view.webp");
  assert.equal(payload.imageFileName, "front-view.webp");
  assert.equal(payload.imageFileContentType, "image/webp");
  assert.equal(payload.imageFileSize, 123456);
  assert.equal(payload.imageUploadedAt, "uploaded");
  assert.equal(payload.imageUploadedByUid, "public-user-1");
  assert.equal(payload.imageUploadVisibility, "contribution-private");
  assert.equal(payload.contributionStatus, "submitted");
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "imageUrl"), false);
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

test("forged uploaded image UID and unsafe metadata are rejected", () => {
  assert.throws(() => buildPlaceContributionCreatePayload(buildValidContribution({
    contributionText: "",
    imageUrl: "",
    ...buildValidUploadedImageMetadata({
      imageStoragePath: "place-contribution-images/other-user/draft-123/front-view.webp",
      imageUploadedByUid: "other-user"
    })
  })), /Uploaded image metadata is not valid/);

  assert.throws(() => buildPlaceContributionCreatePayload(buildValidContribution({
    contributionText: "",
    imageUrl: "",
    ...buildValidUploadedImageMetadata({
      imageFileContentType: "application/pdf"
    })
  })), /Uploaded image metadata is not valid/);

  assert.throws(() => buildPlaceContributionCreatePayload(buildValidContribution({
    contributionText: "",
    imageUrl: "",
    ...buildValidUploadedImageMetadata({
      imageUploadVisibility: "public"
    })
  })), /Uploaded image metadata is not valid/);
});

test("partial uploaded image metadata is rejected", () => {
  assert.throws(() => buildPlaceContributionCreatePayload(buildValidContribution({
    contributionText: "",
    imageUrl: "",
    imageStoragePath: "place-contribution-images/public-user-1/draft-123/front-view.webp"
  })), /Uploaded image metadata is not valid/);
});

test("blank contribution with no text and no image is invalid", () => {
  const errors = getPlaceContributionValidationErrors(buildValidContribution({
    contributionText: "",
    imageUrl: ""
  }));

  assert.equal(errors.includes("Contribution must include text and/or an image."), true);
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
    ...buildValidUploadedImageMetadata(),
    adminNotes: "private moderation note",
    reviewHistory: [{ action: "reviewed" }]
  });

  [
    "submittedByUid",
    "submitterEmail",
    "submitterDisplayName",
    "imagePermissionConfirmed",
    "imageStoragePath",
    "imageFileName",
    "imageFileContentType",
    "imageFileSize",
    "imageUploadedAt",
    "imageUploadedByUid",
    "imageUploadVisibility",
    "adminNotes",
    "reviewHistory"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(publicPayload, fieldName), false, `${fieldName} should not be public`);
  });
});

test("approved uploaded image converted to imageUrl creates public payload", () => {
  const publicPayload = buildPublicPlaceContributionPayload({
    ...buildValidContribution({
      contributionStatus: "approved",
      contributionText: "",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/example/o/place-contribution-images%2Fpublic-user-1%2Fdraft-123%2Ffront-view.webp?alt=media",
      imageCaption: "Approved uploaded image",
      imageCredit: "Photo by resident",
      imageRightsStatus: "own-work"
    }),
    createdAt: "created",
    updatedAt: "updated",
    reviewedAt: "reviewed"
  });

  assert.equal(publicPayload.imageUrl.startsWith("https://firebasestorage.googleapis.com/"), true);
  assert.equal(publicPayload.imageCaption, "Approved uploaded image");
  assert.equal(Object.prototype.hasOwnProperty.call(publicPayload, "imageStoragePath"), false);
});

test("approved reply creates a public-safe payload", () => {
  const publicPayload = buildPublicPlaceContributionReplyPayload({
    ...buildValidReply(),
    submittedByUid: "public-user-1",
    submittedByDisplayName: "Resident One",
    approvedByUid: "admin-user-1",
    adminNotes: "private moderation note"
  });

  assert.deepEqual(publicPayload, {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "A later resident reply adds more context.",
    replyStatus: "approved",
    submittedAt: "submitted",
    approvedAt: "approved"
  });
});

test("submitted and rejected replies do not create public payloads", () => {
  assert.equal(buildPublicPlaceContributionReplyPayload(buildValidReply({
    replyStatus: "submitted"
  })), null);

  assert.equal(buildPublicPlaceContributionReplyPayload(buildValidReply({
    replyStatus: "rejected"
  })), null);
});

test("approved replies are grouped under their matching contribution IDs", () => {
  const groupedReplies = groupPublicPlaceContributionRepliesByContribution([
    buildValidReply({
      contributionId: "approved-contribution-2",
      replyText: "Second contribution reply.",
      approvedAt: "2026-07-08"
    }),
    buildValidReply({
      contributionId: "approved-contribution-1",
      replyText: "First contribution older reply.",
      approvedAt: "2026-07-06"
    }),
    buildValidReply({
      contributionId: "approved-contribution-1",
      replyText: "First contribution newer reply.",
      approvedAt: "2026-07-07",
      submittedByUid: "should-not-leak"
    }),
    buildValidReply({
      contributionId: "approved-contribution-1",
      replyText: "Submitted reply should stay hidden.",
      replyStatus: "submitted"
    })
  ]);

  assert.deepEqual(Object.keys(groupedReplies).sort(), [
    "approved-contribution-1",
    "approved-contribution-2"
  ]);
  assert.deepEqual(
    groupedReplies["approved-contribution-1"].map((reply) => reply.replyText),
    [
      "First contribution older reply.",
      "First contribution newer reply."
    ]
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(groupedReplies["approved-contribution-1"][1], "submittedByUid"),
    false
  );
  assert.deepEqual(
    groupedReplies["approved-contribution-2"].map((reply) => reply.replyText),
    ["Second contribution reply."]
  );
});

test("valid submitted reply payload shape is public-review safe", () => {
  const payload = buildPlaceContributionReplyCreatePayload({
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "  This reply should wait for review.  ",
    submittedByUid: "public-user-1",
    submittedByDisplayName: "Resident One",
    replyStatus: "approved",
    approvedAt: "forged",
    approvedByUid: "admin-user-1",
    rejectedAt: "forged",
    rejectedByUid: "admin-user-1",
    adminNotes: "private note"
  }, {
    submittedAt: "submitted"
  });

  assert.deepEqual(payload, {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "This reply should wait for review.",
    replyStatus: "submitted",
    submittedAt: "submitted",
    submittedByUid: "public-user-1",
    submittedByDisplayName: "Resident One"
  });
});

test("empty submitted reply text is rejected", () => {
  assert.throws(() => buildPlaceContributionReplyCreatePayload({
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "   ",
    submittedByUid: "public-user-1"
  }, {
    submittedAt: "submitted"
  }), /Reply text is required/);
});

test("submitted reply payload omits moderation fields even when supplied", () => {
  const payload = buildPlaceContributionReplyCreatePayload({
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "A reviewed reply later.",
    submittedByUid: "public-user-1",
    approvedAt: "forged",
    approvedByUid: "admin-user-1",
    rejectedAt: "forged",
    rejectedByUid: "admin-user-1",
    adminNotes: "private note"
  }, {
    submittedAt: "submitted"
  });

  [
    "approvedAt",
    "approvedByUid",
    "rejectedAt",
    "rejectedByUid",
    "adminNotes"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(payload, fieldName), false, `${fieldName} should not be written by the public client`);
  });
  assert.equal(payload.replyStatus, "submitted");
});

test("submitted reply is not added to approved reply renderer groups immediately", () => {
  const groupedReplies = groupPublicPlaceContributionRepliesByContribution([
    buildPlaceContributionReplyCreatePayload({
      placeId: "phase-11c-image-promotion-live-test-20260630024821",
      contributionId: "approved-contribution-1",
      replyText: "This reply is still pending review.",
      submittedByUid: "public-user-1"
    }, {
      submittedAt: "submitted"
    })
  ]);

  assert.deepEqual(groupedReplies, {});
});

test("reply approval payload replaces submitted reply with public-safe fields only", () => {
  const submittedAt = "submitted";
  const payload = buildApproveContributionReplyPayload({
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "A reviewed reply.",
    replyStatus: "submitted",
    submittedAt,
    submittedByUid: "public-user-1",
    submittedByDisplayName: "Resident One",
    adminNotes: "private note"
  }, {
    approvedAt: "approved"
  });

  assert.deepEqual(payload, {
    placeId: "phase-11c-image-promotion-live-test-20260630024821",
    contributionId: "approved-contribution-1",
    replyText: "A reviewed reply.",
    replyStatus: "approved",
    submittedAt,
    approvedAt: "approved"
  });
});

test("reply rejection update keeps moderation data private", () => {
  const payload = buildRejectContributionReplyUpdate({
    rejectedByUid: "admin-user-1",
    adminNotes: "  Not appropriate for this contribution.  "
  }, {
    rejectedAt: "rejected"
  });

  assert.deepEqual(payload, {
    replyStatus: "rejected",
    rejectedAt: "rejected",
    rejectedByUid: "admin-user-1",
    adminNotes: "Not appropriate for this contribution."
  });
});

test("approved contribution image builds public-safe main image promotion payload", () => {
  const payload = buildContributionImagePromotionPayload({
    id: "approved-contribution-1",
    ...buildValidContribution({
      contributionStatus: "approved",
      imageUrl: "https://example.org/contribution-photo.jpg",
      imageCaption: "South entrance in summer",
      imageCredit: "Photo by resident",
      imageRightsStatus: "permission-granted"
    }),
    ...buildValidUploadedImageMetadata(),
    submittedByUid: "public-user-1",
    submitterEmail: "user@example.org",
    adminNotes: "private moderation note"
  }, {
    promotedContributionImageAt: "promoted",
    updatedAt: "updated"
  });

  assert.deepEqual(payload, {
    imageUrl: "https://example.org/contribution-photo.jpg",
    promotedContributionId: "approved-contribution-1",
    promotedContributionImageUrl: "https://example.org/contribution-photo.jpg",
    imageCaption: "South entrance in summer",
    imageCredit: "Photo by resident",
    imageRightsStatus: "permission-granted",
    promotedContributionImageCaption: "South entrance in summer",
    promotedContributionImageCredit: "Photo by resident",
    promotedContributionImageRightsStatus: "permission-granted",
    promotedContributionImageAt: "promoted",
    updatedAt: "updated"
  });

  [
    "imageStoragePath",
    "imageFileName",
    "imageFileContentType",
    "imageFileSize",
    "imageUploadedAt",
    "imageUploadedByUid",
    "imageUploadVisibility",
    "submittedByUid",
    "submitterEmail",
    "adminNotes"
  ].forEach((fieldName) => {
    assert.equal(Object.prototype.hasOwnProperty.call(payload, fieldName), false, `${fieldName} should not be promoted`);
  });
});

test("only approved contribution images can be promoted", () => {
  assert.throws(() => buildContributionImagePromotionPayload(buildValidContribution({
    contributionStatus: "submitted",
    imageUrl: "https://example.org/submitted.jpg"
  }), {
    contributionId: "submitted-contribution"
  }), /Only approved contribution images can be promoted/);

  assert.throws(() => buildContributionImagePromotionPayload(buildValidContribution({
    contributionStatus: "approved",
    imageUrl: ""
  }), {
    contributionId: "approved-text-only"
  }), /Only approved contribution images can be promoted/);
});

test("admin approve update payload is correct", () => {
  const payload = buildApproveContributionUpdate({
    adminNotes: "Approved for public display.",
    reviewedByUid: "admin-user-1",
    reviewHistory: [{ action: "approved" }]
  }, {
    reviewedAt: "reviewed",
    updatedAt: "updated"
  });

  assert.deepEqual(payload, {
    contributionStatus: "approved",
    reviewedAt: "reviewed",
    updatedAt: "updated"
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

test("admin reject update payload can include reviewedByUid and reviewHistory", () => {
  const payload = buildRejectContributionUpdate({
    reviewedByUid: "admin-user-1",
    adminNotes: "Missing permission evidence.",
    reviewHistory: [{ action: "rejected" }]
  }, {
    reviewedAt: "reviewed",
    updatedAt: "updated"
  });

  assert.deepEqual(payload, {
    contributionStatus: "rejected",
    reviewedAt: "reviewed",
    updatedAt: "updated",
    reviewedByUid: "admin-user-1",
    adminNotes: "Missing permission evidence.",
    reviewHistory: [{ action: "rejected" }]
  });
});
