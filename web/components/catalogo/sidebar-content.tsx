"use client";

import * as React from "react";
import Link from "next/link";
import { Map as MapIcon, BookOpen, Compass } from "lucide-react";

import type { Tree } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SearchBox } from "@/components/catalogo/search-box";
import { SidebarTree } from "@/components/catalogo/sidebar-tree";
import { PROJECT_CONFIG } from "@/lib/project-config";

interface SidebarContentProps {
  tree: Tree;
  totalEntities: number;
}

export function SidebarContent({ tree, totalEntities }: SidebarContentProps) {
  const [query, setQuery] = React.useState("");
  const { hasStrade, hasMappa } = PROJECT_CONFIG;
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-rule-soft px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <Link
            href="/catalogo"
            className="font-serif text-lg font-semibold text-ink hover:text-accent"
          >
            Catalogo
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {totalEntities} entità
          </Badge>
        </div>
        <SearchBox value={query} onChange={setQuery} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <SidebarTree tree={tree} query={query} />
      </div>

      <div className="border-t border-rule-soft p-4 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          Altre viste
        </p>
        <div className="space-y-1">
          <SideLink href="/orchestra" icon={Compass} label="Atlante saga" />
          <SideLink href="/storie" icon={BookOpen} label="Unità narrative" />
          {hasStrade && <SideLink href="/strade" icon={MapIcon} label="Indice strade" />}
          {hasMappa && <SideLink href="/mappa" icon={Compass} label="Mappa" />}
        </div>
        <Separator className="my-2" />
        <Link
          href="/"
          className="font-mono text-[11px] text-ink-faint hover:text-accent"
        >
          ← Home cruscotto
        </Link>
      </div>
    </div>
  );
}

function SideLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-soft hover:bg-rule-soft/40 hover:text-ink"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
