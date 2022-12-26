FROM node:18-alpine AS setup
WORKDIR /usr/src/link
COPY .npmrc package.json pnpm-lock.yaml packages apps ./
RUN apk add libc6-compat chromium && npm install -g pnpm
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 pnpm install --frozen-lockfile

FROM setup AS build-prod
RUN pnpm turbo build:frontend

FROM setup AS build-staging
RUN pnpm turbo build:frontend:staging

FROM nginx:1.23-alpine AS production
COPY --from=build-prod /usr/src/link/apps/frontend/dist /var/www
COPY --from=build-prod /usr/src/link/apps/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:1.23-alpine AS staging
COPY --from=build-staging /usr/src/app/dist /var/www
COPY --from=build-staging /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf