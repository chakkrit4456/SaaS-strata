# Strata-softwareservice: รายละเอียดโปรเจกต์

> สรุปสถานะ ณ วันที่ 24 ตุลาคม 2026
> Repository: https://github.com/chakkrit4456/SaaS-strata (branch `main`)

## 1. ภาพรวม

Strata-softwareservice คือระบบบริหารธุรกิจแบบ SaaS ที่รองรับหลายองค์กร (multi-tenant) สำหรับร้านค้า ร้านอาหาร ผู้ขายออนไลน์ ผู้ให้บริการ และองค์กรขนาดเล็กทั้งในไทยและต่างประเทศ

- ภาษาเริ่มต้นเป็นไทย มีภาษาอังกฤษเป็นตัวเลือก
- สกุลเงิน THB เวลาแสดงผล Asia/Bangkok และเก็บเวลาในฐานข้อมูลเป็น UTC
- ติดตั้งบน Linux (Debian/Ubuntu) โดยตรง ไม่ใช้ Docker
- โจทย์ทั้งหมดอยู่ใน `design/Strata-softwareservice_Claude_Code_Master_Prompt.docx` (แบ่งเป็น 15 phase)
- ต้นแบบหน้าจอ (UI prototype) อยู่ที่ `design/Strata Prototype.dc.html`

## 2. ที่มาของโค้ด (Upstream)

| รายการ | ค่า |
|---|---|
| ต้นทาง | https://github.com/nextjs/saas-starter |
| Commit | `6e33e58b1e553a41fe22e6b941a7229a002de361` (2025-12-11) |
| License | MIT (Copyright 2025 Vercel) ใช้เชิงพาณิชย์ได้ แต่ต้องเก็บไฟล์ `LICENSE` ไว้ |
| สิ่งที่ได้มา | Next.js 15, React 19, Tailwind 4, Drizzle ORM + PostgreSQL, ระบบ login (bcrypt + JWT cookie), ทีมและสิทธิ์ owner/member, activity log, Stripe checkout/webhook |

รายละเอียดเพิ่มเติมอยู่ใน `docs/UPSTREAM_AUDIT.md`

## 3. เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI, Lucide icons |
| Backend | Next.js Route Handlers / Server Actions, Zod |
| Database | PostgreSQL 17, Drizzle ORM + drizzle-kit (migrations) |
| Auth | bcryptjs, jose (JWT ใน cookie แบบ httpOnly + Secure) |
| Payments | Stripe (ยังไม่ได้ตั้งค่า) จะต่อยอดเป็นระบบที่รองรับ payment gateway ไทย |
| ทดสอบ | Vitest (unit/integration), Playwright (E2E), ESLint, Prettier, shellcheck |
| Deploy | Debian 13, Node.js 22 LTS, Nginx, systemd, Cloudflare Tunnel หรือ Let's Encrypt |
| Package manager | pnpm 12 (ผ่าน corepack) |

ดีไซน์ตามต้นแบบ: ฟอนต์ Anuphan และ JetBrains Mono, โทนสีครีม/กรมท่า, สีเน้นมิ้นต์ `#6EE7B7`, รองรับธีมสว่างและมืด

## 4. โครงสร้างโฟลเดอร์

```
SaaS-strata/
├── app/                      # หน้าเว็บและ API (Next.js App Router)
│   ├── (dashboard)/          # หน้าแดชบอร์ด, pricing
│   ├── (login)/              # sign-in / sign-up
│   └── api/                  # stripe, team, user, health
├── components/ui/            # UI components
├── lib/
│   ├── auth/                 # session, middleware
│   ├── db/                   # schema, migrations, seed, queries
│   └── payments/             # Stripe (สร้าง client เมื่อใช้งานครั้งแรก)
├── deploy/                   # สคริปต์ติดตั้งบน Linux
│   ├── install.sh  update.sh  backup.sh  restore.sh
│   ├── healthcheck.sh  uninstall.sh  lib.sh
│   ├── nginx/strata-softwareservice.conf
│   └── systemd/              # service + backup service + timer
├── tests/unit/  tests/e2e/   # Vitest และ Playwright
├── design/                   # ต้นแบบ UI, โลโก้, เอกสารโจทย์
├── docs/                     # UPSTREAM_AUDIT, IMPLEMENTATION_PROGRESS, เอกสารนี้
├── CLAUDE.md                 # กฎหลักของโปรเจกต์
└── DEPLOYMENT.md             # คู่มือติดตั้งบนเซิร์ฟเวอร์
```

## 5. สภาพแวดล้อมสำหรับพัฒนา (เครื่อง Windows + WSL)

- พัฒนาและรันทุกอย่างใน **WSL Debian 13** (`wsl -d Debian`) โดยโค้ดอยู่ที่ `D:\SaaS-strata` (ใน WSL คือ `/mnt/d/SaaS-strata`)
- มี Node 24, pnpm 12, PostgreSQL 17 (เปิดรับเฉพาะ localhost), nginx และ shellcheck
- ฐานข้อมูลสำหรับพัฒนาคือ `strata_dev` ใช้ role `strata_app` (ไม่มีสิทธิ์ superuser) รหัสผ่านเก็บใน `.env` ซึ่งไม่ได้ commit

คำสั่งหลัก (รันใน WSL):

```bash
pnpm dev            # รันเซิร์ฟเวอร์สำหรับพัฒนา
pnpm build          # build สำหรับ production
pnpm typecheck      # ตรวจ TypeScript
pnpm lint           # ESLint
pnpm test           # Vitest
pnpm test:e2e       # Playwright
pnpm db:migrate     # รัน migrations
pnpm db:seed        # ข้อมูลตัวอย่าง (เฉพาะตอนพัฒนา)
pnpm lint:sh        # shellcheck สคริปต์ deploy
```

**ข้อควรระวัง**
- ฐานข้อมูล `strata_dev` ในเครื่องพัฒนามีโปรเจกต์ Prisma อื่นใช้อยู่ด้วย ควรแยกให้ Strata มีฐานข้อมูลของตัวเอง
- การ `pnpm install` บน `/mnt/d` ช้ามาก (ประมาณ 13–15 นาที)

## 6. การติดตั้งบนเซิร์ฟเวอร์ (Production)

### 6.1 เครื่องเป้าหมาย
- Proxmox LXC ใช้ template `debian-13-standard_13.6-1_amd64.tar.zst` แบบ unprivileged และเปิด nesting
- สเปกแนะนำ: 2 vCPU, RAM 2–4 GB + swap 1 GB, ดิสก์อย่างน้อย 16 GB
- เซิร์ฟเวอร์ปัจจุบัน: IP `192.168.100.119` และโดเมน `itdev.in.th` (ผ่าน Cloudflare Tunnel)

### 6.2 ขั้นตอน
```bash
apt-get update && apt-get install -y git
git clone https://github.com/chakkrit4456/SaaS-strata.git /SaaS-strata
cd /SaaS-strata
bash deploy/install.sh
```

| คำถาม | คำตอบ |
|---|---|
| Public domain | `itdev.in.th` |
| Other names/IPs | Enter (`192.168.100.119`) |
| Behind Cloudflare Tunnel | `yes` |
| Database name / role | Enter (`strata` / `strata_app`) ใช้ได้เฉพาะ a-z, 0-9, `_` (ห้ามใช้ `-`) |
| Admin email | อีเมลผู้ดูแล |
| ข้ออื่น | Enter |

### 6.3 สิ่งที่ installer ทำ
1. ตรวจว่าเป็น Debian/Ubuntu และมี systemd ทำงานอยู่
2. ติดตั้ง nginx, PostgreSQL, Node.js 22 (จาก NodeSource) และเปิด corepack
3. สร้าง user `strata` ซึ่งไม่มีสิทธิ์ root ไว้รันแอป
4. สร้างฐานข้อมูลและ role ที่มีสิทธิ์เท่าที่จำเป็น เปิดรับเฉพาะ localhost
5. สร้างไฟล์ secrets `/etc/strata-softwareservice/strata.env` (สร้างครั้งเดียว ไม่เขียนทับ)
6. build release, รัน migrations, ติดตั้ง systemd units, ตั้งค่า nginx และตรวจ health

รันซ้ำได้อย่างปลอดภัย: รหัสผ่าน ฐานข้อมูล และ nginx site อื่นจะไม่ถูกแก้

### 6.4 ตำแหน่งไฟล์บนเซิร์ฟเวอร์
| Path | เนื้อหา |
|---|---|
| `/opt/strata-softwareservice/releases/<เวลา>` | release ที่ build แล้ว (เก็บ 5 ชุดล่าสุด) |
| `/opt/strata-softwareservice/current` | symlink ไปยัง release ที่ใช้งานอยู่ |
| `/opt/strata-softwareservice/shared/uploads` | ไฟล์ที่ผู้ใช้อัปโหลด |
| `/etc/strata-softwareservice/strata.env` | secrets (สิทธิ์ 640) |
| `/etc/strata-softwareservice/deploy.conf` | คำตอบตอนติดตั้ง |
| `/var/backups/strata-softwareservice` | ไฟล์สำรองฐานข้อมูล (สิทธิ์ 700) |

### 6.5 Cloudflare Tunnel
หน้า Add published application:
- Subdomain: เว้นว่าง, Domain: `itdev.in.th`, Path: เว้นว่าง
- Service URL: `http://localhost:80` (ถ้า cloudflared อยู่เครื่องเดียวกัน) หรือ `http://192.168.100.119:80`
- ต้องเข้าผ่าน `https://itdev.in.th` เท่านั้นถึงจะ login ได้ เพราะ cookie ตั้งเป็น Secure

### 6.6 คำสั่งดูแลระบบ
```bash
systemctl status strata-softwareservice
journalctl -u strata-softwareservice -f
bash /etc/strata-softwareservice/healthcheck.sh
cd /SaaS-strata && git pull && bash deploy/update.sh      # อัปเดต
bash deploy/backup.sh                                      # สำรองด้วยตนเอง
bash deploy/restore.sh --test <ไฟล์.dump>                  # ทดสอบ restore (ไม่แตะข้อมูลจริง)
bash deploy/restore.sh <ไฟล์.dump>                         # restore จริง (ต้องยืนยัน)
bash deploy/uninstall.sh [--purge]
```

- **update.sh** จะ build แล้วสำรองฐานข้อมูลก่อนรัน migrations จากนั้นสลับ release และตรวจ health ถ้าตรวจไม่ผ่านจะสลับกลับไป release เดิมให้อัตโนมัติ แต่ migrations จะไม่ถูกย้อนกลับ ต้องใช้ไฟล์สำรอง `pre-<release>` แทน
- **การสำรองอัตโนมัติ** ใช้ systemd timer ทุกวันเวลา 02:30 เก็บไว้ 14 วัน มีการตรวจ checksum และอ่าน dump ทดสอบ สคริปต์ไม่เข้ารหัสไฟล์สำรอง ควรคัดลอกออกนอกเครื่องแบบเข้ารหัส
- **healthcheck** ตรวจ services, PostgreSQL, `/api/health`, อายุไฟล์สำรอง, พื้นที่ดิสก์ และวันหมดอายุของใบรับรอง

### 6.7 ความปลอดภัยที่ตั้งไว้แล้ว
- แอปรันด้วย user ที่ไม่ใช่ root และ systemd จำกัดสิทธิ์ไว้ (`ProtectSystem=strict`, `NoNewPrivileges` เป็นต้น)
- แอปรับการเชื่อมต่อเฉพาะ `127.0.0.1` ภายนอกเข้าได้ผ่าน nginx เท่านั้น
- PostgreSQL เปิดรับเฉพาะ localhost และแอปใช้ role ที่มีสิทธิ์น้อยที่สุด
- nginx ใส่ security headers ซ่อนเวอร์ชัน และ `/api/health` เข้าได้จากในเครื่องเท่านั้น
- ไฟล์ secrets สิทธิ์ 640 และไม่ถูก commit ลง git

## 7. ผลการตรวจสอบ (เท่าที่รันจริง)

| รายการ | ผล |
|---|---|
| `pnpm typecheck` | ผ่าน |
| `pnpm test` (Vitest) | ผ่าน 1/1 (smoke test) |
| `pnpm build` | ผ่าน |
| `pnpm db:migrate` (dev) | ผ่าน |
| `bash -n` + shellcheck สคริปต์ deploy | ผ่าน |
| `nginx -t` (template) | ผ่าน |
| `systemd-analyze verify` | ผ่าน |
| `pnpm lint` | **ไม่ผ่าน**: error 11 จุดในโค้ด upstream (ไม่กระทบการ build) |
| `pnpm test:e2e` | ยังไม่ได้รัน |
| ติดตั้งจริงบน Debian 13 | **ยังไม่ได้ยืนยันผล** (กำลังติดตั้งที่ 192.168.100.119) |

## 8. ประวัติ Commit

| Commit | รายละเอียด |
|---|---|
| `bb460b7` | นำเข้า saas-starter และตั้งค่าเครื่องมือพัฒนา |
| `c882eef` | installer สำหรับ Debian 13, nginx, systemd, backup, `/api/health`, Stripe แบบ lazy |
| `5dcf55b` | รองรับ Cloudflare Tunnel และตรวจคำตอบใน installer |

## 9. สิ่งที่ยังต้องทำ (ตามโจทย์ 15 phase)

ติดตามความคืบหน้าละเอียดได้ที่ `docs/IMPLEMENTATION_PROGRESS.md`

- [x] Phase 0: สภาพแวดล้อม เครื่องมือ และนำเข้า upstream
- [~] Phase 12–13: สคริปต์ deploy, backup และ health check (เขียนแล้ว รอยืนยันบนเซิร์ฟเวอร์)
- [ ] สถาปัตยกรรมและ schema ฐานข้อมูลใหม่ (องค์กร สาขา คลังสินค้า สิทธิ์)
- [ ] Auth เต็มรูปแบบ: ยืนยันอีเมล, reset password, rate limit, TOTP
- [ ] ระบบหลายองค์กร (multi-tenant) และสิทธิ์ OWNER/ADMIN/MANAGER/EMPLOYEE/VIEWER
- [ ] โมดูลธุรกิจ: สินค้า, สต็อก, การขาย/คืนสินค้า, ลูกค้า, ซัพพลายเออร์, ใบแจ้งหนี้ PDF, พนักงาน, สาขา, รายงาน, การแจ้งเตือน
- [ ] แพ็กเกจ FREE/STARTER/PRO/BUSINESS พร้อมบังคับ limit ที่ฝั่งเซิร์ฟเวอร์ และ payment provider abstraction
- [ ] Super Admin
- [ ] UI ไทย/อังกฤษ ตามต้นแบบ และธีมสว่าง/มืด
- [ ] Background jobs
- [ ] ชุดทดสอบ unit/integration/E2E และ security tests
- [ ] เอกสารชุดเต็ม (ARCHITECTURE, DATABASE, SECURITY, API, ...)

## 10. สิ่งที่ต้องเตรียมจากภายนอก

| รายการ | สถานะ |
|---|---|
| โดเมน / DNS | `itdev.in.th` ผ่าน Cloudflare Tunnel |
| Stripe / payment gateway ไทย | ยังไม่มี key ระบบชำระเงินยังไม่ได้ยืนยัน |
| SMTP | ยังไม่ได้ตั้งค่า และยังไม่มีโค้ดส่งอีเมล |
| สำรองข้อมูลนอกเครื่อง | ยังไม่ได้ตั้งค่า (แนะนำ restic หรือ gpg) |
| Firewall | ควรเปิดเฉพาะพอร์ต 22 (และ 80/443 ถ้าไม่ใช้ tunnel) |

**สถานะความพร้อม:** อยู่ระดับ development-ready (มีโครงและเครื่องมือครบ) ยังไม่ใช่ staging-ready หรือ production-ready เพราะโมดูลธุรกิจยังไม่ได้สร้าง และยังไม่ได้ยืนยันการติดตั้งบนเซิร์ฟเวอร์จริง
