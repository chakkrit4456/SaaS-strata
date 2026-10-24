#!/usr/bin/env bash
# Restore a database backup made by backup.sh. This REPLACES the current database contents.
# Usage: bash deploy/restore.sh /var/backups/strata-softwareservice/strata-YYYYmmddTHHMMSSZ.dump
#   --test   restore into a temporary database, check it, then drop it (does not touch production)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/lib.sh
. "$SCRIPT_DIR/lib.sh"

TEST_ONLY=0
DUMP=""
while [ $# -gt 0 ]; do
  case "$1" in
    --test) TEST_ONLY=1; shift ;;
    -*) die "Unknown option: $1" ;;
    *) DUMP="$1"; shift ;;
  esac
done

require_root
require_conf
if [ -z "$DUMP" ] || [ ! -f "$DUMP" ]; then
  die "Usage: $0 [--test] <backup.dump>"
fi

if [ -f "$DUMP.sha256" ]; then
  sha256sum --check --status "$DUMP.sha256" || die "Checksum mismatch for $DUMP."
  log "Checksum OK"
else
  warn "No checksum file found for $DUMP"
fi

if [ "$TEST_ONLY" -eq 1 ]; then
  TMP_DB="${DB_NAME}_restore_test_$$"
  log "Test restore into temporary database $TMP_DB"
  as_postgres createdb "$TMP_DB"
  trap 'as_postgres dropdb --if-exists "$TMP_DB"' EXIT
  as_postgres pg_restore --no-owner --exit-on-error --dbname="$TMP_DB" "$DUMP"
  TABLES="$(as_postgres psql -d "$TMP_DB" -Atc "select count(*) from pg_tables where schemaname='public'")"
  log "Test restore OK: $TABLES tables in public schema"
  exit 0
fi

echo "This will replace ALL data in database '$DB_NAME' with $DUMP."
read -r -p "Type the database name to confirm: " CONFIRM
[ "$CONFIRM" = "$DB_NAME" ] || die "Confirmation did not match; nothing changed."

log "Taking a safety backup of the current database first"
bash "$SCRIPT_DIR/backup.sh" --tag pre-restore

log "Stopping ${SERVICE_NAME}"
systemctl stop "${SERVICE_NAME}.service"
trap 'systemctl start "${SERVICE_NAME}.service" || true' EXIT

log "Restoring"
as_postgres pg_restore --clean --if-exists --no-owner --role="$DB_USER" --single-transaction \
  --exit-on-error --dbname="$DB_NAME" "$DUMP"

systemctl start "${SERVICE_NAME}.service"
trap - EXIT
if wait_for_health 30; then
  log "Restore complete and application healthy."
else
  die "Restore finished but the application is unhealthy. Check journalctl -u ${SERVICE_NAME}."
fi
