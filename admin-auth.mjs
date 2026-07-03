export function getSafeNextPath(next, currentHref, fallbackPath = "admin.html") {
  const candidate = String(next || "").trim();
  if (!candidate) return fallbackPath;

  try {
    const target = new URL(candidate, currentHref);
    const current = new URL(currentHref);
    if (target.origin === current.origin) {
      return `${target.pathname}${target.search}${target.hash}`;
    }
  } catch (error) {
    // Invalid next values fall through to the safe fallback.
  }

  return fallbackPath;
}

export function isConfiguredAdmin(user, adminUid) {
  return Boolean(user?.uid) && user.uid === adminUid;
}
