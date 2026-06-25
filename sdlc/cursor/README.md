# Cursor adaptations (sdlc)

This directory holds **Cursor-only** files for the `sdlc` plugin. Everything else under `sdlc/` is canonical and shared.

Claude Code reads from the plugin root (`skills/`, `agents/`, `rules/`, `hooks/`). Cursor reads the same canonical trees via `sdlc/.cursor-plugin/plugin.json`, except where noted below.

## What lives here

| File | Why it's Cursor-only |
|------|----------------------|
| `hooks.json` | Cursor hook events and schema differ from Claude Code (`version: 1`, different event names) |

## What does NOT live here

Do not duplicate skills, agents, or rules. Both tools consume:

- `skills/*/SKILL.md`
- `agents/*.md`
- `rules/*.md`

## Adding a Cursor-only hook

1. Edit `sdlc/cursor/hooks.json` using [Cursor hook events](https://cursor.com/docs/agent/hooks).
2. Put hook scripts in `scripts/hooks/cursor/` if they need to run from this repo.
3. Do not mirror the same logic in `sdlc/hooks/hooks.json` unless Claude supports the equivalent event — keep behavior aligned in documentation, not copy-pasted JSON.

## Flat-path fallback (CLI / headless)

If plugin-bundled skills don't load in `cursor-agent` CLI, symlink or copy `sdlc/skills/` into `~/.cursor/skills/sdlc/` as a temporary workaround until CLI parity improves.
