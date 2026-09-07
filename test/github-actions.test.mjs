import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const workflow = await readFile(
	new URL("../.github/workflows/reusable-check.yml", import.meta.url),
	"utf8",
);

describe("GitHub Actions shared workflows", () => {
	it("defines a reusable check workflow", () => {
		assert.match(workflow, /workflow_call:/);
	});

	it("uses Node.js 24 by default", () => {
		assert.match(workflow, /default: "24"/);
	});

	it("uses pnpm", () => {
		assert.match(workflow, /pnpm\/action-setup@v4/);
		assert.match(workflow, /pnpm install --frozen-lockfile/);
	});

	it("runs the shared check command", () => {
		assert.match(workflow, /run: pnpm check/);
	});

	it("uses read-only contents permissions", () => {
		assert.match(workflow, /contents: read/);
	});
});
