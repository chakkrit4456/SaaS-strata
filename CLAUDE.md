# Strata-softwareservice

Multi-tenant business management SaaS built on the upstream `nextjs/saas-starter`.
The full brief is `design/Strata-softwareservice_Claude_Code_Master_Prompt.docx`; the UI reference is
`design/Strata Prototype.dc.html`. Track progress in `docs/IMPLEMENTATION_PROGRESS.md` and keep it current.

## Environment
- Develop and run everything inside WSL **Debian 13** (`wsl -d Debian`), project at `/mnt/d/SaaS-strata`.
- Node 24 LTS, pnpm (via corepack), PostgreSQL 17 on localhost:5432 only.
- Dev DB `strata_dev`, app role `strata_app` (no superuser, no createdb). Credentials live only in `.env` (gitignored, chmod 600).
- Common commands (run in WSL): `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`,
  `pnpm test:e2e`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:seed`, `shellcheck deploy/*.sh`.

## Rules
- Brand: **Strata-softwareservice** everywhere; package/service name `strata-softwareservice`; env keys `STRATA_*`. No NEXORA branding.
- Default locale Thai (English optional), currency THB, display timezone Asia/Bangkok, store timestamps in UTC.
- Every tenant-owned row carries `organization_id`, and every query and action checks it on the server. Add a negative cross-tenant test for each new module.
- Money uses exact decimals (numeric in Postgres, never JS float math).
- Plan limits are enforced on the server, never only by hiding UI.
- No Docker, Kubernetes, Supabase, Firebase, paid APIs or commercial UI licenses. Deploy target is native Debian/Ubuntu with Nginx and systemd.
- Never fake test results, payment confirmations, SMTP delivery or deployment status. Record blockers in the progress doc.
- Design tokens follow the prototype: fonts Anuphan and JetBrains Mono, cream/navy neutrals, mint accent `#6EE7B7`, light and dark themes.
