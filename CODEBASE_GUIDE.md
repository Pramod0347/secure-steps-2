# Secure Steps — Codebase Guide

A practical, end-to-end walkthrough of this codebase: what it is, how it's wired, where things live, and how the pieces talk to each other. Read this top-to-bottom once and you'll be able to navigate confidently.

> Companion docs already in the repo:
> - **`AGENTS.md`** — exhaustive feature → file-path index (every route and endpoint). Use it as a lookup table.
> - **`README.md`** — quickstart + setup.
> - **`USER_PROFILE_SYSTEM_DESIGN.md`** — deep dive on the profile system.
> - **`DATABASE_BACKUP.md`** / **`REGISTRATION_FLOW_FIX.md`** — ops + a specific flow fix.
>
> This guide is the "how it all fits together" layer on top of those.

---

## 1. What the product is

**Secure Steps** is a study-abroad platform for students. It bundles several product areas into one Next.js app:

| Domain | What it does | Route prefix |
|--------|--------------|--------------|
| **Auth** | Email/password + Google OAuth, OTP verification, sessions | `/auth`, `/api/auth` |
| **Select** | Discover, compare & apply to universities/courses | `/select`, `/api/universities` |
| **Stay** | Browse/list/apply for student accommodation | `/stay`, `/api/accommodations` |
| **Connect** | Social networking — follow users, message, alumni profiles | `/connect`, `/api/connect` |
| **Community** | Groups, events, forums, blogs/articles | `/community`, `/api/community` |
| **Lenders** | Student loans & lender articles | `/lenders`, `/api/lenders` |
| **Profile** | Document vault, application tracking, journey roadmap, visa checklist, portfolio, career/FIRE mode | `/profile`, `/api/profile` |
| **Admin** | Catch-all admin console | `/admin` |
| **Extras** | Cost estimator, quiz funnel, AI support, static legal pages | `/CostEstimator`, `/quizform`, `/api/ai-support` |

---

## 2. Tech stack at a glance

- **Framework:** Next.js (App Router, `next ^16`) + React 19 + TypeScript
- **Styling:** Tailwind CSS, Radix UI primitives, shadcn-style components, Framer Motion / GSAP / Lenis for motion
- **Database:** PostgreSQL via **Prisma** (`prisma/schema.prisma`)
- **Auth/session:** Custom JWT sessions (`jose`) + Prisma `Session` table; Google OAuth via `google-auth-library`
- **State:** **Zustand** (`store/universitystore.tsx`) for university data; React Context for auth; React Query / SWR available for data fetching
- **Rate limiting:** Upstash Redis (`@upstash/ratelimit`)
- **File storage:** AWS S3 **and/or** Cloudflare R2 (S3-compatible) — `app/lib/s3/*`
- **Email:** Resend (`app/lib/email/*`)
- **Realtime:** socket.io + Pusher (`app/utils/socket*.ts`, `app/api/socket`)
- **Validation:** Zod schemas (`app/lib/types/*`, `app/lib/validation/*`)

> Note: `package.json` lists a wide net of dependencies (mongoose, sequelize, express, etc.). The **active** data layer is **Prisma + PostgreSQL**. Treat the others as legacy/unused unless you find them imported.

---

## 3. Directory map (the mental model)

```
secure-steps-2-main/
├── app/                      # Next.js App Router — THE app lives here
│   ├── layout.tsx            # Root layout: fonts, AuthProvider, Navbar/Footer, analytics
│   ├── page.tsx              # Home page (composes new-landing/components)
│   ├── globals.css
│   │
│   ├── api/                  # ALL backend endpoints (route handlers)
│   │   ├── auth/             # register, login, logout, refresh, OTP, google, reset...
│   │   ├── session/          # validateSession, refreshSession (used by proxy.ts)
│   │   ├── universities/     # CRUD + courses + apply + upload (Select backend)
│   │   ├── accommodations/   # Stay backend
│   │   ├── connect/          # follow, message
│   │   ├── community/        # group, event, forums, articles, blog
│   │   ├── lenders/          # loan, loan/apply, article
│   │   ├── profile/          # documents, applications, journey, visa, portfolio
│   │   ├── s3/[action]/      # presigned uploads etc.
│   │   ├── upload/           # generic upload
│   │   └── ai-support/       # AI assistant endpoint
│   │
│   ├── <route-folders>/      # PAGE routes (one folder per URL segment)
│   │   auth/ select/ stay/ connect/ community/ lenders/ profile/
│   │   admin/ CostEstimator/ quizform/ new-landing/ Privacy/ Terms&Conditions/ ...
│   │
│   ├── components/           # Feature UI, grouped by domain
│   │   ├── Home/ Select/ Stay/ Connect/ community/ Lenders/ profile/
│   │   ├── Auth/ PopupQuiz/
│   │   ├── Navbar.tsx
│   │   └── ui/               # app-level shared primitives
│   │
│   ├── context/              # AuthContext.tsx, AuthWrapper.tsx (client auth state)
│   ├── hooks/                # useCsrf, useS3
│   ├── lib/                  # ← the backend "core" — see §6
│   ├── utils/                # auth, otp, socket, slug, cookies, date helpers
│   ├── assets/               # images, fonts, videos, lottie (lots of static media)
│   └── fonts/                # Geist font files
│
├── components/               # ROOT-level shared UI (separate from app/components)
│   ├── ui/                   # button, dialog, input, table, etc. (shadcn)
│   └── core/file-upload/
│
├── store/universitystore.tsx # Zustand global store (university browse/filter state)
├── hooks/                    # useAuth, useUniversities, useScrollLock (root-level)
├── provider/HydrationProvider.tsx
├── lib/utils.ts              # cn() + small root helpers
│
├── prisma/schema.prisma      # THE data model (single source of truth)
├── proxy.ts                  # Edge middleware: routing guards + rate limit + roles
├── next.config.ts            # image domains, body size, env exposure
├── tailwind.config.ts  postcss.config.mjs  tsconfig.json  components.json
│
├── backup-db.js  restore-db.js  DATABASE_BACKUP.md   # DB ops
├── env-template.txt          # all required env vars (copy to .env.local)
└── AGENTS.md README.md USER_PROFILE_SYSTEM_DESIGN.md REGISTRATION_FLOW_FIX.md
```

**Two `components/` and two `lib/` folders exist** — a common source of confusion:
- `app/components/*` & `app/lib/*` → the primary, feature-specific code.
- root `components/ui/*` & `lib/utils.ts` → shared shadcn primitives + the `cn()` helper.

---

## 4. Request lifecycle (how a request flows)

```
Browser
  │
  ▼
proxy.ts  (Next.js middleware, runs on every request — matcher: '/(.*)')
  │   • Classifies path: public? authenticated-only? role-protected? protected API?
  │   • For /api/* → checkRateLimit() via Upstash Redis (429 if exceeded)
  │   • Calls /api/session/validateSession (with retries) to resolve the user
  │   • Redirects to /auth/signin if auth required & missing
  │   • 403 if role doesn't match (ADMIN/LANDLORD/STUDENT)
  │   • Injects x-user-id / x-user-role headers downstream
  │
  ├──► Page route (app/<segment>/page.tsx)  → React (mostly "use client")
  │
  └──► API route (app/api/**/route.ts)
          • getSessionUser(req) reads access_token cookie → validateSession()
          • Zod-validates input
          • Prisma queries Postgres (often wrapped in withTransaction / unstable_cache)
          • Returns NextResponse.json(...)
```

Key files for this flow:
- **`proxy.ts`** — the gatekeeper. Defines `PROTECTED_ROUTES`, `PUBLIC_PATH_PATTERNS`, `ALWAYS_PROTECTED_PATHS`, role checks, and the rate-limit hook.
- **`app/api/session/validateSession/route.ts`** — the endpoint the middleware fans out to.
- **`app/lib/auth-helper.ts`** — `getSessionUser(req)` convenience used inside API routes.

---

## 5. Authentication & sessions (the most important subsystem)

There are **two layers** of auth state that must stay in sync:

### Server side — `app/lib/session.ts`
The authority. Uses `jose` JWTs signed with `JWT_SECRET`.
- **`createAccessToken` / `createRefreshToken`** — Access token: 1 day. Refresh token: 7 days.
- **`createSession`** — persists a row in the `Session` table, enforces **max 3 concurrent sessions** (evicts oldest), handles account lockout, has DB retry/backoff.
- **`validateSession(accessToken)`** — JWT verify → DB lookup → checks `isEmailVerified`, `isLocked`, expiry → updates `lastActivity`. Falls back to JWT-only validation if the DB is unreachable.
- **`refreshSessionTokens`** — rotates both tokens.
- **`invalidateAllSessions`** — logout-everywhere.

Tokens are delivered as **HTTP-only cookies** (`access_token`, refresh token). `Session`, `Account`, `OTP`, `Token`, `VerificationToken` models in the schema back all of this.

### Client side — `app/context/AuthContext.tsx`
- Holds `user`, `isAuthenticated`, `isInitialized`, `loading`.
- On mount: reads `localStorage` user → calls `/api/auth/verify-token`, falling back to `/api/auth/refresh`.
- Exposes `login`, `logout`, `updateUserData`, `refreshAuth`.
- Wrapped by `AuthProvider` + `AuthWrapper` in `app/layout.tsx`, so it's available app-wide.

### Registration / OTP flow
- `/api/auth/register` → `/api/auth/verify-otp` (email OTP via Resend) → verified user.
- Google OAuth: `/api/auth/google/callback`.
- See **`REGISTRATION_FLOW_FIX.md`** for the specific edge-case fix and the intended sequence.
- OTP rate limiting / lockout fields live on the `User` model (`otpRetryCount`, `otpBlockedUntil`, etc.).

---

## 6. The backend "core": `app/lib/`

This folder is where the cross-cutting backend logic lives.

| Path | Responsibility |
|------|----------------|
| `prisma.ts` | Prisma client **singleton** (global-cached in dev). Has a query **extension** that auto-generates `University.slug` from name+location on create/update. 60s transaction timeout. |
| `prisma-edge.ts` | Edge/accelerated client (Prisma Accelerate extension) |
| `prisma-transaction.ts` | `withTransaction()` wrapper used across write-heavy routes |
| `session.ts` | JWT session lifecycle (see §5) |
| `auth-helper.ts` | `getSessionUser(req)` for route handlers |
| `rate-limit.ts` + `middleware/rate-limit.ts` | Upstash Redis sliding-window limiter (10 req / 10 s per IP) |
| `csrf.ts` | CSRF token helpers (paired with `app/hooks/useCsrf.ts`) |
| `s3/*` | S3 **and** Cloudflare R2 upload service, presigning, config, constants |
| `email/*` | `sendEmail.ts` + `emailTemplate.ts` (Resend) |
| `validation/auth.ts` | Zod auth schemas |
| `types/*` | Per-domain TypeScript types + Zod schemas (`universities.ts`, `accommodations.ts`, `connect.ts`, `community.ts`, `lender.ts`, `user.ts`, `s3.ts`, `next-auth.d.ts`) |
| `analytics/` | Google Ads / analytics IDs |
| `constants.ts` | `BRAND_ASSETS` and other constants |

API route handlers are intentionally thin: they validate with Zod, call into `app/lib/*` + Prisma, and return JSON. The `universities` route is a good reference (caching via `unstable_cache` + `revalidateTag`, Zod input parsing, full include clauses).

---

## 7. Data model (`prisma/schema.prisma`)

PostgreSQL with `relationMode = "prisma"`. ~50 models. Organized into clusters:

**Identity & auth**
`User` (the hub — students, landlords, admins via `UserRole`), `Account`, `Session`, `Token`, `OTP`, `VerificationToken`, `Notification`, `AuditLog`.

**Select (universities)**
`University` → `Course` → `UniversityApplications`; plus `Faq`, `FavCourse`, and career-outcome models (`CareerOutcome`, `SalaryChartData`, `EmploymentRateMeterData`, `CourseTimelineData`).

**Stay (accommodation)**
`Accommodation` → `PricingPlan`, `AccommodationApplication`, `AccommodationReview`, `AccommodationRating`, `LikedAccommodations`. Landlord = a `User` via the `LandlordAccommodations` relation.

**Connect**
`Follow` (self-referential follower/following on `User`), `Message` (sender/receiver).

**Community**
`Group` → `GroupMember`, `Event` → `EventRegistration`, `Forum` → `ForumTopic` → `ForumPost`/`ForumReply` (threaded, with `ForumPostReaction`/`ForumReplyReaction`), `Article` + `Vote`, `Blog` → `ContentBlock`.

**Lenders**
`Loan` → `LoanApplication` (with JSON `academicInfo`/`financialInfo`).

**Profile system** (the largest cluster — see `USER_PROFILE_SYSTEM_DESIGN.md`)
`UserProfile` is the container, 1:1 with `User`, fanning out to:
- `OnboardingInfo` (package route UK/USA/DUBAI, education level, IELTS)
- `UniversitySelection` (shortlist/applied tracking)
- `UserDocument` (S3-stored, versioned, categorized doc vault)
- `ApplicationTracking` → `ApplicationMilestone`
- `PortfolioItem`, `JourneyMilestone`
- `VisaChecklist` → `VisaChecklistItem`
- `EBook` / `UserEBook`
- `CareerProfile` ("FIRE mode") → `MentorshipRequest`, `UserConnection`, `SavedJobPosting`
- `CounselorSession`

Status/category enums are defined at the bottom of the schema (e.g. `ApplicationStatus`, `ProfileStatus`, `DocumentCategory`, `MilestoneStatus`, `EventStatus`, `ReactionType`).

> When changing the schema: edit `schema.prisma`, then `npx prisma generate` (the `build` script does this automatically). There are no migration files committed here, so the DB is likely managed with `prisma db push` — confirm before assuming migrations.

---

## 8. Frontend conventions

- **Most pages are `"use client"`.** Even `app/layout.tsx` and `app/page.tsx` are client components.
- **Page → composed sections:** `app/page.tsx` is just an ordered list of section components imported from `app/new-landing/components`. Feature pages follow the same "page is a thin composer" pattern, pulling from `app/components/<Domain>/*`.
- **Shared UI:** Reach for `components/ui/*` (root, shadcn) and `app/components/ui/*` first before building new primitives. `cn()` from `lib/utils.ts` merges Tailwind classes.
- **University browse state** lives in the Zustand store (`store/universitystore.tsx`) — `UniversityInterface`, `CourseInterface`, filters, pagination. It uses `persist` + `immer` + `devtools` middleware.
- **Data fetching:** mix of `fetch` to `/api/*`, plus React Query and SWR are available.
- **Uploads:** `app/hooks/useS3.ts` + `components/core/file-upload` + `/api/s3/[action]` / `/api/upload`.

---

## 9. Environment & configuration

Copy `env-template.txt` → `.env.local`. Required groups:
- **DB:** `DATABASE_URL` (Postgres)
- **Auth:** `JWT_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Email:** `RESEND_API_KEY`, `EMAIL_FROM`
- **Storage:** AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`) **or** Cloudflare R2 (`CLOUDFLARE_*`)
- **Rate limit:** `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`

`next.config.ts` whitelists remote image hosts (S3, R2 `r2.securesteps.co.in`, imagekit, unsplash, etc.), sets a 25 MB proxy body limit, and exposes `DATABASE_URL` via `env`.

---

## 10. Day-to-day commands

```bash
npm install            # install deps
npm run dev            # dev server → http://localhost:3000
npm run build          # prisma generate + next build
npm run start          # production server
npm run lint           # eslint
npm run backup:db      # node backup-db.js  (see DATABASE_BACKUP.md)
npm run restore:db     # node restore-db.js
```

---

## 11. Where to start for common tasks

| I want to… | Start here |
|------------|-----------|
| Add/modify an API endpoint | `app/api/<domain>/.../route.ts` + the matching Zod schema in `app/lib/types/*` |
| Change auth/session behavior | `app/lib/session.ts` (server) + `app/context/AuthContext.tsx` (client) |
| Change who can access a route | `proxy.ts` (`PROTECTED_ROUTES`, `PUBLIC_PATH_PATTERNS`, `ALWAYS_PROTECTED_PATHS`) |
| Change the data model | `prisma/schema.prisma` → `prisma generate` |
| Edit a page's content/layout | `app/<route>/page.tsx` → its section components in `app/components/<Domain>/*` |
| Touch university browse/filter logic | `store/universitystore.tsx` + `app/api/universities/*` |
| File uploads | `app/lib/s3/*`, `app/hooks/useS3.ts`, `/api/s3/[action]` |
| Email templates | `app/lib/email/*` |
| Find the file for any route/endpoint | **`AGENTS.md`** (full path index) |

---

## 12. Gotchas & things to verify

- **`proxy.ts` makes an HTTP fetch to its own `/api/session/validateSession`** on most requests (with up to 3 retries). This adds latency and a hard dependency on that route working — keep it fast and resilient.
- **`validateSession` has a JWT-only fallback** when the DB is down. Security-sensitive — understand it before changing.
- **Two `components/` and two `lib/` trees** (root vs `app/`). Confirm which one an import points to.
- **Dependency soup:** mongoose/sequelize/express/socket.io/pusher all appear in `package.json`. Verify a package is actually imported before assuming it's in use — the live stack is Prisma + Postgres + custom JWT.
- **No committed Prisma migrations** — schema changes are likely applied with `db push`. Check with the team before running anything destructive.
- **`prisma.ts` hardcodes `isProduction = true`**, so query logging is always `['error','warn']` and transaction timeout is always 60s, regardless of `NODE_ENV`.
- **`.env`/secrets:** `environment_variable.txt` is empty; real secrets go in `.env.local` (never committed).
```
