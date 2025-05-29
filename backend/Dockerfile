# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npm ci --only=production && \
    npm run build && \
    npm prune --production

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY .env.prod ./

RUN mkdir -p ./logs && \
    chown -R node:node ./logs

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node ./dist/common/services/health-check.js

CMD ["node", "./dist/server.js"]
