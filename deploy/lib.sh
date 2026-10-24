#!/usr/bin/env bash
# Shared helpers for Strata-softwareservice deploy scripts. Source it, don't run it.
# shellcheck disable=SC2034  # variables here are used by the scripts that source this file

SERVICE_NAME="strata-softwareservice"
CONF_DIR="/etc/${SERVICE_NAME}"
DEPLOY_CONF="${CONF_DIR}/deploy.conf"
ENV_FILE="${CONF_DIR}/strata.env"
NGINX_SITE="/etc/nginx/sites-available/${SERVICE_NAME}.conf"
NGINX_LINK="/etc/nginx/sites-enabled/${SERVICE_NAME}.conf"
SYSTEMD_DIR="/etc/systemd/system"

# Defaults, overridden by deploy.conf once it exists.
APP_DIR="/opt/${SERVICE_NAME}"
APP_USER="strata"
APP_PORT="3000"
DOMAIN=""
DB_NAME="strata"
DB_USER="strata_app"
BACKUP_DIR="/var/backups/${SERVICE_NAME}"
BACKUP_RETENTION_DAYS="14"
BACKUP_ONCALENDAR="*-*-* 02:30:00"
ENABLE_HTTPS="no"
BEHIND_PROXY="no"
EXTRA_SERVER_NAMES=""
KEEP_RELEASES="5"

log()  { printf '\033[1;32m[strata]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[strata] WARN:\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[strata] ERROR:\033[0m %s\n' "$*" >&2; exit 1; }

require_root() {
  [ "$(id -u)" -eq 0 ] || die "Run this script as root (e.g. 'su -' then 'bash $0')."
}

load_conf() {
  if [ -f "$DEPLOY_CONF" ]; then
    # shellcheck source=/dev/null
    . "$DEPLOY_CONF"
  fi
}

require_conf() {
  [ -f "$DEPLOY_CONF" ] || die "$DEPLOY_CONF not found. Run deploy/install.sh first."
  load_conf
}

# Run a command as the unprivileged app user with the app environment loaded.
as_app() {
  # shellcheck disable=SC2016  # $0/$@ are expanded by the inner shell on purpose
  runuser -u "$APP_USER" -- env -i HOME="${APP_DIR}" PATH="/usr/local/bin:/usr/bin:/bin" \
    COREPACK_HOME="${APP_DIR}/.corepack" COREPACK_ENABLE_DOWNLOAD_PROMPT=0 NEXT_TELEMETRY_DISABLED=1 \
    bash -c 'set -a; . "$0"; set +a; exec "$@"' "$ENV_FILE" "$@"
}

as_postgres() {
  (cd /tmp && runuser -u postgres -- "$@")
}

env_value() {
  # Print the value of KEY from the env file (first match, no quotes).
  sed -n "s/^$1=//p" "$ENV_FILE" 2>/dev/null | head -n1
}

http_health() {
  curl -fsS --max-time 10 "http://127.0.0.1:${APP_PORT}/api/health"
}

wait_for_health() {
  local tries="${1:-30}" i
  for ((i = 1; i <= tries; i++)); do
    if http_health >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  return 1
}

ask() {
  # ask VAR "Question" default
  local __var="$1" __q="$2" __def="${3:-}" __ans
  if [ "${STRATA_NONINTERACTIVE:-0}" = "1" ]; then
    printf -v "$__var" '%s' "${!__var:-$__def}"
    return
  fi
  read -r -p "$__q [${__def}]: " __ans
  printf -v "$__var" '%s' "${__ans:-$__def}"
}

ask_valid() {
  # ask_valid VAR "Question" default REGEX "hint": repeat until the answer matches REGEX.
  local __var="$1" __q="$2" __def="$3" __re="$4" __hint="$5"
  while true; do
    ask "$__var" "$__q" "$__def"
    [[ "${!__var}" =~ $__re ]] && return 0
    warn "Invalid value '${!__var}': $__hint"
    [ "${STRATA_NONINTERACTIVE:-0}" = "1" ] && die "Invalid $__var in non-interactive mode."
  done
}
