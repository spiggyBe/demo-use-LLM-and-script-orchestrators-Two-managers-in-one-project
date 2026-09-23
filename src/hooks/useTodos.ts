"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import type { Filter, NewTodoInput, Todo } from "@/types/todo";

const STORAGE_KEY = "test-orchestrator.todos.v1";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [hydrated, setHydrated] = useState(false);
  const [seedState, setSeedState] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  });

  // Load once on mount (client only) to avoid SSR/client markup mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, cannot run during SSR
    setTodos(readStorage<Todo[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEY, todos);
  }, [todos, hydrated]);

  const addTodo = useCallback((input: NewTodoInput) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      priority: input.priority,
      category: input.category,
      dueDate: input.dueDate || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  // Merge edited fields by id, preserving id/createdAt/completed of the original todo.
  const updateTodo = useCallback((id: string, changes: NewTodoInput) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: changes.title.trim(),
              description: changes.description?.trim() || undefined,
              priority: changes.priority,
              category: changes.category,
              dueDate: changes.dueDate || undefined,
            }
          : t,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  // Seeds todos from the fake "database" API route (src/app/api/seed-todos) — a
  // real fetch/response round-trip, used to demonstrate page.waitForResponse() in e2e tests.
  const seedFromFakeApi = useCallback(async () => {
    setSeedState({ loading: true, error: null });
    try {
      const response = await fetch("/api/seed-todos");
      if (!response.ok) {
        throw new Error(`Fake API zwróciło błąd: ${response.status}`);
      }
      const rows = (await response.json()) as NewTodoInput[];
      const now = new Date().toISOString();
      const seeded: Todo[] = rows.map((row) => ({
        id: crypto.randomUUID(),
        title: row.title,
        description: row.description,
        priority: row.priority,
        category: row.category,
        dueDate: row.dueDate,
        completed: false,
        createdAt: now,
      }));
      setTodos((prev) => [...seeded, ...prev]);
      setSeedState({ loading: false, error: null });
    } catch (err) {
      setSeedState({
        loading: false,
        error: err instanceof Error ? err.message : "Nieznany błąd wczytywania danych.",
      });
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos],
  );

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    stats,
    hydrated,
    seedFromFakeApi,
    seeding: seedState.loading,
    seedError: seedState.error,
  };
}
