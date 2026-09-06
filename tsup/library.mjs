import { defineTsupConfig } from "./base.mjs";

/**
 * @param {import("tsup").Options} [overrides]
 */
export function defineTsupLibraryConfig(overrides = {}) {
	return defineTsupConfig({
		dts: true,
		...overrides,
	});
}

export default defineTsupLibraryConfig();
