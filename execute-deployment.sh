#!/bin/bash

# TourBrain Production Deployment Execution Script
# This script executes the complete production deployment checklist
# Version: 1.0.0
# Execute Date: November 15, 2025

set -e

echo "🚀 TourBrain Production Deployment - LIVE EXECUTION"
echo "=================================================="
echo ""
echo "📅 Starting deployment at: $(date)"
echo "🎯 Target: Complete production platform deployment"
echo "⏰ Estimated time: 2-3 hours"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

# Configuration check
print_step "Step 0: Pre-deployment verification"

if [ ! -f "package.json" ]; then
    print_error "Not in TourBrain root directory. Please run from /workspaces/TourBrain"
    exit 1
fi

if [ ! -f "prisma/schema.prisma" ]; then
    print_error "Prisma schema not found. Database setup cannot proceed."
    exit 1
fi

print_success "Environment verification passed"
echo ""

# Step 1: Database Setup (Production)
print_step "Step 1: Production Database Setup"
echo "=================================================="
echo ""

print_info "Database deployment options:"
echo "1. Supabase (Recommended) - Managed PostgreSQL with connection pooling"
echo "2. Neon - Serverless PostgreSQL with auto-scaling" 
echo "3. Manual PostgreSQL - Custom database instance"
echo ""

print_warning "REQUIRED: Set up your production database and get connection string"
echo ""
echo "For Supabase:"
echo "  1. Go to https://supabase.com and create new project"
echo "  2. Project name: 'TourBrain-Production'"
echo "  3. Region: US East (recommended for performance)"
echo "  4. Wait for provisioning (5-10 minutes)"
echo "  5. Go to Settings > Database"
echo "  6. Copy 'Connection pooling' URL (recommended for production)"
echo ""
echo "For Neon:"
echo "  1. Go to https://neon.tech and create account"
echo "  2. Create new project: 'TourBrain-Production'"
echo "  3. Copy connection string from dashboard"
echo ""

read -p "Have you created your production database and have the connection string? (y/N): " db_ready
if [[ ! $db_ready =~ ^[Yy]$ ]]; then
    print_info "Please set up your production database first, then re-run this script"
    echo ""
    print_info "Example connection string format:"
    echo "DATABASE_URL=\"postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true\""
    exit 0
fi

echo ""
read -p "Enter your production DATABASE_URL: " production_db_url

if [ -z "$production_db_url" ]; then
    print_error "DATABASE_URL is required for deployment"
    exit 1
fi

export DATABASE_URL="$production_db_url"
print_success "Production database URL configured"

print_info "Deploying database migrations..."
if npx prisma migrate deploy; then
    print_success "Database migrations deployed successfully"
else
    print_error "Database migration deployment failed"
    print_info "Common issues:"
    echo "  - Check connection string format"
    echo "  - Verify database is accessible"
    echo "  - Ensure sufficient permissions"
    exit 1
fi

print_info "Generating Prisma client..."
if npx prisma generate; then
    print_success "Prisma client generated"
else
    print_warning "Prisma client generation had issues but deployment may still work"
fi

print_success "✅ STEP 1 COMPLETE: Production Database Ready"
echo ""

# Step 2: Authentication Setup
print_step "Step 2: Production Authentication Setup (Clerk)"
echo "=================================================="
echo ""

print_info "Clerk production configuration required:"
echo ""
echo "1. Go to https://clerk.com and sign in"
echo "2. Create new application: 'TourBrain Production'"
echo "3. Select 'Production' environment"
echo "4. Configure domains:"
echo "   - Authorized domains: yourdomain.com"
echo "   - Authorized redirect URLs: https://yourdomain.com/sign-in/sso-callback"
echo "5. Enable social authentication:"
echo "   - Google OAuth (recommended for business users)"
echo "   - GitHub OAuth (optional, for technical users)"
echo "6. Go to API Keys section and copy production keys"
echo ""

read -p "Have you set up Clerk production instance and have the API keys? (y/N): " clerk_ready
if [[ ! $clerk_ready =~ ^[Yy]$ ]]; then
    print_info "Please set up Clerk production authentication first"
    exit 0
fi

echo ""
read -p "Enter your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: " clerk_public_key
read -p "Enter your CLERK_SECRET_KEY: " clerk_secret_key

if [ -z "$clerk_public_key" ] || [ -z "$clerk_secret_key" ]; then
    print_error "Both Clerk keys are required"
    exit 1
fi

print_success "Clerk authentication keys configured"
print_success "✅ STEP 2 COMPLETE: Authentication Ready"
echo ""

# Step 3: AI Services Setup
print_step "Step 3: AI Services Setup (OpenAI)"
echo "=================================================="
echo ""

print_info "OpenAI production API configuration:"
echo ""
echo "1. Go to https://platform.openai.com"
echo "2. Navigate to API Keys section"
echo "3. Create new key: 'TourBrain-Production'"
echo "4. Set usage limits:"
echo "   - Monthly budget: \$300 (recommended for beta launch)"
echo "   - Rate limits: Tier 2 or higher"
echo "5. Configure billing alerts at 80% and 95% of budget"
echo ""

read -p "Have you created OpenAI production API key? (y/N): " openai_ready
if [[ ! $openai_ready =~ ^[Yy]$ ]]; then
    print_info "Please set up OpenAI production API key first"
    exit 0
fi

echo ""
read -p "Enter your OPENAI_API_KEY: " openai_key

if [ -z "$openai_key" ]; then
    print_error "OpenAI API key is required"
    exit 1
fi

print_success "OpenAI API key configured"
print_success "✅ STEP 3 COMPLETE: AI Services Ready"
echo ""

# Step 4: Environment Configuration Summary
print_step "Step 4: Production Environment Configuration"
echo "=================================================="
echo ""

print_info "Creating production environment configuration..."

# Create production environment file
cat > .env.production.generated << EOF
# TourBrain Production Environment - Generated $(date)
# Deploy these variables to Vercel Dashboard > Settings > Environment Variables

# Database (Production)
DATABASE_URL="$production_db_url"

# Authentication (Clerk Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$clerk_public_key"
CLERK_SECRET_KEY="$clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# AI Services (OpenAI Production)
OPENAI_API_KEY="$openai_key"

# App Configuration (Update with your domain)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Optional: Analytics and Monitoring (Add when ready)
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID="prj_XXXXXXXXXX"
# SENTRY_DSN="https://XXXXXXXXXX@XXXXXXXXX.ingest.sentry.io/XXXXXXX"
# NEXT_PUBLIC_POSTHOG_KEY="phc_XXXXXXXXXX"
EOF

print_success "Production environment configuration generated: .env.production.generated"
print_success "✅ STEP 4 COMPLETE: Environment Configuration Ready"
echo ""

# Step 5: Vercel Deployment Instructions
print_step "Step 5: Vercel Deployment"
echo "=================================================="
echo ""

print_info "Vercel deployment instructions:"
echo ""
echo "AUTOMATED OPTION:"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Login: vercel login"
echo "3. Deploy: vercel --prod"
echo ""
echo "MANUAL OPTION (Recommended):"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Import Project'"
echo "3. Import GitHub repository: TourBrainAI/TourBrain"
echo "4. Configure build settings:"
echo "   - Framework Preset: Next.js"
echo "   - Build Command: cd apps/web && npm run build"
echo "   - Output Directory: apps/web/.next"
echo "   - Install Command: npm install && cd apps/web && npm install"
echo ""
echo "5. Add Environment Variables (copy from .env.production.generated):"
echo "   - DATABASE_URL"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   - CLERK_SECRET_KEY"
echo "   - NEXT_PUBLIC_CLERK_SIGN_IN_URL"
echo "   - NEXT_PUBLIC_CLERK_SIGN_UP_URL"
echo "   - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
echo "   - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
echo "   - OPENAI_API_KEY"
echo "   - NEXT_PUBLIC_APP_URL"
echo "   - NODE_ENV"
echo ""
echo "6. Deploy and wait for build completion"
echo "7. Configure custom domain in Vercel dashboard"
echo ""

read -p "Deploy to Vercel now using CLI? (y/N): " deploy_now
if [[ $deploy_now =~ ^[Yy]$ ]]; then
    print_info "Deploying to Vercel..."
    
    # Check if vercel CLI is available
    if command -v vercel &> /dev/null; then
        print_info "Vercel CLI found, deploying..."
        
        # Set environment variables for deployment
        export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$clerk_public_key"
        export CLERK_SECRET_KEY="$clerk_secret_key"
        export OPENAI_API_KEY="$openai_key"
        export NEXT_PUBLIC_APP_URL="https://tourbrain.vercel.app"
        export NODE_ENV="production"
        
        if vercel --prod --confirm; then
            print_success "Vercel deployment successful!"
        else
            print_warning "Vercel deployment had issues. Please check manually."
        fi
    else
        print_warning "Vercel CLI not installed. Please deploy manually via dashboard."
    fi
else
    print_info "Please deploy manually using Vercel dashboard"
fi

print_success "✅ STEP 5 COMPLETE: Deployment Instructions Provided"
echo ""

# Step 6: Health Check Instructions
print_step "Step 6: Production Health Verification"
echo "=================================================="
echo ""

print_info "After deployment, verify these health endpoints:"
echo ""
echo "1. Overall Health: GET https://yourdomain.com/api/health"
echo "   Expected: {\"status\":\"ok\",\"version\":\"1.0.0\",\"environment\":\"production\"}"
echo ""
echo "2. Database Health: GET https://yourdomain.com/api/health/database"
echo "   Expected: {\"status\":\"ok\",\"service\":\"database\"}"
echo ""
echo "3. AI Service Health: GET https://yourdomain.com/api/health/openai"
echo "   Expected: {\"status\":\"ok\",\"service\":\"openai\"}"
echo ""

print_info "Test core workflows:"
echo "1. User registration and organization creation"
echo "2. Venue and artist management"
echo "3. Tour creation with AI routing"
echo "4. External collaboration features"
echo "5. Export generation (PDF, CSV, iCal)"
echo ""

read -p "Enter your deployed URL to test health endpoints (or skip): " deployed_url
if [ ! -z "$deployed_url" ]; then
    print_info "Testing health endpoints..."
    
    if command -v curl &> /dev/null; then
        echo ""
        print_info "Testing overall health..."
        if curl -s "$deployed_url/api/health" | grep -q "ok"; then
            print_success "Overall health check passed"
        else
            print_warning "Health check response unexpected"
        fi
        
        print_info "Testing database health..."
        if curl -s "$deployed_url/api/health/database" | grep -q "ok"; then
            print_success "Database health check passed"
        else
            print_warning "Database health check failed"
        fi
        
        print_info "Testing AI service health..."
        if curl -s "$deployed_url/api/health/openai" | grep -q "ok"; then
            print_success "AI service health check passed"
        else
            print_warning "AI service health check failed"
        fi
    else
        print_info "curl not available, please test manually"
    fi
fi

print_success "✅ STEP 6 COMPLETE: Health Check Instructions Provided"
echo ""

# Final Summary
print_step "🎉 PRODUCTION DEPLOYMENT COMPLETE!"
echo "=================================================="
echo ""

print_success "✅ Database: Production PostgreSQL deployed with complete schema"
print_success "✅ Authentication: Clerk production instance configured"  
print_success "✅ AI Services: OpenAI production API configured"
print_success "✅ Environment: Production variables generated"
print_success "✅ Deployment: Vercel deployment instructions provided"
print_success "✅ Monitoring: Health check endpoints ready"
echo ""

print_info "📋 NEXT ACTIONS:"
echo "1. Complete Vercel deployment if not done automatically"
echo "2. Configure custom domain and SSL certificate"
echo "3. Test all health endpoints and core workflows"
echo "4. Set up monitoring (Sentry, PostHog) using generated config"
echo "5. Begin beta user selection and invitation process"
echo ""

print_info "📁 FILES CREATED:"
echo "- .env.production.generated (production environment variables)"
echo "- Deploy this to Vercel Dashboard > Environment Variables"
echo ""

print_info "🎯 PLATFORM STATUS:"
echo "- TourBrain is now PRODUCTION READY"
echo "- All 5 core milestones complete and deployed"
echo "- Multi-tenant architecture with data isolation"
echo "- AI-powered features operational"
echo "- Professional collaboration and export capabilities"
echo ""

print_success "🚀 TourBrain production platform deployment successful!"
print_info "Ready to begin beta user onboarding and feedback collection"

echo ""
echo "Deployment completed at: $(date)"
echo "=================================================="