# Deployment Guide

## Quick Start

### 1. Initialize Git and Push

```bash
cd /Users/federicodeponte/Downloads/enrich-saas

# Initialize git (if not already done)
git init

# Add all files
git add -A

# Create initial commit
git commit -m "Initial commit: GTM OS Enrich MVP

Features:
- Next.js 15 + TypeScript + Tailwind CSS
- 6-step enrichment workflow
- CSV upload with drag & drop  
- Natural language enrichment requests
- AI-generated plans with cost/time estimates
- Sample testing (5 rows)
- Real-time progress tracking
- CSV download with proper escaping
- shadcn/ui components
- Async enrichment support ready
- Fixed React setState errors
- Improved download with CSV escaping"

# Create GitHub repo
gh repo create gtm-os-enrich --public --source=. --remote=origin --push

# Or manually:
# 1. Go to github.com/new
# 2. Name it "gtm-os-enrich"
# 3. Don't initialize with README
# 4. Then run:
git remote add origin https://github.com/YOUR_USERNAME/gtm-os-enrich.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or use Vercel Dashboard:
# 1. Go to vercel.com/new
# 2. Import your GitHub repo
# 3. Click Deploy
```

## Environment Variables

Copy `env.example` to `.env.local` and fill in your API keys:

```bash
cp env.example .env.local
```

Required for production:
- `GEMINI_API_KEY` - For AI enrichment
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret
- `STRIPE_SECRET_KEY` - Payment processing

## Repository Description

> AI-powered data enrichment platform. Upload CSV, describe what you need in natural language, and let AI enrich your data automatically. Built with Next.js, TypeScript, and shadcn/ui.

## Topics

Add these topics to your GitHub repo:
- `ai`
- `data-enrichment`
- `csv`
- `nextjs`
- `typescript`
- `saas`
- `shadcn-ui`
- `gemini`
- `llm`
- `automation`

## Next Steps

1. Set up backend API routes
2. Add authentication (Clerk/NextAuth)
3. Integrate real AI APIs
4. Set up database (PostgreSQL + Prisma)
5. Add payment processing (Stripe)
6. Deploy to production
