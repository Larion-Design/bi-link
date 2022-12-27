FROM node:18-alpine AS setup
WORKDIR /usr/src/link
RUN apk add libc6-compat chromium && npm install -g pnpm

FROM setup AS build
WORKDIR /usr/src/link
COPY . .
RUN pnpm install --frozen-lockfile && pnpm turbo build:backend && pnpm --filter defs --prod deploy backend-services

FROM setup AS bundle
USER node
COPY --chown=node:node --from=build /usr/src/link/apps/backend-services/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/link/apps/backend-services/dist ./dist