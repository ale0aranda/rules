import assert from "node:assert/strict";
import { describe, it } from "node:test";

import baseConfig, { defineTsupConfig } from "../tsup/base.mjs";
import cliConfig, { defineTsupCliConfig } from "../tsup/cli.mjs";
import libraryConfig, { defineTsupLibraryConfig } from "../tsup/library.mjs";

describe("tsup shared configuration", () => {
	it("defines the base defaults", () => {
		assert.deepEqual(baseConfig.entry, ["src/index.ts"]);
		assert.deepEqual(baseConfig.format, ["esm"]);
		assert.equal(baseConfig.target, "node22");
		assert.equal(baseConfig.platform, "node");
		assert.equal(baseConfig.outDir, "dist");
		assert.equal(baseConfig.clean, true);
		assert.equal(baseConfig.sourcemap, true);
		assert.equal(baseConfig.treeshake, true);
		assert.equal(baseConfig.splitting, false);
		assert.equal(baseConfig.minify, false);
	});

	it("enables declarations for libraries", () => {
		assert.equal(libraryConfig.dts, true);
		assert.equal(libraryConfig.minify, false);
	});

	it("configures cli builds", () => {
		assert.equal(cliConfig.dts, true);
		assert.equal(cliConfig.minify, true);
		assert.equal(cliConfig.banner.js, "#!/usr/bin/env node\n");
	});

	it("allows overriding base options", () => {
		const config = defineTsupConfig({
			target: "node24",
			minify: true,
		});

		assert.equal(config.target, "node24");
		assert.equal(config.minify, true);
	});

	it("allows overriding library options", () => {
		const config = defineTsupLibraryConfig({
			entry: ["src/main.ts"],
		});

		assert.deepEqual(config.entry, ["src/main.ts"]);
		assert.equal(config.dts, true);
	});

	it("preserves the cli shebang when merging banner options", () => {
		const config = defineTsupCliConfig({
			banner: {
				css: "/* generated */",
			},
		});

		assert.equal(config.banner.js, "#!/usr/bin/env node\n");
		assert.equal(config.banner.css, "/* generated */");
	});
});
