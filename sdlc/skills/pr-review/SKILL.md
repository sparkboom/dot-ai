---
name: pr-review
description: >-
  Review pull requests for correctness, tests, security, and clarity. Use when
  the user asks for a PR review, code review, or before opening a PR.
---

# PR review checklist

## Correctness

- Does the change match the stated intent?
- Are edge cases handled?
- Could this break existing callers or APIs?

## Tests

- Are behavior changes covered by tests?
- Do tests assert meaningful outcomes, not implementation details?

## Security

- Any new user input paths? Validate and sanitize.
- Secrets, tokens, or PII in logs or responses?
- AuthZ checks on new endpoints or actions?

## Clarity

- Is the PR description sufficient for a reviewer without chat context?
- Are non-obvious decisions explained in code comments (sparingly)?

## PR description template

```markdown
## Summary
- …

## Test plan
- [ ] …
```

## Output

Structure review feedback as:

- **Blockers** — must fix before merge
- **Suggestions** — improvements, not required
- **Nits** — optional style or naming
