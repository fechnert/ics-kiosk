FROM node:21.5-slim AS base

RUN corepack enable
COPY . /app
WORKDIR /app


FROM base as build

RUN pnpm install --frozen-lockfile
RUN pnpm run build


FROM nginx:latest as prod

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]