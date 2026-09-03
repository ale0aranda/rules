import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
);

test('exports every public preset', () => {
  assert.equal(packageJson.exports['./biome'], './biome.json');
  assert.equal(packageJson.exports['./commitlint'], './commitlint.mjs');
});

test('ships every exported preset', () => {
  assert.ok(packageJson.files.includes('biome.json'));
  assert.ok(packageJson.files.includes('commitlint.mjs'));
});
