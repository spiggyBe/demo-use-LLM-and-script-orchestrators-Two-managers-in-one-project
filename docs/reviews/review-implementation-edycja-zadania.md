# Recenzja implementacji: edycja-zadania

## Werdykt: ZATWIERDZONE

## Błędy blokujące
_Brak._

## Uwagi do rozważenia
- [TodoItem.tsx](../../src/components/TodoItem.tsx) — `EditForm` duplikuje pola formularza z
  [TodoForm.tsx](../../src/components/TodoForm.tsx) (tytuł/opis/priorytet/kategoria/termin).
  Zgodne ze świadomą decyzją w ADR (R7, dług techniczny nieblokujący) — akceptowalne dla zakresu
  tego zadania, ale warto wydzielić wspólny komponent pól przy kolejnej zmianie formularzy.
- Brak obsługi klawisza `Escape` do anulowania edycji (wspomniane w rejestrze ryzyk jako
  nice-to-have, R4) — nie blokuje, ale mogłoby poprawić UX klawiaturowy.
- Weryfikacja `npm run lint` / `npx playwright test` nie została uruchomiona w tej iteracji
  (brak narzędzia terminala w sesji orkiestratora) — zweryfikowano jedynie diagnostyką statyczną
  (`get_errors`, 0 błędów w całym workspace). Zalecenie: przed merge uruchomić oba polecenia
  lokalnie lub w CI.

## Rzeczy zrobione dobrze
- Kryteria akceptacji z [plan-edycja-zadania.md](../planning/plan-edycja-zadania.md) są w pełni
  zrealizowane: przycisk "Edytuj" (`todo-edit-button`) przełącza `TodoItem` w tryb inline
  (`isEditing`), formularz wstępnie wypełniony wartościami zadania, walidacja pustego tytułu
  (`todo-edit-form-error`), zapis aktualizuje listę i `localStorage` przez `updateTodo`,
  anulowanie (`todo-edit-cancel-button`) nie wywołuje `onUpdate`.
- Ryzyko R2 (rejestr ryzyk) zaadresowane poprawnie: `updateTodo` w
  [useTodos.ts](../../src/hooks/useTodos.ts) scala zmiany przez `id` (`prev.map`), jawnie
  zachowując `id`, `createdAt`, `completed` z istniejącego obiektu — nie nadpisuje całego rekordu.
- Ryzyko R5 zaadresowane: stan `editingId` trzymany w [TodoList.tsx](../../src/components/TodoList.tsx),
  więc tylko jedno zadanie na raz może być w trybie edycji.
- Ryzyko R6 zaadresowane: wszystkie nowe elementy interaktywne mają `data-testid`
  (`todo-edit-button`, `todo-edit-form`, `todo-edit-title-input`, `todo-edit-description-input`,
  `todo-edit-priority-select`, `todo-edit-category-select`, `todo-edit-due-date-input`,
  `todo-edit-save-button`, `todo-edit-cancel-button`, `todo-edit-form-error`).
- Ryzyko R1 zaadresowane: wartości renderowane wyłącznie jako tekst JSX, brak
  `dangerouslySetInnerHTML`.
- Typowanie TypeScript bez `any`; sygnatura `updateTodo(id: string, changes: NewTodoInput)`
  spójna z istniejącym `NewTodoInput`.
- ADR ([adr-edycja-zadania.md](../architecture/adr-edycja-zadania.md)) jasno uzasadnia decyzję
  o formularzu inline zamiast osobnej strony/modala, zgodnie z wymaganiem użytkownika.
