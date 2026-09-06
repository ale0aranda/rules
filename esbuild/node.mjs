import { defineEsbuildConfig } from "./base.mjs";

/**
 * @param {import("esbuild").BuildOptions} [overrides]
 * @returns {import("esbuild").BuildOptions}
 */
export function defineEsbuildNodeConfig(overrides = {}) {
	return defineEsbuildConfig({
		packages: "external",
		...overrides,
	});
}

export default defineEsbuildNodeConfig();
