FROM node:20-slim AS deps

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci

# ===
FROM node:20-slim AS builder

WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN npm run build

# ===
FROM node:20-slim

WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]
