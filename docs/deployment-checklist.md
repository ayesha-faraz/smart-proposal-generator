# Deployment Checklist and Rollback Plan

## Release Summary

- Project: Propel - Smart Proposal Generator
- Live deployment target: Vercel (`https://propel-kappa.vercel.app/`)
- Frontend: Vite React application in `src/`
- Backend: Express API in `backend/`, bridged for Vercel through `api/[...path].js`
- Database: Supabase schema documented in `supabase-schema.sql`

## Pre-Deployment Checklist

| Check | Status | Evidence |
| --- | --- | --- |
| Node.js project metadata present | Complete | Root `package.json`, `package-lock.json`, and backend `backend/package.json` |
| Frontend build succeeds | Complete with warning | `npm run build` produced `dist/`; Vite warned that some chunks exceed 500 kB |
| Automated tests pass | Complete | `docs/audits/test-latest.txt`; 3 test files and 5 tests passed |
| Accessibility audit captured | Complete | `docs/audits/a11y-latest.txt`; axe smoke audit passed |
| Lighthouse audit captured | Complete with cleanup warning | `docs/audits/lighthouse-local.report.html` and `.report.json`; Chrome temp cleanup returned `EPERM` after reports were written |
| Environment variables configured | Manual verification required | Confirm `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and backend secrets in Vercel |
| Secrets excluded from GitHub | Complete | `.env` and `.env.*` ignored except `.env.example` |
| Vercel rewrites configured | Complete | `vercel.json` routes `/api/*` to `api/[...path].js` and SPA routes to `index.html` |

## Deployment Steps

1. Install dependencies with `npm install`.
2. Run `npm test`.
3. Run `npm run build`.
4. Start a production preview with `npm run preview`.
5. Run `npm run audit:a11y` and `npm run audit:lighthouse`.
6. Review `docs/audits/` outputs for regressions.
7. Commit source, tests, audit evidence, and documentation.
8. Push to GitHub.
9. Deploy from the connected Vercel project or run the approved Vercel deployment workflow.

## Rollback Plan

1. In Vercel, open the `smart-proposal-generator` project.
2. Go to Deployments and select the last known-good deployment.
3. Use "Promote to Production" or redeploy the previous Git commit.
4. Confirm the homepage loads and `/api/health` returns `{ "ok": true }`.
5. Re-run `npm test` locally against the rollback commit if the issue appears code-related.
6. Document the incident, failed deployment URL, rollback deployment URL, and follow-up fix.

## Post-Deployment Smoke Checks

- Visit `/` and confirm the landing page renders.
- Visit `/login` and confirm the auth view renders.
- Visit `/api/health` and confirm the API returns healthy JSON.
- Test proposal creation flow with a non-production test account.
- Confirm browser console has no blocking runtime errors.

## Latest Local Lighthouse Scores

| Category | Score |
| --- | ---: |
| Performance | 97 |
| Accessibility | 92 |
| Best Practices | 100 |
| SEO | 54 |

## Known Release Notes

- Vite reports large on-demand PDF export chunks. This does not block deployment because they load only when a user downloads a PDF.
- SEO is reduced because `index.html` currently sets `noindex, nofollow`. Remove that only when production indexing is intended.
