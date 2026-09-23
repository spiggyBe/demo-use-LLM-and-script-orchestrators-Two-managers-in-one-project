# ADR: edycja-zadania

## Kontekst
Aplikacja potrzebuje edycji istniejącego zadania (tytuł, opis, priorytet, kategoria, termin)
bezpośrednio na liście, bez osobnej strony. Plan: `docs/planning/plan-edycja-zadania.md`.
Ryzyka: `docs/risk/risk-register-edycja-zadania.md` (blokujące: R2, R6).

## Decyzja
1. `useTodos` dostaje nową funkcję `updateTodo(id: string, changes: NewTodoInput)`, która
   scala zmiany przez `id` (`prev.map`), zachowując `id`, `createdAt`, `completed` z istniejącego
   obiektu — adresuje R2.
2. `TodoItem` dostaje własny, lokalny stan trybu edycji (`isEditing`) oraz inline formularz
   edycji (bez wydzielania współdzielonego komponentu z `TodoForm` — pola są proste, a
   wydzielanie generycznego komponentu pól na tym etapie byłoby przedwczesną abstrakcją;
   R7 zanotowane jako świadomy, nieblokujący dług techniczny).
3. Stan "które zadanie jest edytowane" (`editingId`) trzymany jest w `TodoList` (rodzic
   `TodoItem`), żeby tylko jedno zadanie mogło być edytowane naraz — adresuje R5.
4. Wszystkie nowe elementy interaktywne dostają `data-testid`: `todo-edit-button`,
   `todo-edit-title-input`, `todo-edit-description-input`, `todo-edit-priority-select`,
   `todo-edit-category-select`, `todo-edit-due-date-input`, `todo-edit-save-button`,
   `todo-edit-cancel-button`, `todo-edit-form-error` — adresuje R6.
5. Walidacja: tytuł wymagany, ten sam komunikat błędu co w `TodoForm` ("Tytuł zadania jest
   wymagany.") — spójność UX.
6. Anulowanie edycji nie wywołuje `onUpdate`, tylko resetuje lokalny stan formularza i wychodzi
   z trybu edycji.

## Alternatywy rozważone i odrzucone
- **Osobna strona `/todos/[id]/edit`** — odrzucone: wymaganie jawnie wyklucza nawigację na
  osobną stronę.
- **Modal/dialog edycji** — odrzucone: wymaganie mówi o edycji "bezpośrednio na liście" (inline),
  modal dodaje niepotrzebną złożoność (focus trap, portal) bez korzyści dla tego zakresu.
- **Wydzielenie współdzielonego komponentu pól formularza (`TodoFields`) używanego przez
  `TodoForm` i `TodoItem`** — odrzucone na tym etapie: dwa formularze mają różne zachowania
  (dodawanie czyści pola po submit, edycja nie), a duplikacja jest niewielka (kilka pól).
  Zanotowane jako R7 do rozważenia w przyszłości, jeśli powstanie trzeci formularz.

## Konsekwencje
- Pozytywne: minimalna, izolowana zmiana; `id`/`createdAt`/`completed` chronione przed
  przypadkowym nadpisaniem; pełna zgodność z istniejącą konwencją `data-testid`.
- Negatywne / dług techniczny: niewielka duplikacja pól formularza między `TodoForm` a
  `TodoItem` (R7) — do rozważenia przy kolejnej zmianie dotykającej oba formularze.

## Zaadresowane ryzyka (z rejestru ryzyk)
- R1: Wartości renderowane wyłącznie jako tekst JSX, bez `dangerouslySetInnerHTML`.
- R2: `updateTodo` scala zmiany przez `id`, chroniąc `id`/`createdAt`/`completed`.
- R4: `aria-label` na polach edycji, przycisk "Zapisz" jako `type="submit"` (Enter zapisuje).
- R5: `editingId` w `TodoList` gwarantuje edycję tylko jednego zadania naraz.
- R6: Wszystkie nowe elementy interaktywne mają `data-testid`.
- R7: Świadomie odroczone (nieblokujące) — patrz "Alternatywy rozważone i odrzucone".
