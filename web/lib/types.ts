// Tipi TS per il catalogo entità.
// Derivati dallo schema reale di catalogo_web/data/entities.json.
//
// La forma è grezza ma stabile: usiamo `unknown` dove la tipologia varia
// (frontmatter heterogeneo) e tipi stretti dove è importante (immagini,
// famiglia, status, tree).

export type EntityFamiglia =
  | "personaggio"
  | "luogo"
  | "oggetto"
  | "vento"
  | "visual_signature";

export type EntityStatus = "canonico" | "provvisorio" | string;

export interface EntityImage {
  filename: string;
  /**
   * Path relativo alla root del repo, es.
   * `visual/personaggi/individuali/primari/forno/immagini/forno_canonica_v1_x.jpg`.
   * NON è un URL pubblico: ricostruisci con NEXT_PUBLIC_IMAGE_BASE.
   */
  path: string;
  size_kb?: number;
}

/**
 * Frontmatter è eterogeneo (varia per famiglia/sottotipo). Lo trattiamo come
 * record opaco e accediamo ai campi noti con narrowing locale.
 */
export type EntityFrontmatter = Record<string, unknown>;

export interface Entity {
  id: string;
  name: string;
  famiglia: EntityFamiglia;
  sottotipo: string | null;
  status: EntityStatus;
  quartiere: string | null;
  categoria_strada: string | null;
  frontmatter: EntityFrontmatter;
  body_md: string;
  body_size_chars: number;
  prompt_grok_md: string;
  has_prompt_grok: boolean;
  folder_path: string;
  scheda_path: string;
  breadcrumb: string[];
  images: EntityImage[];
  n_images: number;
}

/**
 * Nodo dell'albero gerarchico:
 *   - può essere un "container" (solo `_children`)
 *   - può essere una "foglia entità" (con `_entity_id` + `_entity_meta`)
 *   - può essere entrambi (raro: foglia con sotto-elementi).
 */
export interface TreeEntityMeta {
  name: string;
  famiglia: EntityFamiglia;
  sottotipo: string | null;
  status: EntityStatus;
  n_images: number;
  folder_path: string;
}

export interface TreeNode {
  _children?: Record<string, TreeNode>;
  _entity_id?: string;
  _entity_meta?: TreeEntityMeta;
}

export type Tree = Record<string, TreeNode>;

export interface Totals {
  totale: number;
  luogo: number;
  oggetto: number;
  personaggio: number;
  vento: number;
  visual_signature: number;
}

export interface ByStatus {
  canonico: number;
  provvisorio: number;
  [k: string]: number;
}

export interface AuxData {
  strade_index_md?: string;
  catalogo_md?: string;
}

export interface EntitiesData {
  generated_at: string;
  totals: Totals;
  by_status: ByStatus;
  tree: Tree;
  entities: Entity[];
  aux: AuxData;
}

/** Ordine canonico per il featured grid e per la sidebar. */
export const FAMIGLIA_ORDER: EntityFamiglia[] = [
  "personaggio",
  "luogo",
  "oggetto",
  "vento",
  "visual_signature",
];

export const FAMIGLIA_LABEL: Record<EntityFamiglia, string> = {
  personaggio: "Personaggi",
  luogo: "Luoghi",
  oggetto: "Oggetti",
  vento: "Venti",
  visual_signature: "Visual signatures",
};

export const FAMIGLIA_LABEL_SINGOLARE: Record<EntityFamiglia, string> = {
  personaggio: "Personaggio",
  luogo: "Luogo",
  oggetto: "Oggetto",
  vento: "Vento",
  visual_signature: "Visual signature",
};
