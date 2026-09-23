import type { Filter } from "@/types/todo";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "active", label: "Aktywne" },
  { value: "completed", label: "Ukończone" },
];

export function FilterBar({
  filter,
  onChange,
  onClearCompleted,
  hasCompleted,
}: {
  filter: Filter;
  onChange: (f: Filter) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div data-testid="todo-filter-bar" className="flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            data-testid={`todo-filter-${f.value}`}
            onClick={() => onChange(f.value)}
            aria-pressed={filter === f.value}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              filter === f.value
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button
        data-testid="todo-clear-completed-button"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
        className="text-xs text-neutral-400 underline decoration-dotted hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Wyczyść ukończone
      </button>
    </div>
  );
}
