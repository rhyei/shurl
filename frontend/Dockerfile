FROM node:26-slim AS deps
WORKDIR /app

RUN npm install -g pnpm@11.9.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm i --frozen-lockfile --ignore-scripts

COPY frontend ./frontend

FROM oven/bun:1.3.14-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend ./frontend
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

RUN cd ./frontend && bun run build

FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app

COPY --from=builder /app/frontend/dist ./frontend/dist

WORKDIR /app/frontend

ENV PORT=80
EXPOSE 80

CMD ["bun", "dist/server/index.mjs"]
