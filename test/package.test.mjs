import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile as readFileAsync } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
	await readFileAsync(new URL("../package.json", import.meta.url), "utf8"),
);

function packagePath(path) {
	return resolve(projectDirectory, path);
}

function assertPackagePath(path, message) {
	assert.ok(existsSync(packagePath(path)), message);
}

test("exports every package entry", () => {
	for (const [exportPath, target] of Object.entries(packageJson.exports)) {
		if (exportPath === "./package.json") {
			assert.equal(target, "./package.json");
			continue;
		}

		if (typeof target === "string") {
			assertPackagePath(
				target,
				`Export ${exportPath} points to a missing file: ${target}`,
			);
			continue;
		}

		assert.equal(typeof target, "object");
		assertPackagePath(
			target.types,
			`Export ${exportPath} points to missing types: ${target.types}`,
		);
		assertPackagePath(
			target.default,
			`Export ${exportPath} points to a missing module: ${target.default}`,
		);
	}
});

test("ships every declared package file", () => {
	for (const file of packageJson.files) {
		assertPackagePath(file, `Package file does not exist: ${file}`);
	}
});

test("keeps package aliases consistent", () => {
	assert.equal(
		packageJson.exports["./biome"],
		packageJson.exports["./biome/base"],
	);
	assert.deepEqual(
		packageJson.exports["./tsup"],
		packageJson.exports["./tsup/base"],
	);
	assert.deepEqual(
		packageJson.exports["./next"],
		packageJson.exports["./next/base"],
	);
});
