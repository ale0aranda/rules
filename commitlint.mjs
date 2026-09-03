import { createRequire } from "node:module";

import conventional from "@commitlint/config-conventional";
import createPreset from "conventional-changelog-conventionalcommits";
import { merge } from "lodash-es";

const require = createRequire(import.meta.url);

const { types } = require("conventional-commit-types-emoji");

const commitTypes = Object.fromEntries(
	Object.entries(types).map(([type, value]) => {
		const [emoji, ...description] = value.description.trim().split(/\s+/);

		return [
			type,
			{
				emoji,
				title: type,
				description: description.join(" "),
			},
		];
	}),
);

const emojiPattern = Object.values(commitTypes)
	.map(({ emoji }) => emoji)
	.join("|");

const parserOpts = {
	headerPattern: new RegExp(
		`^(?:${emojiPattern})\\s+(\\w*)(?:\\((.*)\\))?!?:\\s+(.*)$`,
	),

	breakingHeaderPattern: new RegExp(
		`^(?:${emojiPattern})\\s+(\\w*)(?:\\((.*)\\))?!:\\s+(.*)$`,
	),

	headerCorrespondence: ["type", "scope", "subject"],
};

const parserPreset = merge({}, await createPreset(), {
	conventionalChangelog: {
		parserOpts,
	},

	parserOpts,

	recommendedBumpOpts: {
		parserOpts,
	},
});

/** @type {import("@commitlint/types").UserConfig} */
const config = {
	...conventional,

	parserPreset,

	rules: {
		...conventional.rules,

		"body-leading-blank": [2, "always"],
		"footer-leading-blank": [2, "always"],
		"header-max-length": [2, "always", 100],
		"scope-case": [2, "always", "kebab-case"],
		"subject-empty": [2, "never"],
		"subject-full-stop": [2, "never", "."],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"type-enum": [2, "always", Object.keys(commitTypes)],
	},

	prompt: {
		...conventional.prompt,

		questions: {
			...conventional.prompt?.questions,

			type: {
				description: "Select the exchange rate:",
				enum: commitTypes,
				headerWithEmoji: true,
			},
		},
	},
};

export default config;
