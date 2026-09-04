import assert from "node:assert/strict";
import test from "node:test";

import lint from "@commitlint/lint";
import load from "@commitlint/load";

const loaded = await load(
	{},
	{
		file: new URL("../commitlint.mjs", import.meta.url).pathname,
	},
);

const lintCommit = (message) =>
	lint(message, loaded.rules, {
		parserOpts: loaded.parserPreset?.parserOpts,
	});

test("accepts a Conventional Commit without emoji", async () => {
	const result = await lintCommit("feat(config): add shared rules");

	assert.equal(result.valid, true);
});

test("accepts a Conventional Commit with emoji", async () => {
	const result = await lintCommit("✨ feat(config): add shared rules");

	assert.equal(result.valid, true);
});

test("accepts an emoji with variation selector", async () => {
	const result = await lintCommit("♻️ chore(tooling): update shared rules");

	assert.equal(result.valid, true);
});

test("accepts an emoji without variation selector", async () => {
	const result = await lintCommit("♻ chore(tooling): update shared rules");

	assert.equal(result.valid, true);
});

test("rejects an unknown commit type", async () => {
	const result = await lintCommit("unknown(config): change shared rules");

	assert.equal(result.valid, false);

	assert.ok(result.errors.some((error) => error.name === "type-enum"));
});

test("rejects an unknown emoji", async () => {
	const result = await lintCommit("🍕 chore(tooling): update shared rules");

	assert.equal(result.valid, false);

	assert.ok(
		result.errors.some(
			(error) => error.name === "type-empty" || error.name === "subject-empty",
		),
	);
});

test("rejects an empty subject", async () => {
	const result = await lintCommit("fix:");

	assert.equal(result.valid, false);

	assert.ok(result.errors.some((error) => error.name === "subject-empty"));
});
