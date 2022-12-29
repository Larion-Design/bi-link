FROM node:18-alpine AS setup
WORKDIR /app
RUN apk add libc6-compat chromium

FROM setup AS build
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 pnpm --filter backend-services... install --no-optional && \
    pnpm --filter backend-services build && \
    pnpm prune --prod --no-optional

FROM setup
WORKDIR /app
USER node
COPY --chown=node:node --from=build /app/apps/backend-services/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=build /app/apps/backend-services/dist ./dist
COPY --chown=node:node --from=build /app/apps/backend-services/node_modules ./node_modules