# Ryzyka współpracy wieloagentowej — analiza z realnych eksperymentów

Ten dokument odpowiada na pytanie: *"czy orkiestrator powinien być kodem, a nie agentem?"*
oraz podsumowuje ryzyka współpracy agentów, zebrane przez **faktyczne uruchomienie** kilku
scenariuszy na subagentach w tym repozytorium (nie są to hipotetyczne rozważania — każdy wynik
poniżej został zaobserwowany w realnym przebiegu i zweryfikowany niezależnie przez `npm run lint`
/ `npx playwright test` uruchomione ręcznie, poza kontekstem agenta).

## Odpowiedź na pytanie wyjściowe

**Częściowo tak, częściowo nie da się (i nie warto) tego rozdzielić w 100%.** Orkiestrację da się
podzielić na dwie warstwy:

- **Warstwa decyzyjna (LLM/agent)** — planowanie, ocena ryzyka, projektowanie architektury,
  interpretacja wyników, decyzja "czy wracać do poprzedniego etapu". Tego nie da się sensownie
  zakodować deterministycznie — wymaga rozumienia kontekstu.
- **Warstwa egzekucyjna (deterministyczny kod)** — uruchamianie lint/testów, sprawdzanie czy
  plik istnieje, liczenie exit code'ów. To **musi** być kod, bo LLM — jak pokazał eksperyment
  niżej — potrafi w dobrej wierze zgłosić "PASS" na podstawie niepełnej weryfikacji.

Nie zbudowaliśmy w pełni osobnego "orkiestratora jako pliku .ts", bo obecna platforma (agenci
`.agent.md` + subagenci) nie daje mi potwierdzonego, udokumentowanego API do wywoływania
subagentów z zewnętrznego skryptu Node/TS — subagentów wywołuje się przez narzędzie `agent`
dostępne agentowi LLM w czacie. Zamiast tego wdrożyliśmy **hybrydę zgodną z dokumentacją**:
agent LLM (Orchestrator) nadal decyduje o przepływie, ale krytyczne punkty weryfikacji są
"zabetonowane" w kodzie przez **hooki** (`scripts/verify.mjs` + `SubagentStop`) — patrz
sekcja 4. To jest wzorzec **wprost opisany w dokumentacji hooków**: *"Instructions/Agents = guidance
(non-deterministic); Hooks = runtime enforcement (deterministic)"*.

## 1. Metodologia

Uruchomiono realne wywołania subagentów (`runSubagent`) w trzech scenariuszach, obserwując
faktyczne odpowiedzi (nie przewidywania):

| # | Scenariusz | Cel |
|---|---|---|
| E1 | `QA Production Lead` recenzuje slug, dla którego nie istnieje ŻADEN artefakt | Czy agent zmyśli "OK", czy wykryje brak? |
| E2 | `Automation Engineer` ma zautomatyzować testy bez istniejących przypadków manualnych | Jak wyżej, dla innego agenta |
| E3 | Łańcuch: `Risk Analyst` → `Solution Architect` (celowo NIE poinformowany o rejestrze ryzyk) → weryfikacja niezależna | Czy "stratny handoff" powoduje pominięcie ryzyka? Czy deklaracja "PASS" jest prawdziwa? |

## 2. Wyniki

### E1 i E2 — pozytywne (agenci NIE zmyślali)
Oba agenty poprawnie wykryły brak plików wejściowych, odmówiły "zgadywania" i zwróciły jasną
rekomendację cofnięcia się do wcześniejszego etapu. **Wniosek:** jawne instrukcje w promptach
("NIE automatyzuj na ślepo", "przeczytaj X przed Y") działają — ale to zależy od jakości promptu,
nie jest to gwarancja architektoniczna.

### E3 — ujawnił dwa realne zjawiska

1. **Odporność na "stratny handoff" (pozytywne).** Mimo że *celowo* nie przekazałem
   `Solution Architect` informacji o rejestrze ryzyk, agent sam odnalazł
   `docs/risk/risk-register-<slug>.md` po konwencji nazewniczej i zaadresował ryzyka R1/R3/R8.
   Działa to, bo każdy prompt ma zaszyty krok "przeczytaj plik o tej konkretnej nazwie" — czyli
   **konwencja nazewnicza plików pełni częściowo rolę deterministycznego kontraktu.**

2. **Niepełna weryfikacja = fałszywe poczucie bezpieczeństwa (BLOKUJĄCE, potwierdzone).**
   Agent zgłosił: *"`npm run lint` — PASS, `npm run build` — PASS"* i uznał zadanie za gotowe.
   Po niezależnym uruchomieniu **pełnego** `npx playwright test` przeze mnie okazało się, że
   zmiana (zamiana pola opisu na `contentEditable`) **zepsuła istniejący test innej
   funkcjonalności** (edycja zadania) — 1 z 12 testów failował. Agent nigdy nie uruchomił
   Playwright, więc nie mógł tego wiedzieć — ale zgłosił ogólne "PASS", co w praktyce brzmiało
   jak pełna gwarancja jakości.

   **To jest dokładnie to ryzyko, o którym wspomniałeś wcześniej** i bezpośrednia odpowiedź na
   pytanie "czy orkiestrator powinien być kodem" — self-reporting przez LLM jest niewystarczające
   jako jedyna bramka jakości.

## 3. Katalog ryzyk i mitygacji

| ID | Ryzyko | Status | Mitygacja |
|----|--------|--------|-----------|
| RC1 | Agent deklaruje sukces na podstawie niepełnej/niewłaściwej weryfikacji | **Potwierdzone empirycznie (E3)** | Deterministyczny hook `SubagentStop` → `scripts/verify.mjs` uruchamia PEŁNY `lint` + PEŁNY `playwright test` niezależnie od tego, co agent sam uruchomił |
| RC2 | Zgubiony kontekst / "stratny handoff" między agentami (subagenci są bezstanowi) | Częściowo zmitygowane konwencją nazw plików (zaobserwowane w E3), ale krucha (zależy od dyscypliny promptu) | Trzymać się sztywnej konwencji `<typ>-<slug>.md`; rozważyć w przyszłości manifest `docs/manifest-<slug>.json` z listą wymaganych artefaktów, czytany przez każdego agenta |
| RC3 | Pominięcie/ ominięcie etapu pipeline'u (np. wywołanie agenta 8 bez 7) | Nie zaobserwowano w E1/E2 (agenci poprawnie odmówili) — ale to zależy od jakości promptu, nie od architektury | Rozważyć lekki `SubagentStart` hook sprawdzający istnienie plików poprzedników (uwaga: patrz ograniczenie w sekcji 4 — hook nie zna `<slug>`, więc może sprawdzić tylko "czy katalog nie jest pusty", nie "czy istnieje plik dla TEGO sluga") |
| RC4 | Cykliczne/wzajemne wywołania agentów (A woła B woła A) | Zmitygowane strukturalnie | `orchestrator.agent.md` ma jawną listę `agents:` bez samego siebie; agenci 01-10 w ogóle nie mają narzędzia `agent` w `tools:`, więc fizycznie nie mogą wywoływać innych subagentów — struktura pipeline'u jest gwiazdą (hub-and-spoke), nie grafem, co eliminuje cykle |
| RC5 | Równoległa edycja tych samych plików przez dwóch agentów (race condition) | Nie zaobserwowane (pipeline jest sekwencyjny z założenia) | Instrukcja w `orchestrator.agent.md`: etapy edytujące kod (3, 8) nigdy nie są wywoływane równolegle |
| RC6 | Dryf dokumentacji względem kodu (agent opisuje w ADR/planie coś, czego kod faktycznie nie robi) | Ryzyko teoretyczne (rozumowane, nie testowane w tej sesji) | Brak w pełni automatycznej kontroli — częściowo łagodzi to `Implementation Reviewer`/`QA Production Lead`, które czytają realny kod, nie tylko dokumenty |

## 4. Ograniczenia — czego NIE udało się (jeszcze) zrobić i dlaczego

Będąc precyzyjnym, żeby niczego nie zmyślać:

- **Hooki nie mają dostępu do `<slug>` ustalanego dynamicznie w rozmowie.** Dokumentacja hooków
  potwierdza, że komendy hooków są statyczne (`command`, `cwd`, `env`, `timeout`) i nie ma
  udokumentowanego mechanizmu wstrzykiwania zmiennych z treści promptu użytkownika do komendy
  hooka. Dlatego `scripts/verify.mjs` weryfikuje **cały projekt** (lint + cały zestaw e2e), a NIE
  wyłącznie artefakty bieżącego `<slug>` — w praktyce to nawet lepsze (złapało regresję
  międzyfunkcyjną w E3), ale nie jest to "gate specyficzny dla zadania".
- **Nie zweryfikowałem**, czy `SubagentStop` obsługuje identyczny kontrakt JSON/blokujący co
  `PostToolUse` (dokumentacja opisuje `decision: block` wprost tylko dla `PostToolUse`) — kod
  hooka stosuje się do ogólnego kontraktu kodów wyjścia (`0` = sukces, `2` = błąd blokujący),
  który dokumentacja opisuje jako uniwersalny dla wszystkich zdarzeń, ale nie testowałem tego
  telemetrycznie w praktyce (brak w tej sesji sposobu na podgląd, czy hook faktycznie się
  wykonał i zablokował subagenta).
- **Nie zbudowałem** samodzielnego orkiestratora jako skryptu Node/TS wywołującego subagentów
  bezpośrednio (bez pośrednictwa czatu) — nie znalazłem w dostępnej dokumentacji potwierdzonego,
  publicznego API do tego w tym środowisku. Jeśli taki mechanizm istnieje (np. CLI/SDK), nie mam
  o nim pewnej wiedzy i wolę to przyznać niż zmyślić sposób wywołania.

## 5. Rekomendacja

Zostaw **decyzje** (co robić, jak interpretować ryzyko, kiedy cofnąć proces) po stronie agentów
LLM — to ich mocna strona. Ale każdy punkt, w którym agent "zgłasza wynik weryfikacji", powinien
być podparty niezależnym, deterministycznym pomiarem (`scripts/verify.mjs` przez hook
`SubagentStop`), tak jak wdrożono dla agentów 03, 08 i 09 w tej sesji.
