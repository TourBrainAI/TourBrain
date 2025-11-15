#!/bin/bash

echo "🔄 TourBrain - Quick Production Redeploy"
echo "======================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel@latest
fi

# Get current git branch
BRANCH=$(git branch --show-current)

echo "📋 Current branch: $BRANCH"
echo ""

if [ "$BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch."
    echo "Production deploys from 'main'. Switch to main? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git checkout main
        git pull origin main
    else
        echo "Continuing on current branch (will create preview deployment)..."
    fi
fi

echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to production if on main, otherwise create preview
if [ "$(git branch --show-current)" = "main" ]; then
    echo "🎯 Deploying to PRODUCTION..."
    vercel --prod
else
    echo "👀 Creating PREVIEW deployment..."
    vercel
fi

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "📊 Monitor deployment:"
echo "  vercel logs --follow"
echo ""
echo "🌐 Visit your site:"
echo "  https://tourbrain.ai"
echo ""
