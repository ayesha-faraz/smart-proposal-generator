import { checkGroqConnection } from "../proposal-core.js";

const status = await checkGroqConnection();
const mark = status.connected ? "PASS" : "FAIL";

console.log(`[${mark}] ${status.message}`);
console.log(`Provider: ${status.provider}`);
console.log(`Configured model: ${status.model}`);
console.log(`Checked at: ${status.checkedAt}`);

if (!status.connected) {
  console.error("Add a valid GROQ_API_KEY to .env and run this command again before recording the MVP.");
  process.exitCode = 1;
}
