// Tipi TS per le 12 storie del libro (output di scripts/build-storie.mjs).

/** Frontmatter YAML di una storia — eterogeneo (sid, title, cycle, status, ...). */
export type StoryFrontmatter = Record<string, unknown>;

/** Hook narrativo (1..10 per storia). */
export interface StoryHook {
  /** id univoco hook narrativo (sNN_hMM). */
  id: string;
  /** numero hook (1..10) — non è la pagina libro fisica. */
  page: number;
  /** id dei subhook dichiarati dal marker `@hook ... @subhooks`. */
  subhookIds: string[];
}

/**
 * Pagina libro fisica. Una pagina = un subhook OPPURE, per le storie ancora
 * non scomposte in subhook, una pagina = un hook (fallback).
 */
export interface StoryPage {
  /** id subhook (sNN_hMMx) oppure null se la storia non è scomposta. */
  subhookId: string | null;
  /** id hook genitore (sNN_hMM). */
  hookId: string;
  /**
   * Numero pagina libro fisica. In norma `number`. Per spread doppia
   * documentata come `[N, N+1]` resta stringa (`"[2, 3]"`) — raro.
   */
  pageBook: number | string;
  /** Layout opzionale, es. "double_spread". */
  layout: string | null;
  /**
   * Path relativo della scena composta (vedi `pipeline_narrativa/storie_finali/_scene/`).
   * `null` se l'immagine non è ancora stata generata (marker `TBD`).
   */
  imagePath: string | null;
  /** Prosa markdown della pagina. */
  prosaMd: string;
}

export interface Story {
  sid: string;
  title: string;
  slug: string;
  frontmatter: StoryFrontmatter;
  /**
   * Numero pagine libro fisiche dichiarate (`book_pages_total` se presente,
   * altrimenti `total_pages`, default 10).
   */
  totalPages: number;
  hooks: StoryHook[];
  pages: StoryPage[];
}

export interface StorieData {
  generated_at: string;
  stories: Story[];
}

/** Etichette ciclo saga. */
export const CYCLE_LABEL: Record<string, string> = {
  A: "Ciclo A",
  B: "Ciclo B",
  C: "Ciclo C",
  D: "Ciclo D",
};
