"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import type { Entity, EntityFamiglia } from "@/lib/types";
import { FAMIGLIA_LABEL_SINGOLARE, FAMIGLIA_ORDER } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { imageUrl } from "@/lib/image-url";
import { SearchBox } from "@/components/catalogo/search-box";

interface FeaturedGridProps {
  entities: Entity[];
}

const FAMIGLIA_LABEL_PLURALE: Record<EntityFamiglia, string> = {
  personaggio: "Personaggi",
  luogo: "Luoghi",
  oggetto: "Oggetti",
  vento: "Venti",
  visual_signature: "Signatures",
};

/**
 * Griglia delle entità del catalogo con filtri:
 *  - search nome/id/famiglia/sottotipo
 *  - chip multi-select famiglia
 *  - sub-filter dinamico (sottotipo per personaggi, quartiere per luoghi)
 *    visibile quando esattamente 1 famiglia è selezionata
 *  - toggle "solo con immagini" (default ON, era il comportamento precedente)
 *  - toggle "solo canoniche"
 */
export function FeaturedGrid({ entities }: FeaturedGridProps) {
  const [query, setQuery] = React.useState("");
  const [familyFilter, setFamilyFilter] = React.useState<Set<EntityFamiglia>>(
    new Set(),
  );
  const [subFilter, setSubFilter] = React.useState<Set<string>>(new Set());
  const [onlyWithImages, setOnlyWithImages] = React.useState(true);
  const [onlyCanonical, setOnlyCanonical] = React.useState(false);

  // Reset sub-filter quando cambia la family (sottotipi/quartieri non condivisi).
  React.useEffect(() => {
    setSubFilter(new Set());
  }, [familyFilter]);

  const sorted = React.useMemo(() => sortAll(entities), [entities]);

  const subOptions = React.useMemo<{
    kind: "sottotipo" | "quartiere" | null;
    values: string[];
  }>(() => {
    if (familyFilter.size !== 1) return { kind: null, values: [] };
    const fam = Array.from(familyFilter)[0];
    if (fam === "personaggio") {
      const set = new Set<string>();
      for (const e of entities) {
        if (e.famiglia === "personaggio" && e.sottotipo) set.add(e.sottotipo);
      }
      return { kind: "sottotipo", values: Array.from(set).sort() };
    }
    if (fam === "luogo") {
      const set = new Set<string>();
      for (const e of entities) {
        if (e.famiglia === "luogo" && e.quartiere) set.add(e.quartiere);
      }
      return { kind: "quartiere", values: Array.from(set).sort() };
    }
    return { kind: null, values: [] };
  }, [entities, familyFilter]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((e) => {
      if (onlyWithImages && e.n_images === 0) return false;
      if (onlyCanonical && e.status !== "canonico") return false;
      if (familyFilter.size > 0 && !familyFilter.has(e.famiglia)) return false;
      if (subFilter.size > 0) {
        if (subOptions.kind === "sottotipo") {
          if (!e.sottotipo || !subFilter.has(e.sottotipo)) return false;
        } else if (subOptions.kind === "quartiere") {
          if (!e.quartiere || !subFilter.has(e.quartiere)) return false;
        }
      }
      if (q) {
        const hay = [
          e.id,
          e.name,
          e.famiglia,
          e.sottotipo ?? "",
          e.quartiere ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    sorted,
    query,
    familyFilter,
    subFilter,
    subOptions.kind,
    onlyCanonical,
    onlyWithImages,
  ]);

  function toggleFamily(f: EntityFamiglia) {
    setFamilyFilter((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  function toggleSub(v: string) {
    setSubFilter((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  }

  function clearAllFilters() {
    setQuery("");
    setFamilyFilter(new Set());
    setSubFilter(new Set());
    setOnlyCanonical(false);
    setOnlyWithImages(true);
  }

  const hasActiveFilters =
    query.length > 0 ||
    familyFilter.size > 0 ||
    subFilter.size > 0 ||
    onlyCanonical ||
    !onlyWithImages;

  return (
    <section aria-label="Schede catalogo" className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Schede catalogo
          </h2>
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Cerca per nome o id…"
            className="w-full sm:w-72"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mr-1">
            Famiglia:
          </span>
          {FAMIGLIA_ORDER.map((f) => (
            <FilterChip
              key={f}
              active={familyFilter.has(f)}
              onClick={() => toggleFamily(f)}
            >
              {FAMIGLIA_LABEL_PLURALE[f]}
            </FilterChip>
          ))}
        </div>

        {subOptions.values.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mr-1">
              {subOptions.kind === "sottotipo" ? "Tipo:" : "Quartiere:"}
            </span>
            {subOptions.values.map((v) => (
              <FilterChip
                key={v}
                active={subFilter.has(v)}
                onClick={() => toggleSub(v)}
              >
                {humanize(v)}
              </FilterChip>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-rule accent-accent"
              checked={onlyWithImages}
              onChange={(e) => setOnlyWithImages(e.target.checked)}
            />
            <span className="font-mono text-xs text-ink-soft">
              Solo con immagini
            </span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-rule accent-accent"
              checked={onlyCanonical}
              onChange={(e) => setOnlyCanonical(e.target.checked)}
            />
            <span className="font-mono text-xs text-ink-soft">
              Solo canoniche
            </span>
          </label>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-auto font-mono text-[11px] text-ink-faint underline underline-offset-2 hover:text-accent"
            >
              Pulisci filtri
            </button>
          )}
        </div>

        <div className="border-t border-rule-soft pt-2 font-mono text-[11px] text-ink-faint">
          {filtered.length === 0
            ? "Nessun risultato"
            : filtered.length === 1
              ? "1 risultato"
              : `${filtered.length} risultati`}
          {sorted.length > filtered.length && (
            <span className="text-ink-faint/70">
              {" "}
              · su {sorted.length} totali
            </span>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-serif italic text-ink-faint">
          Nessuna scheda corrisponde ai filtri attivi.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((e) => (
            <li key={e.id}>
              <FeaturedCard entity={e} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-mono transition-colors",
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-rule bg-paper-soft text-ink-soft hover:border-accent/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function humanize(s: string): string {
  return s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function FeaturedCard({ entity }: { entity: Entity }) {
  const cover = entity.images[0];
  const url = cover ? imageUrl(cover.path) : null;
  return (
    <Link
      href={`/catalogo/${entity.id}`}
      className="group block overflow-hidden rounded-lg border border-rule-soft bg-paper-soft transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-square w-full bg-rule-soft/40">
        {url ? (
          <Image
            src={url}
            alt={entity.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-ink-faint font-mono text-xs">
            no image
          </div>
        )}
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
          <Badge
            variant={entity.status === "canonico" ? "canonico" : "provvisorio"}
          >
            {entity.status}
          </Badge>
          {entity.n_images > 1 && (
            <Badge variant="secondary" className="font-mono">
              {entity.n_images} img
            </Badge>
          )}
        </div>
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif text-base font-semibold text-ink truncate">
            {entity.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          <span>{FAMIGLIA_LABEL_SINGOLARE[entity.famiglia]}</span>
          {entity.sottotipo && (
            <>
              <span aria-hidden>·</span>
              <span className={cn("truncate")}>{entity.sottotipo}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function sortAll(entities: Entity[]): Entity[] {
  return entities.slice().sort((a, b) => {
    const fa = FAMIGLIA_ORDER.indexOf(a.famiglia as EntityFamiglia);
    const fb = FAMIGLIA_ORDER.indexOf(b.famiglia as EntityFamiglia);
    const fai = fa === -1 ? 999 : fa;
    const fbi = fb === -1 ? 999 : fb;
    if (fai !== fbi) return fai - fbi;
    return a.name.localeCompare(b.name, "it");
  });
}
