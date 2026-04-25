# NewSecuresteps

NewSecuresteps is a Next.js (App Router) platform with multiple product areas:
- Student onboarding and authentication
- University discovery/application workflows (`select`)
- Accommodation workflows (`stay`)
- Networking/social modules (`connect`)
- Community and lender modules
- Profile management and document/journey tracking

## Tech Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Prisma
- Zustand
- NextAuth-style auth/session flows with custom API routes
- Upstash Redis (rate limiting)
- AWS S3 integrations for uploads

## Database
- Primary database: PostgreSQL
- ORM: Prisma (`prisma/schema.prisma`, `app/lib/prisma.ts`)
- Connection env: `DATABASE_URL`
- Edge/accelerated Prisma client: `app/lib/prisma-edge.ts` (Prisma Accelerate extension)

## Other Data Stores
- Redis (Upstash) for API/auth rate limiting (`app/lib/rate-limit.ts`, `app/lib/middleware/rate-limit.ts`)

## Setup
1. Install dependencies:
```bash
npm install
```
2. Configure environment variables:
- Copy values from `env-template.txt`
- Put local secrets in `.env.local` (and/or `.env` as needed)

3. Run development server:
```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev` -> start dev server
- `npm run build` -> generate Prisma client and build app
- `npm run start` -> run production server
- `npm run lint` -> run ESLint
- `npm run backup:db` -> run `backup-db.js`
- `npm run restore:db` -> run `restore-db.js`

## Project Map
Use [`AGENTS.md`](./AGENTS.md) for a full feature-to-path map, including:
- all frontend routes
- all API endpoints
- feature module folders
- shared libs, store, hooks, and infra paths
- scripts/docs/build artifacts

## Important Paths
- App root layout: `app/layout.tsx`
- Home page: `app/page.tsx`
- API routes: `app/api/**/route.ts`
- Prisma schema: `prisma/schema.prisma`
- Prisma client setup: `app/lib/prisma.ts`, `app/lib/prisma-edge.ts`
- Global app store: `store/universitystore.tsx`
- Shared app libs: `app/lib/*`

## Notes
- Keep generated outputs (`.next`, `src/generated/prisma-client`, `tsconfig.tsbuildinfo`) out of manual edits.
- DB backup/restore scripts are operational tools and should be run intentionally.
