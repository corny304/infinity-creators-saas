# 🔗 Stripe Webhook Setup Guide

This guide will walk you through setting up Stripe webhooks to automatically process payments and update user accounts.

## 📋 Prerequisites

- ✅ Stripe account (test or live mode)
- ✅ Deployed web application with public URL
- ✅ `STRIPE_SECRET_KEY` configured in environment variables

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Webhook URL

Your webhook endpoint is:
```
https://your-domain.com/api/webhooks/stripe
```

**Examples:**
- Manus deployment: `https://your-project.manus.space/api/webhooks/stripe`
- Vercel deployment: `https://infinity-creators.vercel.app/api/webhooks/stripe`
- Custom domain: `https://infinity-creators.com/api/webhooks/stripe`

### Step 2: Add Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL (from Step 1)
4. Click **"Select events"**
5. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
6. Click **"Add events"**
7. Click **"Add endpoint"**

### Step 3: Get Webhook Signing Secret

1. In the webhook details page, find **"Signing secret"**
2. Click **"Reveal"** or **"Click to reveal"**
3. Copy the secret (starts with `whsec_`)
4. Add it to your environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Step 4: Restart Your Application

After adding the webhook secret:
- **Manus:** Restart the dev server or redeploy
- **Vercel:** Redeploy your application
- **Local:** Restart your development server

---

## 🧪 Testing Webhooks

### Option 1: Test with Stripe CLI (Recommended)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop install stripe
   
   # Linux
   wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_amd64.tar.gz
   tar -xvf stripe_linux_amd64.tar.gz
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Option 2: Test with Real Payment (Test Mode)

1. Go to your deployed app
2. Navigate to Pricing page
3. Click "Buy Credits" or "Subscribe"
4. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
5. Complete the payment
6. Check your Stripe Dashboard → Webhooks → Recent deliveries

---

## 🔍 Troubleshooting

### Webhook Not Receiving Events

**Problem:** Stripe shows webhook as "Failed" or "Not delivered"

**Solutions:**
1. **Check webhook URL is correct:**
   - Must be publicly accessible (not `localhost`)
   - Must start with `https://` (not `http://`)
   - Must end with `/api/webhooks/stripe`

2. **Check your server is running:**
   - Visit `https://your-domain.com` in browser
   - Should load your app (not 404 or 500 error)

3. **Check webhook endpoint is accessible:**
   - Try visiting `https://your-domain.com/api/webhooks/stripe` in browser
   - Should return `{"error":"Webhook error"}` (not 404)

### Credits Not Adding After Payment

**Problem:** Payment successful but credits not added to account

**Solutions:**
1. **Check webhook logs in Stripe Dashboard:**
   - Go to Webhooks → Your endpoint → Recent deliveries
   - Click on a delivery to see request/response
   - Look for error messages

2. **Check user email matches:**
   - Email in Stripe checkout must match user's email in database
   - Case-sensitive match required

3. **Check database connection:**
   - Verify `DATABASE_URL` is set correctly
   - Check database is accessible from your server

4. **Check server logs:**
   - Look for `[Stripe Webhook]` messages
   - Should see "Added X credits to user Y"

### Webhook Signature Verification Failed

**Problem:** Webhook returns "Invalid signature" error

**Solutions:**
1. **Check `STRIPE_WEBHOOK_SECRET` is set:**
   ```bash
   echo $STRIPE_WEBHOOK_SECRET
   ```
   Should output `whsec_xxxxxxxxxxxxx`

2. **Check secret matches Stripe Dashboard:**
   - Go to Stripe Dashboard → Webhooks → Your endpoint
   - Compare signing secret with your environment variable
   - Must match exactly (including `whsec_` prefix)

3. **Restart your application** after setting the secret

### Emails Not Sending After Payment

**Problem:** Payment successful, credits added, but no email sent

**Solutions:**
1. **Check `SENDGRID_API_KEY` is set:**
   ```bash
   echo $SENDGRID_API_KEY
   ```
   Should output `SG.xxxxxxxxxxxxx`

2. **Check SendGrid sender verification:**
   - Go to SendGrid Dashboard → Sender Authentication
   - Ensure your sender email is verified

3. **Check server logs:**
   - Look for `[EmailService]` messages
   - Should see "Email sent successfully to: user@example.com"

---

## 📊 Monitoring Webhooks

### Stripe Dashboard

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your endpoint
3. View **"Recent deliveries"** tab
4. Check delivery status:
   - ✅ **Success:** Green checkmark
   - ❌ **Failed:** Red X (click to see error)

### Server Logs

Monitor your application logs for webhook events:

```bash
# Successful webhook processing
[Stripe Webhook] Received event: checkout.session.completed
[Stripe Webhook] Added 10 credits to user 123
[EmailService] Email sent successfully to: user@example.com

# Failed webhook processing
[Stripe Webhook] Error: User not found for email: user@example.com
[EmailService] Failed to send email: ResponseError: Forbidden
```

---

## 🔐 Security Best Practices

### 1. Always Verify Webhook Signatures

Our webhook handler already verifies signatures. **Never** disable this check in production.

### 2. Use HTTPS Only

Webhooks must use HTTPS to prevent man-in-the-middle attacks. HTTP webhooks will fail.

### 3. Keep Signing Secret Private

- Never commit `STRIPE_WEBHOOK_SECRET` to version control
- Store in environment variables only
- Rotate secret if compromised

### 4. Monitor Failed Deliveries

Set up alerts for failed webhook deliveries:
1. Go to Stripe Dashboard → Webhooks
2. Click on your endpoint
3. Enable **"Email notifications"** for failed deliveries

---

## 🌐 Production Deployment

### Before Going Live

1. **Switch to Live Mode in Stripe:**
   - Go to Stripe Dashboard
   - Toggle from "Test mode" to "Live mode" (top right)

2. **Update API Keys:**
   - Replace `sk_test_...` with `sk_live_...`
   - Replace `pk_test_...` with `pk_live_...`

3. **Create Live Webhook:**
   - In Live mode, create a new webhook endpoint
   - Use same URL and events as test mode
   - Get new signing secret (`whsec_...`)
   - Update `STRIPE_WEBHOOK_SECRET` with live secret

4. **Test Live Webhook:**
   - Make a real payment with real card
   - Verify credits are added
   - Verify email is sent
   - Check Stripe Dashboard for successful delivery

### Webhook Retry Logic

Stripe automatically retries failed webhooks:
- **Retry schedule:** 3 attempts over 72 hours
- **Exponential backoff:** 1 hour, 24 hours, 72 hours
- **Manual retry:** Available in Stripe Dashboard

If a webhook fails 3 times, you can manually retry it:
1. Go to Stripe Dashboard → Webhooks → Your endpoint
2. Click on the failed delivery
3. Click **"Resend"**

---

## 📞 Support

### For Webhook Issues

- **Stripe Support:** https://support.stripe.com
- **Stripe Webhook Docs:** https://stripe.com/docs/webhooks

### For Application Issues

- Email: info.infinitycreators@gmail.com
- Founder: Cornelius Gross

---

## ✅ Checklist

Before going live, ensure:

- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] All 4 events selected (checkout.session.completed, customer.subscription.*)
- [ ] Webhook signing secret added to environment variables
- [ ] Application restarted after adding secret
- [ ] Test payment completed successfully
- [ ] Credits added to user account
- [ ] Email sent to user
- [ ] Webhook shows "Success" in Stripe Dashboard
- [ ] Live mode webhook created (for production)
- [ ] Live API keys configured (for production)

---

## 🎉 You're Done!

Your Stripe webhook is now configured and ready to automatically process payments. Users can purchase credits and subscribe to plans, and the system will handle everything autonomously.

**Next Steps:**
1. Test the full payment flow
2. Monitor webhook deliveries for the first few days
3. Set up alerts for failed deliveries
4. Scale up as your user base grows!

Good luck! 🚀
