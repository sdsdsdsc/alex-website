# Alex's Photo Board Codex Project Guide

## Project

- Project name: Alex's Photo Board
- Active branch: `codex/structure-replanning`

## Core Operating Rule

Verify the actual active system before editing.

That means checking the currently loaded HTML/JS path, the current Firebase project, the real payload shape, the deployed Firestore rules, and whether the issue is local-only or live-only before making code changes.

## Project Preferences

- Make the smallest possible fix that explains the observed problem.
- Do not randomly loosen Firestore rules.
- Do not rewrite working sections without a clear reason.
- Do not create extra Markdown files unless requested.
- Preserve JSON-LD and open-data privacy.
- Do not remove temporary debug logs before one successful live test.
- Keep public export separate from private nomination and admin data.
- Prefer source verification before browser speculation.
- Treat deployed Firebase state and repo state as potentially different until proven otherwise.

## Skill Activation Map

- If an error says `FirebaseError: Missing or insufficient permissions`, activate [`codex-skills/firestore-permission-debugging.md`](./codex-skills/firestore-permission-debugging.md).
- If local changes do not appear on the live site, activate [`codex-skills/github-pages-live-site-check.md`](./codex-skills/github-pages-live-site-check.md).
- If Firebase Console rules and repo rules may differ, activate [`codex-skills/firebase-rules-repo-sync.md`](./codex-skills/firebase-rules-repo-sync.md).
- If work touches form fields, payload fields, Firestore fields, admin display, or export fields, activate [`codex-skills/form-field-compatibility.md`](./codex-skills/form-field-compatibility.md).
- If work touches `heritage.json`, `export.js`, JSON-LD, public pages, or open data, activate [`codex-skills/public-export-privacy-check.md`](./codex-skills/public-export-privacy-check.md).
- If work touches nomination review or promotion, activate [`codex-skills/admin-review-promotion-workflow.md`](./codex-skills/admin-review-promotion-workflow.md).
- If work touches evidence URL, image credit, evidence rights, permission, or evidence visibility, activate [`codex-skills/evidence-rights-workflow.md`](./codex-skills/evidence-rights-workflow.md).
- Before finalizing any change, activate [`codex-skills/minimal-fix-regression-check.md`](./codex-skills/minimal-fix-regression-check.md).

## Usage Order

When a task spans multiple concerns, use skills in this general order:

1. Identify the live/local mismatch or permission failure.
2. Confirm rules, payload, and field compatibility.
3. Check privacy and promotion/export boundaries.
4. Run the minimal-fix regression check before finishing.

## Local Project Reminders

- Public nomination writes go to `placeNominations`, not `communityPlaces`.
- `placeNominations` is owner/admin only, not public export data.
- `heritage.json` must remain public-safe.
- Evidence URL metadata is review material unless a later intentional workflow promotes public-safe data.
- GitHub Pages behavior may lag behind local repo edits until the correct branch content is actually live.
