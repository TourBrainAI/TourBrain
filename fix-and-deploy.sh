#!/bin/bash

echo "🔧 Fixing Vercel Build Configuration"
echo "===================================="
echo ""

# Commit the fix
git add vercel.json
git commit -m "fix: Update Vercel build configuration for monorepo

- Simplify build commands to use root package.json scripts
- Remove redundant framework specification
- Fix output directory path

This resolves the 'apps/web: No such file or directory' build error."

# Push to main
git push origin main

echo ""
echo "✅ Fix pushed to GitHub!"
echo ""
echo "🚀 Vercel will automatically redeploy..."
echo "   Monitor at: https://vercel.com/dashboard"
echo ""
echo "Or manually redeploy:"
echo "   vercel --prod"
echo ""
