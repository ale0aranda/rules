/**
 * @param {import("esbuild").BuildOptions} [overrides]
 * @returns {import("esbuild").BuildOptions}
 */
export function defineEsbuildConfig(overrides = {}) {
	return {
		entryPoints: ["src/index.ts"],
		bundle: true,
		format: "esm",
		platform: "node",
		target: "node22",
		outfile: "dist/index.js",
		sourcemap: true,
		treeShaking: true,
		minify: false,
		...overrides,
	};
}

export default defineEsbuildConfig();
