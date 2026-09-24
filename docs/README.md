# Artefakty agentów

> **Wersja angielska:** Angielskie odpowiedniki mają przyrostek `.en.md` i znajdują się obok
> polskich oryginałów. Zobacz [English documentation index](./README.en.md). Oryginały polskie
> pozostają niezmienione i są dokumentami źródłowymi.

Ten katalog przechowuje artefakty generowane przez pipeline agentów AI opisany w
[orchestration/ORCHESTRATION.md](./orchestration/ORCHESTRATION.md).

| Katalog | Generuje agent |
|---|---|
| `planning/` | Project Planner |
| `risk/` | Risk Analyst |
| `architecture/` | Solution Architect |
| `reviews/` | Implementation Reviewer, QA Production Lead |
| `test-strategy/` | Test Strategy Writer |
| `test-plans/` | Test Plan Writer |
| `manual-tests/` | Manual Test Designer |
| `automation/` | Automation Engineer |
| `reports/` | Retrospective Reporter |

Raport `reports/implementation-<slug>.md` tworzy **Documentation Curator** po finalnym review.
Jest to zbiorcze podsumowanie faktycznie zaimplementowanych zmian, ich dowodów i luk.

Nazwy plików zawierają `<slug>` zadania, np. `plan-dark-mode.md`, aby powiązać artefakty tego
samego zadania między katalogami.

## Samodokumentowanie implementacji

Każda nowa funkcjonalność powinna mieć manifest w `docs/manifests/manifest-<slug>.json`. Manifest
jest wspólnym kontraktem dla orkiestratora LLM i skryptowej bramki weryfikacyjnej: przechowuje
listę artefaktów, ich status (`pending`, `in-progress`, `complete`, `blocked`), zmienione pliki
implementacji oraz historię aktualizacji.

Utworzenie dokumentacji dla nowego zadania:

```bash
npm run docs:init -- --slug reminders --title "Przypomnienia" --requirement "Opis wymagania" --source hybrid
```

Polecenie tworzy manifest, katalogi i brakujące pliki Markdown z minimalnymi sekcjami. Istniejące
pliki są zachowywane, więc można bezpiecznie uruchomić je ponownie przy wznowieniu zadania.

Po zakończeniu etapu aktualizuj manifest i dokument tego etapu:

```bash
npm run docs:update -- --slug reminders --artifact architecture --status complete \
	--summary "Dodano model i obsługę przypomnień" --files src/types/reminder.ts,src/hooks/useReminders.ts
```

Walidacja sprawdza wersję manifestu, spójność slug-a, statusy i istnienie wszystkich wymaganych
artefaktów:

```bash
npm run docs:validate
```

`npm run verify` wykonuje tę walidację przed lintem i testami Playwright. Skrypt sprawdza strukturę
i kompletność, natomiast zgodność merytoryczną kodu z opisem nadal oceniają agenci recenzujący.

Każdy artefakt dokumentacyjny ma również wersję angielską z przyrostkiem `.en.md`. Obie wersje
muszą być aktualizowane razem; walidator manifestu sprawdza istnienie obu plików.
