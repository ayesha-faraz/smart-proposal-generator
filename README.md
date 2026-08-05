# Propel

Propel is an AI proposal generator concept for agencies that turns client context into a structured proposal preview and downloadable PDF.

Live demo: [https://propel-kappa.vercel.app](https://propel-kappa.vercel.app)

## Problem

Agencies and consultants lose time rewriting proposal structures and manually formatting sales documents. Propel uses a complete mandatory form so the proposal begins with a consistent set of client, project, timeline, and commercial inputs.

Propel validates the form, verifies the live Groq tool connection, generates a grounded proposal draft, runs commercial and content checks, supports human review and controlled section revision, and downloads the approved result as a polished PDF.

## Core Users

- Agencies and freelancers preparing proposals for leads.
- Businesses that need a clearer way to explain project goals.
- Sales teams that want repeatable proposal formatting and faster turnaround.

## Key Features

- Login/register demo flow with local session storage.
- Complete mandatory proposal form for business, client, audience, goals, competitors, budget, timeline, tone, urgency, and language.
- Client and server validation for required content, contact formats, budget, risky claims, instruction-like text, placeholders, and timeline consistency.
- Server-side Groq generation with strict structured output and grounding guardrails.
- Visible live-tool status backed by `GET /api/health`, which verifies the server-side Groq connection without exposing the API key.
- Generated proposal preview with executive summary, problem statement, opportunity, solution, scope, timeline, investment, and next steps.
- Automated quality checks before finalization.
- Manual section editing and controlled single-section regeneration.
- Explicit human approval before PDF generation.
- Improved `jsPDF` pagination, investment tables, page numbers, and confidentiality footer.
- Saved proposals list inside the session.
- Responsive dark glass UI with orange Propel brand accents.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- jsPDF
- Vercel
- Node test runner, Vitest, and Playwright

## Local Setup

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Tests

```bash
npm run test:core
npm run test:run
npm run test:e2e
npm run verify:live
```

The core tests do not call Groq. Component and browser tests mock the AI routes. `npm run verify:live` is different: it uses the private `.env` key to perform a real Groq connection check before the raw checkpoint recording.

## Deployment

The project is deployed on Vercel:

[https://propel-kappa.vercel.app](https://propel-kappa.vercel.app)

## Project Documentation

| Section | Link |
| --- | --- |
| Problem Statement | [docs/problem-statement.md](docs/problem-statement.md) |
| User Research | [docs/user-research.md](docs/user-research.md) |
| Competitor Analysis | [docs/competitor-analysis.md](docs/competitor-analysis.md) |
| Personas | [docs/personas.md](docs/personas.md) |
| User Journey | [docs/user-journey.md](docs/user-journey.md) |
| Product Requirements | [docs/product-requirements.md](docs/product-requirements.md) |
| Wireframes | [docs/wireframes.md](docs/wireframes.md) |
| Design Decisions | [docs/design-decisions.md](docs/design-decisions.md) |
| AI Decisions | [docs/ai-decisions.md](docs/ai-decisions.md) |
| Business Impact | [docs/business-impact.md](docs/business-impact.md) |
| Tech Stack | [docs/tech-stack.md](docs/tech-stack.md) |
| Challenges | [docs/challenges.md](docs/challenges.md) |
| Reflection | [docs/reflection.md](docs/reflection.md) |
| Future Improvements | [docs/future-improvements.md](docs/future-improvements.md) |
| Capstone Agent Design | [CAPSTONE_AGENT_DESIGN.md](CAPSTONE_AGENT_DESIGN.md) |
| Testing Deliverable | [TESTING_DELIVERABLE.md](TESTING_DELIVERABLE.md) |
| MVP Build Log | [BUILD_LOG.md](BUILD_LOG.md) |
| Checkpoint 1 Submission Guide | [CHECKPOINT_1_SUBMISSION.md](CHECKPOINT_1_SUBMISSION.md) |

## Checkpoint 1 MVP

The narrow successful run is:

```text
Mandatory form -> live Groq generation -> automated checks -> human approval -> PDF download
```

No proposal text must be edited during the recorded checkpoint run. The edit and single-section regeneration features are optional recovery controls and should not be used in the raw capture. The approval checkbox is a final-action guardrail, not hand-editing.

Before recording:

```bash
npm ci
npm run checkpoint:ready
npm run dev
```

See `CHECKPOINT_1_SUBMISSION.md` for the exact unedited recording sequence.

## Live Groq proposal generation

The proposal form sends validated data to `POST /api/generate-proposal`. The Node server reads `GROQ_API_KEY` from `.env`, calls Groq, validates the structured proposal JSON, and returns it to the React proposal view. Controlled narrative regeneration uses `POST /api/regenerate-section`.

### Run locally

1. Use Node.js 20 or newer.
2. Copy `.env.example` to `.env` and add a valid Groq API key.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The frontend proxies `/api` requests to the Express server on port 3001. Do not rename the key to `VITE_GROQ_API_KEY`, because Vite-prefixed values can be exposed to browser code.

### Production

Run `npm run build`, then `npm start`. The Express server serves both the generated `dist` frontend and the API endpoint. Set `GROQ_API_KEY`, `GROQ_MODEL`, `PORT`, and `NODE_ENV=production` in the hosting platform's environment settings.

## Deploying to Vercel

This repository includes a Vercel Function at `api/generate-proposal.js`. The browser posts the completed form to `/api/generate-proposal`; the function calls Groq with the private server-side key and returns the generated proposal.

1. Revoke any Groq key that has been shared publicly and create a fresh key.
2. Import this project into Vercel, or run `vercel` from the project directory after signing in.
3. In **Project Settings → Environment Variables**, add:
   - `GROQ_API_KEY` = your new Groq key
   - `GROQ_MODEL` = `openai/gpt-oss-20b` (optional)
4. Apply the variables to Production, Preview, and Development as needed, then deploy.

Do not add the real key to `.env.example`, commit it to Git, or prefix it with `VITE_`. Variables prefixed with `VITE_` are bundled into browser code.

### Local development

Create a private `.env` file from `.env.example`, then run:

```bash
npm install
npm run dev
```

The local development script still starts the Vite frontend and local Node API. Vercel uses `api/generate-proposal.js` in deployed environments.
