# Automated Testing Deliverable

Propel's highest-risk path is the complete form-to-proposal-to-PDF workflow. The tests therefore cover input integrity, prompt-injection resistance, generated-output validation, human approval, controlled section regeneration, and safe live-connection status behaviour. Automated tests do not call the real Groq API.

## Included

- Node core tests for server-side form and output guardrails.
- Node tests for unconfigured, successful, and failed Groq health-check states.
- Component coverage for the visible live-tool status.
- Vitest and React Testing Library tests for form validation, risk acknowledgement, proposal states, quality checks, editing controls, approval, and section regeneration.
- Playwright test for the primary browser workflow with a mocked AI response.
- Accessible queries by role, label, heading, and visible text. No test IDs.
- GitHub Actions workflow that runs core, component, and end-to-end tests.

## Capstone evaluation cases

| ID | Test | Pass condition |
| --- | --- | --- |
| E-01 | Complete valid form | The request passes validation and a structured proposal can be generated. |
| E-02 | Invalid commercial input | Invalid email, website, phone, or non-positive budget is rejected. |
| E-03 | Absolute-results claim | Guarantee wording is surfaced for explicit review and is not strengthened by the model. |
| E-04 | Prompt injection in form data | Instruction-like text is treated as data, never as an agent command. |
| E-05 | Investment mismatch | PDF approval is blocked when the three investment rows do not equal the submitted budget. |
| E-06 | Placeholder output | TBD, template tokens, and unresolved placeholders block approval. |
| E-07 | Human approval | PDF download remains disabled until the user reviews and approves a valid draft. |
| E-08 | Controlled regeneration | Only approved proposal sections can be regenerated; commercial totals cannot be regenerated independently. |
| E-09 | Live tool unavailable | The interface reports a disconnected state without exposing secrets or crashing. |
| E-10 | Live tool connected | The health route confirms the external Groq connection and configured model. |

## Commands

```bash
npm ci
npm run test:core
npm run test:run
npx playwright install chromium
npm run test:e2e
npm run verify:live
```

The 14 core guardrail and connection-status tests use Node's built-in test runner and do not call external services:

```bash
npm run test:core
```

## AI-fix demonstration prompt

`Run the complete test suite, inspect any failure, fix the application without deleting or weakening the test, and rerun all tests until green.`

## Verified in the checkpoint update

```text
14 tests run
14 passed
0 failed
```

A real provider call was not performed in this build environment because no private Groq key was supplied. The owner must run `npm run verify:live` before recording.
