---
name: commit-message
description: >-
  Write git commit messages following team conventions. Use when the user asks
  to commit, draft a commit message, or review staged changes before committing.
---

# Commit message conventions

## Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `perf`.

## Rules

- Subject line: imperative mood, ≤72 characters, no trailing period.
- Body: explain **why**, not what — the diff shows what changed.
- One logical change per commit when possible.

## Examples

```
fix(auth): reject expired refresh tokens before DB lookup

Tokens were reaching the user store after expiry, causing confusing
401s on otherwise valid sessions.
```

```
feat(billing): add usage meter for API calls
```

## Process

1. Read staged diff (`git diff --staged`).
2. Identify the primary intent — pick one type.
3. Draft subject, then optional body if context helps reviewers.
