/**
 * project-config.ts — Configurazione del progetto narrativo adottante.
 *
 * **PROJECT**: questo è il file principale che il progetto reale modifica
 * adottando il kit. Tutte le decisioni autoriali "di vetrina" (titolo,
 * sottotitolo, sezioni attive nella UI) vivono qui.
 *
 * Mantieni questo file separato dal resto della logica della UI per evitare
 * di propagare modifiche specifiche al progetto in altri punti del kit.
 */

export interface ProjectConfig {
  /** Titolo del progetto come compare in homepage e metadata. */
  title: string;
  /** Sottotitolo / descrizione breve. */
  subtitle: string;
  /** Description metadata. */
  description: string;
  /** Lingua (per <html lang>). */
  language: string;

  /** Numero unità narrative attese (per validazioni soft, opzionale). */
  expectedUnitsCount: number | null;

  /** Sezione "mappa" attiva? Disabilita se il progetto non ha cartografia. */
  hasMappa: boolean;
  /** Sezione "strade" attiva? Disabilita se il progetto non ha percorsi. */
  hasStrade: boolean;
  /** Path immagine base per la mappa (relativo a public/), se hasMappa=true. */
  mappaBaseImagePath: string | null;
  /** Aspect ratio della mappa (es. "1640 / 1300") se hasMappa=true. */
  mappaAspectRatio: string | null;

  /** Asse delle unità narrative: come sono organizzate strutturalmente. */
  unitAxis: {
    /** Etichetta del campo "stagione" / "tempo" se progetto la usa. */
    seasonLabel: string | null;
    /** Etichetta del campo "ciclo" / "blocco" / "atto" se progetto lo usa. */
    cycleLabel: string | null;
    /** Etichetta del campo "atmosfera dominante" / "vento" / equivalente. */
    atmosphereLabel: string | null;
  };

  /** CDN immagini esterno (opzionale). */
  imageBaseFallback: string | null;
}

/**
 * **PROJECT**: modifica questi valori per il tuo progetto.
 *
 * Esempio per un progetto generico privo di cartografia e privo di cicli:
 *   {
 *     title: "Il Mio Progetto",
 *     subtitle: "Cruscotto editoriale",
 *     hasMappa: false,
 *     hasStrade: false,
 *     ...
 *   }
 */
export const PROJECT_CONFIG: ProjectConfig = {
  title: "L'Ombra del Vesper",
  subtitle: "Dark romance — Dante Ravencroft & Aurora Winters",
  description:
    "Cruscotto editoriale de L'Ombra del Vesper — catalogo entità, atlante saga, pipeline narrativa.",
  language: "it",

  expectedUnitsCount: 20,

  hasMappa: false,
  hasStrade: false,
  mappaBaseImagePath: null,
  mappaAspectRatio: null,

  unitAxis: {
    seasonLabel: null,
    cycleLabel: "Movimento",
    atmosphereLabel: null,
  },

  imageBaseFallback: null,
};
