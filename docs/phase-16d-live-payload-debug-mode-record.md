# Phase 16D Live Payload Debug Mode Record

## Why this was needed

The live evidence-URL nomination workflow still failed with a Firestore permission error after the Phase 16C payload hardening and Phase 16D evidence URL rule alignment were merged. Local diagnostics showed the reconstructed payload should pass the repo rules, while manual Rules Playground testing was unreliable because the simulated data could include Console metadata fields such as `__name__` or `id`.

This mode lets us inspect the exact payload built by the live page before the Firestore write.

## Safety design

- Debug mode activates only when `debugNomination=1` is present in the URL.
- The page builds the real nomination payload normally.
- The page logs a safe summary and stores it on `window.__lastNominationDebug`.
- The submit handler returns before `addDoc`, so no live Firestore record is created in debug mode.
- The debug summary does not include ID tokens, refresh tokens, credential objects, or the full auth object.
- `submittedByUid` is reported only as present plus a redacted first/last character summary.

## What is logged

- Sorted payload keys.
- Field type map.
- Evidence URL, caption, source/credit, rights status, permission boolean, and visibility.
- Redacted submitted UID presence.
- Submitter email.
- Nomination status and submission auth type.
- Terms/privacy booleans.
- Latitude/longitude values and types.
- Missing required fields compared with the Firestore create rule.
- Forbidden extra fields compared with the Firestore create rule.
- Fields whose value is `undefined`.

## How to use

Open:

```text
https://sdsdsdsc.github.io/alex-website/nominate-place.html?lat=27.360986952559394&lng=114.19961808245324&debugNomination=1
```

Submit the form with the Phase 16D evidence test values. The page should show:

```text
Debug mode: payload logged. Firestore write skipped.
```

Then inspect:

```js
window.__lastNominationDebug
```

## Tests run

- `npm test`
- `npm run test:browser`

## Removal note

This temporary diagnostic mode should be removed or disabled after the live payload mismatch is diagnosed.
