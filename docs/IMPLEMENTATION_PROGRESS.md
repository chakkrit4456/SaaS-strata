# Implementation Progress

Status key: `[ ]` todo, `[~]` in progress, `[x]` done and verified. Record blockers at the bottom.

## 0. Environment and tooling
- [x] Own git repo in `D:\SaaS-strata` (branch `main`)
- [x] Design inputs moved to `design/`
- [x] Upstream imported and its license checked (see `docs/UPSTREAM_AUDIT.md`)
- [x] WSL Debian 13: Node 24, pnpm, PostgreSQL 17, nginx, shellcheck
- [x] `strata_dev` DB with least-privilege `strata_app` role and a local `.env`
- [~] Dependencies installed; typecheck, lint, Vitest and Playwright set up

## Build phases (from the master prompt)
1. [ ] Upstream audit complete (dependency licenses)
2. [ ] Architecture and implementation plan (ARCHITECTURE.md)
3. [ ] Database schema and migrations (Phase 9)
4. [ ] Auth, organizations, roles and permissions (Phase 4)
5. [ ] Product catalog
6. [ ] Inventory and warehouses
7. [ ] Sales and returns
8. [ ] Customer CRM
9. [ ] Suppliers and purchasing
10. [ ] Invoices and PDF
11. [ ] Employees and access
12. [ ] Multi-branch
13. [ ] Analytics and reports
14. [ ] Notifications
15. [ ] Plans, subscriptions and billing provider abstraction (Phase 6)
16. [ ] Super Admin (Phase 7)
17. [ ] UI, Thai/English i18n, themes (Phase 8)
18. [ ] Background jobs (Phase 10)
19. [ ] API docs and security hardening (Phase 11)
20. [~] Linux deploy scripts, nginx, systemd (Phase 12): written and statically validated (shellcheck, nginx -t, systemd-analyze); not yet run on a clean Debian 13 server
21. [~] Backup, health checks, observability (Phase 13): backup/restore/healthcheck scripts, backup timer, /api/health
22. [ ] Unit, integration and E2E tests, plus production build (Phase 14)
23. [ ] Documentation set (Phase 15)
24. [ ] Final evidence-based report

## Blockers / external requirements
- Domain/DNS, SMTP, Stripe and Thai payment gateway credentials: not available. Payments and email stay unverified.
