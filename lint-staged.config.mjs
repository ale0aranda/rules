/** @type {import('lint-staged').Configuration} */
const config = {
	"*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc,css,html,graphql,gql,astro,vue,svelte}":
		"biome check --write --no-errors-on-unmatched",
};

export default config;
