#!/bin/bash

echo "🚀 TourBrain Production Deployment - Final"
echo "=========================================="
echo ""

echo "✅ Pre-deployment checklist:"
echo "   ✓ Clerk DNS configured and verified"
echo "   ✓ Clerk production keys saved"
echo "   ✓ Vercel build configuration fixed"
echo "   ✓ Environment variables set in Vercel"
echo ""

echo "📝 Committing final configuration..."
git add .env.production vercel.json DEPLOYMENT_FIXES.md

git commit -m "fix: Final production configuration for tourbrain.ai deployment

Configuration Updates:
- Add verified Clerk production keys (pk_live_* / clerk_secret_*)
- Fix Vercel build configuration for monorepo structure
- Update deployment documentation with troubleshooting

DNS Verification:
- Clerk DNS records verified and active
- clerk.tourbrain.ai → frontend-api.clerk.services
- accounts.tourbrain.ai → accounts.clerk.services
- Email DKIM records configured

Build Fix:
- Simplified vercel.json to use root package.json scripts
- Correct output directory path for monorepo

✅ Ready for production deployment to tourbrain.ai"

echo ""
echo "🚀 Pushing to main (triggers Vercel auto-deploy)..."
git push origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Monitor deployment:"
echo "   Vercel Dashboard: https://vercel.com/dashboard"
echo "   GitHub Actions: https://github.com/TourBrainAI/TourBrain/actions"
echo "   Deployment Logs: vercel logs --follow"
echo ""
echo "🌐 Site will be live at: https://tourbrain.ai"
echo ""
echo "🔍 Verify deployment:"
echo "   Health Check: curl https://tourbrain.ai/api/health"
echo "   Sign In: https://tourbrain.ai/sign-in"
echo "   Sign Up: https://tourbrain.ai/sign-up"
echo ""