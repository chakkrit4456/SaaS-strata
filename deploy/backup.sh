#!/usr/bin/env bash
# Back up the Strata-softwareservice database (and uploaded files) with retention and an integrity check.
# Usage: bash deploy/backup.sh [--tag NAME]     (run by strata-softwareservice-backup.timer)
# Backups are not encrypted by this script; keep $BACKUP_DIR on an encrypted disk or copy
# them off-site with an encrypting tool (see docs/BACKUP_RECOVERY.md).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/lib.sh
. "$SCRIPT_DIR/lib.sh"

TAG=""
while [ $# -gt 0 ]; do
  case "$1" in
    --tag) TAG="-$2"; shift 2 ;;
    *) die "Unknown option: $1" ;;
  esac
done

require_root
require_conf
install -d -o postgres -g postgres -m 0700 "$BACKUP_DIR"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP="$BACKUP_DIR/${DB_NAME}-${STAMP}${TAG}.dump"

# Need roughly the current DB size free (custom format is compressed, so this is generous).
DB_BYTES="$(as_postgres psql -Atc "select pg_database_size('${DB_NAME}')")"
FREE_BYTES="$(( $(df --output=avail -k "$BACKUP_DIR" | tail -1) * 1024 ))"
[ "$FREE_BYTES" -gt "$DB_BYTES" ] || die "Not enough free space in $BACKUP_DIR for a backup."

log "Dumping database $DB_NAME to $DUMP"
as_postgres pg_dump --format=custom --no-owner --dbname="$DB_NAME" --file="$DUMP.partial"
as_postgres pg_restore --list "$DUMP.partial" >/dev/null || { rm -f "$DUMP.partial"; die "Integrity check failed: dump is unreadable."; }
mv "$DUMP.partial" "$DUMP"
sha256sum "$DUMP" > "$DUMP.sha256"
chmod 0600 "$DUMP" "$DUMP.sha256"
chown postgres:postgres "$DUMP" "$DUMP.sha256"

UPLOADS="$APP_DIR/shared/uploads"
if [ -d "$UPLOADS" ] && [ -n "$(ls -A "$UPLOADS" 2>/dev/null)" ]; then
  tar -C "$APP_DIR/shared" -czf "$BACKUP_DIR/uploads-${STAMP}${TAG}.tar.gz" uploads
  chmod 0600 "$BACKUP_DIR/uploads-${STAMP}${TAG}.tar.gz"
fi

log "Removing backups older than $BACKUP_RETENTION_DAYS days"
find "$BACKUP_DIR" -maxdepth 1 -type f \( -name '*.dump' -o -name '*.sha256' -o -name 'uploads-*.tar.gz' \) \
  -mtime +"$BACKUP_RETENTION_DAYS" -delete

log "Backup complete: $DUMP ($(du -h "$DUMP" | cut -f1))"
