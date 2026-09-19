# @ale0aranda/rules

[![Quality](https://github.com/ale0aranda/rules/actions/workflows/quality.yml/badge.svg)](https://github.com/ale0aranda/rules/actions/workflows/quality.yml)
[![npm version](https://img.shields.io/npm/v/%40ale0aranda%2Frules)](https://www.npmjs.com/package/@ale0aranda/rules)
[![npm downloads](https://img.shields.io/npm/dm/%40ale0aranda%2Frules)](https://www.npmjs.com/package/@ale0aranda/rules)
[![License](https://img.shields.io/npm/l/%40ale0aranda%2Frules)](./LICENSE)

Shared, opinionated development presets for modern TypeScript and
JavaScript projects.

One package for formatting, linting, testing, builds, type checking,
dependency maintenance, and release quality.

## Install

```bash
pnpm add -D @ale0aranda/rules
```

Install the tool required by the preset you use:

```bash
pnpm add -D @biomejs/biome typescript
pnpm add -D @commitlint/cli
pnpm add -D @playwright/test
pnpm add -D @vitejs/plugin-react vite vitest
pnpm add -D esbuild tsup unbuild
```

Use the package with npm or Yarn if preferred:

```bash
npm install --save-dev @ale0aranda/rules
yarn add --dev @ale0aranda/rules
```

## Compatibility

| Tool | Supported versions |
| --- | --- |
| Node.js | `>=22.13` |
| Biome | `>=2.5.7 <3` |
| Commitlint | `>=21 <22` |
| Playwright | `>=1.63 <2` |
| TypeScript | `>=5.7 <8` |
| esbuild | `>=0.27 <1` |
| tsup | `>=8.5.1 <9` |
| unbuild | `>=3 <4` |
| Vite | `>=8 <9` |
| Vitest | `>=5 <6` |
| `@vitejs/plugin-react` | `>=6 <7` |

The package itself is published as ESM and uses pnpm for development.

## Presets

| Export | Type | Use |
| --- | --- | --- |
| `biome` | JSON | Default Biome rules |
| `biome/base` | JSON | Base Biome rules |
| `biome/web` | JSON | Browser and framework projects |
| `biome/node` | JSON | Node.js projects |
| `biome/library` | JSON | Published libraries |
| `biome/monorepo` | JSON | Monorepos |
| `commitlint` | JS | Conventional Commit validation |
| `lint-staged` | JS | Biome on staged files |
| `renovate` | JSON | Renovate dependency automation |
| `knip` | JSON | Dead code and dependency checks |
| `typescript/base` | JSON | Shared strict TypeScript settings |
| `typescript/web` | JSON | Web applications |
| `typescript/node` | JSON | Node.js applications |
| `typescript/library` | JSON | TypeScript libraries |
| `vitest/base` | JS | Shared Vitest defaults |
| `vitest/node` | JS | Node.js Vitest projects |
| `vitest/web` | JS | Browser and web Vitest projects |
| `playwright` | JS | Playwright E2E defaults |
| `vite` | JS | Shared Vite defaults |
| `vite/base` | JS | Base Vite configuration |
| `vite/react` | JS | Vite with React |
| `vite/library` | JS | Vite library builds |
| `next` | JS | Shared Next.js defaults |
| `next/base` | JS | Explicit Next.js base config |
| `tsup` | JS | Shared tsup defaults |
| `tsup/base` | JS | Base tsup configuration |
| `tsup/cli` | JS | Executable CLI builds |
| `tsup/library` | JS | Library builds with declarations |
| `unbuild` | JS | Shared unbuild defaults |
| `unbuild/base` | JS | Base unbuild configuration |
| `unbuild/library` | JS | ESM library builds |
| `esbuild` | JS | Shared esbuild defaults |
| `esbuild/base` | JS | Base esbuild configuration |
| `esbuild/node` | JS | Externalized Node.js builds |
| `esbuild/cli` | JS | Bundled executable builds |
| `esbuild/script` | JS | Script builds |
| `package.json` | JSON | Package metadata |

## Quick setup

### Biome

Create `biome.json`:

```json
{
  "extends": ["@ale0aranda/rules/biome"]
}
```

Choose a specialized preset when needed:

```json
{
  "extends": ["@ale0aranda/rules/biome/web"]
}
```

### TypeScript

Create `tsconfig.json`:

```json
{
  "extends": "@ale0aranda/rules/typescript/node",
  "include": ["src", "scripts"]
}
```

Available targets are `base`, `web`, `node`, and `library`.

### Commitlint

Create `commitlint.config.mjs`:

```js
export { default } from "@ale0aranda/rules/commitlint";
```

Examples accepted by the shared configuration:

```text
✨ feat: add authentication
🐛 fix(api): handle missing token
📚 docs: improve installation guide
♻️ refactor(core): simplify configuration
✅ test: cover the package export
🔧 chore: update tooling
```

Validate a commit locally:

```bash
echo "✨ feat: add shared rules" | pnpm exec commitlint
```

### Vitest

Create `vitest.config.mjs`:

```js
import { mergeConfig } from "vitest/config";

import baseConfig from "@ale0aranda/rules/vitest/base";

export default mergeConfig(baseConfig, {
  test: { include: ["src/**/*.test.ts"] },
});
```

Use `vitest/node` or `vitest/web` when you want an explicit environment.
The shared base enables mocks reset/restore and 80% V8 coverage thresholds.

### Playwright

Create `playwright.config.mjs`:

```js
import createPlaywrightConfig from "@ale0aranda/rules/playwright";

export default createPlaywrightConfig({
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
  },
});
```

The preset provides parallel tests, CI retries, HTML reports, and traces on
the first retry. Put E2E tests in `tests/` by default.

### Vite

Create `vite.config.mjs`:

```js
import { defineViteReactConfig } from "@ale0aranda/rules/vite/react";

export default defineViteReactConfig();
```

Other helpers are available from `vite/base` and `vite/library`.

### Next.js

Create `next.config.mjs`:

```js
import { defineNextConfig } from "@ale0aranda/rules/next";

export default defineNextConfig({
  reactStrictMode: true,
});
```

The defaults disable the `X-Powered-By` header and fail builds on TypeScript
errors.

### Build tools

Every JavaScript build preset exposes a typed helper and a default config:

```js
import { defineTsupLibraryConfig } from "@ale0aranda/rules/tsup/library";

export default defineTsupLibraryConfig({
  entry: ["src/index.ts"],
});
```

Available helpers:

- `tsup/base`, `tsup/cli`, `tsup/library`
- `unbuild/base`, `unbuild/library`
- `esbuild/base`, `esbuild/node`, `esbuild/cli`, `esbuild/script`

All helpers accept an optional configuration object and preserve local
overrides.

### Renovate

Create `renovate.json`:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>ale0aranda/rules"]
}
```

The preset enables a dependency dashboard, weekly updates, a three-day
minimum release age, grouped non-major updates, GitHub Actions updates,
pnpm deduplication, and approval for major updates.

To consume a fixed GitHub revision:

```json
{
  "extends": ["github>ale0aranda/rules#v0.6.3"]
}
```

## Quality guarantees

This repository validates the package itself with:

```bash
pnpm check
```

That command runs:

- Biome formatting and linting
- Generated declaration type checking
- Unit and consumer tests for every public export
- Package export and file integrity checks
- `publint`

The GitHub Actions workflow runs the same checks on pushes and pull requests.
The release workflow creates a Changesets release pull request and publishes
to npm with provenance after it is merged.

Inspect the exact published contents before releasing:

```bash
pnpm pack --dry-run
```

## Development

```bash
pnpm install
pnpm format
pnpm check
```

Add a publishable change:

```bash
pnpm changeset
```

Changesets are required for consumer-facing features and fixes. Documentation,
tests, CI-only changes, and development dependency updates normally do not need
one.

## License

[MIT](./LICENSE)
