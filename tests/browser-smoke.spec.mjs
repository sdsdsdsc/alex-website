import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { makeSyntheticGeneralizedPointContract } from "./fixtures/generalized-point-contract.mjs";

const APP_ORIGIN = "http://127.0.0.1:4173";
const NOMINATION_UPLOAD_MODULE_VERSION = "2026-07-04-evidence-upload-timestamp-fix";
const PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION = "2026-07-11-13d-public-reply-query";
const COMMUNITY_PUBLICATION_VERSION = "2026-08-17-community-publication-state";
const MAP_PAGE_VERSION = "2026-08-19-contextual-map-layer-guidance";
const OFFICIAL_HERITAGE_PREVIEW_VERSION = "2026-08-09-kuixing-pavilion-point";
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

const COMMUNITY_CATEGORY_FIXTURES = [
  { id: "fixture-building", title: "Published Fixture Building", category: "Building", recordStatus: "published", lat: 27.62, lng: 113.88 },
  { id: "fixture-park", title: "Published Fixture Park", category: "Park", recordStatus: "published", lat: 27.63, lng: 113.89 },
  { id: "fixture-landmark", title: "Published Fixture Landmark", category: "Landmark", recordStatus: "published", lat: 27.64, lng: 113.90 },
  { id: "fixture-route", title: "Published Fixture Route", category: "Street or route", recordStatus: "published", lat: 27.65, lng: 113.91 },
  { id: "fixture-unknown", title: "Published Fixture Unknown", category: "Unmapped fixture type", recordStatus: "published", lat: 27.66, lng: 113.92 },
  { id: "fixture-hidden", title: "Unpublished Fixture", category: "Building", recordStatus: "under review", lat: 27.67, lng: 113.93 }
];

const COMMUNITY_PUBLICATION_FIXTURES = [
  {
    id: "fixture-published-place",
    title: "Published Fixture Place",
    category: "Building",
    recordStatus: "published",
    description: "A deterministic published browser fixture.",
    lat: 27.62,
    lng: 113.88
  },
  { id: "fixture-draft-place", title: "Draft Fixture Place", category: "Park", recordStatus: "draft", lat: 27.63, lng: 113.89 },
  { id: "fixture-review-place", title: "Review Fixture Place", category: "Landmark", recordStatus: "under review", lat: 27.64, lng: 113.90 },
  { id: "fixture-archived-place", title: "Archived Fixture Place", category: "Public space", recordStatus: "archived", lat: 27.65, lng: 113.91 }
];

async function mockFirestoreCollections(page, collections = {}) {
  const moduleSource = `
    const collections = ${JSON.stringify(collections)};
    function collectionName(reference) {
      return reference?.collectionName || "";
    }
    function documentSnapshot(record) {
      return {
        id: record.id,
        exists: () => true,
        data: () => ({ ...record })
      };
    }
    export function getFirestore() { return {}; }
    export function collection(_parent, name) {
      return { collectionName: name, constraints: [] };
    }
    export function doc(parent, nameOrId, maybeId) {
      return maybeId === undefined
        ? { collectionName: collectionName(parent), id: nameOrId }
        : { collectionName: nameOrId, id: maybeId };
    }
    export function where(field, operator, value) {
      return { field, operator, value };
    }
    export function query(reference, ...constraints) {
      return { ...reference, constraints };
    }
    export async function getDocs(reference) {
      let rows = [...(collections[collectionName(reference)] || [])];
      for (const constraint of reference?.constraints || []) {
        if (constraint.operator === "==") {
          rows = rows.filter((row) => row[constraint.field] === constraint.value);
        }
      }
      const docs = rows.map(documentSnapshot);
      return {
        docs,
        empty: docs.length === 0,
        size: docs.length,
        forEach(callback) { docs.forEach(callback); }
      };
    }
    export async function getDoc(reference) {
      const record = (collections[collectionName(reference)] || [])
        .find((candidate) => candidate.id === reference.id);
      return record
        ? documentSnapshot(record)
        : { id: reference.id, exists: () => false, data: () => undefined };
    }
    export function serverTimestamp() { return { seconds: 0, nanoseconds: 0 }; }
    export async function addDoc() { throw new Error("Unexpected fixture write"); }
  `;

  await page.route(/firebase-firestore\.js(?:\?.*)?$/, (route) => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    headers: { "access-control-allow-origin": "*" },
    body: moduleSource
  }));
}

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

async function expectNoPageLevelHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function setPublicAccountView(page, { signedOutSelector, signedInSelector, signedIn }) {
  await page.locator(signedOutSelector).evaluate((element, show) => {
    element.hidden = !show;
  }, !signedIn);
  await page.locator(signedInSelector).evaluate((element, show) => {
    element.hidden = !show;
  }, signedIn);
}

async function expectAccountLayoutWithinViewport(page) {
  const layout = await page.locator(".public-auth-layout").evaluate((element) => {
    const note = element.querySelector(".public-auth-note").getBoundingClientRect();
    const panels = element.querySelector(".public-auth-panels").getBoundingClientRect();
    return {
      columns: getComputedStyle(element).gridTemplateColumns,
      viewportWidth: document.documentElement.clientWidth,
      note: { left: note.left, right: note.right, bottom: note.bottom, width: note.width },
      panels: { left: panels.left, right: panels.right, top: panels.top, width: panels.width }
    };
  });

  expect(layout.columns.trim().split(/\s+/)).toHaveLength(1);
  expect(layout.note.width).toBeGreaterThan(0);
  expect(layout.panels.width).toBeGreaterThan(0);
  expect(layout.note.left).toBeGreaterThanOrEqual(0);
  expect(layout.panels.left).toBeGreaterThanOrEqual(0);
  expect(layout.note.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.panels.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.panels.top).toBeGreaterThanOrEqual(layout.note.bottom - 1);
}

async function expectControlsWithinViewport(page, selectors) {
  for (const selector of selectors) {
    const control = page.locator(selector);
    await expect(control).toBeVisible();
    const bounds = await control.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        viewportWidth: document.documentElement.clientWidth
      };
    });
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth + 1);
  }
}

function makeSyntheticOfficialFeature({
  id = "JX-PCH-7-001",
  confidence = "High",
  publicationPolicy = "exact",
  markerClass = "reviewed",
  officialCategoryZh = "古建筑",
  estimatedUncertaintyMeters = markerClass === "generalized" ? 40 : 20,
  generalizationRadiusMeters = markerClass === "generalized" ? 40 : null,
  coordinates = [113.8825, 27.6202]
} = {}) {
  const feature = {
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
  if (markerClass === "generalized") {
    Object.assign(feature.properties, {
      geometryMeaning: "generalized-reference-point",
      representationStatus: "project-reviewed-interpretation",
      geometrySourceType: "project-generalized-reference",
      geometrySourceLabel: "Synthetic project Generalized reference Point",
      geometrySourceUrl: "https://example.gov.cn/synthetic-generalized-point",
      geometryReviewedAt: "2026-08-04",
      geometryReviewNotes: "Synthetic Generalized reference Point; not an exact feature or boundary.",
      geometryPrecision: "generalized",
      horizontalUncertaintyMetres: 40,
      generalizedPointContract: makeSyntheticGeneralizedPointContract({ identityId: id })
    });
  }
  return feature;
}

function makeSyntheticOfficialCollection(features = []) {
  return {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: "2.0.0",
      datasetId: "jiangxi-official-protected-heritage-map",
      sourceRecordCount: 19,
      featureCount: features.length,
      excludedRecordCount: 19 - features.length,
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
  await expect(page.locator("#map.leaflet-container")).toBeVisible({ timeout: 20000 });
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
  await expect(sharedDiscovery.locator(".result")).toHaveCount(13);
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
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Project-reviewed reference Points");
  await expect(page.locator("#mapLayersToolPanel")).toContainText("Generalized reference Points");
  await expect(page.locator("#mapLayersToolPanel")).not.toContainText("Additional information");
  await expect(page.locator("#mapLayersToolPanel")).not.toContainText("Reviewed lines and areas");
  await expect(page.locator("#mapLayersToolPanel")).not.toContainText("Approximate or generalized geometry");
  await expect(page.locator("#mapLayersToolPanel")).not.toContainText("current map displays seven");
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

test("Map layer guidance is contextual, keyboard accessible, concise, and responsive", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  const layersPanel = await openMapLayersTab(page);
  await expect(layersPanel.getByRole("button", { name: "About Community heritage" })).toBeVisible();
  await expect(layersPanel.getByRole("button", { name: "About Buildings" })).toBeVisible();
  await expect(layersPanel.getByRole("button", { name: "About Official Heritage", exact: true })).toBeVisible();
  await expect(layersPanel.getByRole("button", { name: "About Official Heritage map symbols" })).toBeVisible();
  expect(await layersPanel.evaluate((element) => element.scrollHeight)).toBeLessThan(1000);

  const communityHelp = layersPanel.getByRole("button", { name: "About Community heritage" });
  await communityHelp.focus();
  await communityHelp.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Community heritage" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("not statutory designations");
  await expect(dialog.getByRole("link", { name: "Community and Official Heritage" })).toHaveAttribute(
    "href",
    "about-local-heritage.html#community-and-official-heritage"
  );
  await expect(dialog.getByRole("button", { name: "Close help" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(communityHelp).toBeFocused();

  const buildingsHelp = layersPanel.getByRole("button", { name: "About Buildings" });
  await buildingsHelp.click();
  await expect(page.getByRole("dialog", { name: "Buildings" }).getByRole("link")).toHaveAttribute(
    "href",
    "criteria.html#asset-type-buildings"
  );
  await page.getByRole("dialog", { name: "Buildings" }).getByRole("button", { name: "Close", exact: true }).click();

  await layersPanel.getByRole("button", { name: "About Official Heritage", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Official Heritage" })).toContainText("national, provincial or municipal registers");
  await page.keyboard.press("Escape");
  await layersPanel.getByRole("button", { name: "About Official Heritage map symbols" }).click();
  await expect(page.getByRole("dialog", { name: "Official Heritage map symbols" })).toContainText("No official lines or areas are currently published");
  await page.keyboard.press("Escape");

  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 430, height: 932 }
  ]) {
    await page.setViewportSize(viewport);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
});

test("Criteria distinguishes Asset Type from significance and exposes stable guidance anchors", async ({ page }) => {
  await page.goto("/criteria.html", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Asset Type", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Asset Type: what kind of place is it?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Heritage criteria: why does it matter?" })).toBeVisible();
  for (const anchor of [
    "asset-type-buildings",
    "asset-type-parks-gardens",
    "asset-type-monuments-landmarks",
    "asset-type-other-sites-landscapes",
    "asset-type-uncategorized",
    "historic-interest",
    "condition-vulnerability"
  ]) {
    await expect(page.locator(`#${anchor}`)).toHaveCount(1);
  }
  await expect(page.getByRole("navigation", { name: "Criteria actions" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("production-sized official fixture renders nine accessible markers across responsive and 200% zoom checks", async ({ page }) => {
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
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);
  await expect(page.locator("#officialHeritageStatus")).toContainText("9 official heritage locations");
  await expect(page.locator("#officialReviewedPointStatus")).toHaveText(
    "Filled diamond. Currently displayed: 8."
  );
  await expect(page.locator("#officialGeneralizedPointStatus")).toHaveText(
    "Hollow diamond. Currently displayed: 1."
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
  await expect(n07Popup).toContainText("100 metres");
  await expect(n07Popup.locator(".map-point-card__facts > div").filter({
    has: page.locator("dt", { hasText: /^Map location source$/ })
  })).toContainText("Project-reviewed digitization");
  await expect(n07Popup).not.toContainText("not an authority-supplied coordinate");
  const popupHelp = n07Popup.getByRole("button", { name: "? What does this location mean?" });
  await expect(popupHelp).toBeVisible();
  await popupHelp.click();
  await expect(page.getByRole("dialog", { name: "Official Heritage map symbols" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popupHelp).toBeFocused();

  const m13Marker = page.getByRole("button", {
    name: "Open Official Heritage record: Kuixing Pavilion (魁星阁); Official designation level: Municipal; Map category: Ancient buildings; Heritage building reference point (approximate project-reviewed location)",
    exact: true
  });
  await expect(m13Marker).toHaveCount(1);
  await expect(m13Marker).toHaveClass(/official-heritage-map-marker--reviewed/);
  await m13Marker.focus();
  await expect(m13Marker).toBeFocused();
  await m13Marker.press("Enter");
  const m13Popup = page.locator(".official-heritage-map-popup").filter({
    hasText: "Kuixing Pavilion"
  });
  await expect(m13Popup).toContainText("Heritage building reference point");
  await expect(m13Popup).toContainText("Municipal");
  await expect(m13Popup).toContainText("30 metres");
  await expect(m13Popup).not.toContainText("not an official GIS or survey coordinate");

  const xieliMarker = page.getByRole("button", {
    name: /Open Official Heritage record: Xieli Site \(斜里遗址\); Official designation level: Provincial; Map category: Archaeological sites; Generalized project reference point; Generalized reference location\./
  });
  await expect(xieliMarker).toHaveCount(1);
  await expect(xieliMarker).toHaveClass(/official-heritage-map-marker--generalized/);
  await xieliMarker.focus();
  await xieliMarker.press("Space");
  const xieliPopup = page.locator(".official-heritage-map-popup").filter({ hasText: "Xieli Site" });
  await expect(xieliPopup.locator(".official-heritage-map-popup__generalized-limitation")).toHaveText(
    "Generalized reference location. This marker represents the documented general vicinity of the heritage record. It does not show the exact feature, centre, entrance, extent, or legal protection boundary."
  );
  await expect(xieliPopup.locator(".official-heritage-map-popup__candidate-limitation")).toContainText(
    "source-described Xieli vicinity"
  );
  await expect(xieliPopup).toContainText("50 metres");
  await expect(xieliPopup).toContainText("coincident-interpretation-envelope-centre");
  await expect(xieliPopup).not.toContainText("WGS84");
  await expect(xieliPopup).not.toContainText("CGCS2000");

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
    "This is a public visitor reference and may not coincide with the protected feature."
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
  await expect(bridgePopup).not.toContainText("project-reviewed approximate feature location");

  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 }
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);
    await expect(officialToggle).toBeChecked();
    expect(await page.evaluate(() => (
      document.documentElement.scrollWidth <= document.documentElement.clientWidth
    ))).toBe(true);
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);
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
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);
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
  const archaeologicalSites = layersPanel.getByRole("checkbox", {
    name: "Archaeological sites",
    exact: true
  });
  await expect(page.locator("#officialCategoryControls")).toBeVisible();
  await expect(officialAll).toBeChecked();
  await expect(officialAll).toBeEnabled();
  await expect(ancientBuildings).toBeChecked();
  await expect(modernSites).toBeChecked();
  await expect(archaeologicalSites).toBeChecked();
  await expect(layersPanel.getByRole("checkbox", {
    name: "Other official heritage",
    exact: true
  })).toHaveCount(0);
  await expect(page.locator("[data-official-map-category]")).toHaveCount(3);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "9 of 9 published official locations displayed."
  );
  await expect(page.locator(".official-heritage-map-marker--ancient-buildings")).toHaveCount(4);
  await expect(page.locator(".official-heritage-map-marker--archaeological-sites")).toHaveCount(1);
  await expect(page.locator(".official-heritage-map-marker--important-modern-historic-sites")).toHaveCount(4);
  await expect(page.locator(".official-heritage-map-marker .official-map-marker__glyph")).toHaveCount(9);

  await ancientBuildings.focus();
  await expect(ancientBuildings).toBeFocused();
  await ancientBuildings.press("Space");
  await expect(ancientBuildings).not.toBeChecked();
  await expect(modernSites).toBeChecked();
  await expect(officialAll).not.toBeChecked();
  await expect(officialAll).toHaveJSProperty("indeterminate", true);
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(5);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "5 of 9 published official locations displayed."
  );
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await expect(communityParent).toBeChecked();
  expect(page.url()).toBe(beforeEnableUrl);
  expect(await getRenderedMapState(page)).toEqual(beforeEnableMapState);
  expect(officialRequestCount).toBe(1);

  await page.getByRole("tab", { name: "Search", exact: true }).click();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(5);
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
  await expect(archaeologicalSites).toBeDisabled();
  await expect(page.locator("#officialCategoryDisabledHelp")).toBeVisible();
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "0 of 9 published official locations displayed."
  );

  await officialLayer.click();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(5);
  await expect(officialAll).toBeEnabled();
  await expect(officialAll).toHaveJSProperty("indeterminate", true);
  await expect(ancientBuildings).not.toBeChecked();
  await expect(modernSites).toBeChecked();
  await expect(page.locator("#officialCategoryDisabledHelp")).toBeHidden();
  expect(officialRequestCount).toBe(1);

  await officialAll.click();
  await expect(officialAll).toBeChecked();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);
  await officialAll.click();
  await expect(officialAll).not.toBeChecked();
  await expect(officialAll).toHaveJSProperty("indeterminate", false);
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(0);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "0 of 9 published official locations displayed."
  );
  await officialAll.click();
  await expect(officialAll).toBeChecked();
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);
  await expect(page.locator("#officialCategoryStatus")).toHaveText(
    "9 of 9 published official locations displayed."
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
  await mockFirestoreCollections(page, { communityPlaces: COMMUNITY_CATEGORY_FIXTURES });
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
  await expect(layersPanel).not.toContainText("About Official Heritage representations");
  await expect(layersPanel).not.toContainText("authority of a heritage record is separate from the authority of its map representation");
  await expect(layersPanel).not.toContainText("not an authority-supplied coordinate, surveyed heritage extent or legal protection boundary");
  await page.getByRole("tab", { name: "Search" }).click();
  await page.waitForTimeout(500);
  const beforeEnable = await getRenderedMapState(page);
  await openMapLayersTab(page);
  await setOverlayChecked(page, "Show Official Heritage", true);
  await expect(layersPanel).toContainText("Generalized reference Points");
  await expect(page.locator("#officialGeneralizedPointStatus")).toHaveText(
    "Hollow diamond. Currently displayed: 0."
  );
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
  expect(afterEnable.communityMarkerCount).toBe(beforeEnable.communityMarkerCount);
  const transformCoordinates = (transform) =>
    [...transform.matchAll(/-?\d+(?:\.\d+)?/g)].slice(0, 2).map((value) => Number(value[0]));
  const beforeCoordinates = transformCoordinates(beforeEnable.mapPaneTransform);
  const afterCoordinates = transformCoordinates(afterEnable.mapPaneTransform);
  expect(afterCoordinates).toHaveLength(2);
  expect(beforeCoordinates).toHaveLength(2);
  expect(Math.abs(afterCoordinates[0] - beforeCoordinates[0])).toBeLessThan(1);
  expect(Math.abs(afterCoordinates[1] - beforeCoordinates[1])).toBeLessThan(1);
  await marker.focus();
  await marker.press("Enter");
  await expect(page.locator(".official-heritage-map-popup")).toContainText("Test Archaeological Site");
  await expect(page.locator(".official-heritage-map-popup [lang='zh-Hans']").first()).toHaveText("测试遗址");
  await expect(page.locator(".official-heritage-map-popup")).not.toContainText("not an official designation coordinate");
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
  await expect(popup).toContainText("Reviewed site location");
  await expect(popup).toContainText("Other official heritage");
  await expect(popup).not.toContainText("heritage-feature");
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

test("synthetic non-Xinyu Generalized Point retains essential visible limitations and accessible context", async ({ page }) => {
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
  await expect(marker).toHaveAttribute("aria-label", /Generalized project reference point; Generalized reference location\./);
  await expect(marker).toHaveAttribute("aria-label", /Synthetic candidate limitation/);
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
  await expect(popup).toContainText("Generalized project reference point");
  await expect(popup.locator(".official-heritage-map-popup__generalized-limitation")).toHaveText(
    "Generalized reference location. This marker represents the documented general vicinity of the heritage record. It does not show the exact feature, centre, entrance, extent, or legal protection boundary."
  );
  await expect(popup.locator(".official-heritage-map-popup__candidate-limitation")).toContainText("source datum is unstated");
  const expectedRows = new Map([
    ["Representative-Point method", "minimum-enclosing-circle-centre"],
    ["Reference-area coverage", "40 metres"]
  ]);
  for (const [label, value] of expectedRows) {
    const row = popup.locator(".map-point-card__facts > div").filter({ has: page.locator("dt", { hasText: new RegExp(`^${label}$`) }) });
    await expect(row.locator("dd")).toHaveText(value);
  }
  await expect(popup.getByRole("link", { name: "Open official source" })).toHaveAttribute("href", "https://example.gov.cn/source");
  await expect(popup.getByRole("link", { name: "Open map-location source" })).toHaveAttribute("href", "https://example.gov.cn/synthetic-generalized-point");
  await expect(popup.getByRole("link", { name: "Open spatial-basis source" })).toHaveCount(0);
  await expect(popup.getByRole("link", { name: "Open limitation source" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await marker.focus();
  await marker.press("Space");
  await expect(popup).toBeVisible();
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
    "9 official heritage locations displayed."
  );
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);

  await setOverlayChecked(page, "All community records", true);
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await expect(page.locator("#officialHeritageStatus")).toHaveText(
    new RegExp(`${communityCount} community records? and 9 official heritage locations displayed\\.`)
  );

  await page.getByRole("tab", { name: "Search" }).click();
  await expect(page.locator("#mapLayersToolPanel")).toBeHidden();
  await expect(page.locator(".community-map-pin")).toHaveCount(communityCount);
  await expect(page.locator(".official-heritage-map-marker")).toHaveCount(9);
  await page.getByRole("tab", { name: "Layers" }).click();
  await expect(communityToggle).toBeChecked();
  await expect(officialToggle).toBeChecked();
});

test("Community Heritage publication state protects every public route", async ({ page }) => {
  test.setTimeout(60000);
  await mockFirestoreCollections(page, {
    communityPlaces: COMMUNITY_PUBLICATION_FIXTURES,
    news: [],
    history: [{
      id: "fixture-history",
      title: "Fixture History",
      relatedPlaces: [
        { collection: "communityPlaces", id: "fixture-published-place", title: "Published Fixture Place" },
        { collection: "communityPlaces", id: "fixture-draft-place", title: "Draft Fixture Place" }
      ]
    }],
    placeContributions: [],
    placeContributionReplies: []
  });

  await page.goto("/search.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#communitySearchCount")).toHaveText("Showing 1 of 1 community place");
  await expect(page.locator(".community-result-card")).toHaveCount(1);
  await expect(page.locator(".community-result-card")).toContainText("Published Fixture Place");
  await expect(page.locator("#communitySearchResults")).not.toContainText("Draft Fixture Place");
  await expect(page.locator("#communitySearchResults")).not.toContainText("Review Fixture Place");
  await expect(page.locator("#communitySearchResults")).not.toContainText("Archived Fixture Place");

  await page.goto("/map.html", { waitUntil: "domcontentloaded" });
  expect(await waitForCommunityMapReady(page)).toBe(1);
  await expect(page.locator(".community-map-pin")).toHaveCount(1);
  await expect(page.locator(".community-map-pin")).toHaveAttribute(
    "aria-label",
    /Published Fixture Place/
  );

  await page.goto("/place.html?id=fixture-published-place", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#placeRecordContent")).toBeVisible();
  await expect(page.locator("#placeTitle")).toHaveText("Published Fixture Place");

  for (const id of ["fixture-draft-place", "fixture-review-place", "fixture-archived-place"]) {
    await page.goto(`/place.html?id=${id}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#placeRecordStatus")).toHaveText("Community place record not found.");
    await expect(page.locator("#placeRecordContent")).toBeHidden();
  }

  await page.goto("/export.html", { waitUntil: "domcontentloaded" });
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#downloadBtn").click();
  const download = await downloadPromise;
  const downloadedPath = await download.path();
  expect(downloadedPath).toBeTruthy();
  const exported = JSON.parse(await readFile(downloadedPath, "utf8"));
  expect(exported["@graph"].map((node) => node["@id"])).toEqual([
    "article.html?id=fixture-history&type=history",
    "place.html?id=fixture-published-place"
  ]);
  expect(JSON.stringify(exported)).not.toContain("Draft Fixture Place");
  expect(JSON.stringify(exported)).not.toContain("Review Fixture Place");
  expect(JSON.stringify(exported)).not.toContain("Archived Fixture Place");
});

test("community categories are accessible tri-state Map visibility controls", async ({ page }) => {
  test.setTimeout(60000);
  await mockFirestoreCollections(page, { communityPlaces: COMMUNITY_CATEGORY_FIXTURES });
  await page.goto("/map.html?place=fixture-route", { waitUntil: "domcontentloaded" });
  const readyCommunityCount = await waitForCommunityMapReady(page);
  expect(readyCommunityCount).toBe(5);
  await expect(page.locator("#mapFocusStatus")).toContainText("Focused on Published Fixture Route");
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
  await expect(panel.getByRole("button", { name: "About Community heritage" })).toBeFocused();
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

for (const viewport of [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 430, height: 932 }
]) {
  test(`public account journeys fit ${viewport.width}x${viewport.height} in signed-out and signed-in layouts`, async ({ page }) => {
    await page.route(/\/(?:public-auth|my-nominations)\.js(?:\?.*)?$/, (route) => route.fulfill({
      contentType: "application/javascript",
      body: ""
    }));
    await page.setViewportSize(viewport);

    await page.goto("/public-auth.html", { waitUntil: "domcontentloaded" });
    await setPublicAccountView(page, {
      signedOutSelector: "#publicAuthSignedOut",
      signedInSelector: "#publicAuthSignedIn",
      signedIn: false
    });
    await expectAccountLayoutWithinViewport(page);
    await expectNoPageLevelHorizontalOverflow(page);
    await expectControlsWithinViewport(page, [
      "#publicRegisterEmail",
      "#publicRegisterForm button[type='submit']",
      "#publicLoginEmail",
      "#publicLoginForm button[type='submit']"
    ]);

    await setPublicAccountView(page, {
      signedOutSelector: "#publicAuthSignedOut",
      signedInSelector: "#publicAuthSignedIn",
      signedIn: true
    });
    await expectAccountLayoutWithinViewport(page);
    await expectNoPageLevelHorizontalOverflow(page);
    await expectControlsWithinViewport(page, [
      "#publicAuthSignOutButton",
      "#publicAuthSignedIn a[href='my-nominations.html']",
      "#publicAuthSignedIn a[href='nominate-place.html']"
    ]);

    await page.goto("/my-nominations.html", { waitUntil: "domcontentloaded" });
    await setPublicAccountView(page, {
      signedOutSelector: "#myNominationsSignedOut",
      signedInSelector: "#myNominationsSignedIn",
      signedIn: false
    });
    await expectAccountLayoutWithinViewport(page);
    await expectNoPageLevelHorizontalOverflow(page);
    await expectControlsWithinViewport(page, ["#myNominationsPrimarySignInLink"]);

    await setPublicAccountView(page, {
      signedOutSelector: "#myNominationsSignedOut",
      signedInSelector: "#myNominationsSignedIn",
      signedIn: true
    });
    await expectAccountLayoutWithinViewport(page);
    await expectNoPageLevelHorizontalOverflow(page);
    await expectControlsWithinViewport(page, ["#myNominationsSignedIn a[href='nominate-place.html']"]);

    await page.goto("/nominate-place.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#nominationForm")).toBeVisible();
    await expectNoPageLevelHorizontalOverflow(page);
  });
}

test("public account pages retain their desktop two-column layout", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  for (const path of ["/public-auth.html", "/my-nominations.html"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const layout = await page.locator(".public-auth-layout").evaluate((element) => {
      const note = element.querySelector(".public-auth-note").getBoundingClientRect();
      const panels = element.querySelector(".public-auth-panels").getBoundingClientRect();
      return {
        columns: getComputedStyle(element).gridTemplateColumns,
        note: { left: note.left, right: note.right, width: note.width },
        panels: { left: panels.left, right: panels.right, width: panels.width },
        viewportWidth: document.documentElement.clientWidth
      };
    });

    expect(layout.columns.trim().split(/\s+/)).toHaveLength(2);
    expect(layout.note.width).toBeGreaterThan(0);
    expect(layout.panels.width).toBeGreaterThan(0);
    expect(layout.panels.left).toBeGreaterThan(layout.note.right);
    expect(layout.panels.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
    await expectNoPageLevelHorizontalOverflow(page);
  }
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
  expect(pageHtml).toContain(`place.js?v=${COMMUNITY_PUBLICATION_VERSION}`);

  const scriptResponse = await page.request.get(`/place.js?v=${COMMUNITY_PUBLICATION_VERSION}`);
  expect(scriptResponse.ok()).toBeTruthy();
  const scriptText = await scriptResponse.text();
  expect(scriptText).toContain(`./heritage-engine/place-contributions.js?v=${PLACE_CONTRIBUTION_UPLOAD_MODULE_VERSION}`);
  expect(scriptText).toContain('./heritage-engine/search.js');
});

test("public-route browser coverage uses fixtures instead of the live placeholder record", async ({ page }) => {
  const livePlaceholderId = ["jiangxi", "test", "community", "square"].join("-");
  const browserTestSource = await readFile(new URL("./browser-smoke.spec.mjs", import.meta.url), "utf8");
  expect(browserTestSource).not.toContain(livePlaceholderId);

  const exportHtml = await (await page.request.get("/export.html")).text();
  expect(exportHtml).toContain(`export.js?v=${COMMUNITY_PUBLICATION_VERSION}`);
  const exportScript = await (await page.request.get(`/export.js?v=${COMMUNITY_PUBLICATION_VERSION}`)).text();
  expect(exportScript).toContain(`./heritage-engine/export.js?v=${COMMUNITY_PUBLICATION_VERSION}`);
});
