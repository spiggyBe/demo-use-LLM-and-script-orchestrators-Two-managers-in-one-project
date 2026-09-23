import { expect, test } from "./fixtures";

/**
 * Demonstrates the recommended anti-flakiness pattern for network-driven UI:
 * `page.waitForResponse()` waits for the REAL response from the fake "database"
 * API route instead of an arbitrary `page.waitForTimeout()`, which would either
 * be too short (flaky) or too long (slow) depending on the machine running it.
 */
test.describe("Wczytywanie przykładowych danych z fake API (page.waitForResponse)", () => {
  test("klika przycisk, deterministycznie czeka na odpowiedź fake API i renderuje zaimportowane zadania", async ({
    todoPage,
  }) => {
    const response = await todoPage.loadSeedData();

    expect.soft(response.ok()).toBeTruthy();
    expect.soft(response.status()).toBe(200);

    const seedRows = (await response.json()) as unknown[];
    expect(Array.isArray(seedRows)).toBe(true);
    expect(seedRows.length).toBeGreaterThan(0);

    await expect(todoPage.items).toHaveCount(seedRows.length);
    await expect.soft(todoPage.seedLoading).toBeHidden();
    await expect.soft(todoPage.statsTotal).toHaveText(`Wszystkie: ${seedRows.length}`);
  });

  test("przycisk pokazuje stan ładowania dokładnie w trakcie oczekiwania na odpowiedź", async ({
    todoPage,
  }) => {
    // Start waiting BEFORE clicking so we never race the response.
    const responsePromise = todoPage.page.waitForResponse((res) =>
      res.url().includes("/api/seed-todos"),
    );
    await todoPage.seedButton.click();

    await expect(todoPage.seedLoading).toBeVisible();
    await responsePromise;

    await expect(todoPage.seedLoading).toBeHidden();
    await expect(todoPage.items).not.toHaveCount(0);
  });
});
