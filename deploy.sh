#!/usr/bin/env bash
set -euo pipefail

REGISTRY="ghcr.io/nikhilsahni7"
IMAGE_NAME="packtok-api"
VPS_HOST="54.250.109.52"
VPS_USER="ubuntu"
VPS_PORT="22"
COMPOSE_DIR="/home/ubuntu/packtok"

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

IMAGE="${REGISTRY}/${IMAGE_NAME}"

info()    { printf "${YELLOW}%s${NC}\n" "$1"; }
success() { printf "${GREEN}%s${NC}\n" "$1"; }
fail()    { printf "${RED}%s${NC}\n" "$1"; }

require_real_value() {
  local name="$1"
  local value="$2"

  if [[ "$value" == *"YOUR"* ]]; then
    fail "⚠️ USER ACTION REQUIRED: replace ${name} in deploy.sh with the real value."
    exit 1
  fi
}

require_real_value "REGISTRY" "$REGISTRY"
require_real_value "VPS_HOST" "$VPS_HOST"

GIT_SHA="$(git rev-parse --short HEAD)"

info "Building ${IMAGE}:${GIT_SHA} and ${IMAGE}:latest"
docker build -t "${IMAGE}:${GIT_SHA}" -t "${IMAGE}:latest" .

info "Pushing ${IMAGE}:${GIT_SHA}"
docker push "${IMAGE}:${GIT_SHA}"

info "Pushing ${IMAGE}:latest"
docker push "${IMAGE}:latest"

info "Deploying on ${VPS_USER}@${VPS_HOST}:${COMPOSE_DIR}"
ssh -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" \
  IMAGE="${IMAGE}" \
  GIT_SHA="${GIT_SHA}" \
  COMPOSE_DIR="${COMPOSE_DIR}" \
  'bash -s' <<'REMOTE_SCRIPT'
set -euo pipefail

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

info()    { printf "${YELLOW}%s${NC}\n" "$1"; }
success() { printf "${GREEN}%s${NC}\n" "$1"; }
fail()    { printf "${RED}%s${NC}\n" "$1"; }

cd "${COMPOSE_DIR}"

PREVIOUS_IMAGE_ID="$(docker compose images -q api 2>/dev/null || true)"

info "Pulling latest Compose image"
docker compose pull api

info "Running Prisma migrations with ${IMAGE}:${GIT_SHA}"
docker run --rm \
  --env-file ./apps/api/.env.production \
  "${IMAGE}:${GIT_SHA}" \
  node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma

info "Starting API"
docker compose up -d --no-build --remove-orphans

info "Waiting for API health check"
for i in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:3001/api/v1/healthcheck >/dev/null 2>&1; then
    success "✅ Health check passed on attempt $i"
    break
  fi
  if [ "$i" -eq 20 ]; then
    fail "❌ Health check failed after 20 attempts"
    if [[ -n "${PREVIOUS_IMAGE_ID}" ]]; then
      info "Rolling back to previous local image ${PREVIOUS_IMAGE_ID}"
      docker tag "${PREVIOUS_IMAGE_ID}" "${IMAGE}:latest"
      docker compose up -d --no-build
      sleep 10
      if curl -fsS http://127.0.0.1:3001/api/v1/healthcheck >/dev/null 2>&1; then
        success "Rollback healthy"
      else
        fail "Rollback also failed"
      fi
    else
      fail "No previous image was available for rollback"
    fi
    docker compose logs --tail=100 api
    exit 1
  fi
  sleep 3
done

# Cleanup dangling and old images
docker image prune -f --filter "until=168h" >/dev/null 2>&1 || true

info "Last 20 API log lines"
docker compose logs --tail=20 api
REMOTE_SCRIPT

success "Deploy complete: ${IMAGE}:${GIT_SHA}"
