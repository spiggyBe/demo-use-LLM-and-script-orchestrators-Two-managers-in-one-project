import type { Filter } from "@/types/todo";
import { useI18n } from "@/lib/i18n";

const FILTERS: Filter[] = ["all", "active", "completed"];

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
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between">
      <div data-testid="todo-filter-bar" className="flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            data-testid={`todo-filter-${f}`}
            onClick={() => onChange(f)}
            aria-pressed={filter === f}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {t.filters[f]}
          </button>
        ))}
      </div>
      <button
        data-testid="todo-clear-completed-button"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
        className="text-xs text-neutral-400 underline decoration-dotted hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.clearCompleted}
      </button>
    </div>
  );
}
