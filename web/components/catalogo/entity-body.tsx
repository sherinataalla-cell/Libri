"use client";

import * as React from "react";
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from "lucide-react";

import type { MarkdownSection } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EntityBodyProps {
  preambleHtml: string;
  sections: MarkdownSection[];
}

/**
 * Body markdown: preambolo aperto + sezioni `##` collassabili (default chiuse).
 * Toolbar in cima con Espandi tutto / Comprimi tutto.
 */
export function EntityBody({ preambleHtml, sections }: EntityBodyProps) {
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});

  const allOpen =
    sections.length > 0 && sections.every((s) => openMap[s.id] === true);
  const allClosed =
    sections.length > 0 && sections.every((s) => !openMap[s.id]);

  function expandAll() {
    const next: Record<string, boolean> = {};
    for (const s of sections) next[s.id] = true;
    setOpenMap(next);
  }

  function collapseAll() {
    setOpenMap({});
  }

  function toggle(id: string) {
    setOpenMap((m) => ({ ...m, [id]: !m[id] }));
  }

  return (
    <section aria-label="Scheda" className="space-y-4">
      {preambleHtml && (
        <div
          className="prose-saga"
          dangerouslySetInnerHTML={{ __html: preambleHtml }}
        />
      )}

      {sections.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-2 border-b border-rule-soft pb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              {sections.length} sezion{sections.length === 1 ? "e" : "i"}
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={expandAll}
                disabled={allOpen}
                className="font-mono text-xs"
              >
                <ChevronsUpDown className="h-3.5 w-3.5" />
                Espandi tutto
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={collapseAll}
                disabled={allClosed}
                className="font-mono text-xs"
              >
                <ChevronsDownUp className="h-3.5 w-3.5" />
                Comprimi tutto
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {sections.map((s) => (
              <SectionCollapsible
                key={s.id}
                section={s}
                open={!!openMap[s.id]}
                onToggle={() => toggle(s.id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

interface SectionCollapsibleProps {
  section: MarkdownSection;
  open: boolean;
  onToggle: () => void;
}

function SectionCollapsible({
  section,
  open,
  onToggle,
}: SectionCollapsibleProps) {
  return (
    <div className="rounded-md border border-rule-soft bg-paper-soft">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`section-body-${section.id}`}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-rule-soft/30 rounded-md"
      >
        <h2 className="font-serif text-lg font-semibold text-ink truncate">
          {section.title}
        </h2>
        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div
          id={`section-body-${section.id}`}
          className="prose-saga border-t border-rule-soft px-4 py-4"
          dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
        />
      )}
    </div>
  );
}
