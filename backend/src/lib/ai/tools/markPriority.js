import { tool } from "ai";
import { z } from "zod";

export const markPriorityOpportunity = tool({
  description: "Ask the user to confirm whether this strong brief should be marked as a priority opportunity.",
  inputSchema: z.object({
    clientName: z.string(),
    tier: z.enum(["needs-info", "promising", "strong"]),
    score: z.number(),
  }),
});
