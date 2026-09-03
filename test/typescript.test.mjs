import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(currentDirectory, "..");

const typescriptDirectory = dirname(require.resolve("typescript/package.json"));

const compilerPath = resolve(typescriptDirectory, "bin", "tsc");

const presets = ["base", "web", "node", "library"];

for (const preset of presets) {
	test(`loads the TypeScript ${preset} preset`, async () => {
		const temporaryDirectory = await mkdtemp(
			join(tmpdir(), `ale0aranda-rules-${preset}-`),
		);

		const presetPath = resolve(
			projectDirectory,
			"typescript",
			`${preset}.json`,
		);

		const testConfigPath = join(temporaryDirectory, "tsconfig.json");

		await writeFile(
			testConfigPath,
			JSON.stringify({
				extends: presetPath,
				files: [],
			}),
		);

		try {
			const result = spawnSync(
				process.execPath,
				[compilerPath, "--showConfig", "--project", testConfigPath],
				{
					encoding: "utf8",
				},
			);

			assert.equal(result.status, 0, result.stderr || result.stdout);
		} finally {
			await rm(temporaryDirectory, {
				recursive: true,
				force: true,
			});
		}
	});
}
