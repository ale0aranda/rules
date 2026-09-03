# @ale0aranda/rules

Shared development rules and presets for Alejandro Aranda's projects.

The package provides configurations for:

- Biome
- Commitlint with Conventional Commits and emojis
- TypeScript
- Renovate

## Requirements

- Node.js 22.13 or newer
- Biome 2
- Commitlint 21
- TypeScript 5.7 or newer

## Installation

```bash
pnpm add -D @ale0aranda/rules @biomejs/biome @commitlint/cli typescript
```

For Node.js projects, also install its type definitions:

```bash
pnpm add -D @types/node
```

## Biome

Create a `biome.json` file:

```json
{
  "extends": ["@ale0aranda/rules/biome"]
}
```

The preset includes:

- Two-space indentation
- Single quotes
- Required semicolons
- No trailing commas
- 80-character line width
- Organized imports
- Type-only import groups
- CSS and Tailwind CSS support
- Recommended lint rules

You can override any setting locally:

```json
{
  "extends": ["@ale0aranda/rules/biome"],
  "formatter": {
    "lineWidth": 100
  }
}
```

## Commitlint

Create `commitlint.config.mjs`:

```js
export { default } from '@ale0aranda/rules/commitlint';
```

Example commits:

```text
✨ feat: add user authentication
🐛 fix(api): handle missing token
📚 docs: update installation guide
♻️ refactor(core): simplify configuration
✅ test: cover package exports
🔧 chore: update tooling
🚀 ci: automate releases
```

Validate a commit manually:

```bash
echo "✨ feat: add shared rules" | pnpm exec commitlint
```

## TypeScript

### Base

```json
{
  "extends": "@ale0aranda/rules/typescript/base",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"]
}
```

### Web

Recommended for browser projects, Astro, React, Vue and Svelte:

```json
{
  "extends": "@ale0aranda/rules/typescript/web",
  "include": ["src"]
}
```

### Node.js

```json
{
  "extends": "@ale0aranda/rules/typescript/node",
  "include": ["src"]
}
```

### npm library

```json
{
  "extends": "@ale0aranda/rules/typescript/library",
  "include": ["src"]
}
```

The shared TypeScript settings include:

- Strict type checking
- JavaScript type checking
- Exact optional properties
- Bracket access for index signatures
- Isolated modules
- Verbatim module syntax
- Biome-managed unused variables

## Renovate

Install the Renovate GitHub App and create `renovate.json`:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>ale0aranda/rules"]
}
```

The preset provides:

- Weekly dependency updates
- Dependency Dashboard
- Three-day minimum release age
- Grouped non-major updates
- Separate major update approval
- GitHub Actions updates
- Conventional commits with emojis
- pnpm lockfile deduplication

To use a fixed release of the preset:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>ale0aranda/rules#v0.3.0"]
}
```

## Available exports

| Export | Purpose |
| --- | --- |
| `@ale0aranda/rules/biome` | Biome configuration |
| `@ale0aranda/rules/commitlint` | Commitlint configuration |
| `@ale0aranda/rules/typescript/base` | Base TypeScript configuration |
| `@ale0aranda/rules/typescript/web` | Browser and framework projects |
| `@ale0aranda/rules/typescript/node` | Node.js projects |
| `@ale0aranda/rules/typescript/library` | Published npm libraries |
| `@ale0aranda/rules/renovate` | Renovate preset file |

Renovate should normally consume the GitHub-hosted preset instead of the npm export.

## Development

Install dependencies:

```bash
pnpm install
```

Format the repository:

```bash
pnpm format
```

Run every check:

```bash
pnpm check
```

Inspect package contents:

```bash
pnpm pack --dry-run
```

## Releases

Create one changeset for each publishable feature or fix:

```bash
pnpm changeset
```

Changesets creates a version pull request. Merging that pull request publishes the package automatically through npm Trusted Publishing.

A changeset is not required for documentation, tests, CI changes or development dependency updates that do not affect consumers.

## License

[MIT](./LICENSE)
