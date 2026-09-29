import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { TodoPage } from "./POM/TodoPage";

const storageStatePath = path.resolve(process.cwd(), "test-results/.auth/todos.json");
const todosStorageKey = "test-orchestrator.todos.v1";
const sampleTodoTitle = "Restored from saved browser state";

test("creates a reusable localStorage state through the todo UI", async ({ page, context }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  await todoPage.addTodo({
    title: sampleTodoTitle,
    description: "Synthetic Playwright setup data",
    priority: "high",
    category: "praca",
  });

  await expect(todoPage.items).toHaveCount(1);
  await expect(todoPage.row(0).title).toHaveText(sampleTodoTitle);
  await page.waitForFunction(
    ({ key, title }) => {
      try {
        const todos = JSON.parse(window.localStorage.getItem(key) ?? "[]") as Array<{
          title?: string;
        }>;
        return todos.some((todo) => todo.title === title);
      } catch {
        return false;
      }
    },
    { key: todosStorageKey, title: sampleTodoTitle },
  );

  await mkdir(path.dirname(storageStatePath), { recursive: true });
  await context.storageState({ path: storageStatePath });
});
