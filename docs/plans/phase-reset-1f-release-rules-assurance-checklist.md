# Phase Reset 1F Release and Rules Assurance Checklist

## 1. Purpose

This checklist prepares the owner to manually verify release-sensitive and rules-sensitive behavior before returning to Phase 13C or adding any new media metadata fields.

This phase does not:

- change Firestore rules;
- deploy Firestore rules;
- change app behavior;
- change HTML, JS, CSS, Firebase config, forms, export behavior, or tests;
- touch live Firebase data or Firebase Storage.

This phase only creates an owner-facing manual checklist.

## 2. Current Project Baseline

Current baseline:

- Phase 12 is functionally verified for the current project stage.
- Phase 13A is complete.
- Phase 13B is complete.
- Phase 13C remains paused.
- Reset documentation cleanup has been completed.
- The docs index has been refreshed.
- Retired and legacy page cleanup has been planned and lightly verified.
- Drupal/Pantheon remains active-but-legacy.
- Firestore rules sync planning has been completed, but deployed rules still need owner verification.

Current practical position:

- the public account, nomination, `My nominations`, admin review/promotion, and public export model are implemented in source;
- the local `firestore.rules` file describes the intended access model, but is still a review draft rather than proof of deployment;
- release confidence now depends on manual owner verification across browser behavior, rules behavior, export privacy, and navigation consistency.

## 3. What Must Be Verified Before Phase 13C

Before adding any new fields or resuming rules-aware feature work, the owner should have confidence in all of the following:

- the intent of the local `firestore.rules` file;
- the currently deployed Firebase Console rules;
- public sign-in behavior;
- public nomination submission;
- `My nominations` owner-scoped behavior;
- admin review and promotion behavior;
- public export privacy behavior;
- private admin export behavior;
- no accidental exposure of `placeNominations`;
- no accidental export of submitter, admin, or other private fields;
- no broken public navigation after the reset cleanup.

## 4. Manual Browser Test Accounts

Use four test states:

- `Signed-out browser session`
- `Public Account A`
- `Public Account B`
- `Admin account`

Testing notes:

- Do not record real passwords in this document.
- Use clean or separate browser sessions for Account A and Account B.
- If possible, use a separate browser profile, private window, or second browser for Account B.
- Use dedicated test nominations where practical, not important live records.
- If admin promotion is tested, record the nomination ID and the resulting `communityPlaces` record ID in private test notes outside the repo.

## 5. Signed-Out Public Checklist

- [ ] `index.html` opens.
- [ ] `news.html` opens.
- [ ] `history.html` opens.
- [ ] `search.html` opens.
- [ ] `map.html` opens.
- [ ] A known `place.html?id=<known-place-id>` record opens.
- [ ] `get-involved.html` opens.
- [ ] `criteria.html` opens.
- [ ] `guidance.html` opens.
- [ ] `export.html` opens.
- [ ] `public-auth.html` opens.
- [ ] `my-nominations.html` redirects to sign-in or shows a sign-in-required state.
- [ ] `nominate-place.html` does not allow submission while signed out.
- [ ] A signed-out public user cannot access `placeNominations` directly.
- [ ] A signed-out public user cannot write `communityPlaces`.

## 6. Public Account A Checklist

- [ ] Sign-in works.
- [ ] The nomination form opens after sign-in.
- [ ] Account A can submit a test nomination.
- [ ] The submitted nomination stores ownership metadata:
- [ ] `submittedByUid`
- [ ] `submitterEmail`
- [ ] optional `submitterDisplayName`
- [ ] `submissionAuthType: "signedIn"`
- [ ] `My nominations` shows Account A's own nomination.
- [ ] Account A cannot see Account B's nomination.
- [ ] Account A cannot write `communityPlaces`.
- [ ] Account A cannot edit admin review fields.

## 7. Public Account B Checklist

- [ ] Sign-in works in a separate or clean browser session.
- [ ] `My nominations` does not show Account A's nomination.
- [ ] Account B can submit its own nomination if needed.
- [ ] Account B sees only Account B's own nominations.
- [ ] Account B cannot write `communityPlaces`.
- [ ] Account B cannot edit admin review fields.

## 8. Admin Checklist

- [ ] Admin sign-in works.
- [ ] The admin dashboard opens.
- [ ] `manage-nominations.html` opens.
- [ ] Admin can read `placeNominations`.
- [ ] Admin can save review status, review notes, and admin assessment fields.
- [ ] Admin can promote an approved nomination.
- [ ] Promotion creates or updates the expected `communityPlaces` record.
- [ ] The promoted record opens on `place.html`.
- [ ] `map.html` and `search.html` can find the promoted place where expected.
- [ ] `manage-community-places.html` works.
- [ ] `manage-articles.html` works.
- [ ] The `upload-article.html` workflow still opens.
- [ ] `admin-export.html` downloads a private backup if expected.

## 9. Public Export Privacy Checklist

Check `export.html`, `export.js`, and the downloaded `heritage.json` output.

- [ ] Public export reads only `communityPlaces`, `news`, and `history`.
- [ ] `placeNominations` is not included.
- [ ] `submittedByUid` is not included.
- [ ] `submitterEmail` is not included.
- [ ] `submitterDisplayName` is not included.
- [ ] `submissionAuthType` is not included.
- [ ] `adminNotes` is not included.
- [ ] `reviewHistory` is not included.
- [ ] `nominatorEmail` is not included.
- [ ] Nomination-private evidence or admin-only fields are not included.
- [ ] Public relationship links point only to `communityPlaces`, `news`, or `history`.
- [ ] No retired `mapPoints`, `mapPolygons`, or old `posts` data is exported.

## 10. Navigation and Route Checklist

- [ ] `public-nav.js` shows only public pages.
- [ ] No admin page appears in the public nav.
- [ ] The `Places` label opens `search.html`.
- [ ] The `Open Data` label opens `export.html`.
- [ ] `map.html` visible labels use `Map`, `Places`, and `Open Data` where applicable.
- [ ] `article.html` works as a destination page.
- [ ] `place.html` works as a destination page.
- [ ] No current `gallery.html` route is expected.
- [ ] No current `upload.html` route is expected.
- [ ] The Drupal/Pantheon article route remains intentionally supported for now.

## 11. Drupal/Pantheon Legacy Check

- [ ] Firebase-backed `news` and `history` content still load.
- [ ] Drupal-backed news cards still load if Pantheon is available.
- [ ] `article.html?type=drupal` still works if Pantheon is available.
- [ ] If Pantheon is unavailable, Firebase-backed content still works or at least does not collapse with it.
- [ ] Drupal/Pantheon is still treated as an active-but-legacy dependency with a later keep/isolate/retire decision still pending.

## 12. Rules Alignment Check

Use this section together with the local `firestore.rules` file, Firebase Console rules, and the separate rules verification docs.

- [ ] The local `firestore.rules` intent is understood before any release or Phase 13C work.
- [ ] The configured admin UID still matches the intended admin account.
- [ ] The deployed Firebase Console rules are checked deliberately rather than assumed.
- [ ] Signed-out nomination create is denied.
- [ ] Signed-in nomination create for the current user is allowed.
- [ ] A signed-in public user cannot create a nomination for another UID.
- [ ] Owner-scoped nomination reads work for the current signed-in owner.
- [ ] Other-user nomination reads fail.
- [ ] Public broad list access to all `placeNominations` is not available.
- [ ] Public writes to `communityPlaces` fail.
- [ ] Admin review and promotion remain allowed for the intended admin account.

## 13. Suggested Evidence Notes

Record the following privately during the owner verification run:

- verification date;
- branch and commit under review;
- Firebase project name;
- whether testing used deployed rules, emulator review, or both;
- test account labels used;
- nomination IDs created during testing;
- promoted `communityPlaces` record ID if promotion was tested;
- screenshots or short notes for any failure, permission mismatch, or privacy concern.

## 14. Go / No-Go Reminder

Return to Phase 13C or add new media metadata fields only after the owner is satisfied that:

- rules intent and deployed rules are aligned;
- nomination privacy still works;
- admin review and promotion still work;
- public export remains private-safe;
- reset navigation remains coherent;
- Drupal/Pantheon legacy behavior is understood well enough not to cause accidental regression during later work.

If any of those checks fail, stop Phase 13C work first and resolve the release or rules-assurance issue before adding new fields.
