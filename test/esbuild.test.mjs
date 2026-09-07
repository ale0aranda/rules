import assert from "node:assert/strict";
import { describe, it } from "node:test";

import baseConfig, { defineEsbuildConfig } from "../esbuild/base.mjs";
import cliConfig, { defineEsbuildCliConfig } from "../esbuild/cli.mjs";
import nodeConfig, { defineEsbuildNodeConfig } from "../esbuild/node.mjs";
import scriptConfig, { defineEsbuildScriptConfig } from "../esbuild/script.mjs";

describe("esbuild shared configuration", () => {
	it("defines the base defaults", () => {
		assert.deepEqual(baseConfig.entryPoints, ["src/index.ts"]);
		assert.equal(baseConfig.bundle, true);
		assert.equal(baseConfig.format, "esm");
		assert.equal(baseConfig.platform, "node");
		assert.equal(baseConfig.target, "node22");
		assert.equal(baseConfig.outfile, "dist/index.js");
		assert.equal(baseConfig.sourcemap, true);
		assert.equal(baseConfig.treeShaking, true);
		assert.equal(baseConfig.minify, false);
	});

	it("externalizes packages for node builds", () => {
		assert.equal(nodeConfig.packages, "external");
		assert.equal(nodeConfig.minify, false);
	});

	it("configures bundled cli builds", () => {
		assert.equal(cliConfig.packages, "bundle");
		assert.equal(cliConfig.minify, true);
		assert.equal(cliConfig.banner.js, "#!/usr/bin/env node\n");
	});

	it("configures bundled scripts", () => {
		assert.deepEqual(scriptConfig.entryPoints, ["src/script.ts"]);
		assert.equal(scriptConfig.outfile, "dist/script.js");
		assert.equal(scriptConfig.packages, "bundle");
		assert.equal(scriptConfig.minify, true);
	});

	it("allows overriding base options", () => {
		const config = defineEsbuildConfig({
			target: "node24",
			minify: true,
		});

		assert.equal(config.target, "node24");
		assert.equal(config.minify, true);
	});

	it("allows overriding node options", () => {
		const config = defineEsbuildNodeConfig({
			outfile: "build/server.js",
		});

		assert.equal(config.outfile, "build/server.js");
		assert.equal(config.packages, "external");
	});

	it("preserves the cli shebang when merging banner options", () => {
		const config = defineEsbuildCliConfig({
			banner: {
				css: "/* generated */",
			},
		});

		assert.equal(config.banner.js, "#!/usr/bin/env node\n");
		assert.equal(config.banner.css, "/* generated */");
	});

	it("allows overriding script entry and output", () => {
		const config = defineEsbuildScriptConfig({
			entryPoints: ["scripts/generate.ts"],
			outfile: "dist/generate.js",
		});

		assert.deepEqual(config.entryPoints, ["scripts/generate.ts"]);
		assert.equal(config.outfile, "dist/generate.js");
	});
});
