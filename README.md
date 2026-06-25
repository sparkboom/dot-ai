# dot-ai

Shared AI resources for **Claude Code** (canonical) and **Cursor** (adapted). One source tree, two plugin manifests, no duplicated skills or rules.

## Architecture

```
dot-ai/
├── skills/              ← canonical (Agent Skills / SKILL.md)
├── agents/              ← canonical
├── rules/               ← canonical (shared frontmatter works in both tools)
├── hooks/               ← Claude Code hooks
├── mcp.json             ← shared MCP config
├── scripts/             ← validation and tooling
│
├── .claude-plugin/      ← primary manifest + marketplace
├── .cursor-plugin/      ← secondary manifest (same content paths)
└── cursor/              ← Cursor-only deltas (hooks schema, etc.)
```

**Rule: edit once.** Skills, agents, and rules live at the repo root. The `cursor/` directory holds only what Cursor requires differently — never a second copy of the same skill.

## Install

### Claude Code (primary)

```bash
/plugin marketplace add <your-org>/dot-ai
/plugin install dot-ai
```

Skills and agents are namespaced: `/dot-ai:ship-it`, `@dot-ai:security-reviewer`.

### Cursor

Install via **Customize → Plugins → Add from GitHub**, or add this repo as a team marketplace.

Same namespace: `/dot-ai:ship-it`.

For headless CLI (`cursor-agent`), plugin-bundled skills may not register yet — symlink `skills/` into `~/.cursor/skills/dot-ai/` if needed. See `cursor/README.md`.

## Contents

| Component | Location | Slash / invoke |
|-----------|----------|----------------|
| Skills (auto) | `skills/commit-message/`, `skills/pr-review/` | Agent decides |
| Skills (explicit) | `skills/ship-it/` | `/dot-ai:ship-it` only (`disable-model-invocation: true`) |
| Agents | `agents/security-reviewer.md` | `@dot-ai:security-reviewer` |
| Rules | `rules/*.md` | Always / globs per frontmatter |
| Hooks | `hooks/hooks.json` (Claude), `cursor/hooks.json` (Cursor) | Automatic on events |

## Adding resources

### New skill

1. Create `skills/<name>/SKILL.md` with frontmatter (`name`, `description`).
2. Set `disable-model-invocation: true` for slash-only workflows.
3. Run `npm run validate`.

### New rule

1. Add `rules/<name>.md` with shared frontmatter (`description`, optional `globs`, `alwaysApply`).
2. Both tools read the same file — no Cursor copy needed.

### New agent

1. Add `agents/<name>.md` with `name` and `description` in frontmatter.

### Cursor-only behavior

Only add files under `cursor/` when Cursor's format genuinely differs (hooks today). Do not fork skills or rules.

## Validation

```bash
npm run validate
```

Checks manifest name parity, skill frontmatter, and rule structure.

## Per-project usage (without marketplace)

Symlink into a project:

```bash
ln -s /path/to/dot-ai/skills .claude/skills/dot-ai
ln -s /path/to/dot-ai/skills .cursor/skills/dot-ai
```

Or install as a plugin in each tool for namespaced slash commands.

## License

MIT
