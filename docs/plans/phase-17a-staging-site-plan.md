# Phase 17A Staging Site Plan

This is a planning document for a future staging site for Alex's Photo Board. It does not change the current public website, GitHub Pages settings, Firebase config, Firestore rules, tests, or app behavior.

## Why We Need Staging

A staging site would give us a place to test risky changes before touching the public live site.

This matters most for work that can affect:

- Firestore rules
- nomination submission
- admin review
- login and authentication
- evidence URL fields
- map submission
- export behavior

## Current Live Setup

- `main` is the stable live website branch.
- GitHub Pages currently publishes the public website from `main`.
- Do not change the current live deployment in this PR.

## Recommended Staging Approach

Stage 1: create a separate GitHub staging repo later, such as `alex-website-staging`.

This would let risky HTML, CSS, JavaScript, and deployment-path changes be viewed on a separate GitHub Pages site before they reach the public live site.

Stage 2: later, consider a separate Firebase staging project if database isolation becomes necessary.

This would give staging its own Firebase config, Firestore database, auth setup, and rules deployment path.

## Important Warning

A staging website that points to the same Firebase project is not fully isolated.

It can still affect real Firestore data unless the rules, collections, or Firebase config are separated. Treat any staging site connected to the live Firebase project as a live-data test surface, not a true sandbox.

## Future Workflow

1. Create a feature branch or Codex branch.
2. Open one draft PR for the bug or feature.
3. Add follow-up commits to the same draft PR while diagnosing and fixing.
4. Test on staging when the change is risky.
5. Merge to `main` only after staging verification.
6. Delete the branch after merge.

## Non-Goals For This PR

- Do not create the staging repo.
- Do not change GitHub Pages settings.
- Do not change Firebase config.
- Do not change Firestore rules.
- Do not change app code.
- Do not change tests.
- Do not change HTML, CSS, or JavaScript behavior.
