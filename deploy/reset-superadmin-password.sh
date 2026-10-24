#!/usr/bin/env bash
# Reset (or create) the Strata-softwareservice Super Admin password on the server.
# Usage (as root):
#   bash deploy/reset-superadmin-password.sh                 # prompts for the new password
#   bash deploy/reset-superadmin-password.sh --generate      # generates one and prints it once
#   bash deploy/reset-superadmin-password.sh --email someone@example.com
# Default email: chakkritnb4456@gmail.com
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/lib.sh
. "$SCRIPT_DIR/lib.sh"

require_root
require_conf
[ -d "$APP_DIR/current" ] || die "No active release at $APP_DIR/current. Run deploy/install.sh first."
[ -f "$APP_DIR/current/scripts/reset-superadmin-password.ts" ] || \
  die "The active release has no reset script. Run 'git pull && bash deploy/update.sh' first."

cd "$APP_DIR/current"
# runuser keeps the terminal, so the hidden password prompt still works.
as_app node_modules/.bin/tsx scripts/reset-superadmin-password.ts "$@"
