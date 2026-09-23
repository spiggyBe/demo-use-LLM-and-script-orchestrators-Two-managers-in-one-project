# Plan testów: edycja-zadania

## Odniesienie do ryzyk
| Ryzyko (z rejestru) | Sposób pokrycia testami |
|---|---|
| R1 — bezpieczne renderowanie edytowanych wartości | Manualny TC ze znakami specjalnymi/HTML w tytule i opisie; weryfikacja braku wykonania skryptu. |
| R2 — `updateTodo` nie może nadpisać `id`/`createdAt`/`completed` | Automatyczny test: edycja zadania ukończonego — sprawdzenie, że `completed` pozostaje `true` po zapisaniu edycji; manualny TC porównujący `id` przed/po edycji. |
| R4 — dostępność formularza edycji | Manualny TC nawigacji klawiaturą (Tab, Enter zapisuje). |
| R5 — tylko jedno zadanie w edycji naraz | Manualny + automatyczny TC: otwarcie edycji zadania A, próba edycji zadania B, sprawdzenie że A wraca do widoku normalnego. |
| R6 — stabilne `data-testid` | Warunek wstępny automatyzacji — zweryfikowany przez Automation Engineer przy pisaniu selektorów. |

## Zakres testowania
- Funkcjonalne: wejście w tryb edycji, wypełnienie formularza aktualnymi danymi, zapis zmian
  (wszystkie pola: tytuł, opis, priorytet, kategoria, termin), anulowanie edycji, walidacja
  pustego tytułu.
- Regresyjne: dodawanie, usuwanie, toggle ukończenia, filtrowanie i trwałość danych po
  odświeżeniu — muszą nadal działać niezmienione ([todo.spec.ts](../../e2e/todo.spec.ts)).
- Dostępność (a11y): nawigacja klawiaturą do przycisku "Edytuj" i w formularzu edycji,
  `aria-label` na polach.
- Poza zakresem: edycja wielu zadań naraz, historia zmian/undo, edycja na osobnej stronie.

## Podejście
| Obszar | Manualne | Automatyczne (Playwright) |
|---|---|---|
| Wejście w tryb edycji i wypełnienie danymi | Tak | Tak |
| Zapis zmian wszystkich pól | Tak | Tak |
| Walidacja pustego tytułu w edycji | Tak | Tak |
| Anulowanie edycji (brak zapisu) | Tak | Tak |
| Zachowanie `completed`/`id` po edycji | Tak | Tak |
| Tylko jedno zadanie w edycji naraz | Tak | Tak |
| Znaki specjalne / długi tekst / XSS | Tak | Nie (eksploracyjne) |
| Dostępność klawiaturowa | Tak | Nie (wymaga oceny wizualnej/manualnej) |

## Dane testowe
- Zadanie bazowe: tytuł "Kupić mleko", priorytet `medium`, kategoria `inne`, bez opisu/terminu.
- Zadanie z pełnymi danymi: tytuł, opis, priorytet `high`, kategoria `praca`, termin `2026-12-31`.
- Zadanie ukończone (do testu zachowania `completed`).
- Tytuł z znakami specjalnymi: `<script>alert(1)</script>` (test R1 — brak wykonania).

## Kryteria wejścia
- Implementacja przeszła recenzję (`review-implementation-edycja-zadania.md` = ZATWIERDZONE) — ✅ spełnione.

## Kryteria wyjścia
- Wszystkie przypadki testowe krytyczne (priorytet Wysoki) = PASS.
- Brak błędów blokujących w rejestrze błędów / recenzji.

## Środowisko testowe
- Przeglądarka: Chromium (Playwright), `localStorage` czyszczony przed każdym testem.
