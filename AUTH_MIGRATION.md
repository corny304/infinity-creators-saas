# 🔐 Authentication Migration Guide

## Current State

This application currently uses **Manus OAuth** for authentication, which only works on the Manus platform. To deploy on Railway/Vercel, you need to replace the authentication system.

---

## Authentication Options for Railway/Vercel

### Option 1: Clerk (Recommended) ⭐

**Pros:**
- Drop-in replacement for Manus OAuth
- Beautiful pre-built UI components
- Free tier (10,000 MAU)
- Social logins (Google, GitHub, etc.)
- Email/password auth
- Magic links
- React components included

**Setup:**
1. Sign up at [Clerk.com](https://clerk.com)
2. Install: `pnpm add @clerk/clerk-react @clerk/backend`
3. Replace `server/_core/oauth.ts` with Clerk middleware
4. Replace OAuth routes with Clerk components
5. Update frontend to use `<ClerkProvider>`

**Migration Effort:** ~2-4 hours

---

### Option 2: Auth0

**Pros:**
- Enterprise-grade
- Extensive documentation
- Many integrations
- Customizable

**Cons:**
- More complex setup
- Paid plan required for production

**Migration Effort:** ~3-5 hours

---

### Option 3: Custom JWT Authentication

**Pros:**
- Full control
- No third-party dependency
- Simple email/password auth

**Cons:**
- No social logins out of the box
- Need to build UI
- Manual email verification
- Security considerations

**Migration Effort:** ~6-8 hours

---

### Option 4: NextAuth.js / Auth.js

**Pros:**
- Open source
- Many providers (Google, GitHub, Email, etc.)
- Self-hosted or cloud
- Active community

**Cons:**
- Requires Next.js or adaptation for Express
- Some configuration complexity

**Migration Effort:** ~4-6 hours

---

## Recommended: Clerk Migration

### Step 1: Install Clerk

```bash
pnpm add @clerk/clerk-react @clerk/backend
```

### Step 2: Replace OAuth Routes

**Before** (`server/_core/oauth.ts`):
```typescript
import { sdk } from "./sdk"; // Manus SDK
```

**After**:
```typescript
import { clerkClient, requireAuth } from "@clerk/backend";
```

### Step 3: Update Frontend

**Before** (`client/src/App.tsx`):
```typescript
// No auth provider needed (Manus handles it)
```

**After**:
```typescript
import { ClerkProvider } from '@clerk/clerk-react';

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      {/* Your app */}
    </ClerkProvider>
  );
}
```

### Step 4: Update tRPC Context

**Before** (`server/_core/context.ts`):
```typescript
const sessionToken = req.cookies[COOKIE_NAME];
const user = await sdk.verifySessionToken(sessionToken);
```

**After**:
```typescript
import { getAuth } from '@clerk/backend';

const auth = getAuth(req);
const user = auth.userId ? await clerkClient.users.getUser(auth.userId) : null;
```

### Step 5: Update Database Schema

**Before**:
```typescript
openId: text("open_id").notNull().unique(), // Manus OpenID
```

**After**:
```typescript
clerkUserId: text("clerk_user_id").notNull().unique(), // Clerk User ID
```

**Migration SQL**:
```sql
ALTER TABLE users ADD COLUMN clerk_user_id VARCHAR(255);
-- Migrate existing users manually or via script
```

### Step 6: Environment Variables

**Remove** (Manus-specific):
```bash
OAUTH_SERVER_URL
VITE_OAUTH_PORTAL_URL
VITE_APP_ID
OWNER_OPEN_ID
```

**Add** (Clerk):
```bash
CLERK_SECRET_KEY="sk_test_..."
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

---

## Quick Migration Checklist

### Code Changes

- [ ] Install Clerk packages
- [ ] Replace `server/_core/oauth.ts` with Clerk auth
- [ ] Update `server/_core/context.ts` to use Clerk
- [ ] Update `server/_core/trpc.ts` middleware
- [ ] Wrap frontend with `<ClerkProvider>`
- [ ] Replace login UI with Clerk components
- [ ] Update database schema (add `clerk_user_id`)

### Configuration

- [ ] Create Clerk application
- [ ] Configure allowed redirect URLs
- [ ] Enable email/password provider
- [ ] Enable Google OAuth (optional)
- [ ] Add Clerk environment variables
- [ ] Remove Manus environment variables

### Testing

- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test logout
- [ ] Test protected routes
- [ ] Test referral code tracking
- [ ] Test credit system with new user IDs

---

## Alternative: Keep Manus OAuth (Not Recommended)

If you want to keep using Manus OAuth on Railway/Vercel:

1. Keep the Manus SDK
2. Configure OAuth redirect URLs to point to Railway/Vercel
3. Ensure `OAUTH_SERVER_URL` and `VITE_OAUTH_PORTAL_URL` are accessible
4. **Downside**: Users must have Manus accounts to use your app

**This is NOT recommended** as it ties your app to Manus infrastructure.

---

## Cost Comparison

| Provider | Free Tier | Paid Plan |
|----------|-----------|-----------|
| Clerk | 10,000 MAU | $25/month (unlimited) |
| Auth0 | 7,000 MAU | $35/month |
| Custom JWT | Free | Free (hosting costs) |
| NextAuth | Free | Free (hosting costs) |

---

## Need Help?

For Clerk migration assistance, see:
- [Clerk Docs](https://clerk.com/docs)
- [Clerk + Express Guide](https://clerk.com/docs/backend-requests/handling/nodejs)
- [Clerk + React Guide](https://clerk.com/docs/quickstarts/react)

---

**Recommendation**: Use Clerk for fastest migration with least code changes.

**Estimated Timeline**:
- Setup: 30 minutes
- Code migration: 2-3 hours
- Testing: 1 hour
- **Total**: ~4 hours

