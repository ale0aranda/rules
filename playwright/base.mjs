import { defineConfig } from "@playwright/test";

/**
 * @param {import("@playwright/test").PlaywrightTestConfig} [overrides]
 * @returns {import("@playwright/test").PlaywrightTestConfig}
 */
export default function createPlaywrightConfig(overrides = {}) {
	return defineConfig({
		testDir: "./tests",
		fullyParallel: true,
		forbidOnly: Boolean(process.env.CI),
		retries: process.env.CI ? 2 : 0,
		workers: process.env.CI ? 1 : undefined,
		reporter: "html",
		use: {
			trace: "on-first-retry",
		},
		...overrides,
	});
}
