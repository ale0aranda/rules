import assert from "node:assert/strict";

import test from "node:test";

const { default: createPlaywrightConfig } = await import(
	"../playwright/base.mjs"
);

test("creates the default Playwright configuration", () => {
	const previousCI = process.env.CI;
	delete process.env.CI;

	try {
		const config = createPlaywrightConfig();

		assert.equal(config.testDir, "./tests");
		assert.equal(config.fullyParallel, true);
		assert.equal(config.forbidOnly, false);
		assert.equal(config.reporter, "html");
		assert.deepEqual(config.use, {
			trace: "on-first-retry",
		});
	} finally {
		if (previousCI === undefined) {
			delete process.env.CI;
		} else {
			process.env.CI = previousCI;
		}
	}
});

test("enables CI-specific defaults in CI", () => {
	const previousCI = process.env.CI;
	process.env.CI = "true";

	try {
		const config = createPlaywrightConfig();

		assert.equal(config.forbidOnly, true);
		assert.equal(config.retries, 2);
		assert.equal(config.workers, 1);
	} finally {
		if (previousCI === undefined) {
			delete process.env.CI;
		} else {
			process.env.CI = previousCI;
		}
	}
});

test("merges configuration overrides", () => {
	const config = createPlaywrightConfig({
		testDir: "./e2e",
		timeout: 30_000,
		use: {
			baseURL: "http://localhost:3000",
		},
	});

	assert.equal(config.testDir, "./e2e");
	assert.equal(config.timeout, 30_000);
	assert.deepEqual(config.use, {
		baseURL: "http://localhost:3000",
	});
});
