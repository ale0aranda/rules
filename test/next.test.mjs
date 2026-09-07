import assert from "node:assert/strict";
import { describe, it } from "node:test";

import baseConfig, { defineNextConfig } from "../next/base.mjs";

describe("next shared configuration", () => {
	it("defines the base defaults", () => {
		assert.equal(baseConfig.poweredByHeader, false);
		assert.equal(baseConfig.trailingSlash, false);
		assert.equal(baseConfig.typescript.ignoreBuildErrors, false);
	});

	it("allows overriding base options", () => {
		const config = defineNextConfig({
			reactStrictMode: true,
			output: "standalone",
		});

		assert.equal(config.reactStrictMode, true);
		assert.equal(config.output, "standalone");
		assert.equal(config.poweredByHeader, false);
	});

	it("allows overriding poweredByHeader", () => {
		const config = defineNextConfig({
			poweredByHeader: true,
		});

		assert.equal(config.poweredByHeader, true);
	});

	it("allows overriding trailingSlash", () => {
		const config = defineNextConfig({
			trailingSlash: true,
		});

		assert.equal(config.trailingSlash, true);
	});

	it("preserves TypeScript defaults", () => {
		const config = defineNextConfig({
			typescript: {},
		});

		assert.equal(config.typescript.ignoreBuildErrors, false);
	});

	it("allows explicitly overriding TypeScript options", () => {
		const config = defineNextConfig({
			typescript: {
				ignoreBuildErrors: true,
			},
		});

		assert.equal(config.typescript.ignoreBuildErrors, true);
	});
});
