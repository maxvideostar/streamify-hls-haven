#!/usr/bin/env bash
# NetStreaming Live TV - install / update (run as root)
# Usage: sudo DOMAIN=tv.netstreaming.eu EMAIL=you@mail.com bash deploy.sh
set -euo pipefail

DOMAIN="${DOMAIN:-tv.netstreaming.eu}"
EMAIL="${EMAIL:-}"
BRANCH="${BRANCH:-netstreaming-channels}"
REPO="https://github.com/maxvideostar/streamify-hls-haven"
SRC=/opt/streamify-hls-haven
WEBROOT=/var/www/streamify

[ "$(id -u)" = 0 ] || { echo "Ruleaza cu sudo/root"; exit 1; }
log(){ echo -e "\e[1;32m==>\e[0m $*"; }

# 1. Node.js >= 18
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 18 ]; then
  log "Instalez Node.js 20"
  apt-get update -qq && apt-get install -y -qq curl ca-certificates git rsync
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
command -v git >/dev/null && command -v rsync >/dev/null || apt-get install -y -qq git rsync

# 2. Cod sursa (clone sau update)
if [ -d "$SRC/.git" ]; then
  log "Actualizez codul"
  git -C "$SRC" fetch -q origin "$BRANCH" && git -C "$SRC" checkout -q "$BRANCH" && git -C "$SRC" reset -q --hard "origin/$BRANCH"
else
  log "Clonez repo"
  git clone -q -b "$BRANCH" "$REPO" "$SRC"
fi

# 3. Build
log "Build"
cd "$SRC" && npm ci --no-audit --no-fund --silent && npm run build --silent

# 4. Copiere (channels.json de pe server NU se suprascrie la update)
mkdir -p "$WEBROOT"
EXCL=(); [ -f "$WEBROOT/channels.json" ] && EXCL=(--exclude channels.json)
rsync -a --delete "${EXCL[@]}" "$SRC/dist/" "$WEBROOT/"
log "Fisiere in $WEBROOT"

# 5. nginx: gaseste config-ul (pachet sau compilat din sursa)
NGINX=$(command -v nginx || echo /usr/local/nginx/sbin/nginx)
[ -x "$NGINX" ] || { echo "nginx nu e instalat"; exit 1; }
CONF=$("$NGINX" -V 2>&1 | grep -o -- '--conf-path=[^ ]*' | cut -d= -f2)
CONF=${CONF:-/usr/local/nginx/conf/nginx.conf}
CONFD="$(dirname "$CONF")/conf.d"; mkdir -p "$CONFD"
SITE="$CONFD/streamify.conf"

LOCS="    root $WEBROOT;
    index index.html;
    location / { try_files \$uri /index.html; }
    location = /channels.json { add_header Cache-Control \"no-store\"; }
    location /assets/ { expires 1y; add_header Cache-Control \"public, immutable\"; }"

write_http(){ cat > "$SITE" <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    location ^~ /.well-known/acme-challenge/ { root $WEBROOT; }
$LOCS
}
EOF
}

write_https(){ cat > "$SITE" <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    location ^~ /.well-known/acme-challenge/ { root $WEBROOT; }
    location / { return 301 https://\$host\$request_uri; }
}
server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
$LOCS
}
EOF
}

if ! grep -qE "include[^;]*conf\.d/\*\.conf" "$CONF"; then
  log "Adaug 'include conf.d/*.conf;' in $CONF"
  sed -i "0,/http[[:space:]]*{/s//http {\n    include $CONFD\/*.conf;/" "$CONF"
fi

CERT=/etc/letsencrypt/live/$DOMAIN/fullchain.pem
if [ -f "$CERT" ]; then write_https; else write_http; fi
"$NGINX" -t && "$NGINX" -s reload

# 6. SSL (Let's Encrypt, webroot) daca nu exista deja
if [ ! -f "$CERT" ]; then
  command -v certbot >/dev/null || apt-get install -y -qq certbot
  log "Cer certificat SSL pentru $DOMAIN"
  if certbot certonly --webroot -w "$WEBROOT" -d "$DOMAIN" --non-interactive --agree-tos \
       ${EMAIL:+-m "$EMAIL"} ${EMAIL:---register-unsafely-without-email}; then
    write_https && "$NGINX" -t && "$NGINX" -s reload
    echo "$NGINX -s reload" > /etc/letsencrypt/renewal-hooks/deploy/streamify-nginx.sh
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/streamify-nginx.sh
  else
    echo "!! SSL a esuat (DNS-ul pentru $DOMAIN arata spre server?). Site-ul merge pe HTTP."
  fi
fi

log "Gata: https://$DOMAIN"
echo "Canale: editeaza $WEBROOT/channels.json (fara rebuild, doar refresh in browser)"
echo "Update: ruleaza din nou acest script"
