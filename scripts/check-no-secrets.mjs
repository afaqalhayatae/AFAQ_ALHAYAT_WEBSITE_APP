#!/usr/bin/env node
// Lightweight, dependency-free scan of Git-tracked files for common
// credential patterns. Fails the check (non-zero exit) on any match.

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const patterns = [
  { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "Private key header", regex: /-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----/ },
  { name: "Generic bearer token", regex: /bearer\s+[a-zA-Z0-9\-._~+/]{20,}=*/i },
  {
    name: "Connection string with embedded credential",
    regex: /(mysql|postgres|postgresql|mongodb):\/\/(?!user:password|johndoe:randompassword)[^:@/\s]+:[^@/\s]+@/i,
  },
];

const ignoredFiles = new Set([".env.example", "scripts/check-no-secrets.mjs"]);

// Vendored third-party reference docs (installed by `prisma init`), not
// application code — their example connection strings are teaching
// material, not secrets belonging to this project.
const ignoredPathPrefixes = [".agents/", ".claude/", ".windsurf/"];

const trackedFiles = execSync("git ls-files", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

let failures = [];

for (const file of trackedFiles) {
  if (ignoredFiles.has(file)) continue;
  if (ignoredPathPrefixes.some((prefix) => file.startsWith(prefix))) continue;
  if (/\.(png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|lock)$/i.test(file)) continue;

  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue; // binary or unreadable file
  }

  for (const { name, regex } of patterns) {
    if (regex.test(content)) {
      failures.push(`${file}: possible ${name}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Potential secrets found:\n" + failures.join("\n"));
  process.exit(1);
}

console.log("No secret patterns found in tracked files.");
