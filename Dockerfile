# Multi-stage Dockerfile for YouTube Creator Toolkit Pro
# Build: docker build -t youtube-toolkit-pro .
# Run:   docker run -p 3000:3000 --env-file .env.local youtube-toolkit-pro

# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install Python3, FFmpeg, git, and yt-dlp with default extras and system symlinks
RUN apk add --no-cache python3 py3-pip ffmpeg git ca-certificates libc6-compat && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir -U "yt-dlp[default]" && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    ln -sf /opt/venv/bin/python /usr/local/bin/python && \
    ln -sf /opt/venv/bin/yt-dlp /usr/local/bin/yt-dlp && \
    ln -sf /usr/bin/ffmpeg /usr/local/bin/ffmpeg && \
    /opt/venv/bin/python -m yt_dlp --remote-components ejs:github --js-runtimes node --version || true

ENV PATH="/opt/venv/bin:$PATH"

# Setup non-root nextjs user with full home directory permissions for yt-dlp cache
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 -h /home/nextjs nextjs && \
    mkdir -p /home/nextjs/.cache/yt-dlp && \
    chown -R nextjs:nodejs /home/nextjs
ENV HOME=/home/nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure temp downloads directory exists and has correct permissions
RUN mkdir -p /app/.temp_downloads && chown -R nextjs:nodejs /app/.temp_downloads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
