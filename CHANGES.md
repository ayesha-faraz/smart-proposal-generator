# Propel Enhancement Summary

## Added

- Checkpoint 1 build log in Markdown and PDF.
- Checkpoint submission guide and raw-run checklist.
- Server-side Groq connection verification through `GET /api/health` for local and Vercel deployments.
- Visible `Live tool connected: Groq API` status above the form.
- `npm run verify:live` and `npm run checkpoint:ready` commands.
- Three new core tests for live-connection status and one component test for the connection badge.
- Formatted capstone design PDF included in the project root.
- Mandatory client-side validation for every proposal form field.
- Email, URL, phone, budget, text-length, timeline, percentage, and placeholder checks.
- Warnings for absolute guarantees, prompt-injection-style text, and unresolved placeholders.
- Server-side validation so API calls cannot bypass the browser form.
- Grounded system instructions that prohibit invented pricing, credentials, clients, services, or outcomes.
- Strict structured-output generation with a post-generation quality gate.
- Review and edit mode before PDF creation.
- Controlled regeneration of individual proposal sections.
- Explicit approval requirement before the PDF download button is enabled.
- Quality checks for section completeness, scope size, investment rows, budget totals, placeholders, and unapproved guarantees.
- Improved multi-page PDF layout, repeated investment headers, page numbers, and confidentiality footers.
- A separate section-regeneration API for both Express and Vercel deployments.
- Core unit tests, UI test updates, and an end-to-end approval-flow test.
- Capstone design, testing deliverable, product requirements, AI decisions, and setup documentation.

## Main files

- `proposal-core.js`: shared server-side validation, prompts, Groq calls, live health check, generation, and section regeneration.
- `src/app/lib/proposalValidation.ts`: browser-side input and output checks.
- `src/app/components/ProposalForm.tsx`: mandatory fields, validation messages, and warning acknowledgement.
- `src/app/components/ProposalView.tsx`: review, edit, regenerate, quality gate, approval, and PDF control.
- `src/app/lib/downloadProposalPdf.ts`: safer pagination and professional PDF footer/table behavior.
- `api/generate-proposal.js`, `api/regenerate-section.js`, and `api/health.js`: serverless endpoints.
- `CAPSTONE_AGENT_DESIGN.md`: assignment-ready design specification.
- `TESTING_DELIVERABLE.md`: evaluation and execution evidence.
- `BUILD_LOG.md`: real checkpoint iteration, failures, scope cuts, and deviation record.
- `CHECKPOINT_1_SUBMISSION.md`: final run and submission instructions.

## Verification completed in this environment

- `node --test tests/proposal-core.test.js`: 14 tests passed.
- Node syntax checks passed for the shared core, Express server, and both API routes.
- TypeScript/TSX transpilation syntax checks passed across the source tree.
- Express API smoke tests confirmed validation errors and 404 handling.

## Environment limitation

The full Vite, Vitest, and Playwright suites could not be executed because the available npm registry returned package-not-found errors while installing dependencies. Run `npm install`, `npm run test:run`, `npm run test:e2e`, and `npm run build` in a normal local npm environment before deployment.
