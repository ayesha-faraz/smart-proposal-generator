# Propel - Smart Proposal Generator

Propel is an AI-powered proposal generator for freelancers, agencies, consultants, and small businesses. Users enter business details, client information, budget, timeline, tone, urgency, and project brief, then generate a polished client-ready proposal.

## Features

- User registration and login
- Supabase-backed proposal history
- AI-generated proposal content
- Proposal options for tone, urgency, language, budget, and timeline
- Professional PDF export
- Saved proposals dashboard
- Node.js backend API with Express routes

## Tech Stack

- React
- Vite
- TypeScript
- Node.js
- Express
- Prisma schema
- Supabase
- Vitest
- Testing Library
- axe-core
- Lighthouse

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Start the dev server:

```bash
npm run dev
```

Install backend dependencies:

```bash
npm run backend:install
```

Start the backend API:

```bash
npm run backend:dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run the accessibility smoke audit:

```bash
npm run audit:a11y
```

Run Lighthouse against a production preview:

```bash
npm run build
npm run preview
npm run audit:lighthouse
```

## Backend

The backend is in `backend/` and includes:

- Express app setup in `backend/src/app.js`
- Node server entry with `app.listen` in `backend/src/server.js`
- API routes in `backend/src/routes/`
- Prisma schema in `backend/prisma/schema.prisma`

Backend routes:

- `GET /api/health`
- `GET /api/users`
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/proposals`
- `GET /api/proposals/:id`
- `POST /api/proposals`
- `DELETE /api/proposals/:id`

## Database

The Supabase schema is included in `supabase-schema.sql`.

## Quality Evidence

- Test runner: Vitest
- Test files:
  - `src/app/__tests__/app.test.tsx`
  - `src/app/__tests__/accessibility.test.tsx`
  - `backend/src/app.test.js`
- Latest test output: `docs/audits/test-latest.txt`
- Latest accessibility output: `docs/audits/a11y-latest.txt`
- Latest Lighthouse reports:
  - `docs/audits/lighthouse-local.report.html`
  - `docs/audits/lighthouse-local.report.json`
- Final Word submission packet:
  - `docs/deliverables/Propel_Submission_Packet_Lighthouse_97.docx`

Latest local Lighthouse scores:

| Category | Score |
| --- | ---: |
| Performance | 97 |
| Accessibility | 92 |
| Best Practices | 100 |
| SEO | 54 |

## Deployment

The app is configured for Vercel using `vercel.json`. The deployment checklist and rollback plan are documented in `docs/deployment-checklist.md`.
