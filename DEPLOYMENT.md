# Retalyy Deployment Guide: Cloudflare Pages + Cloudflare Workers

This repository is structured as a high-performance, cost-effective monorepo deployed entirely on **Cloudflare's Free Tier**:
- **Frontend (`frontend/`)**: Hosted on **Cloudflare Pages** (Free: unlimited bandwidth, automatic SSL, global CDN edge).
- **Backend (`backend/`)**: Hosted on **Cloudflare Workers** with Hono & `@google/genai` (Free tier: 100,000 requests/day, 0ms cold starts).

```
                      ┌──────────────────────────────┐
                      │    One GitHub Repository     │
                      │      (Retalyy Monorepo)      │
                      └──────────────┬───────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        ┌─────────────────┐                     ┌─────────────────┐
        │   frontend/     │                     │    backend/     │
        │  (Vite + React) │                     │ (Worker / Hono) │
        └────────┬────────┘                     └────────┬────────┘
                 │                                       │
                 ▼                                       ▼
     ☁️ Cloudflare Pages                     ⚡ Cloudflare Workers
        (Static Hosting)                        (Edge API / Gemini)
```

---

## 1. Local Development

### Prerequisites
- Node.js 20+ installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (`npm install -g wrangler` or `npx wrangler`)

### Quick Start

1. **Install dependencies:**
   ```bash
   # In frontend/
   cd frontend
   npm install

   # In backend/
   cd ../backend
   npm install
   ```

2. **Configure backend local secrets:**
   In `backend/`, copy the example file:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run both concurrently:**
   - **Terminal 1 (Backend Worker on port 8787):**
     ```bash
     cd backend
     npm run dev
     ```
   - **Terminal 2 (Frontend Vite on port 3000):**
     ```bash
     cd frontend
     npm run dev
     ```
   The frontend automatically proxies `/api/*` to `http://localhost:8787` during development!

---

## 2. Deploying the Backend to Cloudflare Workers

1. **Log into Cloudflare via Wrangler:**
   ```bash
   cd backend
   npx wrangler login
   ```

2. **Add your Gemini API Key as a Cloudflare Secret:**
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```
   *(When prompted, paste your Gemini API key)*

3. **Deploy the Worker:**
   ```bash
   npm run deploy
   ```
   Wrangler will output your live worker URL, for example:
   ```text
   https://retalyy-backend.<your-subdomain>.workers.dev
   ```

4. **Verify the Worker is running:**
   Visit:
   ```text
   https://retalyy-backend.<your-subdomain>.workers.dev/health
   ```
   You should see:
   ```json
   { "status": "ok", "service": "retalyy-backend", "runtime": "cloudflare-worker" }
   ```

---

## 3. Deploying the Frontend to Cloudflare Pages

### Option A: Connected to GitHub (Recommended)
1. Push your repository to GitHub.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/):
   - Navigate to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
   - Select your Retalyy repository.
3. Configure the build parameters:
   - **Project name:** `retalyy`
   - **Framework preset:** `Vite`
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Environment Variables**:
   Add the following environment variable under **Settings** → **Environment variables**:
   - `VITE_API_BASE_URL`: `https://retalyy-backend.<your-subdomain>.workers.dev`
5. Click **Save and Deploy**. Cloudflare Pages will build and deploy your app.

### Option B: Deploy Directly via CLI
```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=retalyy
```

---

## 4. Custom Domains & Unified Routing (Optional)

If you own a domain connected to Cloudflare (e.g., `retalyy.com`):

### Approach 1: Subdomain Architecture
- Frontend: `app.retalyy.com` (Cloudflare Pages Custom Domain)
- Backend: `api.retalyy.com` (Cloudflare Worker Custom Domain)
- Set `VITE_API_BASE_URL=https://api.retalyy.com` in Pages build settings.

### Approach 2: Single-Domain Routing (No CORS)
- Set custom domain on Pages: `retalyy.com`
- In Cloudflare Dashboard → **Websites** → `retalyy.com` → **Workers Routes**:
  - Add route: `retalyy.com/api/*` targeting the `retalyy-backend` Worker.
- In this setup, leave `VITE_API_BASE_URL` empty; requests to `/api/*` stay on the same origin and are routed straight to the Worker!

---

## 5. Automated CI/CD (GitHub Actions)

A pre-configured GitHub Actions workflow is available at [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml).

To enable automatic continuous deployment on every `git push`:
1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**.
2. Add the following repository secrets:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API Token with `Workers & Pages:Edit` permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found on your dashboard URL or worker settings).
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `VITE_API_BASE_URL`: The URL of your deployed Worker (e.g. `https://retalyy-backend.workers.dev`).

