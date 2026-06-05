// Loader server-side dell'atlante saga (Orchestra).
// Legge `public/data/orchestra.json` (popolato dal prebuild
// `scripts/build-orchestra-data.mjs`).

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { OrchestraData } from "@/lib/types-orchestra";

const DATA_PATH = path.join(process.cwd(), "public", "data", "orchestra.json");

let _cache: OrchestraData | null = null;

export async function getOrchestraData(): Promise<OrchestraData> {
  if (_cache) return _cache;
  const raw = await readFile(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw) as OrchestraData;
  _cache = parsed;
  return parsed;
}
