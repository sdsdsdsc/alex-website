# Firebase Rules and Repo Sync

Use this workflow when Firebase Console rules and repo `firestore.rules` may differ.

## Checks

1. Identify the `projectId` used by the live site.
2. Confirm the Firebase Console project matches that live `projectId`.
3. Check whether Console rules were manually edited.
4. Check whether repo `firestore.rules` matches Console rules.
5. After manual Console edits, update the repo copy.
6. After repo rule edits, publish or deploy rules intentionally.
7. Use Rules Playground with realistic auth and realistic payload.
8. Do not broadly loosen rules.
9. Keep default deny intact.
10. Keep public reads limited to intended public collections.
11. Keep `placeNominations` owner/admin read only.

## Alex's Photo Board Notes

- `firebase.json` pointing at `firestore.rules` is not proof that live rules changed.
- Public-safe collections:
  - `communityPlaces`
  - `news`
  - `history`
- Private/admin collection:
  - `placeNominations`
