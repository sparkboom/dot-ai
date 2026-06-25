#!/usr/bin/env node
/**
 * Validates dot-ai repo structure. Run after adding skills, agents, or rules.
 *
 * Usage: node scripts/validate.mjs
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const errors = [];
const warnings = [];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path, label) {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    errors.push(`${label}: ${err.message}`);
    return null;
  }
}

async function validateSkills(pluginRoot, pluginName) {
  const skillsDir = join(pluginRoot, "skills");
  if (!(await exists(skillsDir))) return;

  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skillDirs = entries.filter((e) => e.isDirectory());

  if (skillDirs.length === 0) {
    warnings.push(`${pluginName}: no skills in skills/ yet`);
  }

  for (const dir of skillDirs) {
    const rel = `${pluginName}/skills/${dir.name}`;
    const skillPath = join(skillsDir, dir.name, "SKILL.md");
    if (!(await exists(skillPath))) {
      errors.push(`${rel}/: missing SKILL.md`);
      continue;
    }

    const content = await readFile(skillPath, "utf8");
    if (!content.startsWith("---")) {
      errors.push(`${rel}/SKILL.md: missing YAML frontmatter`);
    }
    if (!content.includes("name:")) {
      warnings.push(`${rel}/SKILL.md: frontmatter should include name`);
    }
    if (!content.includes("description:")) {
      errors.push(`${rel}/SKILL.md: frontmatter must include description`);
    }
  }
}

async function validateAgents(pluginRoot, pluginName) {
  const agentsDir = join(pluginRoot, "agents");
  if (!(await exists(agentsDir))) return;

  const files = await readdir(agentsDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const content = await readFile(join(agentsDir, file), "utf8");
    if (!content.includes("description:")) {
      warnings.push(`${pluginName}/agents/${file}: consider adding description in frontmatter`);
    }
  }
}

async function validateRules(pluginRoot, pluginName) {
  const rulesDir = join(pluginRoot, "rules");
  if (!(await exists(rulesDir))) return;

  const files = await readdir(rulesDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const content = await readFile(join(rulesDir, file), "utf8");
    if (!content.startsWith("---")) {
      errors.push(`${pluginName}/rules/${file}: missing YAML frontmatter`);
    }
  }
}

async function validatePluginManifests(pluginRoot, pluginName) {
  const claude = await readJson(
    join(pluginRoot, ".claude-plugin/plugin.json"),
    `${pluginName}/.claude-plugin/plugin.json`,
  );
  const cursor = await readJson(
    join(pluginRoot, ".cursor-plugin/plugin.json"),
    `${pluginName}/.cursor-plugin/plugin.json`,
  );

  if (!claude) {
    errors.push(`${pluginName}: missing .claude-plugin/plugin.json`);
  }
  if (!cursor) {
    errors.push(`${pluginName}: missing .cursor-plugin/plugin.json`);
  }
  if (claude && cursor && claude.name !== cursor.name) {
    errors.push(
      `${pluginName}: plugin name mismatch: claude="${claude.name}" cursor="${cursor.name}"`,
    );
  }
  if (claude && claude.name !== pluginName) {
    warnings.push(`${pluginName}: manifest name "${claude.name}" differs from directory name`);
  }
}

async function validatePlugin(pluginName) {
  const pluginRoot = join(ROOT, pluginName);
  if (!(await exists(pluginRoot))) {
    errors.push(`Plugin directory missing: ${pluginName}/`);
    return;
  }

  await validatePluginManifests(pluginRoot, pluginName);
  await validateSkills(pluginRoot, pluginName);
  await validateAgents(pluginRoot, pluginName);
  await validateRules(pluginRoot, pluginName);
}

async function validateMarketplaces() {
  const claude = await readJson(join(ROOT, ".claude-plugin/marketplace.json"), ".claude-plugin/marketplace.json");
  const cursor = await readJson(join(ROOT, ".cursor-plugin/marketplace.json"), ".cursor-plugin/marketplace.json");

  if (claude && cursor && claude.name !== cursor.name) {
    errors.push(`Marketplace name mismatch: claude="${claude.name}" cursor="${cursor.name}"`);
  }

  const pluginNames = new Set();
  for (const marketplace of [claude, cursor].filter(Boolean)) {
    if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
      errors.push(`${marketplace === claude ? ".claude-plugin" : ".cursor-plugin"}/marketplace.json: plugins array is empty`);
      continue;
    }

    for (const entry of marketplace.plugins) {
      if (!entry.name) {
        errors.push("Marketplace entry missing name");
        continue;
      }
      if (!entry.source) {
        errors.push(`Marketplace entry "${entry.name}": missing source`);
        continue;
      }

      const sourcePath = entry.source.replace(/^\.\//, "");
      if (!(await exists(join(ROOT, sourcePath)))) {
        errors.push(`Marketplace entry "${entry.name}": source not found at ${entry.source}`);
      }

      pluginNames.add(entry.name);
    }
  }

  for (const name of pluginNames) {
    await validatePlugin(name);
  }
}

async function main() {
  await validateMarketplaces();

  if (warnings.length) {
    console.log("Warnings:");
    for (const w of warnings) console.log(`  ⚠ ${w}`);
    console.log();
  }

  if (errors.length) {
    console.error("Validation failed:");
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  console.log("✓ dot-ai structure is valid");
}

main();
