import { expect, test } from "@playwright/test";

const APP_ORIGIN = "http://127.0.0.1:4173";
const SMOKE_PAGES = [
  {
    path: "/index.html",
    title: /Alex's Photo Board/,
    readySelector: "h2:has-text('Explore Community Heritage Places')"
  },
  {
    path: "/nominate-place.html",
    title: /Nominate a Community Place/,
    readySelector: "#nominationForm"
  },
  {
    path: "/my-nominations.html",
    title: /My Nominations/,
    readySelector: "#myNominationsTitle"
  },
  {
    path: "/manage-nominations.html",
    finalPath: "/admin-login.html",
    title: /Admin Sign In/,
    readySelector: "#adminLoginTitle"
  },
  {
    path: "/export.html",
    title: /Heritage JSON Export/,
    readySelector: "#downloadBtn"
  }
];

function isAppOwnedConsoleError(message) {
  if (!message) return false;

  if (message.includes("Failed to load resource") && message.includes("favicon.ico")) {
    return false;
  }

  if (message.includes("The Content Security Policy directive 'frame-ancestors' is ignored when delivered via a <meta> element.")) {
    return false;
  }

  return true;
}

test.beforeEach(async ({ page }) => {
  await page.route("**/favicon.ico", async (route) => {
    await route.fulfill({ status: 204, body: "" });
  });
});

for (const smokePage of SMOKE_PAGES) {
  test(`${smokePage.path} loads without app-owned console errors`, async ({ page }) => {
    const appConsoleErrors = [];
    const pageErrors = [];

    page.on("console", (message) => {
      if (message.type() !== "error") return;

      const location = message.location();
      const text = message.text();
      const url = location?.url || "";
      const ownsSource = !url || url.startsWith(APP_ORIGIN) || url.includes("gstatic") || url.includes("firebase");

      if (ownsSource && isAppOwnedConsoleError(text)) {
        appConsoleErrors.push(text);
      }
    });

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto(smokePage.path, { waitUntil: "domcontentloaded" });
    expect(response?.ok(), `Expected ${smokePage.path} to return a successful response`).toBeTruthy();

    if (smokePage.finalPath) {
      await expect(page).toHaveURL(new RegExp(`${smokePage.finalPath.replace(".", "\\.")}($|\\?)`));
    }
    await expect(page).toHaveTitle(smokePage.title);
    await expect(page.locator(smokePage.readySelector)).toBeVisible();
    await page.waitForTimeout(1000);

    expect(pageErrors, `Unexpected page errors on ${smokePage.path}`).toEqual([]);
    expect(appConsoleErrors, `Unexpected console errors on ${smokePage.path}`).toEqual([]);
  });
}
