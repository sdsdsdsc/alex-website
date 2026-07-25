import { expect, test } from "@playwright/test";

const APP_ORIGIN = "http://127.0.0.1:4173";
const NOMINATION_UPLOAD_MODULE_VERSION = "2026-07-04-evidence-upload-timestamp-fix";
const PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION = "2026-07-11-13d-public-reply-query";
const PROVINCIAL_HERITAGE_PREVIEW_VERSION = "2026-07-24-phase15b1-generalized-markers";
const PROVINCIAL_HERITAGE_GEOJSON_PATH = "**/data/jiangxi-provincial-protected-heritage-map.geojson*";
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

function makeSyntheticProvincialFeature({
  id = "JX-PCH-7-001",
  confidence = "High",
  publicationPolicy = "exact",
  markerClass = "reviewed",
  estimatedUncertaintyMeters = markerClass === "generalized" ? 900 : 20,
  generalizationRadiusMeters = markerClass === "generalized" ? 1500 : null,
  coordinates = [113.8825, 27.6202]
} = {}) {
  return {
    type: "Feature",
    id,
    properties: {
      recordId: id,
      officialNameZh: "测试遗址",
      projectNameEn: "Test Archaeological Site",
      protectionLevelZh: "省级文物保护单位",
      officialCategoryZh: "古建筑",
      officialLocationTextZh: "测试地点",
      locationEvidenceConfidence: confidence,
      coordinateReferenceSystem: "WGS84",
      publicationLocationPolicy: publicationPolicy,
      locationPrecision: publicationPolicy,
      publicLocationMeaning: markerClass === "generalized" ? "official-locality-centre" : "heritage-feature",
      displayLocationType: markerClass === "generalized" ? "generalized-locality" : "site-point",
      markerClass,
      publicLocationNote: markerClass === "generalized"
        ? "This marker shows only a representative locality, not the precise heritage feature."
        : "This project-reviewed point is not an official designation coordinate or legal boundary.",
      estimatedUncertaintyMeters,
      generalizationRadiusMeters,
      sourceIssuerZh: "江西省人民政府",
      sourceTitleZh: "江西省人民政府关于公布第七批江西省文物保护单位的通知",
      sourceUrl: "https://example.gov.cn/source",
      sourceAccessedDate: "2026-07-23",
      projectLocationProvenance: "Alex's Photo Board reviewed public-location decision"
    },
    geometry: {
      type: "Point",
      coordinates
    }
  };
}

function makeSyntheticProvincialCollection(features = []) {
  return {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: "2.0.0",
      datasetId: "jiangxi-provincial-protected-heritage-map",
      sourceRecordCount: 11,
      featureCount: features.length,
      excludedRecordCount: 11 - features.length,
      generationStatus: features.length === 0 ? "valid-empty" : "valid",
      geometryProvenance: "Alex's Photo Board project coordinate review"
    },
    features
  };
}

async function openMapLayersControl(page) {
  const toggle = page.locator(".leaflet-control-layers-toggle");
  await expect(toggle).toHaveAttribute("aria-label", "Map layers");
  await toggle.focus();
  await toggle.press("Enter");
  await expect(page.locator(".leaflet-control-layers")).toHaveClass(/leaflet-control-layers-expanded/);
}

function getOverlayCheckbox(page, label) {
  return page.locator(".leaflet-control-layers-overlays label", { hasText: label }).locator("input");
}

async function setOverlayChecked(page, label, checked) {
  const checkbox = getOverlayCheckbox(page, label);
  for (let attempt = 0; attempt < 3 && await checkbox.isChecked() !== checked; attempt += 1) {
    await checkbox.focus();
    await checkbox.press("Space");
    await page.waitForTimeout(100);
  }
  if (checked) {
    await expect(checkbox).toBeChecked();
  } else {
    await expect(checkbox).not.toBeChecked();
  }
}

async function getRenderedMapState(page) {
  return page.evaluate(() => ({
    mapPaneTransform: document.querySelector("#map .leaflet-map-pane")?.style.transform || "",
    communityMarkerCount: document.querySelectorAll("#map .community-map-pin").length
  }));
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

test("provincial preview is lazy, default-off, valid-empty, cached, and map-stable", async ({ page }) => {
  let provincialRequestCount = 0;
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, async (route) => {
    provincialRequestCount += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/geo+json",
      body: JSON.stringify(makeSyntheticProvincialCollection())
    });
  });

  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".leaflet-control-layers-toggle")).toBeVisible();
  await expect(page.locator("#mapSearchStatus")).not.toHaveText("");
  await page.waitForTimeout(250);
  expect(provincialRequestCount).toBe(0);
  await expect(page.locator("#provincialHeritageStatus")).toBeHidden();
  await expect(page.locator("#provincialHeritageError")).toBeHidden();

  await openMapLayersControl(page);
  const communityOverlay = getOverlayCheckbox(page, "Community heritage records");
  const provincialOverlay = getOverlayCheckbox(page, "Provincial protected heritage pilot");
  await expect(communityOverlay).toBeChecked();
  await expect(provincialOverlay).not.toBeChecked();

  const beforeEnable = await getRenderedMapState(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageStatus")).toHaveText(
    "No approved provincial heritage locations are available to display yet."
  );
  await expect(page.locator("#provincialHeritageError")).toBeHidden();
  await expect(page.locator(".provincial-heritage-map-marker")).toHaveCount(0);
  expect(provincialRequestCount).toBe(1);
  expect(await getRenderedMapState(page)).toEqual(beforeEnable);

  await setOverlayChecked(page, "Provincial protected heritage pilot", false);
  await expect(page.locator("#provincialHeritageStatus")).toBeHidden();
  await expect(page.locator("#provincialHeritageError")).toBeHidden();
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageStatus")).toHaveText(
    "No approved provincial heritage locations are available to display yet."
  );
  expect(provincialRequestCount).toBe(1);
  expect(await getRenderedMapState(page)).toEqual(beforeEnable);
});

test("provincial preview isolates HTTP failure from community markers", async ({ page }) => {
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 503,
    contentType: "text/plain",
    body: "Unavailable"
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchStatus")).not.toHaveText("");
  await openMapLayersControl(page);
  const communityCount = await page.locator(".community-map-pin").count();
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageError")).toHaveText(
    "The provincial heritage preview could not be loaded."
  );
  await expect(page.locator(".provincial-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
});

test("provincial preview rejects invalid JSON", async ({ page }) => {
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: "{"
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersControl(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageError")).toHaveText(
    "The provincial heritage preview could not be loaded."
  );
});

test("provincial preview rejects malformed metadata", async ({ page }) => {
  const malformed = makeSyntheticProvincialCollection();
  malformed.metadata.datasetId = "wrong-dataset";
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(malformed)
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersControl(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageError")).toHaveText(
    "The provincial heritage preview could not be loaded."
  );
});

test("provincial preview rejects the complete layer when one feature is invalid", async ({ page }) => {
  const validFeature = makeSyntheticProvincialFeature();
  const invalidFeature = makeSyntheticProvincialFeature({
    id: "JX-PCH-7-002",
    coordinates: [181, 27.6202]
  });
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticProvincialCollection([validFeature, invalidFeature]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersControl(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageError")).toHaveText(
    "The provincial heritage preview could not be loaded."
  );
  await expect(page.locator(".provincial-heritage-map-marker")).toHaveCount(0);
});

test("provincial preview renders a synthetic exact Point without changing community bounds", async ({ page }) => {
  const collection = makeSyntheticProvincialCollection([makeSyntheticProvincialFeature()]);
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(collection)
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchStatus")).not.toHaveText("", { timeout: 20000 });
  await expect(page.locator(".official-heritage-map-legend")).toHaveCount(0);
  await page.getByRole("button", { name: "Info" }).click();
  const officialInfo = page.locator(".official-heritage-map-info");
  await expect(officialInfo).toBeVisible();
  await expect(officialInfo).toContainText("Community heritage records and official protected heritage records are separate sources");
  await expect(officialInfo).toContainText("Blue pins show community heritage records");
  await expect(officialInfo).toContainText("Filled diamonds show project-reviewed official reference locations");
  await expect(officialInfo).toContainText("Hollow diamonds are reserved for generalized official references");
  await expect(officialInfo).toContainText("not official designation coordinates or legal boundaries");
  await page.getByRole("button", { name: "Search" }).click();
  const beforeEnable = await getRenderedMapState(page);
  await openMapLayersControl(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageStatus")).toHaveText(
    /\d+ community records? and 1 provincial heritage location displayed\./
  );
  const marker = page.locator(".provincial-heritage-map-marker");
  await expect(marker).toHaveCount(1);
  await expect(marker).toHaveAttribute(
    "aria-label",
    "Open official protected heritage record: Test Archaeological Site (测试遗址), reviewed location"
  );
  const afterEnable = await getRenderedMapState(page);
  expect(afterEnable).toEqual(beforeEnable);
  await marker.focus();
  await marker.press("Enter");
  await expect(page.locator(".provincial-heritage-map-popup")).toContainText("Test Archaeological Site");
  await expect(page.locator(".provincial-heritage-map-popup [lang='zh-Hans']").first()).toHaveText("测试遗址");
  await expect(page.locator(".provincial-heritage-map-popup")).toContainText("not an official designation coordinate");
});

test("provincial preview labels a synthetic approximate Point", async ({ page }) => {
  const feature = makeSyntheticProvincialFeature({
    confidence: "Medium",
    publicationPolicy: "approximate"
  });
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticProvincialCollection([feature]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersControl(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  const marker = page.locator(".provincial-heritage-map-marker");
  await expect(marker).toHaveAttribute("aria-label", /approximate reviewed location$/);
  await marker.focus();
  await marker.press("Enter");
  await expect(page.locator(".provincial-heritage-map-popup")).toContainText("Approximate site location");
  await expect(page.locator(".provincial-heritage-map-popup")).toContainText("Medium");
});

test("provincial preview distinguishes a generalized marker and explains its radius", async ({ page }) => {
  const feature = makeSyntheticProvincialFeature({
    confidence: "Medium",
    publicationPolicy: "generalized",
    markerClass: "generalized"
  });
  await page.route(PROVINCIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticProvincialCollection([feature]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersControl(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  const marker = page.locator(".provincial-heritage-map-marker--generalized");
  await expect(marker).toHaveAttribute("aria-label", /generalized area reference$/);
  await marker.focus();
  await marker.press("Enter");
  const popup = page.locator(".provincial-heritage-map-popup");
  await expect(popup).toContainText("General locality");
  const uncertaintyRow = popup.locator(".map-point-card__facts > div").filter({
    has: page.locator("dt", { hasText: /^Estimated location uncertainty$/ })
  });
  const radiusRow = popup.locator(".map-point-card__facts > div").filter({
    has: page.locator("dt", { hasText: /^Generalization radius$/ })
  });
  await expect(uncertaintyRow.locator("dd")).toHaveText("900 metres");
  await expect(radiusRow.locator("dd")).toHaveText("1500 metres");
});

test("Leaflet layer control is keyboard accessible and Escape restores toggle focus", async ({ page }) => {
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersControl(page);
  await setOverlayChecked(page, "Provincial protected heritage pilot", true);
  await expect(page.locator("#provincialHeritageStatus")).toHaveText(
    /\d+ community records? and 1 provincial heritage location displayed\./
  );
  await getOverlayCheckbox(page, "Provincial protected heritage pilot").focus();
  await getOverlayCheckbox(page, "Provincial protected heritage pilot").press("Escape");
  await expect(page.locator(".leaflet-control-layers")).not.toHaveClass(/leaflet-control-layers-expanded/);
  await expect(page.locator(".leaflet-control-layers-toggle")).toBeFocused();
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
  expect(cacheVersions.mapHtml).toContain(`map.js?v=${PROVINCIAL_HERITAGE_PREVIEW_VERSION}`);
  expect(cacheVersions.mapSource).toContain('./heritage-engine/maps.js?v=2026-07-14-pr41-review-fixes');
  expect(cacheVersions.mapSource).toContain(
    `./heritage-engine/provincial-heritage-map.js?v=${PROVINCIAL_HERITAGE_PREVIEW_VERSION}`
  );
  expect(cacheVersions.mapSource).toContain(
    `./data/jiangxi-provincial-protected-heritage-map.geojson?v=${PROVINCIAL_HERITAGE_PREVIEW_VERSION}`
  );
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
  await expect(page.locator("#mapSearchToolPanel")).toContainText("Search community heritage records");
  const filtersButton = page.getByRole("button", { name: "Filters" });
  await expect(filtersButton).toHaveAttribute("aria-controls", "mapFiltersToolPanel");
  await filtersButton.click();
  await expect(filtersButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mapFiltersToolPanel")).toContainText("Community discovery filters");
  await expect(page.locator("#mapFiltersToolPanel")).toContainText("Official-layer filtering will be added separately");
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
    await expect(page.locator(".leaflet-control-layers-toggle")).toBeVisible();
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
  await expect(page.locator(".leaflet-control-layers-toggle")).toBeVisible();
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
