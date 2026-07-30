# Phase 17B Firebase Hosting Preview Readiness

## Scope

This is a documentation-first readiness audit for adding a safer Firebase Hosting preview or staging path before implementing registered-user place contributions in the existing `Comments and Photos` area.

This phase does not implement place contributions.
This phase does not change Firestore rules.
This phase does not change Firebase config.
This phase does not change app behavior.
This phase does not change public pages.

## Why This Readiness Phase Is Needed

The planned place-contributions feature will touch:

- public sign-in
- Firestore writes
- user-generated content
- admin review
- later possible image upload

Those changes should not be tested first on the live GitHub Pages production site.

## 1. Current Hosting Situation

### Current production site

Current public production is GitHub Pages:

- production URL: `https://sdsdsdsc.github.io/alex-website/`
- source branch: `main`
- source path: `/`
- GitHub Pages build type: `legacy`
- HTTPS is enforced

### Current repo hosting config

Current Firebase repo config is minimal:

- `firebase.json` exists
- it contains Firestore rules and Firestore emulator config only
- there is no Firebase Hosting block yet
- there is no preview-channel or hosting target config yet

Current `firebase.json`:

- `firestore.rules` points to `firestore.rules`
- Firestore emulator port is `8080`
- `singleProjectMode` is enabled

### `.firebaserc`

- `.firebaserc` is not present

That means the repo currently has:

- no checked-in Firebase project alias mapping
- no Hosting target alias
- no preview or staging target convention

### GitHub Actions

Current workflow:

- `.github/workflows/verify.yml`

Current behavior:

- installs dependencies
- runs `npm test`
- installs Playwright Chromium
- runs `npm run test:browser`

What is not present:

- no GitHub Actions Pages deploy workflow in repo
- no Firebase Hosting deploy workflow
- no preview-channel deploy workflow
- no environment-specific deploy job

### `package.json` scripts

Current scripts are verification-focused:

- `test`
- `test:browser`
- `test:payload`
- `test:promotion`
- `test:rules`
- `import:places`

What is not present:

- no `firebase deploy` script
- no Hosting preview deploy script
- no staging deploy script
- no rollback helper script

### Current deployment assumptions

The current repo appears to assume:

- GitHub Pages remains the public production site
- Firebase is used as the backend for reads, auth, and controlled writes
- Firebase CLI usage is mainly local testing and rules verification support
- there is no codified non-production frontend deployment target yet

## 2. Staging Options

### Option A: Firebase Hosting preview channels

Description:

- deploy each risky branch or PR to a temporary Firebase Hosting preview URL
- keep GitHub Pages as production

Strengths:

- lightweight and branch-friendly
- good fit for one task equals one branch equals one draft PR
- isolated frontend URL for risky Firebase-connected workflows
- clear preview URLs for review and manual verification
- easy to expire or replace per PR

Weaknesses:

- if preview uses the same Firebase project, writes can still hit production data
- still needs careful environment discipline
- requires Hosting config and deploy credentials

Best use:

- short-lived PR previews
- controlled manual testing before merge

### Option B: Separate Firebase Hosting staging site or target

Description:

- create a stable non-production Hosting target or site for repeated staging use

Strengths:

- more stable than per-PR ephemeral preview URLs
- easier to document for repeated manual QA
- can become a long-lived staging environment

Weaknesses:

- more setup than preview channels
- still not fully isolated if it points at the same Firestore/Auth project
- can drift into quasi-production unless deployment rules stay disciplined

Best use:

- repeated multi-step feature testing
- team-owned staging workflows

### Option C: GitHub branch-only preview

Description:

- rely on branch-only previews or alternate GitHub Pages branch workflows

Strengths:

- familiar static-site workflow
- minimal new platform setup

Weaknesses:

- weak fit for Firebase-connected risky features
- unclear separation between safe static preview and real backend-connected preview
- easy to confuse with production assumptions
- does not solve the need for a controlled Firebase-aware test surface

Best use:

- low-risk static layout review only

### Option D: Keep GitHub Pages only

Description:

- continue using only current production GitHub Pages for verification

Strengths:

- zero setup

Weaknesses:

- highest risk
- wrong choice for sign-in, Firestore writes, moderation, and user-generated content

Best use:

- not recommended for place-contributions implementation testing

## 3. Recommended Staging Approach

Recommended approach for this project:

- keep GitHub Pages as the current public production site for now
- add Firebase Hosting preview capability for risky Firebase-connected feature branches
- do not create a separate GitHub repo

Why this is the safest and lightest approach:

- it preserves the current public production path
- it avoids changing GitHub Pages deployment assumptions during this phase
- it gives risky branches their own review URL
- it fits the project’s current one-task, one-branch, one-draft-PR workflow
- it avoids overbuilding a second permanent frontend stack before the project proves it needs one

Recommended practical interpretation:

- use Firebase Hosting preview channels first
- keep open the option of a later stable staging target if repeated preview testing becomes cumbersome

Important caution:

- Firebase Hosting preview is a frontend deployment mechanism, not true data isolation
- if preview points to the same Firebase Auth and Firestore project, preview writes can still affect production backend data

So the safest operational rule is:

- use Firebase Hosting preview for frontend and integration verification
- do not treat it as a true sandbox unless backend isolation is also introduced later

## 4. Required Setup Items

These are the likely setup items needed in a later implementation phase.

### Firebase project or Hosting target

Minimum later requirement:

- an existing Firebase project with Hosting enabled

Possible shapes:

- same Firebase project, using Hosting preview channels only
- same Firebase project, with an additional staging Hosting target
- later, separate Firebase project if backend isolation becomes necessary

### `firebase.json`

Likely later addition:

- a `hosting` block

It would need at least:

- `public` directory
- `ignore` rules
- possibly rewrite rules if any clean URL handling needs explicit support

This phase does not prove that a hosting block is needed immediately, only that it will be required before Firebase Hosting preview can be used.

### `.firebaserc`

Likely later addition if the team wants checked-in aliasing:

- default project alias
- optional Hosting target mapping

This should be added carefully because it makes project targeting more explicit in repo automation.

### Deployment method

Two plausible later methods:

- manual deploy instructions first
- GitHub Actions preview deploy later

Manual first is lighter and safer for initial setup because:

- it reduces automation mistakes early
- it lets the team verify the exact Firebase target and URL behavior before CI takes over

### GitHub Actions or manual deploy command

If automation is added later, likely ingredients are:

- a workflow triggered on PRs or manual dispatch
- Firebase CLI authentication via token or service account
- branch or PR number based preview-channel naming

If manual deployment comes first, the repo would need:

- clear documented command sequence
- explicit target selection
- explicit rollback instruction

### Secrets or tokens

If GitHub Actions deployment is later used, likely requirements include:

- Firebase deploy credentials
- GitHub repository secrets
- possibly environment-level protections

### Preview URL naming convention

Recommended later convention:

- `pr-<number>-alex-photo-board`
- or `phase17b-<branch-slug>`

The name should make clear:

- this is non-production
- it maps to one PR or branch
- it is disposable

### Rollback plan

Later setup should document:

- how to stop using a bad preview channel
- how to keep production GitHub Pages untouched
- how to remove or rotate preview deploy credentials if needed
- how to verify no production deploy path was changed

## 5. Security and Safety Cautions

### Admin-page exposure

Staging must not accidentally expose admin-only pages beyond existing auth and rules assumptions.

Important nuance:

- admin page files are already part of the site bundle
- actual protection depends on auth gating and Firestore rules

So staging should be tested for:

- admin pages do not become easier to discover or misuse
- public auth does not drift into admin auth behavior
- staging documentation does not imply admin routes are safe without backend enforcement

### Firestore rules

Staging must not loosen Firestore rules.

This readiness phase strongly recommends:

- do not mix Hosting preview setup with rules edits
- keep rules review as a separate approval track

### Shared backend caution

If preview uses the same Firebase project:

- sign-in behavior is still real
- Firestore reads are still real
- any permitted write is still real

So preview testing of user-generated content should be:

- deliberate
- limited
- traceable
- cleaned up through admin workflow where needed

### Production data caution

Preview or staging should not auto-write test data into production unless that choice is explicitly accepted.

For place contributions in particular:

- test records should be clearly named
- moderation should be controlled
- approved versus pending visibility should be verified carefully

### Public content moderation risk

User-generated content preview testing should be controlled because it may involve:

- unsafe text
- copyright-sensitive image URLs
- misleading public attribution
- moderation bypass attempts

That is another reason preview setup should land before contribution implementation.

## 6. Smallest Safe Next Step After This Audit

Recommended next step:

- create a small config-only PR that adds Firebase Hosting config and manual preview deploy instructions first

Why this is the safest next step:

- it is smaller than adding CI deploy automation immediately
- it separates platform setup from contribution feature logic
- it lets the team validate Hosting assumptions before introducing secrets and PR automation

Recommended sequence after this audit:

1. Add minimal Firebase Hosting config only.
2. Add documented manual preview deploy instructions.
3. Verify the preview URL and frontend behavior.
4. Only then consider GitHub Actions preview deployment.

What should not be first:

- do not start with contribution feature code
- do not start with Firestore rule changes
- do not start with automatic preview deploy secrets before the manual path is understood

## 7. Verification Plan

Later staging verification should include at least:

- staging URL loads `index.html`
- staging URL loads `search.html`
- staging URL loads `place.html`
- public sign-in works as expected
- Firebase config points where expected
- Firestore reads work
- admin pages remain protected by the same auth and rules assumptions
- no GitHub Pages production behavior is changed
- rollback path is documented and clear

For risky feature verification later, also check:

- write-capable pages are clearly identified as non-production preview
- preview test data is intentionally named
- place contributions do not appear publicly until approved
- moderation and public display boundaries are preserved

## Conclusion

The safest and lightest direction for Alex’s Photo Board is:

- keep GitHub Pages as production for now
- add Firebase Hosting preview capability for risky Firebase-connected branches
- avoid a separate GitHub repo
- defer automation until a minimal Hosting config and manual preview path are understood

This gives the project a safer place to test sign-in, Firestore writes, moderation, and future user-generated content work before those workflows are tried against the live production site.
