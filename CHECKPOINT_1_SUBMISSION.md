# Checkpoint 1 Submission Guide

## Submit these three items

1. **Working agent**: the complete updated project ZIP or the redeployed application link.
2. **Build log**: `BUILD_LOG.pdf` or `BUILD_LOG.md`.
3. **Raw run capture**: one unedited screen recording of approximately two minutes.

## What the successful run must show

The full loop should be visible without changing the generated proposal text:

1. Open the updated application.
2. Show `Live tool connected: Groq API` above the form.
3. Complete or use the pre-filled mandatory fields.
4. Click **Generate Proposal**.
5. Leave the loading period in the recording.
6. Show the generated proposal and automated quality checks.
7. Do not use **Edit Draft**, **Regenerate**, or **Regenerate Section**.
8. Tick the approval checkbox.
9. Click **Download PDF**.
10. Open the downloaded PDF and scroll through it.

The approval checkbox is a guardrail, not hand-editing.

## Before recording

Create `.env` from `.env.example` and add the private Groq key:

```env
GROQ_API_KEY=your_private_key
GROQ_MODEL=openai/gpt-oss-20b
PORT=3001
```

Then run:

```bash
npm ci
npm run checkpoint:ready
npm run dev
```

`npm run checkpoint:ready` must show:

- Core tests passed
- Groq API connection verified

## Recommended recording title

`Propel_Checkpoint_1_Raw_End_to_End_Run.mp4`

## Submission statement

> Propel is a form-based AI proposal-generation agent. It accepts a complete structured client brief, uses a live server-side Groq connection to generate a grounded proposal, validates the result, requires human approval, and creates a downloadable PDF. The attached raw capture shows the complete loop without mid-run hand-editing. The build log records the implementation changes, failures, scope cuts, and deviation from the earlier study-coach concept.

## Final checklist

- [ ] Updated project is deployed or locally runnable
- [ ] Groq status shows connected
- [ ] `npm run test:core` passes
- [ ] `npm run verify:live` passes
- [ ] Video is one continuous recording
- [ ] No proposal text is edited during the run
- [ ] Downloaded PDF is opened in the video
- [ ] Build log is uploaded
- [ ] Project ZIP or deployment link is uploaded
- [ ] API key is not visible in the recording or submitted files
