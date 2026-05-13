# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS deps

LABEL org.opencontainers.image.title="Packtok API"
LABEL org.opencontainers.image.description="Production container for the Packtok Express API and Socket.IO server"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.maintainer="Nikhil Sahni <nikhil.sahni321@gmail.com>"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare pnpm@9.11.0 --activate

COPY . .

RUN pnpm dlx turbo@2.5.4 prune --scope=@packtok/api --docker

WORKDIR /app/pruned

RUN cp -R /app/out/json/. ./ \
  && cp /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile

FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare pnpm@9.11.0 --activate

COPY --from=deps /app/pruned/ ./
COPY --from=deps /app/out/full/ ./
COPY --from=deps /app/tsconfig.base.json ./tsconfig.base.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm --filter @packtok/api exec prisma generate --schema=prisma/schema.prisma \
  && pnpm turbo run build --filter=@packtok/api... \
  && pnpm deploy --filter=@packtok/api --prod /app/deploy \
  && cd /app/deploy \
  && node node_modules/prisma/build/index.js generate --schema=./prisma/schema.prisma

FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="Packtok API"
LABEL org.opencontainers.image.description="Production container for the Packtok Express API and Socket.IO server"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.maintainer="Nikhil Sahni <nikhil.sahni321@gmail.com>"

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl wget

COPY --from=builder --chown=node:node /app/deploy/ ./

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 CMD wget -qO- http://localhost:3001/api/v1/healthcheck || exit 1

CMD ["node", "dist/server.js"]
