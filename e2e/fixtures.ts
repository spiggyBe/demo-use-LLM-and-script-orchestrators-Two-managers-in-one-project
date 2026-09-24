import { test as base } from "@playwright/test";
import { TodoPage } from "./pages/TodoPage";

interface Fixtures {
  /** Fully-navigated TodoPage with localStorage already cleared — deterministic starting state for every test. */
  todoPage: TodoPage;
}

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, registerFixture) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.resetStorage();
    await registerFixture(todoPage);
  },
});

export { expect } from "@playwright/test";
