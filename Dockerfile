FROM node:20-slim AS build
WORKDIR /app

# Prisma needs OpenSSL available to correctly select engines
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server ./server
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

# Railway sets PORT automatically; we also serve static from /dist
ENV SERVE_STATIC=1
ENV NODE_ENV=production

EXPOSE 8080

# Use npx tsx directly (more reliable in Docker)
CMD ["npx", "tsx", "server/index.ts"]

