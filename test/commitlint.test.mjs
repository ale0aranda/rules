import assert from "node:assert/strict";
import test from "node:test";

import lint from "@commitlint/lint";
import load from "@commitlint/load";

const loaded = await load(
	{},
	{ file: new URL("../commitlint.mjs", import.meta.url).pathname },
);

test("accepts a Conventional Commit", async () => {
	const result = await lint(
		"feat(config): add shared rules",
		loaded.rules,
		loaded,
	);
	assert.equal(result.valid, true);
});

test("rejects an unknown commit type", async () => {
	const result = await lint("update: change rules", loaded.rules, loaded);
	assert.equal(result.valid, false);
});
