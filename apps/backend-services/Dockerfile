FROM node:18-alpine AS setup
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile --no-optional
COPY . .
RUN pnpm build api  \
    && pnpm build indexer \
    && pnpm build files-parser \
    && pnpm build user-actions-recorder \
    && pnpm build graph \
    && pnpm build cli \
    && pnpm prune --prod --no-optional

FROM node:18-alpine AS bundle
USER node
COPY --chown=node:node --from=setup /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=setup /usr/src/app/dist ./dist