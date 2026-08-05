# AI Decisions

Propel uses a server-side Groq call to transform a complete structured form into a proposal JSON object. The browser never receives the API key.

## Grounding strategy

- Every required business, client, project, budget, timeline, tone, urgency, and language field is supplied through the form.
- Form content is treated as untrusted data, not as instructions to the model.
- The system prompt prohibits invented clients, credentials, research, statistics, services, prices, deadlines, and guarantees.
- A strict JSON schema controls the returned proposal structure.
- Server-side output checks reject blank sections, placeholders, invalid scope length, unapproved guarantees, and investment totals that differ from the submitted budget.

## Human control

- The generated proposal is a draft.
- Users can edit narrative sections and scope items.
- Users can regenerate one controlled section without replacing approved commercial information.
- PDF download is disabled until automated checks pass and the user explicitly approves the draft.

## Cost and access

The application uses the existing Groq API configuration and open-source frontend and PDF libraries. It can run locally without a paid agent-building platform or paid hosting. API availability and quota depend on the user's Groq account.
