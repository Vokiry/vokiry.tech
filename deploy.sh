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

echo "=== Starting services ==="
docker compose up -d nginx

echo "=== Waiting for nginx ==="
sleep 5

echo "=== Getting SSL certificate ==="
docker compose run --rm -p 80:80 certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --domains "$DOMAIN" \
    --domains www."$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive

echo "=== Restarting nginx with SSL ==="
docker compose restart nginx

echo "=== Starting Next.js ==="
docker compose up -d nextjs

echo ""
echo "=== DONE ==="
echo "Site: https://$DOMAIN"
echo "Admin: https://$DOMAIN/admin"
echo ""
echo "To update:"
echo "  docker compose build && docker compose up -d"