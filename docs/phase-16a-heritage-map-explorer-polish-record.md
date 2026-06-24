# Phase 16A Heritage Map Explorer Polish Record

## Scope

Phase 16A focused on public map usability polish only. The goal was to replace the old static sidebar with a practical heritage explorer panel while keeping the existing public map and record-opening flow working.

## What Improved

- Replaced the outdated documentation-style sidebar on `map.html` with a heritage explorer panel.
- Added clearer public-facing map copy, keyword search, live result count, a readable result list, and a nomination call to action.
- Improved map result cards so each record shows title, type, area or location context, and a clear `View record` action.
- Kept the map canvas clear on the right so the controls no longer crowd the map itself.

## Reference Direction Used

Used a local heritage map/list/search explorer pattern as UX direction only:

- left-side exploration panel
- map plus list working together
- clear public search and filter controls
- civic heritage-record browsing tone

No external branding, exact layout, or reference text was copied.

## Dead Filter Correction

- Removed the old hard-coded city or province-style map filter that showed demo values such as `Jiujiang`, `Nanchang`, `Pingxiang`, and `Xinyu`.
- Replaced it with filters driven only by real current record data:
  - `assetType`
  - `area` when real area values exist
  - `heritageCriteria` when criteria values exist

## Files Changed

- `map.html`
- `map.js`
- `style.css`
- `docs/phase-16a-heritage-map-explorer-polish-record.md`

## Tests Run

- `npm test`
- `npm run test:browser`

## Browser Smoke Checks

Checked the following locally after implementation:

- `index.html`
- `map.html`
- map markers appear
- keyword search updates results
- result count updates
- empty state appears when no matches are found
- old city or province demo filter is gone
- record cards still lead to place records
- `nominate-place.html`
- `my-nominations.html`
- `export.html`

## Known Limitations

- The page still relies on the current `communityPlaces` Firestore data and existing coordinates quality.
- Filter options only appear when real data exists for those fields.
- No new GIS layers, locate-me tools, or boundary overlays were added in this phase.

## Safety Confirmation

Confirmed not touched in this phase:

- Firebase Console
- `firestore.rules`
- `verify.yml`
- GitHub rulesets
- live backend or deploy configuration
- admin security logic
- nomination review or export logic
- Firestore data model
