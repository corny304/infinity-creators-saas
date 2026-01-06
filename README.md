# 🚀 Infinity Creators

**AI-powered viral script generator for OnlyFans creators and content creators.**

Generate engaging TikTok, Instagram Reels, and YouTube Shorts scripts in 30 seconds using advanced AI. Optimized for OnlyFans creators with specialized templates for PPV upsells, story polls, link-in-bio funnels, and more.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎯 Core Features

- **AI Script Generation** - Generate viral shorts scripts using Google Gemini AI in 30 seconds
- **7 OF-Specific Templates** - Pre-built templates optimized for OnlyFans creators:
  - ☕ Story-Poll Engagement (Morning) - Interactive polls for maximum engagement
  - 💰 PPV Upsell Teaser - High-conversion sales copy for Pay-Per-View content
  - 🤫 Link in Bio Funnel - TikTok/Reels safe-for-work teasers
  - 🎙️ Late Night Voice Note - Intimate customer retention scripts
  - 📖 Storytime & Reveal - Emotional connection stories with plot twists
  - 💡 Educational Hook - Value-first trust building content
  - 🤫 Link in Bio Teaser - Curiosity-driven marketing scripts

### 💳 Monetization

- **Credit System** - Pay-per-generation model with atomic transaction handling
- **Stripe Integration** - Subscriptions and one-time credit purchases
  - Pro Plan: $29/month (100 credits)
  - Agency Plan: $99/month (500 credits)
  - Credit Packs: 10/$5, 50/$20, 100/$35
- **Viral Referral System** - Earn 5 credits when referred users make their first purchase
- **Affiliate Link Injection** - Automatic monetization through product recommendations

### 🔐 Authentication & Security

- **Manus OAuth** - Secure authentication with automatic session management
- **Atomic Credit Deduction** - SQL transactions prevent double-spending
- **Input Validation** - Zod schemas for type-safe API requests
- **Stripe Webhook Verification** - Secure payment processing

### 📊 Analytics & Monitoring

- **Built-in Analytics** - Track UV/PV, user behavior, conversion rates
- **Generation Logs** - Complete audit trail of all AI generations
- **Credit Transaction History** - Transparent credit usage tracking
- **Referral Statistics** - Monitor viral growth metrics

---

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library with concurrent features
- **Tailwind CSS 4** - Utility-first CSS framework with custom design system
- **Wouter** - Lightweight client-side routing
- **shadcn/ui** - High-quality accessible component library
- **tRPC Client** - End-to-end type-safe API client

### Backend
- **Express 4** - Fast, minimalist web framework
- **tRPC 11** - End-to-end type-safe APIs with automatic type inference
- **Drizzle ORM** - Type-safe SQL ORM with MySQL support
- **Superjson** - Automatic serialization of complex types (Date, Map, Set)

### Database
- **MySQL/TiDB** - Relational database with automatic backups
- **Drizzle Kit** - Database migrations and schema management

### Third-Party Services
- **Google Gemini API** - AI script generation
- **Stripe** - Payment processing (subscriptions + one-time)
- **SendGrid** - Transactional email notifications
- **Manus OAuth** - Authentication provider
- **Manus Forge API** - Built-in LLM, storage, and notification services

### DevOps & Hosting
- **Manus Built-in Hosting** - Zero-config deployment with CDN
- **Vitest** - Fast unit testing framework
- **TypeScript** - Type-safe development
- **pnpm** - Fast, disk-efficient package manager

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.x or higher
- **pnpm** 9.x or higher
- **MySQL** database (or use Manus-provided database)
- **Google Gemini API Key** - [Get it here](https://ai.google.dev/)
- **Stripe Account** - [Sign up](https://stripe.com)
- **SendGrid API Key** - [Get it here](https://sendgrid.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/infinity-creators-saas.git
   cd infinity-creators-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```bash
   # Database
   DATABASE_URL="mysql://user:password@host:port/database"

   # AI Generation
   GEMINI_API_KEY="your_gemini_api_key"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_PRICE_PRO="price_..."
   STRIPE_PRICE_AGENCY="price_..."
   STRIPE_PRICE_CREDITS_10="price_..."
   STRIPE_PRICE_CREDITS_50="price_..."
   STRIPE_PRICE_CREDITS_100="price_..."

   # Email
   SENDGRID_API_KEY="your_sendgrid_api_key"
   FROM_EMAIL="info.infinitycreators@gmail.com"

   # Authentication (auto-configured on Manus)
   JWT_SECRET="your_jwt_secret_min_32_chars"
   OAUTH_SERVER_URL="https://api.manus.im"
   VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
   VITE_APP_ID="your_manus_app_id"
   ```

4. **Set up database**
   ```bash
   # Push schema to database
   pnpm db:push

   # Seed script templates
   node scripts/seed-of-templates.mjs

   # (Optional) Seed affiliate links
   node scripts/seed-affiliate-links.mjs
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

### Development Workflow

```bash
# Run development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build for production
pnpm build

# Preview production build
pnpm preview

# Database operations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
```

---

## 📁 Project Structure

```
infinity-creators-saas/
├── client/                    # Frontend React application
│   ├── public/               # Static assets (favicon, images)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── AIChatBox.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── TeaserGenerator.tsx
│   │   ├── pages/           # Page-level components
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Generator.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── Blog.tsx
│   │   ├── lib/             # Utilities and configurations
│   │   │   └── trpc.ts      # tRPC client setup
│   │   ├── App.tsx          # Routes and layout
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles & Tailwind
│   └── index.html           # HTML template
│
├── server/                   # Backend Express + tRPC application
│   ├── _core/               # Core framework (OAuth, LLM, etc.)
│   │   ├── context.ts       # tRPC context builder
│   │   ├── trpc.ts          # tRPC router setup
│   │   ├── oauth.ts         # OAuth authentication
│   │   ├── llm.ts           # Gemini API integration
│   │   ├── imageGeneration.ts
│   │   ├── voiceTranscription.ts
│   │   └── notification.ts
│   ├── routers/             # tRPC procedure routers
│   │   ├── generation.ts    # Script generation logic
│   │   ├── templates.ts     # Template management
│   │   ├── referral.ts      # Referral system
│   │   └── credits.ts       # Credit management
│   ├── webhooks/            # Webhook handlers
│   │   └── stripe.ts        # Stripe payment webhooks
│   ├── services/            # Business logic services
│   │   └── affiliateService.ts
│   ├── db.ts                # Database query helpers
│   ├── routers.ts           # Main tRPC router
│   └── index.ts             # Express server entry point
│
├── drizzle/                 # Database schema and migrations
│   └── schema.ts            # Drizzle ORM schema definitions
│
├── scripts/                 # Utility scripts
│   ├── seed-of-templates.mjs    # Seed OF-specific templates
│   ├── seed-affiliate-links.mjs # Seed affiliate links
│   └── setup-stripe.mjs         # Create Stripe products
│
├── shared/                  # Shared types and constants
│   ├── schema.ts            # Database schema exports
│   └── constants.ts         # Shared constants
│
├── storage/                 # S3 storage helpers
│   └── index.ts             # Storage utilities
│
├── tests/                   # Test files (co-located with source)
│   ├── server/
│   │   ├── generation.test.ts
│   │   ├── referral.test.ts
│   │   └── templates.test.ts
│
├── DEPLOYMENT.md            # Comprehensive deployment guide
├── README.md                # This file
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── drizzle.config.ts        # Drizzle ORM configuration
```

### Key Files

- **`server/routers.ts`** - Main tRPC router combining all procedure routers
- **`server/routers/generation.ts`** - AI script generation with atomic credit deduction
- **`server/routers/referral.ts`** - Viral referral system logic
- **`server/webhooks/stripe.ts`** - Stripe payment webhook handler
- **`drizzle/schema.ts`** - Database schema with all tables
- **`client/src/App.tsx`** - Frontend routing and layout
- **`client/src/pages/Generator.tsx`** - Main script generation UI

---

## 🚀 Deployment

This project is optimized for **Manus Built-in Hosting** with zero-config deployment.

### Quick Deploy (3 Steps)

1. **Add Secrets** in Manus Management UI → Settings → Secrets
2. **Run Migrations**: `pnpm db:push && node scripts/seed-of-templates.mjs`
3. **Click Publish** in Management UI

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Deployment Features

- ✅ **Zero-config deployment** - No Dockerfile, no vercel.json needed
- ✅ **Automatic SSL** - HTTPS configured automatically
- ✅ **Built-in CDN** - Global content delivery
- ✅ **Custom domains** - Purchase, bind, or modify subdomain
- ✅ **Automatic backups** - Daily database backups
- ✅ **Environment variables** - Managed through Manus UI

---

## 🔐 Environment Variables

### Automatic (Pre-configured by Manus)

These are automatically injected by the Manus platform:

- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session cookie signing secret
- `OAUTH_SERVER_URL` - Manus OAuth backend
- `VITE_OAUTH_PORTAL_URL` - Manus login portal
- `VITE_APP_ID` - Your Manus application ID
- `OWNER_OPEN_ID` - Your owner ID
- `OWNER_NAME` - Your name
- `BUILT_IN_FORGE_API_KEY` - Server-side API key
- `BUILT_IN_FORGE_API_URL` - Manus built-in APIs
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key
- `VITE_FRONTEND_FORGE_API_URL` - Frontend API URL

### Manual (You Must Add)

Add these through Manus Management UI → Settings → Secrets:

- `GEMINI_API_KEY` - Google Gemini API key for AI generation
- `STRIPE_SECRET_KEY` - Stripe secret key (test or live)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_LIVE_SECRET_KEY` - Stripe live secret key
- `STRIPE_LIVE_WEBHOOK_SECRET` - Stripe live webhook secret
- `STRIPE_PRICE_PRO` - Pro plan price ID
- `STRIPE_PRICE_AGENCY` - Agency plan price ID
- `STRIPE_PRICE_CREDITS_10` - 10 credits price ID
- `STRIPE_PRICE_CREDITS_50` - 50 credits price ID
- `STRIPE_PRICE_CREDITS_100` - 100 credits price ID
- `SENDGRID_API_KEY` - SendGrid API key for email notifications
- `FROM_EMAIL` - Email address to send from (must be verified in SendGrid)

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test referral.test.ts

# Run tests with coverage
pnpm test --coverage
```

### Test Coverage

- **46/50 tests passing (92%)**
- 17 referral system tests ✅
- 12 template system tests ✅
- 8 Stripe integration tests ✅
- 7 email service tests ✅

### Test Files

- `server/routers/generation.test.ts` - Script generation tests
- `server/routers/referral.test.ts` - Referral system tests
- `server/routers/templates.test.ts` - Template management tests
- `server/stripe.integration.test.ts` - Stripe webhook tests
- `server/email.test.ts` - Email notification tests

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- **TypeScript** - All code must be type-safe
- **ESLint** - Follow the project's ESLint configuration
- **Prettier** - Code is auto-formatted on commit
- **Conventional Commits** - Use conventional commit messages

### Testing Requirements

- All new features must include tests
- Maintain or improve test coverage (>90%)
- All tests must pass before merging

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Manus Platform** - Zero-config hosting and built-in services
- **Google Gemini** - AI-powered script generation
- **Stripe** - Payment processing infrastructure
- **shadcn/ui** - Beautiful accessible components
- **Drizzle ORM** - Type-safe database queries
- **tRPC** - End-to-end type-safe APIs

---

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/infinity-creators-saas/issues)
- **Manus Support**: https://help.manus.im
- **Email**: support@infinitycreators.com

---

## 🗺️ Roadmap

### v1.1 (Q1 2025)
- [ ] A/B testing for landing page optimization
- [ ] Interactive onboarding flow for new users
- [ ] Social proof integration (live generation counter, testimonials)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (German, Spanish, French)

### v1.2 (Q2 2025)
- [ ] Video script-to-video generation (AI voiceover + stock footage)
- [ ] Custom template builder for Pro/Agency users
- [ ] Team collaboration features (shared credits, multi-user accounts)
- [ ] API access for developers
- [ ] White-label solution for agencies

### v2.0 (Q3 2025)
- [ ] Mobile app (iOS + Android)
- [ ] Advanced AI features (voice cloning, personalized scripts)
- [ ] Marketplace for user-generated templates
- [ ] Integration with TikTok/Instagram APIs (auto-posting)
- [ ] Advanced monetization (revenue sharing, affiliate marketplace)

---

**Built with ❤️ by the Infinity Creators Team**

**Powered by Manus Platform**
