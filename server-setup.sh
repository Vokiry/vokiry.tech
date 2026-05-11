#!/bin/bash
set -e

echo "=== Installing Docker ==="
apt update && apt install -y curl

curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-v2 || apt install -y docker-compose

echo "=== Docker installed ==="
docker --version

echo ""
echo "=== Next steps ==="
echo "1. git clone your repo to server"
echo "2. cd to project directory"
echo "3. chmod +x deploy.sh update.sh"
echo "4. export ADMIN_PASSWORD=your_secure_password"
echo "5. ./deploy.sh"