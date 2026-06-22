# Firestore Permission Debugging

Use this workflow when the UI shows `FirebaseError: Missing or insufficient permissions`.

## Core Lesson

A tiny `undefined` optional field can cause a Firestore write failure, while the browser only shows a vague permission error.

## Workflow

1. Identify the exact collection and operation.
2. Inspect the write function:
   - `addDoc`
   - `setDoc`
   - `updateDoc`
3. Add a temporary debug log immediately before the write.
4. Log `Object.keys(payload).sort()`.
5. Log auth UID and auth email.
6. Log matching payload UID and payload email.
7. Log suspicious field values and `typeof`.
8. Compare payload keys against `hasOnly([...])`.
9. Compare required fields against `hasAll([...])`.
10. Check types carefully:
    - number vs string
    - boolean vs string
    - timestamp vs `serverTimestamp()`
    - `undefined`
11. Clean optional `undefined` values before writing:

```js
Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
```

12. Use Rules Playground with realistic auth and realistic payload.
13. If Rules Playground allows but live still fails, check:
    - wrong Firebase project
    - unpublished rules
    - stale GitHub Pages JavaScript
    - wrong branch
    - browser cache
14. Do not loosen rules until payload correctness is proven.
15. Remove temporary debug logging only after one successful live test.

## Alex's Photo Board Notes

- Compare nomination payloads against `placeNominations` create rules, not against admin update rules.
- Confirm owner-linked values:
  - `submittedByUid == auth.currentUser.uid`
  - `submitterEmail == auth.currentUser.email`
- Treat optional evidence fields as a likely source of hidden `undefined` write failures.
