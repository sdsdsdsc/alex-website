# Post-Merge Production Gate

After every PR merge, do not assume production is fresh immediately.

## Required Gate

1. Check GitHub Pages deployment status.
2. If Pages deploy is still building or has failed, do not run production smoke tests yet.
3. If build, report, and verification jobs passed but only the Pages deploy failed with `Deployment failed, try again later,` treat it as a likely transient GitHub Pages deployment service issue.
4. Inspect the deploy log before taking any further action.
5. If the failure is the transient `Deployment failed, try again later` case, use the actual recovery path for the configured GitHub Pages source. For repos with a rerunnable Pages deploy job or deploy path, rerun only that failed deploy step when it is safe to do so.
6. Confirm GitHub Pages reports `built`.
7. Fetch production files and confirm fresh phase markers are live.
8. Only then run the production smoke test.
9. A phase is not fully closed until production freshness is confirmed, the production smoke test passes, and temporary test data is cleaned up.

## Why This Gate Exists

- This prevents stale-production risk after merge.
- When tests, build, and other checks passed, but only the Pages deploy failed, it usually is not a repo code failure.
- Do not start the next phase until this gate is complete.
