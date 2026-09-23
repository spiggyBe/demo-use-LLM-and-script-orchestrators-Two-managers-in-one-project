# Plan: Edycja istniejącego zadania bezpośrednio na liście

## Kontekst
Obecnie aplikacja pozwala tylko dodawać, oznaczać jako ukończone i usuwać zadania (`TodoForm`,
`TodoItem`, `useTodos`). Nie ma możliwości poprawienia pomyłki (literówka w tytule, zmiana
priorytetu/kategorii/terminu) bez usunięcia zadania i dodania go od nowa, co jest niewygodne
i powoduje utratę `createdAt`/`id`. Użytkownik oczekuje edycji inline, bez osobnej strony/routingu.

## User Story
Jako użytkownik listy zadań, chcę edytować tytuł, opis, priorytet, kategorię i termin
istniejącego zadania bezpośrednio na liście, aby poprawić błędy lub zaktualizować szczegóły
bez usuwania i ponownego tworzenia zadania.

## Zakres (in scope)
- Przycisk "Edytuj" na każdym elemencie listy (`TodoItem`), przełączający element w tryb edycji
  inline (bez nawigacji do innej strony/route'u).
- Formularz edycji z tymi samymi polami co formularz dodawania: tytuł, opis, priorytet,
  kategoria, termin.
- Zapis zmian (walidacja: tytuł wymagany) i anulowanie edycji (przywrócenie poprzednich wartości).
- Aktualizacja danych w `localStorage` przez nową funkcję `updateTodo` w `useTodos`.
- Zachowanie `id`, `createdAt` i `completed` bez zmian podczas edycji.

## Poza zakresem (out of scope)
- Edycja wielu zadań naraz (bulk edit).
- Historia zmian / undo.
- Edycja na osobnej podstronie/routingu.
- Zmiana stanu `completed` z poziomu formularza edycji (to już obsługuje checkbox).

## Kryteria akceptacji
- [ ] Kliknięcie "Edytuj" na zadaniu przełącza je w tryb edycji inline (formularz w miejscu
      widoku zadania, reszta listy bez zmian).
- [ ] Formularz edycji jest wstępnie wypełniony aktualnymi wartościami zadania.
- [ ] Zapis z pustym tytułem jest blokowany i pokazuje komunikat błędu (spójnie z `TodoForm`).
- [ ] Zapisanie poprawnych danych aktualizuje zadanie na liście i w `localStorage`, tryb edycji
      się zamyka.
- [ ] Anulowanie edycji przywraca poprzednie wartości i zamyka tryb edycji bez zapisu.
- [ ] Wszystkie nowe elementy interaktywne mają `data-testid`.

## Backlog zadań
1. Dodać `updateTodo(id, changes)` do `useTodos` (aktualizacja z zachowaniem `id`/`createdAt`).
2. Wydzielić współdzielone pola formularza (tytuł/opis/priorytet/kategoria/termin) do reużycia
   między dodawaniem a edycją, jeśli to nie zwiększa nadmiernie złożoności — w przeciwnym razie
   zaimplementować osobny inline formularz edycji w `TodoItem`.
3. Dodać stan trybu edycji (`isEditing`) w `TodoItem` oraz przyciski "Edytuj" / "Zapisz" / "Anuluj".
4. Podłączyć `onUpdate` przez `TodoList` → `TodoItem` → `page.tsx`.
5. Dodać walidację (tytuł wymagany) i komunikat błędu w trybie edycji.
6. Zweryfikować `npm run lint` i manualnie przetestować przepływ w przeglądarce.

## Znane niepewności / pytania otwarte
- Czy formularz edycji powinien współdzielić komponent z `TodoForm`, czy być osobnym,
  uproszczonym komponentem inline? (decyzja należy do Solution Architect — patrz ADR).
- Czy podczas edycji jednego zadania inne akcje na liście (toggle/delete/edycja innego zadania)
  powinny być zablokowane? Założenie: nie blokujemy, tylko jedno zadanie na raz w trybie edycji.
