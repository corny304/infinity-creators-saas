# Environment Variables Documentation

Complete guide to all environment variables used in Infinity Creators.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Automatic Variables (Manus)](#automatic-variables-manus)
- [Manual Variables (Required)](#manual-variables-required)
- [How to Add Secrets](#how-to-add-secrets)
- [Variable Reference](#variable-reference)

---

## Overview

Infinity Creators uses environment variables for configuration. On **Manus Platform**, most variables are automatically configured. You only need to add a few manual secrets for third-party services.

### Variable Categories

| Category | Auto-Configured | Manual Setup |
|----------|----------------|--------------|
| Database | ✅ Yes | ❌ No |
| Authentication (OAuth) | ✅ Yes | ❌ No |
| Manus Built-in APIs | ✅ Yes | ❌ No |
| Frontend Config | ✅ Yes | ❌ No |
| AI Generation (Gemini) | ❌ No | ✅ Yes |
| Payments (Stripe) | ❌ No | ✅ Yes |
| Email (SendGrid) | ❌ No | ✅ Yes |

---

## Automatic Variables (Manus)

These are **automatically injected** by the Manus platform. No manual configuration needed.

### Database

```bash
DATABASE_URL="mysql://..."
```
- **Purpose**: MySQL/TiDB connection string
- **Format**: `mysql://username:password@host:port/database`
- **Access**: Management UI → Database → Settings (bottom-left)

### Authentication

```bash
JWT_SECRET="..."
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
VITE_APP_ID="..."
OWNER_OPEN_ID="..."
OWNER_NAME="..."
```

- **JWT_SECRET**: Session cookie signing secret (auto-generated)
- **OAUTH_SERVER_URL**: Manus OAuth backend endpoint
- **VITE_OAUTH_PORTAL_URL**: Manus login portal URL (frontend)
- **VITE_APP_ID**: Your Manus application ID
- **OWNER_OPEN_ID**: Your owner ID
- **OWNER_NAME**: Your name

### Manus Built-in APIs

```bash
BUILT_IN_FORGE_API_KEY="..."
BUILT_IN_FORGE_API_URL="https://api.manus.im/forge"
VITE_FRONTEND_FORGE_API_KEY="..."
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im/forge"
```

- **BUILT_IN_FORGE_API_KEY**: Server-side API key for LLM, storage, notifications
- **BUILT_IN_FORGE_API_URL**: Manus built-in APIs endpoint (server)
- **VITE_FRONTEND_FORGE_API_KEY**: Frontend API key
- **VITE_FRONTEND_FORGE_API_URL**: Manus built-in APIs endpoint (frontend)

### Frontend Configuration

```bash
VITE_APP_TITLE="Infinity Creators"
VITE_APP_LOGO="/logo.svg"
```

- **VITE_APP_TITLE**: Application name (shown in browser tab, header)
- **VITE_APP_LOGO**: Path to logo file in `client/public/`

### Analytics (Optional)

```bash
VITE_ANALYTICS_ENDPOINT="..."
VITE_ANALYTICS_WEBSITE_ID="..."
```

- **VITE_ANALYTICS_ENDPOINT**: Manus analytics endpoint
- **VITE_ANALYTICS_WEBSITE_ID**: Your website ID for analytics tracking

---

## Manual Variables (Required)

These must be added through **Management UI → Settings → Secrets**.

### AI Generation

```bash
GEMINI_API_KEY="your_gemini_api_key_here"
```

- **Purpose**: Google Gemini API for AI script generation
- **Get it**: https://ai.google.dev/
- **Format**: String (e.g., `AIzaSy...`)
- **Required**: ✅ Yes

### Stripe Payment Processing

```bash
# Test Mode (Development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Live Mode (Production)
STRIPE_LIVE_SECRET_KEY="sk_live_..."
STRIPE_LIVE_WEBHOOK_SECRET="whsec_..."

# Price IDs
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_AGENCY="price_..."
STRIPE_PRICE_CREDITS_10="price_..."
STRIPE_PRICE_CREDITS_50="price_..."
STRIPE_PRICE_CREDITS_100="price_..."
```

**Stripe Secret Keys:**
- **STRIPE_SECRET_KEY**: Test mode secret key (for development)
- **STRIPE_LIVE_SECRET_KEY**: Live mode secret key (for production)
- **Get it**: Stripe Dashboard → Developers → API keys
- **Format**: Starts with `sk_test_` or `sk_live_`
- **Required**: ✅ Yes

**Stripe Webhook Secrets:**
- **STRIPE_WEBHOOK_SECRET**: Test mode webhook signing secret
- **STRIPE_LIVE_WEBHOOK_SECRET**: Live mode webhook signing secret
- **Get it**: Stripe Dashboard → Webhooks → [Your Endpoint] → Signing secret
- **Format**: Starts with `whsec_`
- **Required**: ✅ Yes

**Stripe Price IDs:**
- **STRIPE_PRICE_PRO**: Pro plan price ID ($19/month)
- **STRIPE_PRICE_AGENCY**: Agency plan price ID ($39.99/month)
- **STRIPE_PRICE_CREDITS_10**: 10 credits price ID ($4.99)
- **STRIPE_PRICE_CREDITS_50**: 50 credits price ID ($19.99)
- **STRIPE_PRICE_CREDITS_100**: 100 credits price ID ($29.99)
- **Get it**: Stripe Dashboard → Products → [Product] → Pricing → Copy price ID
- **Format**: Starts with `price_`
- **Required**: ✅ Yes
- **Setup Script**: Run `node scripts/setup-stripe.mjs` to auto-create products

### Email Notifications

```bash
SENDGRID_API_KEY="your_sendgrid_api_key_here"
FROM_EMAIL="info.infinitycreators@gmail.com"
```

- **SENDGRID_API_KEY**
  - **Purpose**: SendGrid API for transactional emails
  - **Get it**: https://sendgrid.com → Settings → API Keys
  - **Format**: String (e.g., `SG.abc...`)
  - **Required**: ✅ Yes
  - **Note**: Verify sender email in SendGrid before sending

- **FROM_EMAIL**
  - **Purpose**: Email address to send emails from
  - **Format**: Email address (e.g., `info.infinitycreators@gmail.com`)
  - **Required**: ✅ Yes
  - **Note**: Must be verified in SendGrid dashboard

### Webhooks (Optional)

```bash
WEBHOOK="https://your-webhook-url.com/notify"
```

- **Purpose**: Custom webhook URL for notifications
- **Format**: Full HTTPS URL
- **Required**: ❌ No (optional)

---

## How to Add Secrets

### Step 1: Open Management UI

1. Open your project in Manus
2. Click **Management UI** icon (right panel)
3. Navigate to **Settings** → **Secrets**

### Step 2: Add Secret

1. Click **Add Secret** button
2. Enter **Key** name (e.g., `GEMINI_API_KEY`)
3. Enter **Value** (your actual API key)
4. Click **Save**

### Step 3: Restart Server

After adding secrets, restart the dev server:
- Management UI → Dashboard → Restart button
- Or in terminal: `pnpm dev`

---

## Variable Reference

### Complete List

| Variable | Type | Required | Auto-Configured | Description |
|----------|------|----------|-----------------|-------------|
| `DATABASE_URL` | Auto | ✅ | ✅ | MySQL connection string |
| `JWT_SECRET` | Auto | ✅ | ✅ | Session cookie signing secret |
| `OAUTH_SERVER_URL` | Auto | ✅ | ✅ | Manus OAuth backend |
| `VITE_OAUTH_PORTAL_URL` | Auto | ✅ | ✅ | Manus login portal |
| `VITE_APP_ID` | Auto | ✅ | ✅ | Manus application ID |
| `OWNER_OPEN_ID` | Auto | ✅ | ✅ | Owner ID |
| `OWNER_NAME` | Auto | ✅ | ✅ | Owner name |
| `BUILT_IN_FORGE_API_KEY` | Auto | ✅ | ✅ | Server-side API key |
| `BUILT_IN_FORGE_API_URL` | Auto | ✅ | ✅ | Manus APIs endpoint (server) |
| `VITE_FRONTEND_FORGE_API_KEY` | Auto | ✅ | ✅ | Frontend API key |
| `VITE_FRONTEND_FORGE_API_URL` | Auto | ✅ | ✅ | Manus APIs endpoint (frontend) |
| `VITE_APP_TITLE` | Auto | ✅ | ✅ | Application name |
| `VITE_APP_LOGO` | Auto | ✅ | ✅ | Logo path |
| `VITE_ANALYTICS_ENDPOINT` | Auto | ❌ | ✅ | Analytics endpoint (optional) |
| `VITE_ANALYTICS_WEBSITE_ID` | Auto | ❌ | ✅ | Analytics website ID (optional) |
| `GEMINI_API_KEY` | Manual | ✅ | ❌ | Google Gemini API key |
| `STRIPE_SECRET_KEY` | Manual | ✅ | ❌ | Stripe test secret key |
| `STRIPE_LIVE_SECRET_KEY` | Manual | ✅ | ❌ | Stripe live secret key |
| `STRIPE_WEBHOOK_SECRET` | Manual | ✅ | ❌ | Stripe test webhook secret |
| `STRIPE_LIVE_WEBHOOK_SECRET` | Manual | ✅ | ❌ | Stripe live webhook secret |
| `STRIPE_PRICE_PRO` | Manual | ✅ | ❌ | Pro plan price ID |
| `STRIPE_PRICE_AGENCY` | Manual | ✅ | ❌ | Agency plan price ID |
| `STRIPE_PRICE_CREDITS_10` | Manual | ✅ | ❌ | 10 credits price ID |
| `STRIPE_PRICE_CREDITS_50` | Manual | ✅ | ❌ | 50 credits price ID |
| `STRIPE_PRICE_CREDITS_100` | Manual | ✅ | ❌ | 100 credits price ID |
| `SENDGRID_API_KEY` | Manual | ✅ | ❌ | SendGrid API key |
| `FROM_EMAIL` | Manual | ✅ | ❌ | Email address to send from |
| `WEBHOOK` | Manual | ❌ | ❌ | Custom webhook URL (optional) |

---

## Security Best Practices

### DO:
- ✅ Add all secrets through Management UI → Settings → Secrets
- ✅ Use test mode Stripe keys for development
- ✅ Switch to live mode keys only when ready for production
- ✅ Rotate API keys regularly (every 3-6 months)
- ✅ Use different keys for development and production
- ✅ Verify SendGrid sender email before sending
- ✅ Test Stripe webhooks with test events before going live

### DON'T:
- ❌ Never hardcode API keys in source code
- ❌ Never commit `.env` files to version control
- ❌ Never share API keys in public channels (Slack, email, GitHub issues)
- ❌ Never use production keys in development
- ❌ Never expose `BUILT_IN_FORGE_API_KEY` to frontend (use `VITE_FRONTEND_FORGE_API_KEY` instead)

---

## Troubleshooting

### Issue: "Environment variable not found"

**Solution:**
1. Verify variable is added in Management UI → Settings → Secrets
2. Check spelling (case-sensitive)
3. Restart dev server after adding secrets
4. Clear browser cache and reload

### Issue: "Stripe webhook signature verification failed"

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check webhook endpoint URL is correct: `https://your-domain.manus.space/api/webhooks/stripe`
3. Ensure webhook events are selected: `checkout.session.completed`, `customer.subscription.*`
4. Test with Stripe CLI: `stripe trigger checkout.session.completed`

### Issue: "Gemini API quota exceeded"

**Solution:**
1. Check Gemini API quota in Google Cloud Console
2. Upgrade to paid plan if needed
3. Implement rate limiting on frontend
4. Cache generated scripts to reduce API calls

### Issue: "SendGrid emails not sending"

**Solution:**
1. Verify `SENDGRID_API_KEY` API key is correct
2. Verify `FROM_EMAIL` is set and verified in SendGrid Dashboard
3. Check sender email is verified in SendGrid Dashboard
4. Review SendGrid activity logs for errors
5. Check spam folder
6. Ensure email templates are configured correctly

---

## Additional Resources

- **Manus Documentation**: https://docs.manus.im
- **Stripe API Docs**: https://stripe.com/docs/api
- **Gemini API Docs**: https://ai.google.dev/docs
- **SendGrid API Docs**: https://docs.sendgrid.com
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Last Updated**: December 14, 2024  
**Version**: 1.0.0
