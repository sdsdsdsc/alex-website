# Form Field Compatibility

Use this workflow when adding, renaming, or debugging form fields.

## Tracing Map

Trace each field through:

`HTML input name/id -> JS form reader -> payload field -> Firestore rules allowed field -> admin display -> public display/export`

## Checks

1. Confirm old and new field names.
2. Confirm compatibility aliases if any exist.
3. Confirm whether the field is optional or required.
4. Check empty string vs `null` vs `undefined`.
5. Check field type.
6. Check max length.
7. Confirm whether the field is private, admin-only, or public.
8. Confirm whether the field appears only when another field is filled.
9. Update tests for:
   - blank optional field
   - filled optional field

## Phase 13C Examples

- `evidenceImageCaption` vs `evidenceCaption`
- `evidenceImageUrl`
- `evidenceSourceCredit`
- `evidenceRightsStatus`
- `evidencePermissionConfirmed`
- `evidenceVisibility`

## Alex's Photo Board Notes

- Private nomination fields must not quietly leak into public export logic.
- A field that is valid in HTML but absent from Firestore `hasOnly([...])` will fail at write time.
