FROM node:18-alpine AS setup
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY ../../.npmrc package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .

FROM setup AS build-prod
RUN pnpm build
RUN apt-get update && \
    apt-get install -y openssl && \
    openssl genrsa -des3 -passout pass:x -out server.pass.key 2048 && \
    openssl rsa -passin pass:x -in server.pass.key -out server.key && \
    rm server.pass.key && \
    openssl req -new -key server.key -out server.csr \
        -subj "/C=RO/ST=Bucharest/L=Bucharest/O=CorporateIntelligence/OU=IT Department/CN=example.com" && \
    openssl x509 -req -days 10365 -in server.csr -signkey server.key -out server.crt

FROM setup AS build-staging
RUN pnpm build:staging

FROM nginx:1.23-alpine AS production
COPY --from=build-prod /usr/src/app/dist /var/www
COPY --from=build-prod /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:1.23-alpine AS staging
COPY --from=build-staging /usr/src/app/dist /var/www
COPY --from=build-staging /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf