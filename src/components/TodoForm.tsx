"use client";

import { useState } from "react";
import type { Category, NewTodoInput, Priority } from "@/types/todo";

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const CATEGORIES: Category[] = ["praca", "dom", "nauka", "inne"];

export function TodoForm({ onAdd }: { onAdd: (input: NewTodoInput) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("inne");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Tytuł zadania jest wymagany.");
      return;
    }
    onAdd({ title, description, priority, category, dueDate });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("inne");
    setDueDate("");
    setError("");
  }

  return (
    <form
      data-testid="todo-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900"
    >
      <div className="flex flex-col gap-1">
        <input
          data-testid="todo-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Co trzeba zrobić?"
          className="rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-white/15 dark:bg-neutral-800"
          aria-label="Tytuł zadania"
        />
        {error && (
          <p data-testid="todo-form-error" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>

      <textarea
        data-testid="todo-description-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Opis (opcjonalnie)"
        rows={2}
        className="rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-white/15 dark:bg-neutral-800"
        aria-label="Opis zadania"
      />

      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs">
          Priorytet
          <select
            data-testid="todo-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-md border border-black/15 px-2 py-1.5 text-sm dark:border-white/15 dark:bg-neutral-800"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          Kategoria
          <select
            data-testid="todo-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="rounded-md border border-black/15 px-2 py-1.5 text-sm dark:border-white/15 dark:bg-neutral-800"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          Termin
          <input
            data-testid="todo-due-date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md border border-black/15 px-2 py-1.5 text-sm dark:border-white/15 dark:bg-neutral-800"
          />
        </label>
      </div>

      <button
        data-testid="todo-submit-button"
        type="submit"
        className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Dodaj zadanie
      </button>
    </form>
  );
}
