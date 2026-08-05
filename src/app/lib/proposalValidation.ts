import type { ProposalFormData } from "../components/ProposalForm";

export interface ValidationWarning {
  id: string;
  message: string;
}

export interface FormValidationResult {
  errors: Partial<Record<keyof ProposalFormData | "form", string>>;
  warnings: ValidationWarning[];
  isValid: boolean;
}

export interface ProposalQualityReport {
  blockingIssues: string[];
  warnings: string[];
  checks: Array<{ label: string; passed: boolean; detail: string }>;
}

export interface GeneratedProposalLike {
  headline: string;
  subtitle: string;
  executiveSummary: string;
  problem: string;
  opportunity: string;
  solution: string;
  whyUs: string;
  close: string;
  scope: string[];
  investment: Array<{ item: string; details: string; cost: number }>;
}

const allRequiredFields: Array<keyof ProposalFormData> = [
  "businessName",
  "tagline",
  "phone",
  "website",
  "email",
  "clientName",
  "clientIndustry",
  "clientWebsite",
  "targetAudience",
  "currentSituation",
  "mainGoal",
  "competitors",
  "serviceOffering",
  "projectBrief",
  "budget",
  "currency",
  "timeline",
  "tone",
  "urgency",
  "language",
];

const riskyPromisePattern = /\b(guarantee(?:d|s)?|100\s*%|risk[-\s]?free|zero\s+risk|instant\s+results?|assured\s+results?|will\s+definitely|no\s+failure)\b/i;
const instructionInjectionPattern = /\b(ignore\s+(?:all|any|the|previous)|system\s+prompt|developer\s+message|reveal\s+(?:your|the)\s+instructions|override\s+(?:the|all)\s+rules|act\s+as\s+the\s+system)\b/i;
const placeholderPattern = /(?:\b(?:TBD|TBC|TO BE CONFIRMED|LOREM IPSUM|INSERT\s+HERE|PLACEHOLDER)\b|\[CLIENT|\[COMPANY|\{\{.+?\}\})/i;

const clean = (value: unknown) => String(value ?? "").trim();
const isNA = (value: string) => /^(n\/?a|none|not applicable)$/i.test(value.trim());

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidWebsite(value: string) {
  if (isNA(value)) return true;
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(?:[/:?#][^\s]*)?$/i.test(value.trim());
}

function isValidPhone(value: string) {
  if (isNA(value)) return true;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 16;
}

function timelineDays(value: ProposalFormData["timeline"]) {
  if (value === "1 Month") return 30;
  if (value === "3 Months") return 90;
  return 180;
}

function extractDurations(text: string) {
  const durations: number[] = [];
  const regex = /\b(\d{1,3})\s*(day|days|week|weeks|month|months)\b/gi;
  for (const match of text.matchAll(regex)) {
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    if (unit.startsWith("day")) durations.push(value);
    if (unit.startsWith("week")) durations.push(value * 7);
    if (unit.startsWith("month")) durations.push(value * 30);
  }
  return durations;
}

export function validateProposalForm(data: ProposalFormData): FormValidationResult {
  const errors: FormValidationResult["errors"] = {};
  const warnings: ValidationWarning[] = [];

  for (const field of allRequiredFields) {
    if (!clean(data[field])) errors[field] = "This field is required.";
  }

  if (clean(data.email) && !isValidEmail(clean(data.email))) {
    errors.email = "Enter a valid email address.";
  }
  if (clean(data.website) && !isValidWebsite(clean(data.website))) {
    errors.website = "Enter a valid website, or type N/A.";
  }
  if (clean(data.clientWebsite) && !isValidWebsite(clean(data.clientWebsite))) {
    errors.clientWebsite = "Enter a valid client website, or type N/A.";
  }
  if (clean(data.phone) && !isValidPhone(clean(data.phone))) {
    errors.phone = "Enter a valid phone number, or type N/A.";
  }

  const budget = Number(data.budget);
  if (!Number.isFinite(budget) || budget <= 0) {
    errors.budget = "Budget must be a number greater than zero.";
  }

  if (clean(data.targetAudience).length > 0 && clean(data.targetAudience).length < 8) {
    errors.targetAudience = "Add a more specific target audience.";
  }
  if (clean(data.mainGoal).length > 0 && clean(data.mainGoal).length < 8) {
    errors.mainGoal = "Add a clearer measurable or practical goal.";
  }
  if (clean(data.projectBrief).length > 0 && clean(data.projectBrief).length < 40) {
    errors.projectBrief = "The project brief must contain at least 40 characters.";
  }

  const combinedUserContent = [
    data.tagline,
    data.targetAudience,
    data.currentSituation,
    data.mainGoal,
    data.competitors,
    data.projectBrief,
  ].join("\n");

  if (riskyPromisePattern.test(combinedUserContent)) {
    warnings.push({
      id: "risky-promise",
      message: "The form contains a guarantee or absolute-results claim. Review the wording before using it in a client proposal.",
    });
  }

  if (instructionInjectionPattern.test(combinedUserContent)) {
    warnings.push({
      id: "instruction-like-text",
      message: "The form contains instruction-like wording. It will be treated only as client data, not as a command to the AI.",
    });
  }

  const expectedDays = timelineDays(data.timeline);
  const mentionedDurations = extractDurations(`${data.mainGoal}\n${data.projectBrief}`);
  const conflicts = mentionedDurations.filter((days) => Math.abs(days - expectedDays) > Math.max(14, expectedDays * 0.25));
  if (conflicts.length > 0) {
    warnings.push({
      id: "timeline-conflict",
      message: `The brief mentions a duration that may conflict with the selected ${data.timeline} timeline. Confirm the intended schedule.`,
    });
  }

  if (placeholderPattern.test(combinedUserContent)) {
    warnings.push({
      id: "input-placeholder",
      message: "The form contains placeholder text. Replace it with final client information before approving the PDF.",
    });
  }

  return { errors, warnings, isValid: Object.keys(errors).length === 0 };
}

export function evaluateGeneratedProposal(
  proposal: GeneratedProposalLike,
  formData: ProposalFormData,
): ProposalQualityReport {
  const blockingIssues: string[] = [];
  const warnings: string[] = [];
  const textFields = [
    proposal.headline,
    proposal.subtitle,
    proposal.executiveSummary,
    proposal.problem,
    proposal.opportunity,
    proposal.solution,
    proposal.whyUs,
    proposal.close,
    ...proposal.scope,
    ...proposal.investment.flatMap((row) => [row.item, row.details]),
  ];
  const combined = textFields.join("\n");

  const requiredTextComplete = textFields.every((value) => clean(value).length > 0);
  if (!requiredTextComplete) blockingIssues.push("One or more generated proposal sections are blank.");

  const scopeValid = proposal.scope.length >= 4 && proposal.scope.length <= 8;
  if (!scopeValid) blockingIssues.push("Scope of work must contain between 4 and 8 deliverables.");

  const investmentRowsValid = proposal.investment.length === 3 && proposal.investment.every((row) => Number.isFinite(Number(row.cost)) && row.cost >= 0);
  if (!investmentRowsValid) blockingIssues.push("The investment table must contain exactly three valid rows.");

  const expectedBudget = Number(formData.budget);
  const actualBudget = proposal.investment.reduce((sum, row) => sum + Number(row.cost || 0), 0);
  const budgetMatches = Number.isFinite(expectedBudget) && Math.abs(actualBudget - expectedBudget) <= 0.01;
  if (!budgetMatches) blockingIssues.push("The investment breakdown does not equal the approved budget.");

  const noPlaceholders = !placeholderPattern.test(combined);
  if (!noPlaceholders) blockingIssues.push("The generated proposal still contains placeholder text.");

  const sourceContainsRiskyClaim = riskyPromisePattern.test([
    formData.tagline,
    formData.mainGoal,
    formData.projectBrief,
  ].join("\n"));
  const outputContainsRiskyClaim = riskyPromisePattern.test(combined);
  const noNewRiskyClaim = !outputContainsRiskyClaim || sourceContainsRiskyClaim;
  if (!noNewRiskyClaim) blockingIssues.push("The AI introduced an unapproved guarantee or absolute-results claim.");
  if (outputContainsRiskyClaim && sourceContainsRiskyClaim) {
    warnings.push("The proposal includes a guarantee or absolute-results statement supplied in the form. Review it carefully.");
  }

  const namesPresent = combined.toLowerCase().includes(formData.clientName.trim().toLowerCase()) ||
    proposal.headline.toLowerCase().includes(formData.clientName.trim().toLowerCase());
  if (!namesPresent) warnings.push("The client name does not appear in the generated narrative. Confirm that the proposal is sufficiently customized.");

  return {
    blockingIssues,
    warnings,
    checks: [
      { label: "All proposal sections completed", passed: requiredTextComplete, detail: requiredTextComplete ? "No blank generated sections found." : "Blank content was detected." },
      { label: "Scope contains 4–8 deliverables", passed: scopeValid, detail: `${proposal.scope.length} scope items generated.` },
      { label: "Investment equals approved budget", passed: budgetMatches, detail: `${formData.currency} ${actualBudget.toLocaleString()} of ${formData.currency} ${expectedBudget.toLocaleString()}.` },
      { label: "No unresolved placeholders", passed: noPlaceholders, detail: noPlaceholders ? "No placeholder tokens found." : "Placeholder text requires correction." },
      { label: "No new unapproved guarantees", passed: noNewRiskyClaim, detail: noNewRiskyClaim ? "No new absolute-results claim detected." : "An unapproved claim was detected." },
    ],
  };
}
