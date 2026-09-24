import { useState } from "react";
import type { Category, NewTodoInput, Priority, Todo } from "@/types/todo";
import { useI18n } from "@/lib/i18n";

const PRIORITY_STYLES: Record<Todo["priority"], string> = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const CATEGORIES: Category[] = ["praca", "dom", "nauka", "inne"];

function EditForm({
  todo,
  onSave,
  onCancel,
}: {
  todo: Todo;
  onSave: (changes: NewTodoInput) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [category, setCategory] = useState<Category>(todo.category);
  const [dueDate, setDueDate] = useState(todo.dueDate ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError(t.requiredTitle);
      return;
    }
    onSave({ title, description, priority, category, dueDate });
  }

  return (
    <form
      data-testid="todo-edit-form"
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col gap-2"
    >
      <div className="flex flex-col gap-1">
        <input
          data-testid="todo-edit-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-white/15 dark:bg-neutral-800"
          aria-label={t.editTitleLabel}
        />
        {error && (
          <p data-testid="todo-edit-form-error" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>

      <textarea
        data-testid="todo-edit-description-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="rounded-md border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-white/15 dark:bg-neutral-800"
        aria-label={t.editDescriptionLabel}
      />

      <div className="flex flex-wrap gap-2">
        <label className="flex flex-col gap-1 text-xs">
          {t.priorityLabel}
          <select
            data-testid="todo-edit-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-md border border-black/15 px-2 py-1 text-sm dark:border-white/15 dark:bg-neutral-800"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {t.priority[p]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          {t.categoryLabel}
          <select
            data-testid="todo-edit-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="rounded-md border border-black/15 px-2 py-1 text-sm dark:border-white/15 dark:bg-neutral-800"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t.category[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          {t.dueDateLabel}
          <input
            data-testid="todo-edit-due-date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md border border-black/15 px-2 py-1 text-sm dark:border-white/15 dark:bg-neutral-800"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          data-testid="todo-edit-save-button"
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          {t.save}
        </button>
        <button
          data-testid="todo-edit-cancel-button"
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

export function TodoItem({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onUpdate,
}: {
  todo: Todo;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, changes: NewTodoInput) => void;
}) {
  const { t } = useI18n();
  if (isEditing) {
    return (
      <li
        data-testid="todo-item"
        data-completed={todo.completed}
        data-editing="true"
        className="flex items-start gap-3 rounded-lg border border-blue-300 bg-white p-3 shadow-sm dark:border-blue-700 dark:bg-neutral-900"
      >
        <EditForm
          todo={todo}
          onSave={(changes) => {
            onUpdate(todo.id, changes);
            onCancelEdit();
          }}
          onCancel={onCancelEdit}
        />
      </li>
    );
  }

  return (
    <li
      data-testid="todo-item"
      data-completed={todo.completed}
      className="flex items-start gap-3 rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-neutral-900"
    >
      <input
        data-testid="todo-toggle-checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="mt-1 h-4 w-4"
        aria-label={todo.completed ? t.markIncomplete(todo.title) : t.markComplete(todo.title)}
      />

      <div className="flex-1">
        <p
          data-testid="todo-title"
          className={`text-sm font-medium ${todo.completed ? "text-neutral-400 line-through" : ""}`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-0.5 text-xs text-neutral-500">{todo.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
          <span
            data-testid="todo-priority-badge"
            className={`rounded px-1.5 py-0.5 font-medium ${PRIORITY_STYLES[todo.priority]}`}
          >
            {t.priority[todo.priority]}
          </span>
          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {t.category[todo.category]}
          </span>
          {todo.dueDate && (
            <span className="text-neutral-400">{t.dueDateLabel.toLowerCase()}: {todo.dueDate}</span>
          )}
        </div>
      </div>

      <button
        data-testid="todo-edit-button"
        onClick={() => onStartEdit(todo.id)}
        aria-label={`${t.edit} "${todo.title}"`}
        className="rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
      >
        {t.edit}
      </button>

      <button
        data-testid="todo-delete-button"
        onClick={() => onDelete(todo.id)}
        aria-label={`${t.remove} "${todo.title}"`}
        className="rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
      >
        {t.remove}
      </button>
    </li>
  );
}
