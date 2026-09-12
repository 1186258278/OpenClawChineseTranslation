#!/usr/bin/env python3
"""Anonymous OCI readback: platforms, config and identical images in both registries."""
import argparse
import hashlib
import json
import pathlib
import re
import time
import urllib.request

ACCEPT = ', '.join([
    'application/vnd.oci.image.index.v1+json',
    'application/vnd.docker.distribution.manifest.list.v2+json',
    'application/vnd.oci.image.manifest.v1+json',
    'application/vnd.docker.distribution.manifest.v2+json',
])
DEFAULT_COMMAND = ['openclaw', 'gateway', 'run', '--allow-unconfigured', '--bind', 'lan']


def request_json(url, token=None):
    headers = {'Accept': ACCEPT, 'User-Agent': 'openclaw-image-readback'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    # Only public anonymous pull tokens are used. Never read docker/gh login state.
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=40) as response:
                data = response.read()
                return json.loads(data), 'sha256:' + hashlib.sha256(data).hexdigest()
        except (OSError, ValueError):
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)


def validate_config(config, expected_version):
    runtime = config.get('config', {})
    if runtime.get('Cmd') != DEFAULT_COMMAND:
        raise ValueError('Image does not start the gateway by default')
    if '/healthz' not in ' '.join(runtime.get('Healthcheck', {}).get('Test', [])):
        raise ValueError('Image is missing the gateway healthz healthcheck')
    version = runtime.get('Labels', {}).get('org.opencontainers.image.version')
    if version != expected_version:
        raise ValueError(f'Image version label mismatch: {version} != {expected_version}')


def inspect_registry(registry, owner, tags, expected_version=None):
    repo = f'{owner}/openclaw-zh'
    if registry == 'ghcr.io':
        auth_url = f'https://ghcr.io/token?service=ghcr.io&scope=repository:{repo}:pull'
        base = f'https://ghcr.io/v2/{repo}'
    else:
        auth_url = f'https://auth.docker.io/token?service=registry.docker.io&scope=repository:{repo}:pull'
        base = f'https://registry-1.docker.io/v2/{repo}'
    auth, _ = request_json(auth_url)
    token = auth.get('token') or auth['access_token']
    rows = []
    for tag in tags:
        index, digest = request_json(f'{base}/manifests/{tag}', token)
        descriptors = [m for m in index.get('manifests', []) if m.get('platform', {}).get('os') == 'linux']
        arches = [m['platform']['architecture'] for m in descriptors]
        if sorted(arches) != ['amd64', 'arm64']:
            raise ValueError(f'{registry}:{tag}: wrong platforms {arches}')
        platforms = {}
        for descriptor in descriptors:
            manifest, actual_digest = request_json(f'{base}/manifests/{descriptor["digest"]}', token)
            if actual_digest != descriptor['digest']:
                raise ValueError('Manifest content digest mismatch')
            config, config_digest = request_json(f'{base}/blobs/{manifest["config"]["digest"]}', token)
            if config_digest != manifest['config']['digest']:
                raise ValueError('Config content digest mismatch')
            arch = descriptor['platform']['architecture']
            if config.get('architecture') != arch or config.get('os') != 'linux':
                raise ValueError(f'Config platform mismatch: {arch}')
            if expected_version:
                validate_config(config, expected_version)
            platforms[arch] = {'digest': actual_digest, 'command': config['config'].get('Cmd'),
                               'healthcheck': config['config'].get('Healthcheck', {}).get('Test')}
        rows.append({'registry': registry, 'tag': tag, 'digest': digest, 'platforms': platforms})
    return rows


def verify_matching_images(rows):
    for tag in {row['tag'] for row in rows}:
        matches = [row for row in rows if row['tag'] == tag]
        if len(matches) != 2 or len({row['digest'] for row in matches}) != 1:
            raise ValueError(f'The two registries have different images for {tag}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--owner', default='1186258278')
    parser.add_argument('--tag', action='append', required=True)
    parser.add_argument('--expected-version')
    parser.add_argument('--output')
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9][a-z0-9_-]*', args.owner):
        parser.error('Invalid owner')
    if any(not re.fullmatch(r'[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}', tag) for tag in args.tag):
        parser.error('Invalid tag')
    rows = []
    for registry in ['ghcr.io', 'docker.io']:
        rows.extend(inspect_registry(registry, args.owner, args.tag, args.expected_version))
    report = json.dumps(rows, ensure_ascii=False, indent=2)
    if args.output:
        pathlib.Path(args.output).write_text(report + '\n', encoding='utf-8')
    print(report)
    if args.expected_version:
        verify_matching_images(rows)


if __name__ == '__main__':
    main()
