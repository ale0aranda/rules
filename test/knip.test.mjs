import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const config = JSON.parse(
	await readFile(new URL("../knip/base.json", import.meta.url), "utf8"),
);

describe("knip shared configuration", () => {
	it("enables dead code checks", () => {
		assert.ok(config.include.includes("files"));
		assert.ok(config.include.includes("dependencies"));
		assert.ok(config.include.includes("exports"));
		assert.ok(config.include.includes("types"));
		assert.ok(config.include.includes("duplicates"));
	});

	it("does not impose project-specific entry points", () => {
		assert.equal(config.entry, undefined);
		assert.equal(config.project, undefined);
	});

	it("does not exclude issues by default", () => {
		assert.deepEqual(config.exclude, []);
	});
});
