# Propel - Smart Proposal Generator

Propel is an AI-powered proposal generator for freelancers, agencies, consultants, and small businesses. Users enter business details, client information, budget, timeline, tone, urgency, and project brief, then generate a polished client-ready proposal.

## Features

- User registration and login
- Supabase-backed proposal history
- AI-generated proposal content
- Proposal options for tone, urgency, language, budget, and timeline
- Professional PDF export
- Saved proposals dashboard

## Tech Stack

- React
- Vite
- TypeScript
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

Build for production:

```bash
npm run build
```

## Database

The Supabase schema is included in `supabase-schema.sql`.
