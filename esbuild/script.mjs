import { defineEsbuildConfig } from "./base.mjs";

/**
 * @param {import("esbuild").BuildOptions} [overrides]
 * @returns {import("esbuild").BuildOptions}
 */
export function defineEsbuildScriptConfig(overrides = {}) {
	return defineEsbuildConfig({
		entryPoints: ["src/script.ts"],
		outfile: "dist/script.js",
		minify: true,
		packages: "bundle",
		...overrides,
	});
}

export default defineEsbuildScriptConfig();
