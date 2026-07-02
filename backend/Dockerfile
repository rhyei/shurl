FROM node:26-slim AS deps
WORKDIR /app

RUN npm install -g pnpm@11.9.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm i --frozen-lockfile --ignore-scripts

COPY backend ./backend

RUN mkdir -p /app/geo && cd backend && node ./scripts/update-geo-db.ts

FROM oven/bun:1.3.14-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend ./backend
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

RUN cd backend && bun scripts/build.ts

FROM oven/bun:1.3.14-alpine AS init
WORKDIR /app

COPY --from=builder /app/backend/dist/scripts/init.js ./init.js
COPY --from=builder /app/backend/drizzle ./drizzle
COPY --from=builder /app/backend/clickhouse ./clickhouse

CMD ["bun", "init.js"]

FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app

COPY --from=builder /app/backend/dist/src/index.js ./index.js
COPY --from=deps /app/geo ./geo

ENV ILA_DATA_DIR=/app/geo
ENV ILA_SKIP_INITIAL_RELOAD=true
ENV ILA_AUTO_UPDATE=false

ENV PORT=3000
EXPOSE 3000

CMD ["bun", "index.js"]
