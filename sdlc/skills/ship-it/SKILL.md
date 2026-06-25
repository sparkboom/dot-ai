---
name: ship-it
description: >-
  Commit staged changes, push the branch, and open a PR following team git
  conventions. Use only when the user explicitly asks to ship, deploy, or open a PR.
disable-model-invocation: true
---

# Ship it

Explicit slash workflow — only run when the user invokes this skill.

## Steps

1. Run `git status` and `git diff --staged`. Stop if nothing is staged and ask what to include.
2. Draft a commit message using the `commit-message` skill conventions.
3. Commit, push with upstream if needed, and open a PR.
4. Use the `pr-review` skill checklist when writing the PR description.

## Guardrails

- Never force-push to `main` or `master`.
- Never skip hooks unless the user explicitly requests it.
- Warn before committing files that look like secrets (`.env`, credentials, keys).
