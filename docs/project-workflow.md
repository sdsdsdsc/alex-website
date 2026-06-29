# Development Workflow Guide

This guide is for future Alex's Photo Board bug fixes and feature work.

## Branch And PR Rules

1. `main` is the stable live website branch.
2. For one bug or one feature, create one working branch and one draft PR.
3. Add follow-up commits to the same draft PR until the issue is solved.
4. Do not create multiple PRs for the same bug unless the user explicitly asks.
5. Do not merge diagnostic-only changes into `main` unless live testing absolutely requires it.

## Pre-Merge Checklist

Before merging, check:

- changed files
- unrelated file changes
- tests
- Firestore rules changes
- temporary debug logs
- live or staging verification

## Firestore Rules

Firestore rules changes are high-risk and should be reviewed separately.

## After Merge

- Delete the feature branch after merge.

## Staging Note

A true staging site should be planned separately later. Do not change the GitHub Pages deployment source in this workflow PR.
