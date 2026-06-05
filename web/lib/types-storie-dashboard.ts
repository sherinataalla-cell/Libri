// Tipi TS per la dashboard di lavoro illustrazioni delle 12 storie.
// Sorgente: `public/data/storie-dashboard.json`, copiato dal catalogo statico
// (`catalogo_web/data/storie.json`, output di
// `scripts/build_storie_data.py`).
//
// NB: distinto da `lib/types-storie.ts`, che descrive la vista "pagine libro"
// (output di `scripts/build-storie.mjs`).

/** Stat aggregate per storia. */
export interface StoryStats {
  hooks_total: number;
  hooks_image_ready: number;
  chars_distinct: number;
  chars_with_imgs: number;
  locs_distinct: number;
  locs_with_prompt: number;
  locs_with_imgs: number;
  objs_distinct: number;
  objs_with_prompt?: number;
}

/** Audit di una entità (personaggio / luogo / oggetto) trovata nel repo. */
export interface AuditedEntity {
  found: boolean;
  id: string;
  /** Path repo della cartella entità (es. `visual/personaggi/.../<id>`). */
  path?: string;
  scheda?: boolean;
  prompt_grok?: boolean;
  /** Numero immagini canoniche presenti. */
  n_images?: number;
  /** Path relativi delle immagini canoniche (es. `visual/.../immagini/...jpg`). */
  image_paths?: string[];
}

/** Mappa id → audit, raggruppata per categoria. */
export interface AuditedEntities {
  personaggi: Record<string, AuditedEntity>;
  luoghi: Record<string, AuditedEntity>;
  oggetti: Record<string, AuditedEntity>;
}

/** Riferimento a una location dentro un hook (id + variante opzionale). */
export interface HookLocation {
  id: string;
  variant?: string;
}

/** Sotto-hook annotato (pagina libro fisica figlia di un hook narrativo). */
export interface SubhookAnnotated {
  id: string;
  page_book: number | string;
  text_split_marker?: string;
  /** "TBD" oppure path immagine, oppure altro stato testuale. */
  image_status?: string;
  note?: string;
}

/** Hook narrativo (10 per storia) — vista dashboard. */
export interface DashboardHook {
  hook_id: string;
  /** Numero hook narrativo (1..10). NON è la pagina libro fisica. */
  page: number;
  /** "TBD" oppure path immagine composta. */
  image: string | null;
  text_preview?: string;
  text_full?: string;
  /** "manual" se proviene da annotazioni Ray, "auto" se NER. */
  source?: string;
  location?: HookLocation;
  characters_in_scene?: string[];
  characters_offscreen_or_distant?: string[];
  objects_in_scene?: string[];
  canonical_details?: string[];
  subhooks_annotated?: SubhookAnnotated[];
  subhooks_declared_in_marker?: string[];
  subhooks_inline?: string[];
}

/** Singola voce della todo list "aggiunte da prosa al canone". */
export interface CanonAddition {
  /** Almeno uno fra location/object/character. */
  location?: string;
  object?: string;
  character?: string;
  note: string;
  priority?: "high" | "medium" | "low" | string;
}

/** Inventario testuale (contesto, opzionale — non renderizzato in dashboard). */
export interface StoryInventory {
  exists?: boolean;
  path?: string;
  github_url?: string;
  additions_summary?: unknown;
  gaps_summary?: unknown;
  todo_summary?: unknown;
}

/** Storia completa nella vista dashboard. */
export interface DashboardStory {
  sid: string;
  title: string;
  slug: string;
  cycle: string;
  total_pages?: number;
  total_hooks?: number;
  book_pages_total?: number;
  status?: string;
  ultima_modifica?: string;
  file_path?: string;
  github_url?: string;
  annotations_present: boolean;
  annotations_path?: string;
  annotations_github_url?: string;
  canon_additions_todo: CanonAddition[];
  stats: StoryStats;
  audited_entities: AuditedEntities;
  hooks: DashboardHook[];
  inventory?: StoryInventory;
}

/** Top-level del JSON dashboard. */
export interface StorieDashboardData {
  generated_from: string;
  saga_style_reference: string;
  n_storie: number;
  storie: DashboardStory[];
}

/** Categoria entità per render. */
export type EntityKind = "personaggio" | "luogo" | "oggetto";
