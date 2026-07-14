import { expect, test } from "@playwright/test";

const APP_ORIGIN = "http://127.0.0.1:4173";
const NOMINATION_UPLOAD_MODULE_VERSION = "2026-07-04-evidence-upload-timestamp-fix";
const PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION = "2026-07-11-13d-public-reply-query";
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
    path: "/manage-place-contributions.html",
    finalPath: "/admin-login.html",
    title: /Admin Sign In/,
    readySelector: "#adminLoginTitle"
  },
  {
    path: "/export.html",
    title: /Heritage JSON Export/,
    readySelector: "#downloadBtn"
  },
  {
    path: "/search.html",
    title: /Community Places/,
    readySelector: "#communitySearchForm"
  },
  {
    path: "/map.html",
    title: /Community Map/,
    readySelector: "#mapSearchForm"
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

test("heritage engine helper harness passes", async ({ page }) => {
  await page.goto("/engine-test.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#totalCount")).not.toHaveText("0");
  const sharedDiscovery = page.locator(".test-card", { has: page.locator("h2", { hasText: "Shared Discovery" }) });
  await expect(sharedDiscovery.locator(".result")).toHaveCount(12);
  const failures = await sharedDiscovery.locator(".result:has(.badge--fail)").allTextContents();
  expect(failures).toEqual([]);

  const sharedUrlAndFocus = page.locator(".test-card", { has: page.locator("h2", { hasText: "Shared URL and Focus" }) });
  await expect(sharedUrlAndFocus.locator(".result")).toHaveCount(22);
  const urlAndFocusFailures = await sharedUrlAndFocus.locator(".result:has(.badge--fail)").allTextContents();
  expect(urlAndFocusFailures).toEqual([]);
});

test("map adopts legacy search URLs and keeps q authoritative", async ({ page }) => {
  await page.goto("/map.html?search=fenyi&assetType=Hall&heritageCriteria=Historic%20interest&place=beta-hall", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchInput")).toHaveValue("fenyi");
  await expect(page).toHaveURL(/q=fenyi/);
  const normalizedLegacyUrl = new URL(page.url());
  expect(normalizedLegacyUrl.searchParams.has("search")).toBe(false);
  expect(normalizedLegacyUrl.searchParams.get("assetType")).toBe("Hall");
  expect(normalizedLegacyUrl.searchParams.get("heritageCriteria")).toBe("Historic interest");
  expect(normalizedLegacyUrl.searchParams.get("place")).toBe("beta-hall");
  const listUrl = new URL(await page.locator("#mapViewResultsList").getAttribute("href"), APP_ORIGIN);
  expect(listUrl.searchParams.get("q")).toBe("fenyi");

  await page.goto("/map.html?q=modern&search=legacy", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchInput")).toHaveValue("modern");
  await expect(page).toHaveURL(/q=modern/);
  await expect.poll(() => new URL(page.url()).searchParams.has("search")).toBe(false);
});

test("map restores shared URL state and fails safely for an unknown place ID", async ({ page }) => {
  await page.goto("/map.html?q=memory&category=Building&city=Pingxiang&place=definitely-missing", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchInput")).toHaveValue("memory");
  await expect(page.locator("#mapFocusStatus")).toContainText("requested public place could not be found");
  await expect(page.locator("#mapViewResultsList")).toHaveAttribute("href", /search\.html\?q=memory&place=definitely-missing$/);
  await expect(page).toHaveURL(/place=definitely-missing/);
  const normalizedUrl = new URL(page.url());
  expect(normalizedUrl.searchParams.has("category")).toBe(false);
  expect(normalizedUrl.searchParams.has("city")).toBe(false);
});

test("map exposes a complete state-preserving non-map alternative", async ({ page }) => {
  await page.goto("/map.html?q=memory&assetType=Building&heritageCriteria=Historic%20interest", { waitUntil: "domcontentloaded" });
  const listLink = page.locator("#mapViewResultsList");
  await expect(listLink).toBeVisible();
  await expect(listLink).toHaveAttribute("href", /search\.html\?q=memory.*assetType=Building.*heritageCriteria=Historic\+interest/);
  await expect(page.locator(".map-search-heading__alternative")).toContainText("records without map coordinates");
});

test("map to Places round-trips every shared discovery parameter", async ({ page }) => {
  await page.goto(
    "/map.html?q=memory&category=Building&category=Park&city=Pingxiang&district=Anyuan&assetType=Hall&heritageCriteria=Historic%20interest&place=beta-hall",
    { waitUntil: "domcontentloaded" }
  );
  const listLink = page.locator("#mapViewResultsList");
  await expect(listLink).toHaveAttribute("href", /search\.html\?q=memory/);
  const listUrl = new URL(await listLink.getAttribute("href"), APP_ORIGIN);
  expect(listUrl.pathname).toBe("/search.html");
  expect(listUrl.searchParams.get("q")).toBe("memory");
  expect(listUrl.searchParams.has("category")).toBe(false);
  expect(listUrl.searchParams.has("city")).toBe(false);
  expect(listUrl.searchParams.has("district")).toBe(false);
  expect(listUrl.searchParams.get("assetType")).toBe("Hall");
  expect(listUrl.searchParams.get("heritageCriteria")).toBe("Historic interest");
  expect(listUrl.searchParams.get("place")).toBe("beta-hall");
});

test("Map and Places expose only the supported structured discovery filters", async ({ page }) => {
  await page.goto("/search.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".community-search-filters .community-custom-filter")).toHaveCount(2);
  await expect(page.locator('.community-search-filters [data-filter-key="assetType"]')).toHaveCount(1);
  await expect(page.locator('.community-search-filters [data-filter-key="heritageCriteria"]')).toHaveCount(1);
  await expect(page.locator('.community-search-filters [data-filter-key="category"], .community-search-filters [data-filter-key="city"], .community-search-filters [data-filter-key="district"]')).toHaveCount(0);
  await expect(page.locator("#communitySearchInput")).toBeVisible();

  const mapFilterKeys = await page.evaluate(async () => {
    const html = await (await fetch("/map.html")).text();
    const documentNode = new DOMParser().parseFromString(html, "text/html");
    return Array.from(documentNode.querySelectorAll(".map-custom-filter"), (filter) => filter.getAttribute("data-filter-key"));
  });
  expect(mapFilterKeys).toEqual(["assetType", "heritageCriteria"]);

  const cacheVersions = await page.evaluate(async () => {
    const mapHtml = await (await fetch("/map.html")).text();
    const mapSource = await (await fetch("/map.js")).text();
    return { mapHtml, mapSource };
  });
  expect(cacheVersions.mapHtml).toContain('map.js?v=2026-07-14-pr41-review-fixes');
  expect(cacheVersions.mapSource).toContain('./heritage-engine/maps.js?v=2026-07-14-pr41-review-fixes');
  expect(cacheVersions.mapSource).not.toContain('./heritage-engine/maps.js?v=2026-06-20-releasepolish');
});

test("place Key facts keeps classification compatibility without changing heritage rows", async ({ page }) => {
  await page.goto("/place.html", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Key facts", includeHidden: true })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Why this place matters", includeHidden: true })).toHaveCount(1);

  const placeSource = await page.evaluate(async () => (await fetch("/place.js")).text());
  [
    "Local significance",
    "Community heritage criteria",
    "Criteria explanation",
    "Heritage value",
    "Condition",
    "Community use",
    "Date added",
    "Last reviewed",
    "Record status"
  ].forEach((label) => expect(placeSource).toContain(label));
  expect(placeSource).not.toContain('appendMetadata("Heritage criteria"');
  expect(placeSource).toContain('appendMetadata("Category", category, "", { hideIfEmpty: true })');
  expect(placeSource).toContain('appendMetadata("Asset type", getAssetType(place)');
});

test("map skip link and region provide an accessible workspace entry", async ({ page }) => {
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const skipLink = page.locator(".skip-link");
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#mapWorkspace")).toBeFocused();
  await expect(page.locator("#map")).toHaveAttribute("role", "region");
  await expect(page.locator("#map")).toHaveAttribute("aria-labelledby", "mapSearchTitle");
  await expect(page.locator("#map")).toHaveAttribute("aria-describedby", "mapAccessibleDescription");
});

test("map tool panels move focus, close with Escape, and restore trigger focus", async ({ page }) => {
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const filtersButton = page.getByRole("button", { name: "Filters" });
  await expect(filtersButton).toHaveAttribute("aria-controls", "mapFiltersToolPanel");
  await filtersButton.click();
  await expect(filtersButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mapFilterReset")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(filtersButton).toHaveAttribute("aria-expanded", "false");
  await expect(filtersButton).toBeFocused();
  await expect(page.locator("#mapFiltersToolPanel")).toBeHidden();
});

test("map offers a keyboard-accessible nomination path without map picking", async ({ page }) => {
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Info" }).click();
  const fallback = page.getByRole("link", { name: "Open the nomination form without choosing a map point" });
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute("href", "nominate-place.html");
  await expect(page.locator("#mapInfoToolPanel")).toContainText("Keyboard users can describe the location manually");
});

for (const viewport of [
  { width: 320, height: 720 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 844, height: 390 }
]) {
  test(`map workspace fits ${viewport.width}x${viewport.height} without page-level horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/map.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#mapViewResultsList")).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  });
}

test("map workspace remains usable at 200 percent zoom", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapViewResultsList")).toBeVisible();
  await expect(page.getByLabel("Map tools").getByRole("button", { name: "Search" })).toBeVisible();
  await expect(page.locator("#map")).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
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

test("nomination upload modules use the current cache-busting version", async ({ page }) => {
  await page.goto("/nominate-place.html", { waitUntil: "domcontentloaded" });
  const scriptSrc = await page.locator("script[src^='nominate-place.js']").getAttribute("src");
  expect(scriptSrc).toBe(`nominate-place.js?v=${NOMINATION_UPLOAD_MODULE_VERSION}`);

  const response = await page.request.get(`/nominate-place.js?v=${NOMINATION_UPLOAD_MODULE_VERSION}`);
  expect(response.ok()).toBeTruthy();
  const scriptText = await response.text();
  expect(scriptText).toContain(`./heritage-engine/nominations.js?v=${NOMINATION_UPLOAD_MODULE_VERSION}`);
});

test("place contribution upload modules use the current cache-busting version", async ({ page }) => {
  const response = await page.request.get("/place.html");
  expect(response.ok()).toBeTruthy();
  const pageHtml = await response.text();
  expect(pageHtml).toContain(`place.js?v=${PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION}`);

  const scriptResponse = await page.request.get(`/place.js?v=${PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION}`);
  expect(scriptResponse.ok()).toBeTruthy();
  const scriptText = await scriptResponse.text();
  expect(scriptText).toContain(`./heritage-engine/place-contributions.js?v=${PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION}`);
});
