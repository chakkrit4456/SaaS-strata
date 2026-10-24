#!/usr/bin/env bash
# Strata-softwareservice installer for Debian 13 (also Debian 12 / Ubuntu 22.04+).
# Run as root from a checkout of the repository:  bash deploy/install.sh
# Safe to re-run: existing secrets, databases and other nginx sites are never overwritten.
# Non-interactive: STRATA_NONINTERACTIVE=1 DOMAIN=example.com ADMIN_EMAIL=... bash deploy/install.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
# shellcheck source=deploy/lib.sh
. "$SCRIPT_DIR/lib.sh"

require_root
load_conf

# ---------------------------------------------------------------- OS check
[ -r /etc/os-release ] || die "Cannot detect OS (/etc/os-release missing)."
# shellcheck source=/dev/null
. /etc/os-release
case "${ID:-}" in
  debian|ubuntu) ;;
  *) case "${ID_LIKE:-}" in *debian*) ;; *) die "Unsupported OS '${ID:-?}'. Debian or Ubuntu required." ;; esac ;;
esac
log "Detected ${PRETTY_NAME:-$ID}"
if ! command -v systemctl >/dev/null || [ ! -d /run/systemd/system ]; then
  die "systemd is required and must be running."
fi

# ---------------------------------------------------------------- questions
ADMIN_EMAIL="${ADMIN_EMAIL:-}"
SMTP_HOST="${SMTP_HOST:-}"
SERVER_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
NAME_RE='^[A-Za-z0-9.-]+$'
ask_valid DOMAIN "Public domain (e.g. app.example.com, or the server IP if you have no domain)" \
  "${DOMAIN:-${SERVER_IP:-localhost}}" "$NAME_RE" "letters, digits, dots and hyphens only"
ask EXTRA_SERVER_NAMES "Other names/IPs nginx should answer to (space separated, blank for none)" \
  "${EXTRA_SERVER_NAMES:-$SERVER_IP}"
for n in $EXTRA_SERVER_NAMES; do [[ "$n" =~ $NAME_RE ]] || die "Invalid server name '$n'."; done
ask_valid BEHIND_PROXY "Is HTTPS handled by Cloudflare Tunnel or another proxy in front? (yes/no)" \
  "$BEHIND_PROXY" '^(yes|no)$' "answer yes or no"
ask APP_DIR "Install path" "$APP_DIR"
ask_valid APP_PORT "Internal app port (bound to 127.0.0.1)" "$APP_PORT" '^[0-9]+$' "must be a number"
ask_valid DB_NAME "PostgreSQL database name" "$DB_NAME" '^[a-z_][a-z0-9_]*$' \
  "lowercase letters, digits and underscore only (no hyphens), e.g. strata"
ask_valid DB_USER "PostgreSQL application role" "$DB_USER" '^[a-z_][a-z0-9_]*$' \
  "lowercase letters, digits and underscore only"
ask ADMIN_EMAIL "Platform administrator email" "$ADMIN_EMAIL"
if [ "$BEHIND_PROXY" = "yes" ]; then
  ENABLE_HTTPS="no"   # the proxy terminates TLS; no certificate is needed on this server
else
  ask_valid ENABLE_HTTPS "Request a Let's Encrypt certificate? (yes/no)" "$ENABLE_HTTPS" '^(yes|no)$' "answer yes or no"
fi
ask SMTP_HOST "SMTP host (blank to skip email for now)" "$SMTP_HOST"
ask BACKUP_DIR "Backup directory" "$BACKUP_DIR"
ask BACKUP_ONCALENDAR "Backup schedule (systemd OnCalendar)" "$BACKUP_ONCALENDAR"
ask BACKUP_RETENTION_DAYS "Days to keep backups" "$BACKUP_RETENTION_DAYS"

SCHEME="http"
if [ "$BEHIND_PROXY" = "yes" ] || [ "$ENABLE_HTTPS" = "yes" ]; then SCHEME="https"; fi
BASE_URL="$SCHEME://$DOMAIN"

# ---------------------------------------------------------------- packages
log "Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq ca-certificates curl gnupg rsync openssl nginx postgresql postgresql-contrib >/dev/null
if [ "$ENABLE_HTTPS" = "yes" ]; then
  apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
fi

node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }
if [ "$(node_major)" -lt 22 ]; then
  log "Installing Node.js 22 LTS from the NodeSource apt repository"
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
    > /etc/apt/sources.list.d/nodesource.list
  apt-get update -qq
  apt-get install -y -qq nodejs >/dev/null
fi
log "Node.js $(node -v)"
command -v corepack >/dev/null || npm install -g corepack >/dev/null
corepack enable

# ---------------------------------------------------------------- user and dirs
if ! id "$APP_USER" >/dev/null 2>&1; then
  log "Creating system user $APP_USER"
  useradd --system --home-dir "$APP_DIR" --shell /usr/sbin/nologin "$APP_USER"
fi
install -d -o "$APP_USER" -g "$APP_USER" -m 0750 "$APP_DIR" "$APP_DIR/releases" "$APP_DIR/shared" "$APP_DIR/shared/uploads"
install -d -o root -g "$APP_USER" -m 0750 "$CONF_DIR"
install -d -o postgres -g postgres -m 0700 "$BACKUP_DIR"

cat > "$DEPLOY_CONF" <<EOF
# Written by deploy/install.sh. Edit and re-run install.sh to apply.
APP_DIR="$APP_DIR"
APP_USER="$APP_USER"
APP_PORT="$APP_PORT"
DOMAIN="$DOMAIN"
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
BACKUP_DIR="$BACKUP_DIR"
BACKUP_RETENTION_DAYS="$BACKUP_RETENTION_DAYS"
BACKUP_ONCALENDAR="$BACKUP_ONCALENDAR"
ENABLE_HTTPS="$ENABLE_HTTPS"
BEHIND_PROXY="$BEHIND_PROXY"
EXTRA_SERVER_NAMES="$EXTRA_SERVER_NAMES"
KEEP_RELEASES="$KEEP_RELEASES"
EOF
chmod 0640 "$DEPLOY_CONF"; chown root:"$APP_USER" "$DEPLOY_CONF"

# ---------------------------------------------------------------- PostgreSQL
log "Configuring PostgreSQL (local connections only)"
systemctl enable --now postgresql >/dev/null
if [ -f "$ENV_FILE" ]; then
  DB_PASSWORD="$(env_value POSTGRES_URL | sed -E 's#^postgres(ql)?://[^:]+:([^@]+)@.*#\2#')"
  log "Keeping existing secrets in $ENV_FILE"
else
  DB_PASSWORD="$(openssl rand -hex 24)"
fi
as_postgres psql -v ON_ERROR_STOP=1 -q -v role="$DB_USER" -v pw="$DB_PASSWORD" -v db="$DB_NAME" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE', :'role')
  WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'role') \gexec
SELECT format('ALTER ROLE %I PASSWORD %L', :'role', :'pw') \gexec
SELECT format('CREATE DATABASE %I OWNER %I ENCODING ''UTF8'' TEMPLATE template0', :'db', :'role')
  WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'db') \gexec
SELECT format('REVOKE ALL ON DATABASE %I FROM PUBLIC', :'db') \gexec
SQL
case "$(as_postgres psql -Atc "show listen_addresses")" in
  localhost|127.0.0.1|::1|"") ;;
  *) warn "PostgreSQL listen_addresses is not localhost-only. Review postgresql.conf." ;;
esac

# ---------------------------------------------------------------- env file
if [ ! -f "$ENV_FILE" ]; then
  log "Writing $ENV_FILE"
  umask 027
  cat > "$ENV_FILE" <<EOF
# Strata-softwareservice production environment. Keep secret (mode 640, root:$APP_USER).
NODE_ENV=production
PORT=$APP_PORT
HOSTNAME=127.0.0.1
BASE_URL=$BASE_URL
POSTGRES_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
AUTH_SECRET=$(openssl rand -hex 32)
STRATA_ADMIN_EMAIL=$ADMIN_EMAIL
STRATA_DEFAULT_LOCALE=th
STRATA_DEFAULT_CURRENCY=THB
STRATA_DISPLAY_TIMEZONE=Asia/Bangkok
STRATA_UPLOAD_DIR=$APP_DIR/shared/uploads
# Payments: not configured. Fill in live/test keys, then restart the service.
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
# Email: delivery is not verified until a test message is actually received.
STRATA_SMTP_HOST=$SMTP_HOST
STRATA_SMTP_PORT=587
STRATA_SMTP_USER=
STRATA_SMTP_PASSWORD=
STRATA_SMTP_FROM=
EOF
  umask 022
elif [ "$(env_value BASE_URL)" != "$BASE_URL" ]; then
  # BASE_URL is not a secret; keep it in sync with the domain answers.
  log "Updating BASE_URL to $BASE_URL"
  sed -i "s#^BASE_URL=.*#BASE_URL=$BASE_URL#" "$ENV_FILE"
fi
chown root:"$APP_USER" "$ENV_FILE"; chmod 0640 "$ENV_FILE"

# ---------------------------------------------------------------- release
if [ -e "$APP_DIR/current" ]; then
  log "Existing installation found: deploying as an update (with pre-migration backup)"
  bash "$SCRIPT_DIR/update.sh" --from "$SRC_DIR"
else
  bash "$SCRIPT_DIR/update.sh" --from "$SRC_DIR" --install
fi

# ---------------------------------------------------------------- systemd
log "Installing systemd units"
render() {
  sed -e "s#@APP_DIR@#$APP_DIR#g" -e "s#@APP_USER@#$APP_USER#g" -e "s#@ENV_FILE@#$ENV_FILE#g" \
      -e "s#@BACKUP_ONCALENDAR@#$BACKUP_ONCALENDAR#g" "$1"
}
for unit in "$SCRIPT_DIR"/systemd/*; do
  render "$unit" > "$SYSTEMD_DIR/$(basename "$unit")"
done
install -m 0755 "$SCRIPT_DIR"/lib.sh "$SCRIPT_DIR"/backup.sh "$SCRIPT_DIR"/healthcheck.sh -t "$CONF_DIR"/
systemctl daemon-reload
systemctl enable "${SERVICE_NAME}.service" "${SERVICE_NAME}-backup.timer" >/dev/null
systemctl restart "${SERVICE_NAME}.service"
systemctl start "${SERVICE_NAME}-backup.timer"

# ---------------------------------------------------------------- nginx
log "Configuring nginx site $DOMAIN"
SERVER_NAMES="$(echo "$DOMAIN $EXTRA_SERVER_NAMES" | xargs -n1 | awk '!seen[$0]++' | xargs)"
# shellcheck disable=SC2016  # literal nginx variable
FORWARDED_PROTO='$scheme'
[ "$BEHIND_PROXY" = "yes" ] && FORWARDED_PROTO='https'
sed -e "s#@SERVER_NAMES@#$SERVER_NAMES#g" -e "s#@APP_PORT@#$APP_PORT#g" -e "s#@FORWARDED_PROTO@#$FORWARDED_PROTO#g" \
  "$SCRIPT_DIR/nginx/${SERVICE_NAME}.conf" > "$NGINX_SITE.new"
mv "$NGINX_SITE.new" "$NGINX_SITE"
ln -sf "$NGINX_SITE" "$NGINX_LINK"
if ! nginx -t 2>/tmp/strata-nginx-test.log; then
  rm -f "$NGINX_LINK"
  cat /tmp/strata-nginx-test.log >&2
  die "nginx config test failed; site disabled, other sites untouched."
fi
systemctl enable --now nginx >/dev/null
systemctl reload nginx

# ---------------------------------------------------------------- HTTPS
HTTPS_STATUS="not requested"
if [ "$ENABLE_HTTPS" = "yes" ]; then
  if [ -z "$ADMIN_EMAIL" ]; then
    HTTPS_STATUS="FAILED: an administrator email is required for Let's Encrypt"
  elif certbot --nginx --non-interactive --agree-tos --redirect -m "$ADMIN_EMAIL" -d "$DOMAIN"; then
    HTTPS_STATUS="certificate issued for $DOMAIN"
  else
    HTTPS_STATUS="FAILED (check that DNS for $DOMAIN points to this server and port 80 is open)"
  fi
fi

# ---------------------------------------------------------------- verify
log "Waiting for the application to report healthy"
if wait_for_health 45; then
  log "Health: $(http_health)"
else
  warn "Application did not become healthy. Inspect: journalctl -u ${SERVICE_NAME} -n 100"
fi

cat <<EOF

Strata-softwareservice install finished.
  URL:        $BASE_URL  (nginx answers: $SERVER_NAMES; Let's Encrypt: $HTTPS_STATUS; behind proxy: $BEHIND_PROXY)
  App dir:    $APP_DIR/current
  Secrets:    $ENV_FILE
  Service:    systemctl status ${SERVICE_NAME}
  Logs:       journalctl -u ${SERVICE_NAME} -f
  Backups:    $BACKUP_DIR (timer ${SERVICE_NAME}-backup.timer, $BACKUP_ONCALENDAR)
  Health:     bash $CONF_DIR/healthcheck.sh
Not configured yet: payments (Stripe keys empty), SMTP credentials.
EOF
