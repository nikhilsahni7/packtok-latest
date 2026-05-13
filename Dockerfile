# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare pnpm@9.11.0 --activate

WORKDIR /app

FROM base AS builder

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile

# Generate Prisma client and build all packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm --filter @packtok/api exec prisma generate --schema=prisma/schema.prisma \
  && pnpm turbo run build --filter=@packtok/api...

# Backup generated Prisma client before pruning
RUN cp -r node_modules/.prisma /tmp/prisma-client

# Prune to production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm prune --prod

# Restore Prisma client after pruning
RUN cp -r /tmp/prisma-client node_modules/.prisma

FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="Packtok API"
LABEL org.opencontainers.image.description="Production container for the Packtok Express API and Socket.IO server"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.maintainer="Nikhil Sahni <nikhil.sahni321@gmail.com>"

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl wget

# Copy pruned node_modules and built files from builder
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=node:node /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=node:node /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder --chown=node:node /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder --chown=node:node /app/packages/utils/package.json ./packages/utils/package.json
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/packages/db/prisma ./packages/db/prisma

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 CMD wget -qO- http://localhost:3001/api/v1/healthcheck || exit 1

CMD ["node", "apps/api/dist/server.js"]
