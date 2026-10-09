# syntax=docker/dockerfile:1

# ─── Stage 1: Build React/Expo Web Frontend ──────────────────────────────────
FROM node:18-slim AS frontend-builder

WORKDIR /frontend

# Copy frontend package files first for better layer caching
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps

# Copy the rest of the frontend source
COPY frontend/ ./

# Build the Expo web app (outputs to web-build/ or dist/)
RUN npx expo export:web || npx expo export --platform web || npx expo export || true
RUN mkdir -p web-build && if [ -d "dist" ] && [ ! -f "web-build/index.html" ]; then cp -r dist/* web-build/ 2>/dev/null || true; fi


# ─── Stage 2: Python Backend + Serve Frontend ────────────────────────────────
FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /code /data/media

WORKDIR /code

# System dependencies for WeasyPrint, cairo, pango, libffi
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    fonts-liberation \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from backend directory
COPY backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    pip install --no-cache-dir whitenoise

# Copy all project files
COPY . /code

# Copy the built frontend into Django's frontend_build path
COPY --from=frontend-builder /frontend/web-build/ /code/backend/frontend_build/

WORKDIR /code/backend

# Copy entrypoint and make executable
COPY entrypoint.sh /code/backend/entrypoint.sh
RUN chmod +x /code/backend/entrypoint.sh && \
    sed -i 's/\r$//' /code/backend/entrypoint.sh

EXPOSE 8080

CMD ["/bin/bash", "/code/backend/entrypoint.sh"]
