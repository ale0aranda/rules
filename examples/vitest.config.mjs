import baseConfig from "@ale0aranda/rules/vitest/base";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {
	test: {
		include: ["src/**/*.test.ts"],
	},
});
