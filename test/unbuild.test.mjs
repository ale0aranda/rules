import assert from "node:assert/strict";
import { describe, it } from "node:test";

import baseConfig, { defineUnbuildConfig } from "../unbuild/base.mjs";
import libraryConfig, {
	defineUnbuildLibraryConfig,
} from "../unbuild/library.mjs";

describe("unbuild shared configuration", () => {
	it("defines the base defaults", () => {
		assert.deepEqual(baseConfig.entries, ["./src/index"]);
		assert.equal(baseConfig.outDir, "dist");
		assert.equal(baseConfig.clean, true);
		assert.equal(baseConfig.sourcemap, true);
		assert.equal(baseConfig.declaration, true);
	});

	it("configures ESM-only library builds", () => {
		assert.equal(libraryConfig.declaration, true);
		assert.equal(libraryConfig.rollup.emitCJS, false);
	});

	it("allows overriding base options", () => {
		const config = defineUnbuildConfig({
			outDir: "build",
			sourcemap: false,
		});

		assert.equal(config.outDir, "build");
		assert.equal(config.sourcemap, false);
	});

	it("allows overriding library options", () => {
		const config = defineUnbuildLibraryConfig({
			entries: ["./src/main"],
		});

		assert.deepEqual(config.entries, ["./src/main"]);
		assert.equal(config.rollup.emitCJS, false);
	});

	it("merges rollup options", () => {
		const config = defineUnbuildLibraryConfig({
			rollup: {
				inlineDependencies: true,
			},
		});

		assert.equal(config.rollup.emitCJS, false);
		assert.equal(config.rollup.inlineDependencies, true);
	});

	it("allows overriding ESM-only defaults", () => {
		const config = defineUnbuildLibraryConfig({
			rollup: {
				emitCJS: true,
			},
		});

		assert.equal(config.rollup.emitCJS, true);
	});
});
