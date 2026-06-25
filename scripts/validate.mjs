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

async function validateSkills() {
  const skillsDir = join(ROOT, "skills");
  if (!(await exists(skillsDir))) {
    errors.push("Missing skills/ directory");
    return;
  }

  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skillDirs = entries.filter((e) => e.isDirectory());

  if (skillDirs.length === 0) {
    warnings.push("No skills found in skills/");
  }

  for (const dir of skillDirs) {
    const skillPath = join(skillsDir, dir.name, "SKILL.md");
    if (!(await exists(skillPath))) {
      errors.push(`skills/${dir.name}/: missing SKILL.md`);
      continue;
    }

    const content = await readFile(skillPath, "utf8");
    if (!content.startsWith("---")) {
      errors.push(`skills/${dir.name}/SKILL.md: missing YAML frontmatter`);
    }
    if (!content.includes("name:")) {
      warnings.push(`skills/${dir.name}/SKILL.md: frontmatter should include name`);
    }
    if (!content.includes("description:")) {
      errors.push(`skills/${dir.name}/SKILL.md: frontmatter must include description`);
    }
  }
}

async function validateAgents() {
  const agentsDir = join(ROOT, "agents");
  if (!(await exists(agentsDir))) return;

  const files = await readdir(agentsDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const content = await readFile(join(agentsDir, file), "utf8");
    if (!content.includes("description:")) {
      warnings.push(`agents/${file}: consider adding description in frontmatter`);
    }
  }
}

async function validateRules() {
  const rulesDir = join(ROOT, "rules");
  if (!(await exists(rulesDir))) return;

  const files = await readdir(rulesDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const content = await readFile(join(rulesDir, file), "utf8");
    if (!content.startsWith("---")) {
      errors.push(`rules/${file}: missing YAML frontmatter`);
    }
  }
}

async function validateManifests() {
  const claude = await readJson(join(ROOT, ".claude-plugin/plugin.json"), ".claude-plugin/plugin.json");
  const cursor = await readJson(join(ROOT, ".cursor-plugin/plugin.json"), ".cursor-plugin/plugin.json");

  if (claude && cursor && claude.name !== cursor.name) {
    errors.push(`Plugin name mismatch: claude="${claude.name}" cursor="${cursor.name}"`);
  }
}

async function main() {
  await validateManifests();
  await validateSkills();
  await validateAgents();
  await validateRules();

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
