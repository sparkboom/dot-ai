# Claude Code conventions for this repository

This repo packages shared AI resources as a multi-plugin marketplace. When editing it:

- **Each plugin** lives in its own directory (`sdlc/`, `pkm/`, …) with its own `skills/`, `agents/`, and `rules/`.
- **Marketplace manifests** live at `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json`.
- **Cursor deltas** live only in `<plugin>/cursor/`.
- Run `npm run validate` before committing structural changes.
- Keep skill `name` fields aligned with their directory names.
- Use `disable-model-invocation: true` for slash-only skills like `ship-it`.

Do not duplicate content between Claude and Cursor paths.
