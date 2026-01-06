# 🚀 Deployment Guide - Infinity Creators

Comprehensive guide for deploying the Infinity Creators Micro-SaaS platform using **Manus Built-in Hosting**.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Stripe Configuration](#stripe-configuration)
6. [Deployment with Manus](#deployment-with-manus)
7. [Custom Domain Setup](#custom-domain-setup)
8. [Post-Deployment](#post-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Overview

**Infinity Creators** is deployed using **Manus Built-in Hosting**, which provides:

✅ **Automatic Deployment** - One-click publish from Manus UI  
✅ **Custom Domain Support** - Bind your own domain or use `xxx.manus.space`  
✅ **Built-in SSL** - HTTPS automatically configured  
✅ **Environment Variables** - Managed through Manus Settings  
✅ **Database Integration** - Pre-configured MySQL/TiDB connection  
✅ **Zero Configuration** - No deployment files needed (no `vercel.json`, no `Dockerfile`)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ **Manus Account** with active project
- ✅ **MySQL/TiDB Database** (automatically provisioned by Manus)
- ✅ **Stripe Account** (for payments)
- ✅ **Google Gemini API Key** (for AI script generation)
- ✅ **SendGrid Account** (for email notifications)

**Note**: Manus OAuth credentials are automatically injected - no manual setup required.

---

## Environment Variables

### Automatic Environment Variables (Pre-configured by Manus)

These are **automatically injected** by the Manus platform:

```bash
# Database (Auto-configured)
DATABASE_URL="mysql://..." # Automatically set by Manus

# Authentication (Auto-configured)
JWT_SECRET="..." # Automatically generated
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
VITE_APP_ID="..." # Your Manus app ID
OWNER_OPEN_ID="..." # Your owner ID
OWNER_NAME="..." # Your name

# Manus Built-in APIs (Auto-configured)
BUILT_IN_FORGE_API_KEY="..." # Server-side API key
BUILT_IN_FORGE_API_URL="https://api.manus.im/forge"
VITE_FRONTEND_FORGE_API_KEY="..." # Frontend API key
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im/forge"

# Frontend (Auto-configured)
VITE_APP_TITLE="Infinity Creators"
VITE_APP_LOGO="/logo.svg"

# Analytics (Auto-configured, optional)
VITE_ANALYTICS_ENDPOINT="..."
VITE_ANALYTICS_WEBSITE_ID="..."
```

### Manual Environment Variables (You Must Add)

Add these through **Manus Management UI → Settings → Secrets**:

```bash
# AI Generation (Required)
GEMINI_API_KEY="your_gemini_api_key_here"

# Stripe Payment Processing (Required)
STRIPE_SECRET_KEY="sk_test_..." # Test key for development
STRIPE_LIVE_SECRET_KEY="sk_live_..." # Live key for production
STRIPE_WEBHOOK_SECRET="whsec_..." # Test webhook secret
STRIPE_LIVE_WEBHOOK_SECRET="whsec_..." # Live webhook secret

# Stripe Price IDs (Required - from Stripe Dashboard)
STRIPE_PRICE_PRO="price_..." # Pro plan monthly subscription
STRIPE_PRICE_AGENCY="price_..." # Agency plan monthly subscription
STRIPE_PRICE_CREDITS_10="price_..." # 10 credits one-time purchase
STRIPE_PRICE_CREDITS_50="price_..." # 50 credits one-time purchase
STRIPE_PRICE_CREDITS_100="price_..." # 100 credits one-time purchase

# Email Notifications (Required)
SENDGRID_API_KEY="your_sendgrid_api_key"
FROM_EMAIL="info.infinitycreators@gmail.com"

# Webhooks (Optional)
WEBHOOK="your_webhook_url_for_notifications"
```

### How to Add Environment Variables in Manus

1. Open your project in Manus
2. Click **Management UI** (right panel)
3. Navigate to **Settings** → **Secrets**
4. Click **Add Secret**
5. Enter key name (e.g., `GEMINI_API_KEY`)
6. Enter value
7. Click **Save**

**Important**: After adding secrets, restart the dev server for changes to take effect.

---

## Database Setup

### 1. Database is Auto-Provisioned

Manus automatically creates and configures your MySQL/TiDB database. No manual setup required.

**Connection details** are available in:
- Management UI → **Database** panel → Settings (bottom-left)
- Enable SSL for external connections

### 2. Run Migrations

```bash
# In Manus terminal or local development
pnpm db:push
```

This creates all required tables:
- `users` - User accounts with credits, plans, referral codes
- `subscriptions` - Stripe subscription tracking
- `credits_transactions` - Credit usage and purchase history
- `generation_logs` - AI script generation logs
- `referrals` - Referral system tracking
- `script_templates` - Pre-built script templates
- `affiliate_links` - Product affiliate links

### 3. Seed Initial Data

```bash
# Seed OF-specific script templates
node scripts/seed-of-templates.mjs

# Seed affiliate links (optional)
node scripts/seed-affiliate-links.mjs
```

This adds 7 OnlyFans-specific templates:
1. ☕ Story-Poll Engagement (Morning)
2. 💰 PPV Upsell Teaser
3. 🤫 Link in Bio Funnel
4. 🎙️ Late Night Voice Note
5. 🤫 Link in Bio Teaser
6. 📖 Storytime & Reveal
7. 💡 Educational Hook

### 4. Verify Database

Use **Management UI → Database** panel to:
- View all tables
- Browse data with CRUD UI
- Run SQL queries
- Export/import data

---

## Stripe Configuration

### 1. Create Products & Prices

**Option A: Use Stripe Dashboard**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create products:
   - **Pro Plan**: $29/month recurring
   - **Agency Plan**: $99/month recurring
   - **10 Credits**: $5 one-time
   - **50 Credits**: $20 one-time
   - **100 Credits**: $35 one-time
3. Copy each **Price ID** (starts with `price_...`)
4. Add to Manus Secrets (see Environment Variables section)

**Option B: Use Setup Script**

```bash
# Requires Stripe CLI installed
node scripts/setup-stripe.mjs
```

### 2. Configure Webhook Endpoint

**Important**: Stripe webhooks must point to your Manus-hosted domain.

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter URL: `https://your-project.manus.space/api/webhooks/stripe`
   - Replace `your-project` with your actual Manus subdomain
   - Or use your custom domain if configured
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy **Signing secret** (starts with `whsec_...`)
6. Add to Manus Secrets as `STRIPE_WEBHOOK_SECRET`

### 3. Test Webhook Locally (Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-brew/stripe

# Login
stripe login

# Forward webhooks to local Manus dev server
stripe listen --forward-to https://3000-xxxxx.manusvm.computer/api/webhooks/stripe

# Test webhook
stripe trigger checkout.session.completed
```

### 4. Switch to Live Mode

When ready for production:

1. Toggle **View test data** OFF in Stripe Dashboard
2. Create new products in **live mode**
3. Update Manus Secrets:
   - `STRIPE_LIVE_SECRET_KEY` (live secret key)
   - `STRIPE_LIVE_WEBHOOK_SECRET` (live webhook secret)
   - Update all `STRIPE_PRICE_*` with live price IDs
4. Create new webhook endpoint with live URL
5. Test with real payment cards

---

## Deployment with Manus

### Step 1: Save Checkpoint

Before publishing, create a checkpoint:

1. Ensure all changes are saved
2. Run tests: `pnpm test`
3. In Manus chat, request: "Save checkpoint"
4. Or use Management UI → Checkpoints

### Step 2: Publish to Production

**Option A: Management UI (Recommended)**

1. Open Management UI (right panel)
2. Click **Publish** button (top-right)
3. Review changes
4. Click **Confirm Publish**
5. Wait for deployment (30-60 seconds)
6. Your site is live at `https://your-project.manus.space`

**Option B: Via Chat**

Simply say: "Publish the project" or "Deploy to production"

### Step 3: Verify Deployment

After publishing, verify:

- ✅ Homepage loads: `https://your-project.manus.space`
- ✅ Authentication works (OAuth login)
- ✅ Script generation works
- ✅ Payment flow works
- ✅ Referral system works
- ✅ Database queries work

---

## Custom Domain Setup

Manus supports custom domains with automatic SSL.

### Option 1: Modify Manus Subdomain

1. Go to Management UI → **Settings** → **Domains**
2. Edit subdomain prefix (e.g., `infinitycreators.manus.space`)
3. Click **Save**
4. Domain updates immediately

### Option 2: Purchase Domain via Manus

1. Go to Management UI → **Settings** → **Domains**
2. Click **Purchase Domain**
3. Search for available domain
4. Complete purchase (integrated payment)
5. Domain automatically configured and assigned

### Option 3: Bind Existing Custom Domain

1. Go to Management UI → **Settings** → **Domains**
2. Click **Add Custom Domain**
3. Enter your domain (e.g., `infinitycreators.com`)
4. Update DNS records at your registrar:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: [provided by Manus]
   TTL: 3600
   ```
5. Click **Verify** in Manus UI
6. Wait for DNS propagation (5-60 minutes)
7. SSL certificate automatically provisioned

### Update Stripe Webhook URL

After custom domain is active:

1. Go to Stripe Dashboard → Webhooks
2. Update endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
3. Copy new signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in Manus Secrets

---

## Post-Deployment

### 1. Verify All Features

**Authentication:**
- [ ] OAuth login works
- [ ] User registration works
- [ ] Referral code tracking works

**Script Generation:**
- [ ] Template selection works
- [ ] AI generation works (Gemini API)
- [ ] Credits deduct correctly
- [ ] Generated scripts display properly

**Payments:**
- [ ] Stripe checkout opens
- [ ] Test payment completes (use test card: `4242 4242 4242 4242`)
- [ ] Credits added after purchase
- [ ] Subscription activates correctly

**Referral System:**
- [ ] Referral link generates
- [ ] Referral code stores in localStorage
- [ ] New user links to referrer
- [ ] 5 credits awarded on first purchase

**Email Notifications:**
- [ ] Welcome email sends
- [ ] Payment confirmation sends
- [ ] Referral reward notification sends

### 2. Test Payment Flow

Use Stripe test cards:

```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
🔐 3D Secure: 4000 0025 0000 3155
```

**Test scenarios:**
1. Purchase 10 credits → verify credits added
2. Subscribe to Pro plan → verify subscription active
3. Cancel subscription → verify subscription ends
4. Use referral code → verify 5 credits awarded to referrer

### 3. Monitor Logs

**Manus Logs:**
- Management UI → **Dashboard** → View logs
- Check for errors or warnings

**Stripe Logs:**
- Stripe Dashboard → Webhooks → [Your Endpoint] → Logs
- Verify all events received successfully

**Database Monitoring:**
- Management UI → **Database** → Query performance
- Check for slow queries or errors

### 4. Set Up Analytics

**Manus Built-in Analytics:**
- Management UI → **Dashboard** → Analytics
- View UV/PV, user behavior, conversion rates

**Optional: External Analytics**
- Add Google Analytics
- Add Posthog for A/B testing
- Add Sentry for error tracking

---

## Troubleshooting

### Issue: Database Connection Failed

**Symptoms**: `Error: Database not available` in logs

**Solutions**:
1. Verify database is running (Management UI → Database)
2. Check `DATABASE_URL` is set (auto-configured by Manus)
3. Restart dev server
4. If using external client, enable SSL in database settings

### Issue: Stripe Webhook Not Receiving Events

**Symptoms**: Payments complete but credits not added

**Solutions**:
1. Verify webhook URL matches your deployed domain
2. Check webhook signing secret in Manus Secrets
3. Ensure webhook events are selected:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Check Stripe webhook logs for errors
5. Verify endpoint is publicly accessible (not localhost)

### Issue: AI Generation Fails

**Symptoms**: `Error generating script` message

**Solutions**:
1. Verify `GEMINI_API_KEY` is set in Manus Secrets
2. Check Gemini API quota/limits in Google Cloud Console
3. Review generation logs in database (`generation_logs` table)
4. Test API key with curl:
   ```bash
   curl -X POST https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent \
     -H "Content-Type: application/json" \
     -H "x-goog-api-key: YOUR_API_KEY" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```
5. Restart dev server after adding API key

### Issue: Email Notifications Not Sending

**Symptoms**: Users not receiving emails

**Solutions**:
1. Verify `SENDGRID_API_KEY` API key is set in Manus Secrets
2. Verify `FROM_EMAIL` is set in Manus Secrets
3. Check SendGrid sender verification status
4. Review email logs in SendGrid dashboard
5. Check spam folder
6. Verify `FROM_EMAIL` address is verified in SendGrid
7. Restart dev server after adding SendGrid key

### Issue: Referral System Not Working

**Symptoms**: Referral codes not generating or credits not awarded

**Solutions**:
1. Check `referrals` table exists (Management UI → Database)
2. Verify `users.referralCode` field is populated
3. Check Stripe webhook is processing `checkout.session.completed`
4. Review referral logs in browser console
5. Test referral flow:
   - Visit `/?ref=TEST123`
   - Check localStorage has `referralCode`
   - Sign up new account
   - Verify `referredBy` field in database

### Issue: Credits Not Deducting

**Symptoms**: Users can generate unlimited scripts

**Solutions**:
1. Verify atomic credit deduction in `server/routers/generation.ts`
2. Check user plan (agency users have unlimited credits)
3. Review `credits_transactions` table for logs
4. Test with free user account
5. Check database transaction support is enabled

### Issue: Custom Domain Not Working

**Symptoms**: Domain shows error or doesn't resolve

**Solutions**:
1. Verify DNS records are correct (CNAME to Manus)
2. Wait for DNS propagation (up to 60 minutes)
3. Check domain verification in Management UI → Settings → Domains
4. Ensure SSL certificate is provisioned (automatic)
5. Try clearing browser cache
6. Update Stripe webhook URL to new domain

---

## Security Checklist

Before going live, verify:

- [x] All API keys are in Manus Secrets (not hardcoded)
- [x] Database uses SSL connection (auto-configured by Manus)
- [x] Stripe webhook signature verification is enabled
- [x] Input validation with Zod schemas
- [x] SQL injection protection (Drizzle ORM)
- [x] XSS protection (React escapes by default)
- [x] HTTPS enforced (automatic with Manus hosting)
- [x] Rate limiting (handled by Manus platform)
- [x] Environment variables not exposed to client
- [x] Atomic credit deduction with transactions

---

## Performance Optimization

### Manus Built-in Optimizations

Manus hosting automatically provides:

✅ **CDN** - Global content delivery  
✅ **Edge Caching** - Static assets cached  
✅ **Compression** - Gzip/Brotli enabled  
✅ **HTTP/2** - Faster multiplexing  
✅ **Auto-scaling** - Handles traffic spikes

### Additional Optimizations

1. **Database Connection Pooling**
   - Already configured by Manus
   - No manual setup required

2. **Image Optimization**
   - Use WebP format for images
   - Compress images before upload
   - Use lazy loading for below-fold images

3. **API Response Caching**
   - Cache template list responses
   - Cache affiliate links
   - Use React Query for client-side caching

---

## Backup & Recovery

### Automatic Backups

Manus automatically backs up your database:

- **Frequency**: Daily
- **Retention**: 30 days
- **Access**: Management UI → Database → Backups

### Manual Backup

To create a manual backup:

1. Go to Management UI → **Database**
2. Click **Export** button
3. Download SQL dump
4. Store securely (encrypted storage recommended)

### Restore from Backup

To restore from a backup:

1. Go to Management UI → **Database**
2. Click **Backups** tab
3. Select backup to restore
4. Click **Restore**
5. Confirm restoration

**Warning**: Restoring overwrites current data. Create a manual backup first.

### Checkpoint Rollback

To rollback code changes:

1. Go to Management UI → **Checkpoints**
2. Find previous stable checkpoint
3. Click **Rollback**
4. Confirm rollback
5. Database remains unchanged (only code rolls back)

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Check error logs (Management UI → Dashboard)
- [ ] Monitor Stripe webhook logs
- [ ] Review credit transaction logs
- [ ] Check email delivery rate (SendGrid)

### Weekly Checks

- [ ] Review user growth metrics
- [ ] Check referral conversion rate
- [ ] Monitor AI generation success rate
- [ ] Review payment failure rate

### Monthly Checks

- [ ] Update dependencies (`pnpm update`)
- [ ] Review database performance
- [ ] Analyze user feedback
- [ ] Plan feature updates

---

## Support & Resources

### Manus Platform

- **Documentation**: https://docs.manus.im
- **Support**: https://help.manus.im
- **Community**: Manus Discord

### Third-Party Services

- **Stripe Docs**: https://stripe.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **SendGrid Docs**: https://docs.sendgrid.com
- **Drizzle ORM Docs**: https://orm.drizzle.team

### Project Resources

- **GitHub Repository**: [Your repo URL]
- **Issue Tracker**: [Your issues URL]
- **Changelog**: See `CHANGELOG.md`

---

## Deployment Checklist

Use this checklist before going live:

### Pre-Deployment
- [ ] All environment variables added to Manus Secrets
- [ ] Database migrations run (`pnpm db:push`)
- [ ] OF-templates seeded (`node scripts/seed-of-templates.mjs`)
- [ ] All tests passing (`pnpm test`)
- [ ] Checkpoint created

### Stripe Configuration
- [ ] Products created in Stripe
- [ ] Price IDs added to Manus Secrets
- [ ] Webhook endpoint configured
- [ ] Webhook signing secret added to Secrets
- [ ] Test payment completed successfully

### Manus Deployment
- [ ] Project published via Management UI
- [ ] Deployment successful (no errors)
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Script generation works

### Post-Deployment
- [ ] Custom domain configured (if applicable)
- [ ] Stripe webhook URL updated to production domain
- [ ] Email notifications tested
- [ ] Referral system tested end-to-end
- [ ] Payment flow tested with real cards
- [ ] Analytics enabled

### Go-Live
- [ ] Switch Stripe to live mode
- [ ] Update all Stripe secrets with live keys
- [ ] Announce launch (social media, email list)
- [ ] Monitor logs for first 24 hours
- [ ] Respond to user feedback

---

## Changelog

### v1.0.0 (Initial Release - December 2024)

**Features:**
- ✅ AI script generation with Gemini
- ✅ 7 OnlyFans-specific templates
- ✅ Atomic credit system with transactions
- ✅ Stripe payment integration (subscriptions + one-time)
- ✅ Viral referral system (5 credits per referral)
- ✅ Email notifications (SendGrid)
- ✅ Manus OAuth authentication
- ✅ Blog system
- ✅ Analytics integration

**Deployment:**
- ✅ Manus built-in hosting
- ✅ Custom domain support
- ✅ Automatic SSL
- ✅ Zero-config deployment

---

**Last Updated**: December 14, 2024  
**Maintained by**: Infinity Creators Team  
**Deployed on**: Manus Platform
