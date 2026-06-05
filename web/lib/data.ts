// Loader server-side dei dati catalogo.
// Legge `public/data/entities.json` (popolato dal prebuild script copy-data.mjs).
//
// Cache: il modulo viene importato dai Server Component, Next dedup-a
// automaticamente per request. In più memoizziamo a livello modulo per evitare
// re-letture da disco multiple nello stesso processo build/runtime.

import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  Entity,
  EntitiesData,
  Tree,
  TreeNode,
} from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "public", "data", "entities.json");

let _cache: EntitiesData | null = null;

export async function getEntitiesData(): Promise<EntitiesData> {
  if (_cache) return _cache;
  const raw = await readFile(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw) as EntitiesData;
  _cache = parsed;
  return parsed;
}

export async function getEntityById(id: string): Promise<Entity | null> {
  const data = await getEntitiesData();
  return data.entities.find((e) => e.id === id) ?? null;
}

export async function getAllEntityIds(): Promise<string[]> {
  const data = await getEntitiesData();
  return data.entities.map((e) => e.id);
}

/**
 * Base URL + helper per immagini catalogo.
 * Re-export client-safe da `@/lib/image-url`.
 */
export { IMAGE_BASE, imageUrl } from "@/lib/image-url";

/* ---------- helpers tree ---------- */

export interface FlatTreeLeaf {
  /** `personaggi/individuali/primari/fiamma` */
  pathKey: string;
  /** ultima parte del path */
  key: string;
  /** entity id risolto */
  entityId: string;
  /** depth (root = 0) */
  depth: number;
  /** parent path key (vuoto per root) */
  parentKey: string;
}

export interface FlatTreeBranch {
  pathKey: string;
  key: string;
  depth: number;
  parentKey: string;
  childrenKeys: string[];
}

/**
 * Estrae tutti gli id-entità ordinati per attraversamento depth-first del tree.
 * Utile per i prev/next eventuali, e per debug.
 */
export function flattenTreeLeaves(tree: Tree): FlatTreeLeaf[] {
  const out: FlatTreeLeaf[] = [];
  const walk = (
    nodes: Record<string, TreeNode>,
    parents: string[],
    depth: number,
  ) => {
    for (const [key, node] of Object.entries(nodes)) {
      const pathKey = [...parents, key].join("/");
      if (node._entity_id) {
        out.push({
          pathKey,
          key,
          entityId: node._entity_id,
          depth,
          parentKey: parents.join("/"),
        });
      }
      if (node._children) {
        walk(node._children, [...parents, key], depth + 1);
      }
    }
  };
  walk(tree, [], 0);
  return out;
}
