import express from "express";
import { convertToModelMessages, streamText, tool } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

const router = express.Router();

const tierSchema = z.enum(["needs-info", "promising", "strong"]);

const scoreBrief = tool({
  description: "Score whether a client brief is ready to generate a persuasive proposal.",
  inputSchema: z.object({
    clientName: z.string().describe("The client or company name."),
    industry: z.string().describe("The client's industry."),
    budget: z.string().optional().describe("The proposed budget or budget range."),
    urgency: z.string().optional().describe("How soon the client needs the work."),
    brief: z.string().describe("The client brief to evaluate."),
  }),
  execute: async ({ clientName, industry, budget, urgency, brief }) => {
    const details = [clientName, industry, budget, urgency, brief].filter(Boolean).join(" ").toLowerCase();
    let score = 42;

    if (clientName?.trim()) score += 8;
    if (industry?.trim()) score += 8;
    if (budget?.trim()) score += 10;
    if (urgency?.trim()) score += 8;
    if (brief.length > 180) score += 14;
    if (brief.length > 420) score += 10;
    if (/goal|increase|reduce|launch|leads|conversion|revenue/.test(details)) score += 8;
    if (/audience|customers|buyers|users|families|founders/.test(details)) score += 6;

    score = Math.min(96, score);
    const tier = score >= 78 ? "strong" : score >= 58 ? "promising" : "needs-info";

    const missingSignals = [];
    if (!budget?.trim()) missingSignals.push("Budget or investment range");
    if (!urgency?.trim()) missingSignals.push("Timeline or urgency");
    if (!/audience|customers|buyers|users|families|founders/.test(details)) missingSignals.push("Target audience");
    if (!/goal|increase|reduce|launch|leads|conversion|revenue/.test(details)) missingSignals.push("Measurable business goal");

    return {
      score,
      tier: tierSchema.parse(tier),
      reasons: [
        `${clientName || "The client"} has enough context to identify the proposal angle.`,
        `${industry || "The industry"} gives the proposal a clear market frame.`,
        budget ? "Budget is present, so scope and investment can be positioned clearly." : "Budget is missing, so pricing confidence is lower.",
      ],
      missingSignals,
      recommendedNextStep:
        tier === "strong"
          ? "Generate the proposal and keep the brief details visible in the executive summary."
          : "Add the missing signals before generating the final proposal.",
    };
  },
});

const markPriorityOpportunity = tool({
  description: "Ask the user to confirm whether this strong brief should be marked as a priority opportunity.",
  inputSchema: z.object({
    clientName: z.string(),
    tier: z.enum(["needs-info", "promising", "strong"]),
    score: z.number(),
  }),
});

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
