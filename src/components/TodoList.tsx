import { useState } from "react";
import type { NewTodoInput, Todo } from "@/types/todo";
import { TodoItem } from "./TodoItem";

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
  const [editingId, setEditingId] = useState<string | null>(null);

  if (todos.length === 0) {
    return (
      <p data-testid="todo-empty-state" className="text-sm text-neutral-400">
        Brak zadań do wyświetlenia.
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
