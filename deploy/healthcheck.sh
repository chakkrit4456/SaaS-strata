#!/usr/bin/env bash
# Report the health of Strata-softwareservice and its dependencies. Exit code 0 = healthy, 1 = problem found.
# Usage: bash deploy/healthcheck.sh
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/lib.sh
. "$SCRIPT_DIR/lib.sh"
require_conf

FAIL=0
ok()  { printf '  \033[32mOK\033[0m    %s\n' "$*"; }
bad() { printf '  \033[31mFAIL\033[0m  %s\n' "$*"; FAIL=1; }
note(){ printf '  \033[33mWARN\033[0m  %s\n' "$*"; }

echo "Strata-softwareservice health ($(date -u +%FT%TZ))"

for unit in "${SERVICE_NAME}.service" postgresql.service nginx.service; do
  if systemctl is-active --quiet "$unit"; then ok "$unit active"; else bad "$unit not active"; fi
done

if systemctl is-active --quiet "${SERVICE_NAME}-backup.timer"; then
  ok "backup timer active (next: $(systemctl show -p NextElapseUSecRealtime --value "${SERVICE_NAME}-backup.timer"))"
else
  bad "backup timer not active"
fi
if systemctl is-failed --quiet "${SERVICE_NAME}-backup.service"; then
  bad "last backup run failed (journalctl -u ${SERVICE_NAME}-backup)"
fi

if command -v pg_isready >/dev/null && pg_isready -q -h localhost; then ok "PostgreSQL accepting connections"; else bad "PostgreSQL not accepting connections"; fi

if BODY="$(http_health 2>/dev/null)"; then ok "app /api/health: $BODY"; else bad "app /api/health not responding on 127.0.0.1:${APP_PORT}"; fi

LATEST="$(find "$BACKUP_DIR" -maxdepth 1 -name '*.dump' -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2-)"
if [ -z "$LATEST" ]; then
  note "no database backups found in $BACKUP_DIR"
elif [ -n "$(find "$LATEST" -mmin +1560)" ]; then
  bad "latest backup is older than 26h: $LATEST"
else
  ok "latest backup: $LATEST"
fi

for path in "$APP_DIR" "$BACKUP_DIR" /var/lib/postgresql; do
  [ -d "$path" ] || continue
  USE="$(df --output=pcent "$path" | tail -1 | tr -dc '0-9')"
  if [ "$USE" -ge 90 ]; then bad "disk ${USE}% used at $path"
  elif [ "$USE" -ge 80 ]; then note "disk ${USE}% used at $path"
  else ok "disk ${USE}% used at $path"; fi
done

CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
if [ -f "$CERT" ]; then
  if openssl x509 -checkend $((14 * 86400)) -noout -in "$CERT" >/dev/null; then
    ok "TLS certificate valid until $(openssl x509 -enddate -noout -in "$CERT" | cut -d= -f2)"
  else
    bad "TLS certificate expires within 14 days ($CERT)"
  fi
elif [ "${ENABLE_HTTPS}" = "yes" ]; then
  bad "HTTPS enabled but no certificate at $CERT"
fi

exit "$FAIL"
