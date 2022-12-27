FROM node:18-alpine AS setup
WORKDIR /usr/src/link
COPY .npmrc package.json pnpm-lock.yaml packages apps ./
RUN apk add libc6-compat chromium && npm install -g pnpm

FROM setup AS build
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 \
        pnpm install --frozen-lockfile && pnpm turbo build:backend

FROM setup AS bundle
USER node
COPY --chown=node:node --from=build /usr/src/link/apps/backend-services/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/link/apps/backend-services/dist ./dist