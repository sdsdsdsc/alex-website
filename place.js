import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  buildMapUrl,
  buildPlaceJsonLd,
  buildPublicPlaceSummary,
  cleanText,
  formatPlaceLocationAddress,
  formatRecordDate,
  getAssetType,
  getCoordinateDisplay,
  getDisplayTitle,
  getHeritageCriteria,
  getPublicDescription,
  getRelatedArticleUrl,
  getTags,
  hasUsableJsonLd,
  hasValidCoordinates,
  normalizeCoordinate,
  toSafeUrl
} from "./heritage-engine/places.js?v=2026-06-20-releasepolish";
import {
  ARTICLE_RELATIONSHIP_COLLECTIONS,
  getRelationshipWarningSummary,
  normalizeRelationshipReferences
} from "./heritage-engine/relationships.js?v=2026-06-19-12a";
import {
  buildPublicPlaceContributionPayload
} from "./heritage-engine/place-contributions.js?v=2026-06-30-11c-contributions-renderer";

const firebaseConfig = {
  apiKey: "AIzaSyDr8hSSoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const els = {
  status: document.getElementById("placeRecordStatus"),
  content: document.getElementById("placeRecordContent"),
  title: document.getElementById("placeTitle"),
  breadcrumbTitle: document.getElementById("placeBreadcrumbTitle"),
  description: document.getElementById("placeDescription"),
  tags: document.getElementById("placeTags"),
  actions: document.getElementById("placeActions"),
  imageWrap: document.getElementById("placeImageWrap"),
  imageCredit: document.getElementById("placeImageCredit"),
  locationContent: document.getElementById("placeLocationContent"),
  localHeritageSection: document.getElementById("localHeritageRecord"),
  localHeritageContent: document.getElementById("placeLocalHeritageRecord"),
  relatedArticlesSection: document.getElementById("relatedArticles"),
  relatedArticles: document.getElementById("placeRelatedArticles"),
  sourceReference: document.getElementById("placeSourceReference"),
  metadata: document.getElementById("placeMetadata"),
  contributionsList: document.getElementById("placeContributionsList"),
  contributionsEmpty: document.getElementById("placeContributionsEmpty"),
  tabs: Array.from(document.querySelectorAll(".place-record-tab")),
  panels: Array.from(document.querySelectorAll(".place-tab-panel"))
};

let placeMap = null;
const validSections = new Set(["overview", "comments-photos"]);

function getSectionFromUrl() {
  const section = new URLSearchParams(window.location.search).get("section");
  return validSections.has(section) ? section : "overview";
}

function buildSectionUrl(section) {
  const url = new URL(window.location.href);
  url.searchParams.set("section", section);
  url.hash = section === "comments-photos" ? "comments-photos-panel" : "overview-panel";
  return `${url.pathname}${url.search}${url.hash}`;
}

function setActiveSection(section, options = {}) {
  const activeSection = validSections.has(section) ? section : "overview";

  els.tabs.forEach((tab) => {
    const tabSection = tab.dataset.section;
    const isActive = tabSection === activeSection;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
    if (isActive) {
      tab.setAttribute("aria-current", "page");
    } else {
      tab.removeAttribute("aria-current");
    }
  });

  els.panels.forEach((panel) => {
    panel.hidden = panel.dataset.section !== activeSection;
  });

  if (activeSection === "overview" && placeMap) {
    window.setTimeout(() => placeMap.invalidateSize(), 0);
  }

  if (!options.skipHistory) {
    window.history.replaceState({}, "", buildSectionUrl(activeSection));
  }
}

function setupTabs() {
  els.tabs.forEach((tab) => {
    const controls = tab.getAttribute("aria-controls");
    const panel = controls ? document.getElementById(controls) : null;
    const section = controls === "comments-photos-panel" ? "comments-photos" : "overview";
    tab.dataset.section = section;
    if (panel) panel.dataset.section = section;
    tab.href = buildSectionUrl(section);

    tab.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveSection(section);
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const currentIndex = els.tabs.indexOf(tab);
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = els.tabs[(currentIndex + offset + els.tabs.length) % els.tabs.length];
      nextTab.focus();
      setActiveSection(nextTab.dataset.section);
    });
  });
}

function appendMetadata(label, value, emptyText = "Not recorded yet.", options = {}) {
  if (!els.metadata) return;
  const safeValue = cleanText(value);
  if (!safeValue && options.hideIfEmpty) {
    return;
  }
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  if (safeValue) {
    dd.textContent = safeValue;
  } else {
    dd.textContent = emptyText;
    dd.className = "place-empty-value";
  }
  els.metadata.append(dt, dd);
}

function appendHeritageDetail(details, label, value, options = {}) {
  const safeValue = cleanText(value);
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = safeValue || options.emptyText || "Not recorded yet.";
  if (options.long) {
    dt.className = "place-local-heritage__long-label";
    dd.className = "place-local-heritage__long-value";
  }
  if (!safeValue) {
    dd.classList.add("place-empty-value");
  }
  details.append(dt, dd);
  return Boolean(safeValue);
}

function appendHeritageCriteria(details, criteria) {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = "Community heritage criteria";
  dt.className = "place-local-heritage__long-label";
  dd.className = "place-local-heritage__long-value";

  if (criteria.length === 0) {
    dd.textContent = "No criteria recorded yet.";
    dd.classList.add("place-empty-value");
    details.append(dt, dd);
    return false;
  }

  const list = document.createElement("div");
  list.className = "place-local-heritage__criteria";
  criteria.forEach((criterion) => {
    const item = document.createElement("span");
    item.className = "place-local-heritage__criterion";
    item.textContent = criterion;
    list.appendChild(item);
  });

  dd.appendChild(list);
  details.append(dt, dd);
  return true;
}

function renderLocalHeritageRecord(place) {
  if (!els.localHeritageSection || !els.localHeritageContent) return;
  els.localHeritageContent.textContent = "";

  const details = document.createElement("dl");
  details.className = "place-local-heritage__details";
  appendHeritageDetail(details, "Local significance", place.localSignificanceSummary, {
    long: true,
    emptyText: "No local significance summary recorded yet."
  });
  appendHeritageCriteria(details, getHeritageCriteria(place));
  appendHeritageDetail(details, "Criteria explanation", place.criteriaExplanation, {
    long: true,
    emptyText: "No criteria explanation recorded yet."
  });
  appendHeritageDetail(details, "Heritage value", place.heritageValue, {
    long: true,
    emptyText: "No heritage value note recorded yet."
  });
  appendHeritageDetail(details, "Condition", place.condition, {
    emptyText: "No condition note recorded yet."
  });
  appendHeritageDetail(details, "Community use", place.communityUse, {
    long: true,
    emptyText: "No community use note recorded yet."
  });
  appendHeritageDetail(details, "Date added", formatRecordDate(place.dateAdded), {
    emptyText: "Date not recorded yet."
  });
  appendHeritageDetail(details, "Last reviewed", formatRecordDate(place.lastReviewed), {
    emptyText: "No review date recorded yet."
  });
  appendHeritageDetail(details, "Record status", place.recordStatus, {
    emptyText: "No public record status recorded yet."
  });

  els.localHeritageContent.appendChild(details);
}

function renderImage(place) {
  if (!els.imageWrap) return;
  els.imageWrap.textContent = "";
  const imageUrl = toSafeUrl(place.imageUrl);
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = cleanText(place.title) || "Community place image";
    els.imageWrap.appendChild(image);
    return;
  }
  const placeholder = document.createElement("div");
  placeholder.className = "place-record-image__placeholder";
  placeholder.textContent = "Community place";
  els.imageWrap.appendChild(placeholder);
}

function renderImageCredit(place) {
  if (!els.imageCredit) return;
  const source = cleanText(place.source) || "Alex's Photo Board";
  const contributor = cleanText(place.imageCredit || place.contributor);
  els.imageCredit.textContent = "";

  const creditLines = [["Image source", source]];
  if (contributor) creditLines.push(["Contributor", contributor]);

  creditLines.forEach(([label, value]) => {
    const line = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    line.append(strong, value);
    els.imageCredit.appendChild(line);
  });

  const note = document.createElement("span");
  note.textContent = "This image is part of the community place record.";
  els.imageCredit.appendChild(note);
}

function renderTags(place) {
  if (!els.tags) return;
  els.tags.textContent = "";
  const tags = getTags(place);
  if (tags.length === 0) return;
  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    els.tags.appendChild(item);
  });
}

function renderActions(place) {
  if (!els.actions) return;
  els.actions.textContent = "";
  const mapLink = document.createElement("a");
  mapLink.href = buildMapUrl(place);
  mapLink.textContent = "View on map";
  els.actions.appendChild(mapLink);

  const relatedArticle = getRelatedArticleUrl(place);
  if (relatedArticle) {
    const articleLink = document.createElement("a");
    articleLink.href = relatedArticle;
    articleLink.textContent = "Open related story";
    els.actions.appendChild(articleLink);
  }
}

function renderRelatedArticles(place) {
  if (!els.relatedArticles || !els.relatedArticlesSection) return;
  els.relatedArticles.textContent = "";

  const relationshipReport = normalizeRelationshipReferences(place?.relatedArticles, {
    allowedCollections: ARTICLE_RELATIONSHIP_COLLECTIONS
  });
  const relatedArticles = relationshipReport.references;

  if (relationshipReport.warnings.length > 0) {
    console.warn("Skipped unsafe or malformed place relationships:", getRelationshipWarningSummary(relationshipReport.warnings));
  }

  if (relatedArticles.length > 0) {
    els.relatedArticlesSection.hidden = false;
    relatedArticles.forEach((reference) => {
      const link = document.createElement("a");
      link.href = reference.url;
      link.className = "place-related-articles__item";

      const title = document.createElement("span");
      title.className = "place-related-articles__title";
      title.textContent = reference.title;

      const meta = document.createElement("span");
      meta.className = "place-related-articles__meta";
      meta.textContent = reference.collection === "history" ? "History" : "News";

      link.append(title, meta);
      els.relatedArticles.appendChild(link);
    });
    return;
  }

  const legacyArticle = getRelatedArticleUrl(place);
  if (legacyArticle) {
    els.relatedArticlesSection.hidden = false;
    const link = document.createElement("a");
    link.href = legacyArticle;
    link.className = "place-related-articles__item";

    const title = document.createElement("span");
    title.className = "place-related-articles__title";
    title.textContent = "Read related article";

      const meta = document.createElement("span");
      meta.className = "place-related-articles__meta";
      meta.textContent = "Related story";

      link.append(title, meta);
      els.relatedArticles.appendChild(link);
    return;
  }
  els.relatedArticlesSection.hidden = true;
}

function renderSourceReference(place) {
  if (!els.sourceReference) return;
  const sourceReference = cleanText(place.sourceReference);
  if (sourceReference) {
    els.sourceReference.textContent = sourceReference;
    els.sourceReference.classList.remove("place-empty-value");
    return;
  }

  els.sourceReference.textContent = "No source reference recorded yet.";
  els.sourceReference.classList.add("place-empty-value");
}

function getContributionSortTime(contribution) {
  const dateValue = contribution?.reviewedAt || contribution?.updatedAt || contribution?.createdAt;
  if (typeof dateValue?.toMillis === "function") return dateValue.toMillis();
  if (typeof dateValue?.toDate === "function") return dateValue.toDate().getTime();
  const parsed = Date.parse(cleanText(dateValue));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRightsStatus(status) {
  return cleanText(status)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderContributionImage(contribution, card) {
  const imageUrl = toSafeUrl(contribution.imageUrl);
  if (!imageUrl) return;

  const figure = document.createElement("figure");
  figure.className = "place-contribution-card__figure";

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = cleanText(contribution.imageCaption) || "Community contribution photo";
  figure.appendChild(image);

  const captionParts = [
    cleanText(contribution.imageCaption),
    cleanText(contribution.imageCredit),
    formatRightsStatus(contribution.imageRightsStatus)
  ].filter(Boolean);

  if (captionParts.length > 0) {
    const caption = document.createElement("figcaption");
    caption.textContent = captionParts.join(" | ");
    figure.appendChild(caption);
  }

  card.appendChild(figure);
}

function renderApprovedPlaceContributions(contributions) {
  if (!els.contributionsList || !els.contributionsEmpty) return;
  els.contributionsList.textContent = "";

  const publicContributions = contributions
    .map((contribution) => buildPublicPlaceContributionPayload(contribution))
    .filter(Boolean)
    .sort((a, b) => getContributionSortTime(b) - getContributionSortTime(a));

  els.contributionsEmpty.hidden = publicContributions.length > 0;

  publicContributions.forEach((contribution) => {
    const card = document.createElement("article");
    card.className = "place-contribution-card";

    const text = cleanText(contribution.contributionText);
    if (text) {
      const paragraph = document.createElement("p");
      paragraph.className = "place-contribution-card__text";
      paragraph.textContent = text;
      card.appendChild(paragraph);
    }

    renderContributionImage(contribution, card);

    const dateText = formatRecordDate(contribution.reviewedAt || contribution.updatedAt || contribution.createdAt);
    if (dateText) {
      const meta = document.createElement("p");
      meta.className = "place-contribution-card__meta";
      meta.textContent = `Approved contribution | ${dateText}`;
      card.appendChild(meta);
    }

    els.contributionsList.appendChild(card);
  });
}

async function loadApprovedPlaceContributions(placeId) {
  if (!els.contributionsList || !els.contributionsEmpty) return;
  els.contributionsList.textContent = "";
  els.contributionsEmpty.hidden = false;
  els.contributionsEmpty.textContent = "Loading approved community comments and photos...";

  try {
    const contributionsQuery = query(
      collection(db, "placeContributions"),
      where("placeId", "==", placeId),
      where("contributionStatus", "==", "approved")
    );
    const snapshot = await getDocs(contributionsQuery);
    renderApprovedPlaceContributions(snapshot.docs.map((contributionDoc) => ({
      id: contributionDoc.id,
      ...contributionDoc.data()
    })));
    if (!els.contributionsEmpty.hidden) {
      els.contributionsEmpty.textContent = "No approved community comments or photos have been added yet.";
    }
  } catch (err) {
    console.error("Failed to load approved place contributions:", err);
    els.contributionsEmpty.hidden = false;
    els.contributionsEmpty.textContent = "Could not load community comments and photos. Please try again later.";
  }
}

function renderLocation(place) {
  if (!els.locationContent) return;
  els.locationContent.textContent = "";

  if (!hasValidCoordinates(place)) {
    const message = document.createElement("p");
    message.className = "place-location__message";
    message.textContent = "Location coordinates are not available yet.";

    const fallbackLink = document.createElement("a");
    fallbackLink.className = "place-location__button";
    fallbackLink.href = buildMapUrl(place);
    fallbackLink.textContent = "Search on full map";

    els.locationContent.append(message, fallbackLink);
    return;
  }

  const mapEl = document.createElement("div");
  mapEl.id = "placeLocationMap";
  mapEl.className = "place-location__map";

  const coords = document.createElement("p");
  coords.className = "place-location__coords";
  coords.textContent = `Coordinates: ${getCoordinateDisplay(place)}`;

  const mapLink = document.createElement("a");
  mapLink.className = "place-location__button";
  mapLink.href = buildMapUrl(place);
  mapLink.textContent = "View on full map";

  els.locationContent.append(mapEl, coords, mapLink);

  if (!window.L) {
    mapEl.textContent = "Map library could not be loaded.";
    return;
  }

  if (placeMap) {
    placeMap.remove();
    placeMap = null;
  }

  placeMap = L.map(mapEl).setView([place.lat, place.lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(placeMap);
  L.marker([place.lat, place.lng]).addTo(placeMap)
    .bindPopup(cleanText(place.title) || "Community place");
}

function injectJsonLd(place) {
  const generatedJsonLd = buildPlaceJsonLd(place, window.location.href);
  const jsonld = hasUsableJsonLd(place.jsonld)
    ? { ...generatedJsonLd, ...place.jsonld }
    : generatedJsonLd;
  let script = document.getElementById("place-jsonld");
  if (!script) {
    script = document.createElement("script");
    script.id = "place-jsonld";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonld, null, 2);
}

function renderPlace(place) {
  const summary = buildPublicPlaceSummary(place);
  const title = getDisplayTitle(place);
  const category = summary.category;
  const publicDescription = getPublicDescription(place);
  document.title = `${title} | Alex's Photo Board`;
  if (els.title) els.title.textContent = title;
  if (els.breadcrumbTitle) els.breadcrumbTitle.textContent = title;
  if (els.description) els.description.textContent = publicDescription;

  if (els.metadata) {
    els.metadata.textContent = "";
    appendMetadata("Category", category);
    appendMetadata("Asset type", getAssetType(place), "No asset type recorded yet.");
    appendMetadata("Location / Address", formatPlaceLocationAddress(place), "No location/address recorded yet.");
    appendMetadata("Coordinates", summary.coordinates, "Location coordinates are not available yet.");
    appendMetadata("Associated type", place.associatedType, "No associated type recorded yet.", { hideIfEmpty: true });
    appendMetadata("Period", place.period, "No period recorded yet.", { hideIfEmpty: true });
    appendMetadata("Grade", place.grade, "No grade or classification recorded yet.", { hideIfEmpty: true });
  }

  renderImage(place);
  renderImageCredit(place);
  renderTags(place);
  renderActions(place);
  renderLocalHeritageRecord(place);
  renderSourceReference(place);
  renderRelatedArticles(place);
  renderLocation(place);
  injectJsonLd(place);
  setActiveSection(getSectionFromUrl(), { skipHistory: true });

  if (els.status) els.status.textContent = "";
  if (els.content) els.content.hidden = false;
}

async function loadPlace() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    if (els.status) els.status.textContent = "No community place record was requested.";
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, "communityPlaces", id));
    if (!snapshot.exists()) {
      if (els.status) els.status.textContent = "Community place record not found.";
      return;
    }
    const data = snapshot.data();
    renderPlace({
      id: snapshot.id,
      ...data,
      lat: normalizeCoordinate(data.lat),
      lng: normalizeCoordinate(data.lng)
    });
    await loadApprovedPlaceContributions(snapshot.id);
  } catch (err) {
    console.error("Failed to load community place:", err);
    if (els.status) els.status.textContent = "Could not load this community place record. Please try again later.";
  }
}

setupTabs();
loadPlace();
