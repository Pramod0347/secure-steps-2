# AI Coding Agent Instructions for Secure Steps

## Project Overview
**Secure Steps** is a Next.js 14+ full-stack application connecting international students with university accommodations, community, lending services, and career outcomes. It uses PostgreSQL (Neon), Prisma ORM, and implements JWT-based authentication with role-based access control (RBAC).

**Current Branch**: `profile-section` | **Key Stack**: Next.js, TypeScript, Prisma, Tailwind CSS, AWS S3, Zustand

---

## Architecture & Key Patterns

### 1. Authentication Flow (Critical System)
- **Location**: `app/lib/session.ts` (token generation), `app/context/AuthContext.tsx` (client state)
- **Pattern**: JWT tokens (access: 1 day, refresh: 7 days) with custom refresh logic at `/api/session/refreshSession`
- **Roles**: ADMIN, LANDLORD, STUDENT (defined in `prisma/schema.prisma`)
- **Middleware**: `middleware.ts` enforces role-based route protection (e.g., `/admin` → ADMIN only)
- **Critical Detail**: OTP verification happens BEFORE user creation (temp registration system in `app/api/auth/quiz-register` → `verify-otp`)
  - Temporary data stored in `temp_registrations/` directory
  - Only persisted to DB after OTP validation

### 2. Middleware & Route Protection
- **File**: `middleware.ts`
- **Pattern**: Routes defined in `PROTECTED_ROUTES` (requires specific roles) and `PUBLIC_PATH_PATTERNS` (regex-based allowlist)
- **Rate Limiting**: Auth endpoints use Upstash Redis (`app/lib/rate-limit.ts`) - 5 attempts/15 min for login
- **CSRF Protection**: `app/lib/csrf.ts` validates HTTP-only cookie against header

### 3. Database Strategy
- **ORM**: Prisma with PostgreSQL (Neon serverless via `@neondatabase/serverless`)
- **Adapter**: `@prisma/adapter-pg` for connection pooling
- **Pattern**: Use `prisma.ts` singleton (configured with 60s timeout for production)
  - Prisma client extends queries for slug generation on university creation
  - Transaction wrapper: `prisma-transaction.ts` for complex multi-step operations
- **Key Models**: User, University, Course, Community, Accommodation, CareerOutcome (see schema for relations)

### 4. API Route Conventions
- **Structure**: `app/api/[feature]/[action]/route.ts` (e.g., `/api/auth/login`, `/api/community/group/members`)
- **Error Handling**: Try-catch wrapping with `NextResponse.json()` and explicit HTTP status codes
- **Validation**: Zod schemas in `app/lib/validation/` (e.g., `RegisterSchema`, `LoginSchema`)
- **Authorization**: Extract user from JWT in request header/cookie; verify role before database mutations

### 5. Client-Side State Management
- **Global Store**: Zustand (`store/universitystore.tsx`) for university/course filtering and display
  - Uses `immer` middleware for immutable updates
  - Persisted to localStorage via `persist` middleware
  - Enabled with Redux DevTools in dev mode
- **Auth Context**: React Context (`app/context/AuthContext.tsx`) for user session and login/logout
- **Query Client**: React Query for server data fetching (configured with default caching strategies)

### 6. Component & Styling
- **Pattern**: Modular components in `app/components/` organized by feature (e.g., `Auth/`, `Home/`, `Connect/`)
- **UI Library**: Radix UI primitives + Material Tailwind for composed components
- **Styling**: Tailwind CSS with custom config (`tailwind.config.ts`)
- **Icons**: Lucide React library

---

## Critical Developer Workflows

### Build & Development
```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Build + generate Prisma client
npm run start         # Production server
npm run lint          # Run ESLint
```

### Database Operations
```bash
npx prisma migrate dev --name <migration_name>  # Create migration
npx prisma generate                              # Regenerate Prisma client (automatic on build)
npx prisma db push                               # Sync schema to database (dev only)
```

### Testing Connections
- `test-db-connection.js` - Validates DATABASE_URL connectivity
- `test-registration-flow.js` - End-to-end registration with OTP
- `quick-test.js` - Fast validation script

### Environment Variables
See `env-template.txt` for required keys. Critical:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Private key for token signing
- `AWS_*` - S3 credentials for file uploads
- `UPSTASH_REDIS_*` - Rate limiting backend

---

## Project-Specific Conventions

### 1. User Verification Flow
- **Email Verification**: Set during registration via OTP
- **Phone Verification**: Optional, triggered separately
- **Status Tracking**: `isEmailVerified`, `isPhoneVerified`, `isVerified` flags on User model
- **Action**: When updating user verification, always call `/api/session/validateSession` to refresh auth state

### 2. File Uploads (S3 Integration)
- **Endpoint**: `/api/upload` (POST/DELETE)
- **Constraints**: Images <5MB, PDFs <10MB, specific MIME types enforced
- **Response**: Returns presigned URL from AWS S3 bucket (configured in `next.config.ts` remotePatterns)
- **Cleanup**: Use DELETE endpoint to remove files; S3 is single source of truth

### 3. Community & Group Management
- **Endpoints**: `/api/community/group/members` handles add/remove/update group members
- **Validation**: Zod schema enforces required fields (groupId, userId, email)
- **Email Notifications**: Send invites via `app/lib/email/sendEmail`

### 4. University & Course Management
- **Admin-Only**: `/api/universities` and sub-routes require ADMIN role
- **Slug Generation**: Automatic on university creation using Prisma extension (format: `name-location`)
- **Career Outcomes**: Linked via `CareerOutcome` model (salary charts, employment rates, timelines)

### 5. Temporary Registration Storage
- **Pattern**: Store unverified registration data in `temp_registrations/` directory as JSON files
- **Key**: Temporary user ID format: `temp_<hash>` to distinguish from persisted records
- **Cleanup**: Remove temp files after user creation or OTP expiration (implement cleanup job)

---

## Common Patterns & Code Examples

### API Error Response
```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }
    
    // Business logic...
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Protected API Route with Role Check
```typescript
export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await validateToken(token); // From session.ts
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Admin-only logic...
}
```

### Zustand Store Update
```typescript
const useUniversityStore = create<StoreState>()(
  devtools(
    persist(
      immer((set) => ({
        setUniversities: (universities) => set({ universities }),
        filterByCountry: (country) => set((state) => {
          state.filtered = state.universities.filter(u => u.country === country);
        }),
      }))
    )
  )
);
```

---

## When Making Changes

✅ **Always**:
- Validate user input with Zod schemas before database operations
- Check user role in middleware or at route handler start
- Use Prisma transactions for multi-step operations (see `prisma-transaction.ts`)
- Return explicit HTTP status codes (200, 400, 401, 403, 500)
- Update or create TypeScript interfaces in `app/lib/types/`

❌ **Avoid**:
- Directly accessing `req.body` without validation
- Creating users without OTP verification (use temp registration pattern)
- Mixing client-side and server-side authentication logic
- Hardcoding timeouts; use `SESSION_CONFIG` constants

---

## Key Files Reference
| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection, role checks, rate limiting hooks |
| `app/lib/session.ts` | JWT token generation, validation, refresh logic |
| `app/context/AuthContext.tsx` | Client auth state and hooks (`useAuth()`) |
| `prisma/schema.prisma` | Full database schema (1122 lines) |
| `store/universitystore.tsx` | Zustand store for university filters and caching |
| `app/lib/csrf.ts` | CSRF token generation and verification |
| `app/lib/validation/auth.ts` | Zod schemas for auth endpoints |

---

## Questions for Clarification
Before implementing features, clarify:
1. **Is this endpoint protected?** Check `PROTECTED_ROUTES` and required role
2. **Does this require OTP?** Follow temp registration pattern
3. **Does this modify data?** Wrap in Prisma transaction
4. **Is this user-facing or admin-only?** Confirm role requirement
