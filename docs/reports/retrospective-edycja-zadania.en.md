# Process retrospective: edycja-zadania

## Run summary
| Stage | Agent | Artifact | Completeness (1-5) |
|---|---|---|---|
| 1 | Project Planner | [plan-edycja-zadania.md](../planning/plan-edycja-zadania.md) | 5 |
| 2 | Risk Analyst | [risk-register-edycja-zadania.md](../risk/risk-register-edycja-zadania.md) | 5 |
| 3 | Solution Architect | [adr-edycja-zadania.md](../architecture/adr-edycja-zadania.md) + code | 5 |
| 4 | Implementation Reviewer | [review-implementation-edycja-zadania.md](../reviews/review-implementation-edycja-zadania.md) | 4 |
| 5 | Test Strategy Writer | [test-strategy.md](../test-strategy/test-strategy.md) | 4 |
| 6 | Test Plan Writer | [test-plan-edycja-zadania.md](../test-plans/test-plan-edycja-zadania.md) | 5 |
| 7 | Manual Test Designer | [manual-cases-edycja-zadania.md](../manual-tests/manual-cases-edycja-zadania.md) | 5 |
| 8 | Automation Engineer | [automation-plan-edycja-zadania.md](../automation/automation-plan-edycja-zadania.md) + `e2e/edycja-zadania.spec.ts` | 3 |
| 9 | QA Production Lead | [review-final-edycja-zadania.md](../reviews/review-final-edycja-zadania.md) | 3 |
| 10 | Retrospective Reporter | this document | - |

## What worked well
- The `edycja-zadania` `<slug>` remained consistent across all artifacts; there are no orphaned files or naming mismatches.
- Blocking risks R2 (protecting `id`/`createdAt`/`completed`) and R6 (`data-testid`) were addressed in code, not merely mentioned in the ADR, and were verified by the Implementation Reviewer with concrete file references.
- The Test Plan Writer built a useful bridge from the risk register to concrete tests, which helped the Manual Test Designer and Automation Engineer prioritize.
- The Automation Engineer clearly explained which cases were not automated (visual XSS, long text, keyboard) instead of automating everything indiscriminately or omitting cases without explanation.

## Identified gaps / recurring issues
- **No terminal access in this orchestration session.** The Solution Architect, Automation Engineer, and QA Production Lead prompts require actual verification commands, but this iteration substituted static diagnostics (`get_errors`). That is weaker evidence than running tests and is a recurring issue across 3 of 10 stages.
- Test Strategy Writer created a project-level document in the context of one feature. This was consistent with the "once per project" rule, but the orchestrator had to decide that the document did not exist; the prompt has no automatic detection step.

## Proposed agent prompt changes
| Agent file | Proposed change | Rationale |
|---|---|---|
| `.github/agents/03-solution-architect.agent.md` | Add: "If the terminal tool (`execute`) is unavailable in the current session, state this limitation in Output Format and use static diagnostics (for example `get_errors`) as a substitute instead of silently skipping the step." | Terminal absence required improvisation; an explicit instruction standardizes future behavior. |
| `.github/agents/08-automation-engineer.agent.md` | Add the same kind of note for the `npx playwright test` step. | The same missing-`execute` issue recurred. |
| `.github/agents/09-qa-production-lead.agent.md` | Add an intermediate verdict, "READY FOR RELEASE AFTER CI VERIFICATION", for sessions that cannot run lint/tests, instead of forcing a binary READY/NEEDS FIXES choice. | The current template does not represent an unverifiable state, so the stage added an ad hoc note. |
| `.github/agents/05-test-strategy-writer.agent.md` | Add step 0: "Check whether `docs/test-strategy/test-strategy.md` exists (`file_search`); if yes, update it; if no, create it and state this in Output Format." | Removes an ambiguity currently resolved by the orchestrator or external executor. |

## Recommendation for the next iteration
Implement these four prompt changes before the next pipeline run, especially the standardized reporting of unavailable `execute`, which affects three agents. Before real release of this feature, run `npm run lint` and `npx playwright test` in an environment with terminal/CI access.
