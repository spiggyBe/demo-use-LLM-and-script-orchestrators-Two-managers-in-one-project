# Test strategy - Test Orchestrator (Todo List)

## Scope and goals
The Todo List application (Next.js + TypeScript + Tailwind) stores data exclusively in the browser's `localStorage`; there is no backend, database, or API. The strategy ensures that each feature (adding, editing, deleting, filtering, and task statistics) works correctly, resists invalid/unexpected `localStorage` data, and receives test coverage appropriate to its risk.

## Test pyramid
1. **Static analysis** (ESLint, TypeScript strict) - on every code change, before testing.
2. **E2E tests** (Playwright, Chromium) - key user flows: adding, editing, deleting, completing, filtering, and `localStorage` persistence.
3. **Exploratory manual tests** - edge cases that are difficult to automate (long text, special characters, manual DevTools manipulation of `localStorage`, accessibility).

There are no unit/component or contract/API tests in the current project scope. The application has no backend layer or sufficiently complex extracted logic to justify a separate component-test layer; `useTodos` state logic is covered indirectly through E2E tests.

## Tools
| Layer | Tool |
|---|---|
| Static analysis | ESLint (`next lint`), TypeScript (`tsc`, strict mode) |
| E2E | Playwright (`@playwright/test`) |
| Accessibility | Manual keyboard-navigation and `aria-label` verification (no automated axe-core in the current scope) |

## Test environments
- Local: `npm run dev` + Playwright against the local server ([playwright.config.ts](../../playwright.config.ts)).
- `localStorage` is cleared in every E2E test's `beforeEach` for isolation and deterministic results.

## Entry/exit criteria
- **Feature testing entry:** implementation review (`review-implementation-<slug>.md`) has verdict APPROVED.
- **Release readiness exit:** `npm run lint` passes, all Playwright tests pass (`npx playwright test`), and final code review (`review-final-<slug>.md`) has verdict READY FOR RELEASE.

## Documentation format
Markdown is the source of truth (this file); HTML/PDF are generated on request (for example with `pandoc`) and are never maintained in parallel.

## Roles and responsibilities
- **Solution Architect** - implements code and ensures `npm run lint` passes.
- **Test Plan Writer / Manual Test Designer** - define feature-level scope and cases for each `<slug>`.
- **Automation Engineer** - automates high-priority cases in Playwright.
- **QA Production Lead** - final quality gate before a task is considered ready.

## Change history
| Date | Change |
|---|---|
| 2026-09-23 | Created the test strategy document (agent: Test Strategy Writer) as part of task `edycja-zadania`. |
