# Claude Code conventions for this repository

This repo packages shared AI resources. When editing it:

- **Canonical content** lives at the repo root (`skills/`, `agents/`, `rules/`).
- **Cursor deltas** live only in `cursor/`.
- Run `npm run validate` before committing structural changes.
- Keep skill `name` fields aligned with their directory names.
- Use `disable-model-invocation: true` for slash-only skills like `ship-it`.

Do not duplicate content between Claude and Cursor paths.
