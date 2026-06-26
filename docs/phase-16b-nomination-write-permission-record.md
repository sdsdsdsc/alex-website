# Phase 16B Nomination Write Permission Record

## Live Symptom

The live nomination form on `nominate-place.html` reached `addDoc(...)` after sign-in and client-side validation, then failed with:

`FirebaseError: Missing or insufficient permissions.`

This was reproduced with more than one signed-in account, which made a single-account data problem less likely.

## Suspected Root Cause

The Firestore create rule for `placeNominations` required:

`request.resource.data.submitterEmail == request.auth.token.email`

The frontend builds `submitterEmail` from `auth.currentUser.email`, while the rules compare it against the auth token's `email` claim. That comparison is fragile because the token claim can be missing, stale, differently cased, or shaped differently by provider/auth state even when the user is genuinely signed in.

The durable ownership check is already:

`request.resource.data.submittedByUid == request.auth.uid`

That UID equality is the real access-control boundary for public nomination creation.

## Exact Rule Changed

In `firestore.rules`, the nomination create rule changed from:

```txt
&& isTrimmedString(request.resource.data.submitterEmail, 254)
&& request.resource.data.submitterEmail == request.auth.token.email
```

to:

```txt
&& isValidEmailString(request.resource.data.submitterEmail, 254)
&& (
  request.auth.token.email == null
  || (
    request.auth.token.email is string
    && request.resource.data.submitterEmail.lower() == request.auth.token.email.lower()
  )
)
```

The related `nominatorEmail` validation now uses the same shared `isValidEmailString(...)` helper for consistency.

No other nomination create protections were removed. The rule still requires:

- `request.auth != null`
- `request.resource.data.submittedByUid == request.auth.uid`
- valid required fields
- field allowlist
- `submissionAuthType == 'signedIn'`
- `termsAccepted == true`
- `privacyAccepted == true`
- `nominationStatus == 'submitted'`
- evidence URL and evidence metadata validation
- `evidenceVisibility == 'nomination-private'` when present
- latitude/longitude validation
- admin-only review, update, and promotion controls

## Security Impact

This change relaxes the most fragile part of the identity check while keeping the stronger ownership control:

- The signed-in caller must still be authenticated.
- The submitted record must still claim the caller's own UID.
- `submitterEmail` must still be present as a trimmed, email-shaped string.
- If the auth token includes an email claim, `submitterEmail` must still match it case-insensitively.

This means the rule continues to prevent anonymous writes and continues to bind nomination ownership to the authenticated Firebase UID, while avoiding false negatives when a valid signed-in session lacks an email claim.

## Tests Run

Planned repo validation for this change:

- `npm test`
- `npm run test:browser`

See the final task report for the exact outcomes from this branch.

## Deployment Note

Firebase Console or Firebase CLI publication is still required after merge because changing `firestore.rules` in the repo does not update deployed Firestore rules by itself.

## Final Verification Still Required

After the updated rules are published, a controlled live end-to-end nomination test is still required to confirm:

- signed-in public nomination creation succeeds
- `my-nominations.html` shows the new nomination
- admin review flow still works
- no private nomination fields leak into public records or exports
