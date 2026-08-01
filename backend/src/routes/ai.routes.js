import express from "express";
import { convertToModelMessages, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { scoreBrief, markPriorityOpportunity } from "../lib/ai/tools/index.js";

const router = express.Router();

router.post("/chat", async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "Messages are required." });
      return;
    }

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You are Propel's brief readiness assistant. Help users decide whether a client brief is ready for proposal generation. Use scoreBrief when the user provides client, industry, budget, urgency, or brief details. If the score is strong, ask to mark it as priority with markPriorityOpportunity. Keep text concise.",
      messages: convertToModelMessages(messages),
      tools: {
        scoreBrief,
        markPriorityOpportunity,
      },
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    next(error);
  }
});

export default router;
