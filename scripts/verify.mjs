#!/usr/bin/env node
/**
 * Deterministic verification gate for code-editing agents.
 * Runs the REAL toolchain (lint + full Playwright suite) and reports a
 * machine-checked PASS/FAIL — it cannot be skipped, forgotten, or "misremembered"
 * by an LLM the way a self-reported claim can.
 *
 * Usage:
 *   node scripts/verify.mjs                # human-readable output, exit 0/1
 *   node scripts/verify.mjs --hook         # JSON hook contract for SubagentStop (see hooks.md)
 */
import { spawnSync } from "node:child_process";

const isHookMode = process.argv.includes("--hook");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { encoding: "utf8", shell: options.shell ?? true });
  return {
    ok: result.status === 0,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
  };
}

const lint = run(npmCmd, ["run", "lint", "--silent"]);
const tests = run(npxCmd, ["playwright", "test"]);
const docs = run(process.execPath, ["scripts/docs.mjs", "validate"], { shell: false });

const passed = docs.ok && lint.ok && tests.ok;

const summaryLines = [
  `docs: ${docs.ok ? "PASS" : "FAIL"}`,
  `lint: ${lint.ok ? "PASS" : "FAIL"}`,
  `playwright: ${tests.ok ? "PASS" : "FAIL"}`,
];

if (isHookMode) {
  const systemMessage = passed
    ? `Weryfikacja deterministyczna: ${summaryLines.join(", ")}. Cały zestaw e2e i lint faktycznie uruchomiony i przeszedł.`
    : `Weryfikacja deterministyczna WYKRYŁA BŁĄD: ${summaryLines.join(", ")}.\n\n${!lint.ok ? lint.output : tests.output}`.slice(0, 4000);

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SubagentStop",
        systemMessage: `${systemMessage}${!docs.ok ? `\n\n${docs.output}` : ""}`,
      },
    }),
  );
  process.exit(passed ? 0 : 2); // 2 = blocking error per hooks contract
} else {
  console.log(summaryLines.join("\n"));
  if (!passed) {
    console.log("\n--- docs output ---\n" + docs.output);
    console.log("\n--- lint output ---\n" + lint.output);
    console.log("\n--- playwright output ---\n" + tests.output);
  }
  process.exit(passed ? 0 : 1);
}
