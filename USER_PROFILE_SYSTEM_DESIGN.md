# User Profile Management System - HLD & LLD

## 1. HIGH-LEVEL DESIGN (HLD)

### 1.1 Architecture Overview

The user profile system consists of:
- **Frontend**: Profile Dashboard (9 sections) + Admin Dashboard
- **Backend**: API endpoints for data CRUD operations
- **Database**: Extended Prisma schema with new models for profile data
- **Storage**: S3 for documents, certificates, and media files

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROFILE DASHBOARD                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Sidebar (9 sections) + Section Components               │  │
│  │ 1. Onboarding (Package selection)                        │  │
│  │ 2. Universities (Search & filter)                        │  │
│  │ 3. Documents (Upload/manage)                             │  │
│  │ 4. Application Tracking (Status tracking)                │  │
│  │ 5. Portfolio (Build/manage)                              │  │
│  │ 6. Journey Roadmap (Timeline)                            │  │
│  │ 7. Visa & Finance (Checklists & calculators)             │  │
│  │ 8. E-Books (Downloads & bookmarks)                       │  │
│  │ 9. FIRE Mode (Career & mentorship)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    API Layer (/api/profile/*)
                            ↓
        ┌───────────────────────────────────────────┐
        │        DATABASE LAYER (PostgreSQL)        │
        ├───────────────────────────────────────────┤
        │ Core:                                     │
        │ - User (extended)                         │
        │ - UserProfile                             │
        │ - OnboardingInfo                          │
        │ - UniversitySelection                     │
        │ - UserDocument                            │
        │ - ApplicationTracking                     │
        │ - PortfolioItem                           │
        │ - JourneyMilestone                        │
        │ - VisaChecklist                           │
        │ - EBook                                   │
        │ - CounselorSession                        │
        │ - CareerProfile                           │
        └───────────────────────────────────────────┘
```

### 1.2 Data Flow

```
User Profile Creation/Update:
User Dashboard → API (/api/profile/[section]) → Validate → Database → S3 (if files)

Admin Dashboard:
1. List View: Admin Dashboard → /api/admin/user-profiles → Fetch all users with profile stats
2. Detail View: User Profile Page → /api/admin/user-profiles/[userId] → Full user profile
3. Export: Generate CSV/PDF of user data
```

---

## 2. DATABASE SCHEMA DESIGN (LLD)

### 2.1 New Prisma Models

#### Core Profile Management

```prisma
// Main user profile container
model UserProfile {
    id            String   @id @default(cuid())
    userId        String   @unique
    user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    // Profile completion tracking
    completionPercentage Int    @default(0)
    lastUpdatedSection   String?
    profileStatus        ProfileStatus @default(INCOMPLETE)
    
    // Selected package route
    selectedPackage      PackageRoute? // UK, USA, DUBAI
    selectedCountry      String?
    
    // Relations to other profile sections
    onboardingInfo       OnboardingInfo?
    universities         UniversitySelection[]
    documents            UserDocument[]
    applications         ApplicationTracking[]
    portfolio            PortfolioItem[]
    journeyMilestones    JourneyMilestone[]
    visaChecklists       VisaChecklist[]
    eBooks               UserEBook[]
    counselorSessions    CounselorSession[]
    careerProfile        CareerProfile?
    
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([userId])
    @@index([profileStatus])
}

// 1. ONBOARDING
model OnboardingInfo {
    id              String        @id @default(cuid())
    userProfileId   String        @unique
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    # Package selection
    selectedPackage PackageRoute  // UK, USA, DUBAI
    selectedCountry String
    
    # Personal info filled in onboarding
    educationLevel  EducationLevel
    targetIntake    String?       // e.g., "Fall 2024", "Spring 2025"
    ieltsScore      Float?
    
    # Profile info
    interests       String[]      // Career interests
    
    completedAt     DateTime?
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@index([userProfileId])
}

// 2. UNIVERSITIES - Already tracked via UniversityApplications
// But we'll create a new model to track "saved" vs "applied" universities
model UniversitySelection {
    id              String        @id @default(cuid())
    userProfileId   String
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    universityId    String
    university      University    @relation(fields: [universityId], references: [id])
    
    # Selection status
    status          UniversityStatus @default(SHORTLISTED) // SHORTLISTED, APPLIED, WAITLISTED, REJECTED, ACCEPTED
    
    # Dates
    appliedAt       DateTime?
    savedAt         DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@unique([userProfileId, universityId])
    @@index([userProfileId])
}

// 3. DOCUMENTS
model UserDocument {
    id              String        @id @default(cuid())
    userProfileId   String
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    # Document metadata
    name            String
    originalName    String
    fileType        String        // pdf, docx, jpg, etc.
    fileSize        Int           // in bytes
    category        DocumentCategory // ACADEMIC, PERSONAL, FINANCIAL, VISA, OTHER
    
    # S3 storage
    s3Key           String        // Path in S3
    s3Url           String
    
    # Document status
    status          DocumentStatus @default(UPLOADED) // UPLOADED, VERIFIED, REJECTED, EXPIRED
    notes           String?
    
    # Versioning
    version         Int           @default(1)
    previousVersionId String?
    
    uploadedAt      DateTime      @default(now())
    expiresAt       DateTime?     // For documents that have expiry
    updatedAt       DateTime      @updatedAt

    @@index([userProfileId])
    @@index([category])
    @@index([status])
}

// 4. APPLICATION TRACKING
model ApplicationTracking {
    id              String        @id @default(cuid())
    userProfileId   String
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    universityId    String?
    university      University?   @relation("ApplicationTrackingUniversity", fields: [universityId], references: [id])
    
    # Application status and progress
    status          ApplicationTrackingStatus @default(NOT_STARTED) // NOT_STARTED, SHORTLISTING, APPLYING, SUBMITTED, REVIEWED, INTERVIEWED, DECISION_PENDING, ACCEPTED, REJECTED, WAITLISTED
    progressPercentage Int       @default(0)
    
    # Milestones
    milestones      ApplicationMilestone[]
    
    # Timeline
    applicationDeadline DateTime?
    submittedAt         DateTime?
    decisionReceivedAt  DateTime?
    
    # Application details
    notes           String?
    
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@index([userProfileId])
    @@index([status])
}

model ApplicationMilestone {
    id                      String   @id @default(cuid())
    applicationTrackingId   String
    applicationTracking     ApplicationTracking @relation(fields: [applicationTrackingId], references: [id], onDelete: Cascade)
    
    title           String        // "Application Submitted", "Documents Reviewed", etc.
    description     String?
    completed       Boolean       @default(false)
    completedAt     DateTime?
    order           Int
    
    createdAt       DateTime      @default(now())

    @@index([applicationTrackingId])
}

// 5. PORTFOLIO
model PortfolioItem {
    id              String        @id @default(cuid())
    userProfileId   String
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    title           String
    description     String?
    category        String        // e.g., "Project", "Achievement", "Work Experience"
    
    # Media
    imageUrl        String?
    attachmentUrl   String?       // Link to project/document
    
    # Metadata
    order           Int
    isPublic        Boolean       @default(false)
    
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@index([userProfileId])
}

// 6. JOURNEY ROADMAP
model JourneyMilestone {
    id              String        @id @default(cuid())
    userProfileId   String
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    # Milestone
    title           String        // "Profile Created", "Documents Uploaded", etc.
    description     String?
    status          MilestoneStatus @default(PENDING) // PENDING, IN_PROGRESS, COMPLETED
    targetDate      DateTime?
    completedDate   DateTime?
    
    # Timeline
    order           Int
    
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@index([userProfileId])
    @@index([status])
}

// 7. VISA & FINANCE
model VisaChecklist {
    id              String        @id @default(cuid())
    userProfileId   String
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    # Country details
    country         String        // UK, USA, DUBAI, etc.
    
    # Checklist items
    items           VisaChecklistItem[]
    
    # Finance tracking
    estimatedCost   Float?
    currency        String?       // GBP, USD, etc.
    
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@unique([userProfileId, country])
    @@index([userProfileId])
}

model VisaChecklistItem {
    id                  String   @id @default(cuid())
    visaChecklistId     String
    visaChecklist       VisaChecklist @relation(fields: [visaChecklistId], references: [id], onDelete: Cascade)
    
    # Item
    title               String
    description         String?
    completed           Boolean      @default(false)
    completedAt         DateTime?
    order               Int
    
    createdAt           DateTime     @default(now())

    @@index([visaChecklistId])
}

// 8. E-BOOKS
model EBook {
    id              String        @id @default(cuid())
    title           String
    description     String?
    category        String        // e.g., "Visa Guides", "Career", "Finance"
    
    # File storage
    s3Url           String
    fileSize        Int
    
    # Metadata
    author          String?
    publishedDate   DateTime?
    isFeatured      Boolean       @default(false)
    
    # User interactions stored in UserEBook
    usersAccess     UserEBook[]
    
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@index([category])
}

model UserEBook {
    id              String   @id @default(cuid())
    userId          String
    user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    userProfileId   String
    userProfile     UserProfile @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    ebookId         String
    ebook           EBook    @relation(fields: [ebookId], references: [id], onDelete: Cascade)
    
    # User interactions
    isBookmarked    Boolean      @default(false)
    isDownloaded    Boolean      @default(false)
    downloadedAt    DateTime?
    
    accessedAt      DateTime     @default(now())
    updatedAt       DateTime     @updatedAt

    @@unique([userProfileId, ebookId])
    @@index([userProfileId])
}

// 9. FIRE MODE
model CareerProfile {
    id              String        @id @default(cuid())
    userProfileId   String        @unique
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    # Career info
    targetRole      String?
    targetSalary    Float?
    currency        String?       // GBP, USD, etc.
    yearsOfExperience Int?
    
    # Skills and interests
    skills          String[]
    industries      String[]
    
    # Mentorship
    mentorshipRequests MentorshipRequest[]
    connections     UserConnection[]
    
    # Job postings saved
    savedJobs       SavedJobPosting[]
    
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@index([userProfileId])
}

model MentorshipRequest {
    id              String        @id @default(cuid())
    careerProfileId String
    careerProfile   CareerProfile @relation(fields: [careerProfileId], references: [id], onDelete: Cascade)
    
    mentorId        String
    mentor          User          @relation("MenteeRequests", fields: [mentorId], references: [id])
    
    status          MentorshipStatus @default(PENDING)
    message         String?
    requestedAt     DateTime      @default(now())
    respondedAt     DateTime?
    
    @@index([careerProfileId])
}

model UserConnection {
    id              String        @id @default(cuid())
    careerProfileId String
    careerProfile   CareerProfile @relation(fields: [careerProfileId], references: [id], onDelete: Cascade)
    
    connectedUserId String
    connectedUser   User          @relation(fields: [connectedUserId], references: [id])
    
    connectionType  String        // "MENTOR", "PEER", "RECRUITER"
    connectedAt     DateTime      @default(now())
    
    @@unique([careerProfileId, connectedUserId])
    @@index([careerProfileId])
}

model SavedJobPosting {
    id              String        @id @default(cuid())
    careerProfileId String
    careerProfile   CareerProfile @relation(fields: [careerProfileId], references: [id], onDelete: Cascade)
    
    # Job details
    title           String
    company         String
    location        String
    link            String?
    
    savedAt         DateTime      @default(now())
    
    @@index([careerProfileId])
}

// COUNSELOR SESSIONS (Interaction tracking)
model CounselorSession {
    id              String        @id @default(cuid())
    userProfileId   String
    userProfile     UserProfile   @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
    
    counselorId     String
    counselor       User          @relation(fields: [counselorId], references: [id])
    
    # Session details
    topic           String
    notes           String?
    recommendedActions String?
    
    # Status
    status          SessionStatus @default(SCHEDULED)
    
    # Dates
    scheduledAt     DateTime
    completedAt     DateTime?
    
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@index([userProfileId])
    @@index([counselorId])
}
```

### 2.2 Enums

```prisma
enum ProfileStatus {
    INCOMPLETE
    IN_PROGRESS
    COMPLETED
    UNDER_REVIEW
}

enum PackageRoute {
    UK
    USA
    DUBAI
}

enum EducationLevel {
    HIGH_SCHOOL
    BACHELOR
    MASTER
    PHD
}

enum UniversityStatus {
    SHORTLISTED
    APPLIED
    WAITLISTED
    REJECTED
    ACCEPTED
}

enum DocumentCategory {
    ACADEMIC
    PERSONAL
    FINANCIAL
    VISA
    PORTFOLIO
    OTHER
}

enum DocumentStatus {
    UPLOADED
    VERIFIED
    REJECTED
    EXPIRED
}

enum ApplicationTrackingStatus {
    NOT_STARTED
    SHORTLISTING
    APPLYING
    SUBMITTED
    REVIEWED
    INTERVIEWED
    DECISION_PENDING
    ACCEPTED
    REJECTED
    WAITLISTED
}

enum MilestoneStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
}

enum MentorshipStatus {
    PENDING
    ACCEPTED
    REJECTED
    COMPLETED
}

enum SessionStatus {
    SCHEDULED
    COMPLETED
    CANCELLED
    RESCHEDULED
}
```

### 2.3 Relations Summary

| Model | Relations |
|-------|-----------|
| UserProfile | 1:1 User, 1:N Universities/Documents/Applications/Milestones/etc |
| OnboardingInfo | 1:1 UserProfile |
| UniversitySelection | M:N UserProfile & University |
| UserDocument | M:N UserProfile (1:N files per section) |
| ApplicationTracking | 1:N ApplicationMilestone, M:1 University |
| PortfolioItem | M:N UserProfile |
| JourneyMilestone | M:N UserProfile |
| VisaChecklist | 1:N VisaChecklistItem, 1:1 UserProfile per country |
| EBook | M:N Users via UserEBook |
| CareerProfile | 1:1 UserProfile, 1:N Mentorship/Connections |

---

## 3. API DESIGN

### 3.1 Profile API Endpoints

```
# PROFILE MANAGEMENT
GET    /api/profile                          - Get user's profile
POST   /api/profile                          - Create profile
PUT    /api/profile                          - Update profile completion

# SECTIONS
POST   /api/profile/onboarding               - Save onboarding info
PUT    /api/profile/onboarding               - Update onboarding
GET    /api/profile/onboarding               - Get onboarding data

POST   /api/profile/universities             - Add university to selection
DELETE /api/profile/universities/[id]        - Remove university
GET    /api/profile/universities             - Get all universities in profile

POST   /api/profile/documents                - Upload document
DELETE /api/profile/documents/[id]           - Delete document
GET    /api/profile/documents                - Get all documents

POST   /api/profile/applications             - Create application tracking
PUT    /api/profile/applications/[id]        - Update application status
PUT    /api/profile/applications/[id]/milestones - Update milestone

POST   /api/profile/portfolio                - Add portfolio item
DELETE /api/profile/portfolio/[id]           - Remove portfolio item
GET    /api/profile/portfolio                - Get all portfolio items

GET    /api/profile/journey-roadmap          - Get all journey milestones
PUT    /api/profile/journey-roadmap/[id]     - Update milestone

POST   /api/profile/visa-checklist           - Create visa checklist
PUT    /api/profile/visa-checklist/[id]      - Update checklist item
GET    /api/profile/visa-checklist           - Get checklists

POST   /api/profile/career                   - Create career profile
PUT    /api/profile/career                   - Update career profile
POST   /api/profile/career/mentorship        - Request mentorship

# EBOOKS
GET    /api/profile/ebooks                   - Get available ebooks
POST   /api/profile/ebooks/[id]/bookmark     - Bookmark ebook
POST   /api/profile/ebooks/[id]/download     - Mark as downloaded
```

### 3.2 Admin Dashboard API Endpoints

```
# USER PROFILES MANAGEMENT
GET    /api/admin/user-profiles              - List all user profiles (with pagination, filters, search)
GET    /api/admin/user-profiles/[userId]     - Get specific user profile details
GET    /api/admin/user-profiles/[userId]/documents - Get user's documents
GET    /api/admin/user-profiles/[userId]/applications - Get user's applications
DELETE /api/admin/user-profiles/[userId]     - Delete user profile

# ANALYTICS & REPORTING
GET    /api/admin/analytics/profile-stats    - Profile completion stats
GET    /api/admin/analytics/application-tracking - Application status distribution
GET    /api/admin/analytics/document-uploads - Document upload stats
GET    /api/admin/analytics/exports          - Export data (CSV/PDF)

# COUNSELOR MANAGEMENT
POST   /api/admin/counselor-sessions         - Create session
PUT    /api/admin/counselor-sessions/[id]    - Update session
GET    /api/admin/counselor-sessions         - List sessions
```

---

## 4. FRONTEND ARCHITECTURE

### 4.1 Profile Dashboard Structure

```
/app/profile/
├── page.tsx                          # Main profile container
├── layout.tsx                        # Profile layout
├── components/
│   ├── profile/
│   │   ├── Sidebar.tsx              # Navigation (already created)
│   │   ├── Onboarding.tsx           # Section 1 (already created)
│   │   ├── Universities.tsx         # Section 2 (already created)
│   │   ├── Documents.tsx            # Section 3 (NEW)
│   │   ├── ApplicationTracking.tsx  # Section 4 (NEW)
│   │   ├── Portfolio.tsx            # Section 5 (NEW)
│   │   ├── JourneyRoadmap.tsx       # Section 6 (NEW)
│   │   ├── VisaFinance.tsx          # Section 7 (NEW)
│   │   ├── EBooks.tsx               # Section 8 (NEW)
│   │   └── FIREMode.tsx             # Section 9 (NEW)
```

### 4.2 Admin Dashboard Structure

```
/app/admin/
├── layout.tsx
└── user-profiles/
    ├── page.tsx                     # List all user profiles
    ├── [userId]/
    │   ├── page.tsx                 # User profile details
    │   ├── components/
    │   │   ├── ProfileOverview.tsx
    │   │   ├── DocumentsViewer.tsx
    │   │   ├── ApplicationsViewer.tsx
    │   │   ├── AnalyticsPanel.tsx
    │   │   └── ActionButtons.tsx
```

---

## 5. IMPLEMENTATION STRATEGY

### Phase 1: Database Setup (Week 1)
- [ ] Add all new models to `schema.prisma`
- [ ] Create migration: `npx prisma migrate dev --name add_user_profile_system`
- [ ] Generate Prisma Client
- [ ] Test schema with sample data

### Phase 2: API Layer (Week 2-3)
- [ ] Create API routes for profile sections
- [ ] Implement S3 integration for document uploads
- [ ] Add validation and error handling
- [ ] Create admin API routes

### Phase 3: Frontend Components (Week 3-4)
- [ ] Build Documents component (upload, categorize, delete)
- [ ] Build ApplicationTracking component (status, milestones)
- [ ] Build Portfolio component
- [ ] Build JourneyRoadmap component
- [ ] Build VisaFinance component
- [ ] Build EBooks component
- [ ] Build FIREMode component

### Phase 4: Admin Dashboard (Week 4-5)
- [ ] Create `/app/admin/user-profiles` page (list view)
- [ ] Create user profile detail page
- [ ] Add filtering, search, pagination
- [ ] Create analytics dashboard
- [ ] Add export functionality

### Phase 5: Testing & Refinement (Week 5)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security review

---

## 6. DATA STORAGE STRATEGY

### 6.1 What Goes Where

| Data | Storage | Reason |
|------|---------|--------|
| Profile metadata (status, completion %) | PostgreSQL (UserProfile) | Quick queries, indexed |
| Document files | S3 | Large files, better performance |
| Document metadata | PostgreSQL (UserDocument) | Fast retrieval, linking |
| Application status & milestones | PostgreSQL | Frequent updates, queries |
| Journal entries, notes | PostgreSQL | Structured data |
| User-ebook associations | PostgreSQL | Quick lookups for bookmarks/downloads |
| Large attachments (portfolio, portfolio files) | S3 | Large files |

### 6.2 File Organization in S3

```
s3://secure-bucket/
├── user-documents/
│   └── [userId]/
│       ├── academic/
│       ├── personal/
│       ├── financial/
│       ├── visa/
│       └── portfolio/
└── ebooks/
    └── [ebookId]/
```

---

## 7. INDEXING STRATEGY

All new models should have indexes on:
- `userProfileId` - for quick profile lookups
- `userId` - for direct user queries
- `createdAt` - for sorting by date
- `status` fields - for filtering

Example:
```prisma
@@index([userProfileId])
@@index([userId])
@@index([status])
@@index([createdAt])
```

---

## 8. ADMIN DASHBOARD FEATURES

### 8.1 List View (`/admin/user-profiles`)
- Table with columns: UserID, Name, Package, Profile %, Last Updated, Status
- Filters: Package Route, Profile Status, Date Range
- Search: By name, email, university
- Pagination: 10/25/50 per page
- Export: CSV, PDF with profile data

### 8.2 Detail View (`/admin/user-profiles/[userId]`)
- User basic info (name, email, phone)
- Profile completion breakdown (%)
- All 9 sections displayed
- Documents: List with download links
- Applications: Timeline view with milestones
- Edit capabilities: Notes, status updates
- Action buttons: Message, Export, Archive

### 8.3 Analytics Dashboard
- Total profiles created
- Profile completion rate
- Average completion %
- Application status distribution
- Document upload trends
- Most popular universities selected

---

## 9. SECURITY CONSIDERATIONS

- [ ] All document uploads validated (file type, size)
- [ ] S3 bucket policies restrict to authenticated users
- [ ] CSRF protection on all mutations
- [ ] Rate limiting on API endpoints
- [ ] Audit logs for admin actions
- [ ] User can only access their own profile data
- [ ] Admin can only access if authorized

---

## 10. NEXT STEPS

1. **Create migration file** with all new models
2. **Build Profile API layer** (validation, CRUD)
3. **Build UI components** (one section at a time)
4. **Build admin dashboard**
5. **Integration testing**

This design provides a scalable, maintainable system that aligns with your existing architecture.
