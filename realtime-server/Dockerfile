FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY --chown=node:node . .
RUN yarn build \
    && npm prune --omit=dev

# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/package.json ./
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist/

CMD ["yarn", "start:prod"]