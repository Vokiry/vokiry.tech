#!/bin/bash
set -e

DOMAIN="vokiry.tech"
EMAIL="vokiiry@gmail.com"
PROJECT_DIR="$(dirname "$0")"

cd "$PROJECT_DIR"

echo "=== Creating directories ==="
mkdir -p nginx/conf.d nginx/ssl certbot/conf certbot/www static

echo "=== Building Next.js ==="
docker compose build nextjs

echo "=== Starting Next.js only ==="
docker compose up -d nextjs

echo "=== Starting Nginx (HTTP only) ==="
docker compose up -d nginx

echo "=== Waiting for nginx ==="
sleep 5

echo "=== Getting SSL certificate ==="
docker compose run --rm --network host certbot certonly \
    --standalone \
    --preferred-challenges http \
    --http-01-port 80 \
    --domains "$DOMAIN" \
    --domains www."$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive \
    --force-renewal || echo "Certificate may already exist"

echo "=== Restarting nginx with SSL ==="
docker compose restart nginx

echo ""
echo "=== DONE ==="
echo "Site: https://$DOMAIN"
echo "Admin: https://$DOMAIN/admin"