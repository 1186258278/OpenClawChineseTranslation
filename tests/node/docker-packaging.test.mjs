import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('real npm tarball install avoids the workspace protocol failure without running prepack', () => {
  const bin = path.dirname(process.execPath);
  const npmCli = [process.env.npm_execpath,
    path.join(bin, 'node_modules/npm/bin/npm-cli.js'),
    path.resolve(bin, '../lib/node_modules/npm/bin/npm-cli.js'),
  ].find((candidate) => candidate && existsSync(candidate));
  assert.ok(npmCli, 'npm CLI must be available for the packaging regression');
  const dir = mkdtempSync(path.join(tmpdir(), 'openclaw-docker-pack-'));
  const source = path.join(dir, 'source');
  const clean = path.join(dir, 'clean');
  mkdirSync(source);
  const run = (args, cwd = source) => spawnSync(process.execPath, [npmCli, ...args], {
    cwd, encoding: 'utf8', timeout: 60000,
    env: { ...process.env, npm_config_update_notifier: 'false' },
  });
  try {
    writeFileSync(path.join(source, 'package.json'), JSON.stringify({
      name: 'openclaw-docker-pack-fixture', version: '1.0.0', main: 'index.js', files: ['index.js'],
      devDependencies: { 'workspace-fixture': 'workspace:*' },
      scripts: { prepack: 'node -e "throw new Error(\'prepack must not rebuild the translated assets\')"' },
    }));
    writeFileSync(path.join(source, 'index.js'), 'module.exports = "translated-runtime";\n');
    const broken = run(['install', '--offline', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund']);
    assert.notEqual(broken.status, 0);
    assert.match(broken.stderr, /EUNSUPPORTEDPROTOCOL/);
    const packed = run(['pack', '--offline', '--ignore-scripts', '--json']);
    assert.equal(packed.status, 0, packed.stderr);
    const archive = path.join(source, JSON.parse(packed.stdout)[0].filename);
    const fixed = run(['install', '--prefix', clean, '--offline', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund', archive], dir);
    assert.equal(fixed.status, 0, fixed.stderr);
    assert.equal(readFileSync(path.join(clean, 'node_modules/openclaw-docker-pack-fixture/index.js'), 'utf8'),
      'module.exports = "translated-runtime";\n');
  } finally {
    assert.equal(path.dirname(dir), path.resolve(tmpdir()));
    assert.ok(path.basename(dir).startsWith('openclaw-docker-pack-'));
    rmSync(dir, { recursive: true, force: true });
  }
});
