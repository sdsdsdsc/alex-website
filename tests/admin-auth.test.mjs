import test from "node:test";
import assert from "node:assert/strict";

import {
  getSafeNextPath,
  isConfiguredAdmin
} from "../admin-auth.mjs";

const BASE_URL = "https://alexs-community-efcd8--phase11c-place-contribution-wor-hotx6ij7.web.app/admin-login.html";

test("getSafeNextPath keeps same-origin next paths", () => {
  assert.equal(
    getSafeNextPath("/manage-place-contributions.html?view=submitted", BASE_URL, "admin.html"),
    "/manage-place-contributions.html?view=submitted"
  );
});

test("getSafeNextPath falls back for cross-origin next paths", () => {
  assert.equal(
    getSafeNextPath("https://example.com/elsewhere", BASE_URL, "admin.html"),
    "admin.html"
  );
});

test("getSafeNextPath falls back for invalid next values", () => {
  assert.equal(
    getSafeNextPath("javascript:alert(1)", BASE_URL, "admin.html"),
    "admin.html"
  );
});

test("isConfiguredAdmin matches only the configured admin uid", () => {
  assert.equal(isConfiguredAdmin({ uid: "admin-123" }, "admin-123"), true);
  assert.equal(isConfiguredAdmin({ uid: "public-456" }, "admin-123"), false);
  assert.equal(isConfiguredAdmin(null, "admin-123"), false);
});
