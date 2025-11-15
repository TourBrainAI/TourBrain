#!/bin/bash

echo "🔐 GitHub Secrets Configuration for Vercel"
echo "=========================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found."
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Authenticate with GitHub
echo "📋 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub..."
    gh auth login
fi

echo ""
echo "🔑 Setting up GitHub Secrets for automated deployment..."
echo ""

# Get Vercel Token
echo "📝 You need your Vercel Token:"
echo "   1. Go to https://vercel.com/account/tokens"
echo "   2. Create a new token named 'GitHub Actions'"
echo "   3. Copy the token"
echo ""
echo "Enter your Vercel Token:"
read -s VERCEL_TOKEN

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Token cannot be empty"
    exit 1
fi

# Set GitHub Secret
echo ""
echo "🔄 Adding VERCEL_TOKEN to GitHub secrets..."
echo "$VERCEL_TOKEN" | gh secret set VERCEL_TOKEN

echo ""
echo "✅ GitHub secret configured!"
echo ""
echo "🚀 Automated deployment is now set up!"
echo ""
echo "📋 How it works:"
echo "  1. Push to 'main' branch"
echo "  2. GitHub Actions automatically builds and deploys to Vercel"
echo "  3. Production site updates at https://tourbrain.ai"
echo ""
echo "🔍 Monitor deployments:"
echo "  - GitHub: https://github.com/TourBrainAI/TourBrain/actions"
echo "  - Vercel: https://vercel.com/dashboard"
echo ""
