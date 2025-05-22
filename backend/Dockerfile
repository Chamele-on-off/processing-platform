# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN mkdir -p ./logs && \
    touch ./logs/error.log && \
    touch ./logs/combined.log && \
    chown -R node:node ./logs

USER node

EXPOSE 3000

CMD ["npm", "start"]
