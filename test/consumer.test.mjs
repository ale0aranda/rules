import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(currentDirectory, '..');

function run(command, arguments_, options = {}) {
  const result = spawnSync(command, arguments_, {
    encoding: 'utf8',
    ...options
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  return result.stdout;
}

test('installs and loads the published package', async () => {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), 'ale0aranda-rules-consumer-')
  );

  const consumerDirectory = join(temporaryDirectory, 'consumer');

  try {
    await writeFile(join(temporaryDirectory, 'placeholder'), '');

    const output = run(
      'npm',
      [
        'pack',
        projectDirectory,
        '--ignore-scripts',
        '--json',
        '--pack-destination',
        temporaryDirectory
      ],
      {
        cwd: projectDirectory
      }
    );

    const [{ filename }] = JSON.parse(output);
    const tarballPath = join(temporaryDirectory, filename);

    await mkdir(consumerDirectory);

    await writeFile(
      join(consumerDirectory, 'package.json'),
      JSON.stringify({
        name: 'rules-consumer-test',
        private: true,
        type: 'module'
      })
    );

    run(
      'npm',
      [
        'install',
        tarballPath,
        '--ignore-scripts',
        '--omit=peer',
        '--no-audit',
        '--no-fund',
        '--package-lock=false'
      ],
      {
        cwd: consumerDirectory
      }
    );

    const verificationPath = join(consumerDirectory, 'verify.mjs');

    await writeFile(
      verificationPath,
      `
        import commitlint from '@ale0aranda/rules/commitlint';
        import biome from '@ale0aranda/rules/biome' with { type: 'json' };
        import renovate from '@ale0aranda/rules/renovate' with { type: 'json' };
        import typescriptBase from '@ale0aranda/rules/typescript/base' with { type: 'json' };
        import typescriptWeb from '@ale0aranda/rules/typescript/web' with { type: 'json' };
        import typescriptNode from '@ale0aranda/rules/typescript/node' with { type: 'json' };
        import typescriptLibrary from '@ale0aranda/rules/typescript/library' with { type: 'json' };

        if (!commitlint.rules) {
          throw new Error('Commitlint preset could not be loaded');
        }

        if (!biome.formatter) {
          throw new Error('Biome preset could not be loaded');
        }

        if (!renovate.packageRules) {
          throw new Error('Renovate preset could not be loaded');
        }

        const presets = [
          typescriptBase,
          typescriptWeb,
          typescriptNode,
          typescriptLibrary
        ];

        if (presets.some((preset) => !preset.compilerOptions)) {
          throw new Error('A TypeScript preset could not be loaded');
        }
      `
    );

    run(process.execPath, [verificationPath], {
      cwd: consumerDirectory
    });

    const installedPackage = JSON.parse(
      await readFile(
        join(
          consumerDirectory,
          'node_modules',
          '@ale0aranda',
          'rules',
          'package.json'
        ),
        'utf8'
      )
    );

    assert.equal(installedPackage.name, '@ale0aranda/rules');
  } finally {
    await rm(temporaryDirectory, {
      recursive: true,
      force: true
    });
  }
});
