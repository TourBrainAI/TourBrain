#!/bin/bash

echo "🔄 Resetting Git history to remove secrets from old commits..."
echo "=============================================================="

# Create a new orphan branch (no history)
git checkout --orphan clean-main

# Add all current files
echo "📝 Adding all current files..."
git add -A

# Commit with a clean slate
echo "💾 Creating clean commit..."
git commit -m "feat: TourBrain v1.0.0 - Complete production-ready platform

Core Features:
- Complete tour operations workflow (artists, tours, shows, venues)
- AI-powered routing and tour design with smart venue matching
- External collaboration with secure sharing and role-based permissions
- Professional exports (PDF day sheets, CSV data, iCal integration)
- Weather intelligence for outdoor venue climate analysis
- AI insights for tour risk analysis and production planning
- Multi-tenant organization system with enterprise security

Ready for production deployment and UAT testing."

# Delete old main branch and rename clean branch
echo "🔄 Replacing main branch with clean history..."
git branch -D main
git branch -m main

# Force push to remote (this will rewrite history)
echo "🚀 Force pushing clean history to GitHub..."
git push origin main --force

echo ""
echo "✅ Git history cleaned and pushed!"
echo "🔍 Check Vercel dashboard for automatic deployment."
