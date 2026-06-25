# dot-ai

Shared AI resources for **Claude Code** (canonical) and **Cursor** (adapted). One marketplace, multiple installable plugins, no duplicated skills or rules.

## Architecture

```
dot-ai/
├── sdlc/                ← software development lifecycle plugin
│   ├── skills/
│   ├── agents/
│   ├── rules/
│   ├── hooks/           ← Claude Code hooks
│   ├── mcp.json
│   └── cursor/          ← Cursor-only deltas (hooks schema, etc.)
├── pkm/                 ← personal knowledge / Obsidian plugin (scaffold)
│   ├── skills/
│   └── rules/
├── scripts/             ← validation and tooling
│
├── .claude-plugin/      ← marketplace manifest (Claude Code)
└── .cursor-plugin/      ← marketplace manifest (Cursor)
```

**Rule: edit once.** Each plugin owns its skills, agents, and rules. Cursor-only format differences live under `<plugin>/cursor/` — never a second copy of the same skill.

## Plugins

| Plugin | Purpose | Install |
|--------|---------|---------|
| `sdlc` | Git, PRs, code review, security | `/plugin install sdlc@dot-ai` |
| `pkm` | Notes, web research, Obsidian vaults | `/plugin install pkm@dot-ai` |

Skills and agents are namespaced by plugin: `/sdlc:ship-it`, `@sdlc:security-reviewer`.

## Install

### Claude Code (primary)

```bash
/plugin marketplace add <your-org>/dot-ai
/plugin install sdlc@dot-ai
/plugin install pkm@dot-ai
```

Install one or both plugins depending on what you need.

### Cursor

Install via **Customize → Plugins → Add from GitHub**, or add this repo as a team marketplace.

Same namespaces: `/sdlc:ship-it`, `/pkm:…`.

For headless CLI (`cursor-agent`), plugin-bundled skills may not register yet — symlink plugin skills into `~/.cursor/skills/` if needed. See `sdlc/cursor/README.md`.

## Contents (sdlc)

| Component | Location | Slash / invoke |
|-----------|----------|----------------|
| Skills (auto) | `sdlc/skills/commit-message/`, `sdlc/skills/pr-review/` | Agent decides |
| Skills (explicit) | `sdlc/skills/ship-it/` | `/sdlc:ship-it` only (`disable-model-invocation: true`) |
| Agents | `sdlc/agents/security-reviewer.md` | `@sdlc:security-reviewer` |
| Rules | `sdlc/rules/*.md` | Always / globs per frontmatter |
| Hooks | `sdlc/hooks/hooks.json` (Claude), `sdlc/cursor/hooks.json` (Cursor) | Automatic on events |

The `pkm` plugin is scaffolded — add skills and rules as you build out note-taking and research workflows.

## Adding resources

### New skill

1. Pick a plugin (`sdlc/` or `pkm/`).
2. Create `<plugin>/skills/<name>/SKILL.md` with frontmatter (`name`, `description`).
3. Set `disable-model-invocation: true` for slash-only workflows.
4. Run `npm run validate`.

### New rule

1. Add `<plugin>/rules/<name>.md` with shared frontmatter (`description`, optional `globs` / `paths`, `alwaysApply`).
2. Both tools read the same file — no Cursor copy needed.

### New agent

1. Add `<plugin>/agents/<name>.md` with `name` and `description` in frontmatter.

### New plugin

1. Create `<plugin-name>/` with `.claude-plugin/plugin.json` and `.cursor-plugin/plugin.json`.
2. Register it in `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json`.
3. Run `npm run validate`.

### Cursor-only behavior

Only add files under `<plugin>/cursor/` when Cursor's format genuinely differs (hooks today). Do not fork skills or rules.

## Validation

```bash
npm run validate
```

Checks marketplace manifests, per-plugin manifest parity, skill frontmatter, and rule structure.

## Per-project usage (without marketplace)

Symlink a plugin's skills into a project:

```bash
ln -s /path/to/dot-ai/sdlc/skills .claude/skills/sdlc
ln -s /path/to/dot-ai/sdlc/skills .cursor/skills/sdlc
```

Or install plugins from the marketplace for namespaced slash commands.

## License

MIT
