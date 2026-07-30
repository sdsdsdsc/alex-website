# Phase 17B Firebase Hosting Preview Manual Verification

## Scope

This document records the first successful manual Firebase Hosting preview verification for Alex's Photo Board after the minimal preview setup and Hosting ignore fix were merged.

This is a documentation-only verification record.

It does not:

- change Firestore rules
- change Firebase app config
- change HTML, CSS, or JavaScript behavior
- change public pages
- add GitHub Actions deployment

## Preview Deployment Summary

Manual preview command used:

```bash
npx firebase hosting:channel:deploy phase17b-preview --project alexs-community-efcd8 --expires 7d
```

Preview URL:

- `https://alexs-community-efcd8--phase17b-preview-li4qrl7e.web.app`

Preview expiry:

- `2026-07-07 02:33:59`

Project:

- `alexs-community-efcd8`

## First Attempt Failure

The first manual preview attempt created the preview channel successfully but failed during local file scanning and upload.

Observed issue:

- Firebase scanned `.git/fsmonitor--daemon.ipc`
- deploy failed before upload could complete

Diagnosis:

- the initial Hosting config was too broad because `public` was `.`
- Git internal files were still inside the Hosting scan path

Follow-up fix:

- PR #31 updated Firebase Hosting ignore rules
- `.git` and `.git/**` were excluded
- local Firebase debug logs were excluded

## Retry Result

After the Hosting ignore fix, the retry succeeded.

Recorded outcome:

- Firebase found `55` files
- upload completed
- version finalized
- release completed

This confirms that the minimal preview setup is usable for manual branch preview deployment.

## Manual Verification Checks

The following checks were completed successfully on the preview URL:

- home page loads
- `search.html` loads
- `place.html?id=phase-11c-image-promotion-live-test-20260630024821` loads
- promoted image and source or credit appear on the place page
- `public-auth.html` loads
- `my-nominations.html` loads and reads nomination history
- Firebase-backed reads work on the preview URL
- GitHub Pages production remains unchanged

## Production Separation Check

Production GitHub Pages remained unchanged during preview verification.

Production site:

- `https://sdsdsdsc.github.io/alex-website/`

Verification conclusion:

- the manual Firebase Hosting preview deployment did not replace or disturb the current GitHub Pages production path

## Safety Notes

This successful preview verification does not create backend isolation by itself.

Important reminder:

- the preview frontend can still use the same Firebase Auth and Firestore backend assumptions
- preview should not be treated as a true sandbox for write-capable features without deliberate test discipline

This is especially important before implementing:

- registered-user place contributions
- user-generated content moderation
- future image upload

## Local Generated Files

The manual preview workflow can generate local troubleshooting or cache files such as:

- `.firebase/hosting.cache`
- `firebase-debug.log`

These are local generated files and should not be committed.

## Conclusion

Phase 17B manual Firebase Hosting preview verification passed.

The project now has a proven manual preview path for risky Firebase-connected branch work, while GitHub Pages remains the unchanged public production site.
