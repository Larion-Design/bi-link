FROM node:18-alpine AS setup
WORKDIR /app
COPY .npmrc package.json pnpm-lock.yaml packages apps ./
RUN apk add libc6-compat chromium && npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile

FROM setup AS build-prod
RUN pnpm --filter frontend run build:frontend

FROM setup AS build-staging
RUN pnpm --filter frontend build:frontend:staging

FROM nginx:1.23-alpine AS production
COPY --from=build-prod /app/apps/frontend/dist /var/www
COPY --from=build-prod /app/apps/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:1.23-alpine AS staging
COPY --from=build-staging /app/apps/frontend/dist /var/www
COPY --from=build-staging /app/apps/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf