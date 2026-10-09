#!/bin/bash
set -e

echo "==> Setting up data directory..."
mkdir -p /data/media /code/backend/staticfiles

# Copy initial media files to /data/media if empty
if [ -d "/code/backend/media" ] && [ -d "/data/media" ]; then
    if [ ! "$(ls -A /data/media 2>/dev/null)" ]; then
        echo "==> Initializing /data/media with default media files..."
        cp -rn /code/backend/media/* /data/media/ 2>/dev/null || true
    fi
fi

cd /code/backend

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Starting Daphne ASGI server on port 8080..."
exec daphne -b 0.0.0.0 -p 8080 myshop.asgi:application
