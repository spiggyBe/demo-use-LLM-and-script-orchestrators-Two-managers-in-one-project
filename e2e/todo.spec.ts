import { expect, test } from "./fixtures";

test.describe("Lista zadań (localStorage)", () => {
  test("dodaje nowe zadanie i pokazuje je na liście", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Kupić mleko" });

    await expect(todoPage.items).toHaveCount(1);
    await expect(todoPage.row(0).title).toHaveText("Kupić mleko");
  });

  test("nie pozwala dodać zadania bez tytułu", async ({ todoPage }) => {
    await todoPage.submitButton.click();

    await expect.soft(todoPage.formError).toBeVisible();
    await expect.soft(todoPage.items).toHaveCount(0);
  });

  test("oznacza zadanie jako ukończone i filtruje listę", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Napisać raport" });
    await todoPage.row(0).toggle();
    await expect.soft(todoPage.statsCompleted).toHaveText("Ukończone: 1");

    await todoPage.filterBy("active");
    await expect.soft(todoPage.emptyState).toBeVisible();

    await todoPage.filterBy("completed");
    await expect(todoPage.items).toHaveCount(1);
  });

  test("usuwa zadanie z listy", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Do usunięcia" });
    await expect(todoPage.items).toHaveCount(1);

    await todoPage.row(0).delete();
    await expect(todoPage.items).toHaveCount(0);
  });

  test("dane zadań przetrwają odświeżenie strony (persist w localStorage)", async ({
    todoPage,
    page,
  }) => {
    await todoPage.addTodo({ title: "Trwałe zadanie" });

    await page.reload();
    await expect(todoPage.items).toHaveCount(1);
    await expect(todoPage.row(0).title).toHaveText("Trwałe zadanie");
  });
});

