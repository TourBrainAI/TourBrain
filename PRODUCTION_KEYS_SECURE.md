# 🔐 TourBrain Production Keys - SECURE REFERENCE

**⚠️ SENSITIVE INFORMATION - DO NOT COMMIT TO GIT**

This file contains the actual production keys for manual setup.
Use these values in Vercel Dashboard only.

---

## 🎯 Vercel Environment Variables

### Database

```
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza191Q1gzajRhSWZWZ0lvZjNzdFJFLWYiLCJhcGlfa2V5IjoiMDFLQTRQWDBRUkVNM1RTSjZOOThRNkZaRkUiLCJ0ZW5hbnRfaWQiOiJiOGQ5YmViNGE5MTNkMDFiMmQ1MWI3YzdjYWUxMDliODc3MWM0MjkwZmRjNjY3ZTQwNjFmYTE5ZTRkYmRhMTQwIiwiaW50ZXJuYWxfc2VjcmV0IjoiMTVhMmVmYzctZGQ3ZC00NTc4LTg0ZWItMjNkMDEwZjIwNTg0In0.vvy4ZaflL9ZWFnQdzdTxb2ZQDAkZ1kgMyhwsNSXTMEs
```

### Clerk Authentication (tourbrain.ai)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsudG91cmJyYWluLmFpJA

CLERK_SECRET_KEY=clerk_secret_[REDACTED_FOR_SECURITY]
```

### OpenAI (Add your production key)

```
OPENAI_API_KEY=sk-proj-[YOUR_PRODUCTION_OPENAI_KEY]
```

---

## 📋 Setup Instructions

1. **Go to Vercel Dashboard:**

   - Project: TourBrain
   - Settings → Environment Variables

2. **Add each variable above**

   - Environment: Production only
   - Copy exact values

3. **Deploy:**
   ```bash
   vercel --prod --force
   ```

## 🗑️ Delete This File After Setup

This file should be deleted once keys are configured in Vercel.
Keep keys secure and never commit to Git.
