import react from "@vitejs/plugin-react";

import { defineViteConfig } from "./base.mjs";

/**
 * @param {import("vite").UserConfig} [overrides]
 * @returns {import("vite").UserConfig}
 */
export function defineViteReactConfig(overrides = {}) {
	const reactPlugins = react();
	const plugins = Array.isArray(reactPlugins) ? reactPlugins : [reactPlugins];

	return defineViteConfig({
		...overrides,
		plugins: [...plugins, ...(overrides.plugins ?? [])],
	});
}

export default defineViteReactConfig();
