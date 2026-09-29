"use client";

import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";

type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  createdAt: string;
};

const STORAGE_KEY = "test-orchestrator.shopping-list.v1";

export function ShoppingList() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, cannot run during SSR
    setItems(readStorage<ShoppingItem[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      writeStorage(STORAGE_KEY, items);
    }
  }, [items, hydrated]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const parsedQuantity = Number.parseInt(quantity, 10);

    if (!trimmedName || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return;
    }

    setItems((previous) => [
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        quantity: parsedQuantity,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
    setName("");
    setQuantity("1");
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50">{t.shoppingTitle}</h2>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          {t.shoppingProductCount(items.length)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          data-testid="shopping-list-name-input"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t.shoppingNamePlaceholder}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-white/15 dark:bg-neutral-800"
          aria-label={t.shoppingNamePlaceholder}
        />
        <input
          data-testid="shopping-list-quantity-input"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder={t.shoppingQuantityPlaceholder}
          className="w-28 rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-white/15 dark:bg-neutral-800"
          aria-label={t.shoppingQuantityPlaceholder}
        />
        <button
          data-testid="shopping-list-submit-button"
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          {t.addShoppingProduct}
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.shoppingEmpty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              data-testid="shopping-list-item"
              className="flex items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-emerald-950/20"
            >
              <span>
                {item.name} <span className="font-semibold">× {item.quantity}</span>
              </span>
              <button
                type="button"
                onClick={() => setItems((previous) => previous.filter((entry) => entry.id !== item.id))}
                className="text-xs font-medium text-red-600 transition hover:text-red-700 dark:text-red-400"
                aria-label={t.removeShoppingProduct(item.name)}
              >
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
