"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { renderInlineHtml } from "@/lib/markdown";

interface PromptGrokBlockProps {
  promptMd: string;
}

export function PromptGrokBlock({ promptMd }: PromptGrokBlockProps) {
  const [open, setOpen] = React.useState(false);
  const html = React.useMemo(() => renderInlineHtml(promptMd), [promptMd]);

  return (
    <section
      aria-label="Prompt Grok"
      className="rounded-md border border-rule-soft bg-paper-soft"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-rule-soft/30 rounded-md"
      >
        <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
          Prompt Grok
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
        <div
          className="prose-saga border-t border-rule-soft px-4 py-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </section>
  );
}
