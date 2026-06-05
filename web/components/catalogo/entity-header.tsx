import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Entity } from "@/lib/types";
import { FAMIGLIA_LABEL_SINGOLARE } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface EntityHeaderProps {
  entity: Entity;
}

export function EntityHeader({ entity }: EntityHeaderProps) {
  return (
    <header className="space-y-4 border-b border-rule-soft pb-6">
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Torna al catalogo
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
          {entity.name}
        </h1>
        <p className="font-mono text-xs text-ink-faint break-all">
          {entity.id}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{FAMIGLIA_LABEL_SINGOLARE[entity.famiglia]}</Badge>
        {entity.sottotipo && <Badge variant="outline">{entity.sottotipo}</Badge>}
        {entity.quartiere && (
          <Badge variant="warm">quartiere {entity.quartiere}</Badge>
        )}
        <Badge
          variant={entity.status === "canonico" ? "canonico" : "provvisorio"}
        >
          {entity.status}
        </Badge>
        {entity.n_images > 0 && (
          <Badge variant="secondary">
            {entity.n_images} immagin{entity.n_images === 1 ? "e" : "i"}
          </Badge>
        )}
      </div>

      <p className="font-mono text-[11px] text-ink-faint break-all">
        {entity.scheda_path}
      </p>
    </header>
  );
}
