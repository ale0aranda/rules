import createPlaywrightConfig from "@ale0aranda/rules/playwright";

export default createPlaywrightConfig({
	use: {
		baseURL: "http://localhost:3000",
	},
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:3000",
	},
});
