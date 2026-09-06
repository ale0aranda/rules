import { defineUnbuildConfig } from "./base.mjs";

/**
 * @param {import("unbuild").BuildConfig} [overrides]
 * @returns {import("unbuild").BuildConfig}
 */
export function defineUnbuildLibraryConfig(overrides = {}) {
	return defineUnbuildConfig({
		...overrides,
		declaration: overrides.declaration ?? true,
		rollup: {
			emitCJS: false,
			...overrides.rollup,
		},
	});
}

export default defineUnbuildLibraryConfig();
