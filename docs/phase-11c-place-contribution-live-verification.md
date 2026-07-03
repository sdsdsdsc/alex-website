# Phase 11C Place Contribution Live Verification

Date: 2026-07-03 UTC

## Scope

This record summarizes live verification for draft PR #35, `Phase 11C: signed-in place contribution workflow`, on the existing Firebase Hosting preview channel.

Preview URL:

- `https://alexs-community-efcd8--phase11c-place-contribution-wor-hotx6ij7.web.app`

Project:

- `alexs-community-efcd8`

## Rules Deploy Result

Firestore rules were deployed only after explicit approval.

Command:

```bash
npx firebase deploy --only firestore:rules --project alexs-community-efcd8
```

Result:

- `firestore.rules` compiled successfully.
- Rules were released to `cloud.firestore`.
- No Hosting deploy was included in the rules deploy step.

## Public Submission Result

Signed-in public contribution submission was tested on:

- `place.html?id=jiangxi-test-community-square&section=comments-photos#comments-photos-panel`

Two temporary submitted contributions were created through the public place page form:

- `Codex PR35 live approve test 2026-07-03T02-09-41-772Z`
- `Codex PR35 live reject test 2026-07-03T02-09-41-772Z`

Both submissions returned the expected success message:

- `Thank you. Your contribution has been submitted for review and will not appear publicly until it is approved.`

Before review, both submitted markers were absent from the public place page.

## Admin Read Queue Result

The admin review page was reached manually after adding the temporary fallback admin sign-in page:

- `admin-login-basic.html?next=/manage-place-contributions.html`

The manually signed-in admin session showed two submitted place contributions in `manage-place-contributions.html`.

The two submitted test documents were also verified through authenticated Firestore REST before review:

- `TO5sKsjK3JDo6P2hDXZv`, status `submitted`
- `uxk5GRAT7q9rrJFPuB3p`, status `submitted`

## Approve And Reject Result

The approve and reject state transitions were applied through authenticated Firestore REST because the browser-controlled deployed preview session redirected back to `admin-login.html` and could not stay authenticated for automated admin UI button clicks.

Applied review outcomes:

- Approved: `TO5sKsjK3JDo6P2hDXZv`
- Rejected: `uxk5GRAT7q9rrJFPuB3p`
- Review timestamp: `2026-07-03T02:30:17.031Z`

Public place page verification after review:

- The approved contribution appeared publicly.
- The rejected contribution stayed hidden publicly.
- The public contribution count showed `1 approved community contribution`.
- Private submitter and moderation fields did not display publicly.
- The private reject note did not display publicly.

Private terms checked as absent from public page text:

- `submitterEmail`
- `submitterDisplayName`
- `submittedByUid`
- `reviewedByUid`
- `adminNotes`
- `reviewHistory`
- `Codex PR35 live reject verification`

## Admin UI Button Click Caveat

Actual clicking of `Approve contribution` and `Reject contribution` inside `manage-place-contributions.html` remains the only manual caveat.

Final automated browser check for this slice opened:

- `manage-place-contributions.html`

Result:

- The deployed preview redirected to `admin-login.html?next=%2Fmanage-place-contributions.html`.
- No fresh test documents were created for UI-button testing after that redirect.
- No code changes were made for this caveat.

## Cleanup Result

Both temporary Firestore test documents were deleted after verification:

- `TO5sKsjK3JDo6P2hDXZv`
- `uxk5GRAT7q9rrJFPuB3p`

Cleanup was confirmed in two ways:

- Authenticated Firestore REST query found no remaining `Codex PR35 live` marked test documents for `jiangxi-test-community-square`.
- Reloaded public `place.html` showed neither test marker and returned to `No approved community contributions yet`.

## Conclusion

Phase 11C live verification mostly passed.

Verified successfully:

- Firestore rules deploy
- signed-in public submission
- submitted contributions hidden before approval
- admin-readable submitted records
- approved contribution public visibility
- rejected contribution public invisibility
- public stripping of private submitter and moderation fields
- cleanup of temporary test documents

Remaining caveat:

- Admin review page button clicks were not automated in the deployed preview because the browser-controlled session could not remain authenticated on the preview origin.
