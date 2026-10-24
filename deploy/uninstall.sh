#!/usr/bin/env bash
# Remove the Strata-softwareservice services and nginx site.
# By default the database, backups, secrets and application files are KEPT.
#   --purge   also delete application files, secrets and the database (asks for confirmation;
#             backups in $BACKUP_DIR are never deleted by this script)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/lib.sh
. "$SCRIPT_DIR/lib.sh"

PURGE=0
[ "${1:-}" = "--purge" ] && PURGE=1

require_root
require_conf

log "Stopping and disabling services"
for unit in "${SERVICE_NAME}.service" "${SERVICE_NAME}-backup.timer" "${SERVICE_NAME}-backup.service"; do
  systemctl disable --now "$unit" >/dev/null 2>&1 || true
  rm -f "$SYSTEMD_DIR/$unit"
done
systemctl daemon-reload

log "Removing nginx site (other sites untouched)"
rm -f "$NGINX_LINK" "$NGINX_SITE"
if nginx -t >/dev/null 2>&1; then systemctl reload nginx; else warn "nginx -t fails; check other sites."; fi

if [ "$PURGE" -eq 1 ]; then
  echo "PURGE will delete $APP_DIR, $CONF_DIR and database '$DB_NAME' (role '$DB_USER')."
  echo "Backups in $BACKUP_DIR are kept."
  read -r -p "Type the database name to confirm: " CONFIRM
  if [ "$CONFIRM" = "$DB_NAME" ]; then
    as_postgres dropdb --if-exists "$DB_NAME"
    as_postgres psql -q -v role="$DB_USER" <<'SQL'
SELECT format('DROP ROLE IF EXISTS %I', :'role') \gexec
SQL
    rm -rf "${APP_DIR:?}" "${CONF_DIR:?}"
    userdel "$APP_USER" 2>/dev/null || true
    log "Purged."
  else
    warn "Confirmation did not match; data kept."
  fi
else
  log "Kept: $APP_DIR, $CONF_DIR, database '$DB_NAME', backups in $BACKUP_DIR"
fi
