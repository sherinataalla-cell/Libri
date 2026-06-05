"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import type { EntityFrontmatter } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FrontmatterBlockProps {
  frontmatter: EntityFrontmatter;
}

/**
 * Frontmatter YAML del header scheda — collassabile, default chiuso.
 * Mostriamo come pre formattato JSON-like (più leggibile dell'YAML grezzo
 * e già normalizzato dal pipeline).
 */
export function FrontmatterBlock({ frontmatter }: FrontmatterBlockProps) {
  const [open, setOpen] = React.useState(false);

  const formatted = React.useMemo(() => {
    try {
      return JSON.stringify(frontmatter, null, 2);
    } catch {
      return String(frontmatter);
    }
  }, [frontmatter]);

  const keyCount = Object.keys(frontmatter).length;

  return (
    <section aria-label="Frontmatter" className="rounded-md border border-rule-soft bg-paper-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-rule-soft/30 rounded-md"
      >
        <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
          Frontmatter ({keyCount} cam{keyCount === 1 ? "po" : "pi"})
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 shrink-0 transition-transform text-ink-faint",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <pre className="overflow-x-auto border-t border-rule-soft px-4 py-3 font-mono text-xs leading-relaxed text-ink-soft">
          {formatted}
        </pre>
      )}
    </section>
  );
}
