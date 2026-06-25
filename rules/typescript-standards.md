---
description: TypeScript coding standards when editing .ts and .tsx files
globs: "**/*.{ts,tsx}"
alwaysApply: false
---

# TypeScript standards

## Types

- Prefer explicit return types on exported functions and public APIs.
- Avoid `any`; use `unknown` and narrow with type guards.
- Prefer `interface` for object shapes that may be extended; `type` for unions and mapped types.

## Async

- Use `async/await` over raw Promise chains.
- Handle errors at boundaries; don't swallow exceptions silently.

## Imports

- Use named imports; avoid default exports for utilities.
- Group: external → internal → relative, with blank lines between groups.

## Naming

- `camelCase` for variables and functions.
- `PascalCase` for types, interfaces, classes, and React components.
- `UPPER_SNAKE_CASE` for module-level constants.

## React (when applicable)

- Prefer function components and hooks.
- Colocate component-specific types with the component file.
