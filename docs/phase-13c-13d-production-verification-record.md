# Phase 13C/13D Production Verification Record

## Scope

Phase 13C added admin-controlled promotion of an approved community contribution image into the public `communityPlaces` main image fields.

Phase 13D added signed-in public replies to approved place contributions, with admin approval/rejection and public rendering of approved replies under the correct contribution.

This record documents the final production verification after PR #39 was merged.

## Merge Reference

- PR: #39, Phase 13C/13D: image promotion and replies
- Base branch: `main`
- Merge commit: `4c6a067e7794d1c7b6ad117a38bf48df6d1b1199`
- Production target: GitHub Pages site for `sdsdsdsc/alex-website`

## CI And Deployment Results

- GitHub Pages deployment completed successfully for merge commit `4c6a067e7794d1c7b6ad117a38bf48df6d1b1199`.
- Alex Photo Board Verification completed successfully on `main`.
- Production freshness checks confirmed the deployed `place.html` loaded:
  - `place.js?v=2026-07-11-13d-public-reply-query`
  - `style.css?v=2026-07-11-13c-13d-image-promotion-replies`
- No stale Phase 13B cache-busting references were served by production.

## Firestore Rules Deployment Context

Firestore rules had already been deployed to project `alexs-community-efcd8` before the production smoke test.

Verification covered the production rules behavior for:

- public reads of approved, public-safe `placeContributions`
- public reads of approved, `publicSafe: true` `placeContributionReplies`
- denial of submitted and rejected replies from public rendering
- admin approval/rejection lifecycle for replies
- admin promotion updates to the public image/promotion fields on `communityPlaces`
- preservation of private contribution, upload, and moderation fields from public output

No Firebase Hosting, Firestore rules, or Storage rules deploy was run during this verification record follow-up.

## Production URLs Checked

- Production home: `https://sdsdsdsc.github.io/alex-website/`
- Public place page: `https://sdsdsdsc.github.io/alex-website/place.html?id=jiangxi-test-community-square&section=comments-photos#comments-photos-panel`
- Public sign-in page: `https://sdsdsdsc.github.io/alex-website/public-auth.html`
- Admin contribution review page: `https://sdsdsdsc.github.io/alex-website/manage-place-contributions.html`

## Production Smoke Workflow

The production smoke test used the safe test place:

- `communityPlaces/jiangxi-test-community-square`

The test created temporary production data only, then removed it.

Workflow covered:

1. Create a text contribution as a signed-in public user.
2. Approve the contribution as admin.
3. Confirm the contribution appears publicly in Comments and Photos.
4. Submit a reply as the signed-in public user.
5. Confirm the submitted reply remains hidden before moderation.
6. Approve the reply as admin.
7. Confirm the approved reply appears under the correct contribution.
8. Submit a second reply as the signed-in public user.
9. Reject the second reply as admin.
10. Confirm the rejected reply remains hidden publicly.
11. Create an image contribution using a safe HTTPS image URL, not Storage.
12. Approve the image contribution as admin.
13. Promote the approved image contribution as the main place image.
14. Confirm the public main image changes.
15. Confirm the approved image contribution remains visible in Comments and Photos.
16. Confirm private upload and moderation fields do not appear publicly.
17. Restore the original `communityPlaces` image and promotion fields exactly.
18. Delete all temporary replies and contributions.
19. Reopen the public place page signed out and confirm no temporary content or Firebase permission errors remain.

## Non-Admin User Verification

Production smoke testing used a verified non-admin test account.

The account was confirmed not to match the configured admin account, which validated the non-admin submission and reply paths without storing personal identifiers in this permanent verification record.

## Phase 13D Results

Temporary text contribution:

- `placeContributions/1sZNuLMST8cFqpCK2NVl`

Temporary replies:

- Approved reply: `placeContributionReplies/8sqFx6zUFvYuUSdKl0Dr`
- Rejected reply: `placeContributionReplies/FKu7RuUa2G6IzqDUVarR`

Results:

- public user could submit a contribution
- admin approval converted the contribution into a public-safe approved document
- signed-out public page rendered the approved contribution
- public user could submit replies under the approved contribution
- submitted replies stayed hidden before moderation
- admin approval rewrote the approved reply to the public-safe shape
- approved reply rendered under the correct contribution
- rejected reply remained hidden publicly
- public output did not expose private UID, display-name, rejection, approval, or admin-note fields

The approved reply public shape included only:

- `placeId`
- `contributionId`
- `replyText`
- `replyStatus: "approved"`
- `publicSafe: true`
- `submittedAt`
- `approvedAt`

## Phase 13C Results

Temporary image contribution:

- `placeContributions/AxQ6rv1WswXCGslJdUCk`

Image source:

- `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Example.jpg/640px-Example.jpg`

Results:

- public user could submit an HTTPS image contribution without Storage
- admin approval converted it into a public-safe approved contribution
- admin promotion updated the main public place image fields
- public place page showed the promoted main image
- approved image contribution remained visible in Comments and Photos
- no private upload or moderation fields appeared publicly

## Image-State Restoration

Original `communityPlaces/jiangxi-test-community-square` image and promotion state before promotion:

- `imageUrl`: absent
- `imageCaption`: absent
- `imageCredit`: absent
- `imageRightsStatus`: absent
- `promotedContributionId`: absent
- `promotedContributionImageUrl`: absent
- `promotedContributionImageCaption`: absent
- `promotedContributionImageCredit`: absent
- `promotedContributionImageRightsStatus`: absent
- `promotedContributionImageAt`: absent
- `updatedAt`: `2026-06-12T01:58:12.219Z`

After promotion verification, all image and promotion fields were removed again and `updatedAt` was restored to:

- `2026-06-12T01:58:12.219Z`

Final read confirmed the original image and promotion state was restored exactly.

## Temporary Data Cleanup

Deleted temporary Firestore documents:

- `placeContributionReplies/8sqFx6zUFvYuUSdKl0Dr`
- `placeContributionReplies/FKu7RuUa2G6IzqDUVarR`
- `placeContributions/1sZNuLMST8cFqpCK2NVl`
- `placeContributions/AxQ6rv1WswXCGslJdUCk`

Final admin cleanup queries returned zero matching temporary contribution or reply documents.

Final signed-out production page check confirmed:

- no temporary Phase 13C/13D content remained
- Comments and Photos loaded normally
- no Firebase permission errors appeared
- no promoted example image remained

## Storage Cleanup

No temporary Storage object was created.

The Phase 13C production image test used a public HTTPS image URL only, so no Storage cleanup was required.

## Public And Private Field Safety

Public checks confirmed:

- approved contributions rendered publicly only after admin approval
- submitted replies were not publicly visible
- rejected replies were not publicly visible
- approved replies required `publicSafe: true`
- private contribution fields did not appear publicly
- private upload metadata did not appear publicly
- private reply moderation fields did not appear publicly
- admin-only notes and UIDs did not appear publicly

## Known Non-Blocking Issue

The browser console still reports the known CSP warning:

> The Content Security Policy directive `frame-ancestors` is ignored when delivered via a `<meta>` element.

This warning did not block Phase 13C/13D behavior, but it should be cleaned up in a later hardening phase by moving the relevant CSP directive into HTTP headers where supported.

## Rollback Notes

If Phase 13C image promotion needs to be rolled back for an individual place, restore the previous `communityPlaces` image fields and remove the promotion fields:

- `imageUrl`
- `imageCaption`
- `imageCredit`
- `imageRightsStatus`
- `promotedContributionId`
- `promotedContributionImageUrl`
- `promotedContributionImageCaption`
- `promotedContributionImageCredit`
- `promotedContributionImageRightsStatus`
- `promotedContributionImageAt`

If Phase 13D reply rendering needs to be restricted, the public read path depends on approved replies retaining the strict public-safe shape and `publicSafe: true`. Submitted and rejected replies should remain hidden.

## Final Production Verdict

Phase 13C and Phase 13D are functionally verified in production for the current project stage.

## Recommended Next Phase

Phase 14: post-release hardening and moderation operations, including CSP header cleanup, cache-header hardening, admin pagination/filtering, and stronger authenticated browser automation.
