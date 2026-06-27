# Phase 16E Nomination Rule Simplification Record

## Live symptom

Normal live evidence-URL nomination submission still fails with `FirebaseError: Missing or insufficient permissions`, even after the frontend payload hardening and evidence URL rule alignment were merged and published.

## Debug evidence

Live debug mode showed the real evidence-URL payload is clean:

- `missingRequiredFields: []`
- `forbiddenExtraFields: []`
- `undefinedFields: []`
- `evidenceImageUrl` is a string.
- `evidenceRightsStatus` is `public-web-reference`.
- `evidencePermissionConfirmed` is `true`.
- `evidenceVisibility` is `nomination-private`.
- `submittedByUid` is present.

Local emulator tests and exact-payload diagnostics also showed the payload should pass the repo rules.

## Rule simplification

The nomination create rule removes the fragile `request.auth.token.email` equality block. UID ownership remains the security boundary through:

```text
request.resource.data.submittedByUid == request.auth.uid
```

The evidence URL predicate is also simplified from optional string plus an HTTPS regex to:

```text
isOptionalString('evidenceImageUrl', 1000)
```

The site stores the URL only for admin review and does not fetch or upload the image. Evidence interpretation is still controlled by rights status, permission confirmation, and private visibility fields.

## Security boundaries preserved

- Signed-in auth is still required.
- `submittedByUid` must match `request.auth.uid`.
- `submitterEmail` and `nominatorEmail` must be valid email strings.
- `submissionAuthType` must be `signedIn`.
- Terms, privacy, and submitted status checks are unchanged.
- The field allowlist and required field list are unchanged.
- Evidence rights status allowed values are unchanged.
- Evidence permission confirmation must be boolean when present.
- Evidence visibility remains limited to `nomination-private` when present.
- Lat/lng validation is unchanged.
- Admin-only review, update, and promotion protections are unchanged.
- Default deny remains unchanged.

## Tests run

- `npm test`
- `npm run test:browser`

## Deployment note

After merge, the updated `firestore.rules` must be manually published to Firebase Console before the live site can use this simplification.

Run one controlled live evidence-URL nomination test after publishing the rules. Once the issue is confirmed fixed, remove or disable the temporary Phase 16D debug mode.
