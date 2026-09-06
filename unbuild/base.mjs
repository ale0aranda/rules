/**
 * @param {import("unbuild").BuildConfig} [overrides]
 * @returns {import("unbuild").BuildConfig}
 */
export function defineUnbuildConfig(overrides = {}) {
	return {
		entries: ["./src/index"],
		outDir: "dist",
		clean: true,
		sourcemap: true,
		declaration: true,
		...overrides,
	};
}

export default defineUnbuildConfig();
