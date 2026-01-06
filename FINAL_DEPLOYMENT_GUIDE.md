# 🚀 Infinity Creators - Final Deployment Guide

This guide will walk you through deploying the complete Infinity Creators Micro-SaaS system to production.

## 📋 Pre-Deployment Checklist

### ✅ Completed Features

- [x] Full-stack web application (React + tRPC + Express)
- [x] Gemini AI integration for script generation
- [x] Stripe payment processing (credits & subscriptions)
- [x] Intelligent affiliate link system
- [x] Admin dashboard with analytics
- [x] Privacy Policy & Terms of Service
- [x] SEO optimization (meta tags, sitemap, robots.txt)
- [x] React Native mobile app (iOS & Android)
- [x] App icon generated
- [x] Database schema with RLS
- [x] Comprehensive test suite

### 🔑 Required Credentials

You already have these configured in Manus Secrets:
- ✅ `GEMINI_API_KEY` - Google Gemini API key
- ✅ `STRIPE_SECRET_KEY` - Stripe test secret key

Additional credentials needed:
- [ ] Stripe Publishable Key (for frontend)
- [ ] Stripe Webhook Secret (after webhook setup)
- [ ] Production database URL (if different from Manus default)

---

## 🌐 Part 1: Web Application Deployment (Vercel)

### Step 1: Prepare Environment Variables

The following environment variables are already configured in Manus:
```
DATABASE_URL=<auto-configured>
JWT_SECRET=<auto-configured>
GEMINI_API_KEY=<your-key>
STRIPE_SECRET_KEY=<your-test-key>
VITE_APP_ID=<auto-configured>
OAUTH_SERVER_URL=<auto-configured>
VITE_OAUTH_PORTAL_URL=<auto-configured>
```

You need to add these manually:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_... (after Step 3)
```

### Step 2: Deploy to Production

**Option A: Deploy via Manus UI (Recommended)**
1. Click the **"Publish"** button in the Manus Management UI header
2. Your app will be deployed to `https://your-project.manus.space`
3. Custom domain can be configured in Settings → Domains

**Option B: Deploy to Vercel Manually**
1. Push your code to GitHub:
   ```bash
   cd /home/ubuntu/infinity-creators-saas
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/infinity-creators.git
   git push -u origin main
   ```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (copy from Manus Secrets)
   - Click "Deploy"

### Step 3: Configure Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 4: Test Payment Flow

1. Visit your deployed site
2. Create an account
3. Go to Pricing page
4. Click "Buy Credits" or "Subscribe"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Verify credits are added to your account

---

## 📱 Part 2: Mobile App Deployment

### iOS App Store

#### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- EAS CLI installed (`npm install -g eas-cli`)

#### Step 1: Configure App

1. Navigate to mobile project:
   ```bash
   cd /home/ubuntu/infinity-creators-mobile
   ```

2. Update `app.json` with your credentials:
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.infinitycreators.app",
         "buildNumber": "1"
       }
     }
   }
   ```

3. Set environment variables in `.env`:
   ```
   API_URL=https://your-domain.com
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

#### Step 2: Build iOS App

```bash
eas login
eas build --platform ios --profile production
```

Wait for the build to complete (~15-20 minutes). Download the `.ipa` file.

#### Step 3: Submit to App Store

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app
3. Fill in app information:
   - **Name:** Infinity Creators
   - **Subtitle:** AI-Powered Script Generator
   - **Category:** Productivity
   - **Description:** (Use description from `SUBMISSION_CHECKLIST.md`)
4. Upload screenshots (5 required)
5. Upload the `.ipa` file using Transporter app
6. Submit for review

**Estimated Review Time:** 24-48 hours

---

### Android Play Store

#### Prerequisites
- Google Play Developer Account ($25 one-time)
- EAS CLI installed

#### Step 1: Configure App

1. Update `app.json`:
   ```json
   {
     "expo": {
       "android": {
         "package": "com.infinitycreators.app",
         "versionCode": 1
       }
     }
   }
   ```

#### Step 2: Build Android App

```bash
eas build --platform android --profile production
```

Download the `.aab` file when complete.

#### Step 3: Submit to Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in app information:
   - **App name:** Infinity Creators
   - **Short description:** AI-powered viral shorts script generator
   - **Full description:** (Use description from `SUBMISSION_CHECKLIST.md`)
4. Upload screenshots (4-8 required)
5. Upload the `.aab` file
6. Complete the content rating questionnaire
7. Submit for review

**Estimated Review Time:** 1-3 hours

---

## 🔧 Part 3: Post-Deployment Configuration

### 1. Update Affiliate Links

Your Amazon Associates tag is currently set to `infinitycreators-20`. To update:

1. Go to [Amazon Associates](https://affiliate-program.amazon.com)
2. Get your tracking ID
3. Update in database:
   ```sql
   UPDATE affiliate_links SET affiliateTag = 'your-tag-20';
   ```

### 2. Configure Analytics

The app already includes Umami analytics. To view stats:
1. Go to your Manus Dashboard
2. Navigate to Settings → Analytics
3. View UV/PV statistics

### 3. Set Up Email Notifications

For transactional emails (payment confirmations, etc.):
1. Sign up for [SendGrid](https://sendgrid.com) or [Mailgun](https://mailgun.com)
2. Get API key
3. Add to environment variables:
   ```
   SENDGRID_API_KEY=SG.xxx
   ```
4. Implement email templates (see `todo.md` Phase 13)

### 4. Monitor Errors

Set up error tracking with Sentry:
1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project
3. Add Sentry DSN to environment variables:
   ```
   SENTRY_DSN=https://xxx@sentry.io/xxx
   ```

---

## 📊 Part 4: Admin Dashboard Access

### Access Admin Panel

1. Visit `https://your-domain.com/admin`
2. Only users with `role='admin'` can access
3. To promote a user to admin:
   - Go to Manus Management UI → Database
   - Find the user in the `users` table
   - Change `role` from `user` to `admin`

### Admin Features

- **Total Users:** View total registered users
- **Total Revenue:** Track earnings (MRR/ARR)
- **Script Generations:** Monitor usage statistics
- **Recent Transactions:** View latest payments
- **Top Users:** See most active users

---

## 🧪 Part 5: Testing Checklist

### Web Application

- [ ] User registration works
- [ ] Login/logout works
- [ ] Script generation works
- [ ] Affiliate links are inserted correctly
- [ ] Credit purchase works (test mode)
- [ ] Subscription works (test mode)
- [ ] Webhook receives payment events
- [ ] Admin dashboard loads
- [ ] Privacy Policy & Terms accessible

### Mobile Apps

- [ ] iOS app installs
- [ ] Android app installs
- [ ] Login works on mobile
- [ ] Script generation works on mobile
- [ ] Payment works on mobile
- [ ] Push notifications work (if implemented)

---

## 🚨 Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is correct in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
3. Check server logs for errors
4. Test webhook with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Credits Not Adding After Payment

1. Check webhook logs in Stripe Dashboard
2. Verify user email matches between Stripe and your database
3. Check `credits_transactions` table for entries
4. Ensure webhook signature verification is passing

### Mobile App Not Connecting to API

1. Verify `API_URL` in mobile app `.env` file
2. Check CORS settings on server
3. Ensure API is accessible from mobile devices
4. Test API endpoints with Postman

---

## 📈 Part 6: Growth & Scaling

### Marketing Checklist

- [ ] Submit to Product Hunt
- [ ] Post on Reddit (r/SaaS, r/Entrepreneur)
- [ ] Share on Twitter/X
- [ ] Create YouTube demo video
- [ ] Write blog post about the tool
- [ ] Reach out to content creator influencers

### Scaling Considerations

- **Database:** Manus provides auto-scaling TiDB
- **API Rate Limiting:** Implement rate limiting for Gemini API
- **CDN:** Use Vercel Edge Network (automatic)
- **Caching:** Implement Redis for affiliate links
- **Monitoring:** Set up Sentry for error tracking

---

## 💰 Pricing Strategy

### Current Pricing

**One-Time Credits:**
- 10 Credits: $4.99
- 50 Credits: $19.99
- 100 Credits: $34.99

**Subscriptions:**
- Pro: $29/month (100 credits/month)
- Agency: $99/month (500 credits/month)

### Recommended Changes

1. **Free Trial:** Offer 3 free credits to new users
2. **Referral Program:** Give 5 credits for each referral
3. **Annual Plans:** Offer 20% discount for annual subscriptions

---

## 📞 Support

### For Technical Issues

- Email: info.infinitycreators@gmail.com
- Founder: Cornelius Gross
- Website: infinity-creators.com

### For Manus Platform Issues

- Submit ticket at: https://help.manus.im

---

## 🎉 You're Ready to Launch!

Your Infinity Creators Micro-SaaS is now fully configured and ready for production deployment. Follow the steps above, and you'll have a fully automated passive income system running in no time.

**Next Steps:**
1. Deploy web app to production
2. Submit mobile apps to stores
3. Configure Stripe webhook
4. Test payment flow
5. Start marketing!

Good luck! 🚀
