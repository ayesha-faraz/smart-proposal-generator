import { tool } from "ai";
import { z } from "zod";

/**
 * scoreDealFit
 * ------------
 * Server-side tool (has `execute`). Scores how well an agency/proposal
 * fits a deal — this replaces the hardcoded `proposalScores` mock array
 * in src/app/lib/marketplace.ts with a real, explainable score. Output
 * shape mirrors `ProposalScore` in marketplace.ts so it can drop into
 * the existing Metric/Score UI in DealIntelligence.tsx.
 *
 * Deterministic weighted heuristic — no external calls beyond the model
 * call that extracts these fields from the conversation. Swap the body
 * for a real matching service later without touching the schema or UI.
 */

export const scoreDealFitInputSchema = z.object({
  agencyName: z.string().describe("The agency or proposer's name."),
  dealTitle: z.string().describe("The deal or opportunity title being proposed on."),
  dealBudget: z
    .number()
    .positive()
    .optional()
    .describe("The deal's budget in PKR, if known. Omit if unclear."),
  proposedPrice: z
    .number()
    .positive()
    .optional()
    .describe("The agency's proposed price in PKR, if stated."),
  servicesMatch: z
    .boolean()
    .optional()
    .describe("True if the agency's listed services clearly match what the deal needs."),
  hasTrackRecord: z
    .boolean()
    .optional()
    .describe("True if the agency has verifiable past outcomes or references for similar work."),
  timelineRealistic: z
    .boolean()
    .optional()
    .describe("True if the proposed timeline is realistic for the scope described."),
  responsiveness: z
    .enum(["slow", "average", "fast"])
    .optional()
    .describe("How quickly the agency has responded in this conversation so far."),
});

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export async function scoreDealFitExecute(input) {
  await new Promise((r) => setTimeout(r, 500));

  let fit = 40;
  let quality = 40;
  let priceFairness = 50;
  let risk = 50; // higher = riskier
  let deliveryConfidence = 40;
  const reasons = [];
  const missingSignals = [];

  if (input.servicesMatch === true) {
    fit += 30;
    reasons.push("Agency's services directly match the deal's needs");
  } else if (input.servicesMatch === false) {
    fit -= 15;
    reasons.push("Service overlap is unclear or partial");
  } else {
    missingSignals.push("servicesMatch");
  }

  if (input.hasTrackRecord === true) {
    quality += 35;
    risk -= 20;
    reasons.push("Verifiable track record for similar work");
  } else {
    missingSignals.push("hasTrackRecord");
  }

  if (input.dealBudget && input.proposedPrice) {
    const ratio = input.proposedPrice / input.dealBudget;
    if (ratio <= 1.05 && ratio >= 0.7) {
      priceFairness = 85;
      reasons.push("Proposed price sits comfortably within budget");
    } else if (ratio < 0.7) {
      priceFairness = 55;
      risk += 10;
      reasons.push("Proposed price is unusually low relative to budget — worth a scope check");
    } else {
      priceFairness = 35;
      risk += 15;
      reasons.push("Proposed price exceeds the stated budget");
    }
  } else {
    missingSignals.push("dealBudget/proposedPrice");
  }

  if (input.timelineRealistic === true) {
    deliveryConfidence += 30;
    reasons.push("Timeline looks realistic for the scope");
  } else if (input.timelineRealistic === false) {
    deliveryConfidence -= 15;
    risk += 10;
    reasons.push("Timeline looks aggressive for the scope described");
  } else {
    missingSignals.push("timelineRealistic");
  }

  if (input.responsiveness === "fast") {
    deliveryConfidence += 15;
    reasons.push("Fast, responsive communication so far");
  } else if (input.responsiveness === "slow") {
    deliveryConfidence -= 10;
    risk += 10;
    reasons.push("Slower response times so far");
  } else {
    missingSignals.push("responsiveness");
  }

  fit = clamp(fit);
  quality = clamp(quality);
  priceFairness = clamp(priceFairness);
  risk = clamp(risk);
  deliveryConfidence = clamp(deliveryConfidence);

  const dealScore = clamp((fit + quality + priceFairness + deliveryConfidence - risk) / 4);

  const recommendation =
    dealScore >= 70
      ? `Strong match — worth fast-tracking ${input.agencyName} for ${input.dealTitle}.`
      : dealScore >= 45
        ? `Reasonable fit, but confirm ${missingSignals[0] ?? "the missing details"} before moving forward.`
        : `Weak fit right now — gather more information before recommending ${input.agencyName}.`;

  return { fit, quality, priceFairness, risk, deliveryConfidence, dealScore, reasons, missingSignals, recommendation };
}

export const scoreDealFitTool = tool({
  description:
    "Score how well an agency/proposal fits a deal (fit, quality, price " +
    "fairness, risk, delivery confidence, 0-100 each) plus an overall deal " +
    "score and recommendation. Call this once you know the agency name, " +
    "deal title, and at least one other signal. Never invent values the " +
    "user hasn't given you.",
  inputSchema: scoreDealFitInputSchema,
  execute: scoreDealFitExecute,
});
