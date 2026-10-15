FROM node:26-alpine AS base
USER node
WORKDIR /app
COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json
RUN npm ci

FROM node:26-alpine AS deps
USER node
WORKDIR /app
COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json
RUN npm ci --omit=dev

FROM base AS build
USER node
WORKDIR /app
COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node src/ src/
RUN npm run build

FROM node:26-alpine AS final
USER node
WORKDIR /app
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/package.json ./
COPY --chown=node:node service_account_credentials.json /app/service_account_credentials.json
CMD [ "node", "/app/dist/index.js" ]