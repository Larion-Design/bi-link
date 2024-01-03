FROM node:20-alpine AS setup
WORKDIR /app
RUN npm install -g pnpm
COPY .npmrc package.json pnpm-lock.yaml packages apps ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 pnpm install --frozen-lockfile

# Build frontend containers
FROM setup AS build-frontend-prod
RUN pnpm --filter frontend build

FROM setup AS build-frontend-staging
RUN pnpm --filter frontend build:frontend:staging

FROM nginx:1.23-alpine AS frontend-prod
COPY --from=build-frontend-prod /app/apps/frontend/dist /var/www
COPY --from=build-frontend-prod /app/apps/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:1.23-alpine AS frontend-staging
COPY --from=build-frontend-staging /app/apps/frontend/dist /var/www
COPY --from=build-frontend-staging /app/apps/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf


# Build backend containers
FROM setup as build-backend
RUN pnpm --filter backend-services build && pnpm prune --prod --no-optional

FROM node:18-alpine as backend
WORKDIR /app
USER node
COPY --chown=node:node --from=build-backend /app/apps/backend-services/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=build-backend /app/apps/backend-services/dist ./dist
COPY --chown=node:node --from=build-backend /app/apps/backend-services/node_modules ./node_modules