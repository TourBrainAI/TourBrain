#!/bin/bash

# TourBrain Production Deployment Setup Script
# Version: 1.0.0
# Status: Production Ready

set -e

echo "🚀 TourBrain Production Deployment Setup"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
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

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm first."
    exit 1
fi

if ! command -v npx &> /dev/null; then
    print_error "npx not found. Please install npx first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ required. Current version: $(node --version)"
    exit 1
fi

print_success "Prerequisites check passed"
echo ""

# Environment selection
echo "Select deployment environment:"
echo "1) Development (local)"
echo "2) Staging"
echo "3) Production"
read -p "Enter choice (1-3): " env_choice

case $env_choice in
    1)
        ENV_TYPE="development"
        ENV_FILE=".env.local"
        ;;
    2)
        ENV_TYPE="staging"
        ENV_FILE=".env.staging"
        ;;
    3)
        ENV_TYPE="production"
        ENV_FILE=".env.production"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

print_info "Selected environment: $ENV_TYPE"
echo ""

# Environment variables setup
echo "🔧 Environment Configuration"
echo "============================"

if [ ! -f "$ENV_FILE" ]; then
    print_warning "Environment file $ENV_FILE not found. Creating from template..."
    
    # Create environment file based on type
    case $ENV_TYPE in
        "development")
            cat > $ENV_FILE << EOF
# TourBrain Development Environment
# Database
DATABASE_URL="postgresql://tourbrain:tourbrain_dev@localhost:5432/tourbrain"

# Redis (optional for development)
REDIS_URL="redis://localhost:6379"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="sk_test_YOUR_SECRET_KEY"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# AI Services
OPENAI_API_KEY="sk-proj-YOUR_OPENAI_API_KEY"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF
            ;;
        "staging"|"production")
            cat > $ENV_FILE << EOF
# TourBrain $ENV_TYPE Environment
# Database (Supabase/Neon)
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require"

# Redis (Upstash)
REDIS_URL="rediss://:PASSWORD@HOST:6380"

# Authentication (Clerk Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_YOUR_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="sk_live_YOUR_SECRET_KEY"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# AI Services (Production)
OPENAI_API_KEY="sk-proj-YOUR_PRODUCTION_API_KEY"

# App Configuration
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Optional: Analytics and Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="YOUR_ANALYTICS_ID"
SENTRY_DSN="YOUR_SENTRY_DSN"
EOF
            ;;
    esac
    
    print_warning "Please update $ENV_FILE with your actual API keys and configuration"
    print_info "Opening $ENV_FILE for editing..."
    
    # Try to open in available editors
    if command -v code &> /dev/null; then
        code $ENV_FILE
    elif command -v nano &> /dev/null; then
        nano $ENV_FILE
    elif command -v vim &> /dev/null; then
        vim $ENV_FILE
    else
        print_info "Please manually edit $ENV_FILE with your configuration"
    fi
    
    read -p "Press Enter after updating the environment file..."
else
    print_success "Environment file $ENV_FILE found"
fi

echo ""

# Dependencies installation
echo "📦 Installing Dependencies"
echo "=========================="

print_info "Installing root dependencies..."
npm install

print_info "Installing web app dependencies..."
cd apps/web
npm install
cd ../..

print_success "Dependencies installed"
echo ""

# Database setup
echo "🗄️  Database Setup"
echo "=================="

if [ "$ENV_TYPE" = "development" ]; then
    print_info "Starting development database with Docker..."
    
    if command -v docker &> /dev/null; then
        if [ -f "docker-compose.dev.yml" ]; then
            docker-compose -f docker-compose.dev.yml up -d
            print_success "Development database started"
            
            # Wait for database to be ready
            print_info "Waiting for database to be ready..."
            sleep 10
        else
            print_warning "docker-compose.dev.yml not found. Please start your database manually."
        fi
    else
        print_warning "Docker not found. Please start your database manually."
    fi
fi

print_info "Running database migrations..."
npx prisma migrate deploy

print_info "Generating Prisma client..."
npx prisma generate

print_success "Database setup complete"
echo ""

# Build verification
echo "🔨 Build Verification"
echo "===================="

print_info "Building application..."
cd apps/web

if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed. Please check for errors above."
    exit 1
fi

cd ../..
echo ""

# Health checks
echo "🏥 Health Checks"
echo "================"

if [ "$ENV_TYPE" = "development" ]; then
    print_info "Starting development server for health checks..."
    
    cd apps/web
    npm run dev &
    DEV_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Check if server is responding
    if curl -s http://localhost:3000/api/health > /dev/null; then
        print_success "Health check passed"
    else
        print_warning "Health check failed - server may need more time to start"
    fi
    
    # Kill development server
    kill $DEV_PID 2>/dev/null || true
    cd ../..
fi

echo ""

# Summary
echo "📋 Deployment Summary"
echo "===================="
print_success "Environment: $ENV_TYPE"
print_success "Dependencies: Installed"
print_success "Database: Configured and migrated"
print_success "Build: Successful"

if [ "$ENV_TYPE" = "development" ]; then
    echo ""
    print_info "🚀 Ready for Development!"
    echo ""
    echo "To start developing:"
    echo "  cd apps/web"
    echo "  npm run dev"
    echo ""
    echo "Then visit: http://localhost:3000"
    
elif [ "$ENV_TYPE" = "staging" ] || [ "$ENV_TYPE" = "production" ]; then
    echo ""
    print_info "🚀 Ready for $ENV_TYPE Deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Vercel:"
    echo "   - Connect GitHub repository"
    echo "   - Add environment variables from $ENV_FILE"
    echo "   - Configure build settings"
    echo ""
    echo "2. Verify deployment:"
    echo "   - Test all core workflows"
    echo "   - Run health checks"
    echo "   - Monitor performance"
    echo ""
    if [ "$ENV_TYPE" = "production" ]; then
        echo "3. Launch preparation:"
        echo "   - Set up monitoring and alerts"
        echo "   - Configure customer support"
        echo "   - Prepare beta user invitations"
    fi
fi

echo ""
print_success "TourBrain deployment setup complete! 🎉"