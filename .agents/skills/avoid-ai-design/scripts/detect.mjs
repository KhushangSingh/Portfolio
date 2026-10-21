#!/usr/bin/env node
/*
 * avoid-ai-design · detect.mjs (zero external dependencies, Node 18+)
 * Scans frontend source files for code-certain AI design tells (P0 to P2).
 */
import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = new Set([
  ".html", ".htm", ".css", ".scss", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte"
]);

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "out", ".next", "coverage", ".cache"
]);

// Tell checks
const TELLS = [
  {
    id: "P0-STATUS-PULSE",
    severity: "P0",
    name: "Pulsing green/amber status badge",
    regex: /\banimate-ping\b.*\b(bg-green|bg-emerald|bg-amber|Available for)/i,
    why: "Generic 'Available for work' or green pulsing pill badge is a hallmark AI template cliché."
  },
  {
    id: "P0-HEADLINE-GRADIENT",
    severity: "P0",
    name: "Text gradient on primary heading",
    regex: /\bbg-clip-text\s+text-transparent\s+bg-gradient-to-r\b/i,
    why: "Rainbow or purple-to-indigo gradient text on headlines reads as low-effort AI default."
  },
  {
    id: "P1-PURPLE-BLACK",
    severity: "P1",
    name: "Generic purple-on-dark palette",
    regex: /\b(bg-slate-950|bg-zinc-950|#0f172a)\b.*\b(border-purple|from-purple|text-purple-500|#8b5cf6)\b/i,
    why: "Dark purple-tinted backgrounds with glowing borders are the most common AI default."
  },
  {
    id: "P1-SINGLE-ACCENT-WORD",
    severity: "P1",
    name: "Single highlighted word in headline",
    regex: /<h([12])[^>]*>(?:(?!<\/h\1>)[\s\S])*?<(span|em|i)\b[^>]*\b(text-|italic)[^"']*["']>[\w\s]{1,25}<\/\2>[\s\S]*?<\/h\1>/i,
    why: "Coloring or italicizing exactly one word in a headline is a common LLM habit."
  },
  {
    id: "P1-MACOS-DOTS",
    severity: "P1",
    name: "Fake macOS traffic-light window chrome",
    regex: /bg-red-500.*bg-yellow-500.*bg-green-500/i,
    why: "Simulating macOS window dots around code or screenshots is an overused template trope."
  },
  {
    id: "P2-INTER-DEFAULT",
    severity: "P2",
    name: "Unstyled generic Inter font stack",
    regex: /font-family:\s*['"]?Inter['"]?/i,
    why: "Defaulting to Inter without intentional typographic pairings makes pages feel template-generated."
  },
  {
    id: "P2-DECORATIVE-NUMERALS",
    severity: "P2",
    name: "Decorative 01/02/03 numerals",
    regex: />\s*(?:01|02|03)\s*<|\btext-[xs|sm]\b.*0[1-3]/i,
    why: "Using 01, 02, 03 as artificial decorative section dividers."
  }
];

function scanDirectory(dirPath, fileList = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const findings = [];

  for (const tell of TELLS) {
    const match = content.match(tell.regex);
    if (match) {
      // Find line number
      const lineNo = content.substring(0, match.index).split("\n").length;
      findings.push({
        ...tell,
        file: filePath,
        line: lineNo,
        snippet: match[0].slice(0, 80)
      });
    }
  }

  return findings;
}

function main() {
  const args = process.argv.slice(2);
  const targetDir = args.find((a) => !a.startsWith("-")) || "./src";
  const jsonMode = args.includes("--json");

  if (!fs.existsSync(targetDir)) {
    console.error(`Target path '${targetDir}' not found.`);
    process.exit(1);
  }

  const files = fs.statSync(targetDir).isDirectory() ? scanDirectory(targetDir) : [targetDir];
  const allFindings = [];

  for (const file of files) {
    const fileFindings = auditFile(file);
    if (fileFindings.length > 0) {
      allFindings.push(...fileFindings);
    }
  }

  if (jsonMode) {
    console.log(JSON.stringify(allFindings, null, 2));
  } else {
    console.log(`\n🔍 Avoid AI Design Scanner — Audited ${files.length} file(s)\n`);
    if (allFindings.length === 0) {
      console.log("✨ All clean! No code-certain AI slop tells detected (0 findings).\n");
      process.exit(0);
    }

    console.log(`⚠️  Detected ${allFindings.length} AI design tell(s):\n`);
    for (const f of allFindings) {
      console.log(`[${f.severity}] ${f.id}: ${f.name}`);
      console.log(`  File: ${f.file}:${f.line}`);
      console.log(`  Why:  ${f.why}`);
      console.log(`  Code: "${f.snippet.trim()}"\n`);
    }

    const p0orP1 = allFindings.some((f) => f.severity === "P0" || f.severity === "P1");
    process.exit(p0orP1 ? 2 : 0);
  }
}

main();
