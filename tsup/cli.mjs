import { defineTsupConfig } from "./base.mjs";

/**
 * @param {import("tsup").Options} [overrides]
 */
export function defineTsupCliConfig(overrides = {}) {
	const banner = {
		js: "#!/usr/bin/env node",
		...overrides.banner,
	};

	return defineTsupConfig({
		dts: true,
		minify: true,
		...overrides,
		banner,
	});
}

export default defineTsupCliConfig();
