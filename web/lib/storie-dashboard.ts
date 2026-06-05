// Loader server-side della dashboard di lavoro illustrazioni delle 12 storie.
// Legge `public/data/storie-dashboard.json` (copiato dal catalogo statico
// `catalogo_web/data/storie.json` dal prebuild script copy-data.mjs).
//
// Cache: il modulo viene importato dai Server Component, Next dedup-a
// automaticamente per request. In più memoizziamo a livello modulo per evitare
// re-letture da disco multiple nello stesso processo build/runtime.
//
// NB: distinto da `lib/storie.ts`, che descrive la vista "pagine libro".

import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  DashboardStory,
  StorieDashboardData,
} from "@/lib/types-storie-dashboard";

const DATA_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "storie-dashboard.json",
);

let _cache: StorieDashboardData | null = null;

export async function getStorieDashboardData(): Promise<StorieDashboardData> {
  if (_cache) return _cache;
  const raw = await readFile(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw) as StorieDashboardData;
  _cache = parsed;
  return parsed;
}

export async function getAllStorieDashboard(): Promise<DashboardStory[]> {
  const data = await getStorieDashboardData();
  return data.storie;
}

export async function getStoriaDashboardBySid(
  sid: string,
): Promise<DashboardStory | null> {
  const data = await getStorieDashboardData();
  return data.storie.find((s) => s.sid === sid) ?? null;
}

export async function getAllDashboardSids(): Promise<string[]> {
  const data = await getStorieDashboardData();
  return data.storie.map((s) => s.sid);
}

export async function getSagaStyleReference(): Promise<string> {
  const data = await getStorieDashboardData();
  return data.saga_style_reference ?? "";
}
