# Deploying Strata-softwareservice on Debian 13

Native install: PostgreSQL, Node.js 22 LTS, Nginx and systemd. No Docker.
The installer runs as root, but the app runs as the unprivileged system user `strata`.

## Requirements
- Debian 13 "trixie" (standard system utilities), freshly installed or shared. Debian 12 and Ubuntu 22.04+ should work but are untested.
- 2 vCPU / 2 GB RAM minimum (the Next.js build needs about 1.5 GB), 10 GB disk.
- Internet access during install (apt, NodeSource, npm registry).
- For HTTPS: a DNS A/AAAA record pointing at the server, and ports 80/443 open.

## First install
```bash
apt-get update && apt-get install -y git
git clone <your-repo-url> /root/strata-softwareservice
cd /root/strata-softwareservice
bash deploy/install.sh
```
The installer asks for domain, install path, port, DB name/role, admin email, HTTPS, SMTP host and backup schedule.
For an unattended install, set `STRATA_NONINTERACTIVE=1` and pass answers as variables (`DOMAIN`, `APP_DIR`, `APP_PORT`,
`DB_NAME`, `DB_USER`, `ADMIN_EMAIL`, `ENABLE_HTTPS`, `SMTP_HOST`, `BACKUP_DIR`, `BACKUP_ONCALENDAR`, `BACKUP_RETENTION_DAYS`).

What it does, in order: checks the OS and systemd → installs packages → installs Node 22 if needed → creates the `strata`
user and the directories → creates a PostgreSQL role and database (localhost only, least privilege) → writes secrets to
`/etc/strata-softwareservice/strata.env` (only if it doesn't already exist) → builds a release → runs migrations → installs systemd units →
adds the nginx site → requests a certificate (optional) → checks health.

Re-running it is safe. Existing secrets, databases and other nginx sites are kept. If an installation already exists,
the code is deployed through the update path, which takes a backup first.

## Cloudflare Tunnel (no public IP / no open ports)
1. Run the installer and answer:
   - **Public domain:** your hostname, e.g. `itdev.in.th`
   - **Other names/IPs:** the server's LAN IP (the default), so you can still reach it at `http://<LAN IP>` for testing
   - **Behind Cloudflare Tunnel:** `yes`. This sets `BASE_URL=https://<domain>`, skips Let's Encrypt, and makes nginx tell
     the app the request came in over https.
2. In Cloudflare Zero Trust → Networks → Tunnels → *Public hostname* (Add published application):
   - Subdomain: blank (or e.g. `app`), Domain: `itdev.in.th`, Path: blank
   - Service URL: `http://localhost:80` if `cloudflared` runs on this server, otherwise `http://<server LAN IP>:80`
3. Cloudflare SSL/TLS mode: Full or Flexible both work, because the tunnel connects to nginx over plain http inside the network.

Session cookies are marked `Secure`, so logging in only works through `https://<domain>`, not through the LAN IP over plain http.

To change domain or proxy settings later, re-run `bash deploy/install.sh`. Your previous answers are offered as defaults,
and existing secrets and data are kept.

## Layout
| Path | Contents |
|---|---|
| `/opt/strata-softwareservice/releases/<UTC timestamp>` | built releases (last 5 kept) |
| `/opt/strata-softwareservice/current` | symlink to the active release |
| `/opt/strata-softwareservice/shared/uploads` | uploaded files (survive updates) |
| `/etc/strata-softwareservice/strata.env` | secrets, mode 640 root:strata |
| `/etc/strata-softwareservice/deploy.conf` | installer answers |
| `/var/backups/strata-softwareservice` | DB dumps, mode 700 postgres |

## Operations
```bash
systemctl status strata-softwareservice
journalctl -u strata-softwareservice -f
bash /etc/strata-softwareservice/healthcheck.sh          # exit 0 = healthy
cd /root/strata-softwareservice && git pull && bash deploy/update.sh
bash deploy/backup.sh                                     # manual backup
bash deploy/restore.sh --test /var/backups/strata-softwareservice/<file>.dump   # test restore (safe)
bash deploy/restore.sh /var/backups/strata-softwareservice/<file>.dump          # real restore (asks to confirm)
bash deploy/uninstall.sh            # remove services and site, keep data
bash deploy/uninstall.sh --purge    # also drop the DB and app files (backups kept)
```

**Updates:** build → pre-migration backup → migrate → switch symlink → restart → health check. If the new release is
unhealthy, the previous release is restored automatically. Schema migrations are **not** reversed automatically; use
the `pre-<release>` backup with `restore.sh` if needed.

## After install
1. Payments: set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `strata.env`, point the webhook at
   `https://<domain>/api/stripe/webhook`, then `systemctl restart strata-softwareservice`. Until then, checkout is disabled.
2. SMTP: fill in the `STRATA_SMTP_*` values. Email sending is not implemented yet.
3. Copy backups off the server, encrypted (for example with `restic` or `gpg`). `backup.sh` does not encrypt.
4. Firewall: allow only 22, 80 and 443 (for example with `nftables` or `ufw`). PostgreSQL listens on localhost only.

## Verification status
The scripts pass `bash -n` and `shellcheck`, and the nginx config passes `nginx -t`. The installer has **not** yet been run
end-to-end on a clean Debian 13 server, so treat it as unverified until it has.
