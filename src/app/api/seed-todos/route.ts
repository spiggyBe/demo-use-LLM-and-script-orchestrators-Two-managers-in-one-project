import { NextResponse } from "next/server";
import seedRows from "@/data/fake-todos-db.json";

/**
 * Fake "database" endpoint — no external DB is used anywhere in this app.
 * This route just serves a static JSON fixture with an artificial delay,
 * so e2e tests have a real network round-trip to wait for via
 * page.waitForResponse() instead of relying on arbitrary timeouts.
 */
const FAKE_DB_LATENCY_MS = 400;

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, FAKE_DB_LATENCY_MS));
  return NextResponse.json(seedRows);
}
