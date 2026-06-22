# Minimal Fix Regression Check

Use this workflow before and after finalizing a change.

## Core Rules

- Make the smallest fix that explains the observed failure.
- Do not rewrite unrelated working code.
- Do not broaden Firebase rules randomly.
- Do not remove debug logs before a successful live test.
- Preserve existing UI unless the task explicitly asks for layout change.
- After the change, test both the old successful path and the new fixed path.

## Regression Checklist

- Home page loads.
- News loads.
- History loads.
- Map loads.
- Place page loads.
- Nomination form submits with blank optional evidence.
- Nomination form submits with filled evidence URL.
- My nominations works.
- Admin review works.
- `heritage.json` public export remains privacy-safe.
