// Loader server-side delle 12 storie del libro.
// Legge `public/data/storie.json` (popolato dal prebuild script build-storie.mjs).

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Story, StorieData } from "@/lib/types-storie";

const DATA_PATH = path.join(process.cwd(), "public", "data", "storie.json");

let _cache: StorieData | null = null;

export async function getStorieData(): Promise<StorieData> {
  if (_cache) return _cache;
  const raw = await readFile(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw) as StorieData;
  _cache = parsed;
  return parsed;
}

export async function getAllStorie(): Promise<Story[]> {
  const data = await getStorieData();
  return data.stories;
}

export async function getStoriaBySid(sid: string): Promise<Story | null> {
  const data = await getStorieData();
  return data.stories.find((s) => s.sid === sid) ?? null;
}

export async function getAllSids(): Promise<string[]> {
  const data = await getStorieData();
  return data.stories.map((s) => s.sid);
}
