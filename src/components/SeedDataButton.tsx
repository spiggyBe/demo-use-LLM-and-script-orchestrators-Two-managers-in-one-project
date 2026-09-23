export function SeedDataButton({
  onSeed,
  loading,
  error,
}: {
  onSeed: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <button
        data-testid="todo-load-seed-button"
        onClick={onSeed}
        disabled={loading}
        className="self-start rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300"
      >
        {loading ? "Wczytywanie…" : "Załaduj przykładowe dane (fake API)"}
      </button>
      {loading && (
        <p data-testid="todo-seed-loading" className="text-xs text-neutral-400">
          Wczytywanie z fake API…
        </p>
      )}
      {error && (
        <p data-testid="todo-seed-error" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
