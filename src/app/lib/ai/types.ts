import type { UIMessage } from "ai";

/**
 * Backend tools live in backend/src/lib/ai/tools/*.js (plain JS, no
 * .d.ts to import). These types mirror the Zod schemas there by hand
 * — keep them in sync if you change a tool's schema.
 */

export interface ScoreDealFitInput {
  agencyName: string;
  dealTitle: string;
  dealBudget?: number;
  proposedPrice?: number;
  servicesMatch?: boolean;
  hasTrackRecord?: boolean;
  timelineRealistic?: boolean;
  responsiveness?: "slow" | "average" | "fast";
}

export interface ScoreDealFitOutput {
  fit: number;
  quality: number;
  priceFairness: number;
  risk: number;
  deliveryConfidence: number;
  dealScore: number;
  reasons: string[];
  missingSignals: string[];
  recommendation: string;
}

export interface RequestAgencyIntroInput {
  agencyName: string;
  dealTitle: string;
  dealScore: number;
}

export type RequestAgencyIntroOutput = { status: "requested" } | { status: "skipped" };

export type ChatUIMessage = UIMessage<
  never,
  never,
  {
    scoreDealFit: { input: ScoreDealFitInput; output: ScoreDealFitOutput };
    requestAgencyIntro: { input: RequestAgencyIntroInput; output: RequestAgencyIntroOutput };
  }
>;
