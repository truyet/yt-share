FROM --platform=linux/amd64 node:20-alpine as builder

ENV NODE_ENV build

RUN apk add openssl3

USER node
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn install

COPY --chown=node:node . .
RUN npx prisma generate && yarn build \
    && npm prune --omit=dev

# ---

FROM --platform=linux/amd64 node:20-alpine

ENV NODE_ENV production

RUN apk add openssl3

USER node
WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/prisma/ ./prisma/
COPY --from=builder --chown=node:node /usr/src/app/package.json ./
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist/

CMD ["yarn", "start:prod"]