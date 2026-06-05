# ── STAGE 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# ── STAGE 2: production ───────────────────────────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S -G appgroup appuser

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/scripts ./scripts

# Give execute permissions to scripts directly in Dockerfile
RUN chmod +x scripts/entrypoint.sh \
    && chmod +x scripts/seed.sh

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["sh", "scripts/entrypoint.sh"]