import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(
	await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

test("exports every public preset", () => {
	assert.equal(packageJson.exports["./biome"], "./biome/base.json");

	assert.deepEqual(packageJson.exports["./commitlint"], {
		types: "./types/commitlint.d.mts",
		default: "./commitlint.mjs",
	});

	assert.equal(packageJson.exports["./renovate"], "./default.json");

	assert.equal(packageJson.exports["./package.json"], "./package.json");

	assert.deepEqual(packageJson.exports["./lint-staged"], {
		types: "./types/lint-staged.config.d.mts",
		default: "./lint-staged.config.mjs",
	});
});

test("ships every public preset", () => {
	assert.ok(packageJson.files.includes("biome.json"));
	assert.ok(packageJson.files.includes("biome"));
	assert.ok(packageJson.files.includes("commitlint.mjs"));
	assert.ok(packageJson.files.includes("default.json"));
	assert.ok(packageJson.files.includes("typescript"));
	assert.ok(packageJson.files.includes("types"));
	assert.ok(packageJson.files.includes("README.md"));
	assert.ok(packageJson.files.includes("LICENSE"));
	assert.ok(packageJson.files.includes("lint-staged.config.mjs"));
});

test("exports every Biome preset", () => {
	assert.equal(packageJson.exports["./biome/base"], "./biome/base.json");
	assert.equal(packageJson.exports["./biome/web"], "./biome/web.json");
	assert.equal(packageJson.exports["./biome/node"], "./biome/node.json");
	assert.equal(packageJson.exports["./biome/library"], "./biome/library.json");

	assert.equal(
		packageJson.exports["./biome/monorepo"],
		"./biome/monorepo.json",
	);
});

test("exports every TypeScript preset", () => {
	assert.equal(
		packageJson.exports["./typescript/base"],
		"./typescript/base.json",
	);

	assert.equal(
		packageJson.exports["./typescript/web"],
		"./typescript/web.json",
	);

	assert.equal(
		packageJson.exports["./typescript/node"],
		"./typescript/node.json",
	);

	assert.equal(
		packageJson.exports["./typescript/library"],
		"./typescript/library.json",
	);
});

test("exports typed tsup presets", () => {
	assert.deepEqual(packageJson.exports["./tsup"], {
		types: "./types/tsup/base.d.mts",
		default: "./tsup/base.mjs",
	});

	assert.deepEqual(packageJson.exports["./tsup/base"], {
		types: "./types/tsup/base.d.mts",
		default: "./tsup/base.mjs",
	});

	assert.deepEqual(packageJson.exports["./tsup/cli"], {
		types: "./types/tsup/cli.d.mts",
		default: "./tsup/cli.mjs",
	});

	assert.deepEqual(packageJson.exports["./tsup/library"], {
		types: "./types/tsup/library.d.mts",
		default: "./tsup/library.mjs",
	});
});

test("exports typed build presets", () => {
	const typedExports = {
		"./unbuild": ["./types/unbuild/base.d.mts", "./unbuild/base.mjs"],
		"./unbuild/base": ["./types/unbuild/base.d.mts", "./unbuild/base.mjs"],
		"./unbuild/library": [
			"./types/unbuild/library.d.mts",
			"./unbuild/library.mjs",
		],

		"./esbuild": ["./types/esbuild/base.d.mts", "./esbuild/base.mjs"],
		"./esbuild/base": ["./types/esbuild/base.d.mts", "./esbuild/base.mjs"],
		"./esbuild/cli": ["./types/esbuild/cli.d.mts", "./esbuild/cli.mjs"],
		"./esbuild/node": ["./types/esbuild/node.d.mts", "./esbuild/node.mjs"],
		"./esbuild/script": [
			"./types/esbuild/script.d.mts",
			"./esbuild/script.mjs",
		],

		"./vite": ["./types/vite/base.d.mts", "./vite/base.mjs"],
		"./vite/base": ["./types/vite/base.d.mts", "./vite/base.mjs"],
		"./vite/library": ["./types/vite/library.d.mts", "./vite/library.mjs"],
		"./vite/react": ["./types/vite/react.d.mts", "./vite/react.mjs"],

		"./next": ["./types/next/base.d.mts", "./next/base.mjs"],
		"./next/base": ["./types/next/base.d.mts", "./next/base.mjs"],

		"./vitest/base": ["./types/vitest/base.d.mts", "./vitest/base.mjs"],
		"./vitest/node": ["./types/vitest/node.d.mts", "./vitest/node.mjs"],
		"./vitest/web": ["./types/vitest/web.d.mts", "./vitest/web.mjs"],
	};

	for (const [exportPath, [types, defaultExport]] of Object.entries(
		typedExports,
	)) {
		assert.deepEqual(packageJson.exports[exportPath], {
			types,
			default: defaultExport,
		});
	}
});
