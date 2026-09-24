import { useState } from "react";
import type { NewTodoInput, Todo } from "@/types/todo";
import { TodoItem } from "./TodoItem";
import { useI18n } from "@/lib/i18n";

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
}: {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: NewTodoInput) => void;
}) {
  const { t } = useI18n();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (todos.length === 0) {
    return (
      <p data-testid="todo-empty-state" className="text-sm text-neutral-400">
        {t.empty}
      </p>
    );
  }

  return (
    <ul data-testid="todo-list" className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={setEditingId}
          onCancelEdit={() => setEditingId(null)}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
