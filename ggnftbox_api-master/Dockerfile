# FIRST STAGE

FROM node:16.15.1-alpine as builder

ENV NODE_ENV build

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY .yarn/ ./.yarn/
COPY .yarnrc.yml ./

RUN yarn install

COPY ./ ./

RUN yarn prod-install /usr/src/build
RUN yarn run prisma generate
RUN yarn build

RUN cp -r dist/ /usr/src/build/dist/

# SECOND STAGE
FROM node:16.15.1-alpine AS prod

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY cadence/ ./cadence/
COPY prisma/ ./prisma/

COPY --from=builder /usr/src/build/ ./
COPY --from=builder /usr/src/app/node_modules/.prisma/ ./node_modules/.prisma/

CMD ["yarn", "start:prod"]
