# Retrospektywa procesu: edycja-zadania

## Podsumowanie przebiegu
| Etap | Agent | Artefakt | Ocena kompletności (1-5) |
|---|---|---|---|
| 1 | Project Planner | [plan-edycja-zadania.md](../planning/plan-edycja-zadania.md) | 5 |
| 2 | Risk Analyst | [risk-register-edycja-zadania.md](../risk/risk-register-edycja-zadania.md) | 5 |
| 3 | Solution Architect | [adr-edycja-zadania.md](../architecture/adr-edycja-zadania.md) + kod | 5 |
| 4 | Implementation Reviewer | [review-implementation-edycja-zadania.md](../reviews/review-implementation-edycja-zadania.md) | 4 |
| 5 | Test Strategy Writer | [test-strategy.md](../test-strategy/test-strategy.md) | 4 |
| 6 | Test Plan Writer | [test-plan-edycja-zadania.md](../test-plans/test-plan-edycja-zadania.md) | 5 |
| 7 | Manual Test Designer | [manual-cases-edycja-zadania.md](../manual-tests/manual-cases-edycja-zadania.md) | 5 |
| 8 | Automation Engineer | [automation-plan-edycja-zadania.md](../automation/automation-plan-edycja-zadania.md) + `e2e/edycja-zadania.spec.ts` | 3 |
| 9 | QA Production Lead | [review-final-edycja-zadania.md](../reviews/review-final-edycja-zadania.md) | 3 |
| 10 | Retrospective Reporter | ten dokument | — |

## Co zadziałało dobrze
- Ciągłość `<slug>` (`edycja-zadania`) była zachowana konsekwentnie we wszystkich artefaktach —
  nie ma "osieroconych" plików ani niespójnego nazewnictwa.
- Ryzyka blokujące z rejestru (R2 — ochrona `id`/`createdAt`/`completed`, R6 — `data-testid`)
  zostały faktycznie zaadresowane w kodzie (nie tylko wymienione w ADR) i zweryfikowane przez
  Implementation Reviewer z odniesieniem do konkretnych plików.
- Test Plan Writer poprawnie zbudował most między rejestrem ryzyk a konkretnymi testami
  (tabela "Odniesienie do ryzyk"), co ułatwiło Manual Test Designerowi i Automation Engineerowi
  priorytetyzację.
- Automation Engineer jasno uzasadnił, których przypadków NIE automatyzuje (XSS wizualny, długi
  tekst, klawiatura) zamiast automatyzować wszystko na siłę lub pomijać bez wyjaśnienia.

## Zidentyfikowane braki / powtarzające się problemy
- **Brak dostępu do terminala w tej sesji orkiestracji.** Zarówno Solution Architect (krok 5
  jego instrukcji: "uruchom `npm run lint`"), Automation Engineer (krok 5: "uruchom
  `npx playwright test`") jak i QA Production Lead (krok 2 jego instrukcji) mają w prompcie
  wymóg faktycznego wykonania poleceń weryfikacyjnych. W tej iteracji zastąpiono to statyczną
  diagnostyką (`get_errors`), co jest słabszym dowodem niż realny przebieg testów — to
  **powtarzający się problem w 3 z 10 etapów**, nie incydentalny błąd jednego agenta.
- Test Strategy Writer utworzył dokument projektowy w kontekście zadania dla pojedynczej
  funkcjonalności — zgodnie z zasadą "raz na projekt", ale orkiestrator musiał samodzielnie
  rozstrzygnąć, że dokument jeszcze nie istniał (brak automatycznej detekcji w prompcie agenta).

## Proponowane zmiany w promptach agentów
| Plik agenta | Proponowana zmiana | Uzasadnienie |
|---|---|---|
| `.github/agents/03-solution-architect.agent.md` | Dodać zdanie: "Jeśli narzędzie terminala (`execute`) jest niedostępne w bieżącej sesji, jawnie zgłoś to w Output Format jako ograniczenie i użyj diagnostyki statycznej (np. `get_errors`) jako zamiennika, zamiast pomijać krok bez komentarza." | W tej iteracji brak terminala wymusił improwizację; jawna instrukcja ujednolici zachowanie w przyszłych iteracjach. |
| `.github/agents/08-automation-engineer.agent.md` | Analogiczna adnotacja jak wyżej dla kroku "Uruchom `npx playwright test`". | Ten sam powtarzający się problem (brak `execute`). |
| `.github/agents/09-qa-production-lead.agent.md` | W sekcji "Werdykt" dodać wartość pośrednią: "GOTOWE DO WYDANIA PO WERYFIKACJI CI" na wypadek braku możliwości uruchomienia lint/testów w danej sesji, zamiast wymuszać binarne GOTOWE/WYMAGA POPRAWEK. | Obecny szablon nie przewiduje scenariusza "nie mogę zweryfikować", co zmusiło ten etap do dopisania własnej adnotacji poza szablonem. |
| `.github/agents/05-test-strategy-writer.agent.md` | Dodać krok 0: "Sprawdź czy `docs/test-strategy/test-strategy.md` istnieje (`file_search`) — jeśli tak, zaktualizuj; jeśli nie, utwórz nowy i jawnie zaznacz to w Output Format." | Doprecyzowanie usuwa niejednoznaczność, którą obecnie musi rozstrzygać orkiestrator/wykonawca "z zewnątrz". |

## Rekomendacja dla kolejnej iteracji
Wdrożyć powyższe 4 zmiany promptów przed kolejnym uruchomieniem pipeline'u — w szczególności
ujednolicić sposób raportowania braku dostępu do `execute`, ponieważ dotyczy to 3 różnych
agentów i bez tej poprawki każda kolejna iteracja będzie musiała improwizować to samo
rozwiązanie ad hoc. Dodatkowo: przed realnym wydaniem tej funkcjonalności koniecznie uruchomić
`npm run lint` i `npx playwright test` w środowisku z dostępem do terminala/CI.
