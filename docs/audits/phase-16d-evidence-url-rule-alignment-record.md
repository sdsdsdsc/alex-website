# Phase 16D Evidence URL Rule Alignment Record

## Live symptom

Live nominations submit successfully when the Photo / evidence URL field is blank, but fail with `FirebaseError: Missing or insufficient permissions` when an evidence URL is supplied.

## Diagnosis

Because blank evidence nominations pass, the signed-in auth boundary, submitted UID ownership, submitter email validation, required nomination fields, lat/lng values, terms/privacy acknowledgements, and submitted status are all likely passing on live data.

That narrows the likely rejection to the evidence URL branch. The frontend validation accepts any non-empty URL that starts with `https://`, but the Firestore rule required a stricter dotted-host pattern.

## Rule change

The nomination create rule now validates `evidenceImageUrl` as an optional string up to 1000 characters, then accepts it when it is missing, null, an empty string, or matches `^https://.+$`.

This replaces the previous `isOptionalHttpsEvidenceUrl('evidenceImageUrl', 1000)` check for nomination creates only.

## Security boundaries preserved

- Signed-in auth is still required for nomination creates.
- `submittedByUid == request.auth.uid` remains the ownership check.
- Submitter and nominator emails must still be valid email strings.
- `submissionAuthType == 'signedIn'`, terms accepted, privacy accepted, and `nominationStatus == 'submitted'` are unchanged.
- The nomination field allowlist and required field list are unchanged.
- Evidence rights status validation is unchanged.
- Evidence permission confirmation must remain a boolean when present.
- Evidence visibility is still limited to `nomination-private` when present.
- Admin-only review, update, and promotion protections are unchanged.
- Default deny behavior is unchanged.

## Tests run

- `npm test`
- `npm run test:browser`

## Deployment note

After this change is merged, the updated `firestore.rules` still must be manually published or deployed to the live Firebase project before the live evidence-URL nomination workflow is fixed.
