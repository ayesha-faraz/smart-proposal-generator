import { spawn } from "node:child_process";
import path from "node:path";

const bin = process.platform === "win32" ? "vite.cmd" : "vite";
const vitePath = path.join("node_modules", ".bin", bin);
const children = [
  spawn(process.execPath, ["--watch", "--env-file=.env", "server.js"], { stdio: "inherit" }),
  spawn(vitePath, [], { stdio: "inherit", shell: process.platform === "win32" }),
];

function stop() {
  for (const child of children) child.kill("SIGTERM");
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of children) child.on("exit", (code) => {
  if (code && code !== 0) process.exitCode = code;
});
