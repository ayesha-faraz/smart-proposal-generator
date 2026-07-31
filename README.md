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
- jsPDF

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
