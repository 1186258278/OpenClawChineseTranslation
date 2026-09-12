import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8');

test('Docker installs a packed release instead of the CI workspace or node_modules', () => {
  const source = read('Dockerfile');
  assert.match(source, /COPY openclaw-runtime\.tgz/);
  assert.match(source, /npm install --global[^\n]*--omit=dev/);
  assert.doesNotMatch(source, /npm rebuild|npm install -g \.|COPY \. \./);
  assert.doesNotMatch(source, /\|\| true/);
  assert.doesNotMatch(source, /npm install[^\n]*--ignore-scripts/);
});

test('image starts a gateway by default and checks the JSON health endpoint', () => {
  const source = read('Dockerfile');
  assert.match(source, /CMD \["openclaw", "gateway", "run", "--allow-unconfigured", "--bind", "lan"\]/);
  assert.match(source, /http:\/\/127\.0\.0\.1:18789\/healthz/);
  assert.match(source, /openclaw gateway --help/);
});

test('compose uses an installed healthcheck binary and requires a token', () => {
  const source = read('docker-compose.yml');
  assert.doesNotMatch(source, /wget|"\|\|"|"exit", "0"/);
  assert.match(source, /OPENCLAW_GATEWAY_TOKEN:\?/);
  assert.match(source, /--bind.*lan/);
  assert.match(source, /127\.0\.0\.1:18789\/healthz/);
});

test('stable and nightly share a mandatory Docker runtime gate', () => {
  for (const file of ['sync-and-release.yml', 'nightly.yml']) {
    const source = read(`.github/workflows/${file}`);
    assert.match(source, /uses: \.\/\.github\/workflows\/docker-publish\.yml/);
    assert.doesNotMatch(source, /uses: docker\/build-push-action/);
  }
  const source = read('.github/workflows/docker-publish.yml');
  assert.match(source, /ubuntu-24\.04-arm/);
  assert.match(source, /scripts\/smoke-docker\.sh/);
  assert.match(source, /scripts\/verify-container-images\.py/);
  assert.match(source, /needs: build/);
  assert.doesNotMatch(source, /continue-on-error: true/);
  assert.ok(source.indexOf('scripts/smoke-docker.sh') < source.indexOf('docker push'));
});

test('core build packs a standalone Docker artifact without re-running prepack', () => {
  const source = read('.github/workflows/build-core.yml');
  assert.match(source, /npm pack --ignore-scripts --json --pack-destination/);
  assert.match(source, /name: openclaw-docker-\$\{\{ inputs\.version_type \}\}/);
  assert.match(source, /openclaw-runtime\.tgz/);
});

test('smoke checks default boot, native modules, health JSON and UI, with cleanup', () => {
  const source = read('scripts/smoke-docker.sh');
  for (const pattern of [/tree-sitter-bash/, /koffi/, /healthz/, /control-ui/, /docker stop/, /trap cleanup EXIT/]) {
    assert.match(source, pattern);
  }
  assert.doesNotMatch(source, /--auth none|dangerouslyDisableDeviceAuth/);
});

test('deployment scripts start a gateway in local-only mode and fail on unhealthy startup', () => {
  const bash = read('docker-deploy.sh');
  assert.match(bash, /127\.0\.0\.1:\$\{PORT\}:18789/);
  assert.match(bash, /openclaw gateway run --allow-unconfigured --bind lan/);
  assert.match(bash, /healthz/);
  assert.doesNotMatch(bash, /eval \$DOCKER_CMD/);
  const ps = read('docker-deploy.ps1');
  assert.match(ps, /127\.0\.0\.1:\$\{Port\}:18789/);
  assert.match(ps, /"gateway", "run", "--allow-unconfigured", "--bind", "lan"/);
  assert.match(ps, /throw "等待超时/);
});
