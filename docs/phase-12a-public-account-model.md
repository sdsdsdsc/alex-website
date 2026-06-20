# Phase 12A — Public Account Model and Safety Design

## Purpose

This document defines the smallest safe public account model for Alex's Photo Board before any registration or login UI is implemented.

It is a design/spec only.

It does not:

- change app behavior
- change Firebase Auth settings
- change Firestore rules
- write user data
- change nomination submission behavior
- change export behavior

The goal of public accounts is to support a limited set of user-owned actions without weakening the current public/admin boundary.

Public accounts may later help with:

- letting a public user submit a nomination while signed in
- letting a signed-in user see their own submitted nominations later
- reducing anonymous spam later
- supporting future community participation features

Public accounts are not for:

- public editing of `communityPlaces`
- public approval or moderation
- public access to other users' nominations
- public access to `adminNotes`
- public access to admin assessment fields
- public profile pages
- comments or forum behavior
- broad public user discovery or search

## Current Baseline

The current codebase already has a clear split:

- public pages read `communityPlaces`, `news`, and `history`
- public nomination submission writes only to `placeNominations`
- `placeNominations` remains private/admin-only
- admin pages use Firebase Auth email/password sign-in
- admin pages redirect through `admin-login.html`
- public export reads only `communityPlaces`, `news`, and `history`
- admin backup export is separate and private

Relevant existing files inspected for this plan:

- `admin-login.html`
- `admin.html`
- `manage-community-places.html`
- `manage-articles.html`
- `manage-nominations.html`
- `upload-article.html`
- `nominate-place.html`
- `nominate-place.js`
- `heritage-engine/nominations.js`
- `export.js`
- `admin-export.js`
- `firestore.rules`

## Existing Admin Auth Model

Current admin auth is already a minimal Firebase Auth flow:

- `admin-login.html` uses Firebase Auth `signInWithEmailAndPassword`
- admin pages check `onAuthStateChanged(...)`
- unauthenticated access redirects to `admin-login.html`
- sign-out is supported on admin pages
- `admin-export.js` additionally checks the configured admin UID before exposing private backup downloads

Important implication:

The project already treats authentication as a sensitive boundary, but only for admin use. Public accounts should not reuse admin assumptions, admin routing, or admin privileges.

## Existing Nomination Model

Current nomination flow is guest-friendly:

- `nominate-place.html` is public
- `nominate-place.js` writes directly to `placeNominations`
- `heritage-engine/nominations.js` builds a public-safe nomination payload
- the payload intentionally excludes admin-only fields such as:
  - `adminNotes`
  - admin assessment fields
  - `reviewHistory`
  - promotion fields

Current public nomination fields include:

- place/location fields
- significance and criteria fields
- `nominatorDisplayName`
- `nominatorEmail`
- `organisationName`
- `submittedOnBehalfOf`
- acknowledgement flags
- timestamps

Important implication:

The system already separates public submission data from admin review data. Public accounts should extend nomination ownership, not replace this boundary.

## Existing Rules Draft

The local `firestore.rules` draft currently models:

- public read for `communityPlaces`, `news`, and `history`
- public create for `placeNominations` with validation
- admin-only read for `placeNominations`
- admin-only review and promotion updates
- default deny for everything else

Important implication:

Public account work must preserve the current rule intent:

- no public write to `communityPlaces`
- no public read of all nominations
- no exposure of private/admin review fields

## Recommended Account Identity Model

### Recommendation

Use Firebase Auth with `email/password` as the first public account model.

### Why this is the safest starting point

- it matches the existing Firebase Auth stack already used for admin
- it keeps identity simple and explicit
- it supports account recovery through email
- it avoids adding third-party identity complexity too early
- it is easier to reason about for nomination ownership and privacy

### Google sign-in

Google sign-in may be added later as an optional convenience feature, but it should not be the first public account dependency.

Reasons to defer it:

- more UI and support complexity
- extra consent and account-linking questions
- more edge cases around duplicate accounts and recovery expectations

### Smallest safe first implementation

Phase 12 should begin with:

- email/password registration
- email/password login
- logout
- password reset only if the implementation is already well-supported and low-risk

It should not begin with:

- social auth bundles
- profile customization
- public usernames as a primary identity layer

## Recommended Public User Data Model

### Recommendation

Add a dedicated user document collection:

`publicUsers/{uid}`

### Proposed fields

- `uid`
- `displayName`
- `email`
- `createdAt`
- `updatedAt`
- `role: "public"`
- `consentVersion`
- `status`

### Notes

- `status` can support future moderation states such as `active` or `disabled`
- `consentVersion` helps track the version of public-facing account/privacy wording accepted by the user
- `role` should stay simple for now; Phase 12 does not need a multi-role public system

### Data minimization

Do not store:

- address
- phone number
- date of birth
- gender
- government identifiers
- sensitive demographic fields
- unnecessary biography/profile data

### Design preference

Keep `publicUsers` intentionally small. It should support identity and consent, not become a profile platform.

## Nomination Ownership Model

### Recommendation

When a nomination is submitted by a signed-in public user, store a small private/admin-side ownership layer on the nomination record.

Suggested fields on `placeNominations`:

- `submittedByUid`
- `submitterDisplayName`
- `submitterEmail`
- `submissionAuthType: "anonymous" | "signedIn"`

### Notes

- `nominatorEmail` already exists in the current nomination model and may continue to be used for admin follow-up
- `submitterEmail` should only exist if the implementation needs a normalized auth-derived copy separate from form-entered contact data
- if form email and auth email are both kept, Phase 12B/12C must define the difference clearly

### Privacy boundary

These ownership fields must remain:

- private/admin-side
- excluded from `communityPlaces`
- excluded from `heritage.json`
- excluded from public pages

### Promotion boundary

Promotion into `communityPlaces` must continue excluding:

- `submittedByUid`
- `submitterDisplayName`
- `submitterEmail`
- `nominatorEmail`
- `adminNotes`
- admin assessment fields
- `reviewHistory`

## Permission Model

This section describes intended future rule logic only. It does not propose a rule change in Phase 12A.

### Must stay true

- public read access to `communityPlaces`, `news`, and `history`
- no public write to `communityPlaces`
- no public write to admin collections or admin-only fields
- no public read of all `placeNominations`
- no public access to `adminNotes`
- no public access to `reviewHistory`
- no public access to private assessment fields
- admin keeps full review and promotion ability

### Intended future additions

If guest nominations are preserved:

- guest users may continue to create `placeNominations`
- signed-in users may also create `placeNominations`

If "My nominations" is later implemented:

- signed-in public users may read only nominations where `submittedByUid == request.auth.uid`
- signed-in public users must not read nominations owned by any other user

### Conservative model

Public users should not be able to:

- update nomination review fields
- delete nomination records by default
- change nomination ownership after submission
- see admin-side moderation state beyond any intentionally exposed public-safe subset

## Public UX Model

### Options considered

#### Option A — login optional; nominations remain guest-friendly

Pros:

- preserves the current simple nomination path
- lower barrier to community participation
- easier transition from current behavior
- allows public account features to be added without blocking current submissions

Risks:

- spam pressure remains partly anonymous
- mixed guest/signed-in ownership logic needs careful messaging

#### Option B — login required for nomination submission

Pros:

- stronger ownership link from day one
- may reduce some low-effort spam

Risks:

- higher friction for public participation
- bigger product shift from current behavior
- may discourage casual/local contributors

### Recommendation

Recommend **Option A** for first implementation:

- login remains optional
- nominations remain guest-friendly
- signed-in ownership is added as an enhancement, not a hard gate

This is the smallest safe change because it preserves the working nomination flow while introducing public identity gradually.

### Smallest safe UI for later phases

Possible future pages:

- `public-auth.html`
- `my-nominations.html`

Recommended first UI scope:

- a small public register/login page
- logout control when signed in
- optional "continue as guest" or keep current nomination page behavior unchanged

Not recommended yet:

- public dashboard beyond "My nominations"
- public profile editing center
- community social features

## Privacy and Moderation Risks

Public accounts create non-trivial obligations. Main risks include:

- personal data handling
- spam and fake submissions
- harassment through user-entered text
- user expectations about account ownership and record control
- account recovery support burden
- deletion or data access requests
- confusion between public and private nomination visibility
- minors/children risk if account signup is open to the public

### Specific project risks

1. **Public/private confusion**
   Users may assume a signed-in nomination becomes visible to them or to the public immediately.

2. **Record control confusion**
   Users may assume owning a nomination means owning the final `communityPlaces` record.

3. **Sensitive data leakage**
   Auth-linked ownership fields must never leak into:
   - public pages
   - public export
   - promoted place records

4. **Support burden**
   Password reset, account lockout, duplicate accounts, and deletion requests all create support expectations.

5. **Moderation edge cases**
   Signed-in status does not remove the need for admin review, abuse handling, or content screening.

## Recommended Phase 12 Breakdown

### 12A — account model and safety design

- define identity model
- define ownership model
- define privacy boundary
- define implementation sequence

### 12B — minimal public auth UI

- create small public register/login/logout flow
- keep it separate from admin login
- no community place editing
- no public profile platform

### 12C — signed-in nomination ownership

- attach signed-in ownership metadata to new nominations
- preserve guest nomination path if approved
- keep writes only to `placeNominations`

### 12D — optional "My nominations" page

- signed-in user can view only their own nominations
- no access to admin notes or private review fields
- no access to other users' records

### 12E — Firestore rules review and release testing

- verify deployed rules match intended public/admin boundary
- verify signed-in ownership reads are scoped correctly
- verify export remains public-safe
- verify admin workflow still works

## Acceptance Criteria

Phase 12 should not be considered complete until all of the following are true:

- public register/login works
- logout works
- nomination form still writes only to `placeNominations`
- signed-in nomination records store ownership privately
- public users cannot write `communityPlaces`
- public users cannot read other users' nominations
- public users cannot read admin notes or private assessment fields
- `heritage.json` excludes user/private fields
- admin workflow still works
- admin promotion still excludes private/auth-linked fields
- anonymous nomination path is either preserved intentionally or replaced intentionally
- release test checklist is completed before live rollout

## Recommended First Implementation Decision

The smallest safe public account model for this project is:

1. Firebase Auth `email/password` first
2. small `publicUsers/{uid}` collection
3. login optional at first
4. signed-in ownership attached privately to `placeNominations`
5. no public editing of `communityPlaces`
6. no public read of all nominations
7. no public/private boundary changes to export

## Intentionally Left for Phase 12B and Later

Phase 12A does **not** decide final UI copy, exact form layouts, or deployed rules details.

These are intentionally left for later work:

- exact register/login page markup
- password reset flow specifics
- exact `publicUsers` document creation timing
- exact signed-in nomination form wording
- exact "My nominations" page behavior
- detailed rules implementation and simulator testing
- Google sign-in or other optional auth providers

## Recommended Next Step

Proceed to **Phase 12B — minimal public auth UI** only after this model is accepted.

Phase 12B should stay small:

- create public auth screens
- keep admin auth untouched
- do not change nomination writes yet unless the ownership model is being introduced deliberately
