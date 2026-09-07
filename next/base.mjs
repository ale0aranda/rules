/**
 * @param {import("next").NextConfig} [overrides]
 * @returns {import("next").NextConfig}
 */
export function defineNextConfig(overrides = {}) {
	return {
		...overrides,
		poweredByHeader: overrides.poweredByHeader ?? false,
		trailingSlash: overrides.trailingSlash ?? false,
		typescript: {
			ignoreBuildErrors: false,
			...overrides.typescript,
		},
	};
}

export default defineNextConfig();
