# 🚀 TourBrain Setup Guide

## Quick Start (5 minutes to pilot-ready)

### 1. Install Dependencies

```bash
# Install OpenAI package
cd apps/web
npm install openai

# Install root dependencies
cd ../..
npm install
```

### 2. Configure API Keys

Update `/workspaces/TourBrain/apps/web/.env.local` with your actual keys:

```env
# 🔑 Get Clerk keys from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your-actual-clerk-key"
CLERK_SECRET_KEY="clerk_secret_your-actual-clerk-secret"

# 🤖 Get OpenAI key from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-your-actual-openai-key"

# 📧 Set admin password for current admin panel
ADMIN_PASSWORD="your-secure-password"
```

### 3. Setup Database

```bash
# Run database migrations
npx prisma migrate deploy
npx prisma generate
```

### 4. Start Development Server

```bash
cd apps/web
npm run dev
```

Visit `http://localhost:3000` - **TourBrain is now fully operational!** 🎉

---

## What You Get Immediately

### 🔐 **Authentication System**

- User sign-up/sign-in via Clerk
- Multi-tenant organizations with role-based access
- Automatic user onboarding flow

### 🏢 **Organization Management**

- Create and manage multiple organizations
- Invite team members with proper permissions
- Data isolation between organizations

### 🎪 **Complete Tour Operations Platform**

- **Venues**: Add contacts, tech specs, deals, notes
- **Artists**: Manage roster with social media and contact info
- **Tours**: Create multi-show tours with routing
- **Shows**: Detailed show management with venue/artist linking

### 🤖 **AI-Powered Features**

- **AI Day Sheets**: Generate professional production notes for any show
- **Tour Risk Analysis**: Get AI insights on routing, logistics, and potential issues
- **Smart Suggestions**: AI recommendations for venues and routing

### 📄 **Professional Day Sheets**

- Print-optimized layouts for on-site use
- Venue contacts, load-in times, technical specs
- Deal information and production notes
- Mobile-responsive for venue visits

### 👨‍💼 **Admin Dashboard**

- Manage waitlist entries at `/admin`
- Export waitlist data for outreach
- User and organization oversight

---

## Deployment Environments

### **Development** (Already configured)

- File: `apps/web/.env.local`
- URL: `http://localhost:3000`
- Uses: Test Clerk keys, development OpenAI key

### **Staging**

- File: `.env.staging` (template created)
- URL: `https://staging.tourbrain.ai`
- Purpose: Client demos and pre-production testing

### **Production**

- File: `.env.production` (template created)
- URL: `https://tourbrain.ai`
- Purpose: Live design partner pilots

---

## Design Partner Pilot Process

### **Today: Technical Setup** ✅

- [x] OpenAI package installed
- [x] Environment variables configured
- [x] Development server ready

### **This Week: Pilot Preparation**

1. **Qualify Design Partners**

   - Visit `/admin` to review waitlist
   - Filter for tour managers, promoters, venues
   - Mark 3-5 candidates as "QUALIFIED"

2. **Schedule Demo Calls**
   - 20-minute demos showing full platform
   - Focus on day sheet generation and AI features
   - Emphasize "runs alongside current system"

### **Next Week: Pilot Launch**

1. **Pilot Kickoff**

   - 4-week commitment per design partner
   - Weekly check-ins and feedback collection
   - Direct support via Slack/email

2. **Success Metrics**
   - Day sheets generated per pilot
   - Features used most frequently
   - Pain points and improvement requests

---

## Key Features for Demos

### **Show the Tour Workflow (8 minutes)**

1. Add a venue with full contact details
2. Create an artist with social media links
3. Set up a tour with multiple shows
4. Generate AI day sheet for one show
5. Show mobile-responsive interface

### **Highlight AI Features (5 minutes)**

1. Click "Generate AI Notes" on any show
2. Run tour risk analysis
3. Show print-optimized day sheets
4. Demonstrate mobile venue lookup

### **Emphasize Professional Quality**

- Clean, responsive interface designed for tour ops
- Print layouts that work on-site
- Multi-tenant security for team collaboration
- Replaces spreadsheets with professional platform

---

## Troubleshooting

### **AI Features Not Working**

- Verify `OPENAI_API_KEY` is set in `.env.local`
- Check OpenAI account has credits
- Look for errors in browser console

### **Authentication Issues**

- Verify Clerk keys in `.env.local`
- Check Clerk dashboard for domain configuration
- Clear browser cookies and try again

### **Database Connection**

- Run `npx prisma migrate deploy`
- Check `DATABASE_URL` in `.env.local`
- Verify Prisma client is generated

### **Build Errors**

- Run `npm install` in both root and `apps/web`
- Check for TypeScript errors with `npm run build`
- Verify all environment variables are set

---

## Next Steps After Setup

1. **Test Full Flow**
   - Create organization → add venue → create tour → generate day sheet
2. **Admin Access**

   - Visit `/admin` with admin password
   - Review waitlist for pilot candidates

3. **Deploy Staging**

   - Configure staging environment variables
   - Deploy to Vercel/Railway for client demos

4. **Launch Pilots**
   - Reach out to qualified waitlist entries
   - Schedule demos and kickoff calls
   - Begin 4-week pilot program

**TourBrain is ready to revolutionize tour operations! 🎊**
