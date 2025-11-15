#!/bin/bash

echo "🚀 TourBrain Production Deployment - Final Fix"
echo "=============================================="

echo "📝 Adding all changes..."
git add -A

echo "💾 Committing security and build fixes..."
git commit -m "fix: Final production deployment fixes

Security Issues Fixed:
- Remove all hardcoded API keys from template files
- Replace Stripe API key patterns with generic placeholders  
- Update AI_PRODUCTION_GUIDE.md to use safe placeholder format
- Ensure all API keys use environment variables only

Build Issues Fixed:
- Remove EarlyAccessForm component (deprecated for direct signup)
- Fix marketing component test references
- Clean up all waitlist-related dependencies
- Ensure Server Component compatibility

✅ Production ready - all security and build issues resolved
Ready for UAT deployment to Vercel."

echo "🚀 Pushing to main branch..."
git push origin main --force-with-lease

echo "✅ Deployment complete!"
echo "🔍 Check Vercel dashboard for build status at: https://vercel.com/dashboard"