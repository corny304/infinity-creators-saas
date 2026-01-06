# 🚀 Infinity Creators

**AI-powered viral script generator for OnlyFans creators and content creators.**

Generate engaging TikTok, Instagram Reels, and YouTube Shorts scripts in 30 seconds using advanced AI. Optimized for OnlyFans creators with specialized templates for PPV upsells, story polls, link-in-bio funnels, and more.

---

## ⚡ Quick Deploy

### Railway (Recommended - Full-Stack)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Vercel (Frontend + Serverless API)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**📖 Full deployment guide**: [DEPLOYMENT_RAILWAY_VERCEL.md](./DEPLOYMENT_RAILWAY_VERCEL.md)

---

## ✨ Features

### 🎯 Core Features

- **AI Script Generation** - Generate viral shorts scripts using Google Gemini AI in 30 seconds
- **7 OF-Specific Templates** - Pre-built templates optimized for OnlyFans creators
- **Credit System** - Pay-per-generation model with atomic transaction handling
- **Stripe Integration** - Subscriptions and one-time credit purchases
- **Viral Referral System** - Earn 5 credits when referred users make their first purchase
- **Affiliate Link Injection** - Automatic monetization through product recommendations

### 💳 Monetization

- **Pro Plan**: $19/month (unlimited credits)
- **Agency Plan**: $39.99/month (unlimited credits)
- **Credit Packs**: 10/$4.99, 50/$19.99, 100/$29.99

---

## 🛠 Tech Stack

**Frontend:** React 19, Tailwind CSS 4, Wouter, shadcn/ui, tRPC Client
**Backend:** Express 4, tRPC 11, Drizzle ORM
**Database:** MySQL/PostgreSQL
**Payments:** Stripe
**AI:** Google Gemini API
**Email:** SendGrid

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x+
- pnpm 10.x+
- MySQL or PostgreSQL database
- Google Gemini API Key
- Stripe Account
- SendGrid API Key

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/infinity-creators-saas.git
cd infinity-creators-saas

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env and fill in your API keys

# Setup database
pnpm db:push
node scripts/seed-of-templates.mjs

# Start development server
pnpm dev
```

Visit `http://localhost:5173`

---

## 🚢 Deployment

### Railway (Full-Stack - Recommended)

1. Push code to GitHub
2. Create new Railway project from GitHub repo
3. Add MySQL database service
4. Configure environment variables
5. Deploy automatically

**Detailed guide**: [DEPLOYMENT_RAILWAY_VERCEL.md](./DEPLOYMENT_RAILWAY_VERCEL.md#option-1-deploy-full-stack-to-railway)

### Vercel (Serverless)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy automatically

**Detailed guide**: [DEPLOYMENT_RAILWAY_VERCEL.md](./DEPLOYMENT_RAILWAY_VERCEL.md#option-2-deploy-full-stack-to-vercel)

---

## 🔐 Authentication ⚠️ 

**Important**: This app currently uses Manus OAuth which only works on Manus platform.

**For Railway/Vercel deployment**, you must migrate to a different auth provider:
- **Recommended**: Clerk (drop-in replacement, 2-4 hours migration)
- **Alternative**: Auth0, NextAuth, or custom JWT

**Migration Guide**: [AUTH_MIGRATION.md](./AUTH_MIGRATION.md)

---

## 🔧 Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="mysql://user:pass@host:3306/database"

# Authentication (after migration)
JWT_SECRET="random_32_char_secret"

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
SENDGRID_API_KEY="SG...."
FROM_EMAIL="info@infinitycreators.com"
```

**Full guide**: [ENV_VARIABLES.md](./ENV_VARIABLES.md)

---

## 📁 Project Structure

```
infinity-creators-saas/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utils & tRPC client
├── server/                # Express + tRPC backend
│   ├── _core/            # Core framework
│   ├── routers/          # tRPC routers
│   ├── webhooks/         # Stripe webhooks
│   └── services/         # Business logic
├── drizzle/              # Database schema
├── scripts/              # Utility scripts
├── vercel.json           # Vercel config
├── railway.toml          # Railway config
└── Procfile              # Railway start command
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# TypeScript type check
pnpm check

# Lint code
pnpm lint
```

---

## 📖 Documentation

- **Deployment**: [DEPLOYMENT_RAILWAY_VERCEL.md](./DEPLOYMENT_RAILWAY_VERCEL.md)
- **Auth Migration**: [AUTH_MIGRATION.md](./AUTH_MIGRATION.md)
- **Environment Variables**: [ENV_VARIABLES.md](./ENV_VARIABLES.md)

---

## 💰 Estimated Costs

### Railway (Full-Stack)
- **Hobby**: $10/month (backend + MySQL)
- **Pro**: $25/month (unlimited)

### Vercel + External DB
- **Vercel Free**: $0 (frontend)
- **PlanetScale**: $29/month (database)
- **Total**: ~$29/month

### Recommended: Hybrid
- **Vercel Free**: Frontend ($0)
- **Railway Hobby**: Backend + DB ($10)
- **Total**: $10/month

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI-powered script generation
- **Stripe** - Payment processing infrastructure
- **shadcn/ui** - Beautiful accessible components
- **Drizzle ORM** - Type-safe database queries
- **tRPC** - End-to-end type-safe APIs

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/infinity-creators-saas/issues)
- **Email**: support@infinitycreators.com

---

**Built with ❤️ by the Infinity Creators Team**

**Ready for Railway & Vercel Deployment** 🚀
