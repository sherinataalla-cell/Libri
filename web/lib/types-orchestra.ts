// Tipi TS per l'atlante saga (vista Orchestra).
// Specchiano il payload di `public/data/orchestra.json` generato da
// `scripts/build-orchestra-data.mjs`.

export type Season = "inverno" | "primavera" | "estate" | "autunno";
export type Cycle = "A" | "B" | "C" | "D";
export type Block = "apertura" | "centro" | "chiusura";
export type LocationVisualType =
  | "abitato"
  | "alto"
  | "costa"
  | "acqua"
  | "selvatico";

export const SEASON_ORDER: readonly Season[] = [
  "inverno",
  "primavera",
  "estate",
  "autunno",
] as const;

export const CYCLE_LABEL: Readonly<Record<Cycle, string>> = {
  A: "Ciclo A",
  B: "Ciclo B",
  C: "Ciclo C",
  D: "Ciclo D",
};

export const SEASON_LABEL: Readonly<Record<Season, string>> = {
  inverno: "Inverno",
  primavera: "Primavera",
  estate: "Estate",
  autunno: "Autunno",
};

export const BLOCK_LABEL: Readonly<Record<Block, string>> = {
  apertura: "Apertura",
  centro: "Centro",
  chiusura: "Chiusura",
};

export const LOCATION_TYPE_LABEL: Readonly<Record<LocationVisualType, string>> =
  {
    abitato: "Abitato",
    alto: "Alto",
    costa: "Costa",
    acqua: "Acqua",
    selvatico: "Selvatico",
  };

export interface OrchestraFear {
  brother: string | null;
  fear_id: string | null;
  status: string | null;
  mode_of_touch: string | null;
}

export interface OrchestraStory {
  sid: string;
  title: string;
  season: Season | null;
  cycle: Cycle | null;
  block: Block | null;
  wind: string | null;
  premise: string | null;
  fear: OrchestraFear | null;
  location_id: string | null;
  character_ids: string[];
  seeds_planted_ids: string[];
  seeds_bloomed_ids: string[];
  seeds_planted_count: number;
  seeds_bloomed_count: number;
  debts_opened_count: number;
  debts_closed_count: number;
  callbacks_count: number;
}

export interface OrchestraCharacter {
  id: string;
  name: string;
  role: string | null;
  species: string | null;
  age_band: string | null;
  appearances: string[];
}

export interface OrchestraLocation {
  id: string;
  name: string;
  type: LocationVisualType;
  raw_type: string | null;
  quadrant: string | null;
  role_saga: string | null;
  appearances: string[];
}

export interface OrchestraSeed {
  id: string;
  description: string | null;
  planted: string | null;
  bloom_targets: string[];
  type: string | null;
  bloom_type: string | null;
  status: string | null;
}

export interface OrchestraData {
  generated_at: string;
  graph_version: string | null;
  schema_version: number | string | null;
  stories: OrchestraStory[];
  characters: OrchestraCharacter[];
  locations: OrchestraLocation[];
  seeds: OrchestraSeed[];
}

export type OrchestraSelectionKind =
  | "story"
  | "character"
  | "location"
  | "seed";

export interface OrchestraSelection {
  kind: OrchestraSelectionKind;
  id: string;
}

export const SELECTION_HASH_PREFIX: Readonly<
  Record<OrchestraSelectionKind, string>
> = {
  story: "#/story/",
  character: "#/character/",
  location: "#/location/",
  seed: "#/seed/",
};
