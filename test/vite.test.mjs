import assert from "node:assert/strict";
import { describe, it } from "node:test";

import baseConfig, { defineViteConfig } from "../vite/base.mjs";
import libraryConfig, { defineViteLibraryConfig } from "../vite/library.mjs";
import reactConfig, { defineViteReactConfig } from "../vite/react.mjs";

describe("vite shared configuration", () => {
	it("defines the base defaults", () => {
		assert.equal(baseConfig.build.outDir, "dist");
		assert.equal(baseConfig.build.emptyOutDir, true);
		assert.equal(baseConfig.build.sourcemap, false);
		assert.equal(baseConfig.build.minify, true);
		assert.equal(baseConfig.resolve.alias["@/"], "/src/");
	});

	it("configures React projects", () => {
		assert.ok(reactConfig.plugins.length > 0);

		const pluginNames = reactConfig.plugins.map((plugin) => plugin.name);

		assert.ok(pluginNames.some((name) => name?.startsWith("vite:react")));
	});

	it("configures library builds", () => {
		assert.equal(libraryConfig.build.outDir, "dist");
		assert.equal(libraryConfig.build.emptyOutDir, true);
		assert.equal(libraryConfig.build.sourcemap, true);
		assert.equal(libraryConfig.build.minify, true);
		assert.equal(libraryConfig.build.lib.entry, "src/index.ts");
		assert.deepEqual(libraryConfig.build.lib.formats, ["es"]);
		assert.equal(libraryConfig.build.lib.fileName(), "index.js");
	});

	it("allows overriding base options", () => {
		const config = defineViteConfig({
			build: {
				sourcemap: true,
			},
		});

		assert.equal(config.build.sourcemap, true);
		assert.equal(config.build.outDir, "dist");
	});

	it("preserves React while adding plugins", () => {
		const plugin = {
			name: "custom-plugin",
		};

		const config = defineViteReactConfig({
			plugins: [plugin],
		});

		const pluginNames = config.plugins.map((item) => item.name);

		assert.ok(pluginNames.some((name) => name?.startsWith("vite:react")));
		assert.ok(pluginNames.includes("custom-plugin"));
	});

	it("allows overriding library options", () => {
		const config = defineViteLibraryConfig({
			build: {
				lib: {
					entry: "src/main.ts",
				},
			},
		});

		assert.equal(config.build.lib.entry, "src/main.ts");
		assert.deepEqual(config.build.lib.formats, ["es"]);
	});

	it("supports external library dependencies", () => {
		const config = defineViteLibraryConfig({
			build: {
				rolldownOptions: {
					external: ["react"],
				},
			},
		});

		assert.deepEqual(config.build.rolldownOptions.external, ["react"]);
	});
});
