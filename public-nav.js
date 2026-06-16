const PUBLIC_NAV_LINKS = [
  ["index.html", "Home"],
  ["news.html", "News"],
  ["history.html", "History"],
  ["get-involved.html", "Get involved"],
  ["criteria.html", "Criteria"],
  ["guidance.html", "Guidance"],
  ["map.html", "Map"],
  ["search.html", "Places"],
  ["export.html", "Open Data"]
];

function getCurrentPageName() {
  const pageName = window.location.pathname.split("/").pop();
  return pageName || "index.html";
}

function renderPublicNav() {
  const mount = document.getElementById("public-nav");
  if (!mount) return;

  const currentPage = getCurrentPageName();
  const nav = document.createElement("nav");
  nav.className = "menu-bar";
  nav.setAttribute("aria-label", "Main navigation");

  PUBLIC_NAV_LINKS.forEach(([href, label]) => {
    const link = document.createElement("a");
    link.href = href;
    link.className = href === currentPage ? "nav-link active" : "nav-link";
    if (href === currentPage) link.setAttribute("aria-current", "page");
    link.textContent = label;
    nav.appendChild(link);
  });

  mount.replaceChildren(nav);
}

renderPublicNav();
