#!/bin/bash
set -e

echo "🚀 Setting up TourBrain development environment..."

# Start Docker services
echo "📦 Starting PostgreSQL and Redis..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
  if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U tourbrain > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ PostgreSQL failed to start"
    exit 1
  fi
  sleep 1
done

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Push database schema
echo "🗄️  Pushing database schema..."
npm run db:push

echo "✅ Setup complete! Starting development server..."
npm run dev
