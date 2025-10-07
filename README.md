# GTM OS Enrich

A modern, AI-powered data enrichment platform that allows users to upload CSV files and enrich them with additional data using natural language requests.

**Live Demo:** [Coming Soon]

![GTM OS Enrich](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🎯 **Natural Language Requests**: Describe what you want to enrich in plain English
- 🤖 **AI-Powered Planning**: Automatically generates enrichment strategies and code
- 📊 **Data Preview**: Review your data before enrichment
- 🧪 **Sample Testing**: Test on 5 rows before running full enrichment
- ⚡ **Real-time Progress**: Monitor enrichment with live progress updates
- 📥 **Easy Export**: Download enriched CSV files

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **CSV Parsing**: PapaParse
- **File Upload**: react-dropzone
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## User Flow

1. **Upload CSV**: Drag & drop or select a CSV file
2. **Preview Data**: Review your data structure (first 5 rows shown)
3. **Describe Request**: Tell the AI what you want to enrich (e.g., "Add ZIP codes based on company address")
4. **Review Plan**: AI generates a strategy with cost and time estimates
5. **Test Sample**: Run enrichment on 5 rows to verify results
6. **Run Full Enrichment**: Process entire dataset with progress tracking
7. **Download Results**: Export enriched CSV file

## Project Structure

```
enrich-saas/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── enrichment-workflow.tsx    # Main workflow orchestrator
│   ├── file-upload.tsx            # CSV upload component
│   ├── data-preview.tsx           # Data preview table
│   ├── enrichment-request.tsx     # Natural language input
│   ├── enrichment-plan.tsx        # AI-generated plan display
│   ├── sample-results.tsx         # Sample enrichment results
│   ├── enrichment-progress.tsx    # Progress tracking
│   └── ui/                        # shadcn/ui components
└── lib/
    └── utils.ts              # Utility functions
```

## Next Steps for Production

### Backend Integration

Create API routes for:

```typescript
// app/api/analyze/route.ts
POST /api/analyze
- Analyze CSV structure and user request
- Generate enrichment strategy using LLM

// app/api/enrich/route.ts
POST /api/enrich
- Execute enrichment with real APIs
- Support both sample and full runs

// app/api/jobs/[id]/route.ts
GET /api/jobs/:id
- Poll job status for long-running enrichments
```

### Features to Add

1. **Authentication**: User accounts with Clerk or NextAuth
2. **Database**: Store enrichment history (PostgreSQL + Prisma)
3. **Job Queue**: Celery/BullMQ for background processing
4. **Payment**: Stripe integration for credits/subscriptions
5. **API Keys Management**: Let users add their own API keys
6. **Templates**: Pre-built enrichment templates
7. **Webhooks**: Notify users when enrichment completes
8. **Team Collaboration**: Share enrichments across teams

### Security

- Implement rate limiting
- Sandbox code execution (Docker/Firecracker)
- Validate and sanitize all inputs
- Encrypt API keys at rest
- Add CORS policies

### Monitoring

- Add error tracking (Sentry)
- Analytics (PostHog/Mixpanel)
- Performance monitoring
- Cost tracking per enrichment

## Environment Variables

Create a `.env.local` file:

```env
# AI Provider
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key

# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Payments
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Docker

```bash
docker build -t enrich-saas .
docker run -p 3000:3000 enrich-saas
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.