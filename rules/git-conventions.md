---
description: Git branch, commit, and PR conventions for all projects using dot-ai
alwaysApply: true
---

# Git conventions

## Branches

- `main` is protected — no direct commits.
- Feature branches: `feat/…`, `fix/…`, `chore/…` (kebab-case after prefix).
- Keep branches short-lived; rebase or merge frequently.

## Commits

- Follow conventional commits (see `commit-message` skill).
- One logical change per commit when practical.

## Pull requests

- Link issues when applicable.
- Include a test plan checklist.
- Request review before merging; address blockers before approval.

## Never

- Force-push to shared default branches.
- Commit secrets, `.env` files, or credential artifacts.
- Skip hooks without explicit team approval.
