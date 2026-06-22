# Public Export Privacy Check

Use this workflow when work touches `heritage.json`, JSON-LD, `export.js`, or public data boundaries.

## Core Rule

Public export must never leak private nomination or admin data.

## Checks

1. Confirm public collections are only:
   - `communityPlaces`
   - `news`
   - `history`
2. Confirm private/review collections are not publicly exported:
   - `placeNominations`
3. Confirm the following never appear in public export:
   - nominator private email
   - submitter email
   - `submittedByUid`
   - admin notes
   - private review history
   - nomination-private evidence
   - unapproved nomination evidence
4. Confirm `heritage.json` only exports approved public records.
5. Confirm JSON-LD fields are public-safe.
6. After promotion, only approved public fields move into public place data.
7. Test public page behavior and export behavior separately from admin pages.

## Alex's Photo Board Notes

- Promotion helpers and export helpers are separate boundaries and both must strip private fields.
- Do not assume a field safe for admin review is safe for public JSON-LD.
