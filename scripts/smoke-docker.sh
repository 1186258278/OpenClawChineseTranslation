#!/usr/bin/env bash
# Real runtime gate. Uses only disposable containers/volumes and loopback ports.
set -euo pipefail
image="${1:?Usage: smoke-docker.sh IMAGE EXPECTED_VERSION}"
expected="${2:?Expected package version is required}"
name="openclaw-smoke-${GITHUB_RUN_ID:-local}-$$"
volume="${name}-data"
cleanup() {
    result=$?
    if [ "$result" -ne 0 ]; then
        docker logs --tail 100 "$name" 2>&1 | sed "s/${OPENCLAW_GATEWAY_TOKEN:-__unset__}/[REDACTED]/g" || :
    fi
    docker rm -f "$name" >/dev/null 2>&1 || :
    docker volume rm "$volume" >/dev/null 2>&1 || :
}
trap cleanup EXIT

actual=$(docker run --rm --entrypoint node "$image" -p 'require("./package.json").version')
[ "$actual" = "$expected" ] || { echo "Version mismatch: $actual != $expected"; exit 1; }
docker run --rm "$image" openclaw --version
docker run --rm "$image" openclaw gateway --help >/dev/null
docker run --rm "$image" node -e 'require("tree-sitter-bash"); require("koffi"); console.log("Native dependencies OK: " + process.arch)'
docker run --rm "$image" npm ls --omit=dev --depth=0

docker volume create "$volume" >/dev/null
export OPENCLAW_GATEWAY_TOKEN
OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)
if [ "${GITHUB_ACTIONS:-}" = true ]; then echo "::add-mask::$OPENCLAW_GATEWAY_TOKEN"; fi
# A minimal authenticated config; no real accounts, providers or channels.
docker run --rm -v "$volume:/root/.openclaw" "$image" node -e '
  require("node:fs").writeFileSync("/root/.openclaw/openclaw.json", JSON.stringify({
    gateway: {mode: "local", controlUi: {allowedOrigins: ["http://127.0.0.1:18789", "http://localhost:18789"]}}
  }));'
# Deliberately do not override CMD: verify the image works with its default boot.
docker run -d --name "$name" -p 127.0.0.1::18789 \
    -v "$volume:/root/.openclaw" -e OPENCLAW_GATEWAY_TOKEN \
    --health-interval=2s --health-start-period=2s --health-retries=90 "$image" >/dev/null
address=$(docker port "$name" 18789/tcp)
ready=false
for ((i=0; i<90; i++)); do
    if [ "$(docker inspect -f '{{.State.Running}}' "$name")" != true ]; then
        echo 'Gateway exited before becoming ready'; exit 1
    fi
    if [ "$(docker inspect -f '{{.State.Health.Status}}' "$name")" = healthy ]; then
        ready=true; break
    fi
    sleep 2
done
[ "$ready" = true ] || { echo 'Gateway health timeout'; exit 1; }
curl --fail --silent --show-error "http://$address/healthz" | \
    node --input-type=module -e 'let s="";for await(const c of process.stdin)s+=c;const v=JSON.parse(s);if(v.ok!==true)process.exit(1)'
# Check control-ui HTML as well as an actual JS asset, not just a 200 SPA fallback.
html=$(curl --fail --silent --show-error "http://$address/")
asset=$(printf '%s' "$html" | node --input-type=module -e 'let s="";for await(const c of process.stdin)s+=c;const m=s.match(/src="([^"\s]+\.js)"/);if(!m)process.exit(1);process.stdout.write(m[1])')
asset="${asset#./}"
curl --fail --silent --show-error "http://$address/${asset#/}" -o /dev/null
docker exec "$name" openclaw health --json >/dev/null
docker stop --time 30 "$name" >/dev/null
code=$(docker inspect -f '{{.State.ExitCode}}' "$name")
[[ "$code" = 0 || "$code" = 143 ]] || { echo "Unclean shutdown: $code"; exit 1; }
echo "PASS: $image ($actual), native deps, default gateway, healthz, control-ui and shutdown"
