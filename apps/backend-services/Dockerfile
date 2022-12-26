FROM node:18-alpine AS setup
WORKDIR /usr/src/link
COPY .npmrc package.json pnpm-lock.yaml packages apps ./
RUN apk add libc6-compat chromium && npm install -g pnpm
COPY . .
RUN DOCKER_BUILDKIT=1 --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
        pnpm install --frozen-lockfile && pnpm turbo build:backend && pnpm prune --prod --no-optional

FROM node:18-alpine AS bundle
USER node
COPY --chown=node:node --from=setup /usr/src/link/apps/backend-services/node_modules ./node_modules
COPY --chown=node:node --from=setup /usr/src/link/apps/backend-services/dist ./dist