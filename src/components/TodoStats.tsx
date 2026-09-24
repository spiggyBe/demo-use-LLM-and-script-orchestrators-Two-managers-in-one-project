import { useI18n } from "@/lib/i18n";

export function TodoStats({
  total,
  active,
  completed,
}: {
  total: number;
  active: number;
  completed: number;
}) {
  const { t } = useI18n();
  return (
    <div data-testid="todo-stats" className="flex gap-4 text-xs text-neutral-500">
      <span data-testid="todo-stats-total">{t.stats.all}: {total}</span>
      <span data-testid="todo-stats-active">{t.stats.active}: {active}</span>
      <span data-testid="todo-stats-completed">{t.stats.completed}: {completed}</span>
    </div>
  );
}
