import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

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
			{
				cwd: projectDirectory,
			},
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
			{
				cwd: consumerDirectory,
			},
		);

		const verificationPath = join(consumerDirectory, "verify.mjs");

		await writeFile(
			verificationPath,
			`
        import commitlint from "@ale0aranda/rules/commitlint";
        import lintStaged from "@ale0aranda/rules/lint-staged";

        import biome from "@ale0aranda/rules/biome"
          with { type: "json" };
        import biomeBase from "@ale0aranda/rules/biome/base"
          with { type: "json" };
        import biomeWeb from "@ale0aranda/rules/biome/web"
          with { type: "json" };
        import biomeNode from "@ale0aranda/rules/biome/node"
          with { type: "json" };
        import biomeLibrary from "@ale0aranda/rules/biome/library"
          with { type: "json" };
        import biomeMonorepo from "@ale0aranda/rules/biome/monorepo"
          with { type: "json" };

        import renovate from "@ale0aranda/rules/renovate"
          with { type: "json" };

        import knip from "@ale0aranda/rules/knip"
          with { type: "json" };

        import typescriptBase from "@ale0aranda/rules/typescript/base"
          with { type: "json" };
        import typescriptWeb from "@ale0aranda/rules/typescript/web"
          with { type: "json" };
        import typescriptNode from "@ale0aranda/rules/typescript/node"
          with { type: "json" };
        import typescriptLibrary from "@ale0aranda/rules/typescript/library"
          with { type: "json" };

        import vitestBase from "@ale0aranda/rules/vitest/base";
        import vitestNode from "@ale0aranda/rules/vitest/node";
        import vitestWeb from "@ale0aranda/rules/vitest/web";

        import tsupBase, {
          defineTsupConfig,
        } from "@ale0aranda/rules/tsup/base";
        import tsupLibrary, {
          defineTsupLibraryConfig,
        } from "@ale0aranda/rules/tsup/library";
        import tsupCli, {
          defineTsupCliConfig,
        } from "@ale0aranda/rules/tsup/cli";

        import unbuildBase, {
          defineUnbuildConfig,
        } from "@ale0aranda/rules/unbuild/base";
        import unbuildLibrary, {
          defineUnbuildLibraryConfig,
        } from "@ale0aranda/rules/unbuild/library";

        import esbuildBase, {
          defineEsbuildConfig,
        } from "@ale0aranda/rules/esbuild/base";
        import esbuildNode, {
          defineEsbuildNodeConfig,
        } from "@ale0aranda/rules/esbuild/node";
        import esbuildCli, {
          defineEsbuildCliConfig,
        } from "@ale0aranda/rules/esbuild/cli";
        import esbuildScript, {
          defineEsbuildScriptConfig,
        } from "@ale0aranda/rules/esbuild/script";

        import viteBase, {
          defineViteConfig,
        } from "@ale0aranda/rules/vite/base";
        import viteReact, {
          defineViteReactConfig,
        } from "@ale0aranda/rules/vite/react";
        import viteLibrary, {
          defineViteLibraryConfig,
        } from "@ale0aranda/rules/vite/library";

        import nextBase, {
          defineNextConfig,
        } from "@ale0aranda/rules/next/base";

        if (Object.keys(lintStaged).length === 0) {
          throw new Error(
            "lint-staged preset could not be loaded",
          );
        }

        if (!commitlint.rules) {
          throw new Error(
            "Commitlint preset could not be loaded",
          );
        }

        if (!biome.formatter || !biome.linter) {
          throw new Error(
            "Default Biome preset could not be loaded",
          );
        }

        if (biome !== biomeBase) {
          throw new Error(
            "Default Biome export is not the base preset",
          );
        }

        const biomePresets = [
          biomeBase,
          biomeWeb,
          biomeNode,
          biomeLibrary,
          biomeMonorepo,
        ];

        if (
          biomePresets.some(
            (preset) => typeof preset !== "object",
          )
        ) {
          throw new Error(
            "A Biome preset could not be loaded",
          );
        }

        const specializedBiomePresets = [
          biomeWeb,
          biomeNode,
          biomeLibrary,
          biomeMonorepo,
        ];

        if (
          specializedBiomePresets.some(
            (preset) => Object.hasOwn(preset, "extends"),
          )
        ) {
          throw new Error(
            "Specialized Biome presets must not extend other configurations",
          );
        }

        if (
          biomeNode.linter?.rules?.suspicious?.noConsole !==
          "off"
        ) {
          throw new Error(
            "Biome Node.js preset must allow console usage",
          );
        }

        if (
          biomeLibrary.linter?.rules?.suspicious?.noConsole !==
          "error"
        ) {
          throw new Error(
            "Biome library preset must reject console usage",
          );
        }

        if (!renovate.packageRules) {
          throw new Error(
            "Renovate preset could not be loaded",
          );
        }

        if (!Array.isArray(knip.include)) {
          throw new Error(
            "Knip preset could not be loaded",
          );
        }

        const typescriptPresets = [
          typescriptBase,
          typescriptWeb,
          typescriptNode,
          typescriptLibrary,
        ];

        if (
          typescriptPresets.some(
            (preset) => !preset.compilerOptions,
          )
        ) {
          throw new Error(
            "A TypeScript preset could not be loaded",
          );
        }

        const vitestPresets = [
          vitestBase,
          vitestNode,
          vitestWeb,
        ];

        if (
          vitestPresets.some(
            (preset) => typeof preset !== "object",
          )
        ) {
          throw new Error(
            "A Vitest preset could not be loaded",
          );
        }

        if (
          typeof defineTsupConfig !== "function" ||
          typeof defineTsupLibraryConfig !== "function" ||
          typeof defineTsupCliConfig !== "function"
        ) {
          throw new Error(
            "A tsup helper could not be loaded",
          );
        }

        if (
          !tsupBase.entry ||
          !tsupLibrary.dts ||
          !tsupCli.banner?.js
        ) {
          throw new Error(
            "A tsup preset could not be loaded",
          );
        }

        if (
          typeof defineUnbuildConfig !== "function" ||
          typeof defineUnbuildLibraryConfig !== "function"
        ) {
          throw new Error(
            "An unbuild helper could not be loaded",
          );
        }

        if (
          !unbuildBase.entries ||
          unbuildLibrary.rollup?.emitCJS !== false
        ) {
          throw new Error(
            "An unbuild preset could not be loaded",
          );
        }

        if (
          typeof defineEsbuildConfig !== "function" ||
          typeof defineEsbuildNodeConfig !== "function" ||
          typeof defineEsbuildCliConfig !== "function" ||
          typeof defineEsbuildScriptConfig !== "function"
        ) {
          throw new Error(
            "An esbuild helper could not be loaded",
          );
        }

        if (
          esbuildBase.format !== "esm" ||
          esbuildNode.packages !== "external" ||
          esbuildCli.banner?.js !== "#!/usr/bin/env node\\n" ||
          !esbuildScript.entryPoints
        ) {
          throw new Error(
            "An esbuild preset could not be loaded",
          );
        }

        if (
          typeof defineViteConfig !== "function" ||
          typeof defineViteReactConfig !== "function" ||
          typeof defineViteLibraryConfig !== "function"
        ) {
          throw new Error(
            "A Vite helper could not be loaded",
          );
        }

        if (
          viteBase.build?.outDir !== "dist" ||
          !viteReact.plugins?.length ||
          viteLibrary.build?.lib?.formats?.[0] !== "es"
        ) {
          throw new Error(
            "A Vite preset could not be loaded",
          );
        }

        if (typeof defineNextConfig !== "function") {
          throw new Error(
            "Next.js helper could not be loaded",
          );
        }

        if (
          nextBase.poweredByHeader !== false ||
          nextBase.typescript?.ignoreBuildErrors !== false
        ) {
          throw new Error(
            "Next.js preset could not be loaded",
          );
        }
      `,
		);

		run(process.execPath, [verificationPath], {
			cwd: consumerDirectory,
		});

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
		await rm(temporaryDirectory, {
			recursive: true,
			force: true,
		});
	}
});
