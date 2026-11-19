#!/usr/bin/env bash
# Build and publish to the "ayer" container (~/docker/ayer), served at https://ayer.aminox.dev.
# Copies the site to data/html and the nginx config next to compose.yaml; reloads nginx if it changed.
set -euo pipefail
cd "$(dirname "$0")"
TARGET="${AYER_DEPLOY_DIR:-$HOME/docker/ayer}"  # override for your own server

npm run build
rsync -a --delete dist/ "$TARGET/data/html/"
changed=0
for f in nginx.conf og.js; do
  if ! cmp -s "deploy/$f" "$TARGET/$f"; then
    cp "deploy/$f" "$TARGET/$f"
    changed=1
  fi
done
if [ "$changed" = 1 ] && docker ps --format '{{.Names}}' | grep -qx ayer; then
  docker exec ayer nginx -t && docker exec ayer nginx -s reload
  echo "nginx recargado"
fi
echo "Web publicada en $TARGET/data/html"
