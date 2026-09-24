# Agenci AI — orkiestracja

Pełny opis architektury orkiestracji, diagram przepływu i zasady współpracy agentów znajdują się w
[docs/orchestration/ORCHESTRATION.md](../../docs/orchestration/ORCHESTRATION.md).

## Skrót

| Plik | Rola |
|---|---|
| `orchestrator.agent.md` | Dyryguje całym pipeline'em (jedyny widoczny w selektorze agentów jako punkt wejścia) |
| `01-project-planner.agent.md` | Plan projektu / backlog |
| `02-risk-analyst.agent.md` | Analiza ryzyka |
| `03-solution-architect.agent.md` | Architektura + implementacja |
| `04-implementation-reviewer.agent.md` | Recenzja etapów 1–3 |
| `05-test-strategy-writer.agent.md` | Strategia testów (poziom projektu) |
| `06-test-plan-writer.agent.md` | Plan testów (poziom funkcjonalności) |
| `07-manual-test-designer.agent.md` | Przypadki testów manualnych |
| `08-automation-engineer.agent.md` | Automatyzacja Playwright |
| `09-qa-production-lead.agent.md` | Finalny code review całości |
| `11-documentation-curator.agent.md` | Zbiorcza dokumentacja implementacji |
| `10-retrospective-reporter.agent.md` | Raport końcowy + ulepszenia promptów |

Aby uruchomić cały proces: w czacie agenta wybierz **Orchestrator** i opisz funkcjonalność,
którą chcesz dodać do aplikacji Todo List.
