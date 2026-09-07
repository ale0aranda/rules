import { defineViteConfig } from "./base.mjs";

/**
 * @param {import("vite").UserConfig} [overrides]
 * @returns {import("vite").UserConfig}
 */
export function defineViteLibraryConfig(overrides = {}) {
	/** @type {NonNullable<import("vite").UserConfig["build"]>} */
	const build = {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: true,
		minify: true,
		...overrides.build,
		lib: {
			entry: "src/index.ts",
			formats: ["es"],
			fileName: () => "index.js",
			...overrides.build?.lib,
		},
		rolldownOptions: {
			...overrides.build?.rolldownOptions,
		},
	};

	return defineViteConfig({
		...overrides,
		build,
	});
}

export default defineViteLibraryConfig();
