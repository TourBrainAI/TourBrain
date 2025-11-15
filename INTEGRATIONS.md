# TourBrain Production Integrations Guide

**Status:** ✅ Production Ready - All 5 Core Milestones Complete  
**Version:** 1.0.0  
**Last Updated:** November 15, 2025

**Platform Completeness:** Full tour operations, AI routing, collaboration, exports, and weather intelligence

---

## 🔧 Core Integrations Configuration

### ✅ 1. Database (Supabase - REQUIRED)

**Setup Steps:**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project: "TourBrain Production"
3. Get connection string from Settings > Database
4. Update environment variable:

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Production Configuration:**

- Enable connection pooling (PgBouncer)
- Set up automated backups (daily recommended)
- Configure read replicas if needed for scaling
- Enable row-level security for additional data protection

**Verification:**

```bash
# Test connection
curl https://yourdomain.com/api/health/database
```

---

### ✅ 2. Authentication (Clerk - REQUIRED)

**Production Setup:**

1. Create production instance at [clerk.com](https://clerk.com)
2. Configure custom domain and redirect URLs:

   - Authorized redirect URLs: `https://yourdomain.com/sign-in/sso-callback`
   - Sign-in URL: `https://yourdomain.com/sign-in`
   - Sign-up URL: `https://yourdomain.com/sign-up`
   - After sign-in: `https://yourdomain.com/dashboard`
   - After sign-up: `https://yourdomain.com/onboarding`

3. Enable Social Authentication (Recommended):

   - Google OAuth (most common for business users)
   - GitHub OAuth (for technical users)
   - Microsoft OAuth (for enterprise customers)

4. Configure JWT Templates (if needed for API access):
   - Template Name: "TourBrain API"
   - Include custom claims for organization access

**Environment Variables:**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_[YOUR_KEY]"
CLERK_SECRET_KEY="sk_live_[YOUR_SECRET]"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
```

**Security Configuration:**

- Enable 2FA for admin accounts
- Set session timeout to 7 days for convenience
- Configure password strength requirements
- Set up webhook endpoints for user events (optional)

**Verification:**

- Test sign-up flow end-to-end
- Test social authentication providers
- Verify session management and logout
- Test organization creation after signup

---

### ✅ 3. AI Services (OpenAI - REQUIRED)

**Production Setup:**

1. Create production API key at [platform.openai.com](https://platform.openai.com)
2. Set up usage limits and billing alerts:

   - Monthly budget: $200-500 (depending on expected usage)
   - Rate limits: Tier 2 or higher recommended
   - Usage monitoring: Set alerts at 80% of budget

3. Configure API settings:
   - Model access: Ensure GPT-4 access is enabled
   - Organization settings: Set up proper billing and team access

**Environment Variables:**

```bash
OPENAI_API_KEY="sk-proj-[YOUR_PRODUCTION_KEY]"
```

**Usage Guidelines:**

- AI routing: ~$0.01-0.05 per routing request
- Day sheet generation: ~$0.02-0.08 per sheet
- Weather explanations: ~$0.01-0.03 per explanation
- Risk analysis: ~$0.02-0.06 per analysis

**Expected Monthly Costs:**

- 10 organizations: ~$50-150/month
- 50 organizations: ~$200-600/month
- 100 organizations: ~$400-1200/month

**Verification:**

```bash
# Test AI connection
curl https://yourdomain.com/api/health/openai
```

---

## 🚀 Optional Integrations (Recommended)

### 📊 Analytics & Monitoring

**1. Vercel Analytics (Recommended)**

```bash
# Enable in Vercel Dashboard
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="prj_[YOUR_PROJECT_ID]"
```

**2. Sentry Error Tracking (Recommended)**

```bash
# Create project at sentry.io
SENTRY_DSN="https://[KEY]@[ORG].ingest.sentry.io/[PROJECT]"
```

**3. PostHog Product Analytics (Optional)**

```bash
# For user behavior analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_[YOUR_KEY]"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### ⚡ Performance & Caching

**1. Upstash Redis (Recommended for scaling)**

```bash
# Create database at upstash.com
REDIS_URL="rediss://:[PASSWORD]@[HOST]:6380"
```

**Benefits:**

- Cache venue data for faster loading
- Store routing scenarios temporarily
- Cache weather API responses
- Session storage for improved performance

### 💳 Billing Integration (Future)

**Stripe Setup (Prepare for launch):**

```bash
# Create account at stripe.com
STRIPE_SECRET_KEY="sk_live_[YOUR_SECRET]"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_[YOUR_PUBLIC]"
STRIPE_WEBHOOK_SECRET="whsec_[YOUR_WEBHOOK]"
```

**Recommended Pricing Tiers:**

- **Starter:** $49/month - Basic features, 5 tours max
- **Professional:** $149/month - Full features, unlimited tours, AI routing
- **Enterprise:** $299/month - Advanced analytics, premium support, custom integrations

---

## 🔐 Security Configuration

### SSL & Domain Setup

**1. Custom Domain Configuration:**

- Purchase domain (yourdomain.com recommended)
- Configure DNS to point to Vercel
- Enable automatic SSL certificate renewal
- Set up www redirect to primary domain

**2. Security Headers:**

```typescript
// In next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

### Rate Limiting & API Security

**1. Vercel Rate Limiting:**

- Configure in Vercel Dashboard
- Recommended: 100 requests/minute per IP
- Higher limits for authenticated users

**2. API Key Security:**

- Rotate keys quarterly
- Use separate keys for staging/production
- Store in Vercel environment variables (never in code)

---

## 📋 Integration Testing Checklist

### Pre-Production Testing

**Database Tests:**

- [ ] Connection and query performance
- [ ] Migration rollback testing
- [ ] Backup and restore procedures
- [ ] Data integrity checks

**Authentication Tests:**

- [ ] Sign-up and sign-in flows
- [ ] Social authentication providers
- [ ] Session management and timeout
- [ ] Multi-organization access control

**AI Integration Tests:**

- [ ] Tour routing generation
- [ ] Day sheet AI content generation
- [ ] Weather intelligence responses
- [ ] Error handling and fallbacks

**Performance Tests:**

- [ ] Page load times under 2 seconds
- [ ] API response times under 500ms
- [ ] Database query optimization
- [ ] Concurrent user load testing

### Post-Deployment Monitoring

**Set Up Alerts For:**

- API error rates > 1%
- Database connection failures
- OpenAI API failures or rate limits
- Page load times > 3 seconds
- Failed authentication attempts (potential attacks)

**Daily Monitoring:**

- User registration and activation rates
- Feature usage analytics
- AI service costs and usage
- Database performance metrics

---

## 🎯 Go-Live Checklist

### Final Pre-Launch Steps

**Technical Verification:**

- [ ] All environment variables configured
- [ ] Health checks passing
- [ ] SSL certificate active
- [ ] Domain pointing correctly
- [ ] Backup procedures tested

**Business Readiness:**

- [ ] Terms of Service and Privacy Policy live
- [ ] Customer support email configured
- [ ] Beta user invitation system ready
- [ ] Billing system prepared (if launching with paid plans)

**Monitoring Setup:**

- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Usage analytics tracking
- [ ] Business metrics dashboard ready

**Team Preparation:**

- [ ] On-call rotation for critical issues
- [ ] Customer support procedures documented
- [ ] Incident response playbook ready
- [ ] Rollback procedures tested

---

**Status:** All integrations documented and ready for production deployment 🚀

**Next Action:** Execute integration configuration and testing before beta launch.
