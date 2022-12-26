FROM node:18-alpine AS setup
WORKDIR /usr/src/app
COPY .npmrc package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile --no-optional
COPY . .

FROM setup AS build-prod
RUN pnpm build

FROM setup AS build-staging
RUN pnpm build:staging

FROM nginx:1.23-alpine AS production
COPY --from=build-prod /usr/src/app/dist /var/www
COPY --from=build-prod /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:1.23-alpine AS staging
COPY --from=build-staging /usr/src/app/dist /var/www
COPY --from=build-staging /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf