# syntax=docker/dockerfile:1.4

# ── Stage 1: Install dependencies ──────────────────────────────────────────────
# Copy only package manifests first so that source-code changes don't
# invalidate the expensive pnpm-install layer.
FROM node:20-alpine AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare pnpm@9.11.0 --activate

# Manifests only — maximises Docker layer cache hits.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/db/package.json packages/db/
COPY packages/utils/package.json packages/utils/
COPY packages/config/package.json packages/config/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile

# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM deps AS builder

# Now copy full source on top of the cached node_modules.
COPY tsconfig.base.json ./tsconfig.base.json
COPY apps/api/ apps/api/
COPY packages/db/ packages/db/
COPY packages/utils/ packages/utils/
COPY packages/config/ packages/config/

# 1. Generate Prisma client (needed for TypeScript compilation)
# 2. Build all packages in dependency order (utils → db → api)
# 3. Create a standalone production deployment
# 4. Re-generate Prisma client inside the deploy dir (pnpm deploy
#    creates fresh node_modules that don't contain the generated client)
RUN pnpm --filter @packtok/api exec prisma generate --schema=prisma/schema.prisma \
  && pnpm turbo run build --filter=@packtok/api... \
  && pnpm deploy --filter=@packtok/api --prod /app/deploy \
  && cd /app/deploy \
  && node node_modules/prisma/build/index.js generate --schema=./prisma/schema.prisma

# ── Stage 3: Production runner ─────────────────────────────────────────────────
FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="Packtok API"
LABEL org.opencontainers.image.description="Production container for the Packtok Express API and Socket.IO server"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.maintainer="Nikhil Sahni <nikhil.sahni321@gmail.com>"

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

# dumb-init ensures proper PID 1 signal forwarding so SIGTERM from
# `docker stop` actually reaches Node.js for graceful shutdown.
RUN apk add --no-cache dumb-init libc6-compat openssl

COPY --from=builder --chown=node:node /app/deploy/ ./

USER node

EXPOSE 3001

# Use Node's built-in fetch (available in Node 20+) instead of wget.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:3001/api/v1/healthcheck').then(r=>{if(!r.ok)throw r.status}).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
