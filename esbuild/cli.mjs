import { defineEsbuildConfig } from "./base.mjs";

/**
 * @param {import("esbuild").BuildOptions} [overrides]
 * @returns {import("esbuild").BuildOptions}
 */
export function defineEsbuildCliConfig(overrides = {}) {
	const banner = {
		js: "#!/usr/bin/env node",
		...overrides.banner,
	};

	return defineEsbuildConfig({
		minify: true,
		packages: "bundle",
		...overrides,
		banner,
	});
}

export default defineEsbuildCliConfig();
