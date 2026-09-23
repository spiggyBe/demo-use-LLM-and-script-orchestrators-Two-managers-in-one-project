import type { Locator, Page, Response } from "@playwright/test";
import { TodoRow } from "./TodoRow";
import type { TodoFormInput } from "./types";

/**
 * Page Object Model for the Todo List page (`/`).
 * All selectors live here — tests should never reach for `page.locator(...)` directly.
 */
export class TodoPage {
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly prioritySelect: Locator;
  readonly categorySelect: Locator;
  readonly dueDateInput: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;

  readonly items: Locator;
  readonly editForms: Locator;
  readonly emptyState: Locator;

  readonly statsTotal: Locator;
  readonly statsActive: Locator;
  readonly statsCompleted: Locator;
  readonly clearCompletedButton: Locator;

  readonly seedButton: Locator;
  readonly seedLoading: Locator;
  readonly seedError: Locator;

  constructor(public readonly page: Page) {
    this.titleInput = page.getByTestId("todo-title-input");
    this.descriptionInput = page.getByTestId("todo-description-input");
    this.prioritySelect = page.getByTestId("todo-priority-select");
    this.categorySelect = page.getByTestId("todo-category-select");
    this.dueDateInput = page.getByTestId("todo-due-date-input");
    this.submitButton = page.getByTestId("todo-submit-button");
    this.formError = page.getByTestId("todo-form-error");

    this.items = page.getByTestId("todo-item");
    this.editForms = page.getByTestId("todo-edit-form");
    this.emptyState = page.getByTestId("todo-empty-state");

    this.statsTotal = page.getByTestId("todo-stats-total");
    this.statsActive = page.getByTestId("todo-stats-active");
    this.statsCompleted = page.getByTestId("todo-stats-completed");
    this.clearCompletedButton = page.getByTestId("todo-clear-completed-button");

    this.seedButton = page.getByTestId("todo-load-seed-button");
    this.seedLoading = page.getByTestId("todo-seed-loading");
    this.seedError = page.getByTestId("todo-seed-error");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  /** Clears localStorage and reloads so every test starts from an identical, empty baseline. */
  async resetStorage(): Promise<void> {
    await this.page.evaluate(() => window.localStorage.clear());
    await this.page.reload();
  }

  async addTodo(input: TodoFormInput): Promise<void> {
    await this.titleInput.fill(input.title);
    if (input.description) await this.descriptionInput.fill(input.description);
    if (input.priority) await this.prioritySelect.selectOption(input.priority);
    if (input.category) await this.categorySelect.selectOption(input.category);
    if (input.dueDate) await this.dueDateInput.fill(input.dueDate);
    await this.submitButton.click();
  }

  /** Returns a Component Object for the nth row (0-indexed) in current DOM order. */
  row(index: number): TodoRow {
    return new TodoRow(this.items.nth(index));
  }

  /** Returns a Component Object for the row whose visible title matches exactly. */
  rowByTitle(title: string): TodoRow {
    const scoped = this.items.filter({
      has: this.page.getByTestId("todo-title").getByText(title, { exact: true }),
    });
    return new TodoRow(scoped);
  }

  async filterBy(filter: "all" | "active" | "completed"): Promise<void> {
    await this.page.getByTestId(`todo-filter-${filter}`).click();
  }

  async clearCompleted(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  /**
   * Clicks the "load sample data" button and deterministically waits for the
   * real fake-API network response, instead of an arbitrary `page.waitForTimeout()`.
   * This is the anti-flakiness pattern this page object exists to demonstrate.
   */
  async loadSeedData(): Promise<Response> {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().includes("/api/seed-todos") && res.request().method() === "GET",
      ),
      this.seedButton.click(),
    ]);
    return response;
  }
}
