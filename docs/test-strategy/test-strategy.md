# Strategia testowania — Test Orchestrator (Todo List)

## Zakres i cele
Aplikacja Todo List (Next.js + TypeScript + Tailwind) przechowuje dane wyłącznie w
`localStorage` przeglądarki — brak backendu, bazy danych i API. Celem strategii jest zapewnienie,
że każda funkcjonalność (dodawanie, edycja, usuwanie, filtrowanie, statystyki zadań) działa
poprawnie, jest odporna na nieprawidłowe/nieoczekiwane dane w `localStorage` i jest pokryta
testami na poziomie adekwatnym do ryzyka.

## Piramida testów
1. **Statyczna analiza** (ESLint, TypeScript strict) — na każdą zmianę kodu, przed przejściem
   do etapu testowania.
2. **Testy E2E** (Playwright, przeglądarka Chromium) — kluczowe przepływy użytkownika: dodawanie,
   edycja, usuwanie, oznaczanie ukończenia, filtrowanie, trwałość danych w `localStorage`.
3. **Testy manualne eksploracyjne** — przypadki brzegowe trudne do zautomatyzowania (długie
   teksty, znaki specjalne, ręczna manipulacja `localStorage` w DevTools, dostępność).

Brak testów jednostkowych/komponentowych i kontraktowych/API w obecnym zakresie projektu —
aplikacja nie ma warstwy backendowej ani wydzielonej logiki na tyle złożonej, by uzasadnić
osobną warstwę testów komponentowych; logika stanu (`useTodos`) jest pokrywana pośrednio przez
testy E2E.

## Narzędzia
| Warstwa | Narzędzie |
|---|---|
| Statyczna analiza | ESLint (`next lint`), TypeScript (`tsc`, strict mode) |
| E2E | Playwright (`@playwright/test`) |
| Dostępność | Manualna weryfikacja nawigacji klawiaturą i `aria-label` (brak zautomatyzowanego axe-core w obecnym zakresie) |

## Środowiska testowe
- Lokalne: `npm run dev` + Playwright uruchamiany przeciwko lokalnemu serwerowi
  ([playwright.config.ts](../../playwright.config.ts)).
- `localStorage` czyszczony w `beforeEach` każdego testu E2E, aby zapewnić izolację i
  deterministyczne wyniki.

## Kryteria wejścia/wyjścia
- **Wejście do testowania funkcjonalności:** recenzja implementacji
  (`review-implementation-<slug>.md`) ma werdykt ZATWIERDZONE.
- **Wyjście (gotowość do wydania):** `npm run lint` przechodzi, wszystkie testy Playwright
  przechodzą (`npx playwright test`), finalny code review
  (`review-final-<slug>.md`) ma werdykt GOTOWE DO WYDANIA.

## Format dokumentacji
Markdown jako źródło prawdy (ten plik); HTML/PDF generowane na żądanie (np. `pandoc`), nigdy
utrzymywane ręcznie równolegle.

## Role i odpowiedzialności
- **Solution Architect** — implementuje kod i dba, by przechodził `npm run lint`.
- **Test Plan Writer / Manual Test Designer** — definiują zakres i przypadki testowe per
  funkcjonalność (`<slug>`).
- **Automation Engineer** — automatyzuje przypadki o wysokim priorytecie w Playwright.
- **QA Production Lead** — finalna brama jakości przed uznaniem zadania za gotowe.

## Historia zmian
| Data | Zmiana |
|---|---|
| 2026-09-23 | Utworzenie dokumentu strategii testowania (agent: Test Strategy Writer), w ramach zadania `edycja-zadania`. |
