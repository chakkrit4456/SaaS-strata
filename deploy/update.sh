#!/usr/bin/env bash
# Build and activate a new release of Strata-softwareservice.
# Usage (as root, from an updated checkout):  git pull && bash deploy/update.sh
#   --from DIR   source checkout to deploy (default: repository containing this script)
#   --install    used by install.sh on first install (no pre-migration backup or restart)
# Order: copy source -> install deps -> build -> backup DB -> migrate -> switch symlink -> restart -> health check.
# If the new release is unhealthy, the previous release is restored. Migrations are NOT reversed
# automatically; restore the pre-migration backup with deploy/restore.sh if the schema change must be undone.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/lib.sh
. "$SCRIPT_DIR/lib.sh"

SRC_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FIRST_INSTALL=0
while [ $# -gt 0 ]; do
  case "$1" in
    --from) SRC_DIR="$(cd "$2" && pwd)"; shift 2 ;;
    --install) FIRST_INSTALL=1; shift ;;
    *) die "Unknown option: $1" ;;
  esac
done

require_root
require_conf
[ -f "$SRC_DIR/package.json" ] || die "$SRC_DIR does not look like the project root."

RELEASE="$(date -u +%Y%m%d%H%M%S)"
REL_DIR="$APP_DIR/releases/$RELEASE"
CURRENT="$APP_DIR/current"
PREVIOUS="$(readlink -f "$CURRENT" 2>/dev/null || true)"

log "Preparing release $RELEASE from $SRC_DIR"
install -d -o "$APP_USER" -g "$APP_USER" -m 0750 "$REL_DIR"
rsync -a --delete \
  --exclude .git --exclude node_modules --exclude .next --exclude '.env*' \
  --exclude design --exclude test-results --exclude playwright-report \
  "$SRC_DIR"/ "$REL_DIR"/
if [ -d "$SRC_DIR/.git" ] && command -v git >/dev/null; then
  git -C "$SRC_DIR" rev-parse HEAD > "$REL_DIR/REVISION" 2>/dev/null || true
fi
chown -R "$APP_USER":"$APP_USER" "$REL_DIR"

cleanup_failed() {
  warn "Release $RELEASE failed before activation; removing it. The running release is unchanged."
  rm -rf "$REL_DIR"
}
trap cleanup_failed ERR

log "Installing dependencies"
(cd "$REL_DIR" && as_app corepack pnpm install --frozen-lockfile)
log "Building"
(cd "$REL_DIR" && as_app corepack pnpm build)

if [ "$FIRST_INSTALL" -eq 0 ]; then
  log "Backing up the database before migrating"
  bash "$SCRIPT_DIR/backup.sh" --tag "pre-$RELEASE"
fi
log "Applying database migrations"
(cd "$REL_DIR" && as_app corepack pnpm db:migrate)
trap - ERR

log "Activating release $RELEASE"
ln -sfn "$REL_DIR" "$CURRENT.tmp"
mv -T "$CURRENT.tmp" "$CURRENT"

if [ "$FIRST_INSTALL" -eq 0 ]; then
  systemctl restart "${SERVICE_NAME}.service"
  if wait_for_health 45; then
    log "Release $RELEASE is healthy"
  else
    warn "Release $RELEASE is unhealthy."
    if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
      warn "Rolling back to $(basename "$PREVIOUS")"
      ln -sfn "$PREVIOUS" "$CURRENT.tmp"
      mv -T "$CURRENT.tmp" "$CURRENT"
      systemctl restart "${SERVICE_NAME}.service"
      if wait_for_health 30; then warn "Previous release is serving again."; else warn "Previous release is also unhealthy."; fi
    fi
    die "Update failed. Logs: journalctl -u ${SERVICE_NAME} -n 200. DB backup tagged pre-$RELEASE is in $BACKUP_DIR."
  fi
fi

log "Pruning old releases (keeping $KEEP_RELEASES)"
find "$APP_DIR/releases" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -r \
  | tail -n +"$((KEEP_RELEASES + 1))" | while read -r old; do
      [ "$APP_DIR/releases/$old" = "$(readlink -f "$CURRENT")" ] || rm -rf "${APP_DIR:?}/releases/$old"
    done
