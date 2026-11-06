#!/usr/bin/env bash
# Free, GitHub-Actions-free deploy: rsync source to the VPS, build the
# Docker image there, migrate, swap, health-check, roll back on failure.
# Usage: ./deploy.sh
set -euo pipefail

VPS_HOST="3.129.147.126"
VPS_USER="ubuntu"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/packtok_deploy_ed25519}"
IMAGE="ghcr.io/nikhilsahni7/packtok-api"
BUILD_DIR="/home/ubuntu/packtok-build"
COMPOSE_DIR="/home/ubuntu/packtok"

cd "$(dirname "$0")"

GIT_SHA="$(git rev-parse --short HEAD)"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Warning: uncommitted changes are included in this deploy (rsync sends the working tree)."
  GIT_SHA="${GIT_SHA}-dirty"
fi

SSH="ssh -i ${SSH_KEY} -o BatchMode=yes ${VPS_USER}@${VPS_HOST}"

echo "Syncing source to ${VPS_HOST}:${BUILD_DIR} ..."
rsync -az --delete \
  --exclude '.git' \
  --exclude '**/node_modules' --exclude '**/dist' --exclude '**/.next' --exclude '**/.turbo' \
  --exclude '.env' --exclude '.env.*' --exclude '**/.env' --exclude '**/.env.*' \
  --exclude 'apps/web' --exclude 'apps/admin' --exclude 'apps/mobile' \
  -e "ssh -i ${SSH_KEY} -o BatchMode=yes" \
  ./ "${VPS_USER}@${VPS_HOST}:${BUILD_DIR}/"

echo "Building and deploying ${IMAGE}:${GIT_SHA} on the VPS ..."
$SSH IMAGE="$IMAGE" GIT_SHA="$GIT_SHA" BUILD_DIR="$BUILD_DIR" COMPOSE_DIR="$COMPOSE_DIR" 'bash -s' <<'REMOTE'
set -euo pipefail

test -f "${COMPOSE_DIR}/apps/api/.env.production" || {
  echo "Missing ${COMPOSE_DIR}/apps/api/.env.production on the VPS" >&2; exit 1; }

cd "$BUILD_DIR"
DOCKER_BUILDKIT=1 docker build -t "${IMAGE}:${GIT_SHA}" -t "${IMAGE}:latest" .

cp docker-compose.yml "${COMPOSE_DIR}/docker-compose.yml"
cd "$COMPOSE_DIR"
export IMAGE_TAG="$GIT_SHA"

PREV_IMAGE="$(docker compose images -q api 2>/dev/null || true)"

echo "Running Prisma migrations..."
docker run --rm --env-file ./apps/api/.env.production \
  "${IMAGE}:${GIT_SHA}" \
  node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma

docker compose up -d --no-build --remove-orphans

echo "Waiting for health check..."
for i in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:3001/api/v1/healthcheck >/dev/null 2>&1; then
    echo "Health check passed on attempt $i"
    break
  fi
  if [ "$i" -eq 20 ]; then
    echo "Health check failed — rolling back" >&2
    if [ -n "$PREV_IMAGE" ]; then
      docker tag "$PREV_IMAGE" "${IMAGE}:rollback"
      IMAGE_TAG=rollback docker compose up -d --no-build
    fi
    docker compose logs --tail=100 api
    exit 1
  fi
  sleep 3
done

docker image prune -f --filter "until=168h" >/dev/null 2>&1 || true
docker compose logs --tail=20 api
REMOTE

echo "Deploy complete: ${IMAGE}:${GIT_SHA}"
echo "Health: https://api.packtok.com/api/v1/healthcheck"
