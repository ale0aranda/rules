import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(
	new URL("../.github/workflows/reusable-check.yml", import.meta.url),
	"utf8",
);

test("defines a reusable workflow", () => {
	assert.match(workflow, /workflow_call:/);
});

test("uses Node.js 24 by default", () => {
	assert.match(workflow, /default: "24"/);
});

test("accepts a configurable Node.js version", () => {
	assert.match(workflow, /node-version:/);
	assert.match(workflow, /inputs\.node-version/);
});

test("uses pnpm", () => {
	assert.match(workflow, /pnpm\/action-setup@v4/);
	assert.match(workflow, /pnpm install --frozen-lockfile/);
});

test("runs the shared check command", () => {
	assert.match(workflow, /run: pnpm check/);
});

test("verifies the package contents", () => {
	assert.match(workflow, /pnpm pack --dry-run/);
});

test("uses read-only contents permissions", () => {
	assert.match(workflow, /contents: read/);
});

test("does not request write permissions", () => {
	assert.doesNotMatch(workflow, /contents: write/);
	assert.doesNotMatch(workflow, /pull-requests: write/);
	assert.doesNotMatch(workflow, /id-token: write/);
});
