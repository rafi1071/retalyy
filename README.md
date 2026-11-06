# Retalyy Platform Monorepo

Autonomous AI accounting, onboarding intake, and transaction processing platform.

## Repository Architecture

This repository is organized as a monorepo following the Cloudflare deployment model:

```
retalyy/
├── frontend/                     # Cloudflare Pages (Vite + React 19 + Tailwind CSS)
│   ├── src/
│   │   ├── crm/                 # Retalyy CRM & Accounting Engine UI
│   │   ├── components/          # Portal & Client workspaces
│   │   └── services/apiClient.ts# API routing helper
│   ├── public/                  # Static assets & Cloudflare headers/redirects
│   ├── vite.config.ts           # Development proxy & build config
│   └── package.json
│
├── backend/                      # Cloudflare Workers (Hono + @google/genai)
│   ├── src/
│   │   ├── index.ts             # Cloudflare Worker API entry point
│   │   ├── services/            # Context builder & deterministic validation engine
│   │   ├── types/               # Accounting & engine contracts
│   │   └── data/                # Chart of Accounts & mock test cases
│   ├── wrangler.toml            # Cloudflare Worker deployment configuration
│   └── package.json
│
├── .github/workflows/deploy.yml # Automatic CI/CD deployment pipeline
├── DEPLOYMENT.md                # Complete step-by-step Cloudflare deployment guide
└── package.json                 # Monorepo workspaces configuration
```

## Quick Start

### 1. Run Backend Worker locally
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:8787
```

### 2. Run Frontend locally
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000 (proxies /api requests to :8787)
```

## Deployment

Refer to [DEPLOYMENT.md](file:///./DEPLOYMENT.md) for full instructions on deploying:
- `frontend` to **Cloudflare Pages** (Free tier)
- `backend` to **Cloudflare Workers** (Free tier)

