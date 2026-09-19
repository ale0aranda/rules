import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createConsumerVerification } from "./consumer-presets.mjs";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(currentDirectory, "..");

function run(command, arguments_, options = {}) {
	const result = spawnSync(command, arguments_, {
		encoding: "utf8",
		...options,
	});

	assert.equal(result.status, 0, result.stderr || result.stdout);

	return result.stdout;
}

test("installs and loads the published package", async () => {
	const temporaryDirectory = await mkdtemp(
		join(tmpdir(), "ale0aranda-rules-consumer-"),
	);
	const consumerDirectory = join(temporaryDirectory, "consumer");

	try {
		const output = run(
			"npm",
			[
				"pack",
				projectDirectory,
				"--ignore-scripts",
				"--json",
				"--pack-destination",
				temporaryDirectory,
			],
			{ cwd: projectDirectory },
		);
		const [{ filename }] = JSON.parse(output);
		const tarballPath = join(temporaryDirectory, filename);

		await mkdir(consumerDirectory);
		await writeFile(
			join(consumerDirectory, "package.json"),
			JSON.stringify({
				name: "rules-consumer-test",
				private: true,
				type: "module",
			}),
		);

		run(
			"npm",
			[
				"install",
				tarballPath,
				"--ignore-scripts",
				"--no-audit",
				"--no-fund",
				"--package-lock=false",
			],
			{ cwd: consumerDirectory },
		);

		const verificationPath = join(consumerDirectory, "verify.mjs");
		await writeFile(verificationPath, createConsumerVerification());
		run(process.execPath, [verificationPath], { cwd: consumerDirectory });

		await writeFile(
			join(consumerDirectory, "biome.json"),
			JSON.stringify({
				extends: [
					"@ale0aranda/rules/biome/base",
					"@ale0aranda/rules/biome/node",
				],
			}),
		);
		await writeFile(
			join(consumerDirectory, ".gitignore"),
			"node_modules/\ndist/\n",
		);
		await writeFile(
			join(consumerDirectory, "fixture.js"),
			'console.log("Biome consumer test");\n',
		);

		const biomeExecutable =
			process.platform === "win32"
				? join(consumerDirectory, "node_modules", ".bin", "biome.cmd")
				: join(consumerDirectory, "node_modules", ".bin", "biome");
		run(biomeExecutable, ["lint", "fixture.js"], {
			cwd: consumerDirectory,
		});

		const installedPackage = JSON.parse(
			await readFile(
				join(
					consumerDirectory,
					"node_modules",
					"@ale0aranda",
					"rules",
					"package.json",
				),
				"utf8",
			),
		);
		assert.equal(installedPackage.name, "@ale0aranda/rules");
	} finally {
		await rm(temporaryDirectory, { recursive: true, force: true });
	}
});
