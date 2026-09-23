# Plan automatyzacji: edycja-zadania

| TC-ID | Automatyzować? | Plik/test Playwright | Powód (jeśli NIE) |
|---|---|---|---|
| TC-edycja-zadania-01 | Tak | e2e/edycja-zadania.spec.ts › "pokazuje formularz edycji wypełniony aktualnymi danymi zadania" | |
| TC-edycja-zadania-02 | Tak | e2e/edycja-zadania.spec.ts › "zapisuje zmiany wszystkich pól i aktualizuje zadanie na liście" | |
| TC-edycja-zadania-03 | Tak | e2e/edycja-zadania.spec.ts › "blokuje zapis edycji z pustym tytułem" | |
| TC-edycja-zadania-04 | Tak | e2e/edycja-zadania.spec.ts › "anulowanie edycji nie zapisuje zmian" | |
| TC-edycja-zadania-05 | Tak | e2e/edycja-zadania.spec.ts › "edycja zadania ukończonego zachowuje stan completed" | |
| TC-edycja-zadania-06 | Tak | e2e/edycja-zadania.spec.ts › "tylko jedno zadanie może być edytowane naraz" | |
| TC-edycja-zadania-07 | Tak | e2e/edycja-zadania.spec.ts › "zmiany z edycji przetrwają odświeżenie strony" | |
| TC-edycja-zadania-08 | Nie | — | Weryfikacja braku wykonania skryptu w przeglądarce jest trudna do jednoznacznej automatyzacji bez nadmiernej złożoności (nasłuch na `dialog`/globalne zmienne); wystarczy manualna kontrola wizualna renderowanego tekstu. |
| TC-edycja-zadania-09 | Nie | — | Eksploracyjny test wizualny (łamanie layoutu) — ocena "czy tekst wygląda dobrze" wymaga oceny człowieka, nie asercji. |
| TC-edycja-zadania-10 | Nie | — | Pełna nawigacja klawiaturą (Tab w konkretnej kolejności DOM, wizualny fokus) jest niestabilna w Playwright bez dodatkowej infrastruktury i lepiej nadaje się do manualnej weryfikacji a11y. |

## Podsumowanie
Zautomatyzowano 7/10 przypadków (wszystkie priorytet Wysoki i Średni dotyczące logiki
funkcjonalnej i trwałości danych). Pozostałe 3 (znaki specjalne/XSS, długi tekst, klawiatura)
pozostają manualne/eksploracyjne zgodnie z uzasadnieniem powyżej.
