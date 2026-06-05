// Riga audit di una entità (personaggio / luogo / oggetto).
// Mostra: status dot (img / prompt / missing), id, kind, flags (scheda /
// prompt / N img), tag offscreen opz., link → scheda catalogo, thumbnails.
// Server component.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  AuditedEntity,
  EntityKind,
} from "@/lib/types-storie-dashboard";
import { EntityThumbnail } from "@/components/storie-dashboard/entity-thumbnail";

interface EntityRowProps {
  /** id entità (es. `fiamma`, `forno`, `pagnotta_forno`). */
  id: string;
  kind: EntityKind;
  /**
   * Audit per questa entità — può essere `undefined` se l'id è citato
   * dall'hook ma manca dal repo (mostriamo "non trovato").
   */
  audit: AuditedEntity | undefined;
  /** Variante location opzionale (es. interno/esterno). */
  variantNote?: string;
  /** Tag visivo "offscreen" per cammei / sagome / sonori. */
  isOffscreen?: boolean;
}

const DOT_TITLE: Record<"ok" | "warn" | "missing", string> = {
  ok: "img canoniche presenti",
  warn: "prompt grok presente, immagini mancanti",
  missing: "scheda incompleta",
};

export function EntityRow({
  id,
  kind,
  audit,
  variantNote,
  isOffscreen,
}: EntityRowProps) {
  const found = !!audit?.found;
  const nImages = audit?.n_images ?? 0;
  const dot: "ok" | "warn" | "missing" =
    nImages > 0 ? "ok" : audit?.prompt_grok ? "warn" : "missing";

  return (
    <div
      className={cn(
        "rounded-md border-l-2 border-rule-soft bg-paper-soft/50 px-3 py-2",
        dot === "ok" && "border-l-accent",
        dot === "warn" && "border-l-accent-warm",
        dot === "missing" && "border-l-rule",
        !found && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          aria-hidden
          title={DOT_TITLE[dot]}
          className={cn(
            "inline-block h-2.5 w-2.5 shrink-0 rounded-full",
            dot === "ok" && "bg-accent",
            dot === "warn" && "bg-accent-warm",
            dot === "missing" && "bg-rule",
          )}
        />
        <code className="font-mono text-sm text-ink">{id}</code>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          {kind}
        </span>
        {variantNote && (
          <span className="font-mono text-[10px] text-ink-faint">
            [variante: {variantNote}]
          </span>
        )}
        {isOffscreen && (
          <span className="rounded-full border border-rule-soft bg-paper px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-soft">
            offscreen
          </span>
        )}

        <span className="ml-auto flex flex-wrap items-center gap-1">
          {audit?.scheda && <Flag tone="ok">scheda</Flag>}
          {audit?.prompt_grok && <Flag tone="ok">prompt</Flag>}
          <Flag tone={nImages > 0 ? "ok" : "warn"}>{nImages} img</Flag>
          {found ? (
            <Link
              href={`/catalogo/${encodeURIComponent(id)}`}
              className="inline-flex items-center gap-0.5 rounded-md border border-rule-soft px-1.5 py-0.5 font-mono text-[10px] text-ink-soft hover:border-accent/40 hover:text-accent"
            >
              scheda <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          ) : (
            <span className="font-mono text-[10px] italic text-ink-faint">
              non trovato in repo
            </span>
          )}
        </span>
      </div>

      {audit?.image_paths && audit.image_paths.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {audit.image_paths.slice(0, 4).map((p) => (
            <EntityThumbnail key={p} relPath={p} alt={id} />
          ))}
        </div>
      )}
    </div>
  );
}

function Flag({
  tone,
  children,
}: {
  tone: "ok" | "warn";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        tone === "ok" && "bg-accent/15 text-accent",
        tone === "warn" && "bg-accent-warm/15 text-accent-warm",
      )}
    >
      {children}
    </span>
  );
}
