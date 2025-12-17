#!/bin/bash

# Deployment script for GitHub Pages
# This script builds the website and can be used for local testing

set -e

echo "🚀 Starting deployment process..."

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Error: yarn is not installed"
    echo "Please install yarn: npm install -g yarn"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build the web application
echo "🔨 Building web application..."
GITHUB_PAGES=true yarn build:web

echo "✅ Build completed successfully!"
echo ""
echo "📁 Build output is in: dist-web/"
echo ""
echo "To preview locally, run:"
echo "  yarn serve:web"
echo ""
echo "To deploy to GitHub Pages:"
echo "  1. Push changes to the main branch"
echo "  2. GitHub Actions will automatically deploy"
echo "  3. Visit: https://cloudcompile.github.io/jane/"
