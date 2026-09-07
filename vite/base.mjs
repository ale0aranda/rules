/**
 * @param {import("vite").UserConfig} [overrides]
 * @returns {import("vite").UserConfig}
 */
export function defineViteConfig(overrides = {}) {
	const resolve = {
		alias: {
			"@/": "/src/",
			...overrides.resolve?.alias,
		},
		...overrides.resolve,
	};

	const build = {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: false,
		minify: true,
		...overrides.build,
	};

	return {
		...overrides,
		resolve,
		build,
	};
}

export default defineViteConfig();
