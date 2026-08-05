import { regenerateSection, validateSectionRequest } from "../proposal-core.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
    const validationError = validateSectionRequest(body);
    if (validationError) return res.status(400).json({ error: validationError });

    const content = await regenerateSection(body);
    return res.status(200).json({ section: body.section, content });
  } catch (error) {
    console.error("Section regeneration failed:", error);
    return res.status(Number(error?.status) || 500).json({
      error: error instanceof Error ? error.message : "Section regeneration failed.",
    });
  }
}
