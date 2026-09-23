# Finalny code review: edycja-zadania

## Werdykt: GOTOWE DO WYDANIA (warunkowo — patrz uwaga o weryfikacji automatycznej)

## Wyniki weryfikacji automatycznej
- `npm run lint`: NIE URUCHOMIONO — środowisko tej sesji orkiestratora nie udostępnia narzędzia
  terminala. Zastępczo uruchomiono statyczną diagnostykę (`get_errors`) dla całego workspace:
  **0 błędów** (TypeScript + ESLint via language server) we wszystkich zmienionych plikach
  ([useTodos.ts](../../src/hooks/useTodos.ts), [TodoItem.tsx](../../src/components/TodoItem.tsx),
  [TodoList.tsx](../../src/components/TodoList.tsx), [page.tsx](../../src/app/page.tsx),
  [edycja-zadania.spec.ts](../../e2e/edycja-zadania.spec.ts)).
- `npx playwright test`: NIE URUCHOMIONO z tego samego powodu. **Rekomendacja: przed merge
  uruchomić `npm run lint && npx playwright test` lokalnie lub w CI** — to jest warunek
  konieczny przed realnym wydaniem, mimo że statyczna analiza nie wykazała błędów.

## Luki na styku etapów
- Brak luk: ryzyka "wysokie/blokujące" z rejestru (R2, R6) mają odzwierciedlenie zarówno w
  planie testów (tabela "Odniesienie do ryzyk"), jak i w konkretnych testach automatycznych
  (`edycja zadania ukończonego zachowuje stan completed` → R2; wszystkie testy używają
  `data-testid` → R6).
- Plan automatyzacji jasno uzasadnia 3 przypadki NIE zautomatyzowane (TC-08 XSS wizualny,
  TC-09 długi tekst wizualny, TC-10 nawigacja klawiaturą) — uzasadnienia są konkretne i spójne
  z ograniczeniami Playwright, nie są wymówkami.
- Nazewnictwo `<slug>` = `edycja-zadania` spójne we wszystkich artefaktach
  (planning, risk, architecture, reviews, test-plans, manual-tests, automation).
- `docs/reviews/review-implementation-edycja-zadania.md` ma werdykt ZATWIERDZONE — zgodnie z
  procesem, dalsze etapy mogły kontynuować bez cofania się.

## Błędy blokujące
_Brak błędów blokujących w dokumentacji ani w kodzie._

## Rekomendacja
Zadanie merytorycznie kompletne i spójne. Jedyny warunek przed realnym wydaniem: uruchomienie
`npm run lint` i `npx playwright test` w środowisku z dostępem do terminala/CI (niedostępne w
tej sesji orkiestratora) i potwierdzenie 100% PASS. Do czasu tej weryfikacji traktować jako
"gotowe do wydania po zielonym CI", a nie jako ostateczne potwierdzenie.
