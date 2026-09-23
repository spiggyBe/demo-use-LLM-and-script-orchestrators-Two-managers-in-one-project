# Przypadki testów manualnych: edycja-zadania

| ID | Tytuł | Priorytet |
|---|---|---|
| TC-edycja-zadania-01 | Wejście w tryb edycji pokazuje aktualne dane zadania | Wysoki |
| TC-edycja-zadania-02 | Zapis edycji wszystkich pól aktualizuje zadanie na liście | Wysoki |
| TC-edycja-zadania-03 | Zapis pustego tytułu jest blokowany | Wysoki |
| TC-edycja-zadania-04 | Anulowanie edycji nie zapisuje zmian | Wysoki |
| TC-edycja-zadania-05 | Edycja zadania ukończonego zachowuje `completed=true` | Wysoki |
| TC-edycja-zadania-06 | Tylko jedno zadanie może być edytowane naraz | Średni |
| TC-edycja-zadania-07 | Edycja zmian przetrwa odświeżenie strony (localStorage) | Średni |
| TC-edycja-zadania-08 | Tytuł ze znakami specjalnymi (`<script>`) renderowany jako tekst, nie wykonywany | Średni |
| TC-edycja-zadania-09 | Bardzo długi tytuł/opis nie łamie layoutu w sposób uniemożliwiający zapis | Niski |
| TC-edycja-zadania-10 | Nawigacja klawiaturą: Tab do przycisku "Edytuj", Enter zapisuje formularz | Niski |

---

### TC-edycja-zadania-01: Wejście w tryb edycji pokazuje aktualne dane zadania
- **Priorytet:** Wysoki
- **Warunki wstępne:** localStorage zawiera jedno zadanie: tytuł "Kupić mleko", opis "2 litry",
  priorytet `high`, kategoria `dom`, termin `2026-10-01`.
- **Kroki:**
  1. Otwórz aplikację, znajdź zadanie na liście.
  2. Kliknij przycisk "Edytuj" (`todo-edit-button`) na tym zadaniu.
- **Oczekiwany rezultat:** Element zadania przełącza się w formularz edycji (`todo-edit-form`)
  wypełniony dokładnie wartościami: tytuł "Kupić mleko", opis "2 litry", priorytet `high`,
  kategoria `dom`, termin `2026-10-01`. Reszta listy pozostaje niezmieniona.
- **Powiązane ryzyko:** R6

### TC-edycja-zadania-02: Zapis edycji wszystkich pól aktualizuje zadanie na liście
- **Priorytet:** Wysoki
- **Warunki wstępne:** localStorage zawiera jedno zadanie jak w TC-01, tryb edycji aktywny.
- **Kroki:**
  1. Zmień tytuł na "Kupić mleko i chleb".
  2. Zmień opis na "3 litry mleka".
  3. Zmień priorytet na `low`.
  4. Zmień kategorię na `praca`.
  5. Zmień termin na `2026-11-15`.
  6. Kliknij "Zapisz" (`todo-edit-save-button`).
- **Oczekiwany rezultat:** Formularz edycji znika, zadanie na liście wyświetla nowe wartości
  (tytuł, opis, badge priorytetu `low`, kategoria `praca`, termin `2026-11-15`).
- **Powiązane ryzyko:** R2

### TC-edycja-zadania-03: Zapis pustego tytułu jest blokowany
- **Priorytet:** Wysoki
- **Warunki wstępne:** Tryb edycji aktywny dla dowolnego zadania.
- **Kroki:**
  1. Usuń całą zawartość pola tytułu (`todo-edit-title-input`).
  2. Kliknij "Zapisz" (`todo-edit-save-button`).
- **Oczekiwany rezultat:** Wyświetla się komunikat błędu "Tytuł zadania jest wymagany."
  (`todo-edit-form-error`), formularz edycji pozostaje otwarty, zadanie nie zostało
  zaktualizowane.

### TC-edycja-zadania-04: Anulowanie edycji nie zapisuje zmian
- **Priorytet:** Wysoki
- **Warunki wstępne:** localStorage zawiera zadanie "Kupić mleko", tryb edycji aktywny.
- **Kroki:**
  1. Zmień tytuł na "Coś innego".
  2. Kliknij "Anuluj" (`todo-edit-cancel-button`).
- **Oczekiwany rezultat:** Formularz edycji znika, zadanie na liście nadal ma tytuł
  "Kupić mleko" (bez zmian).

### TC-edycja-zadania-05: Edycja zadania ukończonego zachowuje `completed=true`
- **Priorytet:** Wysoki
- **Warunki wstępne:** localStorage zawiera zadanie oznaczone jako ukończone (checkbox zaznaczony).
- **Kroki:**
  1. Kliknij "Edytuj" na ukończonym zadaniu.
  2. Zmień tytuł.
  3. Kliknij "Zapisz".
- **Oczekiwany rezultat:** Zadanie po zapisie nadal wyświetla się jako ukończone (przekreślony
  tytuł, checkbox zaznaczony) i licznik "Ukończone" w statystykach się nie zmienia.
- **Powiązane ryzyko:** R2

### TC-edycja-zadania-06: Tylko jedno zadanie może być edytowane naraz
- **Priorytet:** Średni
- **Warunki wstępne:** localStorage zawiera dwa zadania: A i B.
- **Kroki:**
  1. Kliknij "Edytuj" na zadaniu A (formularz edycji A się otwiera).
  2. Kliknij "Edytuj" na zadaniu B.
- **Oczekiwany rezultat:** Zadanie A wraca do widoku normalnego (bez zapisanych zmian, jeśli
  jakieś wprowadzono), zadanie B pokazuje formularz edycji.
- **Powiązane ryzyko:** R5

### TC-edycja-zadania-07: Edycja zmian przetrwa odświeżenie strony (localStorage)
- **Priorytet:** Średni
- **Warunki wstępne:** localStorage zawiera jedno zadanie.
- **Kroki:**
  1. Edytuj tytuł zadania i zapisz.
  2. Odśwież stronę (F5).
- **Oczekiwany rezultat:** Zadanie nadal wyświetla nowy (zapisany) tytuł po odświeżeniu.
- **Powiązane ryzyko:** R3

### TC-edycja-zadania-08: Tytuł ze znakami specjalnymi renderowany jako tekst
- **Priorytet:** Średni
- **Warunki wstępne:** Tryb edycji aktywny.
- **Kroki:**
  1. Wpisz w polu tytułu: `<script>alert(1)</script>`.
  2. Zapisz.
- **Oczekiwany rezultat:** Tytuł wyświetla się na liście jako dosłowny tekst
  `<script>alert(1)</script>` (widoczny jako tekst, bez wykonania skryptu, bez okna alert).
- **Powiązane ryzyko:** R1

### TC-edycja-zadania-09: Bardzo długi tytuł/opis nie łamie layoutu w sposób uniemożliwiający zapis
- **Priorytet:** Niski
- **Warunki wstępne:** Tryb edycji aktywny.
- **Kroki:**
  1. Wklej tytuł o długości ~500 znaków.
  2. Wklej opis o długości ~1000 znaków.
  3. Zapisz.
- **Oczekiwany rezultat:** Zapis się powodzi, tekst jest widoczny (może się zawijać), przyciski
  "Zapisz"/"Anuluj" pozostają klikalne.

### TC-edycja-zadania-10: Nawigacja klawiaturą
- **Priorytet:** Niski
- **Warunki wstępne:** localStorage zawiera jedno zadanie.
- **Kroki:**
  1. Używając wyłącznie klawisza Tab, przejdź fokus do przycisku "Edytuj" i naciśnij Enter/Space.
  2. W formularzu edycji zmień tytuł i naciśnij Enter (będąc w polu tytułu).
- **Oczekiwany rezultat:** Tryb edycji otwiera się i zamyka wyłącznie klawiaturą, formularz
  zapisuje się po Enter w polu tytułu (submit formularza).
- **Powiązane ryzyko:** R4
