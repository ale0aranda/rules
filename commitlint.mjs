import conventional from "@commitlint/config-conventional";
import createPreset from "conventional-changelog-conventionalcommits";
import { merge } from "lodash-es";

const commitTypes = {
	feat: {
		emoji: "✨",
		title: "feat",
		description: "Add a new feature",
	},
	fix: {
		emoji: "🐛",
		title: "fix",
		description: "Fix a bug",
	},
	docs: {
		emoji: "📚",
		title: "docs",
		description: "Update documentation",
	},
	style: {
		emoji: "💎",
		title: "style",
		description: "Change formatting without affecting behavior",
	},
	refactor: {
		emoji: "📦",
		title: "refactor",
		description: "Refactor code without changing behavior",
	},
	perf: {
		emoji: "🚀",
		title: "perf",
		description: "Improve performance",
	},
	test: {
		emoji: "🚨",
		title: "test",
		description: "Add or update tests",
	},
	build: {
		emoji: "🛠️",
		title: "build",
		description: "Update the build system or dependencies",
	},
	ci: {
		emoji: "⚙️",
		title: "ci",
		description: "Update continuous integration",
	},
	chore: {
		emoji: "♻️",
		title: "chore",
		description: "Perform maintenance tasks",
	},
	revert: {
		emoji: "🗑️",
		title: "revert",
		description: "Revert a previous change",
	},
};

const emojiPattern = Object.values(commitTypes)
	.map(({ emoji }) => {
		const emojiWithoutVariationSelector = emoji.replaceAll("\uFE0F", "");

		return `${emojiWithoutVariationSelector}\uFE0F?`;
	})
	.join("|");

const parserOpts = {
	headerPattern: new RegExp(
		`^(?:(?:${emojiPattern})\\s+)?(\\w*)(?:\\((.*)\\))?!?:\\s+(.*)$`,
	),

	breakingHeaderPattern: new RegExp(
		`^(?:(?:${emojiPattern})\\s+)?(\\w*)(?:\\((.*)\\))?!:\\s+(.*)$`,
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
				description: "Select the commit type:",
				enum: commitTypes,
				headerWithEmoji: true,
			},
		},
	},
};

export default config;
