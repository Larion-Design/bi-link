FROM node:18-alpine AS setup
WORKDIR /app
RUN apk add libc6-compat chromium && npm install -g pnpm turbo

FROM setup AS build_1
WORKDIR /app
COPY . .
RUN turbo prune --scope=backend-services --docker

FROM setup AS build_2
WORKDIR /app
COPY --from=build_1 /app/out/json/ .
COPY --from=build_1 /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 pnpm install --frozen-lockfile
COPY --from=build_1 /app/out/full .
COPY turbo.json turbo.json
RUN pnpm turbo run build:backend

FROM setup as build_3
WORKDIR /app
COPY --from=build_1 /app/out/json/ .
COPY --from=build_1 /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 pnpm install --frozen-lockfile

FROM setup AS prod
USER node
COPY --chown=node:node --from=build_2 /app/ /app

FROM setup as staging
USER node
COPY --chown=node:node --from=build_3 /app/ /app
CMD ["pnpm", "start:api --filter backend-services "]