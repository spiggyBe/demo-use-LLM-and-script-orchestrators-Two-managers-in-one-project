# Multi-agent collaboration risks - analysis from real experiments

This document addresses the question: *"Should the orchestrator be code rather than an agent?"* It summarizes collaboration risks observed through **actual runs** of several scenarios with subagents in this repository, rather than hypothetical concerns. Each result below was independently verified with `npm run lint` / `npx playwright test` run manually outside the agent context.

## Answer to the original question

**Partly yes, and partly it cannot (and should not) be separated completely.** Orchestration can be divided into two layers:

- **Decision layer (LLM/agent)** - planning, risk assessment, architecture design, interpretation of results, and deciding whether to return to an earlier stage. This cannot be sensibly encoded deterministically because it requires context.
- **Execution layer (deterministic code)** - running lint/tests, checking whether files exist, and counting exit codes. This **must** be code because, as the experiment below showed, an LLM can honestly report "PASS" based on incomplete verification.

We did not build a separate "orchestrator as a `.ts` file" because the current platform (`.agent.md` agents + subagents) does not provide a confirmed, documented API for calling subagents from an external Node/TS script. Instead, we implemented a documentation-compatible hybrid: the LLM agent (Orchestrator) still decides the flow, while critical verification points are enforced in code through hooks (`scripts/verify.mjs` + `SubagentStop`) - see section 4. This pattern is directly described in hook documentation: *"Instructions/Agents = guidance (non-deterministic); Hooks = runtime enforcement (deterministic)"*.

## 1. Methodology

Three real subagent calls (`runSubagent`) were made in three scenarios:

| # | Scenario | Goal |
|---|---|---|
| E1 | `QA Production Lead` reviews a slug with no artifacts | Will the agent invent "OK" or detect the absence? |
| E2 | `Automation Engineer` must automate tests without existing manual cases | Same question for another agent |
| E3 | Chain: `Risk Analyst` -> `Solution Architect` (deliberately not informed about the risk register) -> independent verification | Does a lossy handoff cause risk omission? Is a "PASS" claim true? |

## 2. Results

### E1 and E2 - positive (agents did NOT invent results)
Both agents correctly detected missing input files, refused to guess, and clearly recommended returning to an earlier stage. **Conclusion:** explicit prompt instructions ("do not automate blindly", "read X before Y") work, but depend on prompt quality and are not an architectural guarantee.

### E3 - two real phenomena

1. **Resilience to a lossy handoff (positive).** Although the `Solution Architect` was deliberately not given the risk-register information, the agent found `docs/risk/risk-register-<slug>.md` from the naming convention and addressed risks R1/R3/R8. This works because each prompt contains a step saying to read the file with that exact name: the **file naming convention partly acts as a deterministic contract**.
2. **Incomplete verification creates false confidence (BLOCKING, confirmed).** The agent reported *"`npm run lint` - PASS, `npm run build` - PASS"* and marked the task ready. Independent execution of the **full** `npx playwright test` then showed that the change (replacing the description field with `contentEditable`) broke an existing test for another feature (task editing); 1 of 12 tests failed. The agent had never run Playwright, so it could not know this, yet reported general "PASS". Self-reporting by an LLM is therefore insufficient as the only quality gate.

## 3. Risk catalog and mitigations

| ID | Risk | Status | Mitigation |
|----|---|---|---|
| RC1 | Agent declares success after incomplete/incorrect verification | **Empirically confirmed (E3)** | Deterministic `SubagentStop` hook -> `scripts/verify.mjs` runs the FULL lint + FULL Playwright suite independently of the agent's report |
| RC2 | Lost context / lossy handoff between stateless subagents | Partly mitigated by file naming (observed in E3), but fragile | Keep the strict `<type>-<slug>.md` convention; consider a `docs/manifest-<slug>.json` listing required artifacts and read by every agent |
| RC3 | Skipping a pipeline stage (for example calling agent 8 without 7) | Not observed in E1/E2, but depends on prompt quality | Consider a lightweight `SubagentStart` hook that checks predecessor files (the hook cannot identify `<slug>`, so it can only check whether a directory is non-empty) |
| RC4 | Cyclic/mutual agent calls (A calls B calls A) | Structurally mitigated | `orchestrator.agent.md` lists agents without itself; agents 01-10 do not have the `agent` tool in `tools:`, so they cannot call subagents. The pipeline is a hub-and-spoke structure, not a graph, eliminating cycles |
| RC5 | Concurrent edits to the same files | Not observed (the pipeline is sequential by design) | The `orchestrator.agent.md` instruction says code-editing stages (3, 8) are never called in parallel |
| RC6 | Documentation drift from code | Theoretical risk (reasoned, not tested in this session) | No fully automatic control; partly mitigated by Implementation Reviewer / QA Production Lead reading real code, not only documents |

## 4. Limitations - what was not achieved and why

To be precise and avoid inventing facts:

- **Hooks cannot access the dynamically chosen `<slug>`.** Hook documentation confirms commands are static (`command`, `cwd`, `env`, `timeout`) and provides no documented mechanism to inject variables from the user prompt into a hook command. Therefore `scripts/verify.mjs` verifies the whole project (lint + all E2E), not only current-slug artifacts. In practice this is even better because it caught the cross-feature regression in E3, but it is not a task-specific gate.
- **I did not verify** whether `SubagentStop` has the same blocking JSON contract as `PostToolUse` (the documentation explicitly describes `decision: block` only for `PostToolUse`). The hook follows the general exit-code contract (`0` = success, `2` = blocking error), which the documentation describes as universal for all events, but I did not test it telemetry-wise in this session.
- **I did not build** a standalone Node/TS orchestrator that directly calls subagents, without chat mediation, because I found no confirmed public API for this environment.

## 5. Recommendation

Keep **decisions** (what to do, how to interpret risks, and when to return to an earlier stage) with LLM agents. But every point where an agent reports a verification result should be supported by an independent deterministic measurement (`scripts/verify.mjs` through the `SubagentStop` hook), as implemented for agents 03, 08, and 09 in this session.
