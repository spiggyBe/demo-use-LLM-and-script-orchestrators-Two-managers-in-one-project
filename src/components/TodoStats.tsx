export function TodoStats({
  total,
  active,
  completed,
}: {
  total: number;
  active: number;
  completed: number;
}) {
  return (
    <div data-testid="todo-stats" className="flex gap-4 text-xs text-neutral-500">
      <span data-testid="todo-stats-total">Wszystkie: {total}</span>
      <span data-testid="todo-stats-active">Aktywne: {active}</span>
      <span data-testid="todo-stats-completed">Ukończone: {completed}</span>
    </div>
  );
}
