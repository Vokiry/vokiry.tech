#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "=== Updating ==="
git pull
chown -R 1001:1001 src/content || true
chmod -R 775 src/content || true
docker compose build nextjs
docker compose up -d

echo "=== Status ==="
docker compose ps