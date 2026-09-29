import { expect, test } from "@playwright/test";
import { TodoPage } from "./POM/TodoPage";

const todosStorageKey = "test-orchestrator.todos.v1";
const sampleTodoTitle = "Restored from saved browser state";

test("restores saved todos in a fresh browser context", async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();

  await expect(todoPage.items).toHaveCount(1);
  await expect(todoPage.rowByTitle(sampleTodoTitle).title).toHaveText(sampleTodoTitle);

  const restoredTodos = await page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, todosStorageKey);
  expect(restoredTodos).toEqual([
    expect.objectContaining({
      title: sampleTodoTitle,
      description: "Synthetic Playwright setup data",
      priority: "high",
      category: "praca",
      completed: false,
    }),
  ]);

  await page.reload();
  await expect(todoPage.rowByTitle(sampleTodoTitle).title).toHaveText(sampleTodoTitle);
});
