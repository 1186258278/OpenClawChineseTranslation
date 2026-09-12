import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { updateNightlyTag } from '../../scripts/update-nightly-tag.mjs';

const oldSha = '1'.repeat(40), newSha = '2'.repeat(40);
function fixture(responses) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, ...options });
    assert.notEqual(options.method, 'DELETE');
    const [status, data] = responses.shift();
    return { ok: status >= 200 && status < 300, status, json: async () => data };
  };
  return { calls, run: () => updateNightlyTag({ repository: 'fixture/repo', sha: newSha, token: 'fixture', fetchImpl }) };
}
test('missing nightly tag is created without deleting anything', async () => {
  const f = fixture([[404, {}], [201, {}]]);
  assert.equal(await f.run(), 'created');
  assert.equal(f.calls[1].method, 'POST');
});
test('matching nightly tag is a no-op', async () => {
  const f = fixture([[200, { object: { type: 'commit', sha: newSha } }]]);
  assert.equal(await f.run(), 'unchanged');
  assert.equal(f.calls.length, 1);
});
test('nightly advances with a single atomic PATCH', async () => {
  const f = fixture([[200, { object: { type: 'commit', sha: oldSha } }], [200, { status: 'behind' }], [200, {}]]);
  assert.equal(await f.run(), 'updated');
  assert.equal(f.calls[2].method, 'PATCH');
  assert.deepEqual(JSON.parse(f.calls[2].body), { sha: newSha, force: true });
});
test('denied update preserves the existing nightly tag and fails visibly', async () => {
  const f = fixture([[200, { object: { type: 'commit', sha: oldSha } }], [200, { status: 'behind' }], [403, { message: 'permission denied' }]]);
  await assert.rejects(f.run, /HTTP 403/);
  assert.equal(f.calls.filter((c) => c.method === 'DELETE').length, 0);
});
test('older queued builds do not move nightly backwards', async () => {
  const f = fixture([[200, { object: { type: 'commit', sha: oldSha } }], [200, { status: 'ahead' }]]);
  await assert.rejects(f.run, /superseded/);
  assert.equal(f.calls.length, 2);
});
test('annotated legacy nightly tags are resolved without deletion', async () => {
  const f = fixture([[200, { object: { type: 'tag', sha: oldSha } }], [200, { object: { type: 'commit', sha: newSha } }]]);
  assert.equal(await f.run(), 'unchanged');
});
test('nightly workflow no longer deletes the tag or leaves the release in draft', () => {
  const source = readFileSync(new URL('../../.github/workflows/nightly.yml', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /git push origin :refs\/tags\/nightly/);
  assert.match(source, /node scripts\/update-nightly-tag\.mjs/);
  assert.match(source, /draft: false/);
});
