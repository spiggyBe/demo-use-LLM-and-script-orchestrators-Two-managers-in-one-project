# Test Orchestrator - learning AI agent orchestration

Project exercise: a **Todo List** in Next.js + TypeScript + Tailwind, with data stored exclusively in the browser's `localStorage` (no external database). E2E tests are written in Playwright.

The real purpose of this repository, however, is a system of 11 specialized AI agents in [.github/agents/](./.github/agents/) that jointly plan, analyze risks, implement, test, and review any new feature in the application. The full orchestration architecture is described in [docs/orchestration/ORCHESTRATION.md](./docs/orchestration/ORCHESTRATION.md).

## About the project

This experimental weekend demo presents two approaches to agent orchestration:

- **AI orchestrator** - an LLM-based agent that makes decisions non-deterministically;
- **script orchestrator** - controlling code that provides deterministic behavior for the remaining agents.

The most important explanations of the agents and orchestration flow are in [docs/](./docs/). Start with [docs/README.md](./docs/README.md), which explains the contents of the subdirectories and artifacts. The English documentation index is [docs/README.en.md](./docs/README.en.md).

The application in [src/](./src/) is a working Todo app that can be run locally and used in a browser. Automated tests and everything needed to run them are in [e2e/](./e2e/).

The agents can create new features from a prompt, then test them and prepare documentation. This is an educational project built using *vibe coding*, with manual verification and a deliberate understanding that it is an experiment rather than a finished product.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm run lint          # ESLint + React rules
npm run test:e2e      # Playwright tests (E2E)
npm run test:e2e:ui   # Playwright in UI mode
npm run test:e2e:report
```

Feature documentation can be created and validated deterministically:

```bash
npm run docs:init -- --slug my-feature --title "My feature" --requirement "Requirement description"
npm run docs:validate
```

## AI agent orchestration

1. Open the agent chat in VS Code and choose **Orchestrator**.
2. Describe the feature to add, for example *"Add reminders for tasks"*.
3. The Orchestrator will take the task through 11 stages (planning -> risk -> implementation -> review -> test strategy -> test plan -> manual tests -> automation -> final code review -> implementation documentation -> retrospective), saving artifacts in `docs/**`.

Details: [.github/agents/README.md](./.github/agents/README.md), [.github/agents/README.en.md](./.github/agents/README.en.md), and [docs/orchestration/ORCHESTRATION.md](./docs/orchestration/ORCHESTRATION.md).

## Languages

The application starts in Polish. Use the language switcher in the top-right corner to switch
to English; the choice is stored locally in the browser. Polish documentation has matching
English files with the `.en.md` suffix, starting with this [English README](./README.en.md).

## Technology stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Playwright (`@playwright/test`, `@axe-core/playwright`)
- Storage: exclusively `window.localStorage` - no backend/database

## Language and documentation

Polish documents remain unchanged as the original repository documentation. English counterparts use the `.en.md` suffix and are placed beside their Polish source files. The root English README is [README.en.md](./README.en.md); English indexes are [docs/README.en.md](./docs/README.en.md) and [.github/agents/README.en.md](./.github/agents/README.en.md).
