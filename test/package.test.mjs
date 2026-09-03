import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
);

test('exports every public preset', () => {
  assert.equal(packageJson.exports['./biome'], './biome.json');
  assert.equal(packageJson.exports['./commitlint'], './commitlint.mjs');
  assert.equal(packageJson.exports['./renovate'], './default.json');
});

test('ships every exported preset', () => {
  assert.ok(packageJson.files.includes('biome.json'));
  assert.ok(packageJson.files.includes('commitlint.mjs'));
  assert.ok(packageJson.files.includes('default.json'));
});

test('exports every TypeScript preset', () => {
  assert.equal(
    packageJson.exports['./typescript/base'],
    './typescript/base.json'
  );

  assert.equal(
    packageJson.exports['./typescript/web'],
    './typescript/web.json'
  );

  assert.equal(
    packageJson.exports['./typescript/node'],
    './typescript/node.json'
  );

  assert.equal(
    packageJson.exports['./typescript/library'],
    './typescript/library.json'
  );
});
