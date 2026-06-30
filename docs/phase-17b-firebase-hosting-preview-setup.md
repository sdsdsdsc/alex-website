# Phase 17B Firebase Hosting Preview Setup

## Scope

This document defines the smallest safe Firebase Hosting preview setup for Alex's Photo Board.

This phase is config and documentation only.

It does not:

- change Firestore rules
- change Firebase app config
- change HTML, CSS, or JavaScript behavior
- change public pages
- add place contributions feature code
- add GitHub Actions deployment
- add deploy secrets or tokens

## What This Phase Adds

- a minimal `hosting` block in `firebase.json`
- manual preview deployment instructions

This setup is intentionally small so we can prove manual preview deployment first before adding automation.

## Current Project Choice

Recommended deployment choice for this phase:

- keep GitHub Pages as the public production site
- use Firebase Hosting preview channels for risky Firebase-connected branch testing
- do not create a separate GitHub repo
- do not add `.firebaserc` yet

Why `.firebaserc` is not added in this minimal step:

- manual preview deployment can safely use an explicit `--project` flag
- that avoids introducing repo-level project aliasing before manual preview is proven safe

## Minimal Hosting Config

`firebase.json` now includes a minimal Hosting block.

Key choices:

- `public` is set to `.`
- common non-site files are ignored
- no redirects, rewrites, or app-behavior changes are introduced

This keeps the preview surface close to the current static-site structure while avoiding obvious non-web repo files in Hosting uploads.

## Manual Preview Deployment

### 1. Preconditions

Before running a preview deployment, confirm all of the following:

- you are on the intended branch
- the branch contains only the changes you want to preview
- GitHub Pages production is still the live production path
- Firebase Hosting is enabled in the Firebase project
- you have Firebase CLI access for the target project

Target project for this minimal step:

- `alexs-community-efcd8`

No Hosting alias or target is required yet.

### 2. Install dependencies

Use the repo-local Firebase CLI through `npx`:

```bash
npm ci
```

### 3. Authenticate with Firebase CLI

If needed:

```bash
npx firebase login
```

### 4. Deploy a preview channel

Recommended example:

```bash
npx firebase hosting:channel:deploy phase17b-preview --project alexs-community-efcd8 --expires 7d
```

Recommended channel naming convention:

- use a branch or PR related name
- keep it obviously non-production

Examples:

- `phase17b-preview`
- `pr-30-preview`
- `place-contributions-plan-preview`

For later manual previews tied to one branch or PR, prefer short names:

- `pr-<number>`
- `branch-<short-slug>`

### 5. Capture the preview URL

The CLI will return a Firebase Hosting preview URL.

Record:

- channel name
- preview URL
- branch name
- deployment date

## What To Verify On The Preview URL

After preview deployment, verify:

- home page loads
- `search.html` loads
- `place.html?id=...` loads
- `public-auth.html` loads
- Firebase-backed reads still work
- page styling and assets load correctly

Recommended manual checks:

- `index.html`
- `search.html`
- `place.html?id=phase-11c-image-promotion-live-test-20260630024821`
- `public-auth.html`
- `my-nominations.html`

If admin review testing is ever intentionally done on preview, also verify:

- admin pages still require the same auth path
- preview does not weaken admin access assumptions

## How To Confirm GitHub Pages Production Is Unchanged

After preview deployment, confirm production is still untouched.

Check:

- production URL still resolves to GitHub Pages:
  - `https://sdsdsdsc.github.io/alex-website/`
- GitHub Pages still points to:
  - branch `main`
  - path `/`
- no `firebase deploy` to production Hosting target was run

Operational rule:

- preview deployment should use `hosting:channel:deploy`
- do not run broad `firebase deploy` during this minimal setup phase

## Cleanup And Expiry

Preview channels should be disposable.

### Automatic expiry

Use an explicit expiry window:

- `--expires 7d`

Smaller windows are fine for narrow tests:

- `--expires 2d`
- `--expires 3d`

### Manual deletion

To remove a preview channel early:

```bash
npx firebase hosting:channel:delete phase17b-preview --project alexs-community-efcd8
```

Use this when:

- the preview is no longer needed
- the branch is closed
- the preview contains risky or confusing test content

## Safety Notes

### Preview is not backend isolation

This setup creates a preview frontend deployment, not a separate backend environment.

If the preview uses the same Firebase project:

- Auth is still real
- Firestore reads are still real
- any allowed write is still real

So preview testing for write-capable features must stay controlled.

### Do not treat preview as a sandbox

Before testing registered-user place contributions later:

- use clearly named test records
- keep moderation deliberate
- remember that preview writes can still affect shared backend data if they are allowed

### Do not loosen rules in this phase

This setup does not require:

- Firestore rule changes
- Storage rule changes
- Auth model changes

Keep those as separate, reviewed changes later.

### Admin-page caution

Firebase Hosting preview does not by itself make admin pages safe.

Admin protection still depends on:

- auth gating
- Firestore rules
- careful testing discipline

## Rollback Guidance

Rollback for this minimal setup is intentionally simple.

If the preview deployment is wrong or confusing:

1. Stop using the preview URL.
2. Delete the preview channel.
3. Confirm GitHub Pages production is still unchanged.

If the config itself needs to be backed out later:

1. Revert the Hosting config PR.
2. Delete any preview channels created from that setup.
3. Reconfirm production still points to GitHub Pages `main`.

Because this phase does not change production deployment source, rollback risk is low.

## Recommended Next Step After This Setup

After this PR is merged, the next safest step is:

- perform one manual Firebase Hosting preview deployment from a non-production branch
- record the resulting preview URL and verification outcome

Only after that manual preview path is proven safe should the project consider:

- `.firebaserc` project aliasing
- stable staging targets
- GitHub Actions preview deployment
- deploy secrets or tokens

## Conclusion

This Phase 17B setup is intentionally minimal:

- small Hosting config
- no project alias file yet
- no automation yet
- manual preview first

That gives Alex's Photo Board a safer branch-preview path for risky Firebase-connected work without changing current GitHub Pages production behavior.
