import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const APP_ORIGIN = "http://127.0.0.1:4173";
const NOMINATION_UPLOAD_MODULE_VERSION = "2026-07-04-evidence-upload-timestamp-fix";
const PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION = "2026-07-11-13d-public-reply-query";
const MAP_PAGE_VERSION = "2026-08-01-official-authority-neutral";
const OFFICIAL_HERITAGE_PREVIEW_VERSION = "2026-08-01-official-authority-neutral";
const OFFICIAL_CATEGORY_VERSION = "2026-07-27-official-category-filters";
const OFFICIAL_HERITAGE_GEOJSON_PATH = "**/data/jiangxi-official-protected-heritage-map.geojson*";
const COMMITTED_OFFICIAL_HERITAGE = JSON.parse(await readFile(
  new URL("../data/jiangxi-official-protected-heritage-map.geojson", import.meta.url),
  "utf8"
));
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

function makeSyntheticOfficialFeature({
  id = "JX-PCH-7-001",
  confidence = "High",
  publicationPolicy = "exact",
  markerClass = "reviewed",
  officialCategoryZh = "古建筑",
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
      officialCategoryZh,
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

function makeSyntheticOfficialCollection(features = []) {
  return {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: "2.0.0",
      datasetId: "jiangxi-official-protected-heritage-map",
      sourceRecordCount: 17,
      featureCount: features.length,
      excludedRecordCount: 17 - features.length,
      generationStatus: features.length === 0 ? "valid-empty" : "valid",
      geometryProvenance: "Alex's Photo Board project coordinate review"
    },
    features
  };
}

function makeSyntheticOfficialGeometryFeature({
  id,
  title,
  officialNameZh,
  officialCategoryZh = "古建筑",
  type,
  coordinates,
  geometryMeaning,
  geometrySourceType,
  geometrySourceLabel,
  geometryPrecision,
  horizontalUncertaintyMetres = null
}) {
  const feature = makeSyntheticOfficialFeature({ id, officialCategoryZh });
  feature.properties.projectNameEn = title;
  feature.properties.officialNameZh = officialNameZh;
  Object.assign(feature.properties, {
    geometryMeaning,
    geometrySourceType,
    geometrySourceLabel,
    geometrySourceUrl: "https://example.gov.cn/geometry-source",
    geometryReviewedAt: "2026-07-28",
    geometryReviewNotes: geometrySourceType.startsWith("project-")
      ? "Project reference geometry prepared for rendering tests; not an official legal boundary."
      : "Geometry follows the cited reviewed publication source.",
    geometryPrecision,
    horizontalUncertaintyMetres
  });
  feature.geometry = { type, coordinates };
  return feature;
}

function makeSyntheticOfficialGeometryCollection() {
  return makeSyntheticOfficialCollection([
    makeSyntheticOfficialGeometryFeature({
      id: "JX-SYN-GEO-001",
      title: "Reviewed Canal Route",
      officialNameZh: "审定水道",
      type: "LineString",
      coordinates: [[113.876, 27.616], [113.882, 27.622], [113.888, 27.626]],
      geometryMeaning: "reviewed-line",
      geometrySourceType: "official-published-geometry",
      geometrySourceLabel: "Official published route geometry",
      geometryPrecision: "reviewed"
    }),
    makeSyntheticOfficialGeometryFeature({
      id: "JX-SYN-GEO-002",
      title: "Approximate Historic Routes",
      officialNameZh: "历史路线参考",
      type: "MultiLineString",
      coordinates: [
        [[113.875, 27.625], [113.881, 27.629]],
        [[113.884, 27.615], [113.891, 27.619]]
      ],
      geometryMeaning: "approximate-line",
      geometrySourceType: "project-reviewed-digitization",
      geometrySourceLabel: "Project-reviewed route digitization",
      geometryPrecision: "approximate",
      horizontalUncertaintyMetres: 35
    }),
    makeSyntheticOfficialGeometryFeature({
      id: "JX-SYN-GEO-003",
      title: "Reviewed Heritage Boundary",
      officialNameZh: "审定范围",
      type: "Polygon",
      coordinates: [[
        [113.874, 27.617],
        [113.878, 27.617],
        [113.878, 27.621],
        [113.874, 27.617]
      ]],
      geometryMeaning: "reviewed-boundary",
      geometrySourceType: "official-published-geometry",
      geometrySourceLabel: "Official published boundary geometry",
      geometryPrecision: "reviewed"
    }),
    makeSyntheticOfficialGeometryFeature({
      id: "JX-SYN-GEO-004",
      title: "Approximate Heritage Boundary",
      officialNameZh: "近似范围",
      officialCategoryZh: "近现代重要史迹",
      type: "Polygon",
      coordinates: [[
        [113.886, 27.622],
        [113.89, 27.622],
        [113.89, 27.626],
        [113.886, 27.622]
      ]],
      geometryMeaning: "approximate-boundary",
      geometrySourceType: "project-reviewed-digitization",
      geometrySourceLabel: "Project-reviewed approximate boundary",
      geometryPrecision: "approximate",
      horizontalUncertaintyMetres: 50
    }),
    makeSyntheticOfficialGeometryFeature({
      id: "JX-SYN-GEO-005",
      title: "Generalized Heritage Areas",
      officialNameZh: "概化参考区",
      officialCategoryZh: "近现代重要史迹",
      type: "MultiPolygon",
      coordinates: [
        [[
          [113.876, 27.627],
          [113.879, 27.627],
          [113.879, 27.63],
          [113.876, 27.627]
        ]],
        [[
          [113.882, 27.612],
          [113.885, 27.612],
          [113.885, 27.615],
          [113.882, 27.612]
        ]]
      ],
      geometryMeaning: "generalized-reference-area",
      geometrySourceType: "project-generalized-reference",
      geometrySourceLabel: "Project-generalized reference areas",
      geometryPrecision: "generalized",
      horizontalUncertaintyMetres: 120
    }),
    makeSyntheticOfficialGeometryFeature({
      id: "JX-SYN-GEO-006",
      title: "Heritage Uncertainty Area",
      officialNameZh: "不确定范围",
      officialCategoryZh: "近现代重要史迹",
      type: "Polygon",
      coordinates: [[
        [113.88, 27.624],
        [113.884, 27.624],
        [113.884, 27.628],
        [113.88, 27.624]
      ]],
      geometryMeaning: "uncertainty-area",
      geometrySourceType: "project-generalized-reference",
      geometrySourceLabel: "Project uncertainty reference",
      geometryPrecision: "uncertain",
      horizontalUncertaintyMetres: 180
    })
  ]);
}

async function openMapLayersTab(page) {
  const layersTab = page.getByRole("tab", { name: "Layers", exact: true });
  const panel = page.getByRole("tabpanel", { name: "Layers", exact: true });
  await expect(layersTab).toBeVisible();
  await layersTab.click();
  await expect(panel).toBeVisible();
  return panel;
}

async function waitForCommunityMapReady(page) {
  const searchStatus = page.locator("#mapSearchStatus");
  await expect(searchStatus).toHaveText(
    /^\d+ matching records?; \d+ on map(?:; .+)?\.$/,
    { timeout: 20000 }
  );
  const statusText = await searchStatus.textContent();
  const onMapMatch = statusText?.match(/;\s*(\d+) on map(?:;|\.)/);
  expect(onMapMatch).not.toBeNull();
  const onMapCount = Number(onMapMatch[1]);
  await expect(page.locator("#communityCategoryStatus")).toHaveText(
    new RegExp(`^${onMapCount} of ${onMapCount} matching community locations? displayed\\.$`)
  );
  return onMapCount;
}

function getOverlayCheckbox(page, label) {
  return page
    .getByRole("tabpanel", { name: "Layers", exact: true })
    .getByRole("checkbox", { name: label, exact: true });
}

async function setOverlayChecked(page, label, checked) {
  const checkbox = getOverlayCheckbox(page, label);
  await expect(checkbox).toBeVisible();
  await expect(checkbox).toBeEnabled();
  if (await checkbox.isChecked() !== checked) {
    await checkbox.click();
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

  const communityCategories = page.locator(".test-card", { has: page.locator("h2", { hasText: "Community Map Categories" }) });
  await expect(communityCategories.locator(".result")).toHaveCount(28);
  const communityCategoryFailures = await communityCategories.locator(".result:has(.badge--fail)").allTextContents();
  expect(communityCategoryFailures).toEqual([]);

  const officialCategories = page.locator(".test-card", { has: page.locator("h2", { hasText: "Official Map Categories" }) });
  await expect(officialCategories.locator(".result")).toHaveCount(12);
  const officialCategoryFailures = await officialCategories.locator(".result:has(.badge--fail)").allTextContents();
  expect(officialCategoryFailures).toEqual([]);

  const officialGeometry = page.locator(".test-card", { has: page.locator("h2", { hasText: "Official Geometry Rendering" }) });
  await expect(officialGeometry.locator(".result")).toHaveCount(8);
  const officialGeometryFailures = await officialGeometry.locator(".result:has(.badge--fail)").allTextContents();
  expect(officialGeometryFailures).toEqual([]);
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

test("official preview is lazy, default-off, valid-empty, cached, and map-stable", async ({ page }) => {
  let officialRequestCount = 0;
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, async (route) => {
    officialRequestCount += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/geo+json",
      body: JSON.stringify(makeSyntheticOfficialCollection())
    });
  });

  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchStatus")).not.toHaveText("");
  const mapTabs = page.getByRole("tablist", { name: "Map tools" }).getByRole("tab");
  await expect(mapTabs).toHaveCount(4);
  await expect(mapTabs).toHaveText(["Search", "Filters", "Layers", "Info"]);
  await expect(page.getByRole("tab", { name: "Search" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: "Layers" })).toHaveAttribute("aria-selected", "false");
  await expect(page.locator("#mapLayersToolPanel")).toBeHidden();
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Community heritage");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Show Official Heritage");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Official Heritage map symbols");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Additional information");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Project-reviewed reference Points");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Generalized reference Points");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Reviewed lines and areas");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Approximate or generalized geometry");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("About Official Heritage representations");
  await expect(page.locator("#mapLayersToolPanel")).not.toContainText("Reviewed lines and boundaries");
  await expect(page.locator("#mapLayersToolPanel").getByRole("checkbox", { name: /National|Provincial|Municipal/ })).toHaveCount(0);
  await expect(page.locator(".leaflet-control-layers-overlays input")).toHaveCount(0);
  await page.waitForTimeout(250);
  expect(officialRequestCount).toBe(0);
  await expect(page.locator("#officialHeritageStatus")).toHaveText(/\d+ community records? displayed\./);
  await expect(page.locator("#officialHeritageError")).toBeHidden();

  await openMapLayersTab(page);
  await expect(page.locator("#officialCategoryAvailability")).toHaveText(
    "Categories become available after the official layer is loaded."
  );
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  await expect(page.locator("[data-official-map-category]")).toHaveCount(0);
  const communityOverlay = getOverlayCheckbox(page, "All community records");
  const officialOverlay = getOverlayCheckbox(page, "Show Official Heritage");
  await expect(communityOverlay).toBeChecked();
  await expect(officialOverlay).not.toBeChecked();

  const beforeEnable = await getRenderedMapState(page);
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(page.locator("#officialHeritageStatus")).toContainText(
    "No approved Official Heritage locations are available to display yet."
  );
  await expect(page.locator("#officialHeritageError")).toBeHidden();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator("#officialCategoryAvailability")).toHaveText(
    "No published official categories are available."
  );
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  await expect(page.locator("[data-official-map-category]")).toHaveCount(0);
  expect(officialRequestCount).toBe(1);
  expect(await getRenderedMapState(page)).toEqual(beforeEnable);

  await setOverlayChecked(page, "Show Official Heritage", false);
  await expect(page.locator("#officialHeritageStatus")).toContainText("community");
  await expect(page.locator("#officialHeritageError")).toBeHidden();
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(page.locator("#officialHeritageStatus")).toContainText(
    "No approved Official Heritage locations are available to display yet."
  );
  expect(officialRequestCount).toBe(1);
  expect(await getRenderedMapState(page)).toEqual(beforeEnable);
});

test("production-sized official fixture renders seven accessible markers across responsive and 200% zoom checks", async ({ page }) => {
  const appErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && isAppOwnedConsoleError(message.text())) {
      appErrors.push(message.text());
    }
  });
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(COMMITTED_OFFICIAL_HERITAGE)
  }));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const layersPanel = await openMapLayersTab(page);
  const officialToggle = layersPanel.getByRole("checkbox", {
    name: "Show Official Heritage",
    exact: true
  });
  await expect(officialToggle).not.toBeChecked();
  await officialToggle.click();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);
  await expect(page.locator("#officialHeritageStatus")).toContainText("7 official heritage locations");
  await expect(page.locator("#officialReviewedPointStatus")).toHaveText(
    "Filled diamond. Currently displayed: 7."
  );

  const compoundMarker = page.getByRole("button", {
    name: "Open Official Heritage record: Xinyu Confucian Temple (新余孔庙); Official designation level: Provincial; Map category: Ancient buildings; Compound reference point (approximate project-reviewed location)",
    exact: true
  });
  await expect(compoundMarker).toHaveCount(1);
  await expect(compoundMarker).not.toHaveAttribute("aria-label", /approximate reviewed location/);
  await expect(compoundMarker.locator(".official-map-marker__glyph")).toHaveCount(1);
  const reviewedPresentation = await compoundMarker.evaluate((element) => ({
    background: getComputedStyle(element, "::before").backgroundColor,
    glyphStroke: getComputedStyle(element.querySelector(".official-map-marker__glyph")).stroke
  }));
  expect(reviewedPresentation.background).toBe("rgb(169, 71, 0)");
  expect(reviewedPresentation.glyphStroke).toBe("rgb(255, 255, 255)");
  await compoundMarker.focus();
  await expect(compoundMarker).toBeFocused();
  await compoundMarker.press("Enter");
  const compoundPopup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Xinyu Confucian Temple"
  });
  await expect(compoundPopup).toContainText("Compound reference point");

  const xiabuMarker = page.getByRole("button", {
    name: "Open Official Heritage record: Former Site of the Xiabu Peasant Uprising — Uprising Site (下保农民暴动旧址——暴动举行地旧址); Official designation level: Provincial; Map category: Important modern historic sites; Component reference point",
    exact: true
  });
  await expect(xiabuMarker).toHaveCount(1);
  await xiabuMarker.focus();
  await xiabuMarker.press("Enter");
  const xiabuPopup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Former Site of the Xiabu Peasant Uprising"
  });
  await expect(xiabuPopup).toContainText("Component reference point");
  await expect(xiabuPopup).toContainText("暴动会议地旧址");
  await expect(xiabuPopup).toContainText("150 metres");
  await expect(xiabuPopup).toContainText("building footprint");
  await expect(xiabuPopup.locator(".map-point-card__facts > div").filter({
    has: page.locator("dt", { hasText: /^Official designation level$/ })
  }).locator("dd")).toHaveText("Provincial");
  await expect(xiabuPopup).not.toContainText("Protection level");
  await expect(xiabuPopup).not.toContainText("Representation status");
  await expect(xiabuPopup).not.toContainText("Geometry provenance");

  const n07Marker = page.getByRole("button", {
    name: "Open Official Heritage record: Former Site of the Shuixi Red Army Third Corps Headquarters (水西红三军团指挥部旧址); Official designation level: National; Map category: Important modern historic sites; Provider-located project-reviewed reference point",
    exact: true
  });
  await expect(n07Marker).toHaveCount(1);
  await n07Marker.focus();
  await n07Marker.press("Enter");
  const n07Popup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Former Site of the Shuixi Red Army Third Corps Headquarters"
  });
  await expect(n07Popup).toContainText("Provider-located project-reviewed reference point");
  await expect(n07Popup.locator(".map-point-card__facts > div").filter({
    has: page.locator("dt", { hasText: /^Official designation level$/ })
  }).locator("dd")).toHaveText("National");
  await expect(n07Popup).toContainText("Project-reviewed interpretation");
  await expect(n07Popup).toContainText("Project-reviewed digitization");
  await expect(n07Popup).toContainText("100 metres");
  await expect(n07Popup).toContainText("not an authority-supplied coordinate");
  await expect(n07Popup).toContainText("building footprint");
  await expect(n07Popup).toContainText("legal protection boundary");

  const visitorMarker = page.getByRole("button", {
    name: "Open Official Heritage record: Fu Baoshi Former Residence (傅抱石故居); Official designation level: Provincial; Map category: Important modern historic sites; Visitor reference point",
    exact: true
  });
  await expect(visitorMarker).toHaveCount(1);
  await visitorMarker.focus();
  await expect(visitorMarker).toBeFocused();
  await visitorMarker.press("Enter");
  const visitorPopup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Fu Baoshi Former Residence"
  });
  await expect(visitorPopup).toContainText("Visitor reference point");
  await expect(visitorPopup).toContainText(
    "This marker shows a public visitor reference associated with the official heritage record."
  );

  const bridgeMarker = page.getByRole("button", {
    name: "Open Official Heritage record: Rongquan Bridge (蓉泉桥); Official designation level: Provincial; Map category: Ancient buildings; Approximate site location",
    exact: true
  });
  await expect(bridgeMarker).toHaveCount(1);
  await bridgeMarker.focus();
  await expect(bridgeMarker).toBeFocused();
  await bridgeMarker.press("Enter");
  const bridgePopup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Rongquan Bridge"
  });
  await expect(bridgePopup).toContainText("Approximate site location");
  await expect(bridgePopup).toContainText("project-reviewed approximate feature location");

  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 }
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);
    await expect(officialToggle).toBeChecked();
    expect(await page.evaluate(() => (
      document.documentElement.scrollWidth <= document.documentElement.clientWidth
    ))).toBe(true);
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);
  await expect(officialToggle).toBeChecked();
  expect(await page.evaluate(() => (
    document.documentElement.scrollWidth <= document.documentElement.clientWidth
  ))).toBe(true);
  expect(appErrors).toEqual([]);
});

test("validated official line and area geometries render with accessible meaning-driven interaction", async ({ page }) => {
  test.setTimeout(60000);
  let officialRequestCount = 0;
  const appErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && isAppOwnedConsoleError(message.text())) {
      appErrors.push(message.text());
    }
  });
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => {
    officialRequestCount += 1;
    return route.fulfill({
      status: 200,
      contentType: "application/geo+json",
      body: JSON.stringify(makeSyntheticOfficialGeometryCollection())
    });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const initialCommunityCount = await waitForCommunityMapReady(page);
  const initialUrl = page.url();
  const initialMapState = await getRenderedMapState(page);
  await expect(page.locator(".community-map-pin")).toHaveCount(initialCommunityCount);
  const layersPanel = await openMapLayersTab(page);
  const officialLayer = layersPanel.getByRole("checkbox", {
    name: "Show Official Heritage",
    exact: true
  });
  await expect(officialLayer).not.toBeChecked();
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(0);
  expect(officialRequestCount).toBe(0);

  await officialLayer.click();
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(6);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "6 of 6 published official locations displayed."
  );
  await expect(page.locator(".community-map-pin")).toHaveCount(initialCommunityCount);
  expect(officialRequestCount).toBe(1);
  expect(page.url()).toBe(initialUrl);
  expect(await getRenderedMapState(page)).toEqual(initialMapState);

  const reviewedLine = page.getByRole("button", {
    name: "Open Official Heritage record: Reviewed Canal Route (审定水道); Official designation level: Provincial; Map category: Ancient buildings; Reviewed line",
    exact: true
  });
  const approximateMultiLine = page.getByRole("button", {
    name: /Approximate Historic Routes.*Approximate line$/,
    exact: false
  });
  const reviewedBoundary = page.getByRole("button", {
    name: /Reviewed Heritage Boundary.*Reviewed boundary$/,
    exact: false
  });
  const approximateBoundary = page.getByRole("button", {
    name: /Approximate Heritage Boundary.*Approximate boundary$/,
    exact: false
  });
  const generalizedArea = page.getByRole("button", {
    name: /Generalized Heritage Areas.*Generalized project reference area$/,
    exact: false
  });
  const uncertaintyArea = page.getByRole("button", {
    name: /Heritage Uncertainty Area.*Uncertainty area$/,
    exact: false
  });
  for (const feature of [
    reviewedLine,
    approximateMultiLine,
    reviewedBoundary,
    approximateBoundary,
    generalizedArea,
    uncertaintyArea
  ]) {
    await expect(feature).toHaveCount(1);
    await expect(feature).toBeVisible();
    await expect(feature).toHaveAttribute("tabindex", "0");
  }

  await expect(page.locator(".official-heritage-geometry--reviewed-line")).not.toHaveAttribute("stroke-dasharray");
  await expect(page.locator(".official-heritage-geometry--approximate-line")).toHaveAttribute("stroke-dasharray", "8 7");
  await expect(page.locator(".official-heritage-geometry--reviewed-boundary")).not.toHaveAttribute("stroke-dasharray");
  await expect(page.locator(".official-heritage-geometry--approximate-boundary")).toHaveAttribute("stroke-dasharray", "8 6");
  await expect(page.locator(".official-heritage-geometry--generalized-reference-area")).toHaveAttribute("stroke-dasharray", "3 7");
  await expect(page.locator(".official-heritage-geometry--uncertainty-area")).toHaveAttribute("stroke-dasharray", "2 8");

  await reviewedLine.dispatchEvent("click");
  const reviewedLinePopup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Reviewed Canal Route"
  });
  await expect(reviewedLinePopup).toContainText("Reviewed line");
  await expect(reviewedLinePopup).toContainText(
    "Official published geometry: Official published route geometry"
  );

  await approximateBoundary.focus();
  await page.keyboard.press("Tab");
  await expect(generalizedArea).toBeFocused();
  expect(await generalizedArea.evaluate((element) => ({
    outlineStyle: getComputedStyle(element).outlineStyle,
    outlineWidth: getComputedStyle(element).outlineWidth
  }))).toEqual({
    outlineStyle: "solid",
    outlineWidth: "4px"
  });
  await generalizedArea.press("Enter");
  const generalizedPopup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Generalized Heritage Areas"
  });
  await expect(generalizedPopup).toContainText("Generalized project reference area");
  await expect(generalizedPopup).toContainText("Project-generalized reference");
  await expect(generalizedPopup).toContainText("120 metres");
  await expect(generalizedPopup).toContainText(
    "This geometry is a project reference or approximation, not an official legal boundary."
  );
  await expect(generalizedPopup.getByRole("link", { name: "Open geometry source" })).toHaveAttribute(
    "href",
    "https://example.gov.cn/geometry-source"
  );

  await uncertaintyArea.focus();
  await uncertaintyArea.press("Space");
  await expect(page.locator(".official-heritage-map-popup").filter({
    hasText: "Heritage Uncertainty Area"
  })).toContainText("Uncertainty area");

  const ancientBuildings = layersPanel.getByRole("checkbox", {
    name: "Ancient buildings",
    exact: true
  });
  const officialAll = layersPanel.getByRole("checkbox", {
    name: "All official categories",
    exact: true
  });
  await page.keyboard.press("Escape");
  await expect(page.locator(".official-heritage-map-popup")).toHaveCount(0);
  const beforeCategoryFilterState = await getRenderedMapState(page);
  await ancientBuildings.focus();
  await ancientBuildings.press("Space");
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(3);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "3 of 6 published official locations displayed."
  );
  await expect(officialAll).toHaveJSProperty("indeterminate", true);
  await expect(page.locator(".community-map-pin")).toHaveCount(initialCommunityCount);
  expect(officialRequestCount).toBe(1);
  expect(page.url()).toBe(initialUrl);
  expect(await getRenderedMapState(page)).toEqual(beforeCategoryFilterState);

  await officialLayer.click();
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(0);
  await officialLayer.click();
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(3);
  await expect(ancientBuildings).not.toBeChecked();
  await expect(officialAll).toHaveJSProperty("indeterminate", true);
  expect(officialRequestCount).toBe(1);

  await ancientBuildings.click();
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(6);
  for (const viewport of [
    { width: 320, height: 720 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 }
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator(".official-heritage-geometry")).toHaveCount(6);
    expect(await page.evaluate(() => (
      document.documentElement.scrollWidth <= document.documentElement.clientWidth
    ))).toBe(true);
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(6);
  expect(await page.evaluate(() => (
    document.documentElement.scrollWidth <= document.documentElement.clientWidth
  ))).toBe(true);
  expect(appErrors).toEqual([]);
});

test("unsupported official geometry meaning fails the complete layer atomically", async ({ page }) => {
  const valid = makeSyntheticOfficialGeometryCollection().features[0];
  const invalid = makeSyntheticOfficialGeometryCollection().features[2];
  invalid.properties.geometryMeaning = "reviewed-line";
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticOfficialCollection([valid, invalid]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const communityCount = await waitForCommunityMapReady(page);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await openMapLayersTab(page);
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(page.locator("#officialHeritageError")).toHaveText(
    "Official Heritage could not be loaded."
  );
  await expect(page.locator(".official-heritage-geometry")).toHaveCount(0);
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
});

test("official categories are published-only tri-state visibility controls with persistent cached selections", async ({ page }) => {
  test.setTimeout(60000);
  let officialRequestCount = 0;
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => {
    officialRequestCount += 1;
    return route.fulfill({
      status: 200,
      contentType: "application/geo+json",
      body: JSON.stringify(COMMITTED_OFFICIAL_HERITAGE)
    });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map.html?q=memory", { waitUntil: "domcontentloaded" });
  const communityCount = await waitForCommunityMapReady(page);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  const beforeEnableUrl = page.url();
  const beforeEnableMapState = await getRenderedMapState(page);
  const layersPanel = await openMapLayersTab(page);
  const communityParent = layersPanel.getByRole("checkbox", {
    name: "All community records",
    exact: true
  });
  const officialLayer = layersPanel.getByRole("checkbox", {
    name: "Show Official Heritage",
    exact: true
  });
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  expect(officialRequestCount).toBe(0);

  await officialLayer.click();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);
  expect(officialRequestCount).toBe(1);
  const officialAll = layersPanel.getByRole("checkbox", {
    name: "All official categories",
    exact: true
  });
  const ancientBuildings = layersPanel.getByRole("checkbox", {
    name: "Ancient buildings",
    exact: true
  });
  const modernSites = layersPanel.getByRole("checkbox", {
    name: "Important modern historic sites",
    exact: true
  });
  await expect(page.locator("#officialCategoryControls")).toBeVisible();
  await expect(officialAll).toBeChecked();
  await expect(officialAll).toBeEnabled();
  await expect(ancientBuildings).toBeChecked();
  await expect(modernSites).toBeChecked();
  await expect(layersPanel.getByRole("checkbox", {
    name: "Archaeological sites",
    exact: true
  })).toHaveCount(0);
  await expect(layersPanel.getByRole("checkbox", {
    name: "Other official heritage",
    exact: true
  })).toHaveCount(0);
  await expect(page.locator("[data-official-map-category]")).toHaveCount(2);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "7 of 7 published official locations displayed."
  );
  await expect(page.locator(".official-heritage-map-marker--ancient-buildings")).toHaveCount(3);
  await expect(page.locator(".official-heritage-map-marker--important-modern-historic-sites")).toHaveCount(4);
  await expect(page.locator(".official-heritage-map-marker .official-map-marker__glyph")).toHaveCount(7);

  await ancientBuildings.focus();
  await expect(ancientBuildings).toBeFocused();
  await ancientBuildings.press("Space");
  await expect(ancientBuildings).not.toBeChecked();
  await expect(modernSites).toBeChecked();
  await expect(officialAll).not.toBeChecked();
  await expect(officialAll).toHaveJSProperty("indeterminate", true);
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(4);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "4 of 7 published official locations displayed."
  );
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await expect(communityParent).toBeChecked();
  expect(page.url()).toBe(beforeEnableUrl);
  expect(await getRenderedMapState(page)).toEqual(beforeEnableMapState);
  expect(officialRequestCount).toBe(1);

  await page.getByRole("tab", { name: "Search", exact: true }).click();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(4);
  await openMapLayersTab(page);
  await expect(ancientBuildings).not.toBeChecked();
  await expect(modernSites).toBeChecked();

  await officialLayer.click();
  await expect(officialLayer).not.toBeChecked();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator("#officialCategoryControls")).toBeVisible();
  await expect(officialAll).toBeDisabled();
  await expect(ancientBuildings).toBeDisabled();
  await expect(modernSites).toBeDisabled();
  await expect(page.locator("#officialCategoryDisabledHelp")).toBeVisible();
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "0 of 7 published official locations displayed."
  );

  await officialLayer.click();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(4);
  await expect(officialAll).toBeEnabled();
  await expect(officialAll).toHaveJSProperty("indeterminate", true);
  await expect(ancientBuildings).not.toBeChecked();
  await expect(modernSites).toBeChecked();
  await expect(page.locator("#officialCategoryDisabledHelp")).toBeHidden();
  expect(officialRequestCount).toBe(1);

  await officialAll.click();
  await expect(officialAll).toBeChecked();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);
  await officialAll.click();
  await expect(officialAll).not.toBeChecked();
  await expect(officialAll).toHaveJSProperty("indeterminate", false);
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "0 of 7 published official locations displayed."
  );
  await officialAll.click();
  await expect(officialAll).toBeChecked();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "7 of 7 published official locations displayed."
  );
  expect(page.url()).toBe(beforeEnableUrl);
  expect(await getRenderedMapState(page)).toEqual(beforeEnableMapState);
  expect(officialRequestCount).toBe(1);
});

test("official preview isolates HTTP failure from community markers", async ({ page }) => {
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 503,
    contentType: "text/plain",
    body: "Unavailable"
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const communityCount = await waitForCommunityMapReady(page);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await openMapLayersTab(page);
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(page.locator("#officialHeritageError")).toHaveText(
    "Official Heritage could not be loaded."
  );
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await expect(getOverlayCheckbox(page, "Show Official Heritage")).not.toBeChecked();
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  await expect(page.locator("[data-official-map-category]")).toHaveCount(0);
});

test("official preview rejects invalid JSON", async ({ page }) => {
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: "{"
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersTab(page);
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(page.locator("#officialHeritageError")).toHaveText(
    "Official Heritage could not be loaded."
  );
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  await expect(page.locator("[data-official-map-category]")).toHaveCount(0);
});

test("official preview rejects malformed metadata", async ({ page }) => {
  const malformed = makeSyntheticOfficialCollection();
  malformed.metadata.datasetId = "wrong-dataset";
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(malformed)
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersTab(page);
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(page.locator("#officialHeritageError")).toHaveText(
    "Official Heritage could not be loaded."
  );
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  await expect(page.locator("[data-official-map-category]")).toHaveCount(0);
});

test("official preview rejects the complete layer when one feature is invalid", async ({ page }) => {
  const validFeature = makeSyntheticOfficialFeature();
  const invalidFeature = makeSyntheticOfficialFeature({
    id: "JX-PCH-7-002",
    coordinates: [181, 27.6202]
  });
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticOfficialCollection([validFeature, invalidFeature]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await openMapLayersTab(page);
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(page.locator("#officialHeritageError")).toHaveText(
    "Official Heritage could not be loaded."
  );
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator("#officialCategoryControls")).toBeHidden();
  await expect(page.locator("[data-official-map-category]")).toHaveCount(0);
});

test("official preview rejects missing, blank, and non-string official categories", async ({ page }) => {
  let invalidCategoryValue;
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => {
    const feature = makeSyntheticOfficialFeature();
    if (invalidCategoryValue === undefined) {
      delete feature.properties.officialCategoryZh;
    } else {
      feature.properties.officialCategoryZh = invalidCategoryValue;
    }
    return route.fulfill({
      status: 200,
      contentType: "application/geo+json",
      body: JSON.stringify(makeSyntheticOfficialCollection([feature]))
    });
  });

  for (const invalidValue of [undefined, "   ", 42]) {
    invalidCategoryValue = invalidValue;
    await page.goto("/map.html", { waitUntil: "domcontentloaded" });
    await openMapLayersTab(page);
    await getOverlayCheckbox(page, "Show Official Heritage").click();
    await expect(page.locator("#officialHeritageError")).toHaveText(
      "Official Heritage could not be loaded."
    );
    await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
    await expect(page.locator("#officialCategoryControls")).toBeHidden();
    await expect(page.locator("[data-official-map-category]")).toHaveCount(0);
  }
});

test("official preview renders a synthetic exact Point without changing community bounds", async ({ page }) => {
  const collection = makeSyntheticOfficialCollection([makeSyntheticOfficialFeature()]);
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(collection)
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchStatus")).not.toHaveText("", { timeout: 20000 });
  await expect(page.locator(".official-heritage-map-legend")).toHaveCount(0);
  await openMapLayersTab(page);
  const layersPanel = page.locator("#mapLayersToolPanel");
  await expect(layersPanel).toContainText("Project-reviewed reference Points");
  await expect(layersPanel).toContainText("Generalized reference Points");
  await expect(layersPanel).toContainText("About Official Heritage representations");
  await expect(layersPanel).toContainText("authority of a heritage record is separate from the authority of its map representation");
  await expect(layersPanel).toContainText("not an authority-supplied coordinate, surveyed heritage extent or legal protection boundary");
  await page.getByRole("tab", { name: "Search" }).click();
  const beforeEnable = await getRenderedMapState(page);
  await openMapLayersTab(page);
  await setOverlayChecked(page, "Show Official Heritage", true);
  await expect(page.locator("#officialHeritageStatus")).toHaveText(
    /\d+ community records? and 1 official heritage location displayed\./
  );
  await expect(page.locator("#officialReviewedPointStatus")).toHaveText(
    "Filled diamond. Currently displayed: 1."
  );
  const marker = page.locator(".official-heritage-map-marker");
  await expect(marker).toHaveCount(1);
  await expect(marker).toHaveClass(/official-heritage-map-marker--ancient-buildings/);
  await expect(marker.locator(".official-map-marker__glyph")).toHaveCount(1);
  await expect(marker).toHaveAttribute(
    "aria-label",
    "Open Official Heritage record: Test Archaeological Site (测试遗址); Official designation level: Provincial; Map category: Ancient buildings; Reviewed location"
  );
  const afterEnable = await getRenderedMapState(page);
  expect(afterEnable).toEqual(beforeEnable);
  await marker.focus();
  await marker.press("Enter");
  await expect(page.locator(".official-heritage-map-popup")).toContainText("Test Archaeological Site");
  await expect(page.locator(".official-heritage-map-popup [lang='zh-Hans']").first()).toHaveText("测试遗址");
  await expect(page.locator(".official-heritage-map-popup")).toContainText("not an official designation coordinate");
});

test("an unknown non-empty official category uses the static Other presentation without changing source text", async ({ page }) => {
  const feature = makeSyntheticOfficialFeature({
    officialCategoryZh: "未来类别<script>alert(1)</script>"
  });
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticOfficialCollection([feature]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchStatus")).not.toHaveText("", { timeout: 20000 });
  const layersPanel = await openMapLayersTab(page);
  await getOverlayCheckbox(page, "Show Official Heritage").click();
  await expect(layersPanel.getByRole("checkbox", {
    name: "Other official heritage",
    exact: true
  })).toBeChecked();
  await expect(page.locator("[data-official-map-category]")).toHaveCount(1);
  await expect(page.locator(".official-heritage-map-marker--other-official-heritage")).toHaveCount(1);
  await expect(page.locator(".official-heritage-map-marker script")).toHaveCount(0);
  const marker = page.getByRole("button", {
    name: /Map category: Other official heritage; Reviewed location$/
  });
  await expect(marker).toBeVisible();
  await expect(marker).toHaveAccessibleName(
    /Map category: Other official heritage; Reviewed location$/
  );
  await marker.focus();
  await marker.press("Enter");
  const popup = page.locator(".official-heritage-map-popup");
  await expect(popup).toContainText("未来类别<script>alert(1)</script>");
  await expect(popup).toContainText("Reviewed approximate location");
  await expect(popup).toContainText("heritage-feature");
});

test("official preview labels a synthetic approximate Point", async ({ page }) => {
  const feature = makeSyntheticOfficialFeature({
    confidence: "Medium",
    publicationPolicy: "approximate"
  });
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticOfficialCollection([feature]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const layersPanel = await openMapLayersTab(page);
  const communityCheckbox = layersPanel.getByRole("checkbox", { name: "All community records", exact: true });
  const officialCheckbox = layersPanel.getByRole("checkbox", { name: "Show Official Heritage", exact: true });
  await expect(communityCheckbox).toBeVisible();
  await expect(communityCheckbox).toBeEnabled();
  await expect(communityCheckbox).toBeChecked();
  await expect(officialCheckbox).toBeVisible();
  await expect(officialCheckbox).toBeEnabled();
  await expect(officialCheckbox).not.toBeChecked();
  await setOverlayChecked(page, "Show Official Heritage", true);
  const marker = page.locator(".official-heritage-map-marker");
  await expect(marker).toHaveAttribute("aria-label", /Map category: Ancient buildings; Approximate site location$/);
  await marker.focus();
  await marker.press("Enter");
  await expect(page.locator(".official-heritage-map-popup")).toContainText("Approximate site location");
  await expect(page.locator(".official-heritage-map-popup")).toContainText("Medium");
});

test("official preview distinguishes a generalized marker and explains its radius", async ({ page }) => {
  const feature = makeSyntheticOfficialFeature({
    confidence: "Medium",
    publicationPolicy: "generalized",
    markerClass: "generalized"
  });
  await page.route(OFFICIAL_HERITAGE_GEOJSON_PATH, (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify(makeSyntheticOfficialCollection([feature]))
  }));
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const layersPanel = await openMapLayersTab(page);
  const communityCheckbox = layersPanel.getByRole("checkbox", { name: "All community records", exact: true });
  const officialCheckbox = layersPanel.getByRole("checkbox", { name: "Show Official Heritage", exact: true });
  await expect(communityCheckbox).toBeVisible();
  await expect(communityCheckbox).toBeEnabled();
  await expect(communityCheckbox).toBeChecked();
  await expect(officialCheckbox).toBeVisible();
  await expect(officialCheckbox).toBeEnabled();
  await expect(officialCheckbox).not.toBeChecked();
  await setOverlayChecked(page, "Show Official Heritage", true);
  const marker = page.locator(".official-heritage-map-marker--generalized");
  await expect(marker).toHaveAttribute("aria-label", /Map category: Ancient buildings; Generalized official reference$/);
  await expect(marker.locator(".official-map-marker__glyph")).toHaveCount(1);
  const generalizedPresentation = await marker.evaluate((element) => ({
    background: getComputedStyle(element, "::before").backgroundColor,
    borderColor: getComputedStyle(element, "::before").borderColor,
    glyphStroke: getComputedStyle(element.querySelector(".official-map-marker__glyph")).stroke
  }));
  expect(generalizedPresentation.background).toBe("rgb(255, 255, 255)");
  expect(generalizedPresentation.borderColor).toBe("rgb(169, 71, 0)");
  expect(generalizedPresentation.glyphStroke).toBe("rgb(169, 71, 0)");
  await marker.focus();
  await marker.press("Enter");
  const popup = page.locator(".official-heritage-map-popup");
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

test("Layers tab controls overlays while Leaflet retains basemap selection only", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const communityCount = await waitForCommunityMapReady(page);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await openMapLayersTab(page);
  const communityToggle = getOverlayCheckbox(page, "All community records");
  const officialToggle = getOverlayCheckbox(page, "Show Official Heritage");
  await expect(communityToggle).toBeChecked();
  await expect(officialToggle).not.toBeChecked();
  await expect(page.locator(".leaflet-control-layers-overlays input")).toHaveCount(0);

  const basemapToggle = page.locator(".leaflet-control-layers-toggle");
  await expect(basemapToggle).toHaveAttribute("aria-label", "Choose basemap");
  await basemapToggle.focus();
  await basemapToggle.press("Enter");
  await expect(page.locator(".leaflet-control-layers")).toHaveClass(/leaflet-control-layers-expanded/);
  await expect(page.locator(".leaflet-control-layers-base input")).toHaveCount(3);
  const esriBasemap = page.locator(".leaflet-control-layers-base label", { hasText: "Esri World Street" }).locator("input");
  await esriBasemap.evaluate((input) => input.click());
  await expect(esriBasemap).toBeChecked();

  expect(communityCount).toBeGreaterThan(0);
  await setOverlayChecked(page, "All community records", false);
  await expect(page.locator(".community-map-pin")).toHaveCount(0);
  await expect(page.locator("#officialHeritageStatus")).toHaveText("No heritage records displayed.");

  await setOverlayChecked(page, "Show Official Heritage", true);
  await expect(page.locator("#officialHeritageStatus")).toHaveText(
    "7 official heritage locations displayed."
  );
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);

  await setOverlayChecked(page, "All community records", true);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await expect(page.locator("#officialHeritageStatus")).toHaveText(
    new RegExp(`${communityCount} community records? and 7 official heritage locations displayed\\.`)
  );

  await page.getByRole("tab", { name: "Search" }).click();
  await expect(page.locator("#mapLayersToolPanel")).toBeHidden();
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(7);
  await page.getByRole("tab", { name: "Layers" }).click();
  await expect(communityToggle).toBeChecked();
  await expect(officialToggle).toBeChecked();
});

test("community categories are accessible tri-state Map visibility controls", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/map.html?place=jiangxi-test-community-square", { waitUntil: "domcontentloaded" });
  const readyCommunityCount = await waitForCommunityMapReady(page);
  await expect(page.locator("#mapFocusStatus")).toContainText("Focused on Jiangxi Test Community Square");
  const layersPanel = await openMapLayersTab(page);
  const parent = layersPanel.getByRole("checkbox", { name: "All community records", exact: true });
  const categoryLabels = [
    "Buildings",
    "Parks and gardens",
    "Monuments and landmarks",
    "Other sites and landscapes",
    "Unknown or uncategorized"
  ];
  const categoryCheckboxes = categoryLabels.map((label) => (
    layersPanel.getByRole("checkbox", { name: label, exact: true })
  ));

  await expect(parent).toBeChecked();
  await expect(parent).toHaveJSProperty("indeterminate", false);
  for (const checkbox of categoryCheckboxes) {
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();
    await expect(checkbox).toBeChecked();
  }

  const initialMarkers = page.locator(".community-map-pin");
  const initialCount = await initialMarkers.count();
  expect(initialCount).toBe(readyCommunityCount);
  expect(initialCount).toBeGreaterThan(0);
  await expect(page.locator("#communityCategoryStatus")).toHaveText(
    new RegExp(`^${initialCount} of ${initialCount} matching community locations? displayed\\.$`)
  );
  for (let index = 0; index < initialCount; index += 1) {
    await expect(initialMarkers.nth(index)).toHaveAttribute(
      "aria-label",
      /^Open community heritage record: .+\. Map category: (Buildings|Parks and gardens|Monuments and landmarks|Other sites and landscapes|Unknown or uncategorized)\.$/
    );
    await expect(initialMarkers.nth(index).locator("svg.community-map-pin__glyph")).toHaveCount(1);
  }

  const markerCategory = "other-sites-landscapes";
  const selectedCategory = layersPanel.getByRole("checkbox", {
    name: "Other sites and landscapes",
    exact: true
  });
  const categoryMarkerCount = await page.locator(`.community-map-pin--${markerCategory}`).count();
  const beforeState = await getRenderedMapState(page);
  const beforeUrl = page.url();

  await selectedCategory.focus();
  await expect(selectedCategory).toBeFocused();
  await selectedCategory.press("Space");
  await expect(selectedCategory).not.toBeChecked();
  await expect(parent).not.toBeChecked();
  await expect(parent).toHaveJSProperty("indeterminate", true);
  await expect(page.locator(".community-map-pin")).toHaveCount(initialCount - categoryMarkerCount);
  await expect(page.locator("#communityCategoryStatus")).toHaveText(
    new RegExp(`^${initialCount - categoryMarkerCount} of ${initialCount} matching community locations? displayed\\.$`)
  );
  await expect(page.locator("#mapFocusStatus")).toContainText(
    "hidden by the current Map layer/category selection"
  );
  expect(page.url()).toBe(beforeUrl);
  expect((await getRenderedMapState(page)).mapPaneTransform).toBe(beforeState.mapPaneTransform);
  await expect(page.locator('.map-custom-filter[data-filter-key="assetType"]')).toHaveCount(1);
  await expect(page.locator('.map-custom-filter[data-filter-key="heritageCriteria"]')).toHaveCount(1);

  await page.getByRole("tab", { name: "Search", exact: true }).click();
  await expect(page.locator(".community-map-pin")).toHaveCount(initialCount - categoryMarkerCount);
  await page.getByRole("tab", { name: "Layers", exact: true }).click();
  await expect(selectedCategory).not.toBeChecked();
  await expect(parent).toHaveJSProperty("indeterminate", true);

  await parent.click();
  await expect(parent).toBeChecked();
  await expect(parent).toHaveJSProperty("indeterminate", false);
  for (const checkbox of categoryCheckboxes) {
    await expect(checkbox).toBeChecked();
  }
  await expect(page.locator(".community-map-pin")).toHaveCount(initialCount);

  await parent.click();
  await expect(parent).not.toBeChecked();
  await expect(parent).toHaveJSProperty("indeterminate", false);
  for (const checkbox of categoryCheckboxes) {
    await expect(checkbox).not.toBeChecked();
  }
  await expect(page.locator(".community-map-pin")).toHaveCount(0);
  await expect(page.locator("#communityCategoryStatus")).toHaveText(
    new RegExp(`^0 of ${initialCount} matching community locations? displayed\\.$`)
  );

  await parent.click();
  await expect(parent).toBeChecked();
  for (const checkbox of categoryCheckboxes) {
    await expect(checkbox).toBeChecked();
  }
  await expect(page.locator(".community-map-pin")).toHaveCount(initialCount);
  expect((await getRenderedMapState(page)).mapPaneTransform).toBe(beforeState.mapPaneTransform);
});

test("desktop keeps one Heritage Explorer sidebar and restores the full Map column", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".map-layers-sidebar, .map-stage__layout, #mapLayersTrigger")).toHaveCount(0);
  await expect(page.locator("#mapLayersToolPanel")).toBeHidden();
  await expect(page.locator("#map")).toBeVisible();

  const layout = await page.evaluate(() => {
    const explorer = document.querySelector(".map-search-sidebar")?.getBoundingClientRect();
    const map = document.getElementById("map")?.getBoundingClientRect();
    return explorer && map
      ? {
          explorerLeft: explorer.left,
          explorerRight: explorer.right,
          explorerWidth: explorer.width,
          mapLeft: map.left,
          mapWidth: map.width,
          mapHeight: map.height
        }
      : null;
  });

  expect(layout).not.toBeNull();
  expect(layout.explorerLeft).toBeLessThan(layout.mapLeft);
  expect(layout.explorerRight).toBeLessThan(layout.mapLeft);
  expect(layout.explorerWidth).toBeGreaterThanOrEqual(280);
  expect(layout.mapWidth).toBeGreaterThanOrEqual(850);
  expect(layout.mapHeight).toBeGreaterThanOrEqual(600);

  const beforeTabSwitch = await page.locator("#map").boundingBox();
  await openMapLayersTab(page);
  const afterTabSwitch = await page.locator("#map").boundingBox();
  expect(afterTabSwitch?.width).toBe(beforeTabSwitch?.width);
});

test("Layers remains a normal usable tab on mobile without a second drawer", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const layersTab = page.getByRole("tab", { name: "Layers", exact: true });
  const panel = page.locator("#mapLayersToolPanel");
  await expect(layersTab).toBeVisible();
  await expect(layersTab).toHaveAttribute("aria-selected", "false");
  await expect(panel).toBeHidden();

  await layersTab.click();
  await expect(layersTab).toHaveAttribute("aria-selected", "true");
  await expect(panel).toBeVisible();
  await expect(getOverlayCheckbox(page, "All community records")).toBeFocused();
  await page.getByRole("tab", { name: "Info" }).click();
  await expect(panel).toBeHidden();
  await expect(page.locator("#mapInfoToolPanel")).toBeVisible();
  await expect(page.locator(".map-layers-sidebar, #mapLayersTrigger, #mapLayersClose")).toHaveCount(0);
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
  expect(cacheVersions.mapHtml).toContain(`map.js?v=${MAP_PAGE_VERSION}`);
  expect(cacheVersions.mapSource).toContain('./heritage-engine/maps.js?v=2026-07-14-pr41-review-fixes');
  expect(cacheVersions.mapSource).toContain(
    `./heritage-engine/official-heritage-map.js?v=${OFFICIAL_HERITAGE_PREVIEW_VERSION}`
  );
  expect(cacheVersions.mapSource).toContain(
    `./heritage-engine/official-map-categories.js?v=${OFFICIAL_CATEGORY_VERSION}`
  );
  expect(cacheVersions.mapSource).toContain(
    `./data/jiangxi-official-protected-heritage-map.geojson?v=${OFFICIAL_HERITAGE_PREVIEW_VERSION}`
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

test("Map tools expose four accessible tabs with automatic arrow-key activation", async ({ page }) => {
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mapSearchToolPanel")).toContainText("Search community heritage records");
  const tabs = page.getByRole("tablist", { name: "Map tools" }).getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await expect(tabs).toHaveText(["Search", "Filters", "Layers", "Info"]);

  const searchTab = page.getByRole("tab", { name: "Search" });
  const filtersTab = page.getByRole("tab", { name: "Filters" });
  const layersTab = page.getByRole("tab", { name: "Layers" });
  const infoTab = page.getByRole("tab", { name: "Info" });
  await expect(searchTab).toHaveAttribute("aria-selected", "true");
  await expect(searchTab).toHaveAttribute("tabindex", "0");
  await expect(filtersTab).toHaveAttribute("tabindex", "-1");

  await filtersTab.click();
  await expect(filtersTab).toHaveAttribute("aria-selected", "true");
  await expect(searchTab).toHaveAttribute("aria-selected", "false");
  await expect(page.locator("#mapFiltersToolPanel")).toContainText("Community discovery filters");
  await expect(page.locator("#mapFiltersToolPanel")).toContainText("Official-layer filtering will be added separately");
  await expect(page.locator("#mapFilterReset")).toBeFocused();

  await filtersTab.focus();
  await filtersTab.press("ArrowRight");
  await expect(layersTab).toBeFocused();
  await expect(layersTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#mapLayersToolPanel")).toBeVisible();
  await layersTab.press("ArrowRight");
  await expect(infoTab).toBeFocused();
  await expect(page.locator("#mapInfoToolPanel")).toBeVisible();
  await infoTab.press("Home");
  await expect(searchTab).toBeFocused();
  await expect(page.locator("#mapSearchToolPanel")).toBeVisible();
  await searchTab.press("End");
  await expect(infoTab).toBeFocused();
});

test("map offers a keyboard-accessible nomination path without map picking", async ({ page }) => {
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: "Info" }).click();
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
    await expect(page.locator("#mapSearchStatus")).not.toHaveText("", { timeout: 20000 });
    await expect(page.locator("#mapViewResultsList")).toBeVisible();
    await expect(page.getByRole("tab", { name: "Layers", exact: true })).toBeVisible();
    await expect(page.locator("#mapLayersToolPanel")).toBeHidden();
    await page.getByRole("tab", { name: "Layers", exact: true }).click();
    await expect(page.locator("#mapLayersToolPanel")).toBeVisible();
    await expect(page.locator(".map-layers-sidebar, #mapLayersTrigger")).toHaveCount(0);
    await expect(page.locator(".leaflet-control-layers-toggle")).toHaveAttribute("aria-label", "Choose basemap");
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
  await expect(page.getByRole("tablist", { name: "Map tools" }).getByRole("tab", { name: "Search" })).toBeVisible();
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Layers", exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Layers", exact: true }).click();
  await expect(page.locator("#mapLayersToolPanel")).toBeVisible();
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
