# 🚀 TourBrain Production Deployment Guide

## Automated Deployment Setup

This guide will help you set up fully automated deployments to production (tourbrain.ai).

---

## Quick Start (3 Steps)

### Step 1: Install Prerequisites

```bash
# Install Vercel CLI
npm install -g vercel@latest

# Install GitHub CLI (if not installed)
# macOS: brew install gh
# Linux: see https://cli.github.com/
```

### Step 2: Run Setup Script

```bash
chmod +x setup-vercel-production.sh
./setup-vercel-production.sh
```

This script will:

- ✅ Link your project to Vercel
- ✅ Configure custom domains (tourbrain.ai, www.tourbrain.ai)
- ✅ Set up environment variables
- ✅ Deploy to production

### Step 3: Configure GitHub Actions (Optional - for auto-deploy on push)

```bash
chmod +x setup-github-secrets.sh
./setup-github-secrets.sh
```

This enables automatic deployments when you push to `main` branch.

---

## Manual Steps Required

### 1. DNS Configuration

After running the setup script, you need to configure DNS records in your domain registrar:

**For tourbrain.ai:**

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

Run `vercel domains inspect tourbrain.ai` to get your exact DNS records.

### 2. Clerk Production Keys

Get your production Clerk keys:

1. Go to https://dashboard.clerk.com
2. Select your TourBrain application
3. Go to **API Keys** → **Production**
4. Copy the keys

Add to Vercel:

```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Paste: pk_live_...

vercel env add CLERK_SECRET_KEY production
# Paste: sk_live_...
```

### 3. Database URL

Set your production database URL:

```bash
vercel env add DATABASE_URL production
# Paste: postgresql://...
```

### 4. OpenAI API Key

Set your OpenAI production key:

```bash
vercel env add OPENAI_API_KEY production
# Paste: sk-proj-...
```

---

## Deployment Workflows

### Automatic Deployment (Recommended)

Once GitHub Actions is configured:

```bash
# 1. Make changes
git add .
git commit -m "feat: new feature"

# 2. Push to main
git push origin main

# 3. Deployment happens automatically!
# Monitor at: https://github.com/TourBrainAI/TourBrain/actions
```

### Manual Deployment

Use the quick deploy script:

```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

Or use Vercel CLI directly:

```bash
# Deploy to production
vercel --prod

# Create preview deployment
vercel
```

---

## Useful Commands

```bash
# Monitor deployment logs
vercel logs --follow

# Check deployment status
vercel inspect

# List environment variables
vercel env ls

# List domains
vercel domains ls

# Pull latest environment variables
vercel env pull

# View project info
vercel project ls
```

---

## Verification Checklist

After deployment, verify:

- [ ] Site loads: https://tourbrain.ai
- [ ] Homepage renders correctly
- [ ] Sign-up works: https://tourbrain.ai/sign-up
- [ ] Sign-in works: https://tourbrain.ai/sign-in
- [ ] Health check passes: https://tourbrain.ai/api/health
- [ ] Database connection: https://tourbrain.ai/api/health/database
- [ ] OpenAI integration: https://tourbrain.ai/api/health/openai

---

## Troubleshooting

### Build fails in Vercel

Check environment variables:

```bash
vercel env ls
```

View build logs:

```bash
vercel logs
```

### Domain not working

1. Verify DNS propagation: `dig tourbrain.ai`
2. Check domain status: `vercel domains inspect tourbrain.ai`
3. DNS can take 24-48 hours to propagate

### Authentication errors

1. Verify Clerk keys are set for production environment
2. Check Clerk dashboard domain settings
3. Ensure redirect URLs include `https://tourbrain.ai`

### Database connection issues

1. Check DATABASE_URL is set correctly
2. Verify database allows connections from Vercel IPs
3. Test connection: `curl https://tourbrain.ai/api/health/database`

---

## Rollback

If something goes wrong:

```bash
# List recent deployments
vercel ls

# Promote previous deployment to production
vercel promote <deployment-url>
```

Or in Vercel Dashboard:

1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

---

## Support

- Vercel Docs: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/en/actions
- Clerk Setup: https://clerk.com/docs

For TourBrain-specific issues, check logs:

- GitHub Actions: https://github.com/TourBrainAI/TourBrain/actions
- Vercel Logs: `vercel logs --follow`
