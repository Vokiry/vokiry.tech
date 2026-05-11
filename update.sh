#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "=== Updating ==="
git pull
docker compose build nextjs
docker compose up -d

echo "=== Status ==="
docker compose ps