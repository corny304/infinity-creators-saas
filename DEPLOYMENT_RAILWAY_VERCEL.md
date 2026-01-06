# 🚀 Deployment Guide - Railway & Vercel

Comprehensive guide for deploying Infinity Creators SaaS on **Railway** (Backend + Database) and **Vercel** (Full-Stack or Frontend only).

---

## 📋 Table of Contents

1. [Deployment Options](#deployment-options)
2. [Prerequisites](#prerequisites)
3. [Option 1: Deploy Full-Stack to Railway](#option-1-deploy-full-stack-to-railway)
4. [Option 2: Deploy Full-Stack to Vercel](#option-2-deploy-full-stack-to-vercel)
5. [Option 3: Hybrid - Frontend (Vercel) + Backend (Railway)](#option-3-hybrid-deployment)
6. [Database Setup](#database-setup)
7. [Environment Variables](#environment-variables)
8. [Stripe Configuration](#stripe-configuration)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Deployment Options

### Recommended Approach

**🔥 Option 1: Full-Stack on Railway** ✅ Easiest
- Backend (Express + tRPC)
- Frontend (React)
- MySQL Database (PostgreSQL also supported)
- **Pros**: Single deployment, easy configuration, automatic HTTPS
- **Cons**: Slightly more expensive than Vercel

**Option 2: Full-Stack on Vercel**
- Backend as Vercel Serverless Functions
- Frontend (React)
- External Database (PlanetScale, Railway MySQL, or Supabase)
- **Pros**: Free tier, global CDN, excellent DX
- **Cons**: Cold starts for serverless functions

**Option 3: Hybrid** (Advanced)
- Frontend on Vercel (Global CDN)
- Backend on Railway (Always-on, faster DB connections)
- **Pros**: Best of both worlds
- **Cons**: More complex setup, CORS configuration needed

---

## Prerequisites

Before deploying, ensure you have:

- ✅ **GitHub Account** (for connecting to Railway/Vercel)
- ✅ **MySQL Database** (or PostgreSQL for Railway)
- ✅ **Stripe Account** (for payments)
- ✅ **Google Gemini API Key** (for AI script generation)
- ✅ **SendGrid Account** (for email notifications)
- ✅ **Node.js 22.x** locally for testing

---

## Option 1: Deploy Full-Stack to Railway

### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify email

### Step 2: Create New Project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Connect your GitHub account
4. Select your repository: `infinity-creators-saas`
5. Railway will auto-detect the project

### Step 3: Add MySQL Database

1. In your Railway project, click **New** → **Database** → **Add MySQL**
2. Wait for database to provision (1-2 minutes)
3. Click on MySQL service → **Variables** tab
4. Copy `DATABASE_URL` (formatted as: `mysql://user:pass@host:port/db`)

### Step 4: Configure Environment Variables

1. Click on your app service (not database)
2. Go to **Variables** tab
3. Click **Raw Editor**
4. Paste all variables from `.env.example` and fill in values:

```bash
# Database (Auto-provided by Railway MySQL service)
DATABASE_URL=${{MySQL.DATABASE_URL}}

# Authentication & Security
JWT_SECRET="generate_a_random_32_char_secret"

# AI Generation
GEMINI_API_KEY="your_gemini_api_key"

# Stripe (Test Mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_AGENCY="price_..."
STRIPE_PRICE_CREDITS_10="price_..."
STRIPE_PRICE_CREDITS_50="price_..."
STRIPE_PRICE_CREDITS_100="price_..."

# Email
SENDGRID_API_KEY="SG...."
FROM_EMAIL="info.infinitycreators@gmail.com"

# Port (Railway auto-sets PORT)
PORT=${{PORT}}
NODE_ENV="production"
```

### Step 5: Deploy

1. Click **Deploy** button
2. Railway will:
   - Install dependencies (`pnpm install`)
   - Build the project (`pnpm build`)
   - Start the server (`pnpm start`)
3. Wait 3-5 minutes for deployment
4. Your app will be live at: `https://your-app.railway.app`

### Step 6: Run Database Migrations

1. In Railway dashboard, click your app service
2. Go to **Settings** → **Deploy Triggers**
3. Add a **Start Command**:
   ```bash
   pnpm db:push && node scripts/seed-of-templates.mjs && pnpm start
   ```
   ⚠️ **OR** run migrations manually via Railway CLI:
   ```bash
   railway run pnpm db:push
   railway run node scripts/seed-of-templates.mjs
   ```

### Step 7: Configure Custom Domain (Optional)

1. Go to **Settings** → **Networking** → **Public Networking**
2. Click **Generate Domain** (gets you a `railway.app` subdomain)
3. Or add custom domain:
   - Click **Custom Domain**
   - Enter your domain (e.g., `infinitycreators.com`)
   - Add CNAME record to your DNS:
     ```
     Type: CNAME
     Name: @ (or www)
     Value: [provided by Railway]
     ```

---

## Option 2: Deploy Full-Stack to Vercel

### Step 1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Verify email

### Step 2: Import Project

1. Click **Add New** → **Project**
2. Import your GitHub repository: `infinity-creators-saas`
3. Vercel auto-detects framework (Vite)

### Step 3: Configure Build Settings

1. **Framework Preset**: Vite
2. **Build Command**: `pnpm vercel-build`
3. **Output Directory**: `dist/public`
4. **Install Command**: `pnpm install`

### Step 4: Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.example`:

```bash
DATABASE_URL="mysql://..."  # Use PlanetScale, Railway, or Supabase
JWT_SECRET="..."
GEMINI_API_KEY="..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_AGENCY="price_..."
STRIPE_PRICE_CREDITS_10="price_..."
STRIPE_PRICE_CREDITS_50="price_..."
STRIPE_PRICE_CREDITS_100="price_..."
SENDGRID_API_KEY="SG...."
FROM_EMAIL="info@infinitycreators.com"
NODE_ENV="production"
```

### Step 5: Deploy

1. Click **Deploy**
2. Vercel will build and deploy (2-3 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

### Step 6: Configure Serverless Functions

Vercel will automatically convert your Express app to serverless functions using `vercel.json` configuration.

**Important**: Backend runs as serverless functions with cold starts (~500ms first request).

### Step 7: Run Database Migrations

Run migrations locally or from Vercel CLI:

```bash
vercel env pull .env.local
pnpm db:push
node scripts/seed-of-templates.mjs
```

---

## Option 3: Hybrid Deployment

### Architecture

- **Frontend (React)**: Deployed to Vercel (Global CDN, instant caching)
- **Backend (Express + tRPC)**: Deployed to Railway (Always-on, persistent connections)
- **Database**: Railway MySQL

### Setup

#### 1. Deploy Backend to Railway

Follow **Option 1** above, but:
- Only deploy backend code
- Disable frontend build in Railway

#### 2. Deploy Frontend to Vercel

1. Update `client/src/lib/trpc.ts` to point to Railway backend:
   ```typescript
   const API_URL = process.env.VITE_API_URL || 'https://your-backend.railway.app';
   ```

2. Add environment variable in Vercel:
   ```bash
   VITE_API_URL="https://your-backend.railway.app"
   ```

3. Deploy to Vercel following **Option 2**

#### 3. Configure CORS

Update `server/_core/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app',
    'https://infinitycreators.com' // your custom domain
  ],
  credentials: true
}));
```

Redeploy backend to Railway.

---

## Database Setup

### Railway MySQL (Recommended for Railway deployment)

1. Already configured if following Option 1
2. Database URL auto-provided: `${{MySQL.DATABASE_URL}}`
3. Automatic backups every 24 hours

### PlanetScale (Recommended for Vercel deployment)

1. Go to [PlanetScale.com](https://planetscale.com)
2. Create new database: `infinity-creators`
3. Get connection string:
   ```
   mysql://user:pass@host/db?sslaccept=strict
   ```
4. Add to environment variables as `DATABASE_URL`
5. Enable `ssl` in Drizzle config

### Supabase PostgreSQL (Alternative)

1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Get PostgreSQL connection string
4. Update `drizzle.config.ts` to use PostgreSQL instead of MySQL

---

## Environment Variables

### Complete List for Railway/Vercel

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | ✅ Yes | Min 32 chars for session security | Random 32+ char string |
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key | `AIzaSy...` |
| `STRIPE_SECRET_KEY` | ✅ Yes | Stripe test/live secret key | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ Yes | Stripe webhook signing secret | `whsec_...` |
| `STRIPE_PRICE_PRO` | ✅ Yes | Pro plan Stripe price ID | `price_...` |
| `STRIPE_PRICE_AGENCY` | ✅ Yes | Agency plan Stripe price ID | `price_...` |
| `STRIPE_PRICE_CREDITS_10` | ✅ Yes | 10 credits price ID | `price_...` |
| `STRIPE_PRICE_CREDITS_50` | ✅ Yes | 50 credits price ID | `price_...` |
| `STRIPE_PRICE_CREDITS_100` | ✅ Yes | 100 credits price ID | `price_...` |
| `SENDGRID_API_KEY` | ✅ Yes | SendGrid API key for emails | `SG.abc...` |
| `FROM_EMAIL` | ✅ Yes | Verified sender email | `info@infinitycreators.com` |
| `PORT` | ❌ No | Auto-set by Railway/Vercel | `3000` (local only) |
| `NODE_ENV` | ❌ No | Production environment | `production` |

### How to Add Variables

**Railway:**
1. Dashboard → Your Service → Variables tab → Raw Editor
2. Paste variables, save
3. Redeploy automatically triggers

**Vercel:**
1. Dashboard → Settings → Environment Variables
2. Add each variable individually
3. Redeploy required

---

## Stripe Configuration

### 1. Create Stripe Products & Prices

Same process for both Railway and Vercel:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create products:
   - Pro Plan: $19/month recurring
   - Agency Plan: $39.99/month recurring
   - 10 Credits: $4.99 one-time
   - 50 Credits: $19.99 one-time
   - 100 Credits: $29.99 one-time
3. Copy Price IDs (starts with `price_...`)

### 2. Configure Webhook Endpoint

**Railway:**
```
https://your-app.railway.app/api/webhooks/stripe
```

**Vercel:**
```
https://your-app.vercel.app/api/webhooks/stripe
```

**Custom Domain:**
```
https://infinitycreators.com/api/webhooks/stripe
```

#### Steps:
1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → Add endpoint
2. Enter your webhook URL
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy **Signing secret** (starts with `whsec_...`)
5. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Post-Deployment

### 1. Verify Deployment

**Test these endpoints:**

```bash
# Health check
curl https://your-app.railway.app/api/health

# tRPC API
curl https://your-app.railway.app/api/trpc/health

# Frontend
curl https://your-app.railway.app/
```

### 2. Test Payment Flow

1. Visit pricing page
2. Click "Buy 10 Credits"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify credits added to account
5. Check Stripe webhook logs for successful event

### 3. Test Email Notifications

1. Sign up new account
2. Check email for welcome message
3. Purchase credits
4. Check email for payment confirmation

### 4. Monitor Logs

**Railway:**
- Dashboard → Your Service → Logs tab
- Real-time logs with search/filter

**Vercel:**
- Dashboard → Your Project → Logs
- Filter by deployment, function, or time range

---

## Troubleshooting

### Issue: Build Fails on Railway

**Error**: `pnpm: command not found`

**Solution:**
1. Check `railway.toml` has correct config
2. Ensure `package.json` has `packageManager` field
3. Or add custom nixpacks config

### Issue: Build Fails on Vercel

**Error**: TypeScript compilation errors

**Solution:**
1. Run `pnpm check` locally first
2. Fix all type errors
3. Commit and push
4. Redeploy on Vercel

### Issue: Database Connection Failed

**Railway:**
- Check `DATABASE_URL` is set to `${{MySQL.DATABASE_URL}}`
- Verify MySQL service is running
- Check network connectivity

**Vercel + External DB:**
- Verify connection string includes SSL: `?sslaccept=strict`
- Check database allows external connections
- Test connection locally first

### Issue: Stripe Webhooks Not Working

**Symptoms**: Payments complete but credits not added

**Solution:**
1. Verify webhook URL matches deployment URL
2. Check `STRIPE_WEBHOOK_SECRET` is correct
3. Review Stripe webhook logs for errors
4. Ensure endpoint is publicly accessible (not localhost)
5. Check server logs for webhook errors

### Issue: Cold Starts on Vercel

**Symptoms**: First request takes 2-5 seconds

**Solution:**
- This is expected for serverless (Vercel)
- Use Railway for always-on backend
- Or use Vercel Pro plan with "Warm Instances"

### Issue: CORS Errors (Hybrid Deployment)

**Symptoms**: Frontend can't connect to backend

**Solution:**
1. Add Vercel domain to CORS whitelist in backend
2. Ensure `credentials: true` in CORS config
3. Check `VITE_API_URL` points to correct backend URL

---

## Security Checklist

Before going live:

- [ ] All API keys in environment variables (not hardcoded)
- [ ] Database uses SSL connection
- [ ] Stripe webhook signature verification enabled
- [ ] HTTPS enforced (automatic on Railway/Vercel)
- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] SendGrid sender email verified
- [ ] `.env` file in `.gitignore` (never commit secrets)

---

## Performance Optimization

### Railway

- **Always-on**: No cold starts
- **Database**: Same data center as app (low latency)
- **Scaling**: Auto-scales with traffic (Pro plan)

### Vercel

- **Global CDN**: Frontend served from edge locations
- **Caching**: Automatic static asset caching
- **Serverless**: Auto-scales to zero (free tier) or millions (Pro)

### Recommendations

- **Images**: Use WebP format, compress before upload
- **Database**: Add indexes for frequently queried fields
- **API**: Use React Query for client-side caching
- **Templates**: Cache template list in memory

---

## Cost Estimate

### Railway (Full-Stack)

- **Free Tier**: $5 credit/month (for personal projects)
- **Hobby**: $5/month (500 hours execution time)
- **Pro**: $20/month (unlimited)
- **MySQL**: $5/month (1GB storage)

**Total**: ~$10-25/month

### Vercel (Full-Stack)

- **Free Tier**: 100GB bandwidth, serverless functions
- **Pro**: $20/month (unlimited bandwidth, priority support)
- **Database**: External (PlanetScale free tier or $29/month)

**Total**: ~$0-50/month

### Hybrid (Recommended for Production)

- **Vercel Free**: Frontend ($0)
- **Railway Hobby**: Backend + MySQL ($10/month)

**Total**: ~$10/month

---

## Support & Resources

### Railway
- **Docs**: https://docs.railway.app
- **Discord**: https://discord.gg/railway
- **Status**: https://status.railway.app

### Vercel
- **Docs**: https://vercel.com/docs
- **Discord**: https://vercel.com/discord
- **Status**: https://vercel-status.com

### Infinity Creators
- **GitHub**: https://github.com/yourusername/infinity-creators-saas
- **Issues**: https://github.com/yourusername/infinity-creators-saas/issues

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`pnpm test`)
- [ ] TypeScript compiles (`pnpm check`)
- [ ] Environment variables documented
- [ ] `.env.example` created
- [ ] Stripe products created
- [ ] SendGrid sender verified

### Deployment

- [ ] Repository pushed to GitHub
- [ ] Railway/Vercel project created
- [ ] Environment variables configured
- [ ] Database provisioned
- [ ] Migrations run
- [ ] Templates seeded
- [ ] App deployed successfully

### Post-Deployment

- [ ] Homepage loads
- [ ] Authentication works
- [ ] Script generation works
- [ ] Payment flow works (test card)
- [ ] Emails send successfully
- [ ] Stripe webhook configured
- [ ] Custom domain configured (if applicable)

### Go-Live

- [ ] Switch Stripe to live mode
- [ ] Update all Stripe secrets with live keys
- [ ] Test with real payment card
- [ ] Monitor logs for 24 hours
- [ ] Announce launch 🎉

---

**Last Updated**: January 2026
**Maintained by**: Infinity Creators Team
**Deployed on**: Railway & Vercel
