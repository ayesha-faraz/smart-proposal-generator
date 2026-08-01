import { Router } from "express";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { tools } from "../lib/ai/tools/index.js";

const router = Router();

// GROQ_API_KEY is read server-side only (set it in Vercel project
// settings for production, backend/.env for local dev). Never prefix
// it VITE_ — that would inline it into the browser bundle.
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", async (req, res, next) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY is not set. Add it to backend/.env locally, or as a Vercel env var in production.",
      });
    }

    const { messages } = req.body;

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You help score how well an agency's proposal fits a client deal " +
        "in a B2B services marketplace. As the conversation reveals details " +
        "(agency name, deal title, budget vs proposed price, whether " +
        "services match, track record, timeline realism, responsiveness), " +
        "call scoreDealFit once you know the agency name, deal title, and " +
        "at least one other signal. Never invent values the user hasn't " +
        "given you. After a score of 45 or higher, you may offer to call " +
        "requestAgencyIntro, but only if the user agrees — it always " +
        "requires their explicit confirmation in the UI.",
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(5),
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    next(error);
  }
});

export default router;
