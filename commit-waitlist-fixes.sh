#!/bin/bash

echo "🔧 Committing waitlist removal fixes..."

git add apps/web/src/app/admin/WaitlistTable.tsx
git add apps/web/src/app/admin/page.tsx
git add apps/web/src/app/api/admin/waitlist/\[id\]/route.ts
git add apps/web/src/app/api/admin/waitlist/export/route.ts

git commit -m "fix: Remove all WaitlistEntry references from admin components and API routes

- Stub out WaitlistTable component (waitlist functionality removed)
- Simplify admin page to remove all database queries
- Stub out waitlist API routes with 410 Gone responses
- Removes all references to deleted WaitlistEntry Prisma model

This fixes the TypeScript build error: Module '@prisma/client' has no exported member 'WaitlistEntry'"

git push origin main

echo ""
echo "✅ Fixes pushed! Vercel will automatically rebuild..."
echo "   Monitor: https://vercel.com/dashboard"
