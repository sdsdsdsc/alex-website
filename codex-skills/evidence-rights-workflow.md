# Evidence Rights Workflow

Use this workflow when work touches evidence URL, image credit, rights, permission, or visibility.

## Core Rules

- Photo / evidence URL is optional.
- If present, it must be an HTTPS URL.
- Evidence caption and source are optional.
- Rights status is stored for review.
- Permission confirmation must be boolean.
- Visibility defaults to or remains `nomination-private`.
- Evidence is review material, not automatically public content.
- Admin review can see it.
- Public export should not expose it unless promoted through an intentional public workflow.

## Phase 13C Lesson

The successful fix was skipping `undefined` optional evidence fields before the Firestore write.

## Checks

1. Confirm evidence URL is trimmed.
2. Confirm optional caption/source fields do not become stray `undefined` payload keys.
3. Confirm permission confirmation is boolean.
4. Confirm rules, payload, admin display, and export logic use the same field names.
5. Confirm public export still strips nomination-private evidence fields.
