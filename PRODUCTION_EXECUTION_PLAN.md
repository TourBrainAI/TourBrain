# 🚀 TourBrain Production Services Configuration Guide

**IMMEDIATE EXECUTION PLAN**  
**Target:** Production deployment within next 4 hours  
**Status:** Ready to execute - all components verified

---

## 📋 STEP-BY-STEP EXECUTION PLAN

### 1. Database Setup (30 minutes) - PRIORITY 1

#### Option A: Supabase (Recommended)

**Why:** Managed PostgreSQL with built-in connection pooling, backups, and monitoring

**Execution Steps:**

1. **Create Supabase Account & Project**

   - Go to [supabase.com](https://supabase.com)
   - Create new project: "TourBrain-Production"
   - Select region: US East (closest to users)
   - Wait for project provisioning (5-10 minutes)

2. **Get Connection String**

   - Navigate to Project Settings > Database
   - Copy "Connection pooling" URL (recommended for production)
   - Format: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

3. **Configure Environment**

   ```bash
   # Set production DATABASE_URL
   export DATABASE_URL="[YOUR_SUPABASE_CONNECTION_STRING]"
   ```

4. **Deploy Database Schema**
   ```bash
   # Run our deployment script
   chmod +x deploy-database.sh
   ./deploy-database.sh
   ```

**Expected Result:** Production PostgreSQL database with complete TourBrain schema

#### Option B: Neon (Alternative)

**Why:** Serverless PostgreSQL with automatic scaling

**Execution Steps:**

1. Create account at [neon.tech](https://neon.tech)
2. Create project: "TourBrain-Production"
3. Get connection string from dashboard
4. Same deployment process as Supabase

---

### 2. Authentication Setup (20 minutes) - PRIORITY 1

#### Clerk Production Configuration

**Why:** Enterprise-grade authentication with social providers and security

**Execution Steps:**

1. **Create Clerk Production Instance**

   - Go to [clerk.com](https://clerk.com)
   - Create new application: "TourBrain Production"
   - Select "Production" environment

2. **Domain Configuration**

   ```
   Authorized Domains: tourbrain.ai, www.tourbrain.ai
   Authorized Redirect URLs: https://tourbrain.ai/sign-in/sso-callback
   ```

3. **Social Authentication Setup**

   - Enable Google OAuth (primary for business users)
   - Enable GitHub OAuth (secondary for technical users)
   - Configure provider settings with production credentials

4. **Get Production Keys**

   ```bash
   # From Clerk Dashboard > API Keys
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_[PRODUCTION_KEY]"
   CLERK_SECRET_KEY="clerk_secret_[PRODUCTION_SECRET]"
   ```

5. **Configure Routing**
   ```bash
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
   ```

**Expected Result:** Production authentication system with social login capabilities

---

### 3. AI Services Setup (15 minutes) - PRIORITY 1

#### OpenAI Production Configuration

**Why:** GPT-4 powers tour routing, day sheet generation, and risk analysis

**Execution Steps:**

1. **Create Production API Key**

   - Go to [platform.openai.com](https://platform.openai.com)
   - Navigate to API Keys section
   - Create new key: "TourBrain-Production"
   - Copy key securely (only shown once)

2. **Configure Usage Limits**

   ```
   Monthly Budget: $300 (covers ~500 routing requests + day sheets)
   Rate Limits: Tier 2 (sufficient for beta launch)
   Usage Alerts: 80% and 95% of budget
   ```

3. **Set Environment Variable**

   ```bash
   OPENAI_API_KEY="sk-proj-[YOUR_PRODUCTION_KEY]"
   ```

4. **Verify Integration**
   - Test API connection with health endpoint
   - Verify GPT-4 model access
   - Test tour routing generation

**Expected Monthly Costs:**

- 15 beta organizations: ~$150-250/month
- 50+ organizations: ~$400-600/month
- Scales with usage (routing requests, day sheets, AI insights)

**Expected Result:** AI-powered features operational in production

---

### 4. Vercel Deployment (25 minutes) - PRIORITY 1

#### Production Deployment Configuration

**Why:** Best-in-class Next.js hosting with global CDN and automatic SSL

**Execution Steps:**

1. **Connect Repository to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository: TourBrainAI/TourBrain
   - Select team/personal account for deployment

2. **Configure Build Settings**

   ```
   Framework Preset: Next.js
   Build Command: cd apps/web && npm run build
   Output Directory: apps/web/.next
   Install Command: npm install && cd apps/web && npm install
   Root Directory: (leave empty - monorepo auto-detected)
   ```

3. **Add Environment Variables**

   ```bash
   # Database
   DATABASE_URL=[YOUR_SUPABASE_CONNECTION_STRING]

   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[YOUR_CLERK_PUBLIC_KEY]
   CLERK_SECRET_KEY=[YOUR_CLERK_SECRET_KEY]
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

   # AI Services
   OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]

   # App Configuration
   NEXT_PUBLIC_APP_URL=https://tourbrain.ai
   NODE_ENV=production
   ```

4. **Deploy Application**

   - Click "Deploy" to start build process
   - Monitor build logs for any errors
   - Wait for deployment to complete (5-10 minutes)

5. **Configure Custom Domain**
   - Add custom domain: tourbrain.ai
   - Configure DNS records as instructed
   - Wait for SSL certificate provisioning

**Expected Result:** Production application live at https://tourbrain.ai

---

### 5. Health Verification (10 minutes) - PRIORITY 1

#### Production Health Checks

**Verify all systems operational before beta launch**

**Health Endpoints to Test:**

1. **Overall Health:** `GET https://tourbrain.ai/api/health`

   ```json
   Expected Response:
   {
     "status": "ok",
     "version": "1.0.0",
     "environment": "production",
     "services": {
       "database": {"status": "connected", "responseTime": "<100ms"},
       "ai": {"status": "configured"}
     }
   }
   ```

2. **Database Health:** `GET https://tourbrain.ai/api/health/database`

   ```json
   Expected Response:
   {
     "status": "ok",
     "service": "database",
     "message": "Database connection successful"
   }
   ```

3. **AI Service Health:** `GET https://tourbrain.ai/api/health/openai`
   ```json
   Expected Response:
   {
     "status": "ok",
     "service": "openai",
     "model": "gpt-4",
     "message": "OpenAI API connection successful"
   }
   ```

**Core Workflow Testing:**

1. **User Registration Flow**

   - Sign up with email
   - Create organization
   - Verify multi-tenant data isolation

2. **Tour Operations Flow**

   - Add venues and artists
   - Create tour with multiple shows
   - Generate AI routing scenario
   - Apply scenario to create shows

3. **Collaboration Flow**

   - Generate shareable link for show
   - Test external access with role-based permissions
   - Verify activity logging

4. **Export Flow**
   - Generate PDF day sheet
   - Export CSV tour data
   - Create iCal calendar integration

**Expected Result:** All core workflows operational in production environment

---

## 🎯 EXECUTION TIMELINE (Next 4 Hours)

### Hour 1: Core Services Setup

- ✅ **0:00-0:30** Database setup (Supabase configuration and migration)
- ✅ **0:30-0:50** Authentication setup (Clerk production instance)
- ✅ **0:50-1:00** AI services setup (OpenAI production API)

### Hour 2: Application Deployment

- ✅ **1:00-1:25** Vercel deployment configuration and build
- ✅ **1:25-1:35** Domain setup and SSL configuration
- ✅ **1:35-1:45** Health checks and verification
- ✅ **1:45-2:00** Core workflow testing

### Hour 3: Monitoring & Analytics Setup

- ✅ **2:00-2:20** Sentry error tracking configuration
- ✅ **2:20-2:40** Vercel Analytics and performance monitoring
- ✅ **2:40-3:00** Business metrics dashboard setup

### Hour 4: Beta Preparation

- ✅ **3:00-3:30** Beta cohort selection from waitlist
- ✅ **3:30-3:45** Beta invitation system setup
- ✅ **3:45-4:00** Customer support infrastructure preparation

---

## 🚨 TROUBLESHOOTING & ROLLBACK

### Common Issues & Solutions

**Database Connection Issues:**

- Verify Supabase project is active and connection string is correct
- Check if IP restrictions are configured (Vercel IPs should be allowed)
- Ensure connection pooling is enabled for serverless deployment

**Authentication Issues:**

- Verify Clerk domain configuration matches deployment URL
- Check that redirect URLs are properly configured
- Ensure production API keys are active and have proper permissions

**AI Service Issues:**

- Verify OpenAI API key is active and has GPT-4 access
- Check usage limits and billing configuration
- Ensure rate limits are appropriate for expected traffic

**Deployment Issues:**

- Check build logs for dependency or compilation errors
- Verify all environment variables are properly set
- Ensure monorepo build configuration is correct

### Emergency Rollback Procedure

1. **Revert Vercel deployment** to previous working version
2. **Restore database** from automated Supabase backup if needed
3. **Switch DNS** back to maintenance page if necessary
4. **Communicate status** to any active beta users

---

## 📊 SUCCESS METRICS (Post-Deployment)

### Technical Performance

- ✅ **Uptime:** 99.9%+ (target for production)
- ✅ **Response Times:** <500ms API, <2s page loads
- ✅ **Error Rate:** <1% across all endpoints
- ✅ **Database Performance:** <100ms query response times

### Business Readiness

- ✅ **User Onboarding:** Complete signup → organization creation flow
- ✅ **Feature Adoption:** AI routing, collaboration, exports all functional
- ✅ **Data Security:** Multi-tenant isolation verified
- ✅ **Professional Quality:** Day sheets, exports meet production standards

---

**🎯 READY TO EXECUTE:** All components verified and ready for production deployment

**⏰ TIMELINE:** 4 hours to live production platform ready for beta users

**🚀 OUTCOME:** Complete TourBrain platform operational at https://tourbrain.ai with first beta cohort onboarded by end of week
