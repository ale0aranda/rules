import assert from "node:assert/strict";
import test from "node:test";

import config from "../lint-staged.config.mjs";

const biomePattern =
	"*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc,css,html,graphql,gql,astro,vue,svelte}";

test("runs Biome on supported staged files", () => {
	assert.equal(
		config[biomePattern],
		"biome check --write --no-errors-on-unmatched",
	);
});

test("does not run commands on every staged file", () => {
	assert.equal(config["*"], undefined);
});

test("does not include unsupported document formats", () => {
	assert.equal(biomePattern.includes("md"), false);
	assert.equal(biomePattern.includes("yaml"), false);
});
