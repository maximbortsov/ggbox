# Build legacy NestJS API on Node 20 LTS. Node 24 is not compatible with the old Nest CLI.
FROM node:20.20.2-bookworm-slim AS builder

ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/

RUN corepack enable && yarn install --immutable

COPY ./ ./

RUN yarn prisma:generate
RUN yarn build

FROM node:20.20.2-bookworm-slim AS prod

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /usr/src/app/.yarn/ ./.yarn/
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/dist/ ./dist/
COPY --from=builder /usr/src/app/cadence/ ./cadence/
COPY --from=builder /usr/src/app/prisma/ ./prisma/

RUN mkdir -p files

EXPOSE 3000

CMD ["sh", "-c", "yarn db:migrate-up && yarn start:prod"]
