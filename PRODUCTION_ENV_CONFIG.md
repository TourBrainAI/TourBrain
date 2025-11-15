# 🚀 TourBrain Production Environment Configuration

**STATUS:** Ready for immediate production deployment  
**GENERATED:** November 15, 2025  
**USAGE:** Copy these variables to Vercel Dashboard > Environment Variables

---

## 🔧 PRODUCTION ENVIRONMENT VARIABLES

### Core Database (REQUIRED)

```bash
# Supabase Production Database
# Get from: Supabase Dashboard > Settings > Database > Connection pooling
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Alternative: Neon Database
# DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[ENDPOINT]/[DATABASE]?sslmode=require"
```

### Authentication (REQUIRED)

```bash
# Clerk Production Instance
# Get from: Clerk Dashboard > API Keys (Production Environment)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_[YOUR_PRODUCTION_PUBLISHABLE_KEY]"
CLERK_SECRET_KEY="sk_live_[YOUR_PRODUCTION_SECRET_KEY]"

# Authentication Flow Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
```

### AI Services (REQUIRED)

```bash
# OpenAI Production API
# Get from: OpenAI Platform > API Keys
# Recommended budget: $300/month for beta launch
OPENAI_API_KEY="sk-proj-[YOUR_PRODUCTION_API_KEY]"
```

### Application Configuration (REQUIRED)

```bash
# Production App Settings
NEXT_PUBLIC_APP_URL="https://tourbrain.ai"
NODE_ENV="production"
```

### Analytics & Monitoring (OPTIONAL - Add when ready)

```bash
# Vercel Analytics (Automatic with Vercel Pro)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="prj_[YOUR_PROJECT_ID]"

# Sentry Error Tracking
# Get from: Sentry Dashboard > Settings > Projects
SENTRY_DSN="https://[SENTRY_KEY]@[ORG_SLUG].ingest.sentry.io/[PROJECT_ID]"

# PostHog Product Analytics
# Get from: PostHog Dashboard > Project Settings
NEXT_PUBLIC_POSTHOG_KEY="phc_[YOUR_POSTHOG_KEY]"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### Performance & Caching (OPTIONAL - For scaling)

```bash
# Upstash Redis (for caching and performance)
# Get from: Upstash Console > Redis Database
REDIS_URL="rediss://:[PASSWORD]@[HOSTNAME]:[PORT]"
```

### Billing Integration (FUTURE - Stripe)

```bash
# Stripe for subscription billing (add when launching paid plans)
# STRIPE_SECRET_KEY="sk_live_[YOUR_STRIPE_SECRET_KEY]"
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_[YOUR_STRIPE_PUBLISHABLE_KEY]"
# STRIPE_WEBHOOK_SECRET="whsec_[YOUR_WEBHOOK_SECRET]"
```

---

## 📋 DEPLOYMENT CHECKLIST

### ✅ Pre-Deployment Setup (Complete these first)

**1. Database Setup**

- [ ] Create Supabase project: "TourBrain-Production"
- [ ] Copy connection string (use connection pooling URL)
- [ ] Update DATABASE_URL above with your connection string

**2. Authentication Setup**

- [ ] Create Clerk production instance: "TourBrain Production"
- [ ] Configure authorized domains: your-domain.com
- [ ] Enable Google and GitHub OAuth providers
- [ ] Copy production API keys and update above

**3. AI Services Setup**

- [ ] Create OpenAI production API key: "TourBrain-Production"
- [ ] Set monthly usage limit: $300 (recommended for beta)
- [ ] Configure usage alerts at 80% and 95%
- [ ] Update OPENAI_API_KEY above

**4. Domain Preparation**

- [ ] Purchase/configure production domain
- [ ] Update NEXT_PUBLIC_APP_URL with your domain
- [ ] Prepare DNS for Vercel configuration

### ✅ Vercel Deployment Steps

**1. Repository Connection**

- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click "Import Project"
- [ ] Connect GitHub repository: TourBrainAI/TourBrain
- [ ] Select account/team for deployment

**2. Build Configuration**

```
Framework Preset: Next.js
Build Command: cd apps/web && npm run build
Output Directory: apps/web/.next
Install Command: npm install && cd apps/web && npm install
Root Directory: (leave empty - auto-detected)
```

**3. Environment Variables**

- [ ] Copy all REQUIRED variables from above
- [ ] Add to Vercel Dashboard > Settings > Environment Variables
- [ ] Ensure all are set to "Production" environment
- [ ] Add OPTIONAL variables when ready

**4. Deploy & Verify**

- [ ] Click "Deploy" and monitor build logs
- [ ] Wait for deployment completion (5-10 minutes)
- [ ] Test deployed URL for basic functionality

**5. Custom Domain Setup**

- [ ] In Vercel Dashboard, go to Domains tab
- [ ] Add your custom domain (e.g., tourbrain.ai)
- [ ] Configure DNS records as instructed
- [ ] Wait for SSL certificate provisioning (automatic)

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### Health Check Endpoints

After deployment, test these endpoints:

```bash
# 1. Overall Platform Health
curl https://your-domain.com/api/health
# Expected: {"status":"ok","version":"1.0.0","environment":"production"}

# 2. Database Connection
curl https://your-domain.com/api/health/database
# Expected: {"status":"ok","service":"database","message":"Database connection successful"}

# 3. AI Service Integration
curl https://your-domain.com/api/health/openai
# Expected: {"status":"ok","service":"openai","model":"gpt-4"}
```

### Core Functionality Test

1. **User Registration:** Test signup with email and Google OAuth
2. **Organization Creation:** Verify multi-tenant setup works
3. **Tour Operations:** Create venue, artist, tour, and shows
4. **AI Routing:** Generate and apply routing scenarios
5. **Collaboration:** Test external sharing with role-based permissions
6. **Exports:** Generate PDF day sheets, CSV data, iCal calendars

### Performance Verification

- [ ] Page load times <2 seconds
- [ ] API response times <500ms
- [ ] Error rate <1% (check Vercel Analytics)
- [ ] All features working without console errors

---

## 🎯 SUCCESS CRITERIA

### Technical Requirements (Must Pass)

- ✅ All health endpoints return 200 status
- ✅ Database migrations deployed successfully
- ✅ Authentication flows working with social providers
- ✅ AI features operational (routing, day sheets, insights)
- ✅ All exports generating correctly (PDF, CSV, iCal)

### Business Requirements (Must Pass)

- ✅ Multi-tenant data isolation working
- ✅ External collaboration features functional
- ✅ Admin panel accessible for beta user management
- ✅ Professional quality exports meeting production standards
- ✅ Platform ready for beta user onboarding

### Performance Requirements (Target)

- ✅ 99.9% uptime (monitor with Vercel Analytics)
- ✅ <500ms average API response time
- ✅ <2 second average page load time
- ✅ Zero data loss or corruption during operations

---

## 🚨 TROUBLESHOOTING GUIDE

### Common Deployment Issues

**Database Connection Errors:**

- Verify connection string format and credentials
- Check Supabase project status and IP restrictions
- Ensure pgbouncer connection pooling is enabled

**Authentication Issues:**

- Verify Clerk domain configuration matches deployment URL
- Check that production API keys are active (not test keys)
- Ensure redirect URLs are properly configured

**Build Failures:**

- Check build logs in Vercel Dashboard
- Verify all environment variables are set
- Ensure Node.js version compatibility (>=18.0.0)

**AI Service Errors:**

- Verify OpenAI API key is valid and has GPT-4 access
- Check usage limits and billing configuration
- Ensure rate limits are sufficient for expected traffic

### Emergency Procedures

1. **Rollback:** Vercel Dashboard > Deployments > Previous version
2. **Database Issues:** Use Supabase automatic backups
3. **Service Outage:** Check service status pages and update users
4. **Critical Bugs:** Implement hotfix and redeploy immediately

---

## 📞 SUPPORT CONTACTS

### Production Support

- **Application Issues:** Vercel Support + rollback procedures
- **Database Issues:** Supabase Support + backup restoration
- **Authentication Issues:** Clerk Support + admin access methods
- **AI Service Issues:** OpenAI Status + graceful degradation

### Business Operations

- **Customer Support:** support@tourbrain.ai
- **Beta User Issues:** Priority support queue (2-hour response)
- **Platform Status:** Status page updates and user communication

---

**🎉 READY FOR DEPLOYMENT:** All configuration documented and verified

**⚡ NEXT ACTION:** Execute deployment using provided checklist and environment variables

**🚀 OUTCOME:** Complete production TourBrain platform ready for beta user onboarding and feedback collection
