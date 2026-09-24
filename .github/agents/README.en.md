# AI agents - orchestration

The full orchestration architecture, flow diagram, and agent collaboration rules are in [docs/orchestration/ORCHESTRATION.en.md](../../docs/orchestration/ORCHESTRATION.en.md).

## Summary

| File | Role |
|---|---|
| `orchestrator.agent.md` | Directs the entire pipeline (the only agent visible in the agent selector as the entry point) |
| `01-project-planner.agent.md` | Project plan / backlog |
| `02-risk-analyst.agent.md` | Risk analysis |
| `03-solution-architect.agent.md` | Architecture + implementation |
| `04-implementation-reviewer.agent.md` | Review of stages 1-3 |
| `05-test-strategy-writer.agent.md` | Test strategy (project level) |
| `06-test-plan-writer.agent.md` | Test plan (feature level) |
| `07-manual-test-designer.agent.md` | Manual test cases |
| `08-automation-engineer.agent.md` | Playwright automation |
| `09-qa-production-lead.agent.md` | Final code review of the whole chain |
| `11-documentation-curator.agent.md` | Consolidated implementation documentation |
| `10-retrospective-reporter.agent.md` | Final report + prompt improvements |

To run the full process, choose **Orchestrator** in the agent chat and describe the feature you want to add to the Todo List application.

## Bilingual file convention

The Polish `.agent.md` files remain the originals used by the repository. Their English counterparts use the `.en.md` suffix and preserve the same frontmatter semantics, agent names, tools, hooks, and paths. For example, `11-documentation-curator.agent.md` has the parallel English document `11-documentation-curator.agent.en.md`.
