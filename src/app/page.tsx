"use client";

import { FilterBar } from "@/components/FilterBar";
import { SeedDataButton } from "@/components/SeedDataButton";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoStats } from "@/components/TodoStats";
import { useI18n } from "@/lib/i18n";
import { useTodos } from "@/hooks/useTodos";

export default function Home() {
  const { locale, setLocale, t } = useI18n();
  const {
    todos,
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
    seeding,
    seedError,
  } = useTodos();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <header className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {t.appTitle}
            </h1>
            <label className="flex items-center gap-2 text-xs text-zinc-500">
              <span>{t.languageLabel}</span>
              <select
                aria-label={t.languageLabel}
                value={locale}
                onChange={(event) => {
                  const nextLocale = event.target.value;
                  if (nextLocale === "pl" || nextLocale === "en") {
                    setLocale(nextLocale);
                  }
                }}
                className="rounded-md border border-black/15 bg-white px-2 py-1 text-xs text-black dark:border-white/15 dark:bg-neutral-800 dark:text-white"
              >
                <option value="pl">{t.polish}</option>
                <option value="en">{t.english}</option>
              </select>
            </label>
          </div>
          <p className="text-sm text-zinc-500">
            {t.localStorageNote}
          </p>
          <SeedDataButton onSeed={seedFromFakeApi} loading={seeding} error={seedError} />
          <a
            href="https://github.com/spiggyBe/demo-use-LLM-and-script-orchestrators-Two-managers-in-one-project/blob/master/README.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit animate-pulse items-center rounded-md bg-green-400 px-4 py-2 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >{t.readmeLink}</a>
        </header>

        <TodoForm onAdd={addTodo} />


        <section className="flex flex-col gap-3">
          <FilterBar
            filter={filter}
            onChange={setFilter}
            onClearCompleted={clearCompleted}
            hasCompleted={stats.completed > 0}
          />
          <TodoStats total={stats.total} active={stats.active} completed={stats.completed} />
          {hydrated && (
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          )}
        </section>
      </main>
    </div>
  );
}


