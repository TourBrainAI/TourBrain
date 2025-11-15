#!/bin/bash
set -e

# 🚀 TourBrain Production Deployment Executor
# Version: 1.0.0
# Generated: November 15, 2025
# Purpose: Interactive production deployment with real-time guidance

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="TourBrain"
VERSION="1.0.0"
ENVIRONMENT="production"

echo -e "${PURPLE}======================================${NC}"
echo -e "${PURPLE}🚀 TourBrain Production Deployment${NC}"
echo -e "${PURPLE}======================================${NC}"
echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Date: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo ""

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

# Function to show warnings
warn() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARNING: $1${NC}"
}

# Function to show errors
error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ERROR: $1${NC}"
}

# Function to show info
info() {
    echo -e "${CYAN}[$(date '+%H:%M:%S')] INFO: $1${NC}"
}

# Function to wait for user confirmation
confirm() {
    while true; do
        read -p "Continue? (y/n): " yn
        case $yn in
            [Yy]* ) break;;
            [Nn]* ) echo "Deployment cancelled."; exit 1;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check required commands
    local commands=("node" "npm" "git" "curl")
    for cmd in "${commands[@]}"; do
        if ! command -v $cmd &> /dev/null; then
            error "$cmd is required but not installed"
            exit 1
        fi
    done
    
    # Check Node.js version
    local node_version=$(node --version | cut -d 'v' -f 2)
    local major_version=$(echo $node_version | cut -d '.' -f 1)
    
    if [ "$major_version" -lt 18 ]; then
        error "Node.js version 18+ required. Current: v$node_version"
        exit 1
    fi
    
    log "✓ All prerequisites satisfied"
    log "  - Node.js: v$node_version"
    log "  - npm: $(npm --version)"
    log "  - git: $(git --version | head -n1)"
}

# Phase 1: Project Setup and Dependencies
phase_1_setup() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  PHASE 1: Project Setup & Dependencies${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    log "Installing production dependencies..."
    
    # Root dependencies
    if [ -f "package.json" ]; then
        npm install --production=false
        log "✓ Root dependencies installed"
    fi
    
    # Web app dependencies
    if [ -f "apps/web/package.json" ]; then
        cd apps/web
        npm install --production=false
        cd ../..
        log "✓ Web app dependencies installed"
    fi
    
    # Build the application
    log "Building production application..."
    cd apps/web
    npm run build
    cd ../..
    
    log "✓ Phase 1 Complete: Project setup and build successful"
}

# Phase 2: Environment Configuration Guidance
phase_2_environment() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  PHASE 2: Environment Configuration${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    info "This phase requires manual configuration in external services."
    echo ""
    
    # Database Setup
    echo -e "${CYAN}📊 DATABASE SETUP${NC}"
    echo "1. Go to: https://supabase.com/dashboard"
    echo "2. Create new project: 'TourBrain-Production'"
    echo "3. Navigate to Settings > Database"
    echo "4. Copy the connection pooling URL (starts with postgresql://)"
    echo ""
    
    # Authentication Setup
    echo -e "${CYAN}🔐 AUTHENTICATION SETUP${NC}"
    echo "1. Go to: https://clerk.com/dashboard"
    echo "2. Create production instance: 'TourBrain Production'"
    echo "3. Configure OAuth providers (Google, GitHub)"
    echo "4. Copy production API keys (pk_live_... and clerk_secret_...)"
    echo ""
    
    # AI Services Setup
    echo -e "${CYAN}🤖 AI SERVICES SETUP${NC}"
    echo "1. Go to: https://platform.openai.com/api-keys"
    echo "2. Create new API key: 'TourBrain-Production'"
    echo "3. Set usage limit: \$300/month"
    echo "4. Copy the API key (sk-proj-...)"
    echo ""
    
    warn "Keep all credentials secure and never commit them to git!"
    echo ""
    
    log "✓ Phase 2 Complete: Environment configuration guidance provided"
}

# Phase 3: Vercel Deployment Guidance
phase_3_vercel() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  PHASE 3: Vercel Deployment${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    info "Follow these steps to deploy to Vercel:"
    echo ""
    
    echo -e "${CYAN}🌐 VERCEL DEPLOYMENT STEPS${NC}"
    echo "1. Go to: https://vercel.com/dashboard"
    echo "2. Click 'Import Project'"
    echo "3. Connect your GitHub repository"
    echo "4. Use these build settings:"
    echo "   - Framework: Next.js"
    echo "   - Build Command: cd apps/web && npm run build"
    echo "   - Output Directory: apps/web/.next"
    echo "   - Install Command: npm install && cd apps/web && npm install"
    echo ""
    
    echo -e "${CYAN}🔧 ENVIRONMENT VARIABLES${NC}"
    echo "Add these to Vercel Dashboard > Settings > Environment Variables:"
    echo ""
    echo "REQUIRED VARIABLES:"
    echo "- DATABASE_URL (from Supabase)"
    echo "- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from Clerk)"
    echo "- CLERK_SECRET_KEY (from Clerk)" 
    echo "- OPENAI_API_KEY (from OpenAI)"
    echo "- NEXT_PUBLIC_APP_URL (your domain)"
    echo "- NODE_ENV=production"
    echo ""
    
    echo -e "${CYAN}📋 AUTHENTICATION FLOW VARIABLES${NC}"
    echo "- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in"
    echo "- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up"
    echo "- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard"
    echo "- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding"
    echo ""
    
    warn "Double-check all environment variables before deploying!"
    echo ""
    
    log "✓ Phase 3 Complete: Vercel deployment guidance provided"
}

# Phase 4: Database Migration
phase_4_database() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  PHASE 4: Database Migration${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    info "Database migration steps:"
    echo ""
    
    echo "After Vercel deployment with DATABASE_URL configured:"
    echo ""
    echo "1. Run database migration:"
    echo "   npm run db:migrate:prod"
    echo ""
    echo "2. Verify migration success:"
    echo "   npm run db:studio"
    echo ""
    echo "3. Check that all tables are created:"
    echo "   - User, Organization, Venue, Artist, Tour, Show"
    echo "   - ShowCollaborator, ActivityLog (Milestone 5)"
    echo "   - WeatherIntelligence, SharedAccess"
    echo ""
    
    warn "Backup your database before running migrations in production!"
    echo ""
    
    log "✓ Phase 4 Complete: Database migration guidance provided"
}

# Phase 5: Health Verification
phase_5_verification() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  PHASE 5: Health Verification${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    info "After deployment, verify these endpoints:"
    echo ""
    
    echo -e "${CYAN}🏥 HEALTH CHECK ENDPOINTS${NC}"
    echo "Replace 'your-domain.com' with your actual domain:"
    echo ""
    echo "1. Overall health:"
    echo "   curl https://your-domain.com/api/health"
    echo "   Expected: {\"status\":\"ok\",\"version\":\"1.0.0\",\"environment\":\"production\"}"
    echo ""
    echo "2. Database connection:"
    echo "   curl https://your-domain.com/api/health/database"
    echo "   Expected: {\"status\":\"ok\",\"service\":\"database\"}"
    echo ""
    echo "3. AI service integration:"
    echo "   curl https://your-domain.com/api/health/openai"
    echo "   Expected: {\"status\":\"ok\",\"service\":\"openai\",\"model\":\"gpt-4\"}"
    echo ""
    
    echo -e "${CYAN}🧪 FUNCTIONAL TESTING${NC}"
    echo "Test these core workflows:"
    echo "1. User registration and login"
    echo "2. Organization creation"
    echo "3. Venue and artist management"
    echo "4. Tour and show creation"
    echo "5. AI routing generation"
    echo "6. Collaboration features"
    echo "7. Export functionality (PDF, CSV, iCal)"
    echo ""
    
    log "✓ Phase 5 Complete: Health verification guidance provided"
}

# Phase 6: Beta Launch Preparation
phase_6_beta() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  PHASE 6: Beta Launch Preparation${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    info "Beta launch checklist:"
    echo ""
    
    echo -e "${CYAN}👥 BETA USER MANAGEMENT${NC}"
    echo "1. Set up customer support email: support@tourbrain.ai"
    echo "2. Create beta user selection process (see BETA_USER_SELECTION.md)"
    echo "3. Prepare onboarding documentation"
    echo "4. Set up feedback collection system"
    echo ""
    
    echo -e "${CYAN}📊 MONITORING & ANALYTICS${NC}"
    echo "1. Configure Vercel Analytics (automatic with Vercel Pro)"
    echo "2. Set up Sentry for error tracking (optional)"
    echo "3. Monitor usage patterns and performance"
    echo "4. Track feature adoption and user feedback"
    echo ""
    
    echo -e "${CYAN}🚀 GO-LIVE CHECKLIST${NC}"
    echo "✓ All health endpoints returning 200"
    echo "✓ Authentication flows working"
    echo "✓ AI features operational"
    echo "✓ Exports generating correctly"
    echo "✓ Multi-tenant data isolation verified"
    echo "✓ Customer support ready"
    echo ""
    
    log "✓ Phase 6 Complete: Beta launch preparation guidance provided"
}

# Final deployment summary
deployment_summary() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  🎉 DEPLOYMENT COMPLETE!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    echo -e "${CYAN}📋 DEPLOYMENT SUMMARY${NC}"
    echo "✓ Project built and prepared for production"
    echo "✓ All configuration guidance provided"
    echo "✓ Deployment instructions documented"
    echo "✓ Health verification endpoints listed"
    echo "✓ Beta launch preparation completed"
    echo ""
    
    echo -e "${CYAN}🔗 NEXT STEPS${NC}"
    echo "1. Complete external service configuration"
    echo "2. Deploy to Vercel using provided instructions"
    echo "3. Run database migrations"
    echo "4. Verify health endpoints"
    echo "5. Begin beta user onboarding"
    echo ""
    
    echo -e "${CYAN}📚 REFERENCE DOCUMENTS${NC}"
    echo "- PRODUCTION_ENV_CONFIG.md: Environment variables and configuration"
    echo "- DEPLOYMENT_CHECKLIST.md: Step-by-step deployment verification"
    echo "- BETA_USER_SELECTION.md: Beta user management guidance"
    echo "- BUSINESS_OPERATIONS.md: Customer support and operations"
    echo ""
    
    log "TourBrain v${VERSION} is ready for production deployment!"
    log "Platform includes all 5 milestones with professional-grade features"
    log "Beta launch can begin immediately after deployment verification"
}

# Main deployment flow
main() {
    # Check prerequisites
    check_prerequisites
    echo ""
    
    # Show deployment overview
    echo -e "${BLUE}📋 DEPLOYMENT OVERVIEW${NC}"
    echo "This script will guide you through deploying TourBrain to production."
    echo "Total estimated time: 2-4 hours (including external service setup)"
    echo ""
    echo "Phases:"
    echo "1. Project Setup & Dependencies (10 minutes)"
    echo "2. Environment Configuration (30 minutes)" 
    echo "3. Vercel Deployment (20 minutes)"
    echo "4. Database Migration (15 minutes)"
    echo "5. Health Verification (15 minutes)"
    echo "6. Beta Launch Preparation (30 minutes)"
    echo ""
    
    warn "Ensure you have admin access to all required services before proceeding"
    echo ""
    confirm
    
    # Execute deployment phases
    phase_1_setup
    echo ""
    confirm
    
    phase_2_environment
    echo ""
    confirm
    
    phase_3_vercel
    echo ""
    confirm
    
    phase_4_database
    echo ""
    confirm
    
    phase_5_verification
    echo ""
    confirm
    
    phase_6_beta
    echo ""
    
    # Show final summary
    deployment_summary
}

# Execute main function
main "$@"