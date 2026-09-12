import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Move only the intentionally mutable nightly alias. Never delete it first:
// denied writes must leave the last published nightly and Release reachable.
export async function updateNightlyTag({ repository, sha, token, fetchImpl = fetch }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || !/^[a-f0-9]{40}$/.test(sha ?? '') || !token) {
    throw new Error('A repository, full commit SHA and GitHub token are required');
  }
  const base = `https://api.github.com/repos/${repository}`;
  const request = async (route, method = 'GET', body) => {
    const response = await fetchImpl(`${base}${route}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(`GitHub ${method} ${route}: HTTP ${response.status} (${data.message ?? 'request failed'})`);
      error.status = response.status;
      throw error;
    }
    return data;
  };
  let existing;
  try { existing = await request('/git/ref/tags/nightly'); }
  catch (error) {
    if (error.status !== 404) throw error;
    await request('/git/refs', 'POST', { ref: 'refs/tags/nightly', sha });
    return 'created';
  }
  let object = existing.object;
  for (let depth = 0; object.type === 'tag' && depth < 5; depth++) {
    object = (await request(`/git/tags/${object.sha}`)).object;
  }
  if (object.type !== 'commit') throw new Error('nightly does not resolve to a commit');
  if (object.sha === sha) return 'unchanged';
  // Do not let an older queued build move nightly backwards.
  const comparison = await request(`/compare/${sha}...${object.sha}`);
  if (comparison.status !== 'behind') {
    throw new Error('Refusing a superseded or divergent nightly update; existing tag retained');
  }
  await request('/git/refs/tags/nightly', 'PATCH', { sha, force: true });
  return 'updated';
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = await updateNightlyTag({ repository: process.env.GITHUB_REPOSITORY,
    sha: process.env.GITHUB_SHA, token: process.env.GH_TOKEN });
  console.log(`nightly tag: ${result} (${process.env.GITHUB_SHA})`);
}
