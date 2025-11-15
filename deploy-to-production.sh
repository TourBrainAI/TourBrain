#!/bin/bash

# TourBrain Production Push Script
# Prepares and pushes the application to production for UAT

set -e

echo "🚀 TourBrain Production Deployment"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Step 1: Generate Prisma Client
print_info "Generating Prisma client..."
npx prisma generate || {
    print_error "Prisma client generation failed"
    exit 1
}
print_success "Prisma client generated"

# Step 2: Install dependencies
print_info "Installing dependencies..."
npm install --silent || {
    print_error "Dependency installation failed"
    exit 1
}
print_success "Dependencies installed"

# Step 3: Install web app dependencies
print_info "Installing web app dependencies..."
cd apps/web
npm install --silent || {
    print_error "Web app dependency installation failed"
    exit 1
}
print_success "Web app dependencies installed"

# Step 4: Build application
print_info "Building application for production..."
npm run build || {
    print_error "Build failed - please check for TypeScript errors"
    cd ../..
    exit 1
}
print_success "Application built successfully"
cd ../..

# Step 5: Commit changes
print_info "Committing changes to git..."
git add -A
git commit -m "Production deployment: Remove waitlist, prepare for UAT

- Remove all waitlist components and API endpoints
- Update homepage for direct user registration
- Clean database schema for production
- Ready for User Acceptance Testing (UAT)

Platform Status: Production Ready v1.0.0
Features: Complete tour operations, AI routing, collaboration, exports" || {
    print_warning "No changes to commit or commit failed"
}

# Step 6: Push to main branch
print_info "Pushing to main branch for Vercel deployment..."
git push origin main || {
    print_error "Git push failed"
    exit 1
}
print_success "Code pushed to main branch"

echo ""
print_success "🎉 Production Deployment Complete!"
echo ""
print_info "Vercel will automatically deploy from main branch"
print_info "UAT Environment will be ready at your Vercel domain"
echo ""
print_info "Next Steps:"
echo "1. Verify Vercel deployment completes successfully"  
echo "2. Configure production environment variables:"
echo "   - DATABASE_URL (Supabase/Neon production database)"
echo "   - CLERK_* keys (production authentication)"
echo "   - OPENAI_API_KEY (production AI services)"
echo "3. Run database migrations on production database"
echo "4. Test complete user workflows for UAT"
echo ""
print_info "Health check endpoints:"
echo "- GET /api/health"
echo "- GET /api/health/database"  
echo "- GET /api/health/openai"
echo ""
print_success "TourBrain is production ready! 🚀"