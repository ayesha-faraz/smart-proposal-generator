import { checkGroqConnection } from "../proposal-core.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const status = await checkGroqConnection();
    return res.status(200).json(status);
  } catch (error) {
    console.error("Groq health check failed:", error);
    return res.status(200).json({
      connected: false,
      configured: Boolean(process.env.GROQ_API_KEY),
      provider: "Groq",
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      checkedAt: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Groq health check failed.",
    });
  }
}
