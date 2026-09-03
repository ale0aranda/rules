import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(
	await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

test("exports every public preset", () => {
	assert.equal(packageJson.exports["./biome"], "./biome/base.json");

	assert.equal(packageJson.exports["./commitlint"], "./commitlint.mjs");

	assert.equal(packageJson.exports["./renovate"], "./default.json");

	assert.equal(packageJson.exports["./package.json"], "./package.json");
});

test("ships every public preset", () => {
	assert.ok(packageJson.files.includes("biome.json"));
	assert.ok(packageJson.files.includes("biome"));
	assert.ok(packageJson.files.includes("commitlint.mjs"));
	assert.ok(packageJson.files.includes("default.json"));
	assert.ok(packageJson.files.includes("typescript"));
	assert.ok(packageJson.files.includes("README.md"));
	assert.ok(packageJson.files.includes("LICENSE"));
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
