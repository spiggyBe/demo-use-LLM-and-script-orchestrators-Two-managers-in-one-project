import { expect, test } from "./fixtures";

test.describe("Edycja istniejącego zadania na liście", () => {
  test("pokazuje formularz edycji wypełniony aktualnymi danymi zadania", async ({ todoPage }) => {
    await todoPage.addTodo({
      title: "Kupić mleko",
      description: "2 litry",
      priority: "high",
      category: "dom",
      dueDate: "2026-10-01",
    });

    const row = todoPage.row(0);
    await row.startEdit();

    await expect.soft(row.editTitleInput).toHaveValue("Kupić mleko");
    await expect.soft(row.editDescriptionInput).toHaveValue("2 litry");
    await expect.soft(row.editPrioritySelect).toHaveValue("high");
    await expect.soft(row.editCategorySelect).toHaveValue("dom");
    await expect.soft(row.editDueDateInput).toHaveValue("2026-10-01");
  });

  test("zapisuje zmiany wszystkich pól i aktualizuje zadanie na liście", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Kupić mleko" });
    const row = todoPage.row(0);
    await row.startEdit();
    await row.fillEdit({
      title: "Kupić mleko i chleb",
      description: "3 litry mleka",
      priority: "low",
      category: "praca",
      dueDate: "2026-11-15",
    });
    await row.saveEdit();

    await expect(row.editForm).toHaveCount(0);
    await expect.soft(row.title).toHaveText("Kupić mleko i chleb");
    await expect.soft(row.priorityBadge).toHaveText("low");
  });

  test("blokuje zapis edycji z pustym tytułem", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Kupić mleko" });
    const row = todoPage.row(0);
    await row.startEdit();
    await row.fillEdit({ title: "" });
    await row.saveEdit();

    await expect.soft(row.editFormError).toBeVisible();
    await expect.soft(row.editForm).toHaveCount(1);

    await row.cancelEdit();
    await expect(row.title).toHaveText("Kupić mleko");
  });

  test("anulowanie edycji nie zapisuje zmian", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Kupić mleko" });
    const row = todoPage.row(0);
    await row.startEdit();
    await row.fillEdit({ title: "Coś innego" });
    await row.cancelEdit();

    await expect.soft(row.editForm).toHaveCount(0);
    await expect(row.title).toHaveText("Kupić mleko");
  });

  test("edycja zadania ukończonego zachowuje stan completed", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Napisać raport" });
    const row = todoPage.row(0);
    await row.toggle();
    await expect(todoPage.statsCompleted).toHaveText("Ukończone: 1");

    await row.startEdit();
    await row.fillEdit({ title: "Napisać raport końcowy" });
    await row.saveEdit();

    await expect.soft(row.toggleCheckbox).toBeChecked();
    await expect.soft(todoPage.statsCompleted).toHaveText("Ukończone: 1");
  });

  test("tylko jedno zadanie może być edytowane naraz", async ({ todoPage }) => {
    await todoPage.addTodo({ title: "Zadanie A" });
    await todoPage.addTodo({ title: "Zadanie B" });

    await todoPage.row(0).startEdit();
    await expect(todoPage.editForms).toHaveCount(1);

    // Item A's edit button disappeared while editing (replaced by the form),
    // so the remaining edit button (for item B) is now at index 0.
    await todoPage.page.getByTestId("todo-edit-button").first().click();
    await expect(todoPage.editForms).toHaveCount(1);
  });

  test("zmiany z edycji przetrwają odświeżenie strony", async ({ todoPage, page }) => {
    await todoPage.addTodo({ title: "Kupić mleko" });
    const row = todoPage.row(0);
    await row.startEdit();
    await row.fillEdit({ title: "Kupić mleko UHT" });
    await row.saveEdit();

    await page.reload();
    await expect(todoPage.row(0).title).toHaveText("Kupić mleko UHT");
  });
});

