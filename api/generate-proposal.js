import { detectInputWarnings, generateProposal, validateFormData } from "../proposal-core.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
    const validationError = validateFormData(formData);
    if (validationError) return res.status(400).json({ error: validationError });

    const proposal = await generateProposal(formData);
    return res.status(200).json({ proposal, warnings: detectInputWarnings(formData) });
  } catch (error) {
    console.error("Proposal generation failed:", error);
    return res.status(Number(error?.status) || 500).json({
      error: error instanceof Error ? error.message : "Proposal generation failed.",
    });
  }
}
