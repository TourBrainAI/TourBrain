# Clerk Authentication Setup

Follow these steps to set up Clerk authentication for TourBrain:

## 1. Create Clerk Account

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up for a new account or sign in
3. Create a new application

## 2. Get Your API Keys

1. In your Clerk Dashboard, go to the [API Keys page](https://dashboard.clerk.com/last-active?path=api-keys)
2. Copy your **Publishable Key** and **Secret Key**

## 3. Configure Environment Variables

Create `apps/web/.env.local` with your real keys:

```bash
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key
CLERK_SECRET_KEY=clerk_secret_your_actual_secret_key
```

**Important:**

- Never commit `.env.local` to version control
- Use your actual keys from Clerk Dashboard
- `.env.local` is already in `.gitignore`

## 4. Configure Clerk Dashboard

In your Clerk Dashboard, set these URLs:

### Development URLs:

- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/dashboard`
- **After sign-up URL**: `/onboarding`

### Allowed Origins:

- `http://localhost:3000` (development)
- Your production domain (when deploying)

## 5. Test the Integration

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Demo: View Venues"
4. You should be redirected to sign-in
5. Create an account and complete onboarding
6. You should see the venues page

## Troubleshooting

- **"Missing Clerk Secret Key"**: Make sure `.env.local` exists in `apps/web/` directory
- **Authentication errors**: Check that your keys are correct and not placeholder values
- **Redirect issues**: Verify the URLs in Clerk Dashboard match your app

## Current Status

✅ Clerk middleware configured with `authMiddleware`
✅ `ClerkProvider` wrapping the app
✅ Server-side auth functions using `@clerk/nextjs/server`
✅ Sign-in/sign-up pages created
✅ Organization onboarding flow
✅ Multi-tenant venue management
