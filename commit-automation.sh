#!/bin/bash

echo "🚀 Committing and Pushing Deployment Automation"
echo "=============================================="
echo ""

# Make scripts executable
chmod +x setup-vercel-production.sh
chmod +x deploy-vercel.sh
chmod +x setup-github-secrets.sh

# Add all new files
git add .github/workflows/vercel-production.yml
git add setup-vercel-production.sh
git add deploy-vercel.sh
git add setup-github-secrets.sh
git add VERCEL_DEPLOYMENT.md

# Commit
git commit -m "feat: Add automated Vercel production deployment

- GitHub Actions workflow for automatic deployment on push to main
- Setup script for Vercel project and domain configuration
- Quick deploy script for manual deployments
- GitHub secrets configuration for CI/CD
- Comprehensive deployment documentation

Enables fully automated deployment pipeline to tourbrain.ai"

# Push
git push origin main

echo ""
echo "✅ Automation scripts pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Run: ./setup-vercel-production.sh"
echo "2. Configure DNS records (script will show you what to add)"
echo "3. Run: ./setup-github-secrets.sh (for auto-deploy on push)"
echo ""
echo "📖 Full guide: See VERCEL_DEPLOYMENT.md"
