# GGBox legacy local revival

Legacy 2022 NFT video-shot marketplace monorepo. The goal of this branch is to make the old API and web client build/run locally with a pinned modern Node LTS runtime and documented local defaults.

## Projects

- `ggnftbox_api-master` — NestJS API + Prisma/PostgreSQL + Flow/Cadence helpers.
- `ggnftbox_react-main` — React/webpack web client.
- `gg_nft-master` — Flow contracts/tests. This part is still legacy and is not required for the minimal web/API boot path.

## Runtime

Use Node.js `20.20.2` from the repository root:

```bash
nvm use
```

Node 24 currently breaks the legacy Nest CLI with `(0 , util_1.isObject) is not a function`, so keep Node 20 for local work until the Nest stack is migrated.

## Local run without Docker

Yes, the project can run locally without Docker. You still need a PostgreSQL server; use a native install, Homebrew, apt, Postgres.app, or any external PostgreSQL reachable from your machine.

### 1. Prepare runtime and database

```bash
nvm use
corepack enable
createdb ggbox
```

If your PostgreSQL user/password/database is different, update `DATABASE_URL` in `ggnftbox_api-master/.env` accordingly.

### 2. Start the API

```bash
cd ggnftbox_api-master
cp .env.local.example .env
yarn install
yarn prisma:generate
yarn db:migrate-up
yarn start:dev
```

The API listens on <http://localhost:3000/api>. Swagger is available at <http://localhost:3000/swagger>.

The local env example uses placeholder secrets for integrations. Basic API boot, database migrations, and local frontend calls do not need real Flow, Pinata, email, Payeer, or Graffle credentials, but those flows will need real secrets before end-to-end testing.

### 3. Start the web client

Use a separate terminal:

```bash
cd ggnftbox_react-main
npm ci
REACT_APP_API_SOURCE=http://localhost:3000 npm start
```

The webpack dev server listens on <http://localhost:8080> by default to avoid colliding with the API on port 3000. Override it with `DEV_SERVER_PORT=<port>` if needed.

### 4. Optional build checks

```bash
cd ggnftbox_api-master
yarn build
```

```bash
cd ggnftbox_react-main
REACT_APP_API_SOURCE=http://localhost:3000 npm run build
```

## Optional Docker Compose smoke run

Docker is not required for local development. If you do want an isolated smoke run, the compose file starts PostgreSQL, runs Prisma migrations before the API boot, and serves the web bundle through nginx.

```bash
docker compose up --build
```

Compose URLs:

- Web: <http://localhost:8080>
- API: <http://localhost:3000/api>
- Swagger: <http://localhost:3000/swagger>
- PostgreSQL: `localhost:5432` (`ggbox` / `ggbox` / `ggbox`)
