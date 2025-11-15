#!/bin/bash

echo "🚀 TourBrain Production Setup Automation"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists vercel; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel@latest
fi

if ! command_exists gh; then
    echo -e "${RED}❌ GitHub CLI (gh) not found. Please install: https://cli.github.com/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites satisfied${NC}"
echo ""

# Step 1: Vercel Login and Project Setup
echo -e "${BLUE}🔐 Step 1: Vercel Authentication${NC}"
vercel login

echo ""
echo -e "${BLUE}🏗️  Step 2: Link to Vercel Project${NC}"
echo "This will link your local project to Vercel..."
vercel link

echo ""
echo -e "${BLUE}🌐 Step 3: Configure Custom Domain${NC}"
echo "Adding tourbrain.ai domain to Vercel..."
vercel domains add tourbrain.ai
vercel domains add www.tourbrain.ai

echo ""
echo -e "${BLUE}📋 Step 4: DNS Configuration${NC}"
echo -e "${YELLOW}⚠️  MANUAL STEP REQUIRED:${NC}"
echo "Please configure these DNS records in your domain registrar:"
echo ""
vercel domains inspect tourbrain.ai
echo ""
echo "Press Enter when DNS records are configured..."
read

echo ""
echo -e "${BLUE}🔑 Step 5: Environment Variables${NC}"
echo "Setting up production environment variables..."

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo "Reading from .env.production..."
    
    # Upload environment variables to Vercel
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ ! $key =~ ^#.* ]] && [[ -n $key ]]; then
            # Remove quotes from value
            value=$(echo $value | sed 's/^"//;s/"$//')
            echo "Setting $key..."
            vercel env add $key production <<< "$value"
        fi
    done < .env.production
else
    echo -e "${YELLOW}⚠️  .env.production not found${NC}"
    echo "Please set environment variables manually in Vercel Dashboard:"
    echo "https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
    echo ""
    echo "Required variables:"
    echo "  - DATABASE_URL"
    echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    echo "  - CLERK_SECRET_KEY"
    echo "  - OPENAI_API_KEY"
    echo "  - NEXT_PUBLIC_APP_URL=https://tourbrain.ai"
fi

echo ""
echo -e "${BLUE}🚀 Step 6: Deploy to Production${NC}"
echo "Deploying to production..."
vercel --prod

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📊 Next Steps:${NC}"
echo "1. Verify deployment at: https://tourbrain.ai"
echo "2. Test sign-in: https://tourbrain.ai/sign-in"
echo "3. Monitor logs: vercel logs --follow"
echo "4. Check health: curl https://tourbrain.ai/api/health"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "  vercel logs --follow    - Watch deployment logs"
echo "  vercel domains ls       - List configured domains"
echo "  vercel env ls           - List environment variables"
echo "  vercel inspect          - Get deployment URL"
echo ""
