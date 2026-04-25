# AGENTS.md

This file is a working map for contributors/agents. It lists features and the exact paths where they live.

## Project Summary
- Framework: Next.js App Router + TypeScript
- Styling: Tailwind CSS
- Data: Prisma
- State: Zustand (`store/universitystore.tsx`)
- Main domains: Auth, Select (universities), Stay (accommodation), Connect (social), Community, Lenders, Profile

## Tech Stack (Detailed)
- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- UI tooling: Radix UI, shadcn-style components, Framer Motion
- Backend/API: Next.js route handlers (`app/api/**/route.ts`)
- ORM/Data layer: Prisma
- State: Zustand (`store/universitystore.tsx`)
- Auth/session: custom auth APIs + session routes + Prisma models
- File storage: S3 integrations (`app/lib/s3/*`, `app/api/s3/[action]/route.ts`, `app/api/upload/route.ts`)
- Realtime/messaging: socket route + socket utilities (`app/api/socket/route.ts`, `app/utils/socket*.ts`)

## Database and Storage
- Primary database: PostgreSQL
- ORM: Prisma (`prisma/schema.prisma`)
- Primary DB client: `app/lib/prisma.ts`
- Edge DB client: `app/lib/prisma-edge.ts` (Prisma Accelerate extension)
- Required env for DB: `DATABASE_URL`
- Secondary datastore: Upstash Redis for rate limiting (`app/lib/rate-limit.ts`, `app/lib/middleware/rate-limit.ts`)

## Core Entry Points
- App root layout: `app/layout.tsx`
- Home page: `app/page.tsx`
- Global styles: `app/globals.css`
- Next config: `next.config.ts`
- Tailwind config: `tailwind.config.ts`
- TypeScript config: `tsconfig.json`
- Prisma schema: `prisma/schema.prisma`

## Frontend Routes (Pages)

### Public / Landing / Static
- `/` -> `app/page.tsx`
- `/new-landing` -> `app/new-landing/page.tsx`
- `/newpages` -> `app/newpages/page.tsx`
- `/Privacy` -> `app/Privacy/page.tsx`
- `/Refund` -> `app/Refund/page.tsx`
- `/CookiePolicy` -> `app/CookiePolicy/page.tsx`
- `/Terms&Conditions` -> `app/Terms&Conditions/page.tsx`

### Auth
- `/auth/signin` -> `app/auth/signin/page.tsx`
- `/auth/signup` -> `app/auth/signup/page.tsx`
- `/auth/forgot-password` -> `app/auth/forgot-password/page.tsx`

### Profile
- `/profile` -> `app/profile/page.tsx`
- `/profile/edit` -> `app/profile/edit/page.tsx`
- Profile composition helper: `app/profile/profile-content.tsx`

### Select (Universities)
- `/select` -> `app/select/page.tsx`
- `/select/[slug]` -> `app/select/[slug]/page.tsx`
- `/select/manage-universities` -> `app/select/manage-universities/page.tsx`
- `/select/add-university` -> `app/select/add-university/page.tsx`
- `/select/drag-&-drop` -> `app/select/drag-&-drop/page.tsx`

### Stay (Accommodation)
- `/stay` -> `app/stay/page.tsx`
- `/stay/[id]` -> `app/stay/[id]/page.tsx`
- `/stay/add-stay` -> `app/stay/add-stay/page.tsx`

### Connect
- `/connect` -> `app/connect/page.tsx`
- `/connect/[id]` -> `app/connect/[id]/page.tsx`

### Community
- `/community` -> `app/community/page.tsx`
- `/community/group/[id]` -> `app/community/group/[id]/page.tsx`
- `/community/blog-management` -> `app/community/blog-management/page.tsx`

### Lenders
- `/lenders` -> `app/lenders/page.tsx`

### Admin
- `/admin` -> `app/admin/page.tsx`
- `/admin/*` catch-all -> `app/admin/[...route]/page.tsx`
- Admin layout -> `app/admin/layout.tsx`

### Other Feature Pages
- `/CostEstimator` -> `app/CostEstimator/page.tsx`
- `/quizform` -> `app/quizform/page.tsx`
- Internal component page (not route entry): `app/components/Home/CostEstimator/page.tsx`

## API Endpoints (App Router)

### Accommodations
- `/api/accommodations` -> `app/api/accommodations/route.ts`
- `/api/accommodations/apply` -> `app/api/accommodations/apply/route.ts`
- `/api/accommodations/like` -> `app/api/accommodations/like/route.ts`

### AI / Utility
- `/api/ai-support` -> `app/api/ai-support/route.ts`
- `/api/upload` -> `app/api/upload/route.ts`
- `/api/socket` -> `app/api/socket/route.ts`
- `/api/test` -> `app/api/test/route.ts`
- `/api/test-db` -> `app/api/test-db/route.ts`

### Auth
- `/api/auth/admin` -> `app/api/auth/admin/route.ts`
- `/api/auth/fav-courses` -> `app/api/auth/fav-courses/route.ts`
- `/api/auth/forgot-password` -> `app/api/auth/forgot-password/route.ts`
- `/api/auth/google/callback` -> `app/api/auth/google/callback/route.ts`
- `/api/auth/login` -> `app/api/auth/login/route.ts`
- `/api/auth/logout` -> `app/api/auth/logout/route.ts`
- `/api/auth/quiz-register` -> `app/api/auth/quiz-register/route.ts`
- `/api/auth/refresh` -> `app/api/auth/refresh/route.ts`
- `/api/auth/register` -> `app/api/auth/register/route.ts`
- `/api/auth/reset-password` -> `app/api/auth/reset-password/route.ts`
- `/api/auth/user` -> `app/api/auth/user/route.ts`
- `/api/auth/username` -> `app/api/auth/username/route.ts`
- `/api/auth/verify-otp` -> `app/api/auth/verify-otp/route.ts`
- `/api/auth/verify-token` -> `app/api/auth/verify-token/route.ts`
- Auth config helper: `app/api/auth/config.ts`

### Community
- `/api/community/blog` -> `app/api/community/blog/route.ts`
- `/api/community/group` -> `app/api/community/group/route.ts`
- `/api/community/group/articles` -> `app/api/community/group/articles/route.ts`
- `/api/community/group/event` -> `app/api/community/group/event/route.ts`
- `/api/community/group/event/register` -> `app/api/community/group/event/register/route.ts`
- `/api/community/group/forums` -> `app/api/community/group/forums/route.ts`
- `/api/community/group/members` -> `app/api/community/group/members/route.ts`

### Connect
- `/api/connect` -> `app/api/connect/route.ts`
- `/api/connect/follow` -> `app/api/connect/follow/route.ts`
- `/api/connect/message` -> `app/api/connect/message/route.ts`

### Lenders
- `/api/lenders/article` -> `app/api/lenders/article/route.ts`
- `/api/lenders/loan` -> `app/api/lenders/loan/route.ts`
- `/api/lenders/loan/apply` -> `app/api/lenders/loan/apply/route.ts`

### Profile
- `/api/profile` -> `app/api/profile/route.ts`
- `/api/profile/applications` -> `app/api/profile/applications/route.ts`
- `/api/profile/applications/[id]` -> `app/api/profile/applications/[id]/route.ts`
- `/api/profile/applications/[id]/milestones/[milestoneId]` -> `app/api/profile/applications/[id]/milestones/[milestoneId]/route.ts`
- `/api/profile/documents` -> `app/api/profile/documents/route.ts`
- `/api/profile/documents/[id]` -> `app/api/profile/documents/[id]/route.ts`
- `/api/profile/journey-roadmap` -> `app/api/profile/journey-roadmap/route.ts`
- `/api/profile/journey-roadmap/[id]` -> `app/api/profile/journey-roadmap/[id]/route.ts`
- `/api/profile/portfolio` -> `app/api/profile/portfolio/route.ts`
- `/api/profile/portfolio/[id]` -> `app/api/profile/portfolio/[id]/route.ts`
- `/api/profile/visa-checklist` -> `app/api/profile/visa-checklist/route.ts`
- `/api/profile/visa-checklist/[id]/items/[itemId]` -> `app/api/profile/visa-checklist/[id]/items/[itemId]/route.ts`

### Session
- `/api/session/refreshSession` -> `app/api/session/refreshSession/route.ts`
- `/api/session/validateSession` -> `app/api/session/validateSession/route.ts`

### S3
- `/api/s3/[action]` -> `app/api/s3/[action]/route.ts`

### Universities
- `/api/universities` -> `app/api/universities/route.ts`
- `/api/universities/upload` -> `app/api/universities/upload/route.ts`
- `/api/universities/featured-courses` -> `app/api/universities/featured-courses/route.ts`
- `/api/universities/debug` -> `app/api/universities/debug/route.ts`
- `/api/universities/apply` -> `app/api/universities/apply/route.ts`
- `/api/universities/[id]` -> `app/api/universities/[id]/route.ts`
- `/api/universities/[id]/course` -> `app/api/universities/[id]/course/route.ts`
- `/api/universities/[id]/course/[courseid]` -> `app/api/universities/[id]/course/[courseid]/route.ts`

## Feature Modules and Paths

### Home / Landing UI
- `app/components/Home/*`
- `app/new-landing/components/*`
- Home assets index: `app/assets/Home/index.ts`

### Select Domain
- UI and flows: `app/components/Select/*`
- Modals: `app/components/Select/Models/*`
- University management: `app/components/Select/ManageUniversities/*`
- Add university: `app/components/Select/AddSelect/*`
- DnD import: `app/components/Select/Drag&Drop/*`

### Stay Domain
- Browse/listing: `app/components/Stay/Page/*`
- Add stay: `app/components/Stay/AddStay/*`
- Stay details: `app/components/Stay/SpecificStay/*`

### Connect Domain
- Connect pages/components: `app/components/Connect/*`

### Community Domain
- Community pages/components: `app/components/community/*`

### Lenders Domain
- Lender components: `app/components/Lenders/*`

### Profile Domain
- Profile components: `app/components/profile/*`

### Shared App UI
- App-level shared UI: `app/components/ui/*`
- Root-level shared UI: `components/ui/*`
- Core file upload: `components/core/file-upload/index.tsx`

## Data, Auth, and Infra Paths
- Prisma client + setup: `app/lib/prisma.ts`, `app/lib/prisma-edge.ts`, `app/lib/prisma-transaction.ts`
- Auth/session helpers: `app/lib/auth-helper.ts`, `app/lib/session.ts`, `app/lib/validation/auth.ts`
- Middleware helpers: `app/lib/middleware/*`
- S3 helpers: `app/lib/s3/*`, `app/hooks/useS3.ts`
- CSRF helpers: `app/lib/csrf.ts`, `app/hooks/useCsrf.ts`
- Email helpers: `app/lib/email/*`
- Types: `app/lib/types/*`
- Store: `store/universitystore.tsx`
- Additional hooks: `hooks/*`, `app/hooks/*`
- Utility helpers: `app/utils/*`, `lib/utils.ts`, `app/lib/utils.ts`wrr

## Assets / Fonts
- App assets: `app/assets/*`
- Public static assets: `public/*`
- Fonts: `app/fonts/*`, plus some font files in `app/assets/*`

## DB / Ops Scripts and Docs
- DB backup script: `backup-db.js`
- DB restore script: `restore-db.js`
- Backup doc: `DATABASE_BACKUP.md`
- Registration notes: `REGISTRATION_FLOW_FIX.md`
- Profile system design: `USER_PROFILE_SYSTEM_DESIGN.md`
- Env template: `env-template.txt`

## Generated / Build Artifacts
- Prisma generated client: `src/generated/prisma-client/*`
- TypeScript incremental cache: `tsconfig.tsbuildinfo`
- Next build output: `.next/`

## Day-to-Day Commands
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Start prod server: `npm run start`
- Lint: `npm run lint`
- Backup DB: `npm run backup:db`
- Restore DB: `npm run restore:db`
