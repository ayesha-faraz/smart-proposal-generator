# Product Requirements

## Functional requirements

- Users can enter a demo login/register flow.
- Every proposal form field is mandatory; users may enter `N/A` only where the field genuinely does not apply.
- The application validates contact formats, budget, minimum detail, risky claims, instruction-like text, placeholders, and possible timeline conflicts.
- The server generates a structured proposal from the submitted form through Groq.
- The server verifies the generated structure, scope length, investment total, placeholders, and guarantee language.
- Users can preview the proposal, edit narrative sections and scope, or regenerate one controlled section.
- The application displays automated quality checks.
- Users must explicitly approve the reviewed draft before PDF download.
- The final PDF includes proposal sections, scope, investment, page breaks, page numbering, and a confidentiality footer.

## Non-functional requirements

- API keys remain server-side and must not be committed.
- The UI should be responsive and accessible by standard labels, roles, and controls.
- Proposal generation failures must provide a retry path.
- PDF generation must not proceed while blocking quality issues remain.
- External AI calls must be mocked in automated tests.
