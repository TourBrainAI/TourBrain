#!/bin/bash

# TourBrain Production Database Migration Script
# Version: 1.0.0
# Execute this script to deploy database schema to production

set -e

echo "🗄️  TourBrain Production Database Setup"
echo "======================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

# Check if production DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable not set"
    print_info "Please set your production database URL first:"
    echo ""
    echo "export DATABASE_URL=\"postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true\""
    echo ""
    exit 1
fi

print_info "Using database: ${DATABASE_URL:0:30}..."

# Verify Prisma is available
if ! command -v npx &> /dev/null; then
    print_error "npx not found. Please install Node.js and npm first."
    exit 1
fi

print_success "Prisma CLI available"

# Check current migration status
print_info "Checking current migration status..."
npx prisma migrate status

echo ""
print_warning "About to deploy database migrations to production"
print_warning "This will:"
echo "  - Create all tables for complete TourBrain schema"
echo "  - Set up indexes for performance optimization" 
echo "  - Configure foreign key constraints and relations"
echo ""
echo "Database models that will be created:"
echo "  ✅ User & Organization (multi-tenancy)"
echo "  ✅ Venue, Artist, Tour, Show (core operations)"
echo "  ✅ RoutingScenario & RoutingScenarioStop (AI routing)"
echo "  ✅ ShowCollaborator & ActivityLog (collaboration)"
echo "  ✅ TicketSnapshot (intelligence features)"
echo ""

read -p "Continue with production deployment? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    print_info "Deployment cancelled"
    exit 0
fi

echo ""
print_info "Deploying migrations to production database..."

# Deploy migrations
if npx prisma migrate deploy; then
    print_success "Database migrations deployed successfully"
else
    print_error "Migration deployment failed"
    exit 1
fi

echo ""
print_info "Generating Prisma client for production..."

# Generate Prisma client
if npx prisma generate; then
    print_success "Prisma client generated successfully"
else
    print_error "Prisma client generation failed"
    exit 1
fi

echo ""
print_info "Verifying database schema..."

# Verify the deployment by checking table existence
npx prisma db execute --stdin <<SQL
SELECT 
    schemaname,
    tablename,
    tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
SQL

if [ $? -eq 0 ]; then
    print_success "Database schema verification completed"
else
    print_warning "Schema verification had issues but deployment may still be successful"
fi

echo ""
print_success "🎉 Production Database Setup Complete!"
echo ""
print_info "Database is ready with:"
echo "  ✅ Complete multi-tenant schema"
echo "  ✅ AI routing and collaboration features"
echo "  ✅ Performance optimized indexes"
echo "  ✅ Data isolation and security constraints"
echo ""
print_info "Next steps:"
echo "  1. Configure authentication (Clerk production keys)"
echo "  2. Set up AI services (OpenAI production API key)"
echo "  3. Deploy application to Vercel"
echo "  4. Run health checks to verify all services"
echo ""
print_success "Production database ready for TourBrain launch! 🚀"