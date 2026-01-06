# Infinity Creators Micro-SaaS: System Architecture

**Version:** 1.0  
**Date:** December 2025  
**Status:** Design Phase

---

## Executive Summary

The Infinity Creators Micro-SaaS transforms a React-based viral shorts generator into a production-ready, fully automated passive income system. The architecture combines a tRPC-based backend (Express + Drizzle ORM) with secure payment processing (Stripe), intelligent content generation (Gemini API), and an affiliate system that automatically generates monetized product recommendations.

**Key Design Principles:**
- **Security First:** API keys and sensitive operations remain server-side only
- **Credit-Based Monetization:** Users purchase credits or subscribe for unlimited access
- **Automated Revenue:** Stripe webhooks automatically update user status and credits
- **Intelligent Affiliate Integration:** AI detects equipment in scripts and inserts affiliate links
- **Scalability:** Stateless design allows horizontal scaling on Vercel

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  (React 19 + Tailwind 4 + tRPC Client)                          │
│  - Authentication UI (Manus OAuth)                              │
│  - Script Generation Form                                       │
│  - Credit Dashboard                                             │
│  - Subscription Management                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ tRPC Calls (/api/trpc)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Express)                        │
│  - tRPC Router (procedures)                                     │
│  - Stripe Webhook Handler (/api/webhooks/stripe)               │
│  - OAuth Callback Handler (/api/oauth/callback)                │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Gemini API   │  │ Stripe API   │  │ Database     │
│ (Content Gen)│  │ (Payments)   │  │ (Drizzle ORM)│
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 2. Database Schema

### 2.1 Core Tables

#### `users` (Extended from template)
Stores user identity and authentication state.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `openId` | VARCHAR(64) | UNIQUE, NOT NULL | Manus OAuth identifier |
| `email` | VARCHAR(320) | | Email address |
| `name` | TEXT | | Display name |
| `role` | ENUM('user', 'admin') | DEFAULT 'user' | Access control |
| `stripeCustomerId` | VARCHAR(255) | NULLABLE | Stripe customer reference |
| `plan` | ENUM('free', 'pro', 'agency') | DEFAULT 'free' | Current subscription tier |
| `credits` | INT | DEFAULT 3 | Available credits for generation |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Account creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last modification date |
| `lastSignedIn` | TIMESTAMP | DEFAULT NOW() | Last login date |

#### `subscriptions`
Tracks active and historical subscriptions.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Subscription record ID |
| `userId` | INT | FOREIGN KEY → users.id | User reference |
| `stripeSubscriptionId` | VARCHAR(255) | UNIQUE | Stripe subscription ID |
| `plan` | ENUM('pro', 'agency') | | Plan type |
| `status` | ENUM('active', 'cancelled', 'paused') | DEFAULT 'active' | Current status |
| `creditsPerMonth` | INT | | Monthly credit allocation |
| `currentPeriodStart` | TIMESTAMP | | Billing period start |
| `currentPeriodEnd` | TIMESTAMP | | Billing period end |
| `cancelledAt` | TIMESTAMP | NULLABLE | Cancellation date |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Record creation |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update |

#### `credits_transactions`
Audit log for all credit movements (purchases, usage, refunds).

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Transaction ID |
| `userId` | INT | FOREIGN KEY → users.id | User reference |
| `amount` | INT | | Credit amount (positive=add, negative=deduct) |
| `type` | ENUM('purchase', 'usage', 'refund', 'subscription_grant') | | Transaction type |
| `stripeCheckoutSessionId` | VARCHAR(255) | NULLABLE | Stripe reference |
| `description` | TEXT | | Human-readable reason |
| `balanceBefore` | INT | | Credit balance before transaction |
| `balanceAfter` | INT | | Credit balance after transaction |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Transaction timestamp |

#### `generation_logs`
Tracks all script generations for analytics and debugging.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Log entry ID |
| `userId` | INT | FOREIGN KEY → users.id | User reference |
| `topic` | VARCHAR(255) | | Video topic/keyword |
| `generatedScript` | LONGTEXT | | Full generated script |
| `affiliateLinksInserted` | INT | | Count of affiliate links added |
| `creditsUsed` | INT | | Credits deducted for this generation |
| `geminiTokensUsed` | INT | | Tokens consumed from Gemini API |
| `status` | ENUM('success', 'failed', 'partial') | | Generation outcome |
| `errorMessage` | TEXT | NULLABLE | Error details if failed |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Generation timestamp |

#### `affiliate_links`
Master list of affiliate products and their links.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Link ID |
| `category` | VARCHAR(100) | | Equipment category (e.g., 'microphone', 'lighting') |
| `productName` | VARCHAR(255) | | Product name |
| `amazonAsin` | VARCHAR(20) | | Amazon ASIN for product |
| `affiliateTag` | VARCHAR(255) | | Amazon Associates tag |
| `affiliateUrl` | VARCHAR(512) | | Full affiliate URL |
| `keywords` | TEXT | | Comma-separated keywords for AI matching |
| `isActive` | BOOLEAN | DEFAULT TRUE | Enable/disable this link |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Record creation |

---

### 2.2 Pricing Configuration

| Plan | Monthly Cost | Credits/Month | Unlimited Generation | Features |
|------|--------------|---------------|----------------------|----------|
| **Free** | $0 | 3 | ❌ | Basic generation, limited features |
| **Pro** | $29 | Unlimited | ✅ | Full features, priority support |
| **Agency** | $99 | Unlimited | ✅ | All Pro features + team management |

---

## 3. API Procedures (tRPC)

### 3.1 Public Procedures

#### `auth.me`
Returns current authenticated user or null.

```typescript
Output: User | null
```

#### `auth.logout`
Clears session cookie.

```typescript
Output: { success: boolean }
```

---

### 3.2 Protected Procedures

#### `generation.create`
Generates a viral shorts script using Gemini API.

```typescript
Input: {
  topic: string;           // Video topic/keyword
  targetAudience?: string; // Optional audience description
  tone?: string;           // Optional tone (e.g., 'funny', 'professional')
}

Output: {
  script: string;          // Generated script with affiliate links
  creditsUsed: number;     // Credits deducted
  affiliateCount: number;  // Number of affiliate links inserted
  generationId: string;    // Reference for analytics
}

Errors:
- INSUFFICIENT_CREDITS: User has fewer credits than required
- GENERATION_FAILED: Gemini API error
- RATE_LIMITED: Too many requests
```

**Credit Logic:**
- Free/Pro users: 1 credit per generation
- Agency users: 0 credits (unlimited)
- If user has 0 credits: reject with INSUFFICIENT_CREDITS

---

#### `credits.getPurchaseOptions`
Returns available credit packages.

```typescript
Output: [
  {
    id: string;
    name: string;
    credits: number;
    price: number;
    stripePriceId: string;
  }
]
```

---

#### `credits.createCheckoutSession`
Initiates Stripe Checkout for credit purchase.

```typescript
Input: {
  priceId: string;  // Stripe price ID
  quantity?: number; // Number of packages (default: 1)
}

Output: {
  checkoutUrl: string; // Redirect user to this URL
}
```

---

#### `subscription.getPlans`
Returns available subscription plans.

```typescript
Output: [
  {
    id: string;
    name: 'pro' | 'agency';
    price: number;
    creditsPerMonth: number;
    stripePriceId: string;
  }
]
```

---

#### `subscription.createCheckoutSession`
Initiates Stripe Checkout for subscription.

```typescript
Input: {
  planId: 'pro' | 'agency';
}

Output: {
  checkoutUrl: string;
}
```

---

#### `subscription.cancel`
Cancels active subscription.

```typescript
Output: {
  success: boolean;
  nextBillingDate?: string;
}
```

---

#### `credits.getBalance`
Returns current credit balance and subscription status.

```typescript
Output: {
  credits: number;
  plan: 'free' | 'pro' | 'agency';
  subscription?: {
    id: string;
    plan: string;
    status: string;
    renewsAt: string;
  };
  transactions: Array<{
    id: number;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
  }>;
}
```

---

## 4. Stripe Integration

### 4.1 Webhook Events

#### `checkout.session.completed`
Fired when user completes payment.

**Handler Logic:**
```
1. Verify webhook signature using STRIPE_WEBHOOK_SECRET
2. Extract user email from checkout session metadata
3. Find user in database by email
4. Check if session is for subscription or one-time purchase:
   - Subscription: Update user.plan, create subscription record
   - One-time: Add credits to user.credits, log transaction
5. Send confirmation email (optional)
```

---

### 4.2 Stripe Products Configuration

#### Product 1: One-Time Credits
- **Name:** "Viral Shorts Generator Credits"
- **Prices:**
  - 10 Credits: $9.99
  - 50 Credits: $39.99
  - 100 Credits: $69.99

#### Product 2: Pro Subscription
- **Name:** "Viral Shorts Generator - Pro"
- **Price:** $29/month
- **Metadata:** `creditsPerMonth: unlimited`

#### Product 3: Agency Subscription
- **Name:** "Viral Shorts Generator - Agency"
- **Price:** $99/month
- **Metadata:** `creditsPerMonth: unlimited`

---

## 5. Affiliate System

### 5.1 Architecture

The affiliate system operates in three stages:

**Stage 1: Equipment Detection**
- Gemini AI analyzes the generated script
- Identifies equipment mentions (e.g., "ring light", "USB microphone")
- Extracts equipment categories and specifications

**Stage 2: Link Matching**
- Query `affiliate_links` table for matching products
- Match based on keywords and category
- Prioritize active, high-commission products

**Stage 3: Link Insertion**
- Replace equipment mentions with affiliate links
- Format as: `[Product Name](affiliate_url)`
- Track insertion count for analytics

---

### 5.2 Affiliate Links Database

The `affiliate_links` table is pre-populated with Amazon Associates links:

```sql
INSERT INTO affiliate_links (category, productName, amazonAsin, affiliateTag, keywords) VALUES
('microphone', 'Audio-Technica AT2020', 'B00051E7AE', 'infinitycreators-20', 'microphone,usb,recording,podcast'),
('lighting', 'Neewer LED Ring Light', 'B01LXMBHVG', 'infinitycreators-20', 'ring light,led,lighting,softbox'),
('camera', 'Sony ZV-1', 'B08BYKNBQ1', 'infinitycreators-20', 'camera,vlogging,compact,4k'),
...
```

---

### 5.3 Intelligent Link Generation

**Prompt Template for Gemini:**
```
Analyze this script and identify all equipment/products mentioned.
For each product, suggest an Amazon affiliate link from this list: [affiliate_links]

Return JSON:
{
  "replacements": [
    {
      "original": "ring light",
      "replacement": "[Neewer LED Ring Light](https://amazon.com/...?tag=infinitycreators-20)",
      "category": "lighting"
    }
  ]
}
```

---

## 6. Environment Variables

### Backend (Server-Side Only)

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host/db` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature secret | `whsec_...` |
| `JWT_SECRET` | Session cookie signing | Auto-generated |
| `VITE_APP_ID` | Manus OAuth app ID | Auto-generated |
| `OAUTH_SERVER_URL` | Manus OAuth endpoint | Auto-generated |

### Frontend (Public, Prefixed with `VITE_`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_live_...` |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal | Auto-generated |

---

## 7. Security Considerations

### 7.1 API Key Protection
- **Gemini API Key:** Never exposed to client. All generation requests go through `/api/trpc` procedures on the server.
- **Stripe Secret Key:** Server-only. Used only in webhook handler and subscription management.
- **Webhook Secret:** Verified on every webhook to prevent unauthorized requests.

### 7.2 Credit Logic
- Credits are deducted **server-side only** after successful generation.
- No client-side credit manipulation is possible.
- All credit transactions are logged in `credits_transactions` for audit trail.

### 7.3 User Isolation
- Each user can only access their own data via `ctx.user.id` in protected procedures.
- Stripe customer IDs are linked to user accounts to prevent cross-user access.

---

## 8. Deployment Architecture

### 8.1 Vercel Configuration
- **Runtime:** Node.js 18+
- **Build Command:** `pnpm build`
- **Start Command:** `pnpm start`
- **Environment:** All secrets stored in Vercel project settings

### 8.2 Database
- **Host:** MySQL/TiDB (managed by Manus platform)
- **Connection:** Via `DATABASE_URL` environment variable
- **Migrations:** Run `pnpm db:push` before deployment

### 8.3 Stripe Webhook
- **Endpoint:** `https://{project}.vercel.app/api/webhooks/stripe`
- **Events:** `checkout.session.completed`, `customer.subscription.updated`
- **Signature Verification:** HMAC-SHA256 using `STRIPE_WEBHOOK_SECRET`

---

## 9. Data Flow Diagrams

### 9.1 Generation Flow

```
User submits topic
    ↓
Frontend calls trpc.generation.create
    ↓
Server: Check user credits
    ↓
Server: Call Gemini API with prompt + affiliate links
    ↓
Server: Parse response and insert affiliate links
    ↓
Server: Deduct 1 credit from user
    ↓
Server: Log generation in generation_logs
    ↓
Return script to frontend
```

---

### 9.2 Payment Flow

```
User clicks "Buy Credits" or "Subscribe"
    ↓
Frontend calls trpc.credits.createCheckoutSession or trpc.subscription.createCheckoutSession
    ↓
Server: Create Stripe Checkout Session with user email in metadata
    ↓
Return checkout URL to frontend
    ↓
Frontend redirects to Stripe Checkout
    ↓
User completes payment
    ↓
Stripe sends webhook to /api/webhooks/stripe
    ↓
Server: Verify webhook signature
    ↓
Server: Find user by email
    ↓
Server: Update user.credits or user.plan
    ↓
Server: Log transaction
    ↓
Stripe redirects user to success page
```

---

## 10. Performance & Scalability

### 10.1 Caching Strategy
- **Affiliate Links:** Cache in memory for 1 hour (rarely change)
- **User Data:** No client-side caching; fetch fresh on each session
- **Generation Results:** Store in database for analytics

### 10.2 Rate Limiting
- **Gemini API:** Implement exponential backoff for retries
- **Generation Endpoint:** Max 10 requests per minute per user
- **Stripe Webhook:** Idempotent handler (safe to retry)

### 10.3 Scalability
- **Stateless Design:** No server-side sessions; all state in database
- **Horizontal Scaling:** Deploy multiple instances behind load balancer
- **Database:** MySQL with connection pooling via Drizzle ORM

---

## 11. Monitoring & Analytics

### 11.1 Key Metrics
- **Daily Active Users (DAU):** Users who generated at least one script
- **Conversion Rate:** Free users → paid users
- **Affiliate Revenue:** Tracked via Amazon Associates dashboard
- **API Latency:** Gemini response time + database query time
- **Error Rate:** Failed generations / total generations

### 11.2 Logging
- All errors logged to console (Vercel logs)
- Generation logs stored in database for user analytics
- Stripe webhook events logged for debugging

---

## 12. Future Enhancements

1. **AI Model Selection:** Allow users to choose between Gemini, GPT-4, Claude
2. **Custom Affiliate Links:** Users can add their own Amazon Associates tags
3. **Batch Generation:** Generate multiple scripts in one request
4. **Export Formats:** PDF, video subtitle format, social media captions
5. **Team Collaboration:** Multiple users per agency account
6. **Advanced Analytics:** Dashboard showing revenue, user retention, etc.

---

## Conclusion

This architecture provides a secure, scalable, and maintainable foundation for the Infinity Creators Micro-SaaS. The separation of concerns (frontend, API, database, external services) allows for independent scaling and updates. The credit-based monetization model combined with Stripe integration creates a sustainable revenue stream, while the intelligent affiliate system enables passive income through product recommendations.
