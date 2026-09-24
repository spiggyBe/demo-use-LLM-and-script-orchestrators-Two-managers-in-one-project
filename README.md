# Test Orchestrator — nauka orkiestracji agentów AI

Projekt ćwiczeniowy: **Lista zadań (Todo List)** w Next.js + TypeScript + Tailwind, z danymi
przechowywanymi wyłącznie w `localStorage` przeglądarki (bez zewnętrznej bazy danych). Testy E2E
napisane są w Playwright.

Prawdziwym celem tego repozytorium jest jednak system 11 wyspecjalizowanych agentów AI w
[.github/agents/](./.github/agents/), które wspólnie planują, analizują ryzyko, implementują,
testują i recenzują dowolną nową funkcjonalność tej aplikacji — pełny opis architektury
orkiestracji znajduje się w [docs/orchestration/ORCHESTRATION.md](./docs/orchestration/ORCHESTRATION.md).

## O projekcie

To eksperymentalne, weekendowe demo pokazuje dwa podejścia do orkiestracji agentów:

- **orkiestrator AI** — agent oparty na LLM, który podejmuje decyzje w sposób niedeterministyczny;
- **orkiestrator skryptowy** — kod sterujący, który zapewnia deterministyczne zachowanie pozostałych agentów.

Najważniejsze objaśnienia dotyczące agentów i przebiegu orkiestracji znajdują się w katalogu
[docs/](./docs/). Warto zacząć od [docs/README.md](./docs/README.md), który wyjaśnia zawartość
poszczególnych podkatalogów i artefaktów.

Sama aplikacja w [src/](./src/) jest działającą aplikacją Todo, którą można uruchomić lokalnie
i obsługiwać w przeglądarce. Testy automatyczne oraz wszystko, co jest potrzebne do ich
uruchomienia, znajdują się w [e2e/](./e2e/).

Agenci potrafią na podstawie promptu tworzyć nowe funkcjonalności, następnie je testować
i przygotowywać dokumentację. To projekt edukacyjny zbudowany metodą *vibe coding*, z ręczną
weryfikacją rezultatów i świadomym traktowaniem go jako eksperymentu, a nie gotowego produktu.

## Szybki start

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Testy

```bash
npm run lint          # ESLint + reguły React
npm run test:e2e      # Testy Playwright (E2E)
npm run test:e2e:ui   # Playwright w trybie UI
npm run test:e2e:report
```

## Orkiestracja agentów AI

1. Otwórz czat agenta w VS Code, wybierz **Orchestrator**.
2. Opisz funkcjonalność do dodania, np. *"Dodaj przypomnienia dla zadań"*.
3. Orkiestrator poprowadzi zadanie przez 10 etapów (plan → ryzyko → implementacja → recenzja →
   strategia testów → plan testów → testy manualne → automatyzacja → finalny code review →
   retrospektywa), zapisując artefakty w `docs/**`.

Szczegóły: [.github/agents/README.md](./.github/agents/README.md) i
[docs/orchestration/ORCHESTRATION.md](./docs/orchestration/ORCHESTRATION.md).

## Stos technologiczny

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Playwright (`@playwright/test`, `@axe-core/playwright`)
- Storage: wyłącznie `window.localStorage` — brak backendu/bazy danych

