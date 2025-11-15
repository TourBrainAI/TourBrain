# 🚨 Deployment Issues & Fixes

## Current Status

Your deployment partially succeeded but needs a few fixes:

### ✅ What Worked

- Vercel project linked successfully
- Environment variables added to Vercel
- Initial deployment created

### ❌ Issues to Fix

#### 1. Build Command Error

**Error:** `sh: line 1: cd: apps/web: No such file or directory`

**Fix:** Updated `vercel.json` to use simpler commands

**Action Required:**

```bash
chmod +x fix-and-deploy.sh
./fix-and-deploy.sh
```

This will:

- Commit the fixed vercel.json
- Push to GitHub
- Trigger automatic redeploy on Vercel

#### 2. DNS Configuration

**Issue:** Domain cannot be assigned because nameservers are not pointing to Vercel

**Current Nameservers (GoDaddy):**

- ns77.domaincontrol.com
- ns78.domaincontrol.com

**Required Nameservers (Vercel):**

- ns1.vercel-dns.com
- ns2.vercel-dns.com

**How to Fix:**

1. Go to your GoDaddy account
2. Navigate to DNS Management for tourbrain.ai
3. Change nameservers to:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
4. Wait 24-48 hours for DNS propagation

**Alternative (Faster):** Use A Record instead:

1. Keep your current nameservers
2. Add an A record:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600
   ```
3. Add CNAME for www:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ```

#### 3. Domain Assignment

Once DNS is configured, assign the domain:

```bash
vercel domains add tourbrain.ai --force
vercel domains add www.tourbrain.ai --force
```

---

## Step-by-Step Fix Process

### Step 1: Fix Build Configuration (Do This Now)

```bash
# This commits and pushes the fixed vercel.json
chmod +x fix-and-deploy.sh
./fix-and-deploy.sh
```

### Step 2: Configure DNS

**Option A: Change Nameservers (Recommended)**

1. Login to GoDaddy
2. Go to My Products → DNS
3. Click "Change Nameservers"
4. Select "Custom"
5. Enter:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
6. Save

**Option B: Add A Records (Faster)**

1. Login to GoDaddy
2. Go to My Products → DNS
3. Add A Record:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
4. Add CNAME:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### Step 3: Wait for Deployment

After pushing the fix:

1. Check GitHub Actions: https://github.com/TourBrainAI/TourBrain/actions
2. Check Vercel Dashboard: https://vercel.com/dashboard
3. Monitor logs: `vercel logs --follow`

### Step 4: Assign Domain (After DNS Propagation)

```bash
# Check if DNS has propagated
dig tourbrain.ai

# If it shows Vercel's IP or nameservers, assign domains:
vercel domains add tourbrain.ai --force
vercel domains add www.tourbrain.ai --force
```

### Step 5: Verify Production

```bash
# Check health
curl https://tourbrain.ai/api/health

# Or visit:
open https://tourbrain.ai
```

---

## Quick Commands Reference

```bash
# Push the build fix
./fix-and-deploy.sh

# Monitor deployment
vercel logs --follow

# Check deployment status
vercel inspect

# List deployments
vercel ls

# Check domains
vercel domains ls

# Redeploy manually
vercel --prod

# Check environment variables
vercel env ls

# Check DNS
dig tourbrain.ai
dig www.tourbrain.ai
```

---

## Troubleshooting

### Build Still Failing?

1. Check build logs:

   ```bash
   vercel logs
   ```

2. Try local build:

   ```bash
   npm run build
   ```

3. If local build works, redeploy:
   ```bash
   vercel --prod --force
   ```

### Domain Not Working?

1. Check DNS propagation:

   ```bash
   dig tourbrain.ai
   ```

2. Verify nameservers:

   ```bash
   vercel domains inspect tourbrain.ai
   ```

3. Check Vercel domain status:
   ```bash
   vercel domains ls
   ```

### Still Having Issues?

Contact Vercel support or check:

- GitHub Actions logs: https://github.com/TourBrainAI/TourBrain/actions
- Vercel deployment logs: https://vercel.com/dashboard
- Vercel docs: https://vercel.com/docs

---

## Expected Timeline

- **Build fix deploy:** 2-3 minutes
- **DNS propagation (nameservers):** 24-48 hours
- **DNS propagation (A records):** 1-4 hours
- **Domain assignment:** Instant (after DNS)
- **Total time to live:** 1-48 hours depending on DNS method

---

## Next Steps After Deployment

1. ✅ Verify site loads at https://tourbrain.ai
2. ✅ Test authentication: https://tourbrain.ai/sign-in
3. ✅ Check API health: https://tourbrain.ai/api/health
4. ✅ Set up monitoring (optional)
5. ✅ Configure GitHub Actions for auto-deploy (run ./setup-github-secrets.sh)

---

## Automated Deployment Flow

Once DNS is configured and first deployment succeeds:

```
Code Change → Push to main → GitHub Actions → Vercel Deploy → Live on tourbrain.ai
```

**All automatic!** No manual steps needed for future deployments.
