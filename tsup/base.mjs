import { defineConfig } from "tsup";

/**
 * @param {import("tsup").Options} [overrides]
 */
export function defineTsupConfig(overrides = {}) {
	return defineConfig({
		entry: ["src/index.ts"],
		format: ["esm"],
		target: "node22",
		platform: "node",
		outDir: "dist",
		clean: true,
		sourcemap: true,
		treeshake: true,
		splitting: false,
		minify: false,
		...overrides,
	});
}

export default defineTsupConfig();
