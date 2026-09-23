import type { Locator } from "@playwright/test";
import type { TodoFormInput } from "./types";

/**
 * Component Object representing a single <li data-testid="todo-item"> row.
 * Encapsulates both the "read" view and the inline "edit" form that replaces
 * it while `isEditing` is true, so tests never depend on raw CSS selectors.
 */
export class TodoRow {
  constructor(private readonly root: Locator) {}

  get title(): Locator {
    return this.root.getByTestId("todo-title");
  }

  get description(): Locator {
    return this.root.locator(".text-neutral-500").first();
  }

  get toggleCheckbox(): Locator {
    return this.root.getByTestId("todo-toggle-checkbox");
  }

  get priorityBadge(): Locator {
    return this.root.getByTestId("todo-priority-badge");
  }

  get editButton(): Locator {
    return this.root.getByTestId("todo-edit-button");
  }

  get deleteButton(): Locator {
    return this.root.getByTestId("todo-delete-button");
  }

  get editForm(): Locator {
    return this.root.getByTestId("todo-edit-form");
  }

  get editTitleInput(): Locator {
    return this.root.getByTestId("todo-edit-title-input");
  }

  get editDescriptionInput(): Locator {
    return this.root.getByTestId("todo-edit-description-input");
  }

  get editPrioritySelect(): Locator {
    return this.root.getByTestId("todo-edit-priority-select");
  }

  get editCategorySelect(): Locator {
    return this.root.getByTestId("todo-edit-category-select");
  }

  get editDueDateInput(): Locator {
    return this.root.getByTestId("todo-edit-due-date-input");
  }

  get editSaveButton(): Locator {
    return this.root.getByTestId("todo-edit-save-button");
  }

  get editCancelButton(): Locator {
    return this.root.getByTestId("todo-edit-cancel-button");
  }

  get editFormError(): Locator {
    return this.root.getByTestId("todo-edit-form-error");
  }

  async toggle(): Promise<void> {
    await this.toggleCheckbox.click();
  }

  async delete(): Promise<void> {
    await this.deleteButton.click();
  }

  async startEdit(): Promise<void> {
    await this.editButton.click();
  }

  async fillEdit(changes: Partial<TodoFormInput>): Promise<void> {
    if (changes.title !== undefined) await this.editTitleInput.fill(changes.title);
    if (changes.description !== undefined) await this.editDescriptionInput.fill(changes.description);
    if (changes.priority) await this.editPrioritySelect.selectOption(changes.priority);
    if (changes.category) await this.editCategorySelect.selectOption(changes.category);
    if (changes.dueDate) await this.editDueDateInput.fill(changes.dueDate);
  }

  async saveEdit(): Promise<void> {
    await this.editSaveButton.click();
  }

  async cancelEdit(): Promise<void> {
    await this.editCancelButton.click();
  }
}
