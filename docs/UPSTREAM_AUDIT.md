# Upstream Audit

| Item | Value |
|---|---|
| Repository | https://github.com/nextjs/saas-starter |
| Commit | `6e33e58b1e553a41fe22e6b941a7229a002de361` (2025-12-11, "fix: upgrade Next.js to 15.6.0-canary.59 (CVE-2025-55182)") |
| License | MIT, Copyright (c) 2025 Vercel. Commercial use allowed; keep `LICENSE` and its notice. |
| Imported | 2026-10-24, full tree copied without `.git` history |

## What upstream provides
- Next.js 15 (canary) App Router, React 19, TypeScript, Tailwind CSS 4, shadcn-style UI on Radix, Lucide icons.
- Drizzle ORM + `postgres` driver, one migration (`lib/db/migrations/0000_*`): users, teams, team_members, activity_logs, invitations.
- Email/password auth with bcrypt and a JWT session cookie (`jose`), set up in `lib/auth/session.ts` and `middleware.ts`.
- Teams with owner/member roles, activity log, invitations.
- Stripe Checkout, Customer Portal and webhook (`lib/payments/`, `app/api/stripe/`).
- Zod validation through the `validatedAction` helpers in `lib/auth/middleware.ts`.

## Gaps against the brief (summary)
No tests, lint config, i18n, organizations with branches or warehouses, platform roles, business modules,
background jobs, rate limiting, email verification or password reset, TOTP, Thai payment providers,
Super Admin area, or Linux deployment scripts. `lib/db/seed.ts` calls Stripe and fails without a key.

## Dependency license review
Still to do: run a license scan (for example `pnpm licenses list`) once dependencies are installed, and record the results here.
