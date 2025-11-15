# TourBrain Product Requirements Document

**Version:** 1.0.0  
**Last Updated:** November 15, 2025  
**Status:** ✅ **CORE PLATFORM COMPLETE** – Full tour operations, AI routing, collaboration & sharing, weather intelligence, and professional exports. Ready for production deployment and beta launch.

---

## Executive Summary

TourBrain is an AI-powered tour operations platform designed to replace Prism and Master Tour with a single, unified system. We're building for independent venues (500-3,000 cap), regional promoters, boutique agencies, and tour managers who currently juggle multiple tools, spreadsheets, and manual processes.

**Current Status:** ✅ **Complete core platform** with full tour operations workflow, AI routing & tour design, collaboration & sharing, weather intelligence, and professional exports. All 5 core milestones delivered and ready for production deployment.

### 🎉 Major Milestone: Core Platform Complete

TourBrain has achieved a major milestone - the core tour operations platform is **complete and production-ready**. Users can now:

- ✅ **Manage complete tour workflows** from artist roster through show execution
- ✅ **Design tours with AI assistance** using smart venue matching and route optimization
- ✅ **Collaborate externally** with secure sharing, role-based permissions, and activity logging
- ✅ **Export professionally** with PDF day sheets, CSV tour data, and iCal integration
- ✅ **Get AI-powered insights** for tour risk analysis and production planning
- ✅ **Make weather-informed decisions** with comprehensive outdoor venue climate intelligence
- ✅ **Operate with enterprise security** through multi-tenant organization system

This represents a **complete tour management platform** that replaces spreadsheets, Prism, and Master Tour with modern AI-powered tools, external collaboration, and professional export capabilities. Ready for production deployment and customer onboarding.

---

## What We've Shipped (v1.0.0 - Complete Platform Release)

### 1. ✅ Authentication & Multi-Tenancy System

**Status:** Complete and Production-Ready

**Features:**

- **Clerk Authentication Integration** (v5)
  - Sign-up/Sign-in with email/password
  - Email verification and password reset
  - User session management
  - Secure middleware protection
- **Multi-Tenant Organization System**
  - User → Organization relationships
  - Role-based access (Owner, Admin, Member)
  - Organization onboarding flow
  - Data isolation between organizations
- **Route Protection**
  - Public routes: homepage, auth pages, shared show views
  - Protected routes: dashboard, venues, tours, show management, collaboration
  - API endpoint authentication
  - Proper redirect handling

**Technical Implementation:**

- Clerk v5 with Next.js App Router
- Async auth patterns with server-side protection
- JWT-based session management
- Organization-scoped database queries

### 2. ✅ Venue Management System

**Status:** Complete with Full CRUD

**Features:**

- **Venue Creation & Management**
  - Professional venue form (name, address, capacity, contacts)
  - Technical specifications (load-in, soundcheck, curfew)
  - Contact information management
  - Website and social links
- **Venue Directory**
  - Grid view with capacity badges
  - Search and filtering capabilities
  - City/country organization
  - Quick action buttons (view, edit)
- **Data Validation & Security**
  - Zod schema validation
  - Multi-tenant data access
  - Error handling and user feedback

**API Endpoints:**

- `POST /api/venues` - Create venue
- `GET /api/venues` - List organization venues
- `POST /api/shows/[id]/ai-day-sheet` - Generate AI day sheet notes
- `POST /api/tours/[id]/ai-risk-summary` - Generate AI tour risk analysis
- Organization-scoped queries for data isolation

### 3. ✅ Core Tour Operations Platform

**Status:** Complete and Production-Ready

**Dashboard (`/app`):**

- Organization overview with key metrics
- Recent tours and upcoming shows widgets
- Quick access to venues, artists, tours
- Real-time statistics (tour count, show count, venue count)

**Artist Management (`/app/artists`):**

- Artist roster with contact information
- Social media link management (Spotify, Instagram, Twitter)
- Genre and description tracking
- Direct tour creation from artist profiles

**Tour Management (`/app/tours`):**

- Tour list with artist and status information
- Detailed tour pages with show scheduling
- Deal tracking (guarantee, split percentage, deal type)
- Upcoming vs. completed show separation

**Show Management (`/app/shows/[id]`):**

- Individual show detail pages
- Comprehensive show information (venue, timing, deals)
- Status pipeline tracking (Scheduled → On Sale → Completed)

### 4. ✅ Professional Day Sheet System

**Status:** Complete with Print Optimization

**Features:**

- Clean, printable day sheet layout
- Venue information and contact details
- Show timing (doors, showtime, curfew)
- Deal information (guarantee, split, ticket price)
- Production sections for handwritten notes
- Browser print optimization with CSS
- Professional format suitable for tour operations

### 5. ✅ AI-Powered Insights

**Status:** Complete with OpenAI Integration

**Day Sheet AI Helper:**

- `POST /api/shows/[id]/ai-day-sheet` endpoint
- AI-generated production notes for specific venues
- Contextual recommendations based on venue type and capacity
- Load-in logistics and sound check guidance
- Interactive generation with clipboard copy functionality

**Tour Risk Analysis:**

- `POST /api/tours/[id]/ai-risk-summary` endpoint
- AI assessment of tour-wide risk factors
- Market concentration analysis
- Timeline and logistics risk evaluation
- Financial risk assessment and mitigation recommendations
- Collapsible UI with refresh and copy features

### 6. ✅ Weather & Seasonality Intelligence

**Status:** Complete and Production-Ready

**Weather Scoring System:**

- Advanced 1-100 weather scoring algorithm
- Temperature comfort analysis (ideal range: 18-26°C)
- Precipitation risk assessment with specific thresholds
- Extreme weather penalties (very hot >30°C, very cold <5°C)
- Actionable recommendations for outdoor venue planning

**Climate Data Infrastructure:**

- OpenMeteo Weather Provider with 10-year historical data aggregation
- Dummy Weather Provider for development and testing
- Monthly climate profile caching system (12 months per venue)
- Automatic stale data detection and refresh (90-day cycles)
- Geographic and seasonal intelligence with hemisphere awareness

**API Endpoints:**

- `GET /api/shows/[id]/weather` - Retrieve cached weather data
- `POST /api/shows/[id]/weather` - Manual weather score updates
- `POST /api/shows/[id]/recompute-weather` - Force recalculation with fresh data
- `POST /api/shows/[id]/weather-explanation` - AI-powered weather analysis

**Background Job System:**

- Automatic climate profile population on venue creation
- Weather score computation on show creation
- Scheduled climate data refresh and cleanup
- Integration hooks for venue/show lifecycle events

**WeatherPanel UI Component:**

- Color-coded scoring badges (green/yellow/orange/red)
- Monthly climate statistics display
- Interactive recompute functionality with loading states
- AI explanation generation with OpenAI integration
- Mobile-responsive design with venue-specific insights

### 7. ✅ Enhanced Database Schema

**Status:** Production-Ready with Multi-Tenancy

**Core Models:**

1. **User** (New)

   - Clerk integration (clerkId, email, profile)
   - Organization relationships
   - Authentication state management

2. **Organization** (New)

   - Multi-tenant foundation
   - Organization types (Venue, Promoter, Agency, Artist Management)
   - Owner and member relationships

3. **OrganizationMember** (New)

   - Role-based access control
   - Invitation and membership management

4. **Venue** (Enhanced)

   - Organization-scoped venues
   - Professional contact fields
   - Technical specifications
   - Extended location data

5. **Artist** (New)

   - Artist management with social links
   - Contact information and genre
   - Organization relationships

6. **Tour** (Enhanced)

   - Multi-tenant tour management
   - Deal tracking (guarantee, splits, currency)
   - Artist and organization relationships

7. **Show** (Enhanced)

   - Extended show status pipeline (Inquiry → Offer → Confirmed → On Sale → Settled)
   - Deal fields (guarantee, splits, ticket pricing)
   - Logistics fields (load-in, soundcheck, curfew)
   - Settlement tracking (gross sales, expenses, net revenue)
   - Public vs internal notes
   - Weather intelligence fields (weatherScore, weatherRiskSummary, weatherDetailJson)

8. **VenueClimateProfile** (New)

   - Monthly climate data caching (12 months per venue)
   - Historical weather statistics (avgHighTempC, avgLowTempC, avgPrecipDays)
   - Extreme weather percentages (hotDaysPct, coldDaysPct)
   - Data source tracking and last update timestamps
   - Venue relationship with cascade delete

9. **Organization Management** (Production Ready)
   - Multi-tenant architecture with data isolation
   - User roles and permissions (OWNER, ADMIN, MEMBER)
   - Organization onboarding and configuration
   - Enterprise security and access controls
   - Professional user management workflows

### 8. ✅ Multi-Tenant Architecture

**Status:** Complete with Enterprise Features

**Features:**

- **Organization Management**
  - Complete user-organization relationships
  - Role-based access control system
  - Data isolation and security boundaries
  - Organization configuration and settings
- **User Administration**
  - Professional user management interface
  - Role assignment and permission controls
  - Secure authentication and session management
- **User Interface**
  - Sortable data tables
  - Detail panels for editing
  - Status badges and priority indicators
  - Search functionality

### 9. ✅ CI/CD & Development Infrastructure

**Status:** Complete and Ready for Deployment

**Features:**

- **GitHub Actions Workflow**
  - Automated linting and type checking
  - Build verification on PRs
  - Environment variable validation
- **Vercel Deployment Configuration**
  - Framework detection and build optimization
  - Environment variable management
  - Preview deployments for PRs
- **Environment Management**

  - Development, staging, production configs
  - Secure secret management
  - Database connection handling

---

## Next Development Phases

### ✅ Completed Milestones

- **M1: Core Data Model & Auth** (Shipped in v0.3.0)
- **M2: Tour & Show Operations** (Shipped in v0.3.0)
- **M2.1: Weather Intelligence** (Shipped in v0.3.1)

### 🚧 Milestone 3: Ticketing Intelligence v1

**Goal:** Give users clear pacing and risk assessment on each show

**Status:** ✅ **Complete** (implemented in Epic 5)

**Core Features Delivered:**

1. **TicketSnapshot Model & API**

   - Complete database schema with time-series tracking
   - CSV upload endpoint with validation and error handling
   - Manual entry API for quick data input
   - Automatic sell-through percentage calculation

2. **Pacing Visualization**

   - Interactive line charts using Recharts
   - Days-until-show countdown and capacity tracking
   - Risk-based color coding and trend analysis
   - Mobile-responsive chart components

3. **Risk Scoring & Assessment**

   - Intelligent risk classification (HEALTHY / NEEDS_ATTENTION / AT_RISK)
   - Contextual recommendations for pricing and marketing actions
   - Real-time risk indicators with detailed reasoning
   - Configurable thresholds and scoring algorithms

4. **Tour Pacing Dashboard**
   - Complete tour-level analytics overview
   - Sortable, filterable show tables with risk distribution
   - Urgent show alerts and recommended actions
   - Export capabilities and data quality indicators

**Success Metrics Achieved:**

- ✅ Users can upload ticket data via CSV or manual entry
- ✅ Pacing charts display with professional visualizations
- ✅ Risk labels automatically identify underperforming shows
- ✅ Tour dashboard provides actionable insights for entire tours

---

### 🎯 Milestone 4: AI Routing & Tour Design v1

**Goal:** Make TourBrain feel uniquely "AI-native" compared to legacy tools

**Status:** ✅ **Complete** (implemented in current session)

**Core Features:**

1. **RoutingScenario & RoutingScenarioStop Models**

   ```prisma
   model RoutingScenario {
     id          String   @id @default(cuid())
     tourId      String
     name        String   // "East Coast Run - Jan 2025"
     status      String   // DRAFT, APPLIED
     constraints Json     // Region, dates, drive time limits, off-days
     createdAt   DateTime @default(now())

     tour        Tour     @relation(...)
     stops       RoutingScenarioStop[]
   }

   model RoutingScenarioStop {
     id         String  @id @default(cuid())
     scenarioId String
     venueId    String
     date       DateTime
     sequence   Int
     driveTime  Int?    // minutes from previous stop
     notes      String?

     scenario   RoutingScenario @relation(...)
     venue      Venue           @relation(...)
   }
   ```

2. **Routing Request UI**

   - On Tour detail: "Generate routing scenario" button
   - Constraint panel:
     - Date range selection
     - Regions/states (multi-select)
     - Max drive hours between shows
     - Max consecutive show days
     - Required anchor dates/venues
     - Venue capacity range

3. **Routing Engine v1 (Rule-based)**

   - Group candidate venues by region and geography
   - Sort by date and proximity (approximate drive times)
   - Apply constraints (drive time, off-days, anchors)
   - Generate scenario with weather scores included

4. **Scenario Comparison UI**

   - Scenario list with stops table
   - Columns: Date, City, Venue, Drive Hours, WeatherScore
   - Visual indicators for risk and logistics conflicts
   - Side-by-side scenario comparison

5. **Apply Scenario → Bulk Create Shows**
   - "Apply scenario" button creates/updates shows
   - Preserves existing show data where possible
   - Batch operations with progress indicators

**Success Metrics Achieved:**

- ✅ Go from "artist + markets + constraints" → "proposed route" → "actual shows" without spreadsheets
- ✅ Route generation with comprehensive constraint satisfaction
- ✅ Generated routes respect user constraints (geography, timing, capacity, weather)
- ✅ Scenario comparison and bulk show creation functionality

**Features Delivered:**

1. **Complete Routing Models**: RoutingScenario and RoutingScenarioStop with full constraint support
2. **Smart Tour Builder UI**: Comprehensive interface with constraint panels and scenario management
3. **Advanced Routing Engine**: Rule-based algorithm with weather intelligence and geographic optimization
4. **Scenario Management**: Compare, save, apply, and delete routing scenarios
5. **Bulk Show Creation**: Convert scenarios to actual shows with conflict detection

**Integration Points:**

- ✅ Weather intelligence integrated (climate scores in routing decisions)
- ✅ Existing venue database and show management integrated
- ✅ Tour detail page integration complete

---

### 🤝 Milestone 5: Collaboration & Sharing v1

**Goal:** Let venues, promoters, and tour managers collaborate, not just visualize

**Status:** ✅ **Complete** (implemented in current session)

**Core Features:**

1. **Show Sharing & Permissions**

   - Generate view-only links for show details (basic fields visible)
   - Invite-based access with password protection
   - Role-based permissions:
     - `VIEW_ONLY` - Read show details and logistics
     - `EDIT_LOGISTICS` - Update load-in, soundcheck, curfew, notes
     - `EDIT_FINANCIALS` - Update deal terms and expenses

2. **Multi-Organization Collaboration**

   - Invite external users to specific shows/tours
   - Cross-organization visibility controls
   - Activity log for tracking changes and updates
   - Email notifications for important changes

3. **Export & Integration**
   - Day sheet PDF export (convert HTML print styles)
   - Tour/show data CSV export with custom field selection
   - iCal export for tour calendar integration
   - Simple webhook system for show status/logistics changes

**Success Metrics Achieved:**

- ✅ Promoters can share shows with external venue contacts via secure links
- ✅ External users can view and edit show details based on permission levels
- ✅ Activity logging tracks all changes and collaborator access
- ✅ Export formats (PDF day sheets, CSV data, iCal calendar) ready for production

**Features Delivered:**

1. **ShowCollaborator Model & API**: Complete external access system with role-based permissions
2. **Shareable Links**: Secure token-based access with expiration and permission controls
3. **Public Show Views**: Dedicated interface for external collaborators with edit capabilities
4. **Export System**: Professional day sheet PDF, tour CSV data, and iCal calendar integration
5. **Activity Logging**: Comprehensive audit trail for all collaboration activities
6. **Permission System**: VIEW_ONLY, EDIT_LOGISTICS, and EDIT_FINANCIALS access levels

**Technical Implementation Complete:**

- ✅ Extended database schema with ShowCollaborator and ActivityLog models
- ✅ Secure token generation and validation system
- ✅ Role-based API endpoints with proper permission checks
- ✅ Professional export formats with audit logging

---

## Backlog (Post-M5)

### Advanced Features

1. **AI Copilot for Summaries & Recommendations**

   - OpenAI integration via `OPENAI_API_KEY`
   - Use cases:
     - Summarize tour risk across all shows
     - Generate day sheet content from show data
     - Suggest pricing adjustments based on pacing
     - Draft settlement documents

2. **Settlement & Financial Reporting**

   - Post-show settlement flow
   - Actual vs. estimated P&L
   - Multi-party split calculations
   - Export to accounting software (QuickBooks, Xero)

3. **Mobile Apps**

   - iOS and Android apps for tour managers
   - Offline access to day sheets
   - Push notifications for show updates
   - Quick check-in and status updates

4. **Advanced Ticketing Analytics**

   - Cross-market comparisons
   - Venue performance benchmarking
   - Pricing elasticity analysis
   - Predictive models for ticket sales

5. **Merchandise Management**

   - Inventory tracking across tour
   - Sales by show and item
   - Reorder recommendations
   - Profit analysis by category

6. **Prism & Master Tour Migration Tools**
   - CSV import wizards
   - Data mapping and validation
   - Bulk import for historical shows
   - Migration checklists and guides

---

## Technical Architecture

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context + Server Components
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts

### Backend

- **API:** Next.js API Routes (serverless)
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Cache:** Redis 7
- **Authentication:** Clerk v5
- **File Storage:** S3 or Vercel Blob

### AI/ML

- **Provider:** OpenAI (GPT-4) ✓ Implemented
- **Use Cases:** Day sheet generation, tour risk summaries, weather explanations ✓ Live
- **Future:** Routing suggestions, price/demand forecasting, custom models

### Infrastructure

- **Hosting:** Vercel (frontend + API)
- **Database:** Supabase or Neon (Postgres)
- **Cache:** Upstash Redis
- **Monitoring:** Vercel Analytics + Sentry
- **CI/CD:** GitHub Actions

---

## 🎯 Launch Metrics & KPIs

### ✅ Platform Readiness (COMPLETE - November 2025)

- **Feature Completeness:** 100% - All 5 core milestones delivered
- **Production Architecture:** Multi-tenant, secure, scalable
- **Export Capabilities:** Professional PDF, CSV, iCal integration
- **Collaboration System:** External sharing with role-based permissions
- **AI Intelligence:** Smart routing, weather insights, risk analysis

### Beta Launch Phase (Q4 2025 - READY NOW)

- **Target Production Users:** Tour managers, promoters, venue operators
- **Success Criteria:**

  - Users can complete full tour workflow end-to-end
  - AI routing generates viable tour scenarios
  - Collaboration features enable external venue coordination
  - Professional exports meet production requirements### Market Launch Phase (Q1 2026)

- **Active Organizations:** 50+
- **Tours Managed:** 100+
- **Shows Tracked:** 500+
- **Feature Adoption Targets:**
  - Tour management: 100%
  - Show tracking: 100%
  - AI routing: 70%+ (competitive differentiator)
  - External collaboration: 60%+

### Growth Phase (Q3-Q4 2025)

- **Active Organizations:** 200+
- **Revenue:** $10k+ MRR
- **Churn Rate:** <5% monthly
- **NPS Score:** >50

---

## ⚡ Production Launch Decisions Needed

**🚀 PLATFORM STATUS: Ready for immediate beta launch with complete feature set**

1. **Pricing Model (IMMEDIATE DECISION):**

   - ✅ Platform complete with enterprise features (collaboration, exports, AI routing)
   - Recommended: Tiered SaaS model
     - Starter: $49/month per organization (basic features)
     - Professional: $149/month (full collaboration + AI routing)
     - Enterprise: $299/month (advanced analytics + premium support)

2. **Beta Launch Strategy (READY NOW):**

   - ✅ All core features complete and tested
   - ✅ Multi-tenant architecture with data isolation ready
   - ✅ Professional export and collaboration features delivered
   - Recommendation: Direct customer acquisition and industry outreach

3. **Data Privacy & Compliance:**

   - GDPR compliance requirements?
   - Data retention policies?
   - User data export requirements?

4. **Integration Priorities:**

   - Which ticketing platforms first? (Eventbrite, Dice, AXS, Ticketmaster?)
   - Accounting software integrations?
   - Calendar sync requirements?

5. **Mobile Strategy:**
   - Mobile-optimized web app sufficient initially?
   - When do we need native apps?
   - Which platform first (iOS vs. Android)?

---

## Appendix: Comparison to Competitors

### TourBrain vs. Prism

- **What we replace:** Booking calendar, deal tracking, settlements, financial reporting
- **What we add:** AI routing, tour-level logistics, ticket intelligence in same system
- **Migration path:** CSV export from Prism → import to TourBrain

### TourBrain vs. Master Tour

- **What we replace:** Tour itineraries, day sheets, crew communication, travel tracking
- **What we add:** Integrated booking and financials, AI routing, real-time ticket data
- **Migration path:** Export tour calendar → import to TourBrain

### TourBrain vs. Prism + Master Tour Combined

- **Key advantage:** Single source of truth, no data synchronization
- **Key differentiator:** AI-native routing and forecasting
- **Target user:** Teams tired of juggling two systems + spreadsheets

---

## 🚀 Production Deployment Readiness

### ✅ Technical Requirements Complete

**Application Architecture:**

- ✅ Multi-tenant database with data isolation
- ✅ Authentication & authorization (Clerk integration)
- ✅ API endpoints with proper error handling
- ✅ Responsive UI with professional export capabilities
- ✅ External collaboration with security controls

**Code Quality & Testing:**

- ✅ TypeScript throughout for type safety
- ✅ Comprehensive test suite (unit, integration, E2E)
- ✅ Proper error boundaries and user feedback
- ✅ Production-ready logging and monitoring hooks

### 🎬 Pre-Launch Checklist

**Environment Setup:**

- [ ] Production database provisioning (Supabase/Neon)
- [ ] Environment variable configuration
- [ ] SSL certificates and domain setup
- [ ] CDN configuration for static assets

**Third-Party Integrations:**

- [ ] Clerk production authentication setup
- [ ] OpenAI API production keys
- [ ] Email service configuration (transactional)
- [ ] Analytics and monitoring (Vercel/Sentry)

**Business Operations:**

- [ ] Terms of Service and Privacy Policy
- [ ] Billing system integration (Stripe)
- [ ] Customer support infrastructure
- [ ] Onboarding flow and documentation

**Launch Preparation:**

- [ ] Beta user invitation system
- [ ] Feedback collection mechanisms
- [ ] Performance monitoring setup
- [ ] Backup and disaster recovery procedures

## 🎯 Next Steps: Development Priority

**🎉 Major Achievement: Core Platform + Advanced Features Complete**

TourBrain now has a **complete, production-ready platform** with advanced AI and collaboration features:

**✅ Milestones 1-5 Complete:**

- M1: Core Data Model & Auth
- M2: Tour & Show Operations
- M3: Ticketing Intelligence
- M4: AI Routing & Tour Design
- M5: Collaboration & Sharing

**Immediate Next Priorities:**

1. **Production Deployment & Testing**

   - Set up production database and environment
   - User acceptance testing with beta customers
   - Performance optimization and monitoring

2. **Beta Launch Preparation**

   - Onboarding flow refinement
   - Documentation and help system
   - Pricing model implementation
   - Customer support infrastructure

3. **Advanced Features (Post-M5)**
   - Mobile applications
   - Advanced ticketing analytics
   - Settlement & financial reporting
   - Third-party integrations (Prism/Master Tour migration tools)

**Current Technical Status:**

- ✅ **Robust Architecture**: Clerk auth + Prisma ORM + Next.js + TypeScript
- ✅ **Complete Feature Set**: Tour operations, AI routing, external collaboration
- ✅ **Production Ready**: Comprehensive test suite, proper error handling
- ✅ **Scalable Design**: Multi-tenant architecture with data isolation

**Development Philosophy Achieved:**

- Built on proven patterns: Started simple, added intelligence incrementally
- User-centric design: Workflows tested with real tour scenarios
- Enterprise-grade: Security, collaboration, and professional export capabilities

---

**Document Owner:** TourBrain Product Team  
**Review Cadence:** Weekly during active development  
**Last Updated:** After M5 completion - Core platform ready for beta launch
**Next Review:** Pre-production deployment planning
