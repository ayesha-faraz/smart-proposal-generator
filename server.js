import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkGroqConnection,
  detectInputWarnings,
  generateProposal,
  regenerateSection,
  validateFormData,
  validateSectionRequest,
} from "./proposal-core.js";

const port = Number(process.env.PORT || 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 150_000) throw new Error("Request body is too large.");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    const error = new Error("Request body must contain valid JSON.");
    error.status = 400;
    throw error;
  }
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function serveProductionFile(req, res) {
  const dist = path.join(__dirname, "dist");
  const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  let filePath = path.join(dist, requestPath === "/" ? "index.html" : requestPath);
  if (!filePath.startsWith(dist)) return false;
  try {
    const details = await stat(filePath);
    if (details.isDirectory()) filePath = path.join(filePath, "index.html");
    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(body);
    return true;
  } catch {
    try {
      const body = await readFile(path.join(dist, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" });
      res.end(body);
      return true;
    } catch {
      return false;
    }
  }
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    const status = await checkGroqConnection();
    return sendJson(res, 200, status);
  }

  if (req.method === "POST" && req.url === "/api/generate-proposal") {
    try {
      const formData = await readJsonBody(req);
      const validationError = validateFormData(formData);
      if (validationError) return sendJson(res, 400, { error: validationError });
      const proposal = await generateProposal(formData);
      return sendJson(res, 200, { proposal, warnings: detectInputWarnings(formData) });
    } catch (error) {
      console.error("Proposal generation failed:", error);
      return sendJson(res, Number(error.status) || 500, { error: error instanceof Error ? error.message : "Proposal generation failed." });
    }
  }

  if (req.method === "POST" && req.url === "/api/regenerate-section") {
    try {
      const body = await readJsonBody(req);
      const validationError = validateSectionRequest(body);
      if (validationError) return sendJson(res, 400, { error: validationError });
      const content = await regenerateSection(body);
      return sendJson(res, 200, { section: body.section, content });
    } catch (error) {
      console.error("Section regeneration failed:", error);
      return sendJson(res, Number(error.status) || 500, { error: error instanceof Error ? error.message : "Section regeneration failed." });
    }
  }

  if (process.env.NODE_ENV === "production" && await serveProductionFile(req, res)) return;
  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, () => console.log(`Propel API listening on http://localhost:${port}`));
