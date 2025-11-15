#!/bin/bash

echo "🚀 Starting production deployment..."

# Add all changes
echo "📝 Staging changes..."
git add -A

# Commit with descriptive message
echo "💾 Committing changes..."
git commit -m "fix: Remove hardcoded API keys and prepare for production deployment

- Replace hardcoded OpenAI API keys with environment variables in route files
- Update AI_PRODUCTION_GUIDE.md to use placeholder API key format  
- Remove waitlist components from homepage and marketing pages
- Fix Server Component issues in show detail page
- Clean up security issues for GitHub push protection

Ready for UAT deployment to Vercel production."

# Push to main branch
echo "🚀 Pushing to main branch..."
git push origin main

echo "✅ Deployment complete! Check Vercel dashboard for build status."