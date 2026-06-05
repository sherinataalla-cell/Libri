// Header server-component dell'atlante saga.

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface HeaderOrchestraProps {
  graphVersion: string | null;
  schemaVersion: number | string | null;
  storiesCount: number;
  charactersCount: number;
  locationsCount: number;
  seedsCount: number;
}

export function HeaderOrchestra({
  graphVersion,
  schemaVersion,
  storiesCount,
  charactersCount,
  locationsCount,
  seedsCount,
}: HeaderOrchestraProps) {
  return (
    <header className="space-y-3 border-b border-rule-soft pb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-accent"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Home cruscotto
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-warm">
            <Compass className="h-5 w-5" aria-hidden />
            <span className="font-mono text-xs uppercase tracking-wider">
              Orchestra · atlante saga
            </span>
          </div>
          <h1 className="font-serif font-semibold text-3xl tracking-tight text-ink">
            Atlante saga
          </h1>
          <p className="font-serif italic text-base text-ink-soft max-w-2xl">
            Vista a tre tracce sull&apos;asse temporale s01..s12: storie con i
            loro semi piantati e fioriti, presenze personaggi, presenze luoghi.
            Click su un nodo per il dettaglio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {graphVersion && (
            <Badge variant="secondary" className="font-mono">
              grafo v{graphVersion}
            </Badge>
          )}
          {schemaVersion && (
            <Badge variant="outline" className="font-mono">
              schema {schemaVersion}
            </Badge>
          )}
          <Badge variant="warm" className="font-mono">
            {storiesCount} storie
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {charactersCount} pers · {locationsCount} luoghi · {seedsCount} semi
          </Badge>
        </div>
      </div>
    </header>
  );
}
