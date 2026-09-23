/**
 * Shared shape used both to fill the "add" form and the inline "edit" form
 * in the Todo app's Page Object Model.
 */
export interface TodoFormInput {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  category?: "praca" | "dom" | "nauka" | "inne";
  dueDate?: string;
}
