import { tool } from "ai";
import { z } from "zod";

/**
 * requestAgencyIntro
 * -------------------
 * Client-side / human-in-the-loop tool — no `execute`. Offered after a
 * deal score comes back at 45+ (worth pursuing). Never fires without
 * the person clicking approve in the UI; the client resolves it via
 * addToolResult().
 *
 * This is a request flag only — it doesn't send anything yet. Wire the
 * "requested" case into your real intro/messaging flow (DealRoom.tsx or
 * an email/notification call) if you want it to do something live.
 */

export const requestAgencyIntroInputSchema = z.object({
  agencyName: z.string(),
  dealTitle: z.string(),
  dealScore: z.number().min(0).max(100),
});

export const requestAgencyIntroTool = tool({
  description:
    "Request a warm introduction to an agency for a specific deal. Always " +
    "requires explicit user confirmation in the UI — never assume approval.",
  inputSchema: requestAgencyIntroInputSchema,
});
