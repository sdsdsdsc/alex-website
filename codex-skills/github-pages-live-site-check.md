# GitHub Pages Live Site Check

Use this workflow when local changes do not appear on the GitHub Pages live site.

## Checks

1. Run `git status --short`.
2. Confirm the changed files were actually committed if the live site depends on committed history.
3. Confirm the changed files were actually pushed.
4. Confirm the correct branch is being used.
5. Confirm the GitHub Pages source branch and folder.
6. Hard refresh the browser.
7. Retest in an incognito/private window.
8. Consider stale JavaScript cache.
9. Compare GitHub file content against live behavior.
10. If testing JavaScript, confirm the live script contains the new debug line or version marker.
11. Do not keep retesting the live site before confirming deployment state.

## Alex's Photo Board Notes

- Watch for `?v=...` cache-busting markers on script imports.
- If a debug log is expected, verify the live console shows the exact new log string before assuming backend failure.
- Treat local repo state and live Pages state as separate systems until proven otherwise.
