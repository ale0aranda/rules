import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [preset, repositoryConfig] = await Promise.all([
  readFile(new URL('../default.json', import.meta.url), 'utf8').then(
    JSON.parse
  ),
  readFile(new URL('../renovate.json', import.meta.url), 'utf8').then(
    JSON.parse
  )
]);

test('exports a shared Renovate preset', () => {
  assert.ok(preset.extends.includes('config:best-practices'));
  assert.equal(preset.timezone, 'America/Santiago');
  assert.equal(preset.semanticCommits, 'enabled');
  assert.ok(Array.isArray(preset.packageRules));
});

test('groups GitHub Actions updates', () => {
  const rule = preset.packageRules.find((candidate) =>
    candidate.matchManagers?.includes('github-actions')
  );

  assert.ok(rule);
  assert.equal(rule.groupName, 'GitHub Actions');
  assert.equal(rule.semanticCommitType, 'ci');
});

test('requires approval for major updates', () => {
  const rule = preset.packageRules.find((candidate) =>
    candidate.matchUpdateTypes?.includes('major')
  );

  assert.ok(rule);
  assert.equal(rule.dependencyDashboardApproval, true);
});

test('repository consumes the shared preset', () => {
  assert.deepEqual(repositoryConfig.extends, ['github>ale0aranda/rules']);
});
